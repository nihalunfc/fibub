// School trigonometry (Class 11 and 12 maths): degrees and radians as fractions of π, exact values at the
// special angles, quadrant signs (ASTC), the shape of a sin(bx + c) + d, and principal values of the
// inverse functions. Plain TypeScript, no DOM.

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
/** An angle in degrees as a multiple of π, when it is a whole number of degrees: 150 → "5π/6". */
export function piFraction(deg: number): string {
  if (Math.abs(deg - Math.round(deg)) > 1e-9) return `${(deg * Math.PI / 180).toFixed(4)}`;
  const d = Math.round(deg);
  if (d === 0) return '0';
  const g = gcd(Math.abs(d), 180), n = d / g, m = 180 / g;
  const top = n === 1 ? 'π' : n === -1 ? '−π' : `${String(n).replace('-', '−')}π`;
  return m === 1 ? top : `${top}/${m}`;
}
/** Bring any angle into 0 ≤ θ < 360. */
export const norm360 = (deg: number) => ((deg % 360) + 360) % 360;

// Exact values for the multiples of 30° and 45°.
const S: Record<number, string> = { 0: '0', 30: '1/2', 45: '1/√2', 60: '√3/2', 90: '1' };
const T: Record<number, string> = { 0: '0', 30: '1/√3', 45: '1', 60: '√3', 90: 'undefined' };
/** Exact sin, cos and tan at a special angle (a multiple of 30° or 45°), else null. */
export function exact(deg: number): { sin: string; cos: string; tan: string } | null {
  if (Math.abs(deg - Math.round(deg)) > 1e-9) return null;
  const a = norm360(Math.round(deg));
  if (a % 30 && a % 45) return null;
  // Reference angle and quadrant signs.
  const ref = a <= 90 ? a : a <= 180 ? 180 - a : a <= 270 ? a - 180 : 360 - a;
  const sSign = a > 180 && a < 360 ? -1 : 1, cSign = a > 90 && a < 270 ? -1 : 1;
  const neg = (s: string, k: number) => (k < 0 && s !== '0' ? '−' + s : s);
  const tan = a === 90 || a === 270 ? 'undefined' : neg(T[ref], sSign * cSign);
  return { sin: neg(S[ref], sSign), cos: neg(S[90 - ref], cSign), tan };
}

/** Which quadrant (1 to 4) an angle is in, or 0 on an axis; and which ratios are positive there (ASTC). */
export function quadrant(deg: number): { q: number; positive: string } {
  const a = norm360(deg);
  if (a % 90 === 0) return { q: 0, positive: 'on an axis' };
  const q = Math.floor(a / 90) + 1;
  return { q, positive: ['All of sin, cos, tan', 'Sin only (and cosec)', 'Tan only (and cot)', 'Cos only (and sec)'][q - 1] };
}

/** Amplitude, period, phase shift, vertical shift and range of y = a sin(bx + c) + d (or cos). */
export function waveShape(a: number, b: number, c: number, d: number) {
  return { amplitude: Math.abs(a), period: (2 * Math.PI) / Math.abs(b), shift: -c / b, mid: d, max: d + Math.abs(a), min: d - Math.abs(a), flipped: a < 0 };
}

export type Inv = 'asin' | 'acos' | 'atan';
/** Domain and principal range (in degrees) of the inverse trig functions. */
export const INV: Record<Inv, { name: string; of: 'sin' | 'cos' | 'tan'; domain: [number, number]; range: [number, number]; rangeText: string; domainText: string }> = {
  asin: { name: 'sin⁻¹', of: 'sin', domain: [-1, 1], range: [-90, 90], rangeText: '[−π/2, π/2]', domainText: '[−1, 1]' },
  acos: { name: 'cos⁻¹', of: 'cos', domain: [-1, 1], range: [0, 180], rangeText: '[0, π]', domainText: '[−1, 1]' },
  atan: { name: 'tan⁻¹', of: 'tan', domain: [-Infinity, Infinity], range: [-90, 90], rangeText: '(−π/2, π/2)', domainText: 'all real numbers' },
};
const D = Math.PI / 180;
/** Principal value (degrees) of the inverse function at x; NaN outside the domain. */
export function principal(k: Inv, x: number): number {
  const v = k === 'asin' ? Math.asin(x) : k === 'acos' ? Math.acos(x) : Math.atan(x);
  return v / D;
}
/** sin⁻¹(sin θ) and friends: the angle in the principal branch with the same ratio as θ. */
export const backAgain = (k: Inv, deg: number) => {
  const r = deg * D, x = k === 'asin' ? Math.sin(r) : k === 'acos' ? Math.cos(r) : Math.tan(r);
  return principal(k, x);
};

// ---- Solve-my-numbers helpers (added 2026-11-16) ----

/** The acute angle between the terminal side and the x-axis, in degrees (0 on an axis). */
export function refAngle(deg: number): number {
  const a = norm360(deg);
  return a <= 90 ? a : a <= 180 ? 180 - a : a <= 270 ? a - 180 : 360 - a;
}

const fmtN = (x: number, d = 4) => { const v = Math.abs(x) < 5e-10 ? 0 : x; return String(parseFloat(v.toFixed(d))).replace('-', '−'); };

/** Exam-style working for sin, cos or tan of an angle: reduce, quadrant, reference angle, sign, value. */
export function workingLines(deg: number, f: 'sin' | 'cos' | 'tan'): string[] {
  const a = norm360(deg), out: string[] = [];
  const turns = Math.round((deg - a) / 360);
  if (turns !== 0) out.push(`${fmtN(deg, 4)}° is ${Math.abs(turns)} full turn${Math.abs(turns) === 1 ? '' : 's'} ${turns > 0 ? 'past' : 'before'} ${fmtN(a, 4)}° (add or take away 360°), so ${f} ${fmtN(deg, 4)}° = ${f} ${fmtN(a, 4)}°.`);
  const Q = quadrant(a), ref = refAngle(a), rad = a * D;
  if (Q.q === 0) {
    const v = f === 'sin' ? Math.sin(rad) : f === 'cos' ? Math.cos(rad) : (a % 180 === 90 ? NaN : Math.tan(rad));
    out.push(`${fmtN(a, 4)}° lies on an axis, so read the point (cos θ, sin θ) straight off the circle: (${fmtN(Math.cos(rad), 0)}, ${fmtN(Math.sin(rad), 0)}).`);
    out.push(Number.isFinite(v) ? `${f} ${fmtN(a, 4)}° = ${fmtN(v, 0)}.` : `tan ${fmtN(a, 4)}° = sin/cos = ${fmtN(Math.sin(rad), 0)}/0, which is undefined.`);
    return out;
  }
  const sign = f === 'sin' ? (a < 180 ? 1 : -1) : f === 'cos' ? (a < 90 || a > 270 ? 1 : -1) : ((a < 90 || (a > 180 && a < 270)) ? 1 : -1);
  out.push(`${fmtN(a, 4)}° is in quadrant ${Q.q}, where ${['all ratios are', 'only sin is', 'only tan is', 'only cos is'][Q.q - 1]} positive (ASTC), so ${f} is ${sign > 0 ? 'positive' : 'negative'}.`);
  out.push(`Reference angle = ${Q.q === 1 ? `${fmtN(a, 4)}°` : Q.q === 2 ? `180° − ${fmtN(a, 4)}° = ${fmtN(ref, 4)}°` : Q.q === 3 ? `${fmtN(a, 4)}° − 180° = ${fmtN(ref, 4)}°` : `360° − ${fmtN(a, 4)}° = ${fmtN(ref, 4)}°`}.`);
  const ex = exact(ref), rv = f === 'sin' ? Math.sin(ref * D) : f === 'cos' ? Math.cos(ref * D) : Math.tan(ref * D);
  const exs = ex ? (f === 'sin' ? ex.sin : f === 'cos' ? ex.cos : ex.tan) : null;
  out.push(`${f} ${fmtN(ref, 4)}° = ${exs && exs !== fmtN(rv, 4) ? `${exs} ≈ ${fmtN(rv, 4)}` : fmtN(rv, 4)} (the size, ignoring the sign).`);
  const sn = sign < 0 ? '−' : '';
  out.push(`So ${f} ${fmtN(a, 4)}° = ${sn}${exs ?? fmtN(rv, 4)}${exs && exs !== fmtN(rv, 4) ? ` ≈ ${sn}${fmtN(rv, 4)}` : ''}.`);
  return out;
}

/** Every angle in 0° ≤ θ < 360° with sin, cos or tan equal to v, as degrees; null when no angle has that value. */
export function anglesFor(f: 'sin' | 'cos' | 'tan', v: number): { principal: number; angles: number[] } | null {
  if (!Number.isFinite(v)) return null;
  if ((f === 'sin' || f === 'cos') && Math.abs(v) > 1 + 1e-12) return null;
  const c = Math.max(-1, Math.min(1, v));
  const r = (x: number) => { const n = norm360(x); return Math.abs(n - 360) < 1e-9 ? 0 : Math.round(n * 1e9) / 1e9; };
  let list: number[], p: number;
  if (f === 'sin') { p = Math.asin(c) / D; list = [p, 180 - p]; }
  else if (f === 'cos') { p = Math.acos(c) / D; list = [p, -p]; }
  else { p = Math.atan(v) / D; list = [p, p + 180]; }
  const angles = [...new Set(list.map(r))].sort((x, y) => x - y);
  return { principal: p, angles };
}
