// Period life table from age-specific death rates (nMx), or from deaths and mid-year population. Works for
// abridged (0, 1-4, 5-9, ...) and complete (single-year) tables; the last age group is open-ended.
// Conversion nqx = n·nMx / (1 + (n − nax)·nMx), as in Preston, Heuveline and Guillot (2001), chapter 3.

export type AxMethod = 'mid' | 'cd' | 'ak' | 'given';
export type Sex = 'female' | 'male';
export type LTRow = { age: number; n: number; label: string; mx: number; ax: number; qx: number; px: number; lx: number; dx: number; Lx: number; Tx: number; ex: number };

/** a0 (and 4a1 for abridged tables) by Coale and Demeny's West model formulas, as given by Preston et al. (2001). */
export function coaleDemeny(m0: number, sex: Sex) {
  if (sex === 'male') return m0 >= 0.107 ? { a0: 0.33, a1_4: 1.352 } : { a0: 0.045 + 2.684 * m0, a1_4: 1.651 - 2.816 * m0 };
  return m0 >= 0.107 ? { a0: 0.35, a1_4: 1.361 } : { a0: 0.053 + 2.8 * m0, a1_4: 1.522 - 1.518 * m0 };
}
/** a0 by Andreev and Kingkade (2015), from the infant death rate m0. */
export function andreevKingkade(m0: number, sex: Sex) {
  if (sex === 'male') return m0 < 0.023 ? 0.14929 - 1.99545 * m0 : m0 < 0.08307 ? 0.02832 + 3.26201 * m0 : 0.29915;
  return m0 < 0.01724 ? 0.14903 - 2.05527 * m0 : m0 < 0.06891 ? 0.04667 + 3.88089 * m0 : 0.31411;
}

/**
 * ages: start of each age group (increasing, first 0 is usual); mx: death rates; ax: optional given nax.
 * The last group is open-ended: its nax = 1/M, q = 1 and L = l/M.
 */
export function lifeTable(ages: number[], mx: number[], opt: { method: AxMethod; sex: Sex; radix?: number; ax?: number[]; labels?: string[] }): LTRow[] {
  const k = ages.length, radix = opt.radix ?? 100000;
  if (k < 2) throw new Error('Enter at least two age groups.');
  for (let i = 1; i < k; i++) if (!(ages[i] > ages[i - 1])) throw new Error(`Ages must go up: ${ages[i]} comes after ${ages[i - 1]}.`);
  mx.forEach((m, i) => { if (!(m >= 0) || !Number.isFinite(m)) throw new Error(`The death rate for age ${ages[i]} is not a number of 0 or more.`); });
  if (!(mx[k - 1] > 0)) throw new Error('The death rate of the last (open) age group must be more than 0.');
  const n = ages.map((a, i) => (i < k - 1 ? ages[i + 1] - a : Infinity));
  const ax = ages.map((_, i) => (i < k - 1 ? n[i] / 2 : 1 / mx[k - 1]));
  if (opt.method === 'given') {
    if (!opt.ax || opt.ax.length !== k) throw new Error('Add an "ax" column to use your own nax values.');
    for (let i = 0; i < k - 1; i++) { const a = opt.ax[i]; if (!(a >= 0 && a <= n[i])) throw new Error(`nax for age ${ages[i]} must be between 0 and ${n[i]}.`); ax[i] = a; }
  } else if (ages[0] === 0 && (opt.method === 'cd' || opt.method === 'ak')) {
    const m0 = mx[0];
    if (opt.method === 'cd') { const c = coaleDemeny(m0, opt.sex); if (n[0] === 1) ax[0] = c.a0; if (n[0] === 1 && ages[1] === 1 && n[1] === 4 && k > 2) ax[1] = c.a1_4; }
    else if (n[0] === 1) ax[0] = andreevKingkade(m0, opt.sex);
  }
  const rows: LTRow[] = [];
  let l = radix;
  for (let i = 0; i < k; i++) {
    const m = mx[i], last = i === k - 1;
    let q = last ? 1 : (n[i] * m) / (1 + (n[i] - ax[i]) * m);
    if (q > 1) q = 1;
    const d = l * q, L = last ? l / m : n[i] * (l - d) + ax[i] * d;
    rows.push({ age: ages[i], n: n[i], label: opt.labels?.[i] ?? (last ? `${ages[i]}+` : n[i] === 1 ? `${ages[i]}` : `${ages[i]}–${ages[i] + n[i] - 1}`), mx: m, ax: ax[i], qx: q, px: 1 - q, lx: l, dx: d, Lx: L, Tx: 0, ex: 0 });
    l -= d;
  }
  let T = 0;
  for (let i = k - 1; i >= 0; i--) { T += rows[i].Lx; rows[i].Tx = T; rows[i].ex = T / rows[i].lx; }
  return rows;
}

/** Age of each label: the first number in "1-4", "85+", "45 to 49". */
export function ageOf(label: string): number {
  const m = label.match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}
