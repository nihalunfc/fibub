// Maths for the revenue dashboard: net revenue by channel, sold-out days and a plain outlook. No DOM.
import { addDays, dowOf } from './common.ts';
import type { Row } from './dash.ts';

export type ChanRow = { ch: string; sold: number; rev: number; canc: number; net: number; commission: number };
/** Gross and net revenue per channel after commission (a percent for each channel; missing means 0). */
export function channels(rows: Row[], from: string, to: string, comm: Record<string, number>, site = ''): ChanRow[] {
  const m = new Map<string, ChanRow>();
  for (const r of rows) {
    if (r.d < from || r.d > to || (site && r.site !== site)) continue;
    const c = m.get(r.ch) || { ch: r.ch, sold: 0, rev: 0, canc: 0, net: 0, commission: 0 };
    c.sold += r.sold; c.rev += r.rev; c.canc += r.canc; m.set(r.ch, c);
  }
  return [...m.values()].map((c) => { const p = Math.max(0, Math.min(100, comm[c.ch] || 0)); return { ...c, commission: c.rev * p / 100, net: c.rev * (1 - p / 100) }; }).sort((a, b) => b.net - a.net);
}
export const cancelRate = (c: { sold: number; canc: number }) => (c.sold + c.canc > 0 ? c.canc / (c.sold + c.canc) : NaN);

export type Day = { d: string; site: string; sold: number; rev: number; cap: number };
/** One record per site per day, with the site's places from `caps`. */
export function siteDays(rows: Row[], caps: Record<string, number>): Day[] {
  const m = new Map<string, Day>();
  for (const r of rows) { const k = r.d + '|' + r.site, x = m.get(k) || { d: r.d, site: r.site, sold: 0, rev: 0, cap: caps[r.site] > 0 ? caps[r.site] : 0 }; x.sold += r.sold; x.rev += r.rev; m.set(k, x); }
  return [...m.values()].sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : a.site < b.site ? -1 : 1));
}
/** Days the site sold (nearly) everything, and a rough value for demand turned away if `extra` percent more would have bought. */
export function soldOut(days: Day[], from: string, to: string, extra: number, site = '', full = 0.97) {
  let n = 0, units = 0, value = 0; const top: Day[] = [];
  for (const x of days) {
    if (x.d < from || x.d > to || (site && x.site !== site) || !(x.cap > 0) || x.sold < x.cap * full) continue;
    n++; const lost = x.sold * extra / 100; units += lost; value += x.sold > 0 ? lost * x.rev / x.sold : 0; top.push(x);
  }
  top.sort((a, b) => b.rev - a.rev);
  return { n, units, value, top: top.slice(0, 8) };
}
/** Monday of the week for a date. */
export const weekStart = (d: string) => addDays(d, -((dowOf(d) + 6) % 7));
/** Weekly sold and places for the last `weeks` full weeks before `end`, plus a plain outlook for the next `ahead` weeks:
 *  the average of each weekday over the last 8 weeks, scaled by growth against the same 8 weeks a year earlier (kept within -25% to +25%). */
export function outlook(days: Day[], end: string, weeks = 26, ahead = 8, site = '') {
  const sel = days.filter((x) => !site || x.site === site), by = new Map<string, { sold: number; cap: number }>(), daily = new Map<string, { sold: number; cap: number }>();
  for (const x of sel) { const w = weekStart(x.d), b = by.get(w) || { sold: 0, cap: 0 }; b.sold += x.sold; b.cap += x.cap; by.set(w, b); const e = daily.get(x.d) || { sold: 0, cap: 0 }; e.sold += x.sold; e.cap += x.cap; daily.set(x.d, e); }
  const lastMon = weekStart(end), lastFull = dowOf(end) === 0 ? lastMon : addDays(lastMon, -7);
  const hist: { w: string; sold: number; cap: number }[] = [];
  for (let i = weeks - 1; i >= 0; i--) { const w = addDays(lastFull, -7 * i), b = by.get(w); if (b && b.cap > 0) hist.push({ w, ...b }); else hist.push({ w, sold: NaN, cap: NaN }); }
  // weekday averages over the last 56 days
  const dow = Array.from({ length: 7 }, () => ({ s: 0, c: 0, n: 0 }));
  const start = addDays(end, -55); let recent = 0, ly = 0;
  for (let i = 0; i < 56; i++) { const d = addDays(start, i), e = daily.get(d); if (!e) continue; const o = dow[dowOf(d)]; o.s += e.sold; o.c += e.cap; o.n++; recent += e.sold; const l = daily.get(addDays(d, -364)); if (l) ly += l.sold; }
  const g = ly > 0 ? Math.max(0.75, Math.min(1.25, recent / ly)) : 1;
  const out: { w: string; sold: number; cap: number }[] = [];
  for (let i = 1; i <= ahead; i++) {
    const w = addDays(lastFull, 7 * i); let sold = 0, cap = 0;
    for (let k = 0; k < 7; k++) { const o = dow[dowOf(addDays(w, k))]; if (!o.n) continue; const c = o.c / o.n; cap += c; sold += Math.min(c, (o.s / o.n) * g); }
    out.push({ w, sold, cap });
  }
  return { hist, out, growth: g };
}
