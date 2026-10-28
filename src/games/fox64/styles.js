// CSS do Fox 64, injetado num único <style> dentro do container do jogo.
// Todo seletor começa com .fox64 e toda animação tem o prefixo f64-, para que
// nada vaze para o resto do site. Veio do style.css do jogo original; o que era
// position: fixed virou absolute (o container do React já ocupa a tela toda).
export const CSS = `
.fox64 {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #000;
    font-family: 'Courier New', monospace;
    color: #c0e0ff;
    user-select: none;
    -webkit-user-select: none;
}
.fox64 canvas { display: block; position: absolute; inset: 0; }

/* Durante a partida o cursor some e só a mira aparece */
.fox64.f64-jogando, .fox64.f64-jogando * { cursor: none !important; }

/* Camada dos flashes e avisos (some inteira ao fim da partida) */
.fox64 .f64-fx { position: absolute; inset: 0; pointer-events: none; z-index: 500; overflow: hidden; }

/* Botão "Sair do jogo": sempre visível, acima de tudo */
.fox64 .f64-sair {
    position: absolute;
    top: 12px; right: 12px;
    z-index: 900;
    background: rgba(10,10,20,0.85);
    color: #ff9a7a;
    border: 1px solid rgba(255,120,90,0.55);
    padding: 8px 16px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 0 18px rgba(255,90,60,0.15);
    transition: background .2s, box-shadow .2s;
}
.fox64 .f64-sair:hover { background: rgba(40,15,10,0.95); box-shadow: 0 0 28px rgba(255,90,60,0.3); }
.fox64 .f64-sair:focus-visible,
.fox64 button:focus-visible { outline: 2px solid #FFD700; outline-offset: 2px; }

/* Avatares dos aliados fictícios: emoji sobre gradiente, sem imagem */
.fox64 div.f64-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: 2.6em;
    text-shadow: 0 0 12px rgba(255,255,255,0.35);
}
.fox64 .sel-face.f64-avatar { font-size: 4.5em; }
.fox64 .hud-face-img.f64-avatar { font-size: 3.5em; }
.fox64 .cf-face.f64-avatar { font-size: 3.4em; }
.fox64 .dialogo-face-wrap, .fox64 .cf-face-wrap { display: flex; flex-shrink: 0; }
.fox64 .cf-face-wrap { border-right: 2px solid rgba(80,180,255,0.25); }
.fox64 .sel-aliado .f64-avatar { font-size: 1.3em; }

/* Botões do HUD precisam receber clique (o HUD em si ignora o mouse) */
.fox64 #hud-acoes { pointer-events: auto; }

/* O #cf-hud era fixed na tela; aqui ocupa a raiz toda para a tela de vitória
   (absolute inset 0) cobrir tudo, e o diálogo continua embaixo */
.fox64 #cf-hud.cf-hud-cheio { top: 0; justify-content: flex-end; }

/* Placar da tela de vitória (no lugar da foto do jogo original) */
.fox64 .cf-placar {
    width: min(420px, 90vw);
    padding: 28px 20px;
    background: #000814;
    border: 2px solid rgba(80,180,255,0.5);
    border-radius: 8px;
    box-shadow: 0 0 60px rgba(0,80,255,0.3);
    text-align: center;
    display: flex; flex-direction: column; gap: 10px;
}
.fox64 .cf-placar-label { color: rgba(80,180,255,0.7); font-size: 0.75em; letter-spacing: 4px; }
.fox64 .cf-placar-pts { color: #FFD700; font-size: 2.6em; font-weight: bold; text-shadow: 0 0 20px rgba(255,200,0,0.5); }
.fox64 .cf-botoes, .fox64 .go-botoes { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.fox64 .go-botoes > button { flex: 1; }

.fox64 #game-hud {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 200;
    font-family: 'Courier New', monospace;
    user-select: none;
    -webkit-user-select: none;
}



/* ── MIRA (segue o mouse) ── */
.fox64 #hud-mira {
    position: absolute;
    width: 40px; height: 40px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 300;
}
.fox64 .mira-anel {
    position: absolute; inset: 0;
    border: 2px solid rgba(255,60,0,0.85);
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255,80,0,0.5), inset 0 0 6px rgba(255,80,0,0.2);
    animation: f64-mira-pulse 1.5s ease-in-out infinite;
}
@keyframes f64-mira-pulse {
    0%,100% { transform: scale(1);   opacity: 0.9; }
    50% { transform: scale(1.1); opacity: 1;   }
}
.fox64 .mira-cruz {
    position: absolute;
    background: rgba(255,60,0,0.85);
    box-shadow: 0 0 4px rgba(255,80,0,0.6);
}
.fox64 .mira-cruz.h { width: 12px; height: 2px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
.fox64 .mira-cruz.v { width: 2px; height: 12px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
.fox64 .mira-dot {
    position: absolute;
    width: 4px; height: 4px;
    background: #ff3300;
    border-radius: 50%;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 6px rgba(255,80,0,0.8);
}

/* ── PAINÉIS LATERAIS INFERIORES (Star Fox 64) ── */
.fox64 #hud-painel-esq, .fox64 #hud-painel-dir {
    position: absolute;
    bottom: 16px;
    display: flex;
    align-items: flex-end;
    gap: 12px;
    background: linear-gradient(135deg, rgba(0,10,30,0.92), rgba(0,20,50,0.88));
    border: 2px solid rgba(80,180,255,0.5);
    border-radius: 4px;
    padding: 0 14px 10px 0;
    box-shadow: 0 0 24px rgba(0,100,255,0.25), inset 0 0 20px rgba(0,0,0,0.4);
    overflow: hidden;
}
.fox64 #hud-painel-esq { left: 16px; padding-left: 0; }
.fox64 #hud-painel-dir { right: 16px; padding-left: 14px; flex-direction: row-reverse; }

.fox64 .hud-face {
    display: flex; flex-direction: column; align-items: center;
    flex-shrink: 0;
    position: relative;
}
.fox64 .hud-face-img {
    width: 110px;
    height: 130px;
    object-fit: cover;
    object-position: top center;
    display: block;
    image-rendering: pixelated;
    /* borda lateral luminosa estilo N64 */
    box-shadow: inset -4px 0 12px rgba(0,0,0,0.5);
}
/* fallback quando não é <img> */
.fox64 .hud-face-img:not(img) {
    background: linear-gradient(135deg, #001428, #002848);
    font-size: 3.5em;
    display: flex; align-items: center; justify-content: center;
}
.fox64 .hud-nome {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    text-align: center;
    color: #fff;
    font-size: 0.6em;
    letter-spacing: 3px;
    font-weight: bold;
    background: rgba(0,10,30,0.85);
    padding: 2px 0;
    text-shadow: 0 0 6px #80ccff;
}

.fox64 .hud-barras {
    flex: 1;
    display: flex; flex-direction: column;
    gap: 6px;
    padding-bottom: 4px;
    min-width: 130px;
}
.fox64 .hud-label-bar {
    color: rgba(80,180,255,0.8);
    font-size: 0.6em;
    letter-spacing: 3px;
    margin-bottom: 1px;
}
.fox64 .hud-bar-bg {
    width: 100%; height: 14px;
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(80,180,255,0.4);
    border-radius: 2px;
    overflow: hidden;
}
.fox64 .hud-bar {
    height: 100%;
    transition: width 0.3s ease, background 0.3s;
    border-radius: 1px;
}
.fox64 .hud-bar.verde { background: linear-gradient(to right, #00aa44, #00ff66); box-shadow: 0 0 6px #00ff66; }
.fox64 .hud-bar.amarelo { background: linear-gradient(to right, #cc8800, #ffcc00); box-shadow: 0 0 6px #ffcc00; }
.fox64 .hud-bar.vermelho { background: linear-gradient(to right, #aa0000, #ff2200); box-shadow: 0 0 6px #ff2200; }
.fox64 .hud-bar-num {
    color: #ffffff;
    font-size: 0.8em;
    font-weight: bold;
    letter-spacing: 1px;
}

/* ── TOPO: WAVE + SCORE ── */
.fox64 #hud-topo {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 40px;
    background: linear-gradient(180deg, rgba(0,0,20,0.95) 0%, rgba(0,0,20,0.7) 100%);
    border-bottom: 2px solid rgba(80,180,255,0.4);
    border-left: 2px solid rgba(80,180,255,0.3);
    border-right: 2px solid rgba(80,180,255,0.3);
    border-radius: 0 0 6px 6px;
    padding: 6px 32px 8px;
    pointer-events: none;
}
.fox64 #hud-onda-topo, .fox64 #hud-score-topo {
    color: #80ccff;
    font-size: 0.75em;
    letter-spacing: 3px;
    text-align: center;
}
.fox64 #hud-onda-topo span, .fox64 #hud-score-topo span {
    display: block;
    color: #ffffff;
    font-size: 1.5em;
    letter-spacing: 2px;
    font-weight: bold;
    text-shadow: 0 0 10px #80ccff;
}

/* ── DIÁLOGO ESTILO N64 ── */
.fox64 #hud-dialogo {
    position: absolute;
    bottom: 160px; left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(0,5,20,0.96), rgba(0,10,35,0.94));
    border: 2px solid rgba(80,180,255,0.6);
    border-radius: 4px;
    padding: 0;
    display: flex;
    align-items: stretch;
    gap: 0;
    min-width: 380px;
    max-width: 540px;
    overflow: hidden;
    box-shadow: 0 0 24px rgba(0,80,200,0.3), inset 0 0 16px rgba(0,0,0,0.4);
    pointer-events: none;
    z-index: 250;
}
.fox64 .dialogo-face {
    width: 90px;
    height: 90px;
    object-fit: cover;
    object-position: top center;
    flex-shrink: 0;
    display: block;
}
.fox64 .dialogo-corpo {
    display: flex; flex-direction: column; justify-content: center;
    padding: 10px 16px;
    gap: 4px;
}
.fox64 .dialogo-nome {
    color: #FFD700;
    font-size: 0.65em;
    letter-spacing: 3px;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255,200,0,0.5);
}
.fox64 .dialogo-texto {
    color: #c0e0ff;
    font-size: 0.8em;
    line-height: 1.5;
    letter-spacing: 0.5px;
}

/* Badge Twin Laser / Hyper Beam */
.fox64 #hud-upgrade-badge {
    margin-top: 5px;
    font-size: 0.6em;
    letter-spacing: 2px;
    font-weight: bold;
    animation: f64-mira-pulse 0.5s ease-in-out infinite;
}

/* Base image — object-fit contain para não cortar o computador */
.fox64 .hud-face-base {
    object-fit: contain !important;
    object-position: center !important;
    background: #000814;
    padding: 4px;
}

/* ── DICA ── */
.fox64 #hud-dica {
    position: absolute;
    bottom: 80px; left: 50%;
    transform: translateX(-50%);
    color: rgba(160,200,255,0.55);
    font-size: 10px;
    letter-spacing: 1px;
    white-space: nowrap;
    animation: f64-fade-hint 3s ease-out 5s forwards;
    opacity: 1;
    text-shadow: 0 0 8px rgba(0,100,255,0.4);
}
@keyframes f64-fade-hint { to { opacity: 0; } }

/* Flash vermelho/azul */
@keyframes f64-flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

/* Flash onda */
@keyframes f64-fade-up {
    0% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); }
    20% { opacity: 1; transform: translate(-50%,-50%) scale(1.05); }
    80% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%,-60%) scale(0.95); }
}

/* ═══════════════════════════════════════════════════════════
   CENA FINAL — flutua sobre o cenário 3D (sem fundo)
   ═══════════════════════════════════════════════════════════ */
.fox64 #cf-hud {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 24px;
    pointer-events: none;
    font-family: 'Courier New', monospace;
}

/* Diálogo flutuante (inferior, sobre o 3D) */
.fox64 #cf-dialogo {
    width: min(620px, 94vw);
    display: flex; align-items: stretch;
    background: linear-gradient(135deg, rgba(0,5,20,0.92), rgba(0,12,38,0.90));
    border: 2px solid rgba(80,180,255,0.55);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(0,60,200,0.35), 0 8px 32px rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    min-height: 130px;
    pointer-events: all;
    animation: f64-cf-slide-up 0.5s ease-out;
}
@keyframes f64-cf-slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
.fox64 .cf-face {
    width: 120px; min-width: 120px;
    object-fit: cover; object-position: top center;
    display: block;
    border-right: 2px solid rgba(80,180,255,0.25);
    transition: src 0.3s;
}
.fox64 #cf-corpo {
    flex: 1; padding: 16px 20px;
    display: flex; flex-direction: column; justify-content: center; gap: 8px;
}
.fox64 #cf-nome {
    color: #FFD700;
    font-size: 0.7em;
    letter-spacing: 4px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255,200,0,0.5);
}
.fox64 #cf-txt {
    color: #d0eaff;
    font-size: 0.95em;
    line-height: 1.65;
    letter-spacing: 0.3px;
    min-height: 2.8em;
}

/* Foto final — aparece sobre o 3D centralizada */
.fox64 #cf-foto-wrap {
    position: absolute;
    inset: 0;
    z-index: 610;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 20px;
    background: rgba(0,4,16,0.78);
    backdrop-filter: blur(10px);
    font-family: 'Courier New', monospace;
    pointer-events: all;
}
@keyframes f64-cf-entrada {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
}
.fox64 #cf-foto-titulo {
    font-size: clamp(1.2em, 4vw, 1.8em);
    font-weight: bold;
    color: #FFD700;
    letter-spacing: 5px;
    text-shadow: 0 0 30px rgba(255,200,0,0.6), 0 0 60px rgba(255,140,0,0.2);
    text-align: center;
}
.fox64 #cf-foto-sub {
    color: rgba(80,180,255,0.7);
    font-size: 0.72em;
    letter-spacing: 3px;
    text-align: center;
}
.fox64 #cf-foto-frame {
    width: min(480px, 90vw);
    aspect-ratio: 1 / 1;
    background: #000814;
    border: 2px solid rgba(80,180,255,0.5);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,80,255,0.3), 0 0 0 1px rgba(255,200,100,0.12);
}
.fox64 #cf-foto-frame img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
}
.fox64 #cf-foto-legenda {
    color: rgba(80,180,255,0.6);
    font-size: 0.68em;
    letter-spacing: 3px;
    text-align: center;
}
.fox64 #cf-btn-voltar, .fox64 #cf-btn-jogar, .fox64 #cf-btn-ranking {
    background: linear-gradient(to bottom, #001428, #000c1e);
    border: 2px solid rgba(80,180,255,0.5);
    color: #80ccff;
    font-family: inherit;
    font-size: 0.9em;
    padding: 12px 36px;
    cursor: pointer;
    border-radius: 4px;
    letter-spacing: 3px;
    text-transform: uppercase;
    transition: all .2s;
}
.fox64 #cf-btn-voltar:hover, .fox64 #cf-btn-jogar:hover, .fox64 #cf-btn-ranking:hover {
    background: linear-gradient(to bottom, #002050, #001228);
    border-color: rgba(80,180,255,0.9);
    box-shadow: 0 0 24px rgba(0,100,255,0.3);
}

/* ═══════════════════════════════════════════════════════════
   SELEÇÃO DE PERSONAGEM
   ═══════════════════════════════════════════════════════════ */
.fox64 #sel-personagem {
    position: absolute; inset: 0; z-index: 400;
    display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, rgba(0,8,30,0.97) 0%, rgba(0,0,0,0.99) 100%);
    font-family: 'Courier New', monospace;
}
.fox64 .sel-box {
    background: linear-gradient(145deg, #000814, #000f28);
    border: 2px solid rgba(80,180,255,0.5);
    border-radius: 6px;
    padding: 28px 32px;
    width: min(760px, 96vw);
    color: #c0e0ff;
    box-shadow: 0 0 80px rgba(0,80,255,0.15);
    display: flex; flex-direction: column; gap: 16px;
}
.fox64 .sel-titulo {
    font-size: 1.6em;
    font-weight: bold;
    color: #FFD700;
    letter-spacing: 5px;
    text-align: center;
    text-shadow: 0 0 20px rgba(255,200,0,0.5);
}
.fox64 .sel-subtitulo {
    color: rgba(80,180,255,0.6);
    font-size: 0.68em;
    letter-spacing: 3px;
    text-align: center;
    margin-top: -10px;
}
.fox64 .sel-cards {
    display: flex;
    gap: 12px;
}
.fox64 .sel-card {
    flex: 1;
    display: flex; flex-direction: column;
    background: rgba(0,10,30,0.8);
    border: 2px solid rgba(80,180,255,0.2);
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    transition: all .2s;
}
.fox64 .sel-card:hover {
    border-color: rgba(80,180,255,0.6);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,80,255,0.2);
}
.fox64 .sel-card.act {
    border-color: #FFD700;
    box-shadow: 0 0 24px rgba(255,200,0,0.2), 0 8px 24px rgba(0,80,255,0.15);
    transform: translateY(-4px);
}
.fox64 .sel-face {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    object-position: top center;
    display: block;
}
.fox64 .sel-info {
    padding: 10px 12px;
    display: flex; flex-direction: column; gap: 5px;
}
.fox64 .sel-nome {
    font-size: 0.72em;
    font-weight: bold;
    letter-spacing: 2px;
    color: #fff;
}
.fox64 .sel-laser {
    font-size: 0.62em;
    letter-spacing: 1px;
    font-weight: bold;
}
.fox64 .sel-desc {
    font-size: 0.58em;
    color: rgba(160,200,255,0.65);
    line-height: 1.5;
    letter-spacing: 0.5px;
}
/* Preview de aliados */
.fox64 .sel-preview {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.fox64 .sel-aliados-label {
    font-size: 0.62em;
    color: rgba(80,180,255,0.6);
    letter-spacing: 3px;
}
.fox64 #sel-aliados {
    display: flex;
    gap: 12px;
}
.fox64 .sel-aliado {
    display: flex; align-items: center; gap: 8px;
    background: rgba(0,20,60,0.5);
    border: 1px solid rgba(80,180,255,0.25);
    border-radius: 4px;
    padding: 5px 10px;
}
.fox64 .sel-aliado .sel-aliado-face {
    width: 36px; height: 36px;
    object-fit: cover; object-position: top;
    border-radius: 3px;
}
.fox64 .sel-aliado span {
    font-size: 0.62em;
    letter-spacing: 1px;
    color: #9abfd8;
}
.fox64 #sel-confirmar {
    display: block;
    width: 100%;
    background: linear-gradient(to bottom, #001840, #000f28);
    color: #FFD700;
    border: 2px solid rgba(255,200,0,0.5);
    padding: 13px 32px;
    font-family: inherit;
    font-size: 1em;
    letter-spacing: 4px;
    cursor: pointer;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: bold;
    transition: all .2s;
    text-align: center;
    text-shadow: 0 0 12px rgba(255,200,0,0.4);
}
.fox64 #sel-confirmar:hover {
    background: linear-gradient(to bottom, #002050, #001638);
    box-shadow: 0 0 30px rgba(255,200,0,0.2);
    border-color: rgba(255,220,0,0.8);
    transform: scale(1.01);
}

/* ═══════════════════════════════════════════════════════════
   JOGO — TELA DE INSTRUÇÕES (Star Fox 64 Style)
   ═══════════════════════════════════════════════════════════ */
.fox64 #game-instrucoes {
    position: absolute; inset: 0; z-index: 400;
    display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, rgba(0,10,40,0.97) 0%, rgba(0,0,0,0.99) 100%);
    font-family: 'Courier New', monospace;
}
.fox64 .gi-box {
    background: linear-gradient(145deg, #000814, #000f28);
    border: 2px solid rgba(80,180,255,0.5);
    border-radius: 6px;
    padding: 32px 40px;
    max-width: 500px;
    width: 92%;
    color: #c0e0ff;
    box-shadow: 0 0 80px rgba(0,80,255,0.15), inset 0 0 60px rgba(0,0,0,0.6);
}
.fox64 .gi-header { text-align: center; margin-bottom: 20px; }
.fox64 .gi-logo {
    font-size: 2em;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255,200,0,0.6), 0 0 40px rgba(255,140,0,0.3);
    letter-spacing: 6px;
    margin-bottom: 4px;
}
.fox64 .gi-sub-logo {
    color: rgba(80,180,255,0.7);
    font-size: 0.7em;
    letter-spacing: 4px;
    text-transform: uppercase;
}
.fox64 .gi-dialogo-box {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(0,20,60,0.6);
    border: 1px solid rgba(80,180,255,0.35);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 18px;
}
.fox64 .gi-face {
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: top center;
    display: block;
    flex-shrink: 0;
}
.fox64 .gi-dialogo-box > div {
    padding: 12px 16px;
}
.fox64 .gi-nome-char {
    color: #FFD700;
    font-size: 0.72em;
    letter-spacing: 3px;
    margin-bottom: 4px;
}
.fox64 .gi-fala {
    color: #c0e0ff;
    font-size: 0.82em;
    line-height: 1.5;
    font-style: italic;
}
.fox64 .gi-regras {
    display: flex; flex-direction: column; gap: 8px;
    margin-bottom: 22px;
}
.fox64 .gi-regra {
    display: flex; align-items: center; gap: 12px;
    font-size: 0.82em;
    color: #9abfd8;
    padding: 5px 8px;
    border-left: 2px solid rgba(80,180,255,0.3);
    background: rgba(0,20,60,0.3);
}
.fox64 .gi-regra b { color: #80ccff; }
.fox64 .gi-icone { font-size: 1.2em; width: 1.8em; text-align: center; flex-shrink: 0; }
.fox64 #gi-start {
    display: block;
    width: 100%;
    background: linear-gradient(to bottom, #001840, #000f28);
    color: #FFD700;
    border: 2px solid rgba(255,200,0,0.5);
    padding: 14px 32px;
    font-family: inherit;
    font-size: 1em;
    letter-spacing: 4px;
    cursor: pointer;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: bold;
    transition: all .2s;
    text-align: center;
    box-shadow: 0 0 20px rgba(255,200,0,0.1);
    text-shadow: 0 0 12px rgba(255,200,0,0.4);
}
.fox64 #gi-start:hover {
    background: linear-gradient(to bottom, #002050, #001638);
    box-shadow: 0 0 30px rgba(255,200,0,0.25);
    border-color: rgba(255,220,0,0.8);
    transform: scale(1.02);
}

/* ── BOTÕES DE DIFICULDADE ── */
.fox64 .gi-difi-titulo {
    color: rgba(80,180,255,0.7);
    font-size: 0.65em;
    letter-spacing: 4px;
    text-align: center;
    margin: 14px 0 8px;
}
.fox64 .gi-difi-btns {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
}
.fox64 .gi-difi {
    flex: 1;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    background: rgba(0,10,30,0.7);
    border: 2px solid rgba(80,180,255,0.25);
    border-radius: 5px;
    padding: 10px 6px;
    cursor: pointer;
    font-family: inherit;
    color: #9abfd8;
    transition: all .18s;
}
.fox64 .gi-difi:hover {
    border-color: rgba(80,180,255,0.6);
    background: rgba(0,20,55,0.85);
    color: #c0e0ff;
}
.fox64 .gi-difi.act {
    border-color: rgba(80,180,255,0.9);
    background: rgba(0,30,70,0.95);
    color: #fff;
    box-shadow: 0 0 16px rgba(0,100,255,0.25);
}
.fox64 .gi-difi-icon { font-size: 1.3em; }
.fox64 .gi-difi-nome {
    font-size: 0.68em;
    letter-spacing: 2px;
    font-weight: bold;
    color: inherit;
}
.fox64 .gi-difi-desc {
    font-size: 0.58em;
    letter-spacing: 1px;
    color: rgba(160,200,255,0.6);
    text-align: center;
    line-height: 1.4;
}

/* ═══════════════════════════════════════════════════════════
   JOGO — GAME OVER / RANKING (Star Fox 64)
   ═══════════════════════════════════════════════════════════ */
.fox64 #game-over {
    position: absolute; inset: 0; z-index: 450;
    display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, rgba(0,5,30,0.97) 0%, rgba(0,0,0,0.99) 100%);
    font-family: 'Courier New', monospace;
}
.fox64 .go-box {
    background: linear-gradient(145deg, #000814, #000f28);
    border: 2px solid rgba(80,180,255,0.5);
    border-radius: 6px;
    padding: 28px 36px;
    max-width: 460px;
    width: 92%;
    color: #c0e0ff;
    box-shadow: 0 0 80px rgba(0,80,255,0.15);
    display: flex; flex-direction: column; gap: 14px;
}
.fox64 .go-dialogo {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(0,20,60,0.6);
    border: 1px solid rgba(80,180,255,0.35);
    border-radius: 4px;
    overflow: hidden;
}
.fox64 .go-face {
    width: 90px;
    height: 90px;
    object-fit: cover;
    object-position: top center;
    display: block;
    flex-shrink: 0;
}
.fox64 .go-fala {
    color: #c0e0ff;
    font-size: 0.8em;
    line-height: 1.5;
    font-style: italic;
    padding: 12px 14px;
}
.fox64 .go-title {
    font-size: 1.4em;
    font-weight: bold;
    text-align: center;
    letter-spacing: 3px;
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255,200,0,0.5);
}
.fox64 .go-pts { text-align: center; font-size: 0.95em; color: #9abfd8; letter-spacing: 2px; }
.fox64 .go-pts b { color: #FFD700; font-size: 1.4em; text-shadow: 0 0 10px rgba(255,200,0,0.4); }
.fox64 .go-input { display: flex; flex-direction: column; gap: 6px; font-size: .88em; }
.fox64 .go-input label { color: rgba(80,180,255,0.7); letter-spacing: 2px; font-size: 0.8em; }
.fox64 .go-input-row { display: flex; gap: .5em; }
.fox64 #go-iniciais {
    flex: 1;
    background: rgba(0,20,60,0.8);
    border: 2px solid rgba(80,180,255,0.4);
    color: #FFD700;
    font-family: 'Courier New', monospace;
    font-size: 1.4em;
    letter-spacing: 8px;
    padding: 6px 10px;
    text-align: center;
    text-transform: uppercase;
    border-radius: 3px;
    outline: none;
}
.fox64 #go-iniciais:focus { border-color: rgba(80,180,255,0.8); box-shadow: 0 0 12px rgba(0,100,255,0.2); }
.fox64 #go-salvar {
    background: rgba(0,40,80,0.7);
    border: 2px solid rgba(80,180,255,0.4);
    color: #80ccff;
    font-family: inherit;
    font-size: .82em;
    padding: 6px 14px;
    cursor: pointer;
    border-radius: 3px;
    white-space: nowrap;
    letter-spacing: 1px;
    transition: all .2s;
}
.fox64 #go-salvar:hover { background: rgba(0,60,120,0.8); border-color: rgba(80,180,255,0.7); }
.fox64 .go-ranking { border-top: 1px solid rgba(80,180,255,0.2); padding-top: 10px; }
.fox64 .go-rank-title {
    font-size: .72em; color: #FFD700; margin-bottom: 8px;
    letter-spacing: 3px; text-align: center;
    text-shadow: 0 0 10px rgba(255,200,0,0.3);
}
.fox64 #go-lista { display: flex; flex-direction: column; gap: 3px; max-height: 180px; overflow-y: auto; }
.fox64 .go-rank-row {
    display: flex; align-items: center;
    background: rgba(0,20,60,0.5);
    border-left: 2px solid rgba(80,180,255,0.3);
    padding: 4px 10px;
    font-size: .82em;
    gap: .5em;
}
.fox64 .go-rank-pos { color: rgba(80,180,255,0.6); width: 2.2em; }
.fox64 .go-rank-ini { color: #FFD700; font-weight: bold; flex: 1; letter-spacing: 2px; }
.fox64 .go-rank-pts { color: #c0e0ff; font-weight: bold; }
.fox64 .go-rank-empty { color: rgba(80,180,255,0.4); font-size: .82em; text-align: center; padding: .5em; letter-spacing: 2px; }
.fox64 #go-voltar, .fox64 #go-jogar {
    background: linear-gradient(to bottom, #001428, #000c1e);
    border: 2px solid rgba(80,180,255,0.4);
    color: #80ccff;
    font-family: inherit;
    font-size: .88em;
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    letter-spacing: 2px;
    transition: all .2s;
    text-align: center;
    text-transform: uppercase;
}
.fox64 #go-voltar:hover, .fox64 #go-jogar:hover {
    background: linear-gradient(to bottom, #001e3c, #001228);
    border-color: rgba(80,180,255,0.7);
    box-shadow: 0 0 16px rgba(0,100,255,0.2);
}
            .fox64 #hud-acoes {
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .fox64 #hud-acoes button {
                background: rgba(0,0,0,0.55);
                border: 1px solid rgba(255,255,255,0.22);
                border-radius: 5px;
                color: #fff;
                font-size: 1em;
                width: 32px;
                height: 28px;
                cursor: pointer;
                line-height: 1;
                transition: background 0.15s, border-color 0.15s;
                font-family: 'Courier New', monospace;
            }
            .fox64 #hud-acoes button:hover {
                background: rgba(255,255,255,0.18);
                border-color: rgba(255,255,255,0.5);
            }

            /* ── Tela de atalhos ── */
            .fox64 #hud-atalhos-overlay {
                position: absolute;
                inset: 0;
                z-index: 600;
                background: rgba(0,0,0,0.72);
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
                animation: f64-fade-in-atalhos .18s ease;
            }
            @keyframes f64-fade-in-atalhos { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
            .fox64 #hud-atalhos-box {
                background: linear-gradient(160deg, #0a0e1a 0%, #0d1525 100%);
                border: 1px solid rgba(0,200,255,0.35);
                border-radius: 10px;
                padding: 28px 36px 24px;
                min-width: 340px;
                max-width: 420px;
                box-shadow: 0 0 40px rgba(0,180,255,0.18), 0 0 0 1px rgba(0,200,255,0.08);
                font-family: 'Courier New', monospace;
                color: #cce8ff;
                position: relative;
            }
            .fox64 #hud-atalhos-box h2 {
                margin: 0 0 18px;
                font-size: 1em;
                letter-spacing: 4px;
                text-align: center;
                color: #00ccff;
                text-shadow: 0 0 12px #00ccff88;
            }
            .fox64 .atalho-row {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255,255,255,0.06);
            }
            .fox64 .atalho-row:last-child { border-bottom: none; }
            .fox64 .atalho-key {
                background: rgba(0,180,255,0.12);
                border: 1px solid rgba(0,180,255,0.35);
                border-radius: 5px;
                padding: 3px 10px;
                font-size: .82em;
                font-weight: bold;
                letter-spacing: 1px;
                color: #00ddff;
                min-width: 80px;
                text-align: center;
                white-space: nowrap;
            }
            .fox64 .atalho-desc {
                font-size: .88em;
                color: #aac8e8;
                line-height: 1.3;
            }
            .fox64 #hud-atalhos-mute-toggle {
                display: block;
                margin: 20px auto 0;
                background: rgba(0,180,255,0.12);
                border: 1px solid rgba(0,180,255,0.4);
                border-radius: 6px;
                color: #00ddff;
                font-family: 'Courier New', monospace;
                font-size: .9em;
                letter-spacing: 2px;
                padding: 8px 24px;
                cursor: pointer;
                transition: background .15s;
            }
            .fox64 #hud-atalhos-mute-toggle:hover { background: rgba(0,180,255,0.25); }
            .fox64 #hud-atalhos-fechar {
                position: absolute;
                top: 12px; right: 14px;
                background: none;
                border: none;
                color: #558;
                font-size: 1.1em;
                cursor: pointer;
                line-height: 1;
                transition: color .15s;
            }
            .fox64 #hud-atalhos-fechar:hover { color: #fff; }

`
