// Days present in a country from a list of trips, per period, plus the US substantial presence test.
export type Trip = { country: string; from: string; to: string }; // ISO dates yyyy-mm-dd, both inclusive
export type Counting = 'both' | 'midnight'; // both: arrival and departure days count; midnight: the arrival day counts, the departure day does not (UK style)
export type Region = 'calendar' | 'uk' | 'india';

const DAY = 86400000;
export const dayNum = (iso: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY : NaN; };
export const isoOf = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);

export function period(region: Region, year: number): { from: number; to: number; label: string } {
  if (region === 'uk') return { from: dayNum(`${year}-04-06`), to: dayNum(`${year + 1}-04-05`), label: `UK tax year 6 April ${year} to 5 April ${year + 1}` };
  if (region === 'india') return { from: dayNum(`${year}-04-01`), to: dayNum(`${year + 1}-03-31`), label: `Indian financial year 1 April ${year} to 31 March ${year + 1}` };
  return { from: dayNum(`${year}-01-01`), to: dayNum(`${year}-12-31`), label: `calendar year ${year}` };
}

const norm = (c: string) => c.trim().toLowerCase().replace(/\s+/g, ' ');
const US = new Set(['us', 'usa', 'u.s.', 'u.s.a.', 'united states', 'united states of america', 'america']);
export const isUS = (c: string) => US.has(norm(c));

/** Distinct days in [from, to] (day numbers) that the trips put you in each country. */
export function daysByCountry(trips: Trip[], from: number, to: number, counting: Counting): Map<string, { name: string; days: number }> {
  const sets = new Map<string, { name: string; days: Set<number> }>();
  for (const t of trips) {
    const a = dayNum(t.from); let b = dayNum(t.to);
    if (!Number.isFinite(a) || !t.country.trim()) continue;
    if (!Number.isFinite(b)) b = a;
    if (b < a) continue;
    const key = isUS(t.country) ? 'united states' : norm(t.country);
    const e = sets.get(key) || { name: isUS(t.country) ? 'United States' : t.country.trim(), days: new Set<number>() };
    const last = counting === 'midnight' && b > a ? b - 1 : b;
    for (let d = Math.max(a, from); d <= Math.min(last, to); d++) e.days.add(d);
    sets.set(key, e);
  }
  const out = new Map<string, { name: string; days: number }>();
  for (const [k, v] of sets) out.set(k, { name: v.name, days: v.days.size });
  return out;
}

export function usDays(trips: Trip[], year: number, counting: Counting): number {
  const p = period('calendar', year);
  return daysByCountry(trips, p.from, p.to, counting).get('united states')?.days ?? 0;
}

/** IRS substantial presence test: 31 days this year and current + 1/3 prior + 1/6 the year before >= 183. */
export function substantialPresence(d0: number, d1: number, d2: number) {
  const weighted = d0 + d1 / 3 + d2 / 6;
  return { weighted, meets31: d0 >= 31, meets183: weighted >= 183, resident: d0 >= 31 && weighted >= 183 };
}

export type Marker = { at: number; text: string };
/** Day markers that matter in each tax system (not the whole test). */
export function markers(region: Region, country: string): Marker[] {
  const c = norm(country);
  if (region === 'uk' && (c === 'united kingdom' || c === 'uk' || c === 'great britain' || c === 'england' || c === 'scotland' || c === 'wales')) return [{ at: 16, text: 'Under 16 UK days: usually non-resident' }, { at: 46, text: '46 UK days: a marker if you were not UK resident in the 3 years before' }, { at: 183, text: '183 UK days: automatically UK resident' }];
  if (region === 'india' && c === 'india') return [{ at: 60, text: '60 days: with 365 days in the 4 earlier years can make you resident' }, { at: 120, text: '120 days: for Indian citizens with Indian income over 15 lakh, with 365 days in the 4 earlier years, can make you resident but not ordinarily resident' }, { at: 182, text: '182 days: resident in India' }];
  if (c === 'canada') return [{ at: 183, text: '183 days in a year: deemed resident (a sojourner)' }];
  return [{ at: 183, text: '183 days: a common marker, not the rule everywhere' }];
}
