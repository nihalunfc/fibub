// #1409 Biot–Savart field builder and Ampère's law: the field of a straight wire, a circular loop and a solenoid
// built up from small current elements dB = (μ₀/4π) I dl × r̂ / r², the closed-form answers to compare with,
// and the line integral of B round a circle among long straight wires. No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export const MU0 = 1.25663706127e-6; // N/A², CODATA 2022
const K = MU0 / (4 * Math.PI);
export type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);

/** Field at P from one short element I dl at position s (Biot–Savart). */
export function element(I: number, s: V3, dl: V3, P: V3): V3 {
  const r = sub(P, s), d = norm(r), c = cross(dl, r), k = (K * I) / (d * d * d);
  return [k * c[0], k * c[1], k * c[2]];
}
export type Piece = { s: V3; dl: V3 };
/** A straight wire along y from −L/2 to L/2 (current upwards), cut into n pieces. */
export const wirePieces = (L: number, n: number): Piece[] => Array.from({ length: n }, (_, i) => ({ s: [0, -L / 2 + ((i + 0.5) * L) / n, 0], dl: [0, L / n, 0] }));
/** A circular loop of radius R in the y–z plane centred at x0, current anticlockwise seen from +x, cut into n pieces. */
export function loopPieces(R: number, n: number, x0 = 0): Piece[] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + 0.5) * 2 * Math.PI) / n, da = (2 * Math.PI) / n;
    // Exact chord of the arc, so the polygon closes.
    const a0 = a - da / 2, a1 = a + da / 2;
    return { s: [x0, R * Math.cos(a), R * Math.sin(a)], dl: [0, R * (Math.cos(a1) - Math.cos(a0)), R * (Math.sin(a1) - Math.sin(a0))] };
  });
}
/** Sum of the fields of the first k pieces at P. */
export function sumPieces(I: number, pieces: Piece[], P: V3, k = pieces.length): V3 {
  const B: V3 = [0, 0, 0];
  for (let i = 0; i < Math.min(k, pieces.length); i++) { const d = element(I, pieces[i].s, pieces[i].dl, P); B[0] += d[0]; B[1] += d[1]; B[2] += d[2]; }
  return B;
}

/** Straight wire of length L along y (centred on 0), point at distance d from it and height y: B = μ₀I/(4πd)(sin α₁ + sin α₂). */
export const wireExact = (I: number, L: number, d: number, y = 0) => ((K * I) / d) * ((L / 2 - y) / Math.hypot(d, L / 2 - y) + (L / 2 + y) / Math.hypot(d, L / 2 + y));
/** Infinitely long wire: μ₀ I / (2π d). */
export const longWire = (I: number, d: number) => (MU0 * I) / (2 * Math.PI * d);
/** On the axis of N turns of radius R, a distance x from the centre: μ₀ N I R² / (2 (R² + x²)^{3/2}). */
export const loopAxis = (I: number, R: number, x: number, N = 1) => (MU0 * N * I * R * R) / (2 * Math.pow(R * R + x * x, 1.5));
/** On the axis of a solenoid of N turns, length len and radius R, a distance x from its middle. */
export const solenoidAxis = (I: number, N: number, len: number, R: number, x: number) => ((MU0 * (N / len) * I) / 2) * ((x + len / 2) / Math.hypot(R, x + len / 2) - (x - len / 2) / Math.hypot(R, x - len / 2));
/** The long-solenoid value μ₀ n I. */
export const solenoidIdeal = (I: number, N: number, len: number) => MU0 * (N / len) * I;

/** Ampère's law: long straight wires at (x, y) carrying I (positive out of the page). */
export type Wire = { x: number; y: number; I: number };
export function fieldOfWires(wires: Wire[], x: number, y: number): [number, number] {
  let bx = 0, by = 0;
  for (const w of wires) { const dx = x - w.x, dy = y - w.y, r2 = dx * dx + dy * dy, k = (MU0 * w.I) / (2 * Math.PI * r2); bx += -k * dy; by += k * dx; }
  return [bx, by];
}
/** ∮ B · dl round a circle (anticlockwise) by the midpoint rule with n steps, and the current inside. */
export function ampereLoop(wires: Wire[], cx: number, cy: number, rad: number, n = 720) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) * 2 * Math.PI) / n, x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a), [bx, by] = fieldOfWires(wires, x, y);
    sum += (bx * -Math.sin(a) + by * Math.cos(a)) * rad * ((2 * Math.PI) / n);
  }
  const inside = wires.filter((w) => Math.hypot(w.x - cx, w.y - cy) < rad), Ienc = inside.reduce((s, w) => s + w.I, 0);
  const onLine = wires.some((w) => Math.abs(Math.hypot(w.x - cx, w.y - cy) - rad) < rad * 0.03);
  return { integral: sum, Ienc, expected: MU0 * Ienc, inside, onLine };
}

export function questions(rng: () => number = Math.random): Question[] {
  const mu = 4 * Math.PI * 1e-7;
  const I1 = pick(rng, [2, 5, 10, 20]), d1 = pick(rng, [2, 4, 5, 10]);
  const B1 = (mu * I1) / (2 * Math.PI * d1 * 1e-2) * 1e6;
  const N2 = pick(rng, [10, 50, 100]), I2 = pick(rng, [0.5, 1, 2]), R2 = pick(rng, [5, 10, 20]);
  const B2 = (mu * N2 * I2) / (2 * R2 * 1e-2) * 1e3;
  const n3 = pick(rng, [500, 1000, 2000]), I3 = pick(rng, [0.5, 1, 2, 3]);
  const B3 = mu * n3 * I3 * 1e3;
  const Ia = pick(rng, [5, 8, 10]), Ib = pick(rng, [2, 3, 4]);
  const L4 = mu * (Ia - Ib) * 1e6;
  return [
    { text: `A long straight wire carries ${I1} A. What is the magnetic field ${d1} cm from it, in microtesla? (μ₀ = 4π × 10⁻⁷ T m/A)`, answer: B1, unit: 'µT', tol: 0.02,
      steps: ['B = μ₀ I / (2π d)', `B = 4π × 10⁻⁷ × ${I1} / (2π × ${d1 / 100}) T = ${r3(B1)} µT`] },
    { text: `A flat coil of ${N2} turns and radius ${R2} cm carries ${I2} A. What is the field at its centre, in millitesla?`, answer: B2, unit: 'mT', tol: 0.02,
      steps: ['B = μ₀ N I / (2R)', `B = 4π × 10⁻⁷ × ${N2} × ${I2} / (2 × ${R2 / 100}) T = ${r3(B2)} mT`] },
    { text: `A long solenoid has ${n3} turns per metre and carries ${I3} A. What is the field inside it, in millitesla?`, answer: B3, unit: 'mT', tol: 0.02,
      steps: ['B = μ₀ n I', `B = 4π × 10⁻⁷ × ${n3} × ${I3} T = ${r3(B3)} mT`] },
    { text: `A loop encloses a wire carrying ${Ia} A out of the page and another carrying ${Ib} A into the page. What is ∮B·dl round the loop (anticlockwise), in µT m?`, answer: L4, unit: 'µT m', tol: 0.02,
      steps: ['Ampère: ∮B·dl = μ₀ × (current enclosed), counting out of the page as positive for an anticlockwise loop.', `∮B·dl = 4π × 10⁻⁷ × (${Ia} − ${Ib}) T m = ${r3(L4)} µT m`] },
  ];
}
