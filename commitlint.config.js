// Conventional Commits: tipo(escopo opcional): descrição em português, no imperativo e em minúsculas
// Ex.: feat: adiciona validação do formulário de contato
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'kebab-case'],
  },
}
