// Electrostatic shielding (school level), seen end-on as a long metal tube on a board. Positions in cm.
// 1. A neutral tube (outer radius a) in a uniform field E0 at angle α: outside, φ = −E0 (r − a²/r) cos(θ − α);
//    inside the metal and in its hollow, the field is exactly zero; induced surface charge σ = 2ε0 E0 cos(θ − α).
// 2. A line charge λ at the centre of a hollow tube (inner radius a1, outer a2): inside, E = λ/(2πε0 r); in the
//    metal, 0; outside, the same as without the tube, or zero if the tube is earthed. No DOM.
import { EPS0, K, n3 } from './em-p34.ts';
import { pick, type Question } from './elec-quiz.ts';

export const CX = 18, CY = 14;

/** Field (V/m) at (x, y) cm from a uniform field E0 (V/m) at angle alpha (degrees), with or without the tube. */
export function outsideField(E0: number, alphaDeg: number, a: number, x: number, y: number, tube: boolean): [number, number] {
  const al = (alphaDeg * Math.PI) / 180;
  if (!tube) return [E0 * Math.cos(al), E0 * Math.sin(al)];
  const dx = x - CX, dy = y - CY, r = Math.hypot(dx, dy);
  if (r <= a) return [0, 0];
  const th = Math.atan2(dy, dx), u = th - al, k = (a * a) / (r * r);
  const Er = E0 * (1 + k) * Math.cos(u), Et = -E0 * (1 - k) * Math.sin(u);
  return [Er * Math.cos(th) - Et * Math.sin(th), Er * Math.sin(th) + Et * Math.cos(th)];
}
/** Induced surface charge density (C/m²) at angle θ (degrees) round the tube. */
export const sigmaAt = (E0: number, alphaDeg: number, thetaDeg: number) => 2 * EPS0 * E0 * Math.cos(((thetaDeg - alphaDeg) * Math.PI) / 180);

/** Field (V/m) at (x, y) from a line charge lam (C/m) at the centre of a hollow tube. */
export function insideField(lam: number, a1: number, a2: number, earthed: boolean, x: number, y: number, tube = true): [number, number] {
  const dx = x - CX, dy = y - CY, r = Math.hypot(dx, dy);
  if (r < 1e-9) return [0, 0];
  if (tube && r > a1 && r < a2) return [0, 0];
  if (tube && r >= a2 && earthed) return [0, 0];
  const E = lam / (2 * Math.PI * EPS0 * (r / 100));
  return [(E * dx) / r, (E * dy) / r];
}

/** A field line from (x, y), stepping `step` cm along (or against, dir = −1) the field until it stops. */
export function trace(f: (x: number, y: number) => [number, number], x: number, y: number, dir: 1 | -1, w: number, h: number, step = 0.25, max = 600) {
  const pts: [number, number][] = [[x, y]];
  for (let i = 0; i < max; i++) {
    // Midpoint (RK2) step along the unit field direction.
    const [ax, ay] = f(x, y), m = Math.hypot(ax, ay);
    if (m < 1e-9) break;
    const mx = x + (dir * step * ax) / m / 2, my = y + (dir * step * ay) / m / 2, [bx, by] = f(mx, my), mb = Math.hypot(bx, by);
    if (mb < 1e-9) break;
    x += (dir * step * bx) / mb; y += (dir * step * by) / mb;
    pts.push([x, y]);
    if (x < -1 || y < -1 || x > w + 1 || y > h + 1) break;
  }
  return pts;
}

export function questions(rng: () => number = Math.random): Question[] {
  const q = pick(rng, [2, 3, 5]), extra = pick(rng, [1, 2, 4]);
  const Q = pick(rng, [1, 2, 5]), r = pick(rng, [20, 30, 50]), E = (K * Q * 1e-6) / (r / 100) ** 2;
  const sig = pick(rng, [1, 2, 5]), Es = (sig * 1e-6) / EPS0;
  const R = pick(rng, [5, 10]), Q2 = pick(rng, [1, 2, 4]), s2 = (Q2 * 1e-6) / (4 * Math.PI * (R / 100) ** 2), E2 = s2 / EPS0;
  return [
    { text: `A +${q} µC charge is held inside the hollow of a metal shell that already carries +${extra} µC. What is the charge on the shell's outer surface, in µC?`, answer: q + extra, unit: 'µC', tol: 0.01,
      steps: [`The inner surface gets −${q} µC, so the field in the metal is zero.`, `The outer surface gets the rest: ${extra} + ${q} = ${q + extra} µC.`] },
    { text: `A metal sphere carries ${Q} µC. What is the field ${r} cm from its centre (outside it), in N/C?`, answer: E, unit: 'N/C', tol: 0.02,
      steps: ['Outside, a charged conducting sphere acts like a point charge at its centre: E = kQ/r².', `E = 8.99 × 10⁹ × ${Q} × 10⁻⁶ / ${r / 100}² = ${n3(E)} N/C`] },
    { text: `A conductor has ${sig} µC of charge on each square metre of its surface. What is the field just outside it, in N/C?`, answer: Es, unit: 'N/C', tol: 0.02,
      steps: ['Just outside a conductor, E = σ / ε₀, at right angles to the surface.', `E = ${sig} × 10⁻⁶ / 8.85 × 10⁻¹² = ${n3(Es)} N/C`] },
    { text: `A metal sphere of radius ${R} cm carries ${Q2} µC. What is the field just outside its surface, in N/C?`, answer: E2, unit: 'N/C', tol: 0.02,
      steps: [`σ = Q / (4πR²) = ${Q2} × 10⁻⁶ / (4π × ${R / 100}²) = ${n3(s2)} C/m²`, `E = σ / ε₀ = ${n3(E2)} N/C (the same as kQ/R²)`] },
  ];
}
