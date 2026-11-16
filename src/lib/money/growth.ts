// Savings growth maths for compound-interest and sip-calculator. Plain TypeScript, no DOM.
export type Year = { year: number; deposits: number; interest: number; balance: number; real: number };

export const PERIODS: Record<string, number> = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, halfyearly: 2, yearly: 1 };

export type CompoundIn = {
  start: number; deposit: number; every: 'month' | 'year'; atStart: boolean;
  rate: number; perYear: number; years: number; fee: number; inflation: number;
  /** Yearly rise of the regular deposit in percent (optional, default 0). */
  stepUp?: number;
};

/** Steps month by month. The monthly growth factor is (1 + rate/m)^(m/12), so one year of growth
 *  is exactly (1 + rate/m)^m. The yearly fee is taken off the balance each month. */
export function compound(a: CompoundIn): Year[] {
  const g = Math.pow(1 + a.rate / 100 / a.perYear, a.perYear / 12);
  const keep = 1 - a.fee / 1200;
  const infl = 1 + a.inflation / 100;
  let bal = a.start, put = a.start;
  const rows: Year[] = [{ year: 0, deposits: put, interest: 0, balance: bal, real: bal }];
  const months = Math.round(a.years * 12);
  const step = 1 + (a.stepUp || 0) / 100;
  for (let m = 1; m <= months; m++) {
    const dep = a.deposit * Math.pow(step, Math.floor((m - 1) / 12));
    const due = a.every === 'month' || (a.atStart ? m % 12 === 1 : m % 12 === 0);
    if (due && a.atStart) { bal += dep; put += dep; }
    bal *= g * keep;
    if (due && !a.atStart) { bal += dep; put += dep; }
    if (m % 12 === 0 || m === months) {
      const y = m / 12;
      rows.push({ year: y, deposits: put, interest: bal - put, balance: bal, real: bal / Math.pow(infl, y) });
    }
  }
  return rows;
}

/** Final balance after the given years (0 if the input is unusable). */
export const finalBalance = (a: CompoundIn) => { const r = compound(a); return r[r.length - 1].balance; };

/** Regular deposit needed to reach `target` by the end of a.years. The balance is a straight line in the deposit, so two runs solve it.
 *  Returns 0 when the start amount alone is already enough. */
export function depositForGoal(a: CompoundIn, target: number) {
  const b0 = finalBalance({ ...a, deposit: 0 }), b1 = finalBalance({ ...a, deposit: 1 });
  if (!(b1 > b0)) return NaN;
  return Math.max(0, (target - b0) / (b1 - b0));
}

/** Months until the balance first reaches `target`, or NaN if it takes more than maxYears. */
export function monthsToGoal(a: CompoundIn, target: number, maxYears = 100) {
  if (a.start >= target) return 0;
  const rows = compound({ ...a, years: maxYears });
  // rows are yearly (plus a final partial); find the first year at or above target, then refine by month.
  const hit = rows.findIndex((r) => r.balance >= target);
  if (hit < 0) return NaN;
  const y0 = Math.max(0, hit - 1);
  for (let m = y0 * 12 + 1; m <= hit * 12; m++) {
    const r = compound({ ...a, years: m / 12 });
    if (r[r.length - 1].balance >= target) return m;
  }
  return hit * 12;
}

export type SipIn = { sip: number; rate: number; years: number; stepUp: number; lump: number; inflation?: number };

/** SIP with each instalment paid at the start of the month (annuity due), monthly rate = yearly / 12. */
export function sip(a: SipIn): Year[] {
  const i = a.rate / 1200;
  let bal = a.lump, put = a.lump, pay = a.sip;
  const rows: Year[] = [{ year: 0, deposits: put, interest: 0, balance: bal, real: bal }];
  const months = Math.round(a.years * 12);
  for (let m = 1; m <= months; m++) {
    if (m > 1 && (m - 1) % 12 === 0) pay *= 1 + a.stepUp / 100;
    bal += pay; put += pay;
    bal *= 1 + i;
    if (m % 12 === 0 || m === months) rows.push({ year: m / 12, deposits: put, interest: bal - put, balance: bal, real: bal / Math.pow(1 + (a.inflation || 0) / 100, m / 12) });
  }
  return rows;
}

/** Monthly SIP needed to reach a target value. The result is linear in the SIP, so one run with a SIP of 1 is enough.
 *  Returns 0 when the lumpsum alone already reaches the target, and NaN when the plan cannot grow (no months). */
export function sipNeeded(target: number, a: Omit<SipIn, 'sip'>): number {
  const lumpOnly = sip({ ...a, sip: 0 }).at(-1)!.balance;
  const unit = sip({ ...a, sip: 1, lump: 0 }).at(-1)!.balance;
  if (!(unit > 0)) return NaN;
  return Math.max(0, (target - lumpOnly) / unit);
}

/** Line chart as SVG: balance and money put in. */
export function chartSvg(rows: Year[], fmt: (v: number) => string): string {
  const W = 640, H = 220, L = 56, R = 10, T = 10, B = 26;
  const n = Math.max(1, rows[rows.length - 1].year), max = Math.max(1, ...rows.map((r) => r.balance));
  const x = (y: number) => L + (y / n) * (W - L - R), y = (v: number) => T + (1 - v / max) * (H - T - B);
  const path = (k: 'balance' | 'deposits') => rows.map((r, i) => `${i ? 'L' : 'M'}${x(r.year).toFixed(1)},${y(r[k]).toFixed(1)}`).join(' ');
  const step = n > 30 ? 10 : n > 15 ? 5 : n > 8 ? 2 : 1;
  let t = '';
  for (let yr = 0; yr <= n; yr += step) t += `<text x="${x(yr)}" y="${H - 8}" text-anchor="middle">${yr === 0 ? 'Now' : yr + 'y'}</text>`;
  for (const v of [0, 0.5, 1]) t += `<line x1="${L}" x2="${W - R}" y1="${y(max * v)}" y2="${y(max * v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(max * v) + 4}" text-anchor="end">${fmt(max * v)}</text>`;
  return `${t}<path d="${path('deposits')}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/><path d="${path('balance')}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`;
}

export const csv = (name: string, head: string[], rows: (string | number)[][]) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([[head, ...rows.map((r) => r.map((v) => (typeof v === 'number' ? v.toFixed(2) : v)))].map((r) => r.join(',')).join('\r\n') + '\r\n'], { type: 'text/csv' }));
  a.download = name;
  document.body.append(a); a.click(); a.remove();
};
