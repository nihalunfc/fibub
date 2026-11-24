// Figures for src/blog/discoveries/dual-rotating-retarder-tilt-retardance-mueller-polarimetry.md, made with the
// maths of the Polarisation calculator (src/lib/sci/phpol.ts: Jones matrices of polarisers and retarders, their
// Mueller matrices and the Stokes chain). The 16-element least squares and the retardance read-out are written here.
// Run: node scripts/blog-figures/dual-rotating-retarder-tilt-retardance-mueller-polarimetry.mjs
import fs from 'node:fs';
import { parseElements, propagate, systemMueller, muellerOf, jRetarder } from '../../src/lib/sci/phpol.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/dual-rotating-retarder-tilt-retardance-mueller-polarimetry.md', import.meta.url);

// From the paper: Deng, Zeng, Deng, Liu, Ma, He and He (2025), Photonics 12(9): 868, doi:10.3390/photonics12090868
// (CC BY). A dual-rotating-retarder Mueller polarimeter: a fixed polariser, a quarter-wave plate, the sample, a
// second quarter-wave plate turning at five times the first one's angle, and a fixed analyser; 30 intensity images
// per measurement at 528 nm. Sample retardances: about 1.1 to 1.9 rad for the tape phantom, a mean of 0.2418 rad
// for intestinal tissue boundaries at no tilt and 0.2621 rad at 10 degrees, an average relative error of 0.0841 at
// 10 degrees, and a calculated optical-path increment of about 0.027 at 16 degrees with n = 1.5.
const DEG = 180 / Math.PI;
const STEPS = Array.from({ length: 30 }, (_, k) => 6 * k); // the first plate's angle at each of the 30 steps
const D_TISSUE = 0.2418; // rad, the paper's mean tissue retardance
const AXIS = 30; // degrees, the sample's fast axis: OUR choice, nothing depends on it

// The instrument, built from the tool's own elements. The generator is what reaches the sample; the analyser row is
// the first row of the Mueller matrix of everything after it, because the camera measures S0.
const GEN = STEPS.map((th) => propagate([1, 0, 0, 0], parseElements(`polariser 0\nqwp ${th}`)).at(-1));
const ANA = STEPS.map((th) => systemMueller(parseElements(`qwp ${5 * th}\npolariser 90`))[0]);
const sampleM = (dRad, al = AXIS) => muellerOf(jRetarder(dRad * DEG, al));
const intensities = (M) => STEPS.map((_, k) => { let s = 0; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += ANA[k][i] * M[i][j] * GEN[k][j]; return s; });

// Least squares for the sample's 16 Mueller elements from the 30 intensities (normal equations, Gauss-Jordan).
function solveMueller(I) {
  const rows = STEPS.map((_, k) => { const r = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) r.push(ANA[k][i] * GEN[k][j]); return r; });
  const n = 16, A = Array.from({ length: n }, () => new Float64Array(n + 1));
  for (let p = 0; p < n; p++) {
    for (let q = 0; q < n; q++) { let s = 0; for (let k = 0; k < rows.length; k++) s += rows[k][p] * rows[k][q]; A[p][q] = s; }
    let b = 0; for (let k = 0; k < rows.length; k++) b += rows[k][p] * I[k]; A[p][n] = b;
  }
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < n; r++) { if (r === c) continue; const f = A[r][c] / A[c][c]; for (let q = c; q <= n; q++) A[r][q] -= f * A[c][q]; }
  }
  const x = []; for (let p = 0; p < n; p++) x.push(A[p][n] / A[p][p]);
  return [0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => x[i * 4 + j]));
}
// Retardance of a pure retarder: cos(delta) = trace(M)/2 - 1 (Lu and Chipman 1996).
const retardance = (M) => { const t = (M[0][0] + M[1][1] + M[2][2] + M[3][3]) / M[0][0]; return Math.acos(Math.max(-1, Math.min(1, t / 2 - 1))); };
// Beam drift: the spot moves over a detector with a gradient, once per revolution of the mount, so each step's
// intensity picks up a small gain. OUR model of the drift; the paper reports only fit residuals.
const withDrift = (I, g, phi = 0) => I.map((v, k) => v * (1 + g * Math.cos((STEPS[k] * Math.PI) / 180 + phi)));

const I0 = intensities(sampleM(D_TISSUE));
const I2 = withDrift(I0, 0.02);

const fig1 = figure(
  chart({
    title: 'The 30 intensity steps, clean and with a 2 % wobble',
    xLabel: 'Step (the first plate turns 6° each time)',
    yLabel: 'Intensity ÷ light going in',
    series: [
      { name: 'Clean instrument', x: STEPS.map((_, k) => k + 1), y: I0, kind: 'line' },
      { name: 'With a 2 % drift wobble', x: STEPS.map((_, k) => k + 1), y: I2, kind: 'line', dash: '4 3' },
    ],
    xDomain: [1, 30],
    yDomain: [0, 0.52],
    desc: 'The intensity through the polarimeter rises and falls six times across the 30 steps, between almost zero and 0.48 of the light going in. A 2 per cent drift wobble shifts the curve by an amount too small to see on this scale.',
  }),
  'Figure 1. The 30 intensities the Polarisation calculator’s maths gives for a sample of 0.2418 rad retardance, and the same sequence with a 2 % intensity wobble added once per revolution. The two curves are almost indistinguishable, which is the whole problem.',
);

const DS = [];
for (let d = 0.04; d <= 2.2; d += 0.02) DS.push(d);
const errFor = (g) => DS.map((d) => { const r = retardance(solveMueller(withDrift(intensities(sampleM(d)), g))); return (100 * (r - d)) / d; });

const fig2 = figure(
  chart({
    title: 'Retardance error from a drift wobble, by sample retardance',
    xLabel: 'True retardance of the sample (rad)',
    yLabel: 'Error in the recovered retardance (%)',
    series: [
      { name: '0.5 % wobble', x: DS, y: errFor(0.005), kind: 'line' },
      { name: '1 % wobble', x: DS, y: errFor(0.01), kind: 'line' },
      { name: '2 % wobble', x: DS, y: errFor(0.02), kind: 'line' },
    ],
    xDomain: [0, 2.2],
    yDomain: [-30, 2],
    bands: [{ x0: 1.1, x1: 1.9, text: 'tape phantom' }],
    vlines: [{ x: D_TISSUE, text: 'tissue 0.242 rad', dy: 2 }],
    hlines: [{ y: 0, text: '' }],
    desc: 'The error in the recovered retardance is large and negative for weakly birefringent samples and shrinks towards zero as the retardance rises. At 0.242 radians a 1 per cent wobble costs 5.8 per cent; across the tape phantom band from 1.1 to 1.9 radians the same wobble costs about 1 per cent or less.',
  }),
  'Figure 2. The same wobble costs a weakly birefringent sample far more than a strongly birefringent one. The paper’s tape phantom (shaded) sat where the error is about 1 %; its tissue boundaries sat at 0.242 rad, where the error is five to six times larger.',
);

// Numbers quoted in the article.
console.log(`Clean instrument: intensities run from ${Math.min(...I0).toFixed(5)} to ${Math.max(...I0).toFixed(5)} of the light going in.`);
console.log(`Recovered retardance with no error: ${retardance(solveMueller(I0)).toFixed(6)} rad against a true ${D_TISSUE} rad.`);
for (const g of [0.002, 0.005, 0.01, 0.02, 0.05]) {
  const r = retardance(solveMueller(withDrift(I0, g)));
  console.log(`  ${(g * 100).toFixed(1)} % wobble: ${r.toFixed(5)} rad, ${((100 * (r - D_TISSUE)) / D_TISSUE).toFixed(2)} % error`);
}
let lo = 0, hi = 0.2;
for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; ((100 * Math.abs(retardance(solveMueller(withDrift(I0, m))) - D_TISSUE)) / D_TISSUE < 8.41) ? (lo = m) : (hi = m); }
console.log(`Wobble that reproduces the paper's 8.4 % error at 0.2418 rad: ${(100 * (lo + hi) / 2).toFixed(2)} %.`);
for (const d of [1.1, 1.5, 1.9]) {
  const r = retardance(solveMueller(withDrift(intensities(sampleM(d)), (lo + hi) / 2)));
  console.log(`  the same wobble on a ${d} rad phantom: ${((100 * (r - d)) / d).toFixed(2)} % error`);
}
console.log(`Genuine tilt, read as a relative path increase of 0.027 at 16 deg and scaled as the square of the angle: ${(2.7 * (10 / 16) ** 2).toFixed(2)} % at 10 deg, ${(2.7 * (1 / 16) ** 2).toFixed(3)} % at 1 deg.`);
console.log('Single-step intensities for the article’s worked check (first plate at 0, 6, 12, 18, 24, 30 deg):');
for (const th of [0, 6, 12, 18, 24, 30]) {
  const s = propagate([1, 0, 0, 0], parseElements(`polariser 0\nqwp ${th}\nretarder ${(D_TISSUE * DEG).toFixed(4)} ${AXIS}\nqwp ${5 * th}\npolariser 90`)).at(-1);
  console.log(`  ${String(th).padStart(2)}deg: ${(s[0] * 100).toFixed(1)} % of the light going in`);
}

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'steps', fig1);
md = inject(md, 'errors', fig2);
fs.writeFileSync(ART, md);
console.log('Charts written into', ART.pathname);
