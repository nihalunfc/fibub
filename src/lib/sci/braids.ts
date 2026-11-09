// Braids and their closures: reading braid words (σ1 σ2^-1 …, s1 s2^-1, 1 -2, or a A b B letters), crossing
// count, writhe, the permutation, the number of components of the closure, and the Alexander polynomial of the
// closure from the reduced Burau representation: Δ(t) ≐ det(I − B(β)) · (1 − t) / (1 − t^n). Exact, with
// Laurent polynomials over BigInt. Plain TypeScript, no DOM. Checked against sympy in tests/sci-tools/knot-braid-drawer.mjs.

/** A braid word: each letter is ±i, meaning σi (+) or σi⁻¹ (−), on n strands. */
export type Braid = { n: number; word: number[] };

const SUP: Record<string, string> = { '⁻': '-', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁰': '0' };
const SUB: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
export const MAX_STRANDS = 10, MAX_LETTERS = 400;

/**
 * Read a braid word. Accepts σ1 σ2^-1, s1 s2^-1 (also σ₁σ₂⁻¹), whole numbers 1 -2 3, or letters a = σ1, A = σ1⁻¹,
 * b = σ2, …; powers with ^k or superscripts; brackets with a power, (σ1 σ2^-1)^3.
 */
export function parseBraid(src: string, strands?: number): Braid {
  let s = src.replace(/[⁻¹²³⁴⁵⁶⁷⁸⁹⁰]+/g, (m) => '^' + [...m].map((c) => SUP[c]).join('')).replace(/[₀-₉]/g, (c) => SUB[c]).replace(/[−–]/g, '-').trim();
  if (!s) throw new Error('Type a braid word, such as σ1 σ2^-1 σ1 σ2^-1.');
  let i = 0;
  const fail = (m?: string): never => { throw new Error(m ?? `Could not read the braid word at "${s.slice(i, i + 8)}". Use σ1 σ2^-1 (or s1 s2^-1, 1 -2, a B).`); };
  const ws = () => { while (i < s.length && /[\s,.*·]/.test(s[i])) i++; };
  const power = (): number => {
    ws();
    if (s[i] !== '^') return 1;
    i++; ws();
    const m = /^[-+]?\d+/.exec(s.slice(i)) ?? /^\{\s*([-+]?\d+)\s*\}/.exec(s.slice(i));
    if (!m) fail();
    i += m![0].length;
    return Number(m![1] ?? m![0]);
  };
  const seq = (depth: number): number[] => {
    const out: number[] = [];
    for (;;) {
      ws();
      if (i >= s.length) { if (depth) fail('A bracket is not closed.'); return out; }
      const c = s[i];
      if (c === ')') { if (!depth) fail('A closing bracket has no opening one.'); i++; return out; }
      let part: number[];
      if (c === '(') { i++; part = seq(depth + 1); }
      else {
        let m: RegExpExecArray | null;
        if ((m = /^(?:σ|s|sigma|σ_|s_)_?(\d+)/i.exec(s.slice(i)))) { i += m[0].length; if (Number(m[1]) === 0) fail('σ0 does not exist: strands are numbered from 1.'); part = [Number(m[1])]; }
        else if ((m = /^[-+]?\d+/.exec(s.slice(i)))) { i += m[0].length; const v = Number(m[0]); if (v === 0) fail('σ0 does not exist: strands are numbered from 1.'); part = [v]; }
        else if (/^[a-zA-Z]/.test(c) && !/^s\d/i.test(s.slice(i))) { i++; const k = c.toLowerCase().charCodeAt(0) - 96; part = [c === c.toLowerCase() ? k : -k]; }
        else return fail();
      }
      const p = power();
      if (Math.abs(p) > 200) fail('Powers up to 200 only.');
      const unit = p < 0 ? [...part].reverse().map((x) => -x) : part;
      for (let k = 0; k < Math.abs(p); k++) out.push(...unit);
      if (out.length > MAX_LETTERS) fail(`Braid words up to ${MAX_LETTERS} crossings.`);
    }
  };
  const word = seq(0);
  if (!word.length) fail('The braid word is empty.');
  const need = Math.max(...word.map(Math.abs)) + 1;
  const n = Math.max(need, strands ?? 0, 2);
  if (n > MAX_STRANDS) fail(`Up to ${MAX_STRANDS} strands.`);
  return { n, word };
}
export const wordText = (w: number[]) => w.map((x) => `σ${Math.abs(x)}${x < 0 ? '⁻¹' : ''}`).join(' ');

/** Where each strand ends: perm[start position] = end position (0-based). */
export function permutation(b: Braid): number[] {
  const at = [...Array(b.n).keys()]; // at[pos] = strand now at pos
  for (const x of b.word) { const i = Math.abs(x) - 1; [at[i], at[i + 1]] = [at[i + 1], at[i]]; }
  const perm = new Array(b.n); at.forEach((strand, pos) => (perm[strand] = pos));
  return perm;
}
/** Cycles of the permutation = components of the closure; each lists the starting positions it visits. */
export function components(b: Braid): number[][] {
  const p = permutation(b), seen = new Array(b.n).fill(false), out: number[][] = [];
  for (let i = 0; i < b.n; i++) { if (seen[i]) continue; const c: number[] = []; let j = i; while (!seen[j]) { seen[j] = true; c.push(j); j = p[j]; } out.push(c); }
  return out;
}
export const writhe = (b: Braid) => b.word.reduce((s, x) => s + Math.sign(x), 0);
/** Free reduction: cancel σi σi⁻¹ next to each other (also around the closure, since the closure is a loop). */
export function freeReduce(w: number[], cyclic = false): number[] {
  const out: number[] = [];
  for (const x of w) { if (out.length && out[out.length - 1] === -x) out.pop(); else out.push(x); }
  if (cyclic) while (out.length > 1 && out[0] === -out[out.length - 1]) { out.shift(); out.pop(); }
  return out;
}
/** Crossings between different components (half the sum of their signs is the linking number for 2 components). */
export function linking(b: Braid): number[][] {
  const comps = components(b), compOf = new Array(b.n); comps.forEach((c, k) => c.forEach((s) => (compOf[s] = k)));
  const L = comps.map(() => comps.map(() => 0));
  const at = [...Array(b.n).keys()];
  for (const x of b.word) { const i = Math.abs(x) - 1, a = compOf[at[i]], c = compOf[at[i + 1]]; if (a !== c) { L[a][c] += Math.sign(x); L[c][a] += Math.sign(x); } [at[i], at[i + 1]] = [at[i + 1], at[i]]; }
  return L.map((r) => r.map((v) => v / 2));
}

// ---------- Laurent polynomials in t with BigInt coefficients ----------
/** c[k] is the coefficient of t^(lo + k); zero polynomial is { lo: 0, c: [] }. */
export type LP = { lo: number; c: bigint[] };
export function lp(c: (bigint | number)[], lo = 0): LP { return trim({ lo, c: c.map(BigInt) }); }
function trim(p: LP): LP {
  let a = 0, b = p.c.length;
  while (a < b && p.c[a] === 0n) a++;
  while (b > a && p.c[b - 1] === 0n) b--;
  return a === b ? { lo: 0, c: [] } : { lo: p.lo + a, c: p.c.slice(a, b) };
}
export const isZero = (p: LP) => p.c.length === 0;
export function add(p: LP, q: LP, sq = 1n): LP {
  if (isZero(p)) return sq === 1n ? q : { lo: q.lo, c: q.c.map((x) => x * sq) };
  if (isZero(q)) return p;
  const lo = Math.min(p.lo, q.lo), hi = Math.max(p.lo + p.c.length, q.lo + q.c.length), c = new Array<bigint>(hi - lo).fill(0n);
  p.c.forEach((x, k) => (c[p.lo + k - lo] += x)); q.c.forEach((x, k) => (c[q.lo + k - lo] += sq * x));
  return trim({ lo, c });
}
export const sub = (p: LP, q: LP) => add(p, q, -1n);
export function mul(p: LP, q: LP): LP {
  if (isZero(p) || isZero(q)) return { lo: 0, c: [] };
  const c = new Array<bigint>(p.c.length + q.c.length - 1).fill(0n);
  p.c.forEach((x, i) => { if (x) q.c.forEach((y, j) => (c[i + j] += x * y)); });
  return trim({ lo: p.lo + q.lo, c });
}
/** Exact division p / q; throws if it does not divide. */
export function div(p: LP, q: LP): LP {
  if (isZero(q)) throw new Error('Division by zero polynomial.');
  if (isZero(p)) return p;
  let r = p; const out = new Map<number, bigint>();
  const qh = q.c[q.c.length - 1], qhd = q.lo + q.c.length - 1;
  let guard = 0;
  while (!isZero(r)) {
    if (++guard > 100000) throw new Error('Division did not end.');
    const rh = r.c[r.c.length - 1], rhd = r.lo + r.c.length - 1;
    if (rh % qh !== 0n || r.c.length < q.c.length) throw new Error('Polynomial division is not exact.');
    const k = rhd - qhd, coef = rh / qh;
    out.set(k, (out.get(k) ?? 0n) + coef);
    r = sub(r, mul(lp([coef], k), q));
  }
  const ks = [...out.keys()], lo = Math.min(...ks), hi = Math.max(...ks), c = new Array<bigint>(hi - lo + 1).fill(0n);
  out.forEach((v, k) => (c[k - lo] += v));
  return trim({ lo, c });
}
export const evalAt = (p: LP, t: bigint) => p.c.reduce((s, x, k) => s + x * (p.lo + k >= 0 ? t ** BigInt(p.lo + k) : 0n), 0n);
/** Value at t = −1 or 1 for Laurent polynomials (t^-k = t^k there). */
export const evalUnit = (p: LP, t: 1n | -1n) => p.c.reduce((s, x, k) => s + x * (((p.lo + k) % 2 !== 0) && t === -1n ? -1n : 1n), 0n);
export function lpText(p: LP, v = 't'): string {
  if (isZero(p)) return '0';
  const parts: string[] = [];
  for (let k = p.c.length - 1; k >= 0; k--) {
    const a = p.c[k], d = p.lo + k;
    if (!a) continue;
    const mag = a < 0n ? -a : a, pw = d === 0 ? '' : d === 1 ? v : `${v}^${d}`;
    const body = d === 0 ? `${mag}` : mag === 1n ? pw : `${mag}${pw}`;
    parts.push(parts.length ? `${a < 0n ? ' − ' : ' + '}${body}` : `${a < 0n ? '−' : ''}${body}`);
  }
  return parts.join('');
}

// ---------- Reduced Burau representation ----------
type M = LP[][];
const Z = (): LP => ({ lo: 0, c: [] }), ONE = () => lp([1]);
const ident = (m: number): M => Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => (i === j ? ONE() : Z())));
/** Reduced Burau matrix of σi^(±1) on n strands, (n−1) × (n−1); t is the variable. */
export function burauGen(n: number, x: number): M {
  const m = n - 1, i = Math.abs(x), inv = x < 0, B = ident(m);
  const t = lp([1], 1), mt = lp([-1], 1), ti = lp([1], -1), mti = lp([-1], -1);
  if (m === 1) { B[0][0] = inv ? mti : mt; return B; }
  const r = i - 1; // row of the −t entry
  B[r][r] = inv ? mti : mt;
  if (i > 1) B[r - 1][r] = inv ? ONE() : t;
  if (i < m) B[r + 1][r] = inv ? ti : ONE();
  return B;
}
function matMul(A: M, B: M): M {
  const n = A.length;
  return A.map((row, i) => B[0].map((_, j) => { let s = Z(); for (let k = 0; k < n; k++) if (!isZero(row[k]) && !isZero(B[k][j])) s = add(s, mul(row[k], B[k][j])); return s; }));
}
export function burau(b: Braid): M { return b.word.reduce((acc, x) => matMul(acc, burauGen(b.n, x)), ident(b.n - 1)); }
/** Determinant by fraction-free Gaussian elimination (Bareiss), exact. */
export function det(A0: M): LP {
  const n = A0.length; if (!n) return ONE();
  const A = A0.map((r) => [...r]); let prev = ONE(), sign = 1n;
  for (let k = 0; k < n - 1; k++) {
    if (isZero(A[k][k])) {
      const s = A.findIndex((r, i) => i > k && !isZero(r[k]));
      if (s < 0) return Z();
      [A[k], A[s]] = [A[s], A[k]]; sign = -sign;
    }
    for (let i = k + 1; i < n; i++) for (let j = k + 1; j < n; j++) A[i][j] = div(sub(mul(A[i][j], A[k][k]), mul(A[i][k], A[k][j])), prev);
    prev = A[k][k];
  }
  const d = A[n - 1][n - 1];
  return sign < 0n ? { lo: d.lo, c: d.c.map((x) => -x) } : d;
}
/**
 * Alexander polynomial of the closure, normalised: for a knot, symmetric (Δ(t) = Δ(1/t)) with Δ(1) = 1;
 * for a link, lowest power t^0 and a positive leading coefficient (it is defined only up to ±t^k).
 */
export function alexander(b: Braid): LP {
  const B = burau(b);
  const IminusB = B.map((row, i) => row.map((e, j) => sub(i === j ? ONE() : Z(), e)));
  const d = det(IminusB);
  const den = lp(Array.from({ length: b.n + 1 }, (_, k) => (k === 0 ? 1 : k === b.n ? -1 : 0))); // 1 − t^n
  const num = mul(d, lp([1, -1])); // det · (1 − t)
  let D = div(num, den);
  if (isZero(D)) return D;
  const knot = components(b).length === 1;
  if (knot) {
    const span = D.c.length - 1;
    D = { lo: -span / 2, c: D.c };
    if (evalUnit(D, 1n) < 0n) D = { lo: D.lo, c: D.c.map((x) => -x) };
  } else {
    D = { lo: 0, c: D.c };
    if (D.c[D.c.length - 1] < 0n) D = { lo: 0, c: D.c.map((x) => -x) };
  }
  return D;
}
/** Alexander polynomials equal up to ±t^k. */
export function sameUpToUnit(p: LP, q: LP): boolean {
  if (p.c.length !== q.c.length) return false;
  const eq = p.c.every((x, k) => x === q.c[k]), neg = p.c.every((x, k) => x === -q.c[k]);
  return eq || neg;
}

/** Well-known knots and links as closed braids (standard braid words; mathematical facts). */
export const NAMED: { id: string; name: string; word: string }[] = [
  { id: '0_1', name: 'Unknot', word: 'σ1' },
  { id: '3_1', name: 'Trefoil', word: 'σ1^3' },
  { id: '4_1', name: 'Figure-eight knot', word: 'σ1 σ2^-1 σ1 σ2^-1' },
  { id: '5_1', name: 'Cinquefoil (5_1)', word: 'σ1^5' },
  { id: '5_2', name: 'Three-twist knot (5_2)', word: 'σ1^3 σ2 σ1^-1 σ2' },
  { id: '6_1', name: 'Stevedore knot (6_1)', word: 'σ1^2 σ2 σ1^-1 σ3^-1 σ2 σ3^-1' },
  { id: '6_2', name: 'Knot 6_2', word: 'σ1^3 σ2^-1 σ1 σ2^-1' },
  { id: '6_3', name: 'Knot 6_3', word: 'σ1^2 σ2^-1 σ1 σ2^-2' },
  { id: '7_1', name: 'Septafoil (7_1)', word: 'σ1^7' },
  { id: '8_19', name: 'Torus knot T(3,4) (8_19)', word: '(σ1 σ2)^4' },
  { id: 'L2a1', name: 'Hopf link', word: 'σ1^2' },
  { id: 'L4a1', name: 'Solomon link (T(2,4))', word: 'σ1^4' },
  { id: 'L6a4', name: 'Borromean rings', word: '(σ1 σ2^-1)^3' },
];
