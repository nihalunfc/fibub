// Hours, people and cost needed per day for any business with departments whose work follows how much you sell.
// Work per department = (units x minutes each, for up to two kinds of work) / productive share of a paid shift,
// plus support hours (supervisors, kitchen, cover) and fixed hours; never below the minimum staffing.
export type Driver = 'sold' | 'new' | 'ongoing' | 'capacity' | 'extra' | 'none';
export const DRIVERS: Record<Driver, string> = {
  sold: 'Units sold or served', new: 'New customers (turnover)', ongoing: 'Continuing customers', capacity: 'All your capacity', extra: 'Extra volume (meals, calls, orders)', none: 'Nothing (fixed hours only)',
};
export type Dept = {
  name: string; wage: number; driverA: Driver; minA: number; driverB: Driver; minB: number; prod: number; support: number; fixed: number;
  minPerShift: number; shifts: number; core: boolean;
};
export type Biz = {
  name: string; capacity: number; use: number;      // use = share of capacity sold, 0 to 1
  newShare: number;                                 // share of units sold that are new customers, 0 to 1
  price: number; benefits: number;                  // benefits load, 0 to 1
  shiftHours: number; fteHours: number; days: number;
  extraPer: number; extraOutside: number;           // extra volume = sold x extraPer + extraOutside
};
export type Opts = { use?: number; minScale?: number; wageMult?: number };

export function model(H: Biz, D: Dept[], o: Opts = {}) {
  const use = o.use ?? H.use, sold = H.capacity * use;
  const nw = sold * H.newShare, ongoing = sold - nw;
  const extra = sold * H.extraPer + H.extraOutside;
  const vol: Record<Driver, number> = { sold, new: nw, ongoing, capacity: H.capacity, extra, none: 0 };
  const scale = o.minScale ?? 1, wm = o.wageMult ?? 1;
  const rows = D.map((d, i) => {
    const taskH = (vol[d.driverA] * d.minA * scale + vol[d.driverB] * d.minB * scale) / 60;
    const share = Math.min(1, Math.max(0.05, d.prod / H.shiftHours));
    const paid = taskH / share;
    const work = paid * (1 + d.support) + d.fixed;
    const minH = d.minPerShift * d.shifts * H.shiftHours;
    const hours = Math.max(work, minH);
    const people = Math.ceil(hours / H.shiftHours - 1e-9);
    const cost = hours * d.wage * wm * (1 + H.benefits);
    return { d, i, taskH, work, minH, hours, people, cost, floorBound: minH > work };
  });
  const tot = rows.reduce((a, r) => ({ hours: a.hours + r.hours, people: a.people + r.people, cost: a.cost + r.cost }), { hours: 0, people: 0, cost: 0 });
  const rev = sold * H.price;
  const coreCost = rows.filter((r) => r.d.core).reduce((s, r) => s + r.cost, 0);
  return {
    sold, new: nw, ongoing, extra, rows, tot, rev, coreCost,
    perUnit: sold > 0 ? tot.cost / sold : null, pct: rev > 0 ? tot.cost / rev : null,
    corePerUnit: sold > 0 ? coreCost / sold : null, corePct: rev > 0 ? coreCost / rev : null,
    fte: (tot.hours * H.days) / H.fteHours,
  };
}
export const LEVELS = Array.from({ length: 15 }, (_, i) => 30 + i * 5);
/** The staffing guide: the same plan at 30% to 100% of capacity sold. */
export const guide = (H: Biz, D: Dept[]) => LEVELS.map((p) => ({ p, m: model(H, D, { use: p / 100 }) }));

export function problems(H: Biz, D: Dept[]): string[] {
  const w: string[] = [], f = Number.isFinite;
  if (!(H.capacity >= 1)) w.push('Capacity must be 1 or more.');
  if (!(H.use >= 0 && H.use <= 1)) w.push('Share of capacity sold must be between 0 and 100%.');
  if (!(H.shiftHours >= 1 && H.shiftHours <= 16)) w.push('Paid hours per shift must be between 1 and 16.');
  if (!(H.fteHours >= 1)) w.push('Hours in one full-time week must be 1 or more.');
  D.forEach((d, i) => {
    const l = d.name || `Department ${i + 1}`;
    if (![d.wage, d.minA, d.minB, d.prod, d.support, d.fixed, d.minPerShift, d.shifts].every(f) || d.wage < 0 || d.minA < 0 || d.minB < 0 || d.support < 0 || d.fixed < 0) w.push(`${l}: check for blank or negative numbers.`);
    else if (!(d.prod > 0)) w.push(`${l}: productive hours per shift must be more than 0.`);
  });
  return w;
}
