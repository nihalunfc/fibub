// Series LCR circuit on AC (school level): reactances, impedance, current, phase, power factor, resonance and
// Q factor, and the phasors at any moment. Plain maths, no DOM. SI units, voltages and currents as rms values.
import { pick, r3, type Question } from './elec-quiz.ts';

export function lcr(R: number, L: number, C: number, f: number, V: number) {
  const w = 2 * Math.PI * f;
  const XL = w * L, XC = 1 / (w * C), X = XL - XC;
  const Z = Math.hypot(R, X), I = V / Z, phi = Math.atan2(X, R); // φ > 0: voltage leads the current
  const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C)), Q = Math.sqrt(L / C) / R;
  return { w, XL, XC, X, Z, I, phi, pf: Math.cos(phi), P: V * I * Math.cos(phi), VR: I * R, VL: I * XL, VC: I * XC, f0, Q, bw: f0 / Q, Imax: V / R };
}

/** rms current against frequency for the resonance curve. */
export const currentAt = (R: number, L: number, C: number, V: number, f: number) => lcr(R, L, C, f, V).I;

/** Frequencies where the current falls to 1/√2 of its peak (exact for a series LCR circuit). */
export function halfPower(R: number, L: number, C: number) {
  const a = R / (2 * L), w0 = 1 / Math.sqrt(L * C), s = Math.sqrt(a * a + w0 * w0);
  return [(s - a) / (2 * Math.PI), (s + a) / (2 * Math.PI)];
}

export function questions(rng: () => number = Math.random): Question[] {
  const f = pick(rng, [50, 60, 100, 200, 500]), LmH = pick(rng, [10, 20, 50, 100, 200]), CuF = pick(rng, [2, 5, 10, 20, 50]);
  const XL = 2 * Math.PI * f * LmH / 1000, XC = 1 / (2 * Math.PI * f * CuF * 1e-6);
  const R = pick(rng, [3, 6, 8, 12, 30, 40]), Xn = pick(rng, [4, 8, 6, 16, 40, 30]), Z = Math.hypot(R, Xn);
  const L2 = pick(rng, [0.1, 0.2, 0.5, 1]), C2 = pick(rng, [1, 2, 5, 10]), f0 = 1 / (2 * Math.PI * Math.sqrt(L2 * C2 * 1e-6));
  return [
    { text: `What is the reactance of a ${LmH} mH inductor at ${f} Hz, in ohms?`, answer: XL, unit: 'Ω', tol: 0.02,
      steps: ['X_L = 2π f L', `X_L = 2π × ${f} × ${LmH / 1000} = ${r3(XL)} Ω`] },
    { text: `What is the reactance of a ${CuF} µF capacitor at ${f} Hz, in ohms?`, answer: XC, unit: 'Ω', tol: 0.02,
      steps: ['X_C = 1 / (2π f C)', `X_C = 1 / (2π × ${f} × ${CuF} × 10⁻⁶) = ${r3(XC)} Ω`] },
    { text: `A series circuit has R = ${R} Ω and a net reactance X_L − X_C = ${Xn} Ω. What is its impedance, in ohms?`, answer: Z, unit: 'Ω', tol: 0.02,
      steps: ['Z = √(R² + (X_L − X_C)²)', `Z = √(${R}² + ${Xn}²) = ${r3(Z)} Ω`] },
    { text: `At what frequency does a ${L2} H inductor and a ${C2} µF capacitor in series resonate, in hertz?`, answer: f0, unit: 'Hz', tol: 0.02,
      steps: ['f₀ = 1 / (2π √(L C))', `f₀ = 1 / (2π √(${L2} × ${C2} × 10⁻⁶)) = ${r3(f0)} Hz`] },
  ];
}
