// School maths: zeros of linear, quadratic and cubic polynomials and their relation to the coefficients
// (Class 9 and Class 10 polynomials). Coefficients [a, b, c, d] are highest power first. No DOM.
import { fmt, sgn } from './smath.ts';

/** Evaluate a polynomial (highest power first) at x. */
export const evalPoly = (co: number[], x: number) => co.reduce((s, c) => s * x + c, 0);

/** Real zeros, smallest first, repeated ones listed as often as they repeat. Leading coefficient must not be 0. */
export function realZeros(co: number[]): number[] {
  const [a] = co;
  if (!a) throw new Error('leading coefficient is 0');
  if (co.length === 2) return [-co[1] / a];
  if (co.length === 3) {
    const [, b, c] = co, D = b * b - 4 * a * c, eps = 1e-12 * Math.max(1, b * b, Math.abs(4 * a * c));
    if (Math.abs(D) <= eps) return [-b / (2 * a), -b / (2 * a)];
    if (D < 0) return [];
    const q = -0.5 * (b + Math.sign(b || 1) * Math.sqrt(D));
    return [q / a, q !== 0 ? c / q : -q / a].sort((x, y) => x - y);
  }
  // Cubic: x³ + px² + qx + r after dividing by a; depressed t³ + Pt + Q with x = t − p/3.
  const p = co[1] / a, q = co[2] / a, r = co[3] / a;
  const P = q - (p * p) / 3, Q = (2 * p * p * p) / 27 - (p * q) / 3 + r, shift = -p / 3;
  const disc = (Q * Q) / 4 + (P * P * P) / 27;
  const scale = Math.max(1, Math.abs(p), Math.abs(q), Math.abs(r));
  let ts: number[];
  if (Math.abs(P) < 1e-14 * scale && Math.abs(Q) < 1e-14 * scale) ts = [0, 0, 0];
  else if (Math.abs(disc) < 1e-12 * scale ** 3) { const u = Math.cbrt(-Q / 2); ts = [2 * u, -u, -u]; }
  else if (disc > 0) { const s = Math.sqrt(disc); ts = [Math.cbrt(-Q / 2 + s) + Math.cbrt(-Q / 2 - s)]; }
  else {
    const m = 2 * Math.sqrt(-P / 3), th = Math.acos(Math.max(-1, Math.min(1, ((3 * Q) / (P * m)))))/ 3;
    ts = [0, 1, 2].map((k) => m * Math.cos(th - (2 * Math.PI * k) / 3));
  }
  // Polish each root with a few Newton steps on the original cubic.
  const d = (x: number) => 3 * co[0] * x * x + 2 * co[1] * x + co[2];
  const xs = ts.map((t) => { let x = t + shift; for (let i = 0; i < 4; i++) { const g = d(x); if (Math.abs(g) < 1e-12) break; const nx = x - evalPoly(co, x) / g; if (!Number.isFinite(nx)) break; x = nx; } return x; });
  return xs.sort((x, y) => x - y);
}

/** Expand k(x − z1)(x − z2)... into coefficients, highest power first. */
export function fromZeros(zeros: number[], k = 1): number[] {
  let co = [k];
  for (const z of zeros) { const n = new Array(co.length + 1).fill(0); co.forEach((c, i) => { n[i] += c; n[i + 1] -= c * z; }); co = n; }
  return co.map((c) => (Math.abs(c) < 1e-12 ? 0 : c));
}

/** The relations between zeros and coefficients for degree 1 to 3 (sum, sum of pairs, product). */
export function relations(co: number[]) {
  const a = co[0];
  if (co.length === 2) return { sum: -co[1] / a };
  if (co.length === 3) return { sum: -co[1] / a, product: co[2] / a };
  return { sum: -co[1] / a, pairs: co[2] / a, product: -co[3] / a };
}

/** Text of a polynomial in x: polyText([1, -6, 11, -6]) = "x³ − 6x² + 11x − 6". */
export function polyText(co: number[], dp = 2): string {
  const n = co.length - 1, pw = ['', 'x', 'x²', 'x³'];
  let s = '';
  co.forEach((c, i) => {
    const e = n - i;
    if (c === 0) return;
    const body = e === 0 ? fmt(Math.abs(c), dp) : (Math.abs(c) === 1 ? '' : fmt(Math.abs(c), dp)) + pw[e];
    s += s ? ` ${c < 0 ? '−' : '+'} ${body}` : `${c < 0 ? '−' : ''}${body}`;
  });
  return s || '0';
}

export { sgn };

/** Solve ax² + bx + c = 0 completely: discriminant, kind, real zeros (smaller first) or the complex pair re ± im i. a must not be 0. */
export function solveQuadratic(a: number, b: number, c: number) {
  const D = b * b - 4 * a * c, eps = 1e-12 * Math.max(1, b * b, Math.abs(4 * a * c));
  if (Math.abs(D) <= eps) return { D: 0, kind: 'equal' as const, real: [-b / (2 * a), -b / (2 * a)], re: -b / (2 * a), im: 0 };
  if (D > 0) return { D, kind: 'two' as const, real: realZeros([a, b, c]), re: -b / (2 * a), im: 0 };
  return { D, kind: 'complex' as const, real: [] as number[], re: -b / (2 * a), im: Math.sqrt(-D) / (2 * Math.abs(a)) };
}

/** Divide by (x − k): the quotient (highest power first) and the remainder, which is p(k). */
export function synthetic(co: number[], k: number): { quotient: number[]; remainder: number; rows: number[] } {
  const rows = [co[0]];
  for (let i = 1; i < co.length; i++) rows.push(co[i] + k * rows[i - 1]);
  return { quotient: rows.slice(0, -1), remainder: rows[rows.length - 1], rows };
}

/** Every zero of a linear, quadratic or cubic: the real ones and the complex pair (re ± im i, im > 0), if any. */
export function allZeros(co: number[]): { real: number[]; complex: { re: number; im: number } | null } {
  if (co.length === 2) return { real: [-co[1] / co[0]], complex: null };
  if (co.length === 3) { const s = solveQuadratic(co[0], co[1], co[2]); return { real: s.real, complex: s.kind === 'complex' ? { re: s.re, im: s.im } : null }; }
  const zs = realZeros(co);
  if (zs.length === 3) return { real: zs, complex: null };
  const r = zs[0], { quotient } = synthetic(co, r), s = solveQuadratic(quotient[0], quotient[1], quotient[2]);
  return { real: [r], complex: { re: s.re, im: s.im } };
}

/** A whole-number or simple-fraction zero p/q of a polynomial with whole-number coefficients (rational root test); null if none. */
export function rationalZero(co: number[]): [number, number] | null {
  if (!co.every((c) => Number.isInteger(c))) return null;
  let lo = 0; while (lo < co.length - 1 && co[co.length - 1 - lo] === 0) lo++;
  if (lo > 0) return [0, 1];
  const last = Math.abs(co[co.length - 1]), first = Math.abs(co[0]);
  if (last > 1e6 || first > 1e6) return null;
  const divs = (n: number) => { const d: number[] = []; for (let i = 1; i * i <= n; i++) if (n % i === 0) { d.push(i); if (i * i !== n) d.push(n / i); } return d.sort((x, y) => x - y); };
  for (const q of divs(first)) for (const p of divs(last)) for (const s of [1, -1]) {
    const x = (s * p) / q;
    if (Math.abs(evalPoly(co, x)) < 1e-9 * Math.max(1, ...co.map(Math.abs))) return [s * p, q];
  }
  return null;
}
