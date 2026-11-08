// Species diversity from counts: richness, Shannon, Simpson, Pielou, Chao1 and rarefaction
// (formulas as in Magurran, Measuring Biological Diversity, 2004, and Chao 1987 / Chao 2005 for Chao1).
import { logGamma } from './stats.ts';

export function diversity(counts: number[]) {
  const n = counts.filter((c) => c > 0), N = n.reduce((s, c) => s + c, 0), S = n.length;
  if (!N) throw new Error('No individuals counted');
  const p = n.map((c) => c / N);
  const H = -p.reduce((s, x) => s + x * Math.log(x), 0);
  const D = p.reduce((s, x) => s + x * x, 0);
  const Dunb = N > 1 ? n.reduce((s, c) => s + c * (c - 1), 0) / (N * (N - 1)) : NaN; // Simpson's unbiased λ for finite samples
  const F1 = n.filter((c) => c === 1).length, F2 = n.filter((c) => c === 2).length;
  // Bias-corrected Chao1 (Chao 2005), which stays finite when there are no doubletons.
  const chao1 = S + ((N - 1) / N) * (F1 * (F1 - 1)) / (2 * (F2 + 1));
  return { N, S, H, H2: H / Math.LN2, expH: Math.exp(H), simpson: 1 - D, invSimpson: 1 / D, simpsonUnbiased: 1 - Dunb, pielou: S > 1 ? H / Math.log(S) : NaN, berger: Math.max(...n) / N, chao1, F1, F2, margalef: S > 1 ? (S - 1) / Math.log(N) : NaN };
}
const lnChoose = (a: number, b: number) => logGamma(a + 1) - logGamma(b + 1) - logGamma(a - b + 1);
/** Expected species in a random subsample of m individuals (Hurlbert 1971), with its standard deviation (Heck et al. 1975). */
export function rarefy(counts: number[], m: number) {
  const n = counts.filter((c) => c > 0), N = n.reduce((s, c) => s + c, 0);
  if (m > N) return { s: NaN, sd: NaN };
  const q = n.map((c) => (N - c >= m ? Math.exp(lnChoose(N - c, m) - lnChoose(N, m)) : 0));
  const s = q.reduce((t, x) => t + (1 - x), 0);
  let v = q.reduce((t, x) => t + x * (1 - x), 0);
  for (let i = 0; i < n.length; i++) for (let j = i + 1; j < n.length; j++) {
    const qij = N - n[i] - n[j] >= m ? Math.exp(lnChoose(N - n[i] - n[j], m) - lnChoose(N, m)) : 0;
    v += 2 * (qij - q[i] * q[j]);
  }
  return { s, sd: Math.sqrt(Math.max(0, v)) };
}
/** Bray-Curtis dissimilarity and Jaccard similarity between two sites. */
export function compare(a: number[], b: number[]) {
  let num = 0, den = 0, both = 0, either = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0, y = b[i] || 0;
    num += Math.abs(x - y); den += x + y;
    if (x > 0 && y > 0) both++; if (x > 0 || y > 0) either++;
  }
  return { brayCurtis: den ? num / den : NaN, jaccard: either ? both / either : NaN };
}
