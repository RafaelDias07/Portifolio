// Projetos feitos nas empresas onde trabalhei. São escritos à mão, e não vêm da API do
// GitHub, porque o código é privado: por ética, nem código nem imagens aparecem no site.
import g4Logo from '@/assets/g4-logo.webp'

export type ProjectDetail = {
  /** Título do tópico ("Problema", "Solução"…) */
  title: string
  text?: string
  items?: string[]
  /** Os itens são etapas em ordem (lista numerada) */
  ordered?: boolean
}

export type ProfessionalProject = {
  id: string
  name: string
  /** Emoji ao lado do nome */
  icon: string
  /** Resumo mostrado no card */
  summary: string
  /** Etiquetas embaixo do resumo */
  tags: string[]
  /** Explicação completa, aberta pelo botão "Ver detalhes" */
  details: ProjectDetail[]
}

export type Workplace = {
  company: string
  /** Logo no lugar do nome da empresa (WebP de src/assets) */
  logo?: { src: string; width: number; height: number }
  role?: string
  projects: ProfessionalProject[]
}

export const PROFESSIONAL_NOTICE = {
  title: 'Projetos confidenciais',
  text: 'Por ética e confidencialidade, o código e as imagens destes projetos não são divulgados no portfólio.',
  contact: 'Ficou com alguma dúvida? Estou à disposição para mostrar e explicar cada um deles.',
}

export const WORKPLACES: Workplace[] = [
  {
    company: 'G4',
    logo: { src: g4Logo, width: 240, height: 95 },
    projects: [
      {
        id: 'esteira-qa',
        name: 'Esteira de QA com agentes de IA',
        icon: '🧪',
        summary:
          'Esteira de QA multiagente integrada ao Jira: agentes de IA leem a história do PM, comentam dúvidas, geram os cenários de teste e executam testes end-to-end e de back-end, 24/7. Reduziu em 98% o tempo de execução e triplicou a cobertura, a centavos de dólar por card.',
        tags: ['TypeScript', 'Playwright', 'Supabase', 'Multiagentes', 'Jira'],
        details: [
          {
            title: 'Problema',
            text: 'O time de QA atendia 6 times de engenharia, e os cards ficavam parados na fila de QA do Jira esperando teste manual.',
          },
          {
            title: 'Solução',
            text: 'Uma esteira automática com vários agentes de IA, cada um com uma função:',
            ordered: true,
            items: [
              'Leitura da história: um agente lê a história do PM e comenta no card as dúvidas que deixariam os cenários mais específicos. Isso enriquece o contexto antes do teste.',
              'Cenários: outro agente gera os cenários de teste a partir da história e das respostas.',
              'Execução: os testes end-to-end, com Playwright, e os de back-end rodam sozinhos, sem depender de um QA.',
            ],
          },
          {
            title: 'No dia a dia',
            text: 'A esteira roda 24/7 e é integrada às ferramentas internas, que avisam a equipe e tratam os erros.',
          },
          {
            title: 'Resultados',
            items: [
              'Redução de 98% no tempo de execução dos testes.',
              '3x mais cobertura e mais cenários testados.',
              'Custo de centavos de dólar por card, muito abaixo do custo de um QA.',
              'Menos tempo dos cards na fila de QA, mesmo com o time de QA passando de 3 para 1 pessoa.',
            ],
          },
          {
            title: 'Tecnologias',
            text: 'TypeScript, Supabase, Playwright, LLMs em arquitetura multiagente e integrações com ferramentas internas. A IA também foi usada para construir, estruturar e manter o código.',
          },
        ],
      },
      {
        id: 'dashboard-engenharia',
        name: 'Dashboard de desempenho da engenharia',
        icon: '📊',
        summary:
          'Painel para o time de Agilidade com o desempenho dos times de engenharia: Cycle Time, Lead Time, Throughput, forecast e alertas. A IA estima quanto cada tarefa deveria levar e compara, ao vivo, com o tempo real do dev, para agir antes do atraso.',
        tags: ['Dashboard', 'IA', 'Métricas ágeis', 'Forecast'],
        details: [
          {
            title: 'Problema',
            text: 'As métricas dos times de engenharia ficavam espalhadas, o que dificultava comparar os times e perceber a tempo quando alguém saía da meta.',
          },
          {
            title: 'Solução',
            text: 'Um dashboard central com:',
            items: [
              'Métricas ágeis: Cycle Time, Lead Time, Throughput e outras, com comparativo entre os times.',
              'Forecast: previsão de entregas.',
              'Notificações: um canal de alertas para colocar os times de volta na meta.',
              'Estimativa por IA: para cada tarefa, a IA diz quanto tempo ela deveria levar, e o painel compara ao vivo com o tempo que o dev está levando.',
            ],
          },
          {
            title: 'Diferencial',
            text: 'É uma ferramenta preventiva: os agilistas veem o desvio enquanto ele acontece e agem antes de a entrega atrasar.',
          },
          {
            title: 'Tecnologias',
            text: 'Integrações com as ferramentas do time, visualizações de dados e LLM para as estimativas.',
          },
        ],
      },
      {
        id: 'bot-chamados',
        name: 'Bot de chamados no Slack',
        icon: '🎫',
        summary:
          'Bot que monitora o canal de chamados do time Comercial no Slack, identifica cada novo pedido e abre o card no Jira automaticamente. Nenhum chamado se perde, e os times passam a ter dados para medir o SLA corretamente.',
        tags: ['Slack', 'Jira', 'Automação', 'SLA'],
        details: [
          {
            title: 'Problema',
            text: 'Os chamados do Comercial chegavam soltos num canal do Slack. Sem registro, não dava para medir o SLA dos times que atendiam.',
          },
          {
            title: 'Solução',
            text: 'Um bot que acompanha o canal, reconhece quando uma mensagem é um chamado e abre o card no Jira sozinho.',
          },
          {
            title: 'Resultado',
            text: 'Todo chamado vira dado, e os times passam a medir o SLA com números reais.',
          },
        ],
      },
      {
        id: 'reducao-custos',
        name: 'Automações de redução de custos',
        icon: '💰',
        summary:
          'Automações que encontram desperdício: detectam projetos do Supabase que parecem sem uso, avisam os responsáveis e desativam. Também analisam projetos no Lovable e o uso de IA na ferramenta interna G4OS, gerando saving e mais eficiência.',
        tags: ['Supabase', 'FinOps', 'Automação', 'IA'],
        details: [
          {
            title: 'Problema',
            text: 'Com muitos projetos e ferramentas de IA em uso, sobravam projetos esquecidos gerando custo, e faltava visibilidade sobre como a IA era usada.',
          },
          {
            title: 'Solução',
            items: [
              'Supabase: a automação identifica projetos com sinais de que não estão em uso, avisa o responsável por mensagem e desativa o projeto, tudo sem trabalho manual.',
              'Lovable e G4OS: análise dos projetos no Lovable e do uso de IA na ferramenta interna G4OS, para encontrar onde otimizar custos e ganhar eficiência.',
            ],
          },
          {
            title: 'Resultado',
            text: 'Saving para a companhia e mais clareza sobre onde o investimento em IA dá retorno.',
          },
        ],
      },
    ],
  },
  {
    company: 'AI For Business',
    role: 'Fundador',
    projects: [
      {
        id: 'cortes-podcast',
        name: 'Cortes de podcast com IA',
        icon: '🎙️',
        summary:
          'Sistema multiagente que analisa episódios de podcast, transcreve o vídeo e sugere os cortes com mais chance de viralizar, com notas por critérios visuais e de engajamento. Reduziu em 80% o tempo para gerar os cortes.',
        tags: ['n8n', 'Multiagentes', 'LLM', 'Transcrição'],
        details: [
          {
            title: 'Problema',
            text: 'Achar os melhores trechos de um podcast para virar corte exigia assistir horas de vídeo.',
          },
          {
            title: 'Solução',
            text: 'Um sistema multiagente que transcreve o vídeo com IA, analisa o conteúdo com LLMs e sugere os cortes mais promissores. Cada corte recebe notas e uma avaliação de potencial de viralização, com base em critérios visuais e de engajamento.',
          },
          {
            title: 'Integração',
            text: 'Os cortes gerados vão direto para as ferramentas da empresa cliente.',
          },
          {
            title: 'Resultado',
            text: 'Redução de 80% no tempo para gerar os cortes.',
          },
          {
            title: 'Tecnologias',
            text: 'n8n, ferramentas de IA para transcrição de vídeo, LLMs e integrações com as ferramentas do cliente.',
          },
        ],
      },
      {
        id: 'agente-sdr',
        name: 'Agente SDR com IA',
        icon: '🤝',
        summary:
          'Agentes de IA que fazem o papel de SDR: prospectam, qualificam e fazem o primeiro contato com os leads automaticamente, para o time comercial falar só com quem tem potencial.',
        tags: ['IA', 'Agentes', 'Automação', 'Vendas'],
        details: [
          {
            title: 'Problema',
            text: 'Prospectar e qualificar leads toma muito tempo do time comercial.',
          },
          {
            title: 'Solução',
            text: 'Agentes de IA que prospectam, qualificam e fazem o primeiro contato com os leads, e só passam adiante quem vale a conversa.',
          },
        ],
      },
    ],
  },
]
