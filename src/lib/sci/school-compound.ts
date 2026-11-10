// Sum and difference formulae (Class 11 maths, trigonometric functions): the stacked right triangles that prove
// sin(A + B) = sin A cos B + cos A sin B and cos(A + B) = cos A cos B − sin A sin B, and the values of every
// compound and double angle formula. Plain TypeScript, no DOM.
export const rad = (d: number) => (d * Math.PI) / 180;

/**
 * The picture: O at the origin, OQ of length cos B at angle A, QP of length sin B at right angles to OQ, so OP
 * has length 1 at angle A + B. R is the foot of Q on the x-axis, M the foot of P, and N the point level with Q
 * straight below (or above) P. Then MP = RQ + NP gives the sine formula and OM = OR − NQ the cosine formula.
 */
export function proof(Adeg: number, Bdeg: number) {
  const A = rad(Adeg), B = rad(Bdeg);
  const Q = { x: Math.cos(A) * Math.cos(B), y: Math.sin(A) * Math.cos(B) };
  const P = { x: Q.x - Math.sin(B) * Math.sin(A), y: Q.y + Math.sin(B) * Math.cos(A) };
  return {
    Q, P, R: { x: Q.x, y: 0 }, M: { x: P.x, y: 0 }, N: { x: P.x, y: Q.y },
    RQ: Math.sin(A) * Math.cos(B),   // sin A cos B
    NP: Math.cos(A) * Math.sin(B),   // cos A sin B (the angle at P in triangle QNP is A)
    OR: Math.cos(A) * Math.cos(B),   // cos A cos B
    NQ: Math.sin(A) * Math.sin(B),   // sin A sin B
  };
}

export type Row = { name: string; rhs: string; left: number; right: number };
/** Every formula, both sides worked out separately so a student can see they agree. */
export function formulas(Adeg: number, Bdeg: number): Row[] {
  const A = rad(Adeg), B = rad(Bdeg), sA = Math.sin(A), cA = Math.cos(A), sB = Math.sin(B), cB = Math.cos(B), tA = Math.tan(A), tB = Math.tan(B);
  return [
    { name: 'sin(A + B)', rhs: 'sin A cos B + cos A sin B', left: Math.sin(A + B), right: sA * cB + cA * sB },
    { name: 'sin(A − B)', rhs: 'sin A cos B − cos A sin B', left: Math.sin(A - B), right: sA * cB - cA * sB },
    { name: 'cos(A + B)', rhs: 'cos A cos B − sin A sin B', left: Math.cos(A + B), right: cA * cB - sA * sB },
    { name: 'cos(A − B)', rhs: 'cos A cos B + sin A sin B', left: Math.cos(A - B), right: cA * cB + sA * sB },
    { name: 'tan(A + B)', rhs: '(tan A + tan B) / (1 − tan A tan B)', left: Math.tan(A + B), right: (tA + tB) / (1 - tA * tB) },
    { name: 'tan(A − B)', rhs: '(tan A − tan B) / (1 + tan A tan B)', left: Math.tan(A - B), right: (tA - tB) / (1 + tA * tB) },
    { name: 'sin 2A', rhs: '2 sin A cos A', left: Math.sin(2 * A), right: 2 * sA * cA },
    { name: 'cos 2A', rhs: 'cos² A − sin² A', left: Math.cos(2 * A), right: cA * cA - sA * sA },
    { name: 'tan 2A', rhs: '2 tan A / (1 − tan² A)', left: Math.tan(2 * A), right: (2 * tA) / (1 - tA * tA) },
  ];
}

/** Exact values used in the quiz: sin and cos of 15°, 75°, 105° and so on as (√6 ± √2)/4. */
export const EXACT: Record<number, { sin: string; cos: string }> = {
  15: { sin: '(√6 − √2)/4', cos: '(√6 + √2)/4' },
  75: { sin: '(√6 + √2)/4', cos: '(√6 − √2)/4' },
  105: { sin: '(√6 + √2)/4', cos: '(√2 − √6)/4' },
  165: { sin: '(√6 − √2)/4', cos: '−(√6 + √2)/4' },
};
