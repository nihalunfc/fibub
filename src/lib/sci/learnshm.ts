// Simple harmonic motion as the shadow of uniform circular motion, for the school tool shm-circle:
// x = A cos(ωt + φ), v = −Aω sin(ωt + φ), a = −ω² x; energy; spring-mass and simple pendulum periods.
// Plain maths, no DOM.
export const omegaFromPeriod = (T: number) => (2 * Math.PI) / T;
/** Period of a mass m on a spring of stiffness k: T = 2π √(m/k). */
export const springPeriod = (m: number, k: number) => 2 * Math.PI * Math.sqrt(m / k);
/** Period of a simple pendulum of length L for small swings: T = 2π √(L/g). */
export const pendulumPeriod = (L: number, g: number) => 2 * Math.PI * Math.sqrt(L / g);
/** Position, velocity and acceleration at time t (phase φ in radians). */
export function shmState(A: number, w: number, phi: number, t: number) {
  const th = w * t + phi;
  return { x: A * Math.cos(th), v: -A * w * Math.sin(th), a: -w * w * A * Math.cos(th), angle: th };
}
/** Kinetic, potential and total energy for mass m, angular frequency ω, amplitude A, at displacement x. */
export function shmEnergy(m: number, w: number, A: number, x: number) {
  const k = m * w * w, E = 0.5 * k * A * A, PE = 0.5 * k * x * x;
  return { k, E, PE, KE: E - PE };
}
/** Speed at displacement x: v = ω √(A² − x²). */
export const speedAt = (A: number, w: number, x: number) => w * Math.sqrt(Math.max(0, A * A - x * x));
