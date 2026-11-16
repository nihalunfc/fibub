// Calendar maths for the date calculator. Plain TypeScript, no DOM.
// Dates are whole days held as UTC midnight milliseconds, so clock changes never shift a day.
export const DAY = 86400000;
export const parse = (s: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim()); if (!m) return NaN; const t = Date.UTC(+m[1], +m[2] - 1, +m[3]); return new Date(t).getUTCMonth() === +m[2] - 1 ? t : NaN; };
export const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
export const dow = (t: number) => new Date(t).getUTCDay(); // 0 = Sunday
export const dim = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
export const utc = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d); // m is 1 to 12

/** Add months, keeping the day but moving to the month's last day when it is shorter (31 Jan + 1 month = 28 Feb). */
export function addMonths(t: number, k: number) {
  const d = new Date(t), m = d.getUTCMonth() + k, ty = d.getUTCFullYear() + Math.floor(m / 12), tm = ((m % 12) + 12) % 12;
  return Date.UTC(ty, tm, Math.min(d.getUTCDate(), dim(ty, tm)));
}
/** Whole years, months and days from a to b (a <= b). */
export function ymd(a: number, b: number) {
  const da = new Date(a), db = new Date(b);
  let months = (db.getUTCFullYear() - da.getUTCFullYear()) * 12 + db.getUTCMonth() - da.getUTCMonth();
  if (addMonths(a, months) > b) months--;
  return { y: Math.floor(months / 12), m: months % 12, d: Math.round((b - addMonths(a, months)) / DAY), totalMonths: months };
}

// ---- Weekends and holidays ----
export type Region = 'none' | 'us' | 'ca' | 'uk' | 'in';
export type Weekend = 'satsun' | 'frisat' | 'sun';
export const WEEKENDS: Record<Weekend, number[]> = { satsun: [0, 6], frisat: [5, 6], sun: [0] };

/** Nth (1-based) weekday `wd` (0 Sunday) of a month; n = -1 for the last one. */
export function nthWeekday(y: number, m: number, wd: number, n: number) {
  if (n > 0) { const first = dow(utc(y, m, 1)); return utc(y, m, 1 + ((wd - first + 7) % 7) + (n - 1) * 7); }
  const last = utc(y, m, dim(y, m - 1)); return last - ((dow(last) - wd + 7) % 7) * DAY;
}
/** Easter Sunday (Gregorian), the anonymous algorithm. */
export function easter(y: number) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(y, month, day);
}
/** US federal rule: a holiday on Saturday is observed on Friday, on Sunday on Monday. */
const usObserved = (t: number) => (dow(t) === 6 ? t - DAY : dow(t) === 0 ? t + DAY : t);

/** Holidays that fall in calendar year y, as iso date to name. Rules, not a copied list; check the official source for the year you need. */
export function holidays(region: Region, y: number): Map<string, string> {
  const h = new Map<string, string>(), add = (t: number, name: string) => { if (new Date(t).getUTCFullYear() === y) h.set(iso(t), name); };
  if (region === 'us') {
    for (const yy of [y, y + 1]) add(usObserved(utc(yy, 1, 1)), "New Year's Day");
    add(nthWeekday(y, 1, 1, 3), 'Martin Luther King Jr. Day'); add(nthWeekday(y, 2, 1, 3), "Washington's Birthday (Presidents' Day)");
    add(nthWeekday(y, 5, 1, -1), 'Memorial Day'); if (y >= 2021) add(usObserved(utc(y, 6, 19)), 'Juneteenth');
    add(usObserved(utc(y, 7, 4)), 'Independence Day'); add(nthWeekday(y, 9, 1, 1), 'Labor Day'); add(nthWeekday(y, 10, 1, 2), 'Columbus Day');
    add(usObserved(utc(y, 11, 11)), 'Veterans Day'); add(nthWeekday(y, 11, 4, 4), 'Thanksgiving'); add(usObserved(utc(y, 12, 25)), 'Christmas Day');
  } else if (region === 'ca') {
    const e = easter(y), vic = utc(y, 5, 24) - ((dow(utc(y, 5, 24)) + 6) % 7) * DAY; // Monday on or before 24 May
    add(utc(y, 1, 1), "New Year's Day"); add(e - 2 * DAY, 'Good Friday'); add(vic, 'Victoria Day'); add(utc(y, 7, 1), 'Canada Day');
    add(nthWeekday(y, 9, 1, 1), 'Labour Day'); if (y >= 2021) add(utc(y, 9, 30), 'National Day for Truth and Reconciliation');
    add(nthWeekday(y, 10, 1, 2), 'Thanksgiving'); add(utc(y, 11, 11), 'Remembrance Day'); add(utc(y, 12, 25), 'Christmas Day'); add(utc(y, 12, 26), 'Boxing Day');
  } else if (region === 'uk') {
    const e = easter(y), ny = utc(y, 1, 1), xm = utc(y, 12, 25), bx = utc(y, 12, 26);
    add(dow(ny) === 6 ? ny + 2 * DAY : dow(ny) === 0 ? ny + DAY : ny, "New Year's Day"); add(e - 2 * DAY, 'Good Friday'); add(e + DAY, 'Easter Monday');
    add(nthWeekday(y, 5, 1, 1), 'Early May bank holiday'); add(nthWeekday(y, 5, 1, -1), 'Spring bank holiday'); add(nthWeekday(y, 8, 1, -1), 'Summer bank holiday');
    // Christmas Day and Boxing Day each move to the next free weekday.
    const dx = dow(xm);
    add(dx === 6 ? xm + 2 * DAY : dx === 0 ? xm + 2 * DAY : xm, 'Christmas Day');
    add(dx === 5 ? bx + 2 * DAY : dx === 6 ? bx + 2 * DAY : dx === 0 ? bx : bx, 'Boxing Day');
  } else if (region === 'in') {
    add(utc(y, 1, 26), 'Republic Day'); add(utc(y, 8, 15), 'Independence Day'); add(utc(y, 10, 2), 'Gandhi Jayanti');
  }
  return h;
}
/** Dates the person typed, one per line or separated by commas or spaces: returns valid iso dates and what could not be read. */
export function parseDates(text: string) {
  const ok = new Set<string>(), bad: string[] = [];
  for (const tok of text.split(/[\s,;]+/).filter(Boolean)) { const t = parse(tok); if (Number.isFinite(t)) ok.add(iso(t)); else bad.push(tok); }
  return { ok, bad };
}

export type Cal = { weekend: number[]; holidays: Set<string> };
/** Build the calendar for dates from a to b (inclusive, any order). */
export function makeCal(region: Region, weekend: Weekend, custom: Set<string>, a: number, b: number): Cal {
  const set = new Set<string>(custom), lo = Math.min(a, b), hi = Math.max(a, b);
  const y0 = new Date(lo).getUTCFullYear(), y1 = new Date(hi).getUTCFullYear();
  for (let y = y0; y <= Math.min(y1, y0 + 200); y++) for (const k of holidays(region, y).keys()) set.add(k);
  return { weekend: WEEKENDS[weekend], holidays: set };
}
export const isBusiness = (t: number, c: Cal) => !c.weekend.includes(dow(t)) && !c.holidays.has(iso(t));

/** Business days in [a, b): the first day counts, the last does not (add a day to b to include it). */
export function businessBetween(a: number, b: number, c: Cal) {
  const n = Math.round((b - a) / DAY); let count = 0;
  if (n > 40000) return NaN;
  for (let i = 0; i < n; i++) if (isBusiness(a + i * DAY, c)) count++;
  return count;
}
/** Holidays that land on a working weekday between a and b (inclusive), for display. */
export function holidaysIn(a: number, b: number, c: Cal, names: Map<string, string>) {
  const out: { iso: string; name: string }[] = [];
  for (let t = a; t <= b && out.length < 60; t += DAY) { const k = iso(t); if (c.holidays.has(k) && !c.weekend.includes(dow(t))) out.push({ iso: k, name: names.get(k) || 'Your own date' }); }
  return out;
}
/** Move `n` business days from a start day (the start day itself is not counted). Negative n goes back. NaN when n is too big. */
export function addBusiness(start: number, n: number, c: Cal) {
  if (Math.abs(n) > 20000 || c.weekend.length >= 7) return NaN;
  const step = n < 0 ? -1 : 1; let left = Math.abs(n), t = start, guard = 0;
  while (left > 0 && guard++ < 200000) { t += step * DAY; if (isBusiness(t, c)) left--; }
  return t;
}
