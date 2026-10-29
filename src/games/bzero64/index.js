import * as THREE from 'three';
import { bzAudio } from '../audio.js';
import { createComputer } from '../../three/computer.js';
import { createStars } from '../../three/space.js';
import { PILOTOS as PILOTOS_CONTEUDO, DIALOGOS } from './content.js';
import { CSS } from './styles.js';

// ══════════════════════════════════════════════════════════════════════════════
//  B-ZERO 64 — corrida de naves no estilo F-Zero, com lasers, meteoros e discos
//
//  Porte do jogo original (que rodava dentro da cena principal do site antigo)
//  para um módulo isolado: startGame({ container, player, onExit }) cria o
//  próprio renderer, cena, câmera e loop dentro do container, e dispose()
//  desfaz tudo. Todo o estado mora dentro do closure de startGame, então cada
//  chamada começa uma corrida nova, sem sobra da anterior.
//  A lógica do jogo (pista, naves, IA, tiros, meteoros, discos, câmera, HUD)
//  é a mesma do original; os comentários marcam o que mudou no porte.
// ══════════════════════════════════════════════════════════════════════════════

// ── CONSTANTES DO JOGO (puras, sem GPU: podem ficar fora do closure) ──────────

// Multiplicadores por dificuldade
const DIFF_CFG = {
    facil:   { iaVelMult: 0.80, iaDanoMult: 0.50, iaCadencia: 90, meteoroMax: 8,  meteoroVelMult: 0.70 },
    normal:  { iaVelMult: 1.00, iaDanoMult: 1.00, iaCadencia: 55, meteoroMax: 20, meteoroVelMult: 1.00 },
    dificil: { iaVelMult: 1.22, iaDanoMult: 1.60, iaCadencia: 32, meteoroMax: 30, meteoroVelMult: 1.45 },
};

// Atributos de cada nave, na mesma ordem de PILOTOS em content.js.
// Ficam aqui (e não no content.js) porque mexer neles muda o equilíbrio do jogo.
const STATS = [
    { vel: 0.00052, max: 0.00095, acel: 1.05e-6 },
    { vel: 0.00060, max: 0.00108, acel: 1.3e-6 },
    { vel: 0.00049, max: 0.00088, acel: 0.95e-6 },
    { vel: 0.00055, max: 0.00100, acel: 1.1e-6 },
];

// ── PISTA ─────────────────────────────────────────────────────────────────────
const TOTAL_VOLTAS  = 3;
const LARGURA_PISTA = 14.0;
const PISTA_LEN     = 1200;   // subdivisões da malha da pista
const ALT_BASE      = 3.0;
const LOOP_ALT      = 70;     // altura dos dois loops

// Traçado: grande oval (~900 u) com dois loops verticais suaves.
// A largada fica no meio da reta sul (índice 16).
const _SPLINE_RAW_3D = [
    // Reta norte — de oeste para leste (Z≈+320)
    [ -240.0, ALT_BASE,  320.0 ],  //  0  fecha/início
    [ -120.0, ALT_BASE,  320.0 ],  //  1
    [    0.0, ALT_BASE,  320.0 ],  //  2
    [  120.0, ALT_BASE,  320.0 ],  //  3
    [  240.0, ALT_BASE,  320.0 ],  //  4
    // Curva NE
    [  310.0, ALT_BASE,  220.0 ],  //  5
    [  350.0, ALT_BASE,  100.0 ],  //  6
    [  360.0, ALT_BASE,    0.0 ],  //  7  extremo leste
    // Loop 1
    [  350.0, ALT_BASE                    , -100.0 ],  //  8
    [  330.0, ALT_BASE + LOOP_ALT * 0.35  , -180.0 ],  //  9
    [  310.0, ALT_BASE + LOOP_ALT * 0.75  , -240.0 ],  // 10
    [  290.0, ALT_BASE + LOOP_ALT * 1.00  , -290.0 ],  // 11  topo loop 1
    [  270.0, ALT_BASE + LOOP_ALT * 0.75  , -340.0 ],  // 12
    [  240.0, ALT_BASE + LOOP_ALT * 0.35  , -380.0 ],  // 13
    [  200.0, ALT_BASE                    , -420.0 ],  // 14
    // Reta sul — de leste para oeste (Z≈-420)
    [  100.0, ALT_BASE, -420.0 ],  // 15
    [    0.0, ALT_BASE, -420.0 ],  // 16  ← LARGADA
    [ -100.0, ALT_BASE, -420.0 ],  // 17
    [ -200.0, ALT_BASE, -420.0 ],  // 18
    // Curva SO
    [ -260.0, ALT_BASE, -380.0 ],  // 19
    [ -310.0, ALT_BASE, -320.0 ],  // 20
    // Loop 2
    [ -340.0, ALT_BASE                    , -240.0 ],  // 21
    [ -355.0, ALT_BASE + LOOP_ALT * 0.35  , -170.0 ],  // 22
    [ -360.0, ALT_BASE + LOOP_ALT * 0.75  , -100.0 ],  // 23
    [ -355.0, ALT_BASE + LOOP_ALT * 1.00  ,  -20.0 ],  // 24  topo loop 2
    [ -345.0, ALT_BASE + LOOP_ALT * 0.75  ,   60.0 ],  // 25
    [ -330.0, ALT_BASE + LOOP_ALT * 0.35  ,  140.0 ],  // 26
    [ -310.0, ALT_BASE                    ,  210.0 ],  // 27
    // Curva NO → norte, fecha o circuito
    [ -280.0, ALT_BASE,  265.0 ],  // 28
    [ -260.0, ALT_BASE,  300.0 ],  // 29
    [ -240.0, ALT_BASE,  320.0 ],  // 30  = ponto 0
];

// t normalizado do ponto de largada
const PISTA_T_LARGADA = 16 / (_SPLINE_RAW_3D.length - 1);

const PISTA_CURVE = new THREE.CatmullRomCurve3(
    _SPLINE_RAW_3D.map(([x, y, z]) => new THREE.Vector3(x, y, z)), true, 'catmullrom', 0.5,
);

function pistaPos(t, latOffset = 0) {
    const pos = PISTA_CURVE.getPointAt(t);
    if (latOffset === 0) return pos;
    return pos.addScaledVector(pistaLat(t), latOffset);
}
function pistaTang(t) { return PISTA_CURVE.getTangentAt(t).normalize(); }
function pistaLat(t) {
    return new THREE.Vector3().crossVectors(pistaTang(t), new THREE.Vector3(0, 1, 0)).normalize();
}
function pistaNormal(t) {
    // Perpendicular à pista, apontando "para cima" em relação à curva
    return new THREE.Vector3().crossVectors(pistaLat(t), pistaTang(t)).normalize();
}

// ── UTILITÁRIOS DE TEXTO ──────────────────────────────────────────────────────
// O nome e a foto do jogador vêm de fora e vão para innerHTML: escapar sempre.
function esc(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}
function iniciais(nome) {
    return String(nome || '?').replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase() || '?';
}
function formatarTempo(ms) {
    const mm = Math.floor(ms / 60000), ss = Math.floor((ms % 60000) / 1000), cs = Math.floor((ms % 1000) / 10);
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

// ══════════════════════════════════════════════════════════════════════════════
//  ENTRADA
// ══════════════════════════════════════════════════════════════════════════════
export function startGame({ container, player, onExit }) {
    // ── Pilotos: o primeiro é o jogador (nome e foto vindos do React) ────────
    const nomeJogador = String(player?.name || 'VOCÊ').toUpperCase().slice(0, 12);
    const PILOTOS = PILOTOS_CONTEUDO.map((p, i) => {
        const nome = p.id === 'player' ? nomeJogador : p.nome;
        return {
            ...p,
            ...STATS[i],
            nome,
            sigla: p.sigla || iniciais(nome),
            foto: p.id === 'player' ? (player?.photo || null) : null,
        };
    });

    // ── Estado da partida ─────────────────────────────────────────────────────
    let _descartado  = false;
    let _saiu        = false;
    let _ativo       = true;
    let _correndo    = false;
    let _controlesAtivos = false;
    let _naves       = [];
    let _pistaMesh   = [];
    let _particulas  = [];
    let _lasers      = [];          // lasers do jogador
    let _lasersIA    = [];          // lasers das IAs
    let _meteoros    = [];
    let _estrelasBZ  = [];
    let _diskos      = [];          // naves destruídas que viram discos perseguidores
    let _lasersDiskoArr = [];       // mísseis dos discos
    const _explosoes = [];
    let _vidaIA      = {};          // { índice da nave: vida 0-100 }
    let _tempoInicio = 0;
    let _frame       = 0;
    let _camH        = 0;
    let _camModo     = 'normal';    // 'normal' | 'chase' | 'fp' — alterna com V
    let _camQuat     = new THREE.Quaternion();
    let _lap3Ativo   = false;
    let _vidaPlayer  = 100;
    let _tiroCD      = 0;
    let _pilotoAtual = null;
    let _dificuldade = 'normal';
    let _mouseX = 0, _mouseY = 0;
    let _flashAtivo  = null;        // só um aviso piscando por vez
    let _dialogoTimer = null;
    const _k = { w: false, s: false, a: false, d: false, boost: false };

    // ── Timers: todo setTimeout/setInterval passa por aqui para o dispose
    //    conseguir cancelar o que ainda estiver pendente ─────────────────────
    const _timers = new Set();
    const _intervalos = new Set();
    function agendar(fn, ms) {
        const id = setTimeout(() => { _timers.delete(id); if (!_descartado) fn(); }, ms);
        _timers.add(id);
        return id;
    }
    function cancelar(id) { clearTimeout(id); _timers.delete(id); }
    function repetir(fn, ms) {
        const id = setInterval(() => { if (!_descartado) fn(); }, ms);
        _intervalos.add(id);
        return id;
    }
    function pararRepeticao(id) { clearInterval(id); _intervalos.delete(id); }
    function cancelarTodosTimers() {
        _timers.forEach(clearTimeout); _timers.clear();
        _intervalos.forEach(clearInterval); _intervalos.clear();
    }

    // ── DOM: tudo dentro de uma raiz .bzero64 no container ───────────────────
    const root = document.createElement('div');
    root.className = 'bzero64';
    const estilo = document.createElement('style');
    estilo.textContent = CSS;
    root.appendChild(estilo);
    container.appendChild(root);
    const $ = sel => root.querySelector(sel);

    // ── Renderer, cena e câmera próprios (no original eram os do site) ───────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    root.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    // far maior que o 1000 do site original para as estrelas do jogo (raio até 1200) aparecerem
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1600);
    camera.position.set(0, 2, 7);
    // Mesma luz ambiente da cena do site novo (Three 0.186 usa intensidades físicas,
    // então o 0.9 do original deixaria o computador gigante escuro demais)
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    scene.add(createStars());

    function redimensionar() {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    redimensionar();
    const observador = new ResizeObserver(redimensionar);
    observador.observe(container);

    // Botão de sair sempre visível (também funciona com Esc)
    const btnSair = document.createElement('button');
    btnSair.id = 'bz-sair';
    btnSair.type = 'button';
    btnSair.textContent = '■ Sair da corrida (Esc)';
    btnSair.addEventListener('click', sair);
    root.appendChild(btnSair);

    function sair() {
        if (_saiu) return;
        _saiu = true;
        onExit?.();
    }

    // ── Descarte de objetos 3D ────────────────────────────────────────────────
    // O original só tirava os objetos da cena; aqui também liberamos a memória
    // da GPU. Geometrias compartilhadas só são liberadas no dispose final.
    const _geoLaser      = new THREE.CylinderGeometry(0.055, 0.055, 1.6, 5);
    const _geoMet        = new THREE.DodecahedronGeometry(1, 0);
    const _geoExp        = new THREE.SphereGeometry(0.14, 4, 4);
    const _geoParticula  = new THREE.SphereGeometry(0.12, 4, 4);
    const _geoMissil     = new THREE.SphereGeometry(0.28, 7, 7);
    const _geoDisko      = new THREE.CylinderGeometry(0.9, 0.9, 0.22, 14);
    const _geoDiskoTopo  = new THREE.SphereGeometry(0.42, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const GEO_COMPARTILHADAS = new Set([_geoLaser, _geoMet, _geoExp, _geoParticula, _geoMissil, _geoDisko, _geoDiskoTopo]);

    function liberar(obj) {
        obj.traverse(o => {
            if (o.geometry && !GEO_COMPARTILHADAS.has(o.geometry)) o.geometry.dispose();
            if (o.material) {
                (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
                    if (m.map) m.map.dispose();
                    m.dispose();
                });
            }
        });
    }
    function remover(obj) {
        if (!obj) return;
        scene.remove(obj);
        liberar(obj);
    }

    // ── ESTRELAS INTERNAS DO JOGO ─────────────────────────────────────────────
    function criarEstrelasBZ() {
        // Esfera grande de estrelas (raio 400-1200) ao redor da pista
        const N = 4000;
        const posArr = [];
        for (let i = 0; i < N; i++) {
            const r   = 400 + Math.random() * 800;
            const phi = Math.acos(2 * Math.random() - 1);
            const th  = Math.random() * Math.PI * 2;
            posArr.push(
                r * Math.sin(phi) * Math.cos(th),
                r * Math.cos(phi) + 20,
                r * Math.sin(phi) * Math.sin(th),
            );
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
        const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.9, sizeAttenuation: true, fog: false }));
        scene.add(pts);
        _estrelasBZ.push(pts);

        // Nebulosas: nuvens de pontos coloridos no interior da pista
        [0x0033ff, 0x8800ff, 0x00ffcc, 0xff3300, 0xffaa00].forEach((cor, ni) => {
            const nArr = [];
            const cx = (ni % 3 - 1) * 250, cz = (Math.floor(ni / 3) - 0.5) * 350;
            for (let i = 0; i < 300; i++) {
                nArr.push(cx + (Math.random() - 0.5) * 300, 20 + Math.random() * 80, cz + (Math.random() - 0.5) * 300);
            }
            const ng = new THREE.BufferGeometry();
            ng.setAttribute('position', new THREE.Float32BufferAttribute(nArr, 3));
            const np = new THREE.Points(ng, new THREE.PointsMaterial({ color: cor, size: 1.8, sizeAttenuation: true, fog: false, transparent: true, opacity: 0.35 }));
            scene.add(np);
            _estrelasBZ.push(np);
        });
    }

    // ── AVATARES ──────────────────────────────────────────────────────────────
    // Rivais: iniciais sobre um círculo na cor do piloto (sem imagens).
    // Jogador: a foto por cima das iniciais; se a foto falhar, sobram as iniciais.
    function avatarHTML(p) {
        return `<div class="bz-av" style="--bz-cor:${p.hex}">
            <span class="bz-av-sigla">${esc(p.sigla)}</span>
            ${p.foto ? `<img src="${esc(p.foto)}" alt="">` : ''}
        </div>`;
    }
    function ligarFallbackAvatares(el) {
        el.querySelectorAll('.bz-av img').forEach(img => {
            img.addEventListener('error', () => img.remove(), { once: true });
        });
    }

    // ── DIÁLOGOS NO HUD ───────────────────────────────────────────────────────
    let _dialogoEl = null;

    function criarDialogoEl() {
        if (_dialogoEl) return;
        _dialogoEl = document.createElement('div');
        _dialogoEl.id = 'bz-dialogo';
        root.appendChild(_dialogoEl);
    }

    function mostrarDialogo(piloto, tipo) {
        if (!_dialogoEl || !piloto) return;
        const frases = DIALOGOS[piloto.id]?.[tipo];
        if (!frases || !frases.length) return;
        const frase = frases[Math.floor(Math.random() * frases.length)];

        if (_dialogoTimer) cancelar(_dialogoTimer);
        // Recriar o conteúdo reinicia a animação de entrada
        _dialogoEl.innerHTML = `
            <div class="bz-dlg" style="--bz-cor:${piloto.hex}">
                ${avatarHTML(piloto)}
                <div>
                    <div class="bz-dlg-nome">${esc(piloto.nome)}</div>
                    <div class="bz-dlg-fala">"${esc(frase)}"</div>
                </div>
            </div>`;
        ligarFallbackAvatares(_dialogoEl);
        _dialogoEl.style.display = 'block';
        _dialogoTimer = agendar(() => { if (_dialogoEl) _dialogoEl.style.display = 'none'; }, 3800);
    }

    // ── MODELO DA NAVE (inspirado no Blue Falcon) ─────────────────────────────
    function criarMeshNave(cor, isPlayer) {
        const g  = new THREE.Group();
        const M  = c       => new THREE.MeshBasicMaterial({ color: c, fog: false });
        const MT = (c, op) => new THREE.MeshBasicMaterial({ color: c, fog: false, transparent: true, opacity: op });

        const corEsc  = new THREE.Color(cor).multiplyScalar(0.45).getHex();
        const corMid  = new THREE.Color(cor).multiplyScalar(0.72).getHex();
        const branco  = 0xeeeeff;
        const dourado = isPlayer ? 0xffaa00 : 0x886633;

        // Fuselagem principal
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.36, 1.10, 8), M(cor));
        body.rotation.x = Math.PI / 2;
        body.scale.set(2.2, 1.0, 1.0);
        g.add(body);

        // Proa
        const proa = new THREE.Mesh(new THREE.SphereGeometry(0.30, 8, 6), M(cor));
        proa.scale.set(2.0, 0.85, 1.6);
        proa.position.set(0, 0, -0.72);
        g.add(proa);

        // Nariz
        const nariz = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.52, 7), M(corMid));
        nariz.rotation.x = Math.PI / 2;
        nariz.position.set(0, -0.02, -1.20);
        g.add(nariz);

        const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.20, 5), M(branco));
        ponta.rotation.x = Math.PI / 2;
        ponta.position.set(0, -0.02, -1.50);
        g.add(ponta);

        // Seção traseira
        const tras = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 0.55, 8), M(corEsc));
        tras.rotation.x = Math.PI / 2;
        tras.scale.set(2.4, 1.0, 1.0);
        tras.position.set(0, 0, 0.68);
        g.add(tras);

        // Cockpit
        const ckBase = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.18, 0.55), M(corEsc));
        ckBase.position.set(0, 0.26, -0.18);
        ckBase.rotation.x = 0.18;
        g.add(ckBase);

        const ckGlass = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55),
            MT(isPlayer ? 0x001133 : 0x001122, 0.82),
        );
        ckGlass.scale.set(1.35, 0.55, 1.60);
        ckGlass.position.set(0, 0.30, -0.10);
        ckGlass.rotation.x = 0.22;
        g.add(ckGlass);

        const ckAro = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 6, 16, Math.PI), M(corMid));
        ckAro.scale.set(1.35, 1.60, 0.55);
        ckAro.position.set(0, 0.30, -0.10);
        ckAro.rotation.x = 0.22 + Math.PI;
        g.add(ckAro);

        // Asas
        [-1, 1].forEach(side => {
            const asaGeo = new THREE.BufferGeometry();
            asaGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
                0.00, -0.04, -0.20,
                0.00, -0.04,  0.35,
                side * 1.55, -0.04, 0.10,
                side * 1.55, -0.04, 0.50,
            ]), 3));
            asaGeo.setIndex([0, 1, 2, 1, 3, 2, 2, 1, 0, 2, 3, 1]);
            asaGeo.computeVertexNormals();
            g.add(new THREE.Mesh(asaGeo, MT(cor, 0.95)));

            const bordaGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, -0.04, -0.20),
                new THREE.Vector3(side * 1.55, -0.04, 0.10),
                new THREE.Vector3(side * 1.55, -0.04, 0.50),
                new THREE.Vector3(0, -0.04, 0.35),
            ]);
            g.add(new THREE.Line(bordaGeo, new THREE.LineBasicMaterial({ color: isPlayer ? branco : 0x4466aa, fog: false })));

            const faixaGeo = new THREE.BufferGeometry();
            faixaGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
                side * 0.3, -0.035, -0.05,
                side * 0.3, -0.035,  0.08,
                side * 1.0, -0.035,  0.28,
                side * 1.0, -0.035,  0.41,
            ]), 3));
            faixaGeo.setIndex([0, 1, 2, 1, 3, 2, 2, 1, 0, 2, 3, 1]);
            g.add(new THREE.Mesh(faixaGeo, MT(dourado, 0.90)));
        });

        // Aletas verticais traseiras
        [-1, 1].forEach(side => {
            const aletaGeo = new THREE.BufferGeometry();
            aletaGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
                side * 0.50, 0.00, 0.42,
                side * 0.50, 0.00, 0.82,
                side * 0.68, 0.58, 0.50,
                side * 0.68, 0.58, 0.82,
            ]), 3));
            aletaGeo.setIndex([0, 1, 2, 1, 3, 2, 2, 1, 0, 2, 3, 1]);
            aletaGeo.computeVertexNormals();
            g.add(new THREE.Mesh(aletaGeo, MT(corEsc, 0.95)));

            const bAletaGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(side * 0.50, 0.00, 0.42),
                new THREE.Vector3(side * 0.68, 0.58, 0.50),
                new THREE.Vector3(side * 0.68, 0.58, 0.82),
                new THREE.Vector3(side * 0.50, 0.00, 0.82),
            ]);
            g.add(new THREE.Line(bAletaGeo, new THREE.LineBasicMaterial({ color: isPlayer ? 0xaaccff : 0x335577, fog: false })));
        });

        // Motores
        [-0.55, 0, 0.55].forEach((ox, mi) => {
            const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.11, 0.10, 7), M(0x0a0a1a));
            motor.rotation.x = Math.PI / 2;
            motor.position.set(ox, -0.04, 0.98);
            g.add(motor);

            const chama = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.40, 7), MT(mi === 1 ? 0xff8800 : cor, 0.85));
            chama.rotation.x = -Math.PI / 2;
            chama.position.set(ox, -0.04, 1.25);
            g.add(chama);

            const lm = new THREE.PointLight(cor, mi === 1 ? 2.5 : 1.5, 5);
            lm.position.set(ox, -0.04, 1.38);
            g.add(lm);
        });

        [-1, 1].forEach(side => {
            const num = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.10, 0.22), MT(branco, 0.7));
            num.position.set(side * 0.62, 0.05, -0.30);
            g.add(num);
        });

        if (isPlayer) {
            const lf = new THREE.PointLight(0xffffff, 1.5, 18);
            lf.position.set(0, 0, -1.6);
            g.add(lf);
        }

        g.scale.setScalar(0.85);
        return g;
    }

    // ── COMPUTADOR GIGANTE NO CENTRO DA PISTA ─────────────────────────────────
    function criarMonitorGigante() {
        // Mesmo computador da cena inicial do site, em escala monumental
        const { group: pc } = createComputer();
        const escala = 18;
        pc.scale.setScalar(escala);
        pc.position.set(0, ALT_BASE, -60);
        pc.rotation.y = -Math.PI * 0.5;

        // Luzes neon como filhas do grupo: saem junto com o computador na limpeza.
        // decay 0 imita o comportamento das luzes do Three antigo (sem queda física),
        // senão o pulso some com as intensidades do original.
        const luzNeon1 = new THREE.PointLight(0x00ffcc, 10, escala * 16, 0);
        luzNeon1.position.set(0, 2.5, 0);
        pc.add(luzNeon1);

        const luzNeon2 = new THREE.PointLight(0x2266ff, 6, escala * 12, 0);
        luzNeon2.position.set(0, 1.0, 0);
        pc.add(luzNeon2);

        scene.add(pc);
        _pistaMesh.push(pc);

        pc.userData.isMonitor   = true;
        pc.userData.monitorLuz1 = luzNeon1;
        pc.userData.monitorLuz2 = luzNeon2;
        return pc;
    }

    // ── PISTA VISUAL ──────────────────────────────────────────────────────────
    function criarPistaVisual() {
        const group = new THREE.Group();
        _pistaMesh.push(group);
        scene.add(group);

        const N = PISTA_LEN;
        const W = LARGURA_PISTA / 2;

        // Superfície
        const posArr = [], idxArr = [];
        for (let i = 0; i <= N; i++) {
            const t   = i / N;
            const pos = pistaPos(t);
            const lat = pistaLat(t);
            posArr.push(
                pos.x - lat.x * W, pos.y - 0.07, pos.z - lat.z * W,
                pos.x + lat.x * W, pos.y - 0.07, pos.z + lat.z * W,
            );
            if (i < N) {
                const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
                idxArr.push(a, b, c, b, d, c);
            }
        }
        const surfGeo = new THREE.BufferGeometry();
        surfGeo.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
        surfGeo.setIndex(idxArr);
        surfGeo.computeVertexNormals();
        group.add(new THREE.Mesh(surfGeo, new THREE.MeshBasicMaterial({
            color: 0x001a33, transparent: true, opacity: 0.38,
            side: THREE.DoubleSide, fog: false, depthWrite: false,
        })));

        // Faixas
        const stripeArr = [], stripeIdx = [];
        const STRIPES = 160;
        for (let i = 0; i < STRIPES; i++) {
            if (i % 4 === 0) continue;
            const t0 = i / STRIPES, t1 = (i + 0.30) / STRIPES;
            const p0 = pistaPos(t0), p1 = pistaPos(t1);
            const l0 = pistaLat(t0),  l1 = pistaLat(t1);
            const base = stripeArr.length / 3, wS = W * 0.94;
            stripeArr.push(
                p0.x - l0.x * wS, p0.y, p0.z - l0.z * wS,
                p0.x + l0.x * wS, p0.y, p0.z + l0.z * wS,
                p1.x - l1.x * wS, p1.y, p1.z - l1.z * wS,
                p1.x + l1.x * wS, p1.y, p1.z + l1.z * wS,
            );
            stripeIdx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
        }
        const stripeGeo = new THREE.BufferGeometry();
        stripeGeo.setAttribute('position', new THREE.Float32BufferAttribute(stripeArr, 3));
        stripeGeo.setIndex(stripeIdx);
        group.add(new THREE.Mesh(stripeGeo, new THREE.MeshBasicMaterial({
            color: 0x000e22, transparent: true, opacity: 0.22,
            side: THREE.DoubleSide, fog: false, depthWrite: false,
        })));

        // Bordas
        [-W, W].forEach((side, si) => {
            const pts = [];
            for (let i = 0; i <= N; i++) {
                const t = i / N, pos = pistaPos(t), lat = pistaLat(t);
                pts.push(pos.x + lat.x * side, pos.y, pos.z + lat.z * side);
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
            group.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: si === 0 ? 0xff3300 : 0x00ccff, fog: false })));
        });

        // Linha central
        const cPts = [];
        for (let i = 0; i <= N; i += 4) { const p = pistaPos(i / N); cPts.push(p.x, p.y + 0.02, p.z); }
        const cGeo = new THREE.BufferGeometry();
        cGeo.setAttribute('position', new THREE.Float32BufferAttribute(cPts, 3));
        group.add(new THREE.Line(cGeo, new THREE.LineBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.13 })));

        // Ripas transversais
        const ripaMat = new THREE.LineBasicMaterial({ color: 0x0077bb, fog: false, transparent: true, opacity: 0.28 });
        for (let i = 0; i < 200; i++) {
            const t = i / 200, pos = pistaPos(t), lat = pistaLat(t);
            const rGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(pos.x - lat.x * W * 0.95, pos.y, pos.z - lat.z * W * 0.95),
                new THREE.Vector3(pos.x + lat.x * W * 0.95, pos.y, pos.z + lat.z * W * 0.95),
            ]);
            group.add(new THREE.Line(rGeo, ripaMat));
        }

        // Checkpoints nos 4 quadrantes
        [0.10, 0.38, PISTA_T_LARGADA, 0.78].forEach((t, ci) => {
            const pos = pistaPos(t), lat = pistaLat(t), norm = pistaNormal(t);
            const cor = ci === 0 ? 0xffdd00 : 0x00ffaa;
            const altP = 6.0;
            [-1, 1].forEach(s => {
                const base = pos.clone().addScaledVector(lat, s * W * 0.90);
                group.add(new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([base.clone(), base.clone().addScaledVector(norm, altP)]),
                    new THREE.LineBasicMaterial({ color: cor, fog: false }),
                ));
                const cil = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.28, 0.34, 0.7, 8),
                    new THREE.MeshBasicMaterial({ color: cor, fog: false, transparent: true, opacity: 0.7 }),
                );
                cil.position.copy(base);
                group.add(cil);
            });
            const pL = pos.clone().addScaledVector(lat, -W * 0.90).addScaledVector(norm, altP);
            const pR = pos.clone().addScaledVector(lat,  W * 0.90).addScaledVector(norm, altP);
            group.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([pL, pR]),
                new THREE.LineBasicMaterial({ color: cor, fog: false }),
            ));
            const lc = new THREE.PointLight(cor, 3.0, 28);
            lc.position.copy(pos).addScaledVector(norm, altP + 2);
            group.add(lc);
        });

        // Anéis dos loops
        [
            { start: 0.28, end: 0.48, cor1: 0x00ffff, cor2: 0xff6600 },
            { start: 0.72, end: 0.86, cor1: 0xff00ff, cor2: 0xffcc00 },
        ].forEach(({ start, end, cor1, cor2 }) => {
            for (let li = 0; li <= 8; li++) {
                const lt = start + (end - start) * (li / 8);
                const lpos = pistaPos(lt), llat = pistaLat(lt), lnrm = pistaNormal(lt);
                const ptsAnel = [];
                const SEG = 20, RAD = W * 1.18;
                for (let ai = 0; ai <= SEG; ai++) {
                    const ang = (ai / SEG) * Math.PI * 2;
                    ptsAnel.push(lpos.clone()
                        .addScaledVector(llat, Math.cos(ang) * RAD)
                        .addScaledVector(lnrm, Math.sin(ang) * RAD));
                }
                const anelCor = li % 2 === 0 ? cor1 : cor2;
                group.add(new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(ptsAnel),
                    new THREE.LineBasicMaterial({ color: anelCor, fog: false, transparent: true, opacity: 0.55 }),
                ));
                if (li % 2 === 0) {
                    const ll = new THREE.PointLight(anelCor, 1.5, 20);
                    ll.position.copy(lpos);
                    group.add(ll);
                }
            }
        });

        // Túneis tubulares: entrada/saída dos loops e um túnel na reta sul
        const TBSEGS = 80, TBRING = 16;
        const tubeMat   = new THREE.MeshBasicMaterial({ color: 0x001833, transparent: true, opacity: 0.55, side: THREE.BackSide, fog: false, depthWrite: false });
        const tubeEdge  = new THREE.LineBasicMaterial({ color: 0x0099ff, transparent: true, opacity: 0.70, fog: false });
        const tubeEdge2 = new THREE.LineBasicMaterial({ color: 0xff44ff, transparent: true, opacity: 0.70, fog: false });
        [
            [0.24, 0.38, tubeEdge],
            [0.38, 0.50, tubeEdge],
            [0.55, 0.64, tubeEdge2],
            [0.66, 0.80, tubeEdge2],
            [0.80, 0.90, tubeEdge2],
        ].forEach(([tS, tE, edgeMat]) => {
            const tv = [], ti = [];
            for (let si = 0; si <= TBSEGS; si++) {
                const t  = tS + (tE - tS) * (si / TBSEGS);
                const cp = pistaPos(t), cl = pistaLat(t), cn = pistaNormal(t);
                for (let ri = 0; ri <= TBRING; ri++) {
                    const ang = (ri / TBRING) * Math.PI * 2;
                    const dx = Math.cos(ang) * W * 1.12, dy = Math.sin(ang) * W * 1.12;
                    tv.push(cp.x + cl.x * dx + cn.x * dy, cp.y + cl.y * dx + cn.y * dy, cp.z + cl.z * dx + cn.z * dy);
                }
            }
            for (let si = 0; si < TBSEGS; si++) {
                for (let ri = 0; ri < TBRING; ri++) {
                    const a = si * (TBRING + 1) + ri, b = a + 1, c = a + (TBRING + 1), d = c + 1;
                    ti.push(a, b, c, b, d, c);
                }
            }
            const tg = new THREE.BufferGeometry();
            tg.setAttribute('position', new THREE.Float32BufferAttribute(tv, 3));
            tg.setIndex(ti);
            group.add(new THREE.Mesh(tg, tubeMat));
            // Anéis de borda a cada 8 segmentos
            for (let si = 0; si <= TBSEGS; si += 8) {
                const t  = tS + (tE - tS) * (si / TBSEGS);
                const cp = pistaPos(t), cl = pistaLat(t), cn = pistaNormal(t);
                const rp = [];
                for (let ri = 0; ri <= TBRING; ri++) {
                    const ang = (ri / TBRING) * Math.PI * 2;
                    const dx = Math.cos(ang) * W * 1.12, dy = Math.sin(ang) * W * 1.12;
                    rp.push(new THREE.Vector3(cp.x + cl.x * dx + cn.x * dy, cp.y + cl.y * dx + cn.y * dy, cp.z + cl.z * dx + cn.z * dy));
                }
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rp), edgeMat));
            }
        });

        // Linha de chegada — xadrez no plano da pista
        {
            const lPos  = pistaPos(PISTA_T_LARGADA);
            const lTang = pistaTang(PISTA_T_LARGADA);
            const lLat  = pistaLat(PISTA_T_LARGADA);
            const lNorm = pistaNormal(PISTA_T_LARGADA);
            const COLS = 10, ROWS = 3;
            const wCol = (W * 1.88) / COLS;
            const wRow = 1.0;
            const off  = 0.08;   // um pouco acima da superfície
            const lift = v => v.clone().addScaledVector(lNorm, off);
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const cor = (row + col) % 2 === 0 ? 0xffee00 : 0xffffff;
                    const u0 = -W * 0.94 + col * wCol, u1 = u0 + wCol;
                    const v0 = (row - ROWS / 2) * wRow, v1 = v0 + wRow;
                    const p00 = lPos.clone().addScaledVector(lLat, u0).addScaledVector(lTang, v0);
                    const p10 = lPos.clone().addScaledVector(lLat, u1).addScaledVector(lTang, v0);
                    const p01 = lPos.clone().addScaledVector(lLat, u0).addScaledVector(lTang, v1);
                    const p11 = lPos.clone().addScaledVector(lLat, u1).addScaledVector(lTang, v1);
                    const pGeo = new THREE.BufferGeometry();
                    pGeo.setAttribute('position', new THREE.Float32BufferAttribute([
                        ...lift(p00).toArray(), ...lift(p10).toArray(),
                        ...lift(p01).toArray(), ...lift(p11).toArray(),
                    ], 3));
                    pGeo.setIndex([0, 1, 2, 1, 3, 2]);
                    pGeo.computeVertexNormals();
                    group.add(new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({
                        color: cor, fog: false, transparent: true, opacity: 0.95, side: THREE.DoubleSide,
                    })));
                }
            }
            const lLuz = new THREE.PointLight(0xffdd00, 4.0, 28);
            lLuz.position.copy(lPos).addScaledVector(lNorm, 5);
            group.add(lLuz);
        }

        criarMonitorGigante();
    }

    // ── NAVES ─────────────────────────────────────────────────────────────────
    function criarNaves(pilotoIdx) {
        _naves = [];
        const offsets = [0.000, 0.003, 0.006, 0.009].map(o => PISTA_T_LARGADA + o);
        PILOTOS.forEach((p, i) => {
            const t = offsets[i];
            const lat = i % 2 === 0 ? -LARGURA_PISTA * 0.16 : LARGURA_PISTA * 0.16;
            const mesh = criarMeshNave(p.cor, i === pilotoIdx);
            mesh.position.copy(pistaPos(t, lat));
            scene.add(mesh);
            // Orientação certa já na largada, para não começar na diagonal
            const tang0 = pistaTang(t);
            const tangNext0 = pistaTang((t + 0.002) % 1);
            const up0 = new THREE.Vector3().crossVectors(tang0, tangNext0);
            if (up0.lengthSq() < 1e-6) up0.set(0, 1, 0); else { up0.normalize(); if (up0.y < -0.1) up0.negate(); }
            const cima0 = up0.clone().sub(tang0.clone().multiplyScalar(up0.dot(tang0))).normalize();
            const dir0  = new THREE.Vector3().crossVectors(tang0, cima0).normalize();
            mesh.setRotationFromMatrix(new THREE.Matrix4().makeBasis(dir0, cima0, tang0.clone().negate()));

            _naves.push({
                mesh, t,
                tPrev: t,
                latOff: lat, latAlvo: lat,
                velAtual: p.vel, velBase: p.vel, velMax: p.max, acel: p.acel,
                isPlayer: i === pilotoIdx,
                cor: p.cor, hex: p.hex, nome: p.nome,
                volta: 0, distTotal: t, chegou: false, destruida: false,
                penalidade: 0,
                bankSmooth: 0,
                upSmooth: up0.clone(),
            });
            if (i !== pilotoIdx) _vidaIA[i] = 100;
        });
    }

    // ── PARTÍCULAS DO RASTRO ──────────────────────────────────────────────────
    function emitirParticula(nave) {
        const mat = new THREE.MeshBasicMaterial({ color: nave.cor, fog: false, transparent: true, opacity: 0.55 });
        const p = new THREE.Mesh(_geoParticula, mat);
        p.position.copy(nave.mesh.position)
            .sub(pistaTang(nave.t).multiplyScalar(0.9))
            .add(new THREE.Vector3((Math.random() - .5) * .5, (Math.random() - .5) * .3, (Math.random() - .5) * .5));
        scene.add(p);
        _particulas.push({ mesh: p, vida: 24, max: 24 });
    }

    function atualizarParticulas() {
        for (let i = _particulas.length - 1; i >= 0; i--) {
            const p = _particulas[i];
            p.vida--;
            p.mesh.material.opacity = (p.vida / p.max) * 0.55;
            p.mesh.position.y += 0.007;
            if (p.vida <= 0) { remover(p.mesh); _particulas.splice(i, 1); }
        }
    }

    // ── TIROS ─────────────────────────────────────────────────────────────────
    let _miraEl = null;

    function atirarMouse() {
        if (_tiroCD > 0) return;
        _tiroCD = 10;
        bzAudio.init();
        bzAudio.tiro();
        const player = _naves.find(n => n.isPlayer);
        if (!player) return;
        const raio = new THREE.Raycaster();
        raio.setFromCamera(new THREE.Vector2(_mouseX, _mouseY), camera);
        const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), -player.mesh.position.y);
        const alvoMira = new THREE.Vector3();
        const hit = raio.ray.intersectPlane(plano, alvoMira);
        const origem = player.mesh.position.clone();
        let dir;
        if (hit && alvoMira.distanceTo(origem) > 1.5) dir = alvoMira.clone().sub(origem).normalize();
        else dir = pistaTang(player.t).negate();
        const lat = pistaLat(player.t);
        [-1.0, 1.0].forEach(lado => {
            const laser = new THREE.Mesh(_geoLaser, new THREE.MeshBasicMaterial({ color: 0x00ffff, fog: false }));
            laser.position.copy(origem).addScaledVector(lat, lado * 0.85);
            laser.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            laser.add(new THREE.PointLight(0x00ffff, 3, 6));
            laser.userData = { vel: dir.clone().multiplyScalar(1.8), vida: 80 };
            scene.add(laser);
            _lasers.push(laser);
        });
    }

    // IAs atiram no jogador quando ele está perto
    function atirarIA(nave) {
        const player = _naves.find(n => n.isPlayer);
        if (!player || player.chegou) return;
        if (nave.mesh.position.distanceTo(player.mesh.position) > 80) return;
        const dir = player.mesh.position.clone().sub(nave.mesh.position).normalize();
        const lat = pistaLat(nave.t);
        [-0.8, 0.8].forEach(lado => {
            bzAudio.tiroIA();
            const laser = new THREE.Mesh(_geoLaser, new THREE.MeshBasicMaterial({ color: nave.cor, fog: false, transparent: true, opacity: 0.85 }));
            laser.position.copy(nave.mesh.position).addScaledVector(lat, lado);
            laser.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            laser.add(new THREE.PointLight(nave.cor, 2, 5));
            laser.userData = { vel: dir.clone().multiplyScalar(1.6), vida: 70 };
            scene.add(laser);
            _lasersIA.push(laser);
        });
    }

    // Dano no jogador (lasers, meteoros e mísseis usam o mesmo caminho)
    function danoNoPlayer(dano, texto, corTexto) {
        const vidaAntes = _vidaPlayer;
        _vidaPlayer = Math.max(0, _vidaPlayer - dano);
        bzAudio.dano();
        flashEvento(texto, corTexto);
        atualizarHUD();
        if (_vidaPlayer <= 30 && vidaAntes > 30) agendar(() => mostrarDialogo(_pilotoAtual, 'vidaBaixa'), 300);
        if (_vidaPlayer <= 0) destruirPlayer();
    }

    function atualizarLasers() {
        const player = _naves.find(n => n.isPlayer);

        // Lasers do jogador
        for (let i = _lasers.length - 1; i >= 0; i--) {
            const l = _lasers[i];
            l.userData.vida--;
            l.position.addScaledVector(l.userData.vel, 1);
            let hit = false;

            // Acerta meteoro
            for (let j = _meteoros.length - 1; j >= 0; j--) {
                if (l.position.distanceTo(_meteoros[j].mesh.position) < 2.5) {
                    remover(_meteoros[j].mesh); _meteoros.splice(j, 1);
                    criarExplosao(l.position.clone(), 0x00ffff);
                    bzAudio.explosao(0.4);
                    hit = true; break;
                }
            }

            // Acerta nave da IA: dano real, pode destruí-la
            if (!hit) {
                for (let j = 0; j < _naves.length; j++) {
                    const n = _naves[j];
                    if (n.isPlayer || n.chegou || n.destruida) continue;
                    if (l.position.distanceTo(n.mesh.position) < 2.8) {
                        if (_vidaIA[j] === undefined) _vidaIA[j] = 100;
                        _vidaIA[j] -= 28;
                        criarExplosao(l.position.clone(), n.cor);
                        bzAudio.explosao(0.5);
                        hit = true;
                        if (_vidaIA[j] <= 0) {
                            _vidaIA[j] = 0;
                            destruirNaveIA(n);
                        } else {
                            n.penalidade = 60;
                            flashEvento(`🎯 ${n.nome} -28 SHIELD`, n.hex);
                        }
                        break;
                    }
                }
            }

            // Acerta disco
            if (!hit) {
                for (let j = _diskos.length - 1; j >= 0; j--) {
                    const d = _diskos[j];
                    if (!d.ativo) continue;
                    if (l.position.distanceTo(d.mesh.position) < 1.8) {
                        d.ativo = false;
                        criarExplosao(d.mesh.position.clone(), d.cor);
                        criarExplosao(d.mesh.position.clone(), 0xffffff);
                        bzAudio.explosao(0.6);
                        flashEvento(`💫 ${d.nome} DISCO DESTRUÍDO!`, '#ff88ff');
                        // Procura o disco pelo objeto (o índice j pode mudar em 80 ms)
                        agendar(() => {
                            remover(d.mesh);
                            const k = _diskos.indexOf(d);
                            if (k >= 0) _diskos.splice(k, 1);
                        }, 80);
                        hit = true; break;
                    }
                }
            }
            if (hit || l.userData.vida <= 0) { remover(l); _lasers.splice(i, 1); }
        }

        // Lasers das IAs
        for (let i = _lasersIA.length - 1; i >= 0; i--) {
            const l = _lasersIA[i];
            l.userData.vida--;
            l.position.addScaledVector(l.userData.vel, 1);
            let hit = false;
            if (player && !player.chegou && !player.destruida && l.position.distanceTo(player.mesh.position) < 2.5) {
                const dano = Math.round(14 * DIFF_CFG[_dificuldade].iaDanoMult);
                criarExplosao(l.position.clone(), 0xff2200);
                hit = true;
                danoNoPlayer(dano, `⚡ -${dano} SHIELD`, '#ff4400');
            }
            if (hit || l.userData.vida <= 0) { remover(l); _lasersIA.splice(i, 1); }
        }
    }

    function atualizarTiroIA() {
        if (!_correndo) return;
        const cadencia = DIFF_CFG[_dificuldade].iaCadencia;
        _naves.forEach((n, idx) => {
            if (n.isPlayer || n.chegou || n.destruida) return;
            if (_frame % (cadencia + idx * 17) === 0) atirarIA(n);
        });
    }

    // ── METEOROS (3ª volta) ───────────────────────────────────────────────────
    function spawnMeteoro() {
        if (!_ativo) return;
        const tAlvo = Math.random(), latAlvo = (Math.random() - .5) * LARGURA_PISTA * 0.82;
        const alvo = pistaPos(tAlvo, latAlvo);
        const escala = 0.5 + Math.random() * 1.1;
        const cor = new THREE.Color(0.45 + Math.random() * .3, 0.28 + Math.random() * .1, 0.1 + Math.random() * .1);
        const mesh = new THREE.Mesh(_geoMet, new THREE.MeshBasicMaterial({ color: cor, fog: false }));
        mesh.scale.setScalar(escala);
        const spawnPos = alvo.clone()
            .addScaledVector(pistaTang(tAlvo), -(160 + Math.random() * 100))
            .add(new THREE.Vector3((Math.random() - .5) * 36, 24 + Math.random() * 48, (Math.random() - .5) * 36));
        mesh.position.copy(spawnPos);
        scene.add(mesh);
        const vel = alvo.clone().sub(spawnPos).normalize().multiplyScalar(0.40 + Math.random() * 0.22);
        _meteoros.push({ mesh, escala, vel, alvo, rotVel: (Math.random() - .5) * .055 });
    }

    function atualizarMeteoros() {
        const cfg = DIFF_CFG[_dificuldade];
        if (_lap3Ativo && _frame % 42 === 0 && _meteoros.length < cfg.meteoroMax) spawnMeteoro();
        const player = _naves.find(n => n.isPlayer);
        for (let i = _meteoros.length - 1; i >= 0; i--) {
            const m = _meteoros[i];
            m.mesh.position.addScaledVector(m.vel, cfg.meteoroVelMult);
            m.mesh.rotation.x += m.rotVel;
            m.mesh.rotation.y += m.rotVel * 0.7;
            if (player && !player.chegou && !player.destruida) {
                const dist = m.mesh.position.distanceTo(player.mesh.position);
                if (dist < 2.2 + m.escala) {
                    const dano = Math.round(18 * cfg.iaDanoMult);
                    criarExplosao(m.mesh.position.clone(), 0xff4400);
                    bzAudio.explosao(0.5 + m.escala * 0.3);
                    remover(m.mesh); _meteoros.splice(i, 1);
                    danoNoPlayer(dano, `💥 -${dano} SHIELD`, '#ff4400');
                    continue;
                } else if (dist < 10 + m.escala) {
                    bzAudio.meteoro();
                }
            }
            if (m.mesh.position.distanceTo(m.alvo) < 1.8) {
                bzAudio.explosao(m.escala * 0.4);
                criarExplosao(m.mesh.position.clone(), 0xff6600);
                remover(m.mesh); _meteoros.splice(i, 1);
            }
        }
    }

    // ── EXPLOSÕES ─────────────────────────────────────────────────────────────
    function criarExplosao(pos, cor) {
        if (!_ativo) return;
        const grupo = new THREE.Group(); grupo.position.copy(pos);
        const ps = [];
        for (let i = 0; i < 10; i++) {
            const p = new THREE.Mesh(_geoExp, new THREE.MeshBasicMaterial({ color: cor, fog: false, transparent: true, opacity: 1 }));
            p.userData.vel = new THREE.Vector3((Math.random() - .5) * .6, (Math.random() - .5) * .6, (Math.random() - .5) * .6);
            grupo.add(p); ps.push(p);
        }
        const luz = new THREE.PointLight(cor, 5, 9);
        grupo.add(luz); scene.add(grupo);
        _explosoes.push({ grupo, ps, luz, frame: 0 });
    }

    function atualizarExplosoes() {
        for (let i = _explosoes.length - 1; i >= 0; i--) {
            const e = _explosoes[i]; e.frame++;
            const op = 1 - e.frame / 20;
            e.ps.forEach(p => { p.position.add(p.userData.vel); p.material.opacity = op; });
            e.luz.intensity = op * 5;
            if (e.frame >= 20) { remover(e.grupo); _explosoes.splice(i, 1); }
        }
    }

    // ── LIMPAR (entre partidas) ───────────────────────────────────────────────
    function limpar() {
        _naves.forEach(n => remover(n.mesh));
        _pistaMesh.forEach(remover);
        _particulas.forEach(p => remover(p.mesh));
        _lasers.forEach(remover);
        _lasersIA.forEach(remover);
        _meteoros.forEach(m => remover(m.mesh));
        _explosoes.forEach(e => remover(e.grupo));
        _estrelasBZ.forEach(remover);
        _diskos.forEach(d => remover(d.mesh));
        _lasersDiskoArr.forEach(remover);
        _naves = []; _pistaMesh = []; _particulas = []; _lasers = []; _lasersIA = [];
        _meteoros = []; _explosoes.length = 0; _estrelasBZ = [];
        _diskos = []; _lasersDiskoArr = [];
        _vidaIA = {};
        if (_hudEl) { _hudEl.remove(); _hudEl = null; }
        if (_dialogoEl) { _dialogoEl.remove(); _dialogoEl = null; }
        if (_dialogoTimer) { cancelar(_dialogoTimer); _dialogoTimer = null; }
        removerMira();
        if (_flashAtivo) { _flashAtivo.remove(); _flashAtivo = null; }
        _pilotoAtual = null;
        _lap3Ativo = false; _vidaPlayer = 100; _tiroCD = 0;
        _camModo = 'normal';
        _camQuat = new THREE.Quaternion();
    }

    // ── CONTROLES ─────────────────────────────────────────────────────────────
    // No original os listeners iam para window e o mouse era capturado na
    // página toda. Aqui: teclado no window (precisa funcionar sem foco), mouse
    // só no canvas do jogo, para não atirar ao clicar em botões.
    function criarMira() {
        removerMira();
        _miraEl = document.createElement('div');
        _miraEl.id = 'bz-mira';
        _miraEl.innerHTML = '<div class="bz-mira-anel"></div><div class="bz-mira-cruz bz-h"></div><div class="bz-mira-cruz bz-v"></div><div class="bz-mira-dot"></div>';
        _miraEl.style.left = '50%'; _miraEl.style.top = '50%';
        root.appendChild(_miraEl);
    }
    function removerMira() { if (_miraEl) { _miraEl.remove(); _miraEl = null; } }

    function aoMoverMouse(e) {
        const r = root.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        _mouseX = (x / r.width) * 2 - 1;
        _mouseY = -(y / r.height) * 2 + 1;
        if (_miraEl) { _miraEl.style.left = x + 'px'; _miraEl.style.top = y + 'px'; }
    }
    function aoClicar(e) {
        if (!_controlesAtivos || e.button !== 0 || e.target !== renderer.domElement) return;
        e.preventDefault();
        atirarMouse();
    }

    function aoTeclar(e) {
        const k = e.key.toLowerCase();
        // Esc sai do jogo em qualquer tela (seleção, corrida, resultado)
        if (k === 'escape') { e.preventDefault(); sair(); return; }
        if (!_controlesAtivos) return;
        if (k === 'w' || k === 'arrowup')    { _k.w = true; e.preventDefault(); bzAudio.init(); }
        if (k === 's' || k === 'arrowdown')  { _k.s = true; e.preventDefault(); }
        if (k === 'a' || k === 'arrowleft')  { _k.a = true; e.preventDefault(); }
        if (k === 'd' || k === 'arrowright') { _k.d = true; e.preventDefault(); }
        if (k === ' ') { _k.boost = true; e.preventDefault(); bzAudio.boost(); }
        if (k === 'v' && !e.repeat) {
            const modos = ['normal', 'chase', 'fp'];
            _camModo = modos[(modos.indexOf(_camModo) + 1) % modos.length];
            const labels = { normal: '📷 CAM NORMAL', chase: '📷 CHASE CAM', fp: '👁 1ª PESSOA' };
            flashEvento(labels[_camModo], '#00ddff');
            atualizarIndicadorCam();
            e.preventDefault();
        }
    }
    function aoSoltar(e) {
        const k = e.key.toLowerCase();
        if (k === 'w' || k === 'arrowup')    _k.w = false;
        if (k === 's' || k === 'arrowdown')  _k.s = false;
        if (k === 'a' || k === 'arrowleft')  _k.a = false;
        if (k === 'd' || k === 'arrowright') _k.d = false;
        if (k === ' ') _k.boost = false;
    }
    // Trocar de aba com uma tecla apertada deixaria ela "presa"
    function soltarTudo() { Object.keys(_k).forEach(k => { _k[k] = false; }); }

    window.addEventListener('keydown', aoTeclar);
    window.addEventListener('keyup', aoSoltar);
    window.addEventListener('blur', soltarTudo);
    root.addEventListener('mousedown', aoClicar);
    root.addEventListener('mousemove', aoMoverMouse);

    function ligarControles() {
        _controlesAtivos = true;
        criarMira();
        root.classList.add('bz-sem-cursor');
    }
    function desligarControles() {
        _controlesAtivos = false;
        soltarTudo();
        removerMira();
        root.classList.remove('bz-sem-cursor');
    }

    // ── CÂMERA ────────────────────────────────────────────────────────────────
    function atualizarCam(player) {
        if (!player) return;
        const pos  = player.mesh.position;
        const tang = pistaTang(player.t);
        const norm = pistaNormal(player.t);

        if (_camModo === 'chase') {
            // Baixa e grudada na nave
            _camH *= 0.94;
            const dest = pos.clone().addScaledVector(tang, -3.5).addScaledVector(norm, 0.9 + _camH * 0.4);
            camera.position.lerp(dest, 0.22);
            camera.lookAt(pos.clone().addScaledVector(tang, 5.0).addScaledVector(norm, 0.5));
        } else if (_camModo === 'fp') {
            // Primeira pessoa, dentro do cockpit; usa o mesmo "cima" suavizado da nave
            const up = player.upSmooth.clone();
            const frente = tang.clone();
            const cima = up.clone().sub(frente.clone().multiplyScalar(up.dot(frente))).normalize();
            const cockpitPos = pos.clone().addScaledVector(cima, 0.30).addScaledVector(frente, 0.55);
            // Oscilação sutil da suspensão
            cockpitPos.addScaledVector(cima, Math.sin(_frame * 0.07) * 0.012);
            // Posição sem lerp (atraso aqui enjoa); rotação suavizada para não tremer
            camera.position.copy(cockpitPos);
            const lookTarget = cockpitPos.clone().addScaledVector(frente, 10.0);
            const mx = new THREE.Matrix4().lookAt(cockpitPos, lookTarget, cima);
            _camQuat.slerp(new THREE.Quaternion().setFromRotationMatrix(mx), 0.18);
            camera.quaternion.copy(_camQuat);
        } else {
            // Traseira alta (padrão)
            _camH *= 0.96;
            const dest = pos.clone().addScaledVector(tang, -10).addScaledVector(norm, 4.5 + _camH);
            camera.position.lerp(dest, 0.10);
            camera.lookAt(pos.clone().addScaledVector(norm, 1.0));
        }
    }

    // ── HUD ───────────────────────────────────────────────────────────────────
    let _hudEl = null;

    function criarHUD() {
        if (_hudEl) _hudEl.remove();
        _hudEl = document.createElement('div');
        _hudEl.id = 'bz-hud';
        const p = _pilotoAtual;
        _hudEl.innerHTML = `
            <div id="bz-topo">
                <div id="bz-titulo">★ B-ZERO 64 ★</div>
                <div id="bz-volta">VOLTA 1 / ${TOTAL_VOLTAS}</div>
                <div id="bz-tempo">00:00.00</div>
            </div>
            <div id="bz-ranking">
                <div id="bz-rank-tit">◆ POSIÇÕES ◆</div>
                <div id="bz-rank-lista"></div>
            </div>
            <div id="bz-speedo">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    ${avatarHTML(p)}
                    <div style="flex:1;min-width:0;">
                        <div style="color:${p.hex};font-size:.6em;letter-spacing:2px;font-weight:bold;margin-bottom:2px;">${esc(p.nome)}</div>
                        <div style="color:#456070;font-size:.52em;letter-spacing:1px;">VELOCIDADE</div>
                        <div style="display:flex;align-items:baseline;gap:3px;">
                            <div id="bz-spd-val" style="color:#00eeff;font-size:1.5em;font-weight:bold;text-shadow:0 0 12px #00eeffcc;line-height:1;">000</div>
                            <div style="color:#5a6f80;font-size:.55em;letter-spacing:1px;">km/h</div>
                        </div>
                    </div>
                </div>
                <div style="color:#456070;font-size:.55em;letter-spacing:1px;margin-top:2px">SHIELD</div>
                <div style="width:100%;height:5px;background:rgba(255,255,255,.1);border-radius:3px;margin-top:3px">
                    <div id="bz-shield-fill" style="height:100%;width:100%;background:#00ff88;border-radius:3px;transition:width .2s,background .3s"></div>
                </div>
            </div>
            <div id="bz-lap3-warn">⚠ METEOROS<br>DETECTADOS</div>
            <div id="bz-cam-ind">
                <div class="bz-cam-dot" data-cam="normal" title="Normal">◼</div>
                <div class="bz-cam-dot" data-cam="chase"  title="Chase">◼</div>
                <div class="bz-cam-dot" data-cam="fp"     title="1ª Pessoa">◼</div>
            </div>`;
        ligarFallbackAvatares(_hudEl);
        root.appendChild(_hudEl);
        atualizarIndicadorCam();
    }

    function atualizarIndicadorCam() {
        root.querySelectorAll('.bz-cam-dot').forEach(d => d.classList.toggle('act', d.dataset.cam === _camModo));
    }

    function atualizarHUD() {
        if (!_hudEl) return;
        const ord = [..._naves].sort((a, b) => b.distTotal - a.distTotal);
        const lista = $('#bz-rank-lista');
        if (lista) lista.innerHTML = ord.map((n, i) => {
            const idx = _naves.indexOf(n);
            const vida = _vidaIA[idx] || 0;
            const vidaStr = n.isPlayer
                ? ''
                : n.destruida
                    ? '<span style="color:#ff4444;font-size:.72em">💥</span>'
                    : `<span style="display:inline-block;width:30px;height:4px;background:rgba(255,255,255,.1);border-radius:2px;vertical-align:middle;margin-left:3px"><span style="display:block;height:100%;width:${vida}%;background:${vida > 50 ? n.hex : '#ff4444'};border-radius:2px"></span></span>`;
            return `<div class="bz-rrow">
                <span class="bz-rpos">${i + 1}°</span>
                <span class="bz-rnome" style="${n.isPlayer ? 'color:#ffcc00;font-weight:bold' : ''}">${esc(n.nome)}</span>
                ${vidaStr}
                <span class="bz-rvolt">V${Math.min(n.volta + 1, TOTAL_VOLTAS)}</span>
            </div>`;
        }).join('');
        const player = _naves.find(n => n.isPlayer);
        if (player) {
            const vi = $('#bz-volta');
            if (vi) vi.textContent = `VOLTA ${Math.min(player.volta + 1, TOTAL_VOLTAS)} / ${TOTAL_VOLTAS}`;
            const sv = $('#bz-spd-val');
            if (sv) sv.textContent = String(Math.round((player.velAtual / player.velMax) * 999)).padStart(3, '0');
        }
        const fill = $('#bz-shield-fill');
        if (fill) { fill.style.width = _vidaPlayer + '%'; fill.style.background = _vidaPlayer > 60 ? '#00ff88' : _vidaPlayer > 30 ? '#ffcc00' : '#ff4400'; }
        const warn = $('#bz-lap3-warn');
        if (warn) warn.style.display = _lap3Ativo ? 'block' : 'none';
        if (_correndo) {
            const t = $('#bz-tempo');
            if (t) t.textContent = formatarTempo(Date.now() - _tempoInicio);
        }
    }

    function flashEvento(texto, cor) {
        // Só um aviso por vez: o anterior some na hora
        if (_flashAtivo) { _flashAtivo.remove(); _flashAtivo = null; }
        const el = document.createElement('div');
        el.className = 'bz-flash';
        el.style.color = cor;
        el.style.textShadow = `0 0 14px ${cor},0 0 28px ${cor}66`;
        el.textContent = texto;
        root.appendChild(el);
        _flashAtivo = el;
        agendar(() => { el.remove(); if (_flashAtivo === el) _flashAtivo = null; }, 1600);
    }

    function countdown(onGo) {
        const wrap = document.createElement('div'); wrap.id = 'bz-countdown';
        const num = document.createElement('div');  num.id = 'bz-cd-num';
        wrap.appendChild(num); root.appendChild(wrap);
        let v = 3; num.textContent = v; bzAudio.ui('countdown');
        const iv = repetir(() => {
            v--;
            // Reinicia a animação de pulso a cada número
            num.style.animation = 'none'; void num.offsetHeight;
            num.style.animation = 'bz-cdpulse .85s ease-in-out';
            if (v > 0) { num.textContent = v; bzAudio.ui('countdown'); }
            else {
                num.textContent = 'GO!!'; num.classList.add('go'); bzAudio.ui('go');
                pararRepeticao(iv);
                agendar(() => { wrap.remove(); onGo(); }, 750);
            }
        }, 950);
    }

    // ── FIM DE JOGO ───────────────────────────────────────────────────────────
    function mostrarGameOver() {
        _correndo = false;
        desligarControles();
        const tStr = formatarTempo(Date.now() - _tempoInicio);
        const el = document.createElement('div'); el.id = 'bz-resultado';
        el.innerHTML = `
            <div id="bz-res-box" class="gameover">
                <div id="bz-res-titulo" style="color:#ff4400;text-shadow:0 0 18px #ff440099">💀 GAME OVER 💀</div>
                <div id="bz-res-pos" style="color:#ff2200;font-size:2.8em">NAVE DESTRUÍDA</div>
                <div id="bz-res-tempo" style="color:#ff6644">SOBREVIVEU: ${tStr}</div>
                <div style="color:#667788;font-size:.72em;letter-spacing:1px;margin:14px 0 8px">SUA NAVE FOI ELIMINADA DA CORRIDA</div>
                <button type="button" id="bz-res-voltar" style="border-color:rgba(255,80,0,.4);color:#ff8844">◀ VOLTAR</button>
                <button type="button" id="bz-res-tentar">▶ TENTAR DE NOVO</button>
            </div>`;
        root.appendChild(el);
        el.querySelector('#bz-res-voltar').addEventListener('click', sair);
        el.querySelector('#bz-res-tentar').addEventListener('click', reiniciarJogo);
    }

    function mostrarResultado() {
        desligarControles();
        const tStr = formatarTempo(Date.now() - _tempoInicio);
        const ord = [..._naves].sort((a, b) => b.distTotal - a.distTotal);
        const pos = ord.findIndex(n => n.isPlayer) + 1;
        const med = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : '💀';
        const msg = pos === 1 ? 'VITÓRIA!!' : pos === 2 ? '2° LUGAR!' : pos === 3 ? '3° LUGAR!' : `${pos}° LUGAR`;
        const corP = pos === 1 ? '#ffcc00' : pos <= 3 ? '#aaccff' : '#ff4444';
        const el = document.createElement('div'); el.id = 'bz-resultado';
        el.innerHTML = `
            <div id="bz-res-box">
                <div id="bz-res-titulo">★ CORRIDA ENCERRADA ★</div>
                <div id="bz-res-pos" style="color:${corP}">${med} ${msg}</div>
                <div id="bz-res-tempo">TEMPO: ${tStr}</div>
                ${ord.map((n, i) => `<div class="bz-res-row">
                    <span class="bz-res-p">${i + 1}°</span>
                    <span class="bz-res-n" style="${n.isPlayer ? 'color:#ffcc00;font-weight:bold' : ''}">${esc(n.nome)}</span>
                    <span class="bz-res-t">${n.isPlayer ? tStr : '---'}</span>
                </div>`).join('')}
                <button type="button" id="bz-res-voltar">◀ VOLTAR</button>
                <button type="button" id="bz-res-tentar">▶ JOGAR DE NOVO</button>
            </div>`;
        root.appendChild(el);
        el.querySelector('#bz-res-voltar').addEventListener('click', sair);
        el.querySelector('#bz-res-tentar').addEventListener('click', reiniciarJogo);
    }

    function reiniciarJogo() {
        // Para o motor e reinicia o som ambiente antes de qualquer outra coisa
        bzAudio.resetar();
        // Timers pendentes da partida anterior (explosões, diálogos) não podem
        // disparar na nova
        cancelarTodosTimers();
        _correndo = false; _lap3Ativo = false; _frame = 0; _camH = 0; _vidaPlayer = 100; _tiroCD = 0;
        desligarControles();
        limpar();
        root.querySelectorAll('#bz-selecao,#bz-instrucoes,#bz-countdown,#bz-resultado,.bz-flash').forEach(e => e.remove());
        mostrarSelecao(iniciarCorrida);
    }

    function destruirPlayer() {
        if (!_correndo) return;
        const player = _naves.find(n => n.isPlayer);
        if (!player || player.destruida) return;
        player.destruida = true;
        player.chegou    = true;
        _correndo        = false;
        bzAudio.pararMotor();

        // Explosão grande, em ondas
        bzAudio.explosao(1.0);
        for (let w = 0; w < 4; w++) {
            agendar(() => {
                const p = player.mesh.position;
                criarExplosao(p.clone(), 0xff4400);
                criarExplosao(p.clone().add(new THREE.Vector3((Math.random() - .5) * 3, (Math.random() - .5) * 3, (Math.random() - .5) * 3)), 0xffcc00);
                criarExplosao(p.clone().add(new THREE.Vector3((Math.random() - .5) * 2, (Math.random() - .5) * 2, (Math.random() - .5) * 2)), 0xffffff);
            }, w * 180);
        }
        agendar(() => { scene.remove(player.mesh); }, 300);
        agendar(() => mostrarDialogo(_pilotoAtual, 'derrota'), 400);
        agendar(() => bzAudio.derrota(), 600);
        agendar(mostrarGameOver, 2000);
    }

    function destruirNaveIA(n) {
        if (n.destruida) return;
        n.destruida = true;
        n.chegou    = true;
        const posCapturada  = n.mesh.position.clone();
        const corCapturada  = n.cor;
        const nomeCapturado = n.nome;

        bzAudio.explosao(0.85);
        for (let w = 0; w < 3; w++) {
            agendar(() => {
                criarExplosao(posCapturada.clone(), corCapturada);
                criarExplosao(posCapturada.clone().add(new THREE.Vector3((Math.random() - .5) * 3, (Math.random() - .5) * 3, (Math.random() - .5) * 3)), 0xffffff);
            }, w * 150);
        }
        agendar(() => {
            scene.remove(n.mesh);
            // O disco nasce logo atrás do jogador, para aparecer na tela na hora
            const player = _naves.find(p => p.isPlayer);
            let spawnPos = posCapturada.clone();
            if (player) {
                spawnPos = player.mesh.position.clone()
                    .addScaledVector(pistaTang(player.t), -8)
                    .add(new THREE.Vector3((Math.random() - .5) * 4, 2 + Math.random() * 2, (Math.random() - .5) * 4));
            }
            spawnDisko(spawnPos, corCapturada, nomeCapturado);
        }, 380);
        flashEvento(`💥 ${nomeCapturado} DESTRUÍDA!`, n.hex);
        agendar(() => mostrarDialogo(_pilotoAtual, 'destruiuIA'), 400);
    }

    // ── DISCOS ────────────────────────────────────────────────────────────────
    // Nave destruída vira um mini disco voador que persegue e atira no jogador
    function spawnDisko(posInicial, cor, nome) {
        const grupo = new THREE.Group();
        const corBrilhoHex = new THREE.Color(cor).multiplyScalar(1.3).convertSRGBToLinear().getHex();

        grupo.add(new THREE.Mesh(_geoDisko,
            new THREE.MeshBasicMaterial({ color: cor, fog: false, transparent: true, opacity: 0.88 })));

        const topo = new THREE.Mesh(_geoDiskoTopo,
            new THREE.MeshBasicMaterial({ color: corBrilhoHex, fog: false, transparent: true, opacity: 0.75 }));
        topo.position.y = 0.11;
        grupo.add(topo);

        const anel = new THREE.Mesh(
            new THREE.TorusGeometry(0.92, 0.07, 6, 18),
            new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, transparent: true, opacity: 0.55 }),
        );
        anel.rotation.x = Math.PI / 2;
        grupo.add(anel);

        const luz = new THREE.PointLight(cor, 4, 10);
        luz.position.y = -0.3;
        grupo.add(luz);

        grupo.position.copy(posInicial);
        scene.add(grupo);

        _diskos.push({ mesh: grupo, luz, cor, nome, vel: new THREE.Vector3(), cdTiro: 0, frame: 0, ativo: true });
        flashEvento(`☠ ${nome} VIROU DISCO!`, new THREE.Color(cor).getStyle());
    }

    function atualizarDiskos() {
        const player = _naves.find(n => n.isPlayer);

        for (let i = _diskos.length - 1; i >= 0; i--) {
            const d = _diskos[i];
            if (!d.ativo) continue;
            d.frame++;

            // Persegue o jogador voando acima dele
            if (player && !player.destruida && !player.chegou) {
                const alvoBase = player.mesh.position.clone();
                alvoBase.y += 3.5 + Math.sin(d.frame * 0.05) * 0.8;
                const dir  = alvoBase.clone().sub(d.mesh.position).normalize();
                const dist = d.mesh.position.distanceTo(alvoBase);
                // Sempre mais rápido que o jogador com boost
                const speed = dist < 4 ? 0.15 : 0.62 + Math.min(dist * 0.005, 0.20);
                d.vel.lerp(dir.multiplyScalar(speed), 0.14);
                d.mesh.position.add(d.vel);
                d.mesh.rotation.y += 0.10;
                d.luz.intensity = 4 + Math.sin(d.frame * 0.20) * 2;

                d.cdTiro = (d.cdTiro || 60) - 1;
                if (d.cdTiro <= 0 && dist < 80) {
                    d.cdTiro = 32 + Math.floor(Math.random() * 18);
                    atirarDisko(d, player);
                }
            }
        }

        // Mísseis dos discos (teleguiados de leve)
        for (let i = _lasersDiskoArr.length - 1; i >= 0; i--) {
            const l = _lasersDiskoArr[i];
            l.userData.vida--;
            if (player && !player.destruida) {
                const toPlayer = player.mesh.position.clone().sub(l.position).normalize();
                l.userData.vel.lerp(toPlayer.multiplyScalar(1.9), 0.04);
            }
            l.position.addScaledVector(l.userData.vel, 1);

            if (player && !player.destruida && !player.chegou && l.position.distanceTo(player.mesh.position) < 2.5) {
                const dano = Math.round(7 * DIFF_CFG[_dificuldade].iaDanoMult);
                criarExplosao(l.position.clone(), 0xff00ff);
                remover(l);
                _lasersDiskoArr.splice(i, 1);
                danoNoPlayer(dano, `☠ -${dano}`, '#dd00ff');
                continue;
            }
            if (l.userData.vida <= 0) { remover(l); _lasersDiskoArr.splice(i, 1); }
        }
    }

    function atirarDisko(d, player) {
        const origem = d.mesh.position.clone();
        const dir = player.mesh.position.clone().sub(origem).normalize();
        const miss = new THREE.Mesh(_geoMissil, new THREE.MeshBasicMaterial({ color: 0xff00ff, fog: false }));
        miss.position.copy(origem);
        miss.add(new THREE.PointLight(0xff00ff, 5, 8));
        miss.userData = { vel: dir.multiplyScalar(1.6), vida: 120 };
        scene.add(miss);
        _lasersDiskoArr.push(miss);
        bzAudio.tiroIA();
    }

    // ── TELAS: SELEÇÃO E INSTRUÇÕES ───────────────────────────────────────────
    function mostrarSelecao(onConfirmar) {
        // A tela mostra NORMAL marcado; o estado acompanha (no original a
        // dificuldade da partida anterior ficava valendo ao jogar de novo)
        _dificuldade = 'normal';
        const el = document.createElement('div'); el.id = 'bz-selecao';

        const cards = PILOTOS.map((p, i) => {
            const vP = Math.round((p.vel  / 0.00060) * 100);
            const mP = Math.round((p.max  / 0.00108) * 100);
            const aP = Math.round((p.acel / 1.30e-6) * 100);
            const shP = 72; // shield igual para todos
            const stat = (lbl, v) => `<div class="bz-stat"><span class="bz-stat-lbl">${lbl}</span><div class="bz-stat-bar"><div class="bz-stat-fill" style="width:${v}%;background:${p.hex}"></div></div><span class="bz-stat-val">${v}</span></div>`;
            return `<div class="bz-card${i === 0 ? ' act' : ''}" data-idx="${i}" style="--card-clr:${p.hex};border-top:3px solid ${p.hex}88">
                ${avatarHTML(p)}
                <div class="bz-card-tag" style="color:${p.hex};border-color:${p.hex}44">${esc(p.tag)}</div>
                <div class="bz-card-nome" style="text-shadow:0 0 12px ${p.hex}66">${esc(p.nome)}</div>
                <div class="bz-card-sub">${esc(p.sub)}</div>
                <div class="bz-card-lore">${esc(p.lore)}</div>
                <div class="bz-stats-sep"></div>
                ${stat('VEL', vP)}${stat('MAX', mP)}${stat('ACEL', aP)}${stat('SHIELD', shP)}
            </div>`;
        }).join('');

        el.innerHTML = `
            <div id="bz-sel-box">
                <div id="bz-sel-header">
                    <div id="bz-sel-titulo">★ B-ZERO 64 ★</div>
                    <div id="bz-sel-sub">SELECIONE SEU PILOTO — APENAS UM SOBREVIVERÁ</div>
                </div>
                <div class="bz-grid">${cards}</div>
                <div id="bz-diff-row">
                    <span class="bz-diff-lbl">DIFICULDADE:</span>
                    <button type="button" class="bz-diff-btn" data-diff="facil">🟢 FÁCIL</button>
                    <button type="button" class="bz-diff-btn act" data-diff="normal">🟡 NORMAL</button>
                    <button type="button" class="bz-diff-btn" data-diff="dificil">🔴 DIFÍCIL</button>
                </div>
                <button type="button" id="bz-sel-start">▶ ENTRAR NA CORRIDA</button>
                <div id="bz-sel-dica">CLIQUE em um piloto para selecionar · ESC para sair</div>
            </div>`;
        ligarFallbackAvatares(el);
        root.appendChild(el);

        let sel = 0;
        el.querySelectorAll('.bz-card').forEach(c => c.addEventListener('click', () => {
            el.querySelectorAll('.bz-card').forEach(x => x.classList.remove('act'));
            c.classList.add('act'); sel = parseInt(c.dataset.idx, 10);
        }));
        el.querySelectorAll('.bz-diff-btn').forEach(b => b.addEventListener('click', () => {
            el.querySelectorAll('.bz-diff-btn').forEach(x => x.classList.remove('act'));
            b.classList.add('act'); _dificuldade = b.dataset.diff;
        }));
        el.querySelector('#bz-sel-start').addEventListener('click', () => { el.remove(); onConfirmar(sel); });
    }

    function mostrarInstrucoes(onStart) {
        const diffLabel = _dificuldade === 'facil' ? '🟢 FÁCIL' : _dificuldade === 'dificil' ? '🔴 DIFÍCIL' : '🟡 NORMAL';
        const el = document.createElement('div'); el.id = 'bz-instrucoes';
        const linha = (tecla, desc) => `<div class="bz-inst-row"><span class="bz-inst-key">${tecla}</span><span class="bz-inst-desc">${desc}</span></div>`;
        el.innerHTML = `
            <div id="bz-inst-box">
                <div id="bz-inst-titulo">★ B-ZERO 64 ★</div>
                <div id="bz-inst-sub">${TOTAL_VOLTAS} VOLTAS · DUPLO OVAL · 2 LOOPS · ${diffLabel}</div>
                ${linha('W / ↑', 'Acelerar')}
                ${linha('S / ↓', 'Frear')}
                ${linha('A / ←', 'Faixa esquerda')}
                ${linha('D / →', 'Faixa direita')}
                ${linha('ESPAÇO', 'Boost turbo!')}
                ${linha('CLIQUE', 'Atirar laser!')}
                ${linha('V', 'Câmera: normal / chase / 1ª pessoa')}
                ${linha('ESC', 'Sair da corrida')}
                <div class="bz-inst-aviso azul">🔄 LOOP 1 no lado leste · LOOP 2 no lado oeste</div>
                <div class="bz-inst-aviso laranja">⚠ Na 3ª volta meteoros invadem a pista!</div>
                <button type="button" id="bz-inst-start">DO A BARREL ROLL!</button>
            </div>`;
        root.appendChild(el);
        el.querySelector('#bz-inst-start').addEventListener('click', () => { el.remove(); onStart(); });
    }

    // Depois da seleção: monta pista, naves e HUD, mostra instruções e contagem
    function iniciarCorrida(pilotoIdx) {
        _ativo = true;
        _pilotoAtual = PILOTOS[pilotoIdx];
        criarEstrelasBZ();
        criarPistaVisual();
        criarNaves(pilotoIdx);
        criarHUD();
        criarDialogoEl();
        ligarControles();

        const posL = pistaPos(PISTA_T_LARGADA), tangL = pistaTang(PISTA_T_LARGADA), normL = pistaNormal(PISTA_T_LARGADA);
        camera.position.copy(posL.clone().addScaledVector(tangL, -28).addScaledVector(normL, 12));
        camera.lookAt(posL.x, posL.y + 1.0, posL.z);

        mostrarInstrucoes(() => {
            countdown(() => {
                _tempoInicio = Date.now();
                _correndo = true;
                agendar(() => mostrarDialogo(_pilotoAtual, 'largada'), 600);
            });
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  ATUALIZAÇÃO POR QUADRO (lógica igual à do original)
    // ══════════════════════════════════════════════════════════════════════════
    function atualizar() {
        if (!_ativo) return;
        atualizarParticulas();
        atualizarExplosoes();
        atualizarDiskos();
        if (!_correndo) return;

        _frame++;
        if (_tiroCD > 0) _tiroCD--;
        atualizarTiroIA();

        // Luz neon do computador gigante pulsando
        _pistaMesh.forEach(m => {
            if (m.userData && m.userData.isMonitor) {
                const pulse = 0.5 + 0.5 * Math.sin(_frame * 0.06);
                m.userData.monitorLuz1.intensity = 7 + pulse * 6;
                m.userData.monitorLuz2.intensity = 3 + pulse * 4;
            }
        });

        const player = _naves.find(n => n.isPlayer);
        atualizarLasers();
        atualizarMeteoros();
        if (!_correndo) return; // o jogador pode ter sido destruído agora

        if (player && _frame % 3 === 0) bzAudio.motor(player.velAtual, player.velMax * 1.28);

        _naves.forEach((nave, idx) => {
            if (nave.chegou) return;

            if (nave.isPlayer) {
                if      (_k.w) nave.velAtual = Math.min(nave.velAtual + nave.acel * 4.5, nave.velMax);
                else if (_k.s) nave.velAtual = Math.max(nave.velAtual - nave.acel * 8,   nave.velBase * 0.12);
                else           nave.velAtual += (nave.velBase - nave.velAtual) * 0.008;
                if (_k.boost)  nave.velAtual = Math.min(nave.velAtual + nave.acel * 7,   nave.velMax * 1.28);
            } else {
                // IA com "elástico": acelera se ficou para trás, alivia se abriu vantagem
                const cfg = DIFF_CFG[_dificuldade];
                const diff = player ? (player.distTotal - nave.distTotal) : 0;
                const rb = diff > 0.08 ? 1.08 : diff < -0.04 ? 0.93 : 1.0;
                const ruido = Math.sin(_frame * 0.04 + idx * 2.3) * (nave.acel * 0.3);
                nave.velAtual = THREE.MathUtils.clamp(nave.velBase * rb * cfg.iaVelMult + ruido, nave.velBase * 0.78 * cfg.iaVelMult, nave.velMax * 1.06 * cfg.iaVelMult);
            }

            if (nave.penalidade > 0) {
                nave.penalidade--;
                nave.velAtual = Math.max(nave.velAtual - nave.acel * 3, nave.velBase * 0.22);
            }

            if (nave.isPlayer) {
                const maxLat = LARGURA_PISTA * 0.41;
                if (_k.a) nave.latAlvo -= 0.16;
                if (_k.d) nave.latAlvo += 0.16;
                nave.latAlvo = THREE.MathUtils.clamp(nave.latAlvo, -maxLat, maxLat);
            } else {
                nave.latAlvo = Math.sin(_frame * 0.013 + idx * 1.9) * LARGURA_PISTA * 0.26;
            }
            nave.latOff = THREE.MathUtils.lerp(nave.latOff, nave.latAlvo, 0.08);

            // Nunca sai da pista: raio da fuselagem ~1 u
            const BORDA_MAX = LARGURA_PISTA * 0.5 - 1.0;
            nave.latOff  = THREE.MathUtils.clamp(nave.latOff,  -BORDA_MAX, BORDA_MAX);
            nave.latAlvo = THREE.MathUtils.clamp(nave.latAlvo, -BORDA_MAX, BORDA_MAX);

            nave.tPrev = nave.t;
            nave.t += nave.velAtual;
            nave.distTotal += nave.velAtual;
            if (nave.t >= 1) nave.t -= 1;

            // Cruzou a linha de largada? (com a volta do t de 1 para 0)
            const TL = PISTA_T_LARGADA;
            const cruzou = (nave.tPrev < TL && nave.t >= TL) ||
                           (nave.tPrev > nave.t && (nave.tPrev < TL || nave.t >= TL));
            // A primeira passagem (largada) não conta
            if (cruzou && nave.distTotal > TL + 0.05) {
                nave.volta++;
                if (nave.isPlayer) {
                    if (nave.volta < TOTAL_VOLTAS) {
                        bzAudio.volta();
                        flashEvento(`◆ VOLTA ${nave.volta + 1} ◆`, '#ffcc00');
                        if (nave.volta === 1) agendar(() => mostrarDialogo(_pilotoAtual, 'volta2'), 500);
                    }
                    if (nave.volta === TOTAL_VOLTAS - 1 && !_lap3Ativo) {
                        _lap3Ativo = true;
                        flashEvento('⚠ METEOROS NA PISTA!', '#ff6622');
                        agendar(() => mostrarDialogo(_pilotoAtual, 'meteoros'), 800);
                        for (let i = 0; i < 7; i++) agendar(spawnMeteoro, i * 200);
                    }
                }
                if (nave.volta >= TOTAL_VOLTAS && !nave.chegou) {
                    nave.chegou = true;
                    if (nave.isPlayer) {
                        const pF = [..._naves].sort((a, b) => b.distTotal - a.distTotal).findIndex(n => n.isPlayer) + 1;
                        const m = pF === 1 ? '🥇 VITÓRIA!!' : pF === 2 ? '🥈 2° LUGAR' : pF === 3 ? '🥉 3° LUGAR' : `${pF}° LUGAR`;
                        const c = pF === 1 ? '#ffcc00' : pF <= 3 ? '#aaccff' : '#ff4444';
                        flashEvento(m, c);
                        if (pF === 1) agendar(() => bzAudio.vitoria(), 400);
                        agendar(() => mostrarDialogo(_pilotoAtual, 'vitoria'), 400);
                        agendar(() => { _correndo = false; _lap3Ativo = false; bzAudio.pararMotor(); mostrarResultado(); }, 2800);
                    }
                }
            }

            // ── Orientação da nave: base ortonormal montada do zero a cada quadro
            const tang = pistaTang(nave.t);
            // "Cima" pela binormal da curva, suavizado para não tremer nos loops
            const tangNext = pistaTang((nave.t + 0.002) % 1);
            const upRaw = new THREE.Vector3().crossVectors(tang, tangNext);
            if (upRaw.lengthSq() < 1e-6) upRaw.set(0, 1, 0);
            else { upRaw.normalize(); if (upRaw.y < -0.1) upRaw.negate(); }
            nave.upSmooth.lerp(upRaw, 0.04).normalize();

            const frente  = tang;
            const cima    = nave.upSmooth.clone().sub(frente.clone().multiplyScalar(nave.upSmooth.dot(frente))).normalize();
            const direita = new THREE.Vector3().crossVectors(frente, cima).normalize();

            nave.mesh.position.copy(pistaPos(nave.t, nave.latOff));

            // Inclinação nas curvas / ao trocar de faixa
            let bankAlvo = 0;
            if (nave.isPlayer) {
                if (_k.a) bankAlvo = 0.20;
                else if (_k.d) bankAlvo = -0.20;
            } else {
                bankAlvo = Math.sin(_frame * 0.05 + idx) * 0.10;
            }
            nave.bankSmooth = THREE.MathUtils.lerp(nave.bankSmooth, bankAlvo, 0.08);
            const cosB = Math.cos(nave.bankSmooth), sinB = Math.sin(nave.bankSmooth);
            const cimaB    = cima.clone().multiplyScalar(cosB).addScaledVector(direita, -sinB);
            const direitaB = direita.clone().multiplyScalar(cosB).addScaledVector(cima, sinB);

            // Eixos locais: X = direita, Y = cima, Z = costas (o nariz aponta para -Z)
            nave.mesh.setRotationFromMatrix(new THREE.Matrix4().makeBasis(direitaB, cimaB, frente.clone().negate()));

            if (_frame % 3 === 0) emitirParticula(nave);
        });

        if (player) {
            // Em 1ª pessoa a câmera está dentro da nave: esconde o modelo
            player.mesh.visible = _camModo !== 'fp';
            atualizarCam(player);
        }
        if (_frame % 3 === 0) atualizarHUD();
        if (_correndo && _naves.length > 0 && _naves.every(n => n.chegou)) {
            _correndo = false; bzAudio.pararMotor(); agendar(mostrarResultado, 900);
        }
    }

    // ── LOOP ──────────────────────────────────────────────────────────────────
    // O original rodava a lógica uma vez por quadro, então em telas de 120/144 Hz
    // o jogo ficava 2x mais rápido. Aqui a lógica roda em passos fixos de 60 Hz
    // (mesmos números do original) e o desenho acompanha o monitor.
    const PASSO = 1000 / 60;
    let _raf = 0;
    let _ultimo = performance.now();
    let _acumulado = 0;
    function quadro(agora) {
        _raf = requestAnimationFrame(quadro);
        _acumulado += Math.min(agora - _ultimo, 250);
        _ultimo = agora;
        let passos = 0;
        // Folga de 1 ms para um monitor de 60 Hz não alternar entre 0 e 2 passos
        while (_acumulado >= PASSO - 1 && passos < 4) {
            atualizar();
            _acumulado -= PASSO;
            passos++;
        }
        if (passos === 4) _acumulado = 0;
        renderer.render(scene, camera);
    }
    _raf = requestAnimationFrame(quadro);

    mostrarSelecao(iniciarCorrida);

    // ══════════════════════════════════════════════════════════════════════════
    //  DISPOSE
    // ══════════════════════════════════════════════════════════════════════════
    function dispose() {
        if (_descartado) return;
        _descartado = true;
        _ativo = false; _correndo = false; _controlesAtivos = false;
        cancelAnimationFrame(_raf);
        cancelarTodosTimers();
        observador.disconnect();
        window.removeEventListener('keydown', aoTeclar);
        window.removeEventListener('keyup', aoSoltar);
        window.removeEventListener('blur', soltarTudo);
        root.removeEventListener('mousedown', aoClicar);
        root.removeEventListener('mousemove', aoMoverMouse);
        btnSair.removeEventListener('click', sair);

        // Fecha o AudioContext do jogo: silêncio garantido
        bzAudio.destruir();

        // Libera tudo que ainda está na cena (pista, naves, estrelas, efeitos)
        // e objetos que já tinham saído da cena mas não foram liberados
        limpar();
        const restantes = [...scene.children];
        restantes.forEach(remover);
        GEO_COMPARTILHADAS.forEach(g => g.dispose());

        renderer.dispose();
        renderer.forceContextLoss();
        root.remove();
    }

    return { dispose };
}
