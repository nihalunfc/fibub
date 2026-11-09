// Ruler-and-compass constructions that update when points move: each object is defined from
// earlier ones (a midpoint of two points, the intersection of a line and a circle, ...), and
// evaluate() recomputes them all in order. Objects that cannot exist (parallel lines, circles that
// do not meet) come out as null. Plain TypeScript, no DOM.

export type Def =
  | { k: 'point'; x: number; y: number }
  | { k: 'mid'; a: string; b: string }
  | { k: 'inter'; a: string; b: string; i: 0 | 1 }
  | { k: 'segment' | 'line'; a: string; b: string }
  | { k: 'circle'; c: string; p: string }
  | { k: 'perp' | 'par'; l: string; p: string }
  | { k: 'pbis'; a: string; b: string }
  | { k: 'abis'; a: string; b: string; c: string }
  | { k: 'dist'; a: string; b: string }
  | { k: 'angle'; a: string; b: string; c: string }
  | { k: 'poly'; pts: string[] };
export type Item = { id: string; def: Def };
export type Pt = { t: 'pt'; x: number; y: number };
/** A line through (px, py) with unit direction (dx, dy); a segment also has its length. */
export type Ln = { t: 'ln'; px: number; py: number; dx: number; dy: number; len?: number };
export type Ci = { t: 'ci'; cx: number; cy: number; r: number };
export type Val = { t: 'val'; v: number; unit: 'length' | 'degrees' };
export type Pg = { t: 'pg'; pts: [number, number][]; area: number; perimeter: number };
export type Geo = Pt | Ln | Ci | Val | Pg;

const EPS = 1e-12;
const pt = (x: number, y: number): Pt => ({ t: 'pt', x, y });
function lineThrough(a: Pt, b: Pt, seg: boolean): Ln | null {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
  if (L < EPS) return null;
  return seg ? { t: 'ln', px: a.x, py: a.y, dx: dx / L, dy: dy / L, len: L } : { t: 'ln', px: a.x, py: a.y, dx: dx / L, dy: dy / L };
}
const onSeg = (l: Ln, s: number) => l.len === undefined || (s >= -1e-9 * Math.max(1, l.len) && s <= l.len * (1 + 1e-9) + 1e-12);

/** The intersection points of two lines or circles (0, 1 or 2 of them, in a fixed order). */
export function intersect(A: Ln | Ci, B: Ln | Ci): Pt[] {
  if (A.t === 'ln' && B.t === 'ln') {
    const den = A.dx * B.dy - A.dy * B.dx;
    if (Math.abs(den) < 1e-12) return [];
    const ex = B.px - A.px, ey = B.py - A.py, s = (ex * B.dy - ey * B.dx) / den, u = (ex * A.dy - ey * A.dx) / den;
    return onSeg(A, s) && onSeg(B, u) ? [pt(A.px + s * A.dx, A.py + s * A.dy)] : [];
  }
  if (A.t === 'ci' && B.t === 'ln') return intersect(B, A);
  if (A.t === 'ln' && B.t === 'ci') {
    const fx = A.px - B.cx, fy = A.py - B.cy, b = fx * A.dx + fy * A.dy, c = fx * fx + fy * fy - B.r * B.r, disc = b * b - c;
    if (disc < -1e-12 * Math.max(1, B.r * B.r)) return [];
    const r = Math.sqrt(Math.max(0, disc)), ts = disc <= 0 ? [-b] : [-b - r, -b + r];
    return ts.filter((s) => onSeg(A, s)).map((s) => pt(A.px + s * A.dx, A.py + s * A.dy));
  }
  const a = A as Ci, c2 = B as Ci, dx = c2.cx - a.cx, dy = c2.cy - a.cy, d = Math.hypot(dx, dy);
  if (d < EPS || d > a.r + c2.r + 1e-12 * d || d < Math.abs(a.r - c2.r) - 1e-12 * d) return [];
  const along = (d * d + a.r * a.r - c2.r * c2.r) / (2 * d), h = Math.sqrt(Math.max(0, a.r * a.r - along * along));
  const mx = a.cx + (along * dx) / d, my = a.cy + (along * dy) / d;
  if (h === 0) return [pt(mx, my)];
  // First the point to the left of the line from the first centre to the second.
  return [pt(mx - (h * dy) / d, my + (h * dx) / d), pt(mx + (h * dy) / d, my - (h * dx) / d)];
}
/** Angle ABC at B, 0 to 180 degrees. */
export function angleDeg(a: Pt, b: Pt, c: Pt): number {
  const ux = a.x - b.x, uy = a.y - b.y, vx = c.x - b.x, vy = c.y - b.y;
  return (Math.atan2(Math.abs(ux * vy - uy * vx), ux * vx + uy * vy) * 180) / Math.PI;
}
/** Shoelace area (always positive) and perimeter of a polygon. */
export function polygonMeasures(p: [number, number][]) {
  let s = 0, per = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; s += x1 * y2 - x2 * y1; per += Math.hypot(x2 - x1, y2 - y1); }
  return { area: Math.abs(s) / 2, perimeter: per };
}

/** Recompute every object in order. Anything built on an object that does not exist does not exist either. */
export function evaluate(items: Item[]): Map<string, Geo | null> {
  const g = new Map<string, Geo | null>();
  const P = (id: string) => { const o = g.get(id); return o && o.t === 'pt' ? o : null; };
  const C = (id: string) => { const o = g.get(id); return o && (o.t === 'ln' || o.t === 'ci') ? o : null; };
  const L = (id: string) => { const o = g.get(id); return o && o.t === 'ln' ? o : null; };
  for (const { id, def: d } of items) {
    let out: Geo | null = null;
    switch (d.k) {
      case 'point': out = pt(d.x, d.y); break;
      case 'mid': { const a = P(d.a), b = P(d.b); if (a && b) out = pt((a.x + b.x) / 2, (a.y + b.y) / 2); break; }
      case 'inter': { const a = C(d.a), b = C(d.b); if (a && b) { const r = intersect(a, b); out = r[d.i] ?? null; } break; }
      case 'segment': case 'line': { const a = P(d.a), b = P(d.b); if (a && b) out = lineThrough(a, b, d.k === 'segment'); break; }
      case 'circle': { const c = P(d.c), p = P(d.p); if (c && p) { const r = Math.hypot(p.x - c.x, p.y - c.y); if (r > EPS) out = { t: 'ci', cx: c.x, cy: c.y, r }; } break; }
      case 'perp': case 'par': {
        const l = L(d.l), p = P(d.p);
        if (l && p) out = d.k === 'par' ? { t: 'ln', px: p.x, py: p.y, dx: l.dx, dy: l.dy } : { t: 'ln', px: p.x, py: p.y, dx: -l.dy, dy: l.dx };
        break;
      }
      case 'pbis': { const a = P(d.a), b = P(d.b); if (a && b) { const l = lineThrough(a, b, false); if (l) out = { t: 'ln', px: (a.x + b.x) / 2, py: (a.y + b.y) / 2, dx: -l.dy, dy: l.dx }; } break; }
      case 'abis': {
        const a = P(d.a), b = P(d.b), c = P(d.c);
        if (a && b && c) {
          const ua = lineThrough(b, a, false), uc = lineThrough(b, c, false);
          if (ua && uc) {
            let dx = ua.dx + uc.dx, dy = ua.dy + uc.dy; const n = Math.hypot(dx, dy);
            if (n < 1e-12) { dx = -ua.dy; dy = ua.dx; } else { dx /= n; dy /= n; }
            out = { t: 'ln', px: b.x, py: b.y, dx, dy };
          }
        }
        break;
      }
      case 'dist': { const a = P(d.a), b = P(d.b); if (a && b) out = { t: 'val', v: Math.hypot(a.x - b.x, a.y - b.y), unit: 'length' }; break; }
      case 'angle': { const a = P(d.a), b = P(d.b), c = P(d.c); if (a && b && c && Math.hypot(a.x - b.x, a.y - b.y) > EPS && Math.hypot(c.x - b.x, c.y - b.y) > EPS) out = { t: 'val', v: angleDeg(a, b, c), unit: 'degrees' }; break; }
      case 'poly': { const ps = d.pts.map(P); if (ps.every(Boolean)) { const pts = ps.map((p) => [p!.x, p!.y] as [number, number]); out = { t: 'pg', pts, ...polygonMeasures(pts) }; } break; }
    }
    g.set(id, out);
  }
  return g;
}
/** The ids an object is built from. */
export function parents(d: Def): string[] {
  switch (d.k) {
    case 'point': return [];
    case 'circle': return [d.c, d.p];
    case 'perp': case 'par': return [d.l, d.p];
    case 'abis': case 'angle': return [d.a, d.b, d.c];
    case 'poly': return d.pts;
    default: return [d.a, d.b];
  }
}
/** An object and everything built on it, for deleting. */
export function dependants(items: Item[], id: string): Set<string> {
  const out = new Set([id]);
  for (const it of items) if (parents(it.def).some((p) => out.has(p))) out.add(it.id);
  return out;
}
/** Distance from (x, y) to a line, segment or circle. */
export function distanceTo(o: Ln | Ci, x: number, y: number): number {
  if (o.t === 'ci') return Math.abs(Math.hypot(x - o.cx, y - o.cy) - o.r);
  let s = (x - o.px) * o.dx + (y - o.py) * o.dy;
  if (o.len !== undefined) s = Math.max(0, Math.min(o.len, s));
  return Math.hypot(x - (o.px + s * o.dx), y - (o.py + s * o.dy));
}
