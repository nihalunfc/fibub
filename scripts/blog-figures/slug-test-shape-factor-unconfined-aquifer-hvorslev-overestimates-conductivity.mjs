// Figures for src/blog/discoveries/slug-test-shape-factor-unconfined-aquifer-hvorslev-overestimates-conductivity.md,
// made with the maths of the Slug test analyser (src/lib/sci/slug.ts: recovery fit, Hvorslev and Bouwer-Rice K).
// Run: node scripts/blog-figures/slug-test-shape-factor-unconfined-aquifer-hvorslev-overestimates-conductivity.mjs
import fs from 'node:fs';
import { fitRecovery, hvorslev, bouwerRice } from '../../src/lib/sci/slug.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/slug-test-shape-factor-unconfined-aquifer-hvorslev-overestimates-conductivity.md', import.meta.url);

// Inputs from the paper: De Smedt (2024), Water 16(19): 2853, doi:10.3390/w16192853 (CC BY). Screen radius 0.1 m,
// screens 2 m and 10 m in the middle of a 100 m unconfined aquifer; shape factors ln(Re/rw): Hvorslev 3.00 and 4.61,
// the paper's mixed-boundary solution 2.71 and 4.21.
const R = 0.1;
const CASES = [{ L: 2, paper: 2.71 }, { L: 10, paper: 4.21 }];
// OUR assumptions: casing radius 0.05 m, true K 1e-5 m/s, H0 0.5 m, readings every 10 s (2 m) or 4 s (10 m), scatter 2 mm.
const RC = 0.05, K = 1e-5, H0 = 0.5, NOISE = 0.002;
let seed = 2853; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());

const res = CASES.map((c) => {
  const hv = Math.log(c.L / R);                       // the tool's Hvorslev shape factor ln(Le/R)
  const T0 = (RC * RC * c.paper) / (2 * c.L * K);     // basic time lag the paper's shape factor implies for K
  const dt = c.L === 2 ? 20 : 6;
  const t = Array.from({ length: 21 }, (_, i) => i * dt);
  const h = t.map((x, i) => +(H0 * Math.exp(-x / T0) + (i ? NOISE * gauss() : 0)).toFixed(4));
  const f = fitRecovery(t, h, { lo: 0.1, hi: 0.9 });
  const kH = hvorslev(RC, R, c.L, f.T0), kB = bouwerRice(RC, c.paper, c.L, f.T0);
  return { ...c, hv, ratio: hv / c.paper, T0, t, h, fit: f, kH, kB };
});
console.log(JSON.stringify(res.map((r) => ({ L: r.L, hv: +r.hv.toFixed(3), paper: r.paper, over: +(100 * (r.ratio - 1)).toFixed(1), T0: +r.T0.toFixed(2), fitT0: +r.fit.T0.toFixed(2), n: r.fit.n, r2: +r.fit.r2.toFixed(5), kH: +r.kH.toPrecision(4), kB: +r.kB.toPrecision(4), data: r.t.map((x, i) => [x, r.h[i]]) }))));
// Range over 1-100 m screens (Figure 3 of the paper spans 1 to 100 m)
console.log('hv at 1 m and 100 m:', Math.log(1 / R).toFixed(3), Math.log(100 / R).toFixed(3));

const LL = Array.from({ length: 100 }, (_, i) => 1 + i);
const fig1 = chart({
  title: 'Shape factor ln(Re/rw) for a screen of radius 0.1 m', xLabel: 'Screen length (m)', yLabel: 'Shape factor',
  series: [
    { name: 'Hvorslev ln(L/R), as the tool uses', kind: 'line', x: LL, y: LL.map((L) => +Math.log(L / R).toFixed(3)) },
    { name: 'Paper, screen mid-aquifer', kind: 'dots', x: CASES.map((c) => c.L), y: CASES.map((c) => c.paper), size: 4 },
  ],
  xDomain: [0, 100], yDomain: [0, 7.5], height: 260,
  desc: 'Hvorslev shape factor ln(L/R) against screen length, rising from 2.3 at 1 m to 6.9 at 100 m, with the paper\'s lower values of 2.71 at 2 m and 4.21 at 10 m.',
});
const r10 = res[1];
const fig2 = chart({
  title: 'A simulated slug test, 10 m screen', xLabel: 'Time (s)', yLabel: 'H / H0 (log scale)',
  series: [
    { name: 'Simulated readings', kind: 'dots', x: r10.t, y: r10.h.map((v) => Math.log10(Math.max(v, 1e-3) / H0)), size: 3 },
    { name: 'Fitted line', kind: 'line', x: [0, 120], y: [0, 120].map((x) => (r10.fit.a + r10.fit.b * x) / Math.LN10) },
  ],
  xDomain: [0, 120], yDomain: [-2.3, 0.05], yTicks: [-2, -1, Math.log10(0.37), 0], yFmt: (v) => String(+(10 ** v).toPrecision(2)),
  hlines: [{ y: Math.log10(Math.exp(-1)), text: '' }], height: 260,
  desc: `Simulated head recovery for a 10 m screen with a basic time lag of ${r10.T0.toFixed(1)} s and the straight line the slug test analyser fits to it, giving ${r10.fit.T0.toFixed(1)} s.`,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'shape', figure(fig1, 'Figure 1. The Hvorslev shape factor ln(L/R) that the Slug test analyser uses, for screens 1 to 100 m long and 0.1 m in radius, with the two values the paper\'s solution gives for a screen in the middle of a 100 m aquifer.'));
  md = inject(md, 'recovery', figure(fig2, 'Figure 2. A simulated slug test (our assumptions: casing radius 0.05 m, K = 1 × 10⁻⁵ m/s, start 0.5 m, 2 mm scatter) and the straight line the analyser fits between H/H0 = 0.9 and 0.1. The dashed line marks 0.37, where the basic time lag is read. Not field data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
