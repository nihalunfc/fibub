// Gravitational-wave chirp of a compact binary inspiral at leading (Newtonian quadrupole) order. Plain maths, no DOM.
// Masses in solar masses, frequencies are gravitational-wave frequencies (twice the orbital frequency) in Hz.

/** GM☉/c³ (s) and GM☉/c² (m), IAU nominal solar mass parameter (rounded); one megaparsec in metres. */
export const TSUN = 4.925491e-6, LSUN = 1476.625, MPC = 3.0856775814913673e22;

export const chirpMass = (m1: number, m2: number) => Math.pow(m1 * m2, 0.6) / Math.pow(m1 + m2, 0.2);
export const eta = (m1: number, m2: number) => (m1 * m2) / ((m1 + m2) * (m1 + m2));

/** Time to coalescence (s) from GW frequency f for chirp mass Mc (detector frame): τ = (5/256)(πf)^(−8/3)(GMc/c³)^(−5/3). */
export const tau = (f: number, Mc: number) => (5 / 256) * Math.pow(Math.PI * f, -8 / 3) * Math.pow(Mc * TSUN, -5 / 3);
/** GW frequency (Hz) a time τ (s) before coalescence. */
export const freqAt = (t: number, Mc: number) => (1 / Math.PI) * Math.pow(5 / (256 * t), 3 / 8) * Math.pow(Mc * TSUN, -5 / 8);
/** Chirp rate df/dt (Hz/s). */
export const fdot = (f: number, Mc: number) => (96 / 5) * Math.pow(Math.PI, 8 / 3) * Math.pow(Mc * TSUN, 5 / 3) * Math.pow(f, 11 / 3);
/** Number of GW cycles between f1 and f2. */
export const cycles = (f1: number, f2: number, Mc: number) => (Math.pow(Mc * TSUN, -5 / 3) / (32 * Math.pow(Math.PI, 8 / 3))) * (Math.pow(f1, -5 / 3) - Math.pow(f2, -5 / 3));
/** GW phase (radians) at time τ before coalescence, relative to the phase at coalescence: Φ = −2 (τ/(5GMc/c³))^(5/8). */
export const phaseAt = (t: number, Mc: number) => -2 * Math.pow(t / (5 * Mc * TSUN), 5 / 8);
/**
 * Strain amplitude of a face-on (optimally oriented and placed) binary at luminosity distance d (Mpc):
 * h = (4/d)(GMc/c²)^(5/3)(πf/c)^(2/3). Averaging over sky position and orientation lowers it by about 2.5.
 */
export const strain = (f: number, Mc: number, dMpc: number) => (4 / (dMpc * MPC)) * Math.pow(Mc * LSUN, 5 / 3) * Math.pow((Math.PI * f) / 299792458, 2 / 3);
/** Characteristic strain h_c = h √(2f²/ḟ) (the amplitude built up over the cycles spent near f). */
export const hChar = (f: number, Mc: number, dMpc: number) => strain(f, Mc, dMpc) * Math.sqrt((2 * f * f) / fdot(f, Mc));
/** GW frequency at the innermost stable circular orbit of the total mass M: c³/(6^(3/2) π G M). */
export const fIsco = (M: number) => 1 / (Math.pow(6, 1.5) * Math.PI * M * TSUN);
/** Orbital separation (m) at GW frequency f for total mass M (Kepler, orbital frequency f/2). */
export const separation = (f: number, M: number) => Math.cbrt((M * LSUN * 299792458 * 299792458) / Math.pow(Math.PI * f, 2));
/** Orbital speed parameter v/c = (πGMf/c³)^(1/3). */
export const vOverC = (f: number, M: number) => Math.cbrt(Math.PI * M * TSUN * f);
