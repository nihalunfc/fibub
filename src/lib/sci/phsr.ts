// Special relativity in one space dimension with c = 1: Lorentz boosts, intervals, simultaneity and the twin paradox.
// Plain maths, no DOM. Times and distances in matching units (years and light-years, or seconds and light-seconds).

export const gamma = (b: number) => 1 / Math.sqrt(1 - b * b);
export const rapidity = (b: number) => Math.atanh(b);
/** Coordinates (t′, x′) in a frame moving at velocity β along +x (both frames share the origin event). */
export function boost(t: number, x: number, b: number): [number, number] {
  const g = gamma(b);
  return [g * (t - b * x), g * (x - b * t)];
}
/** Spacetime interval s² = Δt² − Δx² (positive: timelike). */
export const interval = (dt: number, dx: number) => dt * dt - dx * dx;
export function classify(dt: number, dx: number, tol = 1e-12): 'timelike' | 'spacelike' | 'lightlike' {
  const s = interval(dt, dx), sc = Math.max(dt * dt, dx * dx, 1e-300);
  return Math.abs(s) <= tol * sc ? 'lightlike' : s > 0 ? 'timelike' : 'spacelike';
}
/** Relativistic velocity addition: u seen from a frame moving at β. */
export const velIn = (u: number, b: number) => (u - b) / (1 - u * b);
/** The β of a frame in which two spacelike-separated events are simultaneous (|β| < 1), or NaN if timelike/lightlike. */
export const simultaneousFrame = (dt: number, dx: number) => (Math.abs(dt) < Math.abs(dx) ? dt / dx : NaN);
/** The β of a frame in which two timelike-separated events happen at the same place, or NaN otherwise. */
export const samePlaceFrame = (dt: number, dx: number) => (Math.abs(dx) < Math.abs(dt) ? dx / dt : NaN);
/** Relativistic Doppler factor for a source receding at β: received period ÷ emitted period. */
export const dopplerK = (b: number) => Math.sqrt((1 + b) / (1 - b));

export type Twin = { g: number; earth: number; traveller: number; turn: [number, number]; jump: number; tOut: number; tIn: number; kOut: number; signalsOut: number; signalsIn: number };
/**
 * Twin paradox: the traveller leaves Earth at β, turns round at distance D and comes back at β. Earth's time and
 * the traveller's proper time, the turnaround event, the jump in "Earth time now" seen by the traveller when changing
 * frames (2βD), and how many of Earth's yearly (unit-period) signals the traveller receives on each leg.
 */
export function twin(b: number, D: number): Twin {
  const g = gamma(b), Tt = D / b, earth = 2 * Tt, traveller = earth / g;
  // Earth event simultaneous with the turnaround in the outbound / inbound frames.
  const tOut = Tt - b * D, tIn = Tt + b * D;
  // Earth sends one signal per unit time. A signal sent at t = n catches the outbound traveller at t = n/(1 − β), so
  // those sent before Tt(1 − β) = Tt − D arrive on the way out, the rest on the way back.
  const k = dopplerK(b), signalsOut = Tt - D, signalsIn = earth - signalsOut;
  return { g, earth, traveller, turn: [Tt, D], jump: tIn - tOut, tOut, tIn, kOut: k, signalsOut, signalsIn };
}
