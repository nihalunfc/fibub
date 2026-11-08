// Image calibration and stacking for astrophotography: master dark, flat and bias frames, calibration of light
// frames, star-based alignment (shift and rotation), and a two-pass kappa-sigma clipped average.

export type Frame = { w: number; h: number; planes: Float32Array[] };

/** Median and robust σ (1.4826 × MAD) of a sample of the finite values. */
export function stats(d: ArrayLike<number>, maxSample = 200000) {
  const step = Math.max(1, Math.floor(d.length / maxSample)), s: number[] = [];
  for (let i = 0; i < d.length; i += step) { const v = d[i]; if (Number.isFinite(v)) s.push(v); }
  s.sort((a, b) => a - b);
  const med = s[s.length >> 1] ?? 0, dev = s.map((v) => Math.abs(v - med)).sort((a, b) => a - b);
  let sum = 0; for (const v of s) sum += v;
  return { median: med, sigma: (dev[dev.length >> 1] ?? 0) * 1.4826, mean: s.length ? sum / s.length : 0, min: s[0] ?? 0, max: s[s.length - 1] ?? 0 };
}

/** Plain average of frames, plane by plane (for master bias, dark and flat). */
export function average(frames: Frame[]): Frame {
  const { w, h } = frames[0], np = frames[0].planes.length;
  if (frames.some((f) => f.w !== w || f.h !== h || f.planes.length !== np)) throw new Error('Calibration frames must all be the same size and type as each other.');
  const planes = Array.from({ length: np }, () => new Float32Array(w * h));
  for (const f of frames) f.planes.forEach((p, k) => { const o = planes[k]; for (let i = 0; i < o.length; i++) o[i] += p[i] / frames.length; });
  return { w, h, planes };
}

/** Hot pixels of a master dark: more than `k` σ above its median. */
export function hotPixels(dark: Frame, k = 6) {
  const p = dark.planes[0], s = stats(p), thr = s.median + k * Math.max(s.sigma, 1e-6), out: number[] = [];
  for (let i = 0; i < p.length; i++) if (p[i] > thr) out.push(i);
  return out;
}

/** Calibrate a light frame: (light − dark) / normalised (flat − bias or flat dark), then patch hot pixels with
 *  the median of their neighbours. Missing masters are skipped. */
export function calibrate(light: Frame, m: { dark?: Frame; flat?: Frame; bias?: Frame; hot?: number[] }): Frame {
  const { w, h } = light;
  for (const f of [m.dark, m.flat, m.bias]) if (f && (f.w !== w || f.h !== h)) throw new Error(`Calibration frames are ${f.w} × ${f.h} but the lights are ${w} × ${h}. They must match.`);
  const planes = light.planes.map((p, k) => {
    const o = new Float32Array(p);
    const dk = m.dark ? m.dark.planes[Math.min(k, m.dark.planes.length - 1)] : m.bias ? m.bias.planes[Math.min(k, m.bias.planes.length - 1)] : null;
    if (dk) for (let i = 0; i < o.length; i++) o[i] -= dk[i];
    if (m.flat) {
      const fl = m.flat.planes[Math.min(k, m.flat.planes.length - 1)], bs = m.bias ? m.bias.planes[Math.min(k, m.bias.planes.length - 1)] : null;
      const norm = new Float32Array(fl.length); for (let i = 0; i < fl.length; i++) norm[i] = fl[i] - (bs ? bs[i] : 0);
      const mean = stats(norm).median || 1;
      for (let i = 0; i < o.length; i++) { const f = norm[i] / mean; o[i] = f > 0.05 ? o[i] / f : o[i]; }
    }
    if (m.hot) for (const i of m.hot) { const x = i % w, y = (i / w) | 0, nb: number[] = []; for (let j = -1; j <= 1; j++) for (let ii = -1; ii <= 1; ii++) { if (!ii && !j) continue; const xx = x + ii, yy = y + j; if (xx >= 0 && yy >= 0 && xx < w && yy < h) nb.push(o[yy * w + xx]); } nb.sort((a, b) => a - b); o[i] = nb[nb.length >> 1]; }
    return o;
  });
  return { w, h, planes };
}

/** Luminance (average of planes) for star finding. */
export const luminance = (f: Frame) => { if (f.planes.length === 1) return f.planes[0]; const o = new Float32Array(f.w * f.h); for (const p of f.planes) for (let i = 0; i < o.length; i++) o[i] += p[i] / f.planes.length; return o; };

export type Pt = { x: number; y: number; flux: number };
/** Bright, isolated stars: local maxima above `k` σ, centred by intensity-weighted centroid, brightest first. */
export function stars(d: Float32Array, w: number, h: number, max = 40, k = 6): Pt[] {
  const s = stats(d), thr = s.median + k * Math.max(s.sigma, 1e-6), out: Pt[] = [], B = 6;
  for (let y = B; y < h - B; y++) for (let x = B; x < w - B; x++) {
    const v = d[y * w + x]; if (!(v > thr)) continue;
    let ok = true;
    for (let j = -3; j <= 3 && ok; j++) for (let i = -3; i <= 3; i++) { if (!i && !j) continue; const u = d[(y + j) * w + x + i]; if (u > v || (u === v && (j < 0 || (j === 0 && i < 0)))) { ok = false; break; } }
    if (!ok) continue;
    let sx = 0, sy = 0, sf = 0;
    for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) { const u = d[(y + j) * w + x + i] - s.median; if (u > 0) { sx += u * (x + i); sy += u * (y + j); sf += u; } }
    if (sf > 0) out.push({ x: sx / sf, y: sy / sf, flux: sf });
  }
  return out.sort((a, b) => b.flux - a.flux).slice(0, max);
}

/** Similarity transform (rotation, scale, shift): x' = a x − b y + c, y' = b x + a y + d. */
export type Xf = { a: number; b: number; c: number; d: number; matched: number; rms: number };
export const apply = (t: Xf, x: number, y: number) => [t.a * x - t.b * y + t.c, t.b * x + t.a * y + t.d];

function fitXf(pairs: [Pt, Pt][]): Xf {
  // Least squares for (a, b, c, d) mapping the first point of each pair to the second.
  let n = 0, sx = 0, sy = 0, su = 0, sv = 0;
  for (const [p, q] of pairs) { n++; sx += p.x; sy += p.y; su += q.x; sv += q.y; }
  const mx = sx / n, my = sy / n, mu = su / n, mv = sv / n;
  let num1 = 0, num2 = 0, den = 0;
  for (const [p, q] of pairs) { const x = p.x - mx, y = p.y - my, u = q.x - mu, v = q.y - mv; num1 += x * u + y * v; num2 += x * v - y * u; den += x * x + y * y; }
  const a = den ? num1 / den : 1, b = den ? num2 / den : 0;
  const t = { a, b, c: mu - (a * mx - b * my), d: mv - (b * mx + a * my), matched: n, rms: 0 };
  let s = 0; for (const [p, q] of pairs) { const [x, y] = apply(t, p.x, p.y); s += (x - q.x) ** 2 + (y - q.y) ** 2; }
  t.rms = Math.sqrt(s / n);
  return t;
}

/** Find the transform taking reference star positions onto this frame's, by trying pairs of bright stars with
 *  matching separations and keeping the one most other stars agree with; then refine by least squares. */
export function align(ref: Pt[], cur: Pt[], tol = 2.5): Xf | null {
  const A = ref.slice(0, 15), B = cur.slice(0, 15), check = ref.slice(0, 40);
  let best: Xf | null = null, bestN = 2;
  for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) {
    const da = Math.hypot(A[j].x - A[i].x, A[j].y - A[i].y); if (da < 20) continue;
    for (let k = 0; k < B.length; k++) for (let l = 0; l < B.length; l++) {
      if (k === l) continue;
      const db = Math.hypot(B[l].x - B[k].x, B[l].y - B[k].y); if (Math.abs(db - da) > Math.max(2, da * 0.01)) continue;
      const t = fitXf([[A[i], B[k]], [A[j], B[l]]]);
      let n = 0; for (const p of check) { const [x, y] = apply(t, p.x, p.y); if (cur.some((q) => Math.abs(q.x - x) < tol && Math.abs(q.y - y) < tol)) n++; }
      if (n > bestN) { bestN = n; best = t; }
    }
  }
  if (!best) return null;
  // Refine with every star that matches.
  const pairs: [Pt, Pt][] = [];
  for (const p of check) { const [x, y] = apply(best, p.x, p.y); let bq: Pt | null = null, bd = tol; for (const q of cur) { const dd = Math.hypot(q.x - x, q.y - y); if (dd < bd) { bd = dd; bq = q; } } if (bq) pairs.push([p, bq]); }
  return pairs.length >= 3 ? fitXf(pairs) : best;
}

/** Resample a frame onto the reference grid: each reference pixel looks up its position in this frame through t
 *  (bilinear interpolation); pixels that fall outside become NaN. */
export function warp(f: Frame, t: Xf): Frame {
  const { w, h } = f;
  const planes = f.planes.map((p) => {
    const o = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = t.a * x - t.b * y + t.c, v = t.b * x + t.a * y + t.d, x0 = Math.floor(u), y0 = Math.floor(v);
      if (x0 < 0 || y0 < 0 || x0 >= w - 1 || y0 >= h - 1) { o[y * w + x] = NaN; continue; }
      const fx = u - x0, fy = v - y0, i = y0 * w + x0;
      o[y * w + x] = p[i] * (1 - fx) * (1 - fy) + p[i + 1] * fx * (1 - fy) + p[i + w] * (1 - fx) * fy + p[i + w + 1] * fx * fy;
    }
    return o;
  });
  return { w, h, planes };
}

/** Two-pass kappa-sigma stacker. Pass 1 (`add`) gathers mean and variance per pixel; pass 2 (`addClipped`) averages
 *  again leaving out values more than κσ from the mean of the other frames. Frames are normalised to the reference background. */
export class Stacker {
  w: number; h: number; np: number; n = 0; mean: Float32Array[]; m2: Float32Array[]; cnt: Uint16Array[]; sum: Float32Array[]; cnt2: Uint16Array[]; rejected = 0; total = 0;
  constructor(w: number, h: number, np: number) {
    this.w = w; this.h = h; this.np = np;
    const mk = () => Array.from({ length: np }, () => new Float32Array(w * h));
    this.mean = mk(); this.m2 = mk(); this.sum = mk();
    this.cnt = Array.from({ length: np }, () => new Uint16Array(w * h)); this.cnt2 = Array.from({ length: np }, () => new Uint16Array(w * h));
  }
  add(f: Frame) {
    this.n++;
    f.planes.forEach((p, k) => { const M = this.mean[k], S = this.m2[k], C = this.cnt[k]; for (let i = 0; i < p.length; i++) { const v = p[i]; if (!Number.isFinite(v)) continue; const c = ++C[i], d = v - M[i]; M[i] += d / c; S[i] += d * (v - M[i]); } });
  }
  addClipped(f: Frame, kappa = 3) {
    f.planes.forEach((p, k) => {
      const M = this.mean[k], S = this.m2[k], C = this.cnt[k], O = this.sum[k], N = this.cnt2[k];
      for (let i = 0; i < p.length; i++) {
        const v = p[i]; if (!Number.isFinite(v)) continue; this.total++;
        // Leave this value out of the mean and spread it is tested against, so one bright outlier (a satellite or
        // plane trail, a cosmic ray) cannot hide itself by inflating them.
        const c = C[i];
        if (c > 3) { const m1 = (c * M[i] - v) / (c - 1), s1 = S[i] - (v - M[i]) * (v - m1), sd = Math.sqrt(Math.max(0, s1) / (c - 2)); if (Math.abs(v - m1) > kappa * sd) { this.rejected++; continue; } }
        O[i] += v; N[i]++;
      }
    });
  }
  /** The average (clipped if pass 2 ran, else plain), with pixels no frame covered set to the median. */
  result(clipped = true): Frame {
    const planes = this.sum.map((O, k) => {
      const N = this.cnt2[k], M = this.mean[k], C = this.cnt[k], o = new Float32Array(O.length);
      for (let i = 0; i < o.length; i++) o[i] = clipped && N[i] ? O[i] / N[i] : C[i] ? M[i] : NaN;
      const med = stats(o).median; for (let i = 0; i < o.length; i++) if (!Number.isFinite(o[i])) o[i] = med;
      return o;
    });
    return { w: this.w, h: this.h, planes };
  }
}

/** Background noise: robust σ of the frame (stars hardly move the median absolute deviation). */
export const noise = (d: Float32Array) => stats(d).sigma;

/** A 32-bit floating-point FITS file of the planes (one 2-D image, or a 3-D cube for colour). */
export function writeFits(f: Frame, extra: [string, string | number, string?][] = [], bottomFirst = false) {
  const card = (k: string, v: string | number | boolean, c = '') => {
    const val = typeof v === 'boolean' ? (v ? 'T' : 'F') : typeof v === 'number' ? String(v) : `'${v.replace(/'/g, "''").padEnd(8)}'`;
    return `${k.padEnd(8)}= ${val.padStart(20)}${c ? ` / ${c}` : ''}`.slice(0, 80).padEnd(80);
  };
  const cards = [card('SIMPLE', true, 'conforms to FITS standard'), card('BITPIX', -32, '32-bit float'), card('NAXIS', f.planes.length > 1 ? 3 : 2), card('NAXIS1', f.w), card('NAXIS2', f.h)];
  if (f.planes.length > 1) cards.push(card('NAXIS3', f.planes.length));
  for (const [k, v, c] of extra) cards.push(card(k, v, c));
  cards.push('END'.padEnd(80));
  let head = cards.join(''); head = head.padEnd(Math.ceil(head.length / 2880) * 2880, ' ');
  const n = f.w * f.h * f.planes.length, dataLen = Math.ceil((n * 4) / 2880) * 2880, out = new Uint8Array(head.length + dataLen);
  for (let i = 0; i < head.length; i++) out[i] = head.charCodeAt(i);
  const dv = new DataView(out.buffer, head.length);
  // FITS rows run from the bottom up; frames read from images are stored top row first, from FITS bottom first.
  let o = 0;
  for (const p of f.planes) for (let r = 0; r < f.h; r++) { const y = bottomFirst ? r : f.h - 1 - r; for (let x = 0; x < f.w; x++) { dv.setFloat32(o, p[y * f.w + x], false); o += 4; } }
  return out;
}

/** Simulated frames for the example: `n` light frames of one star field drifting and rotating slightly, with
 *  vignetting, dust, hot pixels, a satellite trail in one frame and read noise; matching darks and flats. */
export function simulatedSet(n = 8, w = 360, h = 260, seed = 9) {
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  const field: [number, number, number][] = Array.from({ length: 70 }, () => [rnd() * w * 1.2 - w * 0.1, rnd() * h * 1.2 - h * 0.1, 40 * Math.exp(rnd() * 3.5)]);
  // Faint nebula: a soft blob only the stack shows well.
  const neb = (x: number, y: number) => 6 * Math.exp(-(((x - w * 0.55) / (w * 0.18)) ** 2 + ((y - h * 0.45) / (h * 0.22)) ** 2));
  const vig = (x: number, y: number) => { const r = Math.hypot((x - w / 2) / w, (y - h / 2) / h); let v = 1 - 0.9 * r * r; const dd = Math.hypot(x - w * 0.3, y - h * 0.65); if (dd < 12) v *= 0.82; return v; };
  const hot: number[] = Array.from({ length: 25 }, () => Math.floor(rnd() * w * h));
  const darkLevel = (i: number) => 100 + (hot.includes(i) ? 900 : 0);
  const make = (fn: (x: number, y: number, i: number) => number): Frame => { const p = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; p[i] = fn(x, y, i); } return { w, h, planes: [p] }; };
  const lights: Frame[] = [], truth: { dx: number; dy: number; rot: number }[] = [];
  for (let k = 0; k < n; k++) {
    const dx = (rnd() - 0.5) * 16, dy = (rnd() - 0.5) * 16, rot = (rnd() - 0.5) * 0.02, ca = Math.cos(rot), sa = Math.sin(rot);
    truth.push({ dx, dy, rot });
    lights.push(make((x, y, i) => {
      // Sky position seen at pixel (x, y): rotate about the centre, then shift.
      const u = ca * (x - w / 2) + sa * (y - h / 2) + w / 2 - dx, v = -sa * (x - w / 2) + ca * (y - h / 2) + h / 2 - dy;
      let sky = 20 + neb(u, v);
      for (const [sx, sy, a] of field) { const r2 = (u - sx) ** 2 + (v - sy) ** 2; if (r2 < 64) sky += a * Math.exp(-r2 / 3.2); }
      if (k === 3 && Math.abs(y - (0.4 * x + 40)) < 1.2) sky += 120;
      return sky * vig(x, y) + darkLevel(i) + 5 * gauss();
    }));
  }
  const darks = Array.from({ length: 4 }, () => make((x, y, i) => darkLevel(i) + 5 * gauss()));
  const flats = Array.from({ length: 4 }, () => make((x, y) => 100 + 20000 * vig(x, y) + 40 * gauss()));
  const bias = Array.from({ length: 4 }, () => make(() => 100 + 5 * gauss()));
  return { lights, darks, flats, bias, truth };
}
