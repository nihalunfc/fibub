// Sums for the astronomy course, Modules 7-8 (light, gravity and the Solar System). Plain TypeScript, no DOM,
// checked by tests/astrocourse.mjs. SI units unless a name says otherwise. Constants: CODATA 2018 and IAU 2015
// nominal values (exact where defined).
export const C = 299792458;            // speed of light, m/s
export const H = 6.62607015e-34;       // Planck constant, J s
export const KB = 1.380649e-23;        // Boltzmann constant, J/K
export const SIGMA = 5.670374419e-8;   // Stefan-Boltzmann constant, W m⁻² K⁻⁴
export const WIEN = 2.897771955e-3;    // Wien displacement constant, m K
export const G = 6.6743e-11;           // gravitational constant, m³ kg⁻¹ s⁻²
export const AU = 1.495978707e11;      // astronomical unit, m
export const PC = 3.0856775814913673e16; // parsec, m
export const LY = 9.4607304725808e15;  // light-year, m
export const RSUN = 6.957e8, LSUN = 3.828e26, MSUN = 1.98841e30, TSUN = 5772; // IAU 2015 nominal Sun
export const GM_SUN = 1.3271244e20, GM_EARTH = 3.986004e14, R_EARTH = 6.3781e6;
export const RYDBERG = 1.0973731568e7;  // m⁻¹ (infinite nuclear mass)
export const R_H = RYDBERG / (1 + 9.1093837e-31 / 1.67262192e-27); // hydrogen, reduced mass

/** Planck spectral radiance B_λ(T) in W m⁻² sr⁻¹ m⁻¹. */
export const planck = (lambda: number, T: number) => (2 * H * C * C) / lambda ** 5 / Math.expm1((H * C) / (lambda * KB * T));
/** Wavelength of peak emission (m). */
export const wienPeak = (T: number) => WIEN / T;
/** Luminosity (W) of a sphere of radius R (m) at temperature T (K). */
export const luminosity = (R: number, T: number) => 4 * Math.PI * R * R * SIGMA * T ** 4;
/** Radius from luminosity and temperature. */
export const radiusFrom = (L: number, T: number) => Math.sqrt(L / (4 * Math.PI * SIGMA * T ** 4));
/** Rough sRGB colour of a blackbody (Tanner Helland's widely used fit, 1000-40000 K), as [r, g, b] 0-255. */
export function bbColour(T: number): [number, number, number] {
  const t = Math.max(1000, Math.min(40000, T)) / 100, cl = (v: number) => Math.max(0, Math.min(255, v));
  const r = t <= 66 ? 255 : cl(329.698727446 * (t - 60) ** -0.1332047592);
  const g = t <= 66 ? cl(99.4708025861 * Math.log(t) - 161.1195681661) : cl(288.1221695283 * (t - 60) ** -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : cl(138.5177312231 * Math.log(t - 10) - 305.0447927307);
  return [Math.round(r), Math.round(g), Math.round(b)];
}
/** Hydrogen line wavelength in vacuum (m) for a jump from level n2 down to n1. */
export const hydrogenLine = (n1: number, n2: number) => 1 / (R_H * (1 / (n1 * n1) - 1 / (n2 * n2)));
/** Hydrogen energy level (eV). */
export const hydrogenLevel = (n: number) => -13.605693 / (n * n);
/** Non-relativistic Doppler: velocity (m/s) from an observed and rest wavelength. Positive = moving away. */
export const dopplerVelocity = (obs: number, rest: number) => (C * (obs - rest)) / rest;
/** Redshift z, and the relativistic radial velocity for it. */
export const redshift = (obs: number, rest: number) => (obs - rest) / rest;
export const relativisticVelocity = (z: number) => C * (((1 + z) ** 2 - 1) / ((1 + z) ** 2 + 1));
/** Observed wavelength for a radial velocity v (relativistic, for pure line-of-sight motion). */
export const shifted = (rest: number, v: number) => rest * Math.sqrt((1 + v / C) / (1 - v / C));
/** Flux (W/m²) at distance d (m) from luminosity L (W). */
export const flux = (L: number, d: number) => L / (4 * Math.PI * d * d);
/** Distance modulus m − M for a distance in parsecs, and back. */
export const distanceModulus = (dpc: number) => 5 * Math.log10(dpc / 10);
export const distanceFromModulus = (mu: number) => 10 ** (mu / 5 + 1);
/** Diffraction resolution (arcsec) of a dish or mirror D (m) at wavelength λ (m). */
export const resolutionArcsec = (lambda: number, D: number) => ((1.22 * lambda) / D) * 206264.806;

// ---- Module 8: gravity and orbits
/** Kepler's third law in Solar System units: period in years for a semi-major axis in AU around mass M (solar masses). */
export const periodYears = (aAU: number, Msun = 1) => Math.sqrt(aAU ** 3 / Msun);
export const semiMajorAU = (Pyr: number, Msun = 1) => Math.cbrt(Msun * Pyr * Pyr);
/** Vis-viva: speed (m/s) at distance r (m) on an orbit with semi-major axis a (m) around GM. */
export const visViva = (GM: number, r: number, a: number) => Math.sqrt(GM * (2 / r - 1 / a));
export const circularSpeed = (GM: number, r: number) => Math.sqrt(GM / r);
export const escapeSpeed = (GM: number, r: number) => Math.sqrt((2 * GM) / r);
/** Solve Kepler's equation M = E − e sin E for the eccentric anomaly E (radians). */
export function keplerE(M: number, e: number) {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 50; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-13) break; }
  return E;
}
/** Position in the orbital plane (units of a) at mean anomaly M: x towards perihelion. Also the true anomaly and r. */
export function orbitPos(M: number, e: number) {
  const E = keplerE(M, e), x = Math.cos(E) - e, y = Math.sqrt(1 - e * e) * Math.sin(E);
  return { x, y, r: Math.hypot(x, y), nu: Math.atan2(y, x), E };
}
/** Rotate an orbital-plane point (x, y) into ecliptic coordinates with inclination i, node Ω and argument of perihelion ω (degrees). */
export function toEclipticXYZ(x: number, y: number, i: number, node: number, peri: number) {
  const d = Math.PI / 180, ci = Math.cos(i * d), si = Math.sin(i * d), cO = Math.cos(node * d), sO = Math.sin(node * d), cw = Math.cos(peri * d), sw = Math.sin(peri * d);
  const X = (cO * cw - sO * sw * ci) * x + (-cO * sw - sO * cw * ci) * y;
  const Y = (sO * cw + cO * sw * ci) * x + (-sO * sw + cO * cw * ci) * y;
  const Z = sw * si * x + cw * si * y;
  return [X, Y, Z] as [number, number, number];
}
/** Hohmann transfer between circular orbits r1 → r2 (m): the two burns (m/s) and the transfer time (s). */
export function hohmann(GM: number, r1: number, r2: number) {
  const a = (r1 + r2) / 2;
  const dv1 = Math.abs(visViva(GM, r1, a) - circularSpeed(GM, r1)), dv2 = Math.abs(circularSpeed(GM, r2) - visViva(GM, r2, a));
  return { dv1, dv2, total: dv1 + dv2, time: Math.PI * Math.sqrt(a ** 3 / GM) };
}
/** Tsiolkovsky rocket equation: Δv from exhaust speed and mass ratio, and the mass ratio for a Δv. */
export const rocketDv = (ve: number, m0: number, mf: number) => ve * Math.log(m0 / mf);
export const massRatio = (dv: number, ve: number) => Math.exp(dv / ve);
/** Mean density (kg/m³) of a sphere. */
export const density = (M: number, R: number) => M / ((4 / 3) * Math.PI * R ** 3);
/** Equilibrium temperature (K) of a planet at distance d (AU) with albedo A around a star of L (solar) — fast rotator. */
export const eqTemp = (dAU: number, A = 0.3, Lsun = 1) => TSUN * Math.sqrt(RSUN / (2 * dAU * AU)) * (1 - A) ** 0.25 * Lsun ** 0.25;

// ---- Module 9: stars ----
/** Distance in parsecs from a parallax in arcseconds. */
export const parallaxDistance = (pArcsec: number) => 1 / pArcsec;
/** Rough main-sequence mass-luminosity relation, L/L☉ from M/M☉ (piecewise power law). */
export const massLuminosity = (m: number) => (m < 0.43 ? 0.23 * m ** 2.3 : m < 2 ? m ** 4 : m < 55 ? 1.4 * m ** 3.5 : 32000 * m);
/** Rough main-sequence lifetime in years: fuel ∝ M, burn rate ∝ L, scaled to 10 billion years for the Sun. */
export const msLifetime = (m: number) => 1e10 * m / massLuminosity(m);
/** Schwarzschild radius (m) for a mass in kg. */
export const schwarzschild = (M: number) => (2 * G * M) / (C * C);
/** Approximate Cepheid period-luminosity relation (V band), absolute magnitude from the period in days. */
export const cepheidMv = (Pdays: number) => -2.43 * (Math.log10(Pdays) - 1) - 4.05;
/** Two-body orbit: total mass in solar masses from a (AU) and P (years). */
export const binaryMass = (aAU: number, Pyr: number) => aAU ** 3 / (Pyr * Pyr);
/** Main-sequence surface temperature (K) and radius (R☉) from mass, rough fits for figures. */
export const msTemp = (m: number) => TSUN * m ** (m < 1 ? 0.6 : 0.55);
