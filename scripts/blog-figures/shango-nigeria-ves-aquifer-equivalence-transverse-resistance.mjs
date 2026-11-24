// Figures for src/blog/discoveries/shango-nigeria-ves-aquifer-equivalence-transverse-resistance.md, made with the
// maths of the VES inversion tool (src/lib/sci/ves.ts: the layered-earth forward model by linear filters and the
// damped least-squares inversion).
// Run: node scripts/blog-figures/shango-nigeria-ves-aquifer-equivalence-transverse-resistance.mjs
import fs from 'node:fs';
import { schlumberger, schlumbergerIdeal, invert, startModel } from '../../src/lib/sci/ves.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/shango-nigeria-ves-aquifer-equivalence-transverse-resistance.md', import.meta.url);

// --- Numbers quoted in the paper's own text (Ejepu et al. 2024, Discover Water 4:33, CC BY 4.0) -------------
const PAPER = {
  abMax: 200,                       // maximum half spread AB/2, m
  rhoAqMin: 182, rhoAqMax: 288,     // aquifer resistivity, ohm m (VES 7, VES 8)
  hAqMin: 20.1, hAqMax: 52.2,       // aquifer thickness, m (VES 1, VES 2)
  depthMin: 55.6, depthMax: 68.9,   // aquifer depth, m (VES 6, VES 5)
  trMin: 5232.4, trMax: 12267.0,    // transverse resistance, ohm m^2 (VES 16, VES 2)
  sMin: 4.502, sMax: 13.383,        // longitudinal conductance, siemens
  kMin: 0.465, kMax: 0.534,         // hydraulic conductivity, m/day
  trmMin: 9.589, trmMax: 26.029,    // transmissivity, m^2/day (VES 1, VES 2)
};
// Arithmetic on the paper's numbers alone, nothing assumed.
const checks = {
  rhoFromTr2: PAPER.trMax / PAPER.hAqMax,     // VES 2: transverse resistance / thickness
  kFromTrm2: PAPER.trmMax / PAPER.hAqMax,     // VES 2: transmissivity / thickness
  kFromTrm1: PAPER.trmMin / PAPER.hAqMin,     // VES 1: the same
  kExponent: Math.log(PAPER.kMax / PAPER.kMin) / Math.log(PAPER.rhoAqMax / PAPER.rhoAqMin),
  rhoOverMin: PAPER.depthMin / PAPER.sMax,    // mean overburden resistivity the S values imply
  rhoOverMax: PAPER.depthMax / PAPER.sMin,
  doiLow: PAPER.abMax / 4, doiHigh: PAPER.abMax / 3,
};

// --- Our five-layer section (OUR ASSUMPTION for the three upper layers) ------------------------------------
// Aquifer: 235 ohm m x 52.2 m, so its transverse resistance is the paper's highest (12,267 ohm m^2) and its top
// is at 59.5 m, inside the paper's 55.6 to 68.9 m. The overburden gives a longitudinal conductance of 5.89 S,
// inside the paper's 4.502 to 13.383 S.
const RHO_OVER = 9;
const TRUE = { rho: [150, 60, RHO_OVER, 235, 3000], h: [1.5, 6, 52, 52.2] };
const RHO_AQ = TRUE.rho[3], H_AQ = TRUE.h[3], TR_AQ = RHO_AQ * H_AQ;
const TOP_AQ = TRUE.h.slice(0, 3).reduce((a, b) => a + b, 0);
const S_OVER = TRUE.h.slice(0, 3).reduce((s, h, i) => s + h / TRUE.rho[i], 0);
const S_SECTION = TRUE.h.reduce((s, h, i) => s + h / TRUE.rho[i], 0);

// Three rivals: no aquifer at all, and two aquifers with the same resistivity-thickness product.
const RIVALS = [
  { key: 'none', name: 'No aquifer', model: { rho: [150, 60, RHO_OVER, 3000], h: [1.5, 6, 52] } },
  { key: 'thin', name: '470 Ω·m × 26.1 m', model: { rho: [150, 60, RHO_OVER, 2 * RHO_AQ, 3000], h: [1.5, 6, 52, H_AQ / 2] } },
  { key: 'thick', name: '117 Ω·m × 104 m', model: { rho: [150, 60, RHO_OVER, RHO_AQ / 2, 3000], h: [1.5, 6, 52, H_AQ * 2] } },
];

// --- A sounding like the paper's: Schlumberger, AB/2 from 1 to 200 m ---------------------------------------
const AB = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 13, 15, 20, 25, 30, 40, 50, 60, 80, 100, 130, 150, 180, 200];
const mn = (s) => (s <= 15 ? 0.5 : s <= 100 ? 5 : 20);
let seed = 883; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const NOISE = 0.03; // 3 % lognormal scatter: OUR ASSUMPTION (the paper reports no misfit)
const short = AB.map((s) => ({ s, l: mn(s), rhoa: +(schlumberger(s, mn(s), TRUE) * Math.exp(NOISE * gauss())).toFixed(2) }));

// How far apart are the rivals inside the paper's spread?
const diff = RIVALS.map((r) => ({
  key: r.key, name: r.name,
  worst: +(100 * Math.max(...AB.map((s) => Math.abs(schlumberger(s, mn(s), r.model) / schlumberger(s, mn(s), TRUE) - 1)))).toFixed(1),
  at2000: +(100 * Math.abs(schlumbergerIdeal(2000, r.model) / schlumbergerIdeal(2000, TRUE) - 1)).toFixed(1),
}));

// --- Inversions of the simulated 200 m sounding ------------------------------------------------------------
const withExtras = (r) => ({
  rho: r.model.rho.map((v) => +v.toPrecision(4)), h: r.model.h.map((v) => +v.toPrecision(4)),
  seRho: r.seRho.map((v) => (Number.isFinite(v) && v < 1e4 ? +v.toFixed(2) : 'huge')),
  seH: r.seH.map((v) => (Number.isFinite(v) && v < 1e4 ? +v.toFixed(2) : 'huge')),
  rms: +(r.rms * 100).toFixed(2), iter: r.iterations,
  S: +r.model.h.reduce((s, h, i) => s + h / r.model.rho[i], 0).toFixed(3),
});
const fit4 = invert('schlumberger', short, startModel(short, 4));
const fit5 = invert('schlumberger', short, { rho: [150, 60, 9, 235, 3000], h: [1.5, 6, 52, 52.2] }); // started at the truth
const out4 = withExtras(fit4), out5 = withExtras(fit5);
out5.tr = Math.round(fit5.model.rho[3] * fit5.model.h[3]);

// --- Figure 1: the curves -----------------------------------------------------------------------------------
const xs = Array.from({ length: 121 }, (_, i) => 1 * 2000 ** (i / 120));
const fig1 = chart({
  title: 'The aquifer barely changes the curve', xLabel: 'AB/2 (m)', yLabel: 'Apparent resistivity (Ω·m)',
  xFmt: (v) => (10 ** v >= 1000 ? (10 ** v / 1000).toFixed(0) + 'k' : String(Math.round(10 ** v))),
  yFmt: (v) => String(Math.round(10 ** v)),
  series: [
    { name: '235 Ω·m × 52.2 m', kind: 'line', x: xs.map(Math.log10), y: xs.map((s) => Math.log10(schlumbergerIdeal(s, TRUE))), colour: 'var(--ink)' },
    ...RIVALS.map((r) => ({ name: r.name, kind: 'line', x: xs.map(Math.log10), y: xs.map((s) => Math.log10(schlumbergerIdeal(s, r.model))), dash: r.key === 'none' ? '2 3' : '5 4' })),
    { name: '', noLegend: true, kind: 'dots', x: short.map((d) => Math.log10(d.s)), y: short.map((d) => Math.log10(d.rhoa)), size: 2.6, colour: 'var(--muted)' },
  ],
  vlines: [{ x: Math.log10(200), text: 'AB/2 = 200 m', left: true }],
  desc: 'Sounding curves for our five-layer section, for the same section with no aquifer, and for two aquifers with the same resistivity-thickness product. All four lie together out to AB/2 of 200 m.',
  height: 300,
});

// --- Figure 2: the difference, against the noise -------------------------------------------------------------
const xd = Array.from({ length: 81 }, (_, i) => 1 * 2000 ** (i / 80));
const fig2 = chart({
  title: 'How much each rival changes the reading', xLabel: 'AB/2 (m)', yLabel: 'Difference from our section (%)',
  xFmt: (v) => (10 ** v >= 1000 ? (10 ** v / 1000).toFixed(0) + 'k' : String(Math.round(10 ** v))),
  series: RIVALS.map((r) => ({ name: r.name, kind: 'line', x: xd.map(Math.log10), y: xd.map((s) => 100 * (schlumbergerIdeal(s, r.model) / schlumbergerIdeal(s, TRUE) - 1)), dash: r.key === 'none' ? '2 3' : undefined })),
  hlines: [{ y: 3, text: '3 % noise' }, { y: -3, text: '' }],
  vlines: [{ x: Math.log10(200), text: '200 m', left: true }],
  yDomain: [-25, 45],
  desc: 'Percentage difference in apparent resistivity between each rival model and our section, against AB/2. Inside 200 m every difference is about the size of 3 per cent field noise.',
  height: 280,
});

console.log(JSON.stringify({
  checks: Object.fromEntries(Object.entries(checks).map(([k, v]) => [k, +v.toPrecision(5)])),
  section: { rho: TRUE.rho, h: TRUE.h, TR_AQ, S_OVER: +S_OVER.toFixed(3), S_SECTION: +S_SECTION.toFixed(3), TOP_AQ, BASE_AQ: TOP_AQ + H_AQ },
  diff, fit4: out4, fit5: out5,
  readings: short.map((d) => `${d.s} ${d.l} ${d.rhoa}`),
  rhoaAt: [50, 100, 200].map((s) => [s, +schlumberger(s, mn(s), TRUE).toFixed(2)]),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. Schlumberger sounding curves for our five-layer section (solid), for the same section with the aquifer taken out (dotted), and for two aquifers with the same resistivity-thickness product of 12,267 Ω·m² (dashed). Grey dots: one simulated sounding with 3 per cent noise. Simulated, not the paper\'s data.'));
  md = inject(md, 'diff', figure(fig2, 'Figure 2. The same four models as a percentage difference from our section. Out to AB/2 = 200 m, the paper\'s spread, each difference stays near the 3 per cent noise level; the curves part company only beyond 400 m.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
