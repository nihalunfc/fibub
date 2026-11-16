// Figures for src/blog/discoveries/westerly-granite-fault-transmissivity-pore-pressure-inversion.md, made with the
// maths of the Darcy flow calculator (src/lib/sci/darcy.ts: KFromk, kFromK, darcy, waterDensity, waterViscosity, DARCY).
// Run: node scripts/blog-figures/westerly-granite-fault-transmissivity-pore-pressure-inversion.mjs
//      (prints every number in the article and rewrites the two charts inside it)
import fs from 'node:fs';
import { KFromk, kFromK, darcy, waterDensity, waterViscosity, DARCY, G } from '../../src/lib/sci/darcy.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/westerly-granite-fault-transmissivity-pore-pressure-inversion.md', import.meta.url);

// Inputs. "Paper": Farsi, Aben and Brantut (2026), arXiv:2611.13272 (CC BY 4.0), abstract and methods text.
const D = 0.040, LEN = 0.100;             // sample diameter and length, m (paper)
const DP = 4.988e6;                        // pressure difference across the sample, Pa (paper)
const MU = 1e-3;                           // fluid viscosity used in the paper's model, Pa·s (paper)
const TW = 20;                             // water temperature, °C: OUR ASSUMPTION (the tool's viscosity at 20 °C is about 1.0 mPa·s, matching the paper's value)
const THICK = 0.010;                       // fault-zone thickness used in the inversion, m (paper)
const K0 = 1e-18;                          // bulk (off-fault) permeability in the model, m² (paper)
const KINTACT = 2.09e-20;                  // intact-rock calibration permeability, m² (paper)
const T_PEAK = 1.6e-19;                    // highest local transmissivity k·t, m³ (paper)
const T_FINAL = [6.85e-20, 1.55e-19];      // final-stage local range, m³ (paper)
// Sample-average transmissivity at four stages, slip in mm and k·t in m³ (paper's text).
const STAGES = [[0.06, 2.38e-20], [0.35, 7.93e-20], [0.90, 9.83e-20], [1.41, 1.05e-19]];
// Flow path along the fault between the notch tips: OUR ASSUMPTION. The fault plane cuts the 40 mm cylinder at 30°
// to its axis, so it is 40 / sin 30° = 80 mm long; two 15 mm notches (paper) leave about 50 mm of rock to break.
const LPATH = D / Math.sin(Math.PI / 6) - 2 * 0.015;
const WIDTH = D;                           // width of the fault strip carrying flow: OUR ASSUMPTION (the sample diameter)

const rho = waterDensity(TW), mu = waterViscosity(TW);
const head = DP / (rho * G);               // pressure difference as a head of water, m
const kf = (T) => T / THICK;               // fault-zone permeability, m²
// Flow through the whole intact cylinder (no fault), Darcy flow calculator maths.
const A_cyl = Math.PI * (D / 2) ** 2;
const bulk = (k) => darcy(KFromk(k, TW), head / LEN, A_cyl, 0.01).Q;
// Flow along the fault strip: area thickness × width, gradient head / path length.
const fault = (T) => darcy(KFromk(kf(T), TW), head / LPATH, THICK * WIDTH, 0.01).Q;
const uLmin = (Q) => Q * 1e9 * 60;         // m³/s to microlitres per minute

// Figure 1: fault-zone permeability against slip (log scale, plotted as log10).
const lg = (v) => Math.log10(v);
const fig1 = chart({
  title: 'Fault-zone permeability as the fault slips', xLabel: 'Slip on the fault (mm)', yLabel: 'Permeability (m², log scale)',
  series: [{ name: 'Fault zone (k·t ÷ 10 mm)', kind: 'line', x: STAGES.map((s) => s[0]), y: STAGES.map((s) => +lg(kf(s[1])).toFixed(3)) },
    { name: '', kind: 'dots', size: 4, x: STAGES.map((s) => s[0]), y: STAGES.map((s) => +lg(kf(s[1])).toFixed(3)), noLegend: true }],
  xDomain: [0, 1.5], yDomain: [-20, -16.5], yTicks: [-20, -19, -18, -17],
  yFmt: (t) => `1e${t}`,
  hlines: [{ y: lg(kf(T_PEAK)), text: 'Highest local value' }, { y: lg(K0), text: 'Bulk rock in the model' }, { y: lg(KINTACT), text: 'Intact rock, before failure' }],
  desc: 'Sample-average fault-zone permeability rises from about 2.4e-18 to 1.05e-17 square metres as slip grows from 0.06 to 1.41 mm, above the bulk rock value of 1e-18.', height: 290,
});

// Figure 2: flow along the fault strip against slip, beside flow through the whole cylinder at the bulk value.
const fig2 = chart({
  title: 'Water flow along the fault and through the rock', xLabel: 'Slip on the fault (mm)', yLabel: 'Flow (microlitres per minute)',
  series: [{ name: 'Along the fault strip', kind: 'line', x: STAGES.map((s) => s[0]), y: STAGES.map((s) => +uLmin(fault(s[1])).toFixed(3)) },
    { name: '', kind: 'dots', size: 4, x: STAGES.map((s) => s[0]), y: STAGES.map((s) => +uLmin(fault(s[1])).toFixed(3)), noLegend: true }],
  xDomain: [0, 1.5], yDomain: [0, 42],
  hlines: [{ y: uLmin(bulk(K0)), text: 'Whole cylinder at the bulk value' }, { y: uLmin(fault(T_PEAK)), text: 'Strip at the highest local value' }],
  desc: 'Calculated flow along a 40 mm wide fault strip rises from about 6 to 25 microlitres per minute with slip; the whole intact cylinder at the bulk permeability passes about 4.', height: 290,
});

const s = (v, n = 3) => Number(v.toPrecision(n));
const facts = {
  rho: s(rho, 5), mu_mPas: s(mu * 1000, 4), head_m: s(head, 4), LPATH_mm: s(LPATH * 1000), gradFault: s(head / LPATH), gradBulk: s(head / LEN),
  kf_peak: s(kf(T_PEAK)), kf_peak_microdarcy: s(kf(T_PEAK) / DARCY * 1e6), kf_final: T_FINAL.map((T) => s(kf(T))), K0_microdarcy: s(K0 / DARCY * 1e6),
  K_peak_ms: s(KFromk(kf(T_PEAK), TW)), K_bulk_ms: s(KFromk(K0, TW)), K_intact_ms: s(KFromk(KINTACT, TW)),
  K_peak_mday: s(KFromk(kf(T_PEAK), TW) * 86400), K_final_mean_ms: s(KFromk(kf(1.05e-19), TW)),
  back_k_from_K: s(kFromK(KFromk(kf(T_PEAK), TW), TW)),
  stages: STAGES.map(([sl, T]) => ({ slip: sl, kf: s(kf(T)), ratio: s(kf(T) / K0), Q_uLmin: s(uLmin(fault(T))) })),
  Q_bulk_uLmin: s(uLmin(bulk(K0))), Q_intact_uLmin: s(uLmin(bulk(KINTACT))), Q_peak_strip_uLmin: s(uLmin(fault(T_PEAK))),
  Q_final_m3day: s(fault(1.05e-19) * 86400), Q_final_Ls: s(fault(1.05e-19) * 1000),
  thicknessCheck: [0.005, 0.010, 0.015].map((t) => s(uLmin(darcy(KFromk(1.05e-19 / t, TW), head / LPATH, t * WIDTH, 0.01).Q))),
  growth: s(1.05e-19 / 2.38e-20), finalSpread: s(T_FINAL[1] / T_FINAL[0]), peakOverBulk: s(T_PEAK / (K0 * THICK)),
  muCheck_paperMu_vs_tool: s(MU / mu),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'perm', figure(fig1, 'Figure 1. Fault-zone permeability worked out from the paper\'s sample-average transmissivities (k·t) and its 10 mm fault-zone thickness, against slip. Log scale. The dashed lines are the paper\'s highest local value, its bulk rock value and the intact rock before failure.'));
  md = inject(md, 'flow', figure(fig2, 'Figure 2. Flow of water at 20 °C worked out with the Darcy flow calculator\'s maths for the paper\'s 4.988 MPa pressure difference: along a 40 mm wide, 10 mm thick fault strip 50 mm long (our assumed geometry), and through the whole 40 × 100 mm cylinder at the bulk permeability. A calculation, not the measured flow.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
