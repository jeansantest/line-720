'use strict';
/* Idioma. A chave de cada texto é o próprio português; o inglês vem de content/idiomas.md e content/dominios-en/. */
const D = JSON.parse(document.getElementById('dados').textContent);
const Idioma = (() => {
  let lang = 'pt';
  const pt = Object.fromEntries(D.questoes.map(q => [q.id, { texto: q.texto, ops: q.ops, porque: q.porque }]));
  const brief = Object.fromEntries(D.dominios.map(d => [d.id, d.briefing]));
  return {
    get atual() { return lang; },
    navegador: () => (/^pt/i.test(navigator.language || 'pt') ? 'pt' : 'en'),
    usar(l) {
      lang = l === 'en' ? 'en' : 'pt';
      document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
      for (const q of D.questoes) Object.assign(q, lang === 'en' ? D.en.questoes[q.id] : pt[q.id]);
      for (const d of D.dominios) d.briefing = lang === 'en' ? D.en.briefing[d.id] : brief[d.id];
    },
    t: (s, ...a) => ((lang === 'en' && D.en.ui[s]) || s).replace(/\{(\d)\}/g, (_, i) => a[i])
  };
})();
const t = Idioma.t;
