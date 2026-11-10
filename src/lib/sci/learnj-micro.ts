// Virtual microscope (Learn): magnification and field of view of a school compound microscope. No DOM.

/** Total magnification = eyepiece × objective. */
export const totalMag = (eyepiece: number, objective: number) => eyepiece * objective;
/** Field of view diameter (mm) = field number of the eyepiece (mm) / objective magnification. */
export const fieldOfView = (fieldNumber: number, objective: number) => fieldNumber / objective;
/** Real size = size in the image / magnification (same units). */
export const realSize = (imageSize: number, mag: number) => imageSize / mag;
/** Depth of field falls as the objective gets stronger; a rough school-level figure (µm) for the blur model. */
export const blurPx = (focus: number, best: number, objective: number) => Math.min(14, Math.abs(focus - best) * (objective >= 40 ? 0.9 : objective >= 10 ? 0.35 : 0.15));

/** Small seeded random numbers (mulberry32) so the drawn specimens stay the same while you move the slide. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Hash of two integers to a seed, for drawing tiles of a specimen on demand. */
export const tileSeed = (i: number, j: number, s = 0) => ((i * 73856093) ^ (j * 19349663) ^ (s * 83492791)) >>> 0;
