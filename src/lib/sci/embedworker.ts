// Runs PCA and t-SNE off the main thread and reports t-SNE's progress, so the page stays responsive.
import { readTable, isMissing, cellNumber } from './dataset.ts';
import { pca, tsne, trustworthiness, neighbourKeep } from './embed.ts';

export type EmbedSettings = { method: 'pca' | 'tsne' | 'both'; features: string[]; label: string; standardise: boolean; perplexity: number; iterations: number; init: 'pca' | 'random'; seed: number };
export const MAX_ROWS = 2000;

function run(id: number, text: string, s: EmbedSettings) {
  const t = readTable(text);
  if (!s.features.length) throw new Error('Tick at least two number columns.');
  const fi = s.features.map((f) => t.head.indexOf(f)), li = s.label ? t.head.indexOf(s.label) : -1;
  const keep = t.rows.map((r, i) => i).filter((i) => fi.every((j) => Number.isFinite(cellNumber(t.rows[i][j]))));
  const dropped = t.rows.length - keep.length, n = keep.length;
  if (n > MAX_ROWS) throw new Error(`${n.toLocaleString('en')} rows: this tool takes up to ${MAX_ROWS.toLocaleString('en')} (exact t-SNE compares every pair of rows). Use a sample of the rows.`);
  if (n < 4) throw new Error(`Only ${n} rows have a number in every chosen column: at least 4 are needed.`);
  if (fi.length < 2) throw new Error('Tick at least two number columns.');
  const X = keep.map((i) => Float64Array.from(fi, (j) => cellNumber(t.rows[i][j])));
  const p = fi.length, mean = new Array(p).fill(0), sd = new Array(p).fill(0);
  for (const x of X) for (let j = 0; j < p; j++) mean[j] += x[j] / n;
  for (const x of X) for (let j = 0; j < p; j++) sd[j] += (x[j] - mean[j]) ** 2 / (n - 1);
  const flat = sd.map((v, j) => Math.sqrt(v) <= 1e-12 * Math.max(1, Math.abs(mean[j])));
  const constant = s.features.filter((_, j) => flat[j]);
  const Z = s.standardise ? X.map((x) => Float64Array.from(x, (v, j) => (flat[j] ? 0 : (v - mean[j]) / Math.sqrt(sd[j])))) : X;
  const labels = keep.map((i) => (li < 0 ? '' : isMissing(t.rows[i][li]) ? '(missing)' : t.rows[i][li].trim()));
  const out: Record<string, unknown> = { rows: keep, n, dropped, names: s.features, labels, constant };
  let P2: number[][] | null = null;
  if (s.method !== 'tsne') {
    const P = pca(X, s.standardise);
    P2 = P.scores.map((r) => [r[0], r[1] ?? 0]);
    out.pca = { components: P.components, variance: P.variance, ratio: P.ratio, scores: P.scores.map((r) => r.slice(0, Math.min(10, r.length))) };
  }
  if (s.method !== 'pca') {
    const r = tsne(Z, { perplexity: s.perplexity, iterations: s.iterations, init: s.init, seed: s.seed }, (iter, kl) => (self as unknown as Worker).postMessage({ id, progress: { iter, kl, of: Math.max(250, s.iterations) } }));
    out.tsne = { Y: r.Y, kl: r.kl, iterations: r.iterations, trust: trustworthiness(Z, r.Y, 5), keep: neighbourKeep(Z, r.Y, 10) };
  }
  if (P2) {
    // How well the first two principal components keep neighbours, for comparison (on the same scaled data).
    const Zp = pca(Z, false, 2).scores;
    out.pcaQuality = { trust: trustworthiness(Z, Zp, 5), keep: neighbourKeep(Z, Zp, 10) };
  }
  return out;
}

self.onmessage = (e: MessageEvent) => {
  const { id, text, settings } = e.data;
  try { (self as unknown as Worker).postMessage({ id, ok: true, result: run(id, text, settings) }); }
  catch (err) { (self as unknown as Worker).postMessage({ id, ok: false, error: (err as Error).message }); }
};
