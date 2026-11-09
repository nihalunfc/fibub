// Multiplicity of infection (MOI): infectious particles added per cell, the virus volume for a target MOI, the
// Poisson share of cells that get 0, 1, 2 … particles, the MOI for a target % infected, and a plate plan for
// several MOIs with a predilution when the stock volume is too small to pipette. Plain maths, no DOM.
// Checked in tests/sci-tools/moi-calculator.mjs against hand working and an independent Python script.

export type TitreUnit = 'pfu' | 'tcid50' | 'tu';
export const UNITS: Record<TitreUnit, { name: string; short: string }> = {
  pfu: { name: 'PFU/mL (plaque-forming units)', short: 'PFU' },
  tcid50: { name: 'TCID₅₀/mL (50 % tissue culture infectious dose)', short: 'TCID₅₀' },
  tu: { name: 'TU/mL (transducing or infectious units)', short: 'TU' },
};
/**
 * In an end-point assay, a well is infected with probability 1 − e^(−m) for a mean of m infectious particles, so the
 * dose that infects 50 % of wells holds ln 2 ≈ 0.69 particles on average. That is the usual "PFU ≈ 0.69 × TCID50".
 */
export const LN2 = Math.LN2;

/** Infectious units per mL from a titre in its own unit. `tcidFactor` is the infectious units per TCID50 (ln 2 or 1). */
export function infectiousTitre(titre: number, unit: TitreUnit, tcidFactor = LN2): number {
  if (!(titre > 0) || !Number.isFinite(titre)) throw new Error('Type the virus titre, a number above 0 (such as 5e7).');
  if (unit === 'tcid50' && !(tcidFactor > 0)) throw new Error('The TCID₅₀ factor must be above 0.');
  return unit === 'tcid50' ? titre * tcidFactor : titre;
}
const cellsOk = (cells: number) => { if (!(cells > 0) || !Number.isFinite(cells)) throw new Error('Type the number of cells, a number above 0.'); };

/** MOI from cells, infectious titre (per mL) and the virus volume added (µL). */
export function moiFrom(cells: number, titrePerMl: number, volUl: number): number {
  cellsOk(cells);
  if (!(volUl >= 0) || !Number.isFinite(volUl)) throw new Error('Type the virus volume in µL, 0 or more.');
  return (titrePerMl * volUl / 1000) / cells;
}
/** Virus volume (µL) for a target MOI. */
export function volumeFor(moi: number, cells: number, titrePerMl: number): number {
  cellsOk(cells);
  if (!(moi >= 0) || !Number.isFinite(moi)) throw new Error('Type the target MOI, 0 or more.');
  return (moi * cells / titrePerMl) * 1000;
}

// --- Poisson ---------------------------------------------------------------------------------------------------
const LNF: number[] = [0];
function lnFact(k: number): number { for (let i = LNF.length; i <= k; i++) LNF[i] = LNF[i - 1] + Math.log(i); return LNF[k]; }
/** Share (0 to 1) of cells that get exactly k particles at MOI m. */
export function pExactly(m: number, k: number): number {
  if (m === 0) return k === 0 ? 1 : 0;
  return Math.exp(-m + k * Math.log(m) - lnFact(k));
}
/** Share of cells that get k or more particles. Summed from the smaller tail for accuracy. */
export function pAtLeast(m: number, k: number): number {
  if (k <= 0) return 1;
  if (m === 0) return 0;
  if (k > m) { // upper tail is small: add terms up from k until they stop mattering
    let s = 0;
    for (let j = k; j < k + 1000; j++) { const t = pExactly(m, j); s += t; if (t < s * 1e-17) break; }
    return Math.min(1, s);
  }
  let s = 0;
  for (let j = 0; j < k; j++) s += pExactly(m, j);
  return Math.max(0, 1 - s);
}
/** MOI at which a share f (0 < f < 1) of cells gets at least k particles. k = 1 is −ln(1 − f); larger k by bisection. */
export function moiForShare(f: number, k = 1): number {
  if (!(f > 0 && f < 1)) throw new Error('The target must be above 0 % and below 100 %.');
  if (!(Number.isInteger(k) && k >= 1 && k <= 50)) throw new Error('"At least" must be a whole number from 1 to 50.');
  if (k === 1) return -Math.log1p(-f);
  let lo = 0, hi = k + 10;
  while (pAtLeast(hi, k) < f) hi *= 2;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (pAtLeast(mid, k) < f) lo = mid; else hi = mid; if (hi - lo < 1e-14 * hi) break; }
  return (lo + hi) / 2;
}
export type PoissonRow = { k: number; exactly: number; atLeast: number; last: boolean };
/** Rows 0, 1, … K−1 and a last "K or more" row, with K large enough that the rest is under 0.1 % (at least 4, at most 40). */
export function poissonTable(m: number): PoissonRow[] {
  if (!(m >= 0) || !Number.isFinite(m)) throw new Error('The MOI must be 0 or more.');
  let K = 4;
  while (K < 40 && pAtLeast(m, K) > 0.001) K++;
  const rows: PoissonRow[] = [];
  for (let k = 0; k < K; k++) rows.push({ k, exactly: pExactly(m, k), atLeast: pAtLeast(m, k), last: false });
  rows.push({ k: K, exactly: pAtLeast(m, K), atLeast: pAtLeast(m, K), last: true });
  return rows;
}

// --- Plate plan ------------------------------------------------------------------------------------------------
export type PlateInput = {
  mois: number[]; cells: number; titrePerMl: number; wells: number;
  /** Inoculum volume per well, µL (virus plus medium). */ inocUl: number;
  /** Spare, %. */ spare: number;
  /** Smallest volume you are happy to pipette, µL. */ minUl: number;
};
export type PlateRow = {
  moi: number; perWell: number; workPerMl: number; infected: number; totalUl: number;
  /** 1 for the stock itself, 10 for a 1 : 10 predilution, … */ predil: number;
  /** µL of stock (or of the predilution) in the mix, and µL of medium. */ virusUl: number; mediumUl: number;
  /** Predilution to make first: µL of stock and medium (0 when none). */ preStockUl: number; preMediumUl: number;
  ok: boolean; warn: string;
};
/** Parse "0.1, 1, 10" (commas, semicolons, spaces or new lines between them; dots for decimals) into MOIs. */
export function parseMois(s: string, num: (x: string) => number): { mois: number[]; bad: string[] } {
  const parts = s.split(/[\s;,]+/).map((x) => x.trim()).filter(Boolean);
  const mois: number[] = [], bad: string[] = [];
  for (const p of parts) { const v = num(p); if (v >= 0 && Number.isFinite(v)) mois.push(v); else bad.push(p); }
  return { mois, bad };
}
export function platePlan(p: PlateInput): PlateRow[] {
  cellsOk(p.cells);
  if (!(p.titrePerMl > 0)) throw new Error('Type the virus titre, a number above 0.');
  if (!(Number.isInteger(p.wells) && p.wells >= 1 && p.wells <= 1536)) throw new Error('Wells per MOI must be a whole number from 1 to 1536.');
  if (!(p.inocUl > 0)) throw new Error('Type the inoculum volume per well in µL, above 0.');
  if (!(p.spare >= 0 && p.spare <= 100)) throw new Error('Spare must be from 0 to 100 %.');
  if (!(p.minUl > 0)) throw new Error('Type the smallest volume you pipette in µL, above 0.');
  if (!p.mois.length) throw new Error('Type at least one MOI.');
  if (p.mois.length > 48) throw new Error('Up to 48 MOIs at once.');
  const totalUl = p.wells * p.inocUl * (1 + p.spare / 100);
  return p.mois.map((moi) => {
    const perWell = moi * p.cells;                    // infectious units per well
    const workPerMl = perWell / (p.inocUl / 1000);    // concentration of the working dilution
    const infected = moi > 0 ? 1 - Math.exp(-moi) : 0;
    const base = { moi, perWell, workPerMl, infected, totalUl };
    if (moi === 0) return { ...base, predil: 1, virusUl: 0, mediumUl: totalUl, preStockUl: 0, preMediumUl: 0, ok: true, warn: 'No virus: a mock-infected control.' };
    const stockUl = totalUl * workPerMl / p.titrePerMl;
    if (stockUl > totalUl * (1 + 1e-12)) {
      return { ...base, predil: 1, virusUl: stockUl, mediumUl: 0, preStockUl: 0, preMediumUl: 0, ok: false, warn: `The stock is too weak: this MOI needs ${round3(stockUl / totalUl * p.inocUl)} µL of stock per well, more than the ${round3(p.inocUl)} µL inoculum. Use a bigger inoculum, fewer cells or a stronger stock.` };
    }
    // Smallest 10-fold predilution (up to 1 : 1000 in one step) that makes the volume to pipette at least minUl.
    let d = 1;
    while (stockUl * d < p.minUl * (1 - 1e-12) && stockUl * d * 10 <= totalUl * (1 + 1e-12) && d < 1000) d *= 10;
    const virusUl = stockUl * d;
    let preStockUl = 0, preMediumUl = 0, warn = '';
    if (d > 1) {
      // Make 20 % more predilution than needed, and never pipette less than minUl of stock into it.
      const preTotal = Math.max(virusUl * 1.2, p.minUl * d);
      preStockUl = preTotal / d; preMediumUl = preTotal - preStockUl;
    }
    if (virusUl < p.minUl * (1 - 1e-12)) warn = `Only ${round3(virusUl)} µL goes into the mix, below your ${round3(p.minUl)} µL. Dilute the stock further in 1 : 1000 steps, or make more mix (more wells or spare).`;
    return { ...base, predil: d, virusUl, mediumUl: totalUl - virusUl, preStockUl, preMediumUl, ok: true, warn };
  });
}
const round3 = (x: number) => (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x >= 1 ? x.toFixed(2) : x.toPrecision(3));

/** The example: made-up, rounded numbers (not from any paper or kit). */
export const EXAMPLE = { cells: '2e5', titre: '5e7', unit: 'pfu' as TitreUnit, volUl: '4', moi: '3', target: '90', atLeast: '1', mois: '0, 0.01, 0.1, 1, 10', wells: '3', inocUl: '200', spare: '10', minUl: '2' };
