// Figures for src/blog/discoveries/spillway-tunnel-rock-mass-q-rmr-sidan-dam.md, made with the maths of the
// Rock mass rating tool (src/lib/sci/rockmass.ts: Barton's Q, Bieniawski's RMR, the RMR-Q correlation and GSI).
// Run: node scripts/blog-figures/spillway-tunnel-rock-mass-q-rmr-sidan-dam.mjs
import fs from 'node:fs';
import { qValue, rmr, rmrFromQ, gsiFromRmr } from '../../src/lib/sci/rockmass.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/spillway-tunnel-rock-mass-q-rmr-sidan-dam.md', import.meta.url);

// Inputs from the paper: Arianto, B., Indrawan, I.G.B. and Warmada, I.W. (2023), E3S Web of Conferences 468: 02004,
// doi:10.1051/e3sconf/202346802004 (CC BY 4.0). Five stations along the Sidan Dam spillway tunnel, Bali.
// Each station: the Q parameters and the five RMR ratings plus the orientation adjustment, as the paper's tables give them.
const ST = [
  { id: 'Inlet', q: { rqd: 19, jn: 6, jr: 1, ja: 4, jw: 1, srf: 5 }, r: [2, 3, 15, 20, 7], adj: -12, paperQ: 0.16, paperRMR: 35, paperGSI: 25, jcond: null },
  { id: 'BPS', q: { rqd: 32, jn: 3, jr: 1, ja: 4, jw: 1, srf: 2.5 }, r: [1, 8, 15, 20, 10], adj: -12, paperQ: 1.07, paperRMR: 42, paperGSI: 46, jcond: 20 },
  { id: 'BHT 6', q: { rqd: 29, jn: 3, jr: 1, ja: 4, jw: 1, srf: 2.5 }, r: [2, 8, 15, 20, 10], adj: -12, paperQ: 0.97, paperRMR: 43, paperGSI: 45, jcond: 20 },
  { id: 'BHT 7', q: { rqd: 42, jn: 3, jr: 1, ja: 4, jw: 1, srf: 2.5 }, r: [2, 8, 15, 20, 10], adj: -12, paperQ: 1.40, paperRMR: 43, paperGSI: 51, jcond: 20 },
  { id: 'Outlet', q: { rqd: 34, jn: 6, jr: 1, ja: 4, jw: 1, srf: 5 }, r: [2, 8, 15, 20, 10], adj: -12, paperQ: 0.28, paperRMR: 43, paperGSI: 35, jcond: 20 },
];
const DRY = 15; // the groundwater rating for dry ground, used by the tool's GSI estimate

const rows = ST.map((s) => {
  const v = qValue(s.q), m = rmr(s.r, s.adj), g = gsiFromRmr(s.r, DRY);
  return {
    id: s.id, Q: +v.q.toFixed(4), Qrounded: +v.q.toFixed(2), paperQ: s.paperQ, block: +v.block.toFixed(3), shear: v.shear, stress: v.stress,
    qPrime: +v.qPrime.toFixed(3), basic: m.basic, total: m.total, paperRMR: s.paperRMR,
    gsiTool: g.gsi, rmrDry: g.rmrDry, gsiHoek: s.jcond === null ? null : 1.5 * s.jcond + s.q.rqd / 2, paperGSI: s.paperGSI,
    barton: +rmrFromQ(v.q, 9, 44).toFixed(1), bieniawski: +rmrFromQ(v.q, 13.5 / Math.LN10, 43).toFixed(1),
  };
});
// Least-squares fit of RMR = A ln Q + B to the paper's own five pairs.
const x = rows.map((r) => Math.log(r.Q)), y = rows.map((r) => r.paperRMR), n = rows.length;
const mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n;
const A = x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0) / x.reduce((s, v) => s + (v - mx) ** 2, 0), B = my - A * mx;
const rms = (f) => Math.sqrt(rows.reduce((s, r, i) => s + (r.paperRMR - f(r, i)) ** 2, 0) / n);

const inlet = { ...ST[0].q }, bps = { ...ST[1].q };
const srfs = Array.from({ length: 46 }, (_, i) => 1 + i * 0.2);
console.log(JSON.stringify({
  rows, fit: { A: +A.toFixed(3), B: +B.toFixed(2), rms: +rms((r, i) => A * x[i] + B).toFixed(2) },
  rmsBarton: +rms((r) => r.barton).toFixed(2), rmsBieniawski: +rms((r) => r.bieniawski).toFixed(2),
  inletSrf25: +qValue({ ...inlet, srf: 2.5 }).q.toFixed(3), inletJn3: +qValue({ ...inlet, jn: 3 }).q.toFixed(3),
  floor: [+qValue({ ...inlet, rqd: 5 }).q.toFixed(4), +qValue({ ...inlet, rqd: 5 }, false).q.toFixed(4)],
}, null, 1));

const lg = (v) => Math.log10(v);
const qLine = Array.from({ length: 121 }, (_, i) => -1.2 + i * 0.02);
const fig1 = chart({
  title: 'RMR against Q at five stations, and three ways to link them', xLabel: 'Barton Q (log scale)', yLabel: 'RMR (Bieniawski 1989)',
  series: [
    { name: 'Barton: 9 ln Q + 44', kind: 'line', x: qLine, y: qLine.map((t) => +rmrFromQ(10 ** t, 9, 44).toFixed(2)) },
    { name: 'Bieniawski: 13.5 log Q + 43', kind: 'line', x: qLine, y: qLine.map((t) => +rmrFromQ(10 ** t, 13.5 / Math.LN10, 43).toFixed(2)) },
    { name: `fit to these five: ${A.toFixed(2)} ln Q + ${B.toFixed(1)}`, kind: 'line', x: qLine, y: qLine.map((t) => +(A * Math.LN10 * t + B).toFixed(2)), colour: 'var(--muted)', dash: '5 4' },
    { name: 'the five stations', kind: 'dots', x: rows.map((r) => lg(r.Q)), y: rows.map((r) => r.paperRMR), size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [-1.2, 1.2], yDomain: [20, 60], xTicks: [-1, -0.699, -0.301, 0, 0.301, 0.699, 1], xFmt: (t) => String(+(10 ** t).toPrecision(2)),
  desc: `The five stations sit between Q ${rows[0].Qrounded} and ${rows[3].Qrounded} with RMR 35 to 43. Barton's correlation misses them by ${rms((r) => r.barton).toFixed(1)} points root-mean-square, Bieniawski's by ${rms((r) => r.bieniawski).toFixed(1)}, and a fit to these five by ${rms((r, i) => A * x[i] + B).toFixed(1)}.`,
  height: 290,
});

const fig2 = chart({
  title: 'How much the stress reduction factor moves Q', xLabel: 'SRF, stress reduction factor', yLabel: 'Q',
  series: [
    { name: 'Inlet (RQD 19, Jn 6)', kind: 'line', x: srfs, y: srfs.map((s) => +lg(qValue({ ...inlet, srf: s }).q).toFixed(4)) },
    { name: 'BPS (RQD 32, Jn 3)', kind: 'line', x: srfs, y: srfs.map((s) => +lg(qValue({ ...bps, srf: s }).q).toFixed(4)) },
  ],
  xDomain: [1, 10], yDomain: [lg(0.05), lg(5)],
  yTicks: [0.05, 0.1, 0.4, 1, 4].map(lg), yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  hlines: [{ y: lg(1), text: 'poor rock above' }, { y: lg(0.1), text: 'extremely poor below' }],
  vlines: [{ x: 5, text: 'inlet, SRF 5' }, { x: 2.5, text: 'BPS, SRF 2.5', left: true, dy: 16 }],
  desc: `Q against SRF for two of the stations, on a log scale. Taking the inlet's SRF as 2.5 instead of 5 would raise its Q from ${rows[0].Qrounded} to ${qValue({ ...inlet, srf: 2.5 }).q.toFixed(2)}, across a class boundary.`,
  height: 290,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rmrq', figure(fig1, 'Figure 1. The paper’s own Q and RMR values for the five stations (black dots), with the two published RMR-Q correlations and a least-squares fit to these five points, all drawn with the Rock mass rating tool’s RMR = A ln Q + B.'));
  md = inject(md, 'srf', figure(fig2, 'Figure 2. Q against the stress reduction factor for the inlet and the BPS station, holding every other parameter at the paper’s value. The dashed lines are two Barton class boundaries; the vertical lines mark the SRF the paper chose.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
