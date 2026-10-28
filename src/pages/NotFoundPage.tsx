import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Window } from '@/components/ui/Window'
import styles from './NotFoundPage.module.css'

// 404 dentro do monitor: um navegador antigo mostrando a página padrão de "File not found"
export function NotFoundPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const address = `${window.location.origin}${pathname}`

  return (
    <Window
      title="404 Not Found — Rafael_OS Explorer"
      icon="🌐"
      toolbar={
        <div className={styles.bar}>
          <Button onClick={() => navigate(-1)}>
            <span aria-hidden="true">⬅️</span> Voltar
          </Button>
          <Button onClick={() => navigate('/')}>
            <span aria-hidden="true">🏠</span> Início
          </Button>
          <label className={styles.address}>
            <span>Endereço:</span>
            <input type="text" value={address} readOnly />
          </label>
        </div>
      }
      statusBar={<span>Concluído</span>}
    >
      <div className={styles.page}>
        <title>404 — Página não encontrada | Rafael Dias</title>
        <h2 className={styles.title}>
          <span className={styles.code}>404 error</span>: File not found
        </h2>
        <p>
          A página <code className={styles.path}>{pathname}</code> não foi encontrada neste
          computador.
        </p>
        <p>
          <strong>Você quis dizer</strong>{' '}
          <Link to="/projetos" className={styles.link}>
            {window.location.host}/projetos
          </Link>
          ?
        </p>
        <p>Talvez você queira ver:</p>
        <ul>
          <li>
            <Link to="/" className={styles.link}>
              A página inicial
            </Link>
          </li>
          <li>
            <Link to="/projetos" className={styles.link}>
              A lista de projetos
            </Link>
          </li>
          <li>
            <Link to="/contato" className={styles.link}>
              Como falar comigo
            </Link>
          </li>
        </ul>
        <hr className={styles.rule} />
        <p className={styles.footer}>Um projeto do Rafael_OS.</p>
      </div>
    </Window>
  )
}
