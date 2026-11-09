// Shift scheduling: dates for a week or a month, shift hours, the staff list, a fair automatic fill that respects
// days off, weekly hour limits and rest between shifts, coverage counts, and one table model that every download
// (image, PDF, Excel, Word) is drawn from. Dates are 'YYYY-MM-DD' strings handled in UTC, so clock changes never
// shift a day. No DOM.

export type Shift = { id: string; name: string; code: string; start: string; end: string; need: number; needBy?: Record<string, number>; color: string };
// needBy: people needed in particular departments (keys in lower case), overriding `need`.
export type Staff = { name: string; dept: string; maxHours: number; off: number[] }; // off: weekdays, 0 = Sunday
export type Grid = Record<string, string>; // `${staff name}|${date}` -> shift id
export type Period = 'week' | 'month';

export const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const PALETTE = ['#cfe3f6', '#ffe1b8', '#d4efd9', '#ead7f2', '#fff3b0', '#f8d0d0', '#d9e9e4', '#e5e5e5'];

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d); };
export const weekday = (iso: string) => toDate(iso).getUTCDay();
export const key = (name: string, date: string) => `${name}|${date}`;

/** Minutes after midnight for 'HH:MM' (also 'H:MM', '7', '7am', '3:30 pm'); NaN when it can't be read. */
export function minutes(t: string) {
  const m = /^\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*$/i.exec(t);
  if (!m) return NaN;
  let h = +m[1]; const mi = m[2] ? +m[2] : 0, ap = m[3]?.toLowerCase();
  if (mi > 59 || h > 24 || (ap && (h < 1 || h > 12))) return NaN;
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  return h * 60 + mi === 1440 ? 1440 : (h % 24) * 60 + mi;
}
/** Paid length in hours; a shift that ends at or before its start runs past midnight. */
export function shiftHours(s: Pick<Shift, 'start' | 'end'>) {
  const a = minutes(s.start), b = minutes(s.end);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  const d = b > a ? b - a : b + 1440 - a;
  return d / 60;
}
export const fmtTime = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Days shown: a week from the first day of the week holding `start` (weekStart 1 = Monday, 0 = Sunday), or the
 *  whole calendar month holding `start`. */
export function periodDays(period: Period, start: string, weekStart: 0 | 1 = 1) {
  if (period === 'week') {
    const back = (weekday(start) - weekStart + 7) % 7, first = addDays(start, -back);
    return Array.from({ length: 7 }, (_, i) => addDays(first, i));
  }
  const first = `${start.slice(0, 7)}-01`, out: string[] = [];
  for (let d = first; d.slice(0, 7) === first.slice(0, 7); d = addDays(d, 1)) out.push(d);
  return out;
}
/** Short column label, e.g. 'Mon 9'. */
export const dayLabel = (iso: string) => `${DAY[weekday(iso)]} ${+iso.slice(8)}`;
export const periodTitle = (days: string[]) => {
  const a = days[0], b = days[days.length - 1], f = (d: string, y = true) => `${+d.slice(8)} ${MONTH[+d.slice(5, 7) - 1]}${y ? ` ${d.slice(0, 4)}` : ''}`;
  return days.length > 7 && a.slice(8) === '01' ? `${MONTH[+a.slice(5, 7) - 1]} ${a.slice(0, 4)}` : `${f(a, a.slice(0, 4) !== b.slice(0, 4))} to ${f(b)}`;
};

const DAYS_RE: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
/** Staff from text, one person per line: a name, then in any order a department, the most hours a week (a number)
 *  and days off ("Sat Sun"). Commas or tabs separate the columns. A header line starting with 'name' is skipped. */
export function parseStaff(text: string, defaultMax = 40) {
  const staff: Staff[] = [], errors: string[] = [], seen = new Map<string, number>();
  text.split(/\r?\n/).forEach((line, i) => {
    if (!line.trim()) return;
    const c = line.split(/\t|,/).map((x) => x.trim());
    if (/^name$/i.test(c[0])) return;
    let name = c[0];
    if (!name) { errors.push(`Line ${i + 1} has no name.`); return; }
    const n = (seen.get(name.toLowerCase()) ?? 0) + 1; seen.set(name.toLowerCase(), n);
    if (n > 1) name = `${name} (${n})`;
    let maxHours = defaultMax, dept = '';
    const off: number[] = [];
    for (const v of c.slice(1)) {
      if (!v) continue;
      const words = v.toLowerCase().split(/[\s/;]+/).filter(Boolean);
      if (/^-?[\d.]+\s*(h|hrs?|hours?)?$/i.test(v)) {
        const h = parseFloat(v);
        if (h >= 0 && h <= 168) maxHours = h; else errors.push(`Line ${i + 1}: ${v} is not a possible number of hours a week.`);
      } else if (words.every((w) => DAYS_RE[w.slice(0, 3)] !== undefined && w.length >= 3)) {
        for (const w of words) { const d = DAYS_RE[w.slice(0, 3)]; if (!off.includes(d)) off.push(d); }
      } else if (!dept) dept = v;
      else errors.push(`Line ${i + 1}: "${v}" is not hours or days off.`);
    }
    staff.push({ name, dept, maxHours, off });
  });
  return { staff, errors };
}

/** People a shift needs in a department. */
export const needFor = (s: Shift, dept: string) => s.needBy?.[dept.trim().toLowerCase()] ?? s.need;
/** "2" or "2, Kitchen 3, Security 0": a number for every department, then any department that differs. */
export function parseNeed(text: string) {
  const parts = text.split(/[,;]/).map((x) => x.trim()).filter(Boolean);
  let need = NaN; const needBy: Record<string, number> = {}, errors: string[] = [];
  for (const p of parts) {
    const m = /^(.*?)\s*:?\s*(\d+)$/.exec(p);
    if (!m || +m[2] > 999) { errors.push(`"${p}" should be a number, or a department and a number.`); continue; }
    if (!m[1]) need = +m[2]; else needBy[m[1].toLowerCase()] = +m[2];
  }
  if (!Number.isFinite(need)) need = 0;
  return { need, needBy, errors };
}
export const needText = (s: Shift) => [String(s.need), ...Object.entries(s.needBy ?? {}).map(([d, n]) => `${d.replace(/(^|\s)\S/g, (c) => c.toUpperCase())} ${n}`)].join(', ');

/** Start and end of a shift on a day, in hours from the first day shown. */
function span(s: Shift, dayIndex: number) {
  const a = minutes(s.start) / 60, h = shiftHours(s);
  return [dayIndex * 24 + a, dayIndex * 24 + a + h] as const;
}

/** Fill empty cells so each department (or the whole team) has each shift's `need` people every day. People are
 *  never put on a day off, never twice on a day, never over their weekly hours (weeks start on `weekStart`), and
 *  always get `rest` hours between shifts. Those with the fewest hours so far go first, so work is shared out.
 *  Cells already filled stay as they are. Returns the new grid and the gaps that could not be filled. */
export function autoFill(staff: Staff[], shifts: Shift[], days: string[], grid: Grid, weekStart: 0 | 1 = 1, rest = 11) {
  const g: Grid = { ...grid };
  const byId = new Map(shifts.map((s) => [s.id, s]));
  const hoursBy = new Map<string, number>(), weekHours = new Map<string, number>();
  const weekOf = (iso: string) => addDays(iso, -((weekday(iso) - weekStart + 7) % 7));
  const addH = (name: string, iso: string, h: number) => { hoursBy.set(name, (hoursBy.get(name) ?? 0) + h); const k = `${name}|${weekOf(iso)}`; weekHours.set(k, (weekHours.get(k) ?? 0) + h); };
  for (const p of staff) for (const d of days) { const s = byId.get(g[key(p.name, d)]); if (s) addH(p.name, d, shiftHours(s)); }
  const groups = new Map<string, Staff[]>();
  for (const p of staff) { const k = p.dept || ''; groups.set(k, [...(groups.get(k) ?? []), p]); }
  const order = [...shifts].filter((s) => Number.isFinite(shiftHours(s))).sort((a, b) => minutes(a.start) - minutes(b.start));
  const gaps: { date: string; dept: string; shift: string; short: number }[] = [];
  const fits = (p: Staff, s: Shift, di: number) => {
    const d = days[di];
    if (p.off.includes(weekday(d)) || g[key(p.name, d)]) return false;
    if ((weekHours.get(`${p.name}|${weekOf(d)}`) ?? 0) + shiftHours(s) > p.maxHours + 1e-9) return false;
    const [a, b] = span(s, di);
    for (const dj of [di - 1, di + 1]) {
      if (dj < 0 || dj >= days.length) continue;
      const o = byId.get(g[key(p.name, days[dj])]); if (!o) continue;
      const [c, e] = span(o, dj);
      if (dj < di ? a - e < rest : c - b < rest) return false;
    }
    return true;
  };
  days.forEach((d, di) => {
    for (const [dept, people] of groups) {
      for (const s of order) {
        let have = people.filter((p) => g[key(p.name, d)] === s.id).length;
        const n0 = people.length;
        const cands = people.map((p, i) => ({ p, i })).filter(({ p }) => fits(p, s, di))
          .sort((x, y) => (hoursBy.get(x.p.name) ?? 0) - (hoursBy.get(y.p.name) ?? 0) || ((x.i - di + n0 * 31) % n0) - ((y.i - di + n0 * 31) % n0));
        const need = needFor(s, dept);
        for (const { p } of cands) { if (have >= need) break; if (!fits(p, s, di)) continue; g[key(p.name, d)] = s.id; addH(p.name, d, shiftHours(s)); have++; }
        if (have < need) gaps.push({ date: d, dept, shift: s.id, short: need - have });
      }
    }
  });
  return { grid: g, gaps };
}

/** How many people work each shift on each day, for the given people. */
export function coverage(staff: Staff[], shifts: Shift[], days: string[], grid: Grid) {
  return days.map((d) => Object.fromEntries(shifts.map((s) => [s.id, staff.filter((p) => grid[key(p.name, d)] === s.id).length])) as Record<string, number>);
}
export function totals(p: Staff, shifts: Shift[], days: string[], grid: Grid) {
  const byId = new Map(shifts.map((s) => [s.id, s]));
  let hours = 0, count = 0;
  for (const d of days) { const s = byId.get(grid[key(p.name, d)]); if (s) { hours += shiftHours(s); count++; } }
  return { hours, count };
}

/** People over their weekly hours, working on a day off, or with too little rest, for warnings. */
export function problems(staff: Staff[], shifts: Shift[], days: string[], grid: Grid, weekStart: 0 | 1 = 1, rest = 11) {
  const byId = new Map(shifts.map((s) => [s.id, s])), out: string[] = [];
  const weekOf = (iso: string) => addDays(iso, -((weekday(iso) - weekStart + 7) % 7));
  for (const p of staff) {
    const wk = new Map<string, number>();
    days.forEach((d, di) => {
      const s = byId.get(grid[key(p.name, d)]); if (!s) return;
      if (p.off.includes(weekday(d))) out.push(`${p.name} works on a day off (${dayLabel(d)}).`);
      wk.set(weekOf(d), (wk.get(weekOf(d)) ?? 0) + shiftHours(s));
      const o = di > 0 ? byId.get(grid[key(p.name, days[di - 1])]) : undefined;
      if (o && span(s, di)[0] - span(o, di - 1)[1] < rest) out.push(`${p.name} has under ${rest} hours' rest before ${dayLabel(d)}.`);
    });
    for (const [w, h] of wk) if (h > p.maxHours + 1e-9) out.push(`${p.name} is over ${p.maxHours} hours in the week of ${dayLabel(w)} (${+h.toFixed(2)} h).`);
  }
  return out;
}

export type CellText = 'name' | 'code' | 'time';
export type TableOpts = { cell: CellText; dept: boolean; hours: boolean; count: boolean; cover: boolean; colors?: boolean; extra?: string; totalDays?: string[] };
export type Cell = { text: string; fill?: string; bold?: boolean; align?: 'l' | 'c' | 'r' };
export type TableModel = { head: Cell[]; rows: Cell[][]; widths: number[] }; // widths: relative

/** The schedule as a table: one row per person, one column per day, optional department, hours and shift count
 *  columns and a coverage row. All downloads draw from this. */
export function buildTable(staff: Staff[], shifts: Shift[], days: string[], grid: Grid, o: TableOpts): TableModel {
  const byId = new Map(shifts.map((s) => [s.id, s])), paint = o.colors !== false, extra = (o.extra ?? '').trim();
  const txt = (s: Shift) => (o.cell === 'code' ? s.code : o.cell === 'time' ? `${fmtTime(minutes(s.start))}-${fmtTime(minutes(s.end))}` : s.name);
  const wDay = o.cell === 'time' ? 2.2 : o.cell === 'code' ? 0.9 : Math.max(1.2, Math.min(2.4, Math.max(...shifts.map((s) => s.name.length)) * 0.2));
  const head: Cell[] = [{ text: 'Name', bold: true, align: 'l' }, ...(o.dept ? [{ text: 'Department', bold: true, align: 'l' as const }] : []), ...days.map((d) => ({ text: dayLabel(d), bold: true, align: 'c' as const })), ...(o.hours ? [{ text: 'Hours', bold: true, align: 'r' as const }] : []), ...(o.count ? [{ text: 'Shifts', bold: true, align: 'r' as const }] : []), ...(extra ? [{ text: extra, bold: true, align: 'l' as const }] : [])];
  const widths = [Math.max(2.4, Math.min(5, Math.max(4, ...staff.map((p) => p.name.length)) * 0.22)), ...(o.dept ? [2.4] : []), ...days.map(() => wDay), ...(o.hours ? [1.2] : []), ...(o.count ? [1.1] : []), ...(extra ? [2.4] : [])];
  const rows: Cell[][] = staff.map((p) => {
    const t = totals(p, shifts, o.totalDays ?? days, grid);
    return [{ text: p.name, align: 'l' }, ...(o.dept ? [{ text: p.dept, align: 'l' as const }] : []),
      ...days.map((d) => { const s = byId.get(grid[key(p.name, d)]); return s ? { text: txt(s), fill: paint ? s.color : undefined, align: 'c' as const } : { text: p.off.includes(weekday(d)) ? 'off' : '', align: 'c' as const }; }),
      ...(o.hours ? [{ text: String(+t.hours.toFixed(2)), align: 'r' as const }] : []), ...(o.count ? [{ text: String(t.count), align: 'r' as const }] : []), ...(extra ? [{ text: '' }] : [])];
  });
  if (o.cover && shifts.length) {
    // Needs are per department, so a table holding several departments adds them up.
    const cov = coverage(staff, shifts, days, grid), groups = [...new Set(staff.map((p) => p.dept))];
    for (const s of shifts) { const need = groups.reduce((a, d) => a + needFor(s, d), 0); rows.push([{ text: `${s.name} (need ${need})`, bold: true, align: 'l' }, ...(o.dept ? [{ text: '' }] : []), ...cov.map((c) => ({ text: String(c[s.id]), align: 'c' as const, bold: c[s.id] < need, fill: c[s.id] < need && paint ? '#f8d0d0' : undefined })), ...(o.hours ? [{ text: '' }] : []), ...(o.count ? [{ text: '' }] : []), ...(extra ? [{ text: '' }] : [])]); }
  }
  return { head, rows, widths };
}

export type Size = 'small' | 'medium' | 'large';
const FIRST = ['Ava', 'Ben', 'Cara', 'Dev', 'Eli', 'Fay', 'Gus', 'Hana', 'Ivo', 'Jade', 'Kai', 'Lena', 'Milo', 'Nia', 'Omar', 'Pia', 'Quinn', 'Rosa', 'Sam', 'Tara', 'Umar', 'Vera', 'Wes', 'Xena', 'Yusuf', 'Zoe', 'Arjun', 'Bea', 'Cole', 'Dina', 'Emre', 'Faith', 'Gita', 'Hugo', 'Isla', 'Jon'];
const LAST = 'ABCDEFGH';
const DEPTS: Record<Size, string[]> = { small: [''], medium: ['Front desk', 'Kitchen', 'Cleaning', 'Stockroom'], large: ['Checkouts', 'Bakery', 'Produce', 'Deli', 'Stockroom', 'Customer service', 'Security', 'Cleaning'] };
const PEOPLE: Record<Size, number> = { small: 8, medium: 36, large: 150 };
/** Made-up team and shifts for each team size (names are invented first names with a letter). */
export function exampleTeam(size: Size) {
  const depts = DEPTS[size], n = PEOPLE[size], lines: string[] = [];
  for (let i = 0; i < n; i++) {
    const name = i < FIRST.length ? FIRST[i] : `${FIRST[i % FIRST.length]} ${LAST[Math.floor(i / FIRST.length)]}.`;
    const max = [40, 40, 32, 24, 40][i % 5], off = i % 4 === 0 ? 'Sun' : i % 4 === 1 ? 'Sat' : i % 7 === 3 ? 'Wed' : '';
    lines.push([name, depts[Math.floor((i * depts.length) / n)], max, off].filter((x) => x !== '').join(', '));
  }
  const shifts: Shift[] = [
    { id: 's1', name: 'Morning', code: 'M', start: '07:00', end: '15:00', need: size === 'large' ? 3 : 2, color: PALETTE[0] },
    { id: 's2', name: 'Evening', code: 'E', start: '15:00', end: '23:00', need: size === 'large' ? 3 : 2, color: PALETTE[1] },
  ];
  if (size === 'large') shifts.push({ id: 's3', name: 'Night', code: 'N', start: '23:00', end: '07:00', need: 2, color: PALETTE[3] });
  return { staff: lines.join('\n'), shifts };
}
/** A short code from a shift name that no other shift uses: M, E, N, then M2 and so on. */
export function codeFor(name: string, used: string[]) {
  const base = (name.trim()[0] ?? 'S').toUpperCase();
  if (!used.includes(base)) return base;
  for (let i = 2; ; i++) if (!used.includes(`${base}${i}`)) return `${base}${i}`;
}
