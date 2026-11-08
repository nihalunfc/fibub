// Thin-layer chromatography: retardation factors from distances or from points on a plate photo, lane grouping,
// and the column volumes a spot needs on a flash column (CV ≈ 1/Rf).

/** Rf from the positions of the spot, the baseline (origin) and the solvent front along the run (any one unit or pixel axis). */
export const rf = (spot: number, base: number, front: number) => (spot - base) / (front - base);

/** Column volumes to elute a compound on a flash column packed with the same silica and eluent: about 1/Rf. */
export const columnVolumes = (r: number) => 1 / r;

/** Lane index for each x: spots closer than `gap` (a fraction of the plate width) to the previous one share a lane. */
export function lanes(xs: number[], width: number, gap = 0.06): number[] {
  const order = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x);
  const out = new Array<number>(xs.length);
  let lane = -1, prev = -Infinity;
  for (const { x, i } of order) { if (x - prev > gap * width) lane++; out[i] = lane; prev = x; }
  return out;
}

export type RfNote = { level: 'good' | 'warn' | 'bad'; text: string };
/** What an Rf means for the eluent choice. */
export function rfAdvice(r: number): RfNote {
  if (!(r >= 0 && r <= 1)) return { level: 'bad', text: 'outside 0 to 1: check the baseline and front' };
  if (r < 0.1) return { level: 'warn', text: 'barely moved: use a more polar eluent' };
  if (r > 0.85) return { level: 'warn', text: 'runs near the front: use a less polar eluent' };
  if (r >= 0.15 && r <= 0.4) return { level: 'good', text: 'good for a flash column' };
  return { level: 'good', text: 'readable' };
}

/** Separation of two spots: ΔRf and the difference in column volumes (ΔCV ≥ 1 usually separates on a flash column). */
export function separation(r1: number, r2: number) {
  return { dRf: Math.abs(r1 - r2), dCV: Math.abs(1 / r1 - 1 / r2) };
}
