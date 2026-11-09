// Fick principle (cardiac output from O2 uptake and the arteriovenous O2 difference), Fick's first law of
// diffusion across a sheet, and Poiseuille flow in a tube. Teaching formulas; for study, not for clinical use.

export const MMHG_PA = 133.322387415, KPA_MMHG = 7.50061683;
/** Dissolved O2 in plasma, mL O2 per dL blood per mmHg (Henry's law, 37 °C; the usual 0.003 to 0.0031). */
export const O2_SOL = 0.0031;

/** O2 content of blood in mL O2/dL: bound to haemoglobin (Hüfner factor × Hb × saturation) plus dissolved. */
export function o2Content(hbGdl: number, sat: number, po2mmHg: number, hufner = 1.34, sol = O2_SOL) {
  const bound = hufner * hbGdl * sat, dissolved = sol * po2mmHg;
  return { bound, dissolved, total: bound + dissolved };
}

export type FickResult = { avDiff: number; co: number; sv: number | null; ci: number | null; do2: number; extraction: number };
/**
 * Fick principle: cardiac output (L/min) = V̇O2 (mL/min) ÷ (CaO2 − CvO2 in mL/dL × 10).
 * hr in beats/min and bsa in m² are optional (null to leave out).
 */
export function fick(vo2: number, ca: number, cv: number, hr: number | null = null, bsa: number | null = null): FickResult {
  const avDiff = ca - cv, co = vo2 / (avDiff * 10);
  return { avDiff, co, sv: hr ? (co / hr) * 1000 : null, ci: bsa ? co / bsa : null, do2: co * ca * 10, extraction: avDiff / ca };
}

/**
 * Fick's first law across a sheet: flux J = D ΔC / Δx, rate = J × area.
 * D in cm²/s, area in cm², ΔC in mmol/L, thickness in µm. Returns the rate in mol/s and the flux in mol/(cm²·s),
 * plus the characteristic diffusion time x²/(2D) in seconds.
 */
export function diffusion(Dcm2s: number, areaCm2: number, dCmmolL: number, thickUm: number) {
  const dC = dCmmolL * 1e-6; // mmol/L = µmol/cm³ = 1e-6 mol/cm³
  const x = thickUm * 1e-4; // cm
  const flux = (Dcm2s * dC) / x;
  return { flux, rate: flux * areaCm2, time: (x * x) / (2 * Dcm2s) };
}

/**
 * Poiseuille (laminar, steady, Newtonian) flow in a rigid tube: Q = π ΔP r⁴ / (8 η L).
 * ΔP in mmHg, radius in mm, viscosity in mPa·s, length in cm, density in kg/m³.
 * Returns flow in mL/s, resistance in mmHg·s/mL, mean velocity in cm/s, Reynolds number and wall shear stress in Pa.
 */
export function poiseuille(dPmmHg: number, rMm: number, etaMPas: number, lenCm: number, rho = 1060) {
  const dP = dPmmHg * MMHG_PA, r = rMm / 1000, eta = etaMPas / 1000, L = lenCm / 100;
  const Q = (Math.PI * dP * r ** 4) / (8 * eta * L); // m³/s
  const v = Q / (Math.PI * r * r);
  return { q: Q * 1e6, resistance: dPmmHg / (Q * 1e6), velocity: v * 100, reynolds: (rho * v * 2 * r) / eta, shear: (4 * eta * Q) / (Math.PI * r ** 3) };
}
