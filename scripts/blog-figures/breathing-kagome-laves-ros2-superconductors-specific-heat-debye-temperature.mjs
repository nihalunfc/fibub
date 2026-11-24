// Figures for src/blog/discoveries/breathing-kagome-laves-ros2-superconductors-specific-heat-debye-temperature.md, made with
// the maths of the Heat capacity fitter (src/lib/sci/phheat.ts: Debye C(T), β ↔ θ_D, the low-T C/T vs T² line) and the
// Superconductor calculator (src/lib/sci/phsc.ts: Ginzburg–Landau fields).
// Run: node scripts/blog-figures/breathing-kagome-laves-ros2-superconductors-specific-heat-debye-temperature.mjs
import fs from 'node:fs';
import { debyeC, debyeBeta, thetaFromBeta, lowT } from '../../src/lib/sci/phheat.ts';
import { glFields } from '../../src/lib/sci/phsc.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/breathing-kagome-laves-ros2-superconductors-specific-heat-debye-temperature.md', import.meta.url);
const KB = 1.380649e-23;
// Inputs from the paper: Górnicka, Winiarski, Walicka and Klimczuk (2023), Sci. Rep. 13: 16704, doi:10.1038/s41598-023-43621-w (CC BY 4.0).
// γ (mJ mol-1 K-2), β (mJ mol-1 K-4), θ_D (K), T_c from specific heat (K), ΔC/γT_c, λ_e-p, N(E_F), λ_GL and ξ_GL (Å), Hc1 (Oe), Hc2 (T), Hc (mT).
const P = [
  { id: 'ScOs₂', g: 12.7, b: 0.18, th: 319, tc: 5.36, jump: 1.51, lam: 0.64, nef: 3.30, lgl: 1513, xi: 113, hc1: 187, hc2: 2.58, hc: 136 },
  { id: 'YOs₂', g: 11.1, b: 0.24, th: 291, tc: 4.55, jump: 1.22, lam: 0.63, nef: 2.90, lgl: 2440, xi: 121, hc1: 83, hc2: 2.23, hc: 78 },
  { id: 'LuOs₂', g: 14.5, b: 0.29, th: 270, tc: 3.47, jump: 1.41, lam: 0.59, nef: 3.86, lgl: 3270, xi: 141, hc1: 48, hc2: 1.64, hc: 50 },
];
const N = 3, MU = 0.13; // atoms per formula unit; Coulomb pseudopotential μ* (both from the paper)
// McMillan (inverted), as the paper uses it: a hand check, not a fibub tool.
const mcmillan = (th, tc) => { const L = Math.log(th / (1.45 * tc)); return (1.04 + MU * L) / ((1 - 0.62 * MU) * L - 1.04); };
// Simulated normal-state data (OUR assumption): γT + full Debye lattice term at the paper's θ_D, from 0.5 K above T_c to 10 K
// in 0.25 K steps, with 1 % Gaussian scatter.
let seed = 16704; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const res = P.map((p) => {
  const T = []; for (let t = Math.ceil((p.tc + 0.5) * 4) / 4; t <= 10.0001; t += 0.25) T.push(+t.toFixed(2));
  const C = T.map((t) => (p.g / 1000) * t + debyeC(t, p.th, N));
  const Cn = C.map((c) => +(c * (1 + 0.01 * gauss())).toPrecision(5));
  const fit = lowT(T, Cn, 10, N), exact = lowT(T, C, 10, N);
  const bias = [6, 10, 15, 20, 25, 30, 35, 40, 50, 60].map((tm) => { const TT = []; for (let t = 1; t <= tm + 1e-9; t += 0.25) TT.push(t); const f = lowT(TT, TT.map((t) => (p.g / 1000) * t + debyeC(t, p.th, N)), tm, N); return [tm, f.theta]; });
  const gl = glFields(p.lgl * 1e-10, p.xi * 1e-10, 1.764 * KB * p.tc);
  return { ...p, T, Cn, fit, exact, bias, thB: thetaFromBeta(p.b / 1000, N), bTh: debyeBeta(p.th, N) * 1000, lamM: mcmillan(p.th, p.tc), nefM: p.g / (2.357 * (1 + p.lam)), gl };
});

const fig1 = chart({
  title: 'Normal-state C/T against T² (simulated from the paper\'s γ and θ_D)', xLabel: 'T² (K²)', yLabel: 'C/T (mJ mol⁻¹ K⁻²)',
  series: [
    ...res.map((r) => ({ name: r.id, kind: 'dots', x: r.T.map((t) => +(t * t).toFixed(2)), y: r.T.map((t, i) => +((1000 * r.Cn[i]) / t).toFixed(3)), size: 2.2 })),
    ...res.map((r, k) => ({ name: '', noLegend: true, kind: 'line', x: [0, 100], y: [1000 * r.fit.gamma, 1000 * (r.fit.gamma + r.fit.beta * 100)].map((v) => +v.toFixed(3)), colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][k] })),
  ],
  xDomain: [0, 100], yDomain: [8, 46],
  desc: `Simulated C/T against T-squared for ScOs2, YOs2 and LuOs2 with the straight lines the heat capacity fitter puts through them; intercepts are gamma and slopes beta.`, height: 280,
});
const fig2 = chart({
  title: 'How high can the T³ line go?', xLabel: 'Top of the fitted range (K)', yLabel: 'θ_D from the C/T line (K)',
  series: res.map((r) => ({ name: r.id, kind: 'line', x: r.bias.map((b) => b[0]), y: r.bias.map((b) => +b[1].toFixed(2)) })),
  xDomain: [6, 60], yDomain: [260, 420],
  desc: 'Debye temperature read from a straight C/T vs T-squared line through exact Debye data, against the highest temperature included. It drifts above the true value as the range widens.', height: 260,
});

const f = (v, d) => +v.toFixed(d);
console.log(JSON.stringify(res.map((r) => ({
  id: r.id, thFromBeta: f(r.thB, 1), betaFromTheta: f(r.bTh, 4), nPts: r.T.length, Trange: [r.T[0], r.T[r.T.length - 1]],
  fit: { g: f(1000 * r.fit.gamma, 2), seg: f(1000 * r.fit.seGamma, 2), b: f(1000 * r.fit.beta, 4), seb: f(1000 * r.fit.seBeta, 4), th: f(r.fit.theta, 1), seth: f(r.fit.seTheta, 1) },
  exact: { g: f(1000 * r.exact.gamma, 3), b: f(1000 * r.exact.beta, 4), th: f(r.exact.theta, 1) },
  bias: r.bias.map(([t, th]) => [t, f(th, 1)]), lamMcMillan: f(r.lamM, 3), nefFromGamma: f(r.nefM, 2), jumpOverBCS: f(r.jump / 1.43, 2),
  gl: { kappa: f(r.gl.kappa, 1), Bc_mT: f(1000 * r.gl.Bc, 1), Bc1_mT: f(1000 * r.gl.Bc1, 1), Bc2_T: f(r.gl.Bc2, 3), Bp_T: f(r.gl.Bp, 2) },
})), null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ct', figure(fig1, 'Figure 1. Simulated normal-state heat capacity of the three compounds, built from the paper\'s γ and Debye temperatures with 1 % scatter (our assumption), plotted as C/T against T², with the straight lines the Heat capacity fitter\'s maths puts through them. Not the paper\'s measurements.'));
  md = inject(md, 'bias', figure(fig2, 'Figure 2. The Debye temperature a straight C/T against T² line gives when fitted from 1 K up to a chosen top temperature, using exact Debye curves at the paper\'s θ_D (319, 291 and 270 K). Below about 20 K the line returns the true value; above that the pure Debye curve already bends away from T³ and the line overstates θ_D.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
