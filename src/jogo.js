'use strict';
const B = D.bal, TAM = 5, CHAVE = 'linha720', DIA = 864e5;
const SRS = String(B.srs_dias).split(',').map(Number);
const Q = Object.fromEntries(D.questoes.map(q => [q.id, q]));
const app = document.getElementById('app');

/* ---------- estado ---------- */
const VAZIO = () => ({ v: 1, idioma: Idioma.navegador(), xp: 0, estrelas: {}, cartas: {}, versao: 'nova', provas: [], prova: null, som: true, trem: 0, dias: { ultimo: '', n: 0 }, mis: { dia: '', q: 0, c: 0, v: 0, pago: [] } });
let S = VAZIO();
try { S = valido(JSON.parse(localStorage.getItem(CHAVE))) || VAZIO(); } catch {}
function valido(o) {
  if (!o || typeof o !== 'object' || o.v !== 1) return null;
  const r = VAZIO();
  if (Number.isFinite(o.xp) && o.xp >= 0) r.xp = o.xp;
  if (D.versoes.some(v => v.id === o.versao)) r.versao = o.versao;
  for (const [k, n] of Object.entries(o.estrelas || {})) if (/^[a-z]+-\d+$/.test(k) && [1, 2, 3].includes(n)) r.estrelas[k] = n;
  for (const [k, c] of Object.entries(o.cartas || {}))
    if (Q[k] && c && Number.isInteger(c.caixa) && c.caixa >= 0 && c.caixa < SRS.length && Number.isFinite(c.quando)) r.cartas[k] = { caixa: c.caixa, quando: c.quando, vistas: +c.vistas || 1, certas: +c.certas || 0, ultima: !!c.ultima };
  if (Array.isArray(o.provas)) r.provas = o.provas.filter(p => p && Number.isFinite(p.nota) && Number.isFinite(p.quando)).slice(-20);
  if (['pt', 'en'].includes(o.idioma)) r.idioma = o.idioma;
  if (typeof o.som === 'boolean') r.som = o.som;
  if (TRENS[o.trem] && TRENS[o.trem].nivel <= nivelDe(r.xp)) r.trem = o.trem;
  const ehDia = s => typeof s === 'string' && /^\d{4}-\d\d-\d\d$/.test(s);
  if (o.dias && ehDia(o.dias.ultimo) && Number.isInteger(o.dias.n) && o.dias.n > 0) r.dias = { ultimo: o.dias.ultimo, n: o.dias.n };
  if (o.mis && ehDia(o.mis.dia)) r.mis = { dia: o.mis.dia, q: o.mis.q | 0, c: o.mis.c | 0, v: o.mis.v | 0, pago: Array.isArray(o.mis.pago) ? o.mis.pago.filter(k => ['q', 'c', 'v'].includes(k)) : [] };
  const p = o.prova;
  if (p && Number.isFinite(p.fim) && Array.isArray(p.itens) && p.itens.length && p.itens.every(i => i && Q[i.id] && Q[i.id].tipo !== 'ordem' && Array.isArray(i.ordem) && Array.isArray(i.resp) && i.ordem.length === Q[i.id].ops.length && [...i.ordem].sort((a, b) => a - b).every((x, k) => x === k) && i.resp.every(x => i.ordem.includes(x)))) {
    r.prova = { fim: p.fim, versao: D.versoes.some(v => v.id === p.versao) ? p.versao : r.versao, i: Math.min(Math.max(0, p.i | 0), p.itens.length - 1), itens: p.itens.map(i => ({ id: i.id, ordem: i.ordem, resp: i.resp, marca: !!i.marca })) };
  }
  return r;
}
Idioma.usar(S.idioma);
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch {} };

/* ---------- recompensas ---------- */
function nivelDe(xp) { return Math.floor(xp / B.xp_nivel) + 1; }
const diaDe = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const ontem = () => { const d = new Date(); d.setDate(d.getDate() - 1); return diaDe(d); };
const sequencia = () => [diaDe(), ontem()].includes(S.dias.ultimo) ? S.dias.n : 0;
const MISSOES = { get q() { return [t('Responder {0} questões', B.meta_questoes), B.meta_questoes]; }, get c() { return [t('Fazer {0} cache hits', B.meta_cache), B.meta_cache]; }, get v() { return [t('Concluir uma estação ou revisão'), B.meta_viagens]; } };
function missoes() { if (S.mis.dia !== diaDe()) S.mis = { dia: diaDe(), q: 0, c: 0, v: 0, pago: [] }; return S.mis; }
function ganhar(n) {
  const a = nivelDe(S.xp); S.xp += n; const d = nivelDe(S.xp);
  if (d > a) { const tr = TRENS.findLast(x => x.nivel > a && x.nivel <= d); Fx.aviso(t('Nível {0}', d), tr ? t('Trem liberado: {0}', t(tr.nome)) : t('Continue viajando')); }
}
function progresso(k, n = 1) {
  const m = missoes(); m[k] += n;
  if (m[k] >= MISSOES[k][1] && !m.pago.includes(k)) { m.pago.push(k); Fx.aviso(t('Missão cumprida'), `${MISSOES[k][0]}: +${B.missao_xp} XP`); ganhar(B.missao_xp); }
}
const listaMis = () => { const m = missoes(); return Object.entries(MISSOES).map(([k, [txt, n]]) => ({ k, t: txt, n, v: m[k] })); };
function estudouHoje() {
  if (S.dias.ultimo === diaDe()) return;
  S.dias = { n: sequencia() + 1, ultimo: diaDe() };
  Fx.fogo(S.dias.n); Som.fogo(); if (V) V.fogo = true;
}

/* ---------- utilidades ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inl = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\s][^*]*)\*/g, '<em>$1</em>');
const md = s => s.split(/```\w*\n([\s\S]*?)```/).map((t, i) => i % 2 ? `<pre><code>${esc(t)}</code></pre>` : t.trim().split(/\n\n+/).filter(Boolean).map(p => `<p>${inl(p)}</p>`).join('')).join('');
const misturar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const doDom = id => D.questoes.filter(q => q.dominio === id && !q.sim);
const estacoes = id => { const q = doDom(id), r = []; for (let i = 0; i < q.length; i += TAM) r.push(q.slice(i, i + TAM)); if (r.length > 1 && r.at(-1).length < 3) { const u = r.pop(); r.at(-1).push(...u); } return r; };
const nomeV = v => Idioma.atual === 'en' ? v.nome_en : v.nome;
const peso = (id, v = S.versao) => D.pesos.find(p => p.dominio === id)[v];
const versao = (v = S.versao) => D.versoes.find(x => x.id === v);
const domin = id => { const q = doDom(id); return q.filter(x => S.cartas[x.id]?.ultima).length / q.length; };
const pct = x => Math.round(x * 100) + '%';
const notaDe = x => Math.round(100 + 900 * x);
const igual = (a, b) => a.length === b.length && [...a].sort().every((x, i) => x === [...b].sort()[i]);
const vencidas = () => D.questoes.filter(q => S.cartas[q.id] && S.cartas[q.id].quando <= Date.now());
function registrar(id, ok) {
  if (ok && !S.cartas[id]?.ultima) novas.add(id); else if (!ok) novas.delete(id);
  const c = S.cartas[id] || { caixa: 0, vistas: 0, certas: 0 };
  c.vistas++; if (ok) c.certas++; c.ultima = ok;
  c.caixa = ok ? Math.min(c.caixa + 1, SRS.length - 1) : 0;
  c.quando = Date.now() + SRS[c.caixa] * DIA;
  S.cartas[id] = c;
}
let V = null;
let teclas = null, relogio = null;
function tela(html, acoes = {}, tk = null) {
  clearInterval(relogio); teclas = tk;
  app.innerHTML = html;
  app.onclick = e => { const b = e.target.closest('[data-a]'); if (b && !b.disabled) { const [n, v] = b.dataset.a.split(':'); acoes[n]?.(v); } };
  app.onchange = e => { if (e.target.dataset.c) acoes[e.target.dataset.c]?.(e.target); };
}
addEventListener('keydown', e => { if (!teclas || e.ctrlKey || e.metaKey || e.altKey || /SELECT|INPUT/.test(e.target.tagName)) return; teclas(e); });
const foco = s => app.querySelector(s)?.focus();
const topoPag = () => scrollTo(0, 0);

/* ---------- mapa ---------- */
const novas = new Set();
function mapa() {
  V = null; Som.on = S.som;
  const pronto = D.dominios.reduce((s, d) => s + domin(d.id) * peso(d.id), 0) / D.dominios.reduce((s, d) => s + peso(d.id), 0);
  const venc = vencidas().length, v = versao(), nivel = nivelDe(S.xp), m = missoes(), seq = sequencia();
  const ult = S.provas.at(-1);
  tela(`<header class="topo"><div><h1>${t('Line 720')}</h1><p>${t('Viaje pelos 8 domínios da Claude Certified Developer – Foundations. Destino: {0} pontos.', v.corte)}</p></div>
  <div class="lado"><div class="idioma" role="group" aria-label="${t('Idioma')}">${[['pt', 'PT', 'Português'], ['en', 'EN', 'English']].map(([l, s, n]) => `<button data-a="lang:${l}" lang="${l}" aria-pressed="${S.idioma === l}" title="${n}"><b>${s}</b> ${n}</button>`).join('')}</div><div class="nota num"><b>${pct(pronto)}</b><span class="suave">${t('do percurso dominado')}</span></div></div></header>
  <div class="dia">${Painel.fogo(seq, S.dias.ultimo === diaDe())}${Painel.nivel(S.xp, B.xp_nivel, TRENS)}${Painel.missoes(listaMis(), B.missao_xp)}</div>
  <div class="painel fila">
    <button data-a="rev" ${venc ? '' : 'disabled'}>${t('Revisão: {0} para hoje', venc)}</button>
    <select data-c="versao" aria-label="${t('Versão da prova')}">${D.versoes.map(x => `<option value="${x.id}" ${x.id === S.versao ? 'selected' : ''}>${t('Prova: {0}', esc(nomeV(x)))}</option>`).join('')}</select>
    ${ult ? `<span class="suave num">${t('Último simulado: {0}', ult.nota)}</span>` : ''}
  </div>
  ${Metro.html({ pronto, botao: S.prova ? t('Continuar simulado') : t('Simulado: {0} questões', v.questoes), linhas: D.dominios.map(d => { const es = estacoes(d.id), st = es.map((_, i) => S.estrelas[`${d.id}-${i}`] || 0), p = st.findIndex((s, i) => !s && (i === 0 || st[i - 1])); return { id: d.id, nome: d.nome, cor: d.cor, peso: peso(d.id), pct: domin(d.id), est: st.map((s, i) => ({ s, livre: i === 0 || !!s || !!st[i - 1], prox: i === p })) }; }) })}
  <h2 style="margin:36px 0 12px">${t('Garagem')}</h2><div class="garagem">${TRENS.map((tr, i) => `<button class="tremb ${S.trem === i ? 'sel' : ''}" data-a="trem:${i}" aria-pressed="${S.trem === i}" ${nivel >= tr.nivel ? '' : 'disabled'}><span class="mini" style="--a:${tr.a};--b:${tr.b}"></span><b>${t(tr.nome)}</b><small>${nivel >= tr.nivel ? (S.trem === i ? t('Em uso') : t('Disponível')) : t('Nível {0}', tr.nivel)}</small></button>`).join('')}</div>
  <footer><p>${t('Cada janela da cidade é uma questão: acende quando seu último acerto vale. A espessura de cada linha é o peso do domínio. Projeto independente, sem vínculo com a Anthropic; questões autorais.')}</p>
  <div class="fila"><button class="link" data-a="som">${S.som ? t('Desligar som') : t('Ligar som')}</button><button class="link" data-a="exp">${t('Exportar progresso')}</button><button class="link" data-a="imp">${t('Importar progresso')}</button><button class="link" data-a="zerar">${t('Apagar progresso')}</button></div><p id="msg" role="status"></p></footer>`,
  { lang: l => { S.idioma = l; Idioma.usar(l); salvar(); Som.toque(); mapa(); foco(`[data-a="lang:${l}"]`); }, prova: () => S.prova ? prova() : antesProva(), rev: revisao, est: k => { const [d, i] = k.split('-'); briefing(d, +i); },
    versao: el => { S.versao = el.value; salvar(); mapa(); foco('select'); }, exp: exportar, imp: importar,
    som: () => { S.som = !S.som; salvar(); mapa(); foco('[data-a=som]'); Som.toque(); }, trem: i => { S.trem = +i; salvar(); Som.poder(); mapa(); foco(`[data-a="trem:${i}"]`); },
    zerar: () => { if (confirm(t('Apagar todo o progresso deste navegador? Não dá para desfazer.'))) { S = { ...VAZIO(), idioma: S.idioma }; salvar(); mapa(); } } });
  Metro.desenhar();
  Cena.mapa(D.dominios.map(d => ({ cor: d.cor, janelas: doDom(d.id).map(q => ({ id: q.id, on: !!S.cartas[q.id]?.ultima })) })), TRENS[S.trem], [...novas]);
  novas.clear();
  topoPag();
}
function exportar() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }));
  a.download = 'linha720-progresso.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importar() {
  const i = document.createElement('input'); i.type = 'file'; i.accept = '.json';
  i.onchange = async () => {
    let n = null; try { n = valido(JSON.parse(await i.files[0].text())); } catch {}
    const tem = S.xp > 0 || S.provas.length;
    if (n && tem && !confirm(t('Substituir o progresso atual pelo do arquivo?'))) return;
    if (n) { S = n; Idioma.usar(S.idioma); salvar(); mapa(); }
    document.getElementById('msg').textContent = n ? t('Progresso importado.') : t('Arquivo inválido: escolha um JSON exportado por este jogo.');
  };
  i.click();
}

/* ---------- viagem (estação / revisão) ---------- */
function briefing(dom, i) {
  const d = D.dominios.find(x => x.id === dom);
  V = null; Cena.viagem(d.cor, TRENS[S.trem]);
  tela(`<div class="pilha" style="--cor:${d.cor}"><button class="link" data-a="volta">${t('Voltar ao mapa')}</button><h2>${t('{0}: estação {1}', esc(d.nome), i + 1)}</h2>
  <ul class="brief">${d.briefing.map(b => `<li>${inl(b)}</li>`).join('')}</ul>
  <p style="max-width:62ch">${t('Sua vida é a context window: cada questão gasta {0}k tokens e cada erro, mais {1}k. Com {2} acertos seguidos você entra em cache hit e a questão custa só {3}k.', B.custo_questao, B.custo_erro, B.streak_cache, B.custo_cache)}</p>
  <button class="cheio" data-a="ir">${t('Embarcar')}</button></div>`, { volta: mapa, ir: () => viajar(estacoes(dom)[i], { dom, est: i, cor: d.cor, titulo: t('{0}, estação {1}', d.nome, i + 1) }) });
  foco('.cheio'); topoPag();
}
function revisao() {
  const qs = misturar(vencidas()).slice(0, 10);
  if (qs.length) viajar(qs, { titulo: t('Revisão'), cor: '#1667b7', livre: true });
}
function viajar(qs, o) {
  V = { ...o, qs: misturar(qs), i: 0, usado: 0, combo: 0, certas: 0, xp: 0, compact: B.compact_usos, erros: [], xp0: S.xp, mis0: { ...missoes() } };
  Cena.viagem(V.cor, TRENS[S.trem]);
  proxima();
}
function proxima() {
  const q = V.qs[V.i];
  V.ordem = misturar(q.ops.map((_, i) => i));
  if (q.tipo === 'ordem') while (V.ordem.every((x, i) => x === i)) V.ordem = misturar(V.ordem);
  Cena.estado(V.certas, V.combo >= B.streak_cache);
  V.sel = []; V.fora = []; V.dica = false; V.resp = null;
  desenhar(); topoPag();
}
function listaOps(q, ordem, sel, { fora = [], resp = false } = {}) {
  if (q.tipo === 'ordem') return ordem.map((x, i) => `<div class="op ${resp ? (x === i ? 'certa' : 'errada') : ''}"><span class="k">${i + 1}</span><span>${inl(q.ops[x])}</span>${resp ? `<span class="marca">${x === i ? t('Certo') : t('Posição {0}', x + 1)}</span>` : `<span class="mover"><button data-a="sobe:${i}" aria-label="${t('Subir item {0}', i + 1)}" ${i ? '' : 'disabled'}>↑</button><button data-a="desce:${i}" aria-label="${t('Descer item {0}', i + 1)}" ${i < ordem.length - 1 ? '' : 'disabled'}>↓</button></span>`}</div>`).join('');
  return ordem.map((x, i) => { const s = sel.includes(x), c = q.certas.includes(x);
    const cls = resp ? (c ? 'certa' : s ? 'errada' : '') : '';
    const marca = resp ? (c ? (s ? t('Certo') : t('Era esta')) : s ? t('Errado') : '') : '';
    return `<button class="op ${q.tipo === 'multipla' ? 'multi' : ''} ${s ? 'sel' : ''} ${cls} ${fora.includes(x) ? 'fora' : ''}" data-a="op:${x}" aria-pressed="${s}" ${resp || fora.includes(x) ? 'disabled' : ''}><span class="k">${'ABCDE'[i]}</span><span>${inl(q.ops[x])}</span>${marca ? `<span class="marca">${marca}</span>` : ''}</button>`; }).join('');
}
const alternar = (q, sel, x) => q.tipo === 'unica' ? [x] : sel.includes(x) ? sel.filter(y => y !== x) : sel.length < q.certas.length ? [...sel, x] : sel;
function desenhar() {
  const q = V.qs[V.i], d = D.dominios.find(x => x.id === q.dominio), cabe = c => V.usado + c < B.janela;
  const pode = q.tipo === 'ordem' || V.sel.length === q.certas.length, cache = V.combo >= B.streak_cache;
  tela(`<div style="--cor:${V.cor}"><div class="hud"><div class="fila entre"><strong>${esc(V.titulo)}<small class="suave num"> ${t('{0} de {1}', V.i + 1, V.qs.length)}</small></strong>${Painel.mini(sequencia(), S.dias.ultimo === diaDe(), S.xp, B.xp_nivel)}</div>
  ${V.livre ? '' : `<div class="barra ${V.usado > B.janela * .75 ? 'cheia' : ''}" role="img" aria-label="${t('Context window: {0}k de {1}k tokens', V.usado, B.janela)}"><i style="width:${Math.min(100, V.usado / B.janela * 100)}%"></i></div>
  <div class="fila entre num"><small>${t('Context window: {0}k de {1}k tokens', V.usado, B.janela)}</small>${cache ? '<span class="cache">CACHE HIT</span>' : `<small class="suave">${t('Sequência: {0} de {1}', V.combo, B.streak_cache)}</small>`}</div>`}</div>
  <small class="suave">${esc(d.nome)} / ${esc(q.skill)}</small>
  <div class="enun">${md(q.texto)}</div>${q.tipo === 'ordem' && !V.resp ? `<p class="suave" style="margin-bottom:10px">${t('Use as setas para ordenar.')}</p>` : ''}
  <div class="ops">${listaOps(q, V.ordem, V.sel, { fora: V.fora, resp: !!V.resp })}</div>
  ${V.dica && !V.resp ? `<ul class="brief">${d.briefing.map(b => `<li>${inl(b)}</li>`).join('')}</ul>` : ''}
  ${V.resp ? `<div class="porque ${V.resp.ok ? 'ok' : ''}" role="status"><h3>${V.resp.ok ? t('Certo') : t('Não é isso')}${V.livre ? '' : `, +${V.resp.custo}k tokens`}</h3>${md(q.porque)}</div>
  <button class="cheio" id="seg" data-a="seg">${V.usado >= B.janela || V.i + 1 >= V.qs.length ? t('Ver resultado') : t('Próxima questão')}</button>`
  : `<div class="fila entre"><button class="cheio" data-a="ok" ${pode ? '' : 'disabled'}>${t('Responder')}</button>
  ${V.livre ? '' : `<div class="fila poderes"><button data-a="compact" ${V.compact && V.usado ? '' : 'disabled'} title="${t('Libera até {0}k tokens', B.compact_libera)}">/compact −${B.compact_libera}k</button><button data-a="grep" ${q.tipo !== 'unica' || V.fora.length || !cabe(B.custo_grep) ? 'disabled' : ''} title="${t('Elimina 2 alternativas erradas')}">grep +${B.custo_grep}k</button><button data-a="adv" ${V.dica || !cabe(B.custo_advisor) ? 'disabled' : ''} title="${t('Mostra as ideias-chave do domínio')}">advisor +${B.custo_advisor}k</button></div>`}</div>`}
  <footer><button class="link" data-a="sair">${t('Desembarcar')}</button></footer></div>`,
  { op: x => { Som.toque(); V.sel = alternar(q, V.sel, +x); desenhar(); foco(`[data-a="op:${x}"]`); },
    sobe: i => mover(+i, -1), desce: i => mover(+i, 1), ok: responder, seg: seguir, sair: mapa,
    compact: () => { Som.poder(); V.compact--; V.usado = Math.max(0, V.usado - B.compact_libera); desenhar(); },
    grep: () => { Som.poder(); V.usado += B.custo_grep; V.fora = misturar(V.ordem.filter(x => !q.certas.includes(x))).slice(0, 2); V.sel = V.sel.filter(x => !V.fora.includes(x)); desenhar(); },
    adv: () => { Som.poder(); V.usado += B.custo_advisor; V.dica = true; desenhar(); } },
  e => {
    if (e.repeat) return;
    if (!V.resp && q.tipo !== 'ordem') { const n = 'abcde'.indexOf(e.key.toLowerCase()), k = n >= 0 && e.key.length === 1 ? n : '12345'.indexOf(e.key); if (e.key.length === 1 && k >= 0 && k < V.ordem.length && !V.fora.includes(V.ordem[k])) { const x = V.ordem[k]; V.sel = alternar(q, V.sel, x); desenhar(); return; } }
    if (e.key === 'Enter' && !(e.target.closest && e.target.closest('button:not(.op)'))) { e.preventDefault(); V.resp ? seguir() : pode && responder(); }
  });
}
function mover(i, p) { const o = V.ordem; [o[i], o[i + p]] = [o[i + p], o[i]]; desenhar(); (app.querySelector(`[data-a="${p < 0 ? 'sobe' : 'desce'}:${i + p}"]:not(:disabled)`) || app.querySelector(`[data-a="${p < 0 ? 'desce' : 'sobe'}:${i + p}"]`)).focus(); }
function responder() {
  if (V.resp) return;
  const q = V.qs[V.i], ok = q.tipo === 'ordem' ? V.ordem.every((x, i) => x === i) : igual(V.sel, q.certas);
  const cache = V.combo >= B.streak_cache, custo = (cache ? B.custo_cache : B.custo_questao) + (ok ? 0 : B.custo_erro);
  if (!V.livre) V.usado += custo;
  if (ok) { V.combo++; V.certas++; const g = B.xp_acerto + (cache && !V.livre ? B.xp_cache : 0); V.xp += g; ganhar(g); V.ganho = g; } else { V.combo = 0; V.erros.push(q); }
  registrar(q.id, ok); estudouHoje(); progresso('q'); if (ok && cache && !V.livre) progresso('c'); salvar();
  V.resp = { ok, custo }; desenhar(); foco('#seg');
  const virou = ok && V.combo === B.streak_cache && !V.livre, alvo = app.querySelector('.op.certa');
  Cena.estado(V.certas, V.combo >= B.streak_cache);
  if (ok) { Cena.acerto(); virou ? Som.turbo() : Som.certo(V.combo); Fx.de(alvo, cache || virou ? 60 : 26, cache || virou ? ['#f2b705', '#fff3c4', '#ff7a59'] : [V.cor, '#6fd398', '#ffffff']); Fx.texto(alvo, `+${V.ganho} XP`); if (virou) { Fx.texto(document.querySelector('.hud'), 'CACHE HIT', 'grande'); vibrar([30, 40, 60]); } else vibrar(25); Fx.anim(alvo, 'pulo', 450); }
  else { Cena.erro(); Som.erro(); vibrar(120); Fx.anim(app, 'treme', 400); }
}
function seguir() {
  if (V.usado >= B.janela && !V.livre && V.i + 1 < V.qs.length) return fimViagem(true);
  if (++V.i >= V.qs.length) return fimViagem(false);
  proxima();
}
function fimViagem(estourou) {
  const cena = V;
  const ac = V.certas / V.qs.length, passou = !estourou && ac * 100 >= B.corte_estacao;
  let est = 0;
  if (!V.livre && passou) { est = ac === 1 ? 3 : ac >= .8 ? 2 : 1; const k = `${V.dom}-${V.est}`; S.estrelas[k] = Math.max(S.estrelas[k] || 0, est); salvar(); }
  if (V.livre || passou) progresso('v');
  salvar(); Cena.parar();
  const titulo = V.livre ? t('Revisão concluída') : estourou ? t('Context window cheia') : passou ? t('Estação concluída') : t('Ainda não');
  const subiu = nivelDe(S.xp) > nivelDe(V.xp0), de = subiu ? 0 : V.xp0 % B.xp_nivel / B.xp_nivel;
  const prox = !V.livre && passou && estacoes(V.dom)[V.est + 1];
  tela(`<div class="pilha" style="--cor:${V.cor}"><h2>${titulo}</h2><div class="result num">${V.certas}/${V.qs.length}</div>
  ${est ? `<div class="estrelas" role="img" aria-label="${t('{0} de 3 estrelas', est)}">${[0, 1, 2].map(i => `<span class="${i < est ? 'on' : ''}" style="--i:${i}">★</span>`).join('')}</div>` : ''}<p>+${V.xp} XP. ${novas.size ? novas.size === 1 ? t('1 janela nova vai acender na sua cidade.') : t('{0} janelas novas vão acender na sua cidade.', novas.size) : ''} ${estourou ? t('O contexto estourou antes do fim. Use /compact antes de chegar ao limite.') : !V.livre && !passou ? t('São necessários {0}% para abrir a próxima.', B.corte_estacao) : ''}</p>
  ${V.erros.length ? `<p>${t('Os erros já entraram na revisão: {0}.', esc([...new Set(V.erros.map(q => q.skill))].join(', ')))}</p>` : ''}
  <div class="fila">${prox ? `<button class="cheio" data-a="prox">${t('Próxima estação')}</button>` : ''}${V.livre ? '' : `<button data-a="rep">${t('Repetir')}</button>`}<button data-a="mapa">${t('Mapa')}</button></div>
  <div class="dia fim">${V.fogo ? Painel.fogo(sequencia(), true) : ''}${Painel.nivel(S.xp, B.xp_nivel, TRENS)}${Painel.missoes(listaMis(), B.missao_xp, V.mis0)}</div></div>`,
  { mapa, rep: () => briefing(cena.dom, cena.est), prox: () => briefing(cena.dom, cena.est + 1) });
  Fx.encher(app.querySelector('.nivel .grossa i'), de); Fx.encher(app.querySelector('.nivel .anel'), de);
  listaMis().forEach(m => Fx.encher(app.querySelector(`.mis.${m.k} i`), Math.min(1, (V.mis0.dia === S.mis.dia ? V.mis0[m.k] : 0) / m.n)));
  app.querySelectorAll('.mis.nova').forEach((el, i) => setTimeout(() => { if (V === cena) { Som.poder(); Fx.de(el.querySelector('.premio'), 30, ['#f2b705', '#6fd398', '#fff3c4']); } }, 1300 + i * 350));
  for (let i = 0; i < est; i++) setTimeout(() => { if (V === cena) { Som.estrela(i); Fx.de(app.querySelectorAll('.estrelas span')[i], 24, ['#f2b705', '#fff3c4']); } }, 350 + i * 380);
  if (est === 3 || (V.livre && ac === 1)) setTimeout(() => { if (V === cena) { Som.festa(); Fx.festa([V.cor, '#f2b705', '#fff3c4', '#7fd1c4']); } }, 1500);
  foco('button'); topoPag();
}

/* ---------- simulado ---------- */
function antesProva() {
  const v = versao(), itens = montar(v), novos = itens.filter(q => q.sim && !S.cartas[q.id]).length;
  Cena.esconder();
  tela(`<div class="pilha"><button class="link" data-a="volta">${t('Voltar ao mapa')}</button><h2>${t('Simulado')}</h2><p style="max-width:62ch">${t('{0} questões em {1} minutos, nos pesos da prova ({2}). Sem ajuda e sem correção até o fim. O relógio continua se você fechar a página.', v.questoes, v.minutos, esc(nomeV(v)))}</p><p style="max-width:62ch">${novos ? t('{0} cenários inéditos neste simulado. Só eles medem de verdade: nota com questão repetida tende a subir.', novos) : t('Você já viu todos os cenários. Esta nota tende a ficar acima da real.')}</p><button class="cheio" data-a="ir">${t('Começar')}</button></div>`,
  { volta: mapa, ir: () => {
    S.prova = { versao: v.id, i: 0, fim: Date.now() + v.minutos * 6e4, itens: itens.map(q => ({ id: q.id, ordem: misturar(q.ops.map((_, i) => i)), resp: [], marca: false })) };
    salvar(); prova(); } });
  topoPag();
}
// Cenários inéditos primeiro, depois os já vistos, depois questões das estações.
const poolProva = id => { const s = misturar(D.questoes.filter(q => q.dominio === id && q.sim)); return [...s.filter(q => !S.cartas[q.id]), ...s.filter(q => S.cartas[q.id]), ...misturar(doDom(id).filter(q => q.tipo !== 'ordem'))]; };
function montar(v) {
  const tot = D.dominios.reduce((s, d) => s + peso(d.id, v.id), 0);
  const c = D.dominios.map(d => { const ex = peso(d.id, v.id) / tot * v.questoes, pool = poolProva(d.id); return { ex, pool, n: Math.min(Math.floor(ex), pool.length) }; });
  let falta = v.questoes - c.reduce((s, x) => s + x.n, 0);
  while (falta > 0) { const x = c.filter(x => x.n < x.pool.length).sort((a, b) => (b.ex - b.n) - (a.ex - a.n))[0]; if (!x) break; x.n++; falta--; }
  return misturar(c.flatMap(x => x.pool.slice(0, x.n)));
}
function prova() {
  const P = S.prova;
  if (!P) return mapa();
  Cena.esconder();
  if (Date.now() >= P.fim) return corrigir();
  const it = P.itens[P.i], q = Q[it.id], resp = P.itens.filter(x => x.resp.length === Q[x.id].certas.length).length;
  const ir = n => { P.i = Math.max(0, Math.min(P.itens.length - 1, n)); salvar(); prova(); topoPag(); };
  const escolher = x => { it.resp = alternar(q, it.resp, x); salvar(); prova(); foco(`[data-a="op:${x}"]`); };
  tela(`<div class="hud fila entre"><strong class="num">${t('Questão {0} de {1}', P.i + 1, P.itens.length)}</strong><strong class="num" id="rel"></strong></div>
  <div class="enun">${md(q.texto)}</div><div class="ops">${listaOps(q, it.ordem, it.resp)}</div>
  <div class="fila entre"><div class="fila"><button data-a="ant" ${P.i ? '' : 'disabled'}>${t('Anterior')}</button><button class="cheio" data-a="seg" ${P.i < P.itens.length - 1 ? '' : 'disabled'}>${t('Próxima')}</button></div><button data-a="marca" aria-pressed="${it.marca}">${it.marca ? t('Desmarcar') : t('Marcar para rever')}</button></div>
  <div class="grade">${P.itens.map((x, i) => `<button class="num ${x.resp.length === Q[x.id].certas.length ? 'r' : ''} ${x.marca ? 'm' : ''} ${i === P.i ? 'at' : ''}" data-a="n:${i}" aria-label="${[t('Questão {0}', i + 1), x.resp.length && t('respondida'), x.marca && t('marcada')].filter(Boolean).join(', ')}">${i + 1}</button>`).join('')}</div>
  <div class="fila"><button data-a="fim">${t('Entregar ({0} respondidas)', resp)}</button><button class="link" data-a="sair">${t('Voltar ao mapa')}</button></div>`,
  { op: x => escolher(+x), ant: () => ir(P.i - 1), seg: () => ir(P.i + 1), n: i => ir(+i), marca: () => { it.marca = !it.marca; salvar(); prova(); foco('[data-a=marca]'); }, sair: mapa,
    fim: () => { const f = P.itens.length - resp; if (!f || confirm(t('Faltam {0} questões. Entregar mesmo assim?', f))) corrigir(); } },
  e => { if (e.repeat || e.key.length > 1) { if (e.key === 'ArrowRight') ir(P.i + 1); if (e.key === 'ArrowLeft') ir(P.i - 1); return; } const k = 'abcde'.indexOf(e.key.toLowerCase()); if (k >= 0 && k < it.ordem.length) escolher(it.ordem[k]); });
  const tique = () => { const r = Math.max(0, P.fim - Date.now()) / 1000 | 0; if (!r) return corrigir(); document.getElementById('rel').textContent = `${r / 3600 | 0}:${String((r % 3600) / 60 | 0).padStart(2, '0')}:${String(r % 60).padStart(2, '0')}`; };
  relogio = setInterval(tique, 1000); tique();
}
function corrigir() {
  clearInterval(relogio);
  const P = S.prova; if (!P) return;
  const v = versao(P.versao), por = {}, erros = [];
  let certas = 0;
  for (const it of P.itens) {
    const q = Q[it.id], ok = igual(it.resp, q.certas), d = por[q.dominio] ||= { n: 0, c: 0 };
    d.n++; if (ok) { d.c++; certas++; } else erros.push(it);
    if (it.resp.length) { registrar(q.id, ok); progresso('q'); estudouHoje(); }
  }
  ganhar(certas * B.xp_acerto);
  const nota = notaDe(certas / P.itens.length);
  S.provas.push({ nota, quando: Date.now() }); S.provas = S.provas.slice(-20); S.prova = null; salvar();
  tela(`<div class="pilha"><h2>${nota >= v.corte ? t('Você chegou à estação {0}', v.corte) : t('Faltaram {0} pontos', v.corte - nota)}</h2><div class="result num">${nota}</div>
  <p style="max-width:62ch">${t('{0} de {1} certas. Nota de treino, linear: a Anthropic não publica a conversão da nota real, então não use como previsão exata.', certas, P.itens.length)}</p></div>
  <table><tr><th>${t('Domínio')}</th><th>${t('Acerto')}</th></tr>${D.dominios.filter(d => por[d.id]).map(d => `<tr><td>${esc(d.nome)}</td><td class="num">${por[d.id].c}/${por[d.id].n}</td></tr>`).join('')}</table>
  <button class="cheio" data-a="mapa">${t('Voltar ao mapa')}</button>
  ${erros.length ? `<h2 style="margin:36px 0 12px">${t('Correção')}</h2>${erros.map(it => { const q = Q[it.id]; return `<div class="enun">${md(q.texto)}</div><div class="ops">${listaOps(q, it.ordem, it.resp, { resp: true })}</div><div class="porque">${md(q.porque)}</div>`; }).join('')}` : ''}`, { mapa });
  if (nota >= v.corte) { Som.festa(); Fx.festa(['#f2b705', '#fff3c4', '#6fd398']); }
  topoPag();
}

mapa();
