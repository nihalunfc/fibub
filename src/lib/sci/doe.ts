// Design of experiments: full factorial, 2^(k-p) fractional factorial (minimum-aberration generators found by search,
// defining relation, resolution, word-length pattern and aliases), Plackett-Burman (Paley and Sylvester
// constructions), central composite and Box-Behnken designs; seeded run-order randomisation; and analysis of the
// responses (effects with Lenth's method, least squares with t tests, main-effect means and ANOVA, and a full
// quadratic response-surface fit with its stationary point). Plain TypeScript, no DOM.
import { rng, DIST, quantile } from './distributions.ts';
import { lstsq } from './regression.ts';

export const LETTERS = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'.split(''); // no I: it stands for the identity in a defining relation

// ---------- Words (sets of factors) as bit masks ----------
export const wordName = (w: number, names = LETTERS) => { let s = ''; for (let i = 0; w; i++, w >>= 1) if (w & 1) s += names[i]; return s; };
const popcount = (w: number) => { let c = 0; while (w) { w &= w - 1; c++; } return c; };
/** Parse a word such as "ABC" (factor letters) into a mask; throws on unknown letters. */
export function parseWord(s: string, k: number): number {
  let w = 0;
  for (const ch of s.toUpperCase().replace(/\s/g, '')) {
    const i = LETTERS.indexOf(ch);
    if (i < 0 || i >= k) throw new Error(`“${ch}” is not one of the factors ${LETTERS.slice(0, k).join(', ')}.`);
    w ^= 1 << i;
  }
  return w;
}

// ---------- Fractional factorial structure ----------
export type Fraction = { k: number; p: number; generators: number[]; relation: number[]; resolution: number; wlp: number[] };
/** Defining relation (all 2^p - 1 words) from generator words (each includes its added factor). */
export function definingRelation(gens: number[]): number[] {
  const out: number[] = [];
  for (let s = 1; s < 1 << gens.length; s++) { let w = 0; gens.forEach((g, i) => { if (s & (1 << i)) w ^= g; }); out.push(w); }
  return out.sort((a, b) => popcount(a) - popcount(b) || a - b);
}
/** Word-length pattern A_1 .. A_k: how many words of each length. */
export function wordLengthPattern(rel: number[], k: number): number[] { const a = new Array(k + 1).fill(0); for (const w of rel) a[popcount(w)]++; return a; }
function fractionFrom(k: number, p: number, gens: number[]): Fraction {
  const rel = definingRelation(gens), wlp = wordLengthPattern(rel, k);
  return { k, p, generators: gens, relation: rel, resolution: rel.length ? Math.min(...rel.map(popcount)) : Infinity, wlp };
}
/** Compare word-length patterns for minimum aberration (smaller is better). */
const better = (a: number[], b: number[]) => { for (let i = 1; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };
/**
 * A minimum-aberration 2^(k-p) design found by search: the first k - p factors form a full factorial and each added
 * factor is an interaction of them. Every set of p distinct interactions is tried (up to 400,000 sets), keeping the one
 * whose word-length pattern is smallest; beyond that a greedy search is used.
 */
export function bestFraction(k: number, p: number): Fraction {
  const b = k - p;
  if (p < 1) throw new Error('A fraction needs p of at least 1.');
  if (b < 2) throw new Error(`2^(${k}−${p}) leaves fewer than 2 base factors.`);
  const cands: number[] = [];
  for (let w = 1; w < 1 << b; w++) if (popcount(w) >= 2) cands.push(w);
  cands.sort((x, y) => popcount(y) - popcount(x) || x - y); // long words first: higher resolution is found sooner
  if (cands.length < p) throw new Error(`2^(${k}−${p}) is not possible: ${b} base factors give only ${cands.length} interactions to use.`);
  let combos = 1; for (let i = 0; i < p; i++) combos = (combos * (cands.length - i)) / (i + 1);
  const gensOf = (idx: number[]) => idx.map((c, j) => cands[c] | (1 << (b + j)));
  let best: Fraction | null = null;
  if (combos <= 400000) {
    const idx = Array.from({ length: p }, (_, i) => i);
    for (;;) {
      const f = fractionFrom(k, p, gensOf(idx));
      if (!best || better(f.wlp, best.wlp)) best = f;
      let i = p - 1; while (i >= 0 && idx[i] === cands.length - p + i) i--;
      if (i < 0) break;
      idx[i]++; for (let j = i + 1; j < p; j++) idx[j] = idx[j - 1] + 1;
    }
  } else {
    const chosen: number[] = [];
    for (let j = 0; j < p; j++) {
      let pick = -1, pf: Fraction | null = null;
      for (let c = 0; c < cands.length; c++) {
        if (chosen.includes(c)) continue;
        const f = fractionFrom(k, j + 1, gensOf([...chosen, c]).map((g, i) => (i === j ? (g & ((1 << b) - 1)) | (1 << (b + j)) : g)));
        if (!pf || better(f.wlp, pf.wlp)) { pf = f; pick = c; }
      }
      chosen.push(pick);
    }
    best = fractionFrom(k, p, gensOf(chosen));
  }
  return best!;
}
/** A fraction from typed generators such as "E=ABC, F=BCD" (one for each added factor, in order). */
export function customFraction(k: number, p: number, text: string): Fraction {
  const b = k - p, parts = text.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length !== p) throw new Error(`Give ${p} generator${p > 1 ? 's' : ''}, one for each of ${LETTERS.slice(b, k).join(', ')} (for example ${LETTERS[b]}=${LETTERS.slice(0, Math.min(3, b)).join('')}).`);
  const gens = parts.map((s, j) => {
    const m = /^([A-Z])\s*=\s*([A-Z]+)$/i.exec(s);
    const want = LETTERS[b + j];
    if (!m || m[1].toUpperCase() !== want) throw new Error(`Write generator ${j + 1} as ${want}=… using the base factors ${LETTERS.slice(0, b).join('')}.`);
    const w = parseWord(m[2], b);
    if (popcount(w) < 2) throw new Error(`${s}: a generator must be an interaction of two or more base factors.`);
    return w | (1 << (b + j));
  });
  if (new Set(gens.map((g) => g & ((1 << b) - 1))).size < p) throw new Error('Two generators use the same interaction; each added factor needs its own.');
  return fractionFrom(k, p, gens);
}
/** Aliases of an effect: the effect times every word of the defining relation, shortest first. */
export const aliasesOf = (effect: number, rel: number[]) => rel.map((w) => w ^ effect).sort((a, b) => popcount(a) - popcount(b) || a - b);
/** Alias chains for every main effect and two-factor interaction, keeping aliases up to `maxOrder` factors. */
export function aliasTable(f: Fraction, maxOrder = 3, names = LETTERS): { effect: string; aliases: string[] }[] {
  const out: { effect: string; aliases: string[] }[] = [], seen = new Set<number>();
  const effects: number[] = [];
  for (let i = 0; i < f.k; i++) effects.push(1 << i);
  for (let i = 0; i < f.k; i++) for (let j = i + 1; j < f.k; j++) effects.push((1 << i) | (1 << j));
  for (const e of effects) {
    if (seen.has(e)) continue;
    const al = aliasesOf(e, f.relation);
    for (const a of al) if (popcount(a) <= 2) seen.add(a);
    seen.add(e);
    out.push({ effect: wordName(e, names), aliases: al.filter((a) => popcount(a) <= maxOrder).map((a) => wordName(a, names)) });
  }
  return out;
}

// ---------- Designs ----------
export type Design = {
  kind: 'full' | 'fractional' | 'pb' | 'ccd' | 'bbd';
  /** Coded settings, one row per run in standard order. Two-level designs use -1 and +1. */
  coded: number[][];
  /** Which block each run belongs to (CCD: 1 factorial, 2 axial); otherwise all 1. */
  block: number[];
  /** Run type: 'factorial', 'center', 'axial', 'edge', or 'level'. */
  type: string[];
  fraction?: Fraction; alpha?: number; levels?: number[][]; notes: string[];
};
/** Two-level full factorial in standard (Yates) order: the first factor changes fastest. */
export function ff2(k: number): number[][] {
  return Array.from({ length: 2 ** k }, (_, r) => Array.from({ length: k }, (_, j) => ((r >> j) & 1 ? 1 : -1)));
}
/** General full factorial: level indices 0..L-1 per factor, the first factor fastest. */
export function fullFactorial(levels: number[]): number[][] {
  const n = levels.reduce((a, b) => a * b, 1), out: number[][] = [];
  for (let r = 0; r < n; r++) { let v = r; out.push(levels.map((L) => { const i = v % L; v = Math.floor(v / L); return i; })); }
  return out;
}
export function fractional(f: Fraction): number[][] {
  const b = f.k - f.p;
  return ff2(b).map((row) => {
    const out = row.slice();
    for (const g of f.generators) { let v = 1; for (let i = 0; i < b; i++) if (g & (1 << i)) v *= row[i]; out.push(v); }
    return out;
  });
}
const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
/** Sizes of Plackett-Burman designs this tool can build (Paley for prime N-1, Sylvester doubling). */
export function pbSizes(max = 100): number[] {
  const ok = (N: number): boolean => N === 4 || (N % 4 === 0 && ((isPrime(N - 1) && (N - 1) % 4 === 3) || (N % 8 === 0 && ok(N / 2))));
  const out: number[] = []; for (let N = 4; N <= max; N += 4) if (ok(N)) out.push(N);
  return out;
}
/** The Plackett-Burman generating row for N = p + 1, p prime and 3 mod 4: +, then the quadratic character of 1..p-1. */
export function paleyRow(p: number): number[] {
  const qr = new Set<number>(); for (let x = 1; x < p; x++) qr.add((x * x) % p);
  return [1, ...Array.from({ length: p - 1 }, (_, j) => (qr.has(j + 1) ? 1 : -1))];
}
/** An N-run Plackett-Burman design (N - 1 columns, standard layout: cyclic rows, then a row of all minus). */
export function plackettBurman(N: number): number[][] {
  if (!pbSizes(N).includes(N)) throw new Error(`No ${N}-run Plackett–Burman design here; choose ${pbSizes(100).join(', ')}.`);
  if (isPrime(N - 1) && (N - 1) % 4 === 3) {
    const g = paleyRow(N - 1), m = N - 1;
    const rows = Array.from({ length: m }, (_, r) => Array.from({ length: m }, (_, c) => g[(c - r + m) % m]));
    rows.push(new Array(m).fill(-1));
    return rows;
  }
  // Sylvester doubling of a smaller Hadamard matrix [H H; H -H], first column (all +) dropped; rows ordered so the
  // all-minus row is last, as in the usual layout.
  const half = N === 4 ? [[1, 1], [1, -1]] : hadamard(N / 2);
  const H = N === 4 ? [[1, 1, 1, 1], [1, -1, 1, -1], [1, 1, -1, -1], [1, -1, -1, 1]] : [...half.map((r) => [...r, ...r]), ...half.map((r) => [...r, ...r.map((v) => -v)])];
  // Normalise so the first row is all plus (flipping whole columns keeps them orthogonal).
  const sg = H[0].map((v) => (v > 0 ? 1 : -1));
  const rows = H.map((r) => r.slice(1).map((v, j) => -v * sg[j + 1]));
  return rows.reverse();
}
function hadamard(N: number): number[][] {
  // Normalised Hadamard matrix (first row and column all +).
  if (N === 2) return [[1, 1], [1, -1]];
  if (N === 4) return [[1, 1, 1, 1], [1, -1, 1, -1], [1, 1, -1, -1], [1, -1, -1, 1]];
  if (isPrime(N - 1) && (N - 1) % 4 === 3) return plackettBurman(N).map((r) => [1, ...r.map((v) => -v)]);
  const h = hadamard(N / 2);
  return [...h.map((r) => [...r, ...r]), ...h.map((r) => [...r, ...r.map((v) => -v)])];
}
export type CcdOpts = { alpha: 'rotatable' | 'orthogonal' | 'face' | 'spherical' | number; face: 'circumscribed' | 'inscribed' | 'faced'; centerF: number; centerA: number; half?: boolean };
/** Central composite design: factorial (or half-fraction) corners, 2k axial points at ±α, and centre points in two blocks. */
export function ccd(k: number, o: CcdOpts): { coded: number[][]; block: number[]; type: string[]; alpha: number; fraction?: Fraction } {
  if (k < 2 || k > 10) throw new Error('A central composite design here takes 2 to 10 factors.');
  let corners: number[][], fraction: Fraction | undefined;
  if (o.half) { if (k < 5) throw new Error('A half-fraction core is for 5 or more factors.'); fraction = bestFraction(k, 1); corners = fractional(fraction); }
  else corners = ff2(k);
  const nf = corners.length, na = 2 * k;
  let a: number;
  if (o.face === 'faced' || o.alpha === 'face') a = 1;
  else if (typeof o.alpha === 'number') a = o.alpha;
  else if (o.alpha === 'rotatable') a = nf ** 0.25;
  else if (o.alpha === 'spherical') a = Math.sqrt(k);
  else a = Math.sqrt((k * (1 + o.centerA / na)) / (1 + o.centerF / nf)); // orthogonal blocking
  if (!(a > 0)) throw new Error('α must be above 0.');
  const axial: number[][] = [];
  for (let j = 0; j < k; j++) for (const s of [-1, 1]) { const r = new Array(k).fill(0); r[j] = s * a; axial.push(r); }
  const zero = () => new Array(k).fill(0);
  let coded = [...corners, ...Array.from({ length: o.centerF }, zero), ...axial, ...Array.from({ length: o.centerA }, zero)];
  if (o.face === 'inscribed' && a !== 1) coded = coded.map((r) => r.map((v) => v / a));
  const block = [...corners.map(() => 1), ...new Array(o.centerF).fill(1), ...axial.map(() => 2), ...new Array(o.centerA).fill(2)];
  const type = [...corners.map(() => 'factorial'), ...new Array(o.centerF).fill('center'), ...axial.map(() => 'axial'), ...new Array(o.centerA).fill('center')];
  return { coded, block, type, alpha: o.face === 'faced' ? 1 : a, fraction };
}
/** Box-Behnken design: a 2^2 factorial in every pair of factors with the others at the centre, then centre points. */
export function boxBehnken(k: number, center: number): { coded: number[][]; type: string[] } {
  if (k < 3 || k > 10) throw new Error('A Box–Behnken design here takes 3 to 10 factors.');
  const coded: number[][] = [];
  for (let i = 0; i < k - 1; i++) for (let j = i + 1; j < k; j++) for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const r = new Array(k).fill(0); r[i] = a; r[j] = b; coded.push(r); }
  const n = coded.length;
  for (let c = 0; c < center; c++) coded.push(new Array(k).fill(0));
  return { coded, type: [...new Array(n).fill('edge'), ...new Array(center).fill('center')] };
}
/** Default number of Box-Behnken centre points (as pyDOE). */
export const bbdCenters = (k: number) => [0, 0, 0, 3, 3, 6, 6, 6, 8, 9, 10][k] ?? 10;

/** A seeded random run order (Fisher-Yates): returns the standard-order index of each run in run order. */
export function runOrder(n: number, seed: number): number[] {
  const u = rng(seed), a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(u() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- Analysis ----------
/** Lenth's (1989) pseudo standard error, margin of error and simultaneous margin of error for m effects. */
export function lenth(effects: number[], conf = 0.95) {
  const m = effects.length, abs = effects.map(Math.abs).sort((a, b) => a - b);
  const med = (a: number[]) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
  const s0 = 1.5 * med(abs), trimmed = abs.filter((v) => v < 2.5 * s0);
  const pse = 1.5 * med(trimmed.length ? trimmed : abs), df = m / 3;
  const t = (q: number) => quantile(DIST.t, { nu: df, mu: 0, sigma: 1 }, q);
  const gamma = (1 + conf ** (1 / m)) / 2;
  return { pse, df, me: t(1 - (1 - conf) / 2) * pse, sme: t(gamma) * pse };
}
export type EffectRow = { name: string; effect: number; coef: number; se?: number; t?: number; p?: number };
/**
 * Effects of a two-level design: one per column of the given contrast matrix (columns of -1/+1, 0 for centre runs).
 * effect = mean(+) - mean(-). With spare degrees of freedom (replicates, centre points) a least-squares fit gives t tests;
 * otherwise use Lenth's method on the effects.
 */
export function twoLevelEffects(X: number[][], y: number[], names: string[], curvature?: boolean[]): { rows: EffectRow[]; dfResid: number; sigma: number; curvature?: { est: number; se: number; t: number; p: number } } {
  const n = y.length;
  const rows: EffectRow[] = names.map((name, j) => {
    let sp = 0, np = 0, sm = 0, nm = 0;
    X.forEach((r, i) => { if (r[j] > 0) { sp += y[i]; np++; } else if (r[j] < 0) { sm += y[i]; nm++; } });
    const effect = sp / np - sm / nm;
    return { name, effect, coef: effect / 2 };
  });
  const cols = names.length + 1 + (curvature?.some(Boolean) ? 1 : 0);
  const dfResid = n - cols;
  if (dfResid < 1) return { rows, dfResid: 0, sigma: NaN };
  const M = X.map((r, i) => [1, ...r, ...(cols > names.length + 1 ? [curvature![i] ? 1 : 0] : [])]);
  const L = lstsq(M, y, ['Intercept', ...names, 'Curvature']);
  const sse = L.resid.reduce((s, e) => s + e * e, 0), s2 = sse / dfResid;
  const tp = (est: number, v: number) => { const se = Math.sqrt(s2 * v), t = est / se; return { se, t, p: 2 * DIST.t.sf(Math.abs(t), { nu: dfResid, mu: 0, sigma: 1 }) }; };
  rows.forEach((r, j) => { const s = tp(L.beta[j + 1], L.XtXi[j + 1][j + 1]); r.coef = L.beta[j + 1]; r.se = 2 * s.se; r.t = s.t; r.p = s.p; });
  let curv;
  if (cols > names.length + 1) { const j = cols - 1; curv = { est: L.beta[j], ...tp(L.beta[j], L.XtXi[j][j]) }; }
  return { rows, dfResid, sigma: Math.sqrt(s2), curvature: curv };
}
/** Mean response at each level of each factor (main-effect means), and F tests of an additive main-effects model. */
export function mainEffects(levels: number[][], y: number[], names: string[]) {
  const n = y.length, k = names.length;
  const means = names.map((_, j) => { const vals = [...new Set(levels.map((r) => r[j]))].sort((a, b) => a - b); return vals.map((v) => { const ys = y.filter((_, i) => levels[i][j] === v); return { level: v, mean: ys.reduce((s, x) => s + x, 0) / ys.length, n: ys.length }; }); });
  // Additive model with indicator columns.
  const design = (skip: number) => levels.map((r) => { const row = [1]; names.forEach((_, j) => { if (j === skip) return; means[j].slice(1).forEach((m) => row.push(r[j] === m.level ? 1 : 0)); }); return row; });
  const sseOf = (skip: number) => { const L = lstsq(design(skip), y); return { sse: L.resid.reduce((s, e) => s + e * e, 0), p: L.p }; };
  const full = sseOf(-1), dfE = n - full.p;
  const ybar = y.reduce((s, v) => s + v, 0) / n, sst = y.reduce((s, v) => s + (v - ybar) ** 2, 0);
  const anova = names.map((name, j) => {
    const r = sseOf(j), df = means[j].length - 1, ss = r.sse - full.sse;
    const F = dfE > 0 ? ss / df / (full.sse / dfE) : NaN;
    return { name, df, ss, ms: ss / df, F, p: dfE > 0 && full.sse > 0 ? DIST.f.sf(F, { d1: df, d2: dfE }) : NaN };
  });
  return { means, anova, dfError: dfE, sseError: full.sse, sst, r2: 1 - full.sse / sst, k };
}
/** Full quadratic response surface in coded units, with its stationary point and the eigenvalues that say what kind it is. */
export function quadratic(coded: number[][], y: number[], names: string[]) {
  const k = names.length, terms: { name: string; f: (x: number[]) => number }[] = [{ name: 'Intercept', f: () => 1 }];
  names.forEach((nm, i) => terms.push({ name: nm, f: (x) => x[i] }));
  names.forEach((nm, i) => terms.push({ name: `${nm}²`, f: (x) => x[i] * x[i] }));
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) terms.push({ name: `${names[i]}·${names[j]}`, f: (x) => x[i] * x[j] });
  const X = coded.map((r) => terms.map((t) => t.f(r))), n = y.length, p = terms.length;
  if (n <= p) throw new Error(`A full quadratic model has ${p} terms; it needs more than ${p} runs with responses.`);
  const L = lstsq(X, y, terms.map((t) => t.name)), df = n - p;
  const sse = L.resid.reduce((s, e) => s + e * e, 0), s2 = sse / df, ybar = y.reduce((s, v) => s + v, 0) / n, sst = y.reduce((s, v) => s + (v - ybar) ** 2, 0);
  const coefs = terms.map((t, j) => { const se = Math.sqrt(s2 * L.XtXi[j][j]), tv = L.beta[j] / se; return { name: t.name, est: L.beta[j], se, t: tv, p: 2 * DIST.t.sf(Math.abs(tv), { nu: df, mu: 0, sigma: 1 }) }; });
  // y = b0 + x'b + x'Bx; stationary point x_s = -B^-1 b / 2.
  const b = L.beta.slice(1, 1 + k), B = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => (i === j ? L.beta[1 + k + i] : 0)));
  let t = 1 + 2 * k; for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) { B[i][j] = B[j][i] = L.beta[t++] / 2; }
  const xs = solveLin(B, b.map((v) => -v / 2));
  const ys = xs ? L.beta[0] + xs.reduce((s, v, i) => s + v * b[i], 0) / 2 : NaN;
  const eig = jacobiEigen(B);
  const kind = eig.every((e) => e < 0) ? 'maximum' : eig.every((e) => e > 0) ? 'minimum' : 'saddle point';
  return { coefs, r2: 1 - sse / sst, adjR2: 1 - (sse / df) / (sst / (n - 1)), df, sigma: Math.sqrt(s2), stationary: xs, yStationary: ys, eigen: eig, kind, fitted: L.fitted };
}
function solveLin(A: number[][], b: number[]): number[] | null {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let q = c; q <= n; q++) M[r][q] -= f * M[c][q]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let q = r + 1; q < n; q++) s -= M[r][q] * x[q]; x[r] = s / M[r][r]; }
  return x;
}
/** Eigenvalues of a symmetric matrix (cyclic Jacobi), sorted. */
export function jacobiEigen(S: number[][]): number[] {
  const n = S.length, A = S.map((r) => r.slice());
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let r = 0; r < n; r++) { const a = A[r][p], b = A[r][q]; A[r][p] = c * a - s * b; A[r][q] = s * a + c * b; }
      for (let r = 0; r < n; r++) { const a = A[p][r], b = A[q][r]; A[p][r] = c * a - s * b; A[q][r] = s * a + c * b; }
    }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
/** Half-normal plot positions for m absolute effects: Φ^-1(0.5 + 0.5 (i - 0.5)/m). */
export function halfNormalQuantiles(m: number): number[] {
  return Array.from({ length: m }, (_, i) => quantile(DIST.normal, { mu: 0, sigma: 1 }, 0.5 + (0.5 * (i + 0.5)) / m));
}
