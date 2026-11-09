// "Feels like" temperatures: wind chill, heat index, humidex and apparent temperature.
// - Wind chill: the 2001 JAG/TI wind chill temperature index used by the US National Weather Service and Environment
//   Canada (metric form, wind at 10 m in km/h): W = 13.12 + 0.6215 T − 11.37 V^0.16 + 0.3965 T V^0.16.
//   Defined for T ≤ 10 °C (50 °F) and wind above 4.8 km/h (3 mph), the limits MetPy uses too.
// - Heat index: US NWS method (Steadman's simple formula, then the Rothfusz regression with its two adjustments when
//   the simple value averaged with T reaches 80 °F). Same code as the psychrometric calculator (psychro.ts).
// - Humidex: Environment Canada's formula from the dew point (psychro.ts).
// - Apparent temperature: Steadman (1994) as used by the Australian Bureau of Meteorology (shade, no radiation):
//   AT = T + 0.33 e − 0.70 ws − 4.00, e in hPa, ws in m/s at 10 m.
// - Dew point and relative humidity: Bolton (1980) saturation vapour pressure, as MetPy uses.
// Checked against MetPy 1.7.1 (windchill, heat_index, apparent_temperature, dewpoint_from_relative_humidity).
import { heatIndexF, humidex } from './psychro.ts';

export const F2C = (f: number) => (f - 32) / 1.8;
export const C2F = (c: number) => c * 1.8 + 32;
export type WindUnit = 'kmh' | 'mph' | 'ms' | 'kn';
const TO_KMH: Record<WindUnit, number> = { kmh: 1, mph: 1.609344, ms: 3.6, kn: 1.852 };
export const toKmh = (v: number, u: WindUnit) => v * TO_KMH[u];
export const fromKmh = (v: number, u: WindUnit) => v / TO_KMH[u];

/** Bolton (1980) saturation vapour pressure over water, hPa. */
export const esat = (tC: number) => 6.112 * Math.exp((17.67 * tC) / (tC + 243.5));
/** Dew point (°C) from temperature (°C) and relative humidity (%). */
export function dewPoint(tC: number, rh: number) { const l = Math.log((rh / 100) * esat(tC) / 6.112); return (243.5 * l) / (17.67 - l); }
/** Relative humidity (%) from temperature and dew point (°C). */
export const relHum = (tC: number, tdC: number) => (100 * esat(tdC)) / esat(tC);

/** Wind chill limits: air at 10 °C (50 °F) or colder, wind over 3 mph (4.828 km/h). */
export const WC_TMAX = 10, WC_VMIN = 3 * 1.609344;
/** Wind chill index (°C) from air temperature (°C) and 10 m wind (km/h). */
export function windChill(tC: number, vKmh: number) { const s = vKmh ** 0.16; return 13.12 + 0.6215 * tC - 11.37 * s + 0.3965 * tC * s; }
export const windChillOk = (tC: number, vKmh: number) => tC <= WC_TMAX && vKmh > WC_VMIN;

/** Heat index with the method used: 'simple' (Steadman), 'rothfusz', or Rothfusz with the 'dry' or 'humid' adjustment. */
export function heatIndex(tC: number, rh: number) {
  const T = C2F(tC), simple = 0.5 * (T + 61 + (T - 68) * 1.2 + rh * 0.094);
  const method = (simple + T) / 2 < 80 ? 'simple' : rh < 13 && T >= 80 && T <= 112 ? 'dry' : rh > 85 && T >= 80 && T <= 87 ? 'humid' : 'rothfusz';
  const f = heatIndexF(T, rh);
  return { c: F2C(f), f, method: method as 'simple' | 'rothfusz' | 'dry' | 'humid' };
}
/** The NWS uses the heat index from 80 °F (26.7 °C) up. */
export const HI_TMIN = F2C(80);
export const heatIndexOk = (tC: number) => tC >= HI_TMIN - 1e-9;

/** Environment Canada humidex from temperature and dew point (°C). */
export const humidexC = (tC: number, tdC: number) => humidex(tC, tdC);
/** Humidex is a warm-weather index: Environment Canada uses it when the air is 20 °C or warmer. */
export const humidexOk = (tC: number) => tC >= 20;

/** Australian Bureau of Meteorology apparent temperature (Steadman 1994, shade), °C; wind in km/h at 10 m. */
export function apparentTemp(tC: number, rh: number, vKmh: number) {
  const e = (rh / 100) * 6.105 * Math.exp((17.27 * tC) / (237.7 + tC));
  return tC + 0.33 * e - 0.7 * (vKmh / 3.6) - 4;
}

/** NWS-style single "feels like": wind chill when it applies, the heat index from 80 °F, otherwise the air temperature. */
export function feelsLike(tC: number, rh: number, vKmh: number) {
  if (windChillOk(tC, vKmh)) return { c: windChill(tC, vKmh), from: 'wind chill' };
  if (heatIndexOk(tC)) return { c: heatIndex(tC, rh).c, from: 'heat index' };
  return { c: tC, from: 'air temperature' };
}

// Bands. Wind chill: Environment Canada's risk categories; heat index: NWS; humidex: Environment Canada.
export function wcBand(w: number): [number, string] {
  if (w > -10) return [0, 'low risk'];
  if (w > -28) return [1, 'moderate risk: frostbite unlikely, but dress warmly'];
  if (w > -40) return [2, 'high risk: exposed skin can freeze in 10 to 30 minutes'];
  if (w > -48) return [3, 'very high risk: exposed skin can freeze in 5 to 10 minutes'];
  if (w > -55) return [3, 'severe risk: exposed skin can freeze in 2 to 5 minutes'];
  return [3, 'extreme risk: exposed skin can freeze in under 2 minutes'];
}
export function hiBand(c: number): [number, string] {
  const f = C2F(c);
  if (f < 80) return [0, 'below the caution level'];
  if (f < 91) return [1, 'caution: fatigue possible with long exposure and activity'];
  if (f < 104) return [2, 'extreme caution: heat cramps and heat exhaustion possible'];
  if (f < 125) return [3, 'danger: heat cramps and exhaustion likely, heat stroke possible'];
  return [3, 'extreme danger: heat stroke highly likely'];
}
export function hxBand(h: number): [number, string] {
  if (h < 30) return [0, 'little or no discomfort'];
  if (h < 40) return [1, 'some discomfort'];
  if (h < 46) return [2, 'great discomfort: avoid exertion'];
  return [3, 'dangerous: heat stroke possible'];
}

export type Kind = 'wc' | 'hi' | 'hx' | 'at';
/**
 * A table of one index: rows are air temperatures (°C), columns the second variable (wind in km/h for wind chill and
 * apparent temperature, relative humidity in % for heat index and humidex). Cells outside the index's range are null.
 * `fixed` is the other input that the index needs: RH (%) for apparent temperature.
 */
export function grid(kind: Kind, temps: number[], cols: number[], fixed = 50): (number | null)[][] {
  return temps.map((t) => cols.map((x) => {
    if (kind === 'wc') return windChillOk(t, x) ? windChill(t, x) : null;
    if (kind === 'hi') return heatIndexOk(t) && x >= 0 && x <= 100 ? heatIndex(t, x).c : null;
    if (kind === 'hx') return humidexOk(t) && x > 0 && x <= 100 ? humidexC(t, dewPoint(t, x)) : null;
    return fixed >= 0 && fixed <= 100 ? apparentTemp(t, fixed, x) : null;
  }));
}

/** Evenly spaced values from a to b (inclusive) by step, at most `max` of them; null if the range is unusable. */
export function range(a: number, b: number, step: number, max = 61): number[] | null {
  if (![a, b, step].every(Number.isFinite) || step <= 0 || b < a) return null;
  const n = Math.floor((b - a) / step + 1e-9) + 1;
  if (n > max) return null;
  return Array.from({ length: n }, (_, i) => +(a + i * step).toFixed(10));
}
