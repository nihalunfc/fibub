// Figures for src/blog/discoveries/flue-pipe-end-correction-levine-schwinger-vs-empirical-ka.md, made with the maths of
// the Standing waves calculator (src/lib/sci/phstand.ts: Levine-Schwinger end correction, pipe resonances, length for a note).
// Run: node scripts/blog-figures/flue-pipe-end-correction-levine-schwinger-vs-empirical-ka.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { END_FACTOR, pipeResonance, effLength, lengthFor } from '../../src/lib/sci/phstand.ts';
import { soundSpeed } from '../../src/lib/sci/phair.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/flue-pipe-end-correction-levine-schwinger-vs-empirical-ka.md', import.meta.url);

// Inputs from the paper: Coyle, Schefter, Cannaday, Griffin and Rokni (2025), Acta Acustica 9: 71, doi:10.1051/aacus/2025058 (CC BY 4.0).
// Circular pipe 0.48 m long, inner radius 10 mm; square pipe 0.36 m long, 10 mm side (equivalent radius √(S/π));
// c = 343 m/s; tones near 870 and 2056 Hz (circular) and 474 and 875 Hz (square); tested range 0.049 ≤ ka ≤ 0.377.
// The empirical end correction δm = a(0.6133 − 0.1168 (ka)²) is the paper's comparison model (Davies et al., Moore et al.).
const C = 343, LS = END_FACTOR.unflanged; // 0.6133, the tool's plain-tube factor
const dM = (ka) => 0.6133 - 0.1168 * ka * ka; // per unit radius
const aSq = Math.sqrt(1e-4 / Math.PI);
const CASES = [
  { id: 'Circular, 870 Hz', L: 0.48, a: 0.01, f: 870 }, { id: 'Circular, 2056 Hz', L: 0.48, a: 0.01, f: 2056 },
  { id: 'Square, 474 Hz', L: 0.36, a: aSq, f: 474 }, { id: 'Square, 875 Hz', L: 0.36, a: aSq, f: 875 },
];
// Pitch shift (cents) if the empirical correction replaced the tool's: same harmonic, radius scaled so the tool's factor gives δm.
const cents = (L, a, ka) => 1200 * Math.log2(pipeResonance(1, 'open', L, a * dM(ka) / LS, 'unflanged', C).f / pipeResonance(1, 'open', L, a, 'unflanged', C).f);
const rows = CASES.map((k) => {
  const ka = (2 * Math.PI * k.f / C) * k.a;
  return { id: k.id, a: +(k.a * 1000).toFixed(2), ka: +ka.toFixed(3), dLS: +(LS * k.a * 1000).toFixed(3), dM: +(dM(ka) * k.a * 1000).toFixed(3), pct: +((1 - dM(ka) / LS) * 100).toFixed(2), cents: +cents(k.L, k.a, ka).toFixed(2), f1: +pipeResonance(1, 'open', k.L, k.a, 'unflanged', C).f.toFixed(1), Leff: +(effLength('open', k.L, k.a, 'unflanged') * 1000).toFixed(1) };
});
// A wider pipe (OUR example): 50 mm radius, same 0.48 m length.
const wide = [0.1, 0.2, 0.3, 0.377, 0.5].map((ka) => ({ ka, f: Math.round(ka * C / (2 * Math.PI * 0.05)), cents: +cents(0.48, 0.05, ka).toFixed(2) }));
const sqLen = +(lengthFor(474, 'open', aSq, 'unflanged', C) * 1000).toFixed(1);
const tool20 = { c: +soundSpeed(20).toFixed(1), f1c: +pipeResonance(1, 'open', 0.48, 0.01, 'unflanged', soundSpeed(20)).f.toFixed(2), f1s: +pipeResonance(1, 'open', 0.36, aSq, 'unflanged', soundSpeed(20)).f.toFixed(2) };

const K = Array.from({ length: 51 }, (_, i) => i * 0.01);
const fig1 = chart({
  title: 'End correction per unit radius: classical against empirical', xLabel: 'ka (wavenumber × radius)', yLabel: 'δ / a',
  series: [
    { name: 'Levine-Schwinger 0.6133 (tool)', kind: 'line', x: [0, 0.5], y: [LS, LS] },
    { name: 'Empirical, frequency-dependent', kind: 'line', x: K, y: K.map((k) => +dM(k).toFixed(4)), dash: true },
    { name: 'The four test cases', kind: 'dots', x: rows.map((r) => r.ka), y: rows.map((r) => +(r.dM / r.a).toFixed(4)), size: 4 },
  ],
  xDomain: [0, 0.5], yDomain: [0.58, 0.62], bands: [{ x0: 0.049, x1: 0.377, text: 'tested range' }],
  desc: `The classical end correction stays at 0.6133 times the radius. The empirical one falls as the frequency rises, to ${dM(0.377).toFixed(4)} at ka 0.377, ${rows[1].pct} % lower, and ${(100 * (1 - dM(0.5) / LS)).toFixed(1)} % lower at ka 0.5.`, height: 260,
});
// Each curve stops at ka = 0.5, the top of the range where the empirical formula is meant to hold.
const upTo = (a) => Array.from({ length: 41 }, (_, i) => Math.round(20 + (i / 40) * (0.5 * C / (2 * Math.PI * a) - 20)));
const F1 = upTo(0.01), F5 = upTo(0.05);
const fig2 = chart({
  title: 'How far apart the two models put the pitch', xLabel: 'Frequency (Hz)', yLabel: 'Pitch difference (cents)',
  series: [
    { name: 'Paper\'s pipe: 0.48 m, 10 mm radius', kind: 'line', x: F1, y: F1.map((f) => +cents(0.48, 0.01, 2 * Math.PI * f / C * 0.01).toFixed(3)) },
    { name: 'Wide pipe: 0.48 m, 50 mm radius (our example)', kind: 'line', x: F5, y: F5.map((f) => +cents(0.48, 0.05, 2 * Math.PI * f / C * 0.05).toFixed(3)) },
  ],
  xDomain: [0, 2800], yDomain: [0, 10], hlines: [{ y: 5, text: '5 cents: a rough hearing threshold' }],
  desc: `Raising the pitch by the empirical end correction instead of the classical one: ${rows[0].cents} cents at 870 Hz and ${rows[1].cents} cents at 2056 Hz in the paper's circular pipe, but ${wide[2].cents} cents at ${wide[2].f} Hz in a 50 mm radius pipe of the same length.`, height: 260,
});

console.log(JSON.stringify({ rows, wide, sqLen, tool20, dm05: +(100 * (1 - dM(0.5) / LS)).toFixed(1) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'delta', figure(fig1, 'Figure 1. The end correction of a plain open pipe end, as a multiple of the radius: the classical Levine-Schwinger value the Standing waves calculator uses (solid), the empirical frequency-dependent model the paper compares it with (dashed), and the paper\'s four test cases (dots). The shaded band is the range of ka the paper tested.'));
  md = inject(md, 'cents', figure(fig2, 'Figure 2. The pitch difference between the two models for the paper\'s 10 mm radius pipe and for a wide 50 mm radius pipe of the same length (our example), from the calculator\'s resonance maths. Positive: the empirical model gives a slightly sharper note.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
