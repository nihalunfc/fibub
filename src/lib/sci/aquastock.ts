// Fish stocking density and growth: tank or pond volume, biomass, density, how many fish fit a target density,
// feed conversion ratio (FCR), specific growth rate (SGR) and a harvest projection with exponential growth and a
// steady loss rate. Units: m, m³, g per fish, kg, days. No DOM.

export type Shape = { kind: 'rect'; L: number; W: number; D: number } | { kind: 'round'; d: number; D: number } | { kind: 'volume'; V: number };
/** Water volume in m³. */
export const volume = (s: Shape) => (s.kind === 'rect' ? s.L * s.W * s.D : s.kind === 'round' ? Math.PI * (s.d / 2) ** 2 * s.D : s.V);
/** Biomass in kg from a count and a mean weight in g. */
export const biomass = (count: number, meanG: number) => (count * meanG) / 1000;
/** Most fish of mean weight meanG (g) that keep the density at or below target (kg/m³). */
export const maxFish = (target: number, V: number, meanG: number) => Math.floor((target * V * 1000) / meanG + 1e-9);
/** Feed conversion ratio: feed given ÷ biomass gained (adding the weight of fish that died, if given). */
export function fcr(feedKg: number, startKg: number, endKg: number, deadKg = 0) { const gain = endKg - startKg + deadKg; return gain > 0 ? feedKg / gain : NaN; }
/** Specific growth rate, % per day: 100·(ln W₁ − ln W₀)/days. */
export const sgr = (w0: number, w1: number, days: number) => (100 * (Math.log(w1) - Math.log(w0))) / days;
/** Days to grow from w0 to w1 at a given SGR (% per day). */
export const daysTo = (w0: number, w1: number, sgrPct: number) => Math.log(w1 / w0) / (sgrPct / 100);
/** Daily loss rate (per day) from the % of fish lost per 30 days. */
export const lossRate = (pctPerMonth: number) => -Math.log(1 - pctPerMonth / 100) / 30;

export type ProjIn = { count: number; w0: number; sgr: number; lossPct: number; feedPct: number; V: number; days: number; step: number };
export type ProjRow = { day: number; w: number; n: number; kg: number; density: number; feedDay: number; feedCum: number };
/**
 * Projection with W(t) = W₀·e^(g·t), N(t) = N₀·e^(−m·t), so biomass B(t) = B₀·e^((g−m)·t), feed per day = f·B(t) and
 * cumulative feed = f·B₀·(e^((g−m)t) − 1)/(g − m) (continuous feeding at f % of body weight per day).
 */
export function project(p: ProjIn): ProjRow[] {
  const g = p.sgr / 100, m = lossRate(p.lossPct), r = g - m, f = p.feedPct / 100, B0 = biomass(p.count, p.w0);
  const out: ProjRow[] = [];
  const days = [...Array.from({ length: Math.floor(p.days / p.step) + 1 }, (_, k) => k * p.step)];
  if (days[days.length - 1] !== p.days) days.push(p.days);
  for (const t of days) {
    const w = p.w0 * Math.exp(g * t), n = p.count * Math.exp(-m * t), kg = (n * w) / 1000;
    out.push({ day: t, w, n, kg, density: kg / p.V, feedDay: f * kg, feedCum: Math.abs(r) < 1e-12 ? f * B0 * t : (f * B0 * (Math.exp(r * t) - 1)) / r });
  }
  return out;
}

/** Made-up example values (round numbers, not a recommendation for any species). */
export const EXAMPLE = { shape: { kind: 'round', d: 4, D: 1.2 } as Shape, count: 1500, meanG: 120, target: 40, start: { n: 1500, g: 40 }, end: { n: 1470, g: 120 }, days: 60, feed: 140, dead: 3, feedPct: 2, lossPct: 1, harvestG: 400 };
