// Synthetic galaxy pictures for morphology practice: Sérsic bulges and ellipticals, exponential discs, logarithmic
// spiral arms, bars, star-forming knots and irregulars, drawn from a seed so the same numbers always give the same
// picture. Also the Hubble-type rules the page uses (ellipticity class En with n = 10(1 − b/a), stage from bulge share
// and arm pitch, bar or no bar), image moments, and the cues the quiz explains. Plain maths, no DOM.
// All class boundaries and ranges here are rounded teaching values made up by fibub, not taken from any catalogue.

// ---------- special functions ----------
const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
/** ln Γ(x) for x > 0 (Lanczos, g = 7). */
export function lnGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  x -= 1;
  let a = LANCZOS[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
/** Regularised lower incomplete gamma P(a, x) = γ(a, x) / Γ(a). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  const lg = a * Math.log(x) - x - lnGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, term = sum;
    for (let k = 1; k < 1000; k++) { term *= x / (a + k); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-16) break; }
    return sum * Math.exp(lg);
  }
  // Continued fraction for Q(a, x) (modified Lentz).
  const tiny = 1e-300;
  let b = x + 1 - a, c = 1 / tiny, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return 1 - Math.exp(lg) * h;
}

// ---------- Sérsic profile ----------
/** b_n such that half the light of a Sérsic profile lies inside the effective radius: P(2n, b) = 1/2. */
export function sersicB(n: number): number {
  if (!(n > 0)) return NaN;
  let lo = 0, hi = 2 * n + 10;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (gammaP(2 * n, m) < 0.5) lo = m; else hi = m; if (hi - lo < 1e-14 * hi) break; }
  return (lo + hi) / 2;
}
/** Sérsic surface brightness I(R) = Ie·exp(−b_n[(R/Re)^(1/n) − 1]). */
export function sersic(R: number, Ie: number, Re: number, n: number, b = sersicB(n)): number {
  return Ie * Math.exp(-b * (Math.pow(R / Re, 1 / n) - 1));
}
/** Total light of a Sérsic profile with axis ratio q: 2π q n Re² Ie e^b Γ(2n) / b^(2n). */
export function sersicTotal(Ie: number, Re: number, n: number, q = 1, b = sersicB(n)): number {
  return 2 * Math.PI * q * n * Re * Re * Ie * Math.exp(b + lnGamma(2 * n) - 2 * n * Math.log(b));
}
/** Share of a Sérsic profile's light inside radius R (on the major axis). */
export function sersicFraction(R: number, Re: number, n: number, b = sersicB(n)): number {
  return gammaP(2 * n, b * Math.pow(R / Re, 1 / n));
}

// ---------- shapes on the sky ----------
/** Ellipticity class: En with n = 10(1 − b/a), rounded, from E0 (round) to E7 (the flattest seen). */
export function ellipClass(q: number): number {
  return Math.min(7, Math.max(0, Math.round(10 * (1 - q) + 1e-9)));
}
/** Apparent axis ratio of a thin oblate disc of intrinsic thickness q0 tilted by i degrees (0 = face-on). */
export function apparentQ(inclDeg: number, q0: number): number {
  const c = Math.cos((inclDeg * Math.PI) / 180), s = Math.sin((inclDeg * Math.PI) / 180);
  return Math.sqrt(c * c + q0 * q0 * s * s);
}
/** Tilt (degrees) from the apparent axis ratio q of a disc of thickness q0, the inverse of apparentQ. */
export function inclinationFromQ(q: number, q0: number): number {
  if (q >= 1) return 0;
  if (q <= q0) return 90;
  return (Math.acos(Math.sqrt((q * q - q0 * q0) / (1 - q0 * q0))) * 180) / Math.PI;
}
/** Radius at angle θ (radians) along a logarithmic spiral r = r0·e^(θ·tan φ), φ the pitch angle in degrees. */
export function logSpiral(theta: number, r0: number, pitchDeg: number): number {
  return r0 * Math.exp(theta * Math.tan((pitchDeg * Math.PI) / 180));
}
/** Pitch angle (degrees) between two points on one arm: tan φ = ln(r2/r1) / (θ2 − θ1). */
export function pitchFromPoints(r1: number, t1: number, r2: number, t2: number): number {
  return (Math.atan(Math.log(r2 / r1) / (t2 - t1)) * 180) / Math.PI;
}

// ---------- random numbers ----------
/** Small seeded generator (mulberry32): the same seed always gives the same numbers. */
export function rng(seed: number): () => number {
  let a = (Math.floor(seed) >>> 0) ^ 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r: () => number) => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
const between = (r: () => number, a: number, b: number) => a + (b - a) * r();

// ---------- parameters and classes ----------
export type Family = 'E' | 'S0' | 'S' | 'Irr';
export type GalaxyParams = {
  family: Family;
  q: number;        // ellipticals: apparent axis ratio b/a (0.3 to 1)
  n: number;        // Sérsic index of the elliptical or the bulge
  re: number;       // effective radius of the elliptical or bulge, as a share of half the picture
  bt: number;       // bulge-to-total light (disc galaxies)
  h: number;        // disc scale length, as a share of half the picture
  pitch: number;    // arm pitch angle, degrees
  arms: number;     // number of arms
  arm: number;      // arm strength 0 to 1 (share of disc light in the arms)
  bar: number;      // bar strength 0 to 1 (0 = no bar)
  barLen: number;   // bar half-length in disc scale lengths
  clumps: number;   // star-forming knots 0 to 1
  incl: number;     // disc tilt, degrees (0 = face-on)
  pa: number;       // turn of the long axis, degrees anticlockwise from the horizontal
  noise: number;    // sky noise 0 to 1
  seed: number;
  flip?: boolean;   // arms wind the other way
};
export const CLASSES = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'S0', 'Sa', 'Sb', 'Sc', 'SBa', 'SBb', 'SBc', 'Irr'] as const;
export const BROAD = ['E', 'S0', 'S', 'SB', 'Irr'] as const;
export const BAR_MIN = 0.35;
/** Rounded teaching ranges used for the stage letter (made up by fibub, overlapping real practice only roughly). */
export const STAGE = {
  bt: [0.35, 0.15],     // bulge share: a at or above 0.35, b from 0.15, c below 0.15
  pitch: [12, 20],      // arm pitch: a below 12°, b from 12° to 20°, c at or above 20°
};
const stageBT = (bt: number) => (bt >= STAGE.bt[0] ? 0 : bt >= STAGE.bt[1] ? 1 : 2);
const stagePitch = (p: number) => (p < STAGE.pitch[0] ? 0 : p < STAGE.pitch[1] ? 1 : 2);
const LETTER = ['a', 'ab', 'b', 'bc', 'c'];

/** The class the page gives these settings: En, S0 (SB0 with a bar), S or SB with a stage letter, or Irr. */
export function classify(p: GalaxyParams): string {
  if (p.family === 'Irr') return 'Irr';
  if (p.family === 'E') return 'E' + ellipClass(p.q);
  const barred = p.bar >= BAR_MIN;
  if (p.family === 'S0' || p.arm <= 0) return barred ? 'SB0' : 'S0';
  return (barred ? 'SB' : 'S') + LETTER[stageBT(p.bt) + stagePitch(p.pitch)];
}
/** The broad group of a detailed class. */
export function broad(cls: string): string {
  if (cls === 'Irr') return 'Irr';
  if (cls[0] === 'E') return 'E';
  if (cls === 'S0' || cls === 'SB0') return 'S0';
  return cls.startsWith('SB') ? 'SB' : 'S';
}

/** Settings in the middle of a class, for the explorer's presets. */
export function preset(cls: string, seed = 1): GalaxyParams {
  const base: GalaxyParams = { family: 'S', q: 1, n: 4, re: 0.08, bt: 0.25, h: 0.15, pitch: 16, arms: 2, arm: 0.7, bar: 0, barLen: 2.2, clumps: 0.3, incl: 30, pa: 20, noise: 0.3, seed };
  if (cls[0] === 'E') { const k = Number(cls.slice(1)); return { ...base, family: 'E', q: Math.round((1 - k / 10) * 100) / 100, n: 4, re: 0.16, bt: 1, arm: 0, clumps: 0, incl: 0 }; }
  if (cls === 'S0' || cls === 'SB0') return { ...base, family: 'S0', bt: 0.4, n: 3, arm: 0, clumps: 0, incl: 60, bar: cls === 'SB0' ? 0.8 : 0 };
  if (cls === 'Irr') return { ...base, family: 'Irr', bt: 0, arm: 0, clumps: 0.8, incl: 30 };
  const st = cls.replace(/^SB?/, ''), bar = cls.startsWith('SB') ? 0.8 : 0;
  const S: Record<string, Partial<GalaxyParams>> = {
    a: { bt: 0.5, n: 3.5, re: 0.08, pitch: 8, arm: 0.5, clumps: 0.05 },
    b: { bt: 0.25, n: 2.5, re: 0.06, pitch: 16, arm: 0.7, clumps: 0.3 },
    c: { bt: 0.07, n: 1.5, re: 0.045, pitch: 26, arm: 0.8, clumps: 0.7 },
  };
  return { ...base, ...S[st], bar };
}

/** A random galaxy of the given class, with settings spread inside the class (classify gives the class back). */
export function randomOf(cls: string, seed: number): GalaxyParams {
  const r = rng(seed * 7919 + 13);
  const pa = Math.round(between(r, 0, 180)), noise = Math.round(between(r, 0.15, 0.6) * 100) / 100;
  if (cls[0] === 'E') {
    const k = Number(cls.slice(1));
    const lo = k === 0 ? 0.97 : 1 - (k + 0.4) / 10, hi = k === 0 ? 1 : 1 - (k - 0.4) / 10;
    return { ...preset(cls, seed), q: Math.round(between(r, Math.max(0.3, lo), hi) * 100) / 100, n: Math.round(between(r, 3, 5.5) * 10) / 10, re: between(r, 0.1, 0.2), pa, noise, seed };
  }
  const incl = Math.round(between(r, 0, 60));
  if (cls === 'S0') return { ...preset(cls, seed), bt: Math.round(between(r, 0.3, 0.55) * 100) / 100, n: Math.round(between(r, 2.5, 4) * 10) / 10, re: between(r, 0.05, 0.09), h: between(r, 0.13, 0.18), incl: Math.round(between(r, 40, 75)), pa, noise, seed };
  if (cls === 'Irr') return { ...preset(cls, seed), clumps: Math.round(between(r, 0.5, 1) * 100) / 100, h: between(r, 0.12, 0.2), incl, pa, noise, seed };
  const st = cls.replace(/^SB?/, '');
  const R: Record<string, [number, number, number, number, number, number]> = {
    // bt range, pitch range, clumps range
    a: [0.4, 0.6, 6, 10.5, 0, 0.12],
    b: [0.18, 0.32, 13, 19, 0.15, 0.4],
    c: [0.03, 0.12, 21, 30, 0.5, 0.9],
  };
  const [b0, b1, p0, p1, c0, c1] = R[st];
  const barred = cls.startsWith('SB');
  return {
    ...preset(cls, seed),
    bt: Math.round(between(r, b0, b1) * 100) / 100, pitch: Math.round(between(r, p0, p1)),
    clumps: Math.round(between(r, c0, c1) * 100) / 100, arms: st === 'c' && r() < 0.3 ? 3 : 2,
    arm: Math.round(between(r, 0.5, 0.85) * 100) / 100, bar: barred ? Math.round(between(r, 0.6, 1) * 100) / 100 : 0,
    barLen: between(r, 1.8, 2.6), h: between(r, 0.13, 0.17), incl, pa, noise, seed, flip: r() < 0.5,
  };
}

/** Question k of a quiz round: a class (ellipticals a quarter of the time, spirals and barred spirals a quarter each,
 *  S0 a tenth, irregulars the rest) and a galaxy of it. The same round and k always give the same galaxy. */
export function quizItem(round: number, k: number): { cls: string; params: GalaxyParams } {
  const seed = ((Math.floor(round) * 1000003) ^ (k * 2654435761)) >>> 0;
  const r = rng(seed);
  const u = r();
  let cls: string;
  if (u < 0.25) cls = 'E' + Math.min(7, Math.floor(r() * 8));
  else if (u < 0.35) cls = 'S0';
  else if (u < 0.6) cls = 'S' + 'abc'[Math.min(2, Math.floor(r() * 3))];
  else if (u < 0.85) cls = 'SB' + 'abc'[Math.min(2, Math.floor(r() * 3))];
  else cls = 'Irr';
  return { cls, params: randomOf(cls, (seed % 1000000) + 1) };
}

// ---------- drawing ----------
export type Render = {
  size: number;
  old: Float32Array;    // light of older stars: bulge, bar, smooth disc (or the whole elliptical)
  young: Float32Array;  // light of young stars: spiral arms and knots
  sky: Float32Array;    // noise added on top
  sums: { bulge: number; disc: number; bar: number; arms: number; knots: number };
};
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Draw the galaxy on a size × size grid. Pixel (i, j) has its centre at X = 2(i + ½)/size − 1, Y = 1 − 2(j + ½)/size
 *  (half the picture is 1). Light is in units of the galaxy's total light per unit area. */
export function renderGalaxy(p: GalaxyParams, size: number): Render {
  const N = size * size, old = new Float32Array(N), young = new Float32Array(N), sky = new Float32Array(N);
  const sums = { bulge: 0, disc: 0, bar: 0, arms: 0, knots: 0 };
  const r = rng(p.seed * 31 + 7);
  const pa = (p.pa * Math.PI) / 180, ca = Math.cos(pa), sa = Math.sin(pa);
  const px = 2 / size, pxA = px * px;
  const coords = (i: number, j: number) => { const X = (2 * (i + 0.5)) / size - 1, Y = 1 - (2 * (j + 0.5)) / size; return [X * ca + Y * sa, -X * sa + Y * ca]; };

  if (p.family === 'E') {
    const b = sersicB(p.n), q = Math.max(0.05, Math.min(1, p.q));
    const Ie = 1 / sersicTotal(1, p.re, p.n, q, b);
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const [u, v] = coords(i, j), m = Math.hypot(u, v / q);
      const I = sersic(m, Ie, p.re, p.n, b); old[j * size + i] = I; sums.bulge += I * pxA;
    }
  } else if (p.family === 'Irr') {
    // A lopsided faint disc plus big and small knots scattered around a shifted centre.
    const cq = apparentQ(p.incl, 0.3), ox = gauss(r) * 0.08, oy = gauss(r) * 0.08;
    const h = p.h, I0 = (1 - 0.6 * p.clumps) / (2 * Math.PI * h * h);
    const knots: [number, number, number, number][] = [];
    const nk = 10 + Math.round(30 * p.clumps), lk = 0.6 * p.clumps;
    let wsum = 0;
    for (let k = 0; k < nk; k++) { const w = 0.3 + r() * r() * 3; knots.push([gauss(r) * 0.22 + ox, gauss(r) * 0.16 + oy, 0.012 + r() * r() * 0.04, w]); wsum += w; }
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const [u, v] = coords(i, j), x = u - ox, y = (v - oy) / cq;
      const lop = 1 + 0.35 * Math.cos(Math.atan2(y, x) - 1.3);
      const I = (I0 / cq) * Math.exp(-Math.hypot(x, y) / h) * lop;
      let K = 0;
      for (const [kx, ky, s, w] of knots) { const d2 = (u - kx) ** 2 + (v - ky) ** 2; if (d2 < 25 * s * s) K += ((lk * w) / wsum / (2 * Math.PI * s * s)) * Math.exp(-d2 / (2 * s * s)); }
      old[j * size + i] = I; young[j * size + i] = K; sums.disc += I * pxA; sums.knots += K * pxA;
    }
  } else {
    // Disc galaxy: Sérsic bulge, exponential disc, optional bar and logarithmic spiral arms with knots.
    const bt = Math.max(0, Math.min(1, p.bt)), q0 = 0.12, cosE = apparentQ(p.incl, q0), qb = apparentQ(p.incl, 0.65);
    const b = sersicB(p.n), Ie = bt / sersicTotal(1, p.re, p.n, qb, b);
    const h = p.h, fbar = p.bar > 0 ? 0.4 * p.bar : 0, spiral = p.family === 'S' && p.arm > 0;
    const kf = spiral ? 0.15 * p.clumps : 0;
    const Ldisc = (1 - bt) * (1 - fbar) * (1 - kf);
    const I0 = Ldisc / (2 * Math.PI * h * h);
    const ab = p.barLen * h, bb = 0.25 * ab, Ib = ((1 - bt) * fbar) / ((Math.PI * ab * bb) / 2);
    const s = spiral ? Math.min(1, Math.max(0, p.arm)) : 0, m = Math.max(1, Math.round(p.arms));
    const tanP = Math.tan((Math.max(3, p.pitch) * Math.PI) / 180), sense = p.flip ? -1 : 1;
    const rIn = p.bar >= BAR_MIN ? ab : 0.8 * h, MEAN = 20 / 64; // mean of ((1 + cos)/2)^3 over a turn
    const barAng = between(r, 0, Math.PI);
    const cb = Math.cos(barAng), sb = Math.sin(barAng);
    // Knots on the arms.
    const knots: [number, number, number, number][] = [];
    if (kf > 0) {
      const nk = 10 + Math.round(40 * p.clumps); let wsum = 0;
      for (let k = 0; k < nk; k++) {
        const arm = Math.floor(r() * m), rr = rIn * (1.1 + r() * 2.2) + 0.5 * h * r();
        const th = sense * (Math.log(rr / rIn) / tanP + (2 * Math.PI * arm) / m) + barAng + gauss(r) * 0.08;
        const x = rr * Math.cos(th), y = rr * Math.sin(th), w = 0.3 + r() * r() * 2; wsum += w;
        knots.push([x, y, 0.008 + r() * 0.012, w]);
      }
      knots.forEach((k) => (k[3] *= ((1 - bt) * (1 - fbar) * kf) / wsum));
    }
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const [u, v] = coords(i, j), x = u, y = v / cosE, R = Math.hypot(x, y), idx = j * size + i;
      const bul = bt > 0 ? sersic(Math.hypot(u, v / qb), Ie, p.re, p.n, b) : 0;
      const dsk = (I0 / cosE) * Math.exp(-R / h);
      // Arms move a share s of the disc light (fading in outside the bar or bulge) into a logarithmic spiral
      // pattern whose average over a turn is 1, so the total light, and so the bulge-to-total, stay the same.
      let armL = 0, smoothL = dsk;
      if (s > 0 && R > 0) {
        const th = Math.atan2(y, x);
        const phase = m * (th - barAng - (sense * Math.log(R / rIn)) / tanP);
        const pat = ((1 + Math.cos(phase)) / 2) ** 3 / MEAN;
        const fs = s * smooth((R - 0.6 * rIn) / (0.6 * rIn));
        armL = dsk * fs * pat; smoothL = dsk * (1 - fs);
      }
      let br = 0;
      if (fbar > 0) {
        const xb = x * cb + y * sb, yb = -x * sb + y * cb, mm = (xb / ab) ** 2 + (yb / bb) ** 2;
        if (mm < 1) br = (Ib / cosE) * (1 - mm);
      }
      let K = 0;
      for (const [kx, ky, ks, w] of knots) { const d2 = (x - kx) ** 2 + (y - ky) ** 2; if (d2 < 25 * ks * ks) K += (w / (2 * Math.PI * ks * ks) / cosE) * Math.exp(-d2 / (2 * ks * ks)); }
      old[idx] = bul + br + smoothL;
      young[idx] = armL + K;
      sums.bulge += bul * pxA; sums.bar += br * pxA; sums.disc += smoothL * pxA; sums.arms += armL * pxA; sums.knots += K * pxA;
    }
  }
  // Sky noise: Gaussian, scaled to the galaxy's own brightness so the setting means the same for every galaxy.
  const ref = refLevel(old, young);
  const nr = rng(p.seed * 17 + 3), sd = Math.max(0, p.noise) * 0.04 * ref;
  if (sd > 0) for (let k = 0; k < N; k++) sky[k] = gauss(nr) * sd;
  return { size, old, young, sky, sums };
}
/** Brightness level used for the stretch: the 99.5th percentile of the light. */
export function refLevel(old: Float32Array, young: Float32Array): number {
  const t = new Float32Array(old.length);
  for (let k = 0; k < t.length; k++) t[k] = old[k] + young[k];
  t.sort();
  return t[Math.min(t.length - 1, Math.floor(0.995 * t.length))] || 1;
}

/** Colour picture: an asinh stretch of all the light, tinted warm for old stars and blue-white for young ones. */
export function toRGBA(rd: Render, softness = 0.04): Uint8ClampedArray {
  const { old, young, sky, size } = rd, N = size * size, out = new Uint8ClampedArray(N * 4);
  const ref = refLevel(old, young), norm = Math.asinh(1 / softness);
  const WARM = [255, 228, 190], COOL = [175, 205, 255];
  for (let k = 0; k < N; k++) {
    const tot = old[k] + young[k], t = tot > 0 ? young[k] / tot : 0;
    const g = Math.max(0, Math.min(1, Math.asinh((tot + sky[k]) / ref / softness) / norm));
    for (let c = 0; c < 3; c++) out[k * 4 + c] = Math.round(g * (WARM[c] + (COOL[c] - WARM[c]) * t));
    out[k * 4 + 3] = 255;
  }
  return out;
}

/** Light-weighted second moments of an image: axis ratio b/a of the light and the turn of its long axis (degrees,
 *  anticlockwise from the horizontal, 0 to 180). Pixels below `floor` are left out. */
export function moments(img: ArrayLike<number>, size: number, floor = 0): { q: number; pa: number; xc: number; yc: number } {
  let S = 0, Sx = 0, Sy = 0;
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const w = img[j * size + i]; if (w <= floor) continue; const X = (2 * (i + 0.5)) / size - 1, Y = 1 - (2 * (j + 0.5)) / size; S += w; Sx += w * X; Sy += w * Y; }
  const xc = Sx / S, yc = Sy / S;
  let xx = 0, yy = 0, xy = 0;
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const w = img[j * size + i]; if (w <= floor) continue; const X = (2 * (i + 0.5)) / size - 1 - xc, Y = 1 - (2 * (j + 0.5)) / size - yc; xx += w * X * X; yy += w * Y * Y; xy += w * X * Y; }
  xx /= S; yy /= S; xy /= S;
  const tr = (xx + yy) / 2, d = Math.sqrt(((xx - yy) / 2) ** 2 + xy * xy);
  const l1 = tr + d, l2 = Math.max(0, tr - d);
  let pa = (0.5 * Math.atan2(2 * xy, xx - yy) * 180) / Math.PI; if (pa < 0) pa += 180;
  return { q: Math.sqrt(l2 / l1), pa, xc, yc };
}

/** The brightest light on the picture's edge. Keeping only pixels brighter than this cuts the light along the
 *  isophote that just fits inside the frame, so a square frame does not make an elongated galaxy measure rounder. */
export function edgeFloor(img: ArrayLike<number>, size: number): number {
  let m = 0;
  for (let t = 0; t < size; t++) m = Math.max(m, img[t], img[(size - 1) * size + t], img[t * size], img[t * size + size - 1]);
  return m;
}

// ---------- explanations ----------
const f2 = (x: number) => (Math.round(x * 100) / 100).toFixed(2);
/** Plain-English cues for why a galaxy with these settings gets its class. */
export function cues(p: GalaxyParams): string[] {
  const cls = classify(p), out: string[] = [];
  if (p.family === 'E') {
    const e = 10 * (1 - p.q);
    out.push(`No disc, no arms, no knots: smooth light that fades steadily outwards, so it is an elliptical.`);
    out.push(`It looks b/a = ${f2(p.q)} as wide as it is long, so the ellipticity is 10 × (1 − ${f2(p.q)}) = ${e.toFixed(1)}, which rounds to ${cls}.`);
    out.push(`The light falls off like a Sérsic profile with n = ${p.n.toFixed(1)}: a bright centre and wide faint wings, typical of big ellipticals.`);
    return out;
  }
  if (p.family === 'Irr') {
    out.push('No clear centre, bulge or regular arms: the light sits in uneven patches and bright blue knots of young stars.');
    out.push('Irregulars are often small, gas-rich galaxies, or galaxies pulled out of shape by a neighbour.');
    return out;
  }
  const qd = apparentQ(p.incl, 0.12);
  const bulge = p.bt >= STAGE.bt[0] ? 'a big bulge' : p.bt >= STAGE.bt[1] ? 'a middling bulge' : 'a small bulge';
  out.push(`Bulge-to-total light ${f2(p.bt)}: ${bulge} (here a is ${STAGE.bt[0]} or more, b ${STAGE.bt[1]} to ${STAGE.bt[0]}, c below ${STAGE.bt[1]}).`);
  if (p.family === 'S0' || p.arm <= 0) {
    out.push('A smooth disc around the bulge but no spiral arms and no knots of young stars: a lenticular (S0).');
  } else {
    const t = p.pitch < STAGE.pitch[0] ? 'tightly wound' : p.pitch < STAGE.pitch[1] ? 'moderately open' : 'loose and open';
    out.push(`Arms are ${t}, with a pitch angle of ${Math.round(p.pitch)}° (a below ${STAGE.pitch[0]}°, b ${STAGE.pitch[0]}° to ${STAGE.pitch[1]}°, c ${STAGE.pitch[1]}° or more).`);
    if (p.clumps >= 0.45) out.push('Many bright blue knots along the arms: lots of star formation, typical of late types (c).');
    else if (p.clumps <= 0.12) out.push('Smooth arms with few knots, typical of early types (a).');
  }
  if (p.bar >= BAR_MIN) out.push(`A straight bar crosses the centre (strength ${f2(p.bar)}) and the arms start at its ends: barred (SB).`);
  else if (p.bar > 0) out.push(`Only a weak bar (strength ${f2(p.bar)}, below ${BAR_MIN}); counted as unbarred here.`);
  else out.push('No bar: the arms or disc start straight from the bulge.');
  if (p.incl >= 20) out.push(`Tilted ${Math.round(p.incl)}° from face-on, so the disc looks ${f2(qd)} as wide as it is long; tilt does not change the class.`);
  return out;
}
