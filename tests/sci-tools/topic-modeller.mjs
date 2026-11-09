// #414 Topic modelling (LDA). The sampler was ported line by line to Python (same mulberry32 stream) and gave the
// same topic for every word; scikit-learn's LatentDirichletAllocation (best of 10 starts) gave the same phi and theta
// on the planted corpus below, and the same perplexity (16.5454919306 by the formula used here).
import { mulberry32, splitDocs, prepare, initGibbs, sweep, estimate, perplexity, topWords, STOP_WORDS, EXAMPLE } from '../../src/lib/sci/lda.ts';
export default async (check) => {
  const r = mulberry32(7);
  check('lda: mulberry32 stream matches the Python port', [r(), r(), r()].join() === [0.011704753153026104, 0.06195825757458806, 0.97690763277933].join());
  check('lda: stop word list is plain lower-case words', STOP_WORDS.length > 200 && STOP_WORDS.every((w) => /^[a-z']+$/.test(w)) && STOP_WORDS.includes('the'));
  check('lda: documents split at ### lines, else at blank lines', splitDocs('### A\nx y\n### B\nz').map((d) => d.name).join() === 'A,B' && splitDocs('one\n\n two\nthree\n\n\nfour').length === 3);
  const c = prepare(splitDocs(EXAMPLE));
  check('lda: example has 15 notes, 42 words kept, 128 tokens', c.docs.length === 15 && c.vocab.length === 42 && c.tokens === 128 && c.removed.stop === 228 && c.removed.rare === 106);
  check('lda: short words and rare words dropped', prepare([{ name: 'a', text: 'ox ox cow cow cow pig' }], { stop: [], minLen: 3, minCount: 2 }).vocab.join() === 'cow');
  { const g = initGibbs(c, 4, 0.5, 0.05, 42); sweep(g, 30); let h = 0; g.z.flatMap((a) => [...a]).forEach((k, i) => (h = (h * 31 + k + i) % 1000000007));
    check('lda: 30 sweeps give the same topic for every word as the Python port', h === 552148383); }
  { const a = initGibbs(c, 3, 0.1, 0.01, 5), b = initGibbs(c, 3, 0.1, 0.01, 5); sweep(a, 20); sweep(b, 20);
    check('lda: same seed, same result', a.z.every((z, d) => z.join() === b.z[d].join())); }
  { const g = initGibbs(c, 3, 0.1, 0.01, 1); sweep(g, 500); const e = estimate(g); const tw = topWords(e.phi, c.vocab, 5).map((t) => t.map((x) => x.word));
    check('lda: example finds farming, sea and church topics', tw.some((t) => t.includes('barley') && t.includes('farmers')) && tw.some((t) => t.includes('harbour') && t.includes('sailors')) && tw.some((t) => t.includes('choir') && t.includes('organist')));
    check('lda: phi and theta rows sum to 1', e.phi.every((p) => Math.abs(p.reduce((s, x) => s + x, 0) - 1) < 1e-9) && e.theta.every((p) => Math.abs(p.reduce((s, x) => s + x, 0) - 1) < 1e-9));
    check('lda: example perplexity 15.69', Math.abs(perplexity(c.docs, e.phi, e.theta) - 15.693213481) < 1e-6); }
  // Planted corpus: 4 topics of 12 words each, 40 documents of 60 words, each mostly from one topic.
  const s = mulberry32(3), vocab = [], docs = [];
  for (let k = 0; k < 4; k++) for (let i = 0; i < 12; i++) vocab.push(`t${k}w${i}`);
  for (let d = 0; d < 40; d++) { const a = Math.floor(s() * 4), b = Math.floor(s() * 4), mix = 0.7 + 0.3 * s(); docs.push(Array.from({ length: 60 }, () => (s() < mix ? a : b) * 12 + Math.floor(s() * 12))); }
  const g = initGibbs({ docs, vocab }, 4, 0.1, 0.01, 1); sweep(g, 300); const e = estimate(g);
  const tops = topWords(e.phi, vocab, 12).map((t) => new Set(t.map((x) => x.word.split('w')[0])));
  check('lda: recovers all 4 planted topics (top 12 words each from one topic)', tops.every((t) => t.size === 1) && new Set(tops.map((t) => [...t][0])).size === 4);
  check('lda: planted corpus perplexity matches scikit-learn (16.5454919306)', Math.abs(perplexity(docs, e.phi, e.theta) - 16.5454919306) < 1e-8);
};
