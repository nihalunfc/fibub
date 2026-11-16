// Annual leave pay in the Gulf private sector: days earned, leave salary and pay for unused days. Pure maths, no DOM.
// Oman: Labour Law, Royal Decree 53/2023, Art. 78 and 81 (30 days on the gross wage; balance paid on the gross wage).
// Qatar: Labour Law 14 of 2004, Art. 72, 79 and 81 (3 weeks, 4 from 5 years' service; paid on the basic wage).
// Saudi Arabia: Labor Law (Royal Decree M/51), Art. 2, 109 and 111 (21 days, 30 after 5 years; paid on the wage).
// UAE: Federal Decree-Law 33 of 2021, Art. 1, 29 and 67 (2 days a month from 6 months to 1 year, then 30 days;
// wage during leave, basic wage for unused days at the end of service; a month is 30 days). Checked 2026-11-16.

export type LeaveCountry = 'om' | 'qa' | 'sa' | 'ae';

export interface LeaveRule {
  name: string;
  cur: string;
  /** Leave days for a full year, given completed years of service. */
  days: (completedYears: number) => number;
  /** What the law pays leave on: 'wage' (basic + allowances) or 'basic'. */
  leaveOn: 'wage' | 'basic';
  /** What the law pays unused days on at the end of service. */
  endOn: 'wage' | 'basic';
  law: string;
  divisor: string;
}

export const RULES: Record<LeaveCountry, LeaveRule> = {
  om: { name: 'Oman', cur: 'OMR', days: () => 30, leaveOn: 'wage', endOn: 'wage', law: 'Labour Law, Royal Decree 53/2023, Art. 78 and 81', divisor: 'monthly pay ÷ 30 (fibub\'s assumption; the law does not set the divisor)' },
  qa: { name: 'Qatar', cur: 'QAR', days: (y) => (y >= 5 ? 28 : 21), leaveOn: 'basic', endOn: 'basic', law: 'Labour Law 14 of 2004, Art. 72, 79 and 81', divisor: 'basic ÷ 30 (fibub\'s assumption; the law does not set the divisor)' },
  sa: { name: 'Saudi Arabia', cur: 'SAR', days: (y) => (y >= 5 ? 30 : 21), leaveOn: 'wage', endOn: 'wage', law: 'Labor Law (Royal Decree M/51), Art. 2, 109 and 111', divisor: 'monthly wage ÷ 30 (fibub\'s assumption; the law does not set the divisor)' },
  ae: { name: 'UAE', cur: 'AED', days: () => 30, leaveOn: 'wage', endOn: 'basic', law: 'Federal Decree-Law 33 of 2021, Art. 29 and 67', divisor: 'monthly pay ÷ 30 (Art. 67: a month counts as 30 days)' },
};

const clamp = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);

export interface LeaveIn {
  country: LeaveCountry;
  years: number; // completed years of service
  months: number; // completed months in the current leave year (0 to 11)
  basic: number; // monthly basic
  allowances: number; // monthly allowances
  taken: number; // days already taken this leave year
  carried: number; // days carried over from earlier years
  priceDays: number; // days of leave to price
  includeAllowances?: boolean; // leave salary on basic + allowances (default: what the law says)
}

export function leavePay(i: LeaveIn) {
  const rule = RULES[i.country];
  const years = Math.floor(clamp(i.years)), months = Math.min(11, Math.floor(clamp(i.months)));
  const basic = clamp(i.basic), allow = clamp(i.allowances);
  const yearDays = rule.days(years);
  // Days earned so far in this leave year (counted from the work anniversary), pro rata by completed months.
  // UAE first year: none before 6 months, then 2 days a month (Art. 29(1)). Others: pro rata (fibub's reading).
  let earned: number;
  let note = '';
  if (i.country === 'ae' && years === 0) {
    earned = months >= 6 ? 2 * months : 0;
    if (months < 6) note = 'Under 6 months of service: no annual leave yet under the UAE rule.';
  } else earned = (yearDays * months) / 12;
  if (i.country === 'om' && years === 0 && months < 6) note = 'In Oman leave cannot be taken before 6 months of service.';
  if (i.country === 'qa' && years === 0) note = 'In Qatar leave is due after one full year; part years count pro rata.';
  earned = Math.round(earned * 100) / 100;
  const available = earned + clamp(i.carried);
  const left = Math.max(0, available - clamp(i.taken));
  const overdrawn = clamp(i.taken) > available;
  const incl = i.includeAllowances ?? rule.leaveOn === 'wage';
  const leaveBase = incl ? basic + allow : basic;
  const endBase = i.country === 'ae' ? basic : leaveBase;
  const leaveDaily = leaveBase / 30, endDaily = endBase / 30;
  return {
    rule, yearDays, earned, available, left, overdrawn, note,
    leaveBase, endBase, leaveDaily, endDaily,
    leaveSalary: clamp(i.priceDays) * leaveDaily,
    inLieu: left * endDaily,
  };
}
