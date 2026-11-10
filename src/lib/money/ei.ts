// #T848 EI Calculator: plain maths, no DOM. Canadian Employment Insurance regular benefits.
// Defaults checked on canada.ca, laws.justice.gc.ca and gazette.gc.ca on 2026-11-10. Every value can be overridden.

export const CHECKED = '2026-11-10';

export interface Rules {
  rate: number;          // benefit rate, share of average insurable weekly earnings (0.55)
  mie: number;           // maximum insurable earnings for the year
  maxWeekly: number;     // maximum weekly benefit
  hours: number[];       // hours needed, 9 bands: 6% or less, 6.1-7, ... 12.1-13, over 13
  bestWeeks: number[];   // best weeks used for the average, same 9 bands
  fishing: number[];     // fishing earnings needed, same 9 bands
  maxWeeks: number;      // most weeks of regular benefits in a claim
  waitingWeeks: number;  // unpaid waiting period
  // Temporary measures (claim start dates, inclusive, yyyy-mm-dd)
  waiverFrom: string; waiverTo: string;
  longFrom: string; longTo: string; longExtra: number; longMax: number;
  seasonalFrom: string; seasonalTo: string; seasonalExtra: number;
  lastSepFrom: string; lastSepTo: string;
}

export const DEFAULTS: Rules = {
  rate: 0.55,
  mie: 68900,
  maxWeekly: 729,
  hours: [700, 665, 630, 595, 560, 525, 490, 455, 420],
  bestWeeks: [22, 21, 20, 19, 18, 17, 16, 15, 14],
  fishing: [4200, 4000, 3800, 3600, 3400, 3200, 2900, 2700, 2500],
  maxWeeks: 45,
  waitingWeeks: 1,
  waiverFrom: '2025-03-30', waiverTo: '2027-10-09',
  longFrom: '2025-06-15', longTo: '2027-06-12', longExtra: 20, longMax: 65,
  seasonalFrom: '2021-09-26', seasonalTo: '2026-10-24', seasonalExtra: 5,
  lastSepFrom: '2026-10-11', lastSepTo: '2027-10-09',
};

export const BANDS = ['6% or less', '6.1% to 7%', '7.1% to 8%', '8.1% to 9%', '9.1% to 10%', '10.1% to 11%', '11.1% to 12%', '12.1% to 13%', 'More than 13%'];

/** Column of Schedule I (0 = 6% or less, 1 = over 6 to 7%, ... 11 = over 16%). */
export function column(rate: number): number {
  if (!(rate > 6)) return 0;
  return Math.min(11, Math.ceil(Math.round((rate - 6) * 1000) / 1000));
}
/** Band for the hours, best-weeks and fishing tables (0..8; over 13% is 8). */
export const band = (rate: number) => Math.min(8, column(rate));

/** Violation levels raise the hours needed: none, minor, serious, very serious, subsequent. */
export const VIOLATION = [1, 1.25, 1.5, 1.75, 2];
export const VIOLATION_NAMES = ['None', 'Minor', 'Serious', 'Very serious', 'Subsequent'];

export function hoursNeeded(rate: number, violation = 0, rules: Rules = DEFAULTS): number {
  return Math.round(rules.hours[band(rate)] * (VIOLATION[violation] ?? 1));
}

/**
 * Weeks of regular benefits from Schedule I of the Employment Insurance Act (Table of Weeks of Benefits).
 * The table follows a pattern: in the 6%-or-less column it is 10 weeks plus 1 for every 70 hours above 420,
 * and from 1,400 hours 24 weeks plus 1 for every 35 hours; each higher column adds 2 weeks; never more than 45.
 * Returns 0 below 420 hours. (Whether the hours are enough is decided by hoursNeeded.)
 */
export function scheduleWeeks(hours: number, rate: number, cap = 45): number {
  if (hours < 420) return 0;
  const h = Math.min(hours, 1820);
  const base = h >= 1400 ? 24 + Math.floor((h - 1400) / 35) : 10 + Math.floor((h - 420) / 70);
  return Math.min(cap, base + 2 * column(rate));
}

export interface Input {
  rate: number;            // regional unemployment rate, %
  hours: number;           // insurable hours in the qualifying period
  bestTotal: number;       // insurable earnings in the best weeks (total), before tax
  violation?: number;
  reason: Reason;
  sevenDays: boolean;      // 7 days in a row without work and pay
  work?: Work;
  claimDate?: string;      // yyyy-mm-dd
  longTenured?: boolean;
  seasonal?: boolean;      // meets the seasonal pattern and lives in a listed region
  seasonalRegion?: boolean;
  fishingEarnings?: number;
  extraWeeks?: number;     // any custom extra weeks
  rules?: Rules;
}

export type Reason = 'layoff' | 'contract' | 'fired' | 'just-cause' | 'quit' | 'misconduct' | 'dispute';
export type Work = 'employee' | 'seasonal' | 'teacher' | 'fisher' | 'self' | 'apprentice';

export const REASONS: Record<Reason, { name: string; ok: boolean | null; note: string }> = {
  layoff: { name: 'Laid off or shortage of work', ok: true, note: 'A layoff or shortage of work is through no fault of your own, the usual way to qualify.' },
  contract: { name: 'Contract, term or season ended', ok: true, note: 'The end of a contract, term or season counts as no fault of your own.' },
  fired: { name: 'Let go, but not for misconduct', ok: true, note: 'Being let go for reasons other than misconduct (for example, the job was not a good fit) can qualify.' },
  'just-cause': { name: 'Quit with just cause', ok: null, note: 'Quitting can qualify if you had just cause and no reasonable choice but to leave (for example harassment, unsafe work, a big cut in pay or duties, moving with a spouse or child, or a firm job offer elsewhere). Service Canada decides, so keep proof.' },
  quit: { name: 'Quit without just cause', ok: false, note: 'Leaving a job voluntarily without just cause usually means no regular benefits.' },
  misconduct: { name: 'Fired for misconduct', ok: false, note: 'Losing a job because of your own misconduct usually means no regular benefits.' },
  dispute: { name: 'Strike or lockout', ok: false, note: 'You cannot get benefits while you are directly part of a labour dispute (strike or lockout).' },
};

const inRange = (d: string | undefined, a: string, b: string) => !!d && d >= a && d <= b;

export interface Result {
  band: number; column: number;
  needed: number; hoursOk: boolean;
  reasonOk: boolean | null;
  eligible: boolean | null;   // null = depends on a decision by Service Canada
  bestWeeks: number;
  avgWeekly: number;          // average insurable weekly earnings (capped)
  weekly: number;             // weekly benefit before tax
  baseWeeks: number;
  extra: number;
  weeks: number;              // total weeks of benefits
  waiting: number;            // unpaid waiting weeks
  total: number;              // weekly x weeks, before tax
  waived: boolean; longApplies: boolean; seasonalApplies: boolean; lastSepOnly: boolean;
  fishingNeeded: number;
  notes: string[];
}

export function ei(inp: Input): Result {
  const r = inp.rules ?? DEFAULTS;
  const b = band(inp.rate), c = column(inp.rate);
  const work = inp.work ?? 'employee';
  const needed = hoursNeeded(inp.rate, inp.violation ?? 0, r);
  const fishingNeeded = r.fishing[b];
  const hoursOk = work === 'fisher' ? (inp.fishingEarnings ?? 0) >= fishingNeeded : inp.hours >= needed;
  const reasonOk = work === 'fisher' ? true : REASONS[inp.reason].ok;
  const bestWeeks = r.bestWeeks[b];
  const weekCap = r.mie / 52;
  const avgWeekly = Math.min(weekCap, Math.max(0, inp.bestTotal) / bestWeeks);
  // Service Canada rounds the weekly rate to the dollar (2026: $68,900 / 52 x 55% = $728.75, published as $729).
  const weekly = Math.min(r.maxWeekly, Math.round(avgWeekly * r.rate));
  const notes: string[] = [];

  let baseWeeks = scheduleWeeks(inp.hours, inp.rate, r.maxWeeks);
  if (work === 'fisher') { baseWeeks = 26; notes.push('Fishing benefits are based on your fishing earnings, not hours, and a claim usually pays up to 26 weeks.'); }
  const waived = inRange(inp.claimDate, r.waiverFrom, r.waiverTo);
  const longApplies = !!inp.longTenured && work !== 'fisher' && inRange(inp.claimDate, r.longFrom, r.longTo);
  const seasonalApplies = !!inp.seasonal && !!inp.seasonalRegion && inRange(inp.claimDate, r.seasonalFrom, r.seasonalTo);
  const lastSepOnly = inRange(inp.claimDate, r.lastSepFrom, r.lastSepTo);
  let extra = Math.max(0, inp.extraWeeks ?? 0);
  if (longApplies) extra += r.longExtra;
  if (seasonalApplies) extra += r.seasonalExtra;
  const cap = longApplies ? r.longMax : r.maxWeeks;
  const weeks = hoursOk ? Math.min(cap, baseWeeks + extra) : 0;
  if (seasonalApplies && baseWeeks + r.seasonalExtra > r.maxWeeks && !longApplies) notes.push(`Seasonal extra weeks are capped so the claim stays at ${r.maxWeeks} weeks or fewer.`);

  if (work === 'self') notes.push('Self-employed people cannot get regular (layoff) benefits. If you registered for the EI special benefits for self-employed people, you can claim sickness, maternity, parental and caregiving benefits only.');
  if (work === 'teacher') notes.push('Teachers usually cannot get regular benefits during a non-teaching period such as the summer, unless the contract ended, you worked on a casual or substitute basis, or you qualify through other work.');
  if (work === 'apprentice') notes.push('Apprentices sent to full-time technical training by their province can claim while in class, and serve the waiting week only once for the whole apprenticeship.');

  const waiting = waived ? 0 : r.waitingWeeks;
  const eligible = work === 'self' || !hoursOk || !inp.sevenDays || reasonOk === false ? false : reasonOk === null ? null : true;
  return {
    band: b, column: c, needed, hoursOk, reasonOk, eligible, bestWeeks, avgWeekly, weekly,
    baseWeeks, extra, weeks, waiting, total: weekly * weeks, waived, longApplies, seasonalApplies, lastSepOnly, fishingNeeded, notes,
  };
}

/** EI economic regions and their unemployment rates for 8 November to 5 December 2026 (ESDC). [province, code, name, rate] */
export const RATES_PERIOD = '8 November to 5 December 2026';
export const REGIONS: [string, string, string, number][] = [
  ['NL', '01', "St. John's", 6.4], ['NL', '02', 'Newfoundland/Labrador', 11.4],
  ['PE', '65', 'Charlottetown', 5.7], ['PE', '66', 'Prince Edward Island', 10.1],
  ['NS', '04', 'Eastern Nova Scotia', 8.5], ['NS', '05', 'Western Nova Scotia', 6.4], ['NS', '06', 'Halifax', 5.6],
  ['NB', '07', 'Fredericton-Moncton-Saint John', 6.8], ['NB', '08', 'Madawaska-Charlotte', 6.7], ['NB', '09', 'Restigouche-Albert', 10.1],
  ['QC', '10', 'Gaspésie-Îles-de-la-Madeleine', 10.8], ['QC', '11', 'Quebec', 4.6], ['QC', '12', 'Trois-Rivières', 5.2],
  ['QC', '13', 'South Central Quebec', 2.8], ['QC', '14', 'Sherbrooke', 4.5], ['QC', '15', 'Montérégie', 4.5],
  ['QC', '16', 'Montreal', 7.2], ['QC', '17', 'Central Quebec', 2.9], ['QC', '18', 'North Western Quebec', 3.7],
  ['QC', '19', 'Lower Saint Lawrence and North Shore', 4.8], ['QC', '20', 'Hull', 6.7], ['QC', '21', 'Chicoutimi-Jonquière', 3.8],
  ['ON', '22', 'Ottawa', 7.7], ['ON', '23', 'Eastern Ontario', 6.1], ['ON', '24', 'Kingston', 5.9], ['ON', '25', 'Central Ontario', 6.5],
  ['ON', '26', 'Oshawa', 9.0], ['ON', '27', 'Toronto', 7.2], ['ON', '28', 'Hamilton', 7.6], ['ON', '29', 'St. Catharines', 7.3],
  ['ON', '30', 'London', 8.4], ['ON', '31', 'Niagara', 6.8], ['ON', '32', 'Windsor', 8.0], ['ON', '33', 'Kitchener', 7.0],
  ['ON', '34', 'Huron', 7.2], ['ON', '35', 'South Central Ontario', 5.4], ['ON', '36', 'Sudbury', 5.4], ['ON', '37', 'Thunder Bay', 4.3],
  ['ON', '38', 'Northern Ontario', 6.7],
  ['MB', '39', 'Winnipeg', 5.0], ['MB', '40', 'Southern Manitoba', 6.1], ['MB', '41', 'Northern Manitoba', 28.0],
  ['SK', '42', 'Regina', 5.9], ['SK', '43', 'Saskatoon', 5.9], ['SK', '44', 'Southern Saskatchewan', 6.9], ['SK', '45', 'Northern Saskatchewan', 14.6],
  ['AB', '46', 'Calgary', 6.9], ['AB', '47', 'Edmonton', 7.4], ['AB', '48', 'Northern Alberta', 8.8], ['AB', '49', 'Southern Alberta', 7.0],
  ['BC', '50', 'Southern Interior British Columbia', 7.8], ['BC', '51', 'Abbotsford', 7.0], ['BC', '52', 'Vancouver', 6.8],
  ['BC', '53', 'Victoria', 5.3], ['BC', '54', 'Southern Coastal British Columbia', 6.5], ['BC', '55', 'Northern British Columbia', 8.4],
  ['YT', '59', 'Whitehorse', 5.5], ['YT', '60', 'Yukon', 7.1],
  ['NT', '61', 'Yellowknife', 4.4], ['NT', '62', 'Northwest Territories', 9.0],
  ['NU', '63', 'Iqaluit', 5.8], ['NU', '64', 'Nunavut', 15.5],
];
/** Regions in the seasonal claimant measure (regions 02, 04, 05, 66, 65, 08, 09, 10, 19, 17, 21, 18, 60). */
export const SEASONAL_REGIONS = ['02', '04', '05', '66', '65', '08', '09', '10', '19', '17', '21', '18', '60'];
export const PROVINCE_NAMES: Record<string, string> = {
  NL: 'Newfoundland and Labrador', PE: 'Prince Edward Island', NS: 'Nova Scotia', NB: 'New Brunswick', QC: 'Quebec', ON: 'Ontario',
  MB: 'Manitoba', SK: 'Saskatchewan', AB: 'Alberta', BC: 'British Columbia', YT: 'Yukon', NT: 'Northwest Territories', NU: 'Nunavut',
};

// ---------- Pay stubs and the Record of Employment (ROE) ----------

export interface Stub { end: string; days: number; hours: number; earnings: number }
export const PERIODS: Record<string, { name: string; days: number }> = {
  W: { name: 'Weekly', days: 7 }, B: { name: 'Every two weeks', days: 14 },
  S: { name: 'Twice a month', days: 365.25 / 24 }, M: { name: 'Monthly', days: 365.25 / 12 },
};

const dayMs = 86400000;
const toDay = (s: string) => Math.floor(Date.parse(s + 'T00:00:00Z') / dayMs);

/**
 * Adds up pay stubs for the qualifying period (the 52 weeks before the claim date) and finds the best weeks.
 * Each stub's pay is spread evenly over the weeks it covers, the way ROE pay periods are read.
 */
export function fromStubs(stubs: Stub[], claimDate: string, bestN: number, mie = DEFAULTS.mie) {
  const end = toDay(claimDate), start = end - 52 * 7;
  let hours = 0, earnings = 0, used = 0;
  const weeks: number[] = [];
  for (const s of stubs) {
    if (!s.end || !(s.days > 0)) continue;
    const e = toDay(s.end);
    if (!isFinite(e) || e < start || e > end + 6) continue;
    used++;
    hours += Math.max(0, s.hours || 0);
    earnings += Math.max(0, s.earnings || 0);
    const n = s.days / 7;
    const whole = Math.max(1, Math.round(n));
    for (let i = 0; i < whole; i++) weeks.push(Math.min(mie / 52, (s.earnings || 0) / whole));
  }
  weeks.sort((a, b) => b - a);
  const best = weeks.slice(0, bestN);
  // If there are fewer weeks of pay than best weeks, the missing weeks count as zero (that is how the divisor works).
  const bestTotal = best.reduce((a, b) => a + b, 0);
  return { used, hours, earnings, weeksOfPay: weeks.length, bestTotal, short: Math.max(0, bestN - weeks.length) };
}

/** Block 16 reason codes on the ROE, as Service Canada lists them. */
export const ROE_CODES: Record<string, { name: string; reason?: Reason }> = {
  A: { name: 'Shortage of work, end of contract or season', reason: 'layoff' },
  B: { name: 'Strike or lockout', reason: 'dispute' },
  D: { name: 'Illness or injury (sickness benefits may apply)' },
  E: { name: 'Quit', reason: 'quit' },
  F: { name: 'Maternity' },
  G: { name: 'Retirement' },
  H: { name: 'Work-Sharing' },
  J: { name: 'Apprentice training' },
  K: { name: 'Other' },
  M: { name: 'Dismissal or suspension', reason: 'fired' },
  N: { name: 'Leave of absence' },
  P: { name: 'Parental' },
  Z: { name: 'Compassionate care or family caregiver' },
};

const money = (s: string) => parseFloat(s.replace(/[$,\s]/g, ''));
const DATE = /(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})|(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})|([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})/;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
export function readDate(s: string): string | null {
  const m = s.match(DATE);
  if (!m) return null;
  let y: number, mo: number, d: number;
  if (m[1]) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else if (m[4]) { y = +m[6]; d = +m[4]; mo = +m[5]; if (mo > 12) [d, mo] = [mo, d]; }
  else { mo = MONTHS.indexOf(m[7].slice(0, 3).toLowerCase()) + 1; d = +m[8]; y = +m[9]; if (!mo) return null; }
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export interface Found { kind: 'roe' | 'stub' | 'unknown'; hours?: number; earnings?: number; reasonCode?: string; lastDay?: string; period?: string; stub?: Stub }

/**
 * Best-effort reading of text from an ROE or a pay stub (from a PDF's text or OCR). Every value is shown to the
 * person to check before it is used; documents differ a lot, so nothing here is trusted blindly.
 */
export function readDocText(raw: string): Found {
  const t = raw.replace(/ /g, ' ').replace(/[ \t]+/g, ' ');
  const roe = /record of employment|relev[ée] d'emploi|insurable hours|heures assurables/i.test(t);
  const after = (re: RegExp) => { const m = t.match(re); return m ? money(m[1]) : undefined; };
  if (roe) {
    const hours = after(/(?:15A|total insurable hours)[^0-9]{0,60}([\d,]+(?:\.\d+)?)/i);
    const earnings = after(/(?:15B|total insurable earnings)[^0-9]{0,60}\$?\s*([\d,]+\.\d{2}|[\d,]{3,})/i);
    const code = t.match(/(?:block\s*16|16\s*reason for issuing this roe|reason for issuing)[^A-Z]{0,40}\b([ABDEFGHJKMNPZ])\b/i)?.[1]?.toUpperCase();
    const ld = t.match(/(?:last day for which paid|block\s*11|\b11\b)[^0-9A-Za-z]{0,30}([^\n]{6,20})/i);
    const period = t.match(/pay period type[^A-Za-z]{0,20}(weekly|bi-?weekly|semi-?monthly|monthly)/i)?.[1];
    return { kind: 'roe', hours, earnings, reasonCode: code, lastDay: ld ? readDate(ld[1]) ?? undefined : undefined, period };
  }
  const gross = after(/(?:gross(?: pay| earnings)?|total earnings|current earnings)[^0-9$]{0,30}\$?\s*([\d,]+\.\d{2})/i);
  const hours = after(/(?:total hours|hours worked|regular hours|hours)[^0-9]{0,20}([\d,]+(?:\.\d+)?)/i);
  const endTxt = t.match(/(?:period end(?:ing)?|pay period[^\n]{0,15}to|period to|end date|pay date|cheque date|date)[^0-9A-Za-z]{0,10}([^\n]{6,22})/i);
  const end = endTxt ? readDate(endTxt[1]) : readDate(t);
  const per = /bi-?weekly|every two weeks/i.test(t) ? 'B' : /semi-?monthly/i.test(t) ? 'S' : /monthly/i.test(t) ? 'M' : /weekly/i.test(t) ? 'W' : 'B';
  if (gross == null && hours == null) return { kind: 'unknown' };
  return { kind: 'stub', stub: { end: end ?? '', days: PERIODS[per].days, hours: hours ?? 0, earnings: gross ?? 0 } };
}
