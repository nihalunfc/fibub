// Transformer and power transmission (school level): turns ratio, secondary voltage and current with a resistive
// load, primary current with a given efficiency, and the I²R loss in a line when the same power is sent at
// different voltages. Rms values, SI units, unity power factor. No DOM.
import { pick, type Question } from './elec-quiz.ts';
import { n3 } from './em-p34.ts';

export function transformer(Np: number, Ns: number, Vp: number, Rload: number, eff: number) {
  const Vs = (Vp * Ns) / Np, Is = Vs / Rload, Ps = Vs * Is, Pp = Ps / eff, Ip = Pp / Vp;
  return { ratio: Ns / Np, Vs, Is, Ps, Pp, Ip, loss: Pp - Ps, kind: Ns > Np ? 'step-up' : Ns < Np ? 'step-down' : 'one-to-one' };
}
/** Sending power P (W) through a line of total resistance R (Ω) at voltage V: current, loss and share lost. */
export function line(P: number, V: number, R: number) {
  const I = P / V, loss = I * I * R;
  return { I, loss, share: loss / P, drop: I * R };
}

export function questions(rng: () => number = Math.random): Question[] {
  const Np = pick(rng, [500, 1000, 2000]), Ns = pick(rng, [50, 100, 4000]), Vp = pick(rng, [230, 240, 110]), Vs = (Vp * Ns) / Np;
  const Vp2 = 230, Vs2 = pick(rng, [6, 12, 23]), Is2 = pick(rng, [2, 5, 10]), Ip2 = (Vs2 * Is2) / Vp2;
  const P = pick(rng, [1, 2, 5]) * 1e6, V = pick(rng, [11, 33, 132]) * 1e3, R = pick(rng, [2, 5, 10]), L = line(P, V, R).loss;
  const e = pick(rng, [80, 90, 95]), Pout = pick(rng, [100, 450, 900]);
  return [
    { text: `A transformer has ${Np} turns on its primary and ${Ns} on its secondary. The primary is on ${Vp} V. What is the secondary voltage, in volts?`, answer: Vs, unit: 'V', tol: 0.01,
      steps: ['V_s / V_p = N_s / N_p', `V_s = ${Vp} × ${Ns} / ${Np} = ${n3(Vs)} V`] },
    { text: `An ideal transformer on 230 V mains gives ${Vs2} V and ${Is2} A to a lamp. What current does it draw from the mains, in amperes?`, answer: Ip2, unit: 'A', tol: 0.02,
      steps: ['Ideal: power in = power out, V_p I_p = V_s I_s', `I_p = ${Vs2} × ${Is2} / 230 = ${n3(Ip2)} A`] },
    { text: `${P / 1e6} MW is sent at ${V / 1000} kV through lines of total resistance ${R} Ω. How much power is lost as heat, in watts?`, answer: L, unit: 'W', tol: 0.02,
      steps: [`I = P / V = ${P} / ${V} = ${n3(P / V)} A`, `Loss = I² R = ${n3(P / V)}² × ${R} = ${n3(L)} W`] },
    { text: `A transformer is ${e}% efficient and delivers ${Pout} W. How much power does it take in, in watts?`, answer: Pout / (e / 100), unit: 'W', tol: 0.02,
      steps: ['Efficiency = power out / power in', `Power in = ${Pout} / ${e / 100} = ${n3(Pout / (e / 100))} W`] },
  ];
}
