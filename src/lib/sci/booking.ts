// Equipment booking: one person's instrument bookings, with repeats, clash finding, a week layout, and export to
// iCalendar (.ics, RFC 5545) and CSV. Plain TypeScript, no DOM.
// Times are wall-clock times ("floating" in iCalendar terms): a booking at 09:00 stays at 09:00 on every repeat,
// whatever daylight saving does. Internally a time is minutes since 1970-01-01 00:00 on that wall clock.

export type Repeat = 'none' | 'daily' | 'weekdays' | 'weekly' | 'fortnightly' | 'monthly';
export type Booking = {
  id: string;
  instrument: string;
  title: string;
  start: string;   // YYYY-MM-DDTHH:MM
  end: string;     // YYYY-MM-DDTHH:MM, after start
  repeat: Repeat;
  count: number;   // number of times in all, including the first (used when until is '')
  until: string;   // YYYY-MM-DD, last day a repeat may start on ('' = use count)
  skip: string[];  // YYYY-MM-DD dates of single repeats that are cancelled
  notes: string;
};
export type Occurrence = { id: string; n: number; instrument: string; title: string; start: number; end: number; notes: string };

export const MAX_REPEATS = 500;
export const REPEATS: { id: Repeat; name: string }[] = [
  { id: 'none', name: 'Does not repeat' }, { id: 'daily', name: 'Every day' }, { id: 'weekdays', name: 'Every weekday (Mon to Fri)' },
  { id: 'weekly', name: 'Every week' }, { id: 'fortnightly', name: 'Every 2 weeks' }, { id: 'monthly', name: 'Every month, same date' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const dim = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** Minutes of a YYYY-MM-DDTHH:MM wall-clock time (NaN if not a real time). */
export function toMin(s: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(s || '');
  if (!m) return NaN;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  if (mo < 1 || mo > 12 || d < 1 || d > dim(y, mo) || h > 23 || mi > 59) return NaN;
  return Date.UTC(y, mo - 1, d, h, mi) / 6e4;
}
/** YYYY-MM-DDTHH:MM of minutes. */
export const fromMin = (t: number) => new Date(t * 6e4).toISOString().slice(0, 16);
/** Day number (days since 1970-01-01) of YYYY-MM-DD. */
export function dayOf(s: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m || +m[2] < 1 || +m[2] > 12 || +m[3] < 1 || +m[3] > dim(+m[1], +m[2])) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5;
}
export const isoDay = (d: number) => new Date(d * 864e5).toISOString().slice(0, 10);
/** Day of the week, 0 = Monday … 6 = Sunday. */
export const weekday = (day: number) => (((day + 3) % 7) + 7) % 7;
/** The Monday on or before a day. */
export const mondayOf = (day: number) => day - weekday(day);

/** Problems with a booking, in plain words ([] if fine). */
export function problems(b: Booking): string[] {
  const out: string[] = [];
  const s = toMin(b.start), e = toMin(b.end);
  if (!b.instrument.trim()) out.push('Name the instrument.');
  if (!Number.isFinite(s)) out.push('Give a start date and time.');
  if (!Number.isFinite(e)) out.push('Give an end date and time.');
  if (Number.isFinite(s) && Number.isFinite(e)) {
    if (e <= s) out.push('The end must be after the start.');
    else if (e - s > 7 * 1440) out.push('A booking can last at most 7 days.');
  }
  if (b.repeat !== 'none') {
    if (b.until) {
      const u = dayOf(b.until);
      if (!Number.isFinite(u)) out.push('The repeat end date is not a date.');
      else if (Number.isFinite(s) && u < Math.floor(s / 1440)) out.push('The repeat end date is before the first booking.');
    } else if (!(Number.isInteger(b.count) && b.count >= 1)) out.push('Say how many times it repeats, or until when.');
    if (b.count > MAX_REPEATS && !b.until) out.push(`At most ${MAX_REPEATS} repeats.`);
    if (b.repeat === 'weekdays' && Number.isFinite(s) && weekday(Math.floor(s / 1440)) > 4) out.push('A weekday repeat must start on a weekday.');
    if (Number.isFinite(s) && Number.isFinite(e) && e > s) {
      const step = b.repeat === 'daily' || b.repeat === 'weekdays' ? 1440 : b.repeat === 'weekly' ? 7 * 1440 : b.repeat === 'fortnightly' ? 14 * 1440 : 28 * 1440;
      if (e - s > step) out.push('Each booking is longer than the gap between repeats, so the repeats would overlap.');
    }
  }
  return out;
}

/** Start minutes of every repeat of a booking (the first included, cancelled dates left out), at most MAX_REPEATS. */
export function starts(b: Booking): number[] {
  const s = toMin(b.start);
  if (!Number.isFinite(s)) return [];
  const day0 = Math.floor(s / 1440), tod = s - day0 * 1440;
  if (b.repeat === 'none') return b.skip.includes(isoDay(day0)) ? [] : [s];
  const lastDay = b.until ? dayOf(b.until) : Infinity;
  const count = b.until ? Infinity : Math.max(1, Math.min(MAX_REPEATS, Math.floor(b.count) || 1));
  const days: number[] = [];
  if (b.repeat === 'monthly') {
    const d0 = new Date(day0 * 864e5), y0 = d0.getUTCFullYear(), m0 = d0.getUTCMonth(), dom = d0.getUTCDate();
    // RFC 5545: a month without that date (31st, 29 February) is skipped, not moved.
    for (let k = 0; days.length < count && k < MAX_REPEATS * 2; k++) {
      const y = y0 + Math.floor((m0 + k) / 12), m = (m0 + k) % 12;
      if (dom > dim(y, m + 1)) continue;
      const d = Date.UTC(y, m, dom) / 864e5;
      if (d > lastDay) break;
      days.push(d);
      if (days.length >= MAX_REPEATS) break;
    }
  } else {
    const step = b.repeat === 'weekly' ? 7 : b.repeat === 'fortnightly' ? 14 : 1;
    for (let d = day0; days.length < count && d <= lastDay && days.length < MAX_REPEATS; d += step) {
      if (b.repeat === 'weekdays' && weekday(d) > 4) continue;
      days.push(d);
    }
  }
  const skip = new Set(b.skip);
  return days.filter((d) => !skip.has(isoDay(d))).map((d) => d * 1440 + tod);
}

/** All occurrences of all bookings that overlap [from, to) (minutes), sorted by start. */
export function occurrences(list: Booking[], from = -Infinity, to = Infinity): Occurrence[] {
  const out: Occurrence[] = [];
  for (const b of list) {
    const len = toMin(b.end) - toMin(b.start);
    if (!(len > 0)) continue;
    starts(b).forEach((s, n) => { if (s < to && s + len > from) out.push({ id: b.id, n, instrument: b.instrument.trim(), title: b.title, start: s, end: s + len, notes: b.notes }); });
  }
  return out.sort((a, b) => a.start - b.start || a.end - b.end || a.instrument.localeCompare(b.instrument));
}

export type Clash = { a: Occurrence; b: Occurrence; kind: 'instrument' | 'you'; from: number; to: number };
const sameInstrument = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Overlapping bookings. 'instrument': the same instrument is booked twice at once (a real clash). 'you': two
 * different instruments at once, which is fine for unattended runs but worth a look. Touching bookings (one ends
 * at 10:00, the next starts at 10:00) do not clash.
 */
export function clashes(occ: Occurrence[]): Clash[] {
  const out: Clash[] = [];
  const s = [...occ].sort((a, b) => a.start - b.start);
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length && s[j].start < s[i].end; j++) {
      const a = s[i], b = s[j];
      if (a.id === b.id && a.n === b.n) continue;
      out.push({ a, b, kind: sameInstrument(a.instrument, b.instrument) ? 'instrument' : 'you', from: Math.max(a.start, b.start), to: Math.min(a.end, b.end) });
    }
  }
  return out;
}

export type Placed = Occurrence & { day: number; top: number; bottom: number; col: number; cols: number; clash: boolean };
/**
 * The week from `monday` (a day number) laid out for a calendar: each occurrence cut to each day it touches, with
 * top and bottom in minutes from midnight and side-by-side columns where bookings overlap.
 */
export function weekLayout(occ: Occurrence[], monday: number, clashing: Set<string> = new Set()): Placed[][] {
  const days: Placed[][] = [];
  for (let k = 0; k < 7; k++) {
    const d = monday + k, d0 = d * 1440, d1 = d0 + 1440;
    const items = occ.filter((o) => o.start < d1 && o.end > d0).map((o) => ({ ...o, day: d, top: Math.max(o.start, d0) - d0, bottom: Math.min(o.end, d1) - d0, col: 0, cols: 1, clash: clashing.has(`${o.id}#${o.n}`) }));
    items.sort((a, b) => a.top - b.top || b.bottom - a.bottom);
    // Group overlapping runs, then give each a column.
    let group: Placed[] = [], groupEnd = -1;
    const close = () => { const n = Math.max(1, ...group.map((g) => g.col + 1)); for (const g of group) g.cols = n; group = []; };
    for (const it of items) {
      if (it.top >= groupEnd && group.length) close();
      const used = new Set(group.filter((g) => g.bottom > it.top).map((g) => g.col));
      let c = 0; while (used.has(c)) c++;
      it.col = c; group.push(it); groupEnd = Math.max(groupEnd, it.bottom);
    }
    if (group.length) close();
    days.push(items);
  }
  return days;
}

/** Hours booked per instrument among some occurrences. */
export function hoursBy(occ: Occurrence[]): [string, number][] {
  const m = new Map<string, number>();
  for (const o of occ) m.set(o.instrument, (m.get(o.instrument) ?? 0) + (o.end - o.start) / 60);
  return [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

// ---- iCalendar (RFC 5545) ----
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
/** Fold a content line to at most 75 octets per line (UTF-8), continuing with a space. */
export function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '', bytes = 0, limit = 75;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > limit) { out.push(cur); cur = ''; bytes = 0; limit = 74; }
    cur += ch; bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}
const icsTime = (t: number) => fromMin(t).replace(/[-:]/g, '') + '00';

/** The RRULE value for a booking ('' if it does not repeat). */
export function rrule(b: Booking): string {
  if (b.repeat === 'none') return '';
  const s = toMin(b.start), tod = s - Math.floor(s / 1440) * 1440;
  const freq = { daily: 'FREQ=DAILY', weekdays: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', weekly: 'FREQ=WEEKLY', fortnightly: 'FREQ=WEEKLY;INTERVAL=2', monthly: 'FREQ=MONTHLY' }[b.repeat];
  // UNTIL is the last start that may happen: the until day at the booking's start time (floating, like DTSTART).
  const end = b.until ? `;UNTIL=${icsTime(dayOf(b.until) * 1440 + tod)}` : `;COUNT=${Math.max(1, Math.min(MAX_REPEATS, Math.floor(b.count) || 1))}`;
  return freq + end;
}

/** An .ics file with one event per booking (repeats as RRULE, cancelled dates as EXDATE). `stamp` is the UTC time now. */
export function toIcs(list: Booking[], stamp: Date): string {
  const st = stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//fibub.com//Equipment booking//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const b of list) {
    if (problems(b).length) continue;
    const s = toMin(b.start), e = toMin(b.end), tod = s - Math.floor(s / 1440) * 1440;
    L.push('BEGIN:VEVENT', `UID:${b.id}@fibub.com`, `DTSTAMP:${st}`, `DTSTART:${icsTime(s)}`, `DTEND:${icsTime(e)}`,
      `SUMMARY:${esc(b.title.trim() ? `${b.instrument.trim()}: ${b.title.trim()}` : b.instrument.trim())}`, `LOCATION:${esc(b.instrument.trim())}`);
    if (b.notes.trim()) L.push(`DESCRIPTION:${esc(b.notes.trim())}`);
    const r = rrule(b);
    if (r) {
      L.push(`RRULE:${r}`);
      for (const x of b.skip) { const d = dayOf(x); if (Number.isFinite(d)) L.push(`EXDATE:${icsTime(d * 1440 + tod)}`); }
    }
    L.push('END:VEVENT');
  }
  L.push('END:VCALENDAR');
  return L.map(fold).join('\r\n') + '\r\n';
}

// ---- CSV and backup ----
const hm = (t: number) => fromMin(t).slice(11);
/** Rows for a CSV: one row per occurrence. */
export function csvRows(occ: Occurrence[], clashList: Clash[] = []): string[][] {
  const flag = new Map<string, string>();
  for (const c of clashList) for (const o of [c.a, c.b]) { const k = `${o.id}#${o.n}`; if (c.kind === 'instrument' || !flag.has(k)) flag.set(k, c.kind === 'instrument' ? 'Instrument double-booked' : 'Overlaps another booking'); }
  return [['Date', 'Day', 'Start', 'End', 'Hours', 'Instrument', 'Title', 'Notes', 'Clash'], ...occ.map((o) => {
    const d = Math.floor(o.start / 1440), endDay = Math.floor((o.end - 1) / 1440);
    return [isoDay(d), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][weekday(d)], hm(o.start), (endDay > d ? isoDay(Math.floor(o.end / 1440)) + ' ' : '') + hm(o.end), String(+((o.end - o.start) / 60).toFixed(2)), o.instrument, o.title, o.notes, flag.get(`${o.id}#${o.n}`) ?? ''];
  })];
}

export const toJson = (list: Booking[]) => JSON.stringify({ app: 'fibub equipment booking', version: 1, bookings: list }, null, 1);
export function fromJson(text: string): Booking[] {
  let d: unknown;
  try { d = JSON.parse(text); } catch { throw new Error('This file is not valid JSON.'); }
  const arr = Array.isArray(d) ? d : (d as { bookings?: unknown })?.bookings;
  if (!Array.isArray(arr)) throw new Error('This JSON file has no list of bookings (expected { "bookings": [...] }).');
  const s = (v: unknown) => (typeof v === 'string' ? v : '');
  const reps = REPEATS.map((r) => r.id) as string[];
  return arr.filter((x) => x && typeof x === 'object').map((x) => {
    const r = x as Record<string, unknown>;
    return { id: s(r.id) || randomId(), instrument: s(r.instrument), title: s(r.title), start: s(r.start).slice(0, 16), end: s(r.end).slice(0, 16), repeat: (reps.includes(s(r.repeat)) ? s(r.repeat) : 'none') as Repeat, count: Number(r.count) || 1, until: s(r.until), skip: Array.isArray(r.skip) ? r.skip.filter((v): v is string => typeof v === 'string') : [], notes: s(r.notes) };
  }).filter((b) => toMin(b.start) < toMin(b.end));
}
export const randomId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** A made-up example week starting on `monday` (a day number), with one clash on the confocal and one overlap across two instruments. */
export function exampleBookings(monday: number): Booking[] {
  const at = (k: number, h: string) => `${isoDay(monday + k)}T${h}`;
  const b = (id: string, instrument: string, title: string, k: number, s: string, e: string, repeat: Repeat = 'none', count = 1, notes = '', endDay = k): Booking =>
    ({ id, instrument, title, start: at(k, s), end: at(endDay, e), repeat, count, until: '', skip: [], notes });
  return [
    b('ex1', 'Confocal microscope', 'Live imaging, HeLa', 0, '09:00', '12:00', 'weekly', 4, 'Bring the 37 °C stage insert'),
    b('ex2', 'Flow cytometer', 'Weekly panel', 1, '14:00', '16:00', 'weekly', 6),
    b('ex3', 'Confocal microscope', 'Fixed slides', 0, '11:00', '13:00', 'none', 1, 'Clashes with the live imaging block'),
    b('ex4', 'Plate reader', 'ELISA readout', 2, '10:00', '10:30', 'weekdays', 3),
    b('ex5', 'qPCR machine', 'Overnight run', 3, '17:00', '09:00', 'none', 1, 'Unattended', 4),
    b('ex6', 'Plate reader', 'Kinetics', 3, '08:30', '09:45', 'none'),
    b('ex7', 'Plate reader', 'Endpoint read', 1, '15:30', '16:00', 'none', 1, 'Runs on its own while the cytometer panel finishes'),
  ];
}
