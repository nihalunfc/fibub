// Bethe-Bloch electronic stopping power for heavy charged particles and the CSDA range by integration. No shell,
// density-effect, Barkas or effective-charge corrections: good to a few percent from about 2 MeV per nucleon up to
// a few GeV per nucleon; rough below. No DOM.

export const K = 0.307075;          // MeV cm²/mol, 4π N_A r_e² m_e c²
export const ME = 0.51099895;       // MeV, electron rest energy
export const U = 931.49410242;      // MeV per atomic mass unit

export type Projectile = { name: string; z: number; M: number };   // M in MeV
export type Material = { name: string; ZA: number; I: number; rho: number }; // I in eV, rho g/cm³

/** Projectiles: charge number and mass (MeV), general constants. */
export const PROJECTILES: Record<string, Projectile> = {
  proton: { name: 'Proton', z: 1, M: 938.272 },
  deuteron: { name: 'Deuteron', z: 1, M: 1875.613 },
  alpha: { name: 'Alpha particle (He-4)', z: 2, M: 3727.379 },
  carbon: { name: 'Carbon-12 ion', z: 6, M: 12 * U - 6 * ME },
  muon: { name: 'Muon', z: 1, M: 105.658 },
  pion: { name: 'Charged pion', z: 1, M: 139.570 },
};
/** Materials: Z/A from composition, rounded mean excitation energies I (commonly quoted values) and densities. */
export const MATERIALS: Record<string, Material> = {
  water: { name: 'Water', ZA: 0.55509, I: 75, rho: 1.0 },
  air: { name: 'Air (dry, sea level)', ZA: 0.49919, I: 85.7, rho: 0.001205 },
  pmma: { name: 'PMMA (acrylic)', ZA: 0.53937, I: 74, rho: 1.19 },
  aluminium: { name: 'Aluminium', ZA: 0.48181, I: 166, rho: 2.699 },
  silicon: { name: 'Silicon', ZA: 0.49848, I: 173, rho: 2.33 },
  copper: { name: 'Copper', ZA: 0.45636, I: 322, rho: 8.96 },
  lead: { name: 'Lead', ZA: 0.39575, I: 823, rho: 11.35 },
};

export function kin(T: number, M: number) {
  const g = 1 + T / M, b2 = 1 - 1 / (g * g), bg2 = b2 * g * g;
  const Tmax = (2 * ME * bg2) / (1 + (2 * g * ME) / M + (ME / M) ** 2);
  return { gamma: g, beta: Math.sqrt(b2), b2, bg2, Tmax };
}

/** Mass stopping power (MeV cm²/g) for kinetic energy T (MeV). */
export function stopping(T: number, p: Projectile, m: Material): number {
  const k = kin(T, p.M), I = m.I * 1e-6;
  const L = 0.5 * Math.log((2 * ME * k.bg2 * k.Tmax) / (I * I)) - k.b2;
  return (K * p.z * p.z * m.ZA * L) / k.b2;
}

/** Lowest energy (MeV) the Bethe formula is used down to: 1 MeV per nucleon (mass in u). */
export const cutEnergy = (p: Projectile) => (p.M / U) * 1;
/** Power-law exponent assumed below the cut (range ∝ T^1.75, Bragg-Kleeman-like). */
export const LOW_P = 1.75;

/** CSDA range (g/cm²) from T down to rest: integral of dT/S above the cut, plus T_cut/(1.75 S(T_cut)) below it. */
export function range(T: number, p: Projectile, m: Material, n = 400): number {
  const Tc = cutEnergy(p);
  if (T <= Tc) return (Tc / (LOW_P * stopping(Tc, p, m))) * Math.pow(T / Tc, LOW_P);
  const R0 = Tc / (LOW_P * stopping(Tc, p, m));
  // Simpson's rule in u = ln T (dT = T du), n even.
  const a = Math.log(Tc), b = Math.log(T), h = (b - a) / n;
  let s = 0;
  for (let i = 0; i <= n; i++) { const t = Math.exp(a + i * h), f = t / stopping(t, p, m); s += f * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2); }
  return R0 + (s * h) / 3;
}

/** Energy (MeV) left after crossing x g/cm², or 0 if the particle stops inside. */
export function residual(T: number, x: number, p: Projectile, m: Material): number {
  const R = range(T, p, m);
  if (x >= R) return 0;
  let lo = 0, hi = T;
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (range(mid, p, m) < R - x) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

/**
 * Depth-dose style curve: stopping power against depth (g/cm²) for a particle starting with T, from range
 * differences on an energy grid (a pristine Bragg curve for one particle, with no straggling).
 */
export function braggCurve(T: number, p: Projectile, m: Material, pts = 160) {
  const R = range(T, p, m), Tlo = cutEnergy(p) * 0.1, out: { depth: number; S: number; T: number }[] = [];
  for (let i = 0; i <= pts; i++) {
    const t = T * Math.pow(Tlo / T, i / pts);
    const r = range(t, p, m);
    const S = t >= cutEnergy(p) ? stopping(t, p, m) : stopping(cutEnergy(p), p, m) * Math.pow(t / cutEnergy(p), 1 - LOW_P);
    out.push({ depth: R - r, S, T: t });
  }
  return out;
}

/** Typical range straggling (1σ, g/cm²): about 1.2 % of the range for protons, scaling as 1/√(M/m_p). Rough. */
export const straggleSigma = (R: number, p: Projectile) => 0.012 * R / Math.sqrt(p.M / 938.272);

/**
 * Mean energy loss against depth for a beam whose ranges spread as a normal distribution (σ in g/cm²), built from
 * the pristine curve as a function of residual range. Returns loss (MeV cm²/g) at each depth.
 */
export function straggled(curve: { depth: number; S: number }[], R: number, sigma: number, depths: number[]): number[] {
  // Pristine loss as a function of residual range r = R - depth (r ascending).
  const rr = curve.map((c) => R - c.depth).reverse(), ss = curve.map((c) => c.S).reverse();
  const f = (r: number) => {
    if (r <= 0 || r > rr[rr.length - 1]) return r > rr[rr.length - 1] ? ss[ss.length - 1] : 0;
    let lo = 0, hi = rr.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (rr[m] < r) lo = m; else hi = m; }
    if (r < rr[0]) return ss[0] * Math.pow(rr[0] / r, 1 - 1 / 1.75);
    const t = (r - rr[lo]) / (rr[hi] - rr[lo] || 1);
    return ss[lo] + t * (ss[hi] - ss[lo]);
  };
  const n = 80, ws: number[] = [], us: number[] = [];
  for (let i = 0; i <= n; i++) { const u = -4 + (8 * i) / n; us.push(u); ws.push(Math.exp(-u * u / 2) * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2)); }
  const W = ws.reduce((a, b) => a + b, 0);
  return depths.map((z) => (sigma > 0 ? us.reduce((s, u, i) => s + ws[i] * f(R + u * sigma - z), 0) / W : f(R - z)));
}
