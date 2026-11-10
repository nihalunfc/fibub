// EPF maths (#1741). Plain TypeScript, no DOM.
// Employee pays a share of Basic + DA (12%) into EPF. The employer pays 12% too, but 8.33% of wages up to the
// EPS wage ceiling goes to the pension scheme (EPS), and only the rest goes to EPF. Interest is worked out
// month by month on the running balance at the yearly rate / 12 and added once a year.
import type { Year } from './growth';

export type EpfIn = {
  basic: number;         // monthly Basic + DA now
  employee: number;      // % of wages, usually 12
  employer: number;      // % of wages, usually 12
  ceiling: number;       // EPS wage ceiling, per month
  inEps: boolean;        // false: all of the employer's share goes to EPF
  capWages: boolean;     // PF worked out on wages up to the ceiling only
  raise: number;         // % pay rise each year
  rate: number;          // EPF interest, % a year
  ageNow: number; retireAge: number;
  opening: number;       // EPF balance today
};
export type EpfRow = Year & { basic: number; you: number; boss: number; eps: number; earned: number };

/** Monthly split for one wage. EPS is rounded to the rupee, as EPFO does (8.33% of 15,000 = 1,250). */
export function epfMonth(basic: number, a: Pick<EpfIn, 'employee' | 'employer' | 'ceiling' | 'inEps' | 'capWages'>) {
  const pfWage = a.capWages ? Math.min(basic, a.ceiling) : basic;
  const you = Math.round(pfWage * a.employee / 100);
  const bossAll = Math.round(pfWage * a.employer / 100);
  const eps = a.inEps ? Math.min(bossAll, Math.round(Math.min(basic, a.ceiling) * 0.0833)) : 0;
  return { you, eps, boss: bossAll - eps };
}

export function epf(a: EpfIn): EpfRow[] {
  const years = Math.max(0, Math.round(a.retireAge - a.ageNow));
  const r = a.rate / 100 / 12;
  let bal = a.opening, put = a.opening, gained = 0, basic = a.basic, epsAll = 0;
  const rows: EpfRow[] = [{ year: 0, deposits: put, interest: 0, balance: bal, real: bal, basic, you: 0, boss: 0, eps: 0, earned: 0 }];
  for (let y = 1; y <= years; y++) {
    if (y > 1) basic *= 1 + a.raise / 100;
    const m = epfMonth(basic, a);
    let run = bal, earned = 0;
    for (let k = 1; k <= 12; k++) { run += m.you + m.boss; earned += run * r; }
    bal = run + earned; put += 12 * (m.you + m.boss); gained += earned; epsAll += 12 * m.eps;
    rows.push({ year: y, deposits: put, interest: gained, balance: bal, real: bal, basic, you: 12 * m.you, boss: 12 * m.boss, eps: epsAll, earned });
  }
  return rows;
}
