// Contrato comum dos jogos (src/games/*/index.js), usado pelo componente de ponte GameHost

export type GamePlayer = {
  /** Nome curto do piloto, em maiúsculas (ex.: RAFA) */
  name: string
  /** URL da foto do piloto, mostrada no HUD e nas falas */
  photo: string
}

export type GameOptions = {
  /** Elemento em tela cheia onde o jogo cria o canvas e as telas (HUD, menus) */
  container: HTMLElement
  player: GamePlayer
  /** O jogador pediu para sair (botão ou Esc): o React desmonta e chama dispose */
  onExit: () => void
}

export type GameHandle = {
  /** Para o loop, remove listeners, canvas e telas e libera a memória da GPU */
  dispose: () => void
}
