// Figures for src/blog/discoveries/rooftop-pv-medium-voltage-feeder-voltage-rise-load-flow.md, made with the maths
// of the Load flow tool (src/lib/sci/eng-loadflow.ts: Newton-Raphson power flow in per unit).
// Run: node scripts/blog-figures/rooftop-pv-medium-voltage-feeder-voltage-rise-load-flow.mjs
import fs from 'node:fs';
import { loadFlow } from '../../src/lib/sci/eng-loadflow.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/rooftop-pv-medium-voltage-feeder-voltage-rise-load-flow.md', import.meta.url);

// Inputs from the paper: Maghalseh, Iqteit, Alqadi and Ajib (2025), Solar 5(1): 1, doi:10.3390/solar5010001 (CC BY).
// 230 kWp PV (11 inverters of 21 kW) at Palestine Polytechnic University, about 200 kW at solar noon, 2900 m from
// the substation at the end of an 11 kV feeder, 14.7 % penetration, worst-case feeder voltage drop about 2.2 %,
// voltage at the point of common coupling up 0.51 %, real losses about 50 % lower at noon, reactive losses 23 %
// lower, power factor 0.87 at the main bus and 0.53 on the campus low-voltage side at peak generation.
// OUR assumptions: 11 kV and a 1 MVA base, the feeder as two equal 1.45 km sections with the rest of the load
// halfway and the campus at the end, the campus taking 0.40 MW of the feeder peak, every load at power factor
// 0.87, no line charging, and a cable reactance 0.4 times its resistance.
const BASE = 1, KV = 11, ZB = (KV * KV) / BASE;            // 121 ohm per unit
const PF = 0.87, TAN = Math.tan(Math.acos(PF));
const PVKW = 230, PVNOON = 0.200;                           // MW at solar noon
const PEAK = 0.230 / 0.147;                                 // MW: feeder peak load from the 14.7 % penetration
const CAMPUS = 0.40, REST = PEAK - CAMPUS, HALF = 1.45, XR = 0.4;

/** Three-bus radial feeder: substation (slack), the rest of the load halfway, the campus with its PV at the end. */
function net(rPerKm, scale, pv, round = false) {
  const R = round ? +((rPerKm * HALF) / ZB).toFixed(6) : (rPerKm * HALF) / ZB;
  const X = round ? +((XR * rPerKm * HALF) / ZB).toFixed(6) : (XR * rPerKm * HALF) / ZB;
  const buses = [
    { id: 'SUB', type: 'slack', Pd: 0, Qd: 0, Pg: 0, V: 1 },
    { id: 'MID', type: 'PQ', Pd: REST * scale, Qd: REST * scale * TAN, Pg: 0, V: 1 },
    { id: 'PCC', type: 'PQ', Pd: CAMPUS * scale, Qd: CAMPUS * scale * TAN, Pg: pv, V: 1 },
  ];
  const lines = [{ from: 'SUB', to: 'MID', R, X, B: 0 }, { from: 'MID', to: 'PCC', R, X, B: 0 }];
  return loadFlow(buses, lines, { base: BASE, method: 'nr', tol: 1e-10 });
}
const bisect = (f, lo, hi, want) => { for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; f(m) > want ? (hi = m) : (lo = m); } return (lo + hi) / 2; };

// Step 1: calibrate the cable resistance so the feeder's worst-case drop is the paper's 2.2 %.
const K = bisect((k) => 1 - net(k, 1, 0).buses[2].V, 0.01, 3, 0.022);
// Step 2: peak load, with and without the PV.
const A = net(K, 1, 0), B = net(K, 1, PVNOON);
const rise = (a, b, i) => (b.buses[i].V - a.buses[i].V) * 100;
// Step 3: the load at which 200 kW halves the real losses (the paper's noon measurement).
const SC = bisect((s) => net(K, s, PVNOON).lossP / net(K, s, 0).lossP, 0.05, 1, 0.5);  // loss ratio rises with load
const C = net(K, SC, 0), D = net(K, SC, PVNOON);
// Step 4: the resistance that would give the paper's 0.51 % rise, and the drop it implies.
const K2 = bisect((k) => rise(net(k, 1, 0), net(k, 1, PVNOON), 2), 0.1, 6, 0.51);
// Step 5: the campus load implied by a 0.53 power factor at peak generation (arithmetic, not load flow):
// (P − 200) / (P tanφ) = tan(acos(0.53))⁻¹ … solved directly.
const t53 = Math.tan(Math.acos(0.53));
const PCAMPUS = (PVNOON * 1000) / (1 - TAN / t53);

const DIST = [0, HALF, 2 * HALF];
const prof = (r) => r.buses.map((b) => +b.V.toFixed(5));
const fig1 = chart({
  title: 'Voltage along the 11 kV feeder', xLabel: 'Distance from the substation (km)', yLabel: 'Voltage (per unit)',
  series: [
    { name: 'peak load, no PV', kind: 'line', x: DIST, y: prof(A) },
    { name: 'peak load, 200 kW PV', kind: 'line', x: DIST, y: prof(B), dash: '5 3' },
    { name: 'noon load, no PV', kind: 'line', x: DIST, y: prof(C) },
    { name: 'noon load, 200 kW PV', kind: 'line', x: DIST, y: prof(D), dash: '5 3' },
  ],
  xDomain: [0, 2.9], yDomain: [0.974, 1.001], hlines: [{ y: 1, text: '' }],
  desc: 'Per-unit voltage at the substation, mid-feeder and the point of common coupling, with and without 200 kW of PV, at the feeder peak load and at the lighter load we infer for solar noon.',
  height: 290,
});

const LOADS = Array.from({ length: 41 }, (_, i) => 0.15 + (i * 0.85) / 40);
const fig2 = chart({
  title: 'What 200 kW of PV does to the feeder losses', xLabel: 'Feeder load (MW)', yLabel: 'Real loss reduction (%)',
  series: [{ name: '', noLegend: true, kind: 'line', x: LOADS.map((s) => +(PEAK * s).toFixed(3)), y: LOADS.map((s) => +((1 - net(K, s, PVNOON).lossP / net(K, s, 0).lossP) * 100).toFixed(2)) }],
  xDomain: [0.2, 1.6], yDomain: [10, 65],
  hlines: [{ y: 50, text: "the paper's noon measurement" }], vlines: [{ x: +(PEAK * SC).toFixed(2), text: `${(PEAK * SC).toFixed(2)} MW`, left: true }],
  desc: 'Real-loss reduction from a 200 kW injection at the end of the feeder, against the feeder load. The paper measures about 50 %, which the model reaches only at about a third of the peak load.',
  height: 280,
});

console.log(JSON.stringify({
  rPerKm: +K.toFixed(4), xPerKm: +(XR * K).toFixed(4), Rpu: +((K * HALF) / ZB).toFixed(6), Xpu: +((XR * K * HALF) / ZB).toFixed(6),
  peakLoad: +PEAK.toFixed(3), campus: CAMPUS, rest: +REST.toFixed(3), Qrest: +(REST * TAN).toFixed(4), Qcampus: +(CAMPUS * TAN).toFixed(4),
  peak: { noPv: prof(A), pv: prof(B), risePcc: +rise(A, B, 2).toFixed(3), riseMid: +rise(A, B, 1).toFixed(3), lossNo: +(A.lossP * 1000).toFixed(2), lossPv: +(B.lossP * 1000).toFixed(2), cut: +((1 - B.lossP / A.lossP) * 100).toFixed(1), iters: A.iterations },
  noon: { scale: +SC.toFixed(3), load: +(PEAK * SC).toFixed(3), pvShare: +((PVNOON / (PEAK * SC)) * 100).toFixed(0), noPv: prof(C), pv: prof(D), risePcc: +rise(C, D, 2).toFixed(3), lossNo: +(C.lossP * 1000).toFixed(2), lossPv: +(D.lossP * 1000).toFixed(2), qNo: +(C.lossQ * 1000).toFixed(2), qPv: +(D.lossQ * 1000).toFixed(2), qCut: +((1 - D.lossQ / C.lossQ) * 100).toFixed(1) },
  for051: { rPerKm: +K2.toFixed(3), impliedDrop: +((1 - net(K2, 1, 0).buses[2].V) * 100).toFixed(2) },
  campusFromPf: Math.round(PCAMPUS),
  rounded: (() => { const a = net(K, 1, 0, true), b = net(K, 1, PVNOON, true); return { noPv: prof(a), pv: prof(b), risePcc: +rise(a, b, 2).toFixed(3), lossNo: +(a.lossP * 1000).toFixed(2), lossPv: +(b.lossP * 1000).toFixed(2), iters: a.iterations, slackP: +(a.buses[0].P * 1000).toFixed(2) }; })(),
  pvkW: PVKW,
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'profile', figure(fig1, 'Figure 1. Voltage along the modelled feeder: the substation busbar, the rest of the load halfway out and the campus connection 2.9 km away, with and without 200 kW of PV. The cable resistance was tuned so the no-PV drop at the end is the paper’s 2.2 %; everything else is the Load flow tool’s Newton-Raphson solution.'));
  md = inject(md, 'losses', figure(fig2, 'Figure 2. Real-loss reduction from the same 200 kW injection as the feeder load changes. Losses fall as the square of the current, so the lighter the feeder, the larger the percentage saving.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
