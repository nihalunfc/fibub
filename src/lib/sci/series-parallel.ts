// Series and parallel resistors (school level): a group of resistors in series, followed by a bank in parallel,
// on a battery with an optional internal resistance. Currents, voltages, powers, the energy used and its cost,
// and fresh practice questions. Plain maths, no DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export type Place = 'series' | 'parallel' | 'out';
export type Res = { R: number; place: Place };

/** Resistance of resistors in parallel: 1/R = Σ 1/Rk. Empty list gives 0 (a plain wire). */
export const parallel = (rs: number[]) => (rs.length ? 1 / rs.reduce((s, r) => s + 1 / r, 0) : 0);
export const series = (rs: number[]) => rs.reduce((s, r) => s + r, 0);

export type Solved = {
  Rs: number; Rp: number; Req: number; Rtot: number; I: number; Vterm: number; Vs: number; Vp: number; P: number; Plost: number;
  parts: { i: number; R: number; place: Place; V: number; I: number; P: number }[];
  short: boolean;
};

/** Solve the circuit: EMF E (V), internal resistance r (Ω). */
export function solve(res: Res[], E: number, r = 0): Solved {
  const sIdx = res.map((x, i) => (x.place === 'series' ? i : -1)).filter((i) => i >= 0);
  const pIdx = res.map((x, i) => (x.place === 'parallel' ? i : -1)).filter((i) => i >= 0);
  const Rs = series(sIdx.map((i) => res[i].R)), Rp = parallel(pIdx.map((i) => res[i].R));
  const Req = Rs + Rp, Rtot = Req + r;
  const short = Rtot <= 0;
  const I = short ? Infinity : E / Rtot;
  const Vp = I * Rp, Vs = I * Rs, Vterm = E - I * r;
  const parts = res.map((x, i) => {
    if (x.place === 'series') return { i, R: x.R, place: x.place, V: I * x.R, I, P: I * I * x.R };
    if (x.place === 'parallel') { const Ik = Vp / x.R; return { i, R: x.R, place: x.place, V: Vp, I: Ik, P: Vp * Ik }; }
    return { i, R: x.R, place: x.place, V: 0, I: 0, P: 0 };
  });
  return { Rs, Rp, Req, Rtot, I, Vterm, Vs, Vp, P: I * I * Req, Plost: I * I * r, parts, short };
}

/** Energy in kWh for a power P (W) used h hours a day for d days, and its cost at a rate per kWh. */
export const kWh = (P: number, h: number, d: number) => (P * h * d) / 1000;

export function questions(rng: () => number = Math.random): Question[] {
  const Rv = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30, 60];
  const a = pick(rng, Rv), b = pick(rng, Rv), c = pick(rng, Rv);
  const p1 = pick(rng, [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [6, 3], [12, 4], [10, 10], [8, 8]]);
  const Rpar = parallel(p1);
  const s1 = pick(rng, [2, 4, 5, 6, 10]), V = pick(rng, [6, 9, 12, 24]);
  const Rmix = s1 + Rpar, Imix = V / Rmix;
  const W = pick(rng, [60, 100, 500, 750, 1000, 1500, 2000]), h = pick(rng, [2, 3, 4, 5, 6, 8]), d = 30, rate = pick(rng, [5, 6, 7, 8]);
  const E = kWh(W, h, d);
  return [
    { text: `Three resistors of ${a} Ω, ${b} Ω and ${c} Ω are joined in series. What is the total resistance?`, answer: a + b + c, unit: 'Ω', tol: 0.005,
      steps: ['In series the resistances add: R = R₁ + R₂ + R₃', `R = ${a} + ${b} + ${c} = ${a + b + c} Ω`] },
    { text: `A ${p1[0]} Ω and a ${p1[1]} Ω resistor are joined in parallel. What is their combined resistance?`, answer: Rpar, unit: 'Ω', tol: 0.02,
      steps: ['1/R = 1/R₁ + 1/R₂', `1/R = 1/${p1[0]} + 1/${p1[1]} = ${r3(1 / Rpar)} per Ω`, `R = ${r3(Rpar)} Ω (product over sum: ${p1[0]} × ${p1[1]} / ${p1[0] + p1[1]})`] },
    { text: `A ${s1} Ω resistor is in series with a parallel pair of ${p1[0]} Ω and ${p1[1]} Ω, on a ${V} V battery. What current leaves the battery?`, answer: Imix, unit: 'A', tol: 0.02,
      steps: [`Parallel pair: ${p1[0]} × ${p1[1]} / ${p1[0] + p1[1]} = ${r3(Rpar)} Ω`, `Total: ${s1} + ${r3(Rpar)} = ${r3(Rmix)} Ω`, `I = V / R = ${V} / ${r3(Rmix)} = ${r3(Imix)} A`] },
    { text: `A ${W} W appliance runs ${h} hours a day for ${d} days. Electricity costs ₹${rate} per kWh (unit). What is the cost in rupees?`, answer: E * rate, unit: '₹', tol: 0.01,
      steps: [`Energy = P × t = ${W / 1000} kW × ${h * d} h = ${r3(E)} kWh`, `Cost = ${r3(E)} × ₹${rate} = ₹${r3(E * rate)}`] },
  ];
}
