// Figures for src/blog/discoveries/sela-sp1-nightshade-protease-michaelis-menten.md, made with the maths of the
// Enzyme kinetics fitter (src/lib/sci/enzyme.ts: fitEnzyme, MODELS, akaikeWeights, linearised).
// Run: node scripts/blog-figures/sela-sp1-nightshade-protease-michaelis-menten.mjs   (rewrites the charts inside the article)
// Everything plotted here is SIMULATED from the paper's two published numbers; the paper's own rates are not used.
import fs from 'node:fs';
import { fitEnzyme, MODELS, akaikeWeights, linearised } from '../../src/lib/sci/enzyme.ts';
import { chart, figure, inject, COLOURS } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sela-sp1-nightshade-protease-michaelis-menten.md', import.meta.url);

// Inputs. "Paper": Teutle-Paredes et al. (2026), Catalysts 16, 1011 (CC BY 3.0), abstract.
const KM = 77.8;   // µM, paper
const VMAX = 2.4;  // µM/s, paper
const MASS = 70;   // kDa, apparent molecular mass, paper
// Our assumptions (not from the paper):
const WIDE = [10, 20, 40, 80, 160, 320, 640];   // µM: about 0.13 to 8 × Km, a design we chose
const NARROW = [5, 10, 20, 40, 80, 160];        // µM: tops out near 2 × Km, a cramped design for comparison
const SD = 0.06;                                // µM/s: constant measurement scatter, 2.5% of Vmax
const RUNS = 2000;                              // simulated experiments per design
const E_UG_ML = 1;                              // µg/mL enzyme in the cuvette, for the kcat example only

let seed = 20261116; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
for (let i = 0; i < 10; i++) rnd(); // warm up the generator
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const mm = MODELS.find((m) => m.id === 'mm');
const simulate = (S) => S.map((s) => ({ S: s, I: 0, v: +((VMAX * s) / (KM + s) + SD * gauss()).toFixed(3) }));

// 1. One simulated experiment (the data readers can paste), fitted with every no-inhibitor model.
const one = simulate(WIDE);
const fits = MODELS.filter((m) => !m.needsI).map((m) => fitEnzyme(m, one));
const w = akaikeWeights(fits);
const f1 = fits[0], L1 = linearised(one);

// 2. Many simulated experiments: Km from the non-linear fit and from Lineweaver-Burk.
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
function study(S) {
  const nl = [], lb = [];
  for (let k = 0; k < RUNS; k++) {
    const d = simulate(S);
    nl.push(fitEnzyme(mm, d).p[1]);
    const L = linearised(d).lineweaver; lb.push(L.Km > 0 && L.Km < 2000 ? L.Km : NaN); // a negative intercept gives no usable Km
  }
  const ok = lb.filter(Number.isFinite);
  return { nl, lb: ok, lbBad: RUNS - ok.length,
    nlQ: [pct(nl, 0.025), pct(nl, 0.5), pct(nl, 0.975)].map((v) => +v.toFixed(1)),
    lbQ: [pct(ok, 0.025), pct(ok, 0.5), pct(ok, 0.975)].map((v) => +v.toFixed(1)) };
}
const wide = study(WIDE), narrow = study(NARROW);

// Figure 1: the simulated rates and the fitted curve.
const sx = Array.from({ length: 81 }, (_, i) => (700 * i) / 80);
const fig1 = chart({
  title: 'A simulated Sela-SP1 experiment and its fit', xLabel: 'Substrate (µM)', yLabel: 'Initial rate (µM/s)',
  series: [
    { name: 'Simulated rates', kind: 'dots', x: WIDE, y: one.map((o) => o.v), size: 4 },
    { name: `Michaelis–Menten fit (Km ${f1.p[1].toFixed(1)} µM)`, kind: 'line', x: sx, y: sx.map((s) => +((f1.p[0] * s) / (f1.p[1] + s)).toFixed(4)) },
  ],
  xDomain: [0, 700], yDomain: [0, 2.6], hlines: [{ y: VMAX, text: 'Vmax 2.4 (paper)' }], vlines: [{ x: KM, text: 'Km 77.8 µM (paper)' }],
  desc: 'Seven simulated initial rates rise steeply and level off near 2.4 micromolar per second; the fitted curve passes through them and its half-way point sits near 78 micromolar.', height: 280,
});

// Figure 2: how often each Km value comes out over 2000 simulated experiments (wide design).
const edges = Array.from({ length: 31 }, (_, i) => 40 + 3 * i); // 40 to 130 µM, 3 µM bins
const hist = (a) => edges.slice(0, -1).map((e, i) => a.filter((v) => v >= e && v < edges[i + 1]).length / a.length * 100);
const mids = edges.slice(0, -1).map((e) => e + 1.5);
const fig2 = chart({
  title: 'Km from 2,000 simulated experiments', xLabel: 'Fitted Km (µM)', yLabel: 'Share of experiments (%)',
  series: [
    { name: 'Non-linear fit', kind: 'step', x: mids, y: hist(wide.nl).map((v) => +v.toFixed(2)) },
    { name: 'Lineweaver–Burk', kind: 'step', x: mids, y: hist(wide.lb).map((v) => +v.toFixed(2)) },
  ],
  xDomain: [40, 130], yDomain: [0, 25], vlines: [{ x: KM, text: 'true 77.8' }],
  desc: 'The non-linear Km values bunch tightly around the true 77.8 micromolar; the Lineweaver-Burk values spread far wider, with a long tail towards high values.', height: 260,
});

const E_uM = (E_UG_ML * 1e-3) / (MASS * 1000) * 1e6; // µg/mL -> g/L -> mol/L -> µM
const facts = {
  data: one.map((o) => [o.S, o.v]),
  fit: { Vmax: +f1.p[0].toFixed(3), seV: +f1.se[0].toFixed(3), Km: +f1.p[1].toFixed(2), seK: +f1.se[1].toFixed(2), r2: +f1.r2.toFixed(4) },
  weights: Object.fromEntries(fits.map((f, i) => [f.model.id, +w[i].toFixed(3)])),
  lb: { Vmax: +L1.lineweaver.Vmax.toFixed(3), Km: +L1.lineweaver.Km.toFixed(2) }, eadie: { Vmax: +L1.eadie.Vmax.toFixed(3), Km: +L1.eadie.Km.toFixed(2) }, hanes: { Vmax: +L1.hanes.Vmax.toFixed(3), Km: +L1.hanes.Km.toFixed(2) },
  wide: { nl: wide.nlQ, lb: wide.lbQ, lbBad: wide.lbBad }, narrow: { nl: narrow.nlQ, lb: narrow.lbQ, lbBad: narrow.lbBad },
  E_uM: +E_uM.toFixed(5), kcat: +(VMAX / E_uM).toFixed(1), kcatKm_perM_s: +((VMAX / E_uM) / (KM * 1e-6)).toExponential(2),
  satAt8Km: +(640 / (KM + 640)).toFixed(3),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'fit', figure(fig1, 'Figure 1. Simulated initial rates (dots) made from the paper\'s Km and Vmax with 0.06 µM/s of random scatter (our assumption), fitted with the Enzyme kinetics fitter\'s maths. Simulated, not the paper\'s measurements.'));
  md = inject(md, 'mc', figure(fig2, 'Figure 2. Km fitted to 2,000 simulated experiments of seven rates each (10 to 640 µM), by the non-linear fit and by a Lineweaver–Burk straight line, both from the Enzyme kinetics fitter\'s maths. Simulated.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
