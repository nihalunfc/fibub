// Figures for src/blog/discoveries/chatgpt-vs-student-essays-lexical-diversity-mtld-readability-recheck.md
// All maths from src/lib/sci/lexdiv.ts, the engine behind the Readability tool (#T504).
// Inputs: the values Fredrick and Craven (2025), Front. Educ. 10: 1616935 (CC BY 4.0) report for
// 50 ChatGPT texts and 50 timed student essays. The passages below are our own, written for this article.
import { readFileSync, writeFileSync } from 'node:fs';
import { tokens, diversity, readability, easeBand } from '../../src/lib/sci/lexdiv.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/chatgpt-vs-student-essays-lexical-diversity-mtld-readability-recheck.md', import.meta.url);
const r2 = (v) => Math.round(v * 100) / 100, r3 = (v) => Math.round(v * 1000) / 1000;

// --- The paper's reported values.
const PAPER = {
  gpt: { ttr: 0.69, mtld: 118, vocd: 105, mlt: 15.91, dct: 0.75, fkgl: 16.61, fog: 20.10 },
  stu: { ttr: 0.61, mtld: 66.56, vocd: 69.73, mlt: 23.61, dct: 0.57, fkgl: 12.12, fog: 14.18 },
};

// --- A model text: words drawn from a vocabulary whose frequencies follow a Zipf law of exponent s.
// It is a model of word choice with no grammar, so it is an upper bound on how diverse real prose looks.
const rng = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
function zipf(s, N, V, seed) {
  let tot = 0; const w = [];
  for (let i = 1; i <= V; i++) { const p = 1 / Math.pow(i, s); w.push(p); tot += p; }
  const cum = []; let c = 0; for (const p of w) { c += p / tot; cum.push(c); }
  const r = rng(seed), out = [];
  for (let k = 0; k < N; k++) {
    const u = r(); let lo = 0, hi = V - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < u) lo = m + 1; else hi = m; }
    out.push('w' + lo);
  }
  return out;
}

// Figure 1: how each measure answers the question "how varied is this text?" as the text gets longer.
const lengths = [60, 80, 100, 140, 180, 240, 300, 350, 420, 500, 650, 800, 1000];
const atLen = lengths.map((N) => diversity(zipf(1.0, N, 3000, 11)));
const lenSvg = chart({
  title: 'The same writer, longer text: only TTR slides',
  xLabel: 'Length of the text (words)', yLabel: 'Diversity measure (0 to 1)',
  series: [
    { name: 'TTR', x: lengths, y: atLen.map((d) => d.ttr), kind: 'line' },
    { name: 'MATTR (50)', x: lengths, y: atLen.map((d) => d.mattr), kind: 'line' },
    { name: 'HD-D (42)', x: lengths, y: atLen.map((d) => d.hdd), kind: 'line' },
  ],
  yDomain: [0.3, 1],
  desc: 'Type-token ratio, moving-average TTR and HD-D against text length for model texts drawn from one fixed vocabulary. TTR falls from 0.72 to 0.43 while the other two stay nearly flat.',
  height: 290,
});

// Figure 2: MTLD against TTR at a fixed 350 words, the length of a timed essay.
const expos = Array.from({ length: 41 }, (_, i) => 0.6 + i * 0.02);
const fixed = expos.map((s) => diversity(zipf(s, 350, 3000, 11)));
const keep = fixed.filter((d) => d.ttr <= 0.82);
const interp = (target) => {
  const xs = fixed.map((d) => d.ttr), ys = fixed.map((d) => d.mtld);
  for (let i = 1; i < xs.length; i++) {
    const [a, b] = [xs[i - 1], xs[i]];
    if ((target >= Math.min(a, b)) && (target <= Math.max(a, b))) return ys[i - 1] + ((target - a) / (b - a)) * (ys[i] - ys[i - 1]);
  }
  return NaN;
};
const mtldSvg = chart({
  title: 'MTLD is a stretched version of TTR',
  xLabel: 'Type-token ratio of a 350-word text', yLabel: 'MTLD of the same text',
  series: [
    { name: 'Model texts', x: keep.map((d) => d.ttr), y: keep.map((d) => d.mtld), kind: 'line' },
    { name: 'Paper’s two groups', x: [PAPER.stu.ttr, PAPER.gpt.ttr], y: [PAPER.stu.mtld, PAPER.gpt.mtld], kind: 'dots', size: 5 },
  ],
  yDomain: [0, 420],
  desc: 'MTLD against type-token ratio for model texts of 350 words. The curve climbs steeply, so the small TTR gap and the large MTLD gap the paper reports are two views of one difference.',
  height: 290,
});

// Figure 3: what the two readability indices together demand of the writing.
// Flesch-Kincaid: 0.39 L + 11.8 P - 15.59, so P = (FKGL + 15.59 - 0.39 L) / 11.8.
// Gunning fog: 0.4 (L + 100 C), so 100 C = fog / 0.4 - L.
const Ls = Array.from({ length: 61 }, (_, i) => 10 + i * 0.5);
const implP = (fkgl, L) => (fkgl + 15.59 - 0.39 * L) / 11.8;
const implC = (fog, L) => fog / 0.4 - L;
const readSvg = chart({
  title: 'What a Flesch-Kincaid grade of 16.6 demands',
  xLabel: 'Words per sentence', yLabel: 'Syllables per word it implies',
  series: [
    { name: 'ChatGPT (FKGL 16.61)', x: Ls, y: Ls.map((L) => implP(PAPER.gpt.fkgl, L)), kind: 'line' },
    { name: 'Students (FKGL 12.12)', x: Ls, y: Ls.map((L) => implP(PAPER.stu.fkgl, L)), kind: 'line' },
  ],
  bands: [{ x0: 10, x1: 40, text: '' }],
  hlines: [{ y: 1.8, text: 'hard academic English' }, { y: 1.4, text: 'plain English' }],
  vlines: [{ x: PAPER.gpt.mlt, text: 'T-unit 15.9', left: true }, { x: PAPER.stu.mlt, text: 'T-unit 23.6' }],
  yDomain: [1, 2.6],
  desc: 'Syllables per word implied by each reported Flesch-Kincaid grade, as a function of words per sentence. For the ChatGPT grade of 16.61 the implied figure only becomes ordinary once sentences run past about 30 words.',
  height: 300,
});

// --- A real-prose anchor: a passage written for this article (expository English, no quotation).
const PASSAGE = `Every piece of writing repeats itself. Articles, prepositions and the verb to be come back in almost
every sentence, while the words that carry the argument appear once or twice and then give way to others. A measure of
lexical diversity tries to put a number on that balance. The oldest of them simply divides the number of different words
by the number of words, which sounds fair until you notice that a long text has more chances to repeat and so is punished
for its length alone. Two writers of equal richness will get different scores if one of them wrote more. For short
answers the problem is mild. For essays it is severe, and for a book it makes the measure useless. The usual repairs
take one of two shapes. The first keeps the window small and moves it along the text, averaging the ratio over every
stretch of fifty words, so length cannot creep in. The second asks a different question: how many words can you read
before the ratio drops below some agreed level, and how many such stretches fit into the text. That second idea gives a
number in words rather than a fraction, which makes it easier to read and harder to compare across studies, because the
agreed level is a choice. A third family treats the text as a bag of words and works out, from the frequencies alone,
what ratio a random sample of a fixed size would be expected to show. All three repairs agree on the direction of large
differences and quarrel over small ones. That matters when a study compares two sets of texts and reports a gap. If the
gap is wide on one measure and narrow on another, the measures are not disagreeing about the texts; they are reporting
the same difference on scales that stretch differently. Anyone reading such a comparison should ask what length the
texts were, which threshold or window was used, and whether the words were counted as they appeared or reduced to their
dictionary forms first. Those three choices move the numbers more than most of the differences people write about.`;
const pTok = tokens(PASSAGE), pDiv = diversity(pTok), pRead = readability(PASSAGE);

const SHORT = `A measure of lexical diversity puts a number on repetition. The oldest one divides the different words by
all the words, which punishes a long text for its length alone. A moving window of fifty words avoids that, and so does
a measure that asks how far you can read before the ratio drops. A third kind works out what a random sample of a fixed
size would show. All of them agree on big differences and quarrel over small ones, so a study that reports a wide gap on
one scale and a narrow gap on another is not catching a contradiction. It is reading one difference off two rulers.`;
const sTok = tokens(SHORT), sDiv = diversity(sTok), sRead = readability(SHORT);

let md = readFileSync(ART, 'utf8');
md = inject(md, 'len', figure(lenSvg, 'Figure 1. Three diversity measures on model texts drawn from one fixed vocabulary, so the "writer" never changes. The plain type-token ratio falls by almost a third as the text grows; the moving-average TTR and HD-D barely move. Model texts, not the paper’s essays.'));
md = inject(md, 'mtld', figure(mtldSvg, 'Figure 2. MTLD against type-token ratio for 350-word model texts, with the paper’s two reported pairs marked. The curve is steep, which is why a 0.08 gap in TTR goes with a gap of tens of words in MTLD.'));
md = inject(md, 'read', figure(readSvg, 'Figure 3. The syllables per word each reported Flesch-Kincaid grade implies, for any average sentence length. The paper’s own mean T-unit lengths are marked; the horizontal lines show the range ordinary English prose occupies.'));
writeFileSync(ART, md);

console.log('passage: words', pDiv.N, 'types', pDiv.V, 'TTR', r3(pDiv.ttr), 'rTTR', r2(pDiv.rttr), 'MATTR', r3(pDiv.mattr), 'MTLD', r2(pDiv.mtld), 'HD-D', r3(pDiv.hdd), 'K', r2(pDiv.yuleK));
console.log('passage readability: FRE', r2(pRead.fre), easeBand(pRead.fre), 'FKGL', r2(pRead.fkgl), 'fog', r2(pRead.fog), 'SMOG', r2(pRead.smog), 'CLI', r2(pRead.cli), 'ARI', r2(pRead.ari), 'words/sentence', r2(pRead.words / pRead.sentences), 'syll/word', r3(pRead.syllables / pRead.words), 'complex %', r2((100 * pRead.complex) / pRead.words));
console.log('short: words', sDiv.N, 'types', sDiv.V, 'TTR', r3(sDiv.ttr), 'MATTR', r3(sDiv.mattr), 'MTLD', r2(sDiv.mtld), 'HD-D', r3(sDiv.hdd), 'K', r2(sDiv.yuleK), '| FRE', r2(sRead.fre), easeBand(sRead.fre), 'FKGL', r2(sRead.fkgl), 'fog', r2(sRead.fog), 'sentences', sRead.sentences);
console.log('TTR by length (model, s=1.0):', lengths.map((N, i) => `${N}:${r3(atLen[i].ttr)}`).join(' '));
console.log('MATTR by length:', lengths.map((N, i) => `${N}:${r3(atLen[i].mattr)}`).join(' '));
console.log('HD-D by length:', lengths.map((N, i) => `${N}:${r3(atLen[i].hdd)}`).join(' '));
console.log('model MTLD at TTR 0.61:', r2(interp(0.61)), 'at TTR 0.69:', r2(interp(0.69)));
for (const [tag, p] of [['gpt', PAPER.gpt], ['stu', PAPER.stu]]) {
  console.log(tag, 'fog needs L + 100C =', r2(p.fog / 0.4));
  for (const L of [p.mlt, 20, 25, 30, 35]) console.log('   L', r2(L), '-> syllables/word', r3(implP(p.fkgl, L)), ', complex words', r2(implC(p.fog, L)), '%');
}
