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
    const feixe = esp.reduce((s, x) => s + x + vao, 0), term = el.querySelector('.terminal'), yFim = topo + n * alt + 10, H = yFim + term.offsetHeight + 16;
    el.style.height = H + 'px'; term.style.top = yFim + 'px';
    const svg = el.querySelector('.vias'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    let x = W - (estreito ? 12 : 30), rio = `<path class="rio" d="M-20 ${H * .3}C${W * .25} ${H * .2} ${W * .3} ${H * .55} ${W * .55} ${H * .5}S${W * .8} ${H * .8} ${W + 20} ${H * .72}"/>`, out = '';
    for (let g = 0; g < 26; g++) { const r = Math.sin(g * 91.7) * .5 + .5, q = Math.sin(g * 37.3 + 2) * .5 + .5; out += `<rect class="quadra" x="${(r * W).toFixed(0)}" y="${(q * H).toFixed(0)}" width="${30 + r * 60}" height="${22 + q * 40}" rx="6"/>`; }
    out += rio;
    dados.linhas.forEach((l, k) => {
      const y = topo + k * alt, tx = x - esp[k] / 2; x -= esp[k] + vao;
      const x1 = W - feixe - (estreito ? 44 : 100), q = l.est.length, px = i => q === 1 ? pad : pad + (x1 - pad) * i / (q - 1), r = 26;
      const via = `M${pad} ${y}H${tx - r}Q${tx} ${y} ${tx} ${y + r}V${yFim + 4}`, feitas = l.est.filter(s => s.s).length, tudo = feitas === q;
      let ult = -1; while (ult + 1 < q && l.est[ult + 1].s) ult++;
      out += `<path d="${via}" class="apag" stroke="${l.cor}" stroke-width="${esp[k]}"/>`;
      if (ult >= 0) { const v = tudo ? via : `M${pad} ${y}H${ult + 1 < q ? px(ult + 1) : px(ult)}`; out += `<path d="${v}" class="luz" stroke="${l.cor}" stroke-width="${esp[k]}"/><path d="${v}" class="fluxo" stroke-width="${Math.max(2, esp[k] * .3)}"/>`; }
      l.est.forEach((s, i) => { const b = el.querySelector(`[data-p="${k}-${i}"]`); b.style.left = px(i) + 'px'; b.style.top = y + 'px'; });
      const rot = el.querySelector(`.rotulo[data-k="${k}"]`); rot.style.top = y - 64 + 'px'; rot.style.left = (estreito ? 10 : 30) + 'px'; rot.style.maxWidth = W - feixe - (estreito ? 34 : 60) + 'px';
    });
    svg.innerHTML = out;
  }
  addEventListener('resize', desenhar);
  return { html, desenhar };
})();
