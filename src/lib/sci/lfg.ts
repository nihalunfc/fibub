// Landfill gas from first-order decay. Waste placed evenly through each year; methane is generated at
// k·L0·M·e^(−k·age). The yearly totals are the exact integrals over each calendar year, so all of L0·M is released
// in the end. Volumes are at the reference condition that L0 is quoted for. No DOM.

/** Share of one year's waste that becomes methane during calendar year n (placed through year i). */
export function yearShare(k: number, age: number) {
  if (age < 0) return 0;
  if (age === 0) return 1 - (1 - Math.exp(-k)) / k;
  return ((1 - Math.exp(-k)) * (Math.exp(k) - 1) / k) * Math.exp(-k * age);
}

/** Methane generated each year from `from` to `to` (m³ when L0 is in m³ per tonne). */
export function generation(years: number[], tonnes: number[], k: number, L0: number, from: number, to: number) {
  const out: { year: number; ch4: number }[] = [];
  for (let n = from; n <= to; n++) {
    let q = 0;
    years.forEach((y, i) => { q += tonnes[i] * L0 * yearShare(k, n - y); });
    out.push({ year: n, ch4: q });
  }
  return out;
}

/** Ideal-gas density of methane (kg/m³) at a temperature in °C and 101.325 kPa. */
export const ch4Density = (tC: number) => (101325 * 0.016043) / (8.314462618 * (tC + 273.15));

/** Split a year's methane into collected, oxidised in the cover and emitted. */
export function fate(ch4: number, collect: number, oxid: number) {
  const collected = ch4 * collect, rest = ch4 - collected, oxidised = rest * oxid;
  return { collected, oxidised, emitted: rest - oxidised };
}

/** Half-life of the waste (years) for a decay rate k. */
export const halfLife = (k: number) => Math.LN2 / k;
