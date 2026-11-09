// Respirometry: O2 uptake, CO2 output, RQ and metabolic rate from flow-through (open) and closed-chamber
// measurements. Flow-through equations follow the mass balances in J. R. B. Lighton, Measuring Metabolic Rates
// (Oxford, 2008), chapters 8 to 10: nitrogen (and argon) pass through unchanged, so the flow on the side that is
// not measured comes from the nitrogen balance (the Haldane transformation). All gas is taken as dry (water
// scrubbed before the analysers and the flow meter). Fractions are 0 to 1; flows in mL/min at STPD.

export type FlowAt = 'in' | 'out';

/** Standard temperature and pressure, dry: 0 °C, 101.325 kPa. Ideal-gas molar volume there, mL/mmol. */
export const STP_K = 273.15, STP_KPA = 101.325, MOLAR_VOLUME = 22.414;

/** A flow measured at temperature tC (°C) and pressure kPa, dry, corrected to STPD. */
export const toStpd = (flow: number, tC: number, kPa: number) => (flow * (kPa / STP_KPA) * STP_K) / (tC + STP_K);

export type OpenResult = { vo2: number; vco2: number | null; rq: number | null; fri: number; fre: number };

/**
 * Flow-through respirometry with O2 and CO2 both measured in dry gas.
 * fi/fe: incurrent and excurrent fractions; flow: dry flow at STPD measured on the `at` side.
 */
export function openBoth(flow: number, at: FlowAt, fiO2: number, fiCO2: number, feO2: number, feCO2: number): OpenResult {
  const fiN2 = 1 - fiO2 - fiCO2, feN2 = 1 - feO2 - feCO2;
  const fri = at === 'in' ? flow : (flow * feN2) / fiN2;
  const fre = at === 'out' ? flow : (flow * fiN2) / feN2;
  const vo2 = fri * fiO2 - fre * feO2, vco2 = fre * feCO2 - fri * fiCO2;
  return { vo2, vco2, rq: vco2 / vo2, fri, fre };
}

/**
 * Flow-through respirometry with CO2 (and water) scrubbed from the air before the O2 analyser, so only O2 is
 * measured. Flow is the scrubbed flow at STPD on the `at` side. Lighton (2008) eq. 10.2 (incurrent) and the
 * matching excurrent form: VO2 = FRi (FiO2 − FeO2)/(1 − FeO2) or FRe (FiO2 − FeO2)/(1 − FiO2).
 */
export function openO2(flow: number, at: FlowAt, fiO2: number, feO2: number): OpenResult {
  const vo2 = at === 'in' ? (flow * (fiO2 - feO2)) / (1 - feO2) : (flow * (fiO2 - feO2)) / (1 - fiO2);
  const fri = at === 'in' ? flow : (flow * (1 - feO2)) / (1 - fiO2), fre = at === 'out' ? flow : (flow * (1 - fiO2)) / (1 - feO2);
  return { vo2, vco2: null, rq: null, fri, fre };
}

/** Least-squares straight line: slope, intercept and R². */
export function line(x: number[], y: number[]): { slope: number; intercept: number; r2: number; n: number } {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = x[i] - mx, dy = y[i] - my; sxx += dx * dx; sxy += dx * dy; syy += dy * dy; }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : 1, n };
}

/**
 * Closed chamber in air: O2 fraction falls at `slopeFrac` per minute (negative while the animal breathes).
 * Air volume (chamber minus animal and other contents) in mL at tC and kPa; the water-vapour pressure (kPa)
 * is taken out when the air is not dry. Returns O2 uptake in mL/min at STPD.
 */
export function closedAir(slopeFrac: number, airMl: number, tC: number, kPa: number, waterKPa = 0): number {
  return -slopeFrac * toStpd(airMl, tC, kPa - waterKPa);
}

/** Closed chamber in water: dissolved O2 falls at `slopeMgLmin` mg/L per minute; water volume in L. mg O2/min. */
export const closedWaterMg = (slopeMgLmin: number, waterL: number) => -slopeMgLmin * waterL;
/** mg of O2 to mL at STPD (ideal gas: 32.00 g/mol, 22.414 L/mol). */
export const mgO2toMl = (mg: number) => (mg / 31.998) * MOLAR_VOLUME;

export type EnergyMethod = 'weir' | 'lighton' | 'fixed';
/**
 * Metabolic rate in watts from VO2 and VCO2 (mL/min at STPD).
 * weir: Weir (1949) without urinary nitrogen, kcal/min = 3.941 VO2 + 1.106 VCO2 (L/min), 1 kcal = 4.184 kJ.
 * lighton: oxycalorific equivalent 16 + 5.164 RQ J per mL O2 (Lighton 2008, after Lighton et al. 1987).
 * fixed: a fixed joules per mL O2 (20.1 J/mL is a common mixed-diet value).
 */
export function watts(vo2: number, vco2: number, method: EnergyMethod, fixedJ = 20.1): number {
  if (method === 'weir') return ((3.941 * vo2 + 1.106 * vco2) / 1000) * 4184 / 60;
  if (method === 'lighton') return ((16 + 5.164 * (vco2 / vo2)) * vo2) / 60;
  return (fixedJ * vo2) / 60;
}
/** Joules per mL O2 implied by a method at a given RQ (for display). */
export const joulesPerMl = (rq: number, method: EnergyMethod, fixedJ = 20.1) => (method === 'weir' ? (3.941 + 1.106 * rq) * 4.184 : method === 'lighton' ? 16 + 5.164 * rq : fixedJ);
/** W to kJ per day. */
export const kjPerDay = (w: number) => (w * 86400) / 1000;

/** Saturation vapour pressure of water over liquid water, kPa (Buck 1996 form of the Buck 1981 equation). */
export const waterVapourKPa = (tC: number) => 0.61121 * Math.exp((18.678 - tC / 234.5) * (tC / (257.14 + tC)));
