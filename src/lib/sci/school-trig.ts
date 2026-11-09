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
