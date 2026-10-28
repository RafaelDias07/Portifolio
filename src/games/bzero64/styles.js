// CSS do B-Zero 64, injetado como um único <style> dentro do container do jogo.
// Tudo fica debaixo da classe raiz .bzero64 para não vazar para o resto do site.
// No original os elementos eram position:fixed no <body>; aqui viram absolute
// dentro da raiz, que ocupa o container (já em tela cheia) inteiro.
// Só os nomes dos @keyframes são globais (o CSS não permite escopo neles),
// por isso todos começam com "bz-".

export const CSS = `
.bzero64{position:absolute;inset:0;overflow:hidden;background:#000;font-size:16px;color:#fff;font-family:'Courier New',monospace;user-select:none;-webkit-user-select:none}
.bzero64 *,.bzero64 *::before,.bzero64 *::after{box-sizing:border-box}
.bzero64 canvas{display:block;position:absolute;inset:0;width:100%;height:100%}
.bzero64.bz-sem-cursor,.bzero64.bz-sem-cursor canvas{cursor:none}
.bzero64 button{font-family:'Courier New',monospace;margin:0}
.bzero64 button:focus-visible{outline:2px solid #ffcc00;outline-offset:2px}

.bzero64 #bz-sair{position:absolute;left:20px;bottom:20px;z-index:9700;background:rgba(10,10,20,.85);color:#7CFF7C;border:1px solid rgba(124,255,124,.5);border-radius:4px;padding:9px 18px;font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;box-shadow:0 0 18px rgba(124,255,124,.15);transition:background .2s,box-shadow .2s}
.bzero64 #bz-sair:hover{background:rgba(20,40,20,.95);box-shadow:0 0 28px rgba(124,255,124,.3)}

.bzero64 .bz-av{position:relative;border-radius:50%;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:2px solid var(--bz-cor,#4488ff);background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--bz-cor,#4488ff) 55%,#000) 0%,#020814 75%)}
.bzero64 .bz-av-sigla{color:#fff;font-weight:bold;letter-spacing:1px;text-shadow:0 0 8px var(--bz-cor,#4488ff)}
.bzero64 .bz-av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center}

.bzero64 #bz-mira{position:absolute;pointer-events:none;z-index:9600;transform:translate(-50%,-50%)}
.bzero64 .bz-mira-anel{position:absolute;width:28px;height:28px;border:2px solid #00ffff;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);opacity:.85;box-shadow:0 0 8px #00ffff88;animation:bz-mirapulse 1.2s ease-in-out infinite}
@keyframes bz-mirapulse{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}}
.bzero64 .bz-mira-cruz{position:absolute;background:#00ffff;top:50%;left:50%;opacity:.7}
.bzero64 .bz-h{width:14px;height:1px;transform:translate(-50%,-50%)}
.bzero64 .bz-v{width:1px;height:14px;transform:translate(-50%,-50%)}
.bzero64 .bz-mira-dot{position:absolute;width:4px;height:4px;background:#00ffff;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)}
@keyframes bz-fadein{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
@keyframes bz-fadein-x{from{opacity:0}to{opacity:1}}
@keyframes bz-cdpulse{0%{transform:scale(1.35);opacity:.5}100%{transform:scale(1);opacity:1}}
@keyframes bz-flashup{0%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}65%{opacity:1;transform:translate(-50%,-68%) scale(1)}100%{opacity:0;transform:translate(-50%,-90%) scale(.9)}}

.bzero64 #bz-selecao{position:absolute;inset:0;z-index:9000;background:radial-gradient(ellipse at 50% 30%, #060d20 0%, #020408 100%);display:flex;align-items:center;justify-content:center;animation:bz-fadein .3s ease;overflow-y:auto;padding:16px 0}
.bzero64 #bz-sel-box{width:min(96vw,820px);display:flex;flex-direction:column;align-items:center;gap:0;margin:auto}
.bzero64 #bz-sel-header{text-align:center;margin-bottom:22px}
.bzero64 #bz-sel-titulo{color:#ffcc00;font-size:1.5em;letter-spacing:6px;text-shadow:0 0 24px #ffcc0099,0 0 48px #ffaa0044;margin-bottom:6px}
.bzero64 #bz-sel-sub{color:#4a6a8a;font-size:.63em;letter-spacing:3px;text-transform:uppercase}
.bzero64 .bz-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;width:100%;margin-bottom:20px}
@media(max-width:640px){.bzero64 .bz-grid{grid-template-columns:repeat(2,1fr)}}
.bzero64 .bz-card{background:linear-gradient(160deg,#040c1e,#080f24);border:1px solid rgba(0,160,255,.18);border-radius:10px;padding:16px 12px 14px;cursor:pointer;text-align:center;transition:border-color .18s,background .18s,transform .12s,box-shadow .18s;position:relative;overflow:hidden;color:inherit;font:inherit}
.bzero64 .bz-card::before{content:'';position:absolute;inset:0;background:linear-gradient(160deg,color-mix(in srgb,var(--card-clr,#4488ff) 8%,transparent),transparent 60%);pointer-events:none;opacity:0;transition:opacity .2s}
.bzero64 .bz-card:hover{border-color:rgba(0,220,255,.5);transform:translateY(-4px) scale(1.01);box-shadow:0 8px 32px rgba(0,180,255,.14)}
.bzero64 .bz-card:hover::before{opacity:1}
.bzero64 .bz-card.act{border-color:var(--card-clr,#ffcc00);background:linear-gradient(160deg,#0d1830,#0a1228);box-shadow:0 0 28px rgba(0,120,255,.18),inset 0 0 20px rgba(0,80,200,.08)}
.bzero64 .bz-card.act::before{opacity:1}
.bzero64 .bz-card .bz-av{width:88px;height:88px;margin:0 auto 10px}
.bzero64 .bz-card .bz-av-sigla{font-size:1.9em}
.bzero64 .bz-card-tag{font-size:.6em;letter-spacing:3px;border:1px solid;border-radius:3px;padding:1px 7px;display:inline-block;margin-bottom:7px;opacity:.8}
.bzero64 .bz-card-nome{color:#ddeeff;font-size:.95em;font-weight:bold;letter-spacing:3px;margin-bottom:4px;overflow-wrap:anywhere}
.bzero64 .bz-card-sub{color:#4a6580;font-size:.6em;margin-bottom:7px;line-height:1.5;letter-spacing:.5px}
.bzero64 .bz-card-lore{color:#5a7085;font-size:.6em;font-style:italic;line-height:1.55;margin-bottom:10px;min-height:36px}
.bzero64 .bz-stats-sep{height:1px;background:rgba(255,255,255,.06);margin-bottom:8px}
.bzero64 .bz-stat{display:flex;align-items:center;gap:5px;margin-bottom:5px;font-size:.62em}
.bzero64 .bz-stat-lbl{color:#3a5565;min-width:38px;text-align:left;letter-spacing:.5px}
.bzero64 .bz-stat-bar{flex:1;height:3px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden}
.bzero64 .bz-stat-fill{height:100%;border-radius:2px;transition:width .4s ease}
.bzero64 .bz-stat-val{color:#456070;min-width:22px;text-align:right}
.bzero64 #bz-sel-start{display:block;width:100%;max-width:380px;background:linear-gradient(to bottom,#16401a,#0d2811);border:1px solid rgba(100,255,100,.4);border-radius:7px;color:#7CFF7C;font-size:1em;letter-spacing:4px;padding:14px 0;cursor:pointer;text-shadow:0 0 10px #7CFF7C66;transition:background .15s,box-shadow .2s;margin:0 auto}
.bzero64 #bz-sel-start:hover{background:linear-gradient(to bottom,#1e5225,#112e17);box-shadow:0 0 32px rgba(100,255,100,.22)}
.bzero64 #bz-sel-dica{color:#2e4a60;font-size:.62em;text-align:center;margin-top:12px;letter-spacing:1px}
.bzero64 #bz-diff-row{display:flex;align-items:center;gap:10px;margin:0 auto 14px;flex-wrap:wrap;justify-content:center}
.bzero64 .bz-diff-lbl{color:#4a6a8a;font-size:.68em;letter-spacing:2px;flex-shrink:0}
.bzero64 .bz-diff-btn{background:rgba(10,20,40,.8);border:1px solid rgba(0,140,255,.25);border-radius:5px;color:#5577aa;font-size:.72em;letter-spacing:2px;padding:6px 14px;cursor:pointer;transition:all .15s}
.bzero64 .bz-diff-btn:hover{border-color:rgba(0,200,255,.5);color:#88ccee}
.bzero64 .bz-diff-btn.act{border-color:#ffcc00;color:#ffcc00;background:rgba(40,30,0,.6);box-shadow:0 0 14px rgba(255,200,0,.2)}

.bzero64 #bz-instrucoes{position:absolute;inset:0;z-index:9000;background:rgba(0,0,8,.94);display:flex;align-items:center;justify-content:center;animation:bz-fadein .2s ease;overflow-y:auto}
.bzero64 #bz-inst-box{background:linear-gradient(155deg,#05091a,#0a1530);border:2px solid rgba(0,200,255,.4);border-radius:10px;padding:28px 34px;width:min(94vw,460px);box-shadow:0 0 50px rgba(0,140,255,.18);margin:auto}
.bzero64 #bz-inst-titulo{color:#ffcc00;font-size:1.1em;letter-spacing:5px;text-align:center;text-shadow:0 0 14px #ffcc0088;margin-bottom:3px}
.bzero64 #bz-inst-sub{color:#4a6a7a;font-size:.67em;letter-spacing:2px;text-align:center;margin-bottom:18px}
.bzero64 .bz-inst-row{display:flex;gap:12px;align-items:flex-start;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:.8em}
.bzero64 .bz-inst-row:last-of-type{border:none}
.bzero64 .bz-inst-key{background:rgba(0,140,255,.1);border:1px solid rgba(0,160,255,.3);border-radius:4px;padding:2px 9px;color:#00ccff;font-size:.78em;min-width:90px;text-align:center;letter-spacing:1px;white-space:nowrap;flex-shrink:0}
.bzero64 .bz-inst-desc{color:#99bbcc;line-height:1.4}
.bzero64 .bz-inst-aviso{margin-top:12px;padding:9px 12px;border-radius:5px;font-size:.72em;letter-spacing:1px}
.bzero64 .bz-inst-aviso.azul{background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.3);color:#00ddff}
.bzero64 .bz-inst-aviso.laranja{margin-top:8px;background:rgba(255,80,0,.1);border:1px solid rgba(255,100,0,.3);color:#ff8844}
.bzero64 #bz-inst-start{display:block;width:100%;margin-top:16px;background:linear-gradient(to bottom,#101e40,#080f28);border:1px solid rgba(0,200,255,.4);border-radius:6px;color:#00eeff;font-size:.95em;letter-spacing:3px;padding:12px 0;cursor:pointer;transition:background .15s}
.bzero64 #bz-inst-start:hover{background:linear-gradient(to bottom,#152548,#0c1330)}

.bzero64 #bz-countdown{position:absolute;inset:0;z-index:9000;pointer-events:none;display:flex;align-items:center;justify-content:center}
.bzero64 #bz-cd-num{font-size:8em;font-weight:bold;letter-spacing:4px;color:#ffcc00;text-shadow:0 0 40px #ffcc00,0 0 80px #ff8800;animation:bz-cdpulse .85s ease-in-out}
.bzero64 #bz-cd-num.go{color:#00ff88;text-shadow:0 0 40px #00ff88,0 0 80px #00cc44}

.bzero64 #bz-hud{position:absolute;inset:0;z-index:8000;pointer-events:none}
.bzero64 #bz-topo{position:absolute;top:0;left:0;right:0;height:48px;background:linear-gradient(to bottom,rgba(0,0,0,.9),transparent);display:flex;align-items:center;justify-content:space-between;padding:0 20px}
.bzero64 #bz-titulo{color:#ffcc00;font-size:1em;font-weight:bold;letter-spacing:5px;text-shadow:0 0 12px #ffcc00aa}
.bzero64 #bz-volta{color:#cceeff;font-size:.85em;letter-spacing:2px}
.bzero64 #bz-tempo{color:#00eeff;font-size:.88em;letter-spacing:2px;font-variant-numeric:tabular-nums}
.bzero64 #bz-ranking{position:absolute;top:56px;left:14px;background:rgba(0,0,0,.72);border:1px solid rgba(0,200,255,.22);border-radius:7px;padding:8px 12px;min-width:160px}
.bzero64 #bz-rank-tit{color:#00aacc;font-size:.68em;letter-spacing:3px;text-align:center;margin-bottom:6px}
.bzero64 .bz-rrow{display:flex;gap:7px;align-items:center;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:.76em}
.bzero64 .bz-rrow:last-child{border:none}
.bzero64 .bz-rpos{color:#ffcc00;font-weight:bold;min-width:20px}
.bzero64 .bz-rnome{color:#cce8ff;flex:1}
.bzero64 .bz-rvolt{color:#557799;font-size:.85em}
.bzero64 #bz-speedo{position:absolute;bottom:20px;right:20px;background:rgba(0,0,0,.82);border:1px solid rgba(0,200,255,.28);border-radius:10px;padding:10px 14px;min-width:150px}
.bzero64 #bz-speedo .bz-av{width:52px;height:52px}
.bzero64 #bz-speedo .bz-av-sigla{font-size:1.1em}
.bzero64 #bz-lap3-warn{display:none;position:absolute;top:56px;right:14px;background:rgba(255,50,0,.18);border:1px solid rgba(255,80,0,.5);border-radius:7px;padding:7px 13px;color:#ff6622;font-size:.72em;letter-spacing:2px;text-align:center}
.bzero64 #bz-cam-ind{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:6px;align-items:center;pointer-events:none;letter-spacing:4px}
.bzero64 .bz-cam-dot{transition:all .22s ease;display:inline-block;color:rgba(255,255,255,.18);font-size:.75em}
.bzero64 .bz-cam-dot.act{color:#00eeff;text-shadow:0 0 8px #00eeffcc;font-size:1.1em}

.bzero64 .bz-flash{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);font-size:1.45em;font-weight:bold;letter-spacing:3px;pointer-events:none;z-index:9500;animation:bz-flashup 1.6s ease-out forwards;white-space:nowrap}

.bzero64 #bz-dialogo{display:none;position:absolute;bottom:100px;left:50%;transform:translateX(-50%);z-index:8500;pointer-events:none;max-width:min(94vw,520px);width:max-content}
.bzero64 .bz-dlg{display:flex;align-items:center;gap:8px;background:rgba(0,0,16,.88);border:1px solid color-mix(in srgb,var(--bz-cor) 35%,transparent);border-radius:7px;padding:6px 12px;box-shadow:0 0 18px color-mix(in srgb,var(--bz-cor) 20%,transparent);animation:bz-fadein-x .25s ease}
.bzero64 .bz-dlg .bz-av{width:32px;height:32px}
.bzero64 .bz-dlg .bz-av-sigla{font-size:.6em}
.bzero64 .bz-dlg-nome{color:var(--bz-cor);font-size:.55em;letter-spacing:2px;margin-bottom:1px}
.bzero64 .bz-dlg-fala{color:#c8e0ff;font-size:.68em;line-height:1.35}

.bzero64 #bz-resultado{position:absolute;inset:0;z-index:9000;background:rgba(0,0,8,.94);display:flex;align-items:center;justify-content:center;animation:bz-fadein .3s ease;overflow-y:auto}
.bzero64 #bz-res-box{background:linear-gradient(155deg,#05091a,#0a1530);border:2px solid rgba(0,200,255,.4);border-radius:10px;padding:30px 40px;width:min(94vw,380px);text-align:center;box-shadow:0 0 60px rgba(0,150,255,.2);margin:auto}
.bzero64 #bz-res-box.gameover{border-color:rgba(255,50,0,.7);box-shadow:0 0 80px rgba(255,30,0,.35)}
.bzero64 #bz-res-titulo{color:#ffcc00;font-size:1.1em;letter-spacing:5px;text-shadow:0 0 16px #ffcc0088;margin-bottom:8px}
.bzero64 #bz-res-pos{font-size:3.8em;font-weight:bold;margin:8px 0 4px}
.bzero64 #bz-res-tempo{color:#00eeff;font-size:.82em;letter-spacing:2px;margin-bottom:18px}
.bzero64 .bz-res-row{display:flex;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:.8em;text-align:left}
.bzero64 .bz-res-row:last-of-type{border:none}
.bzero64 .bz-res-p{color:#ffcc00;font-weight:bold;min-width:24px}
.bzero64 .bz-res-n{color:#cce8ff;flex:1}
.bzero64 .bz-res-t{color:#557799}
.bzero64 #bz-res-voltar{display:block;width:100%;margin-top:22px;background:rgba(8,12,24,.9);border:1px solid rgba(124,255,124,.38);border-radius:6px;color:#7CFF7C;font-size:.88em;letter-spacing:3px;padding:11px 0;cursor:pointer;transition:background .15s}
.bzero64 #bz-res-voltar:hover{background:rgba(16,32,18,.9)}
.bzero64 #bz-res-tentar{display:block;width:100%;margin-top:8px;background:rgba(8,24,8,.9);border:1px solid rgba(124,255,124,.38);border-radius:6px;color:#7CFF7C;font-size:.88em;letter-spacing:3px;padding:11px 0;cursor:pointer}
.bzero64 #bz-res-tentar:hover{background:rgba(16,40,16,.9)}
`;
