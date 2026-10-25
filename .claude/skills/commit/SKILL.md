---
name: commit
description: Cria commits no padrão do projeto (Conventional Commits em português, branch própria, hooks passando). Use sempre que for commitar mudanças.
---

# Commit no padrão do projeto

1. **Confira a branch.** Rode `git branch --show-current`. Se for `main`, pare e crie a branch da etapa (`git switch -c feature/<nome>`). O hook `guard-git` bloqueia commit na `main`.
   As regras completas de branches e commits estão na seção 6 do `AGENTS.md`.
2. **Veja o que mudou.** `git status` e `git diff`. Se houver mudanças de assuntos diferentes, separe em commits diferentes (`git add <arquivos>` só do assunto).
3. **Valide antes.** `npm run lint` e `npm run build` precisam passar. Se tiver testes da área, `npm test`.
4. **Escreva a mensagem** no formato Conventional Commits:

   ```
   <tipo>(<escopo opcional>): <o que muda, em português, no presente, minúsculas>

   <corpo opcional: por que mudou, em até 3 linhas>
   ```

   | Tipo                     | Quando                                         |
   | ------------------------ | ---------------------------------------------- |
   | `feat`                   | funcionalidade nova para quem usa o site       |
   | `fix`                    | correção de bug                                |
   | `refactor`               | muda o código sem mudar o comportamento        |
   | `style`                  | só formatação, sem lógica                      |
   | `perf`                   | melhora de desempenho                          |
   | `test`                   | adiciona ou ajusta testes                      |
   | `docs`                   | README, AGENTS.md, CLAUDE.md, documentação     |
   | `chore` / `build` / `ci` | configuração, dependências, pipeline           |

   Bons exemplos:
   - `feat: adiciona validação do formulário de contato`
   - `fix(rotas): corrige 404 ao atualizar /projetos/:slug`
   - `perf: carrega a cena 3d sob demanda`

   Evite: `update`, `ajustes`, `wip`, descrições em inglês, ponto final, mais de 72 caracteres no título.

5. **Commite** com `git commit -m "<título>" -m "<corpo>"`. Não adicione linhas `Co-Authored-By` nem assinatura de ferramenta de IA: os commits saem só com o autor do projeto.
6. **Se o hook falhar**, leia o erro, corrija (lint ou mensagem) e commite de novo. Nunca use `--no-verify`.
