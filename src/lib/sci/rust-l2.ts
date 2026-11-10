// School chemistry (Class 10 corrosion): a teaching model of iron nails in six test tubes over days. The rates are
// made up and only show the real pattern (rust needs both air and water; salt speeds it up; paint and zinc
// protect). Plus the mass of rust from a mass of iron (IUPAC atomic weights). No DOM.

export type Tube = { id: string; label: string; air: boolean; water: boolean; salt: boolean; coat: 'none' | 'paint' | 'zinc'; note: string };

export const TUBES: Tube[] = [
  { id: 'dry', label: 'Dry air', air: true, water: false, salt: false, coat: 'none', note: 'Calcium chloride at the bottom soaks up any moisture; the tube is corked.' },
  { id: 'boiled', label: 'No air', air: false, water: true, salt: false, coat: 'none', note: 'Boiled water has lost its dissolved air; a layer of oil stops air getting back in.' },
  { id: 'water', label: 'Air + water', air: true, water: true, salt: false, coat: 'none', note: 'Ordinary tap water, open to the air.' },
  { id: 'salt', label: 'Salt water', air: true, water: true, salt: true, coat: 'none', note: 'Salt water, open to the air, like a car on salted winter roads or a ship at sea.' },
  { id: 'paint', label: 'Painted', air: true, water: true, salt: false, coat: 'paint', note: 'A painted nail in tap water. The paint keeps air and water off the iron.' },
  { id: 'zinc', label: 'Galvanised', air: true, water: true, salt: false, coat: 'zinc', note: 'A zinc-coated nail in tap water. Zinc is more reactive, so it corrodes instead of the iron.' },
];

/** Made-up first-order rates (per day) for the share of the surface rusted. */
export const RATE = { water: 0.07, salt: 0.2, scratch: 0.05 };

/**
 * Share of the nail's surface rusted (0 to 1) after `day` days. With `scratched`, the coat has a scratch: a painted
 * nail rusts at the scratch, a galvanised one does not (the zinc around it still corrodes first).
 */
export function rusted(t: Tube, day: number, scratched = false): number {
  if (day <= 0 || !t.air || !t.water) return 0;
  let k = t.salt ? RATE.salt : RATE.water;
  if (t.coat === 'zinc') return 0;
  if (t.coat === 'paint') { if (!scratched) return 0; k = RATE.scratch; return 0.25 * (1 - Math.exp(-k * day)); }
  return 1 - Math.exp(-k * day);
}

export function describe(share: number): string {
  if (share <= 0) return 'none';
  if (share < 0.1) return 'a few spots';
  if (share < 0.4) return 'some rust';
  if (share < 0.75) return 'a lot of rust';
  return 'covered in rust';
}

/** IUPAC 2021 standard atomic weights (abridged), g/mol. */
export const AW = { Fe: 55.845, O: 15.999, H: 1.008 };
export const M_FE2O3 = 2 * AW.Fe + 3 * AW.O;

/** Mass of Fe₂O₃ made when `fe` grams of iron rust completely (4Fe + 3O₂ → 2Fe₂O₃). */
export const rustMass = (fe: number) => (fe / AW.Fe / 2) * M_FE2O3;
/** Mass of oxygen taken from the air. */
export const oxygenTaken = (fe: number) => rustMass(fe) - fe;
/** Percentage of iron in Fe₂O₃ by mass. */
export const ironPercent = () => (200 * AW.Fe) / M_FE2O3;
