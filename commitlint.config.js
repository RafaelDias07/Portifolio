// Conventional Commits: tipo(escopo opcional): descrição em português, no presente e em minúsculas
// Ex.: feat: adiciona validação do formulário de contato
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Título inteiro (tipo + escopo + descrição) com no máximo 72 caracteres
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'kebab-case'],
  },
}
