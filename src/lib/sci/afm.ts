// AFM (and other height-map) roughness: read a height matrix, XYZ list or 16-bit greyscale PNG, level it,
// and work out areal (ISO 25178 style: Sa, Sq, Ssk, Sku, Sp, Sv, Sz) and profile (ISO 4287 style: Ra, Rq, Rsk,
// Rku, Rp, Rv, Rt, Rz) parameters, line profiles, step heights and histograms.
// No filtering by a cut-off wavelength (λc) is done: form is removed only by the polynomial levelling and the
// straight line taken off each profile, so values are "primary" (unfiltered) roughness.
// No DOM; checked against NumPy/SciPy in tests/sci-tools/afm-roughness.mjs.

export type Surface = { nx: number; ny: number; z: Float64Array; dx: number; dy: number }; // z in nm, row-major (row 0 at the top); dx, dy in µm per pixel
export type Header = { width?: number; height?: number; zScale?: number }; // width/height in µm, zScale = nm per file unit

const UNIT_UM: Record<string, number> = { m: 1e6, mm: 1e3, um: 1, 'µm': 1, 'μm': 1, nm: 1e-3, pm: 1e-6, a: 1e-4, 'å': 1e-4 };
const UNIT_NM: Record<string, number> = { m: 1e9, mm: 1e6, um: 1e3, 'µm': 1e3, 'μm': 1e3, nm: 1, pm: 1e-3, a: 0.1, 'å': 0.1 };

/** Reads "# Width: 5.000 µm", "# Height: 5 µm" and "# Value units: m" header lines (as Gwyddion's ASCII export writes them). */
export function readHeader(text: string): Header {
  const h: Header = {};
  for (const line of text.split(/\r?\n/, 60)) {
    const m = /^#\s*(width|height|value units)\s*[:=]\s*([-+0-9.eE]*)\s*([a-zA-Zµμå]+)?/i.exec(line.trim());
    if (!m) continue;
    const key = m[1].toLowerCase(), v = Number(m[2]), u = (m[3] ?? '').toLowerCase();
    if (key === 'value units' && u in UNIT_NM) h.zScale = UNIT_NM[u];
    else if (key !== 'value units' && v > 0 && u in UNIT_UM) h[key as 'width' | 'height'] = v * UNIT_UM[u];
  }
  return h;
}

/** Number rows of a text file, skipping blank lines and lines starting with # or a letter (headers). */
export function numberRows(text: string, maxValues = 20e6): number[][] {
  const rows: number[][] = [];
  let count = 0, line = 0;
  for (const raw of text.split(/\r?\n/)) {
    line++;
    const t = raw.trim();
    if (!t || t.startsWith('#') || /^[A-Za-z"]/.test(t)) continue;
    const parts = t.split(/[\s,;]+/), r = new Array(parts.length);
    for (let i = 0; i < parts.length; i++) { const v = Number(parts[i]); if (!Number.isFinite(v)) throw new Error(`Line ${line} has something that is not a number: "${parts[i].slice(0, 20)}".`); r[i] = v; }
    count += r.length;
    if (count > maxValues) throw new Error(`The file has more than ${maxValues / 1e6} million values, which is too many for the browser here.`);
    rows.push(r);
  }
  return rows;
}

/** A matrix of heights: every row the same length. */
export function fromMatrix(rows: number[][]): { nx: number; ny: number; z: Float64Array } {
  const ny = rows.length, nx = rows[0]?.length ?? 0;
  if (ny < 3 || nx < 3) throw new Error('A height matrix needs at least 3 rows of at least 3 numbers.');
  const bad = rows.findIndex((r) => r.length !== nx);
  if (bad >= 0) throw new Error(`Row ${bad + 1} has ${rows[bad].length} numbers but the first has ${nx}: every row of the matrix must be the same length.`);
  const z = new Float64Array(nx * ny);
  rows.forEach((r, j) => z.set(r, j * nx));
  return { nx, ny, z };
}

/** An X Y Z list on a regular grid (any order). Rows of the result run along y (smallest y at the top). */
export function fromXYZ(rows: number[][]): { nx: number; ny: number; z: Float64Array; dx: number; dy: number } {
  if (rows.some((r) => r.length !== 3)) throw new Error('An XYZ list needs exactly three numbers on every line: x, y and height.');
  const key = (v: number) => +v.toPrecision(10);
  const xs = [...new Set(rows.map((r) => key(r[0])))].sort((a, b) => a - b), ys = [...new Set(rows.map((r) => key(r[1])))].sort((a, b) => a - b);
  const nx = xs.length, ny = ys.length;
  if (nx < 3 || ny < 3) throw new Error('An XYZ list needs at least 3 different x and 3 different y values.');
  if (nx * ny !== rows.length) throw new Error(`The XYZ points are not a full grid: ${nx} x values × ${ny} y values would be ${nx * ny} points, but there are ${rows.length}.`);
  const ix = new Map(xs.map((v, i) => [v, i])), iy = new Map(ys.map((v, i) => [v, i]));
  const z = new Float64Array(nx * ny).fill(NaN);
  for (const [x, y, h] of rows) z[iy.get(key(y))! * nx + ix.get(key(x))!] = h;
  if (z.some((v) => Number.isNaN(v))) throw new Error('Some grid points appear twice in the XYZ list and others are missing.');
  return { nx, ny, z, dx: (xs[nx - 1] - xs[0]) / (nx - 1), dy: (ys[ny - 1] - ys[0]) / (ny - 1) };
}

// ---------- PNG (greyscale or colour, 8 or 16 bits per sample, not interlaced) ----------
const be32 = (b: Uint8Array, o: number) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
export type Inflate = (data: Uint8Array) => Promise<Uint8Array>;

/** Decode a PNG into one channel of raw sample values (grey, or the first channel of colour images). */
export async function decodePng(buf: Uint8Array, inflate: Inflate, maxPixels = 16e6): Promise<{ w: number; h: number; bits: number; v: Float64Array; colour: boolean }> {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (sig.some((s, i) => buf[i] !== s)) throw new Error('This is not a PNG file.');
  let o = 8, w = 0, h = 0, bits = 0, ct = 0, inter = 0;
  const idat: Uint8Array[] = [];
  while (o + 8 <= buf.length) {
    const len = be32(buf, o), type = String.fromCharCode(...buf.subarray(o + 4, o + 8)), d = buf.subarray(o + 8, o + 8 + len);
    if (type === 'IHDR') { w = be32(d, 0); h = be32(d, 4); bits = d[8]; ct = d[9]; inter = d[12]; }
    else if (type === 'IDAT') idat.push(d);
    else if (type === 'IEND') break;
    o += 12 + len;
  }
  if (!(w > 0 && h > 0)) throw new Error('The PNG has no image header.');
  if (w * h > maxPixels) throw new Error(`The image is ${w} × ${h} pixels, more than the ${maxPixels / 1e6} million this page handles.`);
  if (ct === 3) throw new Error('This PNG uses a colour palette, so its pixel values are not heights. Export the height data as a greyscale (ideally 16-bit) PNG or TIFF.');
  if (inter) throw new Error('Interlaced PNGs are not supported. Save it again without interlacing.');
  if (bits !== 8 && bits !== 16) throw new Error(`${bits}-bit PNGs are not supported (8 and 16-bit are).`);
  const spp = ({ 0: 1, 2: 3, 4: 2, 6: 4 } as Record<number, number>)[ct];
  if (!spp) throw new Error('Unknown PNG colour type.');
  const all = new Uint8Array(idat.reduce((s, a) => s + a.length, 0));
  { let p = 0; for (const a of idat) { all.set(a, p); p += a.length; } }
  const raw = await inflate(all);
  const bpp = (spp * bits) / 8, stride = w * bpp;
  if (raw.length < h * (stride + 1)) throw new Error('The PNG pixel data is cut short.');
  const out = new Uint8Array(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), row = out.subarray(y * stride, (y + 1) * stride);
    const up = y ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? row[i - bpp] : 0, b = up ? up[i] : 0, c = up && i >= bpp ? up[i - bpp] : 0;
      let p: number;
      switch (f) {
        case 0: p = 0; break;
        case 1: p = a; break;
        case 2: p = b; break;
        case 3: p = (a + b) >> 1; break;
        case 4: { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c); p = pa <= pb && pa <= pc ? a : pb <= pc ? b : c; break; }
        default: throw new Error(`Bad PNG row filter ${f}.`);
      }
      row[i] = (src[i] + p) & 255;
    }
  }
  const v = new Float64Array(w * h), bs = bits / 8;
  for (let k = 0; k < w * h; k++) { const at = k * bpp; v[k] = bs === 2 ? (out[at] << 8) | out[at + 1] : out[at]; }
  return { w, h, bits, v, colour: ct === 2 || ct === 6 };
}

// ---------- levelling ----------
/** Exponent pairs (i, j) for x^i y^j with i + j ≤ order. */
const terms = (order: number) => { const t: [number, number][] = []; for (let s = 0; s <= order; s++) for (let i = s; i >= 0; i--) t.push([i, s - i]); return t; };

export function solve(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-300) throw new Error('The levelling fit has too few points.');
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}

export type Rect = { x0: number; y0: number; x1: number; y1: number }; // pixel indices, inclusive, any corner order
export const normRect = (r: Rect, nx: number, ny: number) => {
  const c = (v: number, n: number) => Math.max(0, Math.min(n - 1, Math.round(v)));
  const x0 = c(Math.min(r.x0, r.x1), nx), x1 = c(Math.max(r.x0, r.x1), nx), y0 = c(Math.min(r.y0, r.y1), ny), y1 = c(Math.max(r.y0, r.y1), ny);
  return { x0, x1, y0, y1 };
};

/** Fit a polynomial surface of the given order (1 = plane) to the whole image, or only to the pixels in `rect`,
 *  and subtract it everywhere. Coordinates are scaled to −1..1 so the fit is well conditioned. */
export function levelPoly(s: Surface, order: number, rect?: Rect): { z: Float64Array; coef: number[] } {
  const { nx, ny } = s, T = terms(order), k = T.length;
  const sx = (i: number) => (nx > 1 ? (2 * i) / (nx - 1) - 1 : 0), sy = (j: number) => (ny > 1 ? (2 * j) / (ny - 1) - 1 : 0);
  const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0), row = new Array(k);
  const R = rect ? normRect(rect, nx, ny) : { x0: 0, x1: nx - 1, y0: 0, y1: ny - 1 };
  if ((R.x1 - R.x0 + 1) * (R.y1 - R.y0 + 1) < k * 2) throw new Error('The levelling region is too small for this fit: make it bigger or use a lower order.');
  for (let j = R.y0; j <= R.y1; j++) for (let i = R.x0; i <= R.x1; i++) {
    const x = sx(i), y = sy(j), zz = s.z[j * nx + i];
    for (let t = 0; t < k; t++) row[t] = x ** T[t][0] * y ** T[t][1];
    for (let p = 0; p < k; p++) { b[p] += row[p] * zz; for (let q = p; q < k; q++) A[p][q] += row[p] * row[q]; }
  }
  for (let p = 0; p < k; p++) for (let q = 0; q < p; q++) A[p][q] = A[q][p];
  const coef = solve(A, b), z = new Float64Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = sx(i), y = sy(j);
    let f = 0; for (let t = 0; t < k; t++) f += coef[t] * x ** T[t][0] * y ** T[t][1];
    z[j * nx + i] = s.z[j * nx + i] - f;
  }
  return { z, coef };
}

/** Least-squares polynomial (order 0, 1 or 2) through evenly spaced values, subtracted; returns the residuals. */
export function detrend(v: ArrayLike<number>, order: number): number[] {
  const n = v.length, k = Math.min(order + 1, n);
  const x = (i: number) => (n > 1 ? (2 * i) / (n - 1) - 1 : 0);
  const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
  for (let i = 0; i < n; i++) for (let p = 0; p < k; p++) { b[p] += x(i) ** p * v[i]; for (let q = 0; q < k; q++) A[p][q] += x(i) ** (p + q); }
  const c = solve(A, b);
  return Array.from({ length: n }, (_, i) => v[i] - c.reduce((s, cc, p) => s + cc * x(i) ** p, 0));
}

/** Line-by-line flattening: remove a polynomial of the given order from each row (fast-scan line) separately. */
export function flattenLines(s: Surface, order: number): Float64Array {
  const z = new Float64Array(s.z.length);
  for (let j = 0; j < s.ny; j++) z.set(detrend(s.z.subarray(j * s.nx, (j + 1) * s.nx), order), j * s.nx);
  return z;
}

// ---------- parameters ----------
export type Areal = { n: number; mean: number; Sa: number; Sq: number; Ssk: number; Sku: number; Sp: number; Sv: number; Sz: number; min: number; max: number };
/** Height parameters about the mean of the values (ISO 25178 names). Ssk and Sku are 0 for a flat surface. */
export function areal(v: ArrayLike<number>): Areal {
  const n = v.length; let m = 0, mn = Infinity, mx = -Infinity;
  for (let i = 0; i < n; i++) { m += v[i]; if (v[i] < mn) mn = v[i]; if (v[i] > mx) mx = v[i]; }
  m /= n;
  let a = 0, s2 = 0, s3 = 0, s4 = 0;
  for (let i = 0; i < n; i++) { const d = v[i] - m; a += Math.abs(d); s2 += d * d; s3 += d * d * d; s4 += d * d * d * d; }
  const Sq = Math.sqrt(s2 / n);
  return { n, mean: m, Sa: a / n, Sq, Ssk: Sq > 0 ? s3 / n / Sq ** 3 : 0, Sku: Sq > 0 ? s4 / n / Sq ** 4 : 0, Sp: mx - m, Sv: m - mn, Sz: mx - mn, min: mn, max: mx };
}

export type ProfileP = { Ra: number; Rq: number; Rsk: number; Rku: number; Rp: number; Rv: number; Rt: number; Rz: number };
/** Profile parameters after taking off the least-squares straight line (ISO 4287 names, no λc filter).
 *  Rz is the mean over five equal sampling lengths of the highest peak plus deepest valley (Rt over the whole). */
export function profileParams(p: ArrayLike<number>): ProfileP {
  const r = detrend(p, 1), A = areal(r), n = r.length;
  let rz = 0, segs = 0;
  if (n >= 10) {
    for (let k = 0; k < 5; k++) {
      const a = Math.round((k * n) / 5), b = Math.round(((k + 1) * n) / 5);
      let hi = -Infinity, lo = Infinity; for (let i = a; i < b; i++) { if (r[i] > hi) hi = r[i]; if (r[i] < lo) lo = r[i]; }
      rz += hi - lo; segs++;
    }
  }
  return { Ra: A.Sa, Rq: A.Sq, Rsk: A.Ssk, Rku: A.Sku, Rp: A.Sp, Rv: A.Sv, Rt: A.Sz, Rz: segs ? rz / segs : A.Sz };
}

/** Mean of each profile parameter over every row of the image. */
export function rowsMean(s: Surface): ProfileP {
  const acc: ProfileP = { Ra: 0, Rq: 0, Rsk: 0, Rku: 0, Rp: 0, Rv: 0, Rt: 0, Rz: 0 };
  for (let j = 0; j < s.ny; j++) { const p = profileParams(s.z.subarray(j * s.nx, (j + 1) * s.nx)); (Object.keys(acc) as (keyof ProfileP)[]).forEach((k) => (acc[k] += p[k] / s.ny)); }
  return acc;
}

/** Height at fractional pixel (x, y) by bilinear interpolation. */
export function bilinear(s: Surface, x: number, y: number): number {
  const i = Math.max(0, Math.min(s.nx - 2, Math.floor(x))), j = Math.max(0, Math.min(s.ny - 2, Math.floor(y))), fx = x - i, fy = y - j;
  const z = s.z, n = s.nx;
  return (1 - fx) * (1 - fy) * z[j * n + i] + fx * (1 - fy) * z[j * n + i + 1] + (1 - fx) * fy * z[(j + 1) * n + i] + fx * fy * z[(j + 1) * n + i + 1];
}

/** Heights along a straight line between two pixel positions, one sample per pixel of length (at least 2). */
export function lineProfile(s: Surface, x0: number, y0: number, x1: number, y1: number): { dist: number[]; z: number[] } {
  const lenPx = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.ceil(lenPx) + 1);
  const L = Math.hypot((x1 - x0) * s.dx, (y1 - y0) * s.dy), dist: number[] = [], z: number[] = [];
  for (let k = 0; k < n; k++) { const t = k / (n - 1); dist.push(t * L); z.push(bilinear(s, x0 + t * (x1 - x0), y0 + t * (y1 - y0))); }
  return { dist, z };
}

export function regionValues(s: Surface, r: Rect): Float64Array {
  const R = normRect(r, s.nx, s.ny), out = new Float64Array((R.x1 - R.x0 + 1) * (R.y1 - R.y0 + 1));
  let k = 0; for (let j = R.y0; j <= R.y1; j++) for (let i = R.x0; i <= R.x1; i++) out[k++] = s.z[j * s.nx + i];
  return out;
}

/** Step height B − A from the mean heights of two regions, with each region's standard deviation (n − 1). */
export function stepHeight(s: Surface, a: Rect, b: Rect) {
  const st = (v: Float64Array) => { const A = areal(v); return { n: v.length, mean: A.mean, sd: v.length > 1 ? A.Sq * Math.sqrt(v.length / (v.length - 1)) : 0 }; };
  const A = st(regionValues(s, a)), B = st(regionValues(s, b));
  return { A, B, step: B.mean - A.mean, se: Math.sqrt(A.sd ** 2 / A.n + B.sd ** 2 / B.n) };
}

/** Histogram of heights: bin centres and counts. */
export function histogram(v: ArrayLike<number>, bins: number, lo?: number, hi?: number) {
  let mn = Infinity, mx = -Infinity; for (let i = 0; i < v.length; i++) { if (v[i] < mn) mn = v[i]; if (v[i] > mx) mx = v[i]; }
  lo ??= mn; hi ??= mx; if (!(hi > lo)) hi = lo + 1;
  const w = (hi - lo) / bins, c = new Array(bins).fill(0);
  for (let i = 0; i < v.length; i++) { const k = Math.min(bins - 1, Math.max(0, Math.floor((v[i] - lo) / w))); c[k]++; }
  return { centre: c.map((_, k) => lo! + (k + 0.5) * w), count: c, width: w };
}

/** "afmhot" style colour (black, brown, orange, yellow, white) for t in 0..1: r = 2t, g = 2t − ½, b = 2t − 1, clipped. */
export const afmhot = (t: number): [number, number, number] => { const c = (v: number) => Math.round(255 * Math.max(0, Math.min(1, v))); return [c(2 * t), c(2 * t - 0.5), c(2 * t - 1)]; };

/** Made-up example: 128 × 128 pixels over 5 × 5 µm. Grainy film (smoothed seeded noise, about 0.6 nm rms) on a
 *  tilted scan, with a 20 nm step on the right third (x ≥ 88 pixels). Heights in nm. */
export function exampleSurface(): Surface {
  const nx = 128, ny = 128;
  let seed = 2024;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 - 0.5; };
  const w = new Float64Array(nx * ny).map(() => rnd());
  const sm = new Float64Array(nx * ny), R = 2;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    let s = 0, c = 0;
    for (let b = -R; b <= R; b++) for (let a = -R; a <= R; a++) { const ii = i + a, jj = j + b; if (ii >= 0 && jj >= 0 && ii < nx && jj < ny) { s += w[jj * nx + ii]; c++; } }
    sm[j * nx + i] = s / c;
  }
  const z = new Float64Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = i / (nx - 1), y = j / (ny - 1);
    z[j * nx + i] = +(10 * sm[j * nx + i] + 12 * x - 6 * y + (i >= 88 ? 20 : 0) + 50).toFixed(3);
  }
  return { nx, ny, z, dx: 5 / (nx - 1), dy: 5 / (ny - 1) };
}
