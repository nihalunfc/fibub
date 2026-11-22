// Class 9 Coordinates: the distance between any two points A(x1, y1) and B(x2, y2). Draw the right triangle whose legs are
// parallel to the axes: legs |x2 - x1| and |y2 - y1|, and by Pythagoras d = sqrt((x2 - x1)^2 + (y2 - y1)^2).
import { canvas, text, title, row, slider, readout, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(v).replace('-', '−');
export default function (host) {
  let p = [-4, -2, 3, 3], g;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Two points joined by a line with the right triangle drawn under it, showing the distance by Pythagoras' });
  const ctl = row(host);
  ['x₁', 'y₁', 'x₂', 'y₂'].forEach((n, i) => slider(ctl, { label: n, min: -6, max: 6, step: 1, value: p[i], fmt: num, oninput: (v) => { p[i] = v; upd(); } }));
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const [x1, y1, x2, y2] = p, d = Math.hypot(x2 - x1, y2 - y1), t = title(ctx, 'd = ' + (+d.toFixed(3)), col);
    g = plane(ctx, w, h, col, { top: t + 6 });
    ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(g.X(x1), g.Y(y1)); ctx.lineTo(g.X(x2), g.Y(y1)); ctx.lineTo(g.X(x2), g.Y(y2)); ctx.closePath(); ctx.fill(); ctx.restore();
    line(ctx, [[g.X(x1), g.Y(y1)], [g.X(x2), g.Y(y1)]], col.s[0], 3); line(ctx, [[g.X(x2), g.Y(y1)], [g.X(x2), g.Y(y2)]], col.s[2], 3);
    line(ctx, [[g.X(x1), g.Y(y1)], [g.X(x2), g.Y(y2)]], col.s[5], 3);
    if (x1 !== x2 && y1 !== y2) { const sx = Math.sign(x1 - x2) * 9, sy = Math.sign(y2 - y1) * 9, cx = g.X(x2), cy = g.Y(y1); line(ctx, [[cx + sx, cy], [cx + sx, cy - sy], [cx, cy - sy]], col.ink, 1.5); }
    dot(ctx, g.X(x1), g.Y(y1), 6, col.s[2], col.ink); dot(ctx, g.X(x2), g.Y(y2), 6, col.s[3], col.ink);
    text(ctx, 'A', g.X(x1) - 10, g.Y(y1) - 10, { color: col.ink, size: 12, weight: 700, halo: col.panel, align: 'center' }); text(ctx, 'B', g.X(x2) + 10, g.Y(y2) - 10, { color: col.ink, size: 12, weight: 700, halo: col.panel, align: 'center' });
  };
  function upd() {
    const [x1, y1, x2, y2] = p, dx = x2 - x1, dy = y2 - y1, s = dx * dx + dy * dy, d = Math.sqrt(s), whole = Number.isInteger(d);
    out.innerHTML = `Across: |${num(x2)} − (${num(x1)})| = <b>${Math.abs(dx)}</b>. Up or down: |${num(y2)} − (${num(y1)})| = <b>${Math.abs(dy)}</b>. d² = ${Math.abs(dx)}² + ${Math.abs(dy)}² = <b>${s}</b>, so d = ${s === 0 ? '0 (same point)' : whole ? '<b>' + d + '</b>' : '√' + s + ' ≈ <b>' + d.toFixed(3) + '</b>'}.` + (whole && s ? ' A whole number: a Pythagorean triple!' : '');
    cv.redraw();
  }
  upd();
}
