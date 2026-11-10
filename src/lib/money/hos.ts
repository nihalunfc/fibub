// Hours-of-service clocks for one shift, as pure functions (no DOM).
// US: FMCSA 49 CFR 395.3, property-carrying. Canada: Commercial Vehicle Drivers Hours of Service
// Regulations (SOR/2005-313), south of latitude 60. Both checked 2026-11-10. Not an ELD.

export type Duty = 'off' | 'sb' | 'd' | 'on';
export interface Row { status: Duty; start: string } // start "HH:MM", runs until the next row's start (or now)
export interface Seg { status: Duty; from: number; to: number } // minutes from 00:00 of the log day

/** "HH:MM" to minutes; NaN when it is not a time. "24:00" is allowed. */
export const toMin = (t: string): number => {
  const m = /^\s*(\d{1,2}):?(\d{2})\s*$/.exec(t || '');
  if (!m) return NaN;
  const h = +m[1], mi = +m[2];
  return h > 24 || mi > 59 || (h === 24 && mi > 0) ? NaN : h * 60 + mi;
};
/** Minutes to "HH:MM" (wraps past midnight, adds "+1 day"). */
export const clock = (min: number): string => {
  const day = Math.floor(min / 1440), m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}${day > 0 ? ' (+1 day)' : ''}`;
};
/** Minutes to "3 h 05 m". */
export const dur = (min: number): string => {
  const m = Math.max(0, Math.round(min));
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} m`;
};

/** Rows in time order become segments ending at `now`. Rows after now are dropped. */
export const segments = (rows: Row[], now: number): Seg[] => {
  const r = rows.map((x) => ({ status: x.status, from: toMin(x.start) })).filter((x) => Number.isFinite(x.from)).sort((a, b) => a.from - b.from);
  const out: Seg[] = [];
  r.forEach((x, i) => {
    const to = Math.min(i + 1 < r.length ? r[i + 1].from : now, now);
    if (to > x.from) out.push({ status: x.status, from: x.from, to });
  });
  return out;
};

const rest = (s: Duty) => s === 'off' || s === 'sb';
const work = (s: Duty) => s === 'd' || s === 'on';

/** Start of the current shift: the end of the last unbroken rest of at least `restMin`, else the first work. */
export const shiftStart = (segs: Seg[], restMin: number, assumeRestedBefore = true): number | null => {
  let start: number | null = null, runFrom: number | null = assumeRestedBefore ? -Infinity : null;
  for (const s of segs) {
    if (rest(s.status)) { if (runFrom === null) runFrom = s.from; continue; }
    if (runFrom !== null && s.from - runFrom >= restMin) start = s.from;
    else if (start === null && runFrom === -Infinity) start = s.from;
    runFrom = null;
  }
  return start;
};

export interface Clocks {
  started: number | null; // shift start, minutes
  driving: number; onDuty: number; // minutes in this shift (onDuty counts driving too)
  drivingLeft: number; // minutes, after every limit
  limits: { name: string; left: number; note: string }[];
  breakDueIn: number | null; // US only: minutes of driving before a 30-minute break is needed (0 = now)
  windowEnds: number | null; // clock minutes when driving must stop (14 h US, 16 h Canada)
  cycleLeft: number; offToday?: number; offNeeded?: number;
}

const sum = (segs: Seg[], from: number, pred: (d: Duty) => boolean) =>
  segs.reduce((a, s) => a + (pred(s.status) ? Math.max(0, s.to - Math.max(s.from, from)) : 0), 0);

/** US FMCSA property-carrying: 11 h driving, 14 h window, 30-min break after 8 h driving, 60/70 h. */
export const usClocks = (rows: Row[], now: number, o: { cycleHours: 60 | 70; usedBefore: number }): Clocks => {
  const segs = segments(rows, now), start = shiftStart(segs, 600);
  const from = start ?? now;
  const driving = sum(segs, from, (d) => d === 'd'), onDuty = sum(segs, from, work);
  // Driving since the last break of 30+ minutes in a row of anything but driving.
  let sinceBreak = 0, gapFrom: number | null = null;
  for (const s of segs) {
    if (s.to <= from) continue;
    const a = Math.max(s.from, from);
    if (s.status === 'd') { if (gapFrom !== null && a - gapFrom >= 30) sinceBreak = 0; gapFrom = null; sinceBreak += s.to - a; }
    else if (gapFrom === null) gapFrom = a;
  }
  if (gapFrom !== null && now - gapFrom >= 30) sinceBreak = 0;
  const windowEnds = start === null ? null : start + 14 * 60;
  const cycleLeft = o.cycleHours * 60 - o.usedBefore * 60 - onDuty;
  const limits = [
    { name: '11-hour driving', left: 660 - driving, note: `${dur(driving)} driven this shift` },
    { name: '14-hour window', left: windowEnds === null ? 840 : windowEnds - now, note: windowEnds === null ? 'Starts when you come on duty' : `Ends at ${clock(windowEnds)}` },
    { name: `${o.cycleHours}-hour cycle`, left: cycleLeft, note: `${o.cycleHours === 60 ? '7' : '8'} days, counting today` },
  ];
  const breakDueIn = Math.max(0, 480 - sinceBreak);
  return { started: start, driving, onDuty, drivingLeft: Math.max(0, Math.min(...limits.map((l) => l.left))), limits, breakDueIn, windowEnds, cycleLeft };
};

/** Canada federal south of 60°: 13 h driving, 14 h on duty, 16 h elapsed since 8 h off, 10 h off a day, cycle 1 or 2. */
export const caClocks = (rows: Row[], now: number, o: { cycle: 1 | 2; usedBefore: number; sinceLong?: number }): Clocks => {
  const segs = segments(rows, now), start = shiftStart(segs, 480);
  const from = start ?? now;
  const driving = sum(segs, from, (d) => d === 'd'), onDuty = sum(segs, from, work);
  const windowEnds = start === null ? null : start + 16 * 60;
  const cap = o.cycle === 1 ? 70 : 120;
  let cycleLeft = cap * 60 - o.usedBefore * 60 - onDuty;
  const limits = [
    { name: '13-hour driving', left: 780 - driving, note: `${dur(driving)} driven since 8 h off` },
    { name: '14-hour on duty', left: 840 - onDuty, note: `${dur(onDuty)} on duty (driving counts)` },
    { name: '16-hour elapsed', left: windowEnds === null ? 960 : windowEnds - now, note: windowEnds === null ? 'Starts when you come on duty' : `Ends at ${clock(windowEnds)}` },
    { name: `Cycle ${o.cycle} (${cap} h in ${o.cycle === 1 ? 7 : 14} days)`, left: cycleLeft, note: 'Counting today' },
  ];
  if (o.cycle === 2) {
    const left70 = 70 * 60 - (o.sinceLong ?? 0) * 60 - onDuty;
    limits.push({ name: '70 h before 24 h off (cycle 2)', left: left70, note: 'On duty since your last 24 h off' });
    cycleLeft = Math.min(cycleLeft, left70);
  }
  // Day = 00:00 to 24:00 here. Off-duty so far today, and how much the rest of the day must still give.
  const offToday = sum(segs, 0, rest) + Math.max(0, (segs[0]?.from ?? now));
  const offNeeded = Math.max(0, 600 - offToday);
  return { started: start, driving, onDuty, drivingLeft: Math.max(0, Math.min(...limits.map((l) => l.left))), limits, breakDueIn: null, windowEnds, cycleLeft, offToday, offNeeded };
};
