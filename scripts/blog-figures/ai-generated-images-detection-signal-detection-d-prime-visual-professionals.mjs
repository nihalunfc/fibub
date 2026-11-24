// Figures for src/blog/discoveries/ai-generated-images-detection-signal-detection-d-prime-visual-professionals.md,
// made with the maths of the Signal detection calculator (src/lib/sci/sdt.ts: yesNo, isoROC).
// Run: node scripts/blog-figures/ai-generated-images-detection-signal-detection-d-prime-visual-professionals.mjs
import fs from 'node:fs';
import { yesNo, isoROC } from '../../src/lib/sci/sdt.ts';
import { normCdf } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ai-generated-images-detection-signal-detection-d-prime-visual-professionals.md', import.meta.url);

// Velásquez-Salamanca, Martín-Pascual and Andreu-Sánchez (2025), J. Imaging 11(7): 227 (CC BY).
// 161 people (71 visual professionals, 90 not) each judged 24 AI-generated and 8 human-made images, 4 categories of
// 6 AI + 2 human images. "Signal" = an AI image, a "yes" = answering "AI". Counts are rebuilt from the percentages
// in the text (each matches the stated percentage to 2 decimals; see the article).
const N = { pro: 71, non: 90 };
const groups = [
  { id: 'Visual professionals', hits: 1058, nS: 71 * 24, crs: 469, nN: 71 * 8 },
  { id: 'Non-professionals', hits: 1302, nS: 90 * 24, crs: 539, nN: 90 * 8 },
];
const all = { id: 'Everyone', hits: 2360, nS: 161 * 24, crs: 1005, nN: 161 * 8 }; // 61.08 % and 78.03 % of 3864 and 1288
const cats = [
  { id: 'Portraits', hits: 525, crs: 257 }, { id: 'Landscapes', hits: 635, crs: 322 - 102 },
  { id: 'Everyday scenes', hits: 966 - 359, crs: 322 - 64 }, { id: 'Detailed objects', hits: 592, crs: 272 },
].map((c) => ({ ...c, nS: 966, nN: 322 }));
const sd = (g) => { const r = yesNo({ hits: g.hits, misses: g.nS - g.hits, fas: g.nN - g.crs, crs: g.crs }, 'none'); return { ...g, r }; };
const G = groups.map(sd), A = sd(all), C = cats.map(sd);
// Difference in d′ between the two groups, z test with the Gourevitch-Galanter standard errors.
const dd = G[0].r.dprime - G[1].r.dprime, sedd = Math.hypot(G[0].r.se, G[1].r.se);

// Ideal observer with the same d′ who knows 3 in 4 images are AI: β = P(human)/P(AI) = 1/3, c = ln β / d′.
const dA = A.r.dprime, cOpt = Math.log(1 / 3) / dA, Hopt = normCdf(dA / 2 - cOpt), Fopt = normCdf(-dA / 2 - cOpt);
const ideal = { c: +cOpt.toFixed(3), H: +Hopt.toFixed(4), F: +Fopt.toFixed(4), acc: +(0.75 * Hopt + 0.25 * (1 - Fopt)).toFixed(4), accActual: +(0.75 * A.r.H + 0.25 * (1 - A.r.F)).toFixed(4) };
const iso = (d) => isoROC(d, 100);
const lines = [0.5, 1, 1.5].map((d) => ({ d, ...iso(d) }));
const fig1 = chart({
  title: 'AI or human-made? Answers in ROC space', xLabel: 'False-alarm rate (human-made called "AI")', yLabel: 'Hit rate (AI called "AI")',
  series: [
    ...lines.map((l, k) => ({ name: '', noLegend: true, kind: 'line', x: l.F.map((v) => +v.toFixed(3)), y: l.H.map((v) => +v.toFixed(3)), colour: 'var(--muted)', dash: '3 4', label: { text: `d′ ${l.d}`, at: [l.F[70], l.H[70]], dx: 4, dy: 12 } })),
    { name: 'Chance', noLegend: true, kind: 'line', x: [0, 1], y: [0, 1], colour: 'var(--line)' },
    { name: 'Groups', kind: 'dots', x: G.map((g) => +g.r.F.toFixed(4)), y: G.map((g) => +g.r.H.toFixed(4)), size: 5, colour: 'var(--c-blog)' },
    { name: 'Image categories', kind: 'dots', x: C.map((g) => +g.r.F.toFixed(4)), y: C.map((g) => +g.r.H.toFixed(4)), size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 0.6], yDomain: [0.3, 1],
  desc: `Hit rate against false-alarm rate for the two groups and four image categories, with equal-variance curves for d′ 0.5, 1 and 1.5. Visual professionals sit at d′ ${G[0].r.dprime.toFixed(2)}, non-professionals at ${G[1].r.dprime.toFixed(2)}.`, height: 300,
});
const lab = ['Prof.', 'Non-prof.', 'Portraits', 'Landsc.', 'Everyday', 'Objects'];
const rows = [...G, ...C];
const fig2 = chart({
  title: 'Sensitivity d′ and bias c, with 95 % intervals for d′', xLabel: 'Group or image category', yLabel: 'd′ (dots) and c (squares)',
  series: [
    { name: 'd′', kind: 'dots', x: rows.map((_, i) => i), y: rows.map((g) => +g.r.dprime.toFixed(3)), errors: rows.map((g) => +(1.96 * g.r.se).toFixed(3)), size: 4 },
    { name: 'c (above 0: leans to "human-made")', kind: 'dots', x: rows.map((_, i) => i + 0.18), y: rows.map((g) => +g.r.c.toFixed(3)), size: 3.5 },
  ],
  xDomain: [-0.5, 5.6], yDomain: [-0.2, 1.4], xTicks: [0, 1, 2, 3, 4, 5], xFmt: (t) => lab[t] ?? '', hlines: [{ y: 0, text: '' }],
  desc: 'd′ and criterion c for the two groups and four image categories. Every c is above zero: people lean towards answering human-made.', height: 270,
});

const f = (g) => ({ id: g.id, H: +g.r.H.toFixed(4), F: +g.r.F.toFixed(4), d: +g.r.dprime.toFixed(3), se: +g.r.se.toFixed(3), ci: g.r.ci.map((v) => +v.toFixed(3)), c: +g.r.c.toFixed(3), beta: +g.r.beta.toFixed(3), aPrime: +g.r.aPrime.toFixed(3), pc: +g.r.pc.toFixed(4), azEqual: +g.r.azEqual.toFixed(3) });
console.log(JSON.stringify({ all: f(A), groups: G.map(f), cats: C.map(f), diff: { dd: +dd.toFixed(3), se: +sedd.toFixed(3), z: +(dd / sedd).toFixed(2) }, ideal, saidAI: +((A.hits + A.nN - A.crs) / (A.nS + A.nN)).toFixed(4) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'roc', figure(fig1, 'Figure 1. Pooled hit and false-alarm rates rebuilt from the percentages in the paper, for the two groups (orange) and the four image categories (blue), worked out with the Signal detection calculator\'s maths. Dashed curves: equal sensitivity (d′ 0.5, 1, 1.5).'));
  md = inject(md, 'dprime', figure(fig2, 'Figure 2. Sensitivity d′ with 95 % intervals (Gourevitch and Galanter standard errors, from pooled counts, so too narrow; see the fine print) and response bias c for each group and category.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
