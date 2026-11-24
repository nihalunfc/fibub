// Figures for src/blog/discoveries/ahad-rafidah-seismic-refraction-spread-length-crossover.md, made with the maths of
// the Seismic refraction interpreter (src/lib/sci/refraction.ts: forward travel times, segment fitting, intercept and
// crossover depths). Run: node scripts/blog-figures/ahad-rafidah-seismic-refraction-spread-length-crossover.mjs
import fs from 'node:fs';
import { forwardTimes, segment, crossover, interceptDepths, crossoverDepths } from '../../src/lib/sci/refraction.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ahad-rafidah-seismic-refraction-spread-length-crossover.md', import.meta.url);

// Inputs from the paper: Qaysi, Al-Shmrani and Abdelrahman (2025), Open Geosciences 17: 20250799 (CC BY 4.0).
// Geometry: ten refraction profiles, 24 geophones at 5 m, so a 115 m spread, five shots per profile.
// Velocities: layer 1 (alluvium) 300-940 m/s, layer 2 (weathered basement) 1350-2630 m/s, layer 3 (fresh basement)
// 2400-6876 m/s. Alluvium about 2 m in the north-east to about 8 m in the south-west; weathered basement to 30 m
// under profiles 3 and 4. Per-profile Vp and Vs from the paper's Table 2.
// OUR ASSUMPTIONS: a three-layer model with V1 530 m/s (the median of their per-profile values), V2 1890 m/s and
// V3 2630 m/s, 4 m of alluvium and basement at 30 m; a 1 ms standard deviation on first-arrival picks.
const SPREAD = 115, DX = 5;
const XS = Array.from({ length: 24 }, (_, i) => i * DX);
const V = [530, 1890, 2630], H = [4, 26];
const PICK_SD = 0.001;

const F = forwardTimes(V, H, XS);
const picks = F.first.map((t) => +(t * 1000).toFixed(2)); // ms, as a reader would type them
const fit = segment(XS, picks.map((t) => t / 1000), 2);
const xc12 = crossover(fit.lines[0], fit.lines[1]);
const exact = {
  speeds: fit.lines.map((l) => +l.v.toPrecision(4)),
  intercepts: F.heads.map((hd) => +(hd.ti * 1000).toFixed(2)),
  xcrit: F.heads.map((hd) => +hd.xcrit.toFixed(1)),
  crossovers: [1, 2].map((n) => +((F.heads[n].ti - F.heads[n - 1].ti) / (1 / V[n - 1] - 1 / V[n])).toFixed(1)),
  h: interceptDepths(fit.lines.map((l) => l.v), fit.lines.map((l) => l.ti)).map((v) => +v.toFixed(2)),
  layersSeen: [...new Set(F.layer)].length,
};
exact.fromCrossovers = crossoverDepths(V, exact.crossovers).map((v) => +v.toFixed(2));

// Where the third layer's head wave first overtakes the second, as V3 changes.
const firstArrivalOf = (vv, hh, layer) => {
  const fine = Array.from({ length: 4001 }, (_, i) => i * 0.5);
  const i = forwardTimes(vv, hh, fine).layer.findIndex((l) => l === layer);
  return i < 0 ? null : fine[i];
};
const V3S = Array.from({ length: 24 }, (_, i) => 2400 + i * 200);
const third = V3S.map((v3) => firstArrivalOf([V[0], V[1], v3], H, 2));

// Monte Carlo: the same picks with 1 ms scatter, re-interpreted as two layers 200 times.
let seed = 115; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const mc = [];
for (let k = 0; k < 120; k++) {
  const t = F.first.map((x) => x + PICK_SD * gauss());
  try { const { lines } = segment(XS, t, 2); mc.push({ v1: lines[0].v, v2: lines[1].v, h1: interceptDepths(lines.map((l) => l.v), lines.map((l) => l.ti))[0] }); } catch { /* a draw that will not split into two rising speeds */ }
}
const stats = (a) => { const m = a.reduce((s, x) => s + x, 0) / a.length, sd = Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length); return { mean: +m.toFixed(2), sd: +sd.toFixed(2), min: +Math.min(...a).toFixed(2), max: +Math.max(...a).toFixed(2) }; };
const mcStats = { n: mc.length, v1: stats(mc.map((r) => r.v1)), v2: stats(mc.map((r) => r.v2)), h1: stats(mc.map((r) => r.h1)) };

// Poisson's ratio from the paper's own per-profile Vp and Vs (Table 2).
const TAB = [[590, 347], [940, 553], [660, 388], [520, 306], [530, 312], [470, 276], [400, 235], [530, 312], [540, 318], [300, 176]];
const poisson = (vp, vs) => (vp * vp - 2 * vs * vs) / (2 * (vp * vp - vs * vs));
const ratios = TAB.map(([a, b]) => +(a / b).toFixed(4)), sigmas = TAB.map(([a, b]) => +poisson(a, b).toFixed(4));

const LONG = Array.from({ length: 201 }, (_, i) => i); // 0 to 200 m, 1 m steps
const L3 = forwardTimes(V, H, LONG);
const fig1 = chart({
  title: 'Travel times for the paper’s three layers', xLabel: 'Offset from the shot (m)', yLabel: 'First-arrival time (ms)',
  series: [
    { name: 'First arrival', kind: 'line', x: LONG, y: L3.first.map((t) => +(t * 1000).toFixed(2)) },
    { name: 'Layer 3 head wave', kind: 'line', dash: '5 4', x: LONG, y: LONG.map((x) => +((F.heads[2].ti + x / V[2]) * 1000).toFixed(2)) },
  ],
  xDomain: [0, 200], yDomain: [0, 120],
  vlines: [{ x: SPREAD, text: '115 m spread' }, { x: exact.crossovers[1], text: 'layer 3 arrives first' }],
  desc: 'Modelled first-arrival times for a 530, 1890 and 2630 m/s three-layer model with 4 m of alluvium over basement at 30 m. The layer-3 head wave only overtakes the layer-2 arrival at 130 m, beyond the 115 m spread.', height: 280,
});

const fig2 = chart({
  title: 'How fast the basement must be to show up at all', xLabel: 'Fresh-basement speed V3 (m/s)', yLabel: 'Offset where layer 3 arrives first (m)',
  series: [{ name: 'Crossover offset', kind: 'line', x: V3S, y: third }],
  xDomain: [2400, 7000], yDomain: [0, 200],
  hlines: [{ y: SPREAD, text: '115 m spread' }],
  desc: 'The offset at which the fresh-basement head wave becomes the first arrival, against its speed, for basement at 30 m depth. Below about 3000 m/s it never arrives first inside the 115 m spread.', height: 280,
});

const fig3 = chart({
  title: 'What 1 ms of pick error does to the top layer', xLabel: 'Fitted top-layer speed V1 (m/s)', yLabel: 'Fitted alluvium thickness (m)',
  series: [
    { name: '120 noisy re-fits', kind: 'dots', x: mc.map((r) => +r.v1.toFixed(1)), y: mc.map((r) => +r.h1.toFixed(2)), size: 2.2 },
    { name: 'True model', kind: 'dots', x: [V[0]], y: [H[0]], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [250, 1000], yDomain: [0, 9],
  bands: [{ x0: 300, x1: 940, text: "paper's V1 range across ten profiles" }],
  desc: 'One hundred and twenty re-interpretations of the same model with 1 ms of random pick error. The fitted top-layer speed scatters across almost the whole range the paper reports between profiles.', height: 280,
});

console.log(JSON.stringify({ picks, exact, xc12: +xc12.toFixed(1), mcStats, ratios, sigmas, third: Object.fromEntries(V3S.map((v, i) => [v, third[i]])) }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'times', figure(fig1, 'Figure 1. Modelled first-arrival times for the paper\'s three velocity layers with 4 m of alluvium over basement at 30 m. The fresh-basement branch (dashed) only becomes the first arrival at 130 m, past the end of a 115 m spread. Our model, not the paper\'s picks.'));
  md = inject(md, 'v3', figure(fig2, 'Figure 2. The offset at which the fresh-basement head wave overtakes the one above it, against the basement speed, for a top at 30 m. Only a basement faster than about 3,000 m/s shows up as a first arrival within 115 m.'));
  md = inject(md, 'noise', figure(fig3, 'Figure 3. One hundred and twenty re-interpretations of the same synthetic survey with 1 ms of pick scatter. The shaded band is the top-layer speed range the paper reports across its ten profiles.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
