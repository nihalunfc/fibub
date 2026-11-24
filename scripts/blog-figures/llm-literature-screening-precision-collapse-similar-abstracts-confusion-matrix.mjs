// Figures for src/blog/discoveries/llm-literature-screening-precision-collapse-similar-abstracts-confusion-matrix.md,
// made with the maths of the Confusion matrix tool (src/lib/sci/confusion.ts: metrics, binary, wilson).
// Run: node scripts/blog-figures/llm-literature-screening-precision-collapse-similar-abstracts-confusion-matrix.mjs
import fs from 'node:fs';
import { metrics, binary } from '../../src/lib/sci/confusion.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/llm-literature-screening-precision-collapse-similar-abstracts-confusion-matrix.md', import.meta.url);

// Inputs from the paper: Colangelo et al. (2025), BioMedInformatics 5(2): 25, doi:10.3390/biomedinformatics5020025 (CC BY).
// Each test set: 200 abstracts from one similarity quartile, 9 of them the review's target trials (stated for Q1 by the
// paper's own counts; OUR assumption for the other quartiles, which the stated accuracies and precisions fit).
// Recall is 100 % where the paper says so; false positives are rebuilt from the stated precision and accuracy.
const N = 200, POS = 9;
const CASES = [
  { id: 'Claude 3 Haiku, verbose, Q1', q: 1, fp: 5, said: { acc: 97.5, prec: 64.3 } },
  { id: 'Claude 3 Haiku, verbose, Q3', q: 3, fp: 7, said: { acc: 96.5, prec: 56.2 } },
  { id: 'Claude 3 Haiku, verbose, Q4', q: 4, fp: 47, said: { acc: 76.5, prec: 16.1 } },
  { id: 'Claude 3 Haiku, concise, Q1', q: 1, fp: 3, said: { acc: 98.5, prec: 75.0 } },
  { id: 'Claude 3 Haiku, concise, Q4', q: 4, fp: 69, said: { acc: 65.5, prec: 11.5 } },
  { id: 'GPT-3.5 Turbo, verbose, Q4', q: 4, fp: 21, said: { prec: 30, f1: 46.1 } },
  { id: 'GPT-4o, verbose, Q4', q: 4, fp: 1, said: { prec: 90, f1: 94.7 } },
  { id: 'GPT-4o, concise, Q4', q: 4, fp: 3, said: { prec: 75, f1: 85.7 } },
];
const pc = (x) => +(x * 100).toFixed(1);
const run = (tp, fn, fp, tn) => { const M = metrics(['relevant', 'other'], [[tp, fn], [fp, tn]]), b = binary(tp, fn, fp, tn); return { tp, fn, fp, tn, acc: pc(M.accuracy), accCI: M.accuracyCI.map(pc), prec: pc(b.ppv), precCI: b.ppvCI.map(pc), rec: pc(b.sensitivity), spec: pc(b.specificity), f1: pc(b.f1), bal: pc(M.balancedAccuracy), mcc: +M.mcc.toFixed(3), kappa: +M.kappa.toFixed(3) }; };
const res = CASES.map((c) => ({ ...c, ...run(POS, 0, c.fp, N - POS - c.fp) }));
// Baselines and the paper's fully stated small-model counts (Q1).
const rejectAll = run(0, POS, 0, N - POS);
const openHermes = run(1, 8, 1, 190), flanSingle = run(1, 8, 63, 128), flanFilter = run(9, 0, 13, 178);
// Precision against false positives, for a screener that keeps all 9 targets.
const FPs = Array.from({ length: 81 }, (_, i) => i);
const precCurve = FPs.map((fp) => run(POS, 0, fp, N - POS - fp));

const fig1 = chart({
  title: 'Keep all 9 targets: precision falls with each false alarm', xLabel: 'False positives among 191 other abstracts', yLabel: 'Percent',
  series: [
    { name: 'Precision', kind: 'line', x: FPs, y: precCurve.map((r) => r.prec) },
    { name: 'Accuracy', kind: 'line', x: FPs, y: precCurve.map((r) => r.acc), dash: '5 4' },
    { name: 'MCC × 100', kind: 'line', x: FPs, y: precCurve.map((r) => +(r.mcc * 100).toFixed(1)) },
    { name: '', noLegend: true, kind: 'dots', x: res.map((r) => r.fp), y: res.map((r) => r.prec), size: 3.5, colour: 'var(--c-blog)' },
  ],
  xDomain: [0, 80], yDomain: [0, 100],
  desc: `With all 9 targets found among 200 abstracts, precision drops from 100 % to ${precCurve[47].prec} % at 47 false positives, while accuracy stays at ${precCurve[47].acc} %. Dots mark the model runs rebuilt from the paper.`, height: 280,
});
const order = [6, 7, 5, 2, 4];
const fig2 = chart({
  title: 'Most similar quartile (Q4): precision with 95 % intervals', xLabel: 'Model and prompt', yLabel: 'Precision (%)',
  series: [{ name: 'Precision', kind: 'dots', x: [1, 2, 3, 4, 5], y: order.map((i) => res[i].prec), errors: order.map(() => 0), size: 4 },
    ...order.map((i, k) => ({ name: '', noLegend: true, kind: 'line', x: [k + 1, k + 1], y: res[i].precCI, colour: 'var(--c-blog)' }))],
  xDomain: [0.5, 5.5], yDomain: [0, 100], xTicks: [1, 2, 3, 4, 5], xFmt: (t) => ['', 'GPT-4o v', 'GPT-4o c', 'GPT-3.5 v', 'Haiku v', 'Haiku c'][t] ?? '',
  desc: `Precision and Wilson 95 % intervals in the most similar quartile: GPT-4o verbose ${res[6].prec} % (${res[6].precCI.join(' to ')}), Claude 3 Haiku concise ${res[4].prec} % (${res[4].precCI.join(' to ')}).`, height: 260,
});

console.log(JSON.stringify({ res: res.map(({ said, ...r }) => ({ ...r, said })), rejectAll, openHermes, flanSingle, flanFilter, at47: precCurve[47] }, null, 0).replace(/},/g, '},\n'));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curve', figure(fig1, 'Figure 1. A screener that keeps all 9 target trials among 200 abstracts: precision, accuracy and the Matthews correlation as false positives pile up, from the Confusion matrix tool\'s maths. Dots: the model runs rebuilt from the paper\'s stated precision and accuracy.'));
  md = inject(md, 'q4', figure(fig2, 'Figure 2. Precision in the most similar quartile for five model and prompt runs (v = verbose, c = concise), with Wilson 95 % intervals. Only 9 to 78 abstracts are kept per run, so the intervals are wide.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
