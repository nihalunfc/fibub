// Class 9 Coordinates: distance between two points on a line parallel to an axis. On a horizontal line the distance is
// |x2 - x1| (y is the same); on a vertical line it is |y2 - y1|. When the points are on opposite sides of an axis you ADD the
// two distances from the axis, which is what the subtraction |x2 - x1| does automatically.
import { canvas, text, title, row, choice, slider, readout, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(v).replace('-', '−');
export default function (host) {
  let dir = 'h', c = 2, a = -3, b = 4, g;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Two points on a horizontal or vertical line and the distance between them' });
  const top = row(host); choice(top, 'Line', [['h', 'Horizontal'], ['v', 'Vertical']], dir, (v) => { dir = v; upd(); });
  const ctl = row(host);
  const sc = slider(ctl, { label: 'Fixed coordinate', min: -5, max: 5, step: 1, value: c, fmt: num, oninput: (v) => { c = v; upd(); } });
  slider(ctl, { label: 'First point', min: -5, max: 5, step: 1, value: a, fmt: num, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'Second point', min: -5, max: 5, step: 1, value: b, fmt: num, oninput: (v) => { b = v; upd(); } });
  const out = readout(host);
  const P = (v) => (dir === 'h' ? [v, c] : [c, v]);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, dir === 'h' ? 'Same y: the points are side by side' : 'Same x: the points are one above the other', col);
    g = plane(ctx, w, h, col, { top: t + 6, x0: -6, x1: 6, y0: -6, y1: 6 });
    const A = P(a), B = P(b);
    line(ctx, [[g.X(A[0]), g.Y(A[1])], [g.X(B[0]), g.Y(B[1])]], col.s[0], 4);
    for (const [Q, nm, k] of [[A, 'A', 2], [B, 'B', 3]]) { dot(ctx, g.X(Q[0]), g.Y(Q[1]), 7, col.s[k], col.ink); text(ctx, nm + ' (' + num(Q[0]) + ', ' + num(Q[1]) + ')', g.X(Q[0]), g.Y(Q[1]) + (dir === 'h' ? -15 : (nm === 'A') === (a < b) ? 16 : -15), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); }
  };
  function upd() {
    const A = P(a), B = P(b), i = dir === 'h' ? 0 : 1, nm = dir === 'h' ? 'x' : 'y', d = Math.abs(B[i] - A[i]);
    const opp = A[i] * B[i] < 0;
    out.innerHTML = `A(${num(A[0])}, ${num(A[1])}), B(${num(B[0])}, ${num(B[1])}). The ${dir === 'h' ? 'y' : 'x'}-coordinates match, so only <b>${nm}</b> differs. Distance = |${nm}₂ − ${nm}₁| = |${num(B[i])} − (${num(A[i])})| = <b>${d}</b>.` + (opp ? ` The points are on opposite sides of the ${dir === 'h' ? 'y' : 'x'}-axis, so the distance is ${Math.abs(A[i])} + ${Math.abs(B[i])}, not ${Math.abs(Math.abs(B[i]) - Math.abs(A[i]))}.` : '');
    cv.redraw();
  }
  upd();
}
