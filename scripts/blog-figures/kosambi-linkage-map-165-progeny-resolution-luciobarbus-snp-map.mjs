// Figures for src/blog/discoveries/kosambi-linkage-map-165-progeny-resolution-luciobarbus-snp-map.md, made with the
// maths of the Linkage map calculator (src/lib/sci/linkmap.ts: Haldane and Kosambi mapping functions and their inverses).
// Run: node scripts/blog-figures/kosambi-linkage-map-165-progeny-resolution-luciobarbus-snp-map.mjs
import fs from 'node:fs';
import { rfToCm, cmToRf } from '../../src/lib/sci/linkmap.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/kosambi-linkage-map-165-progeny-resolution-luciobarbus-snp-map.md', import.meta.url);

// Inputs from the paper: Wang et al. (2025), Front. Genet. 16: 1644874, doi:10.3389/fgene.2025.1644874 (CC BY 4.0).
// 165 F1 progeny, 50 linkage groups, Kosambi mapping function, 164,435 mapped SNPs, total length 6,429.95 cM (Table 4),
// average spacing of about 0.10 cM, 99.62 % of intervals under 5 cM, largest gap 28.37 cM.
const N = 165, SNPS = 164435, TOTAL = 6429.95, GAP = 28.37, GROUPS = 50;
// OUR assumption: both parents are informative, so each marker pair is followed through up to 2 × 165 meioses; and one
// crossover per 100 cM per meiosis (the definition of a centimorgan) to count how many crossovers the data can hold.
const MEIOSES = 2 * N;

const ks = Array.from({ length: 31 }, (_, k) => k);
const step = ks.map((k) => +rfToCm(k / N, 'kosambi').toFixed(3));
const fig1 = chart({
  title: 'Smallest steps a 165-progeny map can show', xLabel: 'Recombinant progeny counted between two markers', yLabel: 'Kosambi distance (cM)',
  series: [
    { name: 'Kosambi', kind: 'dots', x: ks.slice(0, 11), y: step.slice(0, 11), size: 3.5 },
  ],
  xDomain: [0, 10], yDomain: [0, 6.5], hlines: [{ y: 0.1, text: 'average spacing in the paper: 0.10 cM' }],
  desc: `Each extra recombinant among ${N} progeny adds about 0.6 cM, so the first step above zero is ${step[1]} cM. The paper's average spacing of 0.10 cM is far below that.`, height: 270,
});

const gaps = Array.from({ length: 61 }, (_, i) => i);
const expK = gaps.map((d) => +(cmToRf(d, 'kosambi') * N).toFixed(2)), expH = gaps.map((d) => +(cmToRf(d, 'haldane') * N).toFixed(2));
const fig2 = chart({
  title: 'Recombinants expected among 165 progeny', xLabel: 'Gap between two markers (cM)', yLabel: 'Expected recombinant progeny',
  series: [{ name: 'Kosambi', kind: 'line', x: gaps, y: expK }, { name: 'Haldane', kind: 'line', x: gaps, y: expH }],
  xDomain: [0, 60], yDomain: [0, 70],
  vlines: [{ x: 5, text: '5 cM' }, { x: GAP, text: '28.37 cM: the largest gap' }],
  desc: `Expected number of recombinant progeny among ${N} for a gap of 0 to 60 cM, by the Kosambi and Haldane functions. A 5 cM gap gives about ${(cmToRf(5, 'kosambi') * N).toFixed(1)}; the largest gap of 28.37 cM gives about ${(cmToRf(GAP, 'kosambi') * N).toFixed(0)}.`, height: 270,
});

const out = {
  firstStepK: step[1], firstStepH: +rfToCm(1 / N, 'haldane').toFixed(3), step2: step[2], step3: step[3], step5: step[5], step10: step[10],
  firstStepBothParents: +rfToCm(1 / MEIOSES, 'kosambi').toFixed(3),
  rf5: +cmToRf(5, 'kosambi').toFixed(4), rec5: +(cmToRf(5, 'kosambi') * N).toFixed(2),
  rfGap: +cmToRf(GAP, 'kosambi').toFixed(4), recGap: +(cmToRf(GAP, 'kosambi') * N).toFixed(1), recGapH: +(cmToRf(GAP, 'haldane') * N).toFixed(1),
  seGap: +Math.sqrt(cmToRf(GAP, 'kosambi') * (1 - cmToRf(GAP, 'kosambi')) / N).toFixed(4),
  rfGroup: +cmToRf(TOTAL / GROUPS, 'kosambi').toFixed(4), recGroup: +(cmToRf(TOTAL / GROUPS, 'kosambi') * N).toFixed(1),
  perGroup: +(TOTAL / GROUPS).toFixed(2), perGroupWrong: +(6425.95 / GROUPS).toFixed(2),
  meanSpacing: +(TOTAL / SNPS).toFixed(4), crossovers: Math.round(TOTAL / 100 * MEIOSES), snpsPerBin: +(SNPS / (TOTAL / 100 * MEIOSES)).toFixed(1),
  crossoversPerLG: +(TOTAL / GROUPS / 100).toFixed(2),
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'steps', figure(fig1, 'Figure 1. The Kosambi distance for 0 to 10 recombinant progeny out of 165. Distances between those dots cannot occur, however many markers are used.'));
  md = inject(md, 'expected', figure(fig2, 'Figure 2. Expected recombinant progeny out of 165 for gaps up to 60 cM. The two dashed lines mark a 5 cM gap and the largest gap in the paper.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
