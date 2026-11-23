// Class 12 Determinants: the area of the triangle with corners (x1,y1), (x2,y2), (x3,y3) is half the absolute value of the
// 3x3 determinant with rows (x, y, 1). Drag the corners: when the three points fall on one line the area is 0, which is
// the test for collinear points.
import { canvas, text, title, line, dot, axes, row, readout } from '../../kit.js';
import { drag, det3, sg } from '../c12m-lib.js';

export default function (host) {
  let P = [[-3, -2], [4, -1], [1, 4]], G = null;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A triangle with draggable corners and its area from a determinant' });
  const out = readout(host);
  drag(cv, () => (G ? P.map((p) => ({ x: G.X(p[0]), y: G.Y(p[1]) })) : []), (i, x, y) => {
    const sn = (v) => Math.max(-5, Math.min(5, Math.round(v)));
    P[i] = [sn(-5 + ((x - G.L) / (G.R - G.L)) * 10), sn(-5 + ((G.B - y) / (G.B - G.T)) * 10)]; say();
  });
  const D = () => det3([[P[0][0], P[0][1], 1], [P[1][0], P[1][1], 1], [P[2][0], P[2][1], 1]]);
  function say() {
    const d = D();
    out.innerHTML = `Area = ½ |det| with rows (x, y, 1): the determinant is <b>${sg(d)}</b>, so area = <b>${Math.abs(d) / 2}</b> square units. ${d === 0 ? '<b>Area 0: the three points are collinear.</b>' : 'Drag a corner onto the line through the other two to make it zero.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Area of a triangle from three points', col);
    const A = axes(ctx, w, h, col, { x: [-5, 5], y: [-5, 5], l: 30, r: 12, t: 40, b: 26, xt: [-4, -2, 0, 2, 4], yt: [-4, -2, 0, 2, 4] }); G = A;
    const pts = P.map(([x, y]) => [A.X(x), A.Y(y)]), d = D(), c = d === 0 ? col.s[2] : col.s[1];
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    ctx.globalAlpha = 0.28; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.stroke();
    ['A', 'B', 'C'].forEach((n, i) => { dot(ctx, pts[i][0], pts[i][1], 8, col.s[i === 0 ? 0 : i === 1 ? 3 : 4], col.ink); text(ctx, `${n}(${P[i][0]}, ${P[i][1]})`, pts[i][0] + 10, pts[i][1] - 12, { color: col.ink, size: 11.5, weight: 700, halo: col.panel }); });
  };
  say();
}
