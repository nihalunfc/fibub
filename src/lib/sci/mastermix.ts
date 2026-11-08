// PCR (or any) master mix: the volume of each stock for one reaction, and for n reactions plus spare.

/** Units a stock and a final amount can be in; values convert to a base unit within one family. */
export const UNITS: Record<string, { fam: string; k: number }> = {
  X: { fam: 'x', k: 1 },
  M: { fam: 'mol', k: 1 }, mM: { fam: 'mol', k: 1e-3 }, 'µM': { fam: 'mol', k: 1e-6 }, nM: { fam: 'mol', k: 1e-9 },
  'mg/mL': { fam: 'mass', k: 1 }, 'ng/µL': { fam: 'mass', k: 1e-3 }, 'µg/mL': { fam: 'mass', k: 1e-3 },
  '%': { fam: 'pct', k: 1 },
  'U/µL': { fam: 'u', k: 1 },
};
export type Component = { name: string; stock: number; stockUnit: string; final: number; finalUnit: string; inMix: boolean };

/** Volume (µL) of a stock for one reaction of `rxn` µL. finalUnit 'U' (units per reaction) works with a U/µL stock; 'µL' is a fixed volume. */
export function perReaction(c: Component, rxn: number): number {
  if (c.finalUnit === 'µL') return c.final;
  if (!(c.stock > 0)) throw new Error(`${c.name}: the stock must be above zero`);
  if (c.finalUnit === 'U') { if (c.stockUnit !== 'U/µL') throw new Error(`${c.name}: units per reaction need a stock in U/µL`); return c.final / c.stock; }
  const a = UNITS[c.stockUnit], b = UNITS[c.finalUnit];
  if (!a || !b || a.fam !== b.fam) throw new Error(`${c.name}: the stock (${c.stockUnit}) and final (${c.finalUnit}) units do not match`);
  const ratio = (c.final * b.k) / (c.stock * a.k);
  if (ratio > 1 + 1e-12) throw new Error(`${c.name}: the final amount is stronger than the stock`);
  return ratio * rxn;
}

/** The whole mix. Water fills each reaction up to `rxn`; components marked not inMix (template) are added per tube. */
export function masterMix(comps: Component[], rxn: number, n: number, sparePct: number) {
  if (!(rxn > 0)) throw new Error('The reaction volume must be above zero');
  if (!(n >= 1)) throw new Error('Make at least one reaction');
  const rows = comps.map((c) => ({ ...c, one: perReaction(c, rxn) }));
  const used = rows.reduce((s, r) => s + r.one, 0), water = rxn - used;
  if (water < -1e-9) throw new Error(`The components add up to ${+used.toFixed(3)} µL, more than the ${rxn} µL reaction`);
  const m = n * (1 + Math.max(0, sparePct) / 100);
  const mixPer = rows.filter((r) => r.inMix).reduce((s, r) => s + r.one, 0) + water;
  return { rows: rows.map((r) => ({ ...r, total: r.inMix ? r.one * m : NaN })), water: { one: water, total: water * m }, multiplier: m, mixPerTube: mixPer, mixTotal: mixPer * m };
}
