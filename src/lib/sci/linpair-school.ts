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

// ---- Solve-my-numbers helpers (added 2026-11-16) ----

/** "x = 3, y = 2" (exact fractions for whole-number inputs), or a plain sentence when there is no single answer. */
export function answerLine(l1: Line, l2: Line): string {
  const s = solve(l1, l2), ex = isInt(l1.a, l1.b, l1.c, l2.a, l2.b, l2.c);
  if (s.kind === 'invalid') return 'Each equation needs an x or a y term.';
  if (s.kind === 'parallel') return 'No solution: the lines are parallel, so no (x, y) fits both equations.';
  if (s.kind === 'coincident') return 'Infinitely many solutions: both equations describe the same line.';
  const nx = l1.c * l2.b - l2.c * l1.b, ny = l1.a * l2.c - l2.a * l1.c;
  return `x = ${q(nx, s.D, ex)}, y = ${q(ny, s.D, ex)}`;
}

/** Put the answer back into both equations, the way an exam asks you to check it. */
export function verify(l1: Line, l2: Line): string[] {
  const s = solve(l1, l2);
  if (s.kind !== 'unique') return [];
  const X = s.x!, Y = s.y!, out: string[] = [];
  [l1, l2].forEach((l, i) => {
    const lhs = l.a * X + l.b * Y, ok = Math.abs(lhs - l.c) < 1e-9 * Math.max(1, Math.abs(l.c));
    out.push(`(${i + 1}): ${fmt(l.a, 4)} × ${fmt(X, 4)} + ${fmt(l.b, 4)} × ${fmt(Y, 4)} = ${fmt(lhs, 4)}${ok ? ` = ${fmt(l.c, 4)}, so equation (${i + 1}) is satisfied.` : ` but the right side is ${fmt(l.c, 4)} (rounded answer, so a small gap is normal).`}`.replace(/\+ −/g, '− '));
  });
  return out;
}

/** Cross-multiplication (determinant) method for a1x + b1y = c1, a2x + b2y = c2. */
export function crossMultiplication(l1: Line, l2: Line): string[] {
  const s = solve(l1, l2);
  if (s.kind !== 'unique') return [s.kind === 'invalid' ? 'Each equation needs an x or a y term.' : 'The bottom a1b2 − a2b1 is 0, so cross-multiplication cannot give one answer: use the ratio test.'];
  const ex = isInt(l1.a, l1.b, l1.c, l2.a, l2.b, l2.c), n = (v: number) => fmt(v, 4), p = (v: number) => (v < 0 ? `(${n(v)})` : n(v));
  const nx = l1.c * l2.b - l2.c * l1.b, ny = l1.a * l2.c - l2.a * l1.c;
  return [
    'Write each equation as a x + b y = c. For (1): a1 = ' + n(l1.a) + ', b1 = ' + n(l1.b) + ', c1 = ' + n(l1.c) + '. For (2): a2 = ' + n(l2.a) + ', b2 = ' + n(l2.b) + ', c2 = ' + n(l2.c) + '.',
    `Bottom: a1 b2 − a2 b1 = ${p(l1.a)} × ${p(l2.b)} − ${p(l2.a)} × ${p(l1.b)} = ${n(s.D)}.`,
    `x = (c1 b2 − c2 b1) / (a1 b2 − a2 b1) = (${p(l1.c)} × ${p(l2.b)} − ${p(l2.c)} × ${p(l1.b)}) / ${p(s.D)} = ${n(nx)} / ${p(s.D)} = ${q(nx, s.D, ex)}.`,
    `y = (a1 c2 − a2 c1) / (a1 b2 − a2 b1) = (${p(l1.a)} × ${p(l2.c)} − ${p(l2.a)} × ${p(l1.c)}) / ${p(s.D)} = ${n(ny)} / ${p(s.D)} = ${q(ny, s.D, ex)}.`,
  ];
}

export type KWhich = 'a2' | 'b2' | 'c2';
/**
 * Class 10 "find k": equation (1) is known, equation (2) has one unknown coefficient k (a2, b2 or c2).
 * Returns the value of k that makes the lines parallel (no solution) and the one that makes them the same line
 * (infinitely many), or a reason when that cannot happen.
 */
export function findK(l1: Line, l2: { a: number; b: number; c: number }, which: KWhich) {
  const ok = [l1.a, l1.b, l1.c, l2.a, l2.b, l2.c].every(Number.isFinite);
  const none = (why: string) => ({ ok: false as const, why });
  if (!ok) return none('Fill in every box with a number.');
  if (l1.a === 0 && l1.b === 0) return none('Equation (1) needs an x or a y term.');
  const o = l2, A = l1.a, B = l1.b, Cc = l1.c;
  // Parallel or coincident needs a1 b2 = a2 b1. Solve that for k when k is a2 or b2; for c2, use a2 and b2 as given.
  if (which === 'a2') {
    if (B === 0) return none('When b1 = 0 the first line is vertical, and a2 can be any value for the second to be vertical too, so there is no single k. Try k in b2 instead.');
    const k = (A * o.b) / B;
    return { ok: true as const, k, parallelK: k, coincidentK: k, note: `Parallel or the same line needs a1/a2 = b1/b2, so a2 = a1 × b2 / b1 = ${fmt(k, 4)}. Then they are the same line only if c1/c2 matches too (c2 = ${fmt(o.c, 4)} ${Cc !== 0 && Math.abs(Cc * k - o.c * A) < 1e-9 ? 'matches' : 'does not match'}); if it does not match they are parallel (no solution). For every other value of k there is exactly one solution.`, same: Math.abs(Cc * k - o.c * A) < 1e-9 && k !== 0 };
  }
  if (which === 'b2') {
    if (A === 0) return none('When a1 = 0 the first line is horizontal. Try k in a2 instead.');
    const k = (o.a * B) / A;
    return { ok: true as const, k, parallelK: k, coincidentK: k, note: `Parallel or the same line needs a1/a2 = b1/b2, so b2 = a2 × b1 / a1 = ${fmt(k, 4)}. They are the same line only if c1/c2 matches too. For every other value of k there is exactly one solution.`, same: Math.abs(Cc * k - o.c * B) < 1e-9 && k !== 0 };
  }
  // k is c2: the slopes must already match.
  if (Math.abs(A * o.b - o.a * B) > 1e-9) return none('The lines are not parallel whatever c2 is (a1/a2 ≠ b1/b2), so they always meet in exactly one point.');
  if (o.a === 0 && o.b === 0) return none('Equation (2) needs an x or a y term.');
  const ratio = o.a !== 0 ? o.a / A : o.b / B;
  if (!Number.isFinite(ratio) || A === 0 && B === 0) return none('Cannot work this out for these numbers.');
  const same = Cc * ratio;
  return { ok: true as const, k: same, parallelK: NaN, coincidentK: same, note: `The lines are parallel in direction. They are the same line when c2 = c1 × (a2/a1) = ${fmt(same, 4)}; for any other c2 they are parallel with no solution.`, same: true };
}

/** Word-problem presets: coefficients a1,b1,c1,a2,b2,c2 and what x and y stand for. Made up for this page. */
export const WORD_PRESETS: { label: string; p: number[]; story: string }[] = [
  { label: 'Two numbers', p: [1, 1, 25, 1, -1, 7], story: 'Two numbers add up to 25 and differ by 7. x = the bigger number, y = the smaller.' },
  { label: 'Pens and books', p: [3, 2, 60, 1, 4, 70], story: '3 pens and 2 books cost 60, while 1 pen and 4 books cost 70. x = price of a pen, y = price of a book.' },
  { label: 'Ages', p: [1, -3, 0, 1, -2, 10], story: 'A father is 3 times as old as his son; in 10 years he will be twice as old. x = father now, y = son now (x − 3y = 0 and x − 2y = 10).' },
  { label: 'Taxi fare', p: [1, 10, 105, 1, 15, 155], story: 'A taxi charges a fixed fee plus a rate per km: 10 km costs 105 and 15 km costs 155. x = the fixed fee, y = the cost per km (x + 10y = 105 and x + 15y = 155).' },
];
