// Spectral indices from reflectance bands, statistics, thresholds and pixel areas. No DOM.

export type BandName = 'blue' | 'green' | 'red' | 'nir' | 'swir1' | 'swir2';
export type IndexDef = { id: string; name: string; needs: BandName[]; formula: string; f: (b: Record<BandName, number>, L: number) => number };

const nd = (a: number, b: number) => (a + b !== 0 ? (a - b) / (a + b) : NaN);

/** The indices offered, with the bands each needs and the formula as shown to people. */
export const INDICES: IndexDef[] = [
  { id: 'ndvi', name: 'NDVI (vegetation)', needs: ['nir', 'red'], formula: '(NIR − Red) ÷ (NIR + Red)', f: (b) => nd(b.nir, b.red) },
  { id: 'evi', name: 'EVI (vegetation, less saturation)', needs: ['nir', 'red', 'blue'], formula: '2.5 × (NIR − Red) ÷ (NIR + 6 Red − 7.5 Blue + 1)', f: (b) => { const d = b.nir + 6 * b.red - 7.5 * b.blue + 1; return d !== 0 ? (2.5 * (b.nir - b.red)) / d : NaN; } },
  { id: 'savi', name: 'SAVI (vegetation on bright soil)', needs: ['nir', 'red'], formula: '(1 + L) × (NIR − Red) ÷ (NIR + Red + L)', f: (b, L) => { const d = b.nir + b.red + L; return d !== 0 ? ((1 + L) * (b.nir - b.red)) / d : NaN; } },
  { id: 'ndwi', name: 'NDWI (open water)', needs: ['green', 'nir'], formula: '(Green − NIR) ÷ (Green + NIR)', f: (b) => nd(b.green, b.nir) },
  { id: 'mndwi', name: 'MNDWI (water near towns)', needs: ['green', 'swir1'], formula: '(Green − SWIR1) ÷ (Green + SWIR1)', f: (b) => nd(b.green, b.swir1) },
  { id: 'nbr', name: 'NBR (burned areas)', needs: ['nir', 'swir2'], formula: '(NIR − SWIR2) ÷ (NIR + SWIR2)', f: (b) => nd(b.nir, b.swir2) },
  { id: 'ndbi', name: 'NDBI (built-up land)', needs: ['swir1', 'nir'], formula: '(SWIR1 − NIR) ÷ (SWIR1 + NIR)', f: (b) => nd(b.swir1, b.nir) },
];

/**
 * Computes an index for every pixel. bands maps a band name to its pixel array (already scaled to reflectance by
 * scale × DN + offset, done here). Pixels with any missing input (NaN) give NaN.
 */
export function computeIndex(def: IndexDef | 'custom', bands: Partial<Record<BandName | 'a' | 'b', Float32Array>>, n: number, scale = 1, offset = 0, L = 0.5) {
  const out = new Float32Array(n);
  const tmp = { blue: 0, green: 0, red: 0, nir: 0, swir1: 0, swir2: 0 } as Record<BandName, number>;
  if (def === 'custom') {
    const A = bands.a!, B = bands.b!;
    for (let i = 0; i < n; i++) out[i] = nd(A[i] * scale + offset, B[i] * scale + offset);
    return out;
  }
  const arrs = def.needs.map((k) => [k, bands[k]!] as const);
  for (let i = 0; i < n; i++) {
    let bad = false;
    for (const [k, a] of arrs) { const v = a[i] * scale + offset; if (!Number.isFinite(v)) { bad = true; break; } tmp[k] = v; }
    out[i] = bad ? NaN : def.f(tmp, L);
  }
  return out;
}

/** Count, min, max, mean, standard deviation, median and percentiles of the finite values. */
export function stats(v: Float32Array) {
  const f: number[] = [];
  for (let i = 0; i < v.length; i++) if (Number.isFinite(v[i])) f.push(v[i]);
  if (!f.length) return { n: 0, min: NaN, max: NaN, mean: NaN, sd: NaN, median: NaN, p2: NaN, p98: NaN };
  f.sort((a, b) => a - b);
  const n = f.length, mean = f.reduce((s, x) => s + x, 0) / n, sd = Math.sqrt(f.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(1, n - 1));
  const q = (p: number) => { const h = (n - 1) * p, lo = Math.floor(h); return f[lo] + (h - lo) * ((f[Math.min(n - 1, lo + 1)] ?? f[lo]) - f[lo]); };
  return { n, min: f[0], max: f[n - 1], mean, sd, median: q(0.5), p2: q(0.02), p98: q(0.98) };
}

/** Histogram of finite values between lo and hi in `bins` equal bins. */
export function histogram(v: Float32Array, lo: number, hi: number, bins = 50) {
  const c = new Array<number>(bins).fill(0), w = (hi - lo) / bins;
  for (let i = 0; i < v.length; i++) { const x = v[i]; if (!Number.isFinite(x) || x < lo || x > hi) continue; c[Math.min(bins - 1, Math.floor((x - lo) / w))]++; }
  return c.map((count, k) => ({ x: lo + (k + 0.5) * w, count }));
}

/** Pixels above (or below) a threshold, as a count and a share of the valid pixels. */
export function threshold(v: Float32Array, t: number, above = true) {
  let k = 0, n = 0;
  for (let i = 0; i < v.length; i++) { const x = v[i]; if (!Number.isFinite(x)) continue; n++; if (above ? x > t : x < t) k++; }
  return { count: k, valid: n, share: n ? k / n : NaN };
}

/**
 * Area of each pixel row in m². Projected (model type 1) in metres: sx × sy. Geographic (model type 2) in degrees:
 * the cell's area on a sphere of radius R between its two latitudes. Otherwise undefined.
 */
export function rowAreas(height: number, geo: { model?: number; scale?: [number, number]; tie?: [number, number, number, number]; linearUnit?: number }, R = 6371008.8) {
  if (!geo.scale) return null;
  const [sx, sy] = geo.scale;
  if (geo.model === 1 && (geo.linearUnit === undefined || geo.linearUnit === 9001)) return new Array<number>(height).fill(Math.abs(sx * sy));
  if (geo.model === 2 && geo.tie) {
    const [, j0, , lat0] = geo.tie, D = Math.PI / 180;
    return Array.from({ length: height }, (_, r) => { const top = lat0 - (r - j0) * sy, bot = top - sy; return Math.abs(R * R * sx * D * (Math.sin(top * D) - Math.sin(bot * D))); });
  }
  return null;
}
