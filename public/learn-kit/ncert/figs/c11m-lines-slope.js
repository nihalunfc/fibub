// Class 11 Maths, Straight Lines: the slope of the line through A(x1, y1) and B(x2, y2) is m = (y2 − y1)/(x2 − x1) = rise/run.
// It equals tan θ, where θ is the angle the line makes with the positive x-axis (measured anticlockwise). Drag A and B:
// a flat line has slope 0, a steep one a big slope, a line leaning left a negative slope, and a vertical line has no slope.
import { canvas, axes, line, dot, text, title, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let A = [-2, -1], B = [3, 3], g, drag = null;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'A line through two draggable points with its rise, run, slope and angle' });
  const out = readout(host);
  const re = () => { cv.redraw(); const dx = B[0] - A[0], dy = B[1] - A[1]; out.innerHTML = Math.abs(dx) < 0.05 ? 'The line is vertical: run = 0, so the slope is <b>not defined</b>, and θ = 90°.' : `rise = ${dy.toFixed(1)}, run = ${dx.toFixed(1)}: slope m = ${dy.toFixed(1)}/${dx.toFixed(1)} = <b>${(dy / dx).toFixed(2)}</b> = tan θ, so θ = <b>${((Math.atan2(dy, dx) * 180 / Math.PI + 180) % 180).toFixed(1)}°</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Slope = rise / run (drag A and B)', col); g = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], l: 26, b: 22, t: top + 4, r: 10, xt: [-6, -3, 0, 3, 6], yt: [-6, -3, 0, 3, 6] });
    ctx.save(); g.clip(); const dx = B[0] - A[0], dy = B[1] - A[1];
    if (Math.abs(dx) > 0.01) { const m = dy / dx; line(ctx, [[g.X(-7), g.Y(A[1] + m * (-7 - A[0]))], [g.X(7), g.Y(A[1] + m * (7 - A[0]))]], col.s[0], 2.5); } else line(ctx, [[g.X(A[0]), g.Y(-7)], [g.X(A[0]), g.Y(7)]], col.s[0], 2.5);
    ctx.restore();
    line(ctx, [[g.X(A[0]), g.Y(A[1])], [g.X(B[0]), g.Y(A[1])]], col.s[2], 2); line(ctx, [[g.X(B[0]), g.Y(A[1])], [g.X(B[0]), g.Y(B[1])]], col.s[1], 2);
    text(ctx, 'run', (g.X(A[0]) + g.X(B[0])) / 2, g.Y(A[1]) + (dy >= 0 ? 12 : -12), { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'rise', g.X(B[0]) + (dx >= 0 ? 16 : -16), (g.Y(A[1]) + g.Y(B[1])) / 2, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    dot(ctx, g.X(A[0]), g.Y(A[1]), 8, col.s[0], col.panel); dot(ctx, g.X(B[0]), g.Y(B[1]), 8, col.s[0], col.panel); text(ctx, 'A', g.X(A[0]) - 12, g.Y(A[1]) - 10, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'B', g.X(B[0]) + 12, g.Y(B[1]) - 10, { color: col.ink, size: 12, weight: 700 });
  };
  const near = (x, y) => (g && Math.hypot(x - g.X(A[0]), y - g.Y(A[1])) < 24 ? 'A' : g && Math.hypot(x - g.X(B[0]), y - g.Y(B[1])) < 24 ? 'B' : null);
  const toXY = (e) => { const r = cv.c.getBoundingClientRect(); return [Math.round(Math.max(-6, Math.min(6, -6 + (e.clientX - r.left - g.L) / (g.R - g.L) * 12)) * 2) / 2, Math.round(Math.max(-6, Math.min(6, 6 - (e.clientY - r.top - g.T) / (g.B - g.T) * 12)) * 2) / 2]; };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); drag = near(e.clientX - r.left, e.clientY - r.top); if (drag) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; if (drag === 'A') A = toXY(e); else B = toXY(e); re(); });
  cv.c.addEventListener('pointerup', () => (drag = null));
  touchGuard(cv.c, near);
  re();
}
