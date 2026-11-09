// Maxwell-Boltzmann, Fermi-Dirac and Bose-Einstein statistics: occupation numbers, the complete Fermi-Dirac and
// Bose-Einstein (polylogarithm) integrals, and the ideal 3D quantum gas (chemical potential from density, Fermi
// energy, Bose-Einstein condensation temperature, mean energy, pressure). SI units. No DOM.

export const KB = 1.380649e-23, H = 6.62607015e-34, HBAR = H / (2 * Math.PI), QE = 1.602176634e-19, ME = 9.1093837015e-31, AMU = 1.66053906660e-27;
export const ZETA32 = 2.612375348685488, ZETA52 = 1.341487257250917;
export type Stat = 'mb' | 'fd' | 'be';
export const STAT_NAMES: Record<Stat, string> = { mb: 'Maxwell-Boltzmann', fd: 'Fermi-Dirac', be: 'Bose-Einstein' };

/** Mean occupation of a single state with x = (E − μ)/kT. Bose-Einstein needs x > 0 (NaN otherwise). */
export function occupancy(s: Stat, x: number) {
  if (s === 'mb') return Math.exp(-x);
  if (s === 'fd') return x > 0 ? Math.exp(-x) / (1 + Math.exp(-x)) : 1 / (1 + Math.exp(x));
  return x > 0 ? 1 / Math.expm1(x) : NaN;
}

const SQRTPI = Math.sqrt(Math.PI);
const GAMMA: Record<string, number> = { '0.5': SQRTPI, '1.5': SQRTPI / 2, '2.5': (3 * SQRTPI) / 4, '3.5': (15 * SQRTPI) / 8 };

/** Composite Simpson's rule with n (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, n = 4000) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

/**
 * Normalised complete Fermi-Dirac integral F_j(η) = 1/Γ(j+1) ∫₀^∞ x^j / (e^(x−η) + 1) dx for j = 1/2 or 3/2
 * (equal to −Li_{j+1}(−e^η)).
 */
export function fermiDirac(j: 0.5 | 1.5, eta: number) {
  const g = GAMMA[String(j + 1)];
  if (eta < -30) return Math.exp(eta) * (1 - Math.exp(eta) / 2 ** (j + 1)); // first two terms of the series
  if (eta <= 40) {
    // x = t² removes the square-root corner at 0.
    const tmax = Math.sqrt(Math.max(eta, 0) + 70);
    return simpson((t) => { const x = t * t, e = x - eta; return 2 * t * Math.pow(x, j) * (e > 0 ? Math.exp(-e) / (1 + Math.exp(-e)) : 1 / (1 + Math.exp(e))); }, 0, tmax, 6000) / g;
  }
  // Deep degeneracy: exact x^(j+1)/(j+1) up to η − 40 (occupation 1 to 4e-18) plus the Fermi edge numerically.
  const a = eta - 40, below = Math.pow(a, j + 1) / (j + 1);
  const edge = simpson((x) => { const e = x - eta; return Math.pow(x, j) * (e > 0 ? Math.exp(-e) / (1 + Math.exp(-e)) : 1 / (1 + Math.exp(e))); }, a, eta + 70, 8000);
  return (below + edge) / g;
}

/** Polylogarithm Li_s(z) for 0 ≤ z ≤ 1 and s = 3/2 or 5/2 (the Bose-Einstein integrals g_s(z)). */
export function boseEinstein(s: 1.5 | 2.5, z: number) {
  if (z <= 0) return 0;
  if (z < 0.5) { let sum = 0, p = 1; for (let k = 1; k < 200; k++) { p *= z; const t = p / Math.pow(k, s); sum += t; if (t < 1e-17 * sum) break; } return sum; }
  if (z >= 1) return s === 1.5 ? ZETA32 : ZETA52;
  // Li_s(z) = 1/Γ(s) ∫ x^(s−1) / (e^x / z − 1) dx with x = t².
  const lz = -Math.log(z);
  return simpson((t) => { if (t === 0) return s === 1.5 && lz === 0 ? 2 : 0; const x = t * t; return (2 * t * Math.pow(x, s - 1)) / Math.expm1(x + lz); }, 0, Math.sqrt(80), 6000) / GAMMA[String(s)];
}

/** Thermal de Broglie wavelength λ = h / √(2π m kT) (m). */
export const lambdaT = (m: number, T: number) => H / Math.sqrt(2 * Math.PI * m * KB * T);

export type Gas = {
  stat: Stat; eta: number; mu: number; lambda: number; degeneracy: number; meanE: number; pressure: number; condensate: number;
  EF?: number; TF?: number; Tc?: number;
};
/**
 * Ideal 3D gas of particles of mass m (kg), spin degeneracy g, number density n (m⁻³), temperature T (K). Solves the
 * chemical potential μ (J) from n; below the Bose-Einstein condensation temperature μ = 0 and the rest condense.
 */
export function idealGas(stat: Stat, m: number, g: number, n: number, T: number): Gas {
  const lam = lambdaT(m, T), D = (n * lam ** 3) / g, kT = KB * T;
  const out: Gas = { stat, eta: NaN, mu: NaN, lambda: lam, degeneracy: D, meanE: NaN, pressure: NaN, condensate: 0 };
  if (stat === 'mb') { out.eta = Math.log(D); out.meanE = 1.5 * kT; }
  else if (stat === 'fd') {
    let lo = -800, hi = Math.max(10, 2 * Math.pow((3 * SQRTPI * D) / 4, 2 / 3) + 10);
    for (let i = 0; i < 200 && hi - lo > 1e-13 * Math.max(1, Math.abs(hi)); i++) { const mid = (lo + hi) / 2; if (fermiDirac(0.5, mid) < D) lo = mid; else hi = mid; }
    out.eta = (lo + hi) / 2; out.meanE = (1.5 * kT * fermiDirac(1.5, out.eta)) / fermiDirac(0.5, out.eta);
    out.EF = ((HBAR * HBAR) / (2 * m)) * Math.pow((6 * Math.PI * Math.PI * n) / g, 2 / 3); out.TF = out.EF / KB;
  } else {
    out.Tc = ((2 * Math.PI * HBAR * HBAR) / (m * KB)) * Math.pow(n / (g * ZETA32), 2 / 3);
    if (D >= ZETA32) { out.eta = 0; out.condensate = 1 - Math.pow(T / out.Tc, 1.5); out.meanE = (1.5 * kT * ZETA52) / D; }
    else {
      let lo = -800, hi = 0;
      for (let i = 0; i < 200 && hi - lo > 1e-14; i++) { const mid = (lo + hi) / 2; if (boseEinstein(1.5, Math.exp(mid)) < D) lo = mid; else hi = mid; }
      out.eta = (lo + hi) / 2; out.meanE = (1.5 * kT * boseEinstein(2.5, Math.exp(out.eta))) / D;
    }
  }
  out.mu = out.eta * kT; out.pressure = (2 / 3) * n * out.meanE;
  return out;
}

/** Number of particles per unit energy per unit volume, g(E) f(E), for the 3D gas (E in J, per J per m³). */
export function spectrum(stat: Stat, m: number, g: number, mu: number, T: number, E: number) {
  const dos = (g / (4 * Math.PI * Math.PI)) * Math.pow((2 * m) / (HBAR * HBAR), 1.5) * Math.sqrt(Math.max(E, 0));
  return dos * occupancy(stat, (E - mu) / (KB * T));
}
