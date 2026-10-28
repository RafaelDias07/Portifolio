import { Clock } from '@/components/Clock'
import { FeaturedProjectsForm } from '@/components/FeaturedProjectsForm'
import { MessageList } from '@/components/MessageList'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { GroupBox } from '@/components/ui/GroupBox'
import { Window } from '@/components/ui/Window'
import { useAuth } from '@/contexts/AuthContext'
import styles from './dashboard.module.css'

// Painel do dono: mensagens do contato e escolha dos destaques.
// Ao sair, a sessão some e o ProtectedRoute leva de volta para o login
export function DashboardPage() {
  const { session, signOut } = useAuth()

  return (
    <Window
      title="Painel de controle — Rafael_OS"
      icon="🛠️"
      toolbar={
        <>
          <ButtonLink to="/">
            <span aria-hidden="true">🏠</span> Portfólio
          </ButtonLink>
          <Button onClick={signOut}>
            <span aria-hidden="true">🚪</span> Sair
          </Button>
        </>
      }
      statusBar={
        <>
          <span className={styles.panel}>Logado como {session?.user.email}</span>
          <span className={styles.panel}>
            <Clock />
          </span>
        </>
      }
    >
      <title>Painel | Rafael Dias</title>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: o painel rola, então precisa receber foco para rolar pelo teclado */}
      <div className={styles.content} tabIndex={0}>
        <GroupBox title="📨 Mensagens do contato">
          <MessageList />
        </GroupBox>
        <GroupBox title="⭐ Projetos em destaque">
          <FeaturedProjectsForm />
        </GroupBox>
      </div>
    </Window>
  )
}
