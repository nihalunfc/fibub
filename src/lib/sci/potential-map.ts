// Electric potential of a few point charges on a board (school level): V = Σ kq/r, the field as the downhill
// slope, equipotential lines by marching squares, and a test charge rolling downhill. Positions in cm, charges
// in nC, potential in volts, field in V/m. No DOM.
import { K, n3 } from './em-p34.ts';
import { pick, type Question } from './elec-quiz.ts';

export type Charge = { q: number; x: number; y: number };

export function potential(cs: Charge[], x: number, y: number) {
  let V = 0;
  for (const c of cs) V += (K * c.q * 1e-9) / (Math.hypot(x - c.x, y - c.y) / 100);
  return V;
}
export function field(cs: Charge[], x: number, y: number) {
  let Ex = 0, Ey = 0;
  for (const c of cs) {
    const dx = (x - c.x) / 100, dy = (y - c.y) / 100, r = Math.hypot(dx, dy), e = (K * c.q * 1e-9) / (r * r * r);
    Ex += e * dx; Ey += e * dy;
  }
  return { Ex, Ey, E: Math.hypot(Ex, Ey) };
}

/** Equipotential line pieces at `level` over a grid of values g[j][i] at x = x0 + i·h, y = y0 + j·h. */
export function contour(g: number[][], x0: number, y0: number, h: number, level: number) {
  const segs: [number, number, number, number][] = [];
  const lerp = (a: number, b: number) => (level - a) / (b - a);
  for (let j = 0; j + 1 < g.length; j++) for (let i = 0; i + 1 < g[j].length; i++) {
    const a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], d = g[j + 1][i];
    if (![a, b, c, d].every(Number.isFinite)) continue;
    const pts: [number, number][] = [];
    if ((a < level) !== (b < level)) pts.push([x0 + (i + lerp(a, b)) * h, y0 + j * h]);
    if ((b < level) !== (c < level)) pts.push([x0 + (i + 1) * h, y0 + (j + lerp(b, c)) * h]);
    if ((d < level) !== (c < level)) pts.push([x0 + (i + lerp(d, c)) * h, y0 + (j + 1) * h]);
    if ((a < level) !== (d < level)) pts.push([x0 + i * h, y0 + (j + lerp(a, d)) * h]);
    if (pts.length === 2) segs.push([...pts[0], ...pts[1]]);
    else if (pts.length === 4) segs.push([...pts[0], ...pts[1]], [...pts[2], ...pts[3]]);
  }
  return segs;
}

/** Path of a positive test charge let go at (x, y), stepping along the field (downhill) until it reaches a
 *  negative charge, leaves the board or the field becomes tiny. Step length in cm. */
export function rollPath(cs: Charge[], x: number, y: number, w: number, h: number, step = 0.2, max = 2000) {
  const pts: [number, number][] = [[x, y]];
  for (let k = 0; k < max; k++) {
    const f = field(cs, x, y);
    if (f.E < 1e-6) break;
    x += (step * f.Ex) / f.E; y += (step * f.Ey) / f.E;
    pts.push([x, y]);
    if (x < 0 || y < 0 || x > w || y > h) break;
    if (cs.some((c) => c.q < 0 && Math.hypot(c.x - x, c.y - y) < 0.6)) break;
  }
  return pts;
}

export function questions(rng: () => number = Math.random): Question[] {
  const q = pick(rng, [1, 2, 4, 5]), r = pick(rng, [10, 20, 30]), V = (K * q * 1e-9) / (r / 100);
  const qa = pick(rng, [2, 4, 6]), qb = pick(rng, [-1, 1, 3]), d = pick(rng, [10, 20]), Vm = (K * (qa + qb) * 1e-9) / (d / 200);
  const q0 = pick(rng, [1, 2, 5]), VA = pick(rng, [100, 200, 300]), VB = pick(rng, [-100, 0, 50]), W = q0 * 1e-6 * (VA - VB);
  const dV = pick(rng, [10, 20, 50]), dx = pick(rng, [2, 5, 10]), E = dV / (dx / 100);
  return [
    { text: `What is the potential ${r} cm from a +${q} nC charge, in volts?`, answer: V, unit: 'V', tol: 0.02,
      steps: ['V = k q / r', `V = 8.99 × 10⁹ × ${q} × 10⁻⁹ / ${r / 100} = ${n3(V)} V`] },
    { text: `Charges of +${qa} nC and ${qb > 0 ? '+' : '−'}${Math.abs(qb)} nC are ${d} cm apart. What is the potential halfway between them, in volts?`, answer: Math.abs(Vm), unit: 'V', tol: 0.02,
      steps: ['Potentials are numbers, not arrows: just add them. Each charge is r = d/2 away.', `V = 8.99 × 10⁹ × (${qa} ${qb < 0 ? '−' : '+'} ${Math.abs(qb)}) × 10⁻⁹ / ${d / 200} = ${n3(Vm)} V`] },
    { text: `A +${q0} µC charge moves from a point at ${VA} V to a point at ${VB} V. How much work does the field do on it, in joules?`, answer: W, unit: 'J', tol: 0.02,
      steps: ['W = q (V_A − V_B)', `W = ${q0} × 10⁻⁶ × (${VA} − (${VB})) = ${n3(W)} J`] },
    { text: `Two equipotentials ${dV} V apart are ${dx} cm apart in a uniform field. How strong is the field, in V/m?`, answer: E, unit: 'V/m', tol: 0.02,
      steps: ['E = ΔV / Δd (the steepness of the potential hill)', `E = ${dV} / ${dx / 100} = ${n3(E)} V/m`] },
  ];
}
