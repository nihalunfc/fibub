// Sound as a longitudinal wave, for the school tool sound-wave-visualiser: speed of sound in air from
// v = √(γRT/M), wavelength and period, the displacement and pressure waves, intensity and sound level,
// echoes and SONAR depth. Plain maths, no DOM.
export const R_GAS = 8.314462618; // J/(mol K), CODATA 2018 (exact)
export const M_AIR = 0.0289647; // kg/mol, dry air
export const GAMMA_AIR = 1.4;
export const P_ATM = 101325; // Pa
export const I0 = 1e-12; // W/m², threshold of hearing used for decibels

/** Speed of sound in dry air at a temperature in °C: v = √(γRT/M). */
export const airSpeed = (tC: number) => Math.sqrt((GAMMA_AIR * R_GAS * (tC + 273.15)) / M_AIR);
/** Density of dry air at 1 atm and a temperature in °C (ideal gas). */
export const airDensity = (tC: number) => (P_ATM * M_AIR) / (R_GAS * (tC + 273.15));
export const wavelength = (v: number, f: number) => v / f;
export const period = (f: number) => 1 / f;
/** Particle displacement s(x, t) = s0 sin(kx − ωt). */
export const displacement = (x: number, t: number, s0: number, lambda: number, f: number) => s0 * Math.sin((2 * Math.PI * x) / lambda - 2 * Math.PI * f * t);
/** Excess pressure Δp = −B ∂s/∂x, as a fraction of its amplitude: −cos(kx − ωt). Peaks are compressions. */
export const pressureShape = (x: number, t: number, lambda: number, f: number) => -Math.cos((2 * Math.PI * x) / lambda - 2 * Math.PI * f * t);
/** Pressure amplitude Δp0 = ρ v ω s0 (Pa) for displacement amplitude s0 (m). */
export const pressureAmp = (rho: number, v: number, f: number, s0: number) => rho * v * 2 * Math.PI * f * s0;
/** Intensity I = Δp0² / (2ρv) in W/m². */
export const intensity = (dp0: number, rho: number, v: number) => (dp0 * dp0) / (2 * rho * v);
/** Sound level in decibels, 10 log10(I / 10⁻¹² W/m²). */
export const decibels = (I: number) => 10 * Math.log10(I / I0);
/** Echo: time for sound to reach a wall at distance d and come back. */
export const echoTime = (v: number, d: number) => (2 * d) / v;
/** Echo or SONAR: distance from the time of the round trip, d = v t / 2. */
export const echoDistance = (v: number, t: number) => (v * t) / 2;
/** Shortest distance to a wall for a separate echo, when the ear keeps a sound for `keep` seconds (about 0.1 s). */
export const minEchoDistance = (v: number, keep = 0.1) => (v * keep) / 2;
