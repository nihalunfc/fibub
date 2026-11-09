// Information measures for #578 entropy-calculator: Shannon entropy of a distribution, of text or of a file's
// bytes, joint and conditional entropy and mutual information from a joint table, Kullback-Leibler divergence,
// and channel capacity (binary symmetric, erasure, Z channel, and any discrete channel by Blahut-Arimoto).
// Plain TypeScript, no DOM. Checked against scipy.stats.entropy and an independent numpy Blahut-Arimoto
// (tests/sci-tools/entropy-calculator.mjs).
import { num, parseTable } from './num.ts';

export type Base = 2 | 2.718281828459045 | 10;
export const UNIT: Record<string, string> = { '2': 'bits', '2.718281828459045': 'nats', '10': 'hartleys' };
const lg = (x: number, b: number) => Math.log(x) / Math.log(b);

/** Weights (counts or probabilities) to probabilities. Throws on negatives or a zero total. */
export function normalise(w: number[]): number[] {
  if (!w.length) throw new Error('Type at least one value.');
  if (w.some((x) => !Number.isFinite(x))) throw new Error('Every value must be a number.');
  if (w.some((x) => x < 0)) throw new Error('Probabilities and counts cannot be negative.');
  const s = w.reduce((a, b) => a + b, 0);
  if (!(s > 0)) throw new Error('The values add up to zero.');
  return w.map((x) => x / s);
}

/** Shannon entropy −Σ p log p of weights (normalised first). 0 log 0 = 0. */
export function entropy(w: number[], base: number = 2): number {
  const p = normalise(w);
  let h = 0;
  for (const x of p) if (x > 0) h -= x * Math.log(x);
  return Math.max(0, h / Math.log(base));
}

/** Binary entropy function h(p) in bits. */
export const h2 = (p: number) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));

export type DistSummary = {
  p: number[]; n: number; support: number; H: number; Hmax: number; efficiency: number; redundancy: number;
  perplexity: number; minEntropy: number; collision: number; normalised: boolean;
};
/** Shannon, maximum, min-entropy (Rényi ∞) and collision entropy (Rényi 2) of a distribution. */
export function summarise(w: number[], base: number = 2): DistSummary {
  const p = normalise(w), s = w.reduce((a, b) => a + b, 0);
  const support = p.filter((x) => x > 0).length;
  const H = entropy(p, base), Hmax = lg(p.length, base);
  return {
    p, n: p.length, support, H, Hmax,
    efficiency: Hmax > 0 ? H / Hmax : 1, redundancy: Hmax > 0 ? 1 - H / Hmax : 0,
    perplexity: Math.exp(H * Math.log(base)),
    minEntropy: -lg(Math.max(...p), base),
    collision: -lg(p.reduce((a, x) => a + x * x, 0), base),
    normalised: Math.abs(s - 1) > 1e-9,
  };
}

export type Unit = 'char' | 'byte' | 'word';
/** Symbol counts of text: Unicode characters, UTF-8 bytes or words (letters and digits, lower-cased). */
export function countSymbols(text: string, unit: Unit): Map<string, number> {
  const m = new Map<string, number>();
  const add = (k: string) => m.set(k, (m.get(k) ?? 0) + 1);
  if (unit === 'byte') { for (const b of new TextEncoder().encode(text)) add(String(b)); }
  else if (unit === 'word') { for (const w of text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []) add(w); }
  else for (const c of text) add(c);
  return m;
}
/** Counts of each byte value 0..255 in a file's bytes. */
export function byteCounts(bytes: Uint8Array): number[] {
  const c = new Array<number>(256).fill(0);
  for (let i = 0; i < bytes.length; i++) c[bytes[i]]++;
  return c;
}

export type JointResult = {
  rows: number; cols: number; P: number[][]; px: number[]; py: number[];
  Hx: number; Hy: number; Hxy: number; HxGy: number; HyGx: number; I: number; nmi: number; normalised: boolean;
};
/** Entropies and mutual information from a joint table of counts or probabilities (rows X, columns Y). */
export function joint(table: number[][], base: number = 2): JointResult {
  const r = table.length;
  if (r < 1) throw new Error('Type a table with at least one row.');
  const c = table[0].length;
  if (table.some((row) => row.length !== c)) throw new Error('Every row of the table needs the same number of values.');
  const flat = normalise(table.flat());
  const P = table.map((_, i) => flat.slice(i * c, i * c + c));
  const px = P.map((row) => row.reduce((a, b) => a + b, 0));
  const py = Array.from({ length: c }, (_, j) => P.reduce((a, row) => a + row[j], 0));
  const Hx = entropy(px, base), Hy = entropy(py, base), Hxy = entropy(flat, base);
  // I from the definition Σ p(x,y) log p(x,y)/(p(x)p(y)), which avoids cancellation when it is tiny.
  let I = 0;
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) if (P[i][j] > 0) I += P[i][j] * Math.log(P[i][j] / (px[i] * py[j]));
  I = Math.max(0, I / Math.log(base));
  const s = table.flat().reduce((a, b) => a + b, 0);
  return { rows: r, cols: c, P, px, py, Hx, Hy, Hxy, HxGy: Math.max(0, Hxy - Hy), HyGx: Math.max(0, Hxy - Hx), I, nmi: Math.min(Hx, Hy) > 0 ? I / Math.min(Hx, Hy) : 0, normalised: Math.abs(s - 1) > 1e-9 };
}

export type KLResult = { pq: number; qp: number; crossPQ: number; Hp: number; Hq: number; js: number; infiniteAt: number[] };
/** Kullback-Leibler divergence both ways, cross-entropy and Jensen-Shannon divergence of two distributions. */
export function divergence(pw: number[], qw: number[], base: number = 2): KLResult {
  if (pw.length !== qw.length) throw new Error(`P has ${pw.length} values and Q has ${qw.length}: they need the same number.`);
  const p = normalise(pw), q = normalise(qw), L = Math.log(base);
  const kl = (a: number[], b: number[]) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] > 0) d += b[i] > 0 ? a[i] * Math.log(a[i] / b[i]) : Infinity; return d / L; };
  const m = p.map((x, i) => (x + q[i]) / 2);
  let cross = 0; for (let i = 0; i < p.length; i++) if (p[i] > 0) cross += q[i] > 0 ? -p[i] * Math.log(q[i]) : Infinity;
  return { pq: kl(p, q), qp: kl(q, p), crossPQ: cross / L, Hp: entropy(p, base), Hq: entropy(q, base), js: Math.max(0, (kl(p, m) + kl(q, m)) / 2), infiniteAt: p.map((x, i) => (x > 0 && q[i] === 0 ? i : -1)).filter((i) => i >= 0) };
}

/** Capacity of the binary symmetric channel with crossover p, in bits per use. */
export const bscCapacity = (p: number) => 1 - h2(p);
/** Capacity of the binary erasure channel with erasure probability e, in bits per use. */
export const becCapacity = (e: number) => 1 - e;
/** Capacity of the Z channel (a 1 turns into a 0 with probability p; a 0 always arrives), in bits per use. */
export const zCapacity = (p: number) => (p >= 1 ? 0 : p <= 0 ? 1 : Math.log2(1 + (1 - p) * p ** (p / (1 - p))));

/** Mutual information I(X;Y) in the given base for input distribution px through channel W (rows x, W[x][y] = P(y|x)). */
export function channelInfo(px: number[], W: number[][], base: number = 2): number {
  const ny = W[0].length, py = new Array<number>(ny).fill(0);
  px.forEach((p, x) => W[x].forEach((w, y) => (py[y] += p * w)));
  let I = 0;
  px.forEach((p, x) => { if (p > 0) W[x].forEach((w, y) => { if (w > 0) I += p * w * Math.log(w / py[y]); }); });
  return Math.max(0, I / Math.log(base));
}

/** Rows of a channel matrix checked and normalised (each row is P(y | x) and must add to 1, or are counts). */
export function channelMatrix(rows: number[][]): { W: number[][]; rescaled: boolean } {
  if (rows.length < 1) throw new Error('Type the channel matrix: one row per input, one column per output.');
  const c = rows[0].length;
  if (c < 1) throw new Error('Each row needs at least one output.');
  if (rows.some((r) => r.length !== c)) throw new Error('Every row of the channel matrix needs the same number of outputs.');
  let rescaled = false;
  const W = rows.map((r, i) => {
    if (r.some((x) => !Number.isFinite(x) || x < 0)) throw new Error(`Row ${i + 1} has a value that is not a number at or above 0.`);
    const s = r.reduce((a, b) => a + b, 0);
    if (!(s > 0)) throw new Error(`Row ${i + 1} adds up to zero.`);
    if (Math.abs(s - 1) > 1e-6) rescaled = true;
    return r.map((x) => x / s);
  });
  return { W, rescaled };
}

export type BAResult = { capacity: number; px: number[]; iterations: number; lower: number[]; upper: number[]; converged: boolean; gap: number };
/**
 * Channel capacity by the Blahut-Arimoto algorithm (Blahut 1972, Arimoto 1972). Each step updates the input
 * distribution r(x) ∝ r(x) exp D_x, where D_x = D(W(·|x) || q) and q is the output distribution, and gives
 * Blahut's bounds log Σ r(x) exp D_x ≤ C ≤ max_x D_x (in nats), so the gap says how far from the true capacity
 * the answer can be. Results are in `base`.
 */
export function blahutArimoto(W: number[][], base: number = 2, tol = 1e-12, maxIter = 20000): BAResult {
  const nx = W.length, ny = W[0].length, L = Math.log(base);
  let r = new Array<number>(nx).fill(1 / nx);
  const lower: number[] = [], upper: number[] = [];
  let it = 0, lo = 0, hi = Infinity;
  const D = new Array<number>(nx);
  for (; it < maxIter; it++) {
    const q = new Array<number>(ny).fill(0);
    for (let x = 0; x < nx; x++) for (let y = 0; y < ny; y++) q[y] += r[x] * W[x][y];
    for (let x = 0; x < nx; x++) { let d = 0; for (let y = 0; y < ny; y++) if (W[x][y] > 0) d += W[x][y] * Math.log(W[x][y] / q[y]); D[x] = d; }
    let z = 0;
    for (let x = 0; x < nx; x++) z += r[x] * Math.exp(D[x]);
    lo = Math.log(z); hi = Math.max(...D);
    lower.push(lo / L); upper.push(hi / L);
    r = r.map((v, x) => (v * Math.exp(D[x])) / z);
    if (hi - lo < tol) { it++; break; }
  }
  return { capacity: Math.max(0, (lo + hi) / 2 / L), px: r, iterations: it, lower, upper, converged: hi - lo < tol, gap: Math.max(0, (hi - lo) / L) };
}

/** One typed value: a number in any everyday format, or a fraction such as 1/3. NaN if neither. */
export function readCell(t: string): number {
  const f = t.trim().split('/');
  if (f.length === 2) { const a = num(f[0]), b = num(f[1]); return b > 0 ? a / b : NaN; }
  return num(t);
}

/**
 * A distribution typed or pasted: numbers split by commas, spaces or new lines, or one "label, value" pair per
 * line (from a spreadsheet; a header row is skipped). Returns labels when the text has them.
 */
export function readDist(text: string): { labels: string[] | null; values: number[] } {
  const rows = parseTable(text);
  if (!rows.length) throw new Error('Type some probabilities or counts.');
  const labelled = rows.length > 1 && rows.every((r) => r.length === 2) && rows.slice(1).every((r) => Number.isNaN(readCell(r[0])) && !Number.isNaN(readCell(r[1])));
  if (labelled) {
    const body = Number.isNaN(readCell(rows[0][1])) ? rows.slice(1) : rows;
    return { labels: body.map((r) => r[0]), values: body.map((r) => readCell(r[1])) };
  }
  const cells = rows.flat().flatMap((c) => c.split(/\s+/)).filter(Boolean);
  const values = cells.map((c) => { const v = readCell(c); if (Number.isNaN(v)) throw new Error(`"${c.slice(0, 20)}" is not a number.`); return v; });
  return { labels: null, values };
}

/** A table of numbers pasted or opened from a file. A header row and a first column of labels are skipped. */
export function readTable(text: string): { rows: number[][]; rowNames: string[] | null; colNames: string[] | null } {
  let rows = parseTable(text);
  if (!rows.length) throw new Error('Type or paste a table of numbers.');
  let colNames: string[] | null = null, rowNames: string[] | null = null;
  const bad = (c: string) => c !== '' && Number.isNaN(readCell(c));
  if (rows.length > 1 && rows.slice(1).every((r) => bad(r[0]))) { rowNames = rows.map((r) => r[0]); rows = rows.map((r) => r.slice(1)); }
  if (rows[0].some(bad)) { colNames = rows[0]; rows = rows.slice(1); rowNames = rowNames?.slice(1) ?? null; }
  if (!rows.length) throw new Error('The table has a header but no numbers.');
  const out = rows.map((r, i) => r.map((c, j) => { const v = readCell(c); if (Number.isNaN(v)) throw new Error(`Row ${i + 1}, column ${j + 1}: "${c.slice(0, 20)}" is not a number.`); return v; }));
  return { rows: out, rowNames, colNames };
}

export const EXAMPLE_DIST = '0.5, 0.25, 0.125, 0.125';
export const EXAMPLE_TEXT = 'the quick brown fox jumps over the lazy dog while the cat sleeps in the warm sun';
// Made-up joint counts: weather (rows: sun, cloud, rain) against taking an umbrella (columns: no, yes).
export const EXAMPLE_JOINT = ',no umbrella,umbrella\nsun,40,5\ncloud,20,15\nrain,2,18';
export const EXAMPLE_P = '0.4, 0.3, 0.2, 0.1';
export const EXAMPLE_Q = '0.25, 0.25, 0.25, 0.25';
// A made-up noisy 3-input, 3-output channel (a typewriter-like channel where each letter can slip to the next).
export const EXAMPLE_CHANNEL = '0.8, 0.1, 0.1\n0.1, 0.8, 0.1\n0, 0.3, 0.7';
