// Class 9 Coordinates: plotting a point. The x-coordinate says how far right (+) or left (-) of the y-axis; the
// y-coordinate says how far up (+) or down (-) from the x-axis. Click the grid or use the sliders; the dashed lines show the two moves.
import { canvas, line, dot, text, title, row, slider, readout } from '../../kit.js';

const num = (v) => String(v).replace('-', '−');
export function plane(ctx, w, h, col, { x0 = -6, x1 = 6, y0 = -6, y1 = 6, top = 28, tickEvery = 1 } = {}) {
  const bw = w - 24, bh = h - top - 10, s = Math.min(bw / (x1 - x0), bh / (y1 - y0));
  const ox = (w - s * (x1 - x0)) / 2, oy = top + (bh - s * (y1 - y0)) / 2;
  const X = (v) => ox + (v - x0) * s, Y = (v) => oy + (y1 - v) * s;
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = col.line;
  for (let i = x0; i <= x1; i++) { ctx.beginPath(); ctx.moveTo(Math.round(X(i)) + 0.5, Y(y1)); ctx.lineTo(Math.round(X(i)) + 0.5, Y(y0)); ctx.stroke(); }
  for (let j = y0; j <= y1; j++) { ctx.beginPath(); ctx.moveTo(X(x0), Math.round(Y(j)) + 0.5); ctx.lineTo(X(x1), Math.round(Y(j)) + 0.5); ctx.stroke(); }
  ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X(x0), Y(0)); ctx.lineTo(X(x1), Y(0)); ctx.moveTo(X(0), Y(y0)); ctx.lineTo(X(0), Y(y1)); ctx.stroke();
  ctx.restore();
  for (let i = x0; i <= x1; i += tickEvery) if (i && s >= 14) text(ctx, num(i), X(i), Y(0) + 10, { color: col.muted, size: 10, align: 'center' });
  for (let j = y0; j <= y1; j += tickEvery) if (j && s >= 14) text(ctx, num(j), X(0) - 6, Y(j), { color: col.muted, size: 10, align: 'right' });
  text(ctx, 'x', X(x1) - 2, Y(0) - 9, { color: col.ink, size: 12, weight: 700, align: 'right' });
  text(ctx, 'y', X(0) + 8, Y(y1) + 2, { color: col.ink, size: 12, weight: 700 });
  text(ctx, 'O', X(0) - 6, Y(0) + 10, { color: col.ink, size: 10, align: 'right' });
  return { X, Y, s, inv: (px, py) => [(px - ox) / s + x0, y1 - (py - oy) / s] };
}
export default function (host) {
  let px = 3, py = -2, g;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Coordinate grid with a point that you can click or set with sliders' });
  const ctl = row(host);
  const sx = slider(ctl, { label: 'x (left or right)', min: -6, max: 6, step: 1, value: px, fmt: num, oninput: (v) => { px = v; upd(); } });
  const sy = slider(ctl, { label: 'y (down or up)', min: -6, max: 6, step: 1, value: py, fmt: num, oninput: (v) => { py = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Point (' + num(px) + ', ' + num(py) + ')', col);
    g = plane(ctx, w, h, col, { top: t + 6 });
    ctx.save(); ctx.setLineDash([5, 4]);
    line(ctx, [[g.X(0), g.Y(0)], [g.X(px), g.Y(0)]], col.s[0], 3); line(ctx, [[g.X(px), g.Y(0)], [g.X(px), g.Y(py)]], col.s[2], 3);
    ctx.restore();
    dot(ctx, g.X(px), g.Y(py), 7, col.s[5], col.ink);
    text(ctx, '(' + num(px) + ', ' + num(py) + ')', g.X(px) + (px > 2 ? -10 : 10), g.Y(py) + (py > 3 ? 16 : -14), { color: col.ink, size: 12, weight: 700, align: px > 2 ? 'right' : 'left', halo: col.panel });
  };
  cv.c.style.cursor = 'crosshair';
  cv.c.addEventListener('pointerdown', (e) => {
    const r = cv.c.getBoundingClientRect(), [a, b] = g.inv(e.clientX - r.left, e.clientY - r.top);
    const ax = Math.round(a), by = Math.round(b);
    if (Math.abs(ax) <= 6 && Math.abs(by) <= 6) { px = ax; py = by; sx.set(px); sy.set(py); upd(); }
  });
  function upd() {
    const q = px && py ? (px > 0 ? (py > 0 ? 'quadrant I' : 'quadrant IV') : (py > 0 ? 'quadrant II' : 'quadrant III')) : (!px && !py ? 'the origin' : !py ? 'on the x-axis' : 'on the y-axis');
    out.innerHTML = `Start at the origin. Move <b>${Math.abs(px)}</b> ${px === 0 ? '(no move)' : px > 0 ? 'to the right' : 'to the left'}, then <b>${Math.abs(py)}</b> ${py === 0 ? '(no move)' : py > 0 ? 'up' : 'down'}. You are at (${num(px)}, ${num(py)}), which is ${q}. Click anywhere on the grid to place the point.`;
    cv.redraw();
  }
  upd();
}
