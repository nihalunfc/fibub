// School maths: a pair of linear equations a1·x + b1·y = c1 and a2·x + b2·y = c2 (Class 10 pair of linear
// equations; Class 9 linear equations in two variables). Kind of solution by the ratio test, the solution, and
// the substitution and elimination steps as text. No DOM.
import { fmt, fracText } from './smath.ts';

export type Line = { a: number; b: number; c: number };
export type Kind = 'unique' | 'parallel' | 'coincident' | 'invalid';

const isInt = (...xs: number[]) => xs.every(Number.isInteger);
/** A value as an exact fraction when the inputs are whole numbers, otherwise a decimal. */
export const q = (num: number, den: number, exact: boolean) => (exact ? fracText(num, den) : fmt(num / den, 4));

/** "2x + 3y = 12" */
export function eqText({ a, b, c }: Line): string {
  const t = (k: number, v: string, first: boolean) => {
    if (k === 0) return '';
    const mag = Math.abs(k) === 1 ? v : `${fmt(Math.abs(k), 4)}${v}`;
    return first ? `${k < 0 ? '−' : ''}${mag}` : ` ${k < 0 ? '−' : '+'} ${mag}`;
  };
  const left = (t(a, 'x', true) + t(b, 'y', a === 0)) || '0';
  return `${left} = ${fmt(c, 4)}`;
}

export function solve(l1: Line, l2: Line): { kind: Kind; x?: number; y?: number; D: number } {
  if ((l1.a === 0 && l1.b === 0) || (l2.a === 0 && l2.b === 0)) return { kind: 'invalid', D: 0 };
  const D = l1.a * l2.b - l2.a * l1.b;
  const scale = Math.max(1, ...[l1.a, l1.b, l1.c, l2.a, l2.b, l2.c].map(Math.abs)) ** 2;
  if (Math.abs(D) > 1e-12 * scale) return { kind: 'unique', D, x: (l1.c * l2.b - l2.c * l1.b) / D, y: (l1.a * l2.c - l2.a * l1.c) / D };
  const same = Math.abs(l1.a * l2.c - l2.a * l1.c) <= 1e-12 * scale && Math.abs(l1.b * l2.c - l2.b * l1.c) <= 1e-12 * scale;
  return { kind: same ? 'coincident' : 'parallel', D };
}

/** The ratio test a1/a2, b1/b2, c1/c2 as text, with the conclusion. Ratios with a zero below show as "—". */
export function ratioTest(l1: Line, l2: Line) {
  const r = (p: number, s: number) => (s === 0 ? (p === 0 ? '0/0' : '—') : q(p, s, isInt(p, s)));
  const k = solve(l1, l2).kind;
  const sign = k === 'unique' ? 'a1/a2 ≠ b1/b2' : k === 'parallel' ? 'a1/a2 = b1/b2 ≠ c1/c2' : k === 'coincident' ? 'a1/a2 = b1/b2 = c1/c2' : '';
  const words = { unique: 'The lines cross at one point: exactly one solution (consistent).', parallel: 'The lines are parallel: no solution (inconsistent).', coincident: 'The lines lie on top of each other: infinitely many solutions (consistent, dependent).', invalid: 'One equation has no x or y in it, so it is not a line.' }[k];
  return { a: r(l1.a, l2.a), b: r(l1.b, l2.b), c: r(l1.c, l2.c), sign, words, kind: k };
}

/** Substitution: make y (or x) the subject of the first equation that allows it, then substitute. */
export function substitution(l1: Line, l2: Line): string[] {
  const s = solve(l1, l2), ex = isInt(l1.a, l1.b, l1.c, l2.a, l2.b, l2.c), out: string[] = [];
  if (s.kind !== 'unique') return [s.kind === 'invalid' ? 'Each equation needs an x or a y term.' : 'Substitution ends with a statement with no x or y in it: ' + (s.kind === 'parallel' ? 'something false like 0 = 5, so there is no solution.' : 'something always true like 0 = 0, so every point on the line is a solution.')];
  // Use the first equation if it has y; otherwise swap roles.
  const [p, r, pn, rn] = l1.b !== 0 ? [l1, l2, '(1)', '(2)'] : [l2, l1, '(2)', '(1)'];
  out.push(`From ${pn}: y = (${fmt(p.c, 4)} − ${fmt(p.a, 4)}x) / ${fmt(p.b, 4)}.`.replace('− −', '+ ').replace('(0 − ', '(−').replace(/ − 0x\)/, ')'));
  out.push(`Put this into ${rn}: ${fmt(r.a, 4)}x + ${fmt(r.b, 4)} × (${fmt(p.c, 4)} − ${fmt(p.a, 4)}x) / ${fmt(p.b, 4)} = ${fmt(r.c, 4)}.`.replace(/\+ −/g, '− ').replace(/− −/g, '+ '));
  const A = r.a * p.b - r.b * p.a, C = r.c * p.b - r.b * p.c;
  out.push(`Multiply by ${fmt(p.b, 4)} and collect the x terms: ${fmt(A, 4)}x = ${fmt(C, 4)}.`);
  out.push(`So x = ${q(C, A, ex)}${ex && !Number.isInteger(C / A) ? ` ≈ ${fmt(C / A, 4)}` : ''}.`);
  out.push(`Then y = (${fmt(p.c, 4)} − ${fmt(p.a, 4)} × ${fmt(s.x!, 4)}) / ${fmt(p.b, 4)} = ${q(p.c * A - p.a * C, p.b * A, ex)}.`.replace(/− −/g, '+ '));
  return out;
}

/** Elimination: scale both equations so the x terms match, subtract to find y, then put y back. */
export function elimination(l1: Line, l2: Line): string[] {
  const s = solve(l1, l2), ex = isInt(l1.a, l1.b, l1.c, l2.a, l2.b, l2.c), out: string[] = [];
  if (s.kind !== 'unique') return [s.kind === 'invalid' ? 'Each equation needs an x or a y term.' : 'Removing x removes y as well, leaving ' + (s.kind === 'parallel' ? 'a false statement like 0 = 5: no solution.' : '0 = 0: infinitely many solutions.')];
  if (l1.a === 0 || l2.a === 0) {
    const [z, o] = l1.a === 0 ? [l1, l2] : [l2, l1];
    out.push(`${l1.a === 0 ? '(1)' : '(2)'} has no x term already: y = ${q(z.c, z.b, ex)}.`);
    out.push(`Put it into the other equation: x = (${fmt(o.c, 4)} − ${fmt(o.b, 4)} × ${fmt(s.y!, 4)}) / ${fmt(o.a, 4)} = ${q(o.c * z.b - o.b * z.c, o.a * z.b, ex)}.`.replace(/− −/g, '+ '));
    return out;
  }
  const m1 = l2.a, m2 = l1.a;
  out.push(`Multiply (1) by ${fmt(m1, 4)} and (2) by ${fmt(m2, 4)} so both x terms are ${fmt(l1.a * l2.a, 4)}x:`);
  out.push(`${eqText({ a: l1.a * m1, b: l1.b * m1, c: l1.c * m1 })}   and   ${eqText({ a: l2.a * m2, b: l2.b * m2, c: l2.c * m2 })}.`);
  const B = l1.b * m1 - l2.b * m2, C = l1.c * m1 - l2.c * m2;
  out.push(`Subtract: ${fmt(B, 4)}y = ${fmt(C, 4)}, so y = ${q(C, B, ex)}${ex && !Number.isInteger(C / B) ? ` ≈ ${fmt(C / B, 4)}` : ''}.`);
  out.push(`Put y into (1): ${fmt(l1.a, 4)}x = ${fmt(l1.c, 4)} − ${fmt(l1.b, 4)} × ${fmt(s.y!, 4)}, so x = ${q(l1.c * B - l1.b * C, l1.a * B, ex)}.`.replace(/− −/g, '+ '));
  return out;
}
