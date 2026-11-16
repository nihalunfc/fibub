// Figures for src/blog/discoveries/sildenafil-sulfur-nitrogen-graphene-sensor-dpv.md, made with the maths of the
// Calibration curve tool (src/lib/sci/calibration.ts) and the Cyclic voltammetry analyser (src/lib/sci/cv.ts).
// Run: node scripts/blog-figures/sildenafil-sulfur-nitrogen-graphene-sensor-dpv.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { calibrate, inverse, limits } from '../../src/lib/sci/calibration.ts';
import { scanRateStudy, laviron } from '../../src/lib/sci/cv.ts';
import { thermalV } from '../../src/lib/sci/nernst.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sildenafil-sulfur-nitrogen-graphene-sensor-dpv.md', import.meta.url);

// Inputs from the paper: Man et al. (2026), Beilstein J. Nanotechnol. 17, 1087-1102, doi:10.3762/bjnano.17.74 (CC BY 4.0).
const MEANS = [[1.0, 0.9585], [2.0, 1.699], [13.8, 7.98]];   // µM, µA: repeatability and reproducibility means
const LOD_FULL = 0.49, LOQ_FULL = 1.61, LOD_LOW = 0.24, LOQ_LOW = 0.78; // µM, 3S/b and 10S/b
const SAMPLE1 = { found: 4.07, spiked: 5.06, added: 1.0, recovery: 98.1 };
const LAV_SLOPE = 0.0312, PH_SLOPE = 0.0317, LOGLOG = 0.49;    // V per ln(v); V per pH; log ip vs log v

// Line through the paper's mean currents (our step): it fixes a realistic slope and intercept.
const base = calibrate(MEANS.map((m) => m[0]), MEANS.map((m) => m[1]));
// Simulated standards across the paper's full range (0.25 to 19.61 µM, our choice of 10 levels), with a fixed residual
// pattern scaled so that 3 s(y/x) / slope equals the paper's full-range LOD of 0.49 µM.
const X = [0.25, 0.5, 1, 2, 4, 6, 8, 12, 16, 19.61];
const pat = [0.6, -1.1, 0.4, 1.3, -0.8, -0.2, 1.0, -1.4, 0.3, -0.1];
const lodAt = (k) => limits(calibrate(X, X.map((x, i) => base.slope * x + base.intercept + pat[i] * k)), 'residual', 3).lod;
let scale = 0.05; for (let it = 0; it < 6; it++) scale *= LOD_FULL / lodAt(scale); // the LOD grows almost in step with the scatter
const Y = X.map((x, i) => +(base.slope * x + base.intercept + pat[i] * scale).toFixed(4));
const cal = calibrate(X, Y), L3 = limits(cal, 'residual', 3), L33 = limits(cal);
const unk = inverse(cal, [+(cal.slope * SAMPLE1.found + cal.intercept).toFixed(4)]);

// Scan-rate study, simulated over the paper's 0.07 to 0.40 V/s with its log-log slope and its Laviron slope.
const V = [0.07, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
const IP = V.map((v) => +(12 * (v / 0.2) ** LOGLOG).toFixed(3));           // µA; 12 µA at 0.2 V/s is our assumption
const EP = V.map((v) => +(0.95 + LAV_SLOPE * Math.log(v / 0.2)).toFixed(4)); // V; 0.95 V at 0.2 V/s is our assumption
const st = scanRateStudy(V, IP.map((i) => i * 1e-6)), lv = laviron(V, EP);
const nernstSlope = Math.LN10 * thermalV(298.15);                            // V per pH for equal protons and electrons

const facts = {
  base: { slope: +base.slope.toFixed(4), intercept: +base.intercept.toFixed(4), r2: +base.r2.toFixed(5) },
  cal: { slope: +cal.slope.toFixed(4), intercept: +cal.intercept.toFixed(4), syx: +cal.syx.toFixed(4), r2: +cal.r2.toFixed(5), lod3: +L3.lod.toFixed(3), lod33: +L33.lod.toFixed(3), loq: +L3.loq.toFixed(3) },
  ratios: { full: +(LOQ_FULL / LOD_FULL).toFixed(3), low: +(LOQ_LOW / LOD_LOW).toFixed(3) },
  unknown: { x0: +unk.x0.toFixed(3), lo: +unk.lo.toFixed(2), hi: +unk.hi.toFixed(2) },
  recovery: +(100 * (SAMPLE1.spiked - SAMPLE1.found) / SAMPLE1.added).toFixed(1),
  scan: { logSlope: +st.logFit.slope.toFixed(3), r2: +st.sqrtFit.r2.toFixed(4) },
  laviron: { alphaN: +lv.alphaN.toFixed(4), nIfHalf: +(lv.alphaN / 0.5).toFixed(2) },
  pH: { nernst: +(nernstSlope * 1000).toFixed(2), ratio: +(PH_SLOPE / nernstSlope).toFixed(3), protonsFor2e: +(2 * PH_SLOPE / nernstSlope).toFixed(2) },
};
console.log(JSON.stringify(facts));
console.log(X.map((x, i) => `${x}\t${Y[i]}`).join('\n'));

const xl = [0, 20];
const fig1 = chart({
  title: 'Simulated calibration with the paper\'s LOD built in', xLabel: 'Sildenafil (µM)', yLabel: 'DPV peak current (µA)',
  series: [
    { name: 'Simulated standards', kind: 'dots', x: X, y: Y, size: 3.5 },
    { name: 'Fitted line', kind: 'line', x: xl, y: xl.map((x) => +(cal.slope * x + cal.intercept).toFixed(3)) },
  ],
  vlines: [{ x: L3.lod, text: 'LOD', dy: 0 }, { x: L3.loq, text: 'LOQ', dy: 16 }],
  xDomain: [0, 20], yDomain: [0, 11.5], height: 260,
  desc: `Ten simulated standards from 0.25 to 19.61 µM on a line of slope ${cal.slope.toFixed(3)} µA per µM; the 3σ rule gives an LOD of ${L3.lod.toFixed(2)} µM and an LOQ of ${L3.loq.toFixed(2)} µM.`,
});
const lnv = V.map((v) => +Math.log(v).toFixed(3));
const fig2 = chart({
  title: 'Laviron plot: peak potential against ln(scan rate)', xLabel: 'ln(scan rate / (V/s))', yLabel: 'Peak potential (V)',
  series: [
    { name: 'Simulated peaks', kind: 'dots', x: lnv, y: EP, size: 3.5 },
    { name: `Fit: αn = ${lv.alphaN.toFixed(3)}`, kind: 'line', x: [lnv[0], lnv[lnv.length - 1]], y: [lnv[0], lnv[lnv.length - 1]].map((x) => +(lv.fit.intercept + lv.fit.slope * x).toFixed(4)) },
  ],
  xDomain: [-2.8, -0.8], yDomain: [0.88, 0.97], height: 240,
  desc: `A slope of 31.2 mV per unit of ln v gives αn = ${lv.alphaN.toFixed(3)}.`,
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cal', figure(fig1, 'Figure 1. A calibration simulated with the Calibration curve tool\'s maths: the line runs through the paper\'s mean currents at 1.0, 2.0 and 13.8 µM, and the scatter is sized to give its 0.49 µM detection limit. Not the paper\'s data.'));
  md = inject(md, 'lav', figure(fig2, 'Figure 2. Peak potentials simulated with the paper\'s Laviron slope over its 0.07 to 0.40 V/s range, fitted with the new Laviron step in the Cyclic voltammetry analyser. Not the measured peaks.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
