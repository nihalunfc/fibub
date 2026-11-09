// Electromagnet builder (school level): a coil wound on a nail, driven by 1.5 V cells, with or without an iron core.
// The coil's field is the exact field of a stack of loops (magnetic-mapper); the iron core is a teaching model that
// multiplies it by a fixed factor, and the paper-clip count is a teaching model too. Plain maths, no DOM. SI units.
import { loopB, MU0 } from './magnetic-mapper.ts';
import { pick, r3, type Question } from './elec-quiz.ts';

export const NAIL = { L: 0.08, a: 0.005 }; // winding length and radius (m)
export const CELL = { V: 1.5, r: 0.5 };   // one cell: emf (V) and internal resistance (Ω)
export const WIRE_PER_TURN = 0.02;        // Ω per turn of thin wire (made-up)
export const CORE = 100;                  // iron core multiplies the field by this much (teaching model)
export const CLIP_B = 0.008;              // tesla at the end of the nail per paper clip held (teaching model)
export const EARTH = 40e-6;               // horizontal part of the Earth's field, roughly, in tesla

/** Current from n cells in series through the coil: I = n V / (n r + N × wire + 0.5 Ω of leads and switch). */
export const current = (cells: number, N: number) => (cells * CELL.V) / (cells * CELL.r + N * WIRE_PER_TURN + 0.5);

/** Field (T) at (x, y) from the coil (centred at the origin, axis along x), with the core factor applied. */
export function field(N: number, I: number, core: boolean, x: number, y: number): [number, number] {
  const K = 24, k = core ? CORE : 1;
  let bx = 0, by = 0;
  for (let i = 0; i < K; i++) { const x0 = -NAIL.L / 2 + ((i + 0.5) * NAIL.L) / K, [u, v] = loopB(NAIL.a, (N * I) / K, x0, x, y); bx += u; by += v; }
  return [k * bx, k * by];
}
/** Field at the end of the nail, on its axis. */
export const endField = (N: number, I: number, core: boolean) => field(N, I, core, NAIL.L / 2, 0)[0];
/** Paper clips held (teaching model): one per CLIP_B of field at the end, at most 20. */
export const clips = (B: number) => Math.min(20, Math.floor(Math.abs(B) / CLIP_B + 1e-9));
/** Long-solenoid estimate inside: B = μr μ0 n I. */
export const insideEstimate = (N: number, I: number, core: boolean) => (core ? CORE : 1) * MU0 * (N / NAIL.L) * I;
/** Compass needle: angle (degrees, clockwise from north = up the screen) of the Earth's field plus the coil's. */
export function needle(N: number, I: number, core: boolean, x: number, y: number) {
  const [bx, by] = field(N, I, core, x, y);
  return (Math.atan2(bx, by + EARTH) * 180) / Math.PI;
}

export function questions(rng: () => number = Math.random): Question[] {
  const c1 = pick(rng, [2, 3, 4, 5]), N1 = pick(rng, [20, 25, 30, 40]), k = pick(rng, [2, 3]);
  const Nn = pick(rng, [100, 200, 500]), Lcm = pick(rng, [10, 20, 25]), I = pick(rng, [0.5, 1, 2]);
  const B = MU0 * (Nn / (Lcm / 100)) * I * 1000;
  const ki = pick(rng, [2, 3]), kn = pick(rng, [2, 3]);
  return [
    { text: `An electromagnet with ${N1} turns picks up ${c1} paper clips. In a simple model the strength grows in step with the number of turns. About how many clips would ${k * N1} turns pick up, with the same current?`, answer: k * c1, unit: 'clips', tol: 0.001,
      steps: [`${k * N1} turns is ${k} times as many as ${N1}.`, `${k} × ${c1} = ${k * c1} clips`] },
    { text: `You make the current ${ki} times bigger and use ${kn} times as many turns. How many times stronger is the electromagnet?`, answer: ki * kn, unit: '×', tol: 0.001,
      steps: ['Strength grows with the current and with the number of turns.', `${ki} × ${kn} = ${ki * kn} times`] },
    { text: `Class 10: a coil of ${Nn} turns, ${Lcm} cm long, with no core, carries ${I} A. What is the field inside, in millitesla? (B = μ₀ n I, μ₀ = 4π × 10⁻⁷)`, answer: B, unit: 'mT', tol: 0.02,
      steps: [`n = ${Nn} / ${Lcm / 100} m = ${r3(Nn / (Lcm / 100))} turns per metre`, `B = 4π × 10⁻⁷ × ${r3(Nn / (Lcm / 100))} × ${I} = ${r3(B)} mT`] },
  ];
}
