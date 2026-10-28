import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createCameraDirector } from './camera.js'
import { createComputer } from './computer.js'
import { createMonitorScreen } from './monitorScreen.js'
import { createSquadron, createStars } from './space.js'

const SCREEN_HALF_WIDTH = 0.8
const SCREEN_HALF_HEIGHT = 0.65
// Duração aproximada do voo de abertura, para a barra de "Carregando..." encher no tempo certo
const INTRO_SECONDS = 4.5

// Monta a cena inteira dentro de `container` e devolve como controlá-la.
// Quem chama (o componente Scene3D) é responsável por chamar dispose() ao desmontar.
export function createScene({
  container,
  overlay,
  title,
  initialMode = 'focus',
  skipIntro,
  onFocusChange,
}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(0, 2, 7)

  scene.add(new THREE.AmbientLight(0xffffff, 2.5))
  const stars = createStars()
  scene.add(stars)

  const computer = createComputer()
  scene.add(computer.group)
  const monitorScreen = createMonitorScreen(computer.screen, { title })

  const squadron = createSquadron(scene)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.target.set(0, 1, 0)
  controls.enabled = false

  // Abrir direto no modo livre (celular) também pula o voo de abertura
  const director = createCameraDirector(camera, controls, {
    skipIntro: skipIntro || initialMode === 'free',
  })

  function setMode(mode) {
    renderer.domElement.style.cursor = mode === 'free' ? 'grab' : 'default'
    director.setMode(mode)
  }
  if (initialMode === 'free') setMode('free')
  // Sem voo de abertura, não há o que carregar: a tela já mostra a área de trabalho
  if (skipIntro || initialMode === 'free') monitorScreen.showDesktop()

  // Projeta os quatro cantos da tela 3D para pixels e encaixa a janela XP em cima
  const corner = new THREE.Vector3()
  function fitOverlay() {
    if (!overlay) return
    computer.screen.updateMatrixWorld(true)

    const width = container.clientWidth
    const height = container.clientHeight
    let left = Infinity
    let right = -Infinity
    let top = Infinity
    let bottom = -Infinity

    for (const [x, y] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      corner
        .set(x * SCREEN_HALF_WIDTH, y * SCREEN_HALF_HEIGHT, 0)
        .applyMatrix4(computer.screen.matrixWorld)
        .project(camera)
      const px = (corner.x * 0.5 + 0.5) * width
      const py = (-corner.y * 0.5 + 0.5) * height
      left = Math.min(left, px)
      right = Math.max(right, px)
      top = Math.min(top, py)
      bottom = Math.max(bottom, py)
    }

    overlay.style.left = `${left}px`
    overlay.style.top = `${top}px`
    overlay.style.width = `${right - left}px`
    overlay.style.height = `${bottom - top}px`
  }

  let focused = false
  let frame = 0
  let lastTime = performance.now()
  let introElapsed = 0
  function animate(now = performance.now()) {
    frame = requestAnimationFrame(animate)
    // Limita o salto quando a aba volta do segundo plano
    const delta = Math.min((now - lastTime) / 1000, 0.1)
    lastTime = now

    director.update(delta)
    stars.rotation.y += 0.0001
    squadron.update()

    const nowFocused = director.isFocused()
    if (nowFocused) {
      monitorScreen.showDesktop()
    } else {
      introElapsed += delta
      // Para em 95% até a câmera chegar, como toda barra de progresso que se preze
      monitorScreen.setProgress(Math.min(introElapsed / INTRO_SECONDS, 0.95))
    }
    if (nowFocused) fitOverlay()
    if (nowFocused !== focused) {
      focused = nowFocused
      onFocusChange?.(focused)
    }

    renderer.render(scene, camera)
  }
  animate()

  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth
    const height = container.clientHeight
    if (width === 0 || height === 0) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  })
  resizeObserver.observe(container)

  function dispose() {
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    controls.dispose()

    scene.traverse((object) => {
      if (!object.isMesh && !object.isPoints) return
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      for (const material of materials) {
        material.map?.dispose()
        material.dispose()
      }
    })

    renderer.dispose()
    renderer.domElement.remove()
    overlay?.removeAttribute('style')
  }

  return { setMode, dispose }
}
