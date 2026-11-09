// Forest inventory plot summary: stems and basal area per hectare (or acre), quadratic mean diameter, Lorey's mean
// height, diameter classes and per-species figures, with the standard error across fixed-area plots.
import { basalArea, diameterFromBA, UNIT_AREA, type Units } from './treeheight.ts';
import { tInv } from './stats.ts';

export type InvTree = { plot: string; species: string; dbh: number; h?: number };
export type Est = { mean: number; sd: number; se: number; lo: number; hi: number; perPlot: number[] };
export type SpeciesRow = { species: string; stems: Est; ba: Est; qmd: number; shareBA: number; lorey: number; trees: number };
export type Inventory = {
  plots: string[]; k: number; ef: number; trees: number;
  stems: Est; ba: Est; qmd: number; lorey: number; heights: number;
  species: SpeciesRow[];
  classes: { lo: number; hi: number; mid: number; perSpecies: number[]; total: number }[];
};

/** Mean, sample SD, standard error and 95 % t interval of per-plot values. */
export function est(v: number[]): Est {
  const k = v.length, mean = v.reduce((s, x) => s + x, 0) / k;
  const sd = k > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / (k - 1)) : NaN, se = sd / Math.sqrt(k);
  const t = k > 1 ? tInv(0.975, k - 1) : NaN;
  return { mean, sd, se, lo: mean - t * se, hi: mean + t * se, perPlot: v };
}

/**
 * Summarise a tree tally from fixed-area plots of `area` m² (or ft² in imperial units). `nPlots` counts plots with no
 * trees too (they are added as empty plots after the named ones). Diameter classes are `width` wide, starting at a
 * multiple of the width.
 */
export function inventory(trees: InvTree[], area: number, u: Units, width: number, nPlots?: number): Inventory {
  const ef = UNIT_AREA[u] / area;
  const plots = [...new Set(trees.map((t) => t.plot))];
  const k = Math.max(plots.length, nPlots ?? 0);
  const idx = new Map(plots.map((p, i) => [p, i]));
  const species = [...new Set(trees.map((t) => t.species))].sort((a, b) => a.localeCompare(b));
  const sIdx = new Map(species.map((s, i) => [s, i]));
  const N = Array.from({ length: species.length }, () => new Array(k).fill(0)), B = Array.from({ length: species.length }, () => new Array(k).fill(0));
  const hb = species.map(() => [0, 0]);
  let hbAll = [0, 0], heights = 0;
  for (const t of trees) {
    const p = idx.get(t.plot)!, s = sIdx.get(t.species)!, ba = basalArea(t.dbh, u);
    N[s][p] += ef; B[s][p] += ba * ef;
    if (t.h !== undefined && Number.isFinite(t.h)) { hb[s][0] += ba * t.h; hb[s][1] += ba; hbAll[0] += ba * t.h; hbAll[1] += ba; heights++; }
  }
  const sum = (m: number[][]) => Array.from({ length: k }, (_, j) => m.reduce((s, r) => s + r[j], 0));
  const stems = est(sum(N)), ba = est(sum(B));
  const qmd = stems.mean > 0 ? diameterFromBA(ba.mean / stems.mean, u) : NaN;
  const rows: SpeciesRow[] = species.map((sp, i) => {
    const sN = est(N[i]), sB = est(B[i]);
    return { species: sp, stems: sN, ba: sB, qmd: sN.mean > 0 ? diameterFromBA(sB.mean / sN.mean, u) : NaN, shareBA: ba.mean > 0 ? sB.mean / ba.mean : NaN, lorey: hb[i][1] > 0 ? hb[i][0] / hb[i][1] : NaN, trees: trees.filter((t) => t.species === sp).length };
  });
  const dmin = Math.min(...trees.map((t) => t.dbh)), dmax = Math.max(...trees.map((t) => t.dbh));
  const c0 = Math.floor(dmin / width + 1e-9) * width, nc = Math.max(1, Math.floor((dmax - c0) / width + 1e-9) + 1);
  const classes = Array.from({ length: nc }, (_, c) => ({ lo: c0 + c * width, hi: c0 + (c + 1) * width, mid: c0 + (c + 0.5) * width, perSpecies: species.map(() => 0), total: 0 }));
  for (const t of trees) {
    const c = Math.min(nc - 1, Math.floor((t.dbh - c0) / width + 1e-9));
    classes[c].perSpecies[sIdx.get(t.species)!] += ef / k; classes[c].total += ef / k;
  }
  return { plots, k, ef, trees: trees.length, stems, ba, qmd, lorey: hbAll[1] > 0 ? hbAll[0] / hbAll[1] : NaN, heights, species: rows, classes };
}
