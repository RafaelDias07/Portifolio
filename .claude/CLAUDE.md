@../AGENTS.md

# Específico do Claude Code

O `AGENTS.md` (importado acima) é a fonte única de verdade do projeto. Este arquivo só acrescenta o que existe apenas no Claude Code. Se algo aqui parecer contradizer o `AGENTS.md`, o `AGENTS.md` vale e este arquivo deve ser corrigido.

## Hooks ativos (`.claude/settings.json`)

- **`guard-git`** (antes de todo comando Bash): bloqueia `git commit` na `main`, `--no-verify` e `git push --force`. Se ele bloquear, não tente contornar: crie a branch certa ou corrija a causa.
- **`format-file`** (depois de todo Edit/Write): roda o Biome no arquivo editado. Se ele devolver erros, corrija-os antes de seguir para o próximo arquivo.

## Permissões

- Liberados sem perguntar: scripts do `package.json`, Biome e comandos git de leitura e de branch.
- Negados: ler o `.env`, `git push --force` e `git reset --hard`. Não peça para liberar.

## Skills e agentes

| Quando                         | Use                     |
| ------------------------------ | ----------------------- |
| Vai commitar                   | skill `commit`          |
| Vai criar componente ou página | skill `novo-componente` |
| Terminou a etapa, antes do PR  | agente `revisor`        |

## Preview

Para ver o site, suba a configuração `dev` do `.claude/launch.json` e confira em 375 px e 1440 px de largura.
