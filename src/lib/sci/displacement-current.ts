// Charging a parallel-plate capacitor through a resistor, and Maxwell's displacement current (school level).
// Round plates of radius a, gap d, vacuum between them. Between the plates the changing electric flux gives a
// displacement current I_d = ε0 dΦ_E/dt, equal to the conduction current in the wires, and the same magnetic
// field round a loop whichever surface you pick. SI units. No DOM.
import { EPS0, MU0, n3 } from './em-p34.ts';
import { pick, type Question } from './elec-quiz.ts';

export function circuit(V: number, R: number, a: number, d: number) {
  const A = Math.PI * a * a, C = (EPS0 * A) / d;
  return { A, C, tau: R * C, I0: V / R, Q: C * V };
}
/** State at time t (s): current, charge, field between the plates, its rate of change and the displacement current. */
export function at(V: number, R: number, a: number, d: number, t: number) {
  const c = circuit(V, R, a, d), e = Math.exp(-t / c.tau);
  const I = c.I0 * e, q = c.Q * (1 - e), E = q / (EPS0 * c.A), dEdt = I / (EPS0 * c.A);
  return { ...c, I, q, E, dEdt, Id: EPS0 * c.A * dEdt, V: q / c.C };
}
/** Magnetic field (T) on a circle of radius r round the axis: in the gap (displacement current spread over the
 *  plate area) or round the wire. */
export function bField(I: number, r: number, a: number, inGap: boolean) {
  if (inGap && r < a) return (MU0 * I * r) / (2 * Math.PI * a * a);
  return (MU0 * I) / (2 * Math.PI * r);
}

export function questions(rng: () => number = Math.random): Question[] {
  const a = pick(rng, [5, 10, 20]), d = pick(rng, [1, 2, 5]), C = (EPS0 * Math.PI * (a / 100) ** 2) / (d / 1000);
  const Cp = pick(rng, [100, 200, 500]), rate = pick(rng, [1, 5, 10]) * 1e3, Id = Cp * 1e-12 * rate;
  const I = pick(rng, [1, 2, 5]), r = pick(rng, [5, 10, 20]), B = (MU0 * I) / (2 * Math.PI * (r / 100));
  const R = pick(rng, [1, 2, 5]), C2 = pick(rng, [10, 47, 100]), tau = R * 1e6 * C2 * 1e-9;
  return [
    { text: `What is the capacitance of round plates of radius ${a} cm, ${d} mm apart in air, in farads?`, answer: C, unit: 'F', tol: 0.02,
      steps: ['C = ε₀ A / d with A = πa²', `C = 8.85 × 10⁻¹² × π × ${a / 100}² / ${d / 1000} = ${n3(C)} F`] },
    { text: `The voltage across a ${Cp} pF capacitor rises at ${rate} V/s. What is the displacement current between its plates, in amperes?`, answer: Id, unit: 'A', tol: 0.02,
      steps: ['I_d = ε₀ dΦ_E/dt = C dV/dt (the same as the current in the wires)', `I_d = ${Cp} × 10⁻¹² × ${rate} = ${n3(Id)} A`] },
    { text: `A total current (conduction or displacement) of ${I} A passes through a loop of radius ${r} cm. What is the magnetic field on the loop, in tesla?`, answer: B, unit: 'T', tol: 0.02,
      steps: ['Ampère–Maxwell: B × 2πr = µ₀ (I + I_d)', `B = µ₀ I / (2πr) = 1.26 × 10⁻⁶ × ${I} / (2π × ${r / 100}) = ${n3(B)} T`] },
    { text: `A ${C2} nF capacitor charges through ${R} MΩ. What is the time constant, in seconds?`, answer: tau, unit: 's', tol: 0.02,
      steps: ['τ = R C', `τ = ${R} × 10⁶ × ${C2} × 10⁻⁹ = ${n3(tau)} s`] },
  ];
}
