// Faraday's law and Lenz's law (school level): a bar magnet (a point magnetic dipole) moving along the axis of a flat
// coil, and an AC generator coil turning in a uniform field. Plain maths, no DOM. SI units.
import { pick, r3, type Question } from './elec-quiz.ts';

export const MU0 = 1.25663706127e-6; // CODATA 2022

/** Flux (Wb) through one turn of radius a from a dipole of moment m (A m²) on the axis, z from the coil's centre:
 *  Φ = μ0 m a² / (2 (a² + z²)^1.5). Positive when the dipole points along +x through the coil. */
export const flux1 = (m: number, a: number, z: number) => (MU0 * m * a * a) / (2 * Math.pow(a * a + z * z, 1.5));
/** dΦ/dz for one turn. */
export const dflux1 = (m: number, a: number, z: number) => (-3 * MU0 * m * a * a * z) / (2 * Math.pow(a * a + z * z, 2.5));
/** emf in an N-turn coil when the magnet sits at z (relative to the coil) and moves at v (m/s): ε = −N dΦ/dz · v. */
export const emf = (N: number, m: number, a: number, z: number, v: number) => -N * dflux1(m, a, z) * v;
/** The largest |dΦ/dz| is at z = ±a/2. Largest |emf| for a move at speed v from z0 to z1 (z = position − coil). */
export function maxEmf(N: number, m: number, a: number, z0: number, z1: number, v: number) {
  const lo = Math.min(z0, z1), hi = Math.max(z0, z1);
  const cand = [lo, hi, a / 2, -a / 2].filter((z) => z >= lo && z <= hi);
  return Math.max(...cand.map((z) => Math.abs(N * dflux1(m, a, z) * v)));
}

/** AC generator: N turns of area A (m²) in field B (T) turning f times a second. Φ = N B A cos ωt, ε = N B A ω sin ωt. */
export function generator(N: number, B: number, A: number, f: number) {
  const w = 2 * Math.PI * f, peak = N * B * A * w;
  return { w, peak, rms: peak / Math.SQRT2, T: 1 / f, flux: (t: number) => N * B * A * Math.cos(w * t), emf: (t: number) => peak * Math.sin(w * t) };
}

export function questions(rng: () => number = Math.random): Question[] {
  const N = pick(rng, [50, 100, 200, 500]), p1 = pick(rng, [2, 4, 5, 8]), p0 = pick(rng, [0, 1]), dt = pick(rng, [0.1, 0.2, 0.25, 0.5]);
  const dPhi = (p1 - p0) * 1e-3, e1 = (N * dPhi) / dt;
  const Ng = pick(rng, [50, 100, 200]), Bg = pick(rng, [0.1, 0.2, 0.5]), Acm = pick(rng, [100, 200, 400]), rpm = pick(rng, [600, 1200, 1500, 3000]);
  const g = generator(Ng, Bg, Acm / 1e4, rpm / 60);
  const pk = pick(rng, [100, 141, 220, 311, 325]);
  return [
    { text: `The flux through each turn of a ${N}-turn coil changes from ${p0} mWb to ${p1} mWb in ${dt} s. What is the average induced emf, in volts?`, answer: e1, unit: 'V', tol: 0.02,
      steps: ['ε = N ΔΦ / Δt', `ε = ${N} × (${p1} − ${p0}) × 10⁻³ Wb / ${dt} s = ${r3(e1)} V`] },
    { text: `A generator coil of ${Ng} turns, each of area ${Acm} cm², turns at ${rpm} revolutions per minute in a ${Bg} T field. What is the peak emf, in volts?`, answer: g.peak, unit: 'V', tol: 0.02,
      steps: [`ω = 2π f = 2π × ${rpm} / 60 = ${r3(g.w)} rad/s`, `ε₀ = N B A ω = ${Ng} × ${Bg} × ${Acm / 1e4} × ${r3(g.w)} = ${r3(g.peak)} V`] },
    { text: `An AC supply has a peak voltage of ${pk} V. What is its rms value, in volts?`, answer: pk / Math.SQRT2, unit: 'V', tol: 0.02,
      steps: ['V_rms = V₀ / √2', `V_rms = ${pk} / 1.414 = ${r3(pk / Math.SQRT2)} V`] },
    { text: `The same generator (${Ng} turns, ${Acm} cm², ${Bg} T) is turned twice as fast. What is the new peak emf, in volts?`, answer: 2 * g.peak, unit: 'V', tol: 0.02,
      steps: ['ε₀ = N B A ω grows in step with ω.', `2 × ${r3(g.peak)} = ${r3(2 * g.peak)} V`] },
  ];
}
