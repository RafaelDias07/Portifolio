// Hook PreToolUse (Bash): barra comandos git que quebram o fluxo do projeto.
// Exit 2 bloqueia o comando e devolve a mensagem para a IA corrigir o rumo.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8'))
// Ignora o que está entre aspas (ex.: a mensagem do commit) para não dar falso positivo
const command = (input.tool_input?.command ?? '').replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""')

function block(message) {
  process.stderr.write(`${message}\n`)
  process.exit(2)
}

if (/\bgit\b[^|&;]*\s--no-verify\b/.test(command)) {
  block('Não use --no-verify. Se o hook de commit falhou, corrija o lint ou a mensagem.')
}

if (/\bgit\s+push\b[^|&;]*\s(--force|-f)\b/.test(command)) {
  block('Push forçado está bloqueado neste projeto.')
}

if (/\bgit\s+commit\b/.test(command)) {
  const branch = execSync('git branch --show-current', { cwd: input.cwd, encoding: 'utf8' }).trim()
  if (branch === 'main') {
    block(
      'Commit direto na main está bloqueado. Crie uma branch (ex.: git switch -c feature/nome) e abra um PR.',
    )
  }
}
