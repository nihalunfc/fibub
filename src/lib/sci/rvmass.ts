// Exoplanet mass from a radial velocity semi-amplitude, and the reverse; radius and density from a transit depth.

export const G = 6.6743e-11, M_SUN = 1.98840987e30, M_JUP = 1.89812e27, M_EARTH = 5.97217e24, R_JUP = 7.1492e7, R_EARTH = 6.3781e6, R_SUN = 6.957e8, AU = 1.495978707e11, DAY = 86400;

/** Velocity semi-amplitude K (m/s) of a star of M* (solar masses) with a planet of mass m (kg) at inclination i, period P (days), eccentricity e. */
export function semiAmplitude(m: number, Ms: number, Pd: number, e = 0, incDeg = 90) {
  const P = Pd * DAY, M = Ms * M_SUN;
  return Math.cbrt((2 * Math.PI * G) / P) * (m * Math.sin((incDeg * Math.PI) / 180)) / Math.cbrt((M + m) ** 2) / Math.sqrt(1 - e * e);
}

/** Minimum mass m sin i (kg) from K (m/s): solves the mass function exactly, including the planet's own mass. */
export function minMass(K: number, Ms: number, Pd: number, e = 0) {
  if (!(K > 0) || !(Ms > 0) || !(Pd > 0)) throw new Error('K, the star mass and the period must be above zero');
  if (!(e >= 0 && e < 1)) throw new Error('Eccentricity runs from 0 to just below 1');
  const P = Pd * DAY, M = Ms * M_SUN;
  // f = (m sin i)³ / (M + m)² = P K³ (1 − e²)^1.5 / (2πG). Iterate m = cbrt(f (M + m)²) with sin i = 1.
  const f = (P * K ** 3 * (1 - e * e) ** 1.5) / (2 * Math.PI * G);
  let m = Math.cbrt(f * M * M);
  for (let i = 0; i < 60; i++) { const n = Math.cbrt(f * (M + m) ** 2); if (Math.abs(n - m) < 1e-12 * n) { m = n; break; } m = n; }
  return { m, massFunction: f };
}

/** Semi-major axis of the planet's orbit (m) from Kepler's third law. */
export const semiMajor = (Ms: number, m: number, Pd: number) => Math.cbrt((G * (Ms * M_SUN + m) * (Pd * DAY) ** 2) / (4 * Math.PI ** 2));

/** Planet radius (m) from a transit depth (fraction) and star radius (solar radii), ignoring limb darkening. */
export const radiusFromDepth = (depth: number, Rs: number) => Math.sqrt(depth) * Rs * R_SUN;
/** Bulk density (kg/m³). */
export const density = (m: number, r: number) => m / ((4 / 3) * Math.PI * r ** 3);
/** Surface gravity (m/s²). */
export const gravity = (m: number, r: number) => (G * m) / (r * r);
