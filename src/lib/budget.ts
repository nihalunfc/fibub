// Budget maths: turn amounts paid at any interval into monthly figures, and grow savings.
export const FREQ = {
  week: { label: 'a week', perMonth: 52 / 12 },
  fortnight: { label: 'every 2 weeks', perMonth: 26 / 12 },
  twice: { label: 'twice a month', perMonth: 2 },
  month: { label: 'a month', perMonth: 1 },
  quarter: { label: 'every 3 months', perMonth: 1 / 3 },
  half: { label: 'every 6 months', perMonth: 1 / 6 },
  year: { label: 'a year', perMonth: 1 / 12 },
} as const;
export type Freq = keyof typeof FREQ;
export const monthly = (amount: number, f: Freq) => amount * (FREQ[f]?.perMonth ?? 1);

/** Total after `months` of saving `perMonth`, with interest at `annual` % compounded monthly. */
export function grow(perMonth: number, months: number, annual = 0, start = 0) {
  const r = annual / 1200;
  if (r === 0) return start + perMonth * months;
  const f = Math.pow(1 + r, months);
  return start * f + perMonth * ((f - 1) / r);
}

/** Months needed to reach `goal` saving `perMonth` (Infinity if never). */
export function monthsTo(goal: number, perMonth: number, annual = 0, start = 0) {
  if (start >= goal) return 0;
  if (perMonth <= 0) return Infinity;
  let m = 0;
  while (grow(perMonth, m, annual, start) < goal && m < 1200) m++;
  return m < 1200 ? m : Infinity;
}

/** Whole months from now until the start of the given YYYY-MM month (at least 1). */
export function monthsUntil(ym: string, now = new Date()) {
  const [y, m] = ym.split('-').map(Number);
  return Math.max(1, (y - now.getFullYear()) * 12 + (m - 1 - now.getMonth()));
}

export const TEMPLATES: Record<string, { name: string; items: [string, number][] }> = {
  trip: { name: 'Trip', items: [['Flights or train', 0], ['Places to stay', 0], ['Food and drinks', 0], ['Getting around', 0], ['Activities and tickets', 0], ['Travel insurance', 0], ['Visa and documents', 0], ['Shopping and gifts', 0]] },
  home: { name: 'Home project', items: [['Materials', 0], ['Labour', 0], ['Tools and equipment', 0], ['Permits', 0], ['Delivery and disposal', 0], ['Furniture and finishing', 0]] },
  event: { name: 'Wedding or event', items: [['Venue', 0], ['Food and catering', 0], ['Clothes', 0], ['Decoration', 0], ['Photos and video', 0], ['Invitations', 0], ['Music and entertainment', 0], ['Gifts and favours', 0]] },
  purchase: { name: 'Big purchase', items: [['Price', 0], ['Taxes and fees', 0], ['Delivery and setup', 0], ['Accessories', 0], ['Warranty or insurance', 0]] },
  blank: { name: 'My plan', items: [['', 0]] },
};

export const INCOME_DEFAULT: [string, Freq][] = [['Salary (after tax)', 'month'], ['Other income', 'month']];
export const EXPENSE_DEFAULT: [string, Freq, 'need' | 'want'][] = [
  ['Rent or mortgage', 'month', 'need'], ['Groceries', 'week', 'need'], ['Electricity, water, heating', 'month', 'need'],
  ['Phone and internet', 'month', 'need'], ['Transport and fuel', 'month', 'need'], ['Insurance', 'year', 'need'],
  ['Loan or card payments', 'month', 'need'], ['Eating out and takeaway', 'month', 'want'], ['Subscriptions', 'month', 'want'],
  ['Shopping and clothes', 'month', 'want'], ['Car service and repairs', 'year', 'need'], ['Holidays and gifts', 'year', 'want'],
];

// ---------- Guides, targets and views added for the monthly budget ----------
/** Popular splits of take-home pay: needs / wants / savings (percent). */
export const RULES: Record<string, { label: string; needs: number; wants: number; save: number }> = {
  '50-30-20': { label: '50 / 30 / 20 (needs, wants, savings)', needs: 50, wants: 30, save: 20 },
  '60-20-20': { label: '60 / 20 / 20 (higher living costs)', needs: 60, wants: 20, save: 20 },
  '70-20-10': { label: '70 / 20 / 10 (tight budget)', needs: 70, wants: 20, save: 10 },
  '50-20-30': { label: '50 / 20 / 30 (saving hard)', needs: 50, wants: 20, save: 30 },
};

/** What reaching a saving-rate target takes. All amounts are per month; `income`, `out` and `wants` are monthly. */
export function savingTarget(income: number, out: number, wants: number, targetPct: number) {
  const safe = (x: number) => (Number.isFinite(x) ? x : 0);
  const pct = Math.min(100, Math.max(0, safe(targetPct)));
  const goal = (safe(income) * pct) / 100, left = safe(income) - safe(out);
  const gap = Math.max(0, goal - left);
  const cutPct = gap === 0 ? 0 : wants > 0 ? Math.min(100, (gap / wants) * 100) : null;
  return { goal, left, gap, met: gap === 0, cutPct, wantsEnough: gap <= wants, stillShort: Math.max(0, gap - Math.max(0, wants)) };
}

/** The same monthly figure per week, month and year. */
export const perPeriod = (m: number) => ({ week: (m * 12) / 52, month: m, year: m * 12 });

/** Each person's share of a total (0 people counts as 1). */
export const perPerson = (total: number, people: number) => total / Math.max(1, Math.floor(Number.isFinite(people) ? people : 1));

/** Each cost as a monthly amount and a share of income, biggest first. */
export function costShares(items: { name: string; amount: number; f: Freq; kind: 'need' | 'want' }[], income: number) {
  return items.filter((i) => i.amount > 0).map((i) => { const m = monthly(i.amount, i.f); return { name: i.name, kind: i.kind, month: m, pct: income > 0 ? (m / income) * 100 : 0 }; }).sort((a, b) => b.month - a.month);
}
