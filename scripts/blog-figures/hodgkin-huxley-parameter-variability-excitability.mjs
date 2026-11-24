// Figures for src/blog/discoveries/hodgkin-huxley-parameter-variability-excitability.md, made with the maths of the
// Hodgkin-Huxley simulator (src/lib/sci/hhsim.ts: the 1952 equations, RK4 at 0.01 ms, threshold and f-I curve).
// Run: node scripts/blog-figures/hodgkin-huxley-parameter-variability-excitability.mjs
import fs from 'node:fs';
import * as H from '../../src/lib/sci/hhsim.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hodgkin-huxley-parameter-variability-excitability.md', import.meta.url);

/** Does this parameter set fire on its own, with no current injected at all? (Spikes after a 50 ms settling time.) */
const spontaneous = (p) => H.simulate({ kind: 'step', amp: 0, start: 0, dur: 0 }, 200, p, 0.01, 20).spikes.filter((t) => t > 50).length >= 2;
/** Spike height from rest, mV: settle, then a 20 µA/cm² step for 5 ms (well above threshold for every set used here). */
function height(p) {
  const r = H.simulate({ kind: 'step', amp: 20, start: 20, dur: 5 }, 60, p, 0.01, 5);
  return r.spikes.length ? r.peak - r.V[0] : 0;
}

// ---------- Figure 1: the f-I curve of the canonical 1952 parameter set, at two temperatures ----------
const amps = Array.from({ length: 41 }, (_, i) => i * 0.75); // 0 to 30 µA/cm²
const fI = (p) => amps.map((a) => H.rate(a, p));
const cold = fI(H.DEFAULTS), warm = fI({ ...H.DEFAULTS, tempC: 18.3 });
const thr1 = H.threshold(1), thr5 = H.threshold(5);
const onset = amps[cold.findIndex((f) => f > 0)];
const fig1 = chart({
  title: 'Firing rate against injected current', xLabel: 'Step current (µA/cm²)', yLabel: 'Firing rate (Hz)',
  series: [
    { name: '6.3 °C (the 1952 fit)', kind: 'line', x: amps, y: cold },
    { name: '18.3 °C', kind: 'line', x: amps, y: warm, dash: '5 3' },
  ],
  xDomain: [0, 30], vlines: [{ x: onset, text: `jump at ${onset} µA/cm²` }],
  desc: 'The firing rate of the space-clamped Hodgkin-Huxley model against injected current, at 6.3 and 18.3 degrees C. The rate jumps from zero straight to about 50 Hz instead of rising from zero.',
  height: 280,
});

// ---------- Figure 2: where in the (gNa, gK) plane the model fires with no stimulus at all ----------
const gNas = Array.from({ length: 18 }, (_, i) => 60 + i * 20);   // 60 to 400 mS/cm²
const gKs = Array.from({ length: 40 }, (_, i) => 1 + i);          // 1 to 40 mS/cm²
const lower = [], upper = [], okNa = [];
for (const gNa of gNas) {
  const firing = gKs.filter((gK) => spontaneous({ ...H.DEFAULTS, gNa, gK }));
  if (firing.length) { okNa.push(gNa); lower.push(Math.min(...firing)); upper.push(Math.max(...firing)); }
}
const fig2 = chart({
  title: 'Where the model never stops firing', xLabel: 'g̅Na (mS/cm²)', yLabel: 'g̅K (mS/cm²)',
  series: [
    { name: 'Top of the firing band', kind: 'line', x: okNa, y: upper },
    { name: 'Bottom of the firing band', kind: 'line', x: okNa, y: lower, dash: '5 3' },
    { name: 'The 1952 values', kind: 'dots', x: [120], y: [36], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [60, 400], yDomain: [0, 42],
  desc: 'In the plane of the two maximal conductances, the band of values at which the space-clamped model fires repeatedly with no current injected. The 1952 values sit just above the band.',
  height: 290,
});

// ---------- Monte Carlo: how often does a jittered parameter set misbehave? ----------
let seed = 1014458;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
function ensemble(cv, n) {
  let spont = 0, lowSpike = 0, quietAndTall = 0;
  const heights = [];
  for (let i = 0; i < n; i++) {
    const f = () => Math.exp(gauss() * Math.sqrt(Math.log(1 + cv * cv)) - 0.5 * Math.log(1 + cv * cv));
    const p = { ...H.DEFAULTS, gNa: H.DEFAULTS.gNa * f(), gK: H.DEFAULTS.gK * f(), gL: H.DEFAULTS.gL * f() };
    const s = spontaneous(p);
    if (s) spont++;
    const h = height(p); heights.push(h);
    if (h < 70) lowSpike++;
    if (!s && h >= 70) quietAndTall++;
  }
  heights.sort((a, b) => a - b);
  return { cv, n, spontPct: (spont / n) * 100, lowSpikePct: (lowSpike / n) * 100, okPct: (quietAndTall / n) * 100, median: heights[Math.floor(n / 2)], p5: heights[Math.floor(n * 0.05)] };
}
const runs = [0.1, 0.2, 0.3].map((cv) => ensemble(cv, 600));

// The g̅Na at which the spike stops clearing the paper's 70 mV propagation bar.
let lo = 10, hi = 120;
for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; height({ ...H.DEFAULTS, gNa: m }) < 70 ? (lo = m) : (hi = m); }
const gNa70 = (lo + hi) / 2;

console.log(JSON.stringify({
  threshold1ms: +thr1.toFixed(4), threshold5ms: +thr5.toFixed(4), onset,
  rateAtOnset: H.rate(onset), rate10: H.rate(10), rate20: H.rate(20), rate30: H.rate(30),
  warmRate10: H.rate(10, { ...H.DEFAULTS, tempC: 18.3 }), warmThr: +H.threshold(1, { ...H.DEFAULTS, tempC: 18.3 }).toFixed(4),
  heightDefault: +height(H.DEFAULTS).toFixed(2), gNa70: +gNa70.toFixed(2), gNa70pct: +((gNa70 / 120) * 100).toFixed(1),
  band: okNa.map((g, i) => [g, lower[i], upper[i]]),
  ensembles: runs.map((r) => ({ cv: r.cv, n: r.n, spontPct: +r.spontPct.toFixed(2), lowSpikePct: +r.lowSpikePct.toFixed(2), okPct: +r.okPct.toFixed(2), medianHeight: +r.median.toFixed(1), p5Height: +r.p5.toFixed(1) })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'fi', figure(fig1, 'Figure 1. The f-I curve of the space-clamped 1952 parameter set, drawn with the Hodgkin-Huxley simulator\'s own maths at two temperatures. The rate does not rise from zero: it jumps, the type II behaviour the paper relies on when it sorts responses into regular and phasic.'));
  md = inject(md, 'band', figure(fig2, 'Figure 2. The band of maximal conductances at which the space-clamped model fires for ever with no current injected, from a grid of 720 runs. The 1952 values (dot) lie just above the band, so a moderate fall in potassium conductance alone is enough to tip the model into firing.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
