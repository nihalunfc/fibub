// Carrier concentrations in a semiconductor: band gap against temperature (Varshni), effective densities of
// states from effective masses, the intrinsic density, and the Fermi level from charge neutrality with donors
// and acceptors that are only partly ionised. Electron and hole densities use the Fermi-Dirac integral F½, so
// heavily doped (degenerate) material is handled too. Energies are in eV, densities in cm⁻³, T in kelvin.

export const KB = 8.617333262e-5; // eV/K
const KB_SI = 1.380649e-23, H = 6.62607015e-34, M0 = 9.1093837015e-31;

/** Varshni band gap Eg(T) = Eg0 − αT²/(T + β). α in eV/K, β in K. */
export const varshni = (T: number, Eg0: number, alpha: number, beta: number) => Eg0 - (alpha * T * T) / (T + beta);

/** Effective density of states 2(2π m* kT / h²)^{3/2} in cm⁻³ for a density-of-states mass m (in units of m0). */
export const effDos = (m: number, T: number) => 2 * ((2 * Math.PI * m * M0 * KB_SI * T) / (H * H)) ** 1.5 * 1e-6;

// 20-point Gauss-Legendre nodes and weights on [−1, 1] (computed once by Newton's method on P20).
const GL = (() => {
  const n = 20, x: number[] = [], w: number[] = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5)), dp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = z;
      for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      dp = (n * (z * p1 - p0)) / (z * z - 1);
      const dz = p1 / dp; z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    x.push(z); w.push(2 / ((1 - z * z) * dp * dp));
  }
  return { x, w };
})();

/**
 * Normalised Fermi-Dirac integral of order ½: F½(η) = (2/√π) ∫₀^∞ √x / (1 + e^(x−η)) dx, so F½(η) → e^η for
 * η ≪ 0 (Boltzmann). A series for η < −1, otherwise Gauss-Legendre panels in t = √x around the step at x = η.
 */
export function fermiHalf(eta: number): number {
  if (!Number.isFinite(eta)) return eta > 0 ? Infinity : 0;
  if (eta < -1) {
    // Σ (−1)^(k+1) e^(kη) / k^{3/2}
    const z = Math.exp(eta);
    let s = 0, zk = 1;
    for (let k = 1; k <= 60; k++) { zk *= z; const t = zk / k ** 1.5; s += k % 2 ? t : -t; if (t < 1e-18 * s) break; }
    return s;
  }
  const f = (t: number) => { const x = t * t; const e = x - eta; return e > 700 ? 0 : (2 * x) / (1 + Math.exp(e)); };
  const a = Math.sqrt(Math.max(eta, 0)), b = Math.sqrt(Math.max(eta, 0) + 60);
  // Panels: finer near the step at t = √η, where the integrand falls over a width ~1/(2√η) in t.
  const edges: number[] = [];
  const nA = Math.max(4, Math.ceil(a * 2)), nB = Math.max(12, Math.ceil((b - a) * Math.max(4, 2 * a)));
  for (let i = 0; i < nA; i++) edges.push((a * i) / nA);
  for (let i = 0; i <= nB; i++) edges.push(a + ((b - a) * i) / nB);
  let s = 0;
  for (let p = 0; p + 1 < edges.length; p++) {
    const lo = edges[p], hi = edges[p + 1], h = (hi - lo) / 2, m = (hi + lo) / 2;
    if (h <= 0) continue;
    for (let i = 0; i < GL.x.length; i++) s += GL.w[i] * h * f(m + h * GL.x[i]);
  }
  return (2 / Math.sqrt(Math.PI)) * s;
}

export type Material = { Eg0: number; alpha: number; beta: number; me: number; mh: number };
export type Doping = { Nd: number; Ed: number; gd: number; Na: number; Ea: number; ga: number };
export type Stats = 'fd' | 'boltzmann';

/** Rounded, made-up example materials (not reference data): only to show the method. */
export const PRESETS: { id: string; name: string; m: Material }[] = [
  { id: 'si', name: 'Silicon-like (rounded)', m: { Eg0: 1.17, alpha: 5e-4, beta: 650, me: 1.1, mh: 0.8 } },
  { id: 'ge', name: 'Germanium-like (rounded)', m: { Eg0: 0.74, alpha: 5e-4, beta: 250, me: 0.55, mh: 0.35 } },
  { id: 'gaas', name: 'GaAs-like (rounded)', m: { Eg0: 1.52, alpha: 5e-4, beta: 220, me: 0.07, mh: 0.5 } },
];

export type State = {
  T: number; kT: number; Eg: number; Nc: number; Nv: number; ni: number; Ei: number;
  /** Fermi level measured up from the valence band edge (Ev = 0). */
  EF: number; n: number; p: number; NdIon: number; NaIon: number;
  etaN: number; etaP: number; degenerate: boolean;
};

const occN = (eta: number, st: Stats) => (st === 'fd' ? fermiHalf(eta) : Math.exp(eta));

/** Electrons, holes and ionised dopants for a Fermi level EF (eV above Ev). */
function densities(EF: number, T: number, Eg: number, Nc: number, Nv: number, d: Doping, st: Stats) {
  const kT = KB * T, etaN = (EF - Eg) / kT, etaP = -EF / kT;
  const n = Nc * occN(etaN, st), p = Nv * occN(etaP, st);
  // Donor level at Ec − Ed, acceptor level at Ev + Ea; a large exponent means the level is filled (neutral).
  const ed = (EF - (Eg - d.Ed)) / kT, ea = (d.Ea - EF) / kT;
  const NdIon = d.Nd > 0 ? d.Nd / (1 + d.gd * Math.exp(Math.min(ed, 700))) : 0;
  const NaIon = d.Na > 0 ? d.Na / (1 + d.ga * Math.exp(Math.min(ea, 700))) : 0;
  return { n, p, NdIon, NaIon, etaN, etaP };
}

/** Intrinsic density √(NcNv) e^(−Eg/2kT) (Boltzmann form). */
export const intrinsic = (Nc: number, Nv: number, Eg: number, T: number) => Math.sqrt(Nc * Nv) * Math.exp(-Eg / (2 * KB * T));

/** Solve n + NA⁻ = p + ND⁺ for the Fermi level by bisection (the balance is monotonic in EF). */
export function solve(T: number, m: Material, d: Doping, st: Stats = 'fd'): State {
  const kT = KB * T, Eg = varshni(T, m.Eg0, m.alpha, m.beta), Nc = effDos(m.me, T), Nv = effDos(m.mh, T);
  const bal = (EF: number) => { const r = densities(EF, T, Eg, Nc, Nv, d, st); return r.p + r.NdIon - r.n - r.NaIon; };
  // Brackets wide enough for degenerate doping: the band edges ± (2 eV + 60 kT).
  let lo = -2 - 60 * kT, hi = Eg + 2 + 60 * kT;
  for (let i = 0; i < 200 && hi - lo > 1e-13; i++) {
    const mid = (lo + hi) / 2, b = bal(mid);
    if (b > 0) lo = mid; else if (b < 0) hi = mid; else { lo = hi = mid; break; }
  }
  const EF = (lo + hi) / 2, r = densities(EF, T, Eg, Nc, Nv, d, st);
  const Ei = Eg / 2 + 0.75 * kT * Math.log(m.mh / m.me);
  return { T, kT, Eg, Nc, Nv, ni: intrinsic(Nc, Nv, Eg, T), Ei, EF, ...r, degenerate: r.etaN > -3 || r.etaP > -3 };
}

export type Regime = 'freeze-out' | 'extrinsic' | 'intrinsic' | 'undoped';
/** Share of the net doping that is ionised: (ND⁺ − NA⁻)/(ND − NA), from about 0 when frozen out to 1. */
export const ionisedShare = (s: State, d: Doping) => (d.Nd === d.Na ? NaN : (s.NdIon - s.NaIon) / (d.Nd - d.Na));
/** Which region a state is in: intrinsic once ni passes the net doping, freeze-out while < 90 % of the net doping is ionised. */
export function regime(s: State, d: Doping): Regime {
  const net = Math.abs(d.Nd - d.Na);
  if (net === 0) return 'undoped';
  if (s.ni >= net) return 'intrinsic';
  return ionisedShare(s, d) < 0.9 ? 'freeze-out' : 'extrinsic';
}

/** Temperature where ni equals the net doping (bisection on log ni), or NaN outside [Tlo, Thi]. */
export function intrinsicTemperature(m: Material, d: Doping, Tlo = 10, Thi = 2000): number {
  const net = Math.abs(d.Nd - d.Na);
  if (!(net > 0)) return NaN;
  const g = (T: number) => Math.log(intrinsic(effDos(m.me, T), effDos(m.mh, T), varshni(T, m.Eg0, m.alpha, m.beta), T)) - Math.log(net);
  if (g(Tlo) > 0 || g(Thi) < 0) return NaN;
  let lo = Tlo, hi = Thi;
  for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
}

/** Temperature below which less than 90 % of the net majority dopant is ionised (bisection), or NaN. */
export function freezeOutTemperature(m: Material, d: Doping, st: Stats = 'fd', Tlo = 2, Thi = 2000): number {
  if (d.Nd === d.Na) return NaN;
  // (ND⁺ − NA⁻)/(ND − NA) rises from ~0 at low T to 1; find where it crosses 0.9.
  const g = (T: number) => ionisedShare(solve(T, m, d, st), d) - 0.9;
  if (g(Tlo) > 0) return NaN;
  // Step up until it crosses, then bisect.
  let a = Tlo, b = NaN;
  for (let T = Tlo * 1.25; T <= Thi; T *= 1.25) { if (g(T) >= 0) { b = T; break; } a = T; }
  if (!Number.isFinite(b)) return NaN;
  for (let i = 0; i < 60; i++) { const mid = (a + b) / 2; if (g(mid) >= 0) b = mid; else a = mid; }
  return (a + b) / 2;
}

/** A temperature sweep (log-spaced between Tmin and Tmax). */
export function sweep(m: Material, d: Doping, Tmin: number, Tmax: number, nPts = 160, st: Stats = 'fd'): State[] {
  const out: State[] = [];
  for (let i = 0; i < nPts; i++) out.push(solve(Tmin * (Tmax / Tmin) ** (i / (nPts - 1)), m, d, st));
  return out;
}
