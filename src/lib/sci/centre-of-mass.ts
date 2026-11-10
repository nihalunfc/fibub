// #1336 Centre of mass finder: masses on a seesaw (moments about a pivot), point masses on a plane, and a
// flat shape made of equal squares. Plain maths, no DOM. Distances in metres, masses in kg, g = 9.8 m/s².
export const G = 9.8;
export type M1 = { m: number; x: number };
export type M2 = { m: number; x: number; y: number };

/** Centre of mass along a line: Σmx ÷ Σm. */
export function cm1d(ms: M1[]) { const M = ms.reduce((s, a) => s + a.m, 0); return M > 0 ? ms.reduce((s, a) => s + a.m * a.x, 0) / M : 0; }

/** Moments about a pivot (N m): anticlockwise from masses on the left, clockwise from those on the right. */
export function moments(ms: M1[], pivot: number, g = G) {
  let acw = 0, cw = 0;
  for (const a of ms) { const t = a.m * g * (a.x - pivot); if (t > 0) cw += t; else acw -= t; }
  const net = cw - acw; // + turns clockwise (right side goes down)
  return { acw, cw, net, balanced: Math.abs(net) < 1e-9 * Math.max(1, acw + cw) };
}

/** Where to put a mass m so that the line balances about the pivot (or NaN if it cannot). */
export function balanceAt(ms: M1[], pivot: number, m: number, g = G) { const n = moments(ms, pivot, g).net; return m > 0 ? pivot - n / (m * g) : NaN; }

/** Centre of mass on a plane. */
export function cm2d(ms: M2[]) {
  const M = ms.reduce((s, a) => s + a.m, 0);
  return M > 0 ? { x: ms.reduce((s, a) => s + a.m * a.x, 0) / M, y: ms.reduce((s, a) => s + a.m * a.y, 0) / M, M } : { x: 0, y: 0, M: 0 };
}

/** Centre of a flat shape of equal unit squares, given by the (col, row) of each square: the average of their centres. */
export function cmCells(cells: [number, number][]) {
  if (!cells.length) return { x: NaN, y: NaN, n: 0, inside: false };
  const x = cells.reduce((s, c) => s + c[0] + 0.5, 0) / cells.length, y = cells.reduce((s, c) => s + c[1] + 0.5, 0) / cells.length;
  const inside = cells.some((c) => x >= c[0] && x <= c[0] + 1 && y >= c[1] && y <= c[1] + 1);
  return { x, y, n: cells.length, inside };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string; tol?: number };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const m1 = pick(rng, 20, 60), d1 = pick(rng, 5, 20) / 10, m2 = pick(rng, 20, 60), d2 = (m1 * d1) / m2;
    qs.push({ text: `On a seesaw pivoted in the middle, a ${m1} kg child sits ${n(d1)} m from the pivot. How far from the pivot must a ${m2} kg child sit on the other side to balance?`, ans: d2, unit: 'm', work: `Principle of moments: ${m1} × ${n(d1)} = ${m2} × d, so d = ${n(m1 * d1)} ÷ ${m2} = ${n(d2)} m. (g cancels.)` }); }
  { const m1 = pick(rng, 1, 9), m2 = pick(rng, 1, 9), L = pick(rng, 2, 10), x = (m2 * L) / (m1 + m2);
    qs.push({ text: `A light rod ${L} m long has ${m1} kg at one end and ${m2} kg at the other. How far from the ${m1} kg end is the centre of mass?`, ans: x, unit: 'm', work: `x = (${m1} × 0 + ${m2} × ${L}) ÷ (${m1} + ${m2}) = ${n(x)} m, nearer the heavier end.` }); }
  { const a = [pick(rng, 1, 5), pick(rng, 1, 5), pick(rng, 1, 5)], xs = [0, pick(rng, 1, 6), pick(rng, 0, 6)], ys = [0, 0, pick(rng, 1, 6)], M = a[0] + a[1] + a[2], y = (a[2] * ys[2]) / M;
    qs.push({ text: `Masses of ${a[0]} kg at (${xs[0]}, ${ys[0]}), ${a[1]} kg at (${xs[1]}, ${ys[1]}) and ${a[2]} kg at (${xs[2]}, ${ys[2]}) metres. What is the y coordinate of their centre of mass?`, ans: y, unit: 'm', work: `y = Σmy ÷ Σm = (${a[0]} × 0 + ${a[1]} × 0 + ${a[2]} × ${ys[2]}) ÷ ${M} = ${n(y)} m.` }); }
  { const m = pick(rng, 2, 10), x = pick(rng, 1, 4) / 2, M = pick(rng, 1, 5), d = pick(rng, 1, 4) / 2, t = m * G * x - M * G * d;
    qs.push({ text: `A ${m} kg mass hangs ${n(x)} m to the right of a pivot and a ${M} kg mass ${n(d)} m to the left. What is the net turning moment (clockwise as +)? (g = 9.8 m/s²)`, ans: t, unit: 'N m', tol: 0.05, work: `Clockwise: ${m} × 9.8 × ${n(x)} = ${n(m * G * x)} N m. Anticlockwise: ${M} × 9.8 × ${n(d)} = ${n(M * G * d)} N m. Net = ${n(t)} N m.` }); }
  return qs;
}
