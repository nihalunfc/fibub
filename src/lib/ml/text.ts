// Text and language-model maths for the ML foundations course (Module 10): word counts, TF-IDF, cosine
// similarity, a bigram next-word model, softmax with temperature and scaled dot-product attention.
// Plain TypeScript with no DOM, checked in tests/ml.mjs.

/** Lower-case words, letters and digits only. */
export const tokens = (s: string) => s.toLowerCase().match(/[a-z0-9']+/g) ?? [];

/** Count of each word in each document, over a shared, sorted vocabulary. */
export function counts(docs: string[]) {
  const toks = docs.map(tokens), vocab = [...new Set(toks.flat())].sort();
  const tf = toks.map((t) => vocab.map((w) => t.filter((x) => x === w).length));
  return { vocab, tf };
}

/**
 * TF-IDF with raw counts and idf = ln(N / df): a word in every document scores 0, a word in one
 * document scores most. (Libraries often add 1s to avoid zeros; the idea is the same.)
 */
export function tfidf(docs: string[]) {
  const { vocab, tf } = counts(docs), N = docs.length;
  const df = vocab.map((_, j) => tf.filter((r) => r[j] > 0).length), idf = df.map((d) => Math.log(N / d));
  return { vocab, tf, df, idf, w: tf.map((r) => r.map((c, j) => c * idf[j])) };
}

export const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);
export const norm = (a: number[]) => Math.sqrt(dot(a, a));
/** Cosine similarity: 1 same direction, 0 unrelated (at right angles), −1 opposite. */
export const cosine = (a: number[], b: number[]) => { const d = norm(a) * norm(b); return d ? dot(a, b) / d : 0; };

/** Softmax with temperature T: higher T flattens, lower T sharpens. Shifted by the max for safety. */
export function softmax(z: number[], T = 1) {
  const m = Math.max(...z), e = z.map((v) => Math.exp((v - m) / T)), s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

/** Bigram model: for each word, how often each next word follows it. Sentences are split on . ! ? */
export function bigrams(text: string) {
  const next = new Map<string, Map<string, number>>();
  for (const sent of text.split(/[.!?]+/)) {
    const t = ['<s>', ...tokens(sent)]; if (t.length < 2) continue;
    for (let i = 0; i + 1 < t.length; i++) {
      const m = next.get(t[i]) ?? new Map<string, number>(); m.set(t[i + 1], (m.get(t[i + 1]) ?? 0) + 1); next.set(t[i], m);
    }
  }
  return next;
}

/** Next-word probabilities after `word`, most likely first. */
export function nextWords(model: Map<string, Map<string, number>>, word: string) {
  const m = model.get(word); if (!m) return [] as [string, number][];
  const tot = [...m.values()].reduce((a, b) => a + b, 0);
  return [...m.entries()].map(([w, c]) => [w, c / tot] as [string, number]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
}

/** Pick an index from probabilities with a random number r in [0, 1). */
export function sample(p: number[], r: number) { let i = 0; while (i < p.length - 1 && (r -= p[i]) >= 0) i++; return i; }

export const matVec = (M: number[][], v: number[]) => M.map((row) => dot(row, v));

/**
 * Scaled dot-product attention for one sequence. X: one row per word; Wq, Wk, Wv map a row to its query,
 * key and value (each matrix has one row per output number). Returns the scores, the weights (softmax of
 * each row of scores, optionally causal: a word sees only itself and earlier words) and the outputs.
 */
export function attention(X: number[][], Wq: number[][], Wk: number[][], Wv: number[][], opts: { causal?: boolean; T?: number } = {}) {
  const Q = X.map((x) => matVec(Wq, x)), K = X.map((x) => matVec(Wk, x)), V = X.map((x) => matVec(Wv, x)), d = K[0].length;
  const scores = Q.map((q, i) => K.map((k, j) => (opts.causal && j > i ? -Infinity : dot(q, k) / Math.sqrt(d))));
  const weights = scores.map((s) => softmax(s, opts.T ?? 1));
  const out = weights.map((w) => V[0].map((_, c) => w.reduce((s, wi, j) => s + wi * V[j][c], 0)));
  return { Q, K, V, scores, weights, out };
}

/** Cross-entropy (in nats) of the true next word under a predicted distribution, and the matching perplexity. */
export const crossEntropy = (p: number[], target: number) => -Math.log(Math.max(p[target], 1e-12));
export const perplexity = (meanCE: number) => Math.exp(meanCE);

/** Layer normalisation of one vector: subtract its mean, divide by its standard deviation. */
export function layerNorm(x: number[], eps = 1e-5) {
  const m = x.reduce((a, b) => a + b, 0) / x.length, v = x.reduce((s, a) => s + (a - m) ** 2, 0) / x.length;
  return x.map((a) => (a - m) / Math.sqrt(v + eps));
}
