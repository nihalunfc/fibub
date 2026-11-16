// Figures for src/blog/discoveries/argon-breakdown-long-gap-paschen-electrodes.md, made with the maths of the
// Paschen curve tool (src/lib/sci/phpaschen.ts).
// Run: node scripts/blog-figures/argon-breakdown-long-gap-paschen-electrodes.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { paschenV, paschenMin } from '../../src/lib/sci/phpaschen.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/argon-breakdown-long-gap-paschen-electrodes.md', import.meta.url);

// Paper (Hridya P and Choudhary 2025, arXiv:2511.23108, CC BY 4.0, preprint): argon constants quoted from the
// literature, A 10.2 /(mbar cm) and B 176 V/(mbar cm); breakdown about 250 V (80 mm electrodes, gaps under 6 cm) and
// 265 V (40 mm, under 4 cm), rising by about 140 V and 170 V at a 30 cm gap.
const T = 1.33322368, A = 10.2 * T, B = 176 * T; // per Torr, the tool's units
const MEAS = [
  { id: '80 mm, short gap', V: 250 }, { id: '40 mm, short gap', V: 265 },
  { id: '80 mm, 30 cm', V: 250 + 140 }, { id: '40 mm, 30 cm', V: 265 + 170 },
];
// The secondary emission gamma that would make the classic Paschen minimum equal V: Vmin = e (B/A) ln(1 + 1/gamma).
const gammaFor = (V) => 1 / (Math.exp((V * A) / (Math.E * B)) - 1);
const rows = MEAS.map((m) => ({ ...m, gamma: +gammaFor(m.V).toPrecision(3), pdMin_mbarcm: +(paschenMin(A, B, gammaFor(m.V)).pd * T).toFixed(2) }));
const typical = paschenMin(A, B, 0.07); // a textbook-sized gamma for argon ions on a metal cathode (our choice)

// Figure 1: Paschen curves for three gammas, pd in mbar cm on a log axis.
const lx = Array.from({ length: 121 }, (_, i) => -0.4 + i * 0.025); // log10(pd in mbar cm) from 0.4 to 400
const curve = (g) => lx.map((l) => { const v = paschenV(10 ** l / T, A, B, g); return Number.isFinite(v) && v < 1200 ? +v.toFixed(1) : NaN; });
const fig1 = chart({
  title: 'Argon Paschen curves for three cathode yields γ', xLabel: 'Pressure × gap (mbar·cm, log scale)', yLabel: 'Breakdown voltage (V)',
  series: [
    { name: 'γ = 0.07', kind: 'line', x: lx, y: curve(0.07) },
    { name: `γ = ${rows[0].gamma}`, kind: 'line', x: lx, y: curve(rows[0].gamma) },
    { name: `γ = ${rows[2].gamma}`, kind: 'line', x: lx, y: curve(rows[2].gamma) },
  ],
  xDomain: [-0.4, 2.6], yDomain: [0, 1000], xTicks: [0, 1, 2], xFmt: (t) => String(10 ** t),
  hlines: [{ y: 250, text: 'measured, short gap ≈ 250 V' }, { y: 390, text: '30 cm gap ≈ 390 V' }],
  desc: `With argon's textbook constants, a cathode yield of 0.07 puts the Paschen minimum at ${typical.V.toFixed(0)} V. Matching the measured 250 V needs a yield of ${rows[0].gamma}, and the 30 cm gap's 390 V needs ${rows[2].gamma}.`, height: 280,
});

// Figure 2: the minimum voltage against gamma, with the measured levels marked.
const lg = Array.from({ length: 81 }, (_, i) => -4.5 + i * 0.05); // log10 gamma from 3e-5 to 1
const fig2 = chart({
  title: 'Lowest breakdown voltage against cathode yield γ', xLabel: 'Secondary emission yield γ (log scale)', yLabel: 'Paschen minimum (V)',
  series: [
    { name: 'Classic Paschen minimum', kind: 'line', x: lg, y: lg.map((l) => +paschenMin(A, B, 10 ** l).V.toFixed(1)) },
    { name: 'Needed to match the measurements', kind: 'dots', x: rows.map((r) => Math.log10(r.gamma)), y: rows.map((r) => r.V), size: 4.5 },
  ],
  xDomain: [-4.5, -0.5], yDomain: [0, 500], xTicks: [-4, -3, -2, -1], xFmt: (t) => String(10 ** t),
  desc: 'The Paschen minimum rises slowly as the cathode yield falls. The measured long-tube voltages need yields of 0.005 down to 0.0001, far below typical values, so another loss is at work.', height: 270,
});

console.log(JSON.stringify({ A: A.toFixed(3), B: B.toFixed(2), typical: { V: typical.V.toFixed(1), pd_mbarcm: (typical.pd * T).toFixed(3) }, rows }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. Classic Paschen curves for argon from the Paschen curve tool\'s maths, with the literature constants the preprint quotes, for three cathode yields. Dashed lines: breakdown voltages read from the preprint\'s text (rounded).'));
  md = inject(md, 'gamma', figure(fig2, 'Figure 2. The Paschen minimum voltage for argon as the cathode yield γ changes (line), and the yield the classic law would need to match each measured voltage (dots). The dots are our back-calculation, not values from the preprint.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
