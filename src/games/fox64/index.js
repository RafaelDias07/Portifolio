// Fox 64 — jogo de nave em Three.js, portado do jogo original (jogo.js + a
// "cola" que vivia no main.js do site antigo). Aqui ele é autossuficiente:
// cria o próprio renderer, cena, câmera e loop dentro do container que o React
// entrega, e o dispose() desfaz tudo. Todo o estado fica dentro da closure de
// startGame, então chamar startGame de novo sempre começa uma partida limpa.
import * as THREE from 'three'
import { createComputer } from '../../three/computer.js'
import { createStars } from '../../three/space.js'
import {
  tocarTiro,
  tocarTiroUpgrade,
  tocarTiroHyper,
  tocarExplosao,
  tocarDano,
  tocarItem,
  tocarUpgrade,
  tocarDialogo,
  tocarVitoria,
  iniciarMusica,
  pararMusica,
  setMudo,
  isMudo,
} from '../audio.js'
import {
  PERSONAGENS,
  FALA_INSTRUCOES,
  FALAS_FIM,
  DIALOGOS_ONDA,
  FALAS_ITEM,
  INSTRUCOES,
  TELA_FINAL,
  HUD,
} from './content.js'
import { CSS } from './styles.js'

// ── CONSTANTES DE JOGO (iguais ao original) ──────────────────────────────────
const DIFI = {
  facil: { velBase: 0.06, velVar: 0.04, velEsc: 0.09, perseguir: 0.35, escMin: 0.2, escVar: 0.5, danoNave: 10, danoPC: 6, danoPass: 4, imort: 80, qtdBase: 3, qtdEsc: 1, qtdMax: 14, qtdBaseAlta: 6, qtdEscAlta: 2, qtdMaxAlta: 22 },
  medio: { velBase: 0.08, velVar: 0.05, velEsc: 0.11, perseguir: 0.5, escMin: 0.25, escVar: 0.65, danoNave: 16, danoPC: 10, danoPass: 7, imort: 60, qtdBase: 4, qtdEsc: 2, qtdMax: 18, qtdBaseAlta: 8, qtdEscAlta: 3, qtdMaxAlta: 28 },
  dificil: { velBase: 0.1, velVar: 0.07, velEsc: 0.14, perseguir: 0.65, escMin: 0.3, escVar: 0.7, danoNave: 22, danoPC: 14, danoPass: 10, imort: 45, qtdBase: 5, qtdEsc: 2, qtdMax: 24, qtdBaseAlta: 10, qtdEscAlta: 4, qtdMaxAlta: 35 },
}

const TECLAS_JOGO = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '])
const CHAVE_RANKING = 'fox64_ranking'
// O original contava tudo em quadros a 60 fps; o passo fixo mantém a mesma
// velocidade em monitores de 120/144 Hz
const PASSO = 1 / 60
// Até onde a mira "enxerga" quando não há nada sob ela (os meteoros nascem por volta de z = -55)
const DISTANCIA_MIRA = 70

// Nomes e HTML vão para innerHTML: escapa o que vem de fora (nome do jogador, ranking)
function esc(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function startGame({ container, onExit }) {
  // ════════════════════════════════════════════════════════════════════════
  // ── REGISTRO DE RECURSOS (tudo que o dispose precisa desfazer) ───────────
  // ════════════════════════════════════════════════════════════════════════
  const timeouts = new Set()
  const intervalos = new Set()
  const listeners = []
  let descartado = false

  function depois(fn, ms) {
    const id = setTimeout(() => {
      timeouts.delete(id)
      if (!descartado) fn()
    }, ms)
    timeouts.add(id)
    return id
  }
  function aCada(fn, ms) {
    const id = setInterval(fn, ms)
    intervalos.add(id)
    return id
  }
  function pararIntervalo(id) {
    clearInterval(id)
    intervalos.delete(id)
  }
  function limparTimers() {
    for (const id of timeouts) clearTimeout(id)
    for (const id of intervalos) clearInterval(id)
    timeouts.clear()
    intervalos.clear()
  }
  // Devolve uma função que remove o listener (o HUD tira os seus ao sumir)
  function ouvir(alvo, tipo, fn, opcoes) {
    alvo.addEventListener(tipo, fn, opcoes)
    const registro = [alvo, tipo, fn, opcoes]
    listeners.push(registro)
    return () => {
      alvo.removeEventListener(tipo, fn, opcoes)
      const i = listeners.indexOf(registro)
      if (i >= 0) listeners.splice(i, 1)
    }
  }

  // Sai uma vez só: o React desmonta e chama o dispose
  let saiu = false
  function sair() {
    if (saiu || descartado) return
    saiu = true
    onExit()
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── PERSONAGENS ──────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  // Um jogador só: a nave de quem joga. A base (o computador) fala pelo rádio
  const PERS = { ...PERSONAGENS }

  function avatarHTML(chave, classe) {
    const p = PERS[chave]
    if (p.foto) return `<img class="${classe}" src="${esc(p.foto)}" alt="${esc(p.nome)}">`
    return `<div class="${classe} f64-avatar" role="img" aria-label="${esc(p.nome)}" style="background:${p.fundo}">${p.emoji}</div>`
  }
  function primeiroNome(chave) {
    return PERS[chave].nome.split(' ')[0]
  }

  // Visual de cada nave (geometria e cores do laser). É lógica, não conteúdo,
  // então fica aqui e não no content.js. Os três desenhos são os do original.
  const NAVES = {
    piloto: {
      corNave: 0x2266ff,
      corLaser: 0xff3300, // vermelho — laser padrão
      corUpgrade: 0xffcc00, // dourado — twin laser
      corHyper: 0xff00ff, // roxo — hyper beam
      criarCorpo: (grupo) => {
        const matC = new THREE.MeshLambertMaterial({ color: 0xdddddd })
        const matA = new THREE.MeshLambertMaterial({ color: 0x2266ff })
        const matK = new THREE.MeshPhongMaterial({ color: 0x00ffff, opacity: 0.7, transparent: true })
        const corpo = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.0, 4), matC)
        corpo.rotation.x = Math.PI / 2
        grupo.add(corpo)
        const asaGeo = new THREE.BoxGeometry(0.9, 0.04, 0.35)
        const asaE = new THREE.Mesh(asaGeo, matA)
        asaE.position.set(-0.5, 0, 0.15)
        asaE.rotation.y = 0.2
        grupo.add(asaE)
        const asaD = new THREE.Mesh(asaGeo, matA)
        asaD.position.set(0.5, 0, 0.15)
        asaD.rotation.y = -0.2
        grupo.add(asaD)
        const ck = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), matK)
        ck.position.set(0, 0.08, -0.05)
        ck.scale.set(1, 1, 2)
        grupo.add(ck)
        const luzB = luzPonto(0x00ffff, 2, 3)
        luzB.position.set(0, 0, 0.8)
        grupo.add(luzB)
      },
    },
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── DOM: tudo dentro de uma raiz .fox64 no container ─────────────────────
  // ════════════════════════════════════════════════════════════════════════
  const raiz = document.createElement('div')
  raiz.className = 'fox64'
  const estilo = document.createElement('style')
  estilo.textContent = CSS
  raiz.appendChild(estilo)
  container.appendChild(raiz)
  const $ = (seletor) => raiz.querySelector(seletor)

  // Camada de flashes e avisos: some inteira no fim da partida
  const fx = document.createElement('div')
  fx.className = 'f64-fx'

  const btnSair = document.createElement('button')
  btnSair.type = 'button'
  btnSair.className = 'f64-sair'
  btnSair.textContent = HUD.sair
  ouvir(btnSair, 'click', (e) => {
    e.stopPropagation()
    sair()
  })

  // ════════════════════════════════════════════════════════════════════════
  // ── THREE: renderer, cena, câmera ────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 1)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  raiz.appendChild(renderer.domElement)
  raiz.appendChild(fx)
  raiz.appendChild(btnSair)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
  camera.position.set(0, 2, 7)

  // No three 0.150 o original só tinha uma AmbientLight 0.9; desde o r155 as
  // intensidades são físicas (≈ ×π) e a luz pontual decai com o quadrado da
  // distância. Uma luz direcional fraca dá volume às naves e ao computador.
  scene.add(new THREE.AmbientLight(0xffffff, 2.2))
  const sol = new THREE.DirectionalLight(0xffffff, 1.4)
  sol.position.set(3, 6, 5)
  scene.add(sol)

  // Luz pontual com o decaimento linear do three antigo, para manter o brilho
  function luzPonto(cor, intensidade, distancia) {
    return new THREE.PointLight(cor, intensidade * Math.PI, distancia, 1)
  }

  const estrelas = createStars()
  scene.add(estrelas)

  // O computador do site é a BASE que o jogador defende (fica na origem)
  const { group: computador } = createComputer()
  scene.add(computador)

  // Tamanho segue o container (o React pode mudar o layout a qualquer hora)
  function redimensionar() {
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  redimensionar()
  const observador = new ResizeObserver(redimensionar)
  observador.observe(container)

  // ── Geometrias e materiais compartilhados (liberados só no dispose) ─────
  const geoMet = new THREE.DodecahedronGeometry(1, 0)
  const geoLaserNormal = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 4)
  const geoLaserHyper = new THREE.CylinderGeometry(0.28, 0.28, 2.5, 6)
  const geoParticula = new THREE.SphereGeometry(0.1, 4, 4)
  const CFG_ITEM = {
    cura: { cor: 0x00ff88, hex: '#00ff88', label: '💊 +30 SHIELD', geo: new THREE.OctahedronGeometry(0.38, 0) },
    upgrade: { cor: 0xffcc00, hex: '#ffcc00', label: '⚡ TWIN LASER', geo: new THREE.OctahedronGeometry(0.38, 0) },
    hyper: { cor: 0xff00ff, hex: '#ff00ff', label: '☄️ HYPER BEAM', geo: new THREE.OctahedronGeometry(0.52, 0) },
  }
  const geosCompartilhadas = new Set([
    geoMet,
    geoLaserNormal,
    geoLaserHyper,
    geoParticula,
    CFG_ITEM.cura.geo,
    CFG_ITEM.upgrade.geo,
    CFG_ITEM.hyper.geo,
  ])

  // Cache de materiais de laser por cor — evita um material novo a cada tiro
  const matLaserCache = new Map()
  const matsCompartilhados = new Set()
  function matLaser(cor) {
    if (!matLaserCache.has(cor)) {
      const mat = new THREE.MeshBasicMaterial({ color: cor })
      matLaserCache.set(cor, mat)
      matsCompartilhados.add(mat)
    }
    return matLaserCache.get(cor)
  }

  // Raycaster reaproveitado para mirar com o mouse
  const ray = new THREE.Raycaster()
  const vMouse = new THREE.Vector2()

  // Tira um objeto da cena e libera o que é só dele na GPU
  function descartar(obj) {
    if (!obj) return
    if (obj.parent) obj.parent.remove(obj)
    obj.traverse((o) => {
      if (o.geometry && !geosCompartilhadas.has(o.geometry)) o.geometry.dispose()
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        for (const m of mats) {
          if (!matsCompartilhados.has(m)) m.dispose()
        }
      }
    })
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── ESTADO DA PARTIDA ────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  const teclas = { w: false, a: false, s: false, d: false }
  let naveJogador = null
  let jogando = false
  let vidaPC = 100
  let vidaNave = 100
  let pontos = 0
  let lasers = []
  let meteoros = []
  let itens = []
  let ondaAtual = 1
  let mouseX = 0
  let mouseY = 0
  let imortalidade = 0
  let tiroUpgrade = false // twin laser (onda 5+)
  let tiroUpgradeTimer = 0
  let tiroHyper = false // HYPER BEAM (onda 3) — destrói tudo
  let tiroHyperTimer = 0
  let cutscenePausa = false // pausa o loop de ondas durante cutscenes
  let dialogoIntervalo = null
  let dialogoTimeout = null
  let dificuldade = 'facil'
  const escolhido = 'piloto' // a nave de quem joga (o original tinha seleção de piloto)
  const explosoes = []
  // Câmera: 'menu' (deriva em volta do PC), jogo, ou diálogo da cena final
  let modoDialogo = false
  let tempoDeriva = 0
  let orbitaTempo = 0
  const lookDialogo = new THREE.Vector3(0, 2.5, 4)
  const lookMenu = new THREE.Vector3(0, 1, 0)

  // A base fala pelo rádio: avisa as ondas e manda os itens
  const VOZ = 'base'

  // ════════════════════════════════════════════════════════════════════════
  // ── HUD ──────────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  let hudEl = null
  let removerTeclasHUD = null
  let removerMouseHUD = null
  let atalhoAberto = false

  function atualizarIconeMute() {
    const mudo = isMudo()
    const btn = $('#hud-mute')
    if (btn) btn.textContent = mudo ? '🔇' : '🔊'
    const tog = $('#hud-atalhos-mute-toggle')
    if (tog) tog.textContent = mudo ? '🔊 ATIVAR SOM' : '🔇 SILENCIAR'
  }
  function toggleMudo() {
    setMudo(!isMudo())
    atualizarIconeMute()
  }

  function abrirAtalhos() {
    if (atalhoAberto) return
    atalhoAberto = true
    const mudo = isMudo()
    const ov = document.createElement('div')
    ov.id = 'hud-atalhos-overlay'
    ov.innerHTML = `
      <div id="hud-atalhos-box" role="dialog" aria-label="Atalhos">
        <button type="button" id="hud-atalhos-fechar" title="Fechar">✕</button>
        <h2>◆ ATALHOS ◆</h2>
        <div class="atalho-row"><span class="atalho-key">CLIQUE</span><span class="atalho-desc">Disparar laser</span></div>
        <div class="atalho-row"><span class="atalho-key">MOUSE</span><span class="atalho-desc">Mira livre</span></div>
        <div class="atalho-row"><span class="atalho-key">W A S D</span><span class="atalho-desc">Mover nave</span></div>
        <div class="atalho-row"><span class="atalho-key">M</span><span class="atalho-desc">Silenciar / ativar som</span></div>
        <div class="atalho-row"><span class="atalho-key">H</span><span class="atalho-desc">Abrir / fechar atalhos</span></div>
        <div class="atalho-row"><span class="atalho-key">ESC</span><span class="atalho-desc">Sair do jogo</span></div>
        <button type="button" id="hud-atalhos-mute-toggle">${mudo ? '🔊 ATIVAR SOM' : '🔇 SILENCIAR'}</button>
      </div>
    `
    raiz.appendChild(ov)
    ov.querySelector('#hud-atalhos-fechar').addEventListener('click', fecharAtalhos)
    ov.querySelector('#hud-atalhos-mute-toggle').addEventListener('click', toggleMudo)
    ov.addEventListener('click', (e) => {
      if (e.target === ov) fecharAtalhos()
    })
  }
  function fecharAtalhos() {
    atalhoAberto = false
    const ov = $('#hud-atalhos-overlay')
    if (ov) ov.remove()
  }

  function criarHUD() {
    if (hudEl) return
    hudEl = document.createElement('div')
    hudEl.id = 'game-hud'
    hudEl.innerHTML = `
      <div id="hud-mira">
        <div class="mira-anel"></div>
        <div class="mira-cruz h"></div>
        <div class="mira-cruz v"></div>
        <div class="mira-dot"></div>
      </div>

      <div id="hud-painel-esq">
        <div class="hud-face">
          ${avatarHTML(escolhido, 'hud-face-img')}
          <div class="hud-nome">${esc(primeiroNome(escolhido))}</div>
        </div>
        <div class="hud-barras">
          <div class="hud-label-bar">SHIELD</div>
          <div class="hud-bar-bg"><div id="hud-vida-nave" class="hud-bar verde"></div></div>
          <span id="hud-vida-nave-num" class="hud-bar-num">100</span>
          <div id="hud-upgrade-badge" style="display:none">⚡ TWIN LASER</div>
        </div>
      </div>

      <div id="hud-painel-dir">
        <div class="hud-face">
          <div class="hud-face-img hud-face-base f64-avatar" role="img" aria-label="${HUD.base}">🖥️</div>
          <div class="hud-nome">${HUD.base}</div>
        </div>
        <div class="hud-barras">
          <div class="hud-label-bar">HP</div>
          <div class="hud-bar-bg"><div id="hud-barra" class="hud-bar verde"></div></div>
          <span id="hud-vida-num" class="hud-bar-num">100</span>
        </div>
      </div>

      <div id="hud-topo">
        <div id="hud-onda-topo">WAVE <span id="hud-onda-num">1</span></div>
        <div id="hud-score-topo">SCORE <span id="hud-pts">0</span></div>
        <div id="hud-acoes">
          <button type="button" id="hud-mute" title="Mudo · tecla M">🔊</button>
          <button type="button" id="hud-ajuda" title="Atalhos · tecla H">H</button>
        </div>
      </div>

      <div id="hud-dialogo" style="display:none">
        <div class="dialogo-face-wrap" id="dialogo-face"></div>
        <div class="dialogo-corpo">
          <div id="dialogo-nome" class="dialogo-nome"></div>
          <div id="dialogo-txt" class="dialogo-texto"></div>
        </div>
      </div>

      <div id="hud-dica">${HUD.dica}</div>
    `
    raiz.appendChild(hudEl)
    atualizarIconeMute()

    hudEl.querySelector('#hud-mute').addEventListener('click', (e) => {
      e.stopPropagation()
      toggleMudo()
    })
    hudEl.querySelector('#hud-ajuda').addEventListener('click', (e) => {
      e.stopPropagation()
      atalhoAberto ? fecharAtalhos() : abrirAtalhos()
    })

    removerMouseHUD = ouvir(window, 'mousemove', onMouseMove)
    // Teclas M e H só valem com o HUD na tela (no ranking o jogador digita iniciais)
    removerTeclasHUD = ouvir(window, 'keydown', (e) => {
      const k = e.key
      if (k === 'm' || k === 'M') {
        toggleMudo()
        return
      }
      if (k === 'h' || k === 'H') atalhoAberto ? fecharAtalhos() : abrirAtalhos()
    })
  }

  function onMouseMove(e) {
    const r = container.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    mouseX = (x / r.width) * 2 - 1
    mouseY = -(y / r.height) * 2 + 1
    const mira = $('#hud-mira')
    if (mira) {
      mira.style.left = `${x}px`
      mira.style.top = `${y}px`
    }
  }

  function atualizarHUD() {
    if (!hudEl) return
    const pn = Math.max(0, vidaNave)
    const bN = $('#hud-vida-nave')
    if (bN) {
      bN.style.width = `${pn}%`
      bN.className = `hud-bar ${pn > 60 ? 'verde' : pn > 30 ? 'amarelo' : 'vermelho'}`
    }
    const nN = $('#hud-vida-nave-num')
    if (nN) nN.textContent = Math.ceil(pn)

    const pp = Math.max(0, vidaPC)
    const bP = $('#hud-barra')
    if (bP) {
      bP.style.width = `${pp}%`
      bP.className = `hud-bar ${pp > 60 ? 'verde' : pp > 30 ? 'amarelo' : 'vermelho'}`
    }
    const nP = $('#hud-vida-num')
    if (nP) nP.textContent = Math.ceil(pp)

    const pts = $('#hud-pts')
    if (pts) pts.textContent = pontos
    const onda = $('#hud-onda-num')
    if (onda) onda.textContent = ondaAtual
    const badge = $('#hud-upgrade-badge')
    if (badge) {
      if (tiroHyper) {
        badge.style.display = 'block'
        badge.textContent = '☄️ HYPER BEAM'
        badge.style.color = '#ff00ff'
        badge.style.textShadow = '0 0 12px #ff00ff'
      } else if (tiroUpgrade) {
        badge.style.display = 'block'
        badge.textContent = '⚡ TWIN LASER'
        badge.style.color = '#ffcc00'
        badge.style.textShadow = '0 0 8px #ffcc00'
      } else badge.style.display = 'none'
    }
  }

  function removerHUD() {
    if (removerMouseHUD) removerMouseHUD()
    if (removerTeclasHUD) removerTeclasHUD()
    removerMouseHUD = null
    removerTeclasHUD = null
    fecharAtalhos()
    if (hudEl) {
      hudEl.remove()
      hudEl = null
    }
  }

  // ── DIÁLOGO (caixa com rosto + texto digitado) ──────────────────────────
  function mostrarDialogo(chave, txt, duracao) {
    duracao = duracao || 3000
    const box = $('#hud-dialogo')
    const face = $('#dialogo-face')
    const nomeEl = $('#dialogo-nome')
    const txtEl = $('#dialogo-txt')
    if (!box) return
    if (dialogoIntervalo) {
      pararIntervalo(dialogoIntervalo)
      dialogoIntervalo = null
    }
    if (dialogoTimeout) {
      clearTimeout(dialogoTimeout)
      timeouts.delete(dialogoTimeout)
      dialogoTimeout = null
    }
    face.innerHTML = avatarHTML(chave, 'dialogo-face')
    nomeEl.textContent = PERS[chave].nome
    txtEl.textContent = ''
    box.style.display = 'flex'
    tocarDialogo()
    let i = 0
    dialogoIntervalo = aCada(() => {
      if (i < txt.length) txtEl.textContent += txt[i++]
      else {
        pararIntervalo(dialogoIntervalo)
        dialogoIntervalo = null
      }
    }, 30)
    dialogoTimeout = depois(() => {
      box.style.display = 'none'
      dialogoTimeout = null
    }, duracao)
  }

  function mostrarDialogoOnda(onda) {
    const d = DIALOGOS_ONDA[Math.min(onda, 10)] || DIALOGOS_ONDA[10]
    mostrarDialogo(VOZ, d.txt)
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── TELAS: seleção de piloto, instruções, game over, vitória ─────────────
  // ════════════════════════════════════════════════════════════════════════
  function mostrarTelaInstrucoes(onStart) {
    const P = PERS[VOZ]
    const el = document.createElement('div')
    el.id = 'game-instrucoes'
    el.innerHTML = `
      <div class="gi-box">
        <div class="gi-header">
          <div class="gi-logo">${INSTRUCOES.logo}</div>
          <div class="gi-sub-logo">${INSTRUCOES.subLogo}</div>
        </div>
        <div class="gi-dialogo-box">
          ${avatarHTML(VOZ, 'gi-face')}
          <div>
            <div class="gi-nome-char">${esc(P.nome)}</div>
            <div class="gi-fala">"${esc(FALA_INSTRUCOES)}"</div>
          </div>
        </div>
        <div class="gi-regras">
          ${INSTRUCOES.regras.map(([icone, txt]) => `<div class="gi-regra"><span class="gi-icone">${icone}</span><span>${txt}</span></div>`).join('')}
        </div>
        <div class="gi-difi-titulo">DIFICULDADE</div>
        <div class="gi-difi-btns">
          ${INSTRUCOES.dificuldades
            .map(
              (d) => `
            <button type="button" class="gi-difi ${d.id === dificuldade ? 'act' : ''}" data-d="${d.id}">
              <span class="gi-difi-icon">${d.icone}</span><span class="gi-difi-nome">${d.nome}</span>
              <span class="gi-difi-desc">${d.desc}</span>
            </button>`,
            )
            .join('')}
        </div>
        <button type="button" id="gi-start">${INSTRUCOES.iniciar}</button>
      </div>
    `
    raiz.appendChild(el)
    for (const btn of el.querySelectorAll('.gi-difi')) {
      btn.addEventListener('click', () => {
        for (const b of el.querySelectorAll('.gi-difi')) b.classList.remove('act')
        btn.classList.add('act')
        dificuldade = btn.dataset.d
      })
    }
    const start = el.querySelector('#gi-start')
    start.addEventListener('click', () => {
      el.remove()
      onStart()
    })
    start.focus()
  }

  function lerRanking() {
    try {
      const lista = JSON.parse(localStorage.getItem(CHAVE_RANKING) || '[]')
      if (!Array.isArray(lista)) return []
      return lista.filter((e) => e && typeof e.ini === 'string' && Number.isFinite(e.pts))
    } catch {
      return []
    }
  }
  function salvarRanking(lista) {
    try {
      localStorage.setItem(CHAVE_RANKING, JSON.stringify(lista))
    } catch {
      // Sem localStorage (aba privada, bloqueado): o ranking vale só nesta tela
    }
  }

  function mostrarGameOver(pts, ganhou) {
    const ranking = lerRanking()
    const falaChave = VOZ
    const fala = ganhou ? FALAS_FIM.vitoria : FALAS_FIM.derrota
    const el = document.createElement('div')
    el.id = 'game-over'
    el.innerHTML = `
      <div class="go-box">
        <div class="go-dialogo">
          ${avatarHTML(falaChave, 'go-face')}
          <div class="go-fala">${ganhou ? `"${esc(fala)}"` : esc(fala)}</div>
        </div>
        <div class="go-title">${ganhou ? TELA_FINAL.vitoria : TELA_FINAL.derrota}</div>
        <div class="go-pts">SCORE FINAL: <b>${pts}</b></div>
        <div class="go-input">
          <label for="go-iniciais">${TELA_FINAL.iniciais}</label>
          <div class="go-input-row">
            <input id="go-iniciais" maxlength="3" placeholder="AAA" autocomplete="off" spellcheck="false"/>
            <button type="button" id="go-salvar">${TELA_FINAL.salvar}</button>
          </div>
        </div>
        <div class="go-ranking">
          <div class="go-rank-title">${TELA_FINAL.ranking}</div>
          <div id="go-lista"></div>
        </div>
        <div class="go-botoes">
          <button type="button" id="go-jogar">${TELA_FINAL.jogarDeNovo}</button>
          <button type="button" id="go-voltar">${TELA_FINAL.voltar}</button>
        </div>
      </div>
    `
    raiz.appendChild(el)
    const input = el.querySelector('#go-iniciais')
    input.focus()
    input.addEventListener('input', () => {
      input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '')
    })
    function renderRanking(lista) {
      const div = el.querySelector('#go-lista')
      const top = [...lista].sort((a, b) => b.pts - a.pts).slice(0, 10)
      div.innerHTML = top.length
        ? top
            .map(
              (e, i) =>
                `<div class="go-rank-row"><span class="go-rank-pos">#${i + 1}</span><span class="go-rank-ini">${esc(e.ini)}</span><span class="go-rank-pts">${e.pts}</span></div>`,
            )
            .join('')
        : `<div class="go-rank-empty">${TELA_FINAL.semRegistros}</div>`
    }
    renderRanking(ranking)
    function salvar() {
      const bruto = input.value.trim()
      if (!bruto) {
        input.focus()
        return
      }
      const ini = bruto.padEnd(3, '?').slice(0, 3)
      ranking.push({ ini, pts })
      salvarRanking(ranking)
      renderRanking(ranking)
      el.querySelector('.go-input').innerHTML =
        `<div style="color:#FFD700;text-align:center;padding:.5em">★ ${esc(ini)} — ${pts} pts registrado!</div>`
    }
    el.querySelector('#go-salvar').addEventListener('click', salvar)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') salvar()
    })
    el.querySelector('#go-jogar').addEventListener('click', () => {
      el.remove()
      novaPartida()
    })
    el.querySelector('#go-voltar').addEventListener('click', () => sair())
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── CONTROLES ────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  function teclaMovimento(e, apertada) {
    const k = e.key.toLowerCase()
    if (jogando && TECLAS_JOGO.has(k)) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (k === 'w' || k === 'arrowup') teclas.w = apertada
    if (k === 'a' || k === 'arrowleft') teclas.a = apertada
    if (k === 's' || k === 'arrowdown') teclas.s = apertada
    if (k === 'd' || k === 'arrowright') teclas.d = apertada
  }
  ouvir(window, 'keydown', (e) => teclaMovimento(e, true), { capture: true })
  ouvir(window, 'keyup', (e) => teclaMovimento(e, false), { capture: true })
  // Esc sai do jogo em qualquer tela
  ouvir(window, 'keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      sair()
    }
  })
  // Solta as teclas se a aba perder o foco (senão a nave segue andando sozinha)
  ouvir(window, 'blur', () => {
    teclas.w = teclas.a = teclas.s = teclas.d = false
  })
  // Clique atira (menos sobre botões do HUD); sem menu de contexto nem seleção
  ouvir(raiz, 'mousedown', (e) => {
    if (e.button !== 0 || !jogando) return
    if (e.target instanceof Element && e.target.closest('button, #hud-atalhos-overlay')) return
    e.preventDefault()
    atirarLaser()
  })
  ouvir(raiz, 'contextmenu', (e) => e.preventDefault())
  ouvir(raiz, 'selectstart', (e) => {
    if (!(e.target instanceof HTMLInputElement)) e.preventDefault()
  })

  // ════════════════════════════════════════════════════════════════════════
  // ── NAVE DO JOGADOR ──────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  function criarNaveJogador() {
    if (naveJogador) descartar(naveJogador)
    naveJogador = new THREE.Group()
    NAVES[escolhido].criarCorpo(naveJogador)
    naveJogador.visible = false
    scene.add(naveJogador)
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── ITENS (voam até o jogador; coletados por tiro ou encosto) ────────────
  // ════════════════════════════════════════════════════════════════════════
  function mostrarNotificacao(msg, corHex) {
    const el = document.createElement('div')
    el.style.cssText = `position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);color:${corHex};font-family:'Courier New',monospace;font-size:1.1em;font-weight:bold;letter-spacing:3px;pointer-events:none;text-shadow:0 0 16px ${corHex};white-space:nowrap;animation:f64-fade-up 1.6s ease-out forwards;`
    el.textContent = msg
    fx.appendChild(el)
    depois(() => el.remove(), 1700)
  }

  function aplicarEfeitoItem(tipo) {
    const S = VOZ
    if (tipo === 'cura') {
      vidaNave = Math.min(100, vidaNave + 30)
      atualizarHUD()
      mostrarDialogo(S, FALAS_ITEM.curaColetada, 2500)
      mostrarNotificacao('💊 +30 SHIELD', '#00ff88')
    } else if (tipo === 'upgrade') {
      tiroUpgrade = true
      tiroUpgradeTimer = 900
      atualizarHUD()
      tocarUpgrade()
      mostrarDialogo(S, FALAS_ITEM.upgradeColetado, 2500)
      mostrarNotificacao('⚡ TWIN LASER ON', '#ffcc00')
    } else if (tipo === 'hyper') {
      tiroHyper = true
      tiroHyperTimer = 480
      tiroUpgrade = false
      atualizarHUD()
      tocarUpgrade()
      mostrarDialogo(S, FALAS_ITEM.hyperColetado, 3000)
      mostrarNotificacao('☄️ HYPER BEAM ON!', '#ff00ff')
      const fl = document.createElement('div')
      fl.style.cssText =
        'position:absolute;inset:0;pointer-events:none;background:rgba(180,0,255,0.18);animation:f64-flash .6s ease-out forwards;'
      fx.appendChild(fl)
      depois(() => fl.remove(), 700)
    }
  }

  function spawnItem(tipo) {
    const cfg = CFG_ITEM[tipo]
    const mat = new THREE.MeshBasicMaterial({ color: cfg.cor, transparent: true, opacity: 0.92 })
    const mesh = new THREE.Mesh(cfg.geo, mat)

    // Nasce bem longe, à frente da nave
    const nx = naveJogador ? naveJogador.position.x : 0
    const ny = naveJogador ? naveJogador.position.y : 2
    const nz = naveJogador ? naveJogador.position.z : 0
    mesh.position.set(nx + (Math.random() - 0.5) * 12, ny + (Math.random() - 0.5) * 4, nz - 25)

    // Luz pulsante
    mesh.add(luzPonto(cfg.cor, 5, 6))

    // Anel externo para destacar o item
    const anel = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.05, 8, 24),
      new THREE.MeshBasicMaterial({ color: cfg.cor, transparent: true, opacity: 0.6 }),
    )
    mesh.add(anel)

    mesh.userData = {
      tipo,
      vida: 700, // quadros até expirar (~11s)
      voando: true, // voa em direção à nave
      velPropria: new THREE.Vector3(),
      anel,
    }
    scene.add(mesh)
    itens.push(mesh)

    // Aviso de spawn — vem da base
    const S = VOZ
    mostrarNotificacao(`${primeiroNome(S)}: ${cfg.label}`, cfg.hex)
    mostrarDialogo(
      S,
      tipo === 'upgrade' ? FALAS_ITEM.upgradeEmRota : tipo === 'hyper' ? FALAS_ITEM.hyperEmRota : FALAS_ITEM.curaEmRota,
      3000,
    )
  }

  function atualizarItens() {
    if (!naveJogador || !jogando) return

    for (let i = itens.length - 1; i >= 0; i--) {
      const item = itens[i]
      const ud = item.userData

      // Rotação constante; o anel gira no eixo oposto
      item.rotation.y += 0.06
      item.rotation.x += 0.03
      ud.anel.rotation.z += 0.05

      // Voa suavemente em direção à nave, acelerando conforme chega perto
      if (ud.voando) {
        const dir = naveJogador.position.clone().sub(item.position)
        const dist = dir.length()
        const velocidade = Math.min(0.08 + (1 / (dist + 0.5)) * 0.3, 0.25)
        ud.velPropria.lerp(dir.normalize().multiplyScalar(velocidade), 0.04)
        item.position.add(ud.velPropria)
      }

      ud.vida--
      // Pisca quando está para expirar
      if (ud.vida < 150) item.visible = Math.floor(ud.vida / 10) % 2 === 0
      if (ud.vida <= 0) {
        descartar(item)
        itens.splice(i, 1)
        continue
      }

      // Coletado por encosto (o tiro é checado no loop dos lasers)
      if (naveJogador.position.distanceTo(item.position) < 1.1) {
        criarExplosao(item.position.clone(), item.material.color.getHex(), 0.3)
        descartar(item)
        itens.splice(i, 1)
        tocarItem()
        aplicarEfeitoItem(ud.tipo)
      }
    }

    // Contagem regressiva dos power-ups
    if (tiroHyper && tiroHyperTimer > 0) {
      tiroHyperTimer--
      if (tiroHyperTimer <= 0) {
        tiroHyper = false
        atualizarHUD()
        mostrarNotificacao('☄️ HYPER BEAM EXPIRADO', '#888888')
      }
    }
    if (tiroUpgrade && tiroUpgradeTimer > 0) {
      tiroUpgradeTimer--
      if (tiroUpgradeTimer <= 0) {
        tiroUpgrade = false
        atualizarHUD()
        mostrarNotificacao('⚡ TWIN LASER EXPIRADO', '#888888')
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── METEOROS ─────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  function spawnMeteoro() {
    const D = DIFI[dificuldade]
    const mat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0.4 + Math.random() * 0.3, 0.25 + Math.random() * 0.1, 0.1 + Math.random() * 0.1),
    })
    const mesh = new THREE.Mesh(geoMet, mat)
    const escala = D.escMin + Math.random() * D.escVar
    mesh.scale.setScalar(escala)
    mesh.position.set((Math.random() - 0.5) * 18, 0.5 + Math.random() * 7, -55 - Math.random() * 35)
    const mirarNave = Math.random() > 1 - D.perseguir && !!naveJogador
    const alvo = mirarNave
      ? naveJogador.position.clone().add(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0))
      : new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.8 + Math.random() * 1.5, 0)
    const spd = (D.velBase + Math.random() * D.velVar) * (1 + (ondaAtual - 1) * D.velEsc)
    const dir = alvo.clone().sub(mesh.position).normalize()
    mesh.userData = { vel: dir.clone().multiplyScalar(spd), rotVel: (Math.random() - 0.5) * 0.04, escala, perseguir: mirarNave }
    scene.add(mesh)
    meteoros.push(mesh)
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── LASER ────────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  function dispararRaio(offsetX, ehHyper) {
    if (!naveJogador) return
    const N = NAVES[escolhido]
    const cor = ehHyper ? N.corHyper : tiroUpgrade ? N.corUpgrade : N.corLaser
    const laser = new THREE.Mesh(ehHyper ? geoLaserHyper : geoLaserNormal, matLaser(cor))
    laser.position.copy(naveJogador.position)
    if (offsetX) laser.position.x += offsetX
    // O tiro sai da nave, mas a mira está na linha de visão da câmera. Usar só a
    // direção do raio da câmera deixava o tiro paralelo à mira, passando ao lado.
    // Agora ele vai até o ponto que está sob a mira: o meteoro ou item apontado ou,
    // sem nada ali, um ponto lá no fundo, onde os meteoros aparecem
    vMouse.set(mouseX, mouseY)
    ray.setFromCamera(vMouse, camera)
    const [acerto] = ray.intersectObjects([...meteoros, ...itens], false)
    const alvo = acerto ? acerto.point : ray.ray.at(DISTANCIA_MIRA, new THREE.Vector3())
    const dir = alvo.sub(laser.position).normalize()
    const spd = ehHyper ? 3.5 : 1.8
    laser.userData = { vel: dir.clone().multiplyScalar(spd), hitbox: ehHyper ? 1.4 : tiroUpgrade ? 0.55 : 0.45 }
    laser.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    // Sem PointLight por laser — custoso demais com vários tiros ao mesmo tempo
    scene.add(laser)
    lasers.push(laser)
  }

  function atirarLaser() {
    if (!jogando) return
    if (tiroHyper) {
      dispararRaio(0, true)
      tocarTiroHyper()
    } else {
      dispararRaio(0, false)
      if (tiroUpgrade) {
        dispararRaio(0.28, false)
        dispararRaio(-0.28, false)
        tocarTiroUpgrade()
      } else {
        tocarTiro()
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── INICIAR / PARAR PARTIDA ──────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  function iniciarJogo() {
    jogando = true
    vidaPC = 100
    vidaNave = 100
    pontos = 0
    ondaAtual = 1
    imortalidade = 0
    tiroUpgrade = false
    tiroUpgradeTimer = 0
    tiroHyper = false
    tiroHyperTimer = 0
    cutscenePausa = false
    limparObjetosDaPartida()
    criarHUD()
    atualizarHUD()
    raiz.classList.add('f64-jogando')
    iniciarMusica()
    if (naveJogador) {
      naveJogador.visible = true
      naveJogador.position.set(0, 2, 5)
      naveJogador.rotation.set(0, 0, 0)
    }
    for (let i = 0; i < 5; i++) spawnMeteoro()
    depois(() => mostrarDialogoOnda(1), 800)
  }

  function limparObjetosDaPartida() {
    for (const l of lasers) descartar(l)
    for (const m of meteoros) descartar(m)
    for (const it of itens) descartar(it)
    lasers = []
    meteoros = []
    itens = []
  }

  function pararJogo() {
    jogando = false
    pararMusica()
    raiz.classList.remove('f64-jogando')
    if (naveJogador) naveJogador.visible = false
    removerHUD()
    // Cancela falas, itens e avisos pendentes desta partida
    limparTimers()
    dialogoIntervalo = null
    dialogoTimeout = null
    fx.replaceChildren()
    limparObjetosDaPartida()
    teclas.w = teclas.a = teclas.s = teclas.d = false
  }

  // ── ATUALIZAR JOGADOR ────────────────────────────────────────────────────
  function atualizarJogador() {
    if (!jogando || !naveJogador) return
    if (imortalidade > 0) imortalidade--
    const vel = 0.12
    if (teclas.w && naveJogador.position.y < 6) naveJogador.position.y += vel
    if (teclas.s && naveJogador.position.y > 0.2) naveJogador.position.y -= vel
    if (teclas.a && naveJogador.position.x > -9) naveJogador.position.x -= vel
    if (teclas.d && naveJogador.position.x < 9) naveJogador.position.x += vel
    naveJogador.rotation.z = THREE.MathUtils.lerp(naveJogador.rotation.z, teclas.a ? 0.45 : teclas.d ? -0.45 : 0, 0.12)
    naveJogador.rotation.x = THREE.MathUtils.lerp(naveJogador.rotation.x, teclas.w ? -0.2 : teclas.s ? 0.2 : 0, 0.12)
    // A nave também é puxada de leve para onde o mouse mira
    naveJogador.position.x += (mouseX * 3 - naveJogador.position.x) * 0.02
    naveJogador.position.y += (mouseY * 1.5 + 2 - naveJogador.position.y) * 0.02
  }

  // ── LOOP DO JOGO (um passo de 1/60 s) ────────────────────────────────────
  const pcPos = new THREE.Vector3(0, 1, 0)
  const origem = new THREE.Vector3(0, 0, 0)

  function atualizarJogo() {
    if (!jogando) return

    atualizarItens()

    // Move lasers + colisão precisa por segmento
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i]
      const prev = l.position.clone()
      l.position.add(l.userData.vel)
      const hitbox = l.userData.hitbox || 0.5

      // Saiu dos limites
      if (l.position.z < -130 || l.position.z > 20 || Math.abs(l.position.x) > 60 || Math.abs(l.position.y) > 60) {
        descartar(l)
        lasers.splice(i, 1)
        continue
      }

      let removeu = false

      // Colisão com itens (ponto simples — itens são grandes e lentos)
      for (let k = itens.length - 1; k >= 0; k--) {
        if (l.position.distanceTo(itens[k].position) < 1.0) {
          const tipo = itens[k].userData.tipo
          criarExplosao(itens[k].position.clone(), itens[k].material.color.getHex(), 0.3)
          descartar(itens[k])
          itens.splice(k, 1)
          descartar(l)
          lasers.splice(i, 1)
          tocarItem()
          aplicarEfeitoItem(tipo)
          removeu = true
          break
        }
      }
      if (removeu) continue

      // Colisão com meteoros — varredura ao longo do segmento prev→atual,
      // para o laser rápido não "atravessar" o meteoro entre dois quadros
      const segDir = l.position.clone().sub(prev)
      const segLen = segDir.length()
      segDir.normalize()

      for (let j = meteoros.length - 1; j >= 0; j--) {
        const m = meteoros[j]
        const ud = m.userData
        const raioTotal = hitbox + ud.escala * 0.55
        const toM = m.position.clone().sub(prev)
        const t = Math.max(0, Math.min(segLen, toM.dot(segDir)))
        const maisPerto = prev.clone().add(segDir.clone().multiplyScalar(t))
        if (m.position.distanceTo(maisPerto) < raioTotal) {
          const corExp = tiroHyper ? 0xff00ff : tiroUpgrade ? 0xffcc00 : 0xff8800
          criarExplosao(m.position.clone(), corExp, ud.escala)
          descartar(m)
          meteoros.splice(j, 1)
          descartar(l)
          lasers.splice(i, 1)
          pontos += Math.ceil((100 * ondaAtual) / (ud.escala + 0.1))
          atualizarHUD()
          removeu = true
          break
        }
      }
      if (removeu) continue
    }

    const D = DIFI[dificuldade]
    for (let i = meteoros.length - 1; i >= 0; i--) {
      const m = meteoros[i]
      const ud = m.userData
      if (ud.perseguir && naveJogador) {
        const d = naveJogador.position.clone().sub(m.position).normalize()
        ud.vel.lerp(d.multiplyScalar(ud.vel.length()), 0.015)
      }
      m.position.add(ud.vel)
      m.rotation.x += ud.rotVel
      m.rotation.y += ud.rotVel * 0.7

      // Bateu na BASE (o computador)?
      if (m.position.distanceTo(pcPos) < 1.2 + ud.escala * 0.5) {
        vidaPC -= D.danoPC + ud.escala * D.danoPC
        criarExplosao(m.position.clone(), 0xff4400, ud.escala)
        descartar(m)
        meteoros.splice(i, 1)
        tocarDano()
        atualizarHUD()
        flashDano('base')
        if (vidaPC <= 0) {
          vidaPC = 0
          atualizarHUD()
          encerrarJogo()
          return
        }
        continue
      }

      // Bateu na nave?
      if (naveJogador && imortalidade === 0 && m.position.distanceTo(naveJogador.position) < 0.6 + ud.escala * 0.5) {
        vidaNave -= D.danoNave + ud.escala * 6
        imortalidade = D.imort
        criarExplosao(m.position.clone(), 0x0088ff, ud.escala)
        descartar(m)
        meteoros.splice(i, 1)
        tocarDano()
        atualizarHUD()
        flashDano('nave')
        if (vidaNave <= 0) {
          vidaNave = 0
          atualizarHUD()
          encerrarJogo()
          return
        }
        continue
      }

      // Passou raspando pela nave?
      if (naveJogador && m.position.z > naveJogador.position.z + 1.5) {
        const dx = m.position.x - naveJogador.position.x
        const dy = m.position.y - naveJogador.position.y
        if (Math.sqrt(dx * dx + dy * dy) < 3.5 + ud.escala && imortalidade === 0) {
          vidaNave -= D.danoPass + ud.escala * 3
          imortalidade = 45
          criarExplosao(m.position.clone(), 0x4444ff, ud.escala * 0.5)
          tocarDano()
          atualizarHUD()
          flashDano('nave')
          if (vidaNave <= 0) {
            vidaNave = 0
            atualizarHUD()
            descartar(m)
            meteoros.splice(i, 1)
            encerrarJogo()
            return
          }
        }
        descartar(m)
        meteoros.splice(i, 1)
        continue
      }

      if (m.position.distanceTo(origem) > 120) {
        descartar(m)
        meteoros.splice(i, 1)
      }
    }

    // Nova onda
    if (meteoros.length === 0 && jogando && !cutscenePausa) {
      // Onda 10 completa = vitória!
      if (ondaAtual >= 10) {
        venceuJogo()
        return
      }

      ondaAtual++
      const qtd =
        ondaAtual >= 8
          ? Math.min(D.qtdBaseAlta + ondaAtual * D.qtdEscAlta, D.qtdMaxAlta)
          : Math.min(D.qtdBase + ondaAtual * D.qtdEsc, D.qtdMax)

      for (let i = 0; i < qtd; i++) spawnMeteoro()
      flashOnda()
      atualizarHUD()
      mostrarDialogoOnda(ondaAtual)

      // Itens por onda
      if (ondaAtual === 3) {
        depois(() => spawnItem('hyper'), 1200)
        depois(() => mostrarDialogo(VOZ, FALAS_ITEM.hyperAviso, 3500), 200)
      } else if (ondaAtual >= 5 && !tiroUpgrade && !tiroHyper) {
        depois(() => spawnItem('upgrade'), 1500)
      } else if (ondaAtual >= 4) {
        depois(() => spawnItem('cura'), 1500)
      }
      // Cura extra nas ondas difíceis
      if (ondaAtual >= 6) depois(() => spawnItem('cura'), 5000)
      if (ondaAtual >= 8) depois(() => spawnItem('cura'), 9000)

    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── EXPLOSÕES (partículas animadas no loop principal, sem rAF extra) ─────
  // ════════════════════════════════════════════════════════════════════════
  function criarExplosao(pos, cor, escala = 0.5) {
    tocarExplosao(escala)
    // Limita explosões simultâneas para não travar
    if (explosoes.length > 12) descartar(explosoes.shift().grupo)
    const grupo = new THREE.Group()
    grupo.position.copy(pos)
    const ps = []
    const count = escala > 0.6 ? 10 : 7
    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geoParticula, new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: 1 }))
      p.userData.vel = new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4)
      grupo.add(p)
      ps.push(p)
    }
    scene.add(grupo)
    explosoes.push({ grupo, ps, frame: 0 })
  }

  function atualizarExplosoes() {
    for (let i = explosoes.length - 1; i >= 0; i--) {
      const e = explosoes[i]
      e.frame++
      const opacidade = 1 - e.frame / 20
      for (const p of e.ps) {
        p.position.add(p.userData.vel)
        p.material.opacity = opacidade
      }
      if (e.frame >= 20) {
        descartar(e.grupo)
        explosoes.splice(i, 1)
      }
    }
  }

  // ── FLASHES ──────────────────────────────────────────────────────────────
  function flashDano(alvo) {
    const cor = alvo === 'nave' ? 'rgba(0,100,255,0.28)' : 'rgba(255,0,0,0.28)'
    const el = document.createElement('div')
    el.style.cssText = `position:absolute;inset:0;pointer-events:none;background:${cor};animation:f64-flash .4s ease-out forwards;`
    fx.appendChild(el)
    depois(() => el.remove(), 450)
  }

  function flashOnda() {
    const el = document.createElement('div')
    el.style.cssText = `position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);color:#FFD700;font-size:3em;font-weight:bold;font-family:'Courier New',monospace;text-shadow:0 0 24px #FFD700,0 0 48px #ff8800;pointer-events:none;white-space:nowrap;animation:f64-fade-up 1.2s ease-out forwards;letter-spacing:4px;`
    el.textContent = `◆ WAVE ${ondaAtual} ◆`
    fx.appendChild(el)
    depois(() => el.remove(), 1300)
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── VITÓRIA (placar, com a câmera orbitando a nave) ──────────────────────
  // ════════════════════════════════════════════════════════════════════════
  // No original aqui vinha um diálogo entre os pilotos e uma foto pessoal
  function mostrarCenaFinal(ptsFinais) {
    const el = document.createElement('div')
    el.id = 'cf-hud'
    el.className = 'cf-hud-cheio'
    el.innerHTML = `
      <div id="cf-foto-wrap">
        <div id="cf-foto-titulo">${TELA_FINAL.vitoria}</div>
        <div id="cf-foto-sub">${TELA_FINAL.subVitoria}</div>
        <div class="cf-placar">
          <div class="cf-placar-label">SCORE FINAL</div>
          <div class="cf-placar-pts">${ptsFinais}</div>
        </div>
        <div class="cf-botoes">
          <button type="button" id="cf-btn-ranking">${TELA_FINAL.continuar}</button>
          <button type="button" id="cf-btn-jogar">${TELA_FINAL.jogarDeNovo}</button>
          <button type="button" id="cf-btn-voltar">${TELA_FINAL.voltar}</button>
        </div>
      </div>
    `
    raiz.appendChild(el)
    const wrap = el.querySelector('#cf-foto-wrap')
    wrap.style.display = 'flex'
    wrap.style.animation = 'f64-cf-entrada 1.2s ease-out forwards'

    function fecharCenaFinal() {
      el.remove()
      modoDialogo = false
      if (naveJogador) naveJogador.visible = false
    }

    const btnRanking = el.querySelector('#cf-btn-ranking')
    btnRanking.addEventListener('click', () => {
      fecharCenaFinal()
      mostrarGameOver(ptsFinais, true)
    })
    el.querySelector('#cf-btn-jogar').addEventListener('click', () => {
      fecharCenaFinal()
      novaPartida()
    })
    el.querySelector('#cf-btn-voltar').addEventListener('click', () => sair())
    btnRanking.focus()
  }

  function encerrarJogo() {
    const pts = pontos
    const ganhou = vidaNave > 0 && vidaPC > 0
    pararJogo()
    mostrarGameOver(pts, ganhou)
  }

  function venceuJogo() {
    const ptsFinais = pontos
    pararJogo()
    tocarVitoria()
    // A nave continua visível, parada, com a câmera girando em volta
    if (naveJogador) {
      naveJogador.visible = true
      naveJogador.position.set(0, 2, 5)
      naveJogador.rotation.set(0, 0, 0)
    }
    modoDialogo = true
    orbitaTempo = 0
    mostrarCenaFinal(ptsFinais)
  }

  // Instruções → partida (também usado pelo "Jogar de novo")
  function novaPartida() {
    modoDialogo = false
    if (naveJogador) naveJogador.visible = false
    criarNaveJogador()
    mostrarTelaInstrucoes(() => iniciarJogo())
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── CÂMERAS (antes viviam no animate do main.js original) ────────────────
  // ════════════════════════════════════════════════════════════════════════
  function centroFormacao() {
    const pontosF = []
    if (naveJogador?.visible) pontosF.push(naveJogador.position)
    if (pontosF.length === 0) return new THREE.Vector3(0, 2, 4)
    const centro = new THREE.Vector3()
    for (const p of pontosF) centro.add(p)
    return centro.divideScalar(pontosF.length)
  }

  function passoCamera() {
    if (modoDialogo) {
      // Órbita lenta e contínua em volta da formação (uma volta em ~80 s)
      const centro = centroFormacao()
      orbitaTempo += 0.0008
      const angulo = orbitaTempo * Math.PI * 2
      const altura = centro.y + 2.4 + Math.sin(orbitaTempo * 1.7) * 0.8
      const raio = 7.5 + Math.sin(orbitaTempo * 2.3) * 1.2
      camera.position.lerp(
        new THREE.Vector3(centro.x + Math.sin(angulo) * raio, altura, centro.z + Math.cos(angulo) * raio),
        0.018,
      )
      lookDialogo.lerp(new THREE.Vector3(centro.x, centro.y + 0.5, centro.z), 0.025)
      camera.lookAt(lookDialogo)
    } else if (jogando && naveJogador) {
      // Câmera de gameplay: atrás e acima da nave, olhando para o fundo
      camera.position.lerp(
        new THREE.Vector3(naveJogador.position.x * 0.25, naveJogador.position.y * 0.15 + 5, naveJogador.position.z + 10),
        0.06,
      )
      camera.lookAt(naveJogador.position.x * 0.3, naveJogador.position.y * 0.3 - 1, naveJogador.position.z - 30)
      lookMenu.set(naveJogador.position.x * 0.3, naveJogador.position.y * 0.3 - 1, naveJogador.position.z - 30)
    } else {
      // Menus: deriva em volta do computador (como a abertura do site original)
      tempoDeriva += 0.004
      camera.position.lerp(
        new THREE.Vector3(Math.sin(tempoDeriva) * 6, 2.5 + Math.cos(tempoDeriva * 0.8) * 0.7, Math.cos(tempoDeriva) * 6 + 2),
        0.03,
      )
      lookMenu.lerp(new THREE.Vector3(0, 1, 0), 0.05)
      camera.lookAt(lookMenu)
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── LOOP ─────────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  let rafId = 0
  let ultimo = performance.now()
  let acumulado = 0

  function passo() {
    estrelas.rotation.y += 0.0001
    if (jogando) {
      atualizarJogador()
      atualizarJogo()
    }
    atualizarExplosoes()
    passoCamera()
  }

  function animar(agora) {
    rafId = requestAnimationFrame(animar)
    // Passo fixo de 1/60 s; no máximo 4 por quadro, para não "pular" depois
    // de a aba ficar em segundo plano
    acumulado += Math.min((agora - ultimo) / 1000, 4 * PASSO)
    ultimo = agora
    while (acumulado >= PASSO) {
      passo()
      acumulado -= PASSO
    }
    renderer.render(scene, camera)
  }
  rafId = requestAnimationFrame(animar)

  novaPartida()

  // ════════════════════════════════════════════════════════════════════════
  // ── DISPOSE ──────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════
  function dispose() {
    if (descartado) return
    descartado = true
    cancelAnimationFrame(rafId)
    jogando = false
    pararMusica()
    limparTimers()
    for (const [alvo, tipo, fn, opcoes] of listeners) alvo.removeEventListener(tipo, fn, opcoes)
    listeners.length = 0
    observador.disconnect()

    // Libera tudo que está na cena e os recursos compartilhados
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        for (const m of mats) {
          for (const valor of Object.values(m)) if (valor?.isTexture) valor.dispose()
          m.dispose()
        }
      }
    })
    for (const g of geosCompartilhadas) g.dispose()
    for (const m of matLaserCache.values()) m.dispose()
    matLaserCache.clear()
    scene.clear()

    renderer.dispose()
    renderer.forceContextLoss()
    raiz.remove()
  }

  return { dispose }
}
