// Hook PreToolUse (Bash): barra comandos que quebram o fluxo de git do projeto ou expõem segredos.
// Exit 2 bloqueia o comando e devolve o motivo para a IA corrigir o rumo.
//
// O comando é separado em partes de verdade (aspas, &&, ;, |, quebras de linha, $(...), bash -c,
// heredoc), então truques como `git -C . commit`, `HUSKY=0 git commit` ou `-nm` não passam.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'

const PROTECTED_BRANCH = 'main'
const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash'])
const PREFIX_COMMANDS = new Set([
  'env',
  'command',
  'builtin',
  'exec',
  'nohup',
  'time',
  'sudo',
  'xargs',
])
// Comandos que só citam o nome do arquivo, sem ler o conteúdo
const ENV_SAFE_COMMANDS = new Set(['echo', 'printf', 'ls', 'test', '[', 'stat'])
const GIT_ENV_READERS = new Set([
  'add',
  'show',
  'diff',
  'cat-file',
  'grep',
  'blame',
  'archive',
  'log',
])

class Blocked extends Error {}

function block(reason) {
  throw new Blocked(reason)
}

// ---------------------------------------------------------------------------
// Separação do comando em segmentos e palavras
// ---------------------------------------------------------------------------

// Heredoc: o corpo vira comando se for entregue a um shell (bash <<EOF); senão é texto e sai da análise
function expandHeredocs(command) {
  const lines = command.split('\n')
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/<<-?\s*(['"]?)([A-Za-z_][\w-]*)\1/)
    if (!match) {
      out.push(line)
      continue
    }
    const delimiter = match[2]
    const body = []
    let j = i + 1
    while (j < lines.length && lines[j].trim() !== delimiter) {
      body.push(lines[j])
      j++
    }
    const before = line.slice(0, match.index).trim().split(/\s+/)
    const feedsShell = SHELLS.has(basename(before[before.length - 1] ?? ''))
    out.push(line.replace(match[0], ''))
    if (feedsShell) out.push(...body)
    i = j
  }
  return out.join('\n')
}

function tokenize(command) {
  const segments = []
  let words = []
  let word = ''
  let hasWord = false
  let quote = null

  const endWord = () => {
    if (hasWord) words.push(word)
    word = ''
    hasWord = false
  }
  const endSegment = () => {
    endWord()
    if (words.length) segments.push(words)
    words = []
  }

  for (let i = 0; i < command.length; i++) {
    const ch = command[i]
    if (quote === "'") {
      if (ch === "'") quote = null
      else word += ch
      continue
    }
    if (quote === '"') {
      if (ch === '"') quote = null
      else if (ch === '\\' && i + 1 < command.length) word += command[++i]
      else word += ch
      continue
    }
    if (ch === "'" || ch === '"') {
      quote = ch
      hasWord = true
    } else if (ch === '\\' && i + 1 < command.length) {
      word += command[++i]
      hasWord = true
    } else if (/\s/.test(ch)) {
      if (ch === '\n') endSegment()
      else endWord()
    } else if (';&|()`'.includes(ch)) {
      endSegment()
    } else if (ch === '<' || ch === '>') {
      endWord()
    } else if (ch === '$' && command[i + 1] === '(') {
      endSegment()
    } else {
      word += ch
      hasWord = true
    }
  }
  endSegment()
  return segments
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

const ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/

// Reconhece o .env também em formas como --env-file=.env, file=@.env e HEAD:.env
function isEnvFile(word) {
  const path = word
    .replace(/^[\w-]*=/, '')
    .replace(/^@/, '')
    .replace(/^[^:/]*:/, '')
  const candidate = basename(path)
  return /^\.env(\.|\*|$)/.test(candidate) && candidate !== '.env.example'
}

function isNoVerify(word) {
  return word.length >= '--no-ver'.length && '--no-verify'.startsWith(word)
}

// Flags curtas agrupadas (-am, -nm, -uf). Para na primeira letra que recebe valor (ex.: m em -m).
// valueLetters: o valor pode vir colado ou no próximo argumento. attachedOnly: só colado (ex.: -S<chave>).
function shortFlags(args, valueLetters, attachedOnly = []) {
  const letters = new Set()
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--') break
    if (!/^-[A-Za-z]/.test(arg)) continue
    for (const letter of arg.slice(1)) {
      letters.add(letter)
      if (attachedOnly.includes(letter)) break
      if (valueLetters.includes(letter)) {
        if (arg.endsWith(letter)) i++
        break
      }
    }
  }
  return letters
}

function positionalArgs(args, valueOptions) {
  const result = []
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (valueOptions.includes(arg)) i++
    else if (!arg.startsWith('-')) result.push(arg)
  }
  return result
}

function currentBranch(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'branch', '--show-current'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null // não é um repositório: o próprio git vai falhar
  }
}

// ---------------------------------------------------------------------------
// Regras do git
// ---------------------------------------------------------------------------

const GLOBAL_FLAGS = new Set([
  '--no-pager',
  '-p',
  '--paginate',
  '-P',
  '--bare',
  '--no-replace-objects',
  '--literal-pathspecs',
  '--glob-pathspecs',
  '--noglob-pathspecs',
  '--icase-pathspecs',
  '--no-optional-locks',
  '--no-advice',
])
const GLOBAL_WITH_VALUE = ['--git-dir', '--work-tree', '--namespace', '--exec-path', '--config-env']

function parseGit(words, state) {
  let dir = state.cwd
  const configs = []
  let i = 1
  while (i < words.length) {
    const word = words[i]
    if (word === '-C') {
      dir = resolve(dir, words[i + 1] ?? '.')
      i += 2
    } else if (word.startsWith('-C')) {
      dir = resolve(dir, word.slice(2))
      i++
    } else if (word === '-c') {
      configs.push(words[i + 1] ?? '')
      i += 2
    } else if (word.startsWith('-c')) {
      configs.push(word.slice(2))
      i++
    } else if (GLOBAL_WITH_VALUE.some((option) => word.startsWith(option))) {
      configs.push(word)
      i += word.includes('=') ? 1 : 2
    } else if (GLOBAL_FLAGS.has(word)) {
      i++
    } else {
      break
    }
  }
  return { dir, configs, sub: words[i], args: words.slice(i + 1) }
}

function branchOf(git, state) {
  if (state.branches.has(git.dir)) return state.branches.get(git.dir)
  return currentBranch(git.dir)
}

function checkPush(git, branch) {
  const { args } = git
  for (const arg of args) {
    if (/^--(force|mirror|delete|prune|all)/.test(arg)) block(`git push ${arg} está bloqueado.`)
    if (isNoVerify(arg)) block('Não pule os hooks com --no-verify.')
  }
  const letters = shortFlags(args, ['o'])
  if (letters.has('f')) block('Push forçado (-f) está bloqueado.')
  if (letters.has('d')) block('Apagar branch remota (-d) está bloqueado.')

  const [, ...refspecs] = positionalArgs(args, ['-o', '--push-option', '--repo', '--receive-pack'])
  for (const refspec of refspecs) {
    if (refspec.startsWith('+')) block(`Refspec com + força o push (${refspec}).`)
    if (refspec.startsWith(':')) block(`Refspec ${refspec} apaga uma branch remota.`)
    const destination = (refspec.includes(':') ? refspec.split(':').pop() : refspec).replace(
      /^refs\/heads\//,
      '',
    )
    const source = refspec.includes(':') ? refspec.split(':')[0] : refspec
    if (destination === PROTECTED_BRANCH || (source === 'HEAD' && branch === PROTECTED_BRANCH)) {
      block(
        `Push para a ${PROTECTED_BRANCH} está bloqueado: ela só recebe mudanças por pull request.`,
      )
    }
  }
  if (refspecs.length === 0 && branch === PROTECTED_BRANCH) {
    block(
      `Push a partir da ${PROTECTED_BRANCH} está bloqueado: ela só recebe mudanças por pull request.`,
    )
  }
}

function checkGit(words, state) {
  const git = parseGit(words, state)
  const { sub, args } = git

  if (git.configs.some((config) => /core\.hookspath/i.test(config))) {
    block('Trocar o core.hooksPath desliga os hooks do Husky.')
  }
  if (!sub) return

  const branch = ['commit', 'merge', 'revert', 'cherry-pick', 'am', 'rebase', 'push'].includes(sub)
    ? branchOf(git, state)
    : null
  const onMain = branch === PROTECTED_BRANCH

  if (['commit', 'merge', 'push', 'am', 'rebase', 'cherry-pick', 'revert'].includes(sub)) {
    if (args.some(isNoVerify))
      block('Não pule os hooks com --no-verify. Corrija o lint ou a mensagem.')
  }

  switch (sub) {
    case 'commit': {
      if (shortFlags(args, ['m', 'F', 'C', 'c', 't'], ['S']).has('n')) {
        block('git commit -n pula os hooks. Corrija o lint ou a mensagem.')
      }
      if (onMain) {
        block(
          `Commit direto na ${PROTECTED_BRANCH} está bloqueado. Crie uma branch (git switch -c feature/nome).`,
        )
      }
      break
    }
    case 'merge':
    case 'revert':
    case 'cherry-pick':
    case 'am':
    case 'rebase':
      if (onMain) {
        block(
          `git ${sub} na ${PROTECTED_BRANCH} está bloqueado: ela só recebe mudanças por pull request.`,
        )
      }
      break
    case 'push':
      checkPush(git, branch)
      break
    case 'reset':
      if (args.some((arg) => ['--hard', '--merge', '--keep'].includes(arg))) {
        block('git reset --hard/--merge/--keep descarta trabalho e está bloqueado.')
      }
      break
    case 'clean':
      if (args.includes('--force') || shortFlags(args, ['e']).has('f')) {
        block('git clean -f apaga arquivos e está bloqueado.')
      }
      break
    case 'checkout':
      if (args.includes('--force') || shortFlags(args, ['b', 'B']).has('f')) {
        block('git checkout -f descarta alterações e está bloqueado.')
      }
      if (args.includes('--') || args.includes('.')) {
        block('git checkout em arquivos descarta alterações locais e está bloqueado.')
      }
      break
    case 'restore':
      if (!args.some((arg) => arg === '--staged' || /^-[A-Za-z]*S/.test(arg))) {
        block('git restore sem --staged descarta alterações locais e está bloqueado.')
      }
      break
    case 'switch':
      if (
        args.some((arg) => ['--force', '--discard-changes'].includes(arg)) ||
        shortFlags(args, ['c', 'C']).has('f')
      ) {
        block('git switch -f/--discard-changes descarta alterações e está bloqueado.')
      }
      break
    case 'branch':
      if (
        args.includes('--force') ||
        shortFlags(args, []).has('D') ||
        shortFlags(args, []).has('f')
      ) {
        block('git branch -D/-f está bloqueado. Use git branch -d depois do merge.')
      }
      break
    case 'add':
      if (args.includes('--force') || shortFlags(args, []).has('f')) {
        block('git add -f adiciona arquivos ignorados (como o .env) e está bloqueado.')
      }
      break
    case 'config':
      if (args.some((arg) => /core\.hookspath/i.test(arg))) {
        block('Mudar o core.hooksPath desliga os hooks do Husky.')
      }
      break
    case 'filter-branch':
    case 'filter-repo':
    case 'update-ref':
      block(`git ${sub} reescreve o histórico e está bloqueado.`)
      break
    default:
      break
  }

  if (GIT_ENV_READERS.has(sub) && args.some(isEnvFile)) {
    block('O .env tem segredos: o git não pode ler nem adicionar esse arquivo.')
  }

  // Lembra a troca de branch para os próximos segmentos do mesmo comando (ex.: git switch main && git commit)
  if (sub === 'switch' || sub === 'checkout') {
    const [target] = positionalArgs(args, ['-c', '-C', '-b', '-B', '--orphan'])
    const created = args.find((_arg, index) => ['-c', '-C', '-b', '-B'].includes(args[index - 1]))
    const next = created ?? target
    if (next) state.branches.set(git.dir, next)
  }
}

// ---------------------------------------------------------------------------
// Análise de cada segmento
// ---------------------------------------------------------------------------

function analyze(command, state, depth = 0) {
  if (depth > 5) block('Comando aninhado demais para analisar com segurança.')
  for (const segment of tokenize(expandHeredocs(command))) {
    let words = segment
    if (words.some((word) => /^HUSKY=0$/.test(word))) block('HUSKY=0 desliga os hooks do Husky.')

    while (words.length && (ASSIGNMENT.test(words[0]) || PREFIX_COMMANDS.has(words[0]))) {
      words = words.slice(1)
      while (words.length && /^-/.test(words[0])) words = words.slice(1)
    }
    if (!words.length) continue

    const program = basename(words[0])

    if (program === 'cd') {
      state.cwd = resolve(state.cwd, words[1] ?? process.env.HOME ?? state.cwd)
      continue
    }
    if (SHELLS.has(program)) {
      const flagIndex = words.findIndex(
        (word, index) => index > 0 && /^-[A-Za-z]*c[A-Za-z]*$/.test(word),
      )
      if (flagIndex > 0 && words[flagIndex + 1] !== undefined) {
        analyze(words[flagIndex + 1], state, depth + 1)
      }
      continue
    }
    if (program === 'eval') {
      analyze(words.slice(1).join(' '), state, depth + 1)
      continue
    }
    if (program === 'git') {
      checkGit(words, state)
      continue
    }
    if (!ENV_SAFE_COMMANDS.has(program) && words.slice(1).some(isEnvFile)) {
      block('O .env tem segredos e não pode ser lido nem copiado pela IA. Use o .env.example.')
    }
  }
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

const raw = readFileSync(0, 'utf8')
let command = ''
try {
  const input = JSON.parse(raw)
  command = input.tool_input?.command ?? ''
  analyze(command, { cwd: input.cwd ?? process.cwd(), branches: new Map() })
} catch (error) {
  if (error instanceof Blocked) {
    process.stderr.write(`Bloqueado pelo guard-bash: ${error.message}\n`)
    process.exit(2)
  }
  // Se a análise falhar num comando que mexe com git ou .env, falha fechado
  if (/\bgit\b|\.env/.test(command || raw)) {
    process.stderr.write(
      `Bloqueado pelo guard-bash: não consegui analisar o comando com segurança (${error.message}). Simplifique o comando.\n`,
    )
    process.exit(2)
  }
}
