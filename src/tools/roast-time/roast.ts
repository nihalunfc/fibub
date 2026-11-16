// Roast time maths for #T865. Plain TypeScript, no DOM.
export const LB = 2.20462;

/** USDA FSIS turkey roasting chart at 325 °F, minutes, by weight band in lb: [from lb, to lb, min minutes, max minutes] (low inclusive, high exclusive; the last band includes its top). */
export const UNSTUFFED: number[][] = [[4, 8, 90, 195], [8, 12, 165, 180], [12, 14, 180, 225], [14, 18, 225, 255], [18, 20, 255, 270], [20, 24, 270, 300]];
export const STUFFED: number[][] = [[6, 8, 150, 210], [8, 12, 180, 210], [12, 14, 210, 240], [14, 18, 240, 255], [18, 20, 255, 285], [20, 24, 285, 315]];

/** Resting time in minutes used for planning (the longer end of the advice shown on the page). */
export const REST_MIN: Record<string, number> = { turkey: 20, chicken: 15, beef: 20, pork: 15, lamb: 20 };

export type Band = { from: number; to: number; lo: number; hi: number };
/** The turkey chart row for a weight in lb: a band, or 'below' / 'above' the chart. */
export function turkeyBand(lb: number, stuffed: boolean): Band | 'below' | 'above' {
  const T = stuffed ? STUFFED : UNSTUFFED, last = T[T.length - 1];
  if (lb < T[0][0]) return 'below';
  if (lb > last[1]) return 'above';
  const b = T.find((t) => lb < t[1] || t === last)!;
  return { from: b[0], to: b[1], lo: b[2], hi: b[3] };
}

/** Time range in minutes for a rule-of-thumb meat: minutes per unit from `lo` to `hi`, times the weight. NaN when invalid. */
export function ruleRange(lo: number, hi: number, weight: number): [number, number] {
  return weight > 0 && lo > 0 && hi >= lo ? [lo * weight, hi * weight] : [NaN, NaN];
}

/** Round minutes to the nearest 5 and write them as "3 h 45 min". */
export function hm(m: number): string {
  m = Math.round(m / 5) * 5;
  const h = Math.floor(m / 60), r = m % 60;
  return h ? (r ? `${h} h ${r} min` : `${h} h`) : `${r} min`;
}

/** "1:45 pm" for minutes since midnight; a value before midnight gets "(the day before)", one after "(next day)". */
export function clock(min: number): string {
  const day = Math.floor(min / 1440), m = ((Math.round(min) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60), mm = m % 60, h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${h24 < 12 ? 'am' : 'pm'}${day < 0 ? ' (the day before)' : day > 0 ? ' (next day)' : ''}`;
}

/** Parse "18:30" from a time box into minutes since midnight; NaN when blank or bad. */
export function parseClock(s: string): number {
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!m || +m[1] > 23 || +m[2] > 59) return NaN;
  return +m[1] * 60 + +m[2];
}

/** When to put the roast in so it is rested and ready to carve at `serveMin` (minutes since midnight), allowing the longest cooking time. */
export function startPlan(serveMin: number, cookLo: number, cookHi: number, restMin: number): { start: number; outLo: number; outHi: number } {
  return { start: serveMin - restMin - cookHi, outLo: serveMin - restMin - (cookHi - cookLo), outHi: serveMin - restMin };
}

/** Thawing times for a turkey, from USDA FSIS: fridge 24 hours per 4 to 5 lb, cold water 30 minutes per lb. */
export function thaw(lb: number): { fridgeHoursLo: number; fridgeHoursHi: number; waterHours: number } {
  return { fridgeHoursLo: (lb / 5) * 24, fridgeHoursHi: (lb / 4) * 24, waterHours: lb / 2 };
}

/** Rows of times for other weights. Turkey uses the chart (lb); others use the rule, in `unit`. */
export function timeTable(meat: string, unit: 'kg' | 'lb', stuffed: boolean, lo: number, hi: number): { weight: string; range: string }[] {
  if (meat === 'turkey') {
    return [8, 10, 12, 14, 16, 18, 20, 22, 24].map((lb) => {
      const b = turkeyBand(lb, stuffed);
      return { weight: unit === 'kg' ? `${lb} lb (${Math.round((lb / LB) * 10) / 10} kg)` : `${lb} lb`, range: typeof b === 'string' ? '-' : `${hm(b.lo)} to ${hm(b.hi)}` };
    });
  }
  const ws = unit === 'kg' ? [1, 1.5, 2, 2.5, 3, 4] : [2, 3, 4, 5, 6, 8];
  return ws.map((w) => { const [a, z] = ruleRange(lo, hi, w); return { weight: `${w} ${unit}`, range: Number.isFinite(a) ? `${hm(a)} to ${hm(z)}` : '-' }; });
}
