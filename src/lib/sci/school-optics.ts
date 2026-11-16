// School optics (Class 10 and 12 light chapters): spherical mirrors, thin lenses, refraction, prisms, the eye and
// simple instruments. Plain maths, no DOM. Distances in cm with the New Cartesian sign convention used in school
// books: light travels left to right, distances are measured from the pole or optical centre, positive to the
// right and upwards. An object in front of a mirror or lens therefore has a negative u.

export type MirrorKind = 'concave' | 'convex';
export type LensKind = 'convex' | 'concave';

export type Image = {
  f: number;        // signed focal length, cm
  u: number;        // signed object distance, cm (-Infinity for an object at infinity)
  v: number;        // signed image distance, cm (±Infinity when the image is at infinity)
  m: number;        // magnification (height of image ÷ height of object), signed; NaN when at infinity
  real: boolean;
  erect: boolean;
};

/** Spherical mirror: 1/v + 1/u = 1/f, m = −v/u. fAbs and uAbs are sizes in cm (uAbs may be Infinity). */
export function mirrorImage(kind: MirrorKind, fAbs: number, uAbs: number): Image {
  const f = kind === 'concave' ? -fAbs : fAbs, u = -uAbs;
  if (!Number.isFinite(u)) return { f, u, v: f, m: 0, real: kind === 'concave', erect: kind === 'convex' };
  const inv = 1 / f - 1 / u;
  if (Math.abs(inv) < 1e-12) return { f, u, v: -Infinity, m: NaN, real: true, erect: false };
  const v = 1 / inv, m = -v / u;
  return { f, u, v, m, real: v < 0, erect: m > 0 };
}

/** Thin lens: 1/v − 1/u = 1/f, m = v/u. */
export function lensImage(kind: LensKind, fAbs: number, uAbs: number): Image {
  const f = kind === 'convex' ? fAbs : -fAbs, u = -uAbs;
  if (!Number.isFinite(u)) return { f, u, v: f, m: 0, real: kind === 'convex', erect: kind === 'concave' };
  const inv = 1 / f + 1 / u;
  if (Math.abs(inv) < 1e-12) return { f, u, v: Infinity, m: NaN, real: true, erect: false };
  const v = 1 / inv, m = v / u;
  return { f, u, v, m, real: v > 0, erect: m > 0 };
}

/** Power in dioptres of a lens or mirror whose signed focal length is in cm. */
export const power = (fCm: number) => 100 / fCm;
/** Two thin lenses in contact: P = P1 + P2, returned with the combined focal length in cm. */
export function inContact(f1Cm: number, f2Cm: number): { P: number; f: number } {
  const P = power(f1Cm) + power(f2Cm);
  return { P, f: P === 0 ? Infinity : 100 / P };
}

/** Where the object sits among the standard positions (sizes in cm). `tol` is a fraction of f. */
export type Position = 'infinity' | 'beyond-2f' | 'at-2f' | 'between-f-2f' | 'at-f' | 'inside-f' | 'finite';
export function position(kind: MirrorKind | LensKind, element: 'mirror' | 'lens', fAbs: number, uAbs: number, tol = 0.02): Position {
  if (!Number.isFinite(uAbs)) return 'infinity';
  const converging = element === 'mirror' ? kind === 'concave' : kind === 'convex';
  if (!converging) return 'finite';
  const t = tol * fAbs;
  if (Math.abs(uAbs - 2 * fAbs) <= t) return 'at-2f';
  if (Math.abs(uAbs - fAbs) <= t) return 'at-f';
  if (uAbs > 2 * fAbs) return 'beyond-2f';
  if (uAbs > fAbs) return 'between-f-2f';
  return 'inside-f';
}

/** The standard "position of object → image" rows, worded for a mirror or a lens. */
export function imageTable(element: 'mirror' | 'lens', kind: MirrorKind | LensKind): { pos: Position; object: string; image: string; size: string; nature: string }[] {
  if (element === 'mirror' && kind === 'concave') return [
    { pos: 'infinity', object: 'At infinity', image: 'At F', size: 'Highly diminished, point-sized', nature: 'Real and inverted' },
    { pos: 'beyond-2f', object: 'Beyond C', image: 'Between F and C', size: 'Diminished', nature: 'Real and inverted' },
    { pos: 'at-2f', object: 'At C', image: 'At C', size: 'Same size', nature: 'Real and inverted' },
    { pos: 'between-f-2f', object: 'Between C and F', image: 'Beyond C', size: 'Enlarged', nature: 'Real and inverted' },
    { pos: 'at-f', object: 'At F', image: 'At infinity', size: 'Highly enlarged', nature: 'Real and inverted' },
    { pos: 'inside-f', object: 'Between P and F', image: 'Behind the mirror', size: 'Enlarged', nature: 'Virtual and erect' },
  ];
  if (element === 'mirror') return [
    { pos: 'infinity', object: 'At infinity', image: 'At F, behind the mirror', size: 'Highly diminished, point-sized', nature: 'Virtual and erect' },
    { pos: 'finite', object: 'Between infinity and P', image: 'Between P and F, behind the mirror', size: 'Diminished', nature: 'Virtual and erect' },
  ];
  if (kind === 'convex') return [
    { pos: 'infinity', object: 'At infinity', image: 'At F₂', size: 'Highly diminished, point-sized', nature: 'Real and inverted' },
    { pos: 'beyond-2f', object: 'Beyond 2F₁', image: 'Between F₂ and 2F₂', size: 'Diminished', nature: 'Real and inverted' },
    { pos: 'at-2f', object: 'At 2F₁', image: 'At 2F₂', size: 'Same size', nature: 'Real and inverted' },
    { pos: 'between-f-2f', object: 'Between F₁ and 2F₁', image: 'Beyond 2F₂', size: 'Enlarged', nature: 'Real and inverted' },
    { pos: 'at-f', object: 'At F₁', image: 'At infinity', size: 'Highly enlarged', nature: 'Real and inverted' },
    { pos: 'inside-f', object: 'Between F₁ and O', image: 'On the same side as the object', size: 'Enlarged', nature: 'Virtual and erect' },
  ];
  return [
    { pos: 'infinity', object: 'At infinity', image: 'At F₁', size: 'Highly diminished, point-sized', nature: 'Virtual and erect' },
    { pos: 'finite', object: 'Between infinity and O', image: 'Between F₁ and O', size: 'Diminished', nature: 'Virtual and erect' },
  ];
}

// ---------- Refraction ----------
const RAD = Math.PI / 180;
export const deg = (r: number) => r / RAD;
export const rad = (d: number) => d * RAD;

/** Snell's law n1 sin i = n2 sin r. Angles in degrees; null when the light is totally internally reflected. */
export function refractAngle(n1: number, n2: number, iDeg: number): number | null {
  const s = (n1 * Math.sin(rad(iDeg))) / n2;
  return Math.abs(s) > 1 ? null : deg(Math.asin(s));
}
/** Critical angle in degrees going from the denser n1 into the rarer n2 (null if n1 ≤ n2). */
export const criticalAngle = (n1: number, n2: number) => (n1 > n2 ? deg(Math.asin(n2 / n1)) : null);
/** Sideways shift of a ray through a parallel-sided slab of thickness t and index n (in air), angle of incidence i. */
export function slabShift(t: number, n: number, iDeg: number): number {
  const i = rad(iDeg), r = Math.asin(Math.sin(i) / n);
  return (t * Math.sin(i - r)) / Math.cos(r);
}
/** Apparent depth seen from straight above: real depth ÷ (n of the liquid ÷ n of the observer's medium). */
export const apparentDepth = (real: number, nLiquid: number, nObserver = 1) => (real * nObserver) / nLiquid;
/** Speed of light in a medium of index n, m/s. */
export const C_LIGHT = 299792458;
export const speedIn = (n: number) => C_LIGHT / n;

// ---------- Prism ----------
/** Ray through a prism of apex angle A (deg) and index n, angle of incidence i (deg). null when it cannot get out. */
export function prismPath(A: number, n: number, i: number): { r1: number; r2: number; e: number; dev: number } | null {
  const r1 = deg(Math.asin(Math.sin(rad(i)) / n)), r2 = A - r1;
  const s = n * Math.sin(rad(r2));
  if (Math.abs(s) > 1) return null;
  const e = deg(Math.asin(s));
  return { r1, r2, e, dev: i + e - A };
}
/** Angle of minimum deviation: n = sin((A + δm)/2) ÷ sin(A/2). */
export function minDeviation(A: number, n: number): number | null {
  const s = n * Math.sin(rad(A / 2));
  return s > 1 ? null : 2 * deg(Math.asin(s)) - A;
}
export const indexFromMinDeviation = (A: number, dm: number) => Math.sin(rad((A + dm) / 2)) / Math.sin(rad(A / 2));
/** Cauchy's two-term formula n(λ) = a + b/λ² (λ in nm, b in nm²). */
export const cauchy = (a: number, b: number, nm: number) => a + b / (nm * nm);

// ---------- The eye ----------
/** Least distance of distinct vision used in school books, cm. */
export const NEAR_POINT = 25;
/** Lens power (dioptres) that lets a short-sighted eye with far point `farCm` see distant things. */
export const myopiaPower = (farCm: number) => -100 / farCm;
/** Lens power (dioptres) that lets a long-sighted eye with near point `nearCm` read at `readCm` (default 25 cm). */
export const hypermetropiaPower = (nearCm: number, readCm = NEAR_POINT) => 100 / readCm - 100 / nearCm;

// ---------- Instruments (lengths in cm, D = near point) ----------
/** Simple microscope (magnifying glass): image at infinity m = D/f; image at the near point m = 1 + D/f. */
export const simpleMicroscope = (f: number, D = NEAR_POINT) => ({ relaxed: D / f, near: 1 + D / f });
/**
 * Compound microscope: objective focal length fo, eyepiece fe, tube length L (distance between the lenses).
 * Normal adjustment: final image at infinity, so the objective's image sits at the eyepiece's focus.
 * Near point: final image at D. Returns the object distance, the objective's magnification, the total, and so on.
 */
export function compoundMicroscope(fo: number, fe: number, L: number, mode: 'relaxed' | 'near', D = NEAR_POINT) {
  const ue = mode === 'relaxed' ? fe : (D * fe) / (D + fe);   // eyepiece object distance (size)
  const me = mode === 'relaxed' ? D / fe : 1 + D / fe;
  const vo = L - ue;                                           // objective image distance
  if (!(vo > fo)) return null;
  const uo = (vo * fo) / (vo - fo);                            // objective object distance (size)
  const mo = -vo / uo;                                         // objective magnification (inverted)
  return { uo, vo, ue, mo, me, m: mo * me };
}
/** Refracting telescope: normal adjustment m = −fo/fe, length fo + fe; near point m = −(fo/fe)(1 + fe/D). */
export function telescope(fo: number, fe: number, mode: 'relaxed' | 'near', D = NEAR_POINT) {
  if (mode === 'relaxed') return { m: -fo / fe, length: fo + fe };
  const ue = (D * fe) / (D + fe);
  return { m: -(fo / fe) * (1 + fe / D), length: fo + ue };
}

// ---------- Scattering ----------
/** Rayleigh scattering strength relative to a reference wavelength: (λref/λ)⁴. */
export const rayleighRatio = (nm: number, refNm = 700) => (refNm / nm) ** 4;
/** Relative air path through a flat atmosphere at a sun altitude (deg): 1/sin(alt) (the "air mass"), using
 * the Kasten and Young (1989) formula so it stays finite at the horizon. */
export function airMass(altDeg: number): number {
  const a = Math.max(0, altDeg);
  return 1 / (Math.sin(rad(a)) + 0.50572 * (a + 6.07995) ** -1.6364);
}

// ---- Solve my numbers: find v, u or f from the other two, with signs and working (added 2026-11-16) ------------
export type ThinUnknown = 'v' | 'u' | 'f';
export type ThinSolved = { ok: true; value: number; steps: string[]; m: number | null; nature: string } | { ok: false; msg: string };
const t4 = (x: number) => { if (x === 0) return '0'; const a = Math.abs(x), d = Math.max(0, 3 - Math.floor(Math.log10(a))); return Number(x.toFixed(Math.min(d, 8))).toString().replace('-', '−'); };
const tp = (x: number) => (x < 0 ? `(${t4(x)})` : t4(x));
/**
 * Lens: 1/v − 1/u = 1/f. Mirror: 1/v + 1/u = 1/f. New Cartesian signs, all in the same length unit (cm in the steps).
 * Give the two known values (u negative for a real object); the unknown is ignored. Never returns NaN or Infinity.
 */
export function solveThin(element: 'lens' | 'mirror', unknown: ThinUnknown, u: number, v: number, f: number): ThinSolved {
  const lens = element === 'lens', name = lens ? 'lens' : 'mirror';
  const vals: Record<ThinUnknown, number> = { u, v, f };
  for (const k of ['u', 'v', 'f'] as const) {
    if (k === unknown) continue;
    if (!Number.isFinite(vals[k])) return { ok: false, msg: `Type the ${k === 'u' ? 'object distance u' : k === 'v' ? 'image distance v' : 'focal length f'} as a number.` };
    if (vals[k] === 0) return { ok: false, msg: `${k} cannot be 0: that would put it on the ${name} itself. Give a distance above zero.` };
  }
  const sv = lens ? '−' : '+';
  let inv: number, steps: string[], value: number;
  if (unknown === 'v') {
    inv = lens ? 1 / f + 1 / u : 1 / f - 1 / u;
    steps = lens ? ['1/v − 1/u = 1/f, so 1/v = 1/f + 1/u', `1/v = 1/${tp(f)} + 1/${tp(u)} = ${t4(inv)}`] : ['1/v + 1/u = 1/f, so 1/v = 1/f − 1/u', `1/v = 1/${tp(f)} − 1/${tp(u)} = ${t4(inv)}`];
    if (Math.abs(inv) < 1e-12) return { ok: false, msg: `The object is at the focus (u = −f), so the rays leave the ${name} parallel and the image is at infinity: there is no v to give.` };
    value = 1 / inv; steps.push(`v = 1 ÷ ${tp(inv)} = ${t4(value)} cm`);
    v = value;
  } else if (unknown === 'u') {
    inv = lens ? 1 / v - 1 / f : 1 / f - 1 / v;
    steps = lens ? ['1/v − 1/u = 1/f, so 1/u = 1/v − 1/f', `1/u = 1/${tp(v)} − 1/${tp(f)} = ${t4(inv)}`] : ['1/v + 1/u = 1/f, so 1/u = 1/f − 1/v', `1/u = 1/${tp(f)} − 1/${tp(v)} = ${t4(inv)}`];
    if (Math.abs(inv) < 1e-12) return { ok: false, msg: 'These values put the object infinitely far away (1/u = 0). Try a different v or f.' };
    value = 1 / inv; steps.push(`u = 1 ÷ ${tp(inv)} = ${t4(value)} cm`);
    u = value;
  } else {
    inv = lens ? 1 / v - 1 / u : 1 / v + 1 / u;
    steps = [lens ? '1/f = 1/v − 1/u' : '1/f = 1/v + 1/u', `1/f = 1/${tp(v)} ${sv} 1/${tp(u)} = ${t4(inv)}`];
    if (Math.abs(inv) < 1e-12) return { ok: false, msg: 'These values give 1/f = 0, a flat piece of glass or a plane mirror: no focal length.' };
    value = 1 / inv; steps.push(`f = 1 ÷ ${tp(inv)} = ${t4(value)} cm`);
    f = value;
  }
  if (!Number.isFinite(value)) return { ok: false, msg: 'That combination has no answer. Check the numbers and signs.' };
  const m = u !== 0 ? (lens ? v / u : -v / u) : null;
  if (m !== null && Number.isFinite(m)) steps.push(lens ? `m = v/u = ${tp(v)}/${tp(u)} = ${t4(m)}` : `m = −v/u = −${tp(v)}/${tp(u)} = ${t4(m)}`);
  const real = lens ? v > 0 : v < 0;
  const nature = `${real ? 'real' : 'virtual'}${m !== null && Number.isFinite(m) ? (m < 0 ? ', inverted' : ', upright') + (Math.abs(m) > 1.0001 ? ', enlarged' : Math.abs(m) < 0.9999 ? ', diminished' : ', same size') : ''}`;
  return { ok: true, value, steps, m: m !== null && Number.isFinite(m) ? m : null, nature };
}

// ---- Snell's law solver: find r, i, n₂, n₁, the critical angle or the speed (added 2026-11-16) -------------------
export type SnellUnknown = 'r' | 'i' | 'n2' | 'n1' | 'C' | 'speed';
export type SnellSolved = { ok: true; value: number; unit: string; steps: string[]; tir?: boolean } | { ok: false; msg: string };
const s4 = (x: number) => (x === 0 ? '0' : Number(x.toFixed(Math.max(0, Math.min(10, 3 - Math.floor(Math.log10(Math.abs(x)))))).toString()).toString().replace('-', '−'));
/**
 * n₁ sin i = n₂ sin r. Angles in degrees from the normal (0 to 90 exclusive of 90 for i and r when a value is given).
 * Pass NaN for values that are unknown. For 'C' only n1 and n2 are used (n1 > n2 needed); for 'speed' only n2 (the medium's index).
 */
export function solveSnell(unknown: SnellUnknown, n1: number, n2: number, i: number, r: number): SnellSolved {
  const okN = (x: number, name: string) => (Number.isFinite(x) && x >= 1 && x <= 4 ? '' : `${name} must be a number from 1 to 4 (air is 1.00, water 1.33, glass about 1.5).`);
  const okA = (x: number, name: string) => (Number.isFinite(x) && x >= 0 && x < 90 ? '' : `${name} must be an angle from 0° up to (not including) 90°, measured from the normal.`);
  const check = (...m: string[]) => m.find(Boolean) ?? '';
  let msg = '';
  if (unknown === 'r') msg = check(okN(n1, 'n₁'), okN(n2, 'n₂'), okA(i, 'The angle of incidence'));
  else if (unknown === 'i') msg = check(okN(n1, 'n₁'), okN(n2, 'n₂'), okA(r, 'The angle of refraction'));
  else if (unknown === 'n2') msg = check(okN(n1, 'n₁'), okA(i, 'The angle of incidence'), okA(r, 'The angle of refraction'));
  else if (unknown === 'n1') msg = check(okN(n2, 'n₂'), okA(i, 'The angle of incidence'), okA(r, 'The angle of refraction'));
  else if (unknown === 'C') msg = check(okN(n1, 'n₁'), okN(n2, 'n₂'));
  else msg = check(okN(n2, 'The refractive index n'));
  if (msg) return { ok: false, msg };
  const sin = (d: number) => Math.sin(rad(d));
  if (unknown === 'speed') { const v = speedIn(n2); return { ok: true, value: v / 1e8, unit: '× 10⁸ m/s', steps: ['v = c ÷ n', `v = 2.998 × 10⁸ ÷ ${s4(n2)} = ${s4(v / 1e8)} × 10⁸ m/s`] }; }
  if (unknown === 'C') {
    if (n1 <= n2) return { ok: false, msg: `Total internal reflection only happens going into a less dense medium (n₁ must be bigger than n₂). Here n₁ = ${s4(n1)} is not more than n₂ = ${s4(n2)}.` };
    const C = deg(Math.asin(n2 / n1));
    return { ok: true, value: C, unit: '°', steps: ['At the critical angle r = 90°, so n₁ sin C = n₂', `sin C = n₂ ÷ n₁ = ${s4(n2)} ÷ ${s4(n1)} = ${s4(n2 / n1)}`, `C = ${s4(C)}°`] };
  }
  if (unknown === 'r') {
    const x = (n1 * sin(i)) / n2;
    const st = ['n₁ sin i = n₂ sin r, so sin r = n₁ sin i ÷ n₂', `sin r = ${s4(n1)} × sin ${s4(i)}° ÷ ${s4(n2)} = ${s4(x)}`];
    if (x > 1 + 1e-12) return { ok: true, value: NaN, unit: '°', tir: true, steps: [...st, 'sin r cannot be more than 1, so no refracted ray exists: total internal reflection (the ray reflects back, with angle of reflection = i).'] };
    const rr = deg(Math.asin(Math.min(1, x))); return { ok: true, value: rr, unit: '°', steps: [...st, `r = ${s4(rr)}°`] };
  }
  if (unknown === 'i') {
    const x = (n2 * sin(r)) / n1;
    const st = ['n₁ sin i = n₂ sin r, so sin i = n₂ sin r ÷ n₁', `sin i = ${s4(n2)} × sin ${s4(r)}° ÷ ${s4(n1)} = ${s4(x)}`];
    if (x > 1 + 1e-12) return { ok: false, msg: `No angle of incidence gives that: sin i would be ${s4(x)}, more than 1. Check n₁, n₂ and r.` };
    const ii = deg(Math.asin(Math.min(1, x))); return { ok: true, value: ii, unit: '°', steps: [...st, `i = ${s4(ii)}°`] };
  }
  if (unknown === 'n2') {
    if (sin(r) === 0) return { ok: false, msg: 'With r = 0° the ray goes straight along the normal, so n₂ cannot be found from the angles. Use a bigger angle.' };
    const v = (n1 * sin(i)) / sin(r);
    return { ok: true, value: v, unit: '', steps: ['n₁ sin i = n₂ sin r, so n₂ = n₁ sin i ÷ sin r', `n₂ = ${s4(n1)} × sin ${s4(i)}° ÷ sin ${s4(r)}° = ${s4(n1 * sin(i))} ÷ ${s4(sin(r))} = ${s4(v)}`] };
  }
  if (sin(i) === 0) return { ok: false, msg: 'With i = 0° the ray goes straight along the normal, so n₁ cannot be found from the angles. Use a bigger angle.' };
  const v = (n2 * sin(r)) / sin(i);
  return { ok: true, value: v, unit: '', steps: ['n₁ sin i = n₂ sin r, so n₁ = n₂ sin r ÷ sin i', `n₁ = ${s4(n2)} × sin ${s4(r)}° ÷ sin ${s4(i)}° = ${s4(v)}`] };
}
