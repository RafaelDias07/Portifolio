// Tipos da API pública da cena 3D (o código em si é JavaScript, ver AGENTS.md seção 10)

export type CameraMode = 'focus' | 'free'

export type SceneOptions = {
  container: HTMLElement
  /** Elemento encaixado sobre a tela do monitor quando a câmera está em foco */
  overlay: HTMLElement | null
  /** Nome do sistema, mostrado na caixa de carregamento e na área de trabalho do monitor */
  title: string
  /** Modo da câmera ao criar a cena (padrão: focus, com o voo de abertura) */
  initialMode?: CameraMode
  /** Pula o voo de abertura (usado com prefers-reduced-motion) */
  skipIntro: boolean
  onFocusChange?: (focused: boolean) => void
  /** Clique (não arraste) na tela do monitor durante a câmera livre */
  onScreenClick?: () => void
}

export type SceneHandle = {
  setMode: (mode: CameraMode) => void
  dispose: () => void
}

export function createScene(options: SceneOptions): SceneHandle
