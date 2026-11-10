// Overtime rules and the shared split of a week's hours into regular, time-and-a-half and double time.
// Figures were read from the official pages named in `src` (checked 2026-11-10); everything else says "check the official source".
export type OtRule = {
  id: string; label: string;
  daily: number; weekly: number;      // 0 = no threshold of that kind
  dailyDouble: number;                // 0 = no double-time threshold
  mult: number; mult2: number;
  mode: 'greater' | 'add';            // greater: the larger of the daily and weekly overtime counts (federal, Alberta); add: weekly overtime counts only hours not already overtime (BC)
  note: string; src: string; confirmed: boolean;
};
const CA = 'Check the official source for your province or territory.';
export const OT_RULES: OtRule[] = [
  { id: 'on', label: 'Canada: Ontario', daily: 0, weekly: 44, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: 'Overtime after 44 hours a week at 1.5 times; no daily overtime unless your contract says so.', src: 'ontario.ca, Your guide to the Employment Standards Act, Overtime pay (checked 2026-11-10)', confirmed: true },
  { id: 'fed', label: 'Canada: federally regulated', daily: 8, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: 'More than 8 hours a day or 40 hours a week at 1.5 times; if the two totals differ, the higher one counts. Some trucking and other sectors differ.', src: 'canada.ca, Federal labour standards, Hours of work (checked 2026-11-10)', confirmed: true },
  { id: 'bc', label: 'Canada: British Columbia', daily: 8, weekly: 40, dailyDouble: 12, mult: 1.5, mult2: 2, mode: 'add', note: '1.5 times after 8 hours a day or 40 a week, double time after 12 hours a day. ' + CA, src: 'Secondary summary (Tanda, 2026); check gov.bc.ca', confirmed: false },
  { id: 'ab', label: 'Canada: Alberta', daily: 8, weekly: 44, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: '1.5 times after 8 hours a day or 44 a week, whichever gives more. Many Alberta workers are on averaging agreements. ' + CA, src: 'Secondary summary (Tanda, 2026); check alberta.ca', confirmed: false },
  { id: 'sk', label: 'Canada: Saskatchewan', daily: 8, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: CA, src: 'Secondary summary (Tanda, 2026); check saskatchewan.ca', confirmed: false },
  { id: 'mb', label: 'Canada: Manitoba', daily: 8, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: CA, src: 'Secondary summary (Tanda, 2026); check manitoba.ca', confirmed: false },
  { id: 'qc', label: 'Canada: Quebec', daily: 0, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: CA, src: 'Secondary summary (Tanda, 2026); check cnesst.gouv.qc.ca', confirmed: false },
  { id: 'nb', label: 'Canada: New Brunswick', daily: 0, weekly: 44, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: 'The law sets overtime at 1.5 times the minimum wage, not your own rate; here your own rate is used, so check the official source.', src: 'Secondary summary (Tanda, 2026); check gnb.ca', confirmed: false },
  { id: 'ns', label: 'Canada: Nova Scotia', daily: 0, weekly: 48, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: 'The law sets overtime at 1.5 times the minimum wage, not your own rate; here your own rate is used, so check the official source.', src: 'Secondary summary (Tanda, 2026); check novascotia.ca', confirmed: false },
  { id: 'pe', label: 'Canada: Prince Edward Island', daily: 0, weekly: 48, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: CA, src: 'Secondary summary (Tanda, 2026); check princeedwardisland.ca', confirmed: false },
  { id: 'nl', label: 'Canada: Newfoundland and Labrador', daily: 0, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: 'The law sets overtime at 1.5 times the minimum wage, not your own rate; here your own rate is used, so check the official source.', src: 'Secondary summary (Tanda, 2026); check gov.nl.ca', confirmed: false },
  { id: 'terr', label: 'Canada: Yukon, NWT, Nunavut', daily: 8, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: CA, src: 'Secondary summary (Tanda, 2026); check the territory\'s labour standards office', confirmed: false },
  { id: 'us', label: 'United States: FLSA', daily: 0, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: 'Time and a half of the regular rate over 40 hours in a fixed 168-hour workweek. The federal law has no daily overtime, but some states do (for example California), and many salaried jobs are exempt.', src: 'US Department of Labor, Fact Sheet 23, Overtime Pay Requirements of the FLSA (checked 2026-11-10)', confirmed: true },
  { id: 'uk', label: 'United Kingdom', daily: 0, weekly: 40, dailyDouble: 0, mult: 1.0, mult2: 1.0, mode: 'greater', note: 'The law gives no right to paid overtime or a premium; the rate and threshold come from your contract. Fill in yours here. Your average pay must not fall below the National Minimum Wage.', src: 'gov.uk, Overtime: your rights (checked 2026-11-10)', confirmed: true },
  { id: 'in', label: 'India: factories (Factories Act)', daily: 9, weekly: 48, dailyDouble: 0, mult: 2, mult2: 2, mode: 'greater', note: 'Factory workers: overtime beyond 9 hours a day or 48 a week at twice the ordinary rate. Other sectors follow state shops laws, and the new labour codes may change this. Check the official source.', src: 'Factories Act 1948 ss. 51, 54 and 59 (not re-read online by fibub; check the official source)', confirmed: false },
  { id: 'custom', label: 'My own rule', daily: 0, weekly: 40, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater', note: 'Set the thresholds and rates from your contract or collective agreement.', src: 'Your contract', confirmed: true },
];
export const ruleById = (id: string) => OT_RULES.find((r) => r.id === id) || OT_RULES[0];

export type Split = { total: number; regular: number; ot1: number; ot2: number };
/** days: hours worked on each day of the week (7 numbers, or any length). daily/weekly 0 means none. */
export function splitHours(days: number[], r: Pick<OtRule, 'daily' | 'weekly' | 'dailyDouble' | 'mode'>): Split {
  const d = days.map((h) => (h > 0 ? h : 0));
  const total = d.reduce((a, b) => a + b, 0);
  let dbl = 0, dailyOt = 0;
  if (r.daily > 0) for (const h of d) {
    const over = Math.max(0, h - r.daily);
    if (r.dailyDouble > r.daily) { const x = Math.max(0, h - r.dailyDouble); dbl += x; dailyOt += over - x; } else dailyOt += over;
  }
  const weeklyOt = r.weekly > 0 ? Math.max(0, total - r.weekly) : 0;
  let ot1: number;
  if (r.mode === 'add') ot1 = dailyOt + (r.weekly > 0 ? Math.max(0, total - dbl - dailyOt - r.weekly) : 0);
  else ot1 = Math.max(dailyOt + dbl, weeklyOt) - dbl;
  ot1 = Math.max(0, ot1);
  const ot2 = dbl;
  return { total, regular: Math.max(0, total - ot1 - ot2), ot1, ot2 };
}
export const payFor = (s: Split, rate: number, m1: number, m2: number) => s.regular * rate + s.ot1 * rate * m1 + s.ot2 * rate * m2;
export const hm = (h: number) => { const m = Math.round(h * 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };
