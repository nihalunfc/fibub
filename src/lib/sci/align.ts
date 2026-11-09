// Pairwise alignment with affine gaps (Gotoh): global (Needleman-Wunsch), local (Smith-Waterman) and semi-global
// (gaps at the ends are free). Scores are kept two rows at a time; the way back is stored as 6 bits per cell, so a
// 5,000 × 5,000 alignment needs about 25 MB. A gap of length k costs open + (k − 1) × extend, as in Biopython's
// PairwiseAligner, which the tests compare against. No DOM.

export type Mode = 'global' | 'local' | 'semiglobal';
export type Scoring = { score: (a: string, b: string) => number; open: number; extend: number };
export type Alignment = {
  a: string; b: string; score: number; mode: Mode;
  aStart: number; aEnd: number; bStart: number; bEnd: number; // 1-based, inclusive; 0 when nothing is aligned
  columns: number; identities: number; similar: number; gaps: number; gapOpenings: number;
};

export const MAX_CELLS = 25_000_000;

/** DNA scoring: match and mismatch; N or other IUPAC letters score as a mismatch except N against N. */
export const dnaScoring = (match = 2, mismatch = -3, open = -5, extend = -2): Scoring => ({ score: (x, y) => (x === y ? match : mismatch), open, extend });

/** Simple amino-acid groups by side chain (textbook classes, not a published substitution matrix). */
export const GROUPS = ['ILMV', 'FWY', 'KRH', 'DE', 'STNQ', 'AG', 'C', 'P'];
const groupOf: Record<string, number> = {};
GROUPS.forEach((g, i) => { for (const c of g) groupOf[c] = i; });
export const sameGroup = (x: string, y: string) => groupOf[x] !== undefined && groupOf[x] === groupOf[y];
export const proteinScoring = (same = 5, similar = 2, different = -2, open = -10, extend = -1): Scoring => ({
  score: (x, y) => (x === y && x !== 'X' ? same : sameGroup(x, y) ? similar : different), open, extend,
});

const NEG = -1e300;

export function align(A: string, B: string, sc: Scoring, mode: Mode): Alignment {
  const n = A.length, m = B.length;
  if ((n + 1) * (m + 1) > MAX_CELLS) throw new Error('too big');
  const { open, extend } = sc;
  const free = mode === 'semiglobal', local = mode === 'local';
  const W = m + 1;
  const tb = new Uint8Array((n + 1) * W); // bits 0-1: M from (0 M, 1 X, 2 Y, 3 start); 2-3: X from (0 M, 1 X, 2 Y); 4-5: Y from
  let Mp = new Float64Array(W), Xp = new Float64Array(W), Yp = new Float64Array(W);
  let Mc = new Float64Array(W), Xc = new Float64Array(W), Yc = new Float64Array(W);
  // Row 0.
  Mp[0] = 0; Xp[0] = NEG; Yp[0] = NEG;
  for (let j = 1; j <= m; j++) { Mp[j] = local ? 0 : NEG; Xp[j] = NEG; Yp[j] = local ? NEG : free ? 0 : open + (j - 1) * extend; tb[j] = (j > 1 ? 2 : 0) << 4 | 3; }
  let best = local ? 0 : NEG, bi = 0, bj = 0, bk = 0;
  // Semi-global: the best cell is on the last row or last column.
  const consider = (v: number, i: number, j: number, k: number) => { if (v > best) { best = v; bi = i; bj = j; bk = k; } };
  for (let i = 1; i <= n; i++) {
    const ai = A[i - 1];
    Mc[0] = local ? 0 : NEG; Yc[0] = NEG; Xc[0] = local ? NEG : free ? 0 : open + (i - 1) * extend;
    tb[i * W] = (i > 1 ? 1 : 0) << 2 | 3;
    for (let j = 1; j <= m; j++) {
      // M: a[i] with b[j].
      let v = Mp[j - 1], f = 0;
      if (Xp[j - 1] > v) { v = Xp[j - 1]; f = 1; }
      if (Yp[j - 1] > v) { v = Yp[j - 1]; f = 2; }
      // A local alignment can begin at any match instead (preferred on ties, so it never carries a zero-score prefix).
      if (local && v <= 0) { v = 0; f = 3; }
      const mv = v + sc.score(ai, B[j - 1]);
      // X: a[i] against a gap.
      let x = Mp[j] + open, fx = 0;
      if (Xp[j] + extend > x) { x = Xp[j] + extend; fx = 1; }
      if (Yp[j] + open > x) { x = Yp[j] + open; fx = 2; }
      // Y: b[j] against a gap.
      let y = Mc[j - 1] + open, fy = 0;
      if (Xc[j - 1] + open > y) { y = Xc[j - 1] + open; fy = 1; }
      if (Yc[j - 1] + extend > y) { y = Yc[j - 1] + extend; fy = 2; }
      Mc[j] = mv; Xc[j] = x; Yc[j] = y;
      if (local) consider(mv, i, j, 0); // local alignments start and end with an aligned pair
      tb[i * W + j] = f | (fx << 2) | (fy << 4);
    }
    if (free && i < n) { consider(Mc[m], i, m, 0); consider(Xc[m], i, m, 1); consider(Yc[m], i, m, 2); }
    [Mp, Mc] = [Mc, Mp]; [Xp, Xc] = [Xc, Xp]; [Yp, Yc] = [Yc, Yp];
  }
  // After the loop the last row is in Mp, Xp, Yp.
  if (!local) {
    if (free) { for (let j = 0; j <= m; j++) { consider(Mp[j], n, j, 0); consider(Xp[j], n, j, 1); consider(Yp[j], n, j, 2); } }
    else { consider(Mp[m], n, m, 0); consider(Xp[m], n, m, 1); consider(Yp[m], n, m, 2); }
  }
  // Way back.
  let i = bi, j = bj, k = bk;
  const ra: string[] = [], rb: string[] = [];
  if (free) { for (let p = n; p > i; p--) { ra.push(A[p - 1]); rb.push('-'); } for (let p = m; p > j; p--) { ra.push('-'); rb.push(B[p - 1]); } }
  const endA = i, endB = j;
  while (i > 0 || j > 0) {
    if (i === 0) { if (local) break; ra.push('-'); rb.push(B[j - 1]); j--; continue; }
    if (j === 0) { if (local) break; ra.push(A[i - 1]); rb.push('-'); i--; continue; }
    const t = tb[i * W + j];
    if (k === 0) {
      const f = t & 3; ra.push(A[i - 1]); rb.push(B[j - 1]); i--; j--;
      if (f === 3) { if (local) break; k = 0; continue; }
      k = f;
    } else if (k === 1) { const f = (t >> 2) & 3; ra.push(A[i - 1]); rb.push('-'); i--; k = f; }
    else { const f = (t >> 4) & 3; ra.push('-'); rb.push(B[j - 1]); j--; k = f; }
  }
  const a = ra.reverse().join(''), b = rb.reverse().join('');
  return stats(a, b, sc, mode, best, local ? i + 1 : 1, local ? endA : n, local ? j + 1 : 1, local ? endB : m);
}

function stats(a: string, b: string, sc: Scoring, mode: Mode, score: number, aStart: number, aEnd: number, bStart: number, bEnd: number): Alignment {
  let id = 0, sim = 0, gaps = 0, opens = 0;
  for (let p = 0; p < a.length; p++) {
    const x = a[p], y = b[p];
    if (x === '-' || y === '-') { gaps++; if (p === 0 || (x === '-' ? a[p - 1] !== '-' : b[p - 1] !== '-')) opens++; continue; }
    if (x === y) id++;
    if (x === y || sc.score(x, y) > 0) sim++;
  }
  return { a, b, score, mode, aStart: aEnd >= aStart ? aStart : 0, aEnd, bStart: bEnd >= bStart ? bStart : 0, bEnd, columns: a.length, identities: id, similar: sim, gaps, gapOpenings: opens };
}

/** Score of a given alignment under the scoring, to check the way back. In semi-global mode a gap is free when it
 *  sits before the first or after the last letter of its sequence. */
export function rescore(a: string, b: string, sc: Scoring, mode: Mode) {
  const L = a.length, firstA = a.search(/[^-]/), firstB = b.search(/[^-]/);
  const lastA = L - 1 - [...a].reverse().join('').search(/[^-]/), lastB = L - 1 - [...b].reverse().join('').search(/[^-]/);
  let s = 0;
  for (let p = 0; p < L; p++) {
    const x = a[p], y = b[p];
    if (x === '-' || y === '-') {
      const ga = x === '-', end = ga ? p < firstA || p > lastA : p < firstB || p > lastB;
      if (mode === 'semiglobal' && end) continue;
      const cont = p > 0 && (ga ? a[p - 1] === '-' : b[p - 1] === '-');
      s += cont ? sc.extend : sc.open;
    } else s += sc.score(x, y);
  }
  return s;
}

/** Text in blocks: name, start, residues, end; a middle line marks | identical, : similar, space otherwise. */
export function blocks(al: Alignment, sc: Scoring, width = 60, names: [string, string] = ['A', 'B']) {
  const out: string[] = [];
  let pa = al.aStart || 1, pb = al.bStart || 1;
  const w = Math.max(names[0].length, names[1].length, 1);
  const nw = String(Math.max(al.aEnd, al.bEnd, 1)).length;
  for (let s = 0; s < al.columns; s += width) {
    const ca = al.a.slice(s, s + width), cb = al.b.slice(s, s + width);
    const ra = ca.replace(/-/g, '').length, rb = cb.replace(/-/g, '').length;
    let mid = '';
    for (let p = 0; p < ca.length; p++) mid += ca[p] === '-' || cb[p] === '-' ? ' ' : ca[p] === cb[p] ? '|' : sc.score(ca[p], cb[p]) > 0 ? ':' : ' ';
    const ea = ra ? pa + ra - 1 : pa - 1, eb = rb ? pb + rb - 1 : pb - 1;
    out.push(`${names[0].padEnd(w)} ${String(pa).padStart(nw)} ${ca} ${ea}`, `${''.padEnd(w)} ${''.padStart(nw)} ${mid}`, `${names[1].padEnd(w)} ${String(pb).padStart(nw)} ${cb} ${eb}`, '');
    pa += ra; pb += rb;
  }
  return out;
}

/** Dot plot: positions (i, j) where the k-letter word starting at a[i] equals the one at b[j] (0-based). With
 *  `reverse`, also words of `a` that equal the reverse complement of a word of `b` (DNA). */
export function dotPlot(a: string, b: string, k: number, max = 200000, reverse = false) {
  const idx = new Map<string, number[]>();
  for (let j = 0; j + k <= b.length; j++) { const w = b.slice(j, j + k); const l = idx.get(w); if (l) l.push(j); else idx.set(w, [j]); }
  const fwd: [number, number][] = [], rev: [number, number][] = [];
  const C: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
  for (let i = 0; i + k <= a.length && fwd.length < max; i++) {
    const w = a.slice(i, i + k);
    for (const j of idx.get(w) ?? []) { fwd.push([i, j]); if (fwd.length >= max) break; }
    if (reverse && rev.length < max) {
      let r = ''; for (let p = k - 1; p >= 0; p--) r += C[w[p]] ?? 'N';
      for (const j of idx.get(r) ?? []) { rev.push([i, j + k - 1]); if (rev.length >= max) break; }
    }
  }
  return { fwd, rev, capped: fwd.length >= max || rev.length >= max };
}

/** Guess DNA/RNA or protein from the letters used. */
export function guessType(s: string): 'dna' | 'protein' {
  if (!s.length) return 'dna';
  let n = 0; for (const c of s) if ('ACGTUN'.includes(c)) n++;
  return n / s.length > 0.9 ? 'dna' : 'protein';
}
