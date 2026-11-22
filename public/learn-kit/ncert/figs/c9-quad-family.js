// Class 9 Quadrilaterals: drag the four corners of a quadrilateral (snapped to the grid so the checks are exact) and see
// which properties hold: parallel sides, equal sides, equal angles, diagonals that bisect, are equal or are perpendicular.
// The name (parallelogram, rectangle, rhombus, square, kite, trapezium) follows from which properties are true.
import { canvas, text, title, row, button, readout } from '../../kit.js';
import { view, grid, shape, seg, dragger, handle, sub, len, cross, dotp, mid } from './c9-quad-lib.js';

const PRE = { Parallelogram: [[2, 2], [8, 2], [10, 6], [4, 6]], Rectangle: [[2, 2], [10, 2], [10, 6], [2, 6]], Rhombus: [[2, 4], [5, 1], [8, 4], [5, 7]], Square: [[3, 2], [8, 2], [8, 7], [3, 7]], Kite: [[2, 4], [5, 1], [10, 4], [5, 7]], Trapezium: [[1, 2], [11, 2], [9, 6], [4, 6]], Odd: [[1, 1], [9, 2], [10, 7], [3, 5]] };
const eq = (a, b) => Math.abs(a - b) < 1e-6;

export default function (host) {
  let P = PRE.Parallelogram.map((p) => p.slice()), V = null;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A quadrilateral with draggable corners and a list of the properties that are true' });
  const ctl = row(host); const out = readout(host);
  Object.keys(PRE).forEach((k) => button(ctl, k, () => { P = PRE[k].map((p) => p.slice()); sync(); }));
  const info = () => {
    const [A, B, C, D] = P, ab = sub(B, A), bc = sub(C, B), cd = sub(D, C), da = sub(A, D);
    const turn = [cross(ab, bc), cross(bc, cd), cross(cd, da), cross(da, ab)];
    const convex = turn.every((t) => t > 1e-9) || turn.every((t) => t < -1e-9);
    const par1 = eq(cross(ab, cd), 0), par2 = eq(cross(bc, da), 0);
    const s = [len(A, B), len(B, C), len(C, D), len(D, A)];
    const oppEq = eq(s[0], s[2]) && eq(s[1], s[3]), allEq = oppEq && eq(s[0], s[1]);
    const right = [dotp(ab, bc), dotp(bc, cd), dotp(cd, da), dotp(da, ab)].every((v) => eq(v, 0));
    const m1 = mid(A, C), m2 = mid(B, D), bis = eq(m1[0], m2[0]) && eq(m1[1], m2[1]);
    const d1 = sub(C, A), d2 = sub(D, B), deq = eq(len(A, C), len(B, D)), perp = eq(dotp(d1, d2), 0);
    const kite = (eq(s[0], s[1]) && eq(s[2], s[3])) || (eq(s[1], s[2]) && eq(s[3], s[0]));
    let name = 'a general quadrilateral';
    if (!convex) name = 'not a proper convex quadrilateral (a corner points inwards or the sides cross)';
    else if (par1 && par2) name = allEq && right ? 'a square' : right ? 'a rectangle' : allEq ? 'a rhombus' : 'a parallelogram';
    else if (par1 || par2) name = 'a trapezium (one pair of parallel sides)';
    else if (kite) name = 'a kite';
    const ang = [0, 1, 2, 3].map((i) => { const a = sub(P[(i + 3) % 4], P[i]), b = sub(P[(i + 1) % 4], P[i]); return (Math.acos(Math.max(-1, Math.min(1, dotp(a, b) / (len(P[(i + 3) % 4], P[i]) * len(P[(i + 1) % 4], P[i]) || 1)))) * 180) / Math.PI; });
    return { name, convex, par1, par2, oppEq, allEq, right, bis, deq, perp, kite, ang, m1 };
  };
  function sync() {
    const q = info(), t = (b, s) => `${b ? '✓' : '✗'} ${s}`;
    out.innerHTML = `This is <b>${q.name}</b>.<br>${t(q.par1 && q.par2, 'both pairs of opposite sides parallel')} · ${t(q.oppEq, 'opposite sides equal')} · ${t(q.allEq, 'all four sides equal')}<br>${t(q.right, 'all angles 90°')} · ${t(q.bis, 'diagonals bisect each other')} · ${t(q.deq, 'diagonals equal')} · ${t(q.perp, 'diagonals perpendicular')}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Drag the corners: which properties hold?', col); V = view(w, h, top, 12, 8);
    grid(ctx, V, col); const q = info();
    shape(ctx, V, P, col.s[0], col.s[0], 0.22);
    seg(ctx, V, P[0], P[2], col.s[3], 1.5, [5, 4]); seg(ctx, V, P[1], P[3], col.s[3], 1.5, [5, 4]);
    const m = q.m1, m2 = mid(P[1], P[3]); dot2(ctx, V, m, col.s[3]); if (!q.bis) dot2(ctx, V, m2, col.s[4]);
    P.forEach((p, i) => { handle(ctx, V, p, col, dr.active === i); const cx = (P[0][0] + P[1][0] + P[2][0] + P[3][0]) / 4, cy = (P[0][1] + P[1][1] + P[2][1] + P[3][1]) / 4, dx = p[0] - cx, dy = p[1] - cy, L = Math.hypot(dx, dy) || 1;
      text(ctx, 'ABCD'[i], V.X(p[0]) + (dx / L) * 16, V.Y(p[1]) - (dy / L) * 16, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
      text(ctx, Math.round(q.ang[i]) + '°', V.X(p[0]) - (dx / L) * 20, V.Y(p[1]) + (dy / L) * 20, { color: col.muted, size: 10, align: 'center', halo: col.panel }); });
  };
  const dot2 = (ctx, v, p, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(v.X(p[0]), v.Y(p[1]), 4, 0, 7); ctx.fill(); };
  const dr = dragger(cv, P, () => V, { onmove: sync });
  sync();
}
