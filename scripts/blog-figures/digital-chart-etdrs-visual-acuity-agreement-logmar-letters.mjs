// Figures for src/blog/discoveries/digital-chart-etdrs-visual-acuity-agreement-logmar-letters.md, made with the
// maths of the Visual acuity converter (src/lib/sci/acuity.ts: fromLogMAR, toLogMAR, meanAcuity, nearestLine).
// Run: node scripts/blog-figures/digital-chart-etdrs-visual-acuity-agreement-logmar-letters.mjs
import fs from 'node:fs';
import { fromLogMAR, toLogMAR, meanAcuity, parseValue, nearestLine } from '../../src/lib/sci/acuity.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/digital-chart-etdrs-visual-acuity-agreement-logmar-letters.md', import.meta.url);

// From the paper: Yu Z (2026), Ups. J. Med. Sci. 131: e13537 (CC BY 4.0): mean difference -0.03 logMAR,
// 95 % CI about +/- 0.04 logMAR, a 0.1 logMAR resolution threshold, 42 subjects in four acuity classes.
const DIFF = -0.03, CI = 0.04, THRESH = 0.1;
const letters = (l) => fromLogMAR(l).letters;

// Figure 1: what one chart line costs in Snellen metres, across the chart.
const xs = Array.from({ length: 81 }, (_, i) => -0.3 + i * 0.02);
const fig1 = chart({
  title: 'What one chart line costs, across the chart', xLabel: 'Acuity (logMAR)', yLabel: 'Snellen denominator (6/x metres)',
  series: [
    { name: 'Acuity', kind: 'line', x: xs, y: xs.map((l) => +fromLogMAR(l).metres.toFixed(2)) },
    { name: 'One line worse (+0.1 logMAR)', kind: 'line', x: xs, y: xs.map((l) => +fromLogMAR(l + THRESH).metres.toFixed(2)) },
  ],
  xDomain: [-0.3, 1.3], yDomain: [0, 80],
  desc: 'The Snellen denominator in metres against logMAR, and the same acuity one chart line (0.1 logMAR) worse. The gap between the curves is 1.55 metres at 6/6 and 15.5 metres at 6/60, so equal logMAR steps are very unequal Snellen steps.',
  height: 265,
});

// Figure 2: the error, in ETDRS letters, from averaging two acuities on the wrong scale.
const gaps = Array.from({ length: 61 }, (_, i) => i * 0.02);
const errDecimal = gaps.map((g) => {
  const corr = meanAcuity([0, g]);
  const dec = (fromLogMAR(0).decimal + fromLogMAR(g).decimal) / 2;
  return +(letters(toLogMAR('decimal', dec)) - corr.letters).toFixed(3);
});
const errMar = gaps.map((g) => {
  const corr = meanAcuity([0, g]);
  const mar = (fromLogMAR(0).mar + fromLogMAR(g).mar) / 2;
  return +(letters(Math.log10(mar)) - corr.letters).toFixed(3);
});
const fig2 = chart({
  title: 'Averaging acuity on the wrong scale', xLabel: 'Difference between the two acuities (logMAR)', yLabel: 'Error (ETDRS letters)',
  series: [
    { name: 'Averaged as decimal acuity', kind: 'line', x: gaps, y: errDecimal },
    { name: 'Averaged as MAR or Snellen', kind: 'line', x: gaps, y: errMar },
  ],
  xDomain: [0, 1.2], yDomain: [-14, 14], hlines: [{ y: 0, text: 'logMAR average (correct)' }, { y: 5, text: 'one chart line' }],
  desc: 'How far the mean of two acuities lands from the correct logMAR average, in ETDRS letters, as the two acuities grow apart. Averaging decimal acuity flatters the pair; averaging the resolution angle or the Snellen denominator punishes it.',
  height: 265,
});

const row = (l) => { const a = fromLogMAR(l); return { logmar: l, decimal: +a.decimal.toFixed(4), mar: +a.mar.toFixed(3), metres: +a.metres.toFixed(1), feet: +a.feet.toFixed(1), vas: +a.vas.toFixed(1), letters: +a.letters.toFixed(1) }; };
const four = [0, 0.3010299956639812, 0.6020599913279624, 1];
const fourDec = four.reduce((s, l) => s + fromLogMAR(l).decimal, 0) / 4;
console.log(JSON.stringify({
  table: [DIFF, 0, 0.03, THRESH, 0.3, 1].map(row),
  diffLetters: +(letters(0) - letters(Math.abs(DIFF))).toFixed(2), ciLetters: +(CI / 0.02).toFixed(2),
  threshLetters: +(THRESH / 0.02).toFixed(2), ratio01: +(10 ** THRESH).toFixed(6), ratio003: +(10 ** 0.03).toFixed(6),
  lineCostAt6_6: +(fromLogMAR(THRESH).metres - fromLogMAR(0).metres).toFixed(2),
  lineCostAt6_60: +(fromLogMAR(1 + THRESH).metres - fromLogMAR(1).metres).toFixed(2),
  pairs: [[0, parseValue('6/12').logmar], [0, parseValue('6/24').logmar], [0, 1]].map(([a, b]) => {
    const corr = meanAcuity([a, b]), dec = (fromLogMAR(a).decimal + fromLogMAR(b).decimal) / 2, mar = (fromLogMAR(a).mar + fromLogMAR(b).mar) / 2;
    return { gap: +b.toFixed(4), correct: +corr.logmar.toFixed(4), correctMetres: +corr.metres.toFixed(1), correctLetters: +corr.letters.toFixed(1),
      decimalMean: +toLogMAR('decimal', dec).toFixed(6), decimalErrLetters: +(letters(toLogMAR('decimal', dec)) - corr.letters).toFixed(3),
      marMean: +Math.log10(mar).toFixed(4), marErrLetters: +(letters(Math.log10(mar)) - corr.letters).toFixed(3) };
  }),
  fourClass: { correct: +meanAcuity(four).logmar.toFixed(4), correctMetres: +meanAcuity(four).metres.toFixed(1), correctLetters: +meanAcuity(four).letters.toFixed(1),
    decimalMean: +toLogMAR('decimal', fourDec).toFixed(6), decimalLetters: +letters(toLogMAR('decimal', fourDec)).toFixed(1) },
  nearest026: { line: nearestLine(0.26).line.metres, plusLetters: nearestLine(0.26).letters },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'snellen', figure(fig1, "Figure 1. The Snellen denominator against logMAR, and the same acuity one chart line worse. One line costs 1.55 metres of denominator at 6/6 and 15.5 metres at 6/60: equal steps in logMAR are wildly unequal in Snellen. Computed from the converter's own formulas."));
  md = inject(md, 'avgbias', figure(fig2, 'Figure 2. The error from averaging two acuities on the wrong scale, in ETDRS letters, against how far apart the two acuities are. Zero is the correct logMAR average; the dashed line at five letters is one chart line.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
