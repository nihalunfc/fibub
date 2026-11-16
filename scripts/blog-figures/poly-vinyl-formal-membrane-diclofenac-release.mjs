// Figures for src/blog/discoveries/poly-vinyl-formal-membrane-diclofenac-release.md, made with the maths of the
// Drug release curve fitter (src/lib/sci/drugrelease.ts).
// Run: node scripts/blog-figures/poly-vinyl-formal-membrane-diclofenac-release.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fitAll, peppasMechanism, peppasRange } from '../../src/lib/sci/drugrelease.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/poly-vinyl-formal-membrane-diclofenac-release.md', import.meta.url);

// Inputs from the paper: Garcia-Atutxa and Villanueva-Flores (2026), Appl. Sci. 16(2), 562, doi:10.3390/app16020562 (CC BY).
const N = { '30 % HCl': 1.029, '40 % HCl': 1.148 };               // Korsmeyer-Peppas exponents reported
const N_PM = { '30 % HCl': 0.050, '40 % HCl': 0.094 };            // their stated ± (we treat it as a standard error)
const AREA = 0.3165, VOL = 0.10, LOAD = 1.0;                       // cm², cm³, mg/cm²

// Simulated release (our assumption: 60 % released at 24 h for both, a fixed relative scatter, scaled by SCAT so the
// 30 % HCl fit's standard error on n comes out near the paper's ±0.050).
const t = [0.5, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
const wob = [0.012, -0.015, 0.008, 0.014, -0.01, -0.004, 0.011, -0.013, 0.006, -0.002, 0.009, -0.007];
const SCAT = +(process.env.SCAT ?? 8);
const sims = Object.fromEntries(Object.entries(N).map(([k, n]) => {
  const kk = 60 / 24 ** n, F = t.map((x, i) => +(kk * x ** n * (1 + SCAT * wob[i])).toFixed(2));
  const film = fitAll(t, F, 60, 'film'), cyl = fitAll(t, F, 60, 'cylinder');
  const kp = film.fits.find((m) => m.id === 'kp'), nn = kp.params[1];
  return [k, { F, kp, n: nn.value, se: nn.se, best: film.best?.name, r2: Object.fromEntries(film.fits.map((m) => [m.id, +m.r2.toFixed(4)])), noteFilm: kp.note, noteCyl: cyl.fits.find((m) => m.id === 'kp').note, range: peppasRange(nn.value, nn.se, kp.n - 2, 'film') }];
}));
const paperRange = Object.fromEntries(Object.entries(N).map(([k, n]) => [k, peppasRange(n, N_PM[k], 8, 'film')]));

const facts = {
  geometry: { dose_mg: +(LOAD * AREA).toFixed(4), thickness_mm: +(10 * VOL / AREA).toFixed(2), sv: +(AREA / VOL).toFixed(3) },
  sims: Object.fromEntries(Object.entries(sims).map(([k, s]) => [k, { n: +s.n.toFixed(3), se: +s.se.toFixed(3), best: s.best, r2: s.r2, noteFilm: s.noteFilm, noteCyl: s.noteCyl, range: s.range && [+s.range.lo.toFixed(3), +s.range.hi.toFixed(3)] }])),
  paperLabels: Object.fromEntries(Object.entries(N).map(([k, n]) => [k, { film: peppasMechanism(n, 'film'), cylinder: peppasMechanism(n, 'cylinder'), range: [+paperRange[k].lo.toFixed(3), +paperRange[k].hi.toFixed(3)] }])),
};
console.log(JSON.stringify(facts, null, 1));
for (const [k, s] of Object.entries(sims)) console.log(k, t.map((x, i) => `${x}\t${s.F[i]}`).join(' | '));

const tl = Array.from({ length: 49 }, (_, i) => i * 0.5);
const [a, b] = Object.values(sims);
const fig1 = chart({
  title: 'Simulated diclofenac release from the two membranes', xLabel: 'Time (h)', yLabel: 'Released (%)',
  series: [
    { name: '30 % HCl (n = 1.029)', kind: 'dots', x: t, y: a.F, size: 3.2 },
    { name: '40 % HCl (n = 1.148)', kind: 'dots', x: t, y: b.F, size: 3.2 },
    { name: '', kind: 'line', x: tl, y: tl.map((x) => +a.kp.f(x).toFixed(2)), colour: 'var(--c-blog)', noLegend: true },
    { name: '', kind: 'line', x: tl, y: tl.map((x) => +b.kp.f(x).toFixed(2)), colour: 'var(--c-tools)', noLegend: true },
  ],
  xDomain: [0, 24], yDomain: [0, 65], height: 250,
  desc: 'Two simulated release curves that both reach 60 % at 24 hours; the one with the larger exponent starts slower and curves upward more.',
});
const xs = [1, 2], names = Object.keys(N);
const fig2 = chart({
  title: 'Peppas exponent n with its 95 % range, against the limits for a slab', xLabel: 'Membrane (1: 30 % HCl, 2: 40 % HCl)', yLabel: 'Release exponent n',
  series: [{ name: 'n from the paper, ± 95 % range (if ± is a standard error)', kind: 'dots', x: xs, y: names.map((k) => N[k]), errors: names.map((k) => +(paperRange[k].hi - N[k]).toFixed(3)), size: 4 }],
  hlines: [{ y: 0.5, text: 'Fickian (slab)' }, { y: 1, text: 'Case II (slab)' }, { y: 0.89, text: 'Case II (cylinder)' }],
  xDomain: [0.5, 2.5], yDomain: [0.4, 1.45], xTicks: [1, 2], height: 250,
  desc: 'Both exponents sit just above 1, and their 95 % ranges include the Case II value of 1 for a slab.',
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rel', figure(fig1, 'Figure 2. Release curves simulated with the paper\'s two Korsmeyer–Peppas exponents and our assumed time scale (60 % at 24 hours), with the Drug release curve fitter\'s fits. Not the paper\'s data.'));
  md = inject(md, 'n', figure(fig2, 'Figure 1. The paper\'s exponents with 95 % ranges worked out by the Drug release curve fitter\'s new range check (taking the stated ± as a standard error on 8 degrees of freedom, our assumption), against the Ritger–Peppas limits.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
