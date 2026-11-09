// School maths: trigonometric ratios (Class 10 introduction to trigonometry; Class 11 trigonometric functions on
// the unit circle). Ratios, exact values at special angles, quadrant signs and the three Pythagorean identities.
// No DOM.

export const rad = (deg: number) => (deg * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;

export type Ratios = { sin: number; cos: number; tan: number; cosec: number; sec: number; cot: number };

/** Clean tiny floating noise (cos 90° is 6e-17) and give ±Infinity where a ratio is undefined. */
const clean = (x: number) => (Math.abs(x) < 1e-12 ? 0 : Math.abs(x - Math.round(x)) < 1e-12 ? Math.round(x) : x);
export function ratios(d: number): Ratios {
  const s = clean(Math.sin(rad(d))), c = clean(Math.cos(rad(d)));
  const div = (p: number, q: number) => (q === 0 ? NaN : clean(p / q));
  return { sin: s, cos: c, tan: div(s, c), cosec: div(1, s), sec: div(1, c), cot: div(c, s) };
}

/** Exact values at the special angles, as text (— means not defined). */
export const EXACT: Record<number, Record<keyof Ratios, string>> = {
  0: { sin: '0', cos: '1', tan: '0', cosec: '—', sec: '1', cot: '—' },
  30: { sin: '1/2', cos: '√3/2', tan: '1/√3', cosec: '2', sec: '2/√3', cot: '√3' },
  45: { sin: '1/√2', cos: '1/√2', tan: '1', cosec: '√2', sec: '√2', cot: '1' },
  60: { sin: '√3/2', cos: '1/2', tan: '√3', cosec: '2/√3', sec: '2', cot: '1/√3' },
  90: { sin: '1', cos: '0', tan: '—', cosec: '1', sec: '—', cot: '0' },
};

/** Value of an exact-value string such as "√3/2" or "1/√2" ("—" gives NaN). */
export function exactValue(t: string): number {
  if (t === '—') return NaN;
  const part = (p: string) => (p.startsWith('√') ? Math.sqrt(Number(p.slice(1))) : Number(p));
  const [n, d] = t.split('/');
  return d === undefined ? part(n) : part(n) / part(d);
}

/** Quadrant 1 to 4 for an angle in degrees, or 0 on an axis. */
export function quadrant(d: number): number {
  const a = ((d % 360) + 360) % 360;
  if (a % 90 === 0) return 0;
  return Math.floor(a / 90) + 1;
}

/** Which ratios are positive in each quadrant ("All Students Take Coffee"). */
export const POSITIVE: Record<number, string> = { 1: 'all ratios', 2: 'sin and cosec', 3: 'tan and cot', 4: 'cos and sec' };

/** A right triangle from its two legs: hypotenuse and the angle opposite `opp`, in degrees. */
export function fromLegs(opp: number, adj: number) {
  const hyp = Math.hypot(opp, adj);
  return { hyp, angle: deg(Math.atan2(opp, adj)), sin: opp / hyp, cos: adj / hyp, tan: opp / adj };
}

/** The three identities at an angle: each left side should equal 1 (NaN where a ratio is undefined). */
export function identities(d: number) {
  const r = ratios(d);
  return { sinCos: r.sin ** 2 + r.cos ** 2, secTan: r.sec ** 2 - r.tan ** 2, cosecCot: r.cosec ** 2 - r.cot ** 2 };
}
