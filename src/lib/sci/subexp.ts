// Sub-exposure length for deep-sky imaging: how long each frame must be for the camera's read noise
// to add no more than a chosen share of extra noise on top of the sky (and dark) shot noise.

/** Sky signal in electrons per pixel per second from a test frame. */
export function skyFromFrame(bgAdu: number, offsetAdu: number, gainEPerAdu: number, seconds: number) {
  if (!(seconds > 0)) throw new Error('Type the test frame exposure in seconds');
  if (!(gainEPerAdu > 0)) throw new Error('Type the camera gain in electrons per ADU');
  if (!(bgAdu > offsetAdu)) throw new Error('The background must be above the offset (bias) level: measure it on an empty patch of sky');
  return ((bgAdu - offsetAdu) * gainEPerAdu) / seconds;
}

/** Rough sky signal from sky brightness (mag/arcsec²), assuming 1000 photons/s/cm²/Å at magnitude 0 (V band). */
export function skyFromSqm(o: { sqm: number; apertureMm: number; obstructionPct: number; focalMm: number; pixelUm: number; bandwidthNm: number; qe: number; throughput: number }) {
  const { sqm, apertureMm, obstructionPct, focalMm, pixelUm, bandwidthNm, qe, throughput } = o;
  if (!(apertureMm > 0 && focalMm > 0 && pixelUm > 0)) throw new Error('Type the aperture, focal length and pixel size');
  if (!(sqm > 10 && sqm < 25)) throw new Error('Sky brightness is usually 16 to 22 mag/arcsec²');
  const area = Math.PI * (apertureMm / 20) ** 2 * (1 - (Math.min(95, Math.max(0, obstructionPct)) / 100) ** 2);
  const scale = (206.265 * pixelUm) / focalMm; // arcsec per pixel
  return 1000 * 10 ** (-0.4 * sqm) * bandwidthNm * 10 * area * scale * scale * qe * throughput;
}

/** Shortest sub (s) for which read noise raises the total noise by no more than `penalty` (0.05 = 5 %). */
export function subLength(readNoise: number, skyE: number, darkE = 0, penalty = 0.05) {
  if (!(readNoise > 0)) throw new Error('Type the read noise in electrons');
  if (!(skyE > 0)) throw new Error('The sky signal must be above zero');
  return (readNoise * readNoise) / ((skyE + darkE) * ((1 + penalty) ** 2 - 1));
}

/** Signal-to-noise reached in a fixed total time with subs of length t, as a share of a single perfect exposure. */
export const efficiency = (t: number, readNoise: number, skyE: number, darkE = 0) => Math.sqrt(((skyE + darkE) * t) / ((skyE + darkE) * t + readNoise * readNoise));
