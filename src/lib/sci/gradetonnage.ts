// Grade-tonnage curves and cut-off grades for a set of blocks or composites. Money in any one currency. No DOM.

export const TROY_OZ = 31.1034768; // g
export const LB = 0.45359237; // kg

export type Block = { t: number; g: number };

/** Tonnes, tonnage-weighted mean grade and contained metal (tonnes × grade, in grade units × t) above a cut-off. */
export function above(blocks: Block[], cut: number) {
  let t = 0, m = 0;
  for (const b of blocks) if (b.g >= cut) { t += b.t; m += b.t * b.g; }
  return { t, g: t > 0 ? m / t : NaN, metal: m };
}

/** The curve at many cut-offs, from 0 to the highest grade. */
export function curve(blocks: Block[], n = 100) {
  const gmax = Math.max(...blocks.map((b) => b.g));
  return Array.from({ length: n + 1 }, (_, i) => { const c = (gmax * i) / n; return { cut: c, ...above(blocks, c) }; });
}

/**
 * Cut-off grades from first principles. value = money per tonne of rock per unit of grade, already net of selling
 * costs and royalty; rec = recovery (0-1). Breakeven pays for mining, processing and overheads; marginal (mill)
 * cut-off is for rock that is mined anyway, so it only has to pay processing and overheads.
 */
export function cutoffs(value: number, rec: number, mine: number, proc: number, ga: number) {
  const net = value * rec;
  return { breakeven: (mine + proc + ga) / net, marginal: (proc + ga) / net };
}

/**
 * Net value per tonne of rock per grade unit. For grade in %: price per tonne of metal ÷ 100. For g/t: price per gram.
 * Royalty is a share of the price; selling is a cost per the same metal unit as the price.
 */
export function netValue(price: number, selling: number, royalty: number, gradeUnit: 'pct' | 'gpt') {
  const p = price * (1 - royalty) - selling;
  return gradeUnit === 'pct' ? p / 100 : p;
}

/** Operating margin (undiscounted) above a cut-off: tonnes × (grade × value × recovery − total cost per tonne). */
export const margin = (t: number, g: number, value: number, rec: number, costPerT: number) => t * (g * value * rec - costPerT);
