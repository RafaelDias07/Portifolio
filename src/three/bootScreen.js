import * as THREE from 'three'

// Desenha a tela de boot do CRT numa textura de canvas e aplica na malha da tela.
// Mais leve que o CSS3DRenderer do projeto original: não cria uma segunda cena com DOM.
export function applyBootScreen(screenMesh, lines) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 832 // mesma proporção da tela (1,6 × 1,3)
  const ctx = canvas.getContext('2d')

  const glow = ctx.createRadialGradient(512, 416, 50, 512, 416, 640)
  glow.addColorStop(0, '#0b2a0b')
  glow.addColorStop(1, '#010801')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#7cff7c'
  ctx.shadowColor = 'rgba(124, 255, 124, 0.6)'
  ctx.shadowBlur = 14
  ctx.textBaseline = 'top'

  lines.forEach((line, index) => {
    ctx.font = index === 0 ? 'bold 64px "Courier New", monospace' : '40px "Courier New", monospace'
    ctx.fillText(line, 90, 110 + index * 80 + (index > 0 ? 30 : 0))
  })

  // Scanlines: faixas escuras a cada 4 px
  ctx.shadowBlur = 0
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
  for (let y = 0; y < canvas.height; y += 4) ctx.fillRect(0, y, canvas.width, 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  screenMesh.material.map = texture
  screenMesh.material.color.set(0xffffff)
  screenMesh.material.needsUpdate = true

  return texture
}
