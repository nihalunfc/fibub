// Seawater carbonate system, in the way of CO2SYS (Lewis and Wallace 1998): from any two of total alkalinity
// (TA), dissolved inorganic carbon (DIC), pH (total scale) and pCO2, with temperature, salinity and pressure.
// Published equations only:
//   K1, K2: Lueker, Dickson and Keeling (2000), total scale.   K0: Weiss (1974).   Fugacity factor: Weiss (1974).
//   KB: Dickson (1990b), total scale.   KW: Millero (1995), seawater scale.   KSO4 (HSO4⁻): Dickson (1990a), free.
//   KF (HF): Dickson and Riley (1979), free.   Ksp calcite and aragonite: Mucci (1983).
//   Pressure: Millero (1995), with Ingle (1975) for the solubility products. Totals from salinity: borate Uppström
//   (1974) or Lee et al. (2010); sulfate Morris and Riley (1966); fluoride Riley (1965); calcium Riley and Tongudai
//   (1967). Vapour pressure for xCO2: Weiss and Price (1980). Nutrient (phosphate, silicate) alkalinity is left out.
// Constants are worked out on their own pH scale at 1 atm, moved to the seawater scale, corrected for pressure and
// moved to the total scale with the pressure-corrected KSO4 and KF, as CO2SYS does.

export const R = 83.14462618; // cm³ bar K⁻¹ mol⁻¹ (CODATA 2018)
export type Borate = 'U74' | 'LKB10';
export type Consts = {
  TK: number; S: number; Pbar: number;
  K0: number; K1: number; K2: number; KB: number; KW: number; KS: number; KF: number; KCa: number; KAr: number;
  TB: number; TS: number; TF: number; Ca: number; FugFac: number; VPFac: number;
  /** multiply a free-scale [H+] by this to get total scale */ freeToTot: number; swsToTot: number;
};

const pfac = (dV: number, kappa: number, Pbar: number, TK: number) => Math.exp(((-dV + 0.5 * kappa * Pbar) * Pbar) / (R * TK));

/** All the constants at temperature tC (°C), practical salinity S and pressure P (dbar, above the sea surface). */
export function constants(tC: number, S: number, Pdbar: number, borate: Borate = 'U74'): Consts {
  const TK = tC + 273.15, Pbar = Pdbar / 10, lnT = Math.log(TK), sqS = Math.sqrt(S);
  // Totals (mol/kg-SW).
  const TB = borate === 'U74' ? (0.0004157 * S) / 35 : (0.0004326 * S) / 35;
  const TS = ((0.14 / 96.062) * S) / 1.80655, TF = ((0.000067 / 18.998) * S) / 1.80655, Ca = ((0.02128 / 40.087) * S) / 1.80655;
  const I = (19.924 * S) / (1000 - 1.005 * S);
  // HSO4 and HF on the free scale, 1 atm.
  const KS0 = Math.exp(-4276.1 / TK + 141.328 - 23.093 * lnT + (-13856 / TK + 324.57 - 47.986 * lnT) * Math.sqrt(I) + (35474 / TK - 771.54 + 114.723 * lnT) * I - (2698 / TK) * I ** 1.5 + (1776 / TK) * I * I) * (1 - 0.001005 * S);
  const KF0 = Math.exp(1590.2 / TK - 12.641 + 1.525 * Math.sqrt(I)) * (1 - 0.001005 * S);
  const KS = KS0 * pfac(-18.03 + 0.0466 * tC + 0.000316 * tC * tC, (-4.53 + 0.09 * tC) / 1000, Pbar, TK);
  const KF = KF0 * pfac(-9.78 - 0.009 * tC - 0.000942 * tC * tC, (-3.91 + 0.054 * tC) / 1000, Pbar, TK);
  // pH scale factors: seawater → total, at 1 atm and in situ.
  const sws2tot0 = (1 + TS / KS0) / (1 + TS / KS0 + TF / KF0);
  const sws2tot = (1 + TS / KS) / (1 + TS / KS + TF / KF), freeToTot = 1 + TS / KS;
  // Carbonic acid (Lueker 2000, total) → SWS → pressure → total.
  const pK1 = 3633.86 / TK - 61.2172 + 9.6777 * lnT - 0.011555 * S + 0.0001152 * S * S;
  const pK2 = 471.78 / TK + 25.929 - 3.16967 * lnT - 0.01781 * S + 0.0001122 * S * S;
  const K1 = (10 ** -pK1 / sws2tot0) * pfac(-25.5 + 0.1271 * tC, (-3.08 + 0.0877 * tC) / 1000, Pbar, TK) * sws2tot;
  const K2 = (10 ** -pK2 / sws2tot0) * pfac(-15.82 - 0.0219 * tC, (1.13 - 0.1475 * tC) / 1000, Pbar, TK) * sws2tot;
  // Boric acid (Dickson 1990b, total).
  const lnKB = (-8966.9 - 2890.53 * sqS - 77.942 * S + 1.728 * sqS * S - 0.0996 * S * S) / TK + 148.0248 + 137.1942 * sqS + 1.62142 * S + (-24.4344 - 25.085 * sqS - 0.2474 * S) * lnT + 0.053105 * sqS * TK;
  const KB = (Math.exp(lnKB) / sws2tot0) * pfac(-29.48 + 0.1622 * tC - 0.002608 * tC * tC, -2.84 / 1000, Pbar, TK) * sws2tot;
  // Water (Millero 1995, SWS).
  const KW0 = Math.exp(148.9802 - 13847.26 / TK - 23.6521 * lnT + (-5.977 + 118.67 / TK + 1.0495 * lnT) * sqS - 0.01615 * S);
  const KW = KW0 * pfac(-20.02 + 0.1119 * tC - 0.001409 * tC * tC, (-5.13 + 0.0794 * tC) / 1000, Pbar, TK) * sws2tot;
  // CO2 solubility (Weiss 1974), mol kg⁻¹ atm⁻¹, and the fugacity factor at 1 atm.
  const T100 = TK / 100;
  const K0 = Math.exp(-60.2409 + 93.4517 / T100 + 23.3585 * Math.log(T100) + S * (0.023517 - 0.023656 * T100 + 0.0047036 * T100 * T100));
  const Bv = -1636.75 + 12.0408 * TK - 0.0327957 * TK * TK + 3.16528e-5 * TK ** 3, delta = 57.7 - 0.118 * TK;
  const FugFac = Math.exp(((Bv + 2 * delta) * 1.01325) / (R * TK));
  const VPFac = 1 - Math.exp(24.4543 - 67.4509 * (100 / TK) - 4.8489 * Math.log(TK / 100)) * Math.exp(-0.000544 * S);
  // Calcite and aragonite (Mucci 1983), pressure after Ingle (1975).
  const lg = Math.log10(TK);
  const logKCa = -171.9065 - 0.077993 * TK + 2839.319 / TK + 71.595 * lg + (-0.77712 + 0.0028426 * TK + 178.34 / TK) * sqS - 0.07711 * S + 0.0041249 * sqS * S;
  const logKAr = -171.945 - 0.077993 * TK + 2903.293 / TK + 71.595 * lg + (-0.068393 + 0.0017276 * TK + 88.135 / TK) * sqS - 0.10018 * S + 0.0059415 * sqS * S;
  const dVc = -48.76 + 0.5304 * tC, kc = (-11.76 + 0.3692 * tC) / 1000;
  const KCa = 10 ** logKCa * pfac(dVc, kc, Pbar, TK), KAr = 10 ** logKAr * pfac(dVc + 2.8, kc, Pbar, TK);
  return { TK, S, Pbar, K0, K1, K2, KB, KW, KS, KF, KCa, KAr, TB, TS, TF, Ca, FugFac, VPFac, freeToTot, swsToTot: sws2tot };
}

/** Alkalinity from everything but carbon, at total-scale [H+] (mol/kg). */
function nonCarbonTA(H: number, k: Consts) {
  const Hf = H / k.freeToTot;
  return (k.TB * k.KB) / (k.KB + H) + k.KW / H - Hf - k.TS / (1 + k.KS / Hf) - k.TF / (1 + k.KF / Hf);
}
const carbTA = (H: number, DIC: number, k: Consts) => (DIC * k.K1 * (H + 2 * k.K2)) / (H * H + k.K1 * H + k.K1 * k.K2);
/** Total alkalinity (mol/kg) from DIC and pH. */
export const taFrom = (DIC: number, pH: number, k: Consts) => { const H = 10 ** -pH; return carbTA(H, DIC, k) + nonCarbonTA(H, k); };

/** Solve f(pH) = 0 on pH 0..14 by bisection then secant polishing; f must be decreasing in [H+] sense handled by sign check. */
function solvePH(f: (pH: number) => number): number {
  let a = 0, b = 14, fa = f(a), fb = f(b);
  if (!(fa * fb < 0)) throw new Error('These two values do not fit together in seawater: no pH between 0 and 14 matches them.');
  for (let i = 0; i < 200 && b - a > 1e-13; i++) { const m = (a + b) / 2, fm = f(m); if (fm * fa > 0) { a = m; fa = fm; } else { b = m; fb = fm; } }
  return (a + b) / 2;
}

export type Key = 'TA' | 'DIC' | 'pH' | 'pCO2';
export type Result = {
  TA: number; DIC: number; pH: number; pHfree: number; pHsws: number; pCO2: number; fCO2: number; xCO2: number;
  CO2: number; HCO3: number; CO3: number; BOH4: number; OH: number; OmegaCa: number; OmegaAr: number; Revelle: number;
  /** alkalinity parts, µmol/kg */ parts: { HCO3: number; CO3x2: number; BOH4: number; OH: number; Hfree: number; HSO4: number; HF: number };
  k: Consts;
};

/** TA and DIC in µmol/kg, pH on the total scale, pCO2 in µatm. */
export function solve(given: Partial<Record<Key, number>>, tC: number, S: number, Pdbar = 0, borate: Borate = 'U74'): Result {
  const keys = (Object.keys(given) as Key[]).filter((key) => Number.isFinite(given[key]));
  if (keys.length !== 2) throw new Error('Give exactly two of TA, DIC, pH and pCO2.');
  if (!(S >= 0 && S <= 50)) throw new Error('Salinity should be between 0 and 50.');
  if (!(tC >= -2 && tC <= 50)) throw new Error('Temperature should be between −2 and 50 °C.');
  if (!(Pdbar >= 0 && Pdbar <= 12000)) throw new Error('Pressure should be between 0 and 12000 dbar.');
  const k = constants(tC, S, Pdbar, borate);
  const has = (a: Key) => keys.includes(a);
  const TA = (given.TA ?? NaN) * 1e-6, DIC = (given.DIC ?? NaN) * 1e-6, pHin = given.pH ?? NaN, CO2fromP = ((given.pCO2 ?? NaN) * 1e-6) * k.FugFac * k.K0;
  for (const key of keys) if (key !== 'pH' && !((given[key] as number) > 0)) throw new Error(`${key} must be above zero.`);
  if (has('pH') && !(pHin > 2 && pHin < 12)) throw new Error('pH should be between 2 and 12.');
  let pH: number, C: number;
  if (has('TA') && has('DIC')) { pH = solvePH((p) => taFrom(DIC, p, k) - TA); C = DIC; }
  else if (has('TA') && has('pH')) { pH = pHin; const H = 10 ** -pH; C = ((TA - nonCarbonTA(H, k)) * (H * H + k.K1 * H + k.K1 * k.K2)) / (k.K1 * (H + 2 * k.K2)); }
  else if (has('TA') && has('pCO2')) { pH = solvePH((p) => { const H = 10 ** -p; return CO2fromP * (k.K1 / H + (2 * k.K1 * k.K2) / (H * H)) + nonCarbonTA(H, k) - TA; }); const H = 10 ** -pH; C = CO2fromP * (1 + k.K1 / H + (k.K1 * k.K2) / (H * H)); }
  else if (has('DIC') && has('pH')) { pH = pHin; C = DIC; }
  else if (has('DIC') && has('pCO2')) {
    // DIC = CO2 (1 + K1 x + K1K2 x²), x = 1/H.
    const a = CO2fromP * k.K1 * k.K2, b = CO2fromP * k.K1, c = CO2fromP - DIC;
    if (!(c < 0)) throw new Error('pCO2 is too high for this DIC: dissolved CO2 alone would exceed the DIC.');
    const x = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    pH = Math.log10(x); C = DIC;
  } else { pH = pHin; const H = 10 ** -pH; C = CO2fromP * (1 + k.K1 / H + (k.K1 * k.K2) / (H * H)); }
  if (!(C > 0)) throw new Error('These two values give a DIC below zero: check them.');
  return finish(C, pH, k);
}

function finish(C: number, pH: number, k: Consts): Result {
  const H = 10 ** -pH, D = H * H + k.K1 * H + k.K1 * k.K2;
  const CO2 = (C * H * H) / D, HCO3 = (C * k.K1 * H) / D, CO3 = (C * k.K1 * k.K2) / D;
  const Hf = H / k.freeToTot, BOH4 = (k.TB * k.KB) / (k.KB + H), OH = k.KW / H, HSO4 = k.TS / (1 + k.KS / Hf), HF = k.TF / (1 + k.KF / Hf);
  const TA = HCO3 + 2 * CO3 + BOH4 + OH - Hf - HSO4 - HF;
  const fCO2 = CO2 / k.K0, pCO2 = fCO2 / k.FugFac;
  // Revelle factor (∂ln pCO2 / ∂ln DIC at constant TA), by a central difference of the exact solution.
  const pAt = (c: number) => { const p = solvePH((x) => taFrom(c, x, k) - TA); const h = 10 ** -p; return (c * h * h) / (h * h + k.K1 * h + k.K1 * k.K2); };
  const d = C * 1e-5, Revelle = ((Math.log(pAt(C + d)) - Math.log(pAt(C - d))) / (2 * d)) * C;
  const u = 1e6;
  return {
    TA: TA * u, DIC: C * u, pH, pHfree: -Math.log10(Hf), pHsws: -Math.log10(H / k.swsToTot), pCO2: pCO2 * u, fCO2: fCO2 * u, xCO2: (pCO2 * u) / k.VPFac,
    CO2: CO2 * u, HCO3: HCO3 * u, CO3: CO3 * u, BOH4: BOH4 * u, OH: OH * u, OmegaCa: (k.Ca * CO3) / k.KCa, OmegaAr: (k.Ca * CO3) / k.KAr, Revelle,
    parts: { HCO3: HCO3 * u, CO3x2: 2 * CO3 * u, BOH4: BOH4 * u, OH: OH * u, Hfree: Hf * u, HSO4: HSO4 * u, HF: HF * u }, k,
  };
}

/** The same water (TA and DIC kept) at another temperature and pressure. */
export function recalc(r: Result, tC: number, Pdbar: number, borate: Borate = 'U74') {
  return solve({ TA: r.TA, DIC: r.DIC }, tC, r.k.S, Pdbar, borate);
}
