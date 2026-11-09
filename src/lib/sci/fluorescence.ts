// Fluorescence image analysis, a small "ImageJ-lite": take one channel of a photo, take away the background (a
// rolling ball, done exactly as a grey-scale opening with a paraboloid that has the ball's curve at its bottom, or a
// constant), pick a threshold (Otsu, triangle or typed), fill holes, split touching nuclei with a distance-transform
// watershed, keep objects in a size range and measure each one: area, centre, mean and integrated intensity.
// A made-up image of nuclei with a known count is drawn here for the example. No DOM.

export type Channel = 'r' | 'g' | 'b' | 'grey';
export type Img = { w: number; h: number; v: Float32Array };

const BIG = 1e20;

/** One channel of RGBA pixels as 0..255. Grey is the usual 0.299 R + 0.587 G + 0.114 B. `invert` turns dark-on-light into light-on-dark. */
export function channel(rgba: ArrayLike<number>, w: number, h: number, ch: Channel, invert = false): Img {
  const v = new Float32Array(w * h), o = ch === 'r' ? 0 : ch === 'g' ? 1 : 2;
  for (let i = 0; i < w * h; i++) {
    const x = ch === 'grey' ? 0.299 * rgba[4 * i] + 0.587 * rgba[4 * i + 1] + 0.114 * rgba[4 * i + 2] : rgba[4 * i + o];
    v[i] = invert ? 255 - x : x;
  }
  return { w, h, v };
}

/**
 * Lower envelope of parabolas (Felzenszwalb and Huttenlocher, "Distance transforms of sampled functions", 2012):
 * out[x] = min over q of f[q] + k (x − q)². Points with f ≥ BIG are left out; if all are, out is BIG.
 */
function envelope(f: Float64Array, n: number, k: number, out: Float64Array, v: Int32Array, z: Float64Array) {
  let m = -1;
  const g = (q: number) => f[q] / k;
  for (let q = 0; q < n; q++) {
    if (f[q] >= BIG) continue;
    if (m < 0) { m = 0; v[0] = q; z[0] = -Infinity; z[1] = Infinity; continue; }
    let s = (g(q) + q * q - (g(v[m]) + v[m] * v[m])) / (2 * q - 2 * v[m]);
    while (s <= z[m]) { m--; if (m < 0) break; s = (g(q) + q * q - (g(v[m]) + v[m] * v[m])) / (2 * q - 2 * v[m]); }
    if (m < 0) { m = 0; v[0] = q; z[0] = -Infinity; z[1] = Infinity; continue; }
    m++; v[m] = q; z[m] = s; z[m + 1] = Infinity;
  }
  if (m < 0) { out.fill(BIG, 0, n); return; }
  let j = 0;
  for (let x = 0; x < n; x++) {
    while (z[j + 1] < x) j++;
    out[x] = f[v[j]] + k * (x - v[j]) ** 2;
  }
}

/** min over (qx, qy) of a[q] + k |p − q|², done as rows then columns (the paraboloid is separable). */
function envelope2d(a: Float64Array, w: number, h: number, k: number): Float64Array {
  const n = Math.max(w, h), f = new Float64Array(n), out = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  const r = new Float64Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = a[y * w + x];
    envelope(f, w, k, out, v, z);
    for (let x = 0; x < w; x++) r[y * w + x] = out[x];
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = r[y * w + x];
    envelope(f, h, k, out, v, z);
    for (let y = 0; y < h; y++) r[y * w + x] = out[y];
  }
  return r;
}

/**
 * Rolling-ball background: the grey-scale opening of the image with a paraboloid z = d² / (2 r), which has the same
 * curve at its bottom as a ball of radius r pixels (grey levels count as pixels, as in ImageJ). It is the highest
 * surface under the image that the shape can touch from below, so features narrower than the ball are left out.
 */
export function rollingBall(img: Img, r: number): Float32Array {
  const { w, h } = img, k = 1 / (2 * r), a = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = img.v[i];
  const er = envelope2d(a, w, h, k); // erosion
  for (let i = 0; i < w * h; i++) er[i] = -er[i];
  const di = envelope2d(er, w, h, k); // dilation of the erosion = −min(−e + k d²)
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = -di[i];
  return out;
}

/** The most common grey level (0..255), a simple automatic constant background for images that are mostly background. */
export function modeLevel(img: Img): number {
  const hst = histogram(img.v);
  let b = 0; for (let i = 1; i < 256; i++) if (hst[i] > hst[b]) b = i;
  return b;
}

/** Image minus background, never below 0. `bg` is a surface or one number. */
export function subtract(img: Img, bg: Float32Array | number): Img {
  const v = new Float32Array(img.w * img.h);
  for (let i = 0; i < v.length; i++) v[i] = Math.max(0, img.v[i] - (typeof bg === 'number' ? bg : bg[i]));
  return { w: img.w, h: img.h, v };
}

/** Grey level bin of a value: rounded and kept in 0..255. */
export const level = (x: number) => (x <= 0 ? 0 : x >= 255 ? 255 : Math.round(x));

/** 256-bin histogram of rounded levels. */
export function histogram(v: ArrayLike<number>): Float64Array {
  const h = new Float64Array(256);
  for (let i = 0; i < v.length; i++) h[level(v[i])]++;
  return h;
}

/** Otsu's threshold: the level t that makes the between-class variance of {≤ t} and {> t} largest (first one on a tie). Objects are > t. */
export function otsu(hist: ArrayLike<number>): number {
  let n = 0, sum = 0;
  for (let i = 0; i < 256; i++) { n += hist[i]; sum += i * hist[i]; }
  let w0 = 0, s0 = 0, best = -1, t = 0;
  for (let i = 0; i < 255; i++) {
    w0 += hist[i]; s0 += i * hist[i];
    const w1 = n - w0;
    if (w0 === 0 || w1 === 0) continue;
    const m0 = s0 / w0, m1 = (sum - s0) / w1, b = w0 * w1 * (m0 - m1) ** 2;
    if (b > best * (1 + 1e-12)) { best = b; t = i; }
  }
  return t;
}

/**
 * Triangle threshold (Zack, Rogers and Latt, 1977), as scikit-image does it: a line from the histogram's peak to the
 * far end of its longer tail, and the level where the histogram falls furthest below that line. Objects are > t.
 */
export function triangle(hist: ArrayLike<number>): number {
  let lo = -1, hi = -1, pk = 0;
  for (let i = 0; i < 256; i++) if (hist[i] > 0) { if (lo < 0) lo = i; hi = i; }
  if (lo < 0 || lo === hi) return Math.max(0, lo);
  for (let i = 0; i < 256; i++) if (hist[i] > hist[pk]) pk = i;
  const flip = pk - lo < hi - pk; // long tail on the bright side: flip so the tail is on the low side
  const H = (i: number) => (flip ? hist[255 - i] : hist[i]);
  const low = flip ? 255 - hi : lo, peak = flip ? 255 - pk : pk;
  const width0 = peak - low;
  if (width0 <= 0) return pk;
  const norm = Math.hypot(H(peak), width0), ph = H(peak) / norm, wd = width0 / norm;
  let best = -Infinity, arg = 0;
  for (let x = 0; x < width0; x++) {
    const len = ph * x - wd * H(x + low);
    if (len > best) { best = len; arg = x; }
  }
  const lv = arg + low;
  return flip ? 255 - lv : lv;
}

/** Pixels whose level is above t. */
export function threshold(img: Img, t: number): Uint8Array {
  const m = new Uint8Array(img.w * img.h);
  for (let i = 0; i < m.length; i++) m[i] = level(img.v[i]) > t ? 1 : 0;
  return m;
}

/** Fill holes: background that cannot reach the image edge through background (4-connected) becomes object. */
export function fillHoles(mask: Uint8Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(mask.length).fill(1), st = new Int32Array(mask.length);
  let sp = 0;
  const push = (i: number) => { if (!mask[i] && out[i]) { out[i] = 0; st[sp++] = i; } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (sp) {
    const i = st[--sp], x = i % w, y = (i - x) / w;
    if (x > 0) push(i - 1); if (x < w - 1) push(i + 1); if (y > 0) push(i - w); if (y < h - 1) push(i + w);
  }
  return out;
}

/** 8-connected objects, numbered 1.. in the order their first pixel is met reading row by row. */
export function label(mask: Uint8Array, w: number, h: number): { labels: Int32Array; n: number } {
  const L = new Int32Array(mask.length), st = new Int32Array(mask.length);
  let n = 0;
  for (let s = 0; s < mask.length; s++) {
    if (!mask[s] || L[s]) continue;
    n++; L[s] = n; let sp = 0; st[sp++] = s;
    while (sp) {
      const i = st[--sp], x = i % w, y = (i - x) / w;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        const j = yy * w + xx;
        if (mask[j] && !L[j]) { L[j] = n; st[sp++] = j; }
      }
    }
  }
  return { labels: L, n };
}

/** Euclidean distance from each object pixel to the nearest background pixel (0 on background). Outside the image does not count as background. */
export function distance(mask: Uint8Array, w: number, h: number): Float32Array {
  const a = new Float64Array(w * h);
  for (let i = 0; i < a.length; i++) a[i] = mask[i] ? BIG : 0;
  const d2 = envelope2d(a, w, h, 1), out = new Float32Array(w * h), cap = w + h;
  for (let i = 0; i < out.length; i++) out[i] = d2[i] >= BIG ? cap : Math.sqrt(d2[i]);
  return out;
}

/** Binary max-heap of pixel indices on a key, ties first in first out. */
class Heap {
  k: number[] = []; s: number[] = []; i: number[] = []; c = 0;
  get size() { return this.i.length; }
  private less(a: number, b: number) { return this.k[a] > this.k[b] || (this.k[a] === this.k[b] && this.s[a] < this.s[b]); }
  private swap(a: number, b: number) { [this.k[a], this.k[b]] = [this.k[b], this.k[a]]; [this.s[a], this.s[b]] = [this.s[b], this.s[a]]; [this.i[a], this.i[b]] = [this.i[b], this.i[a]]; }
  push(idx: number, key: number) {
    this.k.push(key); this.s.push(this.c++); this.i.push(idx);
    let j = this.i.length - 1;
    while (j > 0) { const p = (j - 1) >> 1; if (!this.less(j, p)) break; this.swap(j, p); j = p; }
  }
  pop(): number {
    const top = this.i[0], last = this.i.length - 1;
    this.swap(0, last); this.k.pop(); this.s.pop(); this.i.pop();
    let j = 0;
    for (;;) { const l = 2 * j + 1, r = l + 1; let m = j; if (l < last && this.less(l, m)) m = l; if (r < last && this.less(r, m)) m = r; if (m === j) break; this.swap(j, m); j = m; }
    return top;
  }
}

/**
 * Seeds for the watershed: the peaks of the distance map that stand at least `tol` pixels above every saddle that
 * joins them to a higher peak (the "find maxima" rule ImageJ's watershed uses, with its tolerance of 0.5).
 */
export function peaks(d: Float32Array, mask: Uint8Array, w: number, h: number, tol = 0.5): Int32Array {
  const cand: number[] = [];
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const x = i % w, y = (i - x) / w;
    let top = true;
    for (let dy = -1; dy <= 1 && top; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if ((dx || dy) && xx >= 0 && yy >= 0 && xx < w && yy < h && d[yy * w + xx] > d[i]) { top = false; break; }
    }
    if (top) cand.push(i);
  }
  cand.sort((a, b) => d[b] - d[a] || a - b);
  const claim = new Int32Array(mask.length), seed = new Int32Array(mask.length), st: number[] = [], seen: number[] = [];
  let n = 0, stamp = 0;
  const visit = new Int32Array(mask.length);
  for (const c of cand) {
    if (claim[c]) continue;
    stamp++;
    const d0 = d[c], floor = d0 - tol;
    let ok = true;
    st.length = 0; seen.length = 0; st.push(c); visit[c] = stamp;
    while (st.length) {
      const i = st.pop()!; seen.push(i);
      if (claim[i]) ok = false;
      const x = i % w, y = (i - x) / w;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        const j = yy * w + xx;
        if (visit[j] === stamp || !mask[j] || d[j] <= floor) continue;
        visit[j] = stamp; st.push(j);
      }
    }
    const id = ok ? ++n : -1;
    for (const i of seen) if (!claim[i]) claim[i] = id;
    if (ok) for (const i of seen) if (d[i] === d0) seed[i] = id;
  }
  return seed;
}

/** Split touching objects: flood the distance map from its peaks, highest first, so each pixel joins the nearest-centred object. */
export function watershed(mask: Uint8Array, w: number, h: number, tol = 0.5): { labels: Int32Array; n: number } {
  const d = distance(mask, w, h), seed = peaks(d, mask, w, h, tol), L = new Int32Array(mask.length), q = new Heap();
  let n = 0;
  for (let i = 0; i < mask.length; i++) if (seed[i] > 0) { L[i] = seed[i]; n = Math.max(n, seed[i]); q.push(i, d[i]); }
  while (q.size) {
    const i = q.pop(), x = i % w, y = (i - x) / w;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
      const j = yy * w + xx;
      if (mask[j] && !L[j]) { L[j] = L[i]; q.push(j, d[j]); }
    }
  }
  return { labels: L, n };
}

export type Obj = { id: number; area: number; x: number; y: number; mean: number; integrated: number; max: number; edge: boolean; x0: number; y0: number; x1: number; y1: number };

/**
 * Measure labelled objects on `img`, keep those with minArea ≤ area ≤ maxArea (and off the edge if asked), and
 * renumber them 1.. by where their first pixel is met reading row by row. Returns the kept labels too.
 */
export function measure(L: Int32Array, n: number, img: Img, o: { minArea?: number; maxArea?: number; dropEdge?: boolean } = {}): { objects: Obj[]; labels: Int32Array } {
  const { w, h } = img, area = new Float64Array(n + 1), sx = new Float64Array(n + 1), sy = new Float64Array(n + 1), sv = new Float64Array(n + 1), mx = new Float64Array(n + 1);
  const edge = new Uint8Array(n + 1), first = new Int32Array(n + 1).fill(-1), bx0 = new Int32Array(n + 1).fill(w), by0 = new Int32Array(n + 1).fill(h), bx1 = new Int32Array(n + 1).fill(-1), by1 = new Int32Array(n + 1).fill(-1);
  for (let i = 0; i < L.length; i++) {
    const l = L[i]; if (l <= 0) continue;
    const x = i % w, y = (i - x) / w, v = img.v[i];
    if (first[l] < 0) first[l] = i;
    area[l]++; sx[l] += x; sy[l] += y; sv[l] += v; if (v > mx[l]) mx[l] = v;
    if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge[l] = 1;
    if (x < bx0[l]) bx0[l] = x; if (x > bx1[l]) bx1[l] = x; if (y < by0[l]) by0[l] = y; if (y > by1[l]) by1[l] = y;
  }
  const minA = o.minArea ?? 0, maxA = o.maxArea ?? Infinity;
  const keep: number[] = [];
  for (let l = 1; l <= n; l++) if (area[l] > 0 && area[l] >= minA && area[l] <= maxA && !(o.dropEdge && edge[l])) keep.push(l);
  keep.sort((a, b) => first[a] - first[b]);
  const map = new Int32Array(n + 1);
  const objects = keep.map((l, k) => {
    map[l] = k + 1;
    return { id: k + 1, area: area[l], x: sx[l] / area[l], y: sy[l] / area[l], mean: sv[l] / area[l], integrated: sv[l], max: mx[l], edge: !!edge[l], x0: bx0[l], y0: by0[l], x1: bx1[l], y1: by1[l] };
  });
  const labels = new Int32Array(L.length);
  for (let i = 0; i < L.length; i++) if (L[i] > 0) labels[i] = map[L[i]];
  return { objects, labels };
}

export type Options = {
  channel: Channel; invert?: boolean;
  background: 'ball' | 'constant' | 'none'; radius?: number; constant?: number | null;
  method: 'otsu' | 'triangle' | 'manual'; manual?: number;
  fill?: boolean; split?: boolean; tol?: number; minArea?: number; maxArea?: number; dropEdge?: boolean;
};
export type Result = {
  w: number; h: number; signal: Img; hist: Float64Array; t: number; bgLevel: number | null;
  objects: Obj[]; labels: Int32Array; mask: Uint8Array; removed: number;
  count: number; meanArea: number; meanIntensity: number; totalIntegrated: number; areaFraction: number;
};

/** The whole recipe, in the order ImageJ users run it. */
export function analyse(rgba: ArrayLike<number>, w: number, h: number, o: Options): Result {
  const raw = channel(rgba, w, h, o.channel, !!o.invert);
  let signal = raw, bgLevel: number | null = null;
  if (o.background === 'ball') signal = subtract(raw, rollingBall(raw, Math.max(1, o.radius ?? 50)));
  else if (o.background === 'constant') { bgLevel = o.constant == null || !Number.isFinite(o.constant) ? modeLevel(raw) : o.constant; signal = subtract(raw, bgLevel); }
  const hist = histogram(signal.v);
  const t = o.method === 'manual' ? Math.round(o.manual ?? 50) : o.method === 'triangle' ? triangle(hist) : otsu(hist);
  let mask = threshold(signal, t);
  if (o.fill) mask = fillHoles(mask, w, h);
  const lab = o.split ? watershed(mask, w, h, o.tol ?? 0.5) : label(mask, w, h);
  const all = measure(lab.labels, lab.n, signal);
  const m = measure(lab.labels, lab.n, signal, { minArea: o.minArea, maxArea: o.maxArea, dropEdge: o.dropEdge });
  const objs = m.objects, count = objs.length;
  const sumA = objs.reduce((s, b) => s + b.area, 0), sumI = objs.reduce((s, b) => s + b.integrated, 0);
  return {
    w, h, signal, hist, t, bgLevel, objects: objs, labels: m.labels, mask, removed: all.objects.length - count,
    count, meanArea: count ? sumA / count : NaN, meanIntensity: sumA ? sumI / sumA : NaN, totalIntegrated: sumI, areaFraction: sumA / (w * h),
  };
}

/** Outline pixels: object pixels with a 4-neighbour that is not the same object. */
export function outlines(L: Int32Array, w: number, h: number): Uint8Array {
  const o = new Uint8Array(L.length);
  for (let i = 0; i < L.length; i++) {
    const l = L[i]; if (!l) continue;
    const x = i % w, y = (i - x) / w;
    if (x === 0 || y === 0 || x === w - 1 || y === h - 1 || L[i - 1] !== l || L[i + 1] !== l || L[i - w] !== l || L[i + w] !== l) o[i] = 1;
  }
  return o;
}

// ---- The made-up example: blue (DAPI-like) nuclei, a few of them also green, on an uneven background; red is empty. ----
export type Nucleus = { x: number; y: number; rx: number; ry: number; a: number; b: number; green: boolean; hole?: boolean };

/** 24 single nuclei, 3 touching pairs (30 nuclei, 27 blobs before splitting), 3 specks of dust, 8 green nuclei, 1 nucleus with a dark nucleolus. */
export function exampleNuclei(w = 400, h = 300): { nuclei: Nucleus[]; specks: [number, number][] } {
  let seed = 2026;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const nuclei: Nucleus[] = [];
  const pairs: [number, number, number, number, number][] = [[70, 70, 10, 11, 0], [300, 90, 11, 10, 0.6], [200, 230, 9, 11, 1.9]];
  for (const [x, y, r1, r2, ang] of pairs) {
    const sep = (r1 + r2) * 0.82, dx = Math.cos(ang) * sep / 2, dy = Math.sin(ang) * sep / 2;
    nuclei.push({ x: x - dx, y: y - dy, rx: r1, ry: r1, a: 0, b: 120 + 60 * rnd(), green: false });
    nuclei.push({ x: x + dx, y: y + dy, rx: r2, ry: r2, a: 0, b: 120 + 60 * rnd(), green: false });
  }
  let singles = 0, tries = 0;
  while (singles < 24 && tries++ < 10000) {
    const rx = 8 + 4 * rnd(), ry = rx * (0.75 + 0.25 * rnd()), x = 20 + (w - 40) * rnd(), y = 20 + (h - 40) * rnd();
    if (nuclei.some((n) => Math.hypot(n.x - x, n.y - y) < Math.max(n.rx, n.ry) + rx + 8)) continue;
    nuclei.push({ x, y, rx, ry, a: Math.PI * rnd(), b: 90 + 110 * rnd(), green: singles % 3 === 0, hole: singles === 5 });
    singles++;
  }
  const specks: [number, number][] = [];
  while (specks.length < 3) {
    const x = 15 + (w - 30) * rnd(), y = 15 + (h - 30) * rnd();
    if (nuclei.some((n) => Math.hypot(n.x - x, n.y - y) < Math.max(n.rx, n.ry) + 8)) continue;
    specks.push([x, y]);
  }
  return { nuclei, specks };
}

export const EXAMPLE = { count: 30, unsplit: 27, green: 8, w: 400, h: 300 };

/** The example as RGBA pixels. */
export function exampleImage(w = EXAMPLE.w, h = EXAMPLE.h) {
  const { nuclei, specks } = exampleNuclei(w, h), px = new Uint8ClampedArray(w * h * 4);
  let seed = 77;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const B = new Float32Array(w * h), G = new Float32Array(w * h);
  for (const n of nuclei) {
    const ca = Math.cos(n.a), sa = Math.sin(n.a), R = Math.max(n.rx, n.ry) + 3;
    for (let y = Math.max(0, Math.floor(n.y - R)); y <= Math.min(h - 1, Math.ceil(n.y + R)); y++) for (let x = Math.max(0, Math.floor(n.x - R)); x <= Math.min(w - 1, Math.ceil(n.x + R)); x++) {
      const dx = x - n.x, dy = y - n.y, u = (dx * ca + dy * sa) / n.rx, v = (-dx * sa + dy * ca) / n.ry, s = Math.hypot(u, v);
      const edge = 1 / (1 + Math.exp((s - 1) * n.rx / 0.8));
      let val = n.b * edge * (1 - 0.2 * Math.min(1, s) ** 2);
      if (n.hole && Math.hypot(dx, dy) < 3.2) val *= 0.05;
      const i = y * w + x;
      B[i] = Math.max(B[i], val);
      if (n.green) G[i] = Math.max(G[i], 0.9 * val);
    }
  }
  for (const [sx, sy] of specks) for (let y = Math.floor(sy) - 3; y <= Math.floor(sy) + 3; y++) for (let x = Math.floor(sx) - 3; x <= Math.floor(sx) + 3; x++) {
    const d = Math.hypot(x - sx, y - sy); if (d < 2.2) B[y * w + x] = Math.max(B[y * w + x], 160);
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, bg = 20 + 35 * (x / w) + 15 * (y / h);
    px[4 * i] = 0; // nothing in the red channel
    px[4 * i + 1] = Math.round(12 + G[i] + 0.1 * B[i] + 8 * (rnd() - 0.5));
    px[4 * i + 2] = Math.round(bg + B[i] + 12 * (rnd() - 0.5));
    px[4 * i + 3] = 255;
  }
  return { w, h, px };
}
