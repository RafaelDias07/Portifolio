import { useClock } from '@/hooks/useClock'

const TIME_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

export function Clock() {
  const now = useClock()
  return <time dateTime={now.toISOString()}>{TIME_FORMAT.format(now)}</time>
}
