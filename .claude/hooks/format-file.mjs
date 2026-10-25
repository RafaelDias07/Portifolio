// Hook PostToolUse (Edit|Write): formata e checa com o Biome cada arquivo que a IA edita.
// Se sobrar erro que o Biome não corrige sozinho, exit 2 devolve o relatório para a IA.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const input = JSON.parse(readFileSync(0, 'utf8'))
const filePath = input.tool_input?.file_path

// Raiz do repositório: o Claude Code informa em CLAUDE_PROJECT_DIR; sem ela, sobe duas pastas a partir deste arquivo
const projectRoot =
  process.env.CLAUDE_PROJECT_DIR ?? fileURLToPath(new URL('../..', import.meta.url))
const biomeBin = join(projectRoot, 'node_modules', '@biomejs', 'biome', 'bin', 'biome')

if (!filePath) process.exit(0)

const absolutePath = resolve(input.cwd ?? projectRoot, filePath)
const relativePath = relative(projectRoot, absolutePath)
const outsideProject =
  relativePath === '' || relativePath.startsWith('..') || isAbsolute(relativePath)

if (outsideProject || !existsSync(absolutePath)) process.exit(0)

if (!existsSync(biomeBin)) {
  process.stderr.write('Biome não encontrado em node_modules. Rode npm install.\n')
  process.exit(1)
}

// Quem decide o que checar é o próprio Biome: o files.includes do biome.json pula jogos, cena 3D e
// skills, e o --files-ignore-unknown pula tipos de arquivo que ele não conhece (png, gitkeep...).
const result = spawnSync(
  process.execPath,
  [
    biomeBin,
    'check',
    '--write',
    '--no-errors-on-unmatched',
    '--files-ignore-unknown=true',
    absolutePath,
  ],
  { cwd: projectRoot, encoding: 'utf8' },
)

if (result.error) {
  process.stderr.write(`Não consegui rodar o Biome: ${result.error.message}\n`)
  process.exit(1)
}

if (result.status !== 0) {
  process.stderr.write(
    `Biome encontrou problemas em ${relativePath}:\n${result.stdout ?? ''}${result.stderr ?? ''}`,
  )
  process.exit(2)
}
