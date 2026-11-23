// Class 11 Motion in a Plane (step player): why a body in uniform circular motion accelerates towards the centre. In a short time dt the body moves from P1 to P2 along an arc
// ds = v dt, and the velocity turns through the same angle d(theta) that the radius turns through. The velocity triangle (two sides v, v and the base dv) is similar to the
// triangle of two radii and the chord: dv/v = ds/r, so dv = v ds / r and a = dv/dt = v (ds/dt)/r = v^2/r, pointing to the centre as dt -> 0.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 330, label: 'Two positions on a circle and the triangle of velocities used to find the centripetal acceleration' });
  const T = ['Constant speed v on a circle of radius r', 'The velocity changes direction', 'Subtract: the triangle of velocities', 'Similar triangles: Δv/v = Δs/r', 'Divide by Δt', 'Δt → 0: Δv points to the centre'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const R = Math.min(w * 0.2, h * 0.19), cx = w * 0.26, cy = h * 0.36, a1 = 1.35, a2 = 0.45, P = (a) => [cx + R * Math.cos(a), cy - R * Math.sin(a)];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.stroke(); dot(ctx, cx, cy, 3, col.ink);
    const [x1, y1] = P(a1), [x2, y2] = P(a2), vl = R * 0.7, t1 = [Math.sin(a1), Math.cos(a1)], t2 = [Math.sin(a2), Math.cos(a2)];
    ctx.beginPath(); ctx.arc(cx, cy, R, -a1, -a2); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 4; ctx.stroke();
    dot(ctx, x1, y1, 5, col.s[0], col.panel); dot(ctx, x2, y2, 5, col.s[0], col.panel); text(ctx, 'P₁', x1 - 6, y1 - 10, { size: 11, weight: 700, align: 'right' }); text(ctx, 'P₂', x2 + 8, y2 - 8, { size: 11, weight: 700 });
    arrow(ctx, x1, y1, x1 - t1[0] * vl, y1 - t1[1] * vl, col.s[1], 2.5, 8); if (step >= 1) arrow(ctx, x2, y2, x2 - t2[0] * vl, y2 - t2[1] * vl, col.s[2], 2.5, 8);
    text(ctx, 'v₁', x1 - t1[0] * vl - 4, y1 - t1[1] * vl - 6, { size: 11, weight: 700, color: col.s[1], align: 'right' }); if (step >= 1) text(ctx, 'v₂', x2 - t2[0] * vl + 6, y2 - t2[1] * vl - 8, { size: 11, weight: 700, color: col.s[2] });
    if (step >= 3) { line(ctx, [[cx, cy], [x1, y1]], col.muted, 1.5); line(ctx, [[cx, cy], [x2, y2]], col.muted, 1.5); line(ctx, [[x1, y1], [x2, y2]], col.s[3], 1.5, [4, 3]); text(ctx, 'r', cx + (x1 - cx) / 2 - 8, cy + (y1 - cy) / 2, { size: 11, weight: 700, align: 'right' }); text(ctx, 'Δs', (x1 + x2) / 2 + 12, (y1 + y2) / 2 + 12, { size: 11, weight: 700, color: col.s[3] }); text(ctx, 'Δθ', cx + 26, cy - 10, { size: 11, weight: 700 }); }
    if (step >= 2) {
      const ox = w * 0.9, oy = h * 0.36, v1 = [-t1[0] * vl * 1.6, -t1[1] * vl * 1.6], v2 = [-t2[0] * vl * 1.6, -t2[1] * vl * 1.6];
      arrow(ctx, ox, oy, ox + v1[0], oy + v1[1], col.s[1], 2.5, 8); arrow(ctx, ox, oy, ox + v2[0], oy + v2[1], col.s[2], 2.5, 8);
      arrow(ctx, ox + v1[0], oy + v1[1], ox + v2[0], oy + v2[1], col.s[3], 3.2, 9);
      text(ctx, 'v₁', ox + v1[0] / 2 - 6, oy + v1[1] / 2 - 4, { size: 11, weight: 700, color: col.s[1], align: 'right' }); text(ctx, 'v₂', ox + v2[0] / 2 + 8, oy + v2[1] / 2 + 8, { size: 11, weight: 700, color: col.s[2] });
      text(ctx, 'Δv = v₂ − v₁', ox + (v1[0] + v2[0]) / 2 - 6, oy + Math.max(v1[1], v2[1]) + 22, { size: 11, weight: 700, color: col.s[3], align: 'center' });
    }
    const y0 = h * 0.6 + 30, Ln = (s, i, c = col.ink) => text(ctx, s, 14, y0 + i * 22, { size: 13, weight: 700, color: c });
    if (step === 0) { Ln('speed v is the same at P₁ and P₂;', 0, col.muted); Ln('Δs = v Δt is the arc from P₁ to P₂.', 1, col.muted); }
    if (step === 1) { Ln('v₁ and v₂ have the same length', 0, col.muted); Ln('but different directions: a changes v.', 1, col.s[1]); }
    if (step === 2) { Ln('Move both velocities to a common point.', 0, col.muted); Ln('Δv = v₂ − v₁ closes the triangle.', 1, col.s[3]); }
    if (step === 3) { Ln('Both triangles are isosceles with apex angle Δθ.', 0, col.muted); Ln('Δv / v = Δs / r', 1, col.s[3]); Ln('so Δv = v Δs / r', 2, col.s[3]); }
    if (step >= 4) { Ln('a = Δv/Δt = (v/r)(Δs/Δt) = (v/r) v', 0, col.muted); Ln('a = v² / r  =  ω² r', 1, col.s[3]); }
    if (step === 5) { Ln('Δv ⟂ v: the acceleration points at the centre.', 2, col.s[3]); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
