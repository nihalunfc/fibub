// Figures for src/blog/discoveries/rhodiola-rosea-hplc-uv-salidroside-rosavin-lod-loq.md, made with the maths of
// the Calibration curve tool (src/lib/sci/calibration.ts: straight-line fit, weighting, read-back, LOD and LOQ).
// Run: node scripts/blog-figures/rhodiola-rosea-hplc-uv-salidroside-rosavin-lod-loq.mjs  (rewrites the charts)
import fs from 'node:fs';
import { calibrate, inverse, limits } from '../../src/lib/sci/calibration.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/rhodiola-rosea-hplc-uv-salidroside-rosavin-lod-loq.md', import.meta.url);

// Inputs. "Paper": Stabl et al. (2026), Molecules 31: 3734 (CC BY 4.0), Results: LOD and LOQ (µg/mL) and R² per
// compound, working range 2.5 to 200 µg/mL, limits from standards at 0.01 to 0.5 µg/mL in triplicate.
const PAPER = { Salidroside: [0.164, 0.497, 0.9908], Tyrosol: [0.100, 0.302, 0.9990], Rosarin: [0.158, 0.477, 1.0000], Rosavin: [0.049, 0.148, 0.9977], Rosin: [0.063, 0.189, 0.9995] };

// 1. LOQ / LOD for each compound. With LOD = 3.3 s/m and LOQ = 10 s/m the ratio must be 10 / 3.3 = 3.03.
const ratios = Object.fromEntries(Object.entries(PAPER).map(([k, [lod, loq]]) => [k, +(loq / lod).toFixed(2)]));

// 2. SIMULATED wide-range calibration like the paper's 2.5 to 200 µg/mL. Our assumptions: 7 levels (2.5, 5, 10,
// 25, 50, 100, 200), slope 10 area units per µg/mL, no true intercept, scatter of 2% of the signal (grows with
// concentration, as is common in HPLC-UV). Fixed pseudo-random noise so the numbers repeat.
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const LV = [2.5, 5, 10, 25, 50, 100, 200], SLOPE = 10;
const xs = [], ys = [];
for (const x of LV) for (let k = 0; k < 3; k++) { xs.push(x); ys.push(+(SLOPE * x * (1 + 0.02 * gauss())).toFixed(2)); }
const cu = calibrate(xs, ys, 'none'), cw = calibrate(xs, ys, '1/x2');
const backErr = (c) => LV.map((x) => { const i = xs.map((v, j) => (v === x ? j : -1)).filter((j) => j >= 0); return 100 * (inverse(c, i.map((j) => ys[j])).x0 - x) / x; });
const eu = backErr(cu), ew = backErr(cw);
const lx = LV.map((x) => +Math.log10(x).toFixed(4));
const fig1 = chart({
  title: 'Back-calculated standards: unweighted vs 1/x² (simulated)', xLabel: 'Concentration (µg/mL, log scale)', yLabel: 'Error of read-back (%)',
  series: [
    { name: 'No weighting', kind: 'line', x: lx, y: eu.map((v) => +v.toFixed(2)) }, { name: '', kind: 'dots', x: lx, y: eu.map((v) => +v.toFixed(2)), noLegend: true, colour: 'var(--c-blog)' },
    { name: '1/x² weighting', kind: 'line', x: lx, y: ew.map((v) => +v.toFixed(2)), colour: 'var(--c-tools)' }, { name: '', kind: 'dots', x: lx, y: ew.map((v) => +v.toFixed(2)), noLegend: true, colour: 'var(--c-tools)' },
  ],
  yDomain: [-20, 20], xTicks: LV.map((x) => Math.log10(x)), xFmt: (t) => String(+(10 ** t).toPrecision(2)), hlines: [{ y: 0, text: '' }, { y: 15, text: '±15%' }, { y: -15, text: '' }],
  desc: 'On a simulated 2.5 to 200 µg/mL calibration with 2% scatter, the unweighted line reads the lowest standard back with a large error; the 1/x² weighted line keeps every level within a few per cent.', height: 300,
});
const limU = limits(cu), limW = limits(cw);

// 3. SIMULATED low-level standards like the paper's limit study: 0.01, 0.05, 0.1, 0.25, 0.5 µg/mL in triplicate.
// Our assumption: constant noise of 0.5 area units (chosen so the LOD lands near salidroside's 0.164 µg/mL).
const LL = [0.01, 0.05, 0.1, 0.25, 0.5], lxs = [], lys = [];
for (const x of LL) for (let k = 0; k < 3; k++) { lxs.push(x); lys.push(+(SLOPE * x + 0.5 * gauss()).toFixed(3)); }
const cl = calibrate(lxs, lys, 'none');
const limR = limits(cl, 'residual'), limI = limits(cl, 'intercept');
const lineX = [0, 0.5];
const fig2 = chart({
  title: 'Low-level standards and the limits (simulated)', xLabel: 'Concentration (µg/mL)', yLabel: 'Peak area (arbitrary units)',
  series: [
    { name: 'Standards', kind: 'dots', x: lxs, y: lys, size: 3 },
    { name: 'Fitted line', kind: 'line', x: lineX, y: lineX.map((x) => +(cl.intercept + cl.slope * x).toFixed(3)), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 0.52], vlines: [{ x: limR.lod, text: `LOD ${limR.lod.toFixed(2)}`, left: true }, { x: limR.loq, text: `LOQ ${limR.loq.toFixed(2)}`, left: true }],
  desc: `Fifteen simulated low-level standards; the fitted line's residual standard deviation gives an LOD of ${limR.lod.toFixed(3)} and an LOQ of ${limR.loq.toFixed(3)} µg/mL.`, height: 300,
});

const facts = {
  ratios,
  wide: { r2: cu.r2.toFixed(5), slope: cu.slope.toFixed(4), intercept: cu.intercept.toFixed(3), syx: cu.syx.toFixed(3), lodU: limU.lod.toFixed(2), loqU: limU.loq.toFixed(2), eu: eu.map((v) => v.toFixed(1)), ew: ew.map((v) => v.toFixed(1)), r2w: cw.r2.toFixed(5) },
  low: { slope: cl.slope.toFixed(3), intercept: cl.intercept.toFixed(3), r2: cl.r2.toFixed(4), syx: cl.syx.toFixed(3), lodRes: limR.lod.toFixed(3), loqRes: limR.loq.toFixed(3), lodInt: limI.lod.toFixed(3), loqInt: limI.loq.toFixed(3) },
  lowData: lxs.map((x, i) => `${x}\t${lys[i]}`).join('\n'),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'weights', figure(fig1, 'Figure 1. Read-back error of each standard on a simulated 2.5 to 200 µg/mL calibration with 2% scatter, fitted with the Calibration curve tool\'s maths without weighting and with 1/x² weighting. Simulated, not the paper\'s data.'));
  md = inject(md, 'limits', figure(fig2, 'Figure 2. Simulated low-level standards (0.01 to 0.5 µg/mL, triplicates) with the line, LOD and LOQ from the Calibration curve tool\'s maths. Simulated, not the paper\'s data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
