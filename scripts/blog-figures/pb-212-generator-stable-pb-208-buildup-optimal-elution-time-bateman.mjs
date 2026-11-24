// Figures for src/blog/discoveries/pb-212-generator-stable-pb-208-buildup-optimal-elution-time-bateman.md, made with
// the maths of the Decay chain calculator (src/lib/sci/phchain.ts: atoms, activities, peakTime, lambdaOf).
// Run: node scripts/blog-figures/pb-212-generator-stable-pb-208-buildup-optimal-elution-time-bateman.mjs
import fs from 'node:fs';
import { atoms, activities, peakTime, lambdaOf } from '../../src/lib/sci/phchain.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pb-212-generator-stable-pb-208-buildup-optimal-elution-time-bateman.md', import.meta.url);

// From the paper: Roberts et al. (2025), EJNMMI Radiopharm. Chem. 10: 49. 350 MBq 224Ra generator; 212Pb half-life
// 10.64 h; 220Rn 55.8 s. Other half-lives are rounded standard values (OUR inputs): 224Ra 3.632 d, 216Po 0.145 s,
// 212Bi 60.55 min. 212Bi's two branches (via 212Po, 0.3 µs, and 208Tl, 3.05 min) both end in stable 208Pb; we send
// all of it straight to 208Pb (OUR simplification: the 3 min stop at 208Tl is ignored).
const H = 3600, D = 86400, NA = 6.02214076e23;
const CHAIN = [{ n: 'Ra-224', h: 3.632 * D }, { n: 'Rn-220', h: 55.8 }, { n: 'Po-216', h: 0.145 }, { n: 'Pb-212', h: 10.64 * H }, { n: 'Bi-212', h: 60.55 * 60 }];
const lam = [...CHAIN.map((m) => lambdaOf(m.h)), 0]; // last member: stable Pb-208 (decay constant 0)
const br = [1, 1, 1, 1, 1], A0 = 350e6, PB = 3, BI = 4, S = 5;
const N0 = [A0 / lam[0], 0, 0, 0, 0, 0];
const at = (tH) => { const N = atoms(lam, br, N0, tH * H); return { N, A212: N[PB] * lam[PB], frac: N[PB] / (N[PB] + N[S]), ratio: N[S] / N[PB] }; };
const AM100 = (lam[PB] * NA) / 1e15; // MBq per nmol for pure 212Pb
const am = (frac) => AM100 * frac;
const r3 = (v) => +v.toFixed(3);

const grid = [15.4, 16.5, 24, 25, 48, 72].map((t) => { const g = at(t); return { t, pctOfLoad: +(100 * g.A212 / A0).toFixed(1), ratio: r3(g.ratio), frac: +(100 * g.frac).toFixed(1), Am: Math.round(am(g.frac)) }; });
const lamA = CHAIN.map((m) => lambdaOf(m.h));
const tPeak = peakTime(lamA, [1, 1, 1, 1], [A0, 0, 0, 0, 0], PB, 1000 * H) / H;
const peakPct = (100 * activities(lamA, [1, 1, 1, 1], [A0, 0, 0, 0, 0], tPeak * H)[PB]) / A0;
const atPeak = at(tPeak);
// Our own trade-off score: 212Pb activity times its share of the lead atoms.
let best = { t: 0, s: 0 }; for (let t = 1; t <= 60; t += 0.01) { const g = at(t); const s = g.A212 * g.frac; if (s > best.s) best = { t, s }; }
const bestG = at(best.t);
// An eluate taken at 15.6 h (lead only, Bi-212 left behind, OUR reading of "with daughter removal") then 5 h in transit.
function afterTransit(tElute, tWait, keepBi) {
  const N = at(tElute).N, lam2 = [lam[PB], lam[BI], 0], n0 = [N[PB], keepBi ? N[BI] : 0, N[S]];
  const M = atoms(lam2, [1, 1], n0, tWait * H);
  return { ratio: M[2] / M[0], Am: am(M[0] / (M[0] + M[2])) };
}
const tr0 = at(15.6), trKeep = afterTransit(15.6, 5, true), trRemove = afterTransit(15.6, 5, false), tr48 = afterTransit(48, 5, true);

const ts = Array.from({ length: 145 }, (_, i) => i * 0.5);
const fig1 = chart({
  title: '350 MBq Ra-224 generator: Pb-212 grows in', xLabel: 'Grow-in time (h)', yLabel: 'Activity (MBq)',
  series: [
    { name: 'Ra-224', kind: 'line', x: ts, y: ts.map((t) => +(at(t).N[0] * lam[0] / 1e6).toFixed(1)), colour: 'var(--muted)', dash: '5 4' },
    { name: 'Pb-212', kind: 'line', x: ts, y: ts.map((t) => +(at(t).A212 / 1e6).toFixed(1)) },
  ],
  xDomain: [0, 72], yDomain: [0, 360], xTicks: [0, 12, 24, 36, 48, 60, 72],
  vlines: [{ x: 16.5, text: '16.5 h', left: true }, { x: +tPeak.toFixed(1), text: `${tPeak.toFixed(1)} h peak` }],
  desc: `Pb-212 activity on a fresh 350 MBq Ra-224 generator. It reaches ${grid[1].pctOfLoad} % of the starting radium activity at 16.5 h and peaks at ${peakPct.toFixed(1)} % after ${tPeak.toFixed(1)} h.`, height: 270,
});
const fig2 = chart({
  title: 'More waiting, more stable lead', xLabel: 'Grow-in time (h)', yLabel: 'Molar activity (MBq/nmol)',
  series: [{ name: 'Pb-212 molar activity', kind: 'line', x: ts.slice(1), y: ts.slice(1).map((t) => Math.round(am(at(t).frac))) }],
  xDomain: [0, 72], yDomain: [0, 11000], xTicks: [0, 12, 24, 36, 48, 60, 72],
  hlines: [{ y: Math.round(AM100), text: 'pure Pb-212' }],
  vlines: [{ x: 16.5, text: '16.5 h', left: true }],
  desc: `Molar activity of the lead on the generator: ${Math.round(AM100)} MBq/nmol for pure Pb-212, ${grid[1].Am} at 16.5 h and ${grid[4].Am} at 48 h, as stable Pb-208 builds up.`, height: 250,
});

console.log(JSON.stringify({ AM100: +AM100.toFixed(1), grid, tPeak: +tPeak.toFixed(2), peakPct: +peakPct.toFixed(1), peakRatio: r3(atPeak.ratio), peakAm: Math.round(am(atPeak.frac)), best: { t: +best.t.toFixed(1), pct: +(100 * bestG.A212 / A0).toFixed(1), Am: Math.round(am(bestG.frac)) }, tr: { r0: r3(tr0.ratio), Am0: Math.round(am(tr0.frac)), keep: { ratio: r3(trKeep.ratio), Am: Math.round(trKeep.Am) }, remove: { ratio: r3(trRemove.ratio), Am: Math.round(trRemove.Am) }, h48: { r0: r3(at(48).ratio), ratio: r3(tr48.ratio), Am: Math.round(tr48.Am) } } }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'growin', figure(fig1, 'Figure 1. Activity of Ra-224 and Pb-212 on a fresh 350 MBq generator, from the Bateman equations in the Decay chain calculator\'s maths (six-member chain to stable Pb-208). Recomputed from half-lives, not the paper\'s figure.'));
  md = inject(md, 'molar', figure(fig2, 'Figure 2. Molar activity of the generator\'s lead, Pb-212 activity divided by all lead atoms (Pb-212 plus stable Pb-208), against grow-in time.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
