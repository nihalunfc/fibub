// Lexical diversity (TTR, root TTR, log TTR, MATTR, MTLD, HD-D, Yule's K) and readability formulas
// (Flesch, Flesch-Kincaid, Gunning fog, SMOG, Coleman-Liau, ARI) for English text. Plain TypeScript, no DOM.
import { logGamma } from './stats.ts';

/** Words: runs of letters (and digits), with inner apostrophes or hyphens kept. */
const WORD = /[\p{L}\p{M}\p{N}]+(?:['’\-][\p{L}\p{M}\p{N}]+)*/gu;
export const words = (text: string): string[] => text.match(WORD) ?? [];
export const tokens = (text: string, cs = false) => words(text).map((w) => (cs ? w : w.toLowerCase()).replace(/’/g, "'"));

export function ttr(t: string[]) { return t.length ? new Set(t).size / t.length : NaN; }

/** Moving-average TTR over every window of `w` tokens (Covington and McFall 2010). */
export function mattr(t: string[], w = 50): { value: number; series: number[] } {
  if (w < 2 || t.length < w) return { value: NaN, series: [] };
  const c = new Map<string, number>(); let types = 0;
  const add = (x: string, d: number) => { const n = (c.get(x) ?? 0) + d; if (n === 0) { c.delete(x); types--; } else { if (d > 0 && n === 1) types++; c.set(x, n); } };
  for (let i = 0; i < w; i++) add(t[i], 1);
  const series = [types / w];
  for (let i = w; i < t.length; i++) { add(t[i], 1); add(t[i - w], -1); series.push(types / w); }
  return { value: series.reduce((s, x) => s + x, 0) / series.length, series };
}

/**
 * Factors in one direction for MTLD (McCarthy and Jarvis 2010): a factor ends when the running TTR falls to the
 * threshold or below; the leftover piece adds (1 − TTR)/(1 − threshold).
 */
export function mtldFactors(t: string[], thr = 0.72): number {
  let f = 0, seen = new Set<string>(), n = 0;
  for (const x of t) {
    seen.add(x); n++;
    if (seen.size / n <= thr) { f++; seen = new Set(); n = 0; }
  }
  if (n > 0) f += (1 - seen.size / n) / (1 - thr);
  return f;
}
/** MTLD: the mean of forward and backward N ÷ factors. */
export function mtld(t: string[], thr = 0.72): { value: number; forward: number; backward: number } {
  if (!t.length) return { value: NaN, forward: NaN, backward: NaN };
  const fw = t.length / mtldFactors(t, thr), bw = t.length / mtldFactors([...t].reverse(), thr);
  return { value: (fw + bw) / 2, forward: fw, backward: bw };
}

const lnChoose = (n: number, k: number) => logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
/**
 * HD-D (McCarthy and Jarvis 2007): for each type, the hypergeometric chance it appears at least once in a
 * random sample of `s` tokens, summed and divided by s (the expected TTR of a sample of s tokens).
 */
export function hdd(t: string[], s = 42): number {
  const N = t.length; if (N < s || s < 1) return NaN;
  let sum = 0;
  for (const f of freqs(t).values()) {
    const p0 = N - f < s ? 0 : Math.exp(lnChoose(N - f, s) - lnChoose(N, s));
    sum += (1 - p0) / s;
  }
  return sum;
}

export function freqs(t: string[]) { const m = new Map<string, number>(); for (const x of t) m.set(x, (m.get(x) ?? 0) + 1); return m; }

/** Yule's K = 10⁴ (Σ f² − N) / N². */
export function yuleK(t: string[]): number {
  const N = t.length; if (!N) return NaN;
  let s2 = 0; for (const f of freqs(t).values()) s2 += f * f;
  return (1e4 * (s2 - N)) / (N * N);
}

export function diversity(t: string[], o: { window?: number; threshold?: number; sample?: number } = {}) {
  const N = t.length, V = new Set(t).size;
  const m = mattr(t, o.window ?? 50), d = mtld(t, o.threshold ?? 0.72);
  return { N, V, ttr: V / N, rttr: V / Math.sqrt(N), logttr: N > 1 ? Math.log(V) / Math.log(N) : NaN, mattr: m.value, mattrSeries: m.series, mtld: d.value, mtldF: d.forward, mtldB: d.backward, hdd: hdd(t, o.sample ?? 42), yuleK: yuleK(t) };
}

// ---------- readability ----------

/**
 * English syllables by rule of thumb: count groups of vowels (a e i o u y), after dropping a silent final "e" and
 * the "-es"/"-ed" endings that do not add a syllable. Right for most words, off by one for some.
 */
export function syllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouytd]ed|[^laeiouy]e)$/, (m) => m[0]).replace(/^y/, '');
  const g = w.match(/[aeiouy]+/g);
  return Math.max(1, g ? g.length : 0);
}

/** Sentences: runs of text ending in . ! ? (or the end of the text) that contain at least one word. */
export function sentences(text: string): string[] {
  return text.replace(/\s+/g, ' ').split(/(?<=[.!?…]+["'”’)\]]?)\s+(?=["'“‘(\[]?[\p{Lu}\p{N}])/u).map((s) => s.trim()).filter((s) => /[\p{L}\p{N}]/u.test(s));
}

/** A complex word for the fog index: three or more syllables, not hyphenated, and not made so only by -es, -ed or -ing. */
export function complexWord(w: string): boolean {
  if (/-/.test(w) || syllables(w) < 3) return false;
  const stem = w.toLowerCase().match(/^(.*?)(?:es|ed|ing)$/);
  return !(stem && stem[1].length > 1 && syllables(stem[1]) < 3);
}

export function readability(text: string) {
  const W = words(text).filter((w) => /\p{L}/u.test(w)), S = Math.max(1, sentences(text).length), N = W.length;
  const syl = W.map(syllables), Y = syl.reduce((s, x) => s + x, 0), poly = syl.filter((x) => x >= 3).length;
  const letters = W.reduce((s, w) => s + (w.match(/\p{L}/gu)?.length ?? 0), 0), chars = W.reduce((s, w) => s + (w.match(/[\p{L}\p{N}]/gu)?.length ?? 0), 0);
  const complex = W.filter(complexWord).length;
  const wps = N / S, spw = Y / N;
  return {
    words: N, sentences: S, syllables: Y, polysyllables: poly, complex, letters, chars,
    fre: 206.835 - 1.015 * wps - 84.6 * spw,
    fkgl: 0.39 * wps + 11.8 * spw - 15.59,
    fog: 0.4 * (wps + (100 * complex) / N),
    smog: 1.043 * Math.sqrt((poly * 30) / S) + 3.1291,
    cli: 0.0588 * ((100 * letters) / N) - 0.296 * ((100 * S) / N) - 15.8,
    ari: 4.71 * (chars / N) + 0.5 * wps - 21.43,
  };
}

/** Flesch reading ease bands (Flesch 1948). */
export function easeBand(x: number) {
  return x >= 90 ? 'very easy' : x >= 80 ? 'easy' : x >= 70 ? 'fairly easy' : x >= 60 ? 'plain English' : x >= 50 ? 'fairly difficult' : x >= 30 ? 'difficult' : 'very difficult';
}
