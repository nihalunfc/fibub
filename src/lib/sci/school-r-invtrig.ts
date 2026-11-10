// Inverse trigonometric functions (Class 12 maths): principal values, principal branches, every angle with
// the same ratio, and compositions such as sin⁻¹(sin θ). Plain TypeScript, no DOM.

export type Trig = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'cosec';
export const TRIGS: Trig[] = ['sin', 'cos', 'tan', 'cot', 'sec', 'cosec'];
const PI = Math.PI;

/** The ratio itself. */
export function ratio(f: Trig, t: number): number {
  switch (f) {
    case 'sin': return Math.sin(t);
    case 'cos': return Math.cos(t);
    case 'tan': return Math.abs(Math.cos(t)) < 1e-15 ? NaN : Math.tan(t);
    case 'cot': return Math.abs(Math.sin(t)) < 1e-15 ? NaN : Math.cos(t) / Math.sin(t);
    case 'sec': return Math.abs(Math.cos(t)) < 1e-15 ? NaN : 1 / Math.cos(t);
    case 'cosec': return Math.abs(Math.sin(t)) < 1e-15 ? NaN : 1 / Math.sin(t);
  }
}

/** Principal value of f⁻¹(x); NaN outside the domain. */
export function principal(f: Trig, x: number): number {
  if (!Number.isFinite(x)) return NaN;
  switch (f) {
    case 'sin': return Math.abs(x) <= 1 ? Math.asin(x) : NaN;
    case 'cos': return Math.abs(x) <= 1 ? Math.acos(x) : NaN;
    case 'tan': return Math.atan(x);
    case 'cot': return PI / 2 - Math.atan(x); // range (0, π)
    case 'sec': return Math.abs(x) >= 1 ? Math.acos(1 / x) : NaN; // [0, π] without π/2
    case 'cosec': return Math.abs(x) >= 1 ? Math.asin(1 / x) : NaN; // [−π/2, π/2] without 0
  }
}

/** Domain of f⁻¹ and its principal value branch (range), as text. */
export const DOMAIN: Record<Trig, string> = { sin: '[−1, 1]', cos: '[−1, 1]', tan: 'ℝ', cot: 'ℝ', sec: 'ℝ − (−1, 1), that is x ≤ −1 or x ≥ 1', cosec: 'ℝ − (−1, 1), that is x ≤ −1 or x ≥ 1' };
export const RANGE: Record<Trig, string> = { sin: '[−π/2, π/2]', cos: '[0, π]', tan: '(−π/2, π/2)', cot: '(0, π)', sec: '[0, π] − {π/2}', cosec: '[−π/2, π/2] − {0}' };
/** The principal branch of f as an interval of angles, with points left out. */
export const BRANCH: Record<Trig, { lo: number; hi: number; skip: number[] }> = {
  sin: { lo: -PI / 2, hi: PI / 2, skip: [] }, cos: { lo: 0, hi: PI, skip: [] }, tan: { lo: -PI / 2, hi: PI / 2, skip: [-PI / 2, PI / 2] },
  cot: { lo: 0, hi: PI, skip: [0, PI] }, sec: { lo: 0, hi: PI, skip: [PI / 2] }, cosec: { lo: -PI / 2, hi: PI / 2, skip: [0] },
};

/** Every angle θ in [lo, hi] with f(θ) = x, sorted. */
export function allAngles(f: Trig, x: number, lo = -2 * PI, hi = 2 * PI): number[] {
  const a = principal(f, x);
  if (Number.isNaN(a)) return [];
  const out: number[] = [];
  const add = (t: number) => { if (t >= lo - 1e-12 && t <= hi + 1e-12 && !out.some((u) => Math.abs(u - t) < 1e-9)) out.push(Math.abs(t) < 1e-13 ? 0 : t); };
  for (let n = -6; n <= 6; n++) {
    if (f === 'sin' || f === 'cosec') add(n * PI + (n % 2 === 0 ? a : -a));
    else if (f === 'cos' || f === 'sec') { add(2 * n * PI + a); add(2 * n * PI - a); }
    else add(n * PI + a);
  }
  return out.sort((p, q) => p - q);
}

/** f⁻¹(f(θ)): equals θ only when θ is on the principal branch. */
export const undo = (f: Trig, t: number) => principal(f, ratio(f, t));

/** Angle as people write it: a multiple of π/12 as a π fraction, else 4 decimals. */
export function angleText(t: number): string {
  if (!Number.isFinite(t)) return 'undefined';
  if (Math.abs(t) < 1e-12) return '0';
  const k = (t / PI) * 12, r = Math.round(k);
  if (Math.abs(k - r) < 1e-9) {
    const g = (a: number, b: number): number => (b ? g(b, a % b) : a), d = g(Math.abs(r), 12), p = r / d, q = 12 / d;
    const top = `${p < 0 ? '−' : ''}${Math.abs(p) === 1 ? '' : Math.abs(p)}π`;
    return q === 1 ? top : `${top}/${q}`;
  }
  return String(+t.toFixed(4)).replace('-', '−');
}
export const degrees = (t: number) => (t * 180) / PI;
