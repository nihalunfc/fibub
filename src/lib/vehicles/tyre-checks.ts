// Shared maths for the tyre checks: DOT date code (tyre-age), tread depth (tread-depth) and the winter
// check (winter-tyres). Pure TypeScript, no DOM. Rules are as checked November 2026; the pages say to check the official source.

export type Level = 'good' | 'warn' | 'bad';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ---------- DOT date code ----------
export type TyreDate =
  | { ok: true; week: number; year: number; pre2000: boolean; start: Date; end: Date }
  | { ok: false; error: string };

/** Read the 3 or 4 digit date code at the end of a DOT number (WWYY from 2000, WWY in the 1990s). */
export function parseDateCode(raw: string): TyreDate {
  const d = raw.replace(/\D/g, '');
  if (d.length !== 4 && d.length !== 3) return { ok: false, error: 'Type the 4 digits of the date code (for example 2423). Tyres made before 2000 have only 3.' };
  const week = parseInt(d.slice(0, 2), 10);
  if (week < 1 || week > 53) return { ok: false, error: 'The first two digits are the week, from 01 to 53. Check the digits.' };
  const pre2000 = d.length === 3;
  const year = pre2000 ? 1990 + parseInt(d[2], 10) : 2000 + parseInt(d.slice(2), 10);
  const start = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const end = new Date(start.getTime() + 6 * 86400000);
  return { ok: true, week, year, pre2000, start, end };
}

/** "11-17 June 2023" or "30 December 2023 - 5 January 2024". */
export function weekRange(s: Date, e: Date): string {
  const f = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  if (s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear()) return `${s.getUTCDate()}-${f(e)}`;
  return `${f(s)} - ${f(e)}`;
}

/** Whole months from the start of the make week to `now` (never below 0). */
export function ageMonths(start: Date, now: Date): number {
  let m = (now.getUTCFullYear() - start.getUTCFullYear()) * 12 + now.getUTCMonth() - start.getUTCMonth();
  if (now.getUTCDate() < start.getUTCDate()) m -= 1;
  return Math.max(0, m);
}

export function ageText(months: number): string {
  const y = Math.floor(months / 12), m = months % 12;
  const ys = y ? `${y} year${y === 1 ? '' : 's'}` : '';
  const ms = m ? `${m} month${m === 1 ? '' : 's'}` : '';
  return [ys, ms].filter(Boolean).join(' ') || 'under a month';
}

/** Plain advice by age. Maker advice differs: some car makers say 6 years, many say 10 at most. */
export function ageAdvice(months: number): { level: Level; label: string; text: string } {
  if (months >= 120) return { level: 'bad', label: 'Replace', text: '10 years or more: replace it, whatever it looks like. Rubber hardens and cracks inside where you cannot see.' };
  if (months >= 60) return { level: 'warn', label: 'Check every year', text: '5 years or more: have a tyre shop check it every year (some car makers say replace at 6). Look for cracks, bulges and dry, hard rubber.' };
  return { level: 'good', label: 'Normal checks', text: 'Under 5 years: check it as usual. Look at the tread, the sidewalls and the pressure each month.' };
}

// ---------- tread depth ----------
export type Vehicle = 'car' | 'motorcycle' | 'truck';
export type Region = 'uk' | 'usa' | 'canada' | 'india' | 'gulf';
export const MM_PER_32ND = 25.4 / 32;
export const to32nds = (mm: number) => mm / MM_PER_32ND;
export const from32nds = (n: number) => n * MM_PER_32ND;

/** Legal minimum (mm) for a region and vehicle, and what to say about it. */
export function legalMinimum(region: Region, v: Vehicle): { mm: number; note: string } {
  if (region === 'uk') {
    if (v === 'motorcycle') return { mm: 1, note: 'UK: 1 mm over three-quarters of the width, for motorcycles over 50 cc (smaller ones: tread must be visible).' };
    if (v === 'truck') return { mm: 1, note: 'UK: 1 mm across three-quarters of the width for vehicles over 3.5 tonnes and buses.' };
    return { mm: 1.6, note: 'UK: 1.6 mm across the central three-quarters of the tread, all the way round.' };
  }
  if (region === 'usa') {
    if (v === 'truck') return { mm: from32nds(2), note: 'USA: most states say 2/32 inch. Federal rules for big trucks want 4/32 on the steering tyres.' };
    return { mm: from32nds(2), note: 'USA: most states say 2/32 inch (about 1.6 mm). A few set their own number.' };
  }
  if (region === 'canada') return { mm: from32nds(2), note: 'Canada: it varies by province; 2/32 inch (about 1.6 mm) is common.' };
  if (region === 'india') return { mm: 1.6, note: 'India: 1.6 mm is the figure usually cited, matching the wear bars. Check your local rule.' };
  return { mm: 1.6, note: 'Gulf states: 1.6 mm is the figure usually cited. Check your local rule.' };
}

export type Tread = { level: Level; label: string; text: string; limitMm: number; note: string };

/** Judge a tread depth (mm). Replace under the legal minimum, "close" under a safer line (3 mm cars and trucks, 2 mm motorcycles). */
export function judgeTread(mm: number, region: Region, v: Vehicle): Tread {
  const { mm: limitMm, note } = legalMinimum(region, v);
  const soon = v === 'motorcycle' ? 2 : 3;
  if (mm < limitMm - 1e-9) return { level: 'bad', label: 'Replace', text: 'Below the legal minimum. Replace the tyre before you drive on.', limitMm, note };
  if (mm < soon - 1e-9) return { level: 'warn', label: 'Close to limit', text: 'Still legal, but wet-road grip is falling fast. Plan to replace it soon.', limitMm, note };
  return { level: 'good', label: 'Legal', text: mm < 4 - 1e-9 ? 'Legal. Wet grip starts to fade below about 3 to 4 mm, so keep an eye on it.' : 'Legal, with a healthy amount of tread.', limitMm, note };
}

/** The plain "stopping gets longer" line. Estimate only. */
export function wetStopNote(mm: number): string {
  if (mm >= 4) return 'Wet roads: stopping is close to what the tyre can give.';
  if (mm >= 3) return 'Wet roads: stopping already starts to get longer.';
  return 'Wet roads: stopping gets a lot longer, and the tyre may aquaplane sooner.';
}

// ---------- winter check ----------
export type Symbol3 = 'snowflake' | 'ms' | 'none';
export type Reason = { level: Level; text: string };

export const WINTER_MIN_MM = 4; // 5/32 inch is 3.97 mm; 4 mm (5/32") is the floor for a winter tyre

/** Judge a winter set from the sidewall symbol, tread (mm), age in months (null = unknown) and a cold pressure check. */
export function judgeWinter(o: { symbol: Symbol3; treadMm: number | null; ageMonths: number | null; pressureChecked: boolean }): { level: Level; label: string; reasons: Reason[] } {
  const r: Reason[] = [];
  if (o.symbol === 'snowflake') r.push({ level: 'good', text: 'Three-peak mountain snowflake: the tyre passed a snow-grip test.' });
  else if (o.symbol === 'ms') r.push({ level: 'warn', text: 'M+S only: the mark says mud and snow, but it needs no snow-grip test. Many rules accept it; the snowflake grips better.' });
  else r.push({ level: 'bad', text: 'No winter mark: summer tyres go hard and lose grip below about 7 C.' });
  if (o.treadMm == null || !isFinite(o.treadMm)) r.push({ level: 'warn', text: 'Measure the tread: a winter tyre wants 4 mm (5/32 inch) or more.' });
  else if (o.treadMm < WINTER_MIN_MM - 0.1) r.push({ level: 'bad', text: `Tread is ${o.treadMm.toFixed(1)} mm: under 4 mm (5/32 inch) a winter tyre loses most of its snow grip.` });
  else r.push({ level: 'good', text: `Tread is ${o.treadMm.toFixed(1)} mm: enough for snow.` });
  if (o.ageMonths == null) r.push({ level: 'warn', text: 'Read the date code (see the tyre age tool): old rubber hardens and loses winter grip.' });
  else if (o.ageMonths >= 120) r.push({ level: 'bad', text: '10 years or more old: replace it.' });
  else if (o.ageMonths >= 72) r.push({ level: 'warn', text: 'Over 6 years old: the rubber may have hardened. Have it checked.' });
  else r.push({ level: 'good', text: 'Age is fine.' });
  if (o.pressureChecked) r.push({ level: 'good', text: 'Pressure checked cold.' });
  else r.push({ level: 'warn', text: 'Check the pressure with cold tyres: cold air drops it, about 1 psi per 5 C.' });
  const bad = r.some((x) => x.level === 'bad'), warn = r.some((x) => x.level === 'warn');
  return bad ? { level: 'bad', label: 'Not ready', reasons: r } : warn ? { level: 'warn', label: 'Check these', reasons: r } : { level: 'good', label: 'Ready', reasons: r };
}

export const WINTER_RULES: Record<'canada' | 'usa' | 'uk', string[]> = {
  canada: [
    'Quebec: winter tyres are required on passenger vehicles from 1 December to 15 March.',
    'British Columbia: winter tyres (M+S or the snowflake) are required on many highways from 1 October to 31 March (some routes to 30 April).',
    'Ontario: no law, but insurers must offer a discount for winter tyres.',
  ],
  usa: [
    'No winter tyre law in most states.',
    'Some mountain passes and areas ask for chains or snow-rated tyres during storms.',
  ],
  uk: ['No winter tyre law in the UK. Winter tyres are allowed, and help in snow and in cold, wet weather.'],
};
