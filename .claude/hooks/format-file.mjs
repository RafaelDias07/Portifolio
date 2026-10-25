// Hook PostToolUse (Edit|Write): formata e checa com o Biome cada arquivo que a IA edita.
// Se sobrar erro que o Biome não corrige sozinho, exit 2 devolve o relatório para a IA.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8'))
const filePath = input.tool_input?.file_path

const CHECKED = /\.(ts|tsx|js|jsx|mjs|json|css)$/
const SKIPPED = /node_modules|[\\/]dist[\\/]|[\\/]src[\\/]games[\\/]/

if (!filePath || !CHECKED.test(filePath) || SKIPPED.test(filePath) || !existsSync(filePath)) {
  process.exit(0)
}

const result = spawnSync(
  'npx',
  ['biome', 'check', '--write', '--no-errors-on-unmatched', filePath],
  { cwd: input.cwd, encoding: 'utf8' },
)

if (result.status !== 0) {
  process.stderr.write(
    `Biome encontrou problemas em ${filePath}:\n${result.stdout}${result.stderr}`,
  )
  process.exit(2)
}
