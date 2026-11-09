// MRI physics for teaching: the Bloch equations as rotations and relaxation (on resonance, hard pulses),
// steady-state signal formulas for spin echo, spoiled gradient echo and inversion recovery, and a 2D FFT for
// k-space. Plain TypeScript, no DOM. Tissue values in the tool are rounded and illustrative.

export type Vec = [number, number, number]; // Mx, My, Mz as fractions of M0
export type Tissue = { name: string; T1: number; T2: number; pd: number };
export type Seq = { kind: 'se' | 'gre' | 'ir'; TR: number; TE: number; flip: number; TI: number };

/** Rotate M about the x axis by a (degrees), as an RF pulse along x does. */
export function rotX(m: Vec, a: number): Vec {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return [m[0], m[1] * c + m[2] * s, -m[1] * s + m[2] * c];
}
/** Rotate M about the y axis by a (degrees). */
export function rotY(m: Vec, a: number): Vec {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return [m[0] * c - m[2] * s, m[1], m[0] * s + m[2] * c];
}
/** Free relaxation for time t (on resonance): transverse decays with T2, Mz recovers to 1 with T1. */
export function relax(m: Vec, t: number, T1: number, T2: number): Vec {
  const e1 = Math.exp(-t / T1), e2 = Math.exp(-t / T2);
  return [m[0] * e2, m[1] * e2, 1 - (1 - m[2]) * e1];
}
export const mxy = (m: Vec) => Math.hypot(m[0], m[1]);

/** Steady-state signal (fraction of M0, before proton density) from the closed-form textbook formulas. */
export function signalFormula(s: Seq, T1: number, T2: number): number {
  const E = (t: number) => Math.exp(-t / T1), e2 = Math.exp(-s.TE / T2);
  if (s.kind === 'se') return (1 - 2 * E(s.TR - s.TE / 2) + E(s.TR)) * e2;
  if (s.kind === 'gre') { const a = (s.flip * Math.PI) / 180, E1 = E(s.TR); return (Math.sin(a) * (1 - E1) / (1 - Math.cos(a) * E1)) * e2; }
  return (1 - 2 * E(s.TI) + E(s.TR)) * e2; // inversion recovery, signed (phase-sensitive)
}
/** Ernst angle (degrees): the flip angle giving the most spoiled gradient-echo signal. */
export const ernst = (TR: number, T1: number) => (Math.acos(Math.exp(-TR / T1)) * 180) / Math.PI;
/** Inversion time (ms) that nulls a tissue: TI = T1 ln(2 / (1 + exp(−TR/T1))). */
export const nullTI = (TR: number, T1: number) => T1 * Math.log(2 / (1 + Math.exp(-TR / T1)));

export type Run = { t: number[]; mz: number[]; mxy: number[]; echoes: number[]; echoT: number[] };
/**
 * Step the Bloch equations through n repetitions starting from equilibrium, sampling every dt ms. Transverse
 * magnetisation is spoiled (set to 0) at the end of every TR. Returns the curves and the echo at each TR.
 */
export function simulate(s: Seq, T1: number, T2: number, n = 4, dt = 0): Run {
  let m: Vec = [0, 0, 1];
  const out: Run = { t: [], mz: [], mxy: [], echoes: [], echoT: [] };
  const step = dt > 0 ? dt : s.TR / 200;
  let t0 = 0;
  const push = (t: number) => { out.t.push(t); out.mz.push(m[2]); out.mxy.push(mxy(m)); };
  const wait = (d: number) => { // relax for d ms, sampling on the way
    let left = d;
    while (left > 1e-12) { const h = Math.min(step, left); m = relax(m, h, T1, T2); left -= h; t0 += h; push(t0); }
  };
  push(0);
  for (let k = 0; k < n; k++) {
    const start = t0;
    if (s.kind === 'ir') { m = rotX(m, 180); push(t0); wait(s.TI); }
    let sign = 1;
    if (s.kind === 'se') {
      m = rotX(m, 90); push(t0); wait(s.TE / 2); m = rotY(m, 180); push(t0); wait(s.TE / 2);
    } else { sign = s.kind === 'ir' && m[2] < 0 ? -1 : 1; m = rotX(m, s.kind === 'gre' ? s.flip : 90); push(t0); wait(s.TE); }
    // Signed for inversion recovery: the sign follows Mz just before the 90° pulse (phase-sensitive display).
    out.echoes.push(sign * mxy(m)); out.echoT.push(t0);
    wait(Math.max(0, start + s.TR - t0));
    m = [0, 0, m[2]]; push(t0); // spoil
  }
  return out;
}
/** The steady-state echo by running the Bloch steps until it settles (independent of the formulas). */
export function steadyBloch(s: Seq, T1: number, T2: number): number {
  let m: Vec = [0, 0, 1], last = NaN;
  for (let k = 0; k < 10000; k++) {
    let e: number;
    if (s.kind === 'ir') { m = rotX(m, 180); m = relax(m, s.TI, T1, T2); }
    if (s.kind === 'se') { m = rotX(m, 90); m = relax(m, s.TE / 2, T1, T2); m = rotY(m, 180); m = relax(m, s.TE / 2, T1, T2); e = mxy(m); }
    else { const mzBefore = m[2]; m = rotX(m, s.kind === 'gre' ? s.flip : 90); m = relax(m, s.TE, T1, T2); e = s.kind === 'ir' ? Math.sign(mzBefore) * mxy(m) : mxy(m); }
    const pre = s.kind === 'ir' ? s.TI : 0;
    m = relax(m, s.TR - s.TE - pre, T1, T2); m = [0, 0, m[2]];
    if (Math.abs(e - last) < 1e-13) return e;
    last = e;
  }
  return last;
}

/** Checks a sequence's timings. Returns an error message or ''. */
export function seqProblem(s: Seq): string {
  if (!(s.TR > 0)) return 'Give a repetition time TR in ms (greater than 0).';
  if (!(s.TE > 0)) return 'Give an echo time TE in ms (greater than 0).';
  if (s.kind === 'ir' && !(s.TI > 0)) return 'Give an inversion time TI in ms (greater than 0).';
  const used = s.TE + (s.kind === 'ir' ? s.TI : 0);
  if (used >= s.TR) return s.kind === 'ir' ? 'TI + TE must be shorter than TR.' : 'TE must be shorter than TR.';
  if (s.kind === 'gre' && !(s.flip > 0 && s.flip <= 180)) return 'The flip angle must be between 0 and 180°.';
  return '';
}

// ---------- k-space ----------
/** In-place radix-2 FFT of complex arrays (re, im) of length a power of 2. inverse divides by n. */
export function fft(re: Float64Array, im: Float64Array, inverse = false) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
  if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}
/** 2D FFT of an N × N complex image stored row by row. */
export function fft2(re: Float64Array, im: Float64Array, N: number, inverse = false) {
  const r = new Float64Array(N), i2 = new Float64Array(N);
  for (let y = 0; y < N; y++) { r.set(re.subarray(y * N, y * N + N)); i2.set(im.subarray(y * N, y * N + N)); fft(r, i2, inverse); re.set(r, y * N); im.set(i2, y * N); }
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) { r[y] = re[y * N + x]; i2[y] = im[y * N + x]; }
    fft(r, i2, inverse);
    for (let y = 0; y < N; y++) { re[y * N + x] = r[y]; im[y * N + x] = i2[y]; }
  }
}
/** Swap quadrants so that k = 0 sits in the middle (numpy's fftshift for even N). */
export function shift(a: Float64Array, N: number): Float64Array {
  const o = new Float64Array(N * N), h = N / 2;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) o[((y + h) % N) * N + ((x + h) % N)] = a[y * N + x];
  return o;
}

/**
 * A head-like phantom on an N × N grid: 0 background, 1 an outer fat-like ring, 2 grey-matter-like,
 * 3 white-matter-like, 4 fluid-filled ventricles. Made up for the demonstration.
 */
export function phantom(N: number): Uint8Array {
  const lab = new Uint8Array(N * N);
  const inE = (x: number, y: number, cx: number, cy: number, a: number, b: number) => ((x - cx) / a) ** 2 + ((y - cy) / b) ** 2 <= 1;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = (i + 0.5) / N * 2 - 1, y = (j + 0.5) / N * 2 - 1;
    let v = 0;
    if (inE(x, y, 0, 0, 0.72, 0.9)) v = 1;
    if (inE(x, y, 0, 0, 0.64, 0.82)) v = 2;
    if (inE(x, y, 0, 0.02, 0.5, 0.66)) v = 3;
    if (inE(x, y, -0.16, -0.05, 0.08, 0.28) || inE(x, y, 0.16, -0.05, 0.08, 0.28)) v = 4;
    if (inE(x, y, 0.3, 0.38, 0.1, 0.1)) v = 2;
    lab[j * N + i] = v;
  }
  return lab;
}

export type KMask = 'full' | 'centre' | 'edges' | 'skip';
/** Mask over a centred k-space (index 0 at the corner, k = 0 at N/2). frac: radius kept (centre) or removed (edges), 0 to 1. */
export function kMask(N: number, kind: KMask, frac: number): Uint8Array {
  const m = new Uint8Array(N * N), h = N / 2;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const r = Math.hypot(x - h, y - h) / h;
    let keep = 1;
    if (kind === 'centre') keep = r <= frac ? 1 : 0;
    else if (kind === 'edges') keep = r > frac ? 1 : 0;
    else if (kind === 'skip') keep = (y - h) % 2 === 0 ? 1 : 0;
    m[y * N + x] = keep;
  }
  return m;
}
/**
 * Image → centred k-space → masked → reconstructed magnitude image. Returns log-magnitude k-space (centred),
 * the reconstruction and the share of k-space samples kept.
 */
export function kspaceDemo(img: Float64Array, N: number, kind: KMask, frac: number) {
  const re = Float64Array.from(img), im = new Float64Array(N * N);
  fft2(re, im, N);
  const kre = shift(re, N), kim = shift(im, N), mask = kMask(N, kind, frac);
  const mag = new Float64Array(N * N);
  let kept = 0;
  for (let i = 0; i < N * N; i++) { mag[i] = Math.log10(1 + Math.hypot(kre[i], kim[i])); if (!mask[i]) { kre[i] = 0; kim[i] = 0; } else kept++; }
  // Undo the shift (it is its own inverse for even N), then the inverse FFT.
  const ure = shift(kre, N), uim = shift(kim, N);
  fft2(ure, uim, N, true);
  const rec = new Float64Array(N * N);
  for (let i = 0; i < N * N; i++) rec[i] = Math.hypot(ure[i], uim[i]);
  return { kmag: mag, kmask: mask, rec, kept: kept / (N * N) };
}
