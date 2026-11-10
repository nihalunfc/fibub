// RMS of common waveforms (school level): the value of a waveform at any moment, its mean, mean of the magnitude
// and root-mean-square found by adding up many thin slices, with the exact factors to compare. No DOM.
import { pick, type Question } from './elec-quiz.ts';
import { n3 } from './em-p34.ts';

export type Wave = 'sine' | 'square' | 'triangle' | 'saw' | 'half' | 'full';

/** Value at phase u (0 to 1 of a cycle) for a waveform with peak 1. */
export function shape(w: Wave, u: number) {
  u = ((u % 1) + 1) % 1;
  switch (w) {
    case 'sine': return Math.sin(2 * Math.PI * u);
    case 'square': return u < 0.5 ? 1 : -1;
    case 'triangle': return u < 0.25 ? 4 * u : u < 0.75 ? 2 - 4 * u : 4 * u - 4;
    case 'saw': return 2 * u - 1;
    case 'half': return u < 0.5 ? Math.sin(2 * Math.PI * u) : 0;
    case 'full': return Math.abs(Math.sin(2 * Math.PI * u));
  }
}
/** Exact factors for peak 1: rms, mean and mean of |v|. */
export const EXACT: Record<Wave, { rms: number; mean: number; absMean: number }> = {
  sine: { rms: Math.SQRT1_2, mean: 0, absMean: 2 / Math.PI },
  square: { rms: 1, mean: 0, absMean: 1 },
  triangle: { rms: 1 / Math.sqrt(3), mean: 0, absMean: 0.5 },
  saw: { rms: 1 / Math.sqrt(3), mean: 0, absMean: 0.5 },
  half: { rms: 0.5, mean: 1 / Math.PI, absMean: 1 / Math.PI },
  full: { rms: Math.SQRT1_2, mean: 2 / Math.PI, absMean: 2 / Math.PI },
};
/** Mean, mean of |v|, mean of v² and rms over one cycle, by the midpoint rule with n slices. */
export function measure(w: Wave, peak: number, n = 2000) {
  let s = 0, a = 0, s2 = 0;
  for (let k = 0; k < n; k++) { const v = peak * shape(w, (k + 0.5) / n); s += v; a += Math.abs(v); s2 += v * v; }
  return { mean: s / n, absMean: a / n, meanSq: s2 / n, rms: Math.sqrt(s2 / n) };
}

export function questions(rng: () => number = Math.random): Question[] {
  const Vr = pick(rng, [110, 120, 230, 240]), Vp = Vr * Math.SQRT2;
  const P = pick(rng, [10, 50, 100, 325]), Vr2 = P / Math.SQRT2;
  const Ip = pick(rng, [1, 2, 3]), R = pick(rng, [10, 20, 50]), Pw = (Ip * Ip * R) / 2;
  const Vs = pick(rng, [5, 12, 20]);
  return [
    { text: `A mains supply is ${Vr} V rms (a sine wave). What is its peak voltage, in volts?`, answer: Vp, unit: 'V', tol: 0.01,
      steps: ['For a sine wave, V₀ = √2 × V_rms', `V₀ = 1.414 × ${Vr} = ${n3(Vp)} V`] },
    { text: `A sine-wave voltage peaks at ${P} V. What is its rms value, in volts?`, answer: Vr2, unit: 'V', tol: 0.01,
      steps: ['V_rms = V₀ / √2', `V_rms = ${P} / 1.414 = ${n3(Vr2)} V`] },
    { text: `A sine-wave current of peak ${Ip} A flows through a ${R} Ω resistor. What is the average power, in watts?`, answer: Pw, unit: 'W', tol: 0.02,
      steps: ['P = I_rms² R, with I_rms = I₀ / √2, so P = I₀² R / 2', `P = ${Ip}² × ${R} / 2 = ${n3(Pw)} W`] },
    { text: `A square wave switches between +${Vs} V and −${Vs} V. What is its rms value, in volts?`, answer: Vs, unit: 'V', tol: 0.01,
      steps: ['v² is always ' + `${Vs}² = ${Vs * Vs}, so the mean of v² is ${Vs * Vs}`, `V_rms = √${Vs * Vs} = ${n3(Vs)} V: the same as the peak`] },
  ];
}
