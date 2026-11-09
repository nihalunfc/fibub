// Irrigation scheduling by a daily root-zone water balance (the FAO-56 "checkbook", single crop coefficient):
// crop water use ETc = Kc × ET0, total available water TAW = 1000 (θFC − θWP) Zr, readily available water
// RAW = p × TAW, water stress Ks when depletion passes RAW, effective rain, deep percolation when the root zone is
// over-filled, and irrigation when the depletion reaches a trigger. No DOM.
import { num, parseTable } from './num.ts';

export type Day = { date: string; et0: number; rain: number; kc?: number; irr?: number };
export type Soil = { fc: number; wp: number; zr: number; p: number; adjustP: boolean };
export type Opts = {
  kc: number;
  /** Depletion at the start, mm. */
  d0: number;
  /** Share of rain that counts (0 to 1), and rain below this many mm is ignored. */
  rainFrac: number; rainMin: number;
  /** auto: irrigate when the depletion reaches trigger × RAW; none: only follow the balance. */
  mode: 'auto' | 'none';
  trigger: number;
  /** Depletion left after an irrigation, mm (0 = refill to field capacity). */
  refill: number;
  /** Application efficiency, 0 to 1: gross = net / efficiency. Also applied to the irrigation column. */
  eff: number;
};
export type Row = {
  date: string; et0: number; kc: number; etc: number; ks: number; eta: number; rain: number; pe: number;
  irrIn: number; irrNet: number; irrGross: number; dp: number; dStart: number; dPre: number; d: number; taw: number; raw: number; p: number;
};

export const taw = (s: Soil) => 1000 * (s.fc - s.wp) * s.zr;
/** FAO-56 adjustment of the depletion fraction for the day's ETc (mm/day), kept between 0.1 and 0.8. */
export const pAdjusted = (p: number, etc: number) => Math.min(0.8, Math.max(0.1, p + 0.04 * (5 - etc)));

export function balance(days: Day[], s: Soil, o: Opts): Row[] {
  const T = taw(s), out: Row[] = [];
  let D = Math.min(Math.max(0, o.d0), T);
  for (const day of days) {
    const kc = day.kc ?? o.kc, etc = kc * day.et0;
    const p = s.adjustP ? pAdjusted(s.p, etc) : s.p, R = p * T;
    const dStart = D;
    const ks = D > R ? Math.max(0, (T - D) / ((1 - p) * T)) : 1;
    let eta = ks * etc;
    const pe = day.rain >= o.rainMin ? day.rain * o.rainFrac : 0;
    const irrNetIn = (day.irr ?? 0) * o.eff;
    D = D - pe - irrNetIn + eta;
    let dp = 0;
    if (D < 0) { dp = -D; D = 0; }
    if (D > T) { eta -= D - T; D = T; }
    const dPre = D;
    let irrNet = 0;
    if (o.mode === 'auto' && D >= o.trigger * R - 1e-9 && D > o.refill) { irrNet = D - o.refill; D = o.refill; }
    out.push({ date: day.date, et0: day.et0, kc, etc, ks, eta, rain: day.rain, pe, irrIn: day.irr ?? 0, irrNet, irrGross: irrNet / o.eff, dp, dStart, dPre, d: D, taw: T, raw: R, p });
  }
  return out;
}

/** Find the columns of a daily table by their names. */
export function columns(head: string[]) {
  const f = (re: RegExp) => head.findIndex((h) => re.test(h.trim().toLowerCase()));
  return { date: f(/^(date|day)/), et0: f(/^(et0|eto|et₀|ref|pet|reference)/), rain: f(/^(rain|precip|p\b|ppt)/), kc: f(/^kc/), irr: f(/^irr/) };
}

/** Days from a pasted table. Without a header the columns are date (optional), ET0, rain, Kc (optional). */
export function readDays(text: string): { days: Day[]; skipped: number; error: string; hasKc: boolean; hasIrr: boolean } {
  const rows = parseTable(text).filter((r) => r.some((c) => c !== ''));
  if (!rows.length) return { days: [], skipped: 0, error: 'Paste a table with one row per day: date, ET0 and rain.', hasKc: false, hasIrr: false };
  const header = rows[0].some((c) => c !== '' && Number.isNaN(num(c)) && !/^\d{4}-\d\d-\d\d$/.test(c.trim()));
  let C: ReturnType<typeof columns>;
  if (header) {
    C = columns(rows[0]);
    if (C.et0 < 0 || C.rain < 0) return { days: [], skipped: 0, error: 'Name the columns ET0 and rain (and, if you have them, date, Kc and irrigation).', hasKc: false, hasIrr: false };
  } else {
    const dated = Number.isNaN(num(rows[0][0]));
    C = dated ? { date: 0, et0: 1, rain: 2, kc: rows[0].length > 3 ? 3 : -1, irr: -1 } : { date: -1, et0: 0, rain: 1, kc: rows[0].length > 2 ? 2 : -1, irr: -1 };
  }
  const days: Day[] = []; let skipped = 0;
  for (const r of header ? rows.slice(1) : rows) {
    const et0 = num(r[C.et0]), rainRaw = (r[C.rain] ?? '').trim(), rain = rainRaw === '' ? 0 : num(rainRaw);
    const kc = C.kc >= 0 && (r[C.kc] ?? '').trim() !== '' ? num(r[C.kc]) : undefined;
    const irr = C.irr >= 0 && (r[C.irr] ?? '').trim() !== '' ? num(r[C.irr]) : undefined;
    if (!(et0 >= 0 && et0 < 30) || !(rain >= 0 && rain < 1000) || (kc !== undefined && !(kc >= 0 && kc < 3)) || (irr !== undefined && !(irr >= 0 && irr < 1000))) { skipped++; continue; }
    days.push({ date: C.date >= 0 ? (r[C.date] ?? '').trim() : `Day ${days.length + 1}`, et0, rain, kc, irr });
  }
  return { days, skipped, error: days.length ? '' : 'No usable days: each row needs ET0 (0 to 30 mm) and rain (blank or 0 or more).', hasKc: C.kc >= 0, hasIrr: C.irr >= 0 };
}

/** A made-up summer of daily ET0 and rain (mm), drawn at random by fibub, not from any real station. */
export const EXAMPLE = 'date,ET0 (mm),rain (mm)\n' + '2026-06-01,4.8,0\n2026-06-02,5.6,0\n2026-06-03,3.5,1.4\n2026-06-04,4.9,0\n2026-06-05,4.6,0\n2026-06-06,5.9,0\n2026-06-07,3.6,0\n2026-06-08,3.4,0\n2026-06-09,6.4,0\n2026-06-10,4.0,7.5\n2026-06-11,5.8,0\n2026-06-12,5.4,0\n2026-06-13,4.8,0\n2026-06-14,5.4,0\n2026-06-15,4.7,0\n2026-06-16,5.4,0\n2026-06-17,6.3,0\n2026-06-18,7.1,0\n2026-06-19,5.7,0\n2026-06-20,5.6,0\n2026-06-21,3.1,38\n2026-06-22,5.8,0\n2026-06-23,6.2,0\n2026-06-24,6.1,0\n2026-06-25,6.3,0\n2026-06-26,6.8,0\n2026-06-27,6.8,0\n2026-06-28,5.8,0\n2026-06-29,5.3,0\n2026-06-30,6.0,6.6\n2026-07-01,5.2,0\n2026-07-02,7.4,1.2\n2026-07-03,6.9,0\n2026-07-04,6.4,0\n2026-07-05,6.6,0\n2026-07-06,6.2,0\n2026-07-07,6.2,0\n2026-07-08,4.7,0\n2026-07-09,6.5,0\n2026-07-10,5.8,0\n2026-07-11,6.1,0\n2026-07-12,6.7,13.7\n2026-07-13,7.7,0\n2026-07-14,4.1,8.5\n2026-07-15,5.5,0\n2026-07-16,6.1,0\n2026-07-17,5.5,0\n2026-07-18,4.7,0\n2026-07-19,4.2,0\n2026-07-20,5.1,0\n2026-07-21,5.9,0\n2026-07-22,5.6,0\n2026-07-23,5.0,0\n2026-07-24,5.5,0\n2026-07-25,5.1,0\n2026-07-26,5.0,0\n2026-07-27,4.8,0\n2026-07-28,3.7,0\n2026-07-29,4.8,0\n2026-07-30,4.6,0\n2026-07-31,5.5,0';
