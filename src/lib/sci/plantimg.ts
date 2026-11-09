// Shared pixel maths for fibub's plant, fungus, reef and forest photo tools (leaf area, stomata, leaf disease,
// spores, coral point counts, hemispherical canopy photos). Plain TypeScript, no DOM: every function takes RGBA
// pixels (4 bytes per pixel, as a canvas gives them) or a 0/1 mask, so the same code runs on the page and in the
// tests. The made-up example pictures the tools show are drawn here too, from known areas and counts.
import { mean, sd, quantileSorted, normInv } from './stats.ts';

export type Pt = [number, number];

// ---------- channels and indices (each mapped to a whole number 0..255) ----------

/** Brightness 0..255 (Rec. 601 weights, as most image programs use for grey). */
export function luminance(px: ArrayLike<number>, n: number): Uint8Array {
  const o = new Uint8Array(n);
  for (let i = 0; i < n; i++) o[i] = Math.round(0.299 * px[4 * i] + 0.587 * px[4 * i + 1] + 0.114 * px[4 * i + 2]);
  return o;
}
/** One colour channel (0 red, 1 green, 2 blue). */
export function channel(px: ArrayLike<number>, n: number, c: 0 | 1 | 2): Uint8Array {
  const o = new Uint8Array(n);
  for (let i = 0; i < n; i++) o[i] = px[4 * i + c];
  return o;
}
/** The smallest of R, G and B: high only for white or pale grey, so it parts a leaf from white paper. */
export function minChannel(px: ArrayLike<number>, n: number): Uint8Array {
  const o = new Uint8Array(n);
  for (let i = 0; i < n; i++) o[i] = Math.min(px[4 * i], px[4 * i + 1], px[4 * i + 2]);
  return o;
}
/** The largest of R, G and B (the V of HSV): low only for black, so it parts a leaf from a black cloth. */
export function maxChannel(px: ArrayLike<number>, n: number): Uint8Array {
  const o = new Uint8Array(n);
  for (let i = 0; i < n; i++) o[i] = Math.max(px[4 * i], px[4 * i + 1], px[4 * i + 2]);
  return o;
}
/** Excess green ExG = 2g − r − b on chromatic coordinates (r = R/(R+G+B) and so on), Woebbecke et al. 1995.
 * ExG runs from −1 to 2; it is stored as round((ExG + 1) / 3 × 255). Black pixels count as grey (ExG 0). */
export function exg(px: ArrayLike<number>, n: number): Uint8Array {
  const o = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const R = px[4 * i], G = px[4 * i + 1], B = px[4 * i + 2], s = R + G + B;
    const e = s > 0 ? (2 * G - R - B) / s : 0;
    o[i] = Math.round(((e + 1) / 3) * 255);
  }
  return o;
}
export const exgByte = (e: number) => Math.round(((e + 1) / 3) * 255);
export const exgValue = (b: number) => (b / 255) * 3 - 1;

/** Hue (degrees 0..360), saturation and value (0..1), as in HSV. */
export function hsv(r: number, g: number, b: number): [number, number, number] {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d > 0) {
    if (mx === r) h = 60 * (((g - b) / d) % 6);
    else if (mx === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
  }
  return [h, mx > 0 ? d / mx : 0, mx / 255];
}

// ---------- histogram and Otsu ----------

/** Counts of each value 0..255, only where mask is 1 when a mask is given. */
export function histogram(v: ArrayLike<number>, mask?: ArrayLike<number>): number[] {
  const h = new Array(256).fill(0);
  for (let i = 0; i < v.length; i++) if (!mask || mask[i]) h[v[i]]++;
  return h;
}
/** Otsu's threshold (Otsu 1979): the value t that best splits the histogram into two classes, values ≤ t and
 * values > t, by making the variance between the classes largest. Same convention as scikit-image's
 * threshold_otsu (foreground is image > t). Returns −1 when every value is the same. */
export function otsu(h: number[]): number {
  let lo = 0, hi = 255;
  while (lo < 256 && !h[lo]) lo++;
  while (hi >= 0 && !h[hi]) hi--;
  if (lo >= hi) return -1;
  let total = 0, sum = 0;
  for (let i = lo; i <= hi; i++) { total += h[i]; sum += i * h[i]; }
  let w0 = 0, s0 = 0, best = -1, bt = lo;
  for (let t = lo; t < hi; t++) {
    w0 += h[t]; s0 += t * h[t];
    const w1 = total - w0;
    if (!w0 || !w1) continue;
    const m0 = s0 / w0, m1 = (sum - s0) / w1, v = w0 * w1 * (m0 - m1) ** 2;
    if (v > best) { best = v; bt = t; }
  }
  return bt;
}
/** 1 where v > t (or v ≤ t when below is true), only inside the mask when one is given. */
export function threshold(v: ArrayLike<number>, t: number, below = false, inside?: ArrayLike<number>): Uint8Array {
  const o = new Uint8Array(v.length);
  for (let i = 0; i < v.length; i++) o[i] = (!inside || inside[i]) && (below ? v[i] <= t : v[i] > t) ? 1 : 0;
  return o;
}
export const countOnes = (m: ArrayLike<number>) => { let s = 0; for (let i = 0; i < m.length; i++) s += m[i] ? 1 : 0; return s; };

// ---------- connected components ----------

export type Labels = { lab: Int32Array; n: number };
/** Label the connected groups of 1s in a mask (4- or 8-connected). Labels run 1..n in the order a raster scan
 * (left to right, top to bottom) first meets each group, as scipy.ndimage.label numbers them. */
export function label(mask: ArrayLike<number>, w: number, h: number, conn: 4 | 8 = 8): Labels {
  const lab = new Int32Array(w * h), parent: number[] = [0];
  const find = (a: number) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
  const unite = (a: number, b: number) => { a = find(a); b = find(b); if (a !== b) { if (a < b) parent[b] = a; else parent[a] = b; } return Math.min(a, b); };
  let next = 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (!mask[i]) continue;
    let l = 0;
    const look = (j: number) => { const m = lab[j]; if (m) l = l ? unite(l, m) : find(m); };
    if (x > 0) look(i - 1);
    if (y > 0) {
      look(i - w);
      if (conn === 8) { if (x > 0) look(i - w - 1); if (x < w - 1) look(i - w + 1); }
    }
    if (!l) { l = next++; parent.push(l); }
    lab[i] = l;
  }
  const map = new Int32Array(next);
  let n = 0;
  for (let i = 0; i < w * h; i++) {
    const l = lab[i];
    if (!l) continue;
    const r = find(l);
    if (!map[r]) map[r] = ++n;
    lab[i] = map[r];
  }
  return { lab, n };
}

export type Region = {
  id: number; area: number; cx: number; cy: number; x0: number; y0: number; x1: number; y1: number; edge: boolean;
  /** Full lengths of the ellipse with the same second moments (as scikit-image's axis_major_length). */
  major: number; minor: number; /** Angle of the long axis, degrees, counter-clockwise from the x axis with y down. */ angle: number;
};
/** Size, centre, box and moment ellipse of every labelled group. */
export function regions(L: Labels, w: number, h: number): Region[] {
  const n = L.n, a = new Float64Array(n + 1), sx = new Float64Array(n + 1), sy = new Float64Array(n + 1);
  const sxx = new Float64Array(n + 1), syy = new Float64Array(n + 1), sxy = new Float64Array(n + 1);
  const x0 = new Int32Array(n + 1).fill(w), y0 = new Int32Array(n + 1).fill(h), x1 = new Int32Array(n + 1).fill(-1), y1 = new Int32Array(n + 1).fill(-1);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const l = L.lab[y * w + x];
    if (!l) continue;
    a[l]++; sx[l] += x; sy[l] += y; sxx[l] += x * x; syy[l] += y * y; sxy[l] += x * y;
    if (x < x0[l]) x0[l] = x; if (x > x1[l]) x1[l] = x; if (y < y0[l]) y0[l] = y; if (y > y1[l]) y1[l] = y;
  }
  const out: Region[] = [];
  for (let l = 1; l <= n; l++) {
    const cx = sx[l] / a[l], cy = sy[l] / a[l];
    const vxx = sxx[l] / a[l] - cx * cx, vyy = syy[l] / a[l] - cy * cy, vxy = sxy[l] / a[l] - cx * cy;
    const m = (vxx + vyy) / 2, d = Math.sqrt(((vxx - vyy) / 2) ** 2 + vxy * vxy);
    out.push({
      id: l, area: a[l], cx, cy, x0: x0[l], y0: y0[l], x1: x1[l], y1: y1[l],
      edge: x0[l] === 0 || y0[l] === 0 || x1[l] === w - 1 || y1[l] === h - 1,
      major: 4 * Math.sqrt(Math.max(0, m + d)), minor: 4 * Math.sqrt(Math.max(0, m - d)),
      angle: (-0.5 * Math.atan2(2 * vxy, vxx - vyy) * 180) / Math.PI,
    });
  }
  return out;
}
/** Fill the holes in a mask: background not joined (4-connected) to the picture's edge becomes foreground,
 * as scipy.ndimage.binary_fill_holes does. */
export function fillHoles(mask: ArrayLike<number>, w: number, h: number): Uint8Array {
  const inv = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) inv[i] = mask[i] ? 0 : 1;
  const L = label(inv, w, h, 4), outside = new Uint8Array(L.n + 1);
  for (let x = 0; x < w; x++) { outside[L.lab[x]] = 1; outside[L.lab[(h - 1) * w + x]] = 1; }
  for (let y = 0; y < h; y++) { outside[L.lab[y * w]] = 1; outside[L.lab[y * w + w - 1]] = 1; }
  const o = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) o[i] = mask[i] || (L.lab[i] && !outside[L.lab[i]]) ? 1 : 0;
  return o;
}

// ---------- scale ----------

export const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
/** Pixels per unit from two taps at the ends of a scale bar of known length. */
export const pxPerUnit = (a: Pt, b: Pt, length: number) => dist(a, b) / length;

// ---------- leaf area and canopy cover ----------

export type LeafResult = { lab: Int32Array; regions: Region[]; leaves: Region[]; ref: Region | null; unitPerPx2: number; total: number };
/** Leaf area from a mask of everything that is not background. With a reference square of known side, the group
 * under the tap is the square and every other group of at least minPx pixels is a leaf; area per pixel is
 * side² / square pixels. With a scale bar, area per pixel is 1 / pxPerUnit². */
export function leafArea(mask: Uint8Array, w: number, h: number, opt: { refAt?: Pt; side?: number; pxPerUnit?: number; minPx: number; fill: boolean }): LeafResult | string {
  const m = opt.fill ? fillHoles(mask, w, h) : mask;
  const L = label(m, w, h, 8), R = regions(L, w, h);
  let ref: Region | null = null, upp: number;
  if (opt.refAt) {
    const [x, y] = opt.refAt, l = L.lab[Math.round(y) * w + Math.round(x)];
    if (!l) return 'The tap on the reference square landed on the background. Tap inside the square.';
    ref = R[l - 1];
    if (!(opt.side! > 0)) return 'Give the side of the reference square.';
    upp = (opt.side! * opt.side!) / ref.area;
  } else if (opt.pxPerUnit && opt.pxPerUnit > 0) upp = 1 / (opt.pxPerUnit * opt.pxPerUnit);
  else return 'Set the scale: tap the reference square or draw the scale line.';
  const leaves = R.filter((r) => r !== ref && r.area >= opt.minPx);
  return { lab: L.lab, regions: R, leaves, ref, unitPerPx2: upp, total: leaves.reduce((s, r) => s + r.area, 0) * upp };
}

// ---------- leaf disease ----------

export type Severity = { cls: Uint8Array; leaf: number; lesion: number; healthy: number; pct: number; spots: number; leafT: number };
/** Sort every pixel into background (0), healthy leaf (1) or lesion (2). The leaf is parted from a light
 * background by the smallest channel (≤ leafT is leaf) or from a dark one by the largest (> leafT is leaf);
 * leafT < 0 means Otsu's threshold. Inside the leaf, a pixel is healthy when its hue lies from hueLo to hueHi
 * and its saturation is at least sMin; anything else (yellow, brown, black, grey) is lesion. */
export function severity(px: ArrayLike<number>, w: number, h: number, o: { bg: 'light' | 'dark'; leafT: number; hueLo: number; hueHi: number; sMin: number; fill: boolean; minSpot: number }): Severity {
  const n = w * h, v = o.bg === 'light' ? minChannel(px, n) : maxChannel(px, n);
  const t = o.leafT >= 0 ? o.leafT : otsu(histogram(v));
  let leaf = threshold(v, t, o.bg === 'light');
  if (o.fill) leaf = fillHoles(leaf, w, h);
  const cls = new Uint8Array(n), les = new Uint8Array(n);
  let nl = 0, nd = 0;
  for (let i = 0; i < n; i++) {
    if (!leaf[i]) continue;
    nl++;
    const [hu, s] = hsv(px[4 * i], px[4 * i + 1], px[4 * i + 2]);
    if (s >= o.sMin && hu >= o.hueLo && hu <= o.hueHi) cls[i] = 1;
    else { cls[i] = 2; les[i] = 1; nd++; }
  }
  const spots = regions(label(les, w, h, 8), w, h).filter((r) => r.area >= o.minSpot).length;
  return { cls, leaf: nl, lesion: nd, healthy: nl - nd, pct: nl ? (100 * nd) / nl : NaN, spots, leafT: t };
}
/** Parse a severity scale written as class upper limits in %, such as "0, 5, 10, 25, 50, 100". */
export function parseScale(s: string): number[] | string {
  const v = s.split(/[,;\s]+/).filter(Boolean).map(Number);
  if (v.length < 2 || v.some((x) => !Number.isFinite(x))) return 'Write the scale as at least two numbers, the upper limit of each class in %, such as 0, 5, 10, 25, 50, 100.';
  for (let i = 1; i < v.length; i++) if (!(v[i] > v[i - 1])) return 'The class limits must go up from left to right.';
  if (v[0] < 0 || v[v.length - 1] !== 100) return 'The limits run from 0 % or more up to exactly 100 %.';
  return v;
}
/** The class (0 = first) a severity falls in: the first class whose upper limit it does not pass. */
export function severityClass(pct: number, limits: number[]): number {
  for (let i = 0; i < limits.length; i++) if (pct <= limits[i] + 1e-9) return i;
  return limits.length - 1;
}

// ---------- stomata ----------

/** Diameter (mm) of the circular field of view: field number (mm) ÷ (objective × any extra magnification). */
export const fovDiameter = (fieldNumber: number, objective: number, extra = 1) => fieldNumber / (objective * extra);
export const circleArea = (d: number) => (Math.PI * d * d) / 4;
/** Stomatal index (Salisbury 1928): stomata as % of all epidermal cells, stomata included. */
export const stomatalIndex = (s: number, e: number) => (s + e > 0 ? (100 * s) / (s + e) : NaN);
/** Groups of the mask from minPx to maxPx pixels, as suggested stomata or spores (groups touching the edge are left out). */
export function blobs(mask: Uint8Array, w: number, h: number, minPx: number, maxPx: number, edge = false): Region[] {
  return regions(label(mask, w, h, 8), w, h).filter((r) => r.area >= minPx && r.area <= maxPx && (edge || !r.edge));
}

// ---------- spores ----------

export type Summary = { n: number; mean: number; sd: number; min: number; max: number; lo: number; hi: number };
export function summary(v: number[], mid: 'sd' | 'pct'): Summary {
  const s = [...v].sort((a, b) => a - b), m = mean(v), d = v.length > 1 ? sd(v) : 0;
  return { n: v.length, mean: m, sd: d, min: s[0], max: s[s.length - 1], lo: mid === 'sd' ? m - d : quantileSorted(s, 0.05), hi: mid === 'sd' ? m + d : quantileSorted(s, 0.95) };
}
const range = (s: Summary, dp: number) => {
  const f = (x: number) => x.toFixed(dp);
  const lo = Math.max(s.lo, s.min), hi = Math.min(s.hi, s.max);
  return `${s.min < lo ? `(${f(s.min)}–)` : ''}${f(lo)}–${f(hi)}${s.max > hi ? `(–${f(s.max)})` : ''}`;
};
export type SporeStats = { L: Summary; W: Summary; Q: Summary; text: string };
/** Spore measurements in the usual mycological form: (min–)low–high(–max) × (min–)low–high(–max) µm, with the
 * middle range either mean ± SD or the 5th to 95th percentiles; Q = length ÷ width for each spore. */
export function sporeStats(L: number[], W: number[], mid: 'sd' | 'pct', unit = 'µm'): SporeStats {
  const Q = L.map((l, i) => l / W[i]);
  const sl = summary(L, mid), sw = summary(W, mid), sq = summary(Q, mid);
  const text = `${range(sl, 1)} × ${range(sw, 1)} ${unit}; mean ${sl.mean.toFixed(1)} ± ${sl.sd.toFixed(1)} × ${sw.mean.toFixed(1)} ± ${sw.sd.toFixed(1)} ${unit}; Q = ${range(sq, 2)}, Qm = ${sq.mean.toFixed(2)} ± ${sq.sd.toFixed(2)}; n = ${L.length}`;
  return { L: sl, W: sw, Q: sq, text };
}

// ---------- coral point counts ----------

/** A small seeded random number generator (mulberry32), so the same seed gives the same points. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Points on a photo, in pixels: simple random (n points), stratified random (one random point in each cell of a
 * rows × cols grid) or a regular grid (cell centres). A border (fraction of each side) is kept clear. */
export function placePoints(mode: 'random' | 'stratified' | 'grid', w: number, h: number, o: { n: number; rows: number; cols: number; seed: number; border: number }): Pt[] {
  const r = rng(o.seed), bx = w * o.border, by = h * o.border, iw = w - 2 * bx, ih = h - 2 * by, out: Pt[] = [];
  if (mode === 'random') for (let i = 0; i < o.n; i++) out.push([bx + r() * iw, by + r() * ih]);
  else for (let j = 0; j < o.rows; j++) for (let i = 0; i < o.cols; i++) {
    const cw = iw / o.cols, ch = ih / o.rows;
    out.push(mode === 'grid' ? [bx + (i + 0.5) * cw, by + (j + 0.5) * ch] : [bx + (i + r()) * cw, by + (j + r()) * ch]);
  }
  return out;
}
/** Wilson score interval for a proportion k/n (Wilson 1927), level e.g. 0.95. */
export function wilson(k: number, n: number, level = 0.95): [number, number] {
  if (!n) return [NaN, NaN];
  const z = normInv(1 - (1 - level) / 2), p = k / n, z2 = z * z, den = 1 + z2 / n;
  const c = (p + z2 / (2 * n)) / den, half = (z / den) * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n));
  return [Math.max(0, c - half), Math.min(1, c + half)];
}
export type CoverRow = { cat: string; k: number; pct: number; lo: number; hi: number };
/** Cover per category from point labels. Categories in `skip` (shadow, tape, unknown) are left out of the total. */
export function cover(labels: (string | null)[], cats: string[], skip: string[], level = 0.95): { rows: CoverRow[]; n: number; skipped: number; unlabelled: number } {
  const used = labels.filter((l): l is string => l !== null), skipSet = new Set(skip.map((s) => s.toLowerCase()));
  const counted = used.filter((l) => !skipSet.has(l.toLowerCase())), n = counted.length;
  const rows = cats.filter((c) => !skipSet.has(c.toLowerCase())).map((cat) => {
    const k = counted.filter((l) => l === cat).length, [lo, hi] = wilson(k, n, level);
    return { cat, k, pct: n ? (100 * k) / n : NaN, lo: 100 * lo, hi: 100 * hi };
  });
  return { rows, n, skipped: used.length - n, unlabelled: labels.length - used.length };
}

// ---------- hemispherical canopy photos ----------

export type Ring = { z0: number; z1: number; zc: number; px: number; sky: number; gap: number };
export type Hemi = { rings: Ring[]; gapFraction: number; openness: number; lai: number; capped: boolean; px: number };
/** Gap fraction by zenith ring and effective LAI from a sky mask (1 = sky) of a fisheye photo with equidistant
 * projection (zenith angle = 90° × distance from the centre ÷ radius). Rings split 0 to maxZen degrees into nRings
 * equal bands. Effective LAI uses Miller's (1967) formula LAI = 2 ∫ −ln T(θ) cos θ sin θ dθ, summed over the
 * rings with weights sin θ Δθ scaled to add up to 1 (as LAI-2000 style ring sums do). A ring with no sky at all is
 * given half a pixel of sky so the logarithm stays finite (`capped`). Gap fraction is the share of sky pixels in
 * the whole circle; canopy openness weights each pixel by the solid angle it covers (sin θ / θ in this projection). */
export function hemi(sky: ArrayLike<number>, w: number, h: number, cx: number, cy: number, R: number, nRings: number, maxZen: number): Hemi {
  const rp = new Float64Array(nRings), rs = new Float64Array(nRings);
  let all = 0, allSky = 0, ow = 0, os = 0;
  const x0 = Math.max(0, Math.floor(cx - R)), x1 = Math.min(w - 1, Math.ceil(cx + R)), y0 = Math.max(0, Math.floor(cy - R)), y1 = Math.min(h - 1, Math.ceil(cy + R));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const r = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
    if (r > R) continue;
    const s = sky[y * w + x] ? 1 : 0, th = (r / R) * (Math.PI / 2), wt = th > 1e-9 ? Math.sin(th) / th : 1;
    all++; allSky += s; ow += wt; os += wt * s;
    const z = (r / R) * 90;
    if (z < maxZen) { const k = Math.min(nRings - 1, Math.floor((z / maxZen) * nRings)); rp[k]++; rs[k] += s; }
  }
  const dz = maxZen / nRings, rings: Ring[] = [];
  let lai = 0, wsum = 0, capped = false;
  for (let k = 0; k < nRings; k++) {
    const z0 = k * dz, z1 = z0 + dz, zc = (z0 + z1) / 2, gap = rp[k] ? rs[k] / rp[k] : NaN;
    rings.push({ z0, z1, zc, px: rp[k], sky: rs[k], gap });
    if (!rp[k]) continue;
    let T = gap;
    if (T <= 0) { T = 0.5 / rp[k]; capped = true; }
    const t = (zc * Math.PI) / 180, wgt = Math.sin(t) * ((dz * Math.PI) / 180);
    lai += -Math.log(T) * Math.cos(t) * wgt; wsum += wgt;
  }
  return { rings, gapFraction: all ? allSky / all : NaN, openness: ow ? os / ow : NaN, lai: wsum ? (2 * lai) / wsum : NaN, capped, px: all };
}

// ---------- made-up example pictures (all drawn from known shapes) ----------

export type Img = { px: Uint8ClampedArray; w: number; h: number };
const blank = (w: number, h: number, c: [number, number, number]): Img => {
  const px = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) { px[4 * i] = c[0]; px[4 * i + 1] = c[1]; px[4 * i + 2] = c[2]; px[4 * i + 3] = 255; }
  return { px, w, h };
};
const put = (im: Img, x: number, y: number, c: [number, number, number]) => { const i = 4 * (y * im.w + x); im.px[i] = c[0]; im.px[i + 1] = c[1]; im.px[i + 2] = c[2]; };
/** Paint every pixel whose centre is inside a rotated ellipse; returns how many pixels were painted. */
export function ellipse(im: Img, cx: number, cy: number, a: number, b: number, deg: number, c: [number, number, number]): number {
  const t = (deg * Math.PI) / 180, co = Math.cos(t), si = Math.sin(t), R = Math.max(a, b) + 1;
  let k = 0;
  for (let y = Math.max(0, Math.floor(cy - R)); y <= Math.min(im.h - 1, Math.ceil(cy + R)); y++) for (let x = Math.max(0, Math.floor(cx - R)); x <= Math.min(im.w - 1, Math.ceil(cx + R)); x++) {
    const dx = x - cx, dy = y - cy, u = dx * co + dy * si, v = -dx * si + dy * co;
    if ((u * u) / (a * a) + (v * v) / (b * b) <= 1) { put(im, x, y, c); k++; }
  }
  return k;
}
export function rect(im: Img, x0: number, y0: number, x1: number, y1: number, c: [number, number, number]) {
  for (let y = Math.max(0, y0); y < Math.min(im.h, y1); y++) for (let x = Math.max(0, x0); x < Math.min(im.w, x1); x++) put(im, x, y, c);
}
/** Add a little even noise (± amp) so the picture is not perfectly flat. */
export function noise(im: Img, amp: number, seed = 7) {
  const r = rng(seed);
  for (let i = 0; i < im.w * im.h * 4; i++) if (i % 4 !== 3) im.px[i] = im.px[i] + Math.round((r() * 2 - 1) * amp);
}

/** A made-up scan at 100 px per cm: a 1 cm black square and three leaves (one with a hole) on white paper. */
export function exampleLeaves(): Img & { leafPx: number; squarePx: number; squareAt: Pt } {
  const im = blank(800, 500, [250, 250, 248]);
  rect(im, 40, 40, 140, 140, [20, 20, 20]);
  let k = ellipse(im, 330, 250, 150, 70, 20, [52, 120, 40]);
  k += ellipse(im, 590, 160, 110, 50, -10, [70, 140, 50]);
  k += ellipse(im, 600, 380, 120, 60, 5, [60, 130, 45]);
  k -= ellipse(im, 330, 250, 20, 15, 0, [250, 250, 248]);
  noise(im, 6);
  return { ...im, leafPx: k, squarePx: 100 * 100, squareAt: [90, 90] };
}
/** A made-up downward view of a crop row: green plants on brown soil, with a known share of plant pixels. */
export function exampleCanopy(): Img & { greenPx: number } {
  const im = blank(600, 400, [120, 92, 66]), r = rng(11), mark = new Uint8Array(600 * 400);
  for (let i = 0; i < 26; i++) {
    const cx = 30 + r() * 540, cy = 30 + r() * 340, a = 25 + r() * 30, b = 15 + r() * 20, t = r() * 180, c: [number, number, number] = [60 + Math.round(r() * 30), 130 + Math.round(r() * 40), 40 + Math.round(r() * 20)];
    const tr = (t * Math.PI) / 180, co = Math.cos(tr), si = Math.sin(tr);
    for (let y = 0; y < 400; y++) for (let x = 0; x < 600; x++) { const dx = x - cx, dy = y - cy, u = dx * co + dy * si, v = -dx * si + dy * co; if ((u * u) / (a * a) + (v * v) / (b * b) <= 1) { put(im, x, y, c); mark[y * 600 + x] = 1; } }
  }
  noise(im, 8, 12);
  return { ...im, greenPx: countOnes(mark) };
}
/** A made-up leaf with brown lesions on white paper: returns the leaf and lesion pixel counts drawn. */
export function exampleDisease(): Img & { leafPx: number; lesionPx: number } {
  const im = blank(700, 440, [248, 248, 245]), mark = new Uint8Array(700 * 440);
  ellipse(im, 350, 220, 300, 160, 8, [60, 135, 50]);
  const leaf = blank(700, 440, [0, 0, 0]); ellipse(leaf, 350, 220, 300, 160, 8, [1, 1, 1]);
  const spots: [number, number, number, number][] = [[250, 180, 30, 22], [420, 260, 40, 30], [480, 160, 18, 18], [300, 290, 25, 15], [560, 230, 20, 26], [180, 240, 14, 14]];
  const sp = blank(700, 440, [0, 0, 0]);
  spots.forEach(([x, y, a, b], i) => { ellipse(im, x, y, a, b, 0, i % 2 ? [120, 80, 30] : [150, 110, 40]); ellipse(sp, x, y, a, b, 0, [1, 1, 1]); ellipse(im, x, y, a * 0.45, b * 0.45, 0, [70, 45, 25]); });
  let lp = 0, dp = 0;
  for (let i = 0; i < 700 * 440; i++) { if (leaf.px[4 * i]) { lp++; if (sp.px[4 * i]) dp++; } mark[i] = 0; }
  noise(im, 5, 21);
  return { ...im, leafPx: lp, lesionPx: dp };
}
/** A made-up epidermis at 2 px per µm (480 × 320 px = 240 × 160 µm): pale brick-shaped cells with dark walls and
 * a known number of stomata (dark ellipses), plus the centres of the cells without one. */
export function exampleStomata(): Img & { stomata: Pt[]; cells: Pt[]; pxPerUm: number } {
  const W = 480, H = 320, im = blank(W, H, [214, 222, 206]), cw = 60, ch = 40;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const row = Math.floor(y / ch), off = row % 2 ? cw / 2 : 0, xx = (x + off) % cw, yy = y % ch;
    if (xx < 2 || yy < 2) put(im, x, y, [150, 160, 140]);
  }
  const r = rng(5), stomata: Pt[] = [], cells: Pt[] = [];
  for (let row = 0; row < H / ch; row++) {
    const off = row % 2 ? cw / 2 : 0;
    for (let col = -1; col <= W / cw; col++) {
      const cx = col * cw - off + cw / 2 + 1, cy = row * ch + ch / 2 + 1;
      if (cx < 14 || cx > W - 14 || cy < 14 || cy > H - 14) continue;
      if (r() < 0.32) { ellipse(im, cx, cy, 13, 8, 0, [70, 80, 60]); ellipse(im, cx, cy, 6, 1.6, 0, [200, 205, 190]); stomata.push([cx, cy]); }
      else cells.push([cx, cy]);
    }
  }
  noise(im, 6, 9);
  return { ...im, stomata, cells, pxPerUm: 2 };
}
/** Made-up spores at 10 px per µm: dark ellipses with known lengths and widths in µm on a pale field, and a
 * 10 µm scale bar (100 px) along the bottom. */
export function exampleSpores(): Img & { L: number[]; W: number[]; pxPerUm: number; bar: [Pt, Pt] } {
  const im = blank(900, 600, [235, 232, 225]), r = rng(3), L: number[] = [], Wd: number[] = [], k = 10;
  let i = 0;
  for (let row = 0; row < 4; row++) for (let col = 0; col < 6; col++) {
    const l = 9 + r() * 3, wd = 5.2 + r() * 1.6, cx = 80 + col * 145 + (r() - 0.5) * 20, cy = 70 + row * 125 + (r() - 0.5) * 20;
    ellipse(im, cx, cy, (l * k) / 2, (wd * k) / 2, r() * 180, [95, 70, 45]);
    L.push(l); Wd.push(wd); i++;
  }
  rect(im, 760, 570, 860, 576, [0, 0, 0]);
  noise(im, 5, 4);
  return { ...im, L, W: Wd, pxPerUm: k, bar: [[760, 573], [860, 573]] };
}
export const CORAL_CATS = ['Hard coral', 'Soft coral', 'Algae', 'Sand', 'Rubble', 'Shadow or tape'];
/** A made-up reef quadrat with blocks of known category, and a function telling which category a point is on. */
export function exampleReef(variant = 0): Img & { at: (p: Pt) => string } {
  const W = 640, H = 480, im = blank(W, H, [214, 200, 160]);
  const shapes: { cat: string; c: [number, number, number]; e: [number, number, number, number] }[] = variant === 0
    ? [{ cat: 'Hard coral', c: [200, 120, 110], e: [180, 160, 130, 100] }, { cat: 'Hard coral', c: [190, 110, 100], e: [470, 330, 110, 80] }, { cat: 'Algae', c: [70, 120, 60], e: [460, 120, 140, 90] }, { cat: 'Soft coral', c: [160, 90, 170], e: [170, 380, 90, 60] }]
    : [{ cat: 'Hard coral', c: [200, 120, 110], e: [320, 240, 170, 130] }, { cat: 'Algae', c: [70, 120, 60], e: [100, 90, 90, 70] }, { cat: 'Rubble', c: [150, 150, 140], e: [540, 400, 90, 70] }];
  for (const s of shapes) ellipse(im, s.e[0], s.e[1], s.e[2], s.e[3], 0, s.c);
  rect(im, 0, 0, W, 10, [40, 40, 40]); rect(im, 0, 0, 10, H, [40, 40, 40]);
  noise(im, 6, 30 + variant);
  const at = (p: Pt) => {
    if (p[0] < 10 || p[1] < 10) return 'Shadow or tape';
    for (let i = shapes.length - 1; i >= 0; i--) { const [x, y, a, b] = shapes[i].e; if (((Math.round(p[0]) - x) / a) ** 2 + ((Math.round(p[1]) - y) / b) ** 2 <= 1) return shapes[i].cat; }
    return 'Sand';
  };
  return { ...im, at };
}
/** A made-up fisheye photo (equidistant) under a canopy whose gap fraction at zenith angle θ is
 * exp(−0.5 × LAI ÷ cos θ): spherical leaves, randomly placed. Sky is pale blue, leaves dark green. */
export function exampleFisheye(laiTrue = 2.5, size = 600): Img & { cx: number; cy: number; R: number } {
  const im = blank(size, size, [0, 0, 0]), r = rng(17), cx = size / 2, cy = size / 2, R = size / 2 - 4;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
    if (d > R) continue;
    const th = (d / R) * (Math.PI / 2), T = th < Math.PI / 2 - 1e-6 ? Math.exp((-0.5 * laiTrue) / Math.cos(th)) : 0;
    put(im, x, y, r() < T ? [170, 200, 240] : [30, 50, 25]);
  }
  noise(im, 6, 18);
  return { ...im, cx, cy, R };
}
