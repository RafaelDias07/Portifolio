import { useLocation, useNavigate } from 'react-router'
import { LoginForm } from '@/components/LoginForm'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Window } from '@/components/ui/Window'
import { PROFILE } from '@/content/profile'
import styles from './dashboard.module.css'

// O ProtectedRoute guarda em state a página que a pessoa tentou abrir
function readRedirect(state: unknown) {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const { from } = state
    if (typeof from === 'string' && from.startsWith('/painel')) return from
  }
  return '/painel'
}

// Tela de login no estilo da tela de boas-vindas do Windows XP
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Window
      title="Rafael_OS — Entrar"
      icon="🔐"
      toolbar={
        <ButtonLink to="/">
          <span aria-hidden="true">⬅️</span> Voltar ao portfólio
        </ButtonLink>
      }
      statusBar={<span>Área restrita ao dono do site</span>}
    >
      <title>Entrar no painel | Rafael Dias</title>
      <div className={styles.welcome}>
        <div className={styles.welcomeSide}>
          <p className={styles.welcomeBrand}>Rafael_OS</p>
          <p>Para começar, entre com a sua conta.</p>
        </div>
        <div className={styles.welcomeForm}>
          <div className={styles.user}>
            <img
              className={styles.avatar}
              src={PROFILE.photo}
              alt=""
              width={64}
              height={64}
              decoding="async"
            />
            <h2 className={styles.userName}>{PROFILE.name}</h2>
          </div>
          <LoginForm onSuccess={() => navigate(readRedirect(location.state), { replace: true })} />
        </div>
      </div>
    </Window>
  )
}
