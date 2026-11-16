// Figures for src/blog/discoveries/eapv-passion-fruit-virus-sybr-qpcr-standard-curve.md, made with the maths of the
// qPCR analyser (src/lib/sci/qpcr.ts: stdCurve, quantify) and the Primer checker (src/lib/sci/primer.ts).
// Run: node scripts/blog-figures/eapv-passion-fruit-virus-sybr-qpcr-standard-curve.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { stdCurve, quantify } from '../../src/lib/sci/qpcr.ts';
import * as P from '../../src/lib/sci/primer.ts';
import { chart, figure, inject, COLOURS } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/eapv-passion-fruit-virus-sybr-qpcr-standard-curve.md', import.meta.url);

// Inputs. "Paper": Zhou et al. (2026), PLOS ONE, doi:10.1371/journal.pone.0356266 (CC BY 4.0).
const SLOPE = -3.562, INTERCEPT = 42.834;   // standard curve Ct = slope × log10(copies/µL) + intercept, paper
const EFF_PAPER = 90.9, R2_PAPER = 0.992;   // %, paper
const LOWEST = 11.41e2, HIGHEST = 11.41e9;  // copies/µL, the paper's linear range (11.41 × 10² to 11.41 × 10⁹)
const FWD = 'GCTCAGCCAACATTGAGACA', REV = 'GTGCTACCGCTTCTCTTGCT'; // qEAPVF / qEAPVR, paper
// Mean Ct and the copies/µL the paper reports for each, at 3, 7, 14, 21 and 28 days after inoculation (paper, results).
const DAYS = [3, 7, 14, 21, 28];
const INOC = { ct: [26.49, 33.99, 35.28, 34.93, 34.47], copies: [3.4e5, 3.1e3, 1.4e3, 1.7e3, 2.3e3] };
const SYST = { ct: [30.82, 28.66, 30.44, 31.17, 29.38], copies: [5.8e4, 2.1e5, 7.3e4, 4.7e4, 1.4e5] };
const CK = 39.30; // negative control Ct, paper

// Our reconstruction: the eight ten-fold standards the range implies, placed exactly on the published line
// (the paper's raw standard Ct values are not used; real points scatter, hence its R² of 0.992 rather than 1).
const stdQ = [2, 3, 4, 5, 6, 7, 8, 9].map((e) => 11.41 * 10 ** e);
const stdC = stdQ.map((q) => +(SLOPE * Math.log10(q) + INTERCEPT).toFixed(2));
const cv = stdCurve(stdQ, stdC);
const ours = (cts) => cts.map((c) => quantify(cv, c));

// Figure 1: the standard curve and where the samples' Ct values fall on it.
const lx = [2.5, 10.5];
const fig1 = chart({
  title: 'The published standard curve and the leaf samples', xLabel: 'Copies per µL (log scale)', yLabel: 'Ct (cycle threshold)',
  series: [
    { name: 'Published line', kind: 'line', x: lx, y: lx.map((x) => +(SLOPE * x + INTERCEPT).toFixed(3)) },
    { name: 'Inoculated leaves', kind: 'dots', x: ours(INOC.ct).map((v) => +Math.log10(v).toFixed(3)), y: INOC.ct, size: 4 },
    { name: 'Upper leaves', kind: 'dots', x: ours(SYST.ct).map((v) => +Math.log10(v).toFixed(3)), y: SYST.ct, size: 4 },
  ],
  xDomain: [2, 10.5], yDomain: [5, 40], xTicks: [2, 4, 6, 8, 10], xFmt: (v) => `10^${v}`,
  bands: [{ x0: 2, x1: Math.log10(LOWEST), text: 'below lowest standard' }], hlines: [{ y: CK, text: 'negative control 39.3' }],
  desc: 'The standard curve falls from Ct 32 at the lowest standard to Ct 7 at the highest. Four of the inoculated-leaf samples have Ct values above 33, which places them below the lowest standard.', height: 300,
});

// Figure 2: copies reported in the paper against copies from the paper's own equation.
const repAll = [...INOC.copies, ...SYST.copies], ourAll = [...ours(INOC.ct), ...ours(SYST.ct)];
const fig2 = chart({
  title: 'Copies per µL: reported against recalculated', xLabel: 'Recalculated from the equation (log scale)', yLabel: 'Reported in the paper (log scale)',
  series: [
    { name: 'Equal', kind: 'line', x: [2, 6], y: [2, 6], colour: 'var(--muted)', dash: '4 4' },
    { name: 'Inoculated leaves', kind: 'dots', x: ours(INOC.ct).map((v) => +Math.log10(v).toFixed(3)), y: INOC.copies.map((v) => +Math.log10(v).toFixed(3)), size: 4, colour: COLOURS[1] },
    { name: 'Upper leaves', kind: 'dots', x: ours(SYST.ct).map((v) => +Math.log10(v).toFixed(3)), y: SYST.copies.map((v) => +Math.log10(v).toFixed(3)), size: 4, colour: COLOURS[2] },
  ],
  xDomain: [2, 6], yDomain: [2, 6], xTicks: [2, 3, 4, 5, 6], yTicks: [2, 3, 4, 5, 6], xFmt: (v) => `10^${v}`, yFmt: (v) => `10^${v}`,
  desc: 'Every reported copy number sits above the equal line: the paper reports 9 to 25 times more copies than its own standard curve equation gives for the same Ct.', height: 300,
});

const one = (s) => ({ len: s.length, gc: +(100 * P.gcCount(s) / s.length).toFixed(1), tmBasic: +P.tmBasic(s).toFixed(1), tmSalt50: +P.tmSalt(s, 50).toFixed(1), wallace: P.tmWallace(s), clamp: P.clamp(s), hairpin: P.hairpin(s).stem, self: P.dimer(s, s) });
const facts = {
  effFromSlope: +((10 ** (-1 / SLOPE) - 1) * 100).toFixed(2), effPaper: EFF_PAPER, r2Paper: R2_PAPER,
  ctLowest: +(SLOPE * Math.log10(LOWEST) + INTERCEPT).toFixed(2), ctHighest: +(SLOPE * Math.log10(HIGHEST) + INTERCEPT).toFixed(2),
  cyclesPerTenfold: -SLOPE, perfectSlope: +(-1 / Math.log10(2)).toFixed(3),
  ratioDetection: 1000, ctGap1000: +(-SLOPE * 3).toFixed(2),
  inoc: INOC.ct.map((c, i) => ({ ct: c, ours: +quantify(cv, c).toPrecision(3), paper: INOC.copies[i], ratio: +(INOC.copies[i] / quantify(cv, c)).toFixed(1) })),
  syst: SYST.ct.map((c, i) => ({ ct: c, ours: +quantify(cv, c).toPrecision(3), paper: SYST.copies[i], ratio: +(SYST.copies[i] / quantify(cv, c)).toFixed(1) })),
  ck: +quantify(cv, CK).toPrecision(3),
  fwd: one(FWD), rev: one(REV), cross: P.dimer(FWD, REV),
  ratioRange: [Math.min(...repAll.map((r, i) => r / ourAll[i])).toFixed(1), Math.max(...repAll.map((r, i) => r / ourAll[i])).toFixed(1)],
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curve', figure(fig1, 'Figure 1. The paper\'s standard curve (Ct = −3.562 × log copies + 42.834) and the mean Ct of the leaf samples, placed on it with the qPCR analyser\'s maths. Shaded: below the lowest standard of 1,141 copies/µL.'));
  md = inject(md, 'compare', figure(fig2, 'Figure 2. Copy numbers the paper reports for each leaf sample against the copies its own equation gives for the same Ct (qPCR analyser maths). Points on the dashed line would agree.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
