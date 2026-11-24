// Figures and numbers for src/blog/discoveries/slice-level-versus-subject-level-cross-validation-leakage.md, made with
// the maths of the Train-test split tool (src/lib/sci/split.ts: kfold, groupKfold, groupSplit, stratifiedSplit,
// balance), which follows scikit-learn's rules for how many rows go where.
// Run: node scripts/blog-figures/slice-level-versus-subject-level-cross-validation-leakage.mjs
import fs from 'node:fs';
import { kfold, groupKfold, groupSplit, stratifiedSplit, balance } from '../../src/lib/sci/split.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/slice-level-versus-subject-level-cross-validation-leakage.md', import.meta.url);

// The paper: Yildiz O. and Subasi A. (2026), Applied Sciences 16(9): 4338 (CC BY 4.0). Figures it states: 347
// subjects, 86,437 axial MRI slices (about 250 per subject), 78 % non-demented against 22 % demented at image level
// (a 3.5:1 imbalance), two subjects with moderate dementia (488 images), 10-fold cross-validation at image level and
// at subject level, image-level accuracy 0.9999 and subject-level 0.808.
const SUBJECTS = 347, SLICES = 86437, K = 10, DEMENTED = 76; // 76 of 347 subjects = 21.9 %, OUR assumption
const base = Math.floor(SLICES / SUBJECTS), extra = SLICES - base * SUBJECTS; // 249 slices each, 34 subjects with 250
const perSubject = Array.from({ length: SUBJECTS }, (_, i) => base + (i < extra ? 1 : 0));

// Build the slice table: one row per slice, with its subject and its subject-level label.
const subjectOf = [], labelOf = [], subjectLabel = [];
for (let s = 0; s < SUBJECTS; s++) {
  const lab = (s * DEMENTED) % SUBJECTS < DEMENTED ? 'demented' : 'non-demented'; // 76 of 347, spread evenly (OUR assumption)
  subjectLabel.push(lab);
  for (let j = 0; j < perSubject[s]; j++) { subjectOf.push(`S${String(s).padStart(3, '0')}`); labelOf.push(lab); }
}
const dementedSlices = labelOf.filter((l) => l === 'demented').length;

// 1. Record-wise (slice-level) 10-fold: how many subjects have slices in both the training and the test part?
const rw = kfold(SLICES, K, 7);
const leaked = [];
for (let f = 0; f < K; f++) {
  const inFold = new Set(), outFold = new Set();
  for (let i = 0; i < SLICES; i++) (rw[i] === f ? inFold : outFold).add(subjectOf[i]);
  leaked.push([...inFold].filter((s) => outFold.has(s)).length);
}

// 2. Subject-wise (grouped) 10-fold with the same tool.
const gw = groupKfold(subjectOf, K);
const foldSlices = new Array(K).fill(0), foldSubjects = Array.from({ length: K }, () => new Set());
for (let i = 0; i < SLICES; i++) { foldSlices[gw[i]]++; foldSubjects[gw[i]].add(subjectOf[i]); }
const gLeaked = (() => {
  let bad = 0;
  const seen = new Map();
  for (let i = 0; i < SLICES; i++) { const p = seen.get(subjectOf[i]); if (p === undefined) seen.set(subjectOf[i], gw[i]); else if (p !== gw[i]) bad++; }
  return bad;
})();
// The two moderate-dementia subjects: how many of the ten folds can contain one?
const moderate = ['S000', 'S001'];
const moderateFolds = new Set(moderate.map((s) => gw[subjectOf.indexOf(s)]));

// 3. The chance that a subject with n slices stays inside one fold of a record-wise 10-fold split.
const pWhole = (n) => { let p = 1; for (let i = 0; i < n; i++) p *= (SLICES / K - i) / (SLICES - i); return K * p; };
const NS = Array.from({ length: 12 }, (_, i) => i + 1);

// 4. A memoriser: label a test slice by the other slices of the same subject that are in the training part, and fall
// back on the training majority class. This is the leak, in its simplest form.
const memorise = (fold) => {
  let right = 0, used = 0;
  const majority = 'non-demented';
  for (let f = 0; f < K; f++) {
    const train = new Set();
    for (let i = 0; i < SLICES; i++) if (fold[i] !== f) train.add(subjectOf[i]);
    for (let i = 0; i < SLICES; i++) {
      if (fold[i] !== f) continue;
      used++;
      const guess = train.has(subjectOf[i]) ? labelOf[i] : majority;
      if (guess === labelOf[i]) right++;
    }
  }
  return right / used;
};
const accRecord = memorise(rw), accGroup = memorise(gw);

// 5. How much does the class mix of a test set move when whole subjects move? 200 grouped 80/20 splits against one
// stratified slice-level split.
const shares = [];
for (let seed = 1; seed <= 200; seed++) {
  const set = groupSplit(subjectOf, 0.2, 0, seed);
  const b = balance(labelOf, set, 3), di = b.classes.indexOf('demented');
  const test = b.classes.map((_, c) => b.counts[c][1]);
  shares.push((100 * test[di]) / test.reduce((s, v) => s + v, 0));
}
const sorted = shares.slice().sort((a, b) => a - b);
const strat = (() => {
  const set = stratifiedSplit(labelOf, 0.2, 0, 1), b = balance(labelOf, set, 3), di = b.classes.indexOf('demented');
  const test = b.classes.map((_, c) => b.counts[c][1]);
  return (100 * test[di]) / test.reduce((s, v) => s + v, 0);
})();

const fig1 = chart({
  title: 'A slice-level fold cannot keep a subject together',
  xLabel: 'Slices per subject', yLabel: 'Chance the subject stays in one fold (%)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: NS, y: NS.map((n) => +(100 * pWhole(n)).toFixed(4)) },
    { name: '', noLegend: true, kind: 'dots', x: NS, y: NS.map((n) => +(100 * pWhole(n)).toFixed(4)), size: 3 },
  ],
  xDomain: [1, 12], yDomain: [0, 100], xTicks: NS,
  hlines: [{ y: 0.1, text: 'one in a thousand' }],
  desc: 'With ten folds, a subject with three slices has a one-in-a-hundred chance of staying inside one fold, and with six slices one in a hundred thousand. At 249 slices it is impossible in practice.',
  height: 250,
});

const fig2 = chart({
  title: 'Class mix of the test set when whole subjects move',
  xLabel: 'The 200 grouped splits, sorted', yLabel: 'Demented share of test slices (%)',
  series: [
    { name: 'grouped 80/20 splits', kind: 'line', x: sorted.map((_, i) => i + 1), y: sorted.map((v) => +v.toFixed(2)) },
    { name: 'stratified slice-level split', kind: 'line', x: [1, 200], y: [+strat.toFixed(2), +strat.toFixed(2)], dash: '5 4' },
  ],
  xDomain: [1, 200], yDomain: [10, 35],
  desc: 'Across 200 grouped 80/20 splits the demented share of the test slices runs from about 14 to 31 per cent, while a stratified slice-level split holds it at 22 per cent, which is exactly why the grouped split is the honest one and the harder one.',
  height: 260,
});

console.log(JSON.stringify({
  cohort: { subjects: SUBJECTS, slices: SLICES, slicesPerSubject: [base, base + 1], subjectsWithExtra: extra, dementedSubjects: subjectLabel.filter((l) => l === 'demented').length, dementedSlices, dementedSlicePct: +((100 * dementedSlices) / SLICES).toFixed(2) },
  recordWise: { leakedSubjectsPerFold: leaked, foldSizes: Array.from({ length: K }, (_, f) => rw.reduce((s, v) => s + (v === f ? 1 : 0), 0)) },
  grouped: { subjectsPerFold: foldSubjects.map((s) => s.size), slicesPerFold: foldSlices, slicesSplitAcrossFolds: gLeaked, foldsHoldingAModerateSubject: moderateFolds.size },
  chanceWholeFold: NS.map((n) => ({ n, pct: +(100 * pWhole(n)).toPrecision(3) })),
  memoriser: { recordWise: +accRecord.toFixed(4), grouped: +accGroup.toFixed(4), paperImageLevel: 0.9999, paperSubjectLevel: 0.808 },
  testMix: { stratifiedSlicePct: +strat.toFixed(2), groupedMin: +sorted[0].toFixed(2), groupedMax: +sorted[199].toFixed(2), grouped2_5: +sorted[4].toFixed(2), grouped97_5: +sorted[194].toFixed(2), median: +sorted[99].toFixed(2) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'chance', figure(fig1, 'Figure 1. The chance that all of one subject\'s slices land in the same fold of a ten-fold slice-level split, worked out for one to twelve slices. Beyond about six slices the subject is certain to appear on both sides, and the MRI study has roughly 250 slices each.'));
  md = inject(md, 'mix', figure(fig2, 'Figure 2. Our simulation with the tool\'s grouped and stratified splits on a cohort of 347 subjects: the class mix of the test set when whole subjects move, over 200 seeds, against one stratified slice-level split.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
