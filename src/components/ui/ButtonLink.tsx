import { Link, type LinkProps } from 'react-router'
import styles from './Button.module.css'

// Link com cara de botão do XP: navega como link (<a>), mas combina com os botões da barra
export function ButtonLink({ className, ...props }: LinkProps) {
  return <Link className={className ? `${styles.button} ${className}` : styles.button} {...props} />
}
