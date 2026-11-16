// Figures for src/blog/discoveries/quaternium-22-corrosion-inhibitor-carbon-steel-hcl.md, made with the maths of the
// Tafel corrosion rate tool (src/lib/sci/corrosion.ts: bv, signed, tafel, fitBV, polarisationResistance, sternGeary, rateMmY).
// Run: node scripts/blog-figures/quaternium-22-corrosion-inhibitor-carbon-steel-hcl.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { bv, signed, tafel, fitBV, polarisationResistance, sternGeary, rateMmY, METALS } from '../../src/lib/sci/corrosion.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/quaternium-22-corrosion-inhibitor-carbon-steel-hcl.md', import.meta.url);

// "Paper": Afifi et al. (2026), Surfaces 9(2), 30, doi:10.3390/surfaces9020030 (CC BY): 97.21 % efficiency at 277 µmol/L
// in 1.0 M HCl at 20 °C (polarisation); dGads -37.4 to -39.8 kJ/mol; Langmuir isotherm.
// "Ours": the blank curve (Ecorr -0.470 V vs SCE, icorr 400 µA/cm², βa 70, βc 120 mV/decade), the inhibited curve's Ecorr
// and slopes, 2 % noise, 1 mV steps. Only the ratio of the two icorr values comes from the paper.
const IE = 0.9721, FE = METALS.find((m) => m.id === 'Fe');
const BLANK = { Ecorr: -0.470, icorr: 400e-6, ba: 0.070, bc: 0.120 };
const INH = { Ecorr: -0.452, icorr: 400e-6 * (1 - IE), ba: 0.085, bc: 0.130 };
let seed = 30; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648) - 0.5;
const curve = (p) => { const E = [], i = []; for (let k = 0; k <= 500; k++) { const e = p.Ecorr - 0.25 + k * 0.001; E.push(+e.toFixed(3)); i.push(+(bv(e, p.Ecorr, p.icorr, p.ba, p.bc) * (1 + 0.04 * rnd())).toPrecision(5)); } return { E, i }; };
const run = (p) => { const k = curve(p), c = signed(k.E, k.i), t = tafel(c, 0.08, 0.2), f = fitBV(c, t.E0, t), rp = polarisationResistance(c, t.E0); return { k, t, f, rp, sg: sternGeary(f.ba, f.bc) / rp.Rp }; };
const b = run(BLANK), h = run(INH);
const ieT = 1 - h.t.icorr / b.t.icorr, ieF = 1 - h.f.icorr / b.f.icorr, ieS = 1 - h.sg / b.sg;

// Figure 1: the two simulated curves on a log current scale (every 4th point).
const pts = (r) => r.k.E.map((e, j) => [e, Math.log10(Math.abs(r.k.i[j]) * 1e6)]).filter((p, j) => j % 4 === 0 && Number.isFinite(p[1]) && p[1] > -1);
const pb = pts(b), ph = pts(h), lab = (v) => (v === 0 ? '1' : v === 1 ? '10' : v === 2 ? '100' : v === 3 ? '1000' : v === 4 ? '10⁴' : `10^${v}`);
const fig1 = chart({
  title: 'Polarisation curves, blank and with inhibitor (simulated)', xLabel: 'Potential (V vs SCE)', yLabel: '|i| (µA/cm², log scale)',
  series: [
    { name: 'Blank, 1 M HCl', kind: 'line', x: pb.map((p) => p[0]), y: pb.map((p) => +p[1].toFixed(3)) },
    { name: 'With 277 µmol/L Q-22', kind: 'line', x: ph.map((p) => p[0]), y: ph.map((p) => +p[1].toFixed(3)) },
  ],
  yDomain: [-1, 4], yTicks: [0, 1, 2, 3, 4], yFmt: lab, xDomain: [-0.72, -0.2], height: 270,
  desc: `Simulated curves. Tafel extrapolation gives icorr ${(b.t.icorr * 1e6).toFixed(0)} µA/cm² without and ${(h.t.icorr * 1e6).toFixed(1)} µA/cm² with the inhibitor, an efficiency of ${(100 * ieT).toFixed(1)} %.`,
});

// Figure 2: Langmuir coverage against concentration from the paper's dGads range (K = exp(-dG/RT)/55.5 L/mol).
const R = 8.314462618, T = 293.15, Kof = (dG) => Math.exp(-dG / (R * T)) / 55.5;
const cs = Array.from({ length: 61 }, (_, j) => j * 5); // µmol/L
const fig2 = chart({
  title: 'Langmuir coverage from the paper\'s ΔG°ads range (20 °C)', xLabel: 'Q-22 concentration (µmol/L)', yLabel: 'Surface covered, θ',
  series: [-39.8, -37.4].map((g) => { const K = Kof(g * 1000); return { name: `ΔG°ads = ${g} kJ/mol`, kind: 'line', x: cs, y: cs.map((c) => +((K * c * 1e-6) / (1 + K * c * 1e-6)).toFixed(4)) }; })
    .concat([{ name: 'Paper: 97.21 % at 277', kind: 'dots', x: [277], y: [IE], size: 4.5 }]),
  yDomain: [0, 1], xDomain: [0, 300], height: 250,
  desc: `Langmuir coverage curves for adsorption constants of ${Kof(-39800).toExponential(2)} and ${Kof(-37400).toExponential(2)} L/mol.`,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'tafel', figure(fig1, 'Figure 1. Two polarisation curves we simulated with the Tafel tool\'s Wagner-Traud equation (2 % noise), the inhibited one with 2.79 % of the blank\'s corrosion current, the ratio the paper\'s 97.21 % implies. Not the paper\'s measured curves.'));
md = inject(md, 'langmuir', figure(fig2, 'Figure 2. Langmuir coverage worked out from the ends of the paper\'s ΔG°ads range, taken at 20 °C (our simplification), with the paper\'s best efficiency as a dot. Our recomputation, not the paper\'s isotherm plot.'));
fs.writeFileSync(ART, md);

for (const [n, r] of [['blank', b], ['inh', h]]) console.log(n, 'tafel', r.t.Ecorr.toFixed(4), (r.t.icorr * 1e6).toFixed(2), (r.t.ba * 1e3).toFixed(1), (r.t.bc * 1e3).toFixed(1), '| fit', (r.f.icorr * 1e6).toFixed(2), (r.f.ba * 1e3).toFixed(1), (r.f.bc * 1e3).toFixed(1), '| Rp ohm cm2', r.rp.Rp.toFixed(2), 'SG', (r.sg * 1e6).toFixed(2), '| mm/y', rateMmY(r.t.icorr * 1e6, FE.EW, FE.rho).toFixed(3));
console.log('IE tafel', (100 * ieT).toFixed(2), 'fit', (100 * ieF).toFixed(2), 'SG', (100 * ieS).toFixed(2));
console.log('K', Kof(-39800).toExponential(3), Kof(-37400).toExponential(3), 'theta at 277', [-39.8, -37.4].map((g) => { const x = Kof(g * 1000) * 277e-6; return (x / (1 + x)).toFixed(4); }));
console.log('sizes', fig1.length, fig2.length);
