import * as THREE from 'three'

const FOCUS_POSITION = new THREE.Vector3(0, 1.9, 3.3)
const FOCUS_TARGET = new THREE.Vector3(0, 1.75, 0)
const FREE_POSITION = new THREE.Vector3(0, 2.5, 7)
const FREE_TARGET = new THREE.Vector3(0, 1, 0)

// Diretor da câmera com três modos:
// - drift: voo de abertura em volta do computador;
// - focus: aproxima da tela, onde a janela XP aparece;
// - free: o visitante gira a câmera com o mouse ou o dedo (OrbitControls).
export function createCameraDirector(camera, controls, { skipIntro = false } = {}) {
  let mode = skipIntro ? 'focus' : 'drift'
  let time = 0
  let flyingToFree = false

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
      flyingToFree = true
    } else {
      controls.minDistance = 2
      controls.maxDistance = 12
      controls.maxPolarAngle = Math.PI / 2.1
      flyingToFree = false
    }
  }

  function update() {
    if (mode === 'drift') {
      time += 0.015
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
      camera.position.lerp(FOCUS_POSITION, 0.07)
      controls.target.lerp(FOCUS_TARGET, 0.07)
      camera.lookAt(controls.target)
      return
    }

    if (flyingToFree) {
      camera.position.lerp(FREE_POSITION, 0.06)
      controls.target.lerp(FREE_TARGET, 0.06)
      camera.lookAt(controls.target)

      // Chegou perto o bastante: entrega o controle para o visitante
      if (camera.position.distanceTo(FREE_POSITION) < 0.25) {
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
