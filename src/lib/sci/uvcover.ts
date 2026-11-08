// Radio interferometer uv-coverage: baselines from antenna positions, uv tracks through an observation,
// resolution, largest scale and the synthesized beam (dirty beam) by FFT.

const D2R = Math.PI / 180, C = 299792458;

export type Antenna = { e: number; n: number; u?: number }; // metres east, north, up

/** Antennas from text: one per line, "east north [up]" in metres; a leading name is allowed. */
export function parseAntennas(text: string): Antenna[] {
  const out: Antenna[] = [];
  for (const line of text.split(/\r?\n/)) {
    const xs = line.replace(/,/g, ' ').trim().split(/\s+/).filter((t) => t !== '' && Number.isFinite(Number(t))).map(Number);
    if (xs.length >= 2) out.push({ e: xs[0], n: xs[1], u: xs[2] ?? 0 });
  }
  return out;
}

/** Y-shaped array: three arms 120° apart with antennas spaced by a power law, as many large arrays are laid out. */
export function yArray(perArm: number, armM: number, rotDeg = 5): Antenna[] {
  const out: Antenna[] = [];
  for (let k = 0; k < 3; k++) {
    const a = (rotDeg + k * 120) * D2R;
    for (let j = 1; j <= perArm; j++) { const r = armM * (j / perArm) ** 1.716; out.push({ e: r * Math.sin(a), n: r * Math.cos(a), u: 0 }); }
  }
  return out;
}
/** Antennas evenly spaced round a ring. */
export function ringArray(count: number, radiusM: number): Antenna[] {
  return Array.from({ length: count }, (_, k) => { const a = (2 * Math.PI * k) / count; return { e: radiusM * Math.sin(a), n: radiusM * Math.cos(a), u: 0 }; });
}
/** A straight east–west line, spacings given in metres. */
export function lineArray(positions: number[]): Antenna[] { return positions.map((e) => ({ e, n: 0, u: 0 })); }

export function baselines(ants: Antenna[]) {
  const out: { e: number; n: number; u: number; len: number }[] = [];
  for (let i = 0; i < ants.length; i++) for (let j = i + 1; j < ants.length; j++) {
    const e = ants[j].e - ants[i].e, n = ants[j].n - ants[i].n, u = (ants[j].u ?? 0) - (ants[i].u ?? 0);
    out.push({ e, n, u, len: Math.hypot(e, n, u) });
  }
  return out;
}

/** Elevation (degrees) of a source at declination dec at hour angle H (hours) from latitude lat. */
export const elevation = (lat: number, dec: number, H: number) => Math.asin(Math.sin(lat * D2R) * Math.sin(dec * D2R) + Math.cos(lat * D2R) * Math.cos(dec * D2R) * Math.cos(H * 15 * D2R)) / D2R;

/** uv points (in wavelengths) for hour angles h0..h1 (hours) in `steps` samples, skipping times below minEl. */
export function uvTracks(ants: Antenna[], lat: number, dec: number, freqHz: number, h0: number, h1: number, steps: number, minEl = 0) {
  const lam = C / freqHz, L = lat * D2R, d = dec * D2R, bl = baselines(ants);
  const xyz = bl.map((b) => [(-Math.sin(L) * b.n + Math.cos(L) * b.u) / lam, b.e / lam, (Math.cos(L) * b.n + Math.sin(L) * b.u) / lam]);
  const u: number[] = [], v: number[] = [], hUsed: number[] = [];
  for (let k = 0; k < steps; k++) {
    const H = steps === 1 ? h0 : h0 + ((h1 - h0) * k) / (steps - 1);
    if (elevation(lat, dec, H) < minEl) continue;
    hUsed.push(H);
    const h = H * 15 * D2R, sh = Math.sin(h), ch = Math.cos(h);
    for (const [X, Y, Z] of xyz) { u.push(sh * X + ch * Y); v.push(-Math.sin(d) * ch * X + Math.sin(d) * sh * Y + Math.cos(d) * Z); }
  }
  return { u, v, hours: hUsed, lam, baselines: bl };
}

/** In-place radix-2 FFT of complex arrays (length a power of two). */
export function fft(re: Float64Array, im: Float64Array, inverse = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2, tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}

/** Dirty beam: uv points (and their mirror images) gridded with natural weighting, Fourier transformed.
 *  Returns an N×N image normalised to a peak of 1 and its pixel size in arcseconds. */
export function dirtyBeam(u: number[], v: number[], N = 256, cellArcsec?: number) {
  let umax = 1e-9; for (let k = 0; k < u.length; k++) umax = Math.max(umax, Math.abs(u[k]), Math.abs(v[k]));
  // About 4 pixels across the beam unless told otherwise.
  const cell = cellArcsec ?? (206264.806 / umax) / 4, du = 1 / (N * (cell / 206264.806));
  const re = new Float64Array(N * N), im = new Float64Array(N * N);
  const add = (uu: number, vv: number) => { const i = Math.round(uu / du), j = Math.round(vv / du); if (Math.abs(i) >= N / 2 || Math.abs(j) >= N / 2) return; re[((j + N) % N) * N + ((i + N) % N)] += 1; };
  for (let k = 0; k < u.length; k++) { add(u[k], v[k]); add(-u[k], -v[k]); }
  // 2-D FFT: rows then columns.
  const rr = new Float64Array(N), ri = new Float64Array(N);
  for (let y = 0; y < N; y++) { for (let x = 0; x < N; x++) { rr[x] = re[y * N + x]; ri[x] = im[y * N + x]; } fft(rr, ri, true); for (let x = 0; x < N; x++) { re[y * N + x] = rr[x]; im[y * N + x] = ri[x]; } }
  for (let x = 0; x < N; x++) { for (let y = 0; y < N; y++) { rr[y] = re[y * N + x]; ri[y] = im[y * N + x]; } fft(rr, ri, true); for (let y = 0; y < N; y++) { re[y * N + x] = rr[y]; im[y * N + x] = ri[y]; } }
  // Shift the centre to the middle and normalise.
  const img = new Float64Array(N * N), peak = re[0] || 1;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) img[((y + N / 2) % N) * N + ((x + N / 2) % N)] = re[y * N + x] / peak;
  return { img, N, cell };
}

/** Half-power widths of the beam's main lobe along x (east–west) and y (north–south), arcseconds. */
export function beamWidth(b: { img: Float64Array; N: number; cell: number }) {
  const { img, N, cell } = b, c = N / 2;
  const half = (dx: number, dy: number) => { let k = 0; while (k < c - 1 && img[(c + dy * k) * N + (c + dx * k)] > 0.5) k++; const a = img[(c + dy * (k - 1)) * N + (c + dx * (k - 1))], z = img[(c + dy * k) * N + (c + dx * k)]; return (k - 1 + (a - 0.5) / (a - z)) * cell; };
  return { ew: half(1, 0) + half(-1, 0), ns: half(0, 1) + half(0, -1) };
}

/** Angular resolution ~ λ/Bmax and largest recoverable scale ~ 0.6 λ/Bmin, in arcseconds; primary beam FWHM 1.13 λ/D. */
export function scales(freqHz: number, bmin: number, bmax: number, dish: number) {
  const lam = C / freqHz, as = 206264.806;
  return { lam, resolution: (lam / bmax) * as, largest: (0.6 * lam / bmin) * as, primaryBeam: (1.13 * lam / dish) * as };
}
