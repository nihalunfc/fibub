// Figures for src/blog/discoveries/marana-scmos-camera-master-frames-read-noise-dark-current.md, made with the
// maths of the Calibration frames tool (src/lib/sci/calframes.ts: combine(), exactStats(), demoSet()).
// Run: node scripts/blog-figures/marana-scmos-camera-master-frames-read-noise-dark-current.mjs
import fs from 'node:fs';
import { combine, calibrate, exactStats, flatness, demoSet } from '../../src/lib/sci/calframes.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/marana-scmos-camera-master-frames-read-noise-dark-current.md', import.meta.url);

// Camera numbers from Apergis et al. (2025), RAS Techniques and Instruments 4: rzaf049, doi:10.1093/rasti/rzaf049
// (CC BY 4.0), high dynamic range mode, sensor at -25 C. Everything below is OUR simulation of a camera with
// these properties, not the authors' frames.
const G = 1.131; // e-/ADU conversion gain
const RN_E = 1.571; // read noise, electrons (median of 100 bias frames)
const DSNU_E = 0.232; // offset fixed-pattern noise from the same bias frames, electrons
const BIAS_ADU = 100.48; // bias level
const DC_E = 1.617; // dark current, e-/pixel/s, anti-glow correction off
const FULLWELL_E = 69026, FULLWELL_ADU = 61031;
const RN = RN_E / G, DSNU = DSNU_E / G; // in ADU
const W = 240, H = 160, N = W * H;

// A reproducible normal deviate (mulberry32 plus Box-Muller, both outputs kept, so the article's numbers never move).
let seed = 20261124 >>> 0;
const u = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
let spare = null;
const g1 = () => { if (spare !== null) { const v = spare; spare = null; return v; } const r = Math.sqrt(-2 * Math.log(1 - u())), a = 2 * Math.PI * u(); spare = r * Math.sin(a); return r * Math.cos(a); };

// The camera's fixed marks: a per-pixel offset pattern (DSNU) and a per-pixel sensitivity (PRNU 0.131 %).
const offset = Float64Array.from({ length: N }, () => BIAS_ADU + DSNU * g1());
const sens = Float64Array.from({ length: N }, () => 1 + 0.00131 * g1());
const frame = (f) => { const p = new Float32Array(N); for (let i = 0; i < N; i++) p[i] = f(i); return { w: W, h: H, planes: [p] }; };
const biasFrame = () => frame((i) => offset[i] + RN * g1());
const darkFrame = (t) => frame((i) => offset[i] + (DC_E * t + Math.sqrt(DC_E * t) * g1()) / G + RN * g1());
const flatFrame = (sAdu) => frame((i) => { const e = sAdu * G * sens[i]; return offset[i] + (e + Math.sqrt(e) * g1()) / G + RN * g1(); });

// ---- 1. How the master bias settles as frames are stacked ----
const NS = [1, 2, 3, 5, 7, 10, 15, 20, 30, 40, 50, 70, 85, 100];
const pool = Array.from({ length: 100 }, biasFrame);
const METHODS = [{ id: 'mean', name: 'Mean', o: { method: 'mean' } }, { id: 'median', name: 'Median', o: { method: 'median' } }, { id: 'sigma', name: '3σ MAD clip', o: { method: 'sigma', kappa: 3, iters: 5 } }];
const settle = METHODS.map((m) => ({ ...m, sd: NS.map((n) => +exactStats(combine(pool.slice(0, n), m.o).frame.planes[0]).std.toFixed(4)) }));
const predicted = NS.map((n) => +Math.sqrt(DSNU * DSNU + (RN * RN) / n).toFixed(4));

// ---- 2. Read noise from one pair of bias frames: sigma(B1 - B2)/sqrt(2) ----
const diff = new Float64Array(N); for (let i = 0; i < N; i++) diff[i] = pool[0].planes[0][i] - pool[1].planes[0][i];
const rnPair = { adu: exactStats(diff).std / Math.SQRT2, mad: exactStats(diff).madSigma / Math.SQRT2 };

// ---- 3. Photon transfer curve: variance of a flat pair against its level, so the slope gives 1/gain ----
const levels = [200, 600, 1500, 3000, 6000, 10000, 16000, 24000, 34000, 45000, 55000];
const PAIRS = 4; // four independent pairs per level, so each variance is good to about 0.4 %
const ptc = levels.map((s) => {
  let sm = 0, sv = 0;
  for (let k = 0; k < PAIRS; k++) {
    const a = flatFrame(s), b = flatFrame(s), d = new Float64Array(N);
    for (let i = 0; i < N; i++) d[i] = a.planes[0][i] - b.planes[0][i];
    sm += (exactStats(a.planes[0]).mean + exactStats(b.planes[0]).mean) / 2 - BIAS_ADU;
    sv += exactStats(d).std ** 2 / 2;
  }
  return { mean: +(sm / PAIRS).toFixed(2), varHalf: +(sv / PAIRS).toFixed(3) };
});
// var = mean/g + sigma_read^2, with the read noise already measured from the bias pair, so only the slope is fitted.
const fit = (() => {
  const c = rnPair.adu ** 2;
  const sxx = ptc.reduce((a, p) => a + p.mean * p.mean, 0), sxy = ptc.reduce((a, p) => a + p.mean * (p.varHalf - c), 0);
  const slope = sxy / sxx;
  let ss = 0; for (const p of ptc) ss += (p.varHalf - c - slope * p.mean) ** 2;
  const se = Math.sqrt((ss / (ptc.length - 1)) / sxx);
  return { slope, gain: 1 / slope, gainSe: se / slope ** 2, readUsed: c };
})();

// ---- 4. Dark current from masters at several exposures ----
const mBias = combine(pool.slice(0, 100), { method: 'sigma', kappa: 3, iters: 5 }).frame;
const times = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const darkPts = times.map((t) => {
  const m = combine(Array.from({ length: 10 }, () => darkFrame(t)), { method: 'sigma', kappa: 3, iters: 5 }).frame;
  const d = new Float64Array(N); for (let i = 0; i < N; i++) d[i] = m.planes[0][i] - mBias.planes[0][i];
  return { t, levelE: +(exactStats(d).mean * G).toFixed(4) };
});
const dcFit = (() => {
  const n = darkPts.length, sx = darkPts.reduce((a, p) => a + p.t, 0), sy = darkPts.reduce((a, p) => a + p.levelE, 0);
  const sxx = darkPts.reduce((a, p) => a + p.t * p.t, 0), sxy = darkPts.reduce((a, p) => a + p.t * p.levelE, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx), inter = (sy - slope * sx) / n;
  let ss = 0; for (const p of darkPts) ss += (p.levelE - (slope * p.t + inter)) ** 2;
  const se = Math.sqrt((ss / (n - 2)) * (n / (n * sxx - sx * sx)));
  return { slope, inter, se };
})();

// ---- 5. Numbers that only need arithmetic, checked against the paper ----
const arith = {
  biasE: +(BIAS_ADU * G).toFixed(2), fullWellE: +(FULLWELL_ADU * G).toFixed(0),
  dynamicRangeDb: +(20 * Math.log10(FULLWELL_E / RN_E)).toFixed(2),
  doublingOff: +(5 / Math.log2(DC_E / 0.80)).toFixed(2), doublingOn: +(5 / Math.log2(0.736 / 0.50)).toFixed(2),
  framesForDsnu: +((RN / DSNU) ** 2).toFixed(1),
};

// ---- 6. What the tool's own demo set gives, for "Check it yourself" ----
const d = demoSet();
const dm = (o) => ({ bias: combine(d.bias, o), dark: combine(d.darks, o), flat: combine(d.flats, o) });
const sig = dm({ method: 'sigma', kappa: 3, iters: 5 }), mn = dm({ method: 'mean' });
const cal = calibrate(d.lights[0], { bias: sig.bias.frame, dark: sig.dark.frame, flat: sig.flat.frame }, { scaleDark: false, tLight: 120, tDark: 120, flatNorm: 'mean', minFlat: 0.05 });
const beforeDark = calibrate(d.lights[0], { bias: sig.bias.frame, dark: sig.dark.frame }, { scaleDark: false, tLight: 120, tDark: 120, flatNorm: 'mean', minFlat: 0.05 }).frame;
const demoOut = {
  biasStats: exactStats(sig.bias.frame.planes[0]), darkStats: exactStats(sig.dark.frame.planes[0]),
  rejected: { bias: sig.bias.rejected, dark: sig.dark.rejected, flat: sig.flat.rejected },
  darkMeanMean: exactStats(mn.dark.frame.planes[0]).mean, lightBefore: exactStats(d.lights[0].planes[0]),
  lightAfter: exactStats(cal.frame.planes[0]), flatRatioBefore: flatness(beforeDark.planes[0], d.lights[0].w, d.lights[0].h).ratio,
  flatRatioAfter: flatness(cal.frame.planes[0], d.lights[0].w, d.lights[0].h).ratio, flatNorm: cal.flatNorm[0],
};

// ---- Charts ----
const fig1 = chart({
  title: 'Master bias: scatter against frames stacked',
  xLabel: 'Bias frames combined', yLabel: 'Pixel-to-pixel σ of the master (ADU)',
  series: [
    ...settle.map((m) => ({ name: m.name, kind: 'dots', x: NS, y: m.sd, size: 3 })),
    { name: 'Expected √(DSNU² + σ_read²/N)', kind: 'line', x: NS, y: predicted, colour: 'var(--muted)', dash: '5 3' },
  ],
  xDomain: [0, 103], yDomain: [0, 1.6],
  hlines: [{ y: +DSNU.toFixed(4), text: `fixed pattern ${DSNU.toFixed(3)} ADU` }],
  desc: `The scatter of a master bias made from 1 to 100 simulated frames, by mean, median and 3 sigma clipped mean, against the expected curve. It flattens out on the camera's fixed offset pattern of ${DSNU.toFixed(3)} ADU.`,
  height: 300,
});
const line = [0, 58000];
const fig2 = chart({
  title: 'Photon transfer curve: the gain from flat pairs',
  xLabel: 'Mean signal above bias (ADU)', yLabel: 'Half the variance of a flat pair (ADU²)',
  series: [
    { name: 'Simulated flat pairs', kind: 'dots', x: ptc.map((p) => p.mean), y: ptc.map((p) => p.varHalf), size: 3.2 },
    { name: `Fit: gain ${fit.gain.toFixed(3)} e⁻/ADU`, kind: 'line', x: line, y: line.map((x) => +(x * fit.slope + fit.rnAdu ** 2).toFixed(2)), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 58000], yDomain: [0, 52000],
  desc: `Half the variance of the difference of two simulated flat frames against their mean level. The slope is one over the conversion gain, giving ${fit.gain.toFixed(3)} electrons per ADU against the paper's 1.131.`,
  height: 290,
});

console.log(JSON.stringify({ settle, predicted, rnPair, ptc, fit, darkPts, dcFit, arith, demoOut }, (k, v) => (typeof v === 'number' ? +v.toPrecision(8) : v), 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'settle', figure(fig1, 'Figure 1. Simulated bias frames with the paper’s read noise and fixed-pattern noise, combined by the Calibration frames tool. Stacking beats the random part down as 1/√N, but the camera’s own offset pattern never averages away, so past about 50 frames there is little left to win. Our simulation, not the authors’ frames.'));
  md = inject(md, 'ptc', figure(fig2, 'Figure 2. The classic photon transfer curve, built from pairs of simulated flat frames and the tool’s exact frame statistics. The slope returns the conversion gain and the intercept the read noise.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
