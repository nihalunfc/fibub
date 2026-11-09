// Cryo-EM sampling and resolution sums: pixel size, Nyquist, dose, electron wavelength, CTF zeros, box size and
// the Rosenthal-Henderson particles-to-resolution relation. Plain maths, no DOM. Lengths are in ångström (Å)
// unless a name says otherwise; spatial frequency k is in 1/Å. Defocus is positive for underfocus.

/** Physical constants (CODATA 2018 exact or recommended values; general science facts). */
export const H = 6.62607015e-34; // Planck constant, J s
export const M0 = 9.1093837015e-31; // electron rest mass, kg
export const E = 1.602176634e-19; // elementary charge, C
export const C = 299792458; // speed of light, m/s

/** Relativistic electron wavelength in Å at an accelerating voltage in kV. */
export function wavelength(kV: number): number {
  const V = kV * 1e3;
  return (H / Math.sqrt(2 * M0 * E * V * (1 + (E * V) / (2 * M0 * C * C)))) * 1e10;
}
/** The same without the relativistic correction (to show how much it matters). */
export function wavelengthClassical(kV: number): number {
  return (H / Math.sqrt(2 * M0 * E * kV * 1e3)) * 1e10;
}

export type Sampling = {
  /** Pixel size at the specimen for one physical camera pixel (Å). */
  physical: number;
  /** Pixel size the movie is recorded at (half the physical one in super-resolution mode). */
  recorded: number;
  /** Pixel size after binning: the one you process at. */
  pixel: number;
  /** Nyquist limit (Å): twice the pixel size. */
  nyquist: number;
  /** Nyquist frequency (1/Å). */
  nyquistK: number;
};
/**
 * Pixel sizes from the camera pixel (µm) and magnification, or from a calibrated physical pixel size (Å) when
 * `calibrated` is given. Super-resolution halves the recorded pixel; binning by `bin` multiplies it.
 */
export function sampling(o: { detectorUm?: number; mag?: number; calibrated?: number; superRes?: boolean; bin?: number }): Sampling {
  const physical = o.calibrated != null && o.calibrated > 0 ? o.calibrated : ((o.detectorUm ?? NaN) * 1e4) / (o.mag ?? NaN);
  const recorded = o.superRes ? physical / 2 : physical;
  const pixel = recorded * (o.bin ?? 1);
  return { physical, recorded, pixel, nyquist: 2 * pixel, nyquistK: 1 / (2 * pixel) };
}

export type Dose = {
  /** Dose rate at the specimen, e⁻/Å²/s. */
  ratePerA2: number;
  total: number;
  perFrame: number;
  frameTime: number;
  /** Electrons per physical camera pixel in each frame. */
  perPixelFrame: number;
};
/** Dose from the dose rate per physical camera pixel (e⁻/px/s), the exposure time (s) and the number of frames. */
export function dose(ratePerPx: number, physicalPixel: number, seconds: number, frames: number): Dose {
  const ratePerA2 = ratePerPx / (physicalPixel * physicalPixel);
  const total = ratePerA2 * seconds;
  return { ratePerA2, total, perFrame: total / frames, frameTime: seconds / frames, perPixelFrame: (ratePerPx * seconds) / frames };
}
/** Exposure time (s) that gives a target total dose (e⁻/Å²). */
export const timeForDose = (target: number, ratePerPx: number, physicalPixel: number) => (target * physicalPixel * physicalPixel) / ratePerPx;
/** Whole number of frames that keeps each frame at or below a target dose per frame. */
export const framesForDose = (total: number, perFrame: number) => Math.max(1, Math.ceil(total / perFrame - 1e-9));

export type Optics = { kV: number; csMm: number; defocusUm: number; amp: number; bFactor?: number };
/** Phase shift χ(k) in radians: π λ Δf k² − (π/2) Cs λ³ k⁴, with Δf > 0 for underfocus. */
export function chi(k: number, o: Optics): number {
  const lam = wavelength(o.kV), df = o.defocusUm * 1e4, cs = o.csMm * 1e7;
  return Math.PI * lam * df * k * k - (Math.PI / 2) * cs * lam ** 3 * k ** 4;
}
/** Phase of the amplitude contrast: asin(A) for an amplitude contrast fraction A. */
export const ampPhase = (amp: number) => Math.asin(Math.min(1, Math.max(0, amp)));
/**
 * The contrast transfer function −sin(χ + φ) = −(√(1−A²) sin χ + A cos χ), times the envelope exp(−B k²/4) when a
 * B-factor is given. Negative at low frequency for underfocus (dark particles on a light background, as in most images).
 */
export function ctf(k: number, o: Optics): number {
  const v = -Math.sin(chi(k, o) + ampPhase(o.amp));
  return o.bFactor ? v * Math.exp((-o.bFactor * k * k) / 4) : v;
}
/**
 * Spatial frequencies (1/Å, rising) where the CTF is zero, up to kMax: χ(k) + φ = nπ. Solved exactly as a quadratic in
 * k² for each n; with spherical aberration χ turns over at high k, and both roots of each n are kept.
 */
export function ctfZeros(o: Optics, kMax: number): number[] {
  const lam = wavelength(o.kV), df = o.defocusUm * 1e4, cs = o.csMm * 1e7, phi = ampPhase(o.amp);
  const a = (Math.PI / 2) * cs * lam ** 3, b = Math.PI * lam * df; // χ = b u − a u², u = k²
  const out: number[] = [];
  const u2 = kMax * kMax;
  // χ(u) + φ = nπ for whole n; χ ranges over [χ(0), χ at u2] or past its top b²/4a.
  const top = a > 0 && b / (2 * a) < u2 ? (b * b) / (4 * a) : b * u2 - a * u2 * u2;
  const lo = Math.min(0, b * u2 - a * u2 * u2), hi = Math.max(0, top);
  for (let n = Math.ceil((lo + phi) / Math.PI - 1e-12); n <= Math.floor((hi + phi) / Math.PI + 1e-12); n++) {
    const t = n * Math.PI - phi; // b u − a u² = t
    const us: number[] = [];
    if (a === 0) { if (b !== 0) us.push(t / b); else continue; }
    else { const disc = b * b - 4 * a * t; if (disc < 0) continue; const s = Math.sqrt(disc); us.push((b - s) / (2 * a), (b + s) / (2 * a)); }
    for (const u of us) if (u > 1e-15 && u <= u2 * (1 + 1e-12)) out.push(Math.sqrt(u));
  }
  return [...new Set(out.map((k) => +k.toPrecision(12)))].sort((x, y) => x - y);
}
/** First CTF zero away from k = 0 (1/Å), or NaN if there is none below kMax. */
export const firstZero = (o: Optics, kMax = 10) => ctfZeros(o, kMax)[0] ?? NaN;

/**
 * How far the CTF spreads a detail of resolution d (Å) in the image: at most λ Δf / d + Cs λ³ / d³ (Å). Both terms
 * are added, which is the safe (larger) estimate whatever the signs.
 */
export function delocalisation(d: number, o: Optics): number {
  const lam = wavelength(o.kV), df = Math.abs(o.defocusUm) * 1e4, cs = o.csMm * 1e7;
  return (lam * df) / d + (cs * lam ** 3) / d ** 3;
}

/** The smallest even number ≥ n whose only prime factors are 2, 3 and 5 (fast Fourier transform sizes). */
export function goodBox(n: number): number {
  let m = Math.max(2, Math.ceil(n - 1e-9));
  for (;; m++) {
    if (m % 2) continue;
    let r = m;
    for (const p of [2, 3, 5]) while (r % p === 0) r /= p;
    if (r === 1) return m;
  }
}
export type BoxAdvice = { delocal: number; minA: number; boxA: number; boxPx: number; ruleLo: number; ruleHi: number };
/**
 * Box size for particles of diameter D (Å) at pixel size p: the particle plus the CTF spread on both sides at the
 * target resolution, and at least 1.5 × D (the common rule of thumb is 1.5 to 2 times the diameter); rounded up to an
 * FFT-friendly even size in pixels.
 */
export function boxAdvice(D: number, p: number, d: number, o: Optics): BoxAdvice {
  const delocal = delocalisation(d, o);
  const minA = Math.max(D + 2 * delocal, 1.5 * D);
  const boxPx = goodBox(minA / p);
  return { delocal, minA, boxA: boxPx * p, boxPx, ruleLo: goodBox((1.5 * D) / p), ruleHi: goodBox((2 * D) / p) };
}

/**
 * Rosenthal-Henderson: ln N = B / (2 d²) + const, so 1/d² = 1/d₀² + (2/B) ln(N/N₀) from one known point (N₀ particles
 * give d₀ Å) and a B-factor B (Å²).
 */
export function rhResolution(N: number, B: number, N0: number, d0: number): number {
  const inv = 1 / (d0 * d0) + (2 / B) * Math.log(N / N0);
  return inv > 0 ? 1 / Math.sqrt(inv) : Infinity;
}
/** Particles needed to reach resolution d (Å) on the same line. */
export const rhParticles = (d: number, B: number, N0: number, d0: number) => N0 * Math.exp((B / 2) * (1 / (d * d) - 1 / (d0 * d0)));
/** B-factor from two (particles, resolution) points: B = 2 ln(N₂/N₁) / (1/d₂² − 1/d₁²). */
export const rhB = (N1: number, d1: number, N2: number, d2: number) => (2 * Math.log(N2 / N1)) / (1 / (d2 * d2) - 1 / (d1 * d1));

/** CTF curve from k = 0 to kMax: n + 1 evenly spaced points. */
export function ctfCurve(o: Optics, kMax: number, n = 600): { k: number[]; ctf: number[]; env: number[] } {
  const k: number[] = [], c: number[] = [], env: number[] = [];
  for (let i = 0; i <= n; i++) { const x = (kMax * i) / n; k.push(x); c.push(ctf(x, o)); env.push(o.bFactor ? Math.exp((-o.bFactor * x * x) / 4) : 1); }
  return { k, ctf: c, env };
}

/** The page's made-up example: rounded numbers that are not from any one microscope, camera or paper. */
export const EXAMPLE = {
  detectorUm: 5, mag: 60000, superRes: true, bin: 2,
  ratePerPx: 15, seconds: 2.5, frames: 50,
  kV: 300, csMm: 2.7, amp: 0.1, defocusUm: 1.5,
  diameter: 150, target: 3,
  B: 100, N0: 20000, d0: 4,
};
