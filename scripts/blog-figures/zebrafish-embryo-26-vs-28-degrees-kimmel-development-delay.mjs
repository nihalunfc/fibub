// Figures for src/blog/discoveries/zebrafish-embryo-26-vs-28-degrees-kimmel-development-delay.md, made with the maths
// of the Embryo development timer (src/lib/sci/embryo.ts: Kimmel's rate factor, time conversion, temperature history).
// Run: node scripts/blog-figures/zebrafish-embryo-26-vs-28-degrees-kimmel-development-delay.mjs
import fs from 'node:fs';
import { kimmelFactor, convert, accumulate, KIMMEL_BASE, KIMMEL_RANGE } from '../../src/lib/sci/embryo.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/zebrafish-embryo-26-vs-28-degrees-kimmel-development-delay.md', import.meta.url);
const K = { kind: 'kimmel' };

// Inputs from the paper: Miller et al. (2025), PLOS One 20(12): e0340193 (CC BY 4.0).
// 28 °C medians and the measured delay at 26 °C (hours, with the paper's 95 % CI). The 1.5 dpf landmark is read as
// 36 hpf (OUR assumption: the paper gives the stage, not the hour).
const LANDMARKS = [
  { name: 'Heartbeat', at28: 25, delay: 4, ci: [3.5, 5] },
  { name: '1.5 dpf', at28: 36, delay: 3.25, ci: [3.25, 5] },
  { name: 'Hatching', at28: 60, delay: 8, ci: [2.25, 9] },
  { name: 'Body length, 119 hpf', at28: 119, delay: 18.6, ci: [15.9, 21.3] },
  { name: 'Yolk sac, 119 hpf', at28: 119, delay: 19.8, ci: [13.4, 26.3] },
  { name: 'Eye size, 119 hpf', at28: 119, delay: 13, ci: [7, 19.8] },
];
// The paper's re-analysis of Kimmel's own digitised data: observed rate slopes relative to 28.5 °C.
const OBSERVED = [{ T: 25, slope: 0.77, se: 0.02 }, { T: 33, slope: 1.11, se: 0.02 }];

const rows = LANDMARKS.map((L) => {
  const at26 = convert(K, L.at28, 28, 26);
  return { ...L, at26: +at26.toFixed(2), predicted: +(at26 - L.at28).toFixed(2) };
});
const limit = { strahle: convert(K, 120, 28.5, 26), equiv120: 120 * kimmelFactor(26), equiv125: 125 * kimmelFactor(26) };
const history = accumulate(K, [{ hours: 48, T: 26 }, { hours: 48, T: 28 }]);

const TT = Array.from({ length: 101 }, (_, i) => 24 + i * 0.1);
const fig1 = chart({
  title: 'Kimmel’s rate factor against temperature',
  xLabel: 'Incubation temperature (°C)', yLabel: 'Development rate (28.5 °C = 1)',
  series: [
    { name: 'Kimmel 0.055 T − 0.57', kind: 'line', x: TT, y: TT.map((T) => +kimmelFactor(T).toFixed(4)) },
    { name: 'Observed in the paper’s re-analysis', kind: 'dots', x: OBSERVED.map((o) => o.T), y: OBSERVED.map((o) => o.slope), errors: OBSERVED.map((o) => o.se), size: 3.2 },
  ],
  xDomain: [24, 34], yDomain: [0.7, 1.35],
  vlines: [{ x: 26, text: `26 °C: ${kimmelFactor(26).toFixed(3)}`, left: true }, { x: 28, text: `28 °C: ${kimmelFactor(28).toFixed(2)}`, dy: 14 }],
  desc: `Kimmel's rate factor rises as a straight line from ${kimmelFactor(KIMMEL_RANGE[0]).toFixed(3)} at 25 °C to ${kimmelFactor(KIMMEL_RANGE[1]).toFixed(3)} at 33 °C, above the observed slopes of 0.77 and 1.11 the paper re-analysed.`,
  height: 270,
});

const HH = Array.from({ length: 121 }, (_, i) => i);
const fig2 = chart({
  title: 'How far behind a 26 °C embryo falls',
  xLabel: 'Age at 28 °C (hours post fertilisation)', yLabel: 'Delay at 26 °C (hours)',
  series: [
    { name: 'Kimmel formula (the tool)', kind: 'line', x: HH, y: HH.map((h) => +(convert(K, h, 28, 26) - h).toFixed(3)) },
    { name: 'Measured in the paper', kind: 'dots', x: rows.map((r) => r.at28), y: rows.map((r) => r.delay), errors: rows.map((r) => (r.ci[1] - r.ci[0]) / 2), size: 3.2 },
  ],
  xDomain: [0, 120], yDomain: [0, 27],
  desc: `The predicted delay grows in a straight line to ${(convert(K, 119, 28, 26) - 119).toFixed(1)} hours at 119 hpf, below the paper's measured 18.6 and 19.8 hours by body length and yolk sac.`,
  height: 270,
});

console.log(JSON.stringify({
  factors: [25, 26, 28, 28.5, 33].map((T) => [T, +kimmelFactor(T).toFixed(4)]),
  pace26vs28: +((kimmelFactor(26) / kimmelFactor(28)) * 100).toFixed(1),
  base: +KIMMEL_BASE.toFixed(2),
  rows, limit: { strahle: +limit.strahle.toFixed(2), equiv120: +limit.equiv120.toFixed(1), equiv125: +limit.equiv125.toFixed(1) },
  history: +history.toFixed(2), historyLag: +(96 - history).toFixed(2),
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rate', figure(fig1, 'Figure 1. The rate factor the Embryo development timer uses for zebrafish, with the two observed slopes the paper recovered from Kimmel’s own digitised data (bars are its standard errors). The dashed lines mark the two temperatures the paper compared.'));
  md = inject(md, 'delay', figure(fig2, 'Figure 2. The delay the formula predicts at 26 °C against age at 28 °C, with the paper’s measured delays (bars are half its 95 % confidence intervals). Three points sit at 119 hpf: body length, yolk sac and eye size.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
