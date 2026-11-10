// #1786 Roth or traditional: after-tax value of yearly contributions to a traditional (tax now deferred, taxed on the
// way out) or Roth (taxed now, tax-free out) 401(k) or IRA. Pure maths, no DOM, checked in tests/tools/roth-vs-traditional.mjs.
// 2026 limits: IRS IR-2025-111 (401(k) 24,500; catch-up 8,000 at 50+, 11,250 at 60-63; IRA 7,500, catch-up 1,100),
// checked 2026-11-10.

export const LIMITS_2026 = {
  k401: 24500, k401CatchUp50: 8000, k401CatchUp60: 11250,
  ira: 7500, iraCatchUp50: 1100,
  rothIraPhaseOut: { single: [153000, 168000], mfj: [242000, 252000], mfs: [0, 10000] } as Record<string, [number, number]>,
};
export const limitFor = (plan: '401k' | 'ira', age: number) => plan === 'ira'
  ? LIMITS_2026.ira + (age >= 50 ? LIMITS_2026.iraCatchUp50 : 0)
  : LIMITS_2026.k401 + (age >= 60 && age <= 63 ? LIMITS_2026.k401CatchUp60 : age >= 50 ? LIMITS_2026.k401CatchUp50 : 0);

export interface Input {
  amount: number;     // yearly contribution, in pre-tax dollars for traditional
  years: number;      // years of contributions until retirement (each paid at the start of the year)
  ret: number;        // yearly return, e.g. 0.06
  taxNow: number;     // tax rate on the money now (federal + state), e.g. 0.22
  taxLater: number;   // tax rate on withdrawals in retirement
  basis: 'cost' | 'same';
  // 'cost': both cost you the same take-home pay: Roth gets amount x (1 - taxNow).
  // 'same': the same dollars go into both (e.g. at the limit); the traditional's tax saving is invested in a taxable
  // account whose returns are taxed each year at sideTax.
  sideTax: number;
}
export interface Row { year: number; trad: number; roth: number }
export interface Result { trad: number; roth: number; rothIn: number; side: number; better: 'roth' | 'trad' | 'equal'; diff: number; breakEven: number | null; rows: Row[] }

/** Value after `years` of paying `c` at the start of each year, growing at `r`. */
export const fvStart = (c: number, r: number, years: number) => {
  let v = 0; for (let i = 0; i < years; i++) v = (v + c) * (1 + r); return v;
};

export function compare(inp: Input): Result {
  const n = Math.max(0, Math.round(inp.years)), r = inp.ret, c = Math.max(0, inp.amount);
  const rothIn = inp.basis === 'cost' ? c * (1 - inp.taxNow) : c;
  const sideC = inp.basis === 'same' ? c * inp.taxNow : 0;
  const sideR = r * (1 - inp.sideTax);
  const rows: Row[] = [];
  let pot = 0, rpot = 0, side = 0;
  for (let y = 1; y <= n; y++) {
    pot = (pot + c) * (1 + r); rpot = (rpot + rothIn) * (1 + r); side = (side + sideC) * (1 + sideR);
    rows.push({ year: y, trad: pot * (1 - inp.taxLater) + side, roth: rpot });
  }
  const trad = pot * (1 - inp.taxLater) + side, roth = rpot;
  const diff = roth - trad;
  // Tax rate later at which both come out the same: pot x (1 - t) + side = roth.
  const breakEven = pot > 0 ? 1 - (roth - side) / pot : null;
  return { trad, roth, rothIn, side, better: Math.abs(diff) < 0.005 ? 'equal' : diff > 0 ? 'roth' : 'trad', diff, breakEven, rows };
}
