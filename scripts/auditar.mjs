#!/usr/bin/env node
// auditar.mjs: conta os sinais de "cara de IA" num projeto de front e diz ONDE estão.
// Uso: node auditar.mjs <pasta> [--top 5] [--json]
// Só leitura. Pula node_modules, build, dist, .git e arquivo minificado (bundle commitado).
// É o ponto de partida da auditoria: os números saem daqui e a leitura das telas confirma.
// Contagem é heurística (regex): serve pra achar onde olhar e pra medir antes/depois, não como nota.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const args = process.argv.slice(2);
const raiz = args.find((a) => !a.startsWith('--')) || '.';
const TOP = Number((args[args.indexOf('--top') + 1]) || 5) || 5;
const JSON_OUT = args.includes('--json');

const EXT = new Set(['.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.html', '.css', '.scss', '.astro', '.mdx']);
const PULAR = /(^|[\\/])(node_modules|dist|build|out|\.next|\.nuxt|\.git|\.wrangler|coverage|vendor)([\\/]|$)/;

function arquivos(dir, acc = []) {
  let itens;
  try { itens = readdirSync(dir); } catch { return acc; }
  for (const n of itens) {
    const p = join(dir, n);
    if (PULAR.test(p)) continue;
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) arquivos(p, acc);
    else if (EXT.has(extname(n)) && st.size < 1.5e6) acc.push(p);
  }
  return acc;
}

// Arquivo minificado ou gerado (bundle commitado, ícones gerados) distorce a conta.
const minificado = (txt) => { const l = txt.split('\n'); return l.length < 5 && txt.length > 5000 || l.some((x) => x.length > 2500); };

// [chave, rótulo, regex, onde vale ('ui' = jsx/tsx/vue/svelte/html; 'css'; 'todos')]
const SINAIS = [
  ['emoji', 'Emoji/Unicode como ícone', /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}\u{274C}\u{2714}\u{2716}\u{25B8}\u{25BE}\u{2713}\u{2715}]/gu, 'ui'],
  ['card', 'Card arredondado (rounded-lg/xl/2xl/3xl)', /\brounded-(?:lg|xl|2xl|3xl)\b/g, 'ui'],
  // Sombra por token (shadow-caixa, shadow-flutuante) não conta: é a base fazendo o papel dela.
  ['sombra', 'Sombra solta (shadow, shadow-sm..2xl)', /\bshadow(?:-(?:sm|md|lg|xl|2xl))?(?![-\w])/g, 'ui'],
  ['centro', 'Centralizado (text-center / justify-center)', /\btext-center\b|\bjustify-center\b/g, 'ui'],
  ['pilula', 'Pílula/selo (rounded-full + text-xs)', /rounded-full[^"'`]{0,80}text-xs|text-xs[^"'`]{0,80}rounded-full/g, 'ui'],
  ['degrade', 'Degradê', /\bbg-gradient-to-|\blinear-gradient\(|\bfrom-(?:purple|violet|indigo|blue|pink)-\d{3}/g, 'todos'],
  ['faixa', 'Faixa colorida na borda esquerda', /\bborder-l-(?:2|4|8)\b[^"'`]{0,60}border-(?:[a-z]+)-\d{3}/g, 'ui'],
  ['shadcn', 'shadcn/Lucide/Radix/cn()', /from ['"](?:lucide-react|@radix-ui\/[^'"]+|@\/components\/ui\/[^'"]+)['"]|\bcn\(/g, 'ui'],
  ['fonte', 'Fonte genérica (Inter/Roboto/Arial/system-ui)', /\b(?:Inter|Roboto|Arial|Helvetica)\b|system-ui/g, 'todos'],
  ['travessao', 'Travessão (—) em texto', /—/g, 'ui'],
  ['bemvindo', '"Bem-vindo"/"Welcome back"', /Bem-vind[oa]|Welcome back|Olá, bem/gi, 'ui'],
  ['naoe', '"não é X, é Y"', /n[ãa]o [ée] [^.,;\n]{1,40}, [ée] /gi, 'ui'],
  ['placeholder', 'placeholder=', /\bplaceholder=/g, 'ui'],
  ['label', '<label', /<label\b/g, 'ui'],
  ['htmlfor', 'htmlFor/for=', /\bhtmlFor=|<label[^>]*\sfor=/g, 'ui'],
  // Qualquer argumento: `alert(e.message)` é a forma mais comum e a versão antiga (só texto fixo)
  // contava 86 de 161 num CRM real (29/09). `obj.confirm(` e `function confirm(` não contam.
  ['janela', 'Janela do navegador (confirm/alert/prompt)', /(?<![\w.])(?<!function\s)(?:window\.)?(?:confirm|alert|prompt)\s*\(/g, 'ui'],
  ['divclick', 'div/span/tr com onClick (botão falso)', /<(?:div|span|tr|li|td)\b[^>]*\bonClick=/g, 'ui'],
  ['alvo', 'Alvo pequeno (h-6/h-7/h-8 em botão)', /<button\b[^>]*\b(?:h-6|h-7|h-8|p-1)\b/g, 'ui'],
  ['campo', 'Campo com texto pequeno (text-xs/sm em input)', /<(?:input|select|textarea)\b[^>]*\btext-(?:xs|sm)\b/g, 'ui'],
  ['animacao', 'Animação/transição', /\banimate-[a-z]+|\btransition\b|@keyframes/g, 'todos'],
  ['reduzmov', 'prefers-reduced-motion', /prefers-reduced-motion|motion-reduce/g, 'todos'],
];
const CORES = /\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;

// Contados sem comentário: os de TEXTO (comentário não aparece na tela) e a janela do navegador
// (comentário explicando um `confirm(` antigo não é janela).
const TEXTO = new Set(['emoji', 'travessao', 'bemvindo', 'naoe', 'janela']);
// Tira /* */, {/* */}, <!-- --> e // até o fim da linha (sem pegar o // de https://).
function semComentarios(txt, p) {
  let s = txt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');
  if (!ehCss(p)) s = s.replace(/(^|[^:"'`\\])\/\/.*$/gm, '$1');
  return s;
}

const ehUi = (p) => ['.jsx', '.tsx', '.vue', '.svelte', '.html', '.astro', '.mdx', '.js', '.ts'].includes(extname(p));
const ehCss = (p) => ['.css', '.scss'].includes(extname(p));

const total = Object.fromEntries(SINAIS.map(([k]) => [k, 0]));
const porArquivo = Object.fromEntries(SINAIS.map(([k]) => [k, []]));
const familias = {};
let hexUi = 0;
let lidos = 0, pulados = 0, linhas = 0;

for (const p of arquivos(raiz)) {
  const txt = readFileSync(p, 'utf8');
  if (minificado(txt)) { pulados++; continue; }
  lidos++; linhas += txt.split('\n').length;
  const rel = relative(raiz, p);
  const semComentario = semComentarios(txt, p);
  for (const [k, , re, onde] of SINAIS) {
    if (onde === 'ui' && !ehUi(p)) continue;
    if (onde === 'css' && !ehCss(p)) continue;
    // Sinais de TEXTO contam só o que pode aparecer na tela (comentário não aparece).
    const alvo = TEXTO.has(k) ? semComentario : txt;
    const n = (alvo.match(re) || []).length;
    if (n) { total[k] += n; porArquivo[k].push([rel, n]); }
  }
  for (const m of txt.matchAll(CORES)) familias[m[1]] = (familias[m[1]] || 0) + 1;
  if (ehUi(p) && !ehCss(p)) hexUi += (txt.match(HEX) || []).length;
}

const resultado = {
  pasta: raiz, arquivos_lidos: lidos, arquivos_pulados_minificados: pulados, linhas,
  sinais: SINAIS.map(([k, rotulo]) => ({ chave: k, rotulo, total: total[k],
    piores: porArquivo[k].sort((a, b) => b[1] - a[1]).slice(0, TOP) })),
  familias_de_cor: Object.entries(familias).sort((a, b) => b[1] - a[1]),
  hex_no_codigo_de_tela: hexUi,
};

if (JSON_OUT) { console.log(JSON.stringify(resultado, null, 2)); process.exit(0); }

console.log(`# Auditoria de "cara de IA": ${raiz}`);
console.log(`${lidos} arquivos (${linhas} linhas); ${pulados} pulados por serem minificados/gerados.\n`);
console.log('| Sinal | Total | Onde mais aparece |');
console.log('|---|---:|---|');
for (const s of resultado.sinais) {
  const onde = s.piores.map(([f, n]) => `${f} (${n})`).join(' · ') || '';
  console.log(`| ${s.rotulo} | ${s.total} | ${onde} |`);
}
const fam = resultado.familias_de_cor;
console.log(`\n**Famílias de cor do Tailwind em uso: ${fam.length}** ${fam.map(([f, n]) => `${f} ${n}`).join(' · ')}`);
console.log(`**Hex fixo em código de tela: ${hexUi}** (cor fora de token fura tema escuro e white-label)`);
const lab = total.label, hf = total.htmlfor;
console.log(`**Rótulos:** ${total.placeholder} placeholder, ${lab} <label>, ${hf} ligados por htmlFor/for.`);
console.log('\nLeitura: número alto é onde olhar, não veredito. Confirme abrindo a tela (emoji no seletor de emoji é legítimo; travessão em comentário não aparece pro usuário).');
