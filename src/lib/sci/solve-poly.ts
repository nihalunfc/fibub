// Small polynomial helpers for the "Solve my numbers" cards of the maxima and integrals tools. A polynomial is a list
// of coefficients, highest power first: 2x³ − 9x² + 12x + 5 is [2, -9, 12, 5]. Plain TypeScript, no DOM.
import { sf } from '../learn/solvecore-b.ts';

export type Poly = number[];
const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
export const sup = (n: number) => String(n).split('').map((c) => SUP[c] ?? c).join('');
/** Remove leading zeros (but keep at least one number). */
export const trimP = (p: Poly): Poly => { let k = 0; while (k < p.length - 1 && p[k] === 0) k++; return p.slice(k); };
export const degree = (p: Poly) => trimP(p).length - 1;
export const evalP = (p: Poly, x: number) => p.reduce((s, c) => s * x + c, 0);
export const derivP = (p: Poly): Poly => { const q = trimP(p), n = q.length - 1; return n <= 0 ? [0] : q.slice(0, n).map((c, k) => c * (n - k)); };
/** Antiderivative with constant 0. */
export const antiP = (p: Poly): Poly => { const n = p.length; return [...p.map((c, k) => c / (n - k)), 0]; };

/** The real roots of a polynomial, sorted, each listed once (a double root appears once). */
export function realRoots(p0: Poly): number[] {
  const p = trimP(p0), n = p.length - 1;
  if (n <= 0) return [];
  if (n === 1) return [-p[1] / p[0]];
  if (n === 2) {
    const [a, b, c] = p, D = b * b - 4 * a * c;
    if (Math.abs(D) <= 1e-12 * (b * b + Math.abs(4 * a * c))) return [-b / (2 * a)];
    if (D < 0) return [];
    const s = Math.sqrt(D), q = -0.5 * (b + Math.sign(b || 1) * s);
    return [q / a, c / q].sort((x, y) => x - y);
  }
  const crit = realRoots(derivP(p)), B = 1 + Math.max(...p.slice(1).map((c) => Math.abs(c / p[0])));
  const pts = [-B, ...crit, B], out: number[] = [];
  const near0 = (x: number) => Math.abs(evalP(p, x)) <= 1e-9 * p.reduce((s, c) => s + Math.abs(c), 0) * Math.max(1, Math.abs(x)) ** n;
  for (const c of crit) if (near0(c)) out.push(c);
  for (let k = 0; k < pts.length - 1; k++) {
    let lo = pts[k], hi = pts[k + 1];
    const flo = evalP(p, lo), fhi = evalP(p, hi);
    if (near0(lo) || near0(hi) || flo * fhi > 0) continue;
    for (let it = 0; it < 200; it++) { const mid = (lo + hi) / 2, fm = evalP(p, mid); if (fm === 0) { lo = hi = mid; break; } if ((fm < 0) === (flo < 0)) lo = mid; else hi = mid; }
    out.push((lo + hi) / 2);
  }
  out.sort((a, b) => a - b);
  return out.filter((x, k) => k === 0 || Math.abs(x - out[k - 1]) > 1e-7 * Math.max(1, Math.abs(x)));
}

/** A polynomial written like a textbook: 2x³ − 9x² + 12x + 5. */
export function polyText(p0: Poly, v = 'x', n = 4): string {
  const p = trimP(p0), deg = p.length - 1;
  let s = '';
  p.forEach((c, k) => {
    if (c === 0 && deg > 0) return;
    const e = deg - k, a = Math.abs(c), body = e === 0 ? sf(a, n) : `${a === 1 ? '' : sf(a, n)}${v}${e === 1 ? '' : sup(e)}`;
    s += s ? ` ${c < 0 ? '−' : '+'} ${body}` : `${c < 0 ? '−' : ''}${body}`;
  });
  return s || '0';
}
