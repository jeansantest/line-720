'use strict';
/* Cena (canvas), efeitos e sons. Não conhece as regras do jogo: só recebe dados. */
const CALMO = matchMedia('(prefers-reduced-motion: reduce)');
const TRENS = [
  { nome: 'Haiku', nivel: 1, a: '#e9ece6', b: '#d4502f' }, { nome: 'Sonnet', nivel: 2, a: '#7fd1c4', b: '#0c5b55' },
  { nome: 'Opus', nivel: 4, a: '#f2b705', b: '#7a3b00' }, { nome: 'Expresso Cache', nivel: 6, a: '#ff7a59', b: '#5c1020' },
  { nome: 'Noturno', nivel: 8, a: '#39485f', b: '#9fd0ff' }, { nome: 'Line 720', nivel: 11, a: '#fff3c4', b: '#1a7a45' }];

/* ---------- sons ---------- */
const Som = {
  on: true, ctx: null,
  nota(f, t = 0, d = .14, tipo = 'triangle', v = .12, f2 = 0) {
    if (!this.on) return;
    try {
      this.ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const c = this.ctx, o = c.createOscillator(), g = c.createGain(), i = c.currentTime + t;
      o.type = tipo; o.frequency.setValueAtTime(f, i); if (f2) o.frequency.exponentialRampToValueAtTime(f2, i + d);
      g.gain.setValueAtTime(.0001, i); g.gain.exponentialRampToValueAtTime(v, i + .012); g.gain.exponentialRampToValueAtTime(.0001, i + d);
      o.connect(g).connect(c.destination); o.start(i); o.stop(i + d + .02);
    } catch {}
  },
  toque() { this.nota(520, 0, .05, 'sine', .05); },
  certo(n) { const b = 440 * 2 ** (Math.min(n, 8) * 2 / 12); [0, 4, 7].forEach((s, i) => this.nota(b * 2 ** (s / 12), i * .07, .2)); },
  turbo() { this.nota(200, 0, .4, 'sawtooth', .05, 1400); [0, 4, 7, 12].forEach((s, i) => this.nota(660 * 2 ** (s / 12), .12 + i * .06, .22)); },
  erro() { this.nota(190, 0, .28, 'sine', .14, 90); },
  poder() { this.nota(300, 0, .2, 'sine', .09, 700); },
  janela(i) { this.nota(784 * 2 ** ((i * 2 % 12) / 12), i * .12, .22, 'sine', .07); },
  fogo() { this.nota(110, 0, .7, 'sawtooth', .04, 520); [0, 5, 9, 12].forEach((s, i) => this.nota(392 * 2 ** (s / 12), .25 + i * .09, .3)); },
  estrela(i) { [0, 7].forEach(s => this.nota(523 * 2 ** ((i * 4 + s) / 12), 0, .3)); },
  festa() { [0, 4, 7, 12, 16, 19].forEach((s, i) => this.nota(523 * 2 ** (s / 12), i * .09, .35)); }
};
const vibrar = p => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(p); } catch {} };

/* ---------- efeitos por cima da página ---------- */
const Fx = (() => {
  const cv = document.getElementById('fx'), c = cv.getContext('2d');
  let ps = [], vivo = false, ant = 0;
  function quadro(t) {
    const dt = Math.min(.05, (t - ant) / 1000 || .016); ant = t;
    c.clearRect(0, 0, cv.width, cv.height);
    ps = ps.filter(p => (p.v -= dt) > 0);
    for (const p of ps) {
      p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      c.save(); c.globalAlpha = Math.min(1, p.v * 2); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); c.restore();
    }
    if (ps.length) requestAnimationFrame(quadro); else { vivo = false; c.clearRect(0, 0, cv.width, cv.height); }
  }
  function soltar(x, y, n, cores, forca = 420) {
    if (CALMO.matches) return;
    if (!vivo) { cv.width = innerWidth; cv.height = innerHeight; }
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, f = forca * (.3 + Math.random()); ps.push({ x, y, vx: Math.cos(a) * f, vy: Math.sin(a) * f - forca * .7, r: a, vr: (Math.random() - .5) * 14, s: 6 + Math.random() * 7, v: .9 + Math.random() * .7, c: cores[i % cores.length] }); }
    ps = ps.slice(-400);
    if (!vivo) { vivo = true; ant = performance.now(); requestAnimationFrame(quadro); }
  }
  function de(el, n, cores, f) { if (!el) return; const r = el.getBoundingClientRect(); soltar(r.left + r.width / 2, r.top + r.height / 2, n, cores, f); }
  function texto(el, s, cls = '') {
    if (!el || CALMO.matches) return;
    const r = el.getBoundingClientRect(), e = document.createElement('div');
    e.className = 'voa ' + cls; e.textContent = s; e.style.left = r.left + r.width / 2 + 'px'; e.style.top = Math.max(60, r.top) + 'px';
    document.body.append(e); setTimeout(() => e.remove(), 1200);
  }
  function anim(el, nome, ms) { if (!el || CALMO.matches) return; el.classList.remove(nome); void el.offsetWidth; el.classList.add(nome); setTimeout(() => el.classList.remove(nome), ms); }
  let fila = Promise.resolve();
  function aviso(titulo, sub) {
    fila = fila.then(() => new Promise(ok => {
      const e = document.createElement('div'); e.className = 'aviso'; e.setAttribute('role', 'status');
      const b = document.createElement('b'), s = document.createElement('span'); b.textContent = titulo; s.textContent = sub; e.append(b, s);
      document.body.append(e); Som.festa(); soltar(innerWidth / 2, 90, 60, ['#f2b705', '#fff3c4', '#ff7a59', '#7fd1c4']);
      setTimeout(() => { e.remove(); ok(); }, 1900);
    }));
  }
  function encher(el, p0) {
    if (!el || CALMO.matches) return;
    if (el.classList.contains('anel')) { const f = el.style.strokeDashoffset, t = parseFloat(el.style.strokeDasharray); el.style.transition = 'none'; el.style.strokeDashoffset = t * (1 - p0); void el.getBoundingClientRect(); setTimeout(() => { el.style.transition = ''; el.style.strokeDashoffset = f; }, 350); return; }
    const f = el.style.width; el.style.transition = 'none'; el.style.width = p0 * 100 + '%'; void el.offsetWidth; setTimeout(() => { el.style.transition = ''; el.style.width = f; }, 350);
  }
  function fogo(n) {
    const e = document.createElement('div'); e.className = 'fogo-fx'; e.setAttribute('role', 'status');
    e.innerHTML = Painel.chama(true, n, 'grande') + `<b>${n}</b><span>${n === 1 ? t('dia em chamas') : t('dias em chamas')}</span>`;
    document.body.append(e); soltar(innerWidth / 2, innerHeight * .42, 70, ['#ff9b21', '#f2b705', '#ff5a1f'], 480);
    setTimeout(() => e.remove(), 1900);
  }
  const festa = cores => [.2, .5, .8].forEach((x, i) => setTimeout(() => soltar(innerWidth * x, innerHeight * .4, 55, cores, 560), i * 180));
  return { de, texto, anim, aviso, festa, encher, fogo };
})();

/* ---------- cena ---------- */
const Cena = (() => {
  const cv = document.getElementById('cena'), c = cv.getContext('2d');
  let modo = '', o = {}, W = 0, H = 0, raf = 0, ant = 0, T = 0, vel = 0, alvo = 0, pos = 0, solavanco = 0, brilho = 0, fumaca = [], acesas = new Map();
  const rnd = n => { const x = Math.sin(n * 127.1 + 11.7) * 43758.5453; return x - Math.floor(x); };
  const estrelas = Array.from({ length: 70 }, (_, i) => [rnd(i), rnd(i + 99) * .6, rnd(i + 7)]);
  const mistura = (h, k, a = 1) => { const n = parseInt(h.slice(1), 16), f = s => Math.round((n >> s & 255) * k); return `rgba(${f(16)},${f(8)},${f(0)},${a})`; };
  function medir() {
    const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); c.setTransform(d, 0, 0, d, 0, 0);
  }
  function caixa(x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
  function ceu(cor) {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0b1626'); g.addColorStop(.6, '#1c3a4a'); g.addColorStop(1, cor ? mistura(cor, .62) : '#b5653f');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = '#fff';
    for (const [x, y, b] of estrelas) { c.globalAlpha = .25 + .5 * Math.abs(Math.sin(T * .8 + b * 9)) * b; c.fillRect(((x * W - pos * .01) % W + W) % W, y * H, 1.6, 1.6); }
    c.globalAlpha = 1; c.fillStyle = '#f6e7bd'; c.beginPath(); c.arc(W * .84, H * .2, 15, 0, 7); c.fill();
  }
  function morros(fator, base, amp, larg, cor, sem) {
    c.fillStyle = cor;
    const ini = Math.floor(pos * fator / larg) - 1, n = Math.ceil(W / larg) + 2;
    for (let i = ini; i < ini + n; i++) { const h = base + rnd(i + sem) * amp; c.fillRect(i * larg - pos * fator, H - h, larg - 3, h); }
  }
  function trem(x, y, n, cores, e) {
    const L = 64 * e, A = 30 * e, balanco = i => CALMO.matches ? 0 : Math.sin(T * 18 + i * 1.3) * Math.min(1.5, vel / 260);
    for (let i = n; i >= 0; i--) {
      const X = x - i * (L + 5 * e), Y = y - A + balanco(i);
      c.fillStyle = '#080c12'; for (const k of [.22, .78]) { c.beginPath(); c.arc(X + L * k, y + 2 * e, 5 * e, 0, 7); c.fill(); }
      if (i) c.fillRect(X + L - 1, y - 9 * e, 8 * e, 4 * e);
      c.fillStyle = cores.a; caixa(X, Y, L, A, i ? 6 * e : [6 * e, 20 * e, 5 * e, 6 * e]);
      c.fillStyle = cores.b; c.fillRect(X, Y + A * .66, L, A * .16);
      c.fillStyle = '#ffdf85'; for (let k = 0; k < 3; k++) { if (!i && k === 2) c.fillStyle = '#bfe6ff'; caixa(X + (8 + k * 18) * e, Y + 6 * e, 12 * e, 10 * e, 2 * e); }
      if (!i) { const g = c.createLinearGradient(X + L, 0, X + L + 170 * e, 0); g.addColorStop(0, 'rgba(255,236,170,.55)'); g.addColorStop(1, 'rgba(255,236,170,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(X + L - 2, y - 11 * e); c.lineTo(X + L + 170 * e, y - 34 * e); c.lineTo(X + L + 170 * e, y + 10 * e); c.fill(); }
    }
  }
  function trilho(y, cor) {
    c.fillStyle = '#0a1018'; c.fillRect(0, y + 7, W, H - y);
    c.fillStyle = cor; c.fillRect(0, y + 7, W, 5);
    c.fillStyle = '#1c2733'; for (let x = -(pos % 46); x < W; x += 46) c.fillRect(x, y + 14, 24, 4);
  }
  function viagem(dt) {
    vel += (alvo - vel) * Math.min(1, dt * 2.2); pos += vel * dt; solavanco = Math.max(0, solavanco - dt * 2); brilho = Math.max(0, brilho - dt);
    const turbo = o.turbo, y = H - 30, e = W < 600 ? .8 : 1;
    c.save(); if (solavanco && !CALMO.matches) c.translate(Math.sin(T * 60) * solavanco * 7, Math.cos(T * 47) * solavanco * 3);
    ceu(o.cor); morros(.12, 34, 46, 58, 'rgba(10,24,36,.55)', 1); morros(.35, 24, 40, 42, 'rgba(8,16,26,.85)', 50);
    trilho(y, o.cor);
    const x = Math.min(W * .72, W - 120) - 20;
    if (turbo && !CALMO.matches) {
      c.strokeStyle = 'rgba(242,183,5,.75)'; c.lineWidth = 2;
      for (let i = 0; i < 16; i++) { const l = 50 + rnd(i) * 120, X = W - ((T * (700 + rnd(i + 3) * 700) + rnd(i + 5) * W * 2) % (W + l)); c.beginPath(); c.moveTo(X, 12 + rnd(i + 8) * (H - 50)); c.lineTo(X + l, 12 + rnd(i + 8) * (H - 50)); c.stroke(); }
      fumaca.push({ x: x - o.vagoes * 69 * e, y: y - 8 - Math.random() * 18, v: .5, s: 3 + Math.random() * 4 });
    }
    fumaca = fumaca.filter(f => (f.v -= dt) > 0).slice(-60);
    for (const f of fumaca) { f.x -= (120 + vel * .5) * dt; c.globalAlpha = f.v * 1.6; c.fillStyle = '#f2b705'; c.beginPath(); c.arc(f.x, f.y, f.s, 0, 7); c.fill(); } c.globalAlpha = 1;
    trem(x, y, o.vagoes, o.trem, e);
    if (brilho) { c.fillStyle = `rgba(${o.ruim ? '190,30,20' : '255,226,140'},${brilho * .45})`; c.fillRect(-10, -10, W + 20, H + 20); }
    c.restore();
  }
  function cidade(dt) {
    pos += 14 * dt; ceu();
    morros(.15, 30, 60, 70, 'rgba(9,20,30,.5)', 1);
    const y = H - 24, n = o.torres.length, esp = W / n, j = Math.max(6, Math.min(13, esp / 6)), vao = j * .55, cols = 3;
    o.torres.forEach((t, k) => {
      const lin = Math.ceil(t.janelas.length / cols), w = cols * j + (cols + 1) * vao, pas = Math.min(j + vao, (y - 56) / lin), alt = Math.min(j, pas * .68), h = lin * pas + vao + 10, x = k * esp + (esp - w) / 2, topo = y - h;
      const todas = t.janelas.every(q => q.on);
      c.fillStyle = '#0e1824'; c.fillRect(x, topo, w, h + 8); c.fillStyle = t.cor; c.fillRect(x, topo - 5, w, 5);
      if (todas) { const b = .6 + .4 * Math.sin(T * 3 + k); c.fillStyle = `rgba(242,183,5,${.16 * b})`; c.beginPath(); c.arc(x + w / 2, topo - 14, 26, 0, 7); c.fill(); c.fillStyle = '#f2b705'; c.beginPath(); c.arc(x + w / 2, topo - 14, 5, 0, 7); c.fill(); }
      t.janelas.forEach((q, i) => {
        const X = x + vao + (i % cols) * (j + vao), Y = topo + 6 + Math.floor(i / cols) * pas, nasc = acesas.get(q.id);
        const on = q.on && (nasc === undefined || T >= nasc);
        c.fillStyle = on ? '#ffd877' : '#22303f'; c.fillRect(X, Y, j, alt);
        if (on && nasc !== undefined && T - nasc < .9 && !CALMO.matches) { const p = (T - nasc) / .9; c.globalAlpha = 1 - p; c.fillStyle = '#fff3c4'; const s = j * (1 + p * 4); c.fillRect(X + j / 2 - s / 2, Y + alt / 2 - s / 2, s, s); c.globalAlpha = 1; }
      });
    });
    trilho(y, '#f2b705');
    if (!CALMO.matches) { const v = W + 460; vel = 140; trem((T * 140) % v - 60, y + 2, 3, o.trem, .62); }
  }
  function quadro(t) {
    raf = 0; const dt = Math.min(.05, (t - ant) / 1000 || .016); ant = t; T += dt;
    if (!modo || !W) return;
    modo === 'mapa' ? cidade(dt) : viagem(dt);
    if (!CALMO.matches) raf = requestAnimationFrame(quadro);
  }
  function pintar() { if (!raf) raf = requestAnimationFrame(quadro); }
  addEventListener('resize', () => { if (modo) { medir(); pintar(); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) ant = performance.now(); });
  return {
    esconder() { modo = ''; cv.hidden = true; },
    mapa(torres, trem, novas) {
      modo = 'mapa'; o = { torres, trem }; cv.hidden = false; cv.className = 'mapa'; medir();
      acesas = new Map(); novas.forEach((id, i) => { acesas.set(id, CALMO.matches ? 0 : T + .5 + i * .12); if (i < 12) setTimeout(() => { if (modo === 'mapa') Som.janela(i % 6); }, 500 + i * 120); });
      pintar();
    },
    viagem(cor, trem) { modo = 'viagem'; o = { cor, trem, vagoes: 0, turbo: false }; cv.hidden = false; cv.className = 'viagem'; vel = 60; alvo = 220; fumaca = []; brilho = 0; medir(); pintar(); },
    estado(vagoes, turbo) { o.vagoes = vagoes; o.turbo = turbo; alvo = 200 + vagoes * 45 + (turbo ? 500 : 0); pintar(); },
    acerto() { vel += 320; brilho = .5; o.ruim = false; pintar(); },
    erro() { vel = 20; solavanco = 1; brilho = .6; o.ruim = true; pintar(); },
    parar() { alvo = 0; pintar(); }
  };
})();
