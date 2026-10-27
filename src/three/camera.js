import * as THREE from 'three'

const FOCUS_POSITION = new THREE.Vector3(0, 1.9, 3.3)
const FOCUS_TARGET = new THREE.Vector3(0, 1.75, 0)
const FREE_POSITION = new THREE.Vector3(0, 2.5, 7)
const FREE_TARGET = new THREE.Vector3(0, 1, 0)

// Converte um fator de suavização "por quadro a 60 fps" para o tempo real do quadro,
// para a câmera andar na mesma velocidade em telas de 60 Hz, 120 Hz ou com a aba em segundo plano
function smoothing(factorAt60fps, delta) {
  return 1 - (1 - factorAt60fps) ** (delta * 60)
}

// Diretor da câmera com três modos:
// - drift: voo de abertura em volta do computador;
// - focus: aproxima da tela, onde a janela XP aparece;
// - free: o visitante gira a câmera com o mouse ou o dedo (OrbitControls).
export function createCameraDirector(camera, controls, { skipIntro = false } = {}) {
  let mode = skipIntro ? 'focus' : 'drift'
  let time = 0
  let flyingToFree = false
  const freePosition = new THREE.Vector3()

  // Em tela de celular em pé a câmera precisa recuar mais para o computador caber na largura
  function updateFreePosition() {
    const scale = Math.max(1, 0.8 / camera.aspect)
    freePosition.copy(FREE_POSITION).sub(FREE_TARGET).multiplyScalar(scale).add(FREE_TARGET)
  }

  if (skipIntro) {
    camera.position.copy(FOCUS_POSITION)
    controls.target.copy(FOCUS_TARGET)
  }

  function setMode(next) {
    mode = next
    controls.enabled = false

    if (next === 'free') {
      controls.minDistance = 1
      controls.maxDistance = 80
      controls.minPolarAngle = 0
      controls.maxPolarAngle = Math.PI
      updateFreePosition()
      flyingToFree = true
    } else {
      controls.minDistance = 2
      controls.maxDistance = 12
      controls.maxPolarAngle = Math.PI / 2.1
      flyingToFree = false
    }
  }

  function update(delta) {
    if (mode === 'drift') {
      time += 0.9 * delta
      camera.position.set(
        Math.sin(time) * 4,
        2 + Math.cos(time * 0.8) * 0.7,
        8 + Math.cos(time * 0.5) * 2,
      )
      camera.lookAt(0, 1, 0)
      if (time > 2.5) setMode('focus')
      return
    }

    if (mode === 'focus') {
      camera.position.lerp(FOCUS_POSITION, smoothing(0.07, delta))
      controls.target.lerp(FOCUS_TARGET, smoothing(0.07, delta))
      camera.lookAt(controls.target)
      return
    }

    if (flyingToFree) {
      camera.position.lerp(freePosition, smoothing(0.06, delta))
      controls.target.lerp(FREE_TARGET, smoothing(0.06, delta))
      camera.lookAt(controls.target)

      // Chegou perto o bastante: entrega o controle para o visitante
      if (camera.position.distanceTo(freePosition) < 0.25) {
        flyingToFree = false
        controls.enabled = true
      }
      return
    }

    controls.update()
  }

  // A janela só é encaixada quando a câmera já está parada em frente à tela
  function isFocused() {
    return mode === 'focus' && camera.position.distanceTo(FOCUS_POSITION) < 0.05
  }

  return { setMode, update, isFocused }
}
