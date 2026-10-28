// TODO(conteúdo): Rafael revisa os nomes e as falas
//
// Textos do Fox 64. Ficam separados da lógica (index.js) para trocar nomes e
// falas sem mexer no jogo. Os dois aliados são personagens fictícios; o piloto
// "piloto" é quem está jogando (nome e foto chegam pelo startGame).
//
// Marcadores aceitos nas falas: {piloto} (nome do piloto escolhido),
// {suporte} (aliado que manda os itens) e {radar} (aliado do radar).

// Personagens fictícios: avatar desenhado em CSS (emoji + gradiente), sem imagem
export const ALIADOS_FICTICIOS = {
  byte: {
    nome: 'BYTE-7',
    emoji: '🤖',
    fundo: 'linear-gradient(135deg, #003048, #0077aa)',
    papel: 'Robô copiloto',
  },
  vega: {
    nome: 'VEGA',
    emoji: '🧭',
    fundo: 'linear-gradient(135deg, #3a0030, #aa2277)',
    papel: 'Navegadora',
  },
}

// Textos da tela de seleção (um por personagem)
export const SELECAO = {
  titulo: '★ ESCOLHA SEU PILOTO ★',
  subtitulo: 'Cada piloto tem uma nave e um laser próprios',
  aliadosLabel: 'ALIADOS NESSA MISSÃO:',
  confirmar: '▶ CONFIRMAR PILOTO',
  cards: {
    piloto: { laser: 'Vermelho', desc: 'Piloto principal. Laser equilibrado e preciso.' },
    byte: { laser: 'Ciano', desc: 'Interceptador. Laser veloz de longo alcance.' },
    vega: { laser: 'Magenta', desc: 'Suporte ofensivo. Laser amplo de alta energia.' },
  },
}

// Fala da tela de instruções, conforme o piloto escolhido
export const FALA_INSTRUCOES = {
  piloto: '{suporte} e {radar} em standby. Escolha a dificuldade!',
  byte: 'Sistemas calibrados. {suporte} e {radar} prontos!',
  vega: 'Rota traçada. {suporte} e {radar} esperando!',
}

// Falas próprias de cada personagem
export const FALAS_PERSONAGEM = {
  piloto: {
    onda7: 'Onda 7! {suporte}, {radar} — precisamos de vocês agora!',
    vitoria: 'Base protegida. Esse foi por pouco!',
    derrota: '"Reagrupar e tentar de novo. A base conta com a gente."',
    // Falas de combate quando este personagem é aliado (onda 7+)
    combate: ['Vou abrir caminho!', 'Segurem posição!', 'Fogo concentrado!', 'Não deixem passar!'],
  },
  byte: {
    onda7: 'BYTE-7 online. {suporte}, {radar} — formação de interceptação!',
    vitoria: 'Missão cumprida. Probabilidade de sucesso era de 12%. Impressionante.',
    derrota: '"Falha registrada. Recalculando estratégia para a próxima tentativa."',
    combate: ['Cobrindo o flanco!', 'Alvo travado!', 'Radar limpo por aqui!', 'Mais um destruído! Bip!'],
  },
  vega: {
    onda7: 'VEGA chegando! {suporte}, {radar} — cobrindo vocês!',
    vitoria: 'Rota limpa, base inteira. Vamos voltar para casa.',
    derrota: '"Recuar não é desistir. Voltamos com outra rota."',
    combate: ['Flanco coberto!', 'Sistema de mira online!', 'Destruindo hostis!', 'Segura que eu chego!'],
  },
}

// Diálogo da cena final de vitória, conforme o piloto escolhido.
// p = quem fala ('piloto', 'byte' ou 'vega').
export const DIALOGOS_FINAL = {
  piloto: [
    { p: 'piloto', txt: 'Conseguimos. Dez ondas e a base continua de pé.' },
    { p: 'byte', txt: 'Danos na base dentro do aceitável. Meus circuitos estão... orgulhosos?' },
    { p: 'vega', txt: 'Registrei a rota de hoje. Ninguém vai esquecer essa defesa.' },
    { p: 'piloto', txt: 'Sem vocês dois eu não teria passado da onda 7.' },
    { p: 'byte', txt: 'Trabalho em equipe: eficiência 100%. Recomendo repetir.' },
    { p: 'piloto', txt: 'Esquadrão, de volta à base. Missão cumprida!', ultimo: true },
  ],
  byte: [
    { p: 'byte', txt: 'Missão cumprida. Todos os meteoros foram neutralizados.' },
    { p: 'piloto', txt: 'Bela pilotagem, BYTE-7. Você nem esquentou os processadores.' },
    { p: 'vega', txt: 'Quem diria, um robô liderando a formação.' },
    { p: 'byte', txt: 'Dados salvos para a próxima missão. Bip bip!' },
    { p: 'piloto', txt: 'Esquadrão, de volta à base!', ultimo: true },
  ],
  vega: [
    { p: 'vega', txt: 'Conseguimos! A base está segura.' },
    { p: 'byte', txt: 'Rota de VEGA: zero colisões com a base nas últimas ondas. Excelente.' },
    { p: 'piloto', txt: 'Você achou o caminho certo no meio do caos, VEGA.' },
    { p: 'vega', txt: 'Navegar é isso: achar a saída quando parece que não tem.' },
    { p: 'byte', txt: 'Esquadrão, de volta à base!', ultimo: true },
  ],
}

// Diálogo de abertura de cada onda.
// quem: 'principal' (o piloto escolhido), 'suporte' ou 'radar'.
export const DIALOGOS_ONDA = {
  1: { quem: 'principal', txt: 'Sistema de defesa ativo! Destruam esses meteoros!' },
  2: { quem: 'radar', txt: 'Radar confirmado — mais hostis a caminho!' },
  3: { quem: 'suporte', txt: 'HYPER BEAM em rota! Acerte o item especial!' },
  4: { quem: 'radar', txt: 'Muitos meteoros! {suporte} está enviando reforços!' },
  5: { quem: 'suporte', txt: 'Twin Laser disponível — acerte o item dourado!' },
  6: { quem: 'principal', txt: 'Onda 6. Sem recuar — resistimos até o fim!' },
  7: { quem: 'radar', txt: 'ONDA 7! Pedindo reforços — a caminho!' },
  8: { quem: 'suporte', txt: 'Onda 8! Eles estão mais fortes — mas nós também!' },
  9: { quem: 'principal', txt: 'Penúltima onda! Juntos chegamos até aqui!' },
  10: { quem: 'radar', txt: 'ONDA FINAL! Tudo ou nada — deem o melhor!' },
}

// Falas do aliado de suporte sobre os itens
export const FALAS_ITEM = {
  curaColetada: 'Shield restaurado! Bom trabalho, piloto!',
  upgradeColetado: 'Twin Laser ativado! Boa caçada!',
  hyperColetado: 'HYPER BEAM ATIVADO! Destrua tudo em 8 segundos!',
  upgradeEmRota: 'Item de upgrade em rota — acerte com o laser ou encoste!',
  hyperEmRota: 'HYPER BEAM em rota — acerte o item roxo!',
  curaEmRota: 'Item de cura a caminho — acerte com o laser ou encoste!',
  hyperAviso: 'HYPER BEAM a caminho! Acerte o item especial!',
}

// Entrada dos aliados na onda 7
export const FALAS_ENTRADA = {
  aliadoEsquerda: 'Aqui {nome}! Cobrindo o flanco esquerdo!',
  aliadoDireita: '{nome} chegando pela direita! Formação!',
  principalFim: 'Que time! Juntos somos imparáveis!',
  atacar: 'Formação completa — atacar!',
}

export const INSTRUCOES = {
  logo: '★ FOX 64 ★',
  subLogo: 'SISTEMA DE DEFESA ATIVO',
  regras: [
    ['🖱️', '<b>MOUSE</b> — Mire livremente'],
    ['🔫', '<b>CLIQUE</b> — Dispara laser'],
    ['🎮', '<b>WASD</b> — Move a nave'],
    ['💊', 'Acerte <b>itens</b> com laser para coletar'],
    ['⚡', 'Aliados chegam na onda 7!'],
  ],
  dificuldades: [
    { id: 'facil', icone: '🟢', nome: 'FÁCIL', desc: 'Meteoros lentos · Menos dano' },
    { id: 'medio', icone: '🟡', nome: 'MÉDIO', desc: 'Equilibrado · Desafiador' },
    { id: 'dificil', icone: '🔴', nome: 'DIFÍCIL', desc: 'Meteoros rápidos · Alto dano' },
  ],
  iniciar: 'DO A BARREL ROLL!',
}

export const TELA_FINAL = {
  vitoria: '★ MISSÃO CUMPRIDA ★',
  derrota: '✕ SISTEMA ABATIDO ✕',
  subVitoria: 'Dez ondas de meteoros. Base protegida.',
  iniciais: 'SUAS INICIAIS (3 letras):',
  salvar: '▶ SALVAR',
  ranking: '◆ HALL DA FAMA ◆',
  semRegistros: 'SEM REGISTROS',
  jogarDeNovo: '↻ JOGAR DE NOVO',
  voltar: '◀ VOLTAR AO PORTFÓLIO',
  continuar: '▶ CONTINUAR',
}

export const HUD = {
  dica: '🖱️ Mouse · Clique para atirar · WASD mover · <b>M</b> mudo · <b>H</b> atalhos',
  sair: '✕ SAIR DO JOGO (ESC)',
  base: 'BASE',
}
