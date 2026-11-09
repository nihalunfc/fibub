// Multi-year research grant budget: personnel (salary, effort, fringe, yearly raise) and other direct cost lines,
// indirect costs on a chosen base with exclusions, totals per year. Every rate is typed by the user. No DOM.

export const CATEGORIES = ['equipment', 'travel', 'consumables', 'other'] as const;
export type Category = (typeof CATEGORIES)[number];
export const CAT_NAME: Record<Category, string> = { equipment: 'Equipment', travel: 'Travel', consumables: 'Consumables', other: 'Other' };
export type Person = { name: string; salary: number; effort: number[]; fringe: number; raise: number };
export type Line = { category: Category; name: string; amounts: number[]; flag: '' | 'exclude' | 'cap' };
export type BaseKind = 'tdc' | 'modified' | 'salaries' | 'salfringe' | 'none';
export type Input = { years: number; people: Person[]; lines: Line[]; rates: number[]; base: BaseKind; excludeCats: Category[]; cap: number | null; round: boolean };
export type PersonOut = { name: string; salary: number[]; fringe: number[]; effort: number[]; months: number[] };
export type Result = {
  years: number; people: PersonOut[]; lines: (Line & { amounts: number[] })[];
  salaries: number[]; fringe: number[]; personnel: number[]; cats: Record<Category, number[]>; direct: number[];
  base: number[]; rate: number[]; indirect: number[]; total: number[];
  sum: (a: number[]) => number;
};

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
const r2 = (x: number, round: boolean) => (round ? Math.round(x) : x);
/** A list typed as "50" or "50/50/25" (also ; or | between), stretched to n years by repeating the last value. */
export function perYear(v: number[], n: number): number[] { return Array.from({ length: n }, (_, i) => v[Math.min(i, v.length - 1)]); }

export function compute(inp: Input): Result {
  const n = inp.years, z = () => new Array(n).fill(0) as number[];
  const people: PersonOut[] = inp.people.map((p) => {
    const eff = perYear(p.effort, n);
    const salary = eff.map((e, y) => r2(p.salary * Math.pow(1 + p.raise / 100, y) * (e / 100), inp.round));
    const fringe = salary.map((s) => r2((s * p.fringe) / 100, inp.round));
    return { name: p.name, salary, fringe, effort: eff, months: eff.map((e) => (12 * e) / 100) };
  });
  const lines = inp.lines.map((l) => ({ ...l, amounts: Array.from({ length: n }, (_, y) => r2(l.amounts[y] ?? 0, inp.round)) }));
  const salaries = z(), fringe = z(), cats = Object.fromEntries(CATEGORIES.map((c) => [c, z()])) as Record<Category, number[]>;
  people.forEach((p) => p.salary.forEach((s, y) => { salaries[y] += s; fringe[y] += p.fringe[y]; }));
  lines.forEach((l) => l.amounts.forEach((a, y) => { cats[l.category][y] += a; }));
  const personnel = salaries.map((s, y) => s + fringe[y]);
  const direct = personnel.map((p, y) => p + sum(CATEGORIES.map((c) => cats[c][y])));
  // The base for indirect costs.
  const base = z();
  for (let y = 0; y < n; y++) {
    if (inp.base === 'tdc') base[y] = direct[y];
    else if (inp.base === 'salaries') base[y] = salaries[y];
    else if (inp.base === 'salfringe') base[y] = personnel[y];
    else if (inp.base === 'modified') base[y] = personnel[y];
  }
  if (inp.base === 'modified') {
    for (const l of lines) {
      if (inp.excludeCats.includes(l.category) || l.flag === 'exclude') continue;
      let used = 0;
      l.amounts.forEach((a, y) => {
        let take = a;
        if (l.flag === 'cap' && inp.cap != null) { take = Math.max(0, Math.min(a, inp.cap - used)); used += take; }
        base[y] += take;
      });
    }
  }
  const rate = perYear(inp.rates.length ? inp.rates : [0], n);
  const indirect = base.map((b, y) => (inp.base === 'none' ? 0 : r2((b * rate[y]) / 100, inp.round)));
  const total = direct.map((d, y) => d + indirect[y]);
  return { years: n, people, lines, salaries, fringe, personnel, cats, direct, base, rate, indirect, total, sum };
}

// ---------- parsing the two paste boxes ----------
const splitRow = (l: string) => (l.includes('\t') ? l.split('\t') : l.split(',')).map((c) => c.trim());
/** A money or percent cell: "52,000" is not allowed in comma rows, so we take "52000", "52 000", "$52000", "15%". */
export function money(s: string): number { const t = s.replace(/[\s$£€₹¥%]|^[A-Za-z]{3}(?=\d)/g, ''); return t === '' ? NaN : Number(t); }
const isHeader = (cells: string[]) => cells.length > 1 && cells.slice(1).every((c) => c === '' || !Number.isFinite(money(c.split(/[\/;|]/)[0])));

export function parsePeople(text: string): { people: Person[]; errors: string[] } {
  const people: Person[] = [], errors: string[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    if (!raw.trim() || raw.trim().startsWith('#')) return;
    const c = splitRow(raw);
    if (i === 0 && isHeader(c)) return;
    const name = c[0] || `Person ${people.length + 1}`;
    if (c.length < 3) { errors.push(`Personnel line ${i + 1} (${name}): give at least a name, a yearly salary and the effort %.`); return; }
    const salary = money(c[1]), effort = c[2].split(/[\/;|]/).map(money), fringe = c[3] != null && c[3] !== '' ? money(c[3]) : 0, raise = c[4] != null && c[4] !== '' ? money(c[4]) : 0;
    if (!(salary >= 0)) errors.push(`Personnel line ${i + 1} (${name}): the salary "${c[1]}" is not a number.`);
    else if (!effort.length || effort.some((e) => !(e >= 0 && e <= 100))) errors.push(`Personnel line ${i + 1} (${name}): effort is a percent from 0 to 100, one value or one per year like 50/50/25.`);
    else if (!(fringe >= 0 && fringe <= 200)) errors.push(`Personnel line ${i + 1} (${name}): the fringe rate "${c[3]}" should be a percent from 0 to 200.`);
    else if (!(raise >= -50 && raise <= 100)) errors.push(`Personnel line ${i + 1} (${name}): the yearly raise "${c[4]}" should be a percent.`);
    else people.push({ name, salary, effort, fringe, raise });
  });
  return { people, errors };
}

const CAT_WORDS: [RegExp, Category][] = [[/^equip/i, 'equipment'], [/^trav/i, 'travel'], [/^(consum|suppl|material)/i, 'consumables'], [/^other/i, 'other']];
export function parseLines(text: string, years: number): { lines: Line[]; errors: string[]; notes: string[] } {
  const lines: Line[] = [], errors: string[] = [], notes: string[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    if (!raw.trim() || raw.trim().startsWith('#')) return;
    const c = splitRow(raw);
    const cat = CAT_WORDS.find(([re]) => re.test(c[0]))?.[1];
    if (!cat) { if (i === 0 && isHeader(c)) return; errors.push(`Cost line ${i + 1}: start with a category: equipment, travel, consumables or other (not "${c[0]}").`); return; }
    const name = c[1] || CAT_NAME[cat];
    let rest = c.slice(2);
    let flag: Line['flag'] = '';
    const last = (rest[rest.length - 1] ?? '').toLowerCase();
    if (/^(x|exclude|excluded|no base)$/.test(last)) { flag = 'exclude'; rest = rest.slice(0, -1); } else if (/^cap(ped)?$/.test(last)) { flag = 'cap'; rest = rest.slice(0, -1); }
    while (rest.length && rest[rest.length - 1] === '') rest.pop();
    const amounts = rest.map((s) => (s === '' ? 0 : money(s)));
    if (!amounts.length) { errors.push(`Cost line ${i + 1} (${name}): give the amount for year 1 (and later years).`); return; }
    if (amounts.some((a) => !Number.isFinite(a) || a < 0)) { errors.push(`Cost line ${i + 1} (${name}): every amount must be a number of 0 or more (no thousands commas).`); return; }
    if (amounts.length > years) { errors.push(`Cost line ${i + 1} (${name}) has ${amounts.length} yearly amounts, but the budget has ${years} year${years > 1 ? 's' : ''}.`); return; }
    if (amounts.length < years) notes.push(`${name}: no amount given for year ${amounts.length + 1}${amounts.length + 1 < years ? ` to ${years}` : ''}, so 0 is used.`);
    lines.push({ category: cat, name, amounts, flag });
  });
  return { lines, errors, notes };
}

/** A made-up three-year example; every number is invented for the page. */
export const EXAMPLE = {
  years: 3,
  people: 'Role, yearly salary, effort %, fringe %, raise %\nLead researcher, 90000, 20, 30, 3\nPostdoctoral researcher, 55000, 100, 30, 3\nGraduate student, 30000, 50/50/100, 10, 2',
  lines: 'Category, item, year 1, year 2, year 3, base\nequipment, Microscope camera, 18000\ntravel, Conference trips, 3000, 3000, 4500\nconsumables, Reagents and plastics, 8000, 8000, 6000\nother, Publication fees, 0, 2500, 2500\nother, Partner lab subaward, 30000, 30000, 0, cap\nother, Student tuition, 9000, 9000, 9000, x',
  rate: '50',
  base: 'modified' as BaseKind,
  excludeCats: ['equipment'] as Category[],
  cap: 25000,
};
