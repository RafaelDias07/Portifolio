import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Window } from '@/components/ui/Window'
import styles from './ErrorPage.module.css'

// Página de erro das rotas: aparece se uma página quebrar ao renderizar
export function ErrorPage() {
  return (
    <main className={styles.screen}>
      <title>Erro | Rafael Dias</title>
      <div className={styles.dialog}>
        <Window title="Rafael_OS — Erro" icon="⚠️">
          <div className={styles.body} role="alert">
            <p>
              <strong>O programa encontrou um problema e precisa ser fechado.</strong>
            </p>
            <p>Tente recarregar a página. Se continuar, volte ao início.</p>
            <div className={styles.actions}>
              <Button onClick={() => window.location.reload()}>Recarregar</Button>
              <Link to="/" className={styles.link}>
                Voltar ao início
              </Link>
            </div>
          </div>
        </Window>
      </div>
    </main>
  )
}
