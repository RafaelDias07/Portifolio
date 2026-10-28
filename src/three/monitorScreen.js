import * as THREE from 'three'

// O que aparece na tela do monitor, desenhado num canvas 2D e usado como textura:
// 1. durante a abertura, uma caixa "Carregando..." do Windows antigo, com a barra enchendo;
// 2. depois, a área de trabalho do Rafael_OS (vista quando a janela some, na câmera livre).
// Mais leve que o CSS3DRenderer do projeto original: não cria uma segunda cena com DOM.

const WIDTH = 1024
const HEIGHT = 832 // mesma proporção da tela (1,6 × 1,3)
const BLOCKS = 24

// Borda em relevo dos controles do Windows 9x: claro em cima/esquerda, escuro embaixo/direita
function bevel(ctx, x, y, w, h, raised) {
  ctx.fillStyle = raised ? '#ffffff' : '#808080'
  ctx.fillRect(x, y, w, 3)
  ctx.fillRect(x, y, 3, h)
  ctx.fillStyle = raised ? '#404040' : '#ffffff'
  ctx.fillRect(x, y + h - 3, w, 3)
  ctx.fillRect(x + w - 3, y, 3, h)
}

function scanlines(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  for (let y = 0; y < HEIGHT; y += 4) ctx.fillRect(0, y, WIDTH, 2)
}

function drawLoading(ctx, filledBlocks, title) {
  // Fundo verde-azulado clássico da área de trabalho
  ctx.fillStyle = '#008080'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const x = 92
  const y = 186
  const w = 840
  const h = 460

  // Caixa de diálogo
  ctx.fillStyle = '#d4d0c8'
  ctx.fillRect(x, y, w, h)
  bevel(ctx, x, y, w, h, true)

  // Barra de título em degradê, com o botão de fechar
  const bar = ctx.createLinearGradient(x, 0, x + w, 0)
  bar.addColorStop(0, '#0a246a')
  bar.addColorStop(1, '#a6caf0')
  ctx.fillStyle = bar
  ctx.fillRect(x + 6, y + 6, w - 12, 44)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 26px Tahoma, Verdana, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(title, x + 20, y + 28)

  ctx.fillStyle = '#d4d0c8'
  ctx.fillRect(x + w - 50, y + 12, 34, 32)
  bevel(ctx, x + w - 50, y + 12, 34, 32, true)
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 24px Tahoma, Verdana, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('×', x + w - 33, y + 28)

  // Texto
  ctx.font = 'bold 80px Tahoma, Verdana, sans-serif'
  ctx.fillText('Carregando...', WIDTH / 2, y + 140)

  // Barra de progresso afundada, com blocos azuis
  const trackX = x + 60
  const trackY = y + 215
  const trackW = w - 120
  const trackH = 60
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(trackX, trackY, trackW, trackH)
  bevel(ctx, trackX, trackY, trackW, trackH, false)

  const gap = 4
  const blockW = (trackW - 12 - gap * (BLOCKS - 1)) / BLOCKS
  ctx.fillStyle = '#0a246a'
  for (let i = 0; i < filledBlocks; i++) {
    ctx.fillRect(trackX + 6 + i * (blockW + gap), trackY + 6, blockW, trackH - 12)
  }

  // Botão Cancelar (decorativo: está desenhado dentro da textura 3D)
  const buttonW = 240
  const buttonH = 64
  const buttonX = WIDTH / 2 - buttonW / 2
  const buttonY = y + h - 104
  ctx.fillStyle = '#d4d0c8'
  ctx.fillRect(buttonX, buttonY, buttonW, buttonH)
  bevel(ctx, buttonX, buttonY, buttonW, buttonH, true)
  ctx.fillStyle = '#000000'
  ctx.font = '34px Tahoma, Verdana, sans-serif'
  ctx.fillText('Cancelar', WIDTH / 2, buttonY + buttonH / 2)

  scanlines(ctx)
}

function drawDesktop(ctx, title) {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  sky.addColorStop(0, '#2a6fd6')
  sky.addColorStop(0.65, '#8cc4f2')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Colina verde
  ctx.fillStyle = '#3f9b2f'
  ctx.beginPath()
  ctx.ellipse(WIDTH * 0.45, HEIGHT * 1.05, WIDTH * 0.9, HEIGHT * 0.42, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
  ctx.shadowBlur = 10
  ctx.font = 'bold 72px Tahoma, Verdana, sans-serif'
  ctx.fillText(title, WIDTH / 2, HEIGHT * 0.36)
  ctx.font = '32px Tahoma, Verdana, sans-serif'
  ctx.fillText('Portfólio de Rafael Dias', WIDTH / 2, HEIGHT * 0.36 + 70)
  ctx.shadowBlur = 0

  // Barra de tarefas com o botão iniciar
  ctx.fillStyle = '#245edb'
  ctx.fillRect(0, HEIGHT - 56, WIDTH, 56)
  ctx.fillStyle = '#3c9a3c'
  ctx.fillRect(0, HEIGHT - 56, 170, 56)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'italic bold 30px Tahoma, Verdana, sans-serif'
  ctx.fillText('iniciar', 85, HEIGHT - 28)

  scanlines(ctx)
}

export function createMonitorScreen(screenMesh, { title }) {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  screenMesh.material.map = texture
  screenMesh.material.color.set(0xffffff)
  screenMesh.material.needsUpdate = true

  let drawnBlocks = -1
  let desktop = false

  // Só redesenha quando muda o número de blocos, não a cada quadro
  function setProgress(progress) {
    if (desktop) return
    const blocks = Math.round(Math.min(Math.max(progress, 0), 1) * BLOCKS)
    if (blocks === drawnBlocks) return
    drawnBlocks = blocks
    drawLoading(ctx, blocks, title)
    texture.needsUpdate = true
  }

  function showDesktop() {
    if (desktop) return
    desktop = true
    drawDesktop(ctx, title)
    texture.needsUpdate = true
  }

  setProgress(0)
  return { setProgress, showDesktop }
}
