// Drag the three corners of a triangle. The sides, angles and area update, and you can watch the sine rule
// a/sin A = b/sin B = c/sin C = 2R (R = radius of the circle through all three corners) and the cosine rule
// c² = a² + b² − 2ab cos C hold for every shape. Switch on the circumcircle or the incircle; make C a right angle.
import { canvas, row, choice, button, readout, text, dot, line } from '../kit.js';
import { drag, f2 } from './_math.js';

export default function (host) {
  let P = [[70, 190], [290, 200], [180, 60]], show = 'circ';
  const cv = canvas(host, { aspect: 0.78, max: 380, min: 270, label: 'A triangle with draggable corners and its circumcircle' });
  const ctl = row(host);
  choice(ctl, 'Circle', [['circ', 'Circumcircle'], ['in', 'Incircle'], ['none', 'None']], show, (v) => { show = v; draw(); });
  button(ctl, 'Make right-angled', () => { const [A, B] = P; const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], r = Math.hypot(B[0] - A[0], B[1] - A[1]) / 2; P[2] = [m[0] + r * Math.cos(-1.2), m[1] + r * Math.sin(-1.2)]; draw(); });
  const out = readout(host);
  drag(cv, () => P, (i, x, y) => { P[i] = [Math.min(Math.max(x, 12), cv.w - 12), Math.min(Math.max(y, 30), cv.h - 12)]; draw(); });
  const draw = () => cv.redraw();
  cv.draw = (ctx, w, h, col) => {
    const u = 40 / 1, [A, B, C] = P, d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) / u;
    const a = d(B, C), b = d(A, C), c = d(A, B);
    const ang = (x, y, z) => Math.acos(Math.min(1, Math.max(-1, (y * y + z * z - x * x) / (2 * y * z))));
    const [aA, aB, aC] = [ang(a, b, c), ang(b, a, c), ang(c, a, b)], s = (a + b + c) / 2;
    const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c))), R = (a * b * c) / (4 * area || 1e-9), r = area / s;
    ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    if (area > 1e-6) {
      if (show === 'circ') {
        const D = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])) || 1e-9;
        const k = (p) => p[0] * p[0] + p[1] * p[1];
        const ux = (k(A) * (B[1] - C[1]) + k(B) * (C[1] - A[1]) + k(C) * (A[1] - B[1])) / D, uy = (k(A) * (C[0] - B[0]) + k(B) * (A[0] - C[0]) + k(C) * (B[0] - A[0])) / D;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); ctx.beginPath(); ctx.arc(ux, uy, R * u, 0, 7); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.restore();
        dot(ctx, ux, uy, 3, col.s[1]);
      } else if (show === 'in') {
        const ix = (a * A[0] + b * B[0] + c * C[0]) / (a + b + c), iy = (a * A[1] + b * B[1] + c * C[1]) / (a + b + c);
        ctx.beginPath(); ctx.arc(ix, iy, r * u, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.stroke(); dot(ctx, ix, iy, 3, col.s[2]);
      }
    }
    const lab = (p, q, o, s2, colr) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], v = [m[0] - o[0], m[1] - o[1]], n = Math.hypot(...v) || 1; text(ctx, s2, m[0] + (v[0] / n) * 14, m[1] + (v[1] / n) * 12, { color: colr, size: 12, weight: 700, align: 'center' }); };
    lab(B, C, A, 'a', col.s[0]); lab(A, C, B, 'b', col.s[0]); lab(A, B, C, 'c', col.s[0]);
    [['A', A, B, C], ['B', B, A, C], ['C', C, A, B]].forEach(([n, p, q, z], i) => { const v = [p[0] - (q[0] + z[0]) / 2, p[1] - (q[1] + z[1]) / 2], m = Math.hypot(...v) || 1; dot(ctx, p[0], p[1], 7, col.s[3], col.ink); text(ctx, n, p[0] + (v[0] / m) * 16, p[1] + (v[1] / m) * 16, { color: col.s[3], size: 14, weight: 700, align: 'center' }); });
    text(ctx, 'Drag the corners', 10, h - 10, { color: col.muted, size: 11 });
    const deg = (v) => (v * 180) / Math.PI;
    out.innerHTML = `a = ${f2(a)}, b = ${f2(b)}, c = ${f2(c)} · A = ${f2(deg(aA), 1)}°, B = ${f2(deg(aB), 1)}°, C = ${f2(deg(aC), 1)}° (sum ${f2(deg(aA + aB + aC), 1)}°).<br>Sine rule: a/sin A = ${f2(a / Math.sin(aA || 1e-9))}, b/sin B = ${f2(b / Math.sin(aB || 1e-9))}, c/sin C = ${f2(c / Math.sin(aC || 1e-9))}, and 2R = <b>${f2(2 * R)}</b>.<br>Cosine rule: a² + b² − 2ab cos C = ${f2(a * a + b * b - 2 * a * b * Math.cos(aC))} = c² = ${f2(c * c)}. Area = ½ab sin C = ${f2(0.5 * a * b * Math.sin(aC))}; r = area/s = ${f2(r)}.`;
  };
  draw();
}
