// Aba Serviços ("Missões Disponíveis", como no RetroOffice): o que ofereço e o diferencial.
// TODO(conteúdo): Rafael revisa os serviços
export type Service = {
  title: string
  /** Frase de abertura: o problema que o serviço resolve */
  pitch: string
  /** O que eu entrego, em uma linha */
  delivery: string
}

export const SERVICES: Service[] = [
  {
    title: '🤖 Automações com IA',
    pitch: 'Processos manuais custam caro. Automatizo o que pode ser automatizado, com IA.',
    delivery: 'fluxos automatizados, agentes de IA e integrações entre ferramentas.',
  },
  {
    title: '📊 Dashboards',
    pitch: 'Dados espalhados não ajudam ninguém a decidir.',
    delivery: 'painéis que mostram o que importa, prontos para decisões rápidas.',
  },
  {
    title: '🧭 Planejamento estratégico com IA',
    pitch: 'Do problema ao plano em pouco tempo, sem perder a qualidade.',
    delivery: 'planejamentos rápidos e acionáveis, feitos com apoio de IA.',
  },
]

export const DIFFERENTIAL =
  'você não precisa me explicar como funciona seu negócio. Eu já entendo — e não entrego algo só bonito: entrego algo que realmente funciona.'
