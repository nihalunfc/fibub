// Reaction equivalents table (the "reagent table" of an organic lab notebook): from the scale of the limiting
// reagent and each reagent's equivalents, the moles, mass and volume to measure out, and the theoretical yield.

export type Reagent = {
  name: string; mw: number; equiv: number;
  /** g/mL, for a neat liquid measured by volume. */
  density?: number;
  /** Purity or assay in % by mass (e.g. 98); the mass to weigh is scaled up. */
  purity?: number;
  /** For a solution reagent: molarity in mol/L (e.g. n-BuLi 2.5 M in hexanes). */
  molarity?: number;
};

export type Row = { mmol: number; massMg: number; weighMg: number; volumeUl?: number; note?: string };

/** Amounts for every reagent at a scale given as mmol of the limiting reagent (the one at equiv 1 that sets the scale). */
export function table(reagents: Reagent[], scaleMmol: number): Row[] {
  return reagents.map((r) => {
    const mmol = scaleMmol * r.equiv, massMg = mmol * r.mw, purity = r.purity && r.purity > 0 && r.purity < 100 ? r.purity / 100 : 1;
    const weighMg = massMg / purity;
    if (r.molarity && r.molarity > 0) return { mmol, massMg, weighMg, volumeUl: (mmol / r.molarity) * 1000, note: 'solution' };
    if (r.density && r.density > 0) return { mmol, massMg, weighMg, volumeUl: weighMg / r.density, note: 'neat liquid' };
    return { mmol, massMg, weighMg };
  });
}

/** Scale in mmol from a chosen reagent's mass (mg), volume (µL) or amount (mmol). */
export function scaleFrom(r: Reagent, by: 'mmol' | 'mg' | 'ul', value: number): number {
  const purity = r.purity && r.purity > 0 && r.purity < 100 ? r.purity / 100 : 1;
  let mmol: number;
  if (by === 'mmol') mmol = value;
  else if (by === 'mg') mmol = (value * purity) / r.mw;
  else if (r.molarity) mmol = (value / 1000) * r.molarity;
  else if (r.density) mmol = (value * r.density * purity) / r.mw;
  else throw new Error('Give a density or a molarity to set the scale by volume.');
  return mmol / r.equiv;
}

/** Theoretical yield (mg) of a product made 1:1 (or `ratio` per limiting reagent) and percent yield. */
export function yieldOf(scaleMmol: number, productMw: number, ratio = 1, actualMg?: number) {
  const theoMg = scaleMmol * ratio * productMw;
  return { theoMg, percent: actualMg !== undefined ? (100 * actualMg) / theoMg : NaN };
}
