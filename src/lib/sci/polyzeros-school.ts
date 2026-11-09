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
