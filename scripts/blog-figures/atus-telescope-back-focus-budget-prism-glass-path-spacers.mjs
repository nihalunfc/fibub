// Figures for src/blog/discoveries/atus-telescope-back-focus-budget-prism-glass-path-spacers.md, made with the
// maths of the Backfocus calculator (src/lib/sci/backfocus.ts: filterShift, readSpacers and solveSpacers).
// Run: node scripts/blog-figures/atus-telescope-back-focus-budget-prism-glass-path-spacers.mjs
import fs from 'node:fs';
import { filterShift, readSpacers, solveSpacers } from '../../src/lib/sci/backfocus.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/atus-telescope-back-focus-budget-prism-glass-path-spacers.md', import.meta.url);

// Inputs from the paper: Schindler, K., Wolf, J. and Krabbe, A. (2026), PASP, doi:10.1088/1538-3873/ae477d
// (CC BY 4.0). Flange focal distance 303.5 mm (fully reflective), 228.1 mm (with the field flattener) and
// 83.7 mm (with the focal reducer); focal lengths 4899.8, 5236.2 and 3836.1 mm at f/8.17, f/8.73 and f/6.39;
// a 25 mm right-angle BK7 pick-off prism that extends the path to the guide camera by 8.52 mm; a 2 µm pellicle;
// spacer rings of 88.9 mm (3.5 inch). The refractive index of BK7, 1.5168 at the d line, is a standard value.
const PRISM = 25, N_BK7 = 1.5168, PAPER_PRISM = 8.52;
const FFD = [{ cfg: 'Fully reflective', ffd: 303.5, fl: 4899.8, fn: 8.17 }, { cfg: 'With the field flattener', ffd: 228.1, fl: 5236.2, fn: 8.73 }, { cfg: 'With the focal reducer', ffd: 83.7, fl: 3836.1, fn: 6.39 }];

// Figure 1: how far a block of glass pushes the focus back, and the paper's prism on the same line.
const ts = Array.from({ length: 61 }, (_, i) => i * 0.5); // 0 to 30 mm of glass
const GLASS = [{ name: 'Fused silica, n = 1.4585', n: 1.4585 }, { name: 'BK7, n = 1.5168', n: N_BK7 }, { name: 'Dense glass, n = 1.72', n: 1.72 }];
const fig1 = chart({
  title: 'How far a block of glass pushes the focus back', xLabel: 'Thickness of glass in the path (mm)', yLabel: 'Focus shift t(1 − 1/n) (mm)',
  series: [
    ...GLASS.map((g) => ({ name: g.name, kind: 'line', x: ts, y: ts.map((t) => +filterShift(t, g.n).toFixed(4)) })),
    { name: '', noLegend: true, kind: 'dots', x: [PRISM], y: [PAPER_PRISM], size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [0, 30], yDomain: [0, 13],
  hlines: [{ y: PAPER_PRISM, text: 'the paper\'s prism: 8.52 mm' }],
  vlines: [{ x: PRISM, text: '25 mm', left: true }],
  desc: 'Focus shift against glass thickness for three refractive indices. The paper 25 mm BK7 pick-off prism sits on the BK7 line at 8.52 mm.',
  height: 285,
});

// Figure 2: how close a spacer set can get to any required gap.
const SETS = [
  { name: 'Coarse set (down to 0.3 mm)', own: '88.9, 50, 30, 20, 16.5, 10, 5, 3, 2, 1, 0.5, 0.3' },
  { name: 'With thin shims (0.1, 0.2)', own: '88.9, 50, 30, 20, 16.5, 10, 5, 3, 2 x2, 1, 0.5, 0.3, 0.2, 0.1' },
];
const gaps = Array.from({ length: 201 }, (_, i) => +(i * 0.1).toFixed(1)); // 0 to 20 mm, in 0.1 mm steps
const wide = Array.from({ length: 901 }, (_, i) => +(i * 0.1).toFixed(1)); // 0 to 90 mm, for the worst case
const errs = SETS.map((s) => { const own = readSpacers(s.own); return { ...s, own, y: gaps.map((g) => +Math.abs(solveSpacers(g, own).error).toFixed(3)) }; });
const CFZ = 2 * 0.00055 * 8.73 ** 2; // critical focus zone at f/8.73, 550 nm: our arithmetic
const fig2 = chart({
  title: 'How close your spacers can get to the gap you need', xLabel: 'Gap to fill (mm)', yLabel: 'Best stack: distance from target (mm)',
  series: errs.map((e) => ({ name: e.name, kind: 'line', x: gaps, y: e.y })),
  xDomain: [0, 20], yDomain: [0, 0.16],
  yTicks: [0, 0.05, 0.1, 0.15],
  hlines: [{ y: +CFZ.toFixed(4), text: `critical focus zone at f/8.73: ${CFZ.toFixed(3)} mm` }],
  desc: 'The distance between the best stack and the required gap, across gaps from 0 to 20 mm in 0.1 mm steps, for two spacer sets. The coarse set misses by up to 0.1 mm; adding 0.1 and 0.2 mm shims brings every gap within 0.05 mm.',
  height: 285,
});

// Numbers quoted in the article.
const worst = errs.map((e) => { let w = 0, at = 0; for (const g of wide) { const d = Math.abs(solveSpacers(g, e.own).error); if (d > w + 1e-9) { w = d; at = g; } } return { set: e.name, worst: +w.toFixed(3), at }; });
const OWN = SETS[0].own, own0 = readSpacers(OWN);
const budget = FFD.map((c) => {
  const parts = 17.5 + 20 + 25, shift = filterShift(3, 1.5), gap = c.ffd + shift - parts; // our example camera train
  const r = gap >= 0 ? solveSpacers(gap, own0) : null;
  return { ...c, parts, shift: +shift.toFixed(2), gap: +gap.toFixed(2), stack: r ? r.pieces.join(' + ') : null, total: r ? +r.total.toFixed(2) : null, error: r ? +r.error.toFixed(3) : null, cfz: +(2 * 0.00055 * c.fn ** 2).toFixed(4) };
});
const guide = (() => { const shift = filterShift(PRISM, N_BK7), gap = 55 + shift - 17.5, r = solveSpacers(gap, readSpacers('30, 20, 10, 5, 3, 2, 1, 0.5, 0.3')); return { shift: +shift.toFixed(4), gap: +gap.toFixed(2), stack: r.pieces.join(' + '), total: +r.total.toFixed(2), error: +r.error.toFixed(3) }; })();
console.log(JSON.stringify({ prism: { bk7: +filterShift(PRISM, N_BK7).toFixed(4), at1_5185: +filterShift(PRISM, 1.5185).toFixed(4), paper: PAPER_PRISM }, pellicleMicron: +(filterShift(0.002, N_BK7) * 1000).toFixed(2), ffdSteps: { flattener: +(303.5 - 228.1).toFixed(1), reducer: +(303.5 - 83.7).toFixed(1) }, worst, budget, guide }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'glass', figure(fig1, 'Figure 1. The focus shift t(1 − 1/n) that the Backfocus calculator applies to any glass in the light path. The black dot is the paper\'s 25 mm BK7 pick-off prism, whose 8.52 mm the formula reproduces to a hundredth of a millimetre.'));
  md = inject(md, 'spacers', figure(fig2, 'Figure 2. How close the tool\'s best stack comes to the gap you need, for two sets of spacers. The dashed line is the critical focus zone of the paper\'s flattener configuration, 0.084 mm: the coarse set\'s worst miss of 0.1 mm is just outside it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
