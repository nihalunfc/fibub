// Pond oxygen budget for one night: dissolved oxygen (DO) saturation from temperature, salinity and altitude
// (Benson and Krause 1984, with their pressure correction, as used in Standard Methods and by the USGS), then a
// mass balance from dusk to dawn: fish, water-column and sediment respiration, surface reaeration and aeration.
//   dC/dt = a·(Cs − C) − R + A,  a = K_L / depth
// with C in mg/L and t in hours, solved exactly. Rates are the user's (example values are made up). No DOM.

/** DO saturation at 1 atm, mg/L, Benson and Krause (1984); t in °C, S salinity (g/kg). */
export function doSat1atm(t: number, S = 0): number {
  const T = t + 273.15;
  const lnC = -139.34411 + 1.575701e5 / T - 6.642308e7 / T ** 2 + 1.2438e10 / T ** 3 - 8.621949e11 / T ** 4 - S * (0.017674 - 10.754 / T + 2140.7 / T ** 2);
  return Math.exp(lnC);
}
/** Barometric pressure (atm) at an altitude in m, from the standard atmosphere. */
export const pressureAtm = (h: number) => (1 - 2.25577e-5 * h) ** 5.25588;
/** DO saturation (mg/L) at pressure P atm: Benson and Krause's correction for water vapour and non-ideal oxygen. */
export function doSat(t: number, S = 0, P = 1): number {
  const T = t + 273.15;
  const pwv = Math.exp(11.8571 - 3840.7 / T - 216961 / T ** 2);
  const th = 0.000975 - 1.426e-5 * t + 6.436e-8 * t * t;
  return doSat1atm(t, S) * P * ((1 - pwv / P) * (1 - th * P)) / ((1 - pwv) * (1 - th));
}

export type Night = {
  area: number;      // m²
  depth: number;     // mean depth, m
  temp: number; sal: number; alt: number;
  c0: number;        // DO at dusk, mg/L
  hours: number;     // dusk to dawn
  cmin: number;      // lowest DO you accept, mg/L
  fishKg: number;    // fish biomass, kg
  fishRate: number;  // fish oxygen use, mg O₂ per kg fish per hour
  water: number;     // water-column (plankton) respiration, mg/L per hour
  sod: number;       // sediment oxygen demand, g O₂ per m² per day
  kl: number;        // surface transfer velocity, m per hour
  aer: number;       // aeration already running, kg O₂ per hour delivered to the water
};
export type Budget = {
  V: number; cs: number; satPct: number; a: number;
  fish: number; water: number; sed: number; aer: number; demand: number; // mg/L per hour
  ceq: number; dawn: number; hitMin: number; hitZero: number;           // mg/L, hours
  extraKgH: number; extraMgLH: number; already: boolean;
};

/** DO after t hours with net loss R (demand − aeration, mg/L/h), reaeration coefficient a (1/h). Clamped at 0. */
export function doAt(t: number, c0: number, cs: number, a: number, R: number): number {
  const c = a > 0 ? cs - R / a + (c0 - cs + R / a) * Math.exp(-a * t) : c0 - R * t;
  return Math.max(0, c);
}
/** Hours until DO first falls to level (Infinity if it never does). */
export function timeTo(level: number, c0: number, cs: number, a: number, R: number): number {
  if (c0 <= level) return 0;
  if (a > 0) { const ceq = cs - R / a; if (ceq >= level) return Infinity; return Math.log((level - ceq) / (c0 - ceq)) / -a; }
  return R > 0 ? (c0 - level) / R : Infinity;
}

export function budget(n: Night): Budget {
  const V = n.area * n.depth, cs = doSat(n.temp, n.sal, pressureAtm(n.alt)), a = n.kl / n.depth;
  const fish = (n.fishKg * n.fishRate) / (V * 1000), sed = n.sod / n.depth / 24, aer = (1000 * n.aer) / V, water = n.water;
  const demand = fish + water + sed, R = demand - aer;
  const ceq = a > 0 ? cs - R / a : NaN;
  const T = n.hours, e = Math.exp(-a * T);
  // Extra constant supply A (mg/L/h) so that DO at dawn equals cmin.
  const D = a > 0 ? (cs - n.cmin - (cs - n.c0) * e) / (1 - e) : NaN;
  const need = a > 0 ? R - a * D : R - (n.c0 - n.cmin) / T;
  const extraMgLH = Math.max(0, need);
  return {
    V, cs, satPct: (100 * n.c0) / cs, a, fish, water, sed, aer, demand, ceq,
    dawn: doAt(T, n.c0, cs, a, R), hitMin: timeTo(n.cmin, n.c0, cs, a, R), hitZero: timeTo(0, n.c0, cs, a, R),
    extraMgLH, extraKgH: (extraMgLH * V) / 1000, already: n.c0 < n.cmin,
  };
}

/** DO through the night, every `step` hours, with net loss R and optional extra supply (mg/L/h). */
export function curve(n: Night, b: Budget, extra = 0, step = 0.25): { t: number[]; c: number[] } {
  const t: number[] = [], c: number[] = [], R = b.demand - b.aer - extra;
  for (let k = 0; k <= Math.round(n.hours / step); k++) { const x = Math.min(n.hours, k * step); t.push(x); c.push(doAt(x, n.c0, b.cs, b.a, R)); }
  return { t, c };
}

/** Made-up round example values (not measurements or recommended rates). */
export const EXAMPLE: Night = { area: 5000, depth: 1.2, temp: 28, sal: 0, alt: 0, c0: 9, hours: 11, cmin: 3, fishKg: 6000, fishRate: 300, water: 0.3, sod: 1, kl: 0.01, aer: 0 };
