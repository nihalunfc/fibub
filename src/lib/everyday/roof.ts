// Roof pitch and area maths. Plain TypeScript, no DOM.
export const SQFT = 0.09290304; // m² per sq ft
export const DEG = 180 / Math.PI;

export type PitchKind = 'x' | 'deg' | 'pct';
/** Slope (rise ÷ run) from rise-per-12, degrees or percent. NaN when blank, negative or impossible. */
export function slopeFrom(kind: PitchKind, text: string): number {
  const t = text.trim(), v = Number(t);
  if (t === '' || !Number.isFinite(v) || v < 0) return NaN;
  if (kind === 'deg') return v >= 90 ? NaN : Math.tan(v / DEG);
  return kind === 'x' ? v / 12 : v / 100;
}
export const pitchFactor = (slope: number) => Math.sqrt(1 + slope * slope);
export const degreesOf = (slope: number) => Math.atan(slope) * DEG;

/** Footprint including overhang on every side. */
export const footprint = (len: number, wid: number, over: number) => ({ L: len + 2 * over, W: wid + 2 * over });

/** Squares (100 sq ft each), squares with waste, whole bundles. `areaSqft` is on the slope. */
export function shingles(areaSqft: number, wastePct: number, bundlesPerSquare: number) {
  const sq = areaSqft / 100, sqWaste = sq * (1 + wastePct / 100);
  return { sq, sqWaste, bundles: Math.ceil(sqWaste * bundlesPerSquare - 1e-9) };
}

/** Lengths along the roof. `W` and `L` are the footprint including overhang. Gable: two slopes meeting at a ridge along L.
 *  Hip: four slopes, ridge shortened to L - W. Shed: one slope across W. Rafter = length along the slope from eave to ridge (or high edge). */
export function lengths(shape: 'gable' | 'hip' | 'shed', W: number, L: number, slope: number) {
  const run = shape === 'shed' ? W : W / 2, f = pitchFactor(slope), rafter = run * f;
  if (shape === 'hip') return { run, rafter, ridgeHeight: run * slope, ridgeLength: Math.max(0, L - W), eaves: 2 * (L + W), rakes: 0 };
  if (shape === 'shed') return { run, rafter, ridgeHeight: run * slope, ridgeLength: L, eaves: L, rakes: 2 * rafter };
  return { run, rafter, ridgeHeight: run * slope, ridgeLength: L, eaves: 2 * L, rakes: 2 * rafter };
}

/** Typical-use note for a slope; wording is deliberately general. */
export function pitchNote(slope: number): string {
  const x = slope * 12;
  if (x < 2) return 'Under 2:12 is a low-slope (almost flat) roof: shingles are not normally used, so ask a roofer about membrane roofing.';
  if (x < 4) return 'Between 2:12 and 4:12 is a low pitch: most shingle makers want special underlayment here. Check the maker\'s instructions.';
  if (x <= 9) return 'A common pitch for shingled houses and easy to walk on.';
  if (x <= 12) return 'A steep roof: harder to walk on, so plan for roof brackets or a harness.';
  return 'Very steep (over 12:12): work from proper access gear and expect a roofer to quote extra.';
}
