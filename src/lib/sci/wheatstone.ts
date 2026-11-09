// Wheatstone bridge and metre bridge (school level): every current in the bridge from Kirchhoff's rules (node
// voltages), the galvanometer current, and the balance condition P/Q = R/S. Plain maths, no DOM. SI units.
import { pick, r3, type Question } from './elec-quiz.ts';

/** Solve a 3×3 linear system by Cramer's rule. */
function solve3(m: number[][], b: number[]) {
  const det = (a: number[][]) => a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
  const D = det(m);
  return [0, 1, 2].map((k) => det(m.map((row, i) => row.map((v, j) => (j === k ? b[i] : v)))) / D);
}

/** Bridge A–B: P, B–C: Q, A–D: R, D–C: S, galvanometer G from B to D, cell of emf E and internal resistance r
 *  driving current from C through the cell to A. Returns node voltages (C = 0) and the current in every arm. */
export function bridge(P: number, Q: number, R: number, S: number, G: number, E: number, r: number) {
  // Unknowns VA, VB, VD. Currents leaving each node add to zero.
  const gP = 1 / P, gQ = 1 / Q, gR = 1 / R, gS = 1 / S, gG = 1 / G, gr = 1 / r;
  const m = [
    [gP + gR + gr, -gP, -gR],
    [-gP, gP + gQ + gG, -gG],
    [-gR, -gG, gR + gS + gG],
  ];
  const [VA, VB, VD] = solve3(m, [E * gr, 0, 0]);
  const IP = (VA - VB) * gP, IQ = VB * gQ, IR = (VA - VD) * gR, IS = VD * gS, IG = (VB - VD) * gG, I = (E - VA) * gr;
  return { VA, VB, VD, IP, IQ, IR, IS, IG, I };
}

/** Metre bridge: unknown X in the left gap, known R in the right gap, a wire of total resistance Rw over 100 cm, and
 *  the jockey at l cm from the left end. The galvanometer joins the gaps' junction to the jockey. */
export function metre(X: number, Rk: number, l: number, Rw: number, G: number, E: number, r: number) {
  const a = Math.max(1e-6, (Rw * l) / 100), b = Math.max(1e-6, (Rw * (100 - l)) / 100);
  return bridge(X, Rk, a, b, G, E, r);
}
/** Balance length l = 100 X / (X + R), and the unknown from a balance length: X = R l / (100 − l). */
export const balanceL = (X: number, Rk: number) => (100 * X) / (X + Rk);
export const unknownFrom = (Rk: number, l: number) => (Rk * l) / (100 - l);

export function questions(rng: () => number = Math.random): Question[] {
  const Rk = pick(rng, [2, 5, 10, 20]), l = pick(rng, [25, 30, 40, 45, 55, 60, 62.5, 75]);
  const X = unknownFrom(Rk, l);
  const P = pick(rng, [10, 20, 50, 100]), Q = pick(rng, [10, 20, 50, 100]), R = pick(rng, [5, 15, 30, 60]);
  const S = (Q * R) / P;
  const Xr = pick(rng, [3, 4, 6, 8]), Rr = pick(rng, [2, 4, 6, 12]);
  const lb = balanceL(Xr, Rr);
  const sw = 100 - l;
  return [
    { text: `In a metre bridge with a ${Rk} Ω resistor in the right gap, the balance point is ${l} cm from the left end. What is the unknown resistance in the left gap, in ohms?`, answer: X, unit: 'Ω', tol: 0.02,
      steps: ['X / R = l / (100 − l)', `X = ${Rk} × ${l} / ${100 - l} = ${r3(X)} Ω`] },
    { text: `A Wheatstone bridge has P = ${P} Ω, Q = ${Q} Ω and R = ${R} Ω. What value of S balances it, in ohms?`, answer: S, unit: 'Ω', tol: 0.02,
      steps: ['Balance: P / Q = R / S', `S = Q R / P = ${Q} × ${R} / ${P} = ${r3(S)} Ω`] },
    { text: `A ${Xr} Ω resistor is in the left gap of a metre bridge and ${Rr} Ω in the right gap. Where is the balance point, in cm from the left end?`, answer: lb, unit: 'cm', tol: 0.01,
      steps: ['l / (100 − l) = X / R, so l = 100 X / (X + R)', `l = 100 × ${Xr} / ${Xr + Rr} = ${r3(lb)} cm`] },
    { text: `The ${Rk} Ω and the unknown resistor (balance at ${l} cm) are swapped round. Where is the new balance point, in cm?`, answer: sw, unit: 'cm', tol: 0.01,
      steps: ['Swapping the gaps swaps the two lengths.', `l' = 100 − ${l} = ${sw} cm`] },
  ];
}
