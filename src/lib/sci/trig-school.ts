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

// ---- Solve my numbers (added 2026-11-16): right triangles from an angle and a side, from two sides, and the
// angle from a ratio. Each returns the answer and the working as text lines. No DOM. ----

/** Round to n significant figures and write with a real minus sign ("0.5", "8.66", "1,234"). */
export function sig(x: number, n = 4): string {
  if (!Number.isFinite(x)) return '—';
  if (x === 0) return '0';
  const s = String(+x.toPrecision(n));
  return (s.includes('e') ? x.toFixed(6).replace(/0+$/, '').replace(/\.$/, '') : s).replace('-', '−');
}

export type Side = 'opp' | 'adj' | 'hyp';
export const SIDE_NAME: Record<Side, string> = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' };
export type RightSolution = { opp: number; adj: number; hyp: number; angle: number; other: number; steps: string[]; error?: string };
const bad = (error: string): RightSolution => ({ opp: NaN, adj: NaN, hyp: NaN, angle: NaN, other: NaN, steps: [], error });

/** An acute angle (degrees, strictly between 0 and 90) and one side: find the other two sides. */
export function fromAngleSide(angle: number, known: Side, len: number): RightSolution {
  if (!Number.isFinite(angle) || !Number.isFinite(len)) return bad('Type both numbers to get an answer.');
  if (len <= 0) return bad('A side length must be more than 0.');
  if (angle <= 0 || angle >= 90) return bad('In a right triangle the other angles are acute: between 0° and 90° (not 0 and not 90). For angles beyond 90° use the Class 11 circle above.');
  const s = Math.sin(rad(angle)), c = Math.cos(rad(angle)), t = Math.tan(rad(angle));
  let opp = len, adj = len, hyp = len; const steps: string[] = [];
  const A = `${sig(angle, 6)}°`;
  if (known === 'hyp') {
    opp = len * s; adj = len * c;
    steps.push(`sin θ = opposite / hypotenuse, so opposite = hypotenuse × sin θ = ${sig(len)} × sin ${A} = ${sig(len)} × ${sig(s)} = ${sig(opp)}.`);
    steps.push(`cos θ = adjacent / hypotenuse, so adjacent = ${sig(len)} × cos ${A} = ${sig(len)} × ${sig(c)} = ${sig(adj)}.`);
  } else if (known === 'opp') {
    hyp = len / s; adj = len / t;
    steps.push(`sin θ = opposite / hypotenuse, so hypotenuse = opposite / sin θ = ${sig(len)} / sin ${A} = ${sig(len)} / ${sig(s)} = ${sig(hyp)}.`);
    steps.push(`tan θ = opposite / adjacent, so adjacent = opposite / tan θ = ${sig(len)} / ${sig(t)} = ${sig(adj)}.`);
  } else {
    hyp = len / c; opp = len * t;
    steps.push(`cos θ = adjacent / hypotenuse, so hypotenuse = adjacent / cos θ = ${sig(len)} / cos ${A} = ${sig(len)} / ${sig(c)} = ${sig(hyp)}.`);
    steps.push(`tan θ = opposite / adjacent, so opposite = adjacent × tan θ = ${sig(len)} × ${sig(t)} = ${sig(opp)}.`);
  }
  const other = 90 - angle;
  steps.push(`The other acute angle is 90° − ${sig(angle, 6)}° = ${sig(other, 6)}°.`);
  return { opp, adj, hyp, angle, other, steps };
}

/** Two sides of a right triangle (which two is named in `pair`): the third side and both acute angles. */
export function fromTwoSides(pair: 'opp-adj' | 'opp-hyp' | 'adj-hyp', x: number, y: number): RightSolution {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return bad('Type both numbers to get an answer.');
  if (x <= 0 || y <= 0) return bad('Side lengths must be more than 0.');
  let opp = x, adj = y, hyp = 0; const steps: string[] = [];
  if (pair === 'opp-adj') {
    hyp = Math.hypot(x, y);
    steps.push(`Pythagoras: hypotenuse = √(opposite² + adjacent²) = √(${sig(x)}² + ${sig(y)}²) = √${sig(x * x + y * y)} = ${sig(hyp)}.`);
  } else {
    const leg = x, h = y;     // first box is the leg, second the hypotenuse
    if (!(h > leg)) return bad('The hypotenuse is the longest side of a right triangle, so it must be bigger than the other side.');
    hyp = h;
    const other = Math.sqrt(h * h - leg * leg);
    if (pair === 'opp-hyp') { opp = leg; adj = other; steps.push(`Pythagoras: adjacent = √(hypotenuse² − opposite²) = √(${sig(h)}² − ${sig(leg)}²) = √${sig(h * h - leg * leg)} = ${sig(adj)}.`); }
    else { adj = leg; opp = other; steps.push(`Pythagoras: opposite = √(hypotenuse² − adjacent²) = √(${sig(h)}² − ${sig(leg)}²) = √${sig(h * h - leg * leg)} = ${sig(opp)}.`); }
  }
  const angle = deg(Math.atan2(opp, adj));
  if (pair === 'opp-adj') steps.push(`tan θ = opposite / adjacent = ${sig(opp)} / ${sig(adj)} = ${sig(opp / adj)}, so θ = tan⁻¹(${sig(opp / adj)}) = ${sig(angle, 5)}°.`);
  else if (pair === 'opp-hyp') steps.push(`sin θ = opposite / hypotenuse = ${sig(opp)} / ${sig(hyp)} = ${sig(opp / hyp)}, so θ = sin⁻¹(${sig(opp / hyp)}) = ${sig(angle, 5)}°.`);
  else steps.push(`cos θ = adjacent / hypotenuse = ${sig(adj)} / ${sig(hyp)} = ${sig(adj / hyp)}, so θ = cos⁻¹(${sig(adj / hyp)}) = ${sig(angle, 5)}°.`);
  steps.push(`The other acute angle is 90° − ${sig(angle, 5)}° = ${sig(90 - angle, 5)}°.`);
  return { opp, adj, hyp, angle, other: 90 - angle, steps };
}

export type Fn = keyof Ratios;
/** The angle for a given ratio value (inverse trig). `acute` is the angle in 0° to 90° for a positive value; `all` lists the angles in [0°, 360°). */
export function fromRatio(fn: Fn, v: number): { acute: number | null; all: number[]; steps: string[]; error?: string } {
  const none = (error: string) => ({ acute: null, all: [], steps: [], error });
  if (!Number.isFinite(v)) return none('Type a value.');
  if ((fn === 'sin' || fn === 'cos') && Math.abs(v) > 1) return none(`${fn} θ is always between −1 and 1, so no angle has ${fn} θ = ${sig(v)}. (Check whether you meant a ratio of two sides.)`);
  if ((fn === 'cosec' || fn === 'sec') && Math.abs(v) < 1) return none(`${fn} θ is never between −1 and 1 (it is 1 divided by a number that size or smaller), so no angle has ${fn} θ = ${sig(v)}.`);
  const base = fn === 'cosec' ? 'sin' : fn === 'sec' ? 'cos' : fn === 'cot' ? 'tan' : fn;
  const w = fn === 'cosec' || fn === 'sec' ? 1 / v : fn === 'cot' ? (v === 0 ? Infinity : 1 / v) : v;
  const norm = (a: number) => ((Math.round(a * 1e9) / 1e9) % 360 + 360) % 360;
  let t1: number, t2: number;
  if (base === 'sin') { t1 = deg(Math.asin(w)); t2 = 180 - t1; }
  else if (base === 'cos') { t1 = deg(Math.acos(w)); t2 = 360 - t1; }
  else { t1 = Number.isFinite(w) ? deg(Math.atan(w)) : 90; t2 = t1 + 180; }
  const all = [...new Set([norm(t1), norm(t2)])].sort((a, b) => a - b);
  const acute = base === 'sin' ? deg(Math.asin(Math.abs(w))) : base === 'cos' ? deg(Math.acos(Math.abs(w))) : Number.isFinite(w) ? deg(Math.atan(Math.abs(w))) : 90;
  const steps: string[] = [];
  if (fn !== base && Number.isFinite(w)) steps.push(`${fn} θ = 1 / ${base} θ, so ${base} θ = 1 / ${sig(v)} = ${sig(w)}.`);
  steps.push(`θ = ${base}⁻¹(${sig(w)}) = ${sig(acute, 5)}° ${w < 0 ? '(reference angle; the value is negative)' : '(the angle between 0° and 90°)'}.`);
  return { acute, all, steps };
}

/** Rows of a trigonometric table: every `step` degrees from 0 to 90, with radians and the three main ratios. */
export function tableRows(step = 1): { deg: number; rad: number; sin: number; cos: number; tan: number }[] {
  const out = [];
  for (let d = 0; d <= 90 + 1e-9; d += step) { const r = ratios(d); out.push({ deg: d, rad: rad(d), sin: r.sin, cos: r.cos, tan: r.tan }); }
  return out;
}
