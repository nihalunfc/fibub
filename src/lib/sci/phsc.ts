// Superconductor numbers: BCS gap (with its temperature dependence from the weak-coupling gap equation), London
// penetration depth, coherence length, Ginzburg-Landau parameter and critical fields. Plain maths, no DOM. SI units.

export const HBAR = 1.054571817e-34, KB = 1.380649e-23, QE = 1.602176634e-19, ME = 9.1093837015e-31;
export const MU0 = 1.25663706212e-6, H = 6.62607015e-34, MUB = 9.2740100783e-24;
/** Magnetic flux quantum h/2e (Wb). */
export const PHI0 = H / (2 * QE);
/** Weak-coupling BCS ratio Δ(0)/k_BT_c = π e^(−γ_E) ≈ 1.764. */
export const BCS_RATIO = Math.PI * Math.exp(-0.5772156649015329);

/** ∫₀^∞ f(E)/E dξ with E = √(ξ² + δ²), f the Fermi function at reduced temperature t (energies in k_BT_c), via ξ = δ sinh u. */
function fermiIntegral(delta: number, t: number): number {
  const umax = Math.acosh(Math.max(1, (50 * t) / delta)) + 1, n = 4000, h = umax / n;
  const f = (u: number) => { const x = (delta * Math.cosh(u)) / t; return x > 700 ? 0 : 1 / (Math.exp(x) + 1); };
  let s = f(0) + f(umax);
  for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/** BCS gap Δ(T)/Δ(0) at reduced temperature t = T/T_c, from ln(Δ₀/Δ) = 2∫ f(E)/E dξ (weak coupling). */
export function gapRatio(t: number): number {
  if (!(t > 0)) return 1;
  if (t >= 1) return 0;
  const D0 = BCS_RATIO;
  const F = (d: number) => Math.log(D0 / d) - 2 * fermiIntegral(d, t);
  let lo = Math.log(1e-14), hi = Math.log(D0);
  if (F(D0) >= 0) return 1;
  for (let i = 0; i < 90; i++) { const m = (lo + hi) / 2; if (F(Math.exp(m)) > 0) lo = m; else hi = m; }
  return Math.exp((lo + hi) / 2) / D0;
}

/** London penetration depth λ_L = √(m* /(μ₀ n e²)) for carrier density n (m⁻³) and effective mass ratio m* /mₑ. */
export const londonDepth = (n: number, mstar = 1) => Math.sqrt((mstar * ME) / (MU0 * n * QE * QE));
/** BCS (Pippard) coherence length ξ₀ = ħ v_F / (π Δ₀) for Fermi velocity v_F (m/s) and gap Δ₀ (J). */
export const bcsCoherence = (vF: number, gap: number) => (HBAR * vF) / (Math.PI * gap);
/** Pippard's effective coherence length with a mean free path ℓ: 1/ξ = 1/ξ₀ + 1/ℓ. */
export const pippard = (xi0: number, l: number) => (l > 0 && Number.isFinite(l) ? 1 / (1 / xi0 + 1 / l) : xi0);

export type ScOut = { kappa: number; type: 'I' | 'II'; Bc: number; Bc1: number; Bc2: number; Jd: number; Bp: number };
/**
 * Ginzburg-Landau estimates from λ and ξ (m): κ = λ/ξ, thermodynamic field B_c = Φ₀/(2√2 π λ ξ), lower critical field
 * B_c1 = Φ₀ ln κ / (4π λ²) (valid for κ ≫ 1; reported for κ > 1/√2), upper critical field B_c2 = Φ₀/(2π ξ²), the GL
 * depairing current density J_d = Φ₀/(3√3 π μ₀ λ² ξ), and the Pauli (Clogston) limit Δ₀/(√2 μ_B) for a gap in joules.
 */
export function glFields(lambda: number, xi: number, gap: number): ScOut {
  const kappa = lambda / xi;
  return {
    kappa, type: kappa > Math.SQRT1_2 ? 'II' : 'I',
    Bc: PHI0 / (2 * Math.SQRT2 * Math.PI * lambda * xi),
    Bc1: kappa > Math.SQRT1_2 ? (PHI0 * Math.log(kappa)) / (4 * Math.PI * lambda * lambda) : NaN,
    Bc2: PHI0 / (2 * Math.PI * xi * xi),
    Jd: PHI0 / (3 * Math.sqrt(3) * Math.PI * MU0 * lambda * lambda * xi),
    Bp: gap / (Math.SQRT2 * MUB),
  };
}
/** Two-fluid (Gorter-Casimir) temperature dependence of λ: λ(T) = λ(0)/√(1 − t⁴). */
export const lambdaT = (l0: number, t: number) => (t < 1 ? l0 / Math.sqrt(1 - t ** 4) : Infinity);
/** Empirical parabolic law for critical fields: B(T) = B(0)(1 − t²). */
export const parabolic = (b0: number, t: number) => (t < 1 ? b0 * (1 - t * t) : 0);
