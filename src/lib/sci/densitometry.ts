// Gel and blot densitometry: turn a photo into stain signal (dark bands on a light gel or film, or light bands on a
// dark scan), split a lane area into equal lanes, take each lane's profile down the gel, take away an uneven
// background with a rolling window (a flat "rolling ball": the largest curve under the profile that a window of the
// chosen width can follow), find the band rows, and add up each band's volume. Amounts are relative to a reference
// lane, and can be divided by a loading-control band in the same lane. A made-up blot is drawn here for the example.
// No DOM.

export type Signal = { w: number; h: number; v: Float32Array; sat: Uint8Array };
export type Rect = { x0: number; y0: number; x1: number; y1: number };
export type Lane = { cx: number; c0: number; c1: number };
export type Band = { name: string; top: number; bottom: number };

/** Stain signal from RGBA pixels, 0 (no stain) to 1 (as dark or as bright as the photo goes). */
export function toSignal(rgba: ArrayLike<number>, w: number, h: number, darkBands: boolean): Signal {
  const v = new Float32Array(w * h), sat = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const y = (0.299 * rgba[4 * i] + 0.587 * rgba[4 * i + 1] + 0.114 * rgba[4 * i + 2]) / 255;
    const s = darkBands ? 1 - y : y;
    v[i] = s; sat[i] = s >= 0.996 ? 1 : 0;
  }
  return { w, h, v, sat };
}

/** n equal lanes across the area; each lane is sampled over `widthFrac` of its pitch, centred. */
export function makeLanes(r: Rect, n: number, widthFrac: number): Lane[] {
  const pitch = (r.x1 - r.x0) / n, half = (pitch * widthFrac) / 2, out: Lane[] = [];
  for (let i = 0; i < n; i++) {
    const cx = r.x0 + pitch * (i + 0.5);
    const c0 = Math.max(Math.floor(r.x0), Math.round(cx - half)), c1 = Math.max(c0 + 1, Math.min(Math.ceil(r.x1), Math.round(cx + half)));
    out.push({ cx, c0, c1 }); // columns c0 .. c1-1
  }
  return out;
}

/** Mean signal across the lane's columns, for each row y0 .. y1-1. */
export function profile(s: Signal, lane: Lane, y0: number, y1: number) {
  const out: number[] = [], c0 = Math.max(0, lane.c0), c1 = Math.min(s.w, lane.c1);
  for (let y = Math.max(0, y0); y < Math.min(s.h, y1); y++) {
    let t = 0; for (let x = c0; x < c1; x++) t += s.v[y * s.w + x];
    out.push(c1 > c0 ? t / (c1 - c0) : 0);
  }
  return out;
}

const slide = (p: number[], r: number, f: (a: number, b: number) => number) => p.map((_, i) => { let m = p[i]; for (let j = Math.max(0, i - r); j <= Math.min(p.length - 1, i + r); j++) m = f(m, p[j]); return m; });
/** Background under a profile: a flat window of 2r+1 rows rolled along the underside (min filter, then max filter). */
export const rollingBackground = (p: number[], r: number) => slide(slide(p, r, Math.min), r, Math.max);
export const subtract = (p: number[], bg: number[]) => p.map((v, i) => Math.max(0, v - bg[i]));

/** Band rows from the lanes' average background-free profile: peaks above `minFrac` of the highest, each running out
 *  to where the signal stops falling or drops below 5 % of its peak. Indices are rows of the profile. */
export function findBands(subs: number[][], minFrac = 0.1): { top: number; bottom: number; peak: number }[] {
  const n = subs[0]?.length ?? 0;
  if (!n) return [];
  const raw = Array.from({ length: n }, (_, i) => subs.reduce((t, p) => t + p[i], 0) / subs.length);
  const k = Math.max(1, Math.round(n / 200));
  const m = raw.map((_, i) => { let t = 0, c = 0; for (let j = i - k; j <= i + k; j++) if (j >= 0 && j < n) { t += raw[j]; c++; } return t / c; });
  const top = Math.max(...m);
  if (!(top > 0)) return [];
  const peaks: number[] = [];
  for (let i = 0; i < n; i++) if (m[i] >= minFrac * top && (i === 0 || m[i] > m[i - 1]) && (i === n - 1 || m[i] >= m[i + 1])) peaks.push(i);
  peaks.sort((a, b) => m[b] - m[a]);
  const out: { top: number; bottom: number; peak: number }[] = [];
  for (const p of peaks) {
    if (out.some((b) => p >= b.top && p <= b.bottom)) continue;
    const cut = 0.05 * m[p];
    let a = p, b = p;
    while (a > 0 && m[a - 1] <= m[a] && m[a - 1] > cut) a--;
    while (b < n - 1 && m[b + 1] <= m[b] && m[b + 1] > cut) b++;
    for (const o of out) { if (a <= o.bottom && p > o.bottom) a = o.bottom + 1; if (b >= o.top && p < o.top) b = o.top - 1; }
    out.push({ top: a, bottom: b, peak: p });
  }
  return out.sort((x, y) => x.top - y.top);
}

/** Volume of each band in each lane, summed over the band's rows and the lane's columns. With `line`, the profiles
 *  are the raw ones and each band sits on a straight line drawn under it from its top edge to its bottom edge (the
 *  way gel software has long done it); otherwise the profiles already have their background taken away. */
export function volumes(profiles: number[][], lanes: Lane[], bands: { top: number; bottom: number }[], line = false) {
  return profiles.map((p, l) => bands.map((b) => {
    const a = Math.max(0, b.top), z = Math.min(p.length - 1, b.bottom);
    if (z < a) return 0;
    const end = (i: number) => { let t = 0, c = 0; for (let j = i - 1; j <= i + 1; j++) if (j >= 0 && j < p.length) { t += p[j]; c++; } return t / c; };
    const pa = line ? end(a) : 0, pz = line ? end(z) : 0;
    let t = 0;
    for (let y = a; y <= z; y++) t += Math.max(0, p[y] - (z > a ? pa + ((pz - pa) * (y - a)) / (z - a) : pa));
    return t * (lanes[l].c1 - lanes[l].c0);
  }));
}

/** Share of the pixels in each lane × band box that are at the top of the photo's range (amounts there read low). */
export function saturation(s: Signal, lanes: Lane[], bands: { top: number; bottom: number }[], y0: number) {
  return lanes.map((ln) => bands.map((b) => {
    let k = 0, n = 0;
    for (let y = Math.max(0, y0 + b.top); y <= Math.min(s.h - 1, y0 + b.bottom); y++) for (let x = Math.max(0, ln.c0); x < Math.min(s.w, ln.c1); x++) { n++; k += s.sat[y * s.w + x]; }
    return n ? k / n : 0;
  }));
}

/** Amounts relative to a reference lane (100 %), raw and divided by a loading-control band (−1 for none). */
export function relative(vol: number[][], ref: number, control = -1) {
  const nb = vol[0]?.length ?? 0;
  const rel = vol.map((row) => row.map((v, b) => (vol[ref][b] > 0 ? (100 * v) / vol[ref][b] : NaN)));
  const norm = control < 0 ? null : vol.map((row) => row.map((v, b) => {
    const mine = row[control] > 0 ? v / row[control] : NaN, theirs = vol[ref][control] > 0 ? vol[ref][b] / vol[ref][control] : NaN;
    return theirs > 0 ? (100 * mine) / theirs : NaN;
  }));
  const share = vol.map((row) => { const t = row.reduce((a, b) => a + b, 0); return row.map((v) => (t > 0 ? (100 * v) / t : NaN)); });
  return { rel, norm, share, bands: nb };
}

/** A made-up blot, dark bands on a light film with an uneven background and a little noise. Two rows of bands:
 *  a target whose amounts change from lane to lane, and a loading control that stays nearly level. */
export const EXAMPLE_TARGET = [1, 2, 4, 6, 3, 1.5];
export const EXAMPLE_CONTROL = [1, 1.1, 0.9, 1, 1.05, 0.95];
export function exampleBlot(w = 480, h = 300) {
  const px = new Uint8ClampedArray(w * h * 4), n = EXAMPLE_TARGET.length, pitch = (w - 40) / n;
  let seed = 12345;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const rowAt = (y: number, c: number, sd: number) => Math.exp(-0.5 * ((y - c) / sd) ** 2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0.06 + 0.1 * (y / h) + 0.03 * (x / w);
    const l = Math.floor((x - 20) / pitch);
    if (l >= 0 && l < n) {
      const cx = 20 + pitch * (l + 0.5), dx = Math.abs(x - cx), edge = 1 / (1 + Math.exp((dx - pitch * 0.36) / 2));
      s += edge * (0.12 * EXAMPLE_TARGET[l] * rowAt(y, 95, 6) + 0.4 * EXAMPLE_CONTROL[l] * rowAt(y, 205, 5));
    }
    s += (rnd() - 0.5) * 0.02;
    const g = Math.round(255 * (1 - Math.min(1, Math.max(0, s)))), i = 4 * (y * w + x);
    px[i] = px[i + 1] = px[i + 2] = g; px[i + 3] = 255;
  }
  return { w, h, px, rect: { x0: 20, y0: 0, x1: w - 20, y1: h } as Rect, lanes: n };
}
