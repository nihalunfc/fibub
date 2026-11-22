// Physics for the Cosmology A to Z course: constants and the sums behind every figure and live problem.
// Plain ES module with no DOM, so tests/cosmo.mjs can check it against textbook values in Node.
// Units are SI unless the name says otherwise. Constants: CODATA 2018 and IAU 2012/2015 nominal values.

export const C = 299792458;              // speed of light, m/s
export const G = 6.67430e-11;            // gravitational constant, m³ kg⁻¹ s⁻²
export const H_PLANCK = 6.62607015e-34;  // Planck constant, J s
export const K_B = 1.380649e-23;         // Boltzmann constant, J/K
export const SIGMA_SB = 5.670374419e-8;  // Stefan-Boltzmann constant, W m⁻² K⁻⁴
export const WIEN_B = 2.897771955e-3;    // Wien displacement constant, m K
export const EV = 1.602176634e-19;       // one electronvolt, J
export const M_P = 1.67262192e-27;       // proton mass, kg
export const M_E = 9.1093837e-31;        // electron mass, kg
export const R_H = 1.0967758e7;          // Rydberg constant for hydrogen (reduced mass), 1/m
export const AU = 1.495978707e11;        // astronomical unit, m
export const YEAR = 365.25 * 86400;      // Julian year, s
export const LY = C * YEAR;              // light-year, m
export const PC = AU * 648000 / Math.PI; // parsec, m (1 AU at 1 arcsecond)
export const MPC = 1e6 * PC;
export const GYR = 1e9 * YEAR;
export const M_SUN = 1.98841e30;         // kg
export const L_SUN = 3.828e26;           // nominal solar luminosity, W
export const R_SUN = 6.957e8;            // nominal solar radius, m
export const M_EARTH = 5.9722e24;        // kg
export const R_EARTH = 6.371e6;          // mean radius, m
export const T_CMB = 2.7255;             // CMB temperature today, K (Fixsen 2009)
export const ARCSEC = Math.PI / 648000;  // radians in one arcsecond
export const DEG = Math.PI / 180;

// ---------- Light ----------
/** Frequency (Hz) of light with wavelength lam (m). */
export const freq = (lam) => C / lam;
/** Photon energy in eV for wavelength lam (m). */
export const photonEv = (lam) => (H_PLANCK * C) / lam / EV;
/** Wavelength (m) of the hydrogen line for a jump from n2 down to n1 (Rydberg formula). */
export const hydrogenLine = (n1, n2) => 1 / (R_H * (1 / (n1 * n1) - 1 / (n2 * n2)));
/** Planck spectral radiance B(λ, T), W sr⁻¹ m⁻³. */
export function planck(lam, T) {
  const x = (H_PLANCK * C) / (lam * K_B * T);
  return (2 * H_PLANCK * C * C) / Math.pow(lam, 5) / (Math.expm1(x));
}
/** Wien's law: wavelength (m) where a blackbody at T (K) shines most. */
export const wienPeak = (T) => WIEN_B / T;
/** Power per square metre from a blackbody surface at T (K). */
export const stefan = (T) => SIGMA_SB * T ** 4;
/** Luminosity (W) of a sphere of radius R (m) at temperature T (K). */
export const luminosity = (R, T) => 4 * Math.PI * R * R * stefan(T);
/** Flux (W/m²) received at distance d (m) from luminosity L (W). */
export const flux = (L, d) => L / (4 * Math.PI * d * d);
/** Distance (m) from luminosity and flux. */
export const distFromFlux = (L, F) => Math.sqrt(L / (4 * Math.PI * F));
/** Distance modulus m − M for a distance in parsecs. */
export const distanceModulus = (dPc) => 5 * Math.log10(dPc) - 5;
/** Distance in parsecs from m − M. */
export const distFromModulus = (mu) => Math.pow(10, mu / 5 + 1);
/** Redshift from observed and emitted wavelength. */
export const redshift = (obs, emit) => obs / emit - 1;
/** Low-speed Doppler: speed (m/s) for redshift z (good below z ≈ 0.1). */
export const dopplerSpeed = (z) => C * z;
/** Special-relativity Doppler: redshift for a source moving away at speed v (m/s). */
export const relDopplerZ = (v) => Math.sqrt((1 + v / C) / (1 - v / C)) - 1;
/** Telescope resolution (Rayleigh) in arcseconds for wavelength lam (m) and aperture D (m). */
export const resolutionArcsec = (lam, D) => (1.22 * lam) / D / ARCSEC;

// ---------- Gravity and orbits ----------
/** Newton's gravity force (N) between masses m1, m2 (kg) a distance r (m) apart. */
export const gravForce = (m1, m2, r) => (G * m1 * m2) / (r * r);
/** Speed (m/s) for a circular orbit of radius r around mass M. */
export const orbitSpeed = (M, r) => Math.sqrt((G * M) / r);
/** Escape speed (m/s) from radius r around mass M. */
export const escapeSpeed = (M, r) => Math.sqrt((2 * G * M) / r);
/** Kepler's third law around the Sun: period in years for a semi-major axis in AU. */
export const keplerPeriodYears = (aAU) => Math.pow(aAU, 1.5);
/** Orbital period (s) for semi-major axis a (m) around mass M (kg). */
export const orbitPeriod = (a, M) => 2 * Math.PI * Math.sqrt((a ** 3) / (G * M));

// ---------- Distances ----------
/** Distance in parsecs from a parallax in arcseconds. */
export const parallaxPc = (pArcsec) => 1 / pArcsec;
/** Small-angle size: physical size from distance and angle (radians). */
export const sizeFromAngle = (d, theta) => d * theta;
/** Eratosthenes: Earth's circumference from the noon shadow angle (degrees) and the distance between towns. */
export const eratosthenes = (angleDeg, dist) => (360 / angleDeg) * dist;
/** Aristarchus: Sun-to-Moon distance ratio from the Moon-Earth-Sun angle at half moon (degrees). */
export const aristarchusRatio = (angleDeg) => 1 / Math.cos(angleDeg * DEG);

// ---------- Cosmology ----------
/** Hubble time 1/H0 in Gyr, for H0 in km/s/Mpc. */
export const hubbleTimeGyr = (H0) => (MPC / 1000 / H0) / GYR;
/** Hubble distance c/H0 in Mpc. */
export const hubbleDistMpc = (H0) => C / 1000 / H0;
/** Critical density (kg/m³) for H0 in km/s/Mpc. */
export const criticalDensity = (H0) => { const H = (H0 * 1000) / MPC; return (3 * H * H) / (8 * Math.PI * G); };
/** Recession speed (km/s) from Hubble's law for a distance in Mpc. */
export const hubbleSpeed = (H0, dMpc) => H0 * dMpc;

/** Standard flat-ish model parameters close to Planck 2018 (rounded, for teaching). */
export const PLANCK18 = { H0: 67.7, Om: 0.31, Or: 9.1e-5, OL: 0.69 };

/** Dimensionless Hubble rate E(z) = H(z)/H0. Curvature is whatever is left: Ok = 1 − Om − Or − OL. */
export function E(z, p) {
  const { Om, Or = 0, OL } = p, Ok = 1 - Om - Or - OL, a = 1 + z;
  return Math.sqrt(Or * a ** 4 + Om * a ** 3 + Ok * a ** 2 + OL);
}

/** Simpson integration of f on [a, b] with n (even) steps. */
export function simpson(f, a, b, n = 2000) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/** Age of the universe at redshift z (Gyr). Integrates in the scale factor, which is gentle at early times. */
export function ageGyr(z, p) {
  const aMax = 1 / (1 + z);
  // t = ∫ da / (a H(a)), with u = sqrt(a) to tame the a → 0 end.
  const f = (u) => { const a = u * u; if (a === 0) return 0; return (2 * u) / (a * E(1 / a - 1, p)); };
  return simpson(f, 0, Math.sqrt(aMax), 4000) * hubbleTimeGyr(p.H0);
}
/** Lookback time to redshift z (Gyr). */
export const lookbackGyr = (z, p) => ageGyr(0, p) - ageGyr(z, p);
/** Comoving distance to z (Mpc). */
export const comovingMpc = (z, p) => simpson((x) => 1 / E(x, p), 0, z, 2000) * hubbleDistMpc(p.H0);
/** Transverse comoving distance (Mpc), which bends with curvature. */
export function transverseMpc(z, p) {
  const dc = comovingMpc(z, p), dh = hubbleDistMpc(p.H0), Ok = 1 - p.Om - (p.Or || 0) - p.OL;
  if (Math.abs(Ok) < 1e-6) return dc;
  const k = Math.sqrt(Math.abs(Ok));
  return Ok > 0 ? (dh / k) * Math.sinh((k * dc) / dh) : (dh / k) * Math.sin((k * dc) / dh);
}
/** Luminosity distance (Mpc): use it with the inverse square law. */
export const luminosityMpc = (z, p) => (1 + z) * transverseMpc(z, p);
/** Angular diameter distance (Mpc): use it with angular sizes. */
export const angularMpc = (z, p) => transverseMpc(z, p) / (1 + z);

/**
 * The scale factor through time for any model, found by stepping the acceleration equation
 * ä = H0² (−Ωr/a³ − Ωm/(2a²) + ΩΛ a) forwards and backwards from today (a = 1, ȧ = H0). Works for models with a
 * Big Bang, a Big Crunch, a turnaround or no beginning at all (pure Λ). Returns [{ t, a }] in time order, with
 * t in Gyr measured from today (negative = past). Stops at tPast / tFuture, at aMax, or when a falls to aMin.
 */
export function scaleHistory(p, { tPast = 20, tFuture = 30, aMax = 6, aMin = 0.002 } = {}) {
  const tH = hubbleTimeGyr(p.H0), Or = p.Or || 0, Om = p.Om, OL = p.OL;
  const acc = (a) => -Or / a ** 3 - Om / (2 * a * a) + OL * a; // in units of H0², time in Hubble times
  const run = (dir, tEnd) => {
    let a = 1, v = 1, t = 0;
    const out = [];
    while (Math.abs(t) < tEnd / tH && a > aMin && a < aMax) {
      const h = dir * Math.min(0.002, 0.002 * a / Math.max(1e-9, Math.abs(v)));
      // RK4 on (a, v)
      const k1a = v, k1v = acc(a);
      const k2a = v + 0.5 * h * k1v, k2v = acc(a + 0.5 * h * k1a);
      const k3a = v + 0.5 * h * k2v, k3v = acc(a + 0.5 * h * k2a);
      const k4a = v + h * k3v, k4v = acc(a + h * k3a);
      a += (h / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
      v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
      t += h;
      if (!out.length || Math.abs(t * tH - out[out.length - 1].t) > (tEnd / 400) || a <= aMin) out.push({ t: t * tH, a: Math.max(a, 0) });
    }
    return out;
  };
  return [...run(-1, tPast).reverse(), { t: 0, a: 1 }, ...run(1, tFuture)];
}

/** Age (Gyr) of a flat universe of matter and Λ only, in closed form: (2 / 3H0√ΩΛ) asinh √(ΩΛ/Ωm). */
export const flatAgeGyr = (H0, Om) => { const OL = 1 - Om; return OL <= 0 ? (2 / 3) * hubbleTimeGyr(H0) : (2 / (3 * Math.sqrt(OL))) * Math.asinh(Math.sqrt(OL / Om)) * hubbleTimeGyr(H0); };
/** Deceleration parameter today, q0 = Ωr + Ωm/2 − ΩΛ (negative = speeding up). */
export const q0 = (p) => (p.Or || 0) + p.Om / 2 - p.OL;
/** Each ingredient's share of the total density at scale factor a: { r, m, L, k } (they add to 1). */
export function omegasAt(a, p) {
  const Or = p.Or || 0, Ok = 1 - p.Om - Or - p.OL;
  const r = Or / a ** 4, m = p.Om / a ** 3, L = p.OL, k = Ok / a ** 2, H2 = r + m + L + k;
  return { r: r / H2, m: m / H2, L: L / H2, k: k / H2 };
}
/** Redshift of matter-radiation equality, 1 + z = Ωm / Ωr. */
export const zEquality = (p) => p.Om / p.Or - 1;
/** Comoving distance (Mpc) light can have crossed since the start: the particle horizon (radius of the observable universe). */
export const particleHorizonMpc = (p) => simpson((u) => { const a = u * u; return a === 0 ? 0 : (2 * u) / (a * a * E(1 / a - 1, p)); }, 0, 1, 20000) * hubbleDistMpc(p.H0);
/** Comoving distance (Mpc) to the event horizon: the farthest place light we send today can ever reach. */
export const eventHorizonMpc = (p) => simpson((x) => { const a = 1 / (1 - x) ; return 1 / ((1 - x) ** 2 * a * a * E(1 / a - 1, p)); }, 0, 0.9999, 20000) * hubbleDistMpc(p.H0);
/** Angular size (arcsec) of an object of size D (Mpc) at redshift z. */
export const angularSizeArcsec = (D, z, p) => (D / angularMpc(z, p)) / ARCSEC;

/** Temperature of the CMB (K) at redshift z. */
export const cmbTemp = (z) => T_CMB * (1 + z);

// ---------- Relativity (Module 3) ----------
/** Lorentz factor for a speed given as a fraction of c. */
export const gamma = (beta) => 1 / Math.sqrt(1 - beta * beta);
/** Schwarzschild radius (m) of a mass (kg): r = 2GM/c². */
export const schwarzschild = (m) => 2 * G * m / (C * C);
/** Bending of a light ray passing a mass m (kg) at closest distance b (m), in arcseconds: 4GM/(c²b). */
export const deflectionArcsec = (m, b) => (4 * G * m / (C * C * b)) * 206264.806;
/** Fractional rate gain of a clock raised by h metres in gravity g (weak field): g h / c². */
export const gravShift = (h, g = 9.81) => g * h / (C * C);
/** Energy (J) in a mass (kg). */
export const restEnergy = (m) => m * C * C;
/** Einstein radius (arcsec) for a lens of mass m (kg) with distances (m) to lens, source and lens to source. */
export const einsteinRadiusArcsec = (m, dl, ds, dls) => Math.sqrt(4 * G * m / (C * C) * dls / (dl * ds)) * 206264.806;
