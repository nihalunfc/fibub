// Linear programming by the graphical (corner point) method, Class 12 maths: two variables x, y ≥ 0, a few
// constraints a x + b y ≤ c or ≥ c, and Z = p x + q y to maximise or minimise. The feasible region is found by
// cutting a very large square down with each half-plane; corners on the square's far edges mean the region is
// unbounded, and if the best Z sits there the objective has no maximum (or minimum). Plain TypeScript, no DOM.

export type Con = { a: number; b: number; op: '<=' | '>='; c: number };
export type Pt = [number, number];
export type LppResult = {
  status: 'optimal' | 'infeasible' | 'unbounded';
  region: Pt[];          // polygon of the feasible region (cut off at the big square)
  corners: { p: Pt; z: number; best: boolean }[]; // real corner points (not on the far edges), in order round the region
  bounded: boolean;
  best: number;          // best Z (when optimal)
  many: boolean;         // more than one corner is best: every point on the edge between them is optimal
};

export const BIG = 1e6;
const EPS = 1e-9;

/** Keep the part of polygon `poly` where a x + b y (op) c. Sutherland-Hodgman clipping for one half-plane. */
export function clip(poly: Pt[], k: Con): Pt[] {
  const s = k.op === '<=' ? 1 : -1;
  const val = ([x, y]: Pt) => s * (k.a * x + k.b * y - k.c);
  const tol = EPS * Math.max(1, Math.abs(k.c), BIG * (Math.abs(k.a) + Math.abs(k.b)) * 1e-6);
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i], Q = poly[(i + 1) % poly.length], vp = val(P), vq = val(Q);
    const inP = vp <= tol, inQ = vq <= tol;
    if (inP) out.push(P);
    if (inP !== inQ && Math.abs(vp - vq) > 0) { const t = vp / (vp - vq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
  }
  // tidy: round near-integers and drop repeated points
  const r = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 * Math.max(1, Math.abs(v)) ? Math.round(v) : v);
  const t: Pt[] = [];
  for (const p of out.map(([x, y]) => [r(x), r(y)] as Pt)) { const l = t[t.length - 1]; if (!l || Math.abs(l[0] - p[0]) > 1e-9 || Math.abs(l[1] - p[1]) > 1e-9) t.push(p); }
  if (t.length > 1 && Math.abs(t[0][0] - t[t.length - 1][0]) < 1e-9 && Math.abs(t[0][1] - t[t.length - 1][1]) < 1e-9) t.pop();
  return t;
}

export function solve(cons: Con[], p: number, q: number, goal: 'max' | 'min'): LppResult {
  let poly: Pt[] = [[0, 0], [BIG, 0], [BIG, BIG], [0, BIG]];
  for (const k of cons) { if (!(Number.isFinite(k.a) && Number.isFinite(k.b) && Number.isFinite(k.c))) continue; poly = clip(poly, k); if (!poly.length) break; }
  if (!poly.length) return { status: 'infeasible', region: [], corners: [], bounded: true, best: NaN, many: false };
  const far = ([x, y]: Pt) => x >= BIG * (1 - 1e-9) || y >= BIG * (1 - 1e-9);
  const bounded = !poly.some(far);
  const Z = ([x, y]: Pt) => p * x + q * y;
  const sgn = goal === 'max' ? 1 : -1;
  const real = poly.filter((v) => !far(v));
  const bestReal = Math.max(...real.map((v) => sgn * Z(v)));
  const bestAll = Math.max(...poly.map((v) => sgn * Z(v)));
  const tol = 1e-9 * Math.max(1, Math.abs(bestReal));
  const status = real.length && bestAll <= bestReal + tol * 1e3 + 1e-6 ? 'optimal' : 'unbounded';
  const corners = real.map((v) => ({ p: v, z: Z(v), best: status === 'optimal' && Math.abs(sgn * Z(v) - bestReal) <= tol }));
  return { status, region: poly, corners, bounded, best: status === 'optimal' ? sgn * bestReal : NaN, many: corners.filter((c) => c.best).length > 1 };
}

const f3 = (v: number) => String(+(Math.abs(v) < 1e-9 ? 0 : v).toPrecision(6)).replace('-', '−');
const term = (c: number, s: string) => (c === 1 ? s : c === -1 ? `−${s}` : `${f3(c)}${s}`);
/** A constraint as text: "2x + y ≤ 20". */
export function conText(k: Con): string {
  const parts: string[] = [];
  if (k.a !== 0) parts.push(term(k.a, 'x'));
  if (k.b !== 0) parts.push(`${parts.length ? (k.b < 0 ? '− ' : '+ ') : ''}${term(parts.length ? Math.abs(k.b) : k.b, 'y')}`);
  return `${parts.join(' ')} ${k.op === '<=' ? '≤' : '≥'} ${f3(k.c)}`;
}
/** Which boundary lines pass through a corner: "x = 0", "y = 0", or "line 2". */
export function binding(cons: Con[], p: Pt): string[] {
  const out: string[] = [];
  if (Math.abs(p[0]) < 1e-7) out.push('x = 0');
  if (Math.abs(p[1]) < 1e-7) out.push('y = 0');
  cons.forEach((k, i) => { if (Math.abs(k.a * p[0] + k.b * p[1] - k.c) < 1e-7 * Math.max(1, Math.abs(k.c))) out.push(`line ${i + 1}`); });
  return out;
}
/** The working of the corner point method, one line per corner, ending with the comparison. */
export function lppWorking(cons: Con[], p: number, q: number, goal: 'max' | 'min', r: LppResult, names = ' ABCDEFGHIJKLMNOP'): string[] {
  if (r.status === 'infeasible') return ['No corner exists: the constraints cannot all be true together.'];
  const lines = r.corners.map((c, i) => {
    const b = binding(cons, c.p), x = f3(c.p[0]), y = f3(c.p[1]);
    return `${names[i + 1]} (${x}, ${y}) is where ${b.slice(0, 2).join(' meets ') || 'the lines meet'}. Z = ${f3(p)}(${x}) + ${f3(q)}(${y}) = ${f3(c.z)}.`;
  });
  if (r.status === 'unbounded') lines.push(`The region is open (unbounded). Z can be pushed ${goal === 'max' ? 'higher' : 'lower'} without limit, so there is no ${goal === 'max' ? 'maximum' : 'minimum'}.`);
  else lines.push(`The ${goal === 'max' ? 'largest' : 'smallest'} Z is ${f3(r.best)}, so that is the ${goal === 'max' ? 'maximum' : 'minimum'}.${r.many ? ' It happens at more than one corner, so every point between them is also optimal.' : ''}`);
  return lines;
}
/** Does the point (x, y) meet every constraint? Lists the ones it breaks, and its Z. */
export function checkPoint(cons: Con[], x: number, y: number, p: number, q: number): { ok: boolean; broken: string[]; z: number } {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { ok: false, broken: [], z: NaN };
  const broken: string[] = [];
  if (x < 0) broken.push('x ≥ 0');
  if (y < 0) broken.push('y ≥ 0');
  cons.forEach((k, i) => { const v = k.a * x + k.b * y, ok = k.op === '<=' ? v <= k.c + 1e-9 : v >= k.c - 1e-9; if (!ok) broken.push(`line ${i + 1} (${conText(k)}): the left side is ${f3(v)}`); });
  return { ok: broken.length === 0, broken, z: p * x + q * y };
}
