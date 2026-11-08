// Gas concentration units (ppm, ppb, µg/m³, mg/m³) at any temperature and pressure, and three official air quality
// indices: the US AQI (40 CFR Part 58 Appendix G, PM2.5 breakpoints as revised in 2024), Canada's AQHI (Environment
// and Climate Change Canada formula, with the AQHI+ wildfire rule) and India's National AQI (CPCB, 2014).
// Breakpoints checked against the official sources on 2026-11-08.
import { parseFormula, molarMass } from './chem.ts';

export const R = 8.314462618; // J/(mol·K), exact (CODATA 2018)
/** Molar volume of an ideal gas in L/mol at t °C and p kPa. 24.465 L at 25 °C, 1 atm. */
export const molarVolume = (tC: number, pKPa: number) => (R * (tC + 273.15)) / pKPa;

export type Unit = 'ppm' | 'ppb' | 'ug' | 'mg';
export const UNIT_NAMES: Record<Unit, string> = { ppm: 'ppm', ppb: 'ppb', ug: 'µg/m³', mg: 'mg/m³' };

/** Convert a gas concentration. M in g/mol. */
export function convertGas(v: number, from: Unit, to: Unit, M: number, tC = 25, pKPa = 101.325): number {
  const Vm = molarVolume(tC, pKPa);
  const ppb = from === 'ppb' ? v : from === 'ppm' ? v * 1000 : from === 'ug' ? (v * Vm) / M : (v * 1000 * Vm) / M;
  return to === 'ppb' ? ppb : to === 'ppm' ? ppb / 1000 : to === 'ug' ? (ppb * M) / Vm : (ppb * M) / Vm / 1000;
}

export const GASES: { id: string; name: string; formula: string }[] = [
  { id: 'O3', name: 'Ozone', formula: 'O3' }, { id: 'NO2', name: 'Nitrogen dioxide', formula: 'NO2' }, { id: 'SO2', name: 'Sulfur dioxide', formula: 'SO2' },
  { id: 'CO', name: 'Carbon monoxide', formula: 'CO' }, { id: 'NH3', name: 'Ammonia', formula: 'NH3' }, { id: 'H2S', name: 'Hydrogen sulfide', formula: 'H2S' },
  { id: 'NO', name: 'Nitric oxide', formula: 'NO' }, { id: 'CH4', name: 'Methane', formula: 'CH4' }, { id: 'CO2', name: 'Carbon dioxide', formula: 'CO2' },
  { id: 'HCHO', name: 'Formaldehyde', formula: 'CH2O' }, { id: 'C6H6', name: 'Benzene', formula: 'C6H6' }, { id: 'C7H8', name: 'Toluene', formula: 'C7H8' },
];
export const gasMass = (formula: string) => molarMass(parseFormula(formula));

/** One index scale: concentration breakpoints [lo, hi] for each band, with the index range of the band. */
type Band = { lo: number; hi: number; ilo: number; ihi: number; cat: number };
export type Scale = { bands: Band[]; digits: number; unit: string; avg: string; note?: string };
export type Category = { name: string; color: string };

// ---------- US AQI ----------
export const US_CATS: Category[] = [
  { name: 'Good', color: '#00a651' }, { name: 'Moderate', color: '#c9a200' }, { name: 'Unhealthy for sensitive groups', color: '#e67e00' },
  { name: 'Unhealthy', color: '#d62728' }, { name: 'Very unhealthy', color: '#7b3294' }, { name: 'Hazardous', color: '#7e0023' },
];
const usIdx: [number, number][] = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
const us = (rows: (number[] | null)[], digits: number, unit: string, avg: string, note?: string): Scale => ({
  bands: rows.flatMap((r, i) => (r ? [{ lo: r[0], hi: r[1], ilo: usIdx[i][0], ihi: usIdx[i][1], cat: i }] : [])), digits, unit, avg, note,
});
/** Table 2 of 40 CFR 58 App. G; the hazardous band runs to the AQI-500 concentrations of footnote 4. */
export const US: Record<string, Scale> = {
  'PM2.5': us([[0, 9], [9.1, 35.4], [35.5, 55.4], [55.5, 125.4], [125.5, 225.4], [225.5, 325.4]], 1, 'µg/m³', '24-hour'),
  PM10: us([[0, 54], [55, 154], [155, 254], [255, 354], [355, 424], [425, 604]], 0, 'µg/m³', '24-hour'),
  O3_8h: us([[0, 0.054], [0.055, 0.07], [0.071, 0.085], [0.086, 0.105], [0.106, 0.2], null], 3, 'ppm', '8-hour', 'Above 0.200 ppm, use the 1-hour ozone value.'),
  O3_1h: us([null, null, [0.125, 0.164], [0.165, 0.204], [0.205, 0.404], [0.405, 0.604]], 3, 'ppm', '1-hour', 'Only used above AQI 100; below 0.125 ppm use 8-hour ozone.'),
  CO: us([[0, 4.4], [4.5, 9.4], [9.5, 12.4], [12.5, 15.4], [15.5, 30.4], [30.5, 50.4]], 1, 'ppm', '8-hour'),
  SO2: us([[0, 35], [36, 75], [76, 185], [186, 304], null, null], 0, 'ppb', '1-hour', 'Above 304 ppb the AQI uses 24-hour SO₂, which this tool does not cover.'),
  NO2: us([[0, 53], [54, 100], [101, 360], [361, 649], [650, 1249], [1250, 2049]], 0, 'ppb', '1-hour'),
};

// ---------- India National AQI ----------
export const IN_CATS: Category[] = [
  { name: 'Good', color: '#00a651' }, { name: 'Satisfactory', color: '#7cb342' }, { name: 'Moderately polluted', color: '#c9a200' },
  { name: 'Poor', color: '#e67e00' }, { name: 'Very poor', color: '#d62728' }, { name: 'Severe', color: '#7e0023' },
];
const inIdx: [number, number][] = [[0, 50], [51, 100], [101, 200], [201, 300], [301, 400]];
/** [low, high] of each band, Good to Very poor, as in the CPCB table; above the last band is Severe ("401+"). */
const ind = (rows: [number, number][], digits: number, unit: string, avg: string, note?: string): Scale => ({
  bands: rows.map((r, i) => ({ lo: r[0], hi: r[1], ilo: inIdx[i][0], ihi: inIdx[i][1], cat: i })), digits, unit, avg, note,
});
export const IN: Record<string, Scale> = {
  PM10: ind([[0, 50], [51, 100], [101, 250], [251, 350], [351, 430]], 0, 'µg/m³', '24-hour'),
  'PM2.5': ind([[0, 30], [31, 60], [61, 90], [91, 120], [121, 250]], 0, 'µg/m³', '24-hour'),
  NO2: ind([[0, 40], [41, 80], [81, 180], [181, 280], [281, 400]], 0, 'µg/m³', '24-hour'),
  O3_8h: ind([[0, 50], [51, 100], [101, 168], [169, 208], [209, 748]], 0, 'µg/m³', '8-hour'),
  CO: ind([[0, 1], [1.1, 2], [2.1, 10], [10.1, 17], [17.1, 34]], 1, 'mg/m³', '8-hour'),
  SO2: ind([[0, 40], [41, 80], [81, 380], [381, 800], [801, 1600]], 0, 'µg/m³', '24-hour'),
  NH3: ind([[0, 200], [201, 400], [401, 800], [801, 1200], [1201, 1800]], 0, 'µg/m³', '24-hour'),
};

export type Sub = { index: number; cat: number; text: string; note?: string } | null;
const trunc = (v: number, d: number) => Math.floor(v * 10 ** d + 1e-9) / 10 ** d;

/** US sub-index: truncate, find the band, interpolate, round. Null when the value is outside what the scale defines. */
export function usSub(key: string, c: number): Sub {
  const s = US[key]; if (!s || !(c >= 0)) return null;
  const v = trunc(c, s.digits);
  const top = s.bands[s.bands.length - 1];
  if (v > top.hi) {
    if (top.ihi === 500) { const b = top, I = Math.round(b.ilo + ((b.ihi - b.ilo) * (v - b.lo)) / (b.hi - b.lo)); return { index: I, cat: 5, text: `${I}`, note: 'beyond the top of the scale' }; }
    return { index: NaN, cat: top.cat, text: 'off scale', note: s.note };
  }
  const b = s.bands.find((x) => v >= x.lo && v <= x.hi);
  if (!b) return v < s.bands[0].lo ? { index: NaN, cat: -1, text: 'not used', note: s.note } : null;
  const I = Math.round(b.ilo + ((b.ihi - b.ilo) * (v - b.lo)) / (b.hi - b.lo));
  return { index: I, cat: b.cat, text: String(I) };
}

/** India sub-index: round to the table's precision, find the band, interpolate; Severe above the last band. */
export function inSub(key: string, c: number): Sub {
  const s = IN[key]; if (!s || !(c >= 0)) return null;
  const v = Math.round(c * 10 ** s.digits) / 10 ** s.digits;
  const last = s.bands[s.bands.length - 1];
  if (v > last.hi) return { index: 401, cat: 5, text: '401+', note: 'Severe' };
  const b = [...s.bands].reverse().find((x) => v >= x.lo)!;
  const I = Math.round(b.ilo + ((b.ihi - b.ilo) * (v - b.lo)) / (b.hi - b.lo));
  return { index: I, cat: b.cat, text: String(I) };
}

// ---------- Canada AQHI ----------
export const AQHI_CATS: Category[] = [
  { name: 'Low risk', color: '#00a651' }, { name: 'Moderate risk', color: '#c9a200' }, { name: 'High risk', color: '#d62728' }, { name: 'Very high risk', color: '#7e0023' },
];
/** Three-hour averages: NO₂ and O₃ in ppb, PM2.5 in µg/m³. Unrounded value. */
export const aqhiRaw = (no2: number, o3: number, pm: number) => (1000 / 10.4) * (Math.expm1(0.000871 * no2) + Math.expm1(0.000537 * o3) + Math.expm1(0.000487 * pm));
/** AQHI+ (wildfire smoke): ceiling of the 1-hour PM2.5 divided by 10, at least 1. */
export const aqhiPlus = (pm1h: number) => Math.max(1, Math.ceil(pm1h / 10));
export const aqhiCat = (a: number) => (a <= 3 ? 0 : a <= 6 ? 1 : a <= 10 ? 2 : 3);
export const aqhiText = (a: number) => (a > 10 ? '10+' : String(a));
export function aqhi(no2: number, o3: number, pm3h: number, pm1h?: number) {
  const raw = aqhiRaw(no2, o3, pm3h), base = Math.max(1, Math.round(raw));
  const plus = pm1h !== undefined && pm1h >= 0 ? aqhiPlus(pm1h) : NaN;
  const value = Number.isFinite(plus) ? Math.max(base, plus) : base;
  return { raw, base, plus, value, cat: aqhiCat(value) };
}
