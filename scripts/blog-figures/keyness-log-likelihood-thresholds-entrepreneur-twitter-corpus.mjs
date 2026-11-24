// Figures for src/blog/discoveries/keyness-log-likelihood-thresholds-entrepreneur-twitter-corpus.md, made with the
// maths of the Corpus concordancer (src/lib/sci/kwic.ts: g2, the 2x2 log-likelihood used for collocation and keyness).
// Run: node scripts/blog-figures/keyness-log-likelihood-thresholds-entrepreneur-twitter-corpus.mjs
import fs from 'node:fs';
import { g2 } from '../../src/lib/sci/kwic.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/keyness-log-likelihood-thresholds-entrepreneur-twitter-corpus.md', import.meta.url);

// From the paper (Liu, Wang and Zhao 2025, PLOS ONE 20(8): e0331400, CC BY 4.0), all taken from its running text:
const F = 31124; // words in the female-entrepreneur corpus
const M = 27773; // words in the male-entrepreneur corpus
const CUT = 6.63; // the paper's keyness cut-off: log-likelihood above 6.63 (p < 0.01)
// Words the paper lists with a frequency in BOTH corpora (its "shared" key semantic categories).
const SHARED = [['help', 60, 46], ['support', 30, 31], ['helping', 25, 11], ['inspiring', 19, 10], ['thanks', 32, 41], ['grateful', 14, 17]];
// Words the paper lists for one corpus only (its "preferential" categories); the other corpus's count is not given,
// so we treat it as zero, which is the most generous possible reading. OUR ASSUMPTION.
const ONLY_F = [['work', 76], ['thank_you', 90], ['women', 67], ['family', 37], ['technology', 39], ['leadership', 28], ['female', 5], ['mother', 4], ['bravo', 5]];
const ONLY_M = [['telegram', 61], ['climate', 41], ['money', 14], ['students', 13], ['principles', 13], ['privacy', 11], ['tools', 5], ['objective', 2], ['encrypted', 2]];

// Keyness of a word: the 2x2 table [count in A, rest of A; count in B, rest of B].
const key = (a, b) => g2(a, F - a, b, M - b);
const shared = SHARED.map(([w, a, b]) => ({ w, a, b, g: key(a, b), pmA: (a / F) * 1e6, pmB: (b / M) * 1e6 }));
const onlyF = ONLY_F.map(([w, a]) => ({ w, a, g: key(a, 0) }));
const onlyM = ONLY_M.map(([w, b]) => ({ w, b, g: key(0, b) }));
// Our illustrative grouping: the four helping-and-supporting words that appear in both lists, added together.
const grouped = { a: 60 + 30 + 25 + 19, b: 46 + 31 + 11 + 10 };
grouped.g = key(grouped.a, grouped.b);

// The smallest whole count in the female corpus that clears the cut-off, when the word is `r` times rarer
// (per word of running text) in the male corpus. r = Infinity means the word is absent from it.
const minCount = (r) => { for (let a = 1; a <= 600; a++) { const b = r === Infinity ? 0 : (a / F) * M / r; if (key(a, b) >= CUT) return a; } return null; };
const RATIOS = [1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8, 10];
const mins = RATIOS.map(minCount);
const minAbsent = minCount(Infinity);
const minAbsentM = (() => { for (let b = 1; b <= 600; b++) if (key(0, b) >= CUT) return b; })();

// Figure 1: how keyness grows with the count, for three rate ratios, with the paper's words on top.
const counts = Array.from({ length: 91 }, (_, i) => i + 1);
const curve = (r) => counts.map((a) => key(a, r === Infinity ? 0 : (a / F) * M / r));
const fig1 = chart({
  title: 'Keyness against how often a word appears', xLabel: 'Times the word appears in the 31,124-word corpus', yLabel: 'Log-likelihood G²',
  series: [
    { name: 'absent from the other corpus', kind: 'line', x: counts, y: curve(Infinity) },
    { name: '3× rarer there', kind: 'line', x: counts, y: curve(3), colour: 'var(--c-tools)' },
    { name: 'same rate there', kind: 'line', x: counts, y: curve(1), colour: 'var(--muted)', dash: '5 4' },
    { name: "the paper's shared words", kind: 'dots', x: shared.map((s) => s.a), y: shared.map((s) => s.g), size: 3.4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 92], yDomain: [0, 130],
  hlines: [{ y: CUT, text: `cut-off 6.63 (p < 0.01)` }],
  desc: `Log-likelihood keyness against the number of times a word appears in a 31,124-word corpus, for a word absent from the 27,773-word comparison corpus, three times rarer there, and equally common there. The cut-off of 6.63 is reached at ${minAbsent} occurrences in the first case.`,
  height: 270,
});

const fig2 = chart({
  title: 'How many tokens you need to prove a difference', xLabel: 'How many times rarer the word is in the other corpus', yLabel: 'Smallest count that reaches G² = 6.63',
  series: [{ name: '', kind: 'line', x: RATIOS, y: mins }, { name: '', noLegend: true, kind: 'dots', x: RATIOS, y: mins, size: 3, colour: 'var(--c-blog)' }],
  xDomain: [1.5, 10], yDomain: [0, 120], xTicks: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  hlines: [{ y: minAbsent, text: `${minAbsent} if it is absent there` }],
  desc: `The smallest number of occurrences in the 31,124-word corpus that reaches a log-likelihood of 6.63, against how many times rarer the word is in the 27,773-word comparison corpus. A word twice as common needs ${mins[2]} occurrences; one absent from the other corpus needs ${minAbsent}.`,
  height: 270,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'curve', figure(fig1, `Figure 1. Keyness worked out with the Corpus concordancer's own log-likelihood, for the paper's two corpus sizes. A word must appear at least ${minAbsent} times in the larger corpus to clear the paper's cut-off even when it is missing from the other one, and the six words the paper lists with counts in both corpora (black dots) all sit below the line.`));
md = inject(md, 'minimum', figure(fig2, `Figure 2. The same maths read backwards: the smallest count that reaches G² = 6.63 at the paper's corpus sizes, as a function of how much rarer the word is in the comparison corpus. Small differences in rate need large counts.`));
fs.writeFileSync(ART, md);

console.log('shared:', shared.map((s) => `${s.w} ${s.a}/${s.b} G2=${s.g.toFixed(2)} (${s.pmA.toFixed(0)} vs ${s.pmB.toFixed(0)} per million)`).join('\n         '));
console.log('grouped 4 helping words:', grouped.a, 'vs', grouped.b, 'G2 =', grouped.g.toFixed(2));
console.log('female-only:', onlyF.map((s) => `${s.w} ${s.a} G2=${s.g.toFixed(1)}`).join(', '));
console.log('male-only:', onlyM.map((s) => `${s.w} ${s.b} G2=${s.g.toFixed(1)}`).join(', '));
console.log('minimum count, absent from the other corpus:', minAbsent, '(female side)', minAbsentM, '(male side)');
console.log('minimum counts by ratio:', RATIOS.map((r, i) => `${r}x:${mins[i]}`).join(' '));
