---

name: novo-componente
description: Cria um componente React no padrão do projeto (TypeScript, CSS Modules, lógica fora da apresentação). Use ao criar qualquer componente ou página nova.
---

# Novo componente

1. **Procure antes de criar.** Veja se já existe algo parecido em `src/components/ui/` ou `src/components/`. Se existir, reaproveite ou estenda com uma prop.
2. **Escolha o lugar:**
   - peça base usada em várias telas (botão, janela, card, spinner) → `src/components/ui/`
   - bloco de uma área específica (lista de projetos, formulário) → `src/components/`
   - tela de uma rota → `src/pages/`
3. **Crie os arquivos** com o mesmo nome em PascalCase:

   ```
   src/components/ui/Button.tsx
   src/components/ui/Button.module.css
   ```

4. **Estrutura do componente:**

   ```tsx
   import styles from './Button.module.css'

   type ButtonProps = {
     children: React.ReactNode
     variant?: 'primary' | 'secondary'
   } & React.ButtonHTMLAttributes<HTMLButtonElement>

   export function Button({ children, variant = 'primary', ...rest }: ButtonProps) {
     return (
       <button className={styles[variant]} {...rest}>
         {children}
       </button>
     )
   }
   ```

   - Props tipadas com `type <Nome>Props`.
   - Export nomeado (`export function`), sem `export default`.
   - Cores, fontes e espaçamentos vêm das variáveis CSS de `src/styles/global.css`.
   - Imports internos com `@/`.
5. **Sem lógica de dados no componente.** Se precisar buscar dados, crie a função em `src/services/` e um hook em `src/hooks/` (`useAlgumaCoisa`) que devolve `{ data, isLoading, error }`. O componente só usa o hook e trata os três estados: carregando, erro e vazio.
6. **Acessibilidade:** imagens com `alt`, botões com texto ou `aria-label`, `<button>` para ações e `<a>`/`Link` para navegação.
7. **Responsivo:** teste a 375 px e a 1440 px de largura.
