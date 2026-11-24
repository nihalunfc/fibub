// Figures for src/blog/discoveries/capric-lauric-myristic-acid-ternary-eutectic-phase-change-schroder-van-laar.md, made with
// the maths of the Phase diagram calculator (src/lib/sci/phase.ts: ideal liquidus curves, eutectic, mole/mass conversion).
// Run: node scripts/blog-figures/capric-lauric-myristic-acid-ternary-eutectic-phase-change-schroder-van-laar.mjs
import fs from 'node:fs';
import { eutectic, liqA, liqB, toMass, R } from '../../src/lib/sci/phase.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/capric-lauric-myristic-acid-ternary-eutectic-phase-change-schroder-van-laar.md', import.meta.url);
const K = 273.15;
// Inputs from the paper: Zhou, Zhou, Yuan, Liu and Liu (2026), Materials 19(2): 356, doi:10.3390/ma19020356 (CC BY).
// Melting points (K), latent heats (J/g) and molar masses (g/mol) as they appear in the paper's worked equations.
const CA = { n: 'capric acid', Tm: 303.65, h: 176.0, M: 172.26 };
const LA = { n: 'lauric acid', Tm: 316.95, h: 182.0, M: 200.32 };
const MA = { n: 'myristic acid', Tm: 325.45, h: 188.6, M: 228.37 };
const H = (c) => c.h * c.M; // J/mol
const MEASURED = { T: 16.0, mass: [52.0, 30.0, 18.0], h: 177.0 };

// 1. Binary CA–LA, with the tool's eutectic().
const e1 = eutectic(CA.Tm, H(CA), LA.Tm, H(LA));
// 2. Pseudo-binary: the CA–LA eutectic treated as one component (mole-weighted M and ΔH), against MA.
const EU = { Tm: e1.T, H: (1 - e1.x) * H(CA) + e1.x * H(LA), M: (1 - e1.x) * CA.M + e1.x * LA.M };
const e2 = eutectic(EU.Tm, EU.H, MA.Tm, H(MA));
const wMA = toMass(e2.x, EU.M, MA.M);
// 3. Ternary: each acid's ideal solubility is the tool's liquidus for "pure B", x_i = liqB(Tm_i, ΔH_i, T); the eutectic is where they sum to 1.
const C3 = [CA, LA, MA];
const xs = (T) => C3.map((c) => liqB(c.Tm, H(c), T));
let lo = 250, hi = CA.Tm; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; xs(m).reduce((s, v) => s + v, 0) < 1 ? (lo = m) : (hi = m); }
const T3 = (lo + hi) / 2, x3 = xs(T3);
const m3 = x3.map((x, i) => x * C3[i].M), M3 = m3.reduce((s, v) => s + v, 0), w3 = m3.map((v) => v / M3);
// Latent heat of the eutectic: the paper's formula T_E · Σ x_i ΔH_i / T_i, and a plain mass average for comparison.
const hE = T3 * x3.reduce((s, x, i) => s + (x * H(C3[i])) / C3[i].Tm, 0);
const hAvg = x3.reduce((s, x, i) => s + x * H(C3[i]), 0) / M3;
const hMeasuredMix = MEASURED.mass.reduce((s, w, i) => s + (w / 100) * C3[i].h, 0);
// The measured eutectic, put back through the ideal model: liquidus temperature of the mixture CA:LA:MA = 52:30:18 by mass.
const xm = (() => { const n = MEASURED.mass.map((w, i) => w / C3[i].M), s = n.reduce((a, b) => a + b, 0); return n.map((v) => v / s); })();
const Tliq = Math.max(...C3.map((c, i) => { let a = 200, b = c.Tm; for (let k = 0; k < 200; k++) { const m = (a + b) / 2; liqB(c.Tm, H(c), m) < xm[i] ? (a = m) : (b = m); } return (a + b) / 2; }));

// Chart 1: the CA–LA binary diagram (mol % LA).
const XX = Array.from({ length: 101 }, (_, i) => i / 100);
const Tl = (x) => { // liquidus temperature at overall x (mole fraction LA)
  const f = x <= e1.x ? (T) => liqA(CA.Tm, H(CA), T) : (T) => liqB(LA.Tm, H(LA), T);
  let a = e1.T, b = x <= e1.x ? CA.Tm : LA.Tm; for (let k = 0; k < 100; k++) { const m = (a + b) / 2; (x <= e1.x ? f(m) < x : f(m) > x) ? (a = m) : (b = m); }
  return x <= 0 ? CA.Tm : x >= 1 ? LA.Tm : (a + b) / 2;
};
const fig1 = chart({
  title: 'Capric acid + lauric acid: ideal phase diagram', xLabel: 'Lauric acid (mol %)', yLabel: 'Temperature (°C)',
  series: [
    { name: 'Liquidus', kind: 'line', x: XX.map((x) => 100 * x), y: XX.map((x) => +(Tl(x) - K).toFixed(2)) },
    { name: 'Eutectic', kind: 'dots', x: [+(100 * e1.x).toFixed(1)], y: [+(e1.T - K).toFixed(2)], size: 4, colour: 'var(--c-blog)', label: { text: `${(e1.T - K).toFixed(1)} °C at ${(100 * e1.x).toFixed(1)} mol %`, dx: 8, dy: 16 } },
  ],
  xDomain: [0, 100], yDomain: [15, 46], hlines: [{ y: +(e1.T - K).toFixed(2), text: 'solidus' }],
  desc: `Ideal Schröder–van Laar liquidus for capric and lauric acids; eutectic at ${(e1.T - K).toFixed(1)} °C and ${(100 * e1.x).toFixed(1)} mol % lauric acid.`, height: 270,
});
// Chart 2: the pseudo-binary (CA–LA eutectic) + MA, in wt % MA.
const WW = Array.from({ length: 101 }, (_, i) => i / 100);
const toMoleE = (w) => (w / MA.M) / (w / MA.M + (1 - w) / EU.M);
const Tl2 = (w) => { const x = toMoleE(w); if (x <= 0) return EU.Tm; if (x >= 1) return MA.Tm;
  const left = x <= e2.x, f = left ? (T) => liqA(EU.Tm, EU.H, T) : (T) => liqB(MA.Tm, H(MA), T);
  let a = e2.T, b = left ? EU.Tm : MA.Tm; for (let k = 0; k < 100; k++) { const m = (a + b) / 2; (left ? f(m) < x : f(m) > x) ? (a = m) : (b = m); } return (a + b) / 2; };
const fig2 = chart({
  title: 'Adding myristic acid to the capric–lauric eutectic', xLabel: 'Myristic acid (wt %)', yLabel: 'Temperature (°C)',
  series: [
    { name: 'Ideal liquidus', kind: 'line', x: WW.map((w) => 100 * w), y: WW.map((w) => +(Tl2(w) - K).toFixed(2)) },
    { name: 'Measured eutectic (DSC)', kind: 'dots', x: [MEASURED.mass[2]], y: [MEASURED.T], size: 4, colour: 'var(--c-blog)' },
  ],
  xDomain: [0, 60], yDomain: [12, 46], hlines: [{ y: +(e2.T - K).toFixed(2), text: `predicted ${(e2.T - K).toFixed(2)} °C` }],
  desc: `Pseudo-binary diagram: the predicted eutectic is ${(e2.T - K).toFixed(2)} °C at ${(100 * wMA).toFixed(1)} wt % myristic acid; the measured one is ${MEASURED.T} °C at ${MEASURED.mass[2]} wt %.`, height: 270,
});

const f = (v, d = 2) => +v.toFixed(d);
console.log(JSON.stringify({
  inC: C3.map((c) => ({ n: c.n, TmC: f(c.Tm - K), HkJ: f(H(c) / 1000, 3) })),
  binary: { TC: f(e1.T - K, 2), TK: f(e1.T), xLA: f(100 * e1.x, 2), wLA: f(100 * toMass(e1.x, CA.M, LA.M), 2) },
  EU: { TmC: f(EU.Tm - K, 2), HkJ: f(EU.H / 1000, 3), M: f(EU.M, 2) },
  pseudo: { TC: f(e2.T - K, 2), xMA: f(100 * e2.x, 2), wMA: f(100 * wMA, 2) },
  ternary: { TK: f(T3, 2), TC: f(T3 - K, 2), x: x3.map((v) => f(100 * v, 2)), w: w3.map((v) => f(100 * v, 2)), M: f(M3, 2), hE_Jmol: f(hE, 1), hE_Jg: f(hE / M3, 1), hAvg_Jg: f(hAvg, 1) },
  measuredMix: { h_massavg: f(hMeasuredMix, 1), xm: xm.map((v) => f(100 * v, 2)), TliqC: f(Tliq - K, 2) },
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'binary', figure(fig1, `Figure 1. The ideal capric–lauric acid phase diagram from the Phase diagram calculator's maths, using the melting points and latent heats in the paper. Each branch is the Schröder–van Laar liquidus of one acid; they meet at the eutectic.`));
  md = inject(md, 'pseudo', figure(fig2, `Figure 2. The capric–lauric eutectic treated as a single component and mixed with myristic acid, again with the Phase diagram calculator's maths. The dot is the paper's measured three-acid eutectic (DSC), about 1 °C below the ideal prediction.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
