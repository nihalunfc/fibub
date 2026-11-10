// The resonance tube practical for the school resonance-tube tool: an air column closed by water, a tuning fork
// over its open end, resonance when L + e = (2n − 1)λ/4, the loudness near each resonance, and the speed of
// sound and end correction from the first two resonance lengths. Plain TypeScript, no DOM.
import { type Question, pick, one, n } from './h4quiz.ts';

/** Speed of sound in dry air at T °C (m/s): 331.3 √(1 + T/273.15). */
export const soundSpeed = (T: number) => 331.3 * Math.sqrt(1 + T / 273.15);
/** End correction for a tube of inside diameter D: about 0.3 D (0.6 × the radius). */
export const endCorrection = (D: number) => 0.3 * D;
export const FORKS = [256, 288, 320, 384, 426.7, 480, 512];

/** Lengths of air column (m) that resonate, below maxL. */
export function resonances(f: number, T: number, D: number, maxL = 1) {
  const lam = soundSpeed(T) / f, e = endCorrection(D), out: number[] = [];
  for (let k = 1; k < 50; k++) { const L = ((2 * k - 1) * lam) / 4 - e; if (L > maxL) break; if (L > 0) out.push(L); }
  return { lam, e, lengths: out };
}
/** Loudness (0..1) heard with an air column of length L: a resonance curve with a little damping. */
export function loudness(f: number, T: number, D: number, L: number, damping = 0.06) {
  const lam = soundSpeed(T) / f, c = Math.cos((2 * Math.PI * (L + endCorrection(D))) / lam);
  return damping / Math.sqrt(c * c + damping * damping);
}
/** Speed of sound and end correction from the first two resonance lengths. */
export function fromLengths(f: number, L1: number, L2: number) {
  return { v: 2 * f * (L2 - L1), e: (L2 - 3 * L1) / 2, lam: 2 * (L2 - L1) };
}

// ---- Check yourself ---------------------------------------------------------------------------------
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const f = one(rng, [256, 288, 320, 384, 512]), L1 = pick(rng, 15, 32), lam = 2 * pick(rng, 40, 70), L2 = L1 + lam / 2;
    qs.push({ text: `With a ${f} Hz fork the first resonance is at ${L1} cm and the second at ${L2} cm. What is the speed of sound, in m/s?`, ans: (2 * f * (L2 - L1)) / 100, unit: 'm/s', work: `L₂ − L₁ = λ/2, so λ = 2 × (${L2} − ${L1}) = ${2 * (L2 - L1)} cm and v = f λ = ${f} × ${n((2 * (L2 - L1)) / 100, 2)} = ${n((2 * f * (L2 - L1)) / 100, 1)} m/s.`, tol: 0.5 }); }
  { const f = one(rng, [256, 320, 384, 512]), v = pick(rng, 34, 35) * 10, L = (v / f / 4) * 100;
    qs.push({ text: `Ignoring the end correction, how long (in cm) is the first resonating air column for a ${f} Hz fork if sound travels at ${v} m/s?`, ans: L, unit: 'cm', work: `First resonance: L = λ/4 = v ÷ (4f) = ${v} ÷ ${4 * f} = ${n(L / 100, 4)} m = ${n(L, 2)} cm.`, tol: 0.05 }); }
  { const L1 = pick(rng, 150, 320) / 10, e = pick(rng, 5, 15) / 10, L2 = 3 * L1 + 2 * e;
    qs.push({ text: `The first two resonance lengths are ${n(L1, 1)} cm and ${n(L2, 1)} cm. What is the end correction, in cm?`, ans: e, unit: 'cm', work: `L₁ + e = λ/4 and L₂ + e = 3λ/4, so L₂ + e = 3(L₁ + e) and e = (L₂ − 3L₁) ÷ 2 = (${n(L2, 1)} − ${n(3 * L1, 1)}) ÷ 2 = ${n(e, 2)} cm.`, tol: 0.02 }); }
  { const T = pick(rng, 0, 40), v = soundSpeed(T);
    qs.push({ text: `Sound travels at 331.3 m/s in air at 0 °C, and v ∝ √(absolute temperature). How fast does it travel at ${T} °C, in m/s?`, ans: v, unit: 'm/s', work: `v = 331.3 × √(${n(273.15 + T, 2)} ÷ 273.15) = ${n(v, 1)} m/s (about 0.6 m/s more for each °C).`, tol: 0.2 }); }
  return qs;
}
