// Class 12 Determinants: the determinant of a 2x2 matrix is the SIGNED AREA of the parallelogram built on its two rows
// (as vectors a = (a1, a2) and b = (b1, b2)): det = a1*b2 - a2*b1. Counter-clockwise from a to b gives a positive value,
// clockwise a negative one, and when the vectors lie on one line the parallelogram is flat and the determinant is 0.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';
import { axes } from '../../kit.js';
import { drag, sg } from '../c12m-lib.js';

export default function (host) {
  let a = [3, 1], b = [1, 2], half = false, G = null;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A parallelogram made from two draggable vectors whose signed area is the determinant' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Shade', [[false, 'Parallelogram'], [true, 'Triangle (half)']], false, (v) => { half = v; say(); });
  const snap = (v) => Math.max(-5, Math.min(5, Math.round(v * 2) / 2));
  drag(cv, () => (G ? [{ x: G.X(a[0]), y: G.Y(a[1]) }, { x: G.X(b[0]), y: G.Y(b[1]) }] : []), (i, x, y) => {
    const p = [snap(G.invX(x)), snap(G.invY(y))]; if (i === 0) a = p; else b = p; say();
  });
  function say() {
    const d = a[0] * b[1] - a[1] * b[0];
    out.innerHTML = `Rows (${sg(a[0])}, ${sg(a[1])}) and (${sg(b[0])}, ${sg(b[1])}): det = ${sg(a[0])}×${sg(b[1])} − ${sg(a[1])}×${sg(b[0])} = <b>${sg(d)}</b>. Area of the parallelogram = |det| = <b>${Math.abs(d)}</b> square units${half ? `, triangle = ${Math.abs(d) / 2}` : ''}. ${d === 0 ? 'Flat: the vectors lie on one line.' : d > 0 ? 'Turning from a to b is counter-clockwise: positive.' : 'Turning from a to b is clockwise: negative.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Drag the two dots: det = signed area', col);
    const A = axes(ctx, w, h, col, { x: [-5, 5], y: [-5, 5], l: 30, r: 12, t: 40, b: 26, xt: [-4, -2, 0, 2, 4], yt: [-4, -2, 0, 2, 4] });
    G = { ...A, invX: (px) => -5 + ((px - A.L) / (A.R - A.L)) * 10, invY: (py) => -5 + ((A.B - py) / (A.B - A.T)) * 10 };
    const d = a[0] * b[1] - a[1] * b[0], c = d >= 0 ? col.s[1] : col.s[2];
    const P = [[0, 0], a, half ? null : [a[0] + b[0], a[1] + b[1]], b].filter(Boolean).map(([x, y]) => [A.X(x), A.Y(y)]);
    ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    ctx.globalAlpha = 0.3; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke();
    line(ctx, [[A.X(0), A.Y(0)], [A.X(a[0]), A.Y(a[1])]], col.s[0], 3); line(ctx, [[A.X(0), A.Y(0)], [A.X(b[0]), A.Y(b[1])]], col.s[3], 3);
    dot(ctx, A.X(a[0]), A.Y(a[1]), 8, col.s[0], col.ink); dot(ctx, A.X(b[0]), A.Y(b[1]), 8, col.s[3], col.ink);
    text(ctx, 'a', A.X(a[0]) + 10, A.Y(a[1]) - 10, { color: col.s[0], size: 13, weight: 800, halo: col.panel });
    text(ctx, 'b', A.X(b[0]) + 10, A.Y(b[1]) - 10, { color: col.s[3], size: 13, weight: 800, halo: col.panel });
    text(ctx, `det = ${sg(d)}`, A.X(-5) + 8, A.T + 12, { color: c, size: 14, weight: 800, halo: col.panel });
  };
  say();
}
