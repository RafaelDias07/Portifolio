// Tipos da API pública do jogo (o código em si é JavaScript, ver AGENTS.md seção 10)
import type { GameOptions, GameHandle } from '../types'

export function startGame(options: GameOptions): GameHandle
