// Wet-bulb globe temperature and wet-bulb temperature. Plain maths, no DOM. Temperatures in deg C.
/** Outdoor with sun: 0.7 Tnw + 0.2 Tg + 0.1 Ta (ISO 7243, NIOSH 2016). */
export const wbgtOutdoor = (tnw: number, tg: number, ta: number) => 0.7 * tnw + 0.2 * tg + 0.1 * ta;
/** Indoor or in shade: 0.7 Tnw + 0.3 Tg. */
export const wbgtIndoor = (tnw: number, tg: number) => 0.7 * tnw + 0.3 * tg;
/** Water vapour pressure in hPa from air temperature (C) and relative humidity (%), as used by the Australian Bureau of Meteorology. */
export const vapourPressure = (ta: number, rh: number) => (rh / 100) * 6.105 * Math.exp((17.27 * ta) / (237.7 + ta));
/** Shade estimate from air temperature and humidity: 0.567 Ta + 0.393 e + 3.94. */
export const wbgtEstimate = (ta: number, rh: number) => 0.567 * ta + 0.393 * vapourPressure(ta, rh) + 3.94;
/** Stull (2011) wet-bulb temperature, valid for RH 5 to 99 % and T -20 to 50 C at sea-level pressure. */
export function stullWetBulb(t: number, rh: number) {
  return t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) + Math.atan(t + rh) - Math.atan(rh - 1.676331) + 0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) - 4.686035;
}
export type Flag = { id: 'white' | 'green' | 'yellow' | 'red' | 'black'; name: string; min: number };
export const FLAGS: Flag[] = [
  { id: 'white', name: 'White', min: -Infinity }, { id: 'green', name: 'Green', min: 27.8 }, { id: 'yellow', name: 'Yellow', min: 29.4 },
  { id: 'red', name: 'Red', min: 31.1 }, { id: 'black', name: 'Black', min: 32.2 },
];
export const flagFor = (wbgtC: number) => [...FLAGS].reverse().find((f) => wbgtC >= f.min)!;
export const cToF = (c: number) => c * 9 / 5 + 32;
export const fToC = (f: number) => (f - 32) * 5 / 9;
