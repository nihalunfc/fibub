// Dissolved oxygen solubility, saturation and AOU, and plankton counts to densities. Written by fibub from
// published equations; no tables copied. No DOM.
// - O₂ solubility in water in equilibrium with moist air at 1 atm: Garcia and Gordon (1992, erratum 1993), their
//   fit to the Benson and Krause (1984) data, in µmol/kg (the equation used by TEOS-10's GSW O2sol). Temperature on
//   the 1968 scale (t68 = 1.00024 t90), as GSW does.
// - Other barometric pressures: Benson and Krause's correction for water vapour and the non-ideality of oxygen,
//   C(P) = C* · P (1 − pw/P)(1 − θ₀P) / ((1 − pw)(1 − θ₀)), P in atm, θ₀ = 0.000975 − 1.426e-5 t + 6.436e-8 t².
// - Water vapour pressure over sea water: Weiss and Price (1980).
// - Density at the surface, to turn per kg into per litre: UNESCO 1981 (Millero and Poisson 1981), p = 0.
// - Unit factors: O₂ molar mass 31.9988 g/mol; 1 mL O₂ (STP, real gas) = 44.6596 µmol (SCOR WG 142).
// - Plankton: cells per litre from a count, the volume examined and the concentration factor; individuals per m³ from
//   a net tow; Poisson confidence limits for the count.

export const M_O2 = 31.9988;      // g/mol
export const ML_UMOL = 44.6596;   // µmol per mL of O₂

/** O₂ solubility (µmol/kg) at 1 atm moist air, t in °C (ITS-90), S practical salinity. Garcia and Gordon (1992). */
export function o2solKg(t: number, S: number): number {
  const t68 = t * 1.00024, y = Math.log((298.15 - t68) / (273.15 + t68));
  const a = 5.80871 + y * (3.20291 + y * (4.17887 + y * (5.10006 + y * (-9.86643e-2 + y * 3.80369))));
  const b = -7.01577e-3 + y * (-7.70028e-3 + y * (-1.13864e-2 + y * -9.51519e-3));
  return Math.exp(a + S * b - 2.75915e-7 * S * S);
}
/** Water vapour pressure (atm) over sea water, Weiss and Price (1980). */
export function vapourAtm(t: number, S: number): number {
  const T = t + 273.15;
  return Math.exp(24.4543 - 67.4509 * (100 / T) - 4.8489 * Math.log(T / 100) - 0.000544 * S);
}
/** Factor for a barometric pressure P (atm) other than 1 atm. */
export function pressureFactor(t: number, S: number, P: number): number {
  const pw = vapourAtm(t, S), th = 0.000975 - 1.426e-5 * t + 6.436e-8 * t * t;
  return (P * (1 - pw / P) * (1 - th * P)) / ((1 - pw) * (1 - th));
}
/** Sea-water density (kg/m³) at the surface, UNESCO 1981; S = 0 gives pure water. */
export function density(t: number, S: number): number {
  const rw = 999.842594 + t * (6.793952e-2 + t * (-9.09529e-3 + t * (1.001685e-4 + t * (-1.120083e-6 + t * 6.536332e-9))));
  const A = 8.24493e-1 + t * (-4.0899e-3 + t * (7.6438e-5 + t * (-8.2467e-7 + t * 5.3875e-9)));
  const B = -5.72466e-3 + t * (1.0227e-4 - 1.6546e-6 * t);
  return rw + A * S + B * S ** 1.5 + 4.8314e-4 * S * S;
}
/** Standard-atmosphere pressure (atm) at an altitude in metres. */
export const altitudeAtm = (h: number) => (1 - 2.25577e-5 * h) ** 5.25588;

export type Unit = 'umolkg' | 'umolL' | 'mgL' | 'mLL';
export const UNITS: Record<Unit, string> = { umolkg: 'µmol/kg', umolL: 'µmol/L', mgL: 'mg/L', mLL: 'mL/L' };
/** Convert an O₂ amount between units at temperature t and salinity S (density for per-kg ↔ per-litre). */
export function convert(x: number, from: Unit, to: Unit, t: number, S: number): number {
  const rho = density(t, S) / 1000; // kg/L
  const umolL = from === 'umolL' ? x : from === 'umolkg' ? x * rho : from === 'mgL' ? (x * 1000) / M_O2 : x * ML_UMOL;
  return to === 'umolL' ? umolL : to === 'umolkg' ? umolL / rho : to === 'mgL' ? (umolL * M_O2) / 1000 : umolL / ML_UMOL;
}

export type Sat = { umolkg: number; umolL: number; mgL: number; mLL: number; rho: number; factor: number; pw: number };
/** Saturation concentration in every unit at t (°C), S and barometric pressure P (atm). */
export function saturation(t: number, S: number, P = 1): Sat {
  if (!(t > -2.5 && t <= 40)) throw new Error('Temperature must be between −2 and 40 °C (the range of the fit).');
  if (!(S >= 0 && S <= 42)) throw new Error('Salinity must be between 0 and 42.');
  if (!(P >= 0.5 && P <= 1.1)) throw new Error('Barometric pressure must be between 0.5 and 1.1 atm (about 507 to 1115 hPa).');
  const factor = pressureFactor(t, S, P), umolkg = o2solKg(t, S) * factor;
  return { umolkg, umolL: convert(umolkg, 'umolkg', 'umolL', t, S), mgL: convert(umolkg, 'umolkg', 'mgL', t, S), mLL: convert(umolkg, 'umolkg', 'mLL', t, S), rho: density(t, S), factor, pw: vapourAtm(t, S) };
}
/** Percent saturation and apparent oxygen utilisation (AOU = saturation − measured, µmol/kg). */
export function satState(measured: number, unit: Unit, t: number, S: number, P = 1): { pct: number; aou: number; o2: number; sat: Sat } {
  const sat = saturation(t, S, P), o2 = convert(measured, unit, 'umolkg', t, S);
  return { pct: (100 * o2) / sat.umolkg, aou: sat.umolkg - o2, o2, sat };
}

// ---- Plankton counts --------------------------------------------------------------------------------------------
/** Cells per litre: N counted in V mL of the (concentrated) sample; CF = original volume ÷ concentrated volume. */
export function cellsPerLitre(N: number, countedMl: number, cf = 1): number {
  if (!(N >= 0)) throw new Error('The count must be 0 or more.');
  if (!(countedMl > 0)) throw new Error('The volume counted must be more than 0.');
  if (!(cf > 0)) throw new Error('The concentration factor must be more than 0.');
  return (N / countedMl / cf) * 1000;
}
/** Volume examined (mL) from fields or strips: number × area (mm²) × chamber depth (mm) ÷ 1000. */
export const fieldsVolume = (n: number, areaMm2: number, depthMm: number) => (n * areaMm2 * depthMm) / 1000;
/** Individuals per m³ from a net tow: N counted in a fraction f of the sample, V m³ of water filtered. */
export function perCubicMetre(N: number, fraction: number, filteredM3: number): number {
  if (!(N >= 0)) throw new Error('The count must be 0 or more.');
  if (!(fraction > 0 && fraction <= 1)) throw new Error('The fraction counted must be more than 0 and at most 1.');
  if (!(filteredM3 > 0)) throw new Error('The volume filtered must be more than 0.');
  return N / fraction / filteredM3;
}
/** Water filtered by a round net (m³): mouth diameter (m) × tow length (m), times a filtering efficiency. */
export const towVolume = (diam: number, length: number, eff = 1) => (Math.PI * diam * diam * length * eff) / 4;

/** Regularised lower incomplete gamma P(a, x) (series or continued fraction, Numerical Recipes style). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  const lg = lnGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, del = sum, ap = a;
    for (let n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; }
    return sum * Math.exp(-x + a * Math.log(x) - lg);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lg) * h;
}
function lnGamma(z: number): number {
  const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
/** Quantile of the gamma(a, 1) distribution by bisection. */
function gammaQuantile(a: number, p: number): number {
  let lo = 0, hi = Math.max(10, a * 3 + 50);
  while (gammaP(a, hi) < p) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (gammaP(a, m) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** Exact (Garwood) Poisson confidence limits for a count N. */
export function poissonCI(N: number, level = 0.95): [number, number] {
  const a = (1 - level) / 2;
  return [N === 0 ? 0 : gammaQuantile(N, a), gammaQuantile(N + 1, 1 - a)];
}
/** Counting precision as ± % at 95 %, Lund et al. (1958): 2/√N × 100. */
export const lundPrecision = (N: number) => (N > 0 ? 200 / Math.sqrt(N) : Infinity);

/** Made-up profile (not real measurements): depth, temperature, salinity, oxygen in µmol/kg. */
export const EXAMPLE = `Depth (m),Temperature (°C),Salinity,O2 (µmol/kg)
0,18.4,35.1,236
20,17.9,35.1,241
50,15.2,35.2,228
100,12.1,35.2,196
200,10.3,35.0,162
400,8.0,34.8,118
600,6.2,34.6,85
800,5.1,34.5,72
1000,4.4,34.5,96`;
