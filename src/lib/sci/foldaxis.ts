// Fold axis and cylindrical best fit from poles to bedding or foliation. Planes are read as strike and dip
// (right-hand rule: the plane dips to strike + 90) or dip direction and dip, turned into poles (lower
// hemisphere, unit vectors north, east, down), and the orientation tensor T = (1/n) Σ v vᵀ is split into
// eigenvalues λ1 ≥ λ2 ≥ λ3 and eigenvectors e1, e2, e3. For a cylindrical fold the poles lie on a great
// circle (the π-girdle) and e3, the pole of that girdle, is the fold axis (π-axis). Shape and strength
// after Woodcock (1977), point-girdle-random indices after Vollmer (1990), Kamb (1959) counting circle,
// interlimb angle classes after Fleuty (1964). Angles in degrees, azimuths clockwise from north.

import { vec, line, pole, planeFromPole, type Line, type Plane } from './stereonet.ts';
import { eig3, type V3 } from './paleostress.ts';

const RAD = Math.PI / 180;
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a: V3, b: V3, k = 1): V3 => [a[0] - k * b[0], a[1] - k * b[1], a[2] - k * b[2]];
const norm360 = (a: number) => ((a % 360) + 360) % 360;
/** Acute angle between two axes (lines without a sense), 0 to 90. */
export const axialAngle = (a: V3, b: V3) => { const c = cross(a, b); return Math.atan2(Math.hypot(c[0], c[1], c[2]), Math.abs(dot(a, b))) / RAD; };

export type Datum = { row: number; plane: Plane; pole: Line; v: V3; label: string };
export type ParseResult = { data: Datum[]; bad: { row: number; why: string }[] };
const COMPASS = /^(N|S|E|W|NE|NW|SE|SW|NNE|ENE|ESE|SSE|SSW|WSW|WNW|NNW)$/i;

/**
 * Read one plane per line: two numbers (strike and dip with the right-hand rule, or dip direction and dip),
 * then an optional limb label such as A or B. Text after # is ignored. Compass letters (SE, NW ...) are
 * refused, because this tool does not read quadrant or dip-quadrant notation.
 */
export function parsePlanes(text: string, dipDir = false): ParseResult {
  const data: Datum[] = [], bad: { row: number; why: string }[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const row = i + 1, l = raw.replace(/#.*/, '').trim();
    if (!l) return;
    const tok = l.split(/[\s,;/\t]+/).filter(Boolean);
    const a = Number(tok[0]), d = Number(tok[1]);
    if (tok.length < 2 || !Number.isFinite(a) || !Number.isFinite(d)) {
      // A first line of words, such as "strike,dip,limb" from a spreadsheet, is a header: skip it quietly.
      if (!data.length && !bad.length && !/\d/.test(l)) return;
      return bad.push({ row, why: 'needs two numbers' });
    }
    if (a < 0 || a > 360) return bad.push({ row, why: `${dipDir ? 'dip direction' : 'strike'} must be 0 to 360` });
    if (d < 0 || d > 90) return bad.push({ row, why: 'dip must be 0 to 90' });
    const label = tok[2] ?? '';
    if (tok.length > 3) return bad.push({ row, why: 'too many columns (two numbers and one label at most)' });
    if (COMPASS.test(label)) return bad.push({ row, why: `"${label}" looks like a compass direction; use the right-hand rule and label limbs with other names such as A and B` });
    if (label && Number.isFinite(Number(label))) return bad.push({ row, why: 'the third column is a label for the limb (such as A or B), not a number' });
    const plane: Plane = { strike: norm360(dipDir ? a - 90 : a), dip: d };
    const p = pole(plane);
    data.push({ row, plane, pole: p, v: vec(p), label: label.toUpperCase() });
  });
  return { data, bad };
}

/** Normalised orientation tensor (trace 1) as [xx, xy, xz, yy, yz, zz]. */
export function tensor(vs: V3[]): number[] {
  const t = [0, 0, 0, 0, 0, 0];
  for (const [x, y, z] of vs) { t[0] += x * x; t[1] += x * y; t[2] += x * z; t[3] += y * y; t[4] += y * z; t[5] += z * z; }
  return t.map((s) => s / vs.length);
}

/** Eigenvalues in descending order (λ1 ≥ λ2 ≥ λ3) with their unit eigenvectors. */
export function eigen(vs: V3[]): { val: [number, number, number]; vec: [V3, V3, V3] } {
  const e = eig3(tensor(vs));
  return { val: [e.val[2], e.val[1], e.val[0]], vec: [e.vec[2], e.vec[1], e.vec[0]] };
}

/** Woodcock (1977): shape K = ln(λ1/λ2) / ln(λ2/λ3) (above 1 cluster, below 1 girdle) and strength C = ln(λ1/λ3). */
export function woodcock(val: [number, number, number]) {
  const [l1, l2, l3] = val;
  const a = Math.log(l1 / l2), b = l3 > 1e-15 ? Math.log(l2 / l3) : Infinity;
  return { K: b === 0 ? Infinity : b === Infinity ? 0 : a / b, C: l3 > 1e-15 ? Math.log(l1 / l3) : Infinity };
}

/** Vollmer (1990) point, girdle and random indices: P = λ1 − λ2, G = 2(λ2 − λ3), R = 3λ3 (they add up to 1). */
export const vollmer = (val: [number, number, number]) => ({ P: val[0] - val[1], G: 2 * (val[1] - val[2]), R: 3 * val[2] });

export type Fit = {
  n: number; val: [number, number, number]; axes: [Line, Line, Line];
  axis: Line; girdle: Plane; K: number; C: number; P: number; G: number; R: number;
  off: number[]; rms: number; maxOff: number; within10: number; weak: boolean; b: V3;
};

/** Cylindrical best fit: the fold axis is e3, the girdle is the plane normal to it; each pole's angle off the girdle. */
export function fit(vs: V3[]): Fit {
  const e = eigen(vs), b = e.vec[2];
  const off = vs.map((v) => Math.asin(Math.min(1, Math.abs(dot(v, b)))) / RAD);
  const rms = Math.sqrt(off.reduce((s, x) => s + x * x, 0) / off.length);
  const axis = line(b), w = woodcock(e.val), v = vollmer(e.val);
  return {
    n: vs.length, val: e.val, axes: [line(e.vec[0]), line(e.vec[1]), axis], axis, girdle: planeFromPole(axis),
    K: w.K, C: w.C, P: v.P, G: v.G, R: v.R, off, rms, maxOff: Math.max(...off), within10: off.filter((x) => x <= 10).length / off.length,
    // The axis is poorly fixed when the poles do not spread more along the girdle than across it.
    weak: e.val[1] < 2.5 * e.val[2], b: vec(axis),
  };
}

/** A plain-words verdict on how cylindrical the fold is, from the RMS angle of the poles off the girdle (fibub's rule of thumb). */
export function cylVerdict(rms: number): string {
  if (rms < 5) return 'very nearly cylindrical';
  if (rms < 10) return 'close to cylindrical';
  if (rms < 15) return 'only roughly cylindrical';
  return 'not cylindrical: split it into smaller areas (domains)';
}

/** Fleuty (1964) tightness from the interlimb angle; isoclinal taken as under 10°. */
export function fleuty(angle: number): string {
  angle = Math.round(angle * 1e6) / 1e6; // so 119.99999999 from rounding counts as 120
  if (angle >= 120) return 'gentle';
  if (angle >= 70) return 'open';
  if (angle >= 30) return 'close';
  if (angle >= 10) return 'tight';
  return 'isoclinal';
}

/** The mean pole of one limb: the principal eigenvector of its poles (axial data, so opposite ends count together). */
export function meanPole(vs: V3[]): Line { return line(eigen(vs).vec[0]); }

export type Limbs = {
  mean: [Line, Line]; plane: [Plane, Plane]; interlimb: number; tightness: string;
  axial: Plane | null; axialPole: Line | null; intersection: Line; axisGap: number;
};

/**
 * Interlimb angle and axial plane from two limbs and the fold axis b. Each limb's mean pole is projected into
 * the profile plane (normal to b). The interlimb angle is 180° minus the angle between the limbs' younging
 * normals: both point up when both limbs are the right way up, one points down when a limb is overturned.
 * The axial plane contains b and bisects the limbs: its pole is the difference of the younging normals.
 */
export function limbs(a: V3[], c: V3[], b: V3, overturned = false): Limbs {
  const m1 = meanPole(a), m2 = meanPole(c), p1 = vec(m1), p2 = vec(m2);
  const q1 = unit(sub(p1, b, dot(p1, b))), q2 = unit(sub(p2, b, dot(p2, b)));
  // Younging normals: the upward normal is −p for a lower-hemisphere pole p.
  const n1: V3 = [-q1[0], -q1[1], -q1[2]], n2: V3 = overturned ? q2 : [-q2[0], -q2[1], -q2[2]];
  const between = Math.acos(Math.max(-1, Math.min(1, dot(n1, n2)))) / RAD;
  const interlimb = 180 - between;
  const m = sub(n1, n2), ml = Math.hypot(m[0], m[1], m[2]);
  const axialPole = ml > 1e-9 ? line(unit(m)) : null;
  const ix = cross(p1, p2), il = Math.hypot(ix[0], ix[1], ix[2]);
  const intersection = il > 1e-12 ? line(unit(ix)) : line(b);
  return {
    mean: [m1, m2], plane: [planeFromPole(m1), planeFromPole(m2)], interlimb, tightness: fleuty(interlimb),
    axial: axialPole ? planeFromPole(axialPole) : null, axialPole, intersection, axisGap: axialAngle(vec(intersection), b),
  };
}

/** A point of the equal-area net (x east, y north, radius 1 at the primitive) back to a unit vector; radii up to √2 reach the upper hemisphere. */
export function unproject(x: number, y: number): V3 | null {
  const r = Math.hypot(x, y);
  if (r > Math.SQRT2) return null;
  const a = 2 * Math.asin(r / Math.SQRT2); // angle from straight down
  const t = Math.atan2(x, y), h = Math.sin(a);
  return [h * Math.cos(t), h * Math.sin(t), Math.cos(a)];
}

/**
 * Kamb (1959) counting: a small circle (cone) with area A = 9 / (n + 9) of the hemisphere, so that a uniform
 * spread would give an expected count E = nA equal to 3σ, with σ = √(nA(1 − A)). Returns density in multiples
 * of σ on a square grid over the net (size × size, from −1.02 to 1.02).
 */
export function kamb(vs: V3[], size = 81) {
  const n = vs.length, A = 9 / (n + 9), cosT = 1 - A, E = n * A, sigma = Math.sqrt(n * A * (1 - A));
  const lo = -1.02, step = (2 * -lo) / (size - 1), z: number[][] = [];
  for (let j = 0; j < size; j++) {
    const rowv: number[] = [];
    for (let i = 0; i < size; i++) {
      const u = unproject(lo + i * step, -lo - j * step);
      if (!u) { rowv.push(0); continue; }
      let k = 0;
      for (const v of vs) if (Math.abs(dot(u, v)) >= cosT) k++;
      rowv.push(k / sigma);
    }
    z.push(rowv);
  }
  return { z, lo, step, size, A, cone: Math.acos(cosT) / RAD, E, sigma, max: Math.max(...z.flat()) };
}

/** Kamb density (in σ) at one direction. */
export function kambAt(vs: V3[], u: V3): number {
  const n = vs.length, A = 9 / (n + 9), sigma = Math.sqrt(n * A * (1 - A));
  return vs.filter((v) => Math.abs(dot(u, v)) >= 1 - A).length / sigma;
}

/** Marching squares: contour segments of z (rows top to bottom) at one level, in net coordinates (y north). */
export function contour(z: number[][], lo: number, step: number, level: number): [number, number][][] {
  const segs: [number, number][][] = [], n = z.length;
  const X = (i: number) => lo + i * step, Y = (j: number) => -lo - j * step;
  const lerp = (a: number, b: number) => (level - a) / (b - a);
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
    const a = z[j][i], b = z[j][i + 1], c = z[j + 1][i + 1], d = z[j + 1][i];
    const idx = (a >= level ? 8 : 0) | (b >= level ? 4 : 0) | (c >= level ? 2 : 0) | (d >= level ? 1 : 0);
    if (idx === 0 || idx === 15) continue;
    const top: [number, number] = [X(i + lerp(a, b)), Y(j)], right: [number, number] = [X(i + 1), Y(j + lerp(b, c))];
    const bottom: [number, number] = [X(i + lerp(d, c)), Y(j + 1)], left: [number, number] = [X(i), Y(j + lerp(a, d))];
    const centre = (a + b + c + d) / 4 >= level;
    switch (idx) {
      case 1: case 14: segs.push([left, bottom]); break;
      case 2: case 13: segs.push([bottom, right]); break;
      case 3: case 12: segs.push([left, right]); break;
      case 4: case 11: segs.push([top, right]); break;
      case 6: case 9: segs.push([top, bottom]); break;
      case 7: case 8: segs.push([left, top]); break;
      case 5: if (centre) segs.push([left, top], [bottom, right]); else segs.push([left, bottom], [top, right]); break;
      case 10: if (centre) segs.push([top, right], [left, bottom]); else segs.push([left, top], [bottom, right]); break;
    }
  }
  return segs;
}
