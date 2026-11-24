// Figures for src/blog/discoveries/bladder-tumour-t1-t2-after-photodynamic-therapy-mri-contrast.md, made with the
// maths of the MRI physics simulator (src/lib/sci/phmri.ts: signalFormula, steadyBloch, nullTI, ernst).
// Run: node scripts/blog-figures/bladder-tumour-t1-t2-after-photodynamic-therapy-mri-contrast.mjs
import fs from 'node:fs';
import * as M from '../../src/lib/sci/phmri.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/bladder-tumour-t1-t2-after-photodynamic-therapy-mri-contrast.md', import.meta.url);

// Inputs from the paper: Godlewski et al. (2025), Biomedicines 13(12): 2867, doi:10.3390/biomedicines13122867 (CC BY 4.0).
// Mean T1 and T2 (ms) of ex-vivo human bladder tissue at 1.5 T. Proton density is set to 1 for all three
// (the paper does not measure it): OUR assumption, so the signals below are relaxation-only.
const TIS = [
  { name: 'Healthy wall', T1: 1351.7, T2: 93.5, sd1: 271.1, sd2: 20.3 },
  { name: 'Tumour, untreated', T1: 727.7, T2: 78.5, sd1: 145.0, sd2: 20.4 },
  { name: 'Tumour after PDT', T1: 368.9, T2: 55.7, sd1: 65.2, sd2: 6.1 },
];
const se = (TR, TE) => TIS.map((t) => M.signalFormula({ kind: 'se', TR, TE, flip: 90, TI: 0 }, t.T1, t.T2));
const PAIRS = [[0, 1, 'Healthy vs tumour'], [1, 2, 'Tumour vs after PDT'], [0, 2, 'Healthy vs after PDT']];

// Best spin-echo settings for each pair: shortest TE the paper used (10 ms) for T1 weighting, longest TR (10 s) for T2.
const bestTR = PAIRS.map(([a, b, name]) => { let o = null; for (let TR = 50; TR <= 3000; TR += 1) { const s = se(TR, 10), c = Math.abs(s[a] - s[b]); if (!o || c > o.c) o = { name, TR, c }; } return o; });
const bestTE = PAIRS.map(([a, b, name]) => { let o = null; for (let TE = 5; TE <= 300; TE += 1) { const s = se(10000, TE), c = Math.abs(s[a] - s[b]); if (!o || c > o.c) o = { name, TE, c }; } return o; });

const TRs = Array.from({ length: 121 }, (_, i) => 25 + i * 25);
const fig1 = chart({
  title: 'Spin-echo signal against TR (TE 10 ms, 1.5 T)',
  xLabel: 'Repetition time TR (ms)', yLabel: 'Signal (fraction of M₀)',
  series: TIS.map((t, k) => ({ name: t.name, kind: 'line', x: TRs, y: TRs.map((TR) => +se(TR, 10)[k].toFixed(4)) })),
  xDomain: [0, 3000], yDomain: [0, 1],
  vlines: [{ x: 632, text: 'TR 632' }],
  desc: 'Spin-echo signal of healthy bladder wall, untreated tumour and tumour after photodynamic therapy against repetition time, worked out from the paper\'s T1 and T2 values with the MRI simulator\'s Bloch maths. The three curves are furthest apart below about 1000 ms.',
  height: 265,
});

const fig2 = chart({
  title: 'How far apart two tissues look, against TR',
  xLabel: 'Repetition time TR (ms)', yLabel: 'Signal difference (of M₀)',
  series: PAIRS.map(([a, b, name]) => ({ name, kind: 'line', x: TRs, y: TRs.map((TR) => { const s = se(TR, 10); return +Math.abs(s[a] - s[b]).toFixed(4); }) })),
  xDomain: [0, 3000], yDomain: [0, 0.4],
  desc: 'The signal difference between each pair of tissues on a spin echo at TE 10 ms, against TR. Healthy against post-therapy tumour peaks near 0.35 of M0; healthy against untreated tumour only reaches 0.19.',
  height: 265,
});

console.log(JSON.stringify({
  t1Weighted: { TR: 500, TE: 15, signals: se(500, 15).map((v) => +v.toFixed(4)) },
  t2Weighted: { TR: 4000, TE: 100, signals: se(4000, 100).map((v) => +v.toFixed(4)) },
  mapShortTR: { TR: 50, TE: 3, signals: se(50, 3).map((v) => +v.toFixed(4)) },
  mapLongTR: { TR: 15000, TE: 3, signals: se(15000, 3).map((v) => +v.toFixed(4)) },
  lastEcho: { TR: 10000, TE: 260, signals: se(10000, 260).map((v) => +v.toFixed(4)) },
  bestTR, bestTE,
  recovery90: TIS.map((t) => ({ name: t.name, TR90: Math.round(t.T1 * Math.log(10)) })),
  nulls: TIS.map((t) => ({ name: t.name, nullTI2500: +M.nullTI(2500, t.T1).toFixed(0), longTR: +(t.T1 * Math.LN2).toFixed(0) })),
  ernst30: TIS.map((t) => ({ name: t.name, deg: +M.ernst(30, t.T1).toFixed(1) })),
  bloch: se(500, 15).map((v, k) => ({ formula: +v.toFixed(5), steps: +M.steadyBloch({ kind: 'se', TR: 500, TE: 15, flip: 90, TI: 0 }, TIS[k].T1, TIS[k].T2).toFixed(5) })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'signal', figure(fig1, 'Figure 1. What the paper\'s relaxation times mean for a spin-echo scan: signal against repetition time at a short echo time, for all three tissues. Worked out from the paper\'s mean T1 and T2 with the MRI physics simulator\'s maths, with equal proton density assumed.'));
  md = inject(md, 'contrast', figure(fig2, 'Figure 2. The same three tissues as pairs: how big a signal difference each pair gives at every TR. The tumour before and after therapy separate most easily; healthy wall against untreated tumour is the hardest pair.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
