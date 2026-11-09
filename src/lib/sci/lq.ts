// Regional economic analysis from employment by industry: location quotients, the classic shift-share
// decomposition (national growth, industry mix, regional shift), the economic base split into basic and
// non-basic jobs with its multiplier, and the coefficient of specialisation.

export type Industry = { name: string; r0: number; r1: number; n0: number; n1: number };

export type IndustryResult = {
  name: string;
  r0: number; r1: number; n0: number; n1: number;
  /** Location quotients in year 1 and year 2 (NaN when there is no year 2). */
  lq0: number; lq1: number;
  /** Growth rates (fractions) in the region and the reference area. */
  rGrowth: number; nGrowth: number;
  /** Shift-share parts: they add up to r1 − r0. */
  ns: number; im: number; rs: number; change: number;
  /** Basic (export) jobs by the location quotient method in the year analysed, and the rest. */
  basic: number; nonBasic: number;
  /** Share of regional jobs minus share of reference jobs (percentage points), for specialisation. */
  shareGap: number;
};

export type LqResult = {
  rows: IndustryResult[];
  twoYears: boolean;
  /** Year used for the base analysis: 0 (first) or 1 (second). */
  baseYear: 0 | 1;
  totals: { r0: number; r1: number; n0: number; n1: number; ns: number; im: number; rs: number; change: number; basic: number; nonBasic: number };
  /** Reference-area growth rate over all industries. */
  G: number;
  multiplier: number;
  /** Coefficient of specialisation (0 = same mix as the reference area, 1 = completely different). */
  specialisation: number;
};

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

/**
 * rows: one per industry; r0/n0 region and reference jobs in year 1, r1/n1 in year 2 (NaN when there is
 * only one year). baseYear: which year to use for the basic/non-basic split (defaults to the latest).
 */
export function analyse(rows: Industry[], baseYear?: 0 | 1): LqResult {
  if (rows.length < 2) throw new Error('Need at least two industries');
  const twoYears = rows.every((r) => Number.isFinite(r.r1) && Number.isFinite(r.n1));
  for (const r of rows) {
    for (const v of twoYears ? [r.r0, r.r1, r.n0, r.n1] : [r.r0, r.n0]) if (!(v >= 0)) throw new Error(`Jobs for ${r.name} must be numbers of zero or more`);
  }
  const R0 = sum(rows.map((r) => r.r0)), N0 = sum(rows.map((r) => r.n0));
  const R1 = twoYears ? sum(rows.map((r) => r.r1)) : NaN, N1 = twoYears ? sum(rows.map((r) => r.n1)) : NaN;
  if (!(R0 > 0) || !(N0 > 0)) throw new Error('Total jobs in the region and in the reference area must be above zero');
  if (twoYears && (!(R1 > 0) || !(N1 > 0))) throw new Error('Total jobs in the second year must be above zero');
  for (const r of rows) {
    if (r.n0 === 0 && r.r0 > 0) throw new Error(`${r.name} has regional jobs but none in the reference area in year 1, so its location quotient has no meaning`);
    if (twoYears && r.n1 === 0 && r.r1 > 0) throw new Error(`${r.name} has regional jobs but none in the reference area in year 2`);
  }
  const by: 0 | 1 = twoYears ? (baseYear ?? 1) : 0;
  const G = twoYears ? N1 / N0 - 1 : NaN;
  const lq = (e: number, E: number, et: number, Et: number) => (E > 0 ? (e / et) / (E / Et) : NaN);
  const out = rows.map((r): IndustryResult => {
    const lq0 = lq(r.r0, r.n0, R0, N0), lq1 = twoYears ? lq(r.r1, r.n1, R1, N1) : NaN;
    const nGrowth = twoYears && r.n0 > 0 ? r.n1 / r.n0 - 1 : NaN;
    const rGrowth = twoYears && r.r0 > 0 ? r.r1 / r.r0 - 1 : NaN;
    const change = twoYears ? r.r1 - r.r0 : NaN;
    const ns = twoYears ? r.r0 * G : NaN;
    const im = twoYears ? (r.r0 > 0 ? r.r0 * (nGrowth - G) : 0) : NaN;
    // Regional shift r0 (g_r − g_n), written as the remainder so the three parts always add up, even when r0 = 0.
    const rs = twoYears ? change - ns - im : NaN;
    const e = by ? r.r1 : r.r0, E = by ? r.n1 : r.n0, Rt = by ? R1 : R0, Nt = by ? N1 : N0;
    const expected = Rt * (E / Nt);
    const basic = Math.max(0, e - expected);
    return { name: r.name, r0: r.r0, r1: r.r1, n0: r.n0, n1: r.n1, lq0, lq1, rGrowth, nGrowth, ns, im, rs, change, basic, nonBasic: e - basic, shareGap: (e / Rt - E / Nt) * 100 };
  });
  const basic = sum(out.map((r) => r.basic)), Rb = by ? R1 : R0;
  return {
    rows: out, twoYears, baseYear: by, G,
    totals: { r0: R0, r1: R1, n0: N0, n1: N1, ns: sum(out.map((r) => r.ns)), im: sum(out.map((r) => r.im)), rs: sum(out.map((r) => r.rs)), change: R1 - R0, basic, nonBasic: Rb - basic },
    multiplier: basic > 0 ? Rb / basic : NaN,
    specialisation: sum(out.map((r) => Math.abs(r.shareGap))) / 200,
  };
}
