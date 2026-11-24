// Figures for src/blog/discoveries/nanodrop-denovix-qubit-bacterial-dna-rna-carryover-a260-ratio.md, made with the maths
// of the Nucleic acid concentration tool (src/lib/sci/nucconc.ts: conc, copies, molarMass, purity, FACTOR).
// Run: node scripts/blog-figures/nanodrop-denovix-qubit-bacterial-dna-rna-carryover-a260-ratio.mjs
import fs from 'node:fs';
import { copies, molarMass, purity, FACTOR } from '../../src/lib/sci/nucconc.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/nanodrop-denovix-qubit-bacterial-dna-rna-carryover-a260-ratio.md', import.meta.url);

// Inputs from the paper: Versmessen et al. (2024), PLoS ONE 19(6): e0305650, doi:10.1371/journal.pone.0305650 (CC BY 4.0).
// 78 Streptococcus pneumoniae DNA extracts. Central values (ng/µL) and A260/A280, before (T1) and after (T2) freezing.
const PAPER = [
  { id: 'T1 DeNovix', q: 40, spec: 126.93, r280: 1.99 }, { id: 'T1 NanoDrop', q: 40, spec: 146.72, r280: 2.01 },
  { id: 'T2 DeNovix', q: 41.90, spec: 128.49, r280: 2.05 }, { id: 'T2 NanoDrop', q: 41.90, spec: 116.55, r280: 1.98 },
];
// OUR assumptions: the fluorescent dye (Qubit) counts DNA only; pure DNA reads A260/A280 1.8 and RNA 2.0 to 2.1;
// the rest of the A260 is RNA at 40 µg/mL per absorbance unit.
const RD = 1.8, RR = [2.0, 2.1];
const ratio = (s, rr) => 1 / (s / rr + (1 - s) / RD);    // A260/A280 of a mixture whose RNA supplies share s of the A260
const GENOME_BP = 2.1e6;                                  // approximate pneumococcal genome size (OUR assumption; not from the paper)

const rows = PAPER.map((p) => {
  const a260 = p.spec / FACTOR.ds;                        // the absorbance the reader must have seen, 1 cm path
  const aDna = p.q / FACTOR.ds;              // absorbance that dsDNA at the Qubit value would give
  const s = 1 - aDna / a260;                              // share of the A260 that is not DNA
  return { ...p, a260, aDna, s, over: p.spec / p.q, rnaNg: (a260 - aDna) * FACTOR.rna, pred: RR.map((rr) => ratio(s, rr)) };
});
const pure = { over: 2.06 }; pure.s = 1 - 1 / pure.over; pure.pred = RR.map((rr) => ratio(pure.s, rr));

const ss = Array.from({ length: 81 }, (_, i) => i / 100);
const fig1 = chart({
  title: 'A260/A280 of DNA with RNA carry-over', xLabel: 'Share of the A260 that comes from RNA', yLabel: 'A260/A280',
  series: [
    { name: 'RNA reads 2.0', kind: 'line', x: ss, y: ss.map((s) => +ratio(s, 2.0).toFixed(3)) },
    { name: 'RNA reads 2.1', kind: 'line', x: ss, y: ss.map((s) => +ratio(s, 2.1).toFixed(3)) },
    { name: 'Paper, T1 DeNovix (1.99)', kind: 'dots', x: [rows[0].s], y: [1.99], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [0, 0.8], yDomain: [1.75, 2.15], hlines: [{ y: 2.0, text: 'tool flags DNA above 2.0' }],
  desc: `Predicted A260/A280 of a DNA sample as RNA supplies more of the A260. At the RNA share of ${(rows[0].s * 100).toFixed(0)} % that the Qubit comparison implies, the ratio is ${rows[0].pred[0].toFixed(2)} to ${rows[0].pred[1].toFixed(2)}, and the paper reports 1.99.`, height: 280,
});
const fig2 = chart({
  title: 'How far A260 overstates the DNA', xLabel: 'Share of the A260 that comes from RNA', yLabel: 'A260 reading ÷ true DNA',
  series: [{ name: 'overstatement', kind: 'line', x: ss, y: ss.map((s) => +(1 / (1 - s)).toFixed(3)), noLegend: true },
    { name: 'paper', kind: 'dots', x: rows.map((r) => r.s), y: rows.map((r) => +r.over.toFixed(2)), size: 4.5, noLegend: true, colour: 'var(--c-tools)' }],
  xDomain: [0, 0.8], yDomain: [1, 5.5], hlines: [{ y: 1, text: '' }],
  desc: `The A260 concentration divided by the true DNA concentration rises steeply with the RNA share. The four paper comparisons sit at ${rows.map((r) => r.over.toFixed(2)).join(', ')}.`, height: 270,
});

const mwG = molarMass('ds', GENOME_BP, '', true);
const out = {
  rows: rows.map((r) => ({ id: r.id, a260: +r.a260.toFixed(3), aDna: +r.aDna.toFixed(3), over: +r.over.toFixed(2), rnaShare: +r.s.toFixed(3), rnaNgUl: +r.rnaNg.toFixed(1), pred: r.pred.map((v) => +v.toFixed(3)), obs: r.r280 })),
  pure: { over: 2.06, s: +pure.s.toFixed(3), pred: pure.pred.map((v) => +v.toFixed(3)) },
  purityDeNovix199: purity('ds', 1.99, 2.33), purity205: purity('ds', 2.05, 2.34),
  genomeMW: Math.round(mwG), copiesQubit: +copies(40, mwG).toExponential(3), copiesDeNovix: +copies(126.93, mwG).toExponential(3),
  copiesRatio: +(copies(126.93, mwG) / copies(40, mwG)).toFixed(2), a260at40: +(40 / FACTOR.ds).toFixed(2),
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratio', figure(fig1, 'Figure 1. The A260/A280 ratio of a DNA sample as RNA supplies more of the A260 (our mixing model). The dot is the first-timepoint DeNovix result placed at the RNA share implied by comparing it with the Qubit value.'));
  md = inject(md, 'over', figure(fig2, 'Figure 2. How many times the A260 reading overstates the DNA as RNA carry-over grows. The four dots are the paper\'s four spectrophotometer-to-Qubit comparisons, placed at the RNA share each implies.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
