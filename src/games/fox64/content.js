// TODO(conteúdo): Rafael revisa as falas
//
// Textos do Fox 64. Ficam separados da lógica (index.js) para trocar as falas
// sem mexer no jogo. Só existe a nave de quem joga; quem fala pelo rádio é a
// base (o computador que a nave defende).

// Avatares desenhados em CSS (emoji + gradiente), sem imagem
export const PERSONAGENS = {
  piloto: {
    nome: 'NAVE',
    emoji: '🚀',
    fundo: 'linear-gradient(135deg, #001a48, #2266ff)',
  },
  base: {
    nome: 'BASE',
    emoji: '🖥️',
    fundo: 'linear-gradient(135deg, #1a2a1a, #3a7a3a)',
  },
}

// Fala da base na tela de instruções
export const FALA_INSTRUCOES = 'Meteoros a caminho! Escolha a dificuldade e defenda a base.'

// Fala da base no fim da partida
export const FALAS_FIM = {
  vitoria: 'Base protegida. Esse foi por pouco!',
  derrota: 'Reagrupe e tente de novo. A base conta com você.',
}

// Diálogo de abertura de cada onda (sempre da base)
export const DIALOGOS_ONDA = {
  1: { txt: 'Sistema de defesa ativo! Destrua esses meteoros!' },
  2: { txt: 'Radar confirmado: mais hostis a caminho!' },
  3: { txt: 'HYPER BEAM em rota! Acerte o item especial!' },
  4: { txt: 'Muitos meteoros! Enviando itens de reforço!' },
  5: { txt: 'Twin Laser disponível: acerte o item dourado!' },
  6: { txt: 'Onda 6. Sem recuar, resista até o fim!' },
  7: { txt: 'Onda 7! Eles estão vindo em maior número!' },
  8: { txt: 'Onda 8! Eles estão mais fortes, mas você também!' },
  9: { txt: 'Penúltima onda! Falta pouco!' },
  10: { txt: 'ONDA FINAL! Tudo ou nada!' },
}

// Falas da base sobre os itens
export const FALAS_ITEM = {
  curaColetada: 'Shield restaurado! Bom trabalho!',
  upgradeColetado: 'Twin Laser ativado! Boa caçada!',
  hyperColetado: 'HYPER BEAM ATIVADO! Destrua tudo em 8 segundos!',
  upgradeEmRota: 'Item de upgrade em rota — acerte com o laser ou encoste!',
  hyperEmRota: 'HYPER BEAM em rota — acerte o item roxo!',
  curaEmRota: 'Item de cura a caminho — acerte com o laser ou encoste!',
  hyperAviso: 'HYPER BEAM a caminho! Acerte o item especial!',
}

export const INSTRUCOES = {
  logo: '★ FOX 64 ★',
  subLogo: 'SISTEMA DE DEFESA ATIVO',
  regras: [
    ['🖱️', '<b>MOUSE</b> — Mire livremente'],
    ['🔫', '<b>CLIQUE</b> — Dispara laser'],
    ['🎮', '<b>WASD</b> — Move a nave'],
    ['💊', 'Acerte <b>itens</b> com laser para coletar'],
    ['🖥️', 'Proteja a <b>base</b>: se o HP dela zerar, acabou'],
  ],
  dificuldades: [
    { id: 'facil', icone: '🟢', nome: 'FÁCIL', desc: 'Meteoros lentos · Menos dano' },
    { id: 'medio', icone: '🟡', nome: 'MÉDIO', desc: 'Equilibrado · Desafiador' },
    { id: 'dificil', icone: '🔴', nome: 'DIFÍCIL', desc: 'Meteoros rápidos · Alto dano' },
  ],
  iniciar: '▶ JOGAR',
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
