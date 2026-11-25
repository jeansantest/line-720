// Gera index.html a partir de content/*.md e src/*. Sem dependências.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = dirname(fileURLToPath(import.meta.url));
const ler = p => readFileSync(join(raiz, p), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
const erros = [], avisos = [];
const num = v => (/^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v);

function tabelas(md) {
  const saida = []; let atual = null;
  for (const l of md.split('\n')) {
    if (!l.trim().startsWith('|')) { atual = null; continue; }
    const cel = l.trim().slice(1, -1).split('|').map(s => s.trim());
    if (!atual) saida.push(atual = { cab: cel, linhas: [] });
    else if (!cel.every(c => /^:?-+:?$/.test(c))) atual.linhas.push(Object.fromEntries(atual.cab.map((h, i) => [h, num(cel[i] ?? '')])));
  }
  return saida.map(t => t.linhas);
}

function questao(txt, dominio) {
  const linhas = txt.split('\n');
  const q = { id: linhas.shift().trim(), dominio, tipo: '', skill: '', texto: '', ops: [], certas: [], porque: '' };
  const texto = [], porque = [];
  let cerca = false;
  for (const l of linhas) {
    let m;
    if (l.startsWith('```')) cerca = !cerca;
    if (!cerca && (m = l.match(/^(tipo|skill): *(.+)$/)) && !q[m[1]]) q[m[1]] = m[2].trim();
    else if (!cerca && (m = l.match(/^- \[( |x)\] (.+)$/))) { if (m[1] === 'x') q.certas.push(q.ops.length); q.ops.push(m[2]); }
    else if (!cerca && q.tipo === 'ordem' && (m = l.match(/^\d+\. (.+)$/))) q.ops.push(m[1]);
    else if (!cerca && l.startsWith('>')) porque.push(l.replace(/^> ?/, ''));
    else texto.push(l);
  }
  q.texto = texto.join('\n').trim();
  q.porque = porque.join(' ').trim();
  const e = m => erros.push(`${q.id}: ${m}`);
  if (!/^[a-z]+-\d+$/.test(q.id) || !q.id.startsWith(dominio + '-')) e('ID inválido para este domínio');
  if (!['unica', 'multipla', 'ordem'].includes(q.tipo)) e('tipo inválido');
  if (!q.skill) e('falta skill');
  if (!q.texto) e('falta enunciado');
  if (!q.porque) e('falta explicação (> ...)');
  if (new Set(q.ops).size !== q.ops.length) e('alternativas repetidas');
  if (q.tipo === 'unica' && (q.certas.length !== 1 || q.ops.length !== 4)) e('unica precisa de 4 alternativas e 1 certa');
  if (q.tipo === 'multipla' && (q.certas.length < 2 || q.certas.length >= q.ops.length || q.ops.length < 4)) e('multipla precisa de 4+ alternativas e 2+ certas');
  if (q.tipo === 'ordem' && q.ops.length < 3) e('ordem precisa de 3+ itens');
  const m = q.texto.match(/Escolha (\d)/);
  if (q.tipo === 'multipla' && (!m || Number(m[1]) !== q.certas.length)) e('enunciado deve dizer "(Escolha N)" com o N certo');
  if (q.tipo === 'ordem') q.certas = q.ops.map((_, i) => i);
  return q;
}

const dominios = [], questoes = [];
for (const f of readdirSync(join(raiz, 'content/dominios')).filter(f => f.endsWith('.md')).sort()) {
  const md = ler('content/dominios/' + f);
  const meta = Object.fromEntries([...md.split('\n# ')[0].matchAll(/^(\w+): *(.+)$/gm)].map(m => [m[1], m[2].trim()]));
  for (const k of ['id', 'nome', 'cor']) if (!meta[k]) erros.push(`${f}: falta ${k}`);
  const brief = (md.match(/\n# Briefing\n([\s\S]*?)\n# /) || [])[1] || '';
  dominios.push({ ...meta, briefing: [...brief.matchAll(/^- (.+)$/gm)].map(m => m[1]) });
  for (const b of md.split(/^## /m).slice(1)) questoes.push(questao(b, meta.id));
}

// ---------- inglês: só texto; tipo e gabarito vêm do português ----------
const en = { questoes: {}, briefing: {}, ui: {} };
for (const f of readdirSync(join(raiz, 'content/dominios')).filter(f => f.endsWith('.md')).sort()) {
  const dom = (ler('content/dominios/' + f).match(/^id: *(.+)$/m) || [])[1];
  let md; try { md = ler('content/dominios-en/' + f); } catch { erros.push(`dominios-en/${f}: arquivo não existe`); continue; }
  en.briefing[dom] = [...md.split(/^# Questions/m)[0].matchAll(/^- (.+)$/gm)].map(m => m[1]);
  const base = dominios.find(d => d.id === dom).briefing;
  if (en.briefing[dom].length !== base.length) erros.push(`dominios-en/${f}: briefing com ${en.briefing[dom].length} itens, esperado ${base.length}`);
  for (const b of md.split(/^## /m).slice(1)) {
    const ls = b.split('\n'), id = ls.shift().trim(), q = questoes.find(x => x.id === id);
    if (!q) { erros.push(`dominios-en/${f}: ${id} não existe em português`); continue; }
    if (en.questoes[id]) erros.push(`en ${id}: repetida`);
    const r = { texto: [], ops: [], porque: [] }; let cerca = false;
    for (const l of ls) {
      let m; if (l.startsWith('```')) cerca = !cerca;
      if (!cerca && (m = l.match(q.tipo === 'ordem' ? /^(?:\d+\.|-) (.+)$/ : /^- (.+)$/))) r.ops.push(m[1]);
      else if (!cerca && l.startsWith('>')) r.porque.push(l.replace(/^> ?/, ''));
      else r.texto.push(l);
    }
    if (r.ops.length === 1 && r.ops[0] === '=') r.ops = q.ops;
    if (r.ops.length !== q.ops.length) erros.push(`en ${id}: ${r.ops.length} alternativas, esperado ${q.ops.length}`);
    if (new Set(r.ops).size !== r.ops.length) erros.push(`en ${id}: alternativas repetidas`);
    const m = r.texto.join(' ').match(/Choose (\d)/);
    if (q.tipo === 'multipla' && (!m || Number(m[1]) !== q.certas.length)) erros.push(`en ${id}: deve dizer "(Choose ${q.certas.length})"`);
    en.questoes[id] = { texto: r.texto.join('\n').trim(), ops: r.ops, porque: r.porque.join(' ').trim() };
    if (!en.questoes[id].texto || !en.questoes[id].porque) erros.push(`en ${id}: falta enunciado ou explicação`);
  }
}
for (const q of questoes) if (!en.questoes[q.id]) erros.push(`${q.id}: falta tradução em dominios-en`);
for (const l of tabelas(ler('content/idiomas.md'))[0]) en.ui[String(l.pt)] = String(l.en);
for (const f of ['jogo', 'painel', 'metro', 'visual']) for (const m of ler(`src/${f}.js`).matchAll(/\bt\('([^']+)'/g)) if (!en.ui[m[1]]) erros.push(`idiomas.md: falta "${m[1]}" (src/${f}.js)`);

const ids = new Set();
for (const q of questoes) { if (ids.has(q.id)) erros.push(`${q.id}: ID duplicado`); ids.add(q.id); }

const [versoes, pesos] = tabelas(ler('content/prova.md'));
const bal = Object.fromEntries(tabelas(ler('content/balanceamento.md'))[0].map(l => [l.chave, l.valor]));
for (const v of versoes) {
  const soma = pesos.reduce((s, p) => s + p[v.id], 0);
  if (Math.abs(soma - 100) > 0.5) erros.push(`prova.md: pesos de "${v.id}" somam ${soma}`);
  for (const p of pesos) {
    const tem = questoes.filter(q => q.dominio === p.dominio && q.tipo !== 'ordem').length;
    const quer = Math.ceil(p[v.id] * v.questoes / 100);
    if (tem < quer) avisos.push(`simulado "${v.id}": ${p.dominio} tem ${tem} questões e pede até ${quer}`);
  }
}
for (const d of dominios) if (!pesos.some(p => p.dominio === d.id)) erros.push(`prova.md: falta peso de ${d.id}`);

const unicas = questoes.filter(q => q.tipo === 'unica');
const maior = unicas.filter(q => q.ops.every((o, i) => i === q.certas[0] || o.length < q.ops[q.certas[0]].length)).length;
const pct = Math.round(100 * maior / unicas.length);
if (pct > 45) avisos.push(`a correta é a mais longa em ${pct}% das questões únicas (ideal: perto de 25%)`);

if (erros.length) { console.error('ERROS:\n- ' + erros.join('\n- ')); process.exit(1); }

const dados = JSON.stringify({ dominios, questoes, versoes, pesos, bal, en }).replace(/</g, '\\u003c');
const html = ler('src/modelo.html')
  .replace('/*ESTILO*/', () => ler('src/estilo.css'))
  .replace('/*DADOS*/', () => dados)
  .replace('/*IDIOMA*/', () => ler('src/idioma.js'))
  .replace('/*METRO*/', () => ler('src/metro.js'))
  .replace('/*PAINEL*/', () => ler('src/painel.js'))
  .replace('/*VISUAL*/', () => ler('src/visual.js'))
  .replace('/*JOGO*/', () => ler('src/jogo.js'));
writeFileSync(join(raiz, 'index.html'), html);
const enLong = Math.round(100 * unicas.filter(q => { const o = en.questoes[q.id].ops, c = q.certas[0]; return o.every((x, i) => i === c || x.length < o[c].length); }).length / unicas.length);
if (enLong > 45) avisos.push(`inglês: correta mais longa em ${enLong}%`);
console.log(`Inglês: ${Object.keys(en.questoes).length} questões, correta mais longa: ${enLong}%.`);
console.log(`index.html gerado: ${questoes.length} questões, ${dominios.length} domínios. Correta mais longa: ${pct}%.`);
avisos.forEach(a => console.log('AVISO: ' + a));
