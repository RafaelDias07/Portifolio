import { Button } from '@/components/ui/Button'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button onClick={toggleTheme} aria-pressed={isDark}>
      <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
      Tema escuro
    </Button>
  )
}
