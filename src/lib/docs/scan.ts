// Pure helpers for Scan to PDF: find page corners, flatten with a homography, clean-up filters.
export type Pt = { x: number; y: number };
export type Quad = [Pt, Pt, Pt, Pt]; // top-left, top-right, bottom-right, bottom-left
export type Filter = 'original' | 'grey' | 'bw' | 'whiten';

const lum = (d: Uint8ClampedArray, i: number) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

/** Otsu threshold of 0..255 values. */
export function otsu(vals: ArrayLike<number>): number {
  const h = new Array(256).fill(0); for (let i = 0; i < vals.length; i++) h[Math.max(0, Math.min(255, Math.round(vals[i])))]++;
  const n = vals.length; let sum = 0; for (let i = 0; i < 256; i++) sum += i * h[i];
  let wb = 0, sb = 0, best = 0, th = 128;
  for (let t = 0; t < 256; t++) {
    wb += h[t]; if (!wb) continue; const wf = n - wb; if (!wf) break;
    sb += t * h[t]; const mb = sb / wb, mf = (sum - sb) / wf, v = wb * wf * (mb - mf) * (mb - mf);
    if (v > best) { best = v; th = t; }
  }
  return th;
}

/** Corners (as fractions 0..1) of the largest bright region; falls back to a small inset rectangle. */
export function detectCorners(img: ImageData): Quad {
  const { width: w, height: h, data } = img, g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = lum(data, i * 4);
  const th = otsu(g), lab = new Int32Array(w * h);
  let bestN = 0, bestId = 0, id = 0; const stack: number[] = [];
  for (let s = 0; s < w * h; s++) {
    if (lab[s] || g[s] <= th) continue;
    id++; let n = 0; stack.push(s); lab[s] = id;
    while (stack.length) {
      const p = stack.pop()!; n++; const x = p % w, y = (p - x) / w;
      if (x > 0 && !lab[p - 1] && g[p - 1] > th) { lab[p - 1] = id; stack.push(p - 1); }
      if (x < w - 1 && !lab[p + 1] && g[p + 1] > th) { lab[p + 1] = id; stack.push(p + 1); }
      if (y > 0 && !lab[p - w] && g[p - w] > th) { lab[p - w] = id; stack.push(p - w); }
      if (y < h - 1 && !lab[p + w] && g[p + w] > th) { lab[p + w] = id; stack.push(p + w); }
    }
    if (n > bestN) { bestN = n; bestId = id; }
  }
  const inset = (): Quad => [{ x: .04, y: .04 }, { x: .96, y: .04 }, { x: .96, y: .96 }, { x: .04, y: .96 }];
  if (bestN < w * h * 0.15) return inset();
  let tl = Infinity, br = -Infinity, tr = -Infinity, bl = Infinity;
  const P: Pt[] = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
  for (let p = 0; p < w * h; p++) {
    if (lab[p] !== bestId) continue; const x = p % w, y = (p - x) / w, s = x + y, d = x - y;
    if (s < tl) { tl = s; P[0] = { x, y }; } if (d > tr) { tr = d; P[1] = { x, y }; }
    if (s > br) { br = s; P[2] = { x, y }; } if (d < bl) { bl = d; P[3] = { x, y }; }
  }
  return P.map((q) => ({ x: (q.x + (q.x < w / 2 ? 0 : 1)) / w, y: (q.y + (q.y < h / 2 ? 0 : 1)) / h })) as Quad;
}

/** Solve 8x8 system for the homography taking the unit rectangle (0..w, 0..h) onto quad q (pixels). */
export function homography(q: Quad, w: number, h: number): number[] {
  const src = [[0, 0], [w, 0], [w, h], [0, h]], A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], { x: u, y: v } = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u], [0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let m = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
    [A[c], A[m]] = [A[m], A[c]];
    for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k]; }
  }
  return [...A.map((r, i) => r[8] / r[i]), 1];
}

export function outputSize(q: Quad, maxSide = 1800): { w: number; h: number } {
  const d = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
  let w = (d(q[0], q[1]) + d(q[3], q[2])) / 2, h = (d(q[0], q[3]) + d(q[1], q[2])) / 2;
  const k = Math.min(1, maxSide / Math.max(w, h, 1)); w = Math.max(8, Math.round(w * k)); h = Math.max(8, Math.round(h * k));
  return { w, h };
}

/** Flatten: for each output pixel sample the source through the homography (bilinear). q is in source pixels. */
export function warp(src: ImageData, q: Quad): ImageData {
  const { w, h } = outputSize(q), H = homography(q, w, h), out = new ImageData(w, h), s = src.data, sw = src.width, sh = src.height;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const z = H[6] * x + H[7] * y + 1, u = (H[0] * x + H[1] * y + H[2]) / z, v = (H[3] * x + H[4] * y + H[5]) / z;
    const x0 = Math.max(0, Math.min(sw - 2, Math.floor(u))), y0 = Math.max(0, Math.min(sh - 2, Math.floor(v)));
    const fx = Math.max(0, Math.min(1, u - x0)), fy = Math.max(0, Math.min(1, v - y0)), o = (y * w + x) * 4;
    for (let c = 0; c < 3; c++) {
      const a = s[(y0 * sw + x0) * 4 + c], b = s[(y0 * sw + x0 + 1) * 4 + c], d = s[((y0 + 1) * sw + x0) * 4 + c], e = s[((y0 + 1) * sw + x0 + 1) * 4 + c];
      out.data[o + c] = (a * (1 - fx) + b * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy;
    }
    out.data[o + 3] = 255;
  }
  return out;
}

/** Local average of luminance over a (2r+1) square, via an integral image. */
function localMean(img: ImageData, r: number): Float32Array {
  const { width: w, height: h, data } = img, I = new Float64Array((w + 1) * (h + 1)), m = new Float32Array(w * h);
  for (let y = 0; y < h; y++) { let row = 0; for (let x = 0; x < w; x++) { row += lum(data, (y * w + x) * 4); I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + row; } }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1), y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
    m[y * w + x] = (I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0]) / ((x1 - x0) * (y1 - y0));
  }
  return m;
}

export function applyFilter(img: ImageData, f: Filter): ImageData {
  const out = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height), d = out.data, n = img.width * img.height;
  if (f === 'original') return out;
  if (f === 'grey') { for (let i = 0; i < n; i++) { const g = lum(d, i * 4); d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = g; } return out; }
  const r = Math.max(8, Math.round(Math.min(img.width, img.height) / 16)), m = localMean(img, r);
  for (let i = 0; i < n; i++) {
    const o = i * 4, g = lum(img.data, o);
    if (f === 'bw') { const v = g < m[i] * 0.88 ? 0 : 255; d[o] = d[o + 1] = d[o + 2] = v; }
    else { const k = 245 / Math.max(m[i], 40); for (let c = 0; c < 3; c++) d[o + c] = Math.min(255, img.data[o + c] * k); }
  }
  return out;
}
