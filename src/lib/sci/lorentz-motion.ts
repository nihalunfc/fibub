// #1408 Charged particle in electric and magnetic fields: circles, helices, crossed fields (velocity selector)
// and the cyclotron, from the exact solutions of m dv/dt = q (E + v × B). No DOM.
import { pick, r3, type Question } from './elec-quiz.ts';

export const E_CHARGE = 1.602176634e-19; // C, exact
/** Masses: CODATA 2022 recommended values (kg). */
export const PARTICLES = {
  proton: { name: 'Proton', m: 1.67262192595e-27, q: 1 },
  electron: { name: 'Electron', m: 9.1093837139e-31, q: -1 },
  alpha: { name: 'Alpha particle', m: 6.644657345e-27, q: 2 },
  deuteron: { name: 'Deuteron', m: 3.3435837768e-27, q: 1 },
} as const;
export type Particle = keyof typeof PARTICLES;
export const MEV = 1e6 * E_CHARGE;

/** Uniform B along x; speed v at angle theta (degrees) to B. Radius, period, frequency and pitch. */
export function helix(p: Particle, v: number, B: number, thetaDeg: number) {
  const { m, q } = PARTICLES[p], Q = Math.abs(q) * E_CHARGE, th = (thetaDeg * Math.PI) / 180;
  const vPerp = v * Math.sin(th), vPar = v * Math.cos(th), T = (2 * Math.PI * m) / (Q * B);
  return { r: (m * vPerp) / (Q * B), T, f: 1 / T, omega: (Q * B) / m, pitch: vPar * T, vPerp, vPar, KE: 0.5 * m * v * v, F: Q * vPerp * B };
}
/** Position at time t on the helix: x along B, (y, z) round it; positive charges turn one way, negative the other. */
export function helixAt(p: Particle, v: number, B: number, thetaDeg: number, t: number) {
  const h = helix(p, v, B, thetaDeg), s = Math.sign(PARTICLES[p].q), w = h.omega * t;
  return [h.vPar * t, h.r * Math.sin(w), -s * h.r * (1 - Math.cos(w))] as const;
}

/** Crossed fields: E along +y (V/m), B along +z (T), particle starting at the origin moving along +x at v0. */
export function crossed(p: Particle, v0: number, E: number, B: number) {
  const { m, q } = PARTICLES[p], Q = q * E_CHARGE, w = (Q * B) / m, vd = E / B, u0 = v0 - vd;
  return {
    vd, omega: w, passes: Math.abs(u0) <= 1e-9 * Math.max(Math.abs(v0), 1),
    /** Exact position at time t. */
    at: (t: number) => [vd * t + (u0 / w) * Math.sin(w * t), (u0 / w) * (Math.cos(w * t) - 1)] as const,
    /** Exact velocity at time t. */
    vel: (t: number) => [vd + u0 * Math.cos(w * t), -u0 * Math.sin(w * t)] as const,
    /** Largest sideways swing |y|. */
    swing: Math.abs((2 * u0) / w),
    FE: Q * E, FB: -Q * v0 * B,
  };
}

/** Cyclotron with dees of radius R (m), field B (T) and gap voltage V (volts). */
export function cyclotron(p: Particle, B: number, R: number, V: number) {
  const { m, q } = PARTICLES[p], Q = Math.abs(q) * E_CHARGE, f = (Q * B) / (2 * Math.PI * m);
  const KEmax = (Q * Q * B * B * R * R) / (2 * m), vmax = (Q * B * R) / m;
  const crossings = Math.ceil(KEmax / (Q * V));
  /** Radius of each half-turn after k gap crossings: r_k = √(2 m k q V) / (q B). */
  const radii = Array.from({ length: Math.min(crossings, 400) }, (_, k) => Math.min(R, Math.sqrt(2 * m * (k + 1) * Q * V) / (Q * B)));
  return { f, KEmax, vmax, turns: crossings / 2, crossings, radii, time: (crossings / 2) / f };
}

export function questions(rng: () => number = Math.random): Question[] {
  const mp = 1.67e-27, e = 1.6e-19;
  const v = pick(rng, [1, 2, 3, 4]), B = pick(rng, [0.1, 0.2, 0.5]);
  const r = (mp * v * 1e6) / (e * B) * 100;
  const B2 = pick(rng, [0.5, 1, 1.5]), T = (2 * Math.PI * mp) / (e * B2) * 1e9;
  const E3 = pick(rng, [2, 3, 5, 8]), B3 = pick(rng, [0.01, 0.02, 0.05]), v3 = (E3 * 1e3) / B3 / 1e3;
  const B4 = pick(rng, [0.5, 1, 1.2]), R4 = pick(rng, [0.3, 0.5, 0.6]);
  const K4 = (e * e * B4 * B4 * R4 * R4) / (2 * mp) / (1e6 * e);
  return [
    { text: `A proton moves at ${v} × 10⁶ m/s at right angles to a ${B} T magnetic field. What is the radius of its circle, in centimetres? (m = 1.67 × 10⁻²⁷ kg, e = 1.6 × 10⁻¹⁹ C)`, answer: r, unit: 'cm', tol: 0.02,
      steps: ['r = m v / (q B)', `r = 1.67 × 10⁻²⁷ × ${v} × 10⁶ / (1.6 × 10⁻¹⁹ × ${B}) m = ${r3(r)} cm`] },
    { text: `How long does a proton take to go once round its circle in a ${B2} T field, in nanoseconds?`, answer: T, unit: 'ns', tol: 0.02,
      steps: ['T = 2π m / (q B): it does not depend on the speed.', `T = 2π × 1.67 × 10⁻²⁷ / (1.6 × 10⁻¹⁹ × ${B2}) s = ${r3(T)} ns`] },
    { text: `A velocity selector has an electric field of ${E3} kV/m and a magnetic field of ${B3} T at right angles. At what speed do particles go straight through, in km/s?`, answer: v3, unit: 'km/s', tol: 0.02,
      steps: ['Straight through when q E = q v B, so v = E / B (the same for any charge or mass).', `v = ${E3 * 1000} / ${B3} m/s = ${r3(v3)} km/s`] },
    { text: `A cyclotron has dees of radius ${R4} m in a ${B4} T field. What is the largest kinetic energy it can give a proton, in MeV?`, answer: K4, unit: 'MeV', tol: 0.02,
      steps: ['At the edge r = R, so v = q B R / m and K = q² B² R² / (2 m).', `K = (1.6 × 10⁻¹⁹)² × ${B4}² × ${R4}² / (2 × 1.67 × 10⁻²⁷) J = ${r3(K4)} MeV`] },
  ];
}
