// Figures for src/blog/discoveries/josephson-quantum-hall-current-standard-constants-check.md, made with the values of the
// Physical constants tool (src/lib/sci/phconstants.ts: h, e, K_J, R_K, flux quantum, conductance quantum, CODATA 2022 edition).
// Run: node scripts/blog-figures/josephson-quantum-hall-current-standard-constants-check.mjs
import fs from 'node:fs';
import * as C from '../../src/lib/sci/phconstants.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/josephson-quantum-hall-current-standard-constants-check.md', import.meta.url);
const ED = '2022';
const g = (sym, unit) => { const c = C.CONSTANTS.find((k) => k.sym === sym && (!unit || k.unit === unit)); if (!c) throw new Error(sym); return C.value(c, ED); };
const h = g('h', 'J Hz⁻¹'), e = g('e'), KJtool = g('K_J'), RKtool = g('R_K'), phi0 = g('Φ₀'), G0 = g('G₀');

// Paper (Landim and Sousa 2025): K_J printed as 483 597 848.416 984 GHz/V, R_K printed as 25 812.807 459 3045 ohm, drive about 75 GHz (PTB) or 20 GHz (NIST),
// PJVS limit 10 V, winding numbers N_H = 16 and N_S = 2065, standard resistors 10 ohm, 100 ohm and 10 kohm, ranges 200 uA, 2.2 mA, 22 mA.
const PAPER = { KJ_GHz: 483597848.416984, RK: 25812.8074593045, NH: 16, NS: 2065, f1: 20e9, f2: 75e9 };
const KJ = 2 * e / h; // exact, Hz per volt
const RK = h / (e * e); // exact, ohm
const R = (i) => (RK / i) * (PAPER.NH / PAPER.NS); // standard resistor reached from the i-th Hall plateau through the current comparator

// One Josephson step per junction.
const vStep = (f, n = 1) => (n * f) / KJ; // volts
const junctions = (V, f, n = 1) => V / vStep(f, n);
const current = (V, Rr) => V / Rr;

// Figure 1: junctions needed against drive frequency.
const fs_ = Array.from({ length: 41 }, (_, i) => 10 + (i * 90) / 40);
const fig1 = chart({
  title: 'Junctions needed for a Josephson voltage', xLabel: 'Drive frequency (GHz)', yLabel: 'Junctions (thousands, first step)',
  series: [
    { name: '10 V', kind: 'line', x: fs_, y: fs_.map((f) => +(junctions(10, f * 1e9) / 1e3).toFixed(2)) },
    { name: '1 V', kind: 'line', x: fs_, y: fs_.map((f) => +(junctions(1, f * 1e9) / 1e3).toFixed(2)) },
  ],
  xDomain: [10, 100], yDomain: [0, 500], vlines: [{ x: 20, text: '20 GHz (NIST)' }, { x: 75, text: '75 GHz (PTB)', left: true }],
  desc: `Number of Josephson junctions (first step) needed to make 1 V and 10 V against the microwave frequency, from V = n f / K_J with K_J = 2e/h = ${(KJ / 1e9).toFixed(6)} GHz per volt. At 20 GHz 10 V needs ${Math.round(junctions(10, 20e9)).toLocaleString('en')} junctions.`,
  height: 290,
});

// Figure 2: standard resistor reached from each Hall plateau with the 2065:16 comparator.
const idx = [1, 2, 3, 4, 5, 6, 8];
const fig2 = chart({
  title: 'Resistor reached from each Hall plateau', xLabel: 'Hall plateau index i', yLabel: 'Resistance (Ω)',
  series: [{ name: 'R_K / i × 16 / 2065', kind: 'dots', x: idx, y: idx.map((i) => +R(i).toFixed(4)), size: 4.5 }],
  xDomain: [0.5, 8.5], yDomain: [0, 220], xTicks: [1, 2, 3, 4, 5, 6, 7, 8], hlines: [{ y: 100, text: '100 Ω' }],
  desc: `The resistance obtained by dividing R_K / i by the comparator ratio 2065 to 16 for each plateau i. Plateau 2 gives ${R(2).toFixed(4)} ohm, close to the 100 ohm standard resistor the paper uses.`,
  height: 280,
});

const f = (v, d) => +v.toFixed(d);
const out = {
  KJ_exact_Hz_per_V: KJ, KJ_GHz_per_V: f(KJ / 1e9, 6), KJtool_GHz: KJtool / 1e9, KJ_vs_tool_rel: (KJtool / KJ - 1).toExponential(2),
  paper_vs_exact_factor: PAPER.KJ_GHz / (KJ / 1e9),
  RK_exact: RK, RK_tool: RKtool, RK_vs_tool_rel: (RKtool / RK - 1).toExponential(2), RK_vs_paper_rel: (PAPER.RK / RK - 1).toExponential(2),
  RK_10sig: +RK.toPrecision(10),
  phi0_check: (h / (2 * e)) / phi0 - 1, G0_check: (2 * e * e / h) / G0 - 1, KJ_times_RK: KJ * RK, KJ_times_RK_expected: 2 / e,
  vStep20_uV: f(vStep(20e9) * 1e6, 4), vStep75_uV: f(vStep(75e9) * 1e6, 4),
  junc10V_20: Math.round(junctions(10, 20e9)), junc10V_75: Math.round(junctions(10, 75e9)), junc1V_20: Math.round(junctions(1, 20e9)), junc1V_75: Math.round(junctions(1, 75e9)),
  ratio: PAPER.NS / PAPER.NH, R1: f(R(1), 4), R2: f(R(2), 5), R3: f(R(3), 4), R4: f(R(4), 4), R2_ppm: f((R(2) / 100 - 1) * 1e6, 2),
  RH2: f(RK / 2, 4), RH4: f(RK / 4, 4),
  I_step20_uA: f(current(vStep(20e9), R(2)) * 1e6, 5), I_formula_uA: f((2 * 20e9 * e * PAPER.NS) / (2 * PAPER.NH) * 1e6, 5),
  V_for_range: { '100uA@10k': current(1, 1) && 100e-6 * 1e4, '2mA@100': 2e-3 * 100, '10mA@10': 10e-3 * 10 },
  junc_for_1V_20GHz: Math.round(junctions(1, 20e9)), junc_for_0p2V_20: Math.round(junctions(0.2, 20e9)), junc_for_0p1V_20: Math.round(junctions(0.1, 20e9)),
  tenKohm_100uA_V: 1,
  f_for_1uApA_ppm: 1,
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'junctions', figure(fig1, 'Figure 1. How many Josephson junctions (one voltage step each) make 1 V or 10 V, against the drive frequency, from V = f/K_J with the exact K_J = 2e/h. The dashed lines mark the two drive frequencies the paper mentions.'));
  md = inject(md, 'plateau', figure(fig2, 'Figure 2. The resistance reached when a quantum Hall plateau of index i is divided down by the comparator ratio 16:2065 (the winding numbers the paper quotes). The paper does not state the plateau; our reading is i = 2.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
