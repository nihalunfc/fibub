// Figures for src/blog/discoveries/elaphe-dione-coi-divergence-dating.md, made with the maths of the
// Molecular clock calculator (src/lib/sci/molclock.ts: distances with their sampling error, T = d / 2r and r = d / 2T).
// Run: node scripts/blog-figures/elaphe-dione-coi-divergence-dating.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import * as M from '../../src/lib/sci/molclock.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/elaphe-dione-coi-divergence-dating.md', import.meta.url);

// From the paper's abstract: Simonov et al. (2026), PeerJ 14: e20351 (CC BY 4.0). Average uncorrected COI distance
// between the 11 lineages 0.7 % to 6.7 %; the west-east split about 1.7 Mya; the busiest diversification about 1.3 Mya.
const D_MIN = 0.007, D_MAX = 0.067, T_PAPER = 1.7;
// OUR assumptions: a 650-site COI fragment (the usual barcode length) for the sampling error, and five transitions
// per transversion, which is ordinary for vertebrate mitochondrial DNA.
const SITES = 650, TSTV = 5;
// The conventional vertebrate mitochondrial clock: 2 % pairwise per million years = 0.01 per lineage (Brown et al. 1979).
const R_STD = 0.01, R_STD_SE = 0.002;

const siteCounts = (p) => { const diff = Math.round(p * SITES), ts = Math.round((diff * TSTV) / (TSTV + 1)); return { diff, ts, tv: diff - ts }; };
const row = (p) => {
  const c = siteCounts(p);
  return { p, ...c, pd: M.distWithSE(SITES, c.ts, c.tv, 'p'), jc: M.distWithSE(SITES, c.ts, c.tv, 'jc'), k2p: M.distWithSE(SITES, c.ts, c.tv, 'k2p') };
};
const deep = row(D_MAX), shallow = row(D_MIN);

// 1. Dates the conventional clock gives for the paper's distances (d typed straight in, its error from 650 sites).
const tStd = (d, se = 0) => M.divergenceTime(d, se, R_STD, R_STD_SE);
const tDeep = tStd(D_MAX, deep.pd.se), tShallow = tStd(D_MIN, shallow.pd.se);
const tDeepJC = tStd(deep.jc.d, deep.jc.se), tDeepK2P = tStd(deep.k2p.d, deep.k2p.se);

// 2. The per-lineage rate the paper's own date implies for its deepest distance.
const rImp = M.clockRate(D_MAX, deep.pd.se, T_PAPER, 0);
const rImpJC = M.clockRate(deep.jc.d, deep.jc.se, T_PAPER, 0);

const pc = (v) => +(v * 100).toFixed(3);
const out = {
  deep, shallow,
  tDeep, tShallow, tDeepJC, tDeepK2P, rImp, rImpJC,
  ratio: +(rImp.value / R_STD).toFixed(2),
};
console.log(JSON.stringify({
  deepP: deep.pd.d, deepSE: deep.pd.se, deepJC: deep.jc.d, deepK2P: deep.k2p.d, counts: [deep.ts, deep.tv],
  shallowP: shallow.pd.d, shallowSE: shallow.pd.se, shallowJC: shallow.jc.d,
  tDeep: [tDeep.value, tDeep.se, tDeep.lo, tDeep.hi], tDeepJC: tDeepJC.value, tDeepK2P: tDeepK2P.value,
  tShallow: [tShallow.value, tShallow.lo, tShallow.hi],
  rImp: [rImp.value, rImp.se, rImp.lo, rImp.hi], rImpJC: rImpJC.value, ratio: out.ratio,
}, null, 1));

// Figure 1: the two clock lines across the paper's range of lineage distances.
const dd = Array.from({ length: 141 }, (_, i) => i * 0.0005); // 0 to 7 % distance
const line = (r) => dd.map((d) => M.divergenceTime(d, 0, r, 0).value);
const fig1 = chart({
  title: 'What a fixed clock makes of the COI distances',
  xLabel: 'Uncorrected COI distance (%)', yLabel: 'Time since the split (Myr)',
  series: [
    { name: '2 % pairwise per Myr (standard)', kind: 'line', x: dd.map(pc), y: line(R_STD) },
    { name: `${pc(rImp.value * 2)} % pairwise (the paper's dates)`, kind: 'line', x: dd.map(pc), y: line(rImp.value) },
  ],
  xDomain: [0, 7], yDomain: [0, 3.8],
  bands: [{ x0: 0.7, x1: 6.7, text: "paper's lineages" }],
  hlines: [{ y: T_PAPER, text: '1.7 Mya (paper)' }],
  desc: `Time since divergence against uncorrected COI distance for two clock rates. At the deepest lineage distance of 6.7 % the standard clock gives ${tDeep.value.toFixed(2)} million years, while the rate implied by the paper's own date of 1.7 million years is about twice as fast.`,
  height: 290,
});

// Figure 2: the per-lineage rate the deepest distance implies, against the age you assume for that split.
const TT = Array.from({ length: 96 }, (_, i) => 0.5 + i * 0.05);
const fig2 = chart({
  title: 'Rate implied by the deepest split, against its age',
  xLabel: 'Assumed age of the west-east split (Myr)', yLabel: 'Rate per lineage (% per Myr)',
  series: [
    { name: 'from d = 6.7 % (uncorrected)', kind: 'line', x: TT, y: TT.map((T) => pc(M.clockRate(D_MAX, 0, T, 0).value)) },
    { name: 'from d = 7.2 % (K2P corrected)', kind: 'line', x: TT, y: TT.map((T) => pc(M.clockRate(deep.k2p.d, 0, T, 0).value)), dash: '5 4' },
  ],
  xDomain: [0.5, 5], yDomain: [0, 7.5],
  hlines: [{ y: pc(R_STD), text: 'standard 1 % per lineage' }],
  vlines: [{ x: T_PAPER, text: "paper's date" }],
  desc: `The per-lineage substitution rate needed to turn a 6.7 % COI distance into a given split age. At the paper's 1.7 million years the rate is about ${pc(rImp.value)} % per million years per lineage, roughly twice the conventional 1 %; the conventional rate would need the split to be about ${tDeep.value.toFixed(1)} million years old.`,
  height: 290,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'clocklines', figure(fig1, `Figure 1. Time since divergence against uncorrected COI distance, drawn with the Molecular clock calculator's T = d / 2r. The shaded strip is the range of average distances between the paper's 11 lineages; the dashed line is the paper's date for the deepest split.`));
md = inject(md, 'rate', figure(fig2, `Figure 2. The per-lineage rate that the deepest lineage distance implies for each possible age of the west-east split, for the uncorrected distance and for the Kimura 2-parameter distance (five transitions per transversion, our assumption).`));
fs.writeFileSync(ART, md);
console.log('figures written:', fig1.length, fig2.length, 'bytes');
