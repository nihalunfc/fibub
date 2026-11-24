// Figures for src/blog/discoveries/ice-core-lead-record-lag-scan-synchronisation.md, made with the maths of the
// Proxy record stacker (src/lib/sci/proxystack.ts: common age grid, z-scores, stack, autocorrelation-corrected
// correlation and the lag scan).
// Run: node scripts/blog-figures/ice-core-lead-record-lag-scan-synchronisation.mjs
import fs from 'node:fs';
import { interpolate, zscore, stack, correlate, pearson, lagScan, lag1, bootIndex, bootstrap, rng } from '../../src/lib/sci/proxystack.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ice-core-lead-record-lag-scan-synchronisation.md', import.meta.url);

// Inputs from the paper: Gabrielli et al. (2026), Climate of the Past 22: 1037, doi:10.5194/cp-22-1037-2026
// (CC BY 4.0). Decadal resolution for the synchronisation, the window 175 BCE to 1755 CE, 11 tie points,
// r = 0.44 to 0.46 after synchronisation against 0.09 to 0.26 before, and age shifts of 10-20 years back to
// 1600 CE, about 40 years at 1550 CE, 120-270 years from 1250 to 250 CE and -280 to -240 years around 0 to 200 BCE.
const STEP = 10, T0 = -175, T1 = 1755;
const AGES = []; for (let t = T0; t <= T1; t += STEP) AGES.push(t);

// OUR OWN simulated lead history: broad Roman-era, medieval and early-industrial rises plus a slowly varying
// shared component (an AR(1) series at 10-year steps), with independent red noise in each core.
// Nothing here is the paper's data.
const bump = (t, c, w) => Math.exp(-0.5 * ((t - c) / w) ** 2);
const red = (n, sd, seed, phi) => { const g = rng(seed); const out = []; let x = 0;
  for (let i = 0; i < n; i++) { let u = 0; while (u === 0) u = g(); const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * g()); x = phi * x + Math.sqrt(1 - phi * phi) * z; out.push(x * sd); } return out; };
const SHARED = red(AGES.length, 1.0, 4242, 0.86); // the common lead history's wiggles (our assumption)
const NOISE = 1.6; // per-core noise, chosen so the aligned pair correlates at 0.44, the paper's value (our assumption)
const base = AGES.map((t, i) => 1.0 * bump(t, 50, 170) + 0.8 * bump(t, 1250, 200) + 1.4 * bump(t, 1700, 120) + SHARED[i]);
const nA = red(AGES.length, NOISE, 20261, 0.5), nB = red(AGES.length, NOISE, 77003, 0.5);
const alpine = { name: 'Alpine Pb (simulated)', age: AGES, value: base.map((v, i) => +(v + nA[i]).toFixed(3)) };
const arctic = { name: 'Arctic Pb (simulated)', age: AGES, value: base.map((v, i) => +(v + nB[i]).toFixed(3)) };

// The age-shift history before synchronisation: piecewise linear through knots of the sizes the paper reports
// (the knot positions are OURS).
const KNOTS = [[-175, -250], [0, -280], [250, 270], [1250, 120], [1550, 40], [1600, 15], [1755, 10]];
const shiftAt = (t) => { for (let i = 1; i < KNOTS.length; i++) if (t <= KNOTS[i][0]) { const [a, va] = KNOTS[i - 1], [b, vb] = KNOTS[i]; return va + ((vb - va) * (t - a)) / (b - a); } return KNOTS.at(-1)[1]; };
// The unsynchronised Arctic record: the same ice, but each sample carries a wrong age.
const wrong = { name: 'Arctic Pb, wrong ages', age: arctic.age.map((t) => t + shiftAt(t)), value: arctic.value };
const monotonic = wrong.age.every((t, i) => i === 0 || t > wrong.age[i - 1]);

// --- Put everything on the tool's common age grid and z-score it over the whole window ------------
const gA = interpolate(alpine, AGES), gB = interpolate(arctic, AGES), gW = interpolate(wrong, AGES);
const zA = zscore(gA, AGES, T0, T1).z, zB = zscore(gB, AGES, T0, T1).z, zW = zscore(gW, AGES, T0, T1).z;
const sync = correlate(zA, zB);
const unsync = correlate(zA, zW);
const window = (t0, t1) => { const k = AGES.map((t, i) => (t >= t0 && t <= t1 ? i : -1)).filter((i) => i >= 0);
  return { n: k.length, sync: correlate(k.map((i) => zA[i]), k.map((i) => zB[i])), unsync: correlate(k.map((i) => zA[i]), k.map((i) => zW[i])) }; };
const pre1750 = window(T0, 1750), early = window(T0, 1250);
const st = stack([zA, zB], 'mean');
const env = bootstrap([zA, zB], 'mean', bootIndex(400, 2, 7));

// --- The lag scan: how sharply does the correlation pick out the right alignment? ------------------
const MAXLAG = 12;
const scanS = lagScan(zA, zB, MAXLAG), scanW = lagScan(zA, zW, MAXLAG);
const peak = (s) => s.reduce((a, b) => (b.r > a.r ? b : a));
const half = (() => { const p = peak(scanS).r; const d = scanS.filter((s) => s.r >= p / 2).map((s) => s.lag); return { lo: Math.min(...d), hi: Math.max(...d) }; })();
const atLag = (k) => scanS.find((s) => s.lag === k).r;

// --- Figure 1: the two simulated records, z-scored, and their stack -------------------------------
const fig1 = chart({
  title: 'Two decadal lead records and their stack',
  xLabel: 'Year (negative is BCE)', yLabel: 'z-score',
  series: [
    { name: 'Alpine (simulated)', kind: 'line', x: AGES, y: zA.map((v) => +v.toFixed(3)) },
    { name: 'Arctic (simulated)', kind: 'line', x: AGES, y: zB.map((v) => +v.toFixed(3)) },
    { name: 'Stack of the two', kind: 'line', x: AGES, y: st.center.map((v) => +v.toFixed(3)), colour: 'var(--ink)' },
  ],
  xDomain: [T0, T1], yDomain: [-3.4, 3.8], hlines: [{ y: 0, text: '' }],
  width: 560, height: 300,
  desc: `Two simulated decadal lead records sharing one history, each with its own red noise, as z-scores over the whole window, with the mean stack of the two. They correlate at r = ${sync.r.toFixed(2)}.`,
});

// --- Figure 2: the lag scan, aligned and with the paper's age shifts ------------------------------
const fig2 = chart({
  title: 'Lag scan: how well a correlation finds the right alignment',
  xLabel: 'Age offset applied to the Arctic record (years)', yLabel: 'Correlation r',
  series: [
    { name: 'Synchronised', kind: 'line', x: scanS.map((s) => s.lag * STEP), y: scanS.map((s) => +s.r.toFixed(4)) },
    { name: 'With the wrong ages', kind: 'line', x: scanW.map((s) => s.lag * STEP), y: scanW.map((s) => +s.r.toFixed(4)) },
  ],
  xDomain: [-MAXLAG * STEP, MAXLAG * STEP], yDomain: [-0.3, 0.55], hlines: [{ y: 0, text: '' }],
  vlines: [{ x: 0, text: '' }],
  width: 560, height: 290,
  desc: `Correlation between the Alpine record and the Arctic record as the Arctic ages are slid backwards and forwards in decades. Synchronised, the peak is at zero offset with r = ${peak(scanS).r.toFixed(2)}; with the paper's own age shifts applied, the curve is flat and low everywhere.`,
});

const fmt = (c) => ({ r: +c.r.toFixed(3), n: c.n, r1a: +c.r1a.toFixed(3), r1b: +c.r1b.toFixed(3), neff: +c.neff.toFixed(1), p: c.p, pNaive: c.pNaive });
console.log(JSON.stringify({
  nGrid: AGES.length, monotonic,
  sync: fmt(sync), unsync: fmt(unsync), pre1750sync: fmt(pre1750.sync), pre1750unsync: fmt(pre1750.unsync),
  earlyN: early.n, earlySync: fmt(early.sync), earlyUnsync: fmt(early.unsync),
  shiftAt1250: +shiftAt(1250).toFixed(0), shiftAt600: +shiftAt(600).toFixed(0), shiftAt1700: +shiftAt(1700).toFixed(0),
  pExp: sync.p.toExponential(2), pNaiveExp: sync.pNaive.toExponential(2),
  lag1A: +lag1(zA, AGES.map((_, i) => i)).toFixed(3), lag1B: +lag1(zB, AGES.map((_, i) => i)).toFixed(3),
  peakSync: peak(scanS), peakWrong: peak(scanW), halfWidthDecades: half, rAt1: +atLag(1).toFixed(3), rAt2: +atLag(2).toFixed(3), rAt5: +atLag(5).toFixed(3),
  stackSdMean: +(st.sd.filter(Number.isFinite).reduce((a, b) => a + b, 0) / st.sd.filter(Number.isFinite).length).toFixed(3),
  envWidthMean: +(env.hi.map((h, i) => h - env.lo[i]).filter(Number.isFinite).reduce((a, b) => a + b, 0) / env.hi.filter(Number.isFinite).length).toFixed(3),
  shiftRange: [Math.min(...AGES.map(shiftAt)), Math.max(...AGES.map(shiftAt))],
  pearsonRaw: +pearson(gA, gB).r.toFixed(3),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'records', figure(fig1, 'Figure 1. Two simulated decadal lead records built from one shared history plus independent red noise, turned into z-scores and stacked by the Proxy record stacker’s maths. They are not the paper’s measurements; they are tuned to correlate like them.'));
  md = inject(md, 'lag', figure(fig2, 'Figure 2. The tool’s lag scan on the same pair, synchronised and then with age shifts of the size the paper reports. A correlation of this strength locates the alignment to about a decade, but cannot see through a wrong chronology.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
