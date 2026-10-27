import { Link, useLocation } from 'react-router'
import styles from './NotFoundPage.module.css'

// 404 no estilo "tela azul" do Windows. Fica fora do layout 3D: é uma tela cheia
export function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <main className={styles.screen}>
      <title>Página não encontrada | Rafael Dias</title>
      <div className={styles.content}>
        <h1 className={styles.badge}>Rafael_OS</h1>
        <p>
          Ocorreu um erro fatal 404 em <code className={styles.path}>{pathname}</code>. A página que
          você procurou não existe ou mudou de lugar.
        </p>
        <ul className={styles.list}>
          <li>Confira se o endereço foi digitado certo.</li>
          <li>Ou volte para o início e navegue pelas abas da janela.</li>
        </ul>
        <p>
          <Link to="/" className={styles.link}>
            Pressione aqui para voltar ao início _
          </Link>
        </p>
      </div>
    </main>
  )
}
