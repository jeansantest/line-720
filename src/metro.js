'use strict';
/* Mapa do metrô: 8 linhas que descem em feixe até a estação 720. Só desenha. */
const Metro = (() => {
  const CADEADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0110 0v3h1.500a1.500 1.500 0 011.500 1.500v8a1.500 1.500 0 01-1.500 1.500h-13A1.500 1.500 0 014 19.500v-8A1.500 1.500 0 015.500 10zm2.500 0h5V7a2.500 2.500 0 00-5 0z"/></svg>';
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>';
  const e = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let dados = null;
  function html(d) {
    dados = d;
    return `<section class="metro" aria-label="${t('Mapa das linhas')}"><svg class="vias" aria-hidden="true"></svg>
    ${d.linhas.map((l, k) => `<div class="rotulo" data-k="${k}" style="--cor:${l.cor}"><b class="num">${k + 1}</b><strong>${e(l.nome)}</strong><span class="num">${t('{0}% da prova', l.peso)}</span><em class="num">${Math.round(l.pct * 100)}%</em></div>
    ${l.est.map((s, i) => `<button class="pt ${s.s ? 'feita' : s.prox ? 'prox' : s.livre ? '' : 'trava'}" data-p="${k}-${i}" data-a="est:${l.id}-${i}" style="--cor:${l.cor}" ${s.livre ? '' : 'disabled'} aria-label="${e(l.nome)}, ${t('estação {0}', i + 1)}, ${s.livre ? t('{0} de 3 estrelas', s.s) : t('bloqueada')}"><span>${s.s ? i + 1 : s.prox ? PLAY : s.livre ? i + 1 : CADEADO}</span>${s.s ? `<small>${[1, 2, 3].map(n => `<i class="${n <= s.s ? 'on' : ''}">★</i>`).join('')}</small>` : ''}</button>`).join('')}`).join('')}
    <div class="terminal ${d.pronto >= .999 ? 'cheio' : ''}"><div class="t720">720</div><div class="t-info"><strong>${t('Estação final')}</strong><div class="grossa ouro"><i style="width:${d.pronto * 100}%"></i><em class="num">${t('{0}% dominado', Math.round(d.pronto * 100))}</em></div></div><button class="cheio" data-a="prova">${e(d.botao)}</button></div></section>`;
  }
  function desenhar() {
    const el = document.querySelector('.metro'); if (!el || !dados) return;
    const W = el.clientWidth, estreito = W < 600, pad = estreito ? 34 : 56, alt = 124, n = dados.linhas.length, topo = 78;
    const esp = dados.linhas.map(l => estreito ? 3 + l.peso * .14 : 2 + l.peso * .6), vao = estreito ? 2 : 4;
    const feixe = esp.reduce((s, x) => s + x + vao, 0), term = el.querySelector('.terminal'), x1 = W - feixe - (estreito ? 32 : 100), porLinha = Math.max(2, Math.floor((x1 - pad) / (estreito ? 46 : 84)) + 1), fila = estreito ? 72 : 92,
      filas = dados.linhas.map(l => Math.ceil(l.est.length / porLinha)), yFim = topo + n * alt + filas.reduce((a, f) => a + (f - 1) * fila, 0) + 10, H = yFim + term.offsetHeight + 16;
    el.style.height = H + 'px'; term.style.top = yFim + 'px';
    const svg = el.querySelector('.vias'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    let x = W - (estreito ? 12 : 30), rio = `<path class="rio" d="M-20 ${H * .3}C${W * .25} ${H * .2} ${W * .3} ${H * .55} ${W * .55} ${H * .5}S${W * .8} ${H * .8} ${W + 20} ${H * .72}"/>`, out = '';
    for (let g = 0; g < 26; g++) { const r = Math.sin(g * 91.7) * .5 + .5, q = Math.sin(g * 37.3 + 2) * .5 + .5; out += `<rect class="quadra" x="${(r * W).toFixed(0)}" y="${(q * H).toFixed(0)}" width="${30 + r * 60}" height="${22 + q * 40}" rx="6"/>`; }
    out += rio;
    let yl = topo;
    dados.linhas.forEach((l, k) => {
      const y = yl, nf = filas[k], yS = y + (nf - 1) * fila, tx = x - esp[k] / 2; x -= esp[k] + vao;
      yl = yS + alt;
      const q = l.est.length, cap = Math.ceil(q / nf), r = 26;
      // serpentina: a última fila sempre vai da esquerda para a direita, rumo ao feixe
      const pos = i => { const f = Math.floor(i / cap), c = i % cap, d = cap === 1 ? 0 : (x1 - pad) * c / (cap - 1); return { x: (nf - 1 - f) % 2 ? x1 - d : pad + d, y: y + f * fila }; };
      const ate = m => { let d = `M${pos(0).x} ${pos(0).y}`; for (let i = 1; i <= m; i++) { const a = pos(i - 1), b = pos(i); d += a.y === b.y ? `H${b.x}` : `C${a.x + (a.x > W / 2 - feixe ? 34 : -34)} ${a.y} ${b.x + (a.x > W / 2 - feixe ? 34 : -34)} ${b.y} ${b.x} ${b.y}`; } return d; };
      const via = ate(q - 1) + `H${tx - r}Q${tx} ${yS} ${tx} ${yS + r}V${yFim + 4}`, tudo = l.est.every(s => s.s);
      let ult = -1; while (ult + 1 < q && l.est[ult + 1].s) ult++;
      out += `<path d="${via}" class="apag" stroke="${l.cor}" stroke-width="${esp[k]}"/>`;
      if (ult >= 0) { const v = tudo ? via : ate(Math.min(ult + 1, q - 1)); out += `<path d="${v}" class="luz" stroke="${l.cor}" stroke-width="${esp[k]}"/><path d="${v}" class="fluxo" stroke-width="${Math.max(2, esp[k] * .3)}"/>`; }
      l.est.forEach((s, i) => { const b = el.querySelector(`[data-p="${k}-${i}"]`), p = pos(i); b.style.left = p.x + 'px'; b.style.top = p.y + 'px'; });
      const rot = el.querySelector(`.rotulo[data-k="${k}"]`); rot.style.top = y - 64 + 'px'; rot.style.left = (estreito ? 10 : 30) + 'px'; rot.style.maxWidth = W - feixe - (estreito ? 34 : 60) + 'px';
    });
    svg.innerHTML = out;
  }
  addEventListener('resize', desenhar);
  return { html, desenhar };
})();
