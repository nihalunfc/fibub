// Decomposer race maths (#1233): leaf litter and other waste breaking down in a compost heap. Mass left falls
// exponentially, M = M0 e^(−kt). The rate k grows with warmth (doubling every 10 °C, Q10 = 2), is best in damp soil
// and slows when too dry or waterlogged (no air), and earthworms speed it up by shredding. Made-up round teaching
// values, not measurements.

export type MaterialId = 'leaves' | 'peel' | 'straw' | 'paper' | 'plastic';
/** Rate per day at 20 °C in ideal damp soil with microbes only (made-up round teaching values). */
export const MATERIALS: Record<MaterialId, { name: string; k: number }> = {
  leaves: { name: 'Green leaves', k: 0.03 },
  peel: { name: 'Fruit and vegetable peel', k: 0.06 },
  straw: { name: 'Dry straw', k: 0.01 },
  paper: { name: 'Newspaper', k: 0.006 },
  plastic: { name: 'Plastic bag', k: 0 },
};

export const Q10 = 2;
export const WORM_BOOST = 1.5;

/** Moisture effect, 0 to 1: best at 60% (damp like a wrung-out sponge), zero when bone dry, and falling again
 *  towards 100% (waterlogged, little air). */
export function moistureFactor(m: number): number {
  const x = Math.min(100, Math.max(0, m));
  return x <= 60 ? x / 60 : 1 - 0.75 * ((x - 60) / 40);
}

/** Temperature effect relative to 20 °C: doubles every 10 °C (Q10 = 2) up to 40 °C, then microbes start to suffer
 *  and it falls to nothing at 60 °C; nothing at or below 0 °C (frozen). */
export function tempFactor(t: number): number {
  if (t <= 0) return 0;
  if (t <= 40) return Q10 ** ((t - 20) / 10);
  if (t >= 60) return 0;
  return Q10 ** 2 * (1 - (t - 40) / 20);
}

export type Lane = { material: MaterialId; temp: number; moisture: number; worms: boolean };

/** Rate constant per day for one heap. */
export const rate = (l: Lane) => MATERIALS[l.material].k * tempFactor(l.temp) * moistureFactor(l.moisture) * (l.worms ? WORM_BOOST : 1);

/** Mass left (g) after `days`, from `m0` g. */
export const massLeft = (l: Lane, m0: number, days: number) => m0 * Math.exp(-rate(l) * days);

/** Days for half the mass to go (Infinity when nothing breaks it down). */
export const halfLife = (l: Lane) => { const k = rate(l); return k > 0 ? Math.LN2 / k : Infinity; };
