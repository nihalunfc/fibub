// Linear inequalities (Class 11 maths): solve a x + b (op) c in one variable with the answer in set and interval
// notation, a double inequality c1 (op) a x + b (op) c2, and systems of a x + b y (op) c in two variables, where the
// overlap of half-planes is clipped to a window and its corners listed. Plain TypeScript, no DOM.
export type Op = '<' | '<=' | '>' | '>=';
export const SYM: Record<Op, string> = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' };
const flip: Record<Op, Op> = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
export const holds = (lhs: number, op: Op, rhs: number, eps = 1e-12) => (op === '<' ? lhs < rhs - eps : op === '<=' ? lhs <= rhs + eps : op === '>' ? lhs > rhs + eps : lhs >= rhs - eps);

/** A solution set on the number line: an interval from lo to hi (±Infinity for no end), each end open or closed. */
export type Sol = { kind: 'interval'; lo: number; hi: number; loIn: boolean; hiIn: boolean } | { kind: 'all' } | { kind: 'none' };

const fm = (x: number) => { const r = Math.round(x * 1e9) / 1e9; const s = Number.isInteger(r) ? String(r) : String(+r.toFixed(4)); return s.replace('-', '−'); };
/** A value as a fraction p/q when q ≤ 12, else a decimal. */
export function nice(x: number): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '−∞';
  for (let q = 1; q <= 12; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return q === 1 ? fm(p) : `${fm(p)}/${q}`; }
  return fm(x);
}

/** Solve a x + b (op) c. Dividing by a negative a flips the sign. */
export function solve1(a: number, b: number, op: Op, c: number): { sol: Sol; steps: string[] } {
  const steps: string[] = [];
  const r = c - b;
  steps.push(`${lin(a, b)} ${SYM[op]} ${fm(c)}`);
  if (b !== 0) steps.push(`Take ${fm(b)} from both sides: ${a === 1 ? '' : a === -1 ? '−' : fm(a)}x ${SYM[op]} ${fm(r)}`);
  if (a === 0) {
    const ok = holds(0, op, r);
    steps.push(ok ? `0 ${SYM[op]} ${fm(r)} is always true, so every real x works.` : `0 ${SYM[op]} ${fm(r)} is never true, so no x works.`);
    return { sol: ok ? { kind: 'all' } : { kind: 'none' }, steps };
  }
  const k = r / a, o: Op = a < 0 ? flip[op] : op;
  if (a !== 1) steps.push(a < 0 ? `Divide both sides by ${fm(a)}, a negative number, so the sign turns round: x ${SYM[o]} ${nice(k)}` : `Divide both sides by ${fm(a)}: x ${SYM[o]} ${nice(k)}`);
  const sol: Sol = o === '<' || o === '<=' ? { kind: 'interval', lo: -Infinity, hi: k, loIn: false, hiIn: o === '<=' } : { kind: 'interval', lo: k, hi: Infinity, loIn: o === '>=', hiIn: false };
  return { sol, steps };
}

/** Both of c1 (op1) a x + b and a x + b (op2) c2, the double inequality. */
export function solve2(c1: number, op1: Op, a: number, b: number, op2: Op, c2: number): { sol: Sol; steps: string[] } {
  const left = solve1(-a, -b, op1, -c1);   // c1 op1 ax + b  ⇔  −ax − b op1 −c1
  const right = solve1(a, b, op2, c2);
  const sol = intersect(left.sol, right.sol);
  const steps = [`${fm(c1)} ${SYM[op1]} ${lin(a, b)} ${SYM[op2]} ${fm(c2)}`];
  if (a !== 0) {
    const L = c1 - b, Rr = c2 - b;
    if (b !== 0) steps.push(`Take ${fm(b)} from all three parts: ${fm(L)} ${SYM[op1]} ${a === 1 ? '' : fm(a)}x ${SYM[op2]} ${fm(Rr)}`);
    if (a !== 1) steps.push(a < 0 ? `Divide all three parts by ${fm(a)} and turn both signs round: ${nice(L / a)} ${SYM[flip[op1]]} x ${SYM[flip[op2]]} ${nice(Rr / a)}` : `Divide all three parts by ${fm(a)}: ${nice(L / a)} ${SYM[op1]} x ${SYM[op2]} ${nice(Rr / a)}`);
  }
  return { sol, steps };
}

export function intersect(p: Sol, q: Sol): Sol {
  if (p.kind === 'none' || q.kind === 'none') return { kind: 'none' };
  if (p.kind === 'all') return q;
  if (q.kind === 'all') return p;
  const lo = Math.max(p.lo, q.lo), hi = Math.min(p.hi, q.hi);
  const loIn = lo === p.lo && lo === q.lo ? p.loIn && q.loIn : lo === p.lo ? p.loIn : q.loIn;
  const hiIn = hi === p.hi && hi === q.hi ? p.hiIn && q.hiIn : hi === p.hi ? p.hiIn : q.hiIn;
  if (lo > hi || (lo === hi && !(loIn && hiIn))) return { kind: 'none' };
  return { kind: 'interval', lo, hi, loIn, hiIn };
}

/** Interval notation: (−∞, 3], [2, 5), {4}, R or ∅. */
export function interval(s: Sol): string {
  if (s.kind === 'all') return '(−∞, ∞), all real numbers R';
  if (s.kind === 'none') return '∅ (no solution)';
  if (s.lo === s.hi) return `{${nice(s.lo)}}`;
  return `${s.loIn ? '[' : '('}${nice(s.lo)}, ${nice(s.hi)}${s.hiIn ? ']' : ')'}`;
}
/** Set-builder style: x < 3, 2 ≤ x < 5. */
export function inWords(s: Sol): string {
  if (s.kind === 'all') return 'every real x';
  if (s.kind === 'none') return 'no x';
  if (s.lo === s.hi) return `x = ${nice(s.lo)}`;
  if (s.lo === -Infinity) return `x ${s.hiIn ? '≤' : '<'} ${nice(s.hi)}`;
  if (s.hi === Infinity) return `x ${s.loIn ? '≥' : '>'} ${nice(s.lo)}`;
  return `${nice(s.lo)} ${s.loIn ? '≤' : '<'} x ${s.hiIn ? '≤' : '<'} ${nice(s.hi)}`;
}
export const contains = (s: Sol, x: number) => s.kind === 'all' || (s.kind === 'interval' && (x > s.lo || (s.loIn && x === s.lo)) && (x < s.hi || (s.hiIn && x === s.hi)));
/** Whole numbers in the solution between lo and hi (for "integer solutions" questions). */
export const integers = (s: Sol, lo: number, hi: number) => { const out: number[] = []; for (let x = lo; x <= hi; x++) if (contains(s, x)) out.push(x); return out; };

export function lin(a: number, b: number, v = 'x'): string {
  const head = a === 0 ? '' : a === 1 ? v : a === -1 ? `−${v}` : `${fm(a)}${v}`;
  if (!head) return fm(b);
  return b === 0 ? head : `${head} ${b > 0 ? '+' : '−'} ${fm(Math.abs(b))}`;
}

// ---- two variables ----
export type Half = { a: number; b: number; op: Op; c: number };   // a x + b y (op) c
export const halfText = (h: Half) => {
  const xs = h.a === 0 ? '' : h.a === 1 ? 'x' : h.a === -1 ? '−x' : `${fm(h.a)}x`;
  const ys = h.b === 0 ? '' : `${xs ? (h.b > 0 ? ' + ' : ' − ') : h.b < 0 ? '−' : ''}${Math.abs(h.b) === 1 ? '' : fm(Math.abs(h.b))}y`;
  return `${xs}${ys || (xs ? '' : '0')} ${SYM[h.op]} ${fm(h.c)}`;
};
export const inHalf = (h: Half, x: number, y: number) => holds(h.a * x + h.b * y, h.op, h.c, 1e-9);
export type Pt = { x: number; y: number };

/** Clip a convex polygon to a x + b y (≤ or ≥) c (the boundary counts, so corners are found for strict signs too). */
export function clip(poly: Pt[], h: Half): Pt[] {
  if (h.a === 0 && h.b === 0) return holds(0, h.op, h.c) ? poly : [];
  const s = h.op === '<' || h.op === '<=' ? 1 : -1;
  const d = (p: Pt) => s * (h.a * p.x + h.b * p.y - h.c);   // ≤ 0 inside
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i], Q = poly[(i + 1) % poly.length], dp = d(P), dq = d(Q);
    if (dp <= 1e-12) out.push(P);
    if ((dp < -1e-12 && dq > 1e-12) || (dp > 1e-12 && dq < -1e-12)) { const t = dp / (dp - dq); out.push({ x: P.x + t * (Q.x - P.x), y: P.y + t * (Q.y - P.y) }); }
  }
  return out;
}
/** The overlap of all the half-planes inside the window [x0, x1] × [y0, y1], as a polygon (maybe empty). */
export function feasible(hs: Half[], x0: number, x1: number, y0: number, y1: number): Pt[] {
  let poly: Pt[] = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
  for (const h of hs) { poly = clip(poly, h); if (!poly.length) break; }
  // drop repeated points
  return poly.filter((p, i) => { const q = poly[(i + poly.length - 1) % poly.length]; return poly.length < 2 || Math.hypot(p.x - q.x, p.y - q.y) > 1e-9; });
}
/** Corners of the region that come from the lines themselves (not from the edge of the window). */
export function corners(hs: Half[], x0: number, x1: number, y0: number, y1: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < hs.length; i++) for (let j = i + 1; j < hs.length; j++) {
    const A = hs[i], B = hs[j], det = A.a * B.b - A.b * B.a;
    if (Math.abs(det) < 1e-12) continue;
    const p = { x: (A.c * B.b - A.b * B.c) / det, y: (A.a * B.c - A.c * B.a) / det };
    if (p.x < x0 - 1e-9 || p.x > x1 + 1e-9 || p.y < y0 - 1e-9 || p.y > y1 + 1e-9) continue;
    const onAll = hs.every((h) => holds(h.a * p.x + h.b * p.y, h.op === '<' ? '<=' : h.op === '>' ? '>=' : h.op, h.c, 1e-9));
    if (onAll && !out.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < 1e-9)) out.push(p);
  }
  return out;
}
