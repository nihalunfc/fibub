// Absorption and action spectra (Learn #1392). Teaching model, no DOM. Each pigment's absorption curve is drawn as
// a sum of smooth bell (Gaussian) bands placed at the usual textbook peak positions (chlorophyll a near 430 and
// 662 nm, chlorophyll b near 453 and 642 nm, carotenoids with three bands between about 420 and 480 nm). The heights
// and widths are rounded, made-up values chosen to give the familiar shapes; they are not measured spectra. The
// action spectrum (rate of photosynthesis) is modelled as the light the leaf's pigments absorb together, with
// carotenoids passing on only part of their energy, plus a small even part (0.12) because light bounces around inside
// a real leaf, so even green light is partly caught.
import { photonEV, freqFromNm } from './learnphoto.ts';

type Band = [centre: number, height: number, width: number];
export type Pigment = { id: 'a' | 'b' | 'car'; name: string; bands: Band[] };

export const PIGMENTS: Pigment[] = [
  { id: 'a', name: 'Chlorophyll a', bands: [[430, 0.85, 14], [410, 0.35, 14], [662, 0.78, 11], [615, 0.12, 16], [580, 0.04, 14]] },
  { id: 'b', name: 'Chlorophyll b', bands: [[453, 1.0, 13], [430, 0.3, 14], [642, 0.58, 11], [595, 0.08, 15]] },
  { id: 'car', name: 'Carotenoids', bands: [[425, 0.55, 11], [450, 0.85, 12], [478, 0.75, 11]] },
];
/** How much of the absorbed energy each pigment passes on to photosynthesis (rounded teaching values). */
export const SHARE = { a: 1, b: 0.9, car: 0.45 };
/** Rough amounts in a leaf relative to chlorophyll a (rounded teaching values: about 3 : 1 a to b). */
export const AMOUNT = { a: 1, b: 0.35, car: 0.3 };

/** Absorption of one pigment at a wavelength, 0 to about 1 (relative units). */
export function absorb(p: Pigment, nm: number) {
  let s = 0;
  for (const [c, h, w] of p.bands) s += h * Math.exp(-((nm - c) ** 2) / (2 * w * w));
  return s;
}
const byId = (id: Pigment['id']) => PIGMENTS.find((p) => p.id === id)!;

const LEAF = 0.12;
/** Unscaled action spectrum: absorption of the leaf's pigments mix, weighted by how much energy each passes on. */
function actionRaw(nm: number) {
  return LEAF + (['a', 'b', 'car'] as const).reduce((s, id) => s + AMOUNT[id] * SHARE[id] * absorb(byId(id), nm), 0);
}
let peak = 0;
for (let nm = 400; nm <= 700; nm += 0.5) peak = Math.max(peak, actionRaw(nm));
/** Relative rate of photosynthesis (0 to 1, the best colour = 1). */
export const action = (nm: number) => actionRaw(nm) / peak;

/** Photon energy in electronvolts and joules for a wavelength in nm. */
export function photon(nm: number) {
  const eV = photonEV(freqFromNm(nm));
  return { eV, J: eV * 1.602176634e-19, f: freqFromNm(nm) };
}

/** Colour names by wavelength band (rounded boundaries). */
export function colourName(nm: number) {
  return nm < 450 ? 'violet' : nm < 495 ? 'blue' : nm < 570 ? 'green' : nm < 590 ? 'yellow' : nm < 620 ? 'orange' : 'red';
}

/** The wavelength (whole nm, 400 to 700) where a curve is highest in a range. */
export function peakIn(f: (nm: number) => number, lo: number, hi: number) {
  let best = lo, v = -Infinity;
  for (let nm = lo; nm <= hi; nm++) { const y = f(nm); if (y > v) { v = y; best = nm; } }
  return best;
}
