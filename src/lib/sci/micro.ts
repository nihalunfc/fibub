// Shared image maths for the micrograph tools (grain size, phase fraction, particle size, lattice FFT). No DOM.
// Greyscale conversion, TIFF to RGBA, box downscaling, histograms, Otsu and multi-Otsu thresholds, hole filling,
// connected-component labelling, the exact Euclidean distance transform, a marker watershed, scale calibration and
// a small seeded random number generator for the made-up example images.
import { readTiff, readTags } from './tiff.ts';

export type Rect = { x0: number; y0: number; x1: number; y1: number }; // pixels, x1 and y1 not included
export type Img = { rgba: Uint8ClampedArray; w: number; h: number };

/** Grey level 0 to 255 from RGBA, with the Rec. 709 luma weights (as scikit-image's rgb2gray). */
export function greyFromRgba(rgba: ArrayLike<number>, w: number, h: number): Float32Array {
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = 0.2125 * rgba[4 * i] + 0.7154 * rgba[4 * i + 1] + 0.0721 * rgba[4 * i + 2];
  return g;
}

/** Average blocks of f × f pixels (f a whole number), so a big image becomes quick to work on. */
export function boxDown(img: Img, f: number): Img {
  if (f <= 1) return img;
  const w = Math.floor(img.w / f), h = Math.floor(img.h / f), out = new Uint8ClampedArray(w * h * 4), n = f * f;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let j = 0; j < f; j++) for (let i = 0; i < f; i++) { const p = 4 * ((y * f + j) * img.w + x * f + i); r += img.rgba[p]; g += img.rgba[p + 1]; b += img.rgba[p + 2]; a += img.rgba[p + 3]; }
    const o = 4 * (y * w + x); out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n; out[o + 3] = a / n;
  }
  return { rgba: out, w, h };
}

/** A TIFF micrograph as RGBA for display and analysis. 8-bit data is kept as it is; 16 and 32-bit data and floats are
 *  stretched from their lowest to highest value (the note says so). WhiteIsZero files are turned round. */
export function tiffToImg(buf: ArrayBuffer, maxSamples = 80e6): Img & { note: string } {
  const r = readTiff(buf, maxSamples), tags = readTags(buf).tags, photo = (tags.get(262)?.values as number[] | undefined)?.[0] ?? 1;
  const { width: w, height: h, bands } = r, n = w * h, out = new Uint8ClampedArray(n * 4);
  const rgb = bands.length >= 3 && photo === 2;
  const use = rgb ? bands.slice(0, 3) : [bands[0]];
  let lo = 0, hi = 255, note = '';
  if (r.bits !== 8 || r.format === 3) {
    lo = Infinity; hi = -Infinity;
    for (const b of use) for (let i = 0; i < n; i++) { const v = b[i]; if (Number.isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; } }
    if (!(hi > lo)) { hi = lo + 1; }
    note = `${r.bits}-bit data stretched from ${+lo.toPrecision(6)} (black) to ${+hi.toPrecision(6)} (white).`;
  }
  const k = 255 / (hi - lo);
  for (let i = 0; i < n; i++) {
    const v = use.map((b) => { const x = b[i]; return Number.isFinite(x) ? (x - lo) * k : 0; });
    const [R, G, B] = rgb ? v : [v[0], v[0], v[0]];
    const inv = !rgb && photo === 0;
    out[4 * i] = inv ? 255 - R : R; out[4 * i + 1] = inv ? 255 - G : G; out[4 * i + 2] = inv ? 255 - B : B; out[4 * i + 3] = 255;
  }
  return { rgba: out, w, h, note };
}

/** Histogram of grey levels rounded to whole numbers 0 to 255, inside a rectangle. */
export function hist256(g: ArrayLike<number>, w: number, r?: Rect): Float64Array {
  const hst = new Float64Array(256), R = r ?? { x0: 0, y0: 0, x1: w, y1: g.length / w };
  for (let y = R.y0; y < R.y1; y++) for (let x = R.x0; x < R.x1; x++) { const v = Math.round(g[y * w + x]); hst[v < 0 ? 0 : v > 255 ? 255 : v]++; }
  return hst;
}

/** Otsu's threshold from a 256-level histogram, worked as scikit-image does it: the grey level t that makes the
 *  biggest between-class variance, with the bright class v > t. Searches only between the lowest and highest
 *  level present. */
export function otsu(hst: ArrayLike<number>): number {
  let a = 0, b = hst.length - 1;
  while (a < b && !hst[a]) a++;
  while (b > a && !hst[b]) b--;
  if (a >= b) return a;
  let w1 = 0, s1 = 0, tot = 0, sTot = 0;
  for (let i = a; i <= b; i++) { tot += hst[i]; sTot += hst[i] * i; }
  let best = -1, t = a;
  for (let i = a; i < b; i++) {
    w1 += hst[i]; s1 += hst[i] * i;
    const w2 = tot - w1, m1 = s1 / w1, m2 = (sTot - s1) / w2, v = w1 * w2 * (m1 - m2) ** 2;
    if (v > best) { best = v; t = i; }
  }
  return t;
}

/** Between-class variance (as a fraction of the total count squared) of a split of the histogram at thresholds
 *  t1 < t2 < …, class k being t_k < v <= t_(k+1). */
export function betweenVar(hst: ArrayLike<number>, ts: number[]): number {
  let tot = 0, sTot = 0;
  for (let i = 0; i < hst.length; i++) { tot += hst[i]; sTot += hst[i] * i; }
  const mT = sTot / tot, edges = [-1, ...ts, hst.length - 1];
  let v = 0;
  for (let k = 0; k + 1 < edges.length; k++) {
    let w = 0, s = 0;
    for (let i = edges[k] + 1; i <= edges[k + 1]; i++) { w += hst[i]; s += hst[i] * i; }
    if (w > 0) v += (w / tot) * (s / w - mT) ** 2;
  }
  return v;
}

/** Multi-level Otsu: 1, 2 or 3 thresholds (2, 3 or 4 classes) by searching every split for the biggest
 *  between-class variance (the same criterion as scikit-image's threshold_multiotsu). */
export function multiOtsu(hst: ArrayLike<number>, classes: number): number[] {
  if (classes <= 2) return [otsu(hst)];
  const L = hst.length, P = new Float64Array(L + 1), S = new Float64Array(L + 1);
  for (let i = 0; i < L; i++) { P[i + 1] = P[i] + hst[i]; S[i + 1] = S[i] + hst[i] * i; }
  // Score of the class holding levels a..b (inclusive): S² / P, which the between-class variance grows with.
  const sc = (a: number, b: number) => { const p = P[b + 1] - P[a]; return p > 0 ? (S[b + 1] - S[a]) ** 2 / p : 0; };
  let lo = 0, hi = L - 1;
  while (lo < hi && !hst[lo]) lo++;
  while (hi > lo && !hst[hi]) hi--;
  let best = -1, out: number[] = [];
  if (classes === 3) {
    for (let t1 = lo; t1 < hi; t1++) for (let t2 = t1 + 1; t2 < hi; t2++) {
      const v = sc(lo, t1) + sc(t1 + 1, t2) + sc(t2 + 1, hi);
      if (v > best + 1e-9 * Math.abs(best)) { best = v; out = [t1, t2]; }
    }
  } else {
    for (let t1 = lo; t1 < hi; t1++) for (let t2 = t1 + 1; t2 < hi; t2++) {
      const a = sc(lo, t1) + sc(t1 + 1, t2);
      for (let t3 = t2 + 1; t3 < hi; t3++) {
        const v = a + sc(t2 + 1, t3) + sc(t3 + 1, hi);
        if (v > best + 1e-9 * Math.abs(best)) { best = v; out = [t1, t2, t3]; }
      }
    }
  }
  return out.length ? out : [lo];
}

/** 1 where the grey level is above t (or at or below it when dark is true), inside the rectangle; 0 elsewhere. */
export function threshold(g: ArrayLike<number>, w: number, h: number, t: number, dark: boolean, r?: Rect): Uint8Array {
  const m = new Uint8Array(w * h), R = r ?? { x0: 0, y0: 0, x1: w, y1: h };
  for (let y = R.y0; y < R.y1; y++) for (let x = R.x0; x < R.x1; x++) { const i = y * w + x, v = Math.round(g[i]); m[i] = (dark ? v <= t : v > t) ? 1 : 0; }
  return m;
}

/** Fill holes: background pixels that cannot reach the image edge through 4-connected background become 1
 *  (as scipy.ndimage.binary_fill_holes). */
export function fillHoles(m: Uint8Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(m.length).fill(1), st: number[] = [];
  const push = (i: number) => { if (!m[i] && out[i]) { out[i] = 0; st.push(i); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (st.length) {
    const i = st.pop()!, x = i % w, y = (i - x) / w;
    if (x > 0) push(i - 1); if (x < w - 1) push(i + 1); if (y > 0) push(i - w); if (y < h - 1) push(i + w);
  }
  return out;
}

/** Connected-component labels (1..n, 0 is background), 8-connected by default (4 if conn is 4). Labels are numbered
 *  in raster order of each component's first pixel, as scikit-image's label. */
export function label(m: Uint8Array, w: number, h: number, conn: 4 | 8 = 8): { lab: Int32Array; n: number } {
  const lab = new Int32Array(w * h), par: number[] = [0];
  const find = (a: number) => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
  const unite = (a: number, b: number) => { a = find(a); b = find(b); if (a !== b) { if (a < b) par[b] = a; else par[a] = b; } };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!m[i]) continue;
    const nb: number[] = [];
    if (x > 0 && lab[i - 1]) nb.push(lab[i - 1]);
    if (y > 0) {
      if (lab[i - w]) nb.push(lab[i - w]);
      if (conn === 8) { if (x > 0 && lab[i - w - 1]) nb.push(lab[i - w - 1]); if (x < w - 1 && lab[i - w + 1]) nb.push(lab[i - w + 1]); }
    }
    if (!nb.length) { const k = par.length; par.push(k); lab[i] = k; continue; }
    let mn = nb[0]; for (const b of nb) if (b < mn) mn = b;
    lab[i] = mn; for (const b of nb) unite(mn, b);
  }
  // Renumber in order of first appearance.
  const map = new Int32Array(par.length); let n = 0;
  for (let i = 0; i < lab.length; i++) if (lab[i]) { const r = find(lab[i]); if (!map[r]) map[r] = ++n; lab[i] = map[r]; }
  return { lab, n };
}

// 1-D squared distance transform (Felzenszwalb and Huttenlocher), in place on f.
function dt1(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0; v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    if (f[q] === Infinity) continue;
    if (f[v[k]] === Infinity) { v[k] = q; continue; }
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (k > 0 && s <= z[k]) { k--; s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
    k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
  }
  if (f[v[0]] === Infinity) { d.fill(Infinity, 0, n); return; }
  k = 0;
  for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) ** 2 + f[v[k]]; }
}

/** Exact Euclidean distance from every foreground pixel to the nearest background pixel in the image (0 on
 *  background), as scipy.ndimage.distance_transform_edt. An image with no background gets Infinity. */
export function edt(m: Uint8Array, w: number, h: number): Float32Array {
  const N = Math.max(w, h), f = new Float64Array(N), d = new Float64Array(N), v = new Int32Array(N), z = new Float64Array(N + 1);
  const g = new Float64Array(w * h);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = m[y * w + x] ? Infinity : 0;
    dt1(f, h, d, v, z);
    for (let y = 0; y < h; y++) g[y * w + x] = d[y];
  }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = g[y * w + x];
    dt1(f, w, d, v, z);
    for (let x = 0; x < w; x++) out[y * w + x] = Math.sqrt(d[x]);
  }
  return out;
}

const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
/** Marker watershed on a height map: grows each marker label over the mask in order of height (lowest first,
 *  ties by arrival), 4-connected, as scikit-image's watershed with a mask (connectivity 1). Unreached mask pixels
 *  stay 0. */
export function watershed(height: ArrayLike<number>, markers: Int32Array, mask: Uint8Array, w: number, h: number): Int32Array {
  const out = new Int32Array(markers), heap: [number, number, number][] = []; let age = 0;
  const less = (a: [number, number, number], b: [number, number, number]) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
  const push = (e: [number, number, number]) => { heap.push(e); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (less(heap[i], heap[p])) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } else break; } };
  const pop = () => { const top = heap[0], last = heap.pop()!; if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let s = i; if (l < heap.length && less(heap[l], heap[s])) s = l; if (r < heap.length && less(heap[r], heap[s])) s = r; if (s === i) break; [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; } } return top; };
  for (let i = 0; i < out.length; i++) if (out[i]) push([height[i], age++, i]);
  while (heap.length) {
    const [, , i] = pop(), x = i % w, y = (i - x) / w;
    for (const [dx, dy] of N4) {
      const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
      const j = yy * w + xx; if (!mask[j] || out[j]) continue;
      out[j] = out[i]; push([height[j], age++, j]);
    }
  }
  return out;
}

/** Peaks of the distance map for splitting touching particles: pixels that are the highest within a radius r and
 *  stand at least h above the saddle to any higher peak (an h-maxima test), merged when they touch. Returns marker
 *  labels 1..n. */
export function distPeaks(dist: Float32Array, mask: Uint8Array, w: number, h: number, hMin: number): { mk: Int32Array; n: number } {
  // h-maxima: reconstruct dist - h under dist by dilation; regional maxima of the result that rise h are peaks.
  const n = w * h, marker = new Float32Array(n);
  for (let i = 0; i < n; i++) marker[i] = mask[i] ? Math.max(0, dist[i] - hMin) : 0;
  // Reconstruction by dilation with a priority queue (highest first); entries carry the value they were pushed with,
  // and stale ones are skipped.
  const rec = new Float32Array(marker), hk: number[] = [], hi: number[] = [];
  const up = (k: number) => { while (k > 0) { const p = (k - 1) >> 1; if (hk[k] > hk[p]) { [hk[k], hk[p]] = [hk[p], hk[k]]; [hi[k], hi[p]] = [hi[p], hi[k]]; k = p; } else break; } };
  const down = (k: number) => { for (;;) { const l = 2 * k + 1, r = l + 1; let s = k; if (l < hk.length && hk[l] > hk[s]) s = l; if (r < hk.length && hk[r] > hk[s]) s = r; if (s === k) break; [hk[k], hk[s]] = [hk[s], hk[k]]; [hi[k], hi[s]] = [hi[s], hi[k]]; k = s; } };
  const push = (i: number) => { hk.push(rec[i]); hi.push(i); up(hk.length - 1); };
  for (let i = 0; i < n; i++) if (mask[i]) push(i);
  const done = new Uint8Array(n);
  while (hk.length) {
    const key = hk[0], i = hi[0], lk = hk.pop()!, li = hi.pop()!; if (hk.length) { hk[0] = lk; hi[0] = li; down(0); }
    if (done[i] || key < rec[i]) continue; done[i] = 1;
    const x = i % w, y = (i - x) / w;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy; if ((!dx && !dy) || xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
      const j = yy * w + xx; if (!mask[j] || done[j]) continue;
      const v = Math.min(rec[i], dist[j]);
      if (v > rec[j]) { rec[j] = v; push(j); }
    }
  }
  // Peaks: plateaus where dist - rec >= hMin (to float tolerance), grouped 8-connected.
  const pk = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (mask[i] && dist[i] - rec[i] >= hMin - 1e-4) pk[i] = 1;
  const { lab, n: k } = label(pk, w, h, 8);
  return { mk: lab, n: k };
}

/** Lengths of the units a scale bar can be given in, in micrometres. */
export const UNITS: Record<string, number> = { nm: 1e-3, 'µm': 1, mm: 1e3 };
/** Size of one pixel in micrometres from a scale bar: barPx pixels long, standing for barLen in unit. */
export const umPerPx = (barPx: number, barLen: number, unit: string) => (barLen * (UNITS[unit] ?? NaN)) / barPx;
/** A length in micrometres written in a sensible unit (nm under 1 µm, mm from 1000 µm). */
export function fmtLen(um: number, digits = 3): string {
  const s = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : String(+x.toPrecision(digits)));
  if (!Number.isFinite(um)) return '–';
  if (Math.abs(um) < 1) return `${s(um * 1e3)} nm`;
  if (Math.abs(um) >= 1e3) return `${s(um / 1e3)} mm`;
  return `${s(um)} µm`;
}

/** Seeded random numbers in [0, 1) (mulberry32), for the made-up example images. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** A normally distributed random number from a uniform source (Box–Muller). */
export const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());

/** Draws a scale bar (white bar and label on a black box) into RGBA, bottom right, inside the bottom 30 px. */
export function drawBar(px: Uint8ClampedArray, w: number, h: number, barPx: number, label: string) {
  const x1 = w - 12, x0 = x1 - barPx, y0 = h - 24, y1 = y0 + 5;
  for (let y = y0 - 5; y < h; y++) for (let x = Math.max(0, x0 - 8); x < Math.min(w, x1 + 8); x++) { const i = 4 * (y * w + x); px[i] = px[i + 1] = px[i + 2] = 0; }
  for (let y = y0 - 1; y <= y1; y++) for (let x = x0 - 1; x <= x1; x++) { const i = 4 * (y * w + x), edge = y === y0 - 1 || y === y1 || x === x0 - 1 || x === x1; px[i] = px[i + 1] = px[i + 2] = edge ? 0 : 255; }
  // A tiny 3×5 pixel font for the digits and units used in the examples.
  const F: Record<string, string> = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 5: '111100111001111', n: '000110101101101', m: '000111111101101', 'µ': '000101101111100', ' ': '000000000000000' };
  let x = x0 + (barPx - label.length * 4 * 2) / 2;
  for (const ch of label) {
    const f = F[ch] ?? F[' '];
    for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (f[j * 3 + i] === '1') for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const xx = Math.round(x) + i * 2 + b, yy = y1 + 3 + j * 2 + a; if (xx >= 0 && xx < w && yy < h) { const p = 4 * (yy * w + xx); px[p] = px[p + 1] = px[p + 2] = 255; }
    }
    x += 8;
  }
}
