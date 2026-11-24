// Spectral index calculator: the identities and the scaling behaviour of the index set
// (src/lib/sci/spectral.ts). The per-pixel formulas themselves are pinned in tests/sci.mjs.
// Added with src/blog/discoveries/spectral-index-correlations-wetland-sentinel-2.md.
import { INDICES, computeIndex, stats } from '../../src/lib/sci/spectral.ts';

export default async (check) => {
  const def = (id) => INDICES.find((d) => d.id === id);
  const N = 2000, names = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
  let seed = 7; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const bands = Object.fromEntries(names.map(() => 0).map((_, i) => [names[i], Float32Array.from({ length: N }, () => 0.01 + 0.5 * rnd())]));

  // GNDVI (the tool's custom normalised difference, band a = NIR, band b = green) is minus NDWI, pixel by pixel.
  const ndwi = computeIndex(def('ndwi'), bands, N);
  const gndvi = computeIndex('custom', { a: bands.nir, b: bands.green }, N);
  let worst = 0;
  for (let i = 0; i < N; i++) worst = Math.max(worst, Math.abs(gndvi[i] + ndwi[i]));
  check('spectral: custom NIR-green equals minus NDWI exactly (GNDVI = -NDWI)', worst === 0);

  // Normalised differences do not care about the reflectance scale; EVI does, because of the +1 in its denominator.
  const DN = Object.fromEntries(names.map((b) => [b, Float32Array.from(bands[b], (v) => v * 10000)]));
  const same = ['ndvi', 'ndwi', 'mndwi', 'nbr', 'ndbi'].every((id) => {
    const a = computeIndex(def(id), bands, N), b = computeIndex(def(id), DN, N);
    for (let i = 0; i < N; i++) if (Math.abs(a[i] - b[i]) > 1e-6) return false;
    return true;
  });
  check('spectral: normalised differences are unchanged by a x10000 band scale', same);
  // A plausible vegetation pixel: EVI is in range as reflectance and far out of range as digital numbers.
  const veg = { blue: 0.03, green: 0.07, red: 0.05, nir: 0.35, swir1: 0.18, swir2: 0.09 };
  const one = (o, f) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Float32Array.of(v * f)]));
  const e1 = computeIndex(def('evi'), one(veg, 1), 1)[0], e2 = computeIndex(def('evi'), one(veg, 10000), 1)[0];
  check(`spectral: EVI from unscaled digital numbers leaves -1..1 (${e1.toFixed(3)} becomes ${e2.toFixed(2)})`, Math.abs(e1) < 1 && e2 > 1 && Math.abs(e2 - 2.5 * 0.3 / (0.35 + 6 * 0.05 - 7.5 * 0.03 + 1e-4)) < 1e-3);
  // SAVI with L = 0.5 is 1.5 x NDVI x s / (s + 0.5) with s = NIR + Red, pixel by pixel.
  const ndvi = computeIndex(def('ndvi'), bands, N), savi = computeIndex(def('savi'), bands, N, 1, 0, 0.5);
  let worstS = 0;
  for (let i = 0; i < N; i++) { const s = bands.nir[i] + bands.red[i]; worstS = Math.max(worstS, Math.abs(savi[i] - (1.5 * ndvi[i] * s) / (s + 0.5))); }
  check('spectral: SAVI(L=0.5) = 1.5 x NDVI x s / (s + 0.5)', worstS < 1e-6);
  // SAVI with L = 0 is NDVI.
  const savi0 = computeIndex(def('savi'), bands, N, 1, 0, 0);
  let worst0 = 0;
  for (let i = 0; i < N; i++) worst0 = Math.max(worst0, Math.abs(savi0[i] - ndvi[i]));
  check('spectral: SAVI with L = 0 is NDVI', worst0 < 1e-6);
};
