// Sound in air: the speed of sound, and the pure-tone atmospheric absorption coefficient written from the formula in
// ISO 9613-1:1993 (relaxation frequencies of oxygen and nitrogen). Formula only; no tables are copied. No DOM.

/** Speed of sound in dry air (m/s) at a temperature in °C, c = 331.3 √(1 + θ/273.15). */
export const soundSpeed = (tC: number) => 331.3 * Math.sqrt(1 + tC / 273.15);

/** Saturation vapour pressure over reference pressure, as ISO 9613-1 writes it (T in kelvin). */
export function psatRatio(TK: number) {
  const C = -6.8346 * Math.pow(273.16 / TK, 1.261) + 4.6151;
  return Math.pow(10, C);
}

/**
 * Atmospheric absorption of a pure tone, in dB per metre.
 * f in Hz, temperature in °C, relative humidity in % (0 to 100), pressure in kPa (101.325 at sea level).
 * Also returns the molar concentration of water vapour h (%) and the relaxation frequencies (Hz).
 */
export function airAbsorption(f: number, tC = 20, rh = 50, pKPa = 101.325) {
  const T = tC + 273.15, T0 = 293.15, pr = 101.325, pa = pKPa / pr;
  const h = (rh * psatRatio(T)) / pa;
  const frO = pa * (24 + (4.04e4 * h * (0.02 + h)) / (0.391 + h));
  const frN = pa * Math.pow(T / T0, -0.5) * (9 + 280 * h * Math.exp(-4.17 * (Math.pow(T / T0, -1 / 3) - 1)));
  const f2 = f * f;
  const alpha = 8.686 * f2 * (1.84e-11 / pa * Math.sqrt(T / T0) + Math.pow(T / T0, -2.5) * (
    (0.01275 * Math.exp(-2239.1 / T)) / (frO + f2 / frO) + (0.1068 * Math.exp(-3352.0 / T)) / (frN + f2 / frN)));
  return { alpha, h, frO, frN };
}

/** The intensity attenuation coefficient m (1/m) used in reverberation formulas (4mV), from α in dB/m: m = α / (10 lg e). */
export const mFromAlpha = (alphaDbPerM: number) => alphaDbPerM / (10 * Math.LOG10E);

/** Energy (incoherent) sum of levels in dB. */
export const dbSum = (L: number[]) => 10 * Math.log10(L.reduce((s, x) => s + Math.pow(10, x / 10), 0));
