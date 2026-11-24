// Figures for src/blog/discoveries/screen-printed-carbon-electrodes-uric-acid-randles-sevcik-electroactive-area.md,
// made with the maths of the Cyclic voltammetry analyser (src/lib/sci/cv.ts: Randles–Sevcik, digital simulation of a
// reversible couple, peak analysis, scan-rate study).
// Run: node scripts/blog-figures/screen-printed-carbon-electrodes-uric-acid-randles-sevcik-electroactive-area.mjs
import fs from 'node:fs';
import { randlesSevcik, rsConstant, simulateCV, analyseCV, scanRateStudy, reversibleDeltaEp } from '../../src/lib/sci/cv.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/screen-printed-carbon-electrodes-uric-acid-randles-sevcik-electroactive-area.md', import.meta.url);

// Inputs from the paper: Chelmea et al. (2026), Applied Sciences 16(20): 10077, doi:10.3390/app162010077 (CC BY).
// 4 mm carbon working electrode (geometric area about 0.126 cm²), 5 mM ferri/ferrocyanide in 0.1 M KCl, n = 1,
// D = 6.70e-6 cm²/s, T = 298 K, ten scan rates 0.01 to 0.10 V/s; reported anodic/cathodic values 6728.8/6292.2 µA
// (DRP-110) and 6433.4/5901.4 µA (DRP-150); electroactive areas about 1.87 and 1.77 cm² (roughness 14.9 and 14.1).
const T = 298, D = 6.7e-6, C = 0.005, n = 1, AGEO = Math.PI * 0.2 ** 2;
const E = [{ id: 'DRP-110', ia: 6728.8, ic: 6292.2, Apaper: 1.87 }, { id: 'DRP-150', ia: 6433.4, ic: 5901.4, Apaper: 1.77 }];
const V = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1];

const perArea = (v) => randlesSevcik(n, 1, D, C, v, T); // A per cm²
const ipGeo = (v) => AGEO * perArea(v) * 1e6; // µA
const rows = E.map((e) => {
  const mean = (e.ia + e.ic) / 2;
  return {
    id: e.id, mean,
    areaIfSlope: (mean * 1e-6) / perArea(1),        // reading the values as ip/√v slopes, µA (V/s)^-½
    areaIfSlopeAnodic: (e.ia * 1e-6) / perArea(1),
    areaIfCurrent50: (mean * 1e-6) / perArea(0.05),  // reading them as currents at 50 mV/s
    rough: ((mean * 1e-6) / perArea(1)) / AGEO,
    ipAtArea: (v) => e.Apaper * perArea(v) * 1e6,
  };
});

// Simulated voltammograms (our assumption: a fully reversible one-electron couple, E0 = 0.20 V, from 0 to 0.45 V and back)
// for the geometric area and for the paper's DRP-110 electroactive area, at 50 mV/s.
const sim = (A, v) => simulateCV({ E0: 0.2, Ei: -0.05, Es: 0.45, v, n, A, C, D, T, points: 300 });
const sGeo = sim(AGEO, 0.05), sEa = sim(1.87, 0.05);
const aGeo = analyseCV(sGeo.E, sGeo.I), aEa = analyseCV(sEa.E, sEa.I);
// Scan-rate study on simulated peaks for the geometric area: the tool should give back D.
const simPeaks = V.map((v) => { const s = sim(AGEO, v); return analyseCV(s.E, s.I).forward.I; });
const study = scanRateStudy(V, simPeaks, n, AGEO, C, T);

const thin = (s) => ({ x: s.E.filter((_, i) => i % 3 === 0).map((x) => +x.toFixed(4)), y: s.I.filter((_, i) => i % 3 === 0) });
const g = thin(sGeo), ea = thin(sEa);
const fig1 = chart({
  title: 'Same solution, two areas: simulated CVs at 50 mV/s', xLabel: 'Potential (V; E⁰ placed at 0.20 V)', yLabel: 'Current (µA)',
  series: [
    { name: 'Geometric 0.126 cm²', kind: 'line', x: g.x, y: g.y.map((i) => +(i * 1e6).toFixed(1)) },
    { name: 'Paper\'s 1.87 cm²', kind: 'line', x: ea.x, y: ea.y.map((i) => +(i * 1e6).toFixed(1)) },
  ],
  xDomain: [-0.05, 0.45], yDomain: [-1200, 1600], hlines: [{ y: 0, text: '' }],
  desc: `Simulated reversible voltammograms for 5 mM, D 6.7e-6 cm2/s at 50 mV/s. The 0.126 cm2 electrode peaks at ${(aGeo.forward.I * 1e6).toFixed(0)} µA; an electrode of 1.87 cm2 peaks at ${(aEa.forward.I * 1e6).toFixed(0)} µA.`, height: 280,
});
const sq = V.map(Math.sqrt);
const fig2 = chart({
  title: 'Randles–Sevcik: peak current against √(scan rate)', xLabel: '√v ((V/s)^½)', yLabel: 'Peak current (µA)',
  series: [
    { name: 'Geometric area', kind: 'line', x: sq, y: V.map((v) => +ipGeo(v).toFixed(1)) },
    { name: 'Electroactive 1.87 cm²', kind: 'line', x: sq, y: V.map((v) => +rows[0].ipAtArea(v).toFixed(1)) },
    { name: 'Simulated peaks', kind: 'dots', x: sq, y: simPeaks.map((i) => +(i * 1e6).toFixed(1)), colour: 'var(--ink)', size: 3 },
  ],
  xDomain: [0, 0.33], yDomain: [0, 2200],
  desc: `Peak current against the square root of scan rate for 5 mM ferricyanide. The 0.126 cm2 electrode gives ${ipGeo(0.1).toFixed(0)} µA at 100 mV/s; the paper's 1.87 cm2 gives ${rows[0].ipAtArea(0.1).toFixed(0)} µA. Simulated peaks fall on the geometric line.`, height: 270,
});

console.log(JSON.stringify({
  AGEO: +AGEO.toFixed(4), k298: +rsConstant(T).toExponential(4), perAreaAt1: +(perArea(1) * 1e6).toFixed(1),
  ipGeo: V.map((v) => +ipGeo(v).toFixed(1)),
  rows: rows.map((r) => ({ id: r.id, mean: +r.mean.toFixed(1), areaIfSlope: +r.areaIfSlope.toFixed(3), areaIfSlopeAnodic: +r.areaIfSlopeAnodic.toFixed(3), rough: +r.rough.toFixed(1), areaIfCurrent50: +r.areaIfCurrent50.toFixed(2), ip50: +r.ipAtArea(0.05).toFixed(0), ip10: +r.ipAtArea(0.01).toFixed(0), ip100: +r.ipAtArea(0.1).toFixed(0) })),
  simGeo: { ipa: +(aGeo.forward.I * 1e6).toFixed(1), dEp: +(aGeo.dEp * 1000).toFixed(1), ratio: aGeo.ratio && +aGeo.ratio.toFixed(3) }, simEa: { ipa: +(aEa.forward.I * 1e6).toFixed(1) },
  revDEp: +(reversibleDeltaEp(1, T) * 1000).toFixed(1),
  study: { slope: +(study.sqrtFit.slope * 1e6).toFixed(2), r2: +study.sqrtFit.r2.toFixed(5), D: +study.D.toExponential(3), logSlope: +study.logFit.slope.toFixed(3) },
}));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cv', figure(fig1, 'Figure 1. Digital simulations of a reversible one-electron couple (5 mM, D = 6.7 × 10⁻⁶ cm²/s, 50 mV/s) with the Cyclic voltammetry analyser\'s maths, for the 4 mm electrode\'s geometric area and for the electroactive area the paper reports. The shapes are our assumption of ideal behaviour; they are not the paper\'s measured curves.'));
  md = inject(md, 'rs', figure(fig2, 'Figure 2. Randles–Sevcik lines for the geometric and the reported electroactive area over the paper\'s ten scan rates, with the simulated peak currents for the geometric area (dots). Recomputed, not measured.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
