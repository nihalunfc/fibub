// Light exposure budgets for museum objects: lux × hours per day × days = lux-hours, the share of a yearly budget the
// user's institution sets, how long or how bright a display can be, a plan of display periods, and UV from µW/lm.
// Plain maths, no DOM. Damage is taken as proportional to lux × time (the reciprocity assumption).

/** Lux-hours from illuminance (lux), hours lit per day and days. */
export const luxHours = (lux: number, hoursPerDay: number, days: number) => lux * hoursPerDay * days;
/** Days a display may last at this lux and daily lighting before it uses `budget` lux-hours. */
export const allowedDays = (budget: number, lux: number, hoursPerDay: number) => (lux > 0 && hoursPerDay > 0 ? budget / (lux * hoursPerDay) : Infinity);
/** The highest steady lux that keeps hours × days within `budget` lux-hours. */
export const allowedLux = (budget: number, hoursPerDay: number, days: number) => (hoursPerDay > 0 && days > 0 ? budget / (hoursPerDay * days) : Infinity);
/** UV irradiance in mW/m² from illuminance (lux = lm/m²) and the UV content of the light (µW/lm). */
export const uvIrradiance = (lux: number, uwPerLm: number) => (lux * uwPerLm) / 1000;
/** UV radiant exposure in J/m² from lux-hours and UV content (µW/lm): lux·h × µW/lm × 10⁻⁶ W/µW × 3600 s/h. */
export const uvDose = (lxh: number, uwPerLm: number) => lxh * uwPerLm * 0.0036;

export type Period = { name: string; lux: number; hours: number; days: number };
export type PlanRow = Period & { lxh: number; cum: number; pct: number; over: boolean };
export type Plan = { rows: PlanRow[]; total: number; budget: number; left: number; pct: number; perYear: number };
/** Add up a plan of display periods against `budgetPerYear` × `years`. */
export function plan(periods: Period[], budgetPerYear: number, years: number): Plan {
  const budget = budgetPerYear * years;
  let cum = 0;
  const rows = periods.map((p) => { const lxh = luxHours(p.lux, p.hours, p.days); cum += lxh; return { ...p, lxh, cum, pct: (100 * cum) / budget, over: cum > budget * (1 + 1e-12) }; });
  return { rows, total: cum, budget, left: budget - cum, pct: (100 * cum) / budget, perYear: cum / years };
}

/** A plan pasted as lines "name, lux, hours per day, days" (tab, semicolon or comma separated; a header row is skipped). */
export function parsePlan(text: string): { periods: Period[]; bad: string[] } {
  const periods: Period[] = [], bad: string[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const sep = lines.some((l) => l.includes('\t')) ? /\t/ : lines.some((l) => l.includes(';')) ? /;/ : /,/;
  const n = (s: string | undefined) => { const t = (s ?? '').trim().replace(/[−–]/g, '-').replace(/[\s ]/g, ''); return t === '' ? NaN : Number(sep.source === ',' ? t : t.replace(',', '.')); };
  lines.forEach((line, i) => {
    const c = line.split(sep).map((x) => x.trim().replace(/^"(.*)"$/, '$1'));
    const first = Number.isFinite(n(c[0]));
    const name = first ? `Period ${periods.length + 1}` : c[0], v = (first ? c : c.slice(1)).slice(0, 3).map(n);
    if (v.length === 3 && v.every((x) => Number.isFinite(x) && x >= 0) && v[1] <= 24) { periods.push({ name, lux: v[0], hours: v[1], days: v[2] }); return; }
    if (i === 0 && !c.slice(1).some((x) => Number.isFinite(n(x)))) return; // header row
    bad.push(`Line ${i + 1} ("${line.slice(0, 40)}") needs a name, then lux, hours lit per day (0 to 24) and days, all zero or more.`);
  });
  return { periods, bad };
}

/** A made-up two-year plan for one object. */
export const EXAMPLE_PLAN = `Period\tLux\tHours per day\tDays
Opening display\t50\t8\t180
Study room visits\t150\t1\t12
Loan exhibition\t50\t10\t100
Photography\t1000\t0.5\t2`;
