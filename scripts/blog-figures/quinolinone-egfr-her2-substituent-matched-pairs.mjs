// Figures for src/blog/discoveries/quinolinone-egfr-her2-substituent-matched-pairs.md, made with the maths of the
// SAR table builder (src/lib/sci/sar.ts: pIC50, matched molecular pairs, transforms, group scores, potency matrix).
// Run: node scripts/blog-figures/quinolinone-egfr-her2-substituent-matched-pairs.mjs   (rewrites the article's charts)
import fs from 'node:fs';
import { parseSeries, combos, matchedPairs, transforms, groupScores, matrix, toP } from '../../src/lib/sci/sar.ts';
import { parseTable } from '../../src/lib/sci/num.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/quinolinone-egfr-her2-substituent-matched-pairs.md', import.meta.url);

// Inputs from the paper: Al-Wahaibi et al. (2025), Front. Chem. 13: 1638489, doi:10.3389/fchem.2025.1638489 (CC BY 4.0).
// Table 1: MCF-7 IC50 in nM for the tosyl-sulfonohydrazide series (3a-h) and the 2,4-dinitrophenylhydrazone series
// (5a-g), with the substituent on the quinolin-2(1H)-one. 3h is reported as >100 nM (a limit).
const CELLS = `ID,R1 scaffold,R2 substituent,IC50 (nM)
3a,sulfonohydrazide,N1-Me,89
3b,sulfonohydrazide,6-OMe,52
3c,sulfonohydrazide,6-Me,48
3d,sulfonohydrazide,H,37
3e,sulfonohydrazide,N1-Et,61
3f,sulfonohydrazide,6-Cl,43
3g,sulfonohydrazide,7-Me,90
3h,sulfonohydrazide,8-Me,>100
5a,dinitrophenylhydrazone,H,34
5b,dinitrophenylhydrazone,6-Me,50
5c,dinitrophenylhydrazone,6-OMe,62
5d,dinitrophenylhydrazone,8-Me,67
5e,dinitrophenylhydrazone,N1-Me,74
5f,dinitrophenylhydrazone,7-Me,83
5g,dinitrophenylhydrazone,6-Cl,78`;
// Table 2: the five compounds taken on to the kinases, HER-2 IC50 in nM.
const HER2 = `ID,R1 scaffold,R2 substituent,IC50 (nM)
3c,sulfonohydrazide,6-Me,49
3d,sulfonohydrazide,H,38
3f,sulfonohydrazide,6-Cl,44
5a,dinitrophenylhydrazone,H,33
5b,dinitrophenylhydrazone,6-Me,56`;
const ERLOTINIB_MCF7 = 40, LAPATINIB_HER2 = 26;

const run = (text) => {
  const s = parseSeries(parseTable(text));
  const cs = combos(s), pairs = matchedPairs(s, cs), tr = transforms(pairs);
  return { s, cs, pairs, tr, scaf: groupScores(s, 0, pairs, cs), sub: groupScores(s, 1, pairs, cs), m: matrix(s, 0, 1, 'potency', cs) };
};
const C = run(CELLS), K = run(HER2);
const pOf = (id, r = C) => r.s.cpds.find((c) => c.id === id);
const swap = C.tr.find((t) => t.pos === 0);
const swapK = K.tr.find((t) => t.pos === 0);

// Figure 1: pIC50 by substituent, one dot per scaffold, on a categorical axis ordered by the better scaffold.
const order = C.m.cols;
const pFor = (row, col) => { const c = C.m.cells[C.m.rows.indexOf(row)][C.m.cols.indexOf(col)]; return c.n ? +c.mean.toFixed(4) : NaN; };
const fig1 = chart({
  title: 'MCF-7 potency by substituent, both scaffolds',
  xLabel: 'Substituent on the quinolin-2(1H)-one', yLabel: 'pIC50 (−log₁₀ M)',
  series: [
    { name: 'Sulfonohydrazide (3)', kind: 'dots', x: order.map((_, i) => i), y: order.map((c) => pFor('sulfonohydrazide', c)), size: 4.5 },
    { name: 'Dinitrophenylhydrazone (5)', kind: 'dots', x: order.map((_, i) => i), y: order.map((c) => pFor('dinitrophenylhydrazone', c)), size: 4.5 },
  ],
  xDomain: [-0.4, order.length - 0.6], yDomain: [6.95, 7.55],
  xTicks: order.map((_, i) => i), xFmt: (t) => order[t] ?? '',
  hlines: [{ y: +toP(ERLOTINIB_MCF7, 'nM').toFixed(4), text: 'erlotinib' }],
  desc: 'pIC50 against MCF-7 cells for every compound in the paper, grouped by the substituent and split by scaffold. The unsubstituted compound is the most potent in both series; the dashed line is erlotinib.',
  height: 280,
});

// Figure 2: the average effect of each substituent (group score, in log units) as a lollipop chart.
const gs = [...C.sub].sort((a, b) => a.score - b.score);
const fig2 = chart({
  title: 'Average effect of each substituent (matched pairs)',
  xLabel: 'Mean change in pIC50 when this group is present (log units)', yLabel: '',
  series: [
    ...gs.map((g, i) => ({ name: '', noLegend: true, kind: 'line', x: [0, +g.score.toFixed(4)], y: [i, i], colour: 'var(--c-blog)' })),
    { name: '', noLegend: true, kind: 'dots', x: gs.map((g) => +g.score.toFixed(4)), y: gs.map((_, i) => i), size: 4.5, colour: 'var(--c-blog)' },
    { name: '', noLegend: true, kind: 'dots', x: [+swap.mean.toFixed(4)], y: [gs.length - 0.1], size: 4.5, colour: 'var(--c-tools)', label: { text: 'whole scaffold swap', dx: 8, dy: 4 } },
  ],
  xDomain: [-0.3, 0.42], yDomain: [-0.6, gs.length - 0.2],
  yTicks: gs.map((_, i) => i), yFmt: (t) => gs[t]?.group ?? '',
  vlines: [{ x: 0, text: '' }],
  desc: 'Each substituent average effect on pIC50, worked out from matched pairs across the whole series, with the average effect of swapping the entire scaffold shown for comparison.',
  height: 290,
});

console.log(JSON.stringify({
  n: C.s.cpds.length, unit: C.s.unit, pName: C.s.pName, pairs: C.pairs.length, transforms: C.tr.length,
  censored: C.s.cpds.filter((c) => c.qual).map((c) => `${c.id} ${c.qual} ${c.p}`),
  p: C.s.cpds.map((c) => `${c.id} ${c.p.toFixed(4)}`),
  erlotinib: +toP(ERLOTINIB_MCF7, 'nM').toFixed(4), lapatinib: +toP(LAPATINIB_HER2, 'nM').toFixed(4),
  best: { '3d': pOf('3d').p.toFixed(4), '5a': pOf('5a').p.toFixed(4), gap: (pOf('5a').p - pOf('3d').p).toFixed(4) },
  scaffoldSwap: { n: swap.n, mean: swap.mean.toFixed(4), sd: swap.sd.toFixed(4), min: swap.min.toFixed(4), max: swap.max.toFixed(4) },
  substituentScores: C.sub.map((g) => `${g.group} ${g.score.toFixed(4)} (n=${g.n}, pairs=${g.pairs}, meanP=${g.meanP.toFixed(4)})`),
  bigTransforms: C.tr.filter((t) => t.pos === 1 && t.n >= 2).slice(0, 4).map((t) => `${t.from}→${t.to} n=${t.n} mean=${t.mean.toFixed(4)} sd=${t.sd.toFixed(4)}`),
  her2: { p: K.s.cpds.map((c) => `${c.id} ${c.p.toFixed(4)}`), swap: swapK && { n: swapK.n, mean: swapK.mean.toFixed(4), sd: swapK.sd.toFixed(4) }, sub: K.sub.map((g) => `${g.group} ${g.score.toFixed(4)}`) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'potency', figure(fig1, 'Figure 1. Every compound in the paper on one pIC50 scale, from the IC50 values in its MCF-7 table, worked out by the SAR table builder\'s maths. The limit value for 3h (>100 nM) is plotted at its bound, pIC50 7.00.'));
  md = inject(md, 'scores', figure(fig2, 'Figure 2. The average effect of each substituent, from all matched pairs in the series, with the average effect of swapping the whole scaffold for comparison. Positive is more potent.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
