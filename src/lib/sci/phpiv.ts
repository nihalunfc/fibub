// Particle image velocimetry, basic: FFT cross-correlation of interrogation windows, 3-point Gaussian sub-pixel peak,
// peak ratio, and the normalised median test for outliers. Raffel et al., Particle Image Velocimetry (Springer);
// Westerweel and Scarano (2005), Experiments in Fluids 39, 1096 to 1100.

export type Gray = { w: number; h: number; d: Float32Array };

/** In-place radix-2 FFT of complex arrays (re, im) of length n (power of two). inv = true for the inverse (unscaled). */
function fft(re: Float64Array, im: Float64Array, inv = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const a = ((inv ? 2 : -2) * Math.PI) / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k], xr = re[i + k + len / 2], xi = im[i + k + len / 2];
        const vr = xr * cr - xi * ci, vi = xr * ci + xi * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}
function fft2(re: Float64Array, im: Float64Array, n: number, inv = false) {
  const r = new Float64Array(n), i2 = new Float64Array(n);
  for (let y = 0; y < n; y++) { for (let x = 0; x < n; x++) { r[x] = re[y * n + x]; i2[x] = im[y * n + x]; } fft(r, i2, inv); for (let x = 0; x < n; x++) { re[y * n + x] = r[x]; im[y * n + x] = i2[x]; } }
  for (let x = 0; x < n; x++) { for (let y = 0; y < n; y++) { r[y] = re[y * n + x]; i2[y] = im[y * n + x]; } fft(r, i2, inv); for (let y = 0; y < n; y++) { re[y * n + x] = r[y]; im[y * n + x] = i2[y]; } }
}

/** Circular cross-correlation of two n×n windows (mean removed). R[s] = Σ a(x) b(x + s); returns the n×n map, zero shift at index 0. */
export function xcorr(a: Float64Array, b: Float64Array, n: number): Float64Array {
  const ar = Float64Array.from(a), ai = new Float64Array(n * n), br = Float64Array.from(b), bi = new Float64Array(n * n);
  fft2(ar, ai, n); fft2(br, bi, n);
  for (let k = 0; k < n * n; k++) { const r = ar[k] * br[k] + ai[k] * bi[k], i = ar[k] * bi[k] - ai[k] * br[k]; ar[k] = r; ai[k] = i; }
  fft2(ar, ai, n, true);
  for (let k = 0; k < n * n; k++) ar[k] /= n * n;
  return ar;
}

const gauss3 = (l: number, c: number, r: number) => {
  if (l <= 0 || c <= 0 || r <= 0) { const den = l - 2 * c + r; return den ? (0.5 * (l - r)) / den : 0; } // parabolic fallback
  const ll = Math.log(l), lc = Math.log(c), lr = Math.log(r), den = 2 * (ll - 2 * lc + lr);
  return den ? (ll - lr) / den : 0;
};

export type Vec = { x: number; y: number; u: number; v: number; pr: number; valid: boolean; replaced: boolean };

/** PIV on two equal-size grey images. Window n (power of 2), step in pixels. Displacements in pixels (frame A to B), y down. */
export function piv(A: Gray, B: Gray, n: number, step: number, passes = 2): { vecs: Vec[]; nx: number; ny: number } {
  let r = pivPass(A, B, n, step, null);
  // Later passes shift the window in frame B by the rounded displacement from the pass before (after the median
  // test), which removes the bias towards zero caused by particles leaving the window.
  for (let k = 1; k < passes; k++) { medianTest(r.vecs, r.nx, r.ny); r = pivPass(A, B, n, step, r.vecs.map((v) => [Math.round(v.u), Math.round(v.v)] as [number, number])); }
  return r;
}
function pivPass(A: Gray, B: Gray, n: number, step: number, pred: [number, number][] | null): { vecs: Vec[]; nx: number; ny: number } {
  if (A.w !== B.w || A.h !== B.h) throw new Error('The two images must be the same size.');
  if (A.w < n || A.h < n) throw new Error(`The images are smaller than one ${n} × ${n} window.`);
  const vecs: Vec[] = [], wa = new Float64Array(n * n), wb = new Float64Array(n * n);
  let nx = 0, ny = 0;
  for (let y0 = 0; y0 + n <= A.h; y0 += step) {
    ny++; nx = 0;
    for (let x0 = 0; x0 + n <= A.w; x0 += step) {
      const idx = vecs.length;
      nx++;
      let [ox, oy] = pred ? pred[idx] : [0, 0];
      if (x0 + ox < 0 || y0 + oy < 0 || x0 + ox + n > A.w || y0 + oy + n > A.h) { ox = 0; oy = 0; }
      let ma = 0, mb = 0;
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const k = (y0 + j) * A.w + x0 + i, kb = (y0 + oy + j) * A.w + x0 + ox + i; wa[j * n + i] = A.d[k]; wb[j * n + i] = B.d[kb]; ma += A.d[k]; mb += B.d[kb]; }
      ma /= n * n; mb /= n * n; let sa = 0, sb = 0;
      for (let k = 0; k < n * n; k++) { wa[k] -= ma; wb[k] -= mb; sa += wa[k] ** 2; sb += wb[k] ** 2; }
      const cx = x0 + n / 2, cy = y0 + n / 2;
      if (!(sa > 0 && sb > 0)) { vecs.push({ x: cx, y: cy, u: 0, v: 0, pr: 0, valid: false, replaced: false }); continue; }
      const R = xcorr(wa, wb, n);
      // Highest and second-highest peaks (the second at least 2 px away).
      let p = 0; for (let k = 1; k < n * n; k++) if (R[k] > R[p]) p = k;
      const px = p % n, py = (p / n) | 0;
      let s2 = -Infinity;
      for (let k = 0; k < n * n; k++) { const dx = Math.min(Math.abs((k % n) - px), n - Math.abs((k % n) - px)), dy = Math.min(Math.abs(((k / n) | 0) - py), n - Math.abs(((k / n) | 0) - py)); if ((dx > 2 || dy > 2) && R[k] > s2) s2 = R[k]; }
      const at = (x: number, y: number) => R[((y + n) % n) * n + ((x + n) % n)];
      const fx = gauss3(at(px - 1, py), at(px, py), at(px + 1, py)), fy = gauss3(at(px, py - 1), at(px, py), at(px, py + 1));
      const u = ox + (px > n / 2 ? px - n : px) + fx, v = oy + (py > n / 2 ? py - n : py) + fy;
      vecs.push({ x: cx, y: cy, u, v, pr: s2 > 0 ? R[p] / s2 : Infinity, valid: true, replaced: false });
    }
  }
  return { vecs, nx, ny };
}

/** Normalised median test (3 × 3 neighbours, threshold, noise level ε in px); outliers replaced by the neighbour median if replace. Returns the count flagged. */
export function medianTest(vecs: Vec[], nx: number, ny: number, thr = 2, eps = 0.1, replace = true): number {
  const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const flag: boolean[] = [], rep: [number, number][] = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const k = j * nx + i, nb: Vec[] = [];
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { if (!di && !dj) continue; const ii = i + di, jj = j + dj; if (ii >= 0 && jj >= 0 && ii < nx && jj < ny && vecs[jj * nx + ii].valid) nb.push(vecs[jj * nx + ii]); }
    if (nb.length < 3) { flag.push(!vecs[k].valid); rep.push([vecs[k].u, vecs[k].v]); continue; }
    const mu = med(nb.map((v) => v.u)), mv = med(nb.map((v) => v.v));
    const ru = med(nb.map((v) => Math.abs(v.u - mu))), rv = med(nb.map((v) => Math.abs(v.v - mv)));
    // Edge vectors have a lopsided neighbourhood, so a smooth gradient looks like an outlier there: test them more leniently.
    const edge = nb.length < 8, e2 = edge ? 3 * eps : eps;
    const r = Math.hypot(Math.abs(vecs[k].u - mu) / (ru + e2), Math.abs(vecs[k].v - mv) / (rv + e2));
    flag.push(!vecs[k].valid || r > (edge ? 2 * thr : thr)); rep.push([mu, mv]);
  }
  let c = 0;
  vecs.forEach((v, k) => { if (flag[k]) { c++; v.valid = false; if (replace) { v.u = rep[k][0]; v.v = rep[k][1]; v.replaced = true; } } });
  return c;
}

/** A made-up particle image pair: random Gaussian particles, moved by the chosen field (pixels per frame). */
export type Field = 'shift' | 'vortex' | 'shear';
export function fieldAt(f: Field, x: number, y: number, w: number, h: number, mag: number): [number, number] {
  if (f === 'shift') return [mag, -0.5 * mag];
  if (f === 'shear') return [mag * (1 - (2 * y) / h), 0];
  // Rankine vortex centred in the image: solid rotation inside R = h/4, decaying outside; peak speed mag at R.
  const cx = w / 2, cy = h / 2, dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy), R = h / 4;
  const s = r < R ? (mag * r) / R : (mag * R) / r; return r > 0 ? [(-s * dy) / r, (s * dx) / r] : [0, 0];
}
export function synthPair(w: number, h: number, f: Field, mag: number, density = 0.02, diam = 2.5, seed = 7): { A: Gray; B: Gray } {
  let s = seed; const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const np = Math.round(w * h * density), A = new Float32Array(w * h), B = new Float32Array(w * h), sig2 = (diam / 2) ** 2 / 2;
  const dot = (img: Float32Array, px: number, py: number, I: number) => { for (let y = Math.max(0, Math.floor(py - 3)); y <= Math.min(h - 1, Math.ceil(py + 3)); y++) for (let x = Math.max(0, Math.floor(px - 3)); x <= Math.min(w - 1, Math.ceil(px + 3)); x++) img[y * w + x] += I * Math.exp(-((x - px) ** 2 + (y - py) ** 2) / (2 * sig2)); };
  for (let k = 0; k < np; k++) {
    const x = rnd() * (w + 20) - 10, y = rnd() * (h + 20) - 10, I = 120 + 120 * rnd();
    // Move by the field at the midpoint (second-order accurate for curved paths).
    const [u1, v1] = fieldAt(f, x, y, w, h, mag), [u, v] = fieldAt(f, x + u1 / 2, y + v1 / 2, w, h, mag);
    dot(A, x, y, I); dot(B, x + u, y + v, I);
  }
  for (let k = 0; k < w * h; k++) { A[k] = Math.min(255, A[k]); B[k] = Math.min(255, B[k]); }
  return { A: { w, h, d: A }, B: { w, h, d: B } };
}
