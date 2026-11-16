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

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
/** x as a fraction p/q (q ≤ 1000) when it is one, else null. */
export function asFraction(x: number): [number, number] | null {
  if (!Number.isFinite(x)) return null;
  for (let q = 1; q <= 1000; q++) { const p = Math.round(x * q); if (Math.abs(x - p / q) < 1e-12 * Math.max(1, Math.abs(x))) { const g = gcd(p, q) || 1; return [p / g, q / g]; } }
  return null;
}
const sqrtTok = (n: number) => { const s = Math.round(Math.sqrt(n)); return s * s === n ? String(s) : `√${n}`; };
const over = (a: string, b: string, sign = 1) => {
  const na = Number(a), nb = Number(b);
  if (Number.isInteger(na) && Number.isInteger(nb)) { const g = gcd(na, nb) || 1, t = na / g, u = nb / g, s = (t < 0) !== (u < 0) ? -1 : 1; return `${s < 0 ? '−' : ''}${Math.abs(t)}${Math.abs(u) === 1 ? '' : `/${Math.abs(u)}`}`; }
  return `${sign < 0 ? '−' : ''}${a}/${b}`;
};
const num5 = (v: number) => String(+v.toPrecision(5)).replace('-', '−');

export type Composition = { value: number; exact: string; steps: string[]; error?: string };
/** outer(inner⁻¹(x)) for outer, inner in sin, cos, tan: the value, an exact form when x is a fraction, and the working. */
export function compose(outer: 'sin' | 'cos' | 'tan', inner: 'sin' | 'cos' | 'tan', x: number): Composition {
  const fail = (error: string): Composition => ({ value: NaN, exact: '', steps: [], error });
  if (!Number.isFinite(x)) return fail('Type a number or a fraction such as 3/5.');
  const th = principal(inner, x);
  if (Number.isNaN(th)) return fail(`${inner}⁻¹(${num5(x)}) is not defined: x must be in ${DOMAIN[inner]}.`);
  const value = ratio(outer, th);
  if (!Number.isFinite(value)) return fail(`${outer}(${inner}⁻¹(${num5(x)})) is not defined: ${inner}⁻¹(${num5(x)}) = ${angleText(th)}, where ${outer} has no value.`);
  const steps = [`Let θ = ${inner}⁻¹(${num5(x)}). Then ${inner} θ = ${num5(x)}, and θ is in ${RANGE[inner]}.`];
  const fr = asFraction(x);
  let exact = '', rule = '';
  if (outer === inner) { rule = `${outer}(${outer}⁻¹x) = x for every x in the domain, so the answer is x itself.`; exact = fr ? over(String(fr[0]), String(fr[1])) : num5(x); }
  else {
    const pair = `${outer}/${inner}`;
    rule = ({ 'sin/cos': 'sin θ = √(1 − cos²θ), with + because θ is in [0, π], where sine is never negative.', 'cos/sin': 'cos θ = √(1 − sin²θ), with + because θ is in [−π/2, π/2], where cosine is never negative.',
      'sin/tan': 'sin θ = tan θ / √(1 + tan²θ) (cos θ is positive for θ in (−π/2, π/2)).', 'cos/tan': 'cos θ = 1 / √(1 + tan²θ) (cos θ is positive for θ in (−π/2, π/2)).',
      'tan/sin': 'tan θ = sin θ / cos θ = sin θ / √(1 − sin²θ).', 'tan/cos': 'tan θ = sin θ / cos θ = √(1 − cos²θ) / cos θ.' } as Record<string, string>)[pair];
    if (fr) {
      const [p, q] = fr, m = q * q - p * p, s = q * q + p * p;
      exact = pair === 'sin/cos' || pair === 'cos/sin' ? over(sqrtTok(m), String(q)) : pair === 'sin/tan' ? over(String(p), sqrtTok(s)) : pair === 'cos/tan' ? over(String(q), sqrtTok(s)) : pair === 'tan/sin' ? over(String(p), sqrtTok(m)) : over(sqrtTok(m), String(p));
      const sub = pair === 'sin/cos' || pair === 'cos/sin' ? `√(1 − (${p}/${q})²) = √(${m}/${q * q})` : pair === 'sin/tan' || pair === 'cos/tan' ? `${pair === 'sin/tan' ? `(${p}/${q})` : '1'} / √(1 + (${p}/${q})²) = ${pair === 'sin/tan' ? `(${p}/${q})` : '1'} / √(${s}/${q * q})` : pair === 'tan/sin' ? `(${p}/${q}) / √(1 − (${p}/${q})²) = (${p}/${q}) / √(${m}/${q * q})` : `√(1 − (${p}/${q})²) / (${p}/${q}) = √(${m}/${q * q}) / (${p}/${q})`;
      steps.push(rule, `Put x = ${p}/${q} in: ${sub}.`);
    } else steps.push(rule, `Put x = ${num5(x)} in.`);
  }
  if (outer === inner) steps.push(rule);
  steps.push(`${outer}(${inner}⁻¹(${num5(x)})) = ${exact ? `${exact} = ` : ''}${num5(value)}.`);
  return { value, exact, steps: steps.map((t) => t.replace(/-(?=\d)/g, '−')), };
}

/** The angle typed for the trap, in degrees or radians (radians may be pi/6 style): returns radians. */
export const toRadians = (v: number, unit: 'deg' | 'rad') => (unit === 'deg' ? (v * PI) / 180 : v);
