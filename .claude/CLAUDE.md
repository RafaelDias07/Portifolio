@../AGENTS.md

# Específico do Claude Code

O `AGENTS.md` (importado acima) é a fonte única de verdade do projeto. Este arquivo só acrescenta o que existe apenas no Claude Code. Se algo aqui parecer contradizer o `AGENTS.md`, o `AGENTS.md` vale e este arquivo deve ser corrigido.

## Hooks ativos (`.claude/settings.json`)

- **`guard-bash`** (antes de todo comando Bash): bloqueia commit, merge e push na `main`; pular os hooks (`--no-verify`, `-n`, `HUSKY=0`, `core.hooksPath`); push forçado ou que apaga branch; comandos que descartam trabalho (`reset --hard`, `clean -f`, `checkout -- arquivo`, `restore` sem `--staged`, `branch -D`); ler ou copiar o `.env`. Se ele bloquear, **não tente contornar**: crie a branch certa ou corrija a causa. Se mudar o hook, rode `npm run test:hooks`.
- **`format-file`** (depois de todo Edit/Write): roda o Biome no arquivo editado. Se ele devolver erros, corrija-os antes de seguir para o próximo arquivo.

## Permissões

- Liberados sem perguntar: `npm run *`, `npm test`, `npx biome`, `git status`, `git diff`, `git log`, `git branch`, `git switch -c <nova>`, `git switch main` e `git add`.
- Negados: ler ou editar o `.env` e suas variações (`.env.local`, `.env.development`, `.env.production`, `.env.test`, `.env.*.local`). Não peça para liberar.
- Todo o resto pede confirmação, e os comandos perigosos são barrados pelo `guard-bash` mesmo com permissão.

## Skills e agentes

| Quando                         | Use                     |
| ------------------------------ | ----------------------- |
| Vai commitar                   | skill `commit`          |
| Vai criar componente ou página | skill `novo-componente` |
| Terminou a etapa, antes do PR  | agente `revisor`        |

## Preview

Para ver o site, suba a configuração `dev` do `.claude/launch.json` e confira em 375 px e 1440 px de largura.
