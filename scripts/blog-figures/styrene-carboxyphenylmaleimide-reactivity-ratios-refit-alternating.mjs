// Figures for src/blog/discoveries/styrene-carboxyphenylmaleimide-reactivity-ratios-refit-alternating.md, made with
// the maths of the Copolymer composition tool (src/lib/sci/copolymer.ts: Mayo-Lewis, Fineman-Ross, Kelen-Tudos,
// non-linear least squares and Skeist composition drift).
// Run: node scripts/blog-figures/styrene-carboxyphenylmaleimide-reactivity-ratios-refit-alternating.mjs
import fs from 'node:fs';
import { F1, azeotrope, behaviour, finemanRoss, kelenTudos, fitNLLS, drift } from '../../src/lib/sci/copolymer.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/styrene-carboxyphenylmaleimide-reactivity-ratios-refit-alternating.md', import.meta.url);

// Inputs from the paper: Guliyeva et al. (2026), Polymers 18(12): 1507, doi:10.3390/polym18121507 (CC BY).
// Monomer 1 = styrene. Five feeds, and the copolymer composition found for each of the three carboxyphenylmaleimide
// isomers; plus the reactivity ratios the paper reports (by Fineman-Ross).
const f = [0.9, 0.75, 0.5, 0.25, 0.1];
const OBS = { ortho: [0.856, 0.74, 0.6, 0.52, 0.508], meta: [0.862, 0.73, 0.61, 0.53, 0.507], para: [0.86, 0.733, 0.604, 0.54, 0.51] };
const PAPER = { ortho: [0.2, 0.1], meta: [0.15, 0.08], para: [0.1, 0.05] };

const rms = (F, r1, r2) => Math.sqrt(f.reduce((s, x, i) => s + (F1(x, r1, r2) - F[i]) ** 2, 0) / f.length);
const res = Object.entries(OBS).map(([id, F]) => {
  const fr = finemanRoss(f, F), kt = kelenTudos(f, F), nl = fitNLLS(f, F), [p1, p2] = PAPER[id];
  return { id, F, fr, kt, nl, paper: [p1, p2], rmsPaper: rms(F, p1, p2), rmsFit: nl.rms, behaviour: behaviour(nl.r1, nl.r2), azeo: azeotrope(nl.r1, nl.r2) };
});
// One average description of the three isomers (the three sets of ratios come out within a few per cent of each other).
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const Fbar = f.map((_, i) => +mean(res.map((r) => r.F[i])).toFixed(4));
const avg = fitNLLS(f, Fbar);
const PAP = PAPER.ortho; // the paper's largest pair, the kindest case for its own data

const grid = Array.from({ length: 101 }, (_, i) => i / 100);
const fig1 = chart({
  title: 'Styrene with a carboxyphenylmaleimide: feed against copolymer', xLabel: 'Styrene in the feed, f₁', yLabel: 'Styrene in the copolymer, F₁',
  series: [
    { name: 'Paper, mean of 3 isomers', kind: 'dots', x: f, y: Fbar, size: 4 },
    { name: `Refit: r₁ ${avg.r1.toFixed(2)}, r₂ ${avg.r2.toFixed(3)}`, kind: 'line', x: grid, y: grid.map((x) => +F1(x, avg.r1, avg.r2).toFixed(4)), colour: 'var(--c-tools)' },
    { name: `Paper's r₁ ${PAP[0]}, r₂ ${PAP[1]}`, kind: 'line', x: grid, y: grid.map((x) => +F1(x, PAP[0], PAP[1]).toFixed(4)), colour: 'var(--ink)', dash: '5 4' },
    { name: '', noLegend: true, kind: 'line', x: [0, 1], y: [0, 1], colour: 'var(--muted)', dash: '2 4' },
  ],
  xDomain: [0, 1], yDomain: [0, 1],
  desc: `Mayo-Lewis curves for the refitted reactivity ratios and for the ratios the paper reports, with the paper's five composition points. The refitted curve passes through the points; the paper's own ratios sit well below them.`,
  height: 300,
});

const d = drift(avg.r1, avg.r2, 0.5, 0.95);
// Thin the drift track for the chart: one point per 0.5 % of conversion keeps the SVG small.
const dThin = d.filter((p, i) => i === 0 || i === d.length - 1 || Math.floor(p.X * 200) > Math.floor(d[i - 1].X * 200));
const fig2 = chart({
  title: 'A 50:50 batch drifts: the styrene goes first', xLabel: 'Conversion (%)', yLabel: 'Mole fraction of styrene',
  series: [
    { name: 'Feed f₁ left in the pot', kind: 'line', x: dThin.map((p) => +(100 * p.X).toFixed(2)), y: dThin.map((p) => +p.f1.toFixed(4)) },
    { name: 'Chains made right now, F₁', kind: 'line', x: dThin.map((p) => +(100 * p.X).toFixed(2)), y: dThin.map((p) => +p.F1.toFixed(4)), colour: 'var(--c-tools)' },
    { name: 'All polymer so far, F̄₁', kind: 'line', x: dThin.map((p) => +(100 * p.X).toFixed(2)), y: dThin.map((p) => +p.Fbar.toFixed(4)), colour: 'var(--ink)', dash: '5 4' },
  ],
  xDomain: [0, 88], yDomain: [0, 0.7],
  desc: `With the refitted ratios, a batch started at half styrene uses its styrene up first: the feed falls from 0.5 towards zero while the chains being made fall from about 0.61 to almost pure maleimide at the end.`,
  height: 290,
});

const show = (r) => ({ FR: [+r.fr.r1.toFixed(3), +r.fr.r2.toFixed(4)], KT: [+r.kt.r1.toFixed(3), +r.kt.r2.toFixed(4)], NLLS: [+r.nl.r1.toFixed(3), +r.nl.r2.toFixed(4)], rmsFit: +r.rmsFit.toFixed(4), rmsPaper: +r.rmsPaper.toFixed(4) });
console.log(JSON.stringify({
  Fbar, avg: { r1: +avg.r1.toFixed(4), r2: +avg.r2.toFixed(4), rms: +avg.rms.toFixed(4), product: +(avg.r1 * avg.r2).toFixed(5), azeo: +azeotrope(avg.r1, avg.r2).toFixed(4), behaviour: behaviour(avg.r1, avg.r2) },
  perIsomer: Object.fromEntries(res.map((r) => [r.id, show(r)])),
  paperPredicted: Object.fromEntries(res.map((r) => [r.id, f.map((x) => +F1(x, r.paper[0], r.paper[1]).toFixed(3))])),
  refitPredicted: f.map((x) => +F1(x, avg.r1, avg.r2).toFixed(3)),
  driftEnd: { X: +(100 * d[d.length - 1].X).toFixed(1), f1: +d[d.length - 1].f1.toFixed(3), F1: +d[d.length - 1].F1.toFixed(3), Fbar: +d[d.length - 1].Fbar.toFixed(3) },
  driftAt: [0.25, 0.5, 0.75].map((X) => { const p = d.reduce((a, b) => (Math.abs(b.X - X) < Math.abs(a.X - X) ? b : a)); return { X: +(100 * p.X).toFixed(1), f1: +p.f1.toFixed(3), F1: +p.F1.toFixed(3), Fbar: +p.Fbar.toFixed(3) }; }),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'mayolewis', figure(fig1, 'Figure 1. The Mayo-Lewis curve for the reactivity ratios refitted from the paper\'s own composition data (solid) and for the ratios the paper reports (dashed), with the five composition points averaged over the three isomers. The faint diagonal is F₁ = f₁.'));
  md = inject(md, 'drift', figure(fig2, 'Figure 2. Composition drift worked out from the refitted ratios for a batch started at f₁ = 0.5 (Skeist\'s equation). Our calculation, not a measurement in the paper.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
