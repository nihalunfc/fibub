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
