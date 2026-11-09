// Magnetic field mapper (school level): the field in a plane through a long straight wire, a circular loop, a
// solenoid and a bar magnet (taken as a short, fat solenoid: the same field outside as a uniformly magnetised bar).
// Loops use the exact Biot-Savart result with complete elliptic integrals. Lengths in metres, B in tesla.
// Plain maths, no DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export const MU0 = 1.25663706127e-6; // CODATA 2022, N/A²

/** Complete elliptic integrals K(m) and E(m) (parameter m = k²) by the arithmetic-geometric mean. */
export function ellipKE(m: number): [number, number] {
  let a = 1, b = Math.sqrt(1 - m), c = Math.sqrt(m), sum = 0.5 * m, p = 1;
  for (let i = 0; i < 30 && Math.abs(c) > 1e-16; i++) {
    const an = (a + b) / 2; c = (a - b) / 2; b = Math.sqrt(a * b); a = an; p *= 2; sum += p * c * c * 0.5;
  }
  const K = Math.PI / (2 * a);
  return [K, K * (1 - sum)];
}

/** Field of a circular loop of radius a with its axis along x, centred at x0, current I (positive: B along +x at
 *  the centre), at the point (x, y) in a plane through the axis. Returns [Bx, By]. */
export function loopB(a: number, I: number, x0: number, x: number, y: number): [number, number] {
  const z = x - x0, rho = Math.abs(y);
  if (rho < 1e-12 * a) return [(MU0 * I * a * a) / (2 * Math.pow(a * a + z * z, 1.5)), 0];
  const al2 = a * a + rho * rho + z * z - 2 * a * rho, be2 = a * a + rho * rho + z * z + 2 * a * rho, be = Math.sqrt(be2);
  if (al2 < 1e-18) return [0, 0]; // on the wire itself
  const m = 1 - al2 / be2, [K, E] = ellipKE(m), C = (MU0 * I) / Math.PI;
  const Bz = (C / (2 * al2 * be)) * ((a * a - rho * rho - z * z) * E + al2 * K);
  const Br = ((C * z) / (2 * al2 * be * rho)) * ((a * a + rho * rho + z * z) * E - al2 * K);
  return [Bz, Math.sign(y) * Br];
}

/** Long straight wire through (x0, y0) at right angles to the plane; positive I comes out of the screen. */
export function wireB(I: number, x0: number, y0: number, x: number, y: number): [number, number] {
  const dx = x - x0, dy = y - y0, r2 = dx * dx + dy * dy;
  if (r2 < 1e-12) return [0, 0];
  const k = (MU0 * I) / (2 * Math.PI * r2);
  return [-k * dy, k * dx];
}

export type Kind = 'magnet' | 'wire' | 'loop' | 'solenoid';
export type Setup = { kind: Kind; I: number; N: number };
/** Sizes (m): the loop radius, the solenoid's length and radius, the magnet's length and half-thickness. */
export const SIZE = { loopA: 0.04, solL: 0.12, solA: 0.025, magL: 0.08, magA: 0.015 };
const SLICES = 40;

/** The field at (x, y) for the setup. A magnet is drawn as a solenoid of 1000 ampere-turns (a teaching scale);
 *  the sign of I turns it round. */
export function field(s: Setup, x: number, y: number): [number, number] {
  if (s.kind === 'wire') return wireB(s.I, 0, 0, x, y);
  if (s.kind === 'loop') return loopB(SIZE.loopA, s.N * s.I, 0, x, y);
  const L = s.kind === 'magnet' ? SIZE.magL : SIZE.solL, a = s.kind === 'magnet' ? SIZE.magA : SIZE.solA, NI = s.kind === 'magnet' ? 1000 * Math.sign(s.I || 1) : s.N * s.I;
  let bx = 0, by = 0;
  for (let k = 0; k < SLICES; k++) { const x0 = -L / 2 + ((k + 0.5) * L) / SLICES, [u, v] = loopB(a, NI / SLICES, x0, x, y); bx += u; by += v; }
  return [bx, by];
}

/** Textbook values: wire B = μ0 I / (2π r); loop centre B = μ0 N I / (2a); long solenoid B = μ0 n I. */
export const wireFormula = (I: number, r: number) => (MU0 * I) / (2 * Math.PI * r);
export const loopCentre = (N: number, I: number, a: number) => (MU0 * N * I) / (2 * a);
export const solenoidInside = (n: number, I: number) => MU0 * n * I;

export type Box = { x0: number; x1: number; y0: number; y1: number };
/** Trace a field line from (x, y) both ways (RK4 on the unit direction), stopping at the box edge, near a wire, or
 *  when the line closes on itself. */
export function trace(s: Setup, x: number, y: number, box: Box, h = 0.0015, maxSteps = 900): [number, number][] {
  const dir = (px: number, py: number, sg: number): [number, number] => { const [bx, by] = field(s, px, py), m = Math.hypot(bx, by); return m > 0 ? [(sg * bx) / m, (sg * by) / m] : [0, 0]; };
  const half = (sg: number) => {
    const pts: [number, number][] = [[x, y]];
    let px = x, py = y, travelled = 0;
    for (let i = 0; i < maxSteps; i++) {
      const k1 = dir(px, py, sg), k2 = dir(px + (h / 2) * k1[0], py + (h / 2) * k1[1], sg), k3 = dir(px + (h / 2) * k2[0], py + (h / 2) * k2[1], sg), k4 = dir(px + h * k3[0], py + h * k3[1], sg);
      const dx = (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), dy = (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      if (!dx && !dy) break;
      px += dx; py += dy; travelled += h; pts.push([px, py]);
      if (px < box.x0 || px > box.x1 || py < box.y0 || py > box.y1) return { pts, closed: false };
      if (travelled > 6 * h && Math.hypot(px - x, py - y) < 0.7 * h) { pts.push([x, y]); return { pts, closed: true }; }
    }
    return { pts, closed: false };
  };
  const fwd = half(1);
  if (fwd.closed) return fwd.pts;
  const back = half(-1);
  return back.pts.reverse().concat(fwd.pts.slice(1));
}

/** Seed points: field lines through the middle of the coil or magnet, or rings round the wire. */
export function seeds(s: Setup, n: number): [number, number][] {
  if (s.kind === 'wire') return Array.from({ length: n }, (_, k) => [0.008 + 0.012 * k, 0] as [number, number]);
  const a = s.kind === 'loop' ? SIZE.loopA : s.kind === 'magnet' ? SIZE.magA : SIZE.solA;
  return Array.from({ length: n }, (_, k) => [0, -a * 0.92 + (1.84 * a * k) / Math.max(1, n - 1)] as [number, number]);
}

/** Direction of a vector as a compass bearing on the picture: 0° to the right, counter-clockwise positive. */
export const angleDeg = (bx: number, by: number) => ((Math.atan2(by, bx) * 180) / Math.PI + 360) % 360;

export function questions(rng: () => number = Math.random): Question[] {
  const I1 = pick(rng, [2, 3, 4, 5, 6, 8, 10]), rcm = pick(rng, [1, 2, 4, 5, 10]);
  const B1 = wireFormula(I1, rcm / 100) * 1e6;
  const N = pick(rng, [200, 300, 400, 500, 1000]), Lcm = pick(rng, [20, 25, 40, 50]), I2 = pick(rng, [0.5, 1, 1.5, 2]);
  const B2 = solenoidInside(N / (Lcm / 100), I2) * 1e3;
  const N3 = pick(rng, [10, 20, 50, 100]), a3 = pick(rng, [5, 8, 10]), I3 = pick(rng, [1, 2, 0.5]);
  const B3 = loopCentre(N3, I3, a3 / 100) * 1e6;
  const fi = pick(rng, [2, 3]), fr = pick(rng, [2, 3, 4]);
  return [
    { text: `A long straight wire carries ${I1} A. How strong is its magnetic field ${rcm} cm from the wire, in microtesla? (μ₀ = 4π × 10⁻⁷ T m/A)`, answer: B1, unit: 'µT', tol: 0.02,
      steps: ['B = μ₀ I / (2π r)', `B = 4π × 10⁻⁷ × ${I1} / (2π × ${rcm / 100}) = ${r3(B1)} µT`] },
    { text: `A solenoid ${Lcm} cm long has ${N} turns and carries ${I2} A. What is the field inside it, in millitesla?`, answer: B2, unit: 'mT', tol: 0.02,
      steps: [`Turns per metre: n = ${N} / ${Lcm / 100} m = ${r3(N / (Lcm / 100))} per m`, `B = μ₀ n I = 4π × 10⁻⁷ × ${r3(N / (Lcm / 100))} × ${I2} = ${r3(B2)} mT`] },
    { text: `A circular coil of ${N3} turns and radius ${a3} cm carries ${I3} A. What is the field at its centre, in microtesla?`, answer: B3, unit: 'µT', tol: 0.02,
      steps: ['B = μ₀ N I / (2a)', `B = 4π × 10⁻⁷ × ${N3} × ${I3} / (2 × ${a3 / 100}) = ${r3(B3)} µT`] },
    { text: `The current in a long straight wire is made ${fi} times bigger, and you move the compass ${fr} times closer to the wire. How many times stronger is the field there?`, answer: fi * fr, unit: '×', tol: 0.001,
      steps: ['B = μ₀ I / (2π r): B grows with I and with 1/r.', `${fi} × ${fr} = ${fi * fr} times stronger`] },
  ];
}
