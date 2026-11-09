// Digital filter design: FIR by the window method (windowed sinc, as scipy.signal.firwin) and IIR Butterworth and
// Chebyshev type I by the bilinear transform with pre-warping (as scipy.signal.butter and cheby1), plus frequency
// response, group delay, polynomial roots for pole-zero plots, second-order sections and C-array export.
// Plain TypeScript, no DOM; checked against scipy.signal in tests/sci-tools/digital-filter-designer.mjs.
import { windowFn, type WindowName } from './eng-fft.ts';

export type C = [number, number];
const cadd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const csub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]];
const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const csqrt = (a: C): C => { const r = Math.hypot(a[0], a[1]); const re = Math.sqrt((r + a[0]) / 2), im = Math.sqrt(Math.max(0, (r - a[0]) / 2)); return [re, a[1] < 0 ? -im : im]; };
const cabs = (a: C) => Math.hypot(a[0], a[1]);
const cprod = (xs: C[]): C => xs.reduce((p, x) => cmul(p, x), [1, 0] as C);

export type BandType = 'lowpass' | 'highpass' | 'bandpass' | 'bandstop';

/** Modified Bessel function of the first kind, order 0 (power series). */
export function besselI0(x: number): number {
  let s = 1, t = 1;
  for (let k = 1; k < 500; k++) { t *= (x / (2 * k)) ** 2; s += t; if (t < s * 1e-17) break; }
  return s;
}
/** Symmetric Kaiser window (numpy.kaiser). */
export function kaiser(n: number, beta: number): Float64Array {
  const w = new Float64Array(n), d = besselI0(beta);
  for (let i = 0; i < n; i++) { const r = n === 1 ? 0 : (2 * i) / (n - 1) - 1; w[i] = besselI0(beta * Math.sqrt(Math.max(0, 1 - r * r))) / d; }
  return w;
}
/** Kaiser's formulas for the number of taps and β from the stop-band attenuation (dB) and transition width (fraction of Nyquist), as scipy.signal.kaiserord. */
export function kaiserord(atten: number, width: number): { taps: number; beta: number } {
  const A = Math.abs(atten);
  const beta = A > 50 ? 0.1102 * (A - 8.7) : A > 21 ? 0.5842 * (A - 21) ** 0.4 + 0.07886 * (A - 21) : 0;
  return { taps: Math.ceil((A - 7.95) / 2.285 / (Math.PI * width) + 1), beta };
}

export type FirWindow = WindowName | 'kaiser';
/**
 * Windowed-sinc FIR, the same as scipy.signal.firwin(taps, cutoff, window, pass_zero, scale=True, fs). Cut-offs in Hz.
 * High-pass and band-stop need an odd number of taps (a pass band at the Nyquist frequency).
 */
export function firwin(taps: number, cutoff: number[], fs: number, type: BandType, window: FirWindow = 'hamming', beta = 8.6): Float64Array {
  const nyq = fs / 2, c = cutoff.map((f) => f / nyq);
  if (c.some((x) => !(x > 0 && x < 1))) throw new Error('Cut-off frequencies must be between 0 and half the sample rate.');
  if ((type === 'highpass' || type === 'bandstop') && taps % 2 === 0) throw new Error('A high-pass or band-stop FIR needs an odd number of taps.');
  const passZero = type === 'lowpass' || type === 'bandstop', passNyq = type === 'highpass' || type === 'bandstop';
  const edges = [...(passZero ? [0] : []), ...c, ...(passNyq ? [1] : [])];
  const h = new Float64Array(taps), alpha = 0.5 * (taps - 1);
  const sinc = (x: number) => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));
  for (let b = 0; b < edges.length; b += 2) {
    const l = edges[b], r = edges[b + 1];
    for (let i = 0; i < taps; i++) { const m = i - alpha; h[i] += r * sinc(r * m) - l * sinc(l * m); }
  }
  const w = window === 'kaiser' ? kaiser(taps, beta) : windowFn(window, taps, false);
  for (let i = 0; i < taps; i++) h[i] *= w[i];
  const l0 = edges[0], r0 = edges[1], sf = l0 === 0 ? 0 : r0 === 1 ? 1 : (l0 + r0) / 2;
  let s = 0;
  for (let i = 0; i < taps; i++) s += h[i] * Math.cos(Math.PI * (i - alpha) * sf);
  for (let i = 0; i < taps; i++) h[i] /= s;
  return h;
}

export type Zpk = { z: C[]; p: C[]; k: number };
/** Analog Butterworth low-pass prototype (cut-off 1 rad/s). */
export function buttap(n: number): Zpk {
  const p: C[] = [];
  for (let m = -n + 1; m < n; m += 2) { const a = (Math.PI * m) / (2 * n); p.push([-Math.cos(a), -Math.sin(a)]); }
  return { z: [], p, k: 1 };
}
/** Analog Chebyshev type I prototype with rp dB of pass-band ripple (pass-band edge at 1 rad/s). */
export function cheb1ap(n: number, rp: number): Zpk {
  const eps = Math.sqrt(10 ** (0.1 * rp) - 1), mu = Math.asinh(1 / eps) / n, p: C[] = [];
  for (let m = -n + 1; m < n; m += 2) { const th = (Math.PI * m) / (2 * n); p.push([-Math.sinh(mu) * Math.cos(th), -Math.cosh(mu) * Math.sin(th)]); }
  let k = cprod(p.map((x) => [-x[0], -x[1]] as C))[0];
  if (n % 2 === 0) k /= Math.sqrt(1 + eps * eps);
  return { z: [], p, k };
}
function transform(f: Zpk, type: BandType, wo: number, bw: number): Zpk {
  const deg = f.p.length - f.z.length;
  if (type === 'lowpass') return { z: f.z.map((x) => [x[0] * wo, x[1] * wo]), p: f.p.map((x) => [x[0] * wo, x[1] * wo]), k: f.k * wo ** deg };
  if (type === 'highpass') {
    const k = f.k * cdiv(cprod(f.z.map((x) => [-x[0], -x[1]] as C)), cprod(f.p.map((x) => [-x[0], -x[1]] as C)))[0];
    return { z: [...f.z.map((x) => cdiv([wo, 0], x)), ...Array.from({ length: deg }, () => [0, 0] as C)], p: f.p.map((x) => cdiv([wo, 0], x)), k };
  }
  const split = (xs: C[]) => xs.flatMap((x) => { const r = csqrt(csub(cmul(x, x), [wo * wo, 0])); return [cadd(x, r), csub(x, r)]; });
  if (type === 'bandpass') {
    const s = (x: C): C => [(x[0] * bw) / 2, (x[1] * bw) / 2];
    return { z: [...split(f.z.map(s)), ...Array.from({ length: deg }, () => [0, 0] as C)], p: split(f.p.map(s)), k: f.k * bw ** deg };
  }
  const inv = (x: C) => cdiv([bw / 2, 0], x);
  const k = f.k * cdiv(cprod(f.z.map((x) => [-x[0], -x[1]] as C)), cprod(f.p.map((x) => [-x[0], -x[1]] as C)))[0];
  const zs: C[] = []; for (let i = 0; i < deg; i++) zs.push([0, wo], [0, -wo]);
  return { z: [...split(f.z.map(inv)), ...zs], p: split(f.p.map(inv)), k };
}
function bilinear(f: Zpk, fs: number): Zpk {
  const f2: C = [2 * fs, 0], deg = f.p.length - f.z.length;
  return {
    z: [...f.z.map((x) => cdiv(cadd(f2, x), csub(f2, x))), ...Array.from({ length: deg }, () => [-1, 0] as C)],
    p: f.p.map((x) => cdiv(cadd(f2, x), csub(f2, x))),
    k: f.k * cdiv(cprod(f.z.map((x) => csub(f2, x))), cprod(f.p.map((x) => csub(f2, x))))[0],
  };
}
/**
 * IIR design as scipy.signal.butter / cheby1 (output='zpk'): order n, edges in Hz (one, or two for band filters),
 * sample rate fs, ripple rp in dB for Chebyshev.
 */
export function iirDesign(kind: 'butter' | 'cheby1', n: number, edges: number[], fs: number, type: BandType, rp = 1): Zpk {
  const W = edges.map((f) => (2 * f) / fs);
  if (W.some((x) => !(x > 0 && x < 1))) throw new Error('Edge frequencies must be between 0 and half the sample rate.');
  const proto = kind === 'butter' ? buttap(n) : cheb1ap(n, rp);
  const warped = W.map((x) => 4 * Math.tan((Math.PI * x) / 2));
  const band = type === 'bandpass' || type === 'bandstop';
  const wo = band ? Math.sqrt(warped[0] * warped[1]) : warped[0], bw = band ? warped[1] - warped[0] : 0;
  return bilinear(transform(proto, type, wo, bw), 2);
}
/** Real polynomial coefficients (highest power first) from roots and a gain. */
export function poly(roots: C[], k = 1): number[] {
  let c: C[] = [[1, 0]];
  for (const r of roots) { const n: C[] = [...c.map((x) => [x[0], x[1]] as C), [0, 0]]; for (let i = 1; i < n.length; i++) n[i] = csub(n[i], cmul(r, c[i - 1])); c = n; }
  return c.map((x) => x[0] * k);
}
export function zpk2tf(f: Zpk): { b: number[]; a: number[] } { return { b: poly(f.z, f.k), a: poly(f.p) }; }

/**
 * Second-order sections [b0 b1 b2 1 a1 a2], pairing each pole pair (most resonant first, as is usual for fixed-point
 * work it is placed last) with the nearest zeros. Overall gain goes into the first section.
 */
export function zpk2sos(f: Zpk): number[][] {
  const take = (xs: C[]) => {
    // Complex roots as conjugate pairs (positive-imaginary member kept), reals sorted.
    const cx = xs.filter((x) => x[1] > 1e-10 * Math.max(1, cabs(x))), re = xs.filter((x) => Math.abs(x[1]) <= 1e-10 * Math.max(1, cabs(x))).map((x) => x[0]).sort((a, b) => Math.abs(b) - Math.abs(a));
    return { cx, re };
  };
  const P = take(f.p), Z = take(f.z);
  const pp: C[][] = [...P.cx.map((x) => [x, [x[0], -x[1]] as C])];
  for (let i = 0; i < P.re.length; i += 2) pp.push(P.re.slice(i, i + 2).map((x) => [x, 0] as C));
  pp.sort((a, b) => Math.max(...a.map(cabs)) - Math.max(...b.map(cabs)));
  const zleft: C[][] = [...Z.cx.map((x) => [x, [x[0], -x[1]] as C])];
  const zre = [...Z.re];
  const sos: number[][] = [];
  // Most resonant pole pair gets its nearest zeros first; build from the end.
  for (let i = pp.length - 1; i >= 0; i--) {
    const ps = pp[i], c = ps[0];
    let zs: C[] = [];
    if (zleft.length && (ps.length === 2 || !zre.length)) {
      let best = 0; zleft.forEach((z, j) => { if (cabs(csub(z[0], c)) < cabs(csub(zleft[best][0], c))) best = j; });
      zs = zleft.splice(best, 1)[0];
    } else {
      for (let j = 0; j < ps.length && zre.length; j++) { let best = 0; zre.forEach((z, m) => { if (Math.abs(z - c[0]) < Math.abs(zre[best] - c[0])) best = m; }); zs.push([zre.splice(best, 1)[0], 0]); }
    }
    const b = poly(zs), a = poly(ps);
    while (b.length < 3) b.push(0); while (a.length < 3) a.push(0);
    // poly gives highest power first in z, which equals the z^-1 coefficients padded at the end.
    sos.unshift([...b, ...a]);
  }
  // Any zeros left over (more zeros than pole pairs is impossible for these designs).
  if (sos.length) for (let j = 0; j < 3; j++) sos[0][j] *= f.k;
  return sos;
}

/** Complex response of b/a (coefficients of z^0, z^-1, ...) at angular frequency w (rad/sample). */
export function freqzAt(b: ArrayLike<number>, a: ArrayLike<number>, w: number): C {
  const ev = (c: ArrayLike<number>): C => { let re = 0, im = 0; for (let k = 0; k < c.length; k++) { re += c[k] * Math.cos(w * k); im -= c[k] * Math.sin(w * k); } return [re, im]; };
  return cdiv(ev(b), ev(a));
}
export type Response = { f: number[]; mag: number[]; db: number[]; phase: number[]; gd: number[] };
/** Response at n frequencies from 0 to fs/2: magnitude, dB, unwrapped phase (rad) and group delay (samples). */
export function response(sections: { b: ArrayLike<number>; a: ArrayLike<number> }[], fs: number, n = 512): Response {
  const f: number[] = [], mag: number[] = [], db: number[] = [], phase: number[] = [], gd: number[] = [];
  let prev = 0, off = 0;
  for (let i = 0; i < n; i++) {
    const w = (Math.PI * i) / (n - 1);
    let H: C = [1, 0], g = 0;
    for (const s of sections) { H = cmul(H, freqzAt(s.b, s.a, w)); g += groupDelay(s.b, w) - groupDelay(s.a, w); }
    const m = cabs(H), ph = Math.atan2(H[1], H[0]);
    if (i > 0) { const d = ph - prev; if (d > Math.PI) off -= 2 * Math.PI; else if (d < -Math.PI) off += 2 * Math.PI; }
    prev = ph;
    f.push((w / (2 * Math.PI)) * fs); mag.push(m); db.push(20 * Math.log10(Math.max(m, 1e-300))); phase.push(ph + off); gd.push(g);
  }
  return { f, mag, db, phase, gd };
}
/** Group delay of one polynomial c (coefficients of z^-k) at w: Re(Σ k c_k e^-jwk / Σ c_k e^-jwk). */
function groupDelay(c: ArrayLike<number>, w: number): number {
  let nr = 0, ni = 0, dr = 0, di = 0;
  for (let k = 0; k < c.length; k++) { const cs = Math.cos(w * k), sn = Math.sin(w * k); dr += c[k] * cs; di -= c[k] * sn; nr += k * c[k] * cs; ni -= k * c[k] * sn; }
  const d = dr * dr + di * di;
  return d < 1e-300 ? NaN : (nr * dr + ni * di) / d;
}

/** Roots of a real polynomial (highest power first) by the Aberth-Ehrlich method. */
export function roots(cIn: ArrayLike<number>): C[] {
  let c = Array.from(cIn);
  // Coefficients below 1e-14 of the largest are rounding noise (such as a sinc tap that lands on a zero crossing).
  const big = Math.max(0, ...c.map(Math.abs)), tiny = big * 1e-14;
  while (c.length && Math.abs(c[0]) <= tiny) c.shift();
  const out: C[] = [];
  while (c.length > 1 && Math.abs(c[c.length - 1]) <= tiny) { c.pop(); out.push([0, 0]); }
  const n = c.length - 1;
  if (n < 1) return out;
  const a = c.map((x) => x / c[0]);
  // Starting points on a circle of the Cauchy-bound radius, rotated off the axes.
  const rad = Math.min(1 + Math.max(...a.slice(1).map(Math.abs)), Math.max(...a.slice(1).map((x, i) => Math.abs(x) ** (1 / (i + 1)))) * 1.1) || 1;
  let z: C[] = Array.from({ length: n }, (_, k) => [rad * Math.cos((2 * Math.PI * k) / n + 0.4), rad * Math.sin((2 * Math.PI * k) / n + 0.4)]);
  const ev = (x: C): [C, C] => { let p: C = [1, 0], d: C = [0, 0]; for (let i = 1; i <= n; i++) { d = cadd(cmul(d, x), p); p = cadd(cmul(p, x), [a[i], 0]); } return [p, d]; };
  for (let it = 0; it < 500; it++) {
    let moved = 0;
    const nz = z.map((zi, i) => {
      const [p, d] = ev(zi);
      if (cabs(p) === 0 || cabs(d) === 0) return zi;
      const ratio = cdiv(p, d);
      let s: C = [0, 0];
      for (let j = 0; j < n; j++) if (j !== i) s = cadd(s, cdiv([1, 0], csub(zi, z[j])));
      const w = cdiv(ratio, csub([1, 0], cmul(ratio, s)));
      if (!Number.isFinite(w[0]) || !Number.isFinite(w[1])) return zi;
      moved = Math.max(moved, cabs(w) / Math.max(1, cabs(zi)));
      return csub(zi, w);
    });
    z = nz;
    if (moved < 1e-15) break;
  }
  return [...out, ...z.map((x) => [x[0], Math.abs(x[1]) < 1e-12 * Math.max(1, cabs(x)) ? 0 : x[1]] as C)];
}

/** Numbers for a C source file: full double precision, no trailing noise. */
export const cnum = (x: number) => { const s = x.toPrecision(17); return String(Number(s)) === String(x) ? String(x) : s; };
export function cArray(name: string, xs: ArrayLike<number>, perLine = 4, type = 'double'): string {
  const v = Array.from(xs, cnum), lines: string[] = [];
  for (let i = 0; i < v.length; i += perLine) lines.push('  ' + v.slice(i, i + perLine).join(', ') + (i + perLine < v.length ? ',' : ''));
  return `const ${type} ${name}[${xs.length}] = {\n${lines.join('\n')}\n};`;
}

/** Run a filter over a signal: direct form II transposed for b/a (a[0] = 1 after scaling), like scipy.signal.lfilter. */
export function lfilter(b: ArrayLike<number>, a: ArrayLike<number>, x: ArrayLike<number>): Float64Array {
  const n = Math.max(b.length, a.length), bb = new Float64Array(n), aa = new Float64Array(n), a0 = a[0];
  for (let i = 0; i < b.length; i++) bb[i] = b[i] / a0;
  for (let i = 0; i < a.length; i++) aa[i] = a[i] / a0;
  const zi = new Float64Array(n), y = new Float64Array(x.length);
  for (let t = 0; t < x.length; t++) {
    const yt = bb[0] * x[t] + zi[0];
    for (let i = 1; i < n; i++) zi[i - 1] = bb[i] * x[t] + (i < n - 1 ? zi[i] : 0) - aa[i] * yt;
    y[t] = yt;
  }
  return y;
}
