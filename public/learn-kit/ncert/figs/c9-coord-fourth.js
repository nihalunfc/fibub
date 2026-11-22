// Class 9 Coordinates: the fourth vertex of a parallelogram ABCD. With A and B fixed and C chosen by you, D = A + C - B,
// and the diagonals AC and BD have the same mid-point ((x1+x2)/2, (y1+y2)/2): that is why the corners fit.
import { canvas, text, title, row, slider, readout, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(+v.toFixed(1)).replace('-', '−');
export default function (host) {
  let cx = 4, cy = 2;
  const A = [-3, -2], B = [1, -3];
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A parallelogram with three chosen corners and the fourth found by the mid-point of its diagonals' });
  const ctl = row(host);
  slider(ctl, { label: 'C: x', min: -2, max: 6, step: 1, value: cx, fmt: num, oninput: (v) => { cx = v; upd(); } });
  slider(ctl, { label: 'C: y', min: -1, max: 6, step: 1, value: cy, fmt: num, oninput: (v) => { cy = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Find D so that ABCD is a parallelogram', col), g = plane(ctx, w, h, col, { top: t + 6, x0: -6, x1: 7, y0: -5, y1: 7 });
    const D = [A[0] + cx - B[0], A[1] + cy - B[1]], M = [(A[0] + cx) / 2, (A[1] + cy) / 2], pts = [A, B, [cx, cy], D];
    ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[0]; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(g.X(p[0]), g.Y(p[1])) : ctx.moveTo(g.X(p[0]), g.Y(p[1])))); ctx.closePath(); ctx.fill(); ctx.restore();
    line(ctx, [...pts, A].map((p) => [g.X(p[0]), g.Y(p[1])]), col.s[0], 3);
    ctx.save(); ctx.setLineDash([5, 4]); line(ctx, [[g.X(A[0]), g.Y(A[1])], [g.X(cx), g.Y(cy)]], col.s[5], 2); line(ctx, [[g.X(B[0]), g.Y(B[1])], [g.X(D[0]), g.Y(D[1])]], col.s[5], 2); ctx.restore();
    pts.forEach((p, i) => { dot(ctx, g.X(p[0]), g.Y(p[1]), i === 3 ? 8 : 6, i === 3 ? col.s[3] : col.s[2], col.ink); text(ctx, 'ABCD'[i] + ' (' + num(p[0]) + ', ' + num(p[1]) + ')', g.X(p[0]), g.Y(p[1]) + (p[1] >= M[1] ? -14 : 15), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); });
    dot(ctx, g.X(M[0]), g.Y(M[1]), 4, col.ink);
  };
  function upd() { const D = [A[0] + cx - B[0], A[1] + cy - B[1]]; out.innerHTML = `Mid-point of AC = ((−3 + ${num(cx)})/2, (−2 + ${num(cy)})/2) = (${num((A[0] + cx) / 2)}, ${num((A[1] + cy) / 2)}). Mid-point of BD must be the same, so D = (${num(A[0] + cx - B[0])}, ${num(A[1] + cy - B[1])}). The dot where the dashed diagonals cross is that shared mid-point.`; cv.redraw(); }
  upd();
}
