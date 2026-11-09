// Corpus tools: tokens, key word in context (KWIC) lines, word frequency, n-grams and window collocations
// with MI, t-score and log-likelihood (G²). Plain TypeScript, no DOM.

export type Tok = { w: string; s: number; e: number };
export type CDoc = { name: string; text: string; toks: Tok[] };
export type Corpus = { docs: CDoc[]; N: number };

/** A word: letters, marks or digits, with inner apostrophes or hyphens kept ("don't", "well-known"). */
const WORD = /[\p{L}\p{M}\p{N}]+(?:['’\-][\p{L}\p{M}\p{N}]+)*/gu;

export function tokenize(text: string): Tok[] {
  const out: Tok[] = [];
  for (const m of text.matchAll(WORD)) out.push({ w: m[0], s: m.index!, e: m.index! + m[0].length });
  return out;
}

export function buildCorpus(docs: { name: string; text: string }[]): Corpus {
  const d = docs.map((x) => ({ name: x.name, text: x.text, toks: tokenize(x.text) }));
  return { docs: d, N: d.reduce((s, x) => s + x.toks.length, 0) };
}

export const norm = (w: string, cs: boolean) => (cs ? w : w.toLowerCase()).replace(/’/g, "'");

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A search for one word or a phrase (words separated by spaces). In word mode, * stands for any letters and ?
 * for one. In regex mode each space-separated part is a regular expression that must match a whole word.
 * Throws a plain message for a bad pattern.
 */
export function compileQuery(query: string, opts: { regex?: boolean; cs?: boolean } = {}): RegExp[] {
  const parts = query.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) throw new Error('Type a word to search for.');
  const flags = 'u' + (opts.cs ? '' : 'i');
  return parts.map((p) => {
    if (opts.regex) {
      try { return new RegExp(`^(?:${p})$`, flags); } catch (e) { throw new Error(`"${p}" is not a valid regular expression: ${(e as Error).message.replace(/^.*?: /, '')}`); }
    }
    return new RegExp('^' + esc(p).replace(/\\\*/g, '.*').replace(/\\\?/g, '.') + '$', flags);
  });
}

export type Hit = { doc: number; i: number; len: number };

/** Every place the query matches, in text order. */
export function findHits(c: Corpus, q: RegExp[]): Hit[] {
  const hits: Hit[] = [];
  c.docs.forEach((d, di) => {
    const t = d.toks;
    for (let i = 0; i + q.length <= t.length; i++) {
      let ok = true;
      for (let k = 0; k < q.length && ok; k++) ok = q[k].test(t[i + k].w.replace(/’/g, "'"));
      if (ok) hits.push({ doc: di, i, len: q.length });
    }
  });
  return hits;
}

export type Line = Hit & { left: string; node: string; right: string; L: string[]; R: string[] };
export type SortKey = 'text' | 'L1' | 'L2' | 'L3' | 'R1' | 'R2' | 'R3' | 'node';

/** KWIC lines with `width` words of context each side (never crossing into another file). */
export function kwic(c: Corpus, hits: Hit[], width: number, sort: SortKey = 'text'): Line[] {
  const clean = (s: string) => s.replace(/\s+/g, ' ');
  const lines: Line[] = hits.map((h) => {
    const d = c.docs[h.doc], t = d.toks, a = Math.max(0, h.i - width), b = Math.min(t.length - 1, h.i + h.len - 1 + width);
    const first = t[h.i], last = t[h.i + h.len - 1];
    const lStart = a < h.i ? t[a].s : first.s, rEnd = b > h.i + h.len - 1 ? t[b].e : last.e;
    const L: string[] = [], R: string[] = [];
    for (let k = h.i - 1; k >= a; k--) L.push(t[k].w.toLowerCase());
    for (let k = h.i + h.len; k <= b; k++) R.push(t[k].w.toLowerCase());
    return { ...h, left: clean(d.text.slice(lStart, first.s)), node: clean(d.text.slice(first.s, last.e)), right: clean(d.text.slice(last.e, rEnd)), L, R };
  });
  if (sort === 'text') return lines;
  const key = (l: Line): string[] => {
    if (sort === 'node') return [l.node.toLowerCase(), ...l.R];
    const side = sort[0] === 'L' ? l.L : l.R, n = Number(sort[1]) - 1;
    return side.slice(n).concat(sort[0] === 'L' ? l.R : []);
  };
  const cmp = (x: string[], y: string[]) => {
    for (let k = 0; k < Math.max(x.length, y.length); k++) {
      if (x[k] === undefined) return -1; if (y[k] === undefined) return 1;
      const r = x[k] < y[k] ? -1 : x[k] > y[k] ? 1 : 0; if (r) return r;
    }
    return 0;
  };
  return lines.map((l, ix) => ({ l, ix, k: key(l) })).sort((p, q) => cmp(p.k, q.k) || p.ix - q.ix).map((x) => x.l);
}

export type FreqRow = { w: string; n: number; docs: number };

/** Counts of each word form (lower-cased unless cs), most frequent first, ties in alphabetical order. */
export function frequencies(c: Corpus, cs = false): FreqRow[] {
  const m = new Map<string, { n: number; docs: Set<number> }>();
  c.docs.forEach((d, di) => { for (const t of d.toks) { const k = norm(t.w, cs); let r = m.get(k); if (!r) m.set(k, (r = { n: 0, docs: new Set() })); r.n++; r.docs.add(di); } });
  return [...m].map(([w, r]) => ({ w, n: r.n, docs: r.docs.size })).sort((a, b) => b.n - a.n || (a.w < b.w ? -1 : a.w > b.w ? 1 : 0));
}

/**
 * Word sequences of length n inside each file, most frequent first. With `stop`, a sequence never runs across
 * sentence or clause punctuation (. ! ? ; : and line breaks between paragraphs).
 */
export function ngrams(c: Corpus, n: number, cs = false, stop = false): FreqRow[] {
  const m = new Map<string, { n: number; docs: Set<number> }>();
  c.docs.forEach((d, di) => {
    const w = d.toks.map((t) => norm(t.w, cs));
    // brk[i] = 1 when there is a stop between word i and word i + 1
    const brk = d.toks.map((t, i) => (stop && i + 1 < d.toks.length && /[.!?;:…]|\n\s*\n/.test(d.text.slice(t.e, d.toks[i + 1].s)) ? 1 : 0));
    for (let i = 0; i + n <= w.length; i++) {
      if (stop) { let cut = false; for (let k = i; k < i + n - 1 && !cut; k++) cut = brk[k] === 1; if (cut) continue; }
      const k = w.slice(i, i + n).join(' '); let r = m.get(k); if (!r) m.set(k, (r = { n: 0, docs: new Set() })); r.n++; r.docs.add(di); }
  });
  return [...m].map(([w, r]) => ({ w, n: r.n, docs: r.docs.size })).sort((a, b) => b.n - a.n || (a.w < b.w ? -1 : a.w > b.w ? 1 : 0));
}

export type Colloc = { w: string; O: number; fc: number; E: number; MI: number; T: number; G2: number; left: number; right: number };

/** 2×2 log-likelihood G² = 2 Σ O ln(O/E), empty cells adding nothing. */
export function g2(o11: number, o12: number, o21: number, o22: number): number {
  const N = o11 + o12 + o21 + o22, r1 = o11 + o12, r2 = o21 + o22, c1 = o11 + o21, c2 = o12 + o22;
  const t = (o: number, e: number) => (o > 0 ? o * Math.log(o / e) : 0);
  return 2 * (t(o11, (r1 * c1) / N) + t(o12, (r1 * c2) / N) + t(o21, (r2 * c1) / N) + t(o22, (r2 * c2) / N));
}

/**
 * Collocates of the query within `L` words to the left and `R` to the right. The window positions of all hits are
 * joined (a position near two hits counts once) and the hit words themselves are left out, so each corpus
 * position is either in the window or outside it. For a collocate c with frequency f(c) in a corpus of N words,
 * O = times c is in the window, W = window size in words, E = W·f(c)/N, MI = log2(O/E), t = (O − E)/√O and
 * G² comes from the 2×2 table [O, W − O; f(c) − O, N − W − f(c) + O].
 */
export function collocates(c: Corpus, hits: Hit[], L: number, R: number, cs = false, minO = 1): { rows: Colloc[]; W: number; N: number; nodes: number } {
  const freq = new Map(frequencies(c, cs).map((r) => [r.w, r.n]));
  const O = new Map<string, { n: number; l: number; r: number }>();
  let W = 0;
  c.docs.forEach((d, di) => {
    const hs = hits.filter((h) => h.doc === di);
    if (!hs.length) return;
    const node = new Uint8Array(d.toks.length), side = new Int8Array(d.toks.length); // side: -1 left, 1 right
    for (const h of hs) for (let k = 0; k < h.len; k++) node[h.i + k] = 1;
    for (const h of hs) {
      for (let k = Math.max(0, h.i - L); k < h.i; k++) if (!side[k]) side[k] = -1;
      for (let k = h.i + h.len; k < Math.min(d.toks.length, h.i + h.len + R); k++) if (!side[k]) side[k] = 1;
    }
    for (let k = 0; k < d.toks.length; k++) {
      if (!side[k] || node[k]) continue;
      W++;
      const w = norm(d.toks[k].w, cs); let r = O.get(w); if (!r) O.set(w, (r = { n: 0, l: 0, r: 0 })); r.n++;
      if (side[k] < 0) r.l++; else r.r++;
    }
  });
  const N = c.N, rows: Colloc[] = [];
  for (const [w, o] of O) {
    if (o.n < minO) continue;
    const fc = freq.get(w)!, E = (W * fc) / N;
    rows.push({ w, O: o.n, fc, E, MI: Math.log2(o.n / E), T: (o.n - E) / Math.sqrt(o.n), G2: g2(o.n, W - o.n, fc - o.n, N - W - fc + o.n), left: o.l, right: o.r });
  }
  rows.sort((a, b) => b.G2 - a.G2 || (a.w < b.w ? -1 : 1));
  return { rows, W, N, nodes: hits.length };
}
