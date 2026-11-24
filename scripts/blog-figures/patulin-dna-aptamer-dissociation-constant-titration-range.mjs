// Figures for src/blog/discoveries/patulin-dna-aptamer-dissociation-constant-titration-range.md, made with the maths
// of the Binding curve fitter (src/lib/sci/binding.ts: the one-site saturation fit and the Scatchard comparison).
// Run: node scripts/blog-figures/patulin-dna-aptamer-dissociation-constant-titration-range.mjs
import fs from 'node:fs';
import { MODELS, fitBinding, scatchard } from '../../src/lib/sci/binding.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/patulin-dna-aptamer-dissociation-constant-titration-range.md', import.meta.url);
const ONE = MODELS.find((m) => m.id === 'one');

// From the paper: Wang et al. (2025), One Health Advances 3(1) (CC BY 4.0).
const KD_ITC = 12.5, KD_FLU = 18.4;     // µM, by ITC and by thioflavin-T fluorescence
const RANGE = [0.2, 20];                 // µM, the assay's stated working range (LOD 0.2 µM)
const NOISE = 0.03;                      // OUR assumption: 3 % of full signal, normal
const POINTS = [0.2, 0.5, 1, 2, 5, 8, 10, 15, 20];  // OUR choice: nine points across the paper's own range

const frac = (c, Kd) => c / (Kd + c);
let seed = 101;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());

// One simulated titration over the paper's range, fitted with the tool's maths.
const Y = POINTS.map((c) => +(frac(c, KD_FLU) + NOISE * gauss()).toFixed(4));
const fit = fitBinding(ONE, POINTS, Y);
const sc = scatchard(POINTS, Y);

// How the recovered Kd depends on how far the titration goes: 300 noise draws per design.
const TOPS = [20, 40, 60, 100, 200, 400];
const q = (a, f) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(f * s.length))]; };
seed = 7;
const sweep = TOPS.map((top) => {
  const pts = Array.from({ length: 9 }, (_, i) => +(RANGE[0] * (top / RANGE[0]) ** (i / 8)).toPrecision(3));
  const kds = [], ses = [];
  for (let k = 0; k < 300; k++) {
    const y = pts.map((c) => frac(c, KD_FLU) + NOISE * gauss());
    try { const f = fitBinding(ONE, pts, y); if (f.p[1] < 1e4) { kds.push(f.p[1]); ses.push(f.se[1]); } } catch { /* a draw that will not fit */ }
  }
  return { top, n: kds.length, median: q(kds, 0.5), p10: q(kds, 0.1), p90: q(kds, 0.9), se: q(ses, 0.5) };
});

const CC = Array.from({ length: 121 }, (_, i) => RANGE[0] + (i * (RANGE[1] - RANGE[0])) / 120);
const fig1 = chart({
  title: 'A titration that stops at 20 µM cannot tell the two Kd apart',
  xLabel: 'Patulin concentration (µM)', yLabel: 'Fraction of aptamer bound',
  series: [
    { name: `Kd ${KD_FLU} µM (fluorescence)`, kind: 'line', x: CC, y: CC.map((c) => +frac(c, KD_FLU).toFixed(4)) },
    { name: `Kd ${KD_ITC} µM (ITC)`, kind: 'line', dash: '5 4', x: CC, y: CC.map((c) => +frac(c, KD_ITC).toFixed(4)) },
    { name: 'Simulated points', kind: 'dots', x: POINTS, y: Y, size: 3.2, colour: 'var(--ink)' },
    { name: '', noLegend: true, kind: 'line', x: CC, y: CC.map((c) => +(fit.p[0] * frac(c, fit.p[1])).toFixed(4)), colour: 'var(--muted)' },
  ],
  xDomain: [0, 20], yDomain: [0, 0.75],
  desc: `Over 0.2 to 20 µM the two reported dissociation constants differ by at most ${(100 * Math.max(...CC.map((c) => frac(c, KD_ITC) - frac(c, KD_FLU)))).toFixed(0)} percentage points of saturation, and nine simulated points with 3 % noise fit a Kd of ${fit.p[1].toFixed(1)} µM.`,
  height: 280,
});
const fig2 = chart({
  title: 'How far the titration must go to pin the Kd down',
  xLabel: 'Highest concentration in the titration (µM)', yLabel: 'Recovered Kd (µM)',
  series: [
    { name: 'Median of 300 draws', kind: 'line', x: sweep.map((s) => s.top), y: sweep.map((s) => +s.median.toFixed(2)) },
    { name: '10th to 90th percentile', kind: 'line', dash: '5 4', x: sweep.map((s) => s.top), y: sweep.map((s) => +s.p10.toFixed(2)), colour: 'var(--c-tools)' },
    { name: '', noLegend: true, kind: 'line', dash: '5 4', x: sweep.map((s) => s.top), y: sweep.map((s) => +s.p90.toFixed(2)), colour: 'var(--c-tools)' },
  ],
  xDomain: [20, 400], yDomain: [10, 30],
  hlines: [{ y: KD_FLU, text: `true Kd ${KD_FLU}` }, { y: KD_ITC, text: `the ITC value ${KD_ITC}` }],
  desc: `With the titration stopping at 20 µM the recovered Kd ranges from ${sweep[0].p10.toFixed(1)} to ${sweep[0].p90.toFixed(1)} µM across 300 noise draws; by 200 µM the range has narrowed to ${sweep[4].p10.toFixed(1)} to ${sweep[4].p90.toFixed(1)}.`,
  height: 280,
});

console.log(JSON.stringify({
  points: POINTS, y: Y,
  fit: { Bmax: +fit.p[0].toFixed(3), seBmax: +fit.se[0].toFixed(3), Kd: +fit.p[1].toFixed(2), seKd: +fit.se[1].toFixed(2), r2: +fit.r2.toFixed(4), ok: fit.ok },
  toolFacts: { topOverKd: +(RANGE[1] / fit.p[1]).toFixed(2), at50: +fit.p[1].toFixed(1), at90: +(9 * fit.p[1]).toFixed(0), at99: +(99 * fit.p[1]).toFixed(0), scatchardKd: +sc.Kd.toFixed(2), scatchardBmax: +sc.Bmax.toFixed(3), scatchardR2: +sc.line.r2.toFixed(4) },
  trueCurve: { fracAtTop: +frac(RANGE[1], KD_FLU).toFixed(3), fracAtLod: +frac(RANGE[0], KD_FLU).toFixed(4), need90: +(9 * KD_FLU).toFixed(1), need99: +(99 * KD_FLU).toFixed(0) },
  maxGap: +Math.max(...CC.map((c) => frac(c, KD_ITC) - frac(c, KD_FLU))).toFixed(4),
  sweep: sweep.map((s) => ({ top: s.top, median: +s.median.toFixed(2), p10: +s.p10.toFixed(2), p90: +s.p90.toFixed(2), medianSE: +s.se.toFixed(2) })),
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. The two reported dissociation constants as saturation curves, with nine simulated measurements over the assay’s own 0.2 to 20 µM range (3 % noise, our assumption) and the one-site curve the Binding curve fitter’s maths puts through them. Simulated, not the paper’s data.'));
  md = inject(md, 'range', figure(fig2, 'Figure 2. The same simulation repeated 300 times for titrations that stop at different concentrations. The band is the 10th to 90th percentile of the recovered Kd; the horizontal lines are the true value used to generate the data and the paper’s ITC value.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
