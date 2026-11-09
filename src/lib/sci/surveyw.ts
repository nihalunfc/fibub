// Survey weights: design weights, post-stratification and raking (iterative proportional fitting) to population
// margins, with Kish's design effect and effective sample size.
// Raking: Deming and Stephan (1940), Annals of Mathematical Statistics 11: 427-444; as calibration, Deville and
// Särndal (1992), JASA 87: 376-382. Design effect from weighting: Kish (1965), Survey Sampling, Wiley; Kish (1992),
// Journal of Official Statistics 8: 183-200. Post-stratification: Holt and Smith (1979), JRSS A 142: 33-46.

export type Margin = { variable: number; shares: Map<string, number> };
export type RakeResult = { w: number[]; iterations: number; converged: boolean; maxDiff: number };

/** Read "category, count or %" lines into shares that add to 1. */
export function parseMargin(text: string, toNum: (s: string) => number = Number): { shares: Map<string, number>; error: string | null } {
  const raw = new Map<string, number>();
  for (const line of text.split(/\r?\n/)) {
    const l = line.trim(); if (!l || l.startsWith('#')) continue;
    const m = /^(.*?)\s*[,;:\t=]\s*([^,;:\t=]+?)\s*%?\s*$/.exec(l);
    const v = m ? toNum(m[2].replace(/%$/, '')) : NaN;
    if (!m || !m[1] || !Number.isFinite(v)) return { shares: raw, error: `Could not read "${l}". Write: category, count or %.` };
    if (v < 0) return { shares: raw, error: `"${l}": a population figure cannot be negative.` };
    if (raw.has(m[1])) return { shares: raw, error: `"${m[1]}" is listed twice.` };
    raw.set(m[1], v);
  }
  const tot = [...raw.values()].reduce((s, x) => s + x, 0);
  if (!raw.size) return { shares: raw, error: 'Type the population figures: one category per line with its count or %.' };
  if (!(tot > 0)) return { shares: raw, error: 'The population figures add up to 0.' };
  return { shares: new Map([...raw].map(([k, x]) => [k, x / tot])), error: null };
}

/** Check every respondent's category is in the margin and every margin category with a share has respondents. */
export function checkMargin(values: string[], shares: Map<string, number>, name: string): string | null {
  const seen = new Map<string, number>();
  for (const v of values) {
    if (!v) return `Some respondents have no ${name}. Remove them or give a category such as "Unknown" (and its population figure).`;
    if (!shares.has(v)) return `"${v}" (${name}) is in the data but not in the population figures.`;
    seen.set(v, (seen.get(v) ?? 0) + 1);
  }
  for (const [k, s] of shares) {
    if (s > 0 && !seen.has(k)) return `No respondent has ${name} "${k}", so it cannot be weighted up. Merge it with a neighbouring category.`;
    if (s === 0 && seen.has(k)) return `${name} "${k}" has a population share of 0 but has respondents. Remove them or give it a share.`;
  }
  return null;
}

/**
 * Rake base weights d so the weighted share of each category of each variable equals its target share, and the
 * weights add up to `total`. With one variable this is post-stratification (exact in one pass).
 */
export function rake(cols: string[][], d: number[], targets: Map<string, number>[], total: number, maxIter = 1000, tol = 1e-13): RakeResult {
  const n = d.length;
  let w = d.slice();
  const scale = total / w.reduce((s, x) => s + x, 0);
  w = w.map((x) => x * scale);
  let it = 0, maxDiff = Infinity;
  const shareDiff = () => {
    let m = 0;
    for (let k = 0; k < cols.length; k++) {
      const sums = new Map<string, number>();
      for (let i = 0; i < n; i++) sums.set(cols[k][i], (sums.get(cols[k][i]) ?? 0) + w[i]);
      const T = w.reduce((s, x) => s + x, 0);
      for (const [c, t] of targets[k]) m = Math.max(m, Math.abs((sums.get(c) ?? 0) / T - t));
    }
    return m;
  };
  while (it < maxIter) {
    it++;
    for (let k = 0; k < cols.length; k++) {
      const sums = new Map<string, number>();
      for (let i = 0; i < n; i++) sums.set(cols[k][i], (sums.get(cols[k][i]) ?? 0) + w[i]);
      for (let i = 0; i < n; i++) { const c = cols[k][i]; w[i] *= (targets[k].get(c)! * total) / sums.get(c)!; }
    }
    maxDiff = shareDiff();
    if (maxDiff < tol) break;
  }
  return { w, iterations: it, converged: maxDiff < tol, maxDiff };
}

/** Kish's design effect from unequal weights, n Σw² / (Σw)², and the effective sample size (Σw)² / Σw². */
export function kish(w: number[]): { deff: number; neff: number; cv: number } {
  const n = w.length, s1 = w.reduce((s, x) => s + x, 0), s2 = w.reduce((s, x) => s + x * x, 0);
  const deff = n * s2 / (s1 * s1);
  return { deff, neff: s1 * s1 / s2, cv: Math.sqrt(Math.max(0, deff - 1)) };
}

/** Unweighted and weighted percentages of each category of a column, in first-seen order (blank as "(blank)"). */
export function weightedPct(col: string[], w: number[]): { cat: string; n: number; pct: number; wpct: number; wsum: number }[] {
  const order: string[] = [], cnt = new Map<string, number>(), ws = new Map<string, number>();
  const W = w.reduce((s, x) => s + x, 0);
  col.forEach((v0, i) => { const v = v0 || '(blank)'; if (!cnt.has(v)) { order.push(v); cnt.set(v, 0); ws.set(v, 0); } cnt.set(v, cnt.get(v)! + 1); ws.set(v, ws.get(v)! + w[i]); });
  return order.map((c) => ({ cat: c, n: cnt.get(c)!, pct: 100 * cnt.get(c)! / col.length, wpct: 100 * ws.get(c)! / W, wsum: ws.get(c)! }));
}

/** Made-up example: 40 respondents (generated at random for teaching). */
export const EXAMPLE = `ID\tSex\tAge\tRegion\tSmokes\n1\tFemale\t18-34\tNorth\tYes\n2\tFemale\t35-54\tSouth\tYes\n3\tFemale\t35-54\tSouth\tNo\n4\tFemale\t35-54\tNorth\tNo\n5\tFemale\t55+\tNorth\tNo\n6\tMale\t55+\tNorth\tNo\n7\tFemale\t35-54\tSouth\tNo\n8\tFemale\t18-34\tNorth\tYes\n9\tMale\t18-34\tNorth\tYes\n10\tMale\t55+\tNorth\tNo\n11\tFemale\t35-54\tNorth\tNo\n12\tFemale\t55+\tSouth\tNo\n13\tMale\t18-34\tSouth\tYes\n14\tFemale\t18-34\tNorth\tNo\n15\tFemale\t55+\tSouth\tNo\n16\tMale\t55+\tSouth\tNo\n17\tMale\t35-54\tSouth\tNo\n18\tFemale\t35-54\tSouth\tYes\n19\tMale\t18-34\tNorth\tNo\n20\tFemale\t18-34\tSouth\tNo\n21\tMale\t18-34\tNorth\tYes\n22\tFemale\t55+\tNorth\tNo\n23\tFemale\t35-54\tSouth\tYes\n24\tFemale\t18-34\tSouth\tNo\n25\tFemale\t55+\tSouth\tNo\n26\tFemale\t18-34\tNorth\tNo\n27\tFemale\t18-34\tNorth\tNo\n28\tMale\t55+\tNorth\tNo\n29\tMale\t55+\tSouth\tNo\n30\tFemale\t18-34\tNorth\tYes\n31\tFemale\t55+\tNorth\tNo\n32\tFemale\t18-34\tNorth\tNo\n33\tFemale\t18-34\tNorth\tNo\n34\tMale\t18-34\tSouth\tYes\n35\tFemale\t35-54\tSouth\tNo\n36\tFemale\t55+\tNorth\tNo\n37\tMale\t35-54\tNorth\tYes\n38\tFemale\t55+\tNorth\tNo\n39\tMale\t35-54\tSouth\tNo\n40\tFemale\t35-54\tNorth\tNo\n`;
