// Figures and numbers for src/blog/discoveries/green-food-resilience-panel-iv-mediation-recheck.md, made with
// the maths of the Regression panel (src/lib/sci/econometrics.ts) and its t distribution (src/lib/sci/stats.ts).
// Run: node scripts/blog-figures/green-food-resilience-panel-iv-mediation-recheck.mjs
import fs from 'node:fs';
import { ols, iv2sls, panelFE, demean } from '../../src/lib/sci/econometrics.ts';
import { tTwoSided, tInv, normCdf, normInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/green-food-resilience-panel-iv-mediation-recheck.md', import.meta.url);

// Stated values from the paper: Xiong, Ong, Wang and Liu (2026), Frontiers in Sustainable Food Systems 10,
// doi:10.3389/fsufs.2026.1757799 (CC BY 4.0). 403 observations, 31 provinces, province-level cluster-robust
// standard errors, province and year fixed effects. [name, coefficient, standard error]
const COEF = [
  ['Adaptive capacity', 0.243, 0.058], ['Absorptive capacity', 0.127, 0.091], ['Restorative capacity', 0.186, 0.067],
  ['Resilience, total effect', 0.341, 0.074], ['Resilience → export (a)', 0.298, 0.068],
  ['Resilience, direct effect (c′)', 0.258, 0.072], ['Export competitiveness (b)', 0.278, 0.062],
];
const G = 31, N = 403, YEARS = 13, DF_CLUSTER = G - 1; // the cluster rule the tool uses for OLS: G − 1
const DF_PANEL = N - 1 - (G + YEARS - 1); // what panelFE uses: n − k − absorbed

// ---- Check 1: t, p and the 95 % interval from each printed coefficient and standard error --------------
const zq = normInv(0.975), tq = tInv(0.975, DF_CLUSTER), tqP = tInv(0.975, DF_PANEL);
const rows = COEF.map(([name, b, se]) => {
  const t = b / se;
  return {
    name, b, se, t: +t.toFixed(3),
    pz: 2 * (1 - normCdf(Math.abs(t))), pCl: tTwoSided(t, DF_CLUSTER), pPanel: tTwoSided(t, DF_PANEL),
    ciZ: [b - zq * se, b + zq * se], ciCl: [b - tq * se, b + tq * se], ciPanel: [b - tqP * se, b + tqP * se],
  };
});
console.log(`df: cluster rule ${DF_CLUSTER}, panel ${DF_PANEL}; t quantiles ${tq.toFixed(3)} / ${tqP.toFixed(3)} against z ${zq.toFixed(3)}`);
for (const r of rows) console.log(`${r.name.padEnd(30)} t ${r.t}  p(normal) ${r.pz.toFixed(4)}  p(t${DF_CLUSTER}) ${r.pCl.toFixed(4)}  p(t${DF_PANEL}) ${r.pPanel.toFixed(4)}  95% ${r.ciCl.map((v) => v.toFixed(3)).join(' to ')}`);

// ---- Check 2: the mediation arithmetic ----------------------------------------------------------------
const a = 0.298, sa = 0.068, b2 = 0.278, sb = 0.062, total = 0.341, direct = 0.258;
const ind = a * b2, sobel = Math.sqrt(b2 * b2 * sa * sa + a * a * sb * sb), zInd = ind / sobel;
console.log(`indirect a×b ${ind.toFixed(4)}; total − direct ${(total - direct).toFixed(4)}; share ${((ind / total) * 100).toFixed(1)} %`);
console.log(`Sobel SE ${sobel.toFixed(4)}, z ${zInd.toFixed(3)}, p ${(2 * (1 - normCdf(zInd))).toFixed(5)}, 95 % ${(ind - zq * sobel).toFixed(3)} to ${(ind + zq * sobel).toFixed(3)}`);

// ---- Check 3: the 2SLS line ---------------------------------------------------------------------------
const iv = { b: 0.398, se: 0.178, F: 29.7 };
const tIv = iv.b / iv.se;
console.log(`2SLS t ${tIv.toFixed(3)}, p(normal) ${(2 * (1 - normCdf(tIv))).toFixed(4)}, 95 % ${(iv.b - zq * iv.se).toFixed(3)} to ${(iv.b + zq * iv.se).toFixed(3)}; interval ${((2 * zq * iv.se) / (2 * zq * 0.074)).toFixed(1)}× the OLS one; first-stage t ${Math.sqrt(iv.F).toFixed(2)}`);

// ---- Check 4: run the whole pipeline on a simulated panel of the same shape ---------------------------
// 31 provinces × 13 years = 403 rows. True slope 0.341. The residual spread is tuned (bisection) so that
// the tool's province-clustered standard error comes out at the paper's 0.074. OUR SIMULATION, not the paper's data.
let seed = 1757799;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const prov = Array.from({ length: G }, (_, i) => `P${String(i + 1).padStart(2, '0')}`);
const pEff = prov.map(() => gauss() * 0.4), yEff = Array.from({ length: YEARS }, (_, t) => 0.03 * t + gauss() * 0.05);
const rows403 = [];
for (let i = 0; i < G; i++) for (let t = 0; t < YEARS; t++) {
  const x = 0.45 + 0.1 * pEff[i] + 0.012 * t + 0.05 * gauss(); // resilience index
  const z = 0.5 * gauss() + 0.8 * (x - 0.45) / 0.05 * 0.1; // instrument: historical disaster frequency
  rows403.push({ ent: prov[i], time: String(2010 + t), x, z, e: gauss(), pe: pEff[i], ye: yEff[t] });
}
const build = (sd) => rows403.map((r) => 0.341 * r.x + r.pe + r.ye + sd * r.e);
const seFor = (sd) => panelFE(build(sd), rows403.map((r) => [r.x]), ['Resilience'], rows403.map((r) => r.ent), rows403.map((r) => r.time), { timeEffects: true, cov: 'cluster' }).coefs[0].se;
let lo = 0.0001, hi = 1;
for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (seFor(m) < 0.074 ? (lo = m) : (hi = m)); }
const SD = (lo + hi) / 2;
const y = build(SD);
const fe = panelFE(y, rows403.map((r) => [r.x]), ['Resilience'], rows403.map((r) => r.ent), rows403.map((r) => r.time), { timeEffects: true, cov: 'cluster' });
const c0 = fe.coefs[0];
console.log(`simulated panel: residual SD ${SD.toFixed(4)}; b ${c0.b.toFixed(4)}, se ${c0.se.toFixed(4)}, t ${c0.t.toFixed(3)}, p ${c0.p.toExponential(2)}, 95 % ${c0.lo.toFixed(3)} to ${c0.hi.toFixed(3)}, within R² ${fe.r2.toFixed(3)}, df ${fe.df}, clusters ${fe.clusters}`);
// ---- Check 5: an instrument as strong as the paper's, on simulated data -------------------------------
// y = 0.341·x + u, x = c·z + v, with u and v sharing a component so that plain OLS is biased upward.
// c is tuned (bisection) so the tool's first-stage F comes out at the paper's 29.7. OUR SIMULATION.
const ivRows = Array.from({ length: N }, () => { const s = gauss(); return { z: gauss(), v: 0.6 * gauss() + 0.5 * s, u: 0.5 * gauss() + 0.5 * s }; });
const ivFit = (c) => {
  const x = ivRows.map((r) => c * r.z + r.v), yy = x.map((xi, i) => 0.341 * xi + ivRows[i].u);
  return {
    iv: iv2sls(yy, ivRows.map(() => [1]), x.map((v) => [v]), ivRows.map((r) => [r.z]), { exog: ['const'], endog: ['Resilience'], instr: ['Disaster frequency'] }, { hasConst: true }),
    ols: ols(yy, x.map((v) => [1, v]), ['const', 'Resilience'], { hasConst: true }),
  };
};
let clo = 0.01, chi = 3;
for (let i = 0; i < 60; i++) { const m = (clo + chi) / 2; (ivFit(m).iv.firstStage[0].F < 29.7 ? (clo = m) : (chi = m)); }
const ivSim = ivFit((clo + chi) / 2);
console.log(`simulated IV: first-stage F ${ivSim.iv.firstStage[0].F.toFixed(1)} (partial R² ${ivSim.iv.firstStage[0].partialR2.toFixed(3)}), OLS b ${ivSim.ols.coefs[1].b.toFixed(3)} ± ${ivSim.ols.coefs[1].se.toFixed(3)}, 2SLS b ${ivSim.iv.coefs[1].b.toFixed(3)} ± ${ivSim.iv.coefs[1].se.toFixed(3)}, 2SLS 95 % ${ivSim.iv.coefs[1].lo.toFixed(3)} to ${ivSim.iv.coefs[1].hi.toFixed(3)}`);

// ---- A small table a reader can paste into the tool ---------------------------------------------------
// 5 provinces × 4 years, slope 0.34, wide within-province spread and little noise, so the answer is crisp.
let s2 = 403403; const r2 = () => ((s2 = (s2 * 1103515245 + 12345) % 2147483648) / 2147483648);
const g2 = () => Math.sqrt(-2 * Math.log(r2() + 1e-12)) * Math.cos(2 * Math.PI * r2());
const small = [];
for (let i = 0; i < 5; i++) {
  const pe = [-0.4, -0.1, 0.2, 0.5, 0.8][i], d = [0, 0.14, 0.05, 0.21];
  for (let t = 0; t < 4; t++) {
    const x = +(0.40 + 0.06 * i + d[(i + t) % 4]).toFixed(2);
    small.push([`P${i + 1}`, 2010 + t, x, +(0.34 * x + pe + 0.03 * t + 0.004 * g2()).toFixed(3)]);
  }
}
const sFe = panelFE(small.map((r) => r[3]), small.map((r) => [r[2]]), ['Resilience'], small.map((r) => r[0]), small.map((r) => String(r[1])), { timeEffects: true, cov: 'classical' });
console.log('paste table:\n' + small.map((r) => r.join('\t')).join('\n'));
console.log(`small panel FE two-way: b ${sFe.coefs[0].b.toFixed(4)}, se ${sFe.coefs[0].se.toFixed(4)}, t ${sFe.coefs[0].t.toFixed(2)}, p ${sFe.coefs[0].p.toFixed(4)}, within R² ${sFe.r2.toFixed(3)}, df ${sFe.df}, 95 % ${sFe.coefs[0].lo.toFixed(3)} to ${sFe.coefs[0].hi.toFixed(3)}`);

// ---- Figures -----------------------------------------------------------------------------------------
const idx = rows.map((_, i) => i + 1);
const fig1 = chart({
  title: 'Each coefficient with its 95 % interval, two ways', xLabel: 'Coefficient (numbered as in the list below)', yLabel: 'Effect on sustainability performance',
  series: [
    { name: 'Normal reference', kind: 'dots', x: idx.map((i) => i - 0.09), y: rows.map((r) => r.b), errors: rows.map((r) => zq * r.se), size: 3 },
    { name: 'Cluster rule, 30 df', kind: 'dots', x: idx.map((i) => i + 0.09), y: rows.map((r) => r.b), errors: rows.map((r) => tq * r.se), size: 3 },
  ],
  xDomain: [0.5, rows.length + 0.5], yDomain: [-0.12, 0.52], xTicks: idx, hlines: [{ y: 0, text: 'no effect' }],
  desc: 'The seven reported coefficients, each with a 95 % interval worked out from the printed standard error with the normal reference and with the 30 degrees of freedom that 31 clusters allow. Only the second coefficient crosses zero.',
  height: 290,
});
// Within-province, within-year variation from the simulated panel, with the fitted slope.
const [yd, xd] = demean([y, rows403.map((r) => r.x)], rows403.map((r) => r.ent), rows403.map((r) => r.time));
const xr = [Math.min(...xd), Math.max(...xd)];
const fig2 = chart({
  title: 'What a two-way fixed-effects slope looks like', xLabel: 'Resilience index, province and year means removed', yLabel: 'Performance, means removed',
  series: [
    { name: 'Simulated province-years', kind: 'dots', x: xd.filter((_, i) => i % 4 === 0).map((v) => +v.toFixed(3)), y: yd.filter((_, i) => i % 4 === 0).map((v) => +v.toFixed(3)), size: 2.2 },
    { name: `Fitted slope ${c0.b.toFixed(3)}`, kind: 'line', x: xr, y: xr.map((v) => c0.b * v), colour: 'var(--ink)' },
  ],
  desc: `Simulated panel of 31 provinces over 13 years after the province and year means are taken out of both variables, with the within slope the tool fits (${c0.b.toFixed(3)}, clustered standard error ${c0.se.toFixed(3)}).`,
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'forest', figure(fig1, 'Figure 1. The paper\'s seven coefficients (1 adaptive, 2 absorptive, 3 restorative capacity, 4 resilience total, 5 resilience → export, 6 resilience direct, 7 export competitiveness), each with a 95 % interval recomputed from its printed standard error: with the normal reference the paper appears to use, and with the 30 degrees of freedom that 31 clusters allow. Wider, but the same conclusions.'));
  md = inject(md, 'within', figure(fig2, `Figure 2. A simulated panel of the paper's shape (31 provinces, 13 years, 403 rows, true slope 0.341) after the Regression panel's two-way demeaning, with the within slope it fits (one province-year in four shown). Our simulation, not the paper's data.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
