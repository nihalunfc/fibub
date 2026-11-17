// Moist air properties (psychrometrics) from ASHRAE Handbook, Fundamentals (2017, SI), chapter 1:
// Hyland-Wexler saturation pressure (eqs 5 and 6), humidity ratio (20, 22), enthalpy (32),
// thermodynamic wet bulb (33, 35), specific volume (26) and standard pressure at altitude (3).
// Heat stress: the US National Weather Service heat index and Environment Canada's humidex.

/** Saturation vapour pressure in Pa at t °C: over ice below 0 °C, over water from 0 to 200 °C. */
export function pws(t: number): number {
  const T = t + 273.15;
  if (t < 0) return Math.exp(-5.6745359e3 / T + 6.3925247 - 9.677843e-3 * T + 6.2215701e-7 * T * T + 2.0747825e-9 * T ** 3 - 9.484024e-13 * T ** 4 + 4.1635019 * Math.log(T));
  return Math.exp(-5.8002206e3 / T + 1.3914993 - 4.8640239e-2 * T + 4.1764768e-5 * T * T - 1.4452093e-8 * T ** 3 + 6.5459673 * Math.log(T));
}
/** Standard atmospheric pressure in Pa at an altitude in metres. */
export const pressureAt = (z: number) => 101325 * (1 - 2.25577e-5 * z) ** 5.2559;
/** Humidity ratio (kg water per kg dry air) from the vapour pressure pw and total pressure p, in Pa. */
export const humRatio = (pw: number, p: number) => (0.621945 * pw) / (p - pw);
const pwFromW = (W: number, p: number) => (p * W) / (0.621945 + W);
/** Moist air enthalpy, kJ per kg dry air. */
export const enthalpy = (t: number, W: number) => 1.006 * t + W * (2501 + 1.86 * t);

function bisect(f: (x: number) => number, lo: number, hi: number) {
  let flo = f(lo);
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2, fm = f(m); if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m; }
  return (lo + hi) / 2;
}
/** Humidity ratio at dry bulb t and thermodynamic wet bulb tw (°C), pressure p (Pa). */
export function wFromWetBulb(t: number, tw: number, p: number): number {
  const ws = humRatio(pws(tw), p);
  return tw >= 0 ? ((2501 - 2.326 * tw) * ws - 1.006 * (t - tw)) / (2501 + 1.86 * t - 4.186 * tw) : ((2830 - 0.24 * tw) * ws - 1.006 * (t - tw)) / (2830 + 1.86 * t - 2.1 * tw);
}

export type Air = { t: number; p: number; W: number; pw: number; rh: number; td: number; tw: number; h: number; v: number; vpd: number; abs: number };
/** Every property of moist air from the dry bulb t (°C), pressure p (Pa) and one of: rh (0–1), dew point td or wet bulb tw. */
export function air(t: number, p: number, given: { rh?: number; td?: number; tw?: number }): Air {
  if (!(t >= -100 && t <= 200)) throw new Error('Dry bulb must be between −100 and 200 °C');
  if (!(p > 1000)) throw new Error('Pressure looks wrong');
  const ps = pws(t);
  let pw: number;
  if (given.rh != null) { if (!(given.rh >= 0 && given.rh <= 1)) throw new Error('Relative humidity must be 0 to 100 %'); pw = given.rh * ps; }
  else if (given.td != null) { if (given.td > t + 1e-9) throw new Error('The dew point cannot be above the dry bulb'); pw = pws(given.td); }
  else if (given.tw != null) { if (given.tw > t + 1e-9) throw new Error('The wet bulb cannot be above the dry bulb'); pw = pwFromW(wFromWetBulb(t, given.tw, p), p); if (pw < 0) throw new Error('That wet bulb is too low for this dry bulb: the air would be drier than dry'); }
  else throw new Error('Give relative humidity, dew point or wet bulb');
  if (pw >= p) throw new Error('Pressure is too low for this temperature');
  const W = humRatio(pw, p), rh = pw / ps;
  const td = pw > 0 ? bisect((x) => pws(x) - pw, -100, t + 1e-9) : -Infinity;
  const tw = given.tw ?? bisect((x) => wFromWetBulb(t, x, p) - W, Math.max(-100, td === -Infinity ? -100 : td - 1), t);
  const v = (287.042 * (t + 273.15) * (1 + 1.607858 * W)) / p;
  return { t, p, W, pw, rh, td, tw, h: enthalpy(t, W), v, vpd: (ps - pw) / 1000, abs: (W / v) * 1000 };
}

/** NWS heat index (°F) from air temperature (°F) and RH (%): Steadman's simple form, Rothfusz regression above 80 °F, with the NWS adjustments. */
export function heatIndexF(T: number, RH: number): number {
  const simple = 0.5 * (T + 61 + (T - 68) * 1.2 + RH * 0.094);
  if ((simple + T) / 2 < 80) return simple;
  let hi = -42.379 + 2.04901523 * T + 10.14333127 * RH - 0.22475541 * T * RH - 6.83783e-3 * T * T - 5.481717e-2 * RH * RH + 1.22874e-3 * T * T * RH + 8.5282e-4 * T * RH * RH - 1.99e-6 * T * T * RH * RH;
  if (RH < 13 && T >= 80 && T <= 112) hi -= ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
  else if (RH > 85 && T >= 80 && T <= 87) hi += ((RH - 85) / 10) * ((87 - T) / 5);
  return hi;
}
export const heatIndexC = (t: number, rhPct: number) => (heatIndexF(t * 1.8 + 32, rhPct) - 32) / 1.8;
/** Environment Canada humidex from air temperature and dew point (°C). */
export const humidex = (t: number, td: number) => t + 0.5555 * (6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (273.15 + td))) - 10);

/**
 * Heating or cooling the air at constant pressure from state a to a new dry bulb t2 (°C).
 * If the air stays above its dew point, the moisture content W stays the same; if not, moisture condenses
 * and the air leaves saturated at t2. Heat q is kJ per kg of dry air (negative = heat removed), and
 * includes the enthalpy of the liquid water drained off at t2 (4.186 kJ/kg per °C). Condensing at or below 0 °C (frost) is not modelled.
 */
export function processTo(a: Air, t2: number) {
  if (!(t2 >= -100 && t2 <= 200)) throw new Error('The final temperature must be between −100 and 200 °C');
  const ps2 = pws(t2), pw2 = a.pw;
  const condenses = pw2 > ps2 + 1e-9;
  if (condenses && t2 <= 0) throw new Error('Cooling below the dew point and below 0 °C makes frost, which this calculator does not model');
  const end = condenses ? air(t2, a.p, { rh: 1 }) : air(t2, a.p, { rh: pw2 / ps2 });
  const water = Math.max(0, a.W - end.W);
  const q = end.h - a.h + water * 4.186 * t2;
  return { end, condenses, water, q };
}
/** Mass flow of dry air in kg/s from a volume flow in m³/h and the specific volume (m³ per kg dry air). */
export const dryAirFlow = (m3h: number, v: number) => m3h / 3600 / v;
export const FT_M = 0.3048;
export const PRESSURE_UNITS: Record<string, { name: string; kPa: number }> = {
  kPa: { name: 'kPa', kPa: 1 }, hPa: { name: 'hPa (mbar)', kPa: 0.1 }, atm: { name: 'atm', kPa: 101.325 }, psi: { name: 'psi', kPa: 6.894757293168 }, inHg: { name: 'inHg', kPa: 3.386389 },
};
