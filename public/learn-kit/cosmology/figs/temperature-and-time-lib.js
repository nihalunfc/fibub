// Shared physics for the Module 6 figures (not a figure itself): the cosmic clock in the hot early universe and
// the neutron-to-proton ratio. Plain ES module with no DOM.
//
// Clock: H(T) = H0 √(Ωr (g*/3.36) x⁴ + Ωm x³ + ΩΛ), x = T / 2.7255 K, with g*(T) the effective number of kinds of
// particle in the hot soup (photons 2, each fermion pair 7/8 × its states, massive ones fading as kT drops below
// mc², quarks and gluons above the QCD change near 155 MeV, neutrinos cooler after e± annihilation). Time is
// t = ∫ dT / (T H). It reproduces t ≈ 2.42 s / √g* × (1 MeV / kT)² in the radiation era (0.75 s at 1 MeV), and
// joins phys.js's age at late times (373,000 years at 2,970 K and 13.8 billion years today with PLANCK18).
//
// n/p: neutrons and protons swap by weak reactions at the rate of Bernstein, Brown and Feinberg (1989),
// λ(n→p) ≈ (255 / τ) (12 + 6q + q²) / q⁵ with q = Q / kT, and λ(p→n) = λ(n→p) e^(−Q/kT); plus free neutron decay
// (τ = 879 s). This simple model freezes near n/p ≈ 1/6 and gives n/p ≈ 1/7 (Y ≈ 0.25) at kT ≈ 0.08 MeV.
import { PLANCK18, T_CMB, K_B, EV, MPC } from '../phys.js';

export const KEV = K_B / EV;                // eV per kelvin
export const MEV_K = 1e6 / KEV;             // kelvin per MeV (1.16 × 10¹⁰)
export const Q = 1.2933, TAU = 879;         // n − p mass difference (MeV), neutron mean lifetime (s)
export const YEAR = 365.25 * 86400;

// energy (or entropy) of a particle with x = m/kT, relative to a massless one; fermions or bosons
function relE(x, fermion) {
  if (x > 40) return 0;
  let s = 0, s0 = 0;
  for (let u = 0.01; u < 30; u += 0.05) {
    const E = Math.sqrt(u * u + x * x), d = fermion ? 1 : -1;
    s += (u * u * E) / (Math.exp(E) + d); s0 += (u * u * u) / (Math.exp(u) + d);
  }
  return s / s0;
}
function relS(x) {
  if (x > 40) return 0;
  let s = 0, s0 = 0;
  for (let u = 0.01; u < 30; u += 0.05) { const E = Math.sqrt(u * u + x * x); s += (u * u * (E + (u * u) / (3 * E))) / (Math.exp(E) + 1); s0 += (u * u * (4 / 3) * u) / (Math.exp(u) + 1); }
  return s / s0;
}
/** Share of the e± entropy still in pairs at photon temperature T (MeV): 1 early, 0 late. */
export const pairShare = (T) => relS(0.511 / T);
/** Neutrino temperature ÷ photon temperature (1 before e± annihilation, (4/11)^(1/3) after). */
export const nuRatio = (T) => Math.cbrt((2 + 3.5 * pairShare(T)) / 5.5);

/** Effective number of relativistic kinds g*(T), T in MeV. */
function gstarRaw(T) {
  const qcd = 1 / (1 + Math.exp(-Math.log(T / 155) / 0.08));
  const e = relE(0.511 / T, true), mu = relE(105.7 / T, true), pi = relE(137 / T, false);
  const nu = 5.25 * Math.pow((2 + 3.5 * relS(0.511 / T)) / 5.5, 4 / 3);
  const had = 2 + 3.5 * e + 3.5 * mu + 3 * pi + nu;
  const qgp = 2 + 3.5 * e + 3.5 * mu + 5.25 + 16 + 31.5;
  return qcd * qgp + (1 - qcd) * had;
}
// table of g* on a log grid from 10⁻⁴ to 10⁴ MeV
const GT = [];
for (let l = -4; l <= 4.0001; l += 0.02) GT.push(gstarRaw(10 ** l));
export function gstar(T) {
  const l = Math.log10(T);
  if (l <= -4) return GT[0];
  if (l >= 4) return GT[GT.length - 1];
  const i = (l + 4) / 0.02, j = Math.floor(i), f = i - j;
  return GT[j] * (1 - f) + GT[j + 1] * f;
}

const H0s = (PLANCK18.H0 * 1000) / MPC;
/** Expansion rate (per second) at photon temperature TK (kelvin). */
export const hubbleAt = (TK) => {
  const x = TK / T_CMB, g = gstar(TK / MEV_K);
  return H0s * Math.sqrt(PLANCK18.Or * (g / 3.36) * x ** 4 + PLANCK18.Om * x ** 3 + PLANCK18.OL);
};

// clock table: [log10 T(K), log10 t(s)] from 10¹⁴ K down to 1 K
const CT = [];
{
  let lnT = Math.log(1e14), t = 1 / (2 * hubbleAt(1e14));
  const dl = 0.01;
  CT.push([14, Math.log10(t)]);
  while (lnT > 0) {
    const T1 = Math.exp(lnT), Tm = Math.exp(lnT - dl / 2), T2 = Math.exp(lnT - dl);
    t += (dl * (1 / hubbleAt(T1) + 4 / hubbleAt(Tm) + 1 / hubbleAt(T2))) / 6;
    lnT -= dl;
    CT.push([lnT / Math.LN10, Math.log10(t)]);
  }
}
/** Time since the start (s) when the photons were at TK kelvin. */
export function timeAt(TK) {
  const l = Math.log10(TK);
  for (let i = 1; i < CT.length; i++) if (CT[i][0] <= l) { const [a0, b0] = CT[i - 1], [a1, b1] = CT[i]; return 10 ** (b0 + ((b1 - b0) * (l - a0)) / (a1 - a0)); }
  return 10 ** CT[CT.length - 1][1];
}
/** Photon temperature (K) at time t (s). */
export function tempAt(t) {
  const l = Math.log10(t);
  for (let i = 1; i < CT.length; i++) if (CT[i][1] >= l) { const [a0, b0] = CT[i - 1], [a1, b1] = CT[i]; return 10 ** (a0 + ((a1 - a0) * (l - b0)) / (b1 - b0)); }
  return 10 ** CT[CT.length - 1][0];
}

/** Friendly time text: 13 µs, 0.75 s, 3.2 minutes, 51,000 years ... */
export function timeText(s) {
  const r = (v, d = 2) => (+v.toPrecision(d)).toLocaleString('en-CA');
  if (s < 1e-3) return `${r(s * 1e6)} microseconds`;
  if (s < 1) return `${r(s * 1e3)} milliseconds`;
  if (s < 120) return `${r(s)} second${r(s) === '1' ? '' : 's'}`;
  if (s < 7200) return `${r(s / 60)} minutes`;
  if (s < 2 * 86400) return `${r(s / 3600)} hours`;
  if (s < YEAR) return `${r(s / 86400)} days`;
  if (s < 1e9 * YEAR) return `${r(s / YEAR)} years`;
  return `${r(s / YEAR / 1e9, 3)} billion years`;
}

/** Weak swap rate n → p (per second) at kT = T MeV, without free decay. */
export const swapRate = (T) => { const q = Q / T; return (255 / TAU) * (12 + 6 * q + q * q) / q ** 5; };

/** The neutron fraction history from kT = 10 MeV to 0.03 MeV: [{ t, T (MeV), X (neutrons ÷ nucleons) }]. */
export function neutronHistory() {
  const out = [];
  let T = 10, X = 1 / (1 + Math.exp(Q / T)), t = timeAt(T * MEV_K);
  out.push({ t, T, X });
  while (T > 0.03) {
    const T2 = T * Math.exp(-0.004), t2 = timeAt(T2 * MEV_K), dt = t2 - t;
    const l = swapRate(T2), a = l * Math.exp(-Q / T2), b = l + 1 / TAU;
    X = (X + a * dt) / (1 + (a + b) * dt); // implicit step: steady even when the rates are fast
    T = T2; t = t2;
    out.push({ t, T, X });
  }
  return out;
}
