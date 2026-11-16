// Straight lines for school (Class 11): the line through two points in every standard form, the angle between two
// lines, and the distance from a point to a line with the foot of the perpendicular. Plain TypeScript, no DOM.
import { gcd, rat, fmt, numText } from './smath.ts';

export type Pt = [number, number];
/** A line ax + by + c = 0. For two whole-number points the coefficients are whole numbers with no common factor. */
export type Line = { a: number; b: number; c: number };

/** The line through P and Q as ax + by + c = 0 (null if P = Q). Signs: a > 0, or a = 0 and b > 0. */
export function through(P: Pt, Q: Pt): Line | null {
  let a = Q[1] - P[1], b = P[0] - Q[0];
  if (a === 0 && b === 0) return null;
  let c = Q[0] * P[1] - P[0] * Q[1];
  const ints = [a, b, c].every(Number.isInteger);
  if (ints) { const g = gcd(gcd(a, b), c) || 1; a /= g; b /= g; c /= g; }
  if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
  return { a: a + 0, b: b + 0, c: c + 0 };
}

/** Slope −a/b (Infinity for a vertical line). */
export const slope = (l: Line) => (l.b === 0 ? Infinity : -l.a / l.b + 0);
/** y-intercept −c/b (NaN for a vertical line). */
export const yIntercept = (l: Line) => (l.b === 0 ? NaN : -l.c / l.b + 0);
/** x-intercept −c/a (NaN for a horizontal line). */
export const xIntercept = (l: Line) => (l.a === 0 ? NaN : -l.c / l.a + 0);
/** Inclination in degrees, 0 ≤ θ < 180. */
export function inclination(l: Line): number {
  if (l.b === 0) return 90;
  const t = (Math.atan(slope(l)) * 180) / Math.PI;
  return t < 0 ? t + 180 : t + 0;
}

/** Normal form x cos ω + y sin ω = p, with p ≥ 0 the distance from the origin and ω in degrees, 0 ≤ ω < 360. */
export function normalForm(l: Line): { p: number; omega: number } {
  const r = Math.hypot(l.a, l.b);
  let ca = l.a / r, sa = l.b / r, p = -l.c / r;
  if (p < 0) { ca = -ca; sa = -sa; p = -p; }
  if (p === 0 && (sa < 0 || (sa === 0 && ca < 0))) { ca = -ca; sa = -sa; }
  let w = (Math.atan2(sa, ca) * 180) / Math.PI;
  if (w < 0) w += 360;
  return { p: p + 0, omega: w + 0 };
}

/** The acute (or right) angle between two lines in degrees: tan θ = |(m1 − m2)/(1 + m1 m2)|. */
export function angleBetween(l1: Line, l2: Line): number {
  const dot = Math.abs(l1.a * l2.a + l1.b * l2.b), cr = Math.abs(l1.a * l2.b - l2.a * l1.b);
  return (Math.atan2(cr, dot) * 180) / Math.PI;
}
export const parallel = (l1: Line, l2: Line) => Math.abs(l1.a * l2.b - l2.a * l1.b) < 1e-12;
export const perpendicular = (l1: Line, l2: Line) => Math.abs(l1.a * l2.a + l1.b * l2.b) < 1e-12;

/** Distance from point P to the line: |a x₀ + b y₀ + c| / √(a² + b²). */
export const distance = (l: Line, P: Pt) => Math.abs(l.a * P[0] + l.b * P[1] + l.c) / Math.hypot(l.a, l.b);

/** The foot of the perpendicular from P to the line. */
export function foot(l: Line, P: Pt): Pt {
  const k = (l.a * P[0] + l.b * P[1] + l.c) / (l.a * l.a + l.b * l.b);
  return [P[0] - l.a * k + 0, P[1] - l.b * k + 0];
}

/** Where two lines meet (null if parallel). */
export function meet(l1: Line, l2: Line): Pt | null {
  const d = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(d) < 1e-12) return null;
  return [(l1.b * l2.c - l2.b * l1.c) / d + 0, (l2.a * l1.c - l1.a * l2.c) / d + 0];
}


/** Scale a line with simple-fraction coefficients to whole numbers with no common factor (sign: a > 0, or a = 0 and b > 0). */
export function tidy(l: Line): Line {
  const fr = [l.a, l.b, l.c].map((v) => rat(v, 1000));
  if (fr.some((f) => f === null)) { const s = l.a < 0 || (l.a === 0 && l.b < 0) ? -1 : 1; return { a: l.a * s + 0, b: l.b * s + 0, c: l.c * s + 0 }; }
  let L = 1; for (const f of fr as [number, number][]) L = (L * f[1]) / gcd(L, f[1]);
  let [a, b, c] = (fr as [number, number][]).map((f) => Math.round((f[0] * L) / f[1]));
  const g = gcd(gcd(a, b), c) || 1; a /= g; b /= g; c /= g;
  if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
  return { a: a + 0, b: b + 0, c: c + 0 };
}

/** The line through P with slope m (m = Infinity gives the vertical line x = P.x). */
export function fromPointSlope(P: Pt, m: number): Line {
  if (!Number.isFinite(m)) return tidy({ a: 1, b: 0, c: -P[0] });
  return tidy({ a: -m, b: 1, c: m * P[0] - P[1] });
}
/** The line y = m x + c. */
export const fromSlopeIntercept = (m: number, c: number): Line => tidy({ a: -m, b: 1, c: -c });
/** The line x/a + y/b = 1 (a and b must not be 0). */
export const fromIntercepts = (a: number, b: number): Line => tidy({ a: 1 / a, b: 1 / b, c: -1 });
/** The line through P parallel to l. */
export const parallelThrough = (l: Line, P: Pt): Line => tidy({ a: l.a, b: l.b, c: -(l.a * P[0] + l.b * P[1]) });
/** The line through P perpendicular to l. */
export const perpendicularThrough = (l: Line, P: Pt): Line => tidy({ a: -l.b, b: l.a, c: l.b * P[0] - l.a * P[1] });

/** a x + b y + c = 0 as text, e.g. "2x − y − 1 = 0". */
export function generalText(l: Line): string {
  const t: string[] = [];
  const term = (k: number, v: string) => { if (!k) return; const mag = Math.abs(k), body = mag === 1 && v ? v : numText(mag) + v; t.push(t.length ? (k < 0 ? `− ${body}` : `+ ${body}`) : (k < 0 ? `−${body}` : body)); };
  term(l.a, 'x'); term(l.b, 'y'); term(l.c, '');
  return `${t.join(' ')} = 0`;
}

/** y = m x + c as text (m, c shown as fractions when simple). */
export function slopeInterceptText(m: number, c: number): string {
  const mt = numText(m);
  let s = m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : mt.includes('/') ? `(${mt})x` : `${mt}x`;
  const ct = numText(c);
  if (c !== 0) s += s ? (c < 0 ? ` − ${numText(-c)}` : ` + ${ct}`) : ct;
  return `y = ${s || '0'}`;
}

/** The standard forms of a line, as {name, text} rows with the numbers filled in. Vertical, horizontal and through-the-origin lines say which forms do not exist. */
export function lineRows(l: Line): { name: string; text: string }[] {
  const rows: { name: string; text: string }[] = [];
  rows.push({ name: 'General form', text: `Ax + By + C = 0: ${generalText(l)}  (A = ${numText(l.a)}, B = ${numText(l.b)}, C = ${numText(l.c)})` });
  if (l.b === 0) {
    rows.push({ name: 'Slope', text: `The line is vertical: x = ${numText(-l.c / l.a)}. The slope is undefined and the inclination is 90°.` });
  } else {
    const m = -l.a / l.b, c = -l.c / l.b;
    rows.push({ name: 'Slope-intercept form', text: `y = mx + c: ${slopeInterceptText(m, c)}  (m = ${numText(m)}, c = ${numText(c)})` });
    rows.push({ name: 'Slope and angle', text: `m = −A/B = ${numText(m)}; the line makes ${fmt(inclination(l), 2)}° with the positive x axis (tan θ = m).` });
  }
  if (l.a !== 0 && l.b !== 0 && l.c !== 0) { const p = -l.c / l.a, q = -l.c / l.b; rows.push({ name: 'Intercept form', text: `x/a + y/b = 1: x/${numText(p).includes('/') || p < 0 ? `(${numText(p)})` : numText(p)} + y/${numText(q).includes('/') || q < 0 ? `(${numText(q)})` : numText(q)} = 1  (cuts the x axis at ${numText(p)}, the y axis at ${numText(q)})` }); }
  else rows.push({ name: 'Intercept form', text: l.c === 0 ? 'The line passes through the origin, so both intercepts are 0 and there is no intercept form.' : l.a === 0 ? `The line is horizontal: it never meets the x axis, so there is no intercept form (it cuts the y axis at ${numText(-l.c / l.b)}).` : `The line is vertical: it never meets the y axis, so there is no intercept form (it cuts the x axis at ${numText(-l.c / l.a)}).` });
  const nf = normalForm(l);
  rows.push({ name: 'Normal form', text: `x cos ω + y sin ω = p: ω = ${fmt(nf.omega, 2)}°, p = ${fmt(nf.p, 4)} (the distance from the origin to the line)` });
  return rows;
}
