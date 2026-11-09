// Digital modulation over an additive white Gaussian noise (AWGN) channel: Gray-coded BPSK, QPSK, 8-PSK, 16-QAM
// and 64-QAM constellations (average symbol energy 1), seeded noise, minimum-distance detection, and the
// theoretical bit and symbol error rates.
import { erfc } from './stats.ts';

export type Mod = 'bpsk' | 'qpsk' | '8psk' | '16qam' | '64qam';
export const ORDER: Record<Mod, number> = { bpsk: 2, qpsk: 4, '8psk': 8, '16qam': 16, '64qam': 64 };
export const gray = (n: number) => n ^ (n >> 1);
export const Q = (x: number) => 0.5 * erfc(x / Math.SQRT2);

export type Point = { i: number; q: number; bits: number };
/** The constellation, each point labelled with its Gray-coded bits (an integer, most significant bit first). */
export function constellation(mod: Mod): Point[] {
  const M = ORDER[mod];
  if (mod === 'bpsk') return [{ i: -1, q: 0, bits: 0 }, { i: 1, q: 0, bits: 1 }];
  if (mod === 'qpsk' || mod === '16qam' || mod === '64qam') {
    // Square QAM (QPSK is 4-QAM): Gray-coded PAM on each axis, first half of the bits on I.
    const L = Math.sqrt(M), kb = Math.log2(L), s = Math.sqrt((2 * (M - 1)) / 3), pts: Point[] = [];
    for (let a = 0; a < L; a++) for (let b = 0; b < L; b++) pts.push({ i: (2 * a - L + 1) / s, q: (2 * b - L + 1) / s, bits: (gray(a) << kb) | gray(b) });
    return pts;
  }
  // 8-PSK: point k at angle 2πk/8 carries the Gray code of k, so neighbours differ in one bit.
  return Array.from({ length: M }, (_, k) => ({ i: Math.cos((2 * Math.PI * k) / M), q: Math.sin((2 * Math.PI * k) / M), bits: gray(k) }));
}

/** mulberry32, so a seed always gives the same noise. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function gaussian(r: () => number) {
  let spare = NaN;
  return () => {
    if (!Number.isNaN(spare)) { const v = spare; spare = NaN; return v; }
    let u = 0; while (u === 0) u = r();
    const m = Math.sqrt(-2 * Math.log(u)), v = 2 * Math.PI * r();
    spare = m * Math.sin(v); return m * Math.cos(v);
  };
}
const popcount = (x: number) => { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; };

/** Send n random symbols at Eb/N0 (linear) and count errors. Noise per dimension has variance N0/2 with
 * N0 = Es / (k Eb/N0) and Es = 1 (BPSK uses the I axis only). Keeps up to `keep` received points for a plot. */
export function simulate(mod: Mod, ebn0: number, n: number, seed: number, keep = 0) {
  const pts = constellation(mod), M = pts.length, k = Math.log2(M), r = rng(seed), g = gaussian(r);
  const sigma = Math.sqrt(1 / (2 * k * ebn0));
  let bitErr = 0, symErr = 0;
  const rx: { i: number; q: number }[] = [];
  for (let t = 0; t < n; t++) {
    const s = pts[Math.min(M - 1, Math.floor(r() * M))];
    const yi = s.i + sigma * g(), yq = mod === 'bpsk' ? 0 : s.q + sigma * g();
    // Minimum-distance (maximum-likelihood) decision.
    let best = 0, bd = Infinity;
    for (let m = 0; m < M; m++) { const d = (yi - pts[m].i) ** 2 + (yq - pts[m].q) ** 2; if (d < bd) { bd = d; best = m; } }
    if (pts[best].bits !== s.bits) { symErr++; bitErr += popcount(pts[best].bits ^ s.bits); }
    if (rx.length < keep) rx.push({ i: yi, q: yq });
  }
  return { ber: bitErr / (n * k), ser: symErr / n, bitErr, symErr, bits: n * k, symbols: n, rx };
}

/** Exact BER of Gray-coded square M-QAM (Cho and Yoon, 2002). */
function qamBer(M: number, g: number) {
  const L = Math.sqrt(M), kb = Math.log2(L), arg = Math.sqrt((3 * Math.log2(M) * g) / (2 * (M - 1)));
  let total = 0;
  for (let kk = 1; kk <= kb; kk++) {
    let p = 0; const lim = (1 - 2 ** -kk) * L - 1;
    for (let i = 0; i <= lim; i++) {
      const f = Math.floor((i * 2 ** (kk - 1)) / L);
      p += (-1) ** f * (2 ** (kk - 1) - Math.floor((i * 2 ** (kk - 1)) / L + 0.5)) * erfc((2 * i + 1) * arg);
    }
    total += p / L;
  }
  return total / kb;
}
/** Exact symbol error rate of M-PSK by Craig's integral, (1/π) ∫₀^{(M−1)π/M} exp(−Es/N0 sin²(π/M) / sin²θ) dθ. */
function pskSer(M: number, es: number) {
  const top = ((M - 1) * Math.PI) / M, n = 2000, h = top / n, s2 = Math.sin(Math.PI / M) ** 2;
  const f = (th: number) => (th <= 0 ? 0 : Math.exp((-es * s2) / Math.sin(th) ** 2));
  let s = f(0) + f(top);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(i * h);
  return (s * h) / 3 / Math.PI;
}
/** Theoretical BER and SER at Eb/N0 (linear). BPSK, QPSK and square QAM are exact for Gray coding; for 8-PSK the
 * SER is exact and the BER is the Gray approximation SER / log2 M (tight at useful error rates). */
export function theory(mod: Mod, ebn0: number): { ber: number; ser: number; exactBer: boolean } {
  const M = ORDER[mod], k = Math.log2(M);
  if (mod === 'bpsk') { const p = Q(Math.sqrt(2 * ebn0)); return { ber: p, ser: p, exactBer: true }; }
  if (mod === 'qpsk') { const p = Q(Math.sqrt(2 * ebn0)); return { ber: p, ser: 1 - (1 - p) ** 2, exactBer: true }; }
  if (mod === '8psk') { const ser = pskSer(M, k * ebn0); return { ber: ser / k, ser, exactBer: false }; }
  const L = Math.sqrt(M), pl = 2 * (1 - 1 / L) * Q(Math.sqrt((3 * k * ebn0) / (M - 1)));
  return { ber: qamBer(M, ebn0), ser: 1 - (1 - pl) ** 2, exactBer: true };
}
/** Eb/N0 in dB that gives a target BER in theory (bisection). */
export function ebn0For(mod: Mod, ber: number) {
  let lo = -10, hi = 40;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (theory(mod, 10 ** (m / 10)).ber > ber) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
export const db = (x: number) => 10 ** (x / 10);
/** Wilson 95 % interval for an error rate from e errors in n trials. */
export function wilson(e: number, n: number, z = 1.959964): [number, number] {
  if (!(n > 0)) return [NaN, NaN];
  const p = e / n, d = 1 + (z * z) / n, c = (p + (z * z) / (2 * n)) / d, h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}
