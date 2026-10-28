import * as THREE from 'three'

// O que aparece na tela do monitor, desenhado num canvas 2D e usado como textura:
// 1. durante a abertura, uma caixa "Carregando..." no estilo do Windows XP, com a barra enchendo;
// 2. depois, a área de trabalho do Rafael_OS (vista quando a janela some, na câmera livre).
// Mais leve que o CSS3DRenderer do projeto original: não cria uma segunda cena com DOM.

const WIDTH = 1024
const HEIGHT = 832 // mesma proporção da tela (1,6 × 1,3)
const BLOCKS = 24

function roundedRect(ctx, x, y, w, h, radius, fill) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.fillStyle = fill
  ctx.fill()
}

function scanlines(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  for (let y = 0; y < HEIGHT; y += 4) ctx.fillRect(0, y, WIDTH, 2)
}

// Fundo de céu e colina, o mesmo da área de trabalho, para a caixa "flutuar" sobre ele
function drawBackdrop(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  sky.addColorStop(0, '#2a6fd6')
  sky.addColorStop(0.65, '#8cc4f2')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = '#3f9b2f'
  ctx.beginPath()
  ctx.ellipse(WIDTH * 0.45, HEIGHT * 1.05, WIDTH * 0.9, HEIGHT * 0.42, 0, 0, Math.PI * 2)
  ctx.fill()
}

// Caixa de progresso no estilo do Windows XP (tema Luna)
function drawLoading(ctx, filledBlocks, title) {
  drawBackdrop(ctx)

  const x = 92
  const y = 196
  const w = 840
  const h = 440
  const titleH = 60

  // Sombra, borda azul e corpo bege
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
  ctx.shadowBlur = 24
  ctx.shadowOffsetY = 8
  roundedRect(ctx, x, y, w, h, [18, 18, 6, 6], '#0831d9')
  ctx.shadowColor = 'transparent'
  roundedRect(ctx, x + 6, y + titleH, w - 12, h - titleH - 6, [0, 0, 4, 4], '#ece9d8')

  // Barra de título azul com brilho
  const bar = ctx.createLinearGradient(0, y, 0, y + titleH)
  bar.addColorStop(0, '#3d95ff')
  bar.addColorStop(0.15, '#0a5fe8')
  bar.addColorStop(0.85, '#0450e0')
  bar.addColorStop(1, '#0339b5')
  roundedRect(ctx, x, y, w, titleH, [18, 18, 0, 0], bar)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px Tahoma, Verdana, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetY = 2
  ctx.fillText(title, x + 26, y + titleH / 2)
  ctx.shadowColor = 'transparent'

  // Fechar vermelho
  const closeGradient = ctx.createLinearGradient(0, y + 12, 0, y + 50)
  closeGradient.addColorStop(0, '#e86a4a')
  closeGradient.addColorStop(1, '#c0391a')
  roundedRect(ctx, x + w - 58, y + 12, 40, 38, 6, '#ffffff')
  roundedRect(ctx, x + w - 56, y + 14, 36, 34, 5, closeGradient)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px Tahoma, Verdana, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('×', x + w - 38, y + 31)

  // Texto
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 72px Tahoma, Verdana, sans-serif'
  ctx.fillText('Carregando...', WIDTH / 2, y + 150)

  // Barra de progresso: trilho branco arredondado e blocos verdes com brilho
  const trackX = x + 70
  const trackY = y + 225
  const trackW = w - 140
  const trackH = 52
  roundedRect(ctx, trackX - 2, trackY - 2, trackW + 4, trackH + 4, 8, '#7f9db9')
  roundedRect(ctx, trackX, trackY, trackW, trackH, 7, '#ffffff')

  const gap = 5
  const blockW = (trackW - 16 - gap * (BLOCKS - 1)) / BLOCKS
  const green = ctx.createLinearGradient(0, trackY + 8, 0, trackY + trackH - 8)
  green.addColorStop(0, '#a5e89f')
  green.addColorStop(0.45, '#37b03c')
  green.addColorStop(1, '#2a8c2e')
  for (let i = 0; i < filledBlocks; i++) {
    roundedRect(ctx, trackX + 8 + i * (blockW + gap), trackY + 8, blockW, trackH - 16, 2, green)
  }

  // Botão Cancelar do XP (decorativo: está desenhado dentro da textura 3D)
  const buttonW = 230
  const buttonH = 62
  const buttonX = WIDTH / 2 - buttonW / 2
  const buttonY = y + h - 100
  const face = ctx.createLinearGradient(0, buttonY, 0, buttonY + buttonH)
  face.addColorStop(0, '#ffffff')
  face.addColorStop(1, '#e3e0d3')
  roundedRect(ctx, buttonX, buttonY, buttonW, buttonH, 8, '#003c74')
  roundedRect(ctx, buttonX + 2, buttonY + 2, buttonW - 4, buttonH - 4, 7, face)
  ctx.fillStyle = '#000000'
  ctx.font = '32px Tahoma, Verdana, sans-serif'
  ctx.fillText('Cancelar', WIDTH / 2, buttonY + buttonH / 2)

  scanlines(ctx)
}

function drawDesktop(ctx, title) {
  drawBackdrop(ctx)

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
