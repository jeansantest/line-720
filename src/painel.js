'use strict';
/* Chama, nível e missões: só monta HTML. As regras ficam em jogo.js. */
const Painel = (() => {
  let uid = 0;
  const CHAMAS = [[30, 'azul'], [7, 'rubra'], [0, '']];
  const tier = n => CHAMAS.find(c => n >= c[0])[1];
  const chama = (acesa, n = 1, cls = '') => `<svg class="chama ${acesa ? 'acesa ' + tier(n) : 'apagada'} ${cls}" viewBox="0 0 64 80" aria-hidden="true"><path class="f1" d="M33 2c4 13 25 24 25 47 0 17-11 29-26 29S6 67 6 50c0-12 7-18 10-28 5 3 7 7 8 12C31 26 34 15 33 2z"/><path class="f2" d="M34 26c2 9 14 16 14 29 0 12-7 20-16 20s-16-7-16-18c0-8 5-12 7-18 4 2 5 5 6 8 4-6 6-13 5-21z"/><path class="f3" d="M33 50c1 5 7 8 7 15 0 6-3 10-8 10s-8-4-8-9c0-6 7-9 9-16z"/></svg>`;
  function semana(n, jogou) {
    const hoje = new Date();
    return `<ol class="semana">${[6, 5, 4, 3, 2, 1, 0].map(a => {
      const d = new Date(hoje); d.setDate(d.getDate() - a);
      const on = jogou ? a < n : a >= 1 && a <= n;
      return `<li class="${on ? 'on' : ''} ${a ? '' : 'hoje'}" aria-label="${d.toLocaleDateString(Idioma.atual === 'en' ? 'en-US' : 'pt-BR', { weekday: 'long' })}${on ? ', ' + t('estudou') : ''}"><span>${(Idioma.atual === 'en' ? 'SMTWTFS' : 'DSTQQSS')[d.getDay()]}</span><i>${on ? chama(true, n) : ''}</i></li>`;
    }).join('')}</ol>`;
  }
  function fogo(n, jogou) {
    return `<section class="cartao fogo ${jogou ? 'vivo ' + tier(n) : ''}"><div class="fogo-topo"><div class="fogao">${chama(jogou, n, 'grande')}</div><div><b class="num">${n}</b><strong>${n === 1 ? t('dia em chamas') : t('dias em chamas')}</strong></div></div>${semana(n, jogou)}<p>${jogou ? t('Fogo garantido por hoje.') : n ? t('Responda uma questão para manter o fogo.') : t('Responda uma questão para acender o fogo.')}</p></section>`;
  }
  function medalha(nivel, p, cls = '') {
    const r = 44, vo = 2 * Math.PI * r, g = 'm' + ++uid;
    return `<svg class="medalha ${cls}" viewBox="0 0 110 110" role="img" aria-label="${t('Nível {0}', nivel)}"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe27a"/><stop offset="1" stop-color="#f08a00"/></linearGradient></defs><circle cx="55" cy="55" r="${r}" class="trilha"/><circle cx="55" cy="55" r="${r}" class="anel" stroke="url(#${g})" style="stroke-dasharray:${vo};stroke-dashoffset:${vo * (1 - p)}"/><path d="M55 20l27 12v22c0 18-12 29-27 36-15-7-27-18-27-36V32z" fill="url(#${g})"/><path d="M55 20l27 12v22c0 18-12 29-27 36z" fill="#0002"/><text x="55" y="66" text-anchor="middle">${nivel}</text></svg>`;
  }
  function nivel(xp, porNivel, trens) {
    const n = Math.floor(xp / porNivel) + 1, p = xp % porNivel, prox = trens.find(x => x.nivel > n);
    return `<section class="cartao nivel">${medalha(n, p / porNivel)}<div class="nivel-txt"><strong>${t('Nível {0}', n)}</strong><div class="grossa ouro"><i style="width:${p / porNivel * 100}%"></i><em class="num">${p} / ${porNivel} XP</em></div>${prox ? `<p class="prox"><span class="mini" style="--a:${prox.a};--b:${prox.b}"></span><span>${t('{0} no nível {1}', t(prox.nome), prox.nivel)}</span></p>` : `<p>${t('Todos os trens liberados.')}</p>`}</div></section>`;
  }
  const ICO = {
    q: '<path d="M4 10h40v9a5 5 0 000 10v9H4v-9a5 5 0 000-10z"/><path class="c" d="M15 18h14v4H15zm0 8h18v4H15z"/>',
    c: '<path d="M28 2L8 28h13l-4 18 23-28H26z"/>',
    v: '<path d="M10 6h28a6 6 0 016 6v20a6 6 0 01-6 6H10a6 6 0 01-6-6V12a6 6 0 016-6zm2 34h6l-5 6H7zm18 0h6l5 6h-6z"/><path class="c" d="M9 12h13v11H9zm17 0h13v11H26zM10 28h6v5h-6zm22 0h6v5h-6z"/>'
  };
  function missoes(lista, xp, antes) {
    const feitas = lista.filter(m => m.v >= m.n).length;
    return `<section class="cartao missoes"><header><h2>${t('Missões de hoje')}</h2><span class="num">${t('{0} de {1}', feitas, lista.length)}</span></header>${lista.map(m => {
      const ok = m.v >= m.n, v = Math.min(m.v, m.n), nova = antes && antes[m.k] < m.n && ok;
      return `<div class="mis ${m.k} ${ok ? 'feita' : ''} ${nova ? 'nova' : ''}"><svg class="ico" viewBox="0 0 48 48" aria-hidden="true">${ICO[m.k]}</svg><div><strong>${m.t}</strong><div class="grossa"><i style="width:${v / m.n * 100}%"></i><em class="num">${v} / ${m.n}</em></div></div><span class="premio">${ok ? `<svg viewBox="0 0 48 48" aria-label="${t('Cumprida')}"><path d="M10 25l10 10 19-22"/></svg>` : `<b>+${xp}</b><small>XP</small>`}</span></div>`;
    }).join('')}</section>`;
  }
  const mini = (n, jogou, xp, porNivel) => `<span class="mini-status"><span class="ms-fogo" aria-label="${t('{0} dias seguidos', n)}">${chama(jogou, n)}<b class="num">${n}</b></span>${medalha(Math.floor(xp / porNivel) + 1, xp % porNivel / porNivel, 'peq')}</span>`;
  return { chama, semana, fogo, nivel, missoes, medalha, mini };
})();
