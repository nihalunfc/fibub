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
