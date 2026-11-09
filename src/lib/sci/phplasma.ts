// Basic plasma parameters from density, temperatures, magnetic field and ion species (SI units throughout).
// Formulas: standard textbook and NRL Plasma Formulary results (Chen; Bittencourt; Braginskii 1965 collision times).
// Thermal speed convention: v_t = sqrt(kT/m) (no factor 2), as in the NRL formulary.

export const C = {
  e: 1.602176634e-19, me: 9.1093837015e-31, mp: 1.67262192369e-27, amu: 1.6605390666e-27,
  eps0: 8.8541878128e-12, mu0: 1.25663706212e-6, kB: 1.380649e-23, c: 299792458,
};
export const EV_K = C.e / C.kB; // 1 eV in kelvin, about 11 604.5 K

export type PlasmaIn = {
  ne: number; // electron density, m^-3
  Te: number; // electron temperature, eV
  Ti: number; // ion temperature, eV
  B: number; // magnetic field, T (0 for none)
  A: number; // ion mass in atomic mass units
  Z: number; // ion charge number
  L?: number; // size of the plasma, m (optional, for the regime checks)
  lnL?: number; // Coulomb logarithm override
};

/** Coulomb logarithm for electron-ion collisions, NRL formulary (ne in m^-3, Te and Ti in eV). */
export function coulombLog(ne: number, Te: number, Z = 1, Ti = Te, mu = 1): number {
  const n = ne * 1e-6; // cm^-3
  const me_mi = C.me / (mu * C.amu);
  let l: number;
  if (Te > 10 * Z * Z) l = 24 - Math.log(Math.sqrt(n) / Te);
  else if (Te > Ti * Z * me_mi) l = 23 - Math.log(Math.sqrt(n) * Z * Te ** -1.5);
  else l = 16 - Math.log(Math.sqrt(n / Z) * Ti ** -1.5 * Z * Z * mu); // very cold electrons (rare)
  return Math.max(2, l);
}

export function plasma(p: PlasmaIn) {
  const { ne, Te, Ti, B, A, Z } = p;
  const mi = A * C.amu, ni = ne / Z;
  const kTe = Te * C.e, kTi = Ti * C.e;
  const lnL = p.lnL && p.lnL > 0 ? p.lnL : coulombLog(ne, Te, Z, Ti, A);
  const lambdaD = Math.sqrt((C.eps0 * kTe) / (ne * C.e * C.e));
  const lambdaDi = Ti > 0 ? Math.sqrt((C.eps0 * kTi) / (ni * Z * Z * C.e * C.e)) : Infinity;
  const lambdaDtot = 1 / Math.sqrt(1 / lambdaD ** 2 + (Number.isFinite(lambdaDi) ? 1 / lambdaDi ** 2 : 0));
  const wpe = Math.sqrt((ne * C.e * C.e) / (C.eps0 * C.me));
  const wpi = Math.sqrt((ni * Z * Z * C.e * C.e) / (C.eps0 * mi));
  const wce = (C.e * B) / C.me, wci = (Z * C.e * B) / mi;
  const vte = Math.sqrt(kTe / C.me), vti = Math.sqrt(kTi / mi);
  const rLe = B > 0 ? vte / wce : Infinity, rLi = B > 0 ? vti / wci : Infinity;
  const ND = (4 / 3) * Math.PI * ne * lambdaD ** 3;
  // Braginskii collision times: tau_e = 6 sqrt(2) pi^1.5 eps0^2 sqrt(me) Te^1.5 / (lnL e^4 Z^2 ni).
  const tauE = (6 * Math.SQRT2 * Math.PI ** 1.5 * C.eps0 ** 2 * Math.sqrt(C.me) * kTe ** 1.5) / (lnL * C.e ** 4 * Z * Z * ni);
  const tauI = Ti > 0 ? (12 * Math.PI ** 1.5 * C.eps0 ** 2 * Math.sqrt(mi) * kTi ** 1.5) / (lnL * C.e ** 4 * Z ** 4 * ni) : 0;
  const nuE = 1 / tauE, nuI = tauI > 0 ? 1 / tauI : Infinity;
  const mfpE = vte * tauE, mfpI = vti * tauI;
  const rho = ni * mi + ne * C.me;
  const vA = B > 0 ? B / Math.sqrt(C.mu0 * rho) : 0;
  const cs = Math.sqrt((Z * kTe + 3 * kTi) / mi);
  const pressure = ne * kTe + ni * kTi;
  const beta = B > 0 ? (2 * C.mu0 * pressure) / (B * B) : Infinity;
  const skinE = C.c / wpe, skinI = C.c / wpi;
  const hallE = B > 0 ? wce * tauE : 0, hallI = B > 0 && tauI > 0 ? wci * tauI : 0;
  // Spitzer parallel resistivity for Z = 1 (0.51 factor of Braginskii); approximate for other Z.
  const etaSpitzer = (0.51 * C.me) / (ne * C.e * C.e * tauE);
  return {
    ni, mi, lnL, lambdaD, lambdaDi, lambdaDtot, wpe, wpi, fpe: wpe / (2 * Math.PI), fpi: wpi / (2 * Math.PI),
    wce, wci, fce: wce / (2 * Math.PI), fci: wci / (2 * Math.PI), vte, vti, rLe, rLi, ND, Lambda: 4 * Math.PI * ne * lambdaD ** 3,
    tauE, tauI, nuE, nuI, mfpE, mfpI, rho, vA, cs, pressure, beta, skinE, skinI, hallE, hallI, etaSpitzer,
  };
}
export type PlasmaOut = ReturnType<typeof plasma>;

/** Rounded, typical orders of magnitude for familiar plasmas (illustrative only, not measurements). */
export const PRESETS: { id: string; name: string; v: PlasmaIn }[] = [
  { id: 'tokamak', name: 'Tokamak core (rounded, typical)', v: { ne: 1e20, Te: 10000, Ti: 10000, B: 5, A: 2, Z: 1, L: 1 } },
  { id: 'glow', name: 'Glow discharge tube (rounded, typical)', v: { ne: 1e16, Te: 2, Ti: 0.03, B: 0, A: 40, Z: 1, L: 0.05 } },
  { id: 'wind', name: 'Solar wind near Earth (rounded, typical)', v: { ne: 5e6, Te: 10, Ti: 10, B: 5e-9, A: 1, Z: 1, L: 1e8 } },
  { id: 'iono', name: 'Ionosphere F layer (rounded, typical)', v: { ne: 1e12, Te: 0.1, Ti: 0.1, B: 5e-5, A: 16, Z: 1, L: 1e5 } },
  { id: 'icp', name: 'Plasma etcher, ICP (rounded, typical)', v: { ne: 1e17, Te: 3, Ti: 0.05, B: 0, A: 40, Z: 1, L: 0.2 } },
];
