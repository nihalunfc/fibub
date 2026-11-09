// Band combinations (RGB composites) and contrast stretches for satellite and drone bands. No DOM.
// Stretches work on each band by itself, from that band's own values (NaN = no data is skipped):
// min-max, percentile clip, mean ± k standard deviations, histogram equalisation, or limits you type. A gamma is
// applied afterwards. Percentiles follow numpy.percentile (linear); equalisation follows
// skimage.exposure.equalize_hist (a histogram of nbins bins between the band's minimum and maximum, its cumulative
// share, linearly interpolated at the bin centres).

export type Method = 'minmax' | 'pct' | 'sd' | 'eq' | 'manual';
export type BandStats = { n: number; min: number; max: number; mean: number; sd: number; sorted: Float64Array; sampled: boolean };
export type Stretch = { method: Method; lo: number; hi: number; centers?: Float64Array; cdf?: Float64Array };

/** Statistics of the valid (finite) values. Percentiles come from up to maxSample values evenly spread through the band. */
export function bandStats(b: ArrayLike<number>, maxSample = 4e6): BandStats {
  let n = 0, s = 0, mn = Infinity, mx = -Infinity;
  for (let i = 0; i < b.length; i++) { const v = b[i]; if (v === v && v !== Infinity && v !== -Infinity) { n++; s += v; if (v < mn) mn = v; if (v > mx) mx = v; } }
  const mean = n ? s / n : NaN;
  let ss = 0;
  for (let i = 0; i < b.length; i++) { const v = b[i]; if (Number.isFinite(v)) ss += (v - mean) ** 2; }
  const step = Math.max(1, Math.ceil(b.length / maxSample)), tmp: number[] = [];
  for (let i = 0; i < b.length; i += step) { const v = b[i]; if (Number.isFinite(v)) tmp.push(v); }
  const sorted = Float64Array.from(tmp).sort();
  return { n, min: n ? mn : NaN, max: n ? mx : NaN, mean, sd: n ? Math.sqrt(ss / n) : NaN, sorted, sampled: step > 1 };
}

/** numpy.percentile with linear interpolation, p from 0 to 100, on sorted values. */
export function percentile(sorted: ArrayLike<number>, p: number) {
  const n = sorted.length; if (!n) return NaN;
  const h = (p / 100) * (n - 1), i = Math.floor(h), f = h - i;
  return i + 1 < n ? sorted[i] + f * (sorted[i + 1] - sorted[i]) : sorted[n - 1];
}

/** Histogram of nbins equal bins from lo to hi (numpy.histogram: the last bin includes hi). */
export function histogram(b: ArrayLike<number>, lo: number, hi: number, nbins: number) {
  const counts = new Float64Array(nbins), w = (hi - lo) / nbins;
  for (let i = 0; i < b.length; i++) {
    const v = b[i]; if (!Number.isFinite(v) || v < lo || v > hi) continue;
    let k = w > 0 ? Math.floor((v - lo) / w) : 0; if (k >= nbins) k = nbins - 1;
    counts[k]++;
  }
  const centers = Float64Array.from({ length: nbins }, (_, k) => lo + (k + 0.5) * w);
  return { counts, centers };
}

export type StretchOpts = { lowPct?: number; highPct?: number; k?: number; nbins?: number; lo?: number; hi?: number };

/** Works out a band's stretch. */
export function makeStretch(b: ArrayLike<number>, st: BandStats, method: Method, o: StretchOpts = {}): Stretch {
  if (method === 'minmax') return { method, lo: st.min, hi: st.max };
  if (method === 'pct') return { method, lo: percentile(st.sorted, o.lowPct ?? 2), hi: percentile(st.sorted, o.highPct ?? 98) };
  if (method === 'sd') { const k = o.k ?? 2; return { method, lo: st.mean - k * st.sd, hi: st.mean + k * st.sd }; }
  if (method === 'manual') return { method, lo: o.lo ?? st.min, hi: o.hi ?? st.max };
  // Equalisation (skimage.exposure.equalize_hist).
  const nb = o.nbins ?? 256, h = histogram(b, st.min, st.max, nb), cdf = new Float64Array(nb);
  let c = 0; for (let k = 0; k < nb; k++) { c += h.counts[k]; cdf[k] = c; }
  for (let k = 0; k < nb; k++) cdf[k] /= c || 1;
  return { method, lo: st.min, hi: st.max, centers: h.centers, cdf };
}

/** A value mapped to 0..1 by the stretch (clipped), NaN for no data. */
export function stretchValue(v: number, s: Stretch) {
  if (!Number.isFinite(v)) return NaN;
  if (s.method === 'eq') {
    const x = s.centers!, y = s.cdf!, n = x.length;
    if (v <= x[0]) return y[0];
    if (v >= x[n - 1]) return y[n - 1];
    const w = x[1] - x[0]; let k = Math.min(n - 2, Math.max(0, Math.floor((v - x[0]) / w)));
    while (k > 0 && v < x[k]) k--; while (k < n - 2 && v > x[k + 1]) k++;
    return y[k] + ((v - x[k]) * (y[k + 1] - y[k])) / (x[k + 1] - x[k]);
  }
  if (!(s.hi > s.lo)) return v >= s.hi ? 1 : 0;
  const t = (v - s.lo) / (s.hi - s.lo);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** Gamma: out = t^(1/gamma), so gamma above 1 brightens the mid-tones (as in most GIS programs). */
export const applyGamma = (t: number, gamma: number) => (gamma === 1 || !Number.isFinite(t) ? t : t ** (1 / gamma));
/** 0..1 to a display level 0..255. */
export const toByte = (t: number) => Math.round(Math.max(0, Math.min(1, t)) * 255);

/**
 * The composite as RGBA, sampling every step-th pixel (step 1 = full size). Pixels with no data in any of the three
 * bands are transparent.
 */
export function composite(rgb: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>], W: number, H: number, s: [Stretch, Stretch, Stretch], gamma = 1, step = 1) {
  const dw = Math.ceil(W / step), dh = Math.ceil(H / step), out = new Uint8ClampedArray(dw * dh * 4);
  // Lookup tables are not possible for floats; each value goes through stretchValue.
  for (let y = 0; y < dh; y++) for (let x = 0; x < dw; x++) {
    const i = y * step * W + x * step, o = (y * dw + x) * 4;
    let ok = true;
    for (let c = 0; c < 3; c++) { const t = applyGamma(stretchValue(rgb[c][i], s[c]), gamma); if (!Number.isFinite(t)) { ok = false; break; } out[o + c] = toByte(t); }
    out[o + 3] = ok ? 255 : 0;
    if (!ok) out[o] = out[o + 1] = out[o + 2] = 0;
  }
  return { width: dw, height: dh, data: out };
}

// ---------- Common band combinations (general knowledge) ----------
export type Role = 'blue' | 'green' | 'red' | 'nir' | 'swir1' | 'swir2';
export const ROLES: Role[] = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
export const PRESETS: { id: string; name: string; rgb: [Role, Role, Role]; note: string }[] = [
  { id: 'true', name: 'True colour (red, green, blue)', rgb: ['red', 'green', 'blue'], note: 'Close to what the eye sees.' },
  { id: 'cir', name: 'Colour infrared (NIR, red, green)', rgb: ['nir', 'red', 'green'], note: 'Healthy plants show bright red; water dark; towns blue-grey.' },
  { id: 'swir', name: 'Shortwave infrared (SWIR2, NIR, red)', rgb: ['swir2', 'nir', 'red'], note: 'Burned ground shows red-brown; plants green; sees through thin haze.' },
  { id: 'agri', name: 'Agriculture (SWIR1, NIR, blue)', rgb: ['swir1', 'nir', 'blue'], note: 'Crops bright green; bare soil mauve.' },
  { id: 'land', name: 'Land and water (NIR, SWIR1, red)', rgb: ['nir', 'swir1', 'red'], note: 'Water dark blue to black; land in browns and greens.' },
];
// Band numbers by sensor, for guessing roles from file names such as T33UUP_..._B04.jp2.tif or LC09_..._B5.TIF.
export const SENSOR_BANDS: Record<string, Record<Role, number>> = {
  s2: { blue: 2, green: 3, red: 4, nir: 8, swir1: 11, swir2: 12 },
  l89: { blue: 2, green: 3, red: 4, nir: 5, swir1: 6, swir2: 7 },
};

/** Which band (index) plays each role, guessed from band labels: words first, then band numbers for a sensor. */
export function guessRoles(labels: string[], sensor = ''): Partial<Record<Role, number>> {
  const out: Partial<Record<Role, number>> = {};
  const words: Record<Role, RegExp> = { blue: /\bblue\b/i, green: /\bgreen\b/i, red: /\bred\b(?!\s*edge)/i, nir: /\bnir\b|near[ -]?infra/i, swir1: /\bswir\s*-?1\b/i, swir2: /\bswir\s*-?2\b/i };
  for (const r of ROLES) { const k = labels.findIndex((l) => words[r].test(l)); if (k >= 0) out[r] = k; }
  const nums = SENSOR_BANDS[sensor];
  if (nums) for (const r of ROLES) if (out[r] === undefined) {
    const re = new RegExp(`(?:^|[^A-Za-z0-9])B(?:and)?[ _]?0?${nums[r]}(?![0-9A-Za-z])`, 'i');
    const k = labels.findIndex((l) => re.test(l)); if (k >= 0) out[r] = k;
  }
  return out;
}

/** Pixel to map coordinates (centre of the pixel) from a GeoTIFF pixel scale and tie point. */
export function pixelToMap(col: number, row: number, scale?: [number, number], tie?: [number, number, number, number]) {
  if (!scale || !tie) return null;
  return { x: tie[2] + (col + 0.5 - tie[0]) * scale[0], y: tie[3] - (row + 0.5 - tie[1]) * scale[1] };
}

// ---------- Example scene: made up, six bands of reflectance ----------
/** A made-up 240 × 180 scene: lake, river, forest, crops of varied vigour, bare fields, a town and a burn scar. */
export function exampleScene() {
  const W = 240, H = 180, n = W * H;
  let seed = 9871; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  // blue, green, red, NIR, SWIR1, SWIR2 reflectance (made up, roughly typical shapes).
  const C: Record<string, number[]> = {
    water: [0.07, 0.06, 0.035, 0.015, 0.01, 0.005], forest: [0.025, 0.05, 0.028, 0.3, 0.14, 0.06], crop: [0.04, 0.085, 0.05, 0.42, 0.21, 0.09],
    soil: [0.09, 0.13, 0.19, 0.27, 0.36, 0.31], town: [0.11, 0.125, 0.14, 0.19, 0.25, 0.22], burn: [0.045, 0.05, 0.07, 0.11, 0.21, 0.26],
  };
  const bands = C.water.map(() => new Float32Array(n)), cover = new Uint8Array(n), kinds = Object.keys(C);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x + 6 * Math.sin(y / 10), w = y + 5 * Math.sin(x / 13);
    let t = 'crop';
    const river = Math.abs(y - (110 + 25 * Math.sin(x / 30))) < 3.2;
    if (((u - 60) / 40) ** 2 + ((w - 50) / 28) ** 2 < 1 || river) t = 'water';
    else if ((u - 175) ** 2 + (w - 140) ** 2 < 24 ** 2) t = 'burn';
    else if (u < 110 && w > 120) t = 'forest';
    else if (u > 175 && w < 70) t = 'town';
    else if (u > 115 && (Math.floor(u / 28) + Math.floor(w / 32)) % 2 === 0) t = 'soil';
    const i = y * W + x, v = C[t];
    const field = Math.floor(u / 28) * 7 + Math.floor(w / 32), vig = t === 'crop' || t === 'forest' ? 0.7 + 0.6 * ((field * 0.618) % 1) : 1;
    // A little haze adds to blue more than to longer wavelengths.
    const haze = 0.015 * (1 + Math.sin(x / 50));
    for (let b = 0; b < 6; b++) { const g = b === 3 ? vig : b === 2 ? 1 / vig : 1; bands[b][i] = Math.max(0.001, v[b] * g * (1 + 0.12 * (rnd() - 0.5)) + haze * [1, 0.6, 0.35, 0.1, 0.03, 0.01][b]); }
    cover[i] = kinds.indexOf(t);
  }
  return { width: W, height: H, bands, labels: ['Blue', 'Green', 'Red', 'NIR', 'SWIR1', 'SWIR2'], cover, kinds };
}
