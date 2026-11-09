// Canadian Forest Fire Weather Index (FWI) System: the six standard codes and indices from daily noon weather,
// following the equations of C. E. Van Wagner (1987), Development and structure of the Canadian Forest Fire Weather
// Index System, Canadian Forestry Service Forestry Technical Report 35 (equation numbers below are his), and
// Van Wagner and Pickett (1985). Equations 12 and 15 are written as in the Canadian Forest Service's cffdrs code
// (Wang, Anderson and Suddaby 2015), 280/e^(0.023·P) and 43.43·(5.6348 − ln(M − 20)), the same as Van Wagner's
// printed forms up to rounding of the constants. Day-length factors are the standard ones of the system (built for about 46° N).

/** Effective day lengths for the DMC (hours), January to December. */
export const LE = [6.5, 7.5, 9.0, 12.8, 13.9, 13.9, 12.4, 10.9, 9.4, 8.0, 7.0, 6.0];
/** Day-length adjustments for the DC, January to December. */
export const LF = [-1.6, -1.6, -1.6, 0.9, 3.8, 5.8, 6.4, 5.0, 2.4, 0.4, -1.6, -1.6];

/** Fine Fuel Moisture Code from yesterday's FFMC and today's noon temperature (°C), RH (%), wind (km/h), 24 h rain (mm). */
export function ffmc(F0: number, T: number, H: number, W: number, ro: number): number {
  let mo = (147.2 * (101 - F0)) / (59.5 + F0); // eq 1
  if (ro > 0.5) {
    const rf = ro - 0.5; // eq 2
    const add = 42.5 * rf * Math.exp(-100 / (251 - mo)) * (1 - Math.exp(-6.93 / rf));
    mo = mo > 150 ? mo + add + 0.0015 * (mo - 150) ** 2 * Math.sqrt(rf) : mo + add; // eq 3a, 3b
    if (mo > 250) mo = 250;
  }
  const ed = 0.942 * H ** 0.679 + 11 * Math.exp((H - 100) / 10) + 0.18 * (21.1 - T) * (1 - Math.exp(-0.115 * H)); // eq 4
  let m: number;
  if (mo > ed) {
    const ko = 0.424 * (1 - (H / 100) ** 1.7) + 0.0694 * Math.sqrt(W) * (1 - (H / 100) ** 8); // eq 6a
    const kd = ko * 0.581 * Math.exp(0.0365 * T); // eq 6b
    m = ed + (mo - ed) * 10 ** -kd; // eq 8
  } else {
    const ew = 0.618 * H ** 0.753 + 10 * Math.exp((H - 100) / 10) + 0.18 * (21.1 - T) * (1 - Math.exp(-0.115 * H)); // eq 5
    if (mo < ew) {
      const k1 = 0.424 * (1 - ((100 - H) / 100) ** 1.7) + 0.0694 * Math.sqrt(W) * (1 - ((100 - H) / 100) ** 8); // eq 7a
      const kw = k1 * 0.581 * Math.exp(0.0365 * T); // eq 7b
      m = ew - (ew - mo) * 10 ** -kw; // eq 9
    } else m = mo;
  }
  return Math.min(101, Math.max(0, (59.5 * (250 - m)) / (147.2 + m))); // eq 10
}

/** Duff Moisture Code. `month` is 1 to 12. */
export function dmc(P0: number, T: number, H: number, ro: number, month: number): number {
  let Pr = P0;
  if (ro > 1.5) {
    const re = 0.92 * ro - 1.27; // eq 11
    const Mo = 20 + 280 / Math.exp(0.023 * P0); // eq 12
    const b = P0 <= 33 ? 100 / (0.5 + 0.3 * P0) : P0 <= 65 ? 14 - 1.3 * Math.log(P0) : 6.2 * Math.log(P0) - 17.2; // eq 13a-c
    const Mr = Mo + (1000 * re) / (48.77 + b * re); // eq 14
    Pr = Math.max(0, 43.43 * (5.6348 - Math.log(Mr - 20))); // eq 15
  }
  const K = T < -1.1 ? 0 : 1.894 * (T + 1.1) * (100 - H) * LE[month - 1] * 1e-6; // eq 16
  return Math.max(0, Pr + 100 * K); // eq 17
}

/** Drought Code. */
export function dc(D0: number, T: number, ro: number, month: number): number {
  let Dr = D0;
  if (ro > 2.8) {
    const rd = 0.83 * ro - 1.27; // eq 18
    const Qo = 800 * Math.exp(-D0 / 400); // eq 19
    const Qr = Qo + 3.937 * rd; // eq 20
    Dr = Math.max(0, 400 * Math.log(800 / Qr)); // eq 21
  }
  const V = Math.max(0, 0.36 * (Math.max(T, -2.8) + 2.8) + LF[month - 1]); // eq 22
  return Math.max(0, Dr + 0.5 * V); // eq 23
}

/** Initial Spread Index from wind (km/h) and FFMC. */
export function isi(W: number, F: number): number {
  const m = (147.2 * (101 - F)) / (59.5 + F); // eq 1
  const fF = 91.9 * Math.exp(-0.1386 * m) * (1 + m ** 5.31 / 4.93e7); // eq 25
  return 0.208 * Math.exp(0.05039 * W) * fF; // eq 24, 26
}

/** Buildup Index from DMC and DC. */
export function bui(P: number, D: number): number {
  if (P === 0 && D === 0) return 0;
  const U = P <= 0.4 * D ? (0.8 * P * D) / (P + 0.4 * D) : P - (1 - (0.8 * D) / (P + 0.4 * D)) * (0.92 + (0.0114 * P) ** 1.7); // eq 27a, 27b
  return Math.max(0, U);
}

/** Fire Weather Index from ISI and BUI. */
export function fwi(R: number, U: number): number {
  const fD = U <= 80 ? 0.626 * U ** 0.809 + 2 : 1000 / (25 + 108.64 * Math.exp(-0.023 * U)); // eq 28a, 28b
  const B = 0.1 * R * fD; // eq 29
  return B > 1 ? Math.exp(2.72 * (0.434 * Math.log(B)) ** 0.647) : B; // eq 30a, 30b
}

/** Daily Severity Rating (Van Wagner 1970). */
export const dsr = (S: number) => 0.0272 * S ** 1.77;

export type Day = { month: number; T: number; H: number; W: number; rain: number; label?: string };
export type FwiDay = Day & { ffmc: number; dmc: number; dc: number; isi: number; bui: number; fwi: number; dsr: number };

/** Run the system over a series of days from start-up codes (85, 6 and 15 are the usual spring start-up values). */
export function fwiSeries(days: Day[], start = { ffmc: 85, dmc: 6, dc: 15 }): FwiDay[] {
  let F = start.ffmc, P = start.dmc, D = start.dc;
  return days.map((d) => {
    const H = Math.min(100, Math.max(0, d.H));
    F = ffmc(F, d.T, H, d.W, d.rain); P = dmc(P, d.T, H, d.rain, d.month); D = dc(D, d.T, d.rain, d.month);
    const R = isi(d.W, F), U = bui(P, D), S = fwi(R, U);
    return { ...d, ffmc: F, dmc: P, dc: D, isi: R, bui: U, fwi: S, dsr: dsr(S) };
  });
}
