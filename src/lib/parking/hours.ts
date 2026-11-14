// Opening hours and time rules for Parking Finder (#T954). Plain TypeScript, no DOM.
// Reads the common part of OpenStreetMap's opening_hours ("24/7", "Mo-Fr 08:00-18:00; Sa 09:00-17:00", "off",
// overnight ranges such as "22:00-06:00") and conditional rules ("no_parking @ (Mo-Fr 07:00-09:00)"), plus the
// plain text the City of Ottawa uses ("7:00am - 7:00pm"). Anything it cannot read for sure gives null (unknown),
// never a guess.

export const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Day index Monday = 0 and minutes since midnight for a Date, in the visitor's own clock (they are standing there). */
export function clock(d: Date) {
  return { day: (d.getDay() + 6) % 7, min: d.getHours() * 60 + d.getMinutes() };
}

function parseDays(sel: string): Set<number> | null {
  const out = new Set<number>();
  for (const part of sel.split(',')) {
    const m = part.trim().match(/^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?$/);
    if (!m) return null;
    const a = DAYS.indexOf(m[1]), b = m[2] ? DAYS.indexOf(m[2]) : a;
    for (let i = a; ; i = (i + 1) % 7) { out.add(i); if (i === b) break; }
  }
  return out;
}

function hm(s: string): number | null {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const v = +m[1] * 60 + +m[2];
  return v <= 24 * 60 ? v : null;
}

type Range = [number, number];
function parseTimes(s: string): Range[] | null {
  const out: Range[] = [];
  for (const part of s.split(',')) {
    const m = part.trim().match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\+?$/);
    if (!m) return null;
    const a = hm(m[1]), b = hm(m[2]);
    if (a == null || b == null) return null;
    out.push([a, b]);
  }
  return out;
}

interface Rule { days: Set<number>; times: Range[] | 'off' | 'all' }

/** Parse a simple opening_hours string. Returns null when it uses parts this reader does not handle (months, holidays...). */
export function parseHours(text: string): Rule[] | null {
  const t = (text || '').trim();
  if (!t) return null;
  if (t === '24/7') return [{ days: new Set([0, 1, 2, 3, 4, 5, 6]), times: 'all' }];
  const rules: Rule[] = [];
  for (const raw of t.split(';')) {
    const r = raw.trim();
    if (!r) continue;
    // "Mo-Fr 08:00-18:00", "Sa off", "08:00-20:00" (every day), "Mo-Su 00:00-24:00"
    const m = r.match(/^((?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?)(?:,(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?)*)?\s*(.*)$/);
    if (!m) return null;
    const days = m[1] ? parseDays(m[1]) : new Set([0, 1, 2, 3, 4, 5, 6]);
    if (!days) return null;
    const rest = m[2].trim();
    if (/^(off|closed)$/i.test(rest)) { rules.push({ days, times: 'off' }); continue; }
    if (!rest && m[1]) { rules.push({ days, times: 'all' }); continue; }
    const times = parseTimes(rest);
    if (!times) return null;
    rules.push({ days, times });
  }
  return rules.length ? rules : null;
}

/** Is the time inside the hours? true, false, or null when unknown. Later rules replace earlier ones for their days. */
export function isOpen(text: string, d: Date): boolean | null {
  const rules = parseHours(text);
  if (!rules) return null;
  const { day, min } = clock(d);
  const yesterday = (day + 6) % 7;
  const ruleFor = (dd: number) => { let r: Rule | undefined; for (const x of rules) if (x.days.has(dd)) r = x; return r; };
  // Overnight spill from yesterday (e.g. Fr 22:00-02:00 still open early Saturday).
  const y = ruleFor(yesterday);
  if (y && Array.isArray(y.times)) for (const [a, b] of y.times) if (b <= a && min < b) return true;
  const r = ruleFor(day);
  if (!r) return false;
  if (r.times === 'all') return true;
  if (r.times === 'off') return false;
  for (const [a, b] of r.times) {
    if (b > a ? min >= a && min < b : min >= a) return true;
  }
  return false;
}

/** "no_parking @ (Mo-Fr 07:00-09:00); 2 hours @ (Sa)": the values that apply right now (null if a rule can't be read). */
export function conditionalNow(text: string, d: Date): { now: string[]; unknown: boolean } {
  const now: string[] = [];
  let unknown = false;
  for (const part of (text || '').split(/;(?![^(]*\))/)) {
    const m = part.trim().match(/^(.+?)\s*@\s*\(?(.+?)\)?$/);
    if (!m) { if (part.trim()) unknown = true; continue; }
    const open = isOpen(m[2], d);
    if (open == null) unknown = true;
    else if (open) now.push(m[1].trim());
  }
  return { now, unknown };
}

/** Ottawa's text hours: "7:00am - 7:00pm", "7AM-3:30PM", "8 a.m. to 6 p.m." -> [start, end] minutes, or null. */
export function parseAmPm(text: string): Range | null {
  const t = (text || '').toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ');
  const m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*(?:-|to|–)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
  if (!m) return null;
  const to = (h: string, mm: string | undefined, ap: string) => ((+h % 12) + (ap === 'pm' ? 12 : 0)) * 60 + (mm ? +mm : 0);
  return [to(m[1], m[2], m[3]), to(m[4], m[5], m[6])];
}

export function inAmPm(text: string, d: Date): boolean | null {
  const r = parseAmPm(text);
  if (!r) return null;
  const { min } = clock(d);
  return r[1] > r[0] ? min >= r[0] && min < r[1] : min >= r[0] || min < r[1];
}

/** Turn opening_hours into plain words: "Mo-Fr 08:00-18:00" -> "Monday to Friday 08:00-18:00". */
export function hoursWords(text: string): string {
  if (!text) return '';
  if (text.trim() === '24/7') return 'Open 24 hours, every day';
  return text
    .replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su)-(Mo|Tu|We|Th|Fr|Sa|Su)\b/g, (_, a, b) => `${DAY_NAMES[DAYS.indexOf(a)]} to ${DAY_NAMES[DAYS.indexOf(b)]}`)
    .replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su)\b/g, (d) => DAY_NAMES[DAYS.indexOf(d)])
    .replace(/\bPH\b/g, 'holidays')
    .replace(/\boff\b/g, 'closed')
    .replace(/,(?=\S)/g, ', ')
    .replace(/;\s*/g, '; ');
}

/** Ottawa's day groups (weekday, Saturday, Sunday) for a Date. */
export function dayGroup(d: Date): 'mf' | 'sa' | 'su' {
  const { day } = clock(d);
  return day === 5 ? 'sa' : day === 6 ? 'su' : 'mf';
}
