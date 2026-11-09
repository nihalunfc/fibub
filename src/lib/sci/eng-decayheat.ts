// Decay heat after reactor shutdown with the Way-Wigner approximation, for study:
//   P(t)/P0 = 0.0622 [ t^−0.2 − (t + T)^−0.2 ]   (t: seconds since shutdown, T: seconds of operation at P0)
// plus its exact integral (energy released over an interval) and the time for the heat to fall below a level.
// Plain TypeScript, no DOM. It is a rough fit, reasonable from about 10 s to a few months after shutdown.

export const WW = 0.0622;
/** Fraction of the operating power still produced t seconds after shutdown, after T seconds of operation (T = Infinity allowed). */
export function fraction(t: number, T: number): number {
  if (!(t > 0)) return NaN;
  return WW * (t ** -0.2 - (Number.isFinite(T) ? (t + T) ** -0.2 : 0));
}

/** Energy released between t1 and t2 seconds after shutdown, as a multiple of P0 × 1 s (so MW·s when P0 is in MW). */
export function energy(t1: number, t2: number, T: number): number {
  const F = (t: number) => (t ** 0.8 - (Number.isFinite(T) ? (t + T) ** 0.8 - T ** 0.8 : 0)) / 0.8; // ∫₀ᵗ of the bracket
  return WW * (F(t2) - F(t1));
}

/** Seconds after shutdown when the fraction first falls to `level` (it falls all the time). NaN if never in [tMin, tMax]. */
export function timeBelow(level: number, T: number, tMin = 1e-3, tMax = 1e12): number {
  const f = (t: number) => fraction(t, T) - level;
  if (!(level > 0) || f(tMin) <= 0) return f(tMin) <= 0 ? tMin : NaN;
  if (f(tMax) > 0) return NaN;
  let a = Math.log(tMin), b = Math.log(tMax);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if (f(Math.exp(m)) > 0) a = m; else b = m; if (b - a < 1e-13) break; }
  return Math.exp((a + b) / 2);
}

/** Rough range where the Way-Wigner fit is usually quoted as fair (seconds after shutdown). */
export const VALID = { from: 10, to: 100 * 86400 };

/** Latent heat of water at 100 °C (MJ/kg), for the boil-off figure. */
export const H_FG = 2.257;

export const TIMES: [string, number][] = [
  ['1 second', 1], ['10 seconds', 10], ['1 minute', 60], ['10 minutes', 600], ['1 hour', 3600], ['8 hours', 8 * 3600],
  ['1 day', 86400], ['1 week', 7 * 86400], ['30 days', 30 * 86400], ['100 days', 100 * 86400], ['1 year', 365.25 * 86400],
];

/** Seconds as a short phrase. */
export function duration(s: number): string {
  if (!Number.isFinite(s)) return '–';
  const u: [number, string][] = [[365.25 * 86400, 'year'], [86400, 'day'], [3600, 'hour'], [60, 'minute'], [1, 'second']];
  for (const [k, name] of u) if (s >= k * 0.999) { const v = s / k, r = v >= 100 ? Math.round(v) : +v.toPrecision(3); return `${r} ${name}${r === 1 ? '' : 's'}`; }
  return `${+s.toPrecision(3)} seconds`;
}
