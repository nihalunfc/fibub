// Figures for src/blog/discoveries/smartwatch-sensor-shannon-vs-min-entropy-bernoulli-bias.md, made with the maths
// of the Entropy calculator (src/lib/sci/entropy.ts: h2, summarise, divergence).
// Run: node scripts/blog-figures/smartwatch-sensor-shannon-vs-min-entropy-bernoulli-bias.mjs
import fs from 'node:fs';
import { h2, summarise, divergence } from '../../src/lib/sci/entropy.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/smartwatch-sensor-shannon-vs-min-entropy-bernoulli-bias.md', import.meta.url);

// From the paper: Svarcmajer, Kohler, Krpic and Lukic (2025), Sensors 25(17): 5298 (CC BY 4.0).
// Shake mode: Shannon entropy 0.997, min-entropy 0.918. Still mode: 0.991 and 0.851.
const MODES = [{ id: 'Shake mode', H: 0.997, Hmin: 0.918 }, { id: 'Still mode', H: 0.991, Hmin: 0.851 }];

// A source of independent bits whose commoner value has probability p has Shannon entropy h2(p) and
// min-entropy -log2(p). Each of the paper's two numbers therefore implies a bias, and the other number.
const biasFromMin = (Hmin) => 2 ** -Hmin;
const biasFromH = (H) => { let lo = 0.5, hi = 1; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; h2(m) > H ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const rows = MODES.map((m) => {
  const pMin = biasFromMin(m.Hmin), pH = biasFromH(m.H);
  const sMin = summarise([pMin, 1 - pMin]), sH = summarise([pH, 1 - pH]);
  return { ...m, pMin, pH, Hfrom: sMin.H, HminFrom: sH.minEntropy, collision: sMin.collision, redundancy: sMin.redundancy,
    bits128: Math.ceil(128 / m.Hmin), bits256: Math.ceil(256 / m.Hmin), bits128shannon: Math.ceil(128 / m.H) };
});
const d = divergence([rows[0].pMin, 1 - rows[0].pMin], [rows[1].pMin, 1 - rows[1].pMin]);

// Figure 1: the two entropies against the bias of the bit source.
const PS = Array.from({ length: 121 }, (_, i) => 0.5 + i * 0.00125);
const fig1 = chart({
  title: 'Shannon entropy hides a bias that min-entropy shows', xLabel: 'Probability of the commoner bit value', yLabel: 'Entropy per bit',
  series: [
    { name: 'Shannon entropy', kind: 'line', x: PS, y: PS.map((p) => +h2(p).toFixed(6)) },
    { name: 'Min-entropy', kind: 'line', x: PS, y: PS.map((p) => +summarise([p, 1 - p]).minEntropy.toFixed(6)) },
  ],
  xDomain: [0.5, 0.65], yDomain: [0.6, 1.02],
  vlines: rows.map((r, i) => ({ x: +r.pMin.toFixed(4), text: `${r.id.split(' ')[0]} ${r.pMin.toFixed(3)}`, left: i === 0, dy: 14 * i })),
  desc: 'Shannon entropy and min-entropy of a source of independent bits, against how often the commoner value comes up. Over the paper’s range Shannon entropy barely moves while min-entropy falls steeply.',
  height: 290,
});

// Figure 2: how many raw sensor bits a 128-bit key needs, counting min-entropy and (wrongly) Shannon entropy.
const fig2 = chart({
  title: 'Raw bits needed for a 128-bit key', xLabel: 'Probability of the commoner bit value', yLabel: 'Raw bits per 128-bit key',
  series: [
    { name: 'Counting min-entropy', kind: 'line', x: PS, y: PS.map((p) => +(128 / summarise([p, 1 - p]).minEntropy).toFixed(2)) },
    { name: 'Counting Shannon entropy', kind: 'line', x: PS, y: PS.map((p) => +(128 / h2(p)).toFixed(2)), dash: '4 3' },
  ],
  xDomain: [0.5, 0.65], yDomain: [125, 215],
  vlines: rows.map((r, i) => ({ x: +r.pMin.toFixed(4), text: `${r.bits128} bits`, left: i === 0, dy: 14 * i })),
  desc: 'How many raw sensor bits must be hashed to get 128 bits of real randomness, worked out from min-entropy and, for comparison, from Shannon entropy. The Shannon figure is far too optimistic.',
  height: 290,
});

console.log(JSON.stringify({
  rows: rows.map((r) => ({ id: r.id, paperH: r.H, paperHmin: r.Hmin, biasFromMin: +r.pMin.toFixed(5), ShannonImplied: +r.Hfrom.toFixed(5),
    biasFromH: +r.pH.toFixed(5), minEntropyImplied: +r.HminFrom.toFixed(5), collision: +r.collision.toFixed(5), redundancy: +r.redundancy.toFixed(5),
    bits128: r.bits128, bits256: r.bits256, bits128shannon: r.bits128shannon })),
  divergence: { kl: +d.pq.toFixed(6), klBack: +d.qp.toFixed(6), js: +d.js.toFixed(6) },
  sensitivity: { dH: +(h2(rows[0].pH) - h2(rows[0].pMin)).toFixed(6), dHmin: +(rows[0].HminFrom - rows[0].Hmin).toFixed(6) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'two', figure(fig1, 'Figure 1. The two entropy measures for a source of independent bits, drawn with the Entropy calculator’s own functions. The dashed verticals are the biases implied by the paper’s two min-entropy values.'));
  md = inject(md, 'keys', figure(fig2, 'Figure 2. The number of raw sensor bits a 128-bit key needs at each bias. Counting Shannon entropy instead of min-entropy would ask for about 129 bits in either mode, which is not enough.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
