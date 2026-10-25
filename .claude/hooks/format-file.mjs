// Hook PostToolUse (Edit|Write): formata e checa com o Biome cada arquivo que a IA edita.
// Se sobrar erro que o Biome não corrige sozinho, exit 2 devolve o relatório para a IA.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const input = JSON.parse(readFileSync(0, 'utf8'))
const filePath = input.tool_input?.file_path

// Raiz do repositório: o Claude Code informa em CLAUDE_PROJECT_DIR; sem ela, sobe duas pastas a partir deste arquivo
const projectRoot =
  process.env.CLAUDE_PROJECT_DIR ?? fileURLToPath(new URL('../..', import.meta.url))

const CHECKED = /\.(ts|tsx|js|jsx|mjs|json|css|md)$/
const SKIPPED = /node_modules|[\\/]dist[\\/]|[\\/]src[\\/]games[\\/]/

function isInsideProject(path) {
  const rel = relative(projectRoot, resolve(input.cwd ?? projectRoot, path))
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

if (
  !filePath ||
  !CHECKED.test(filePath) ||
  SKIPPED.test(filePath) ||
  !isInsideProject(filePath) ||
  !existsSync(filePath)
) {
  process.exit(0)
}

const result = spawnSync(
  'npx',
  ['biome', 'check', '--write', '--no-errors-on-unmatched', filePath],
  { cwd: projectRoot, encoding: 'utf8' },
)

if (result.status !== 0) {
  process.stderr.write(
    `Biome encontrou problemas em ${filePath}:\n${result.stdout}${result.stderr}`,
  )
  process.exit(2)
}
