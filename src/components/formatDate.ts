const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

// Datas da API vêm em ISO (ex.: 2026-10-27T22:59:26Z)
export function formatDate(isoDate: string) {
  return DATE_FORMAT.format(new Date(isoDate))
}
