// Coordinate geometry quick plot: drag points A and B (they snap to whole numbers). The figure gives the distance (a right
// triangle on the segment), the midpoint, the slope, the equation of the line and, if switched on, the perpendicular
// bisector. Move B straight up or across to see slope become undefined or zero.
import { canvas, axes, row, choice, readout, line, dot, text, title } from '../kit.js';
import { drag } from './_math.js';

const m = (v) => String(+v.toFixed(2)).replace('-', '−');
export default function (host) {
  let A = [-3, -1], B = [4, 3], bis = false;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'Two draggable points on a grid with distance, midpoint and slope' });
  const c = row(host); choice(c, 'Show', [[false, 'Segment'], [true, '+ perpendicular bisector']], bis, (v) => { bis = v; cv.redraw(); show(); });
  const out = readout(host); let G = null;
  drag(cv, () => (G ? [A, B].map((p) => [G.X(p[0]), G.Y(p[1])]) : []), (i, x, y) => { const p = [Math.max(-6, Math.min(6, Math.round(G.vx(x)))), Math.max(-6, Math.min(6, Math.round(G.vy(y))))]; if (i) B = p; else A = p; cv.redraw(); show(); });
  const show = () => { const dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy), mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    let eq; if (dx === 0) eq = dy === 0 ? 'A and B are the same point' : `vertical line x = ${m(A[0])}, slope undefined`; else { const s = dy / dx, b = A[1] - s * A[0]; eq = `slope = ${m(dy)}/${m(dx)} = <b>${m(s)}</b>, line y = ${m(s)}x ${b < 0 ? '−' : '+'} ${m(Math.abs(b))}`; }
    out.innerHTML = `A(${m(A[0])}, ${m(A[1])}), B(${m(B[0])}, ${m(B[1])}). Distance = √(${m(dx)}² + ${m(dy)}²) = <b>${m(d)}</b>. Midpoint = <b>(${m(mid[0])}, ${m(mid[1])})</b>. ${eq}.${bis && (dx || dy) ? ` Perpendicular bisector: slope ${dy === 0 ? 'undefined (vertical)' : m(-dx / dy)} through the midpoint.` : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Drag A and B', col);
    const A2 = axes(ctx, w, h, col, { x: [-7, 7], y: [-7, 7], l: 30, b: 24, t: 24, xt: [-6, -3, 0, 3, 6], yt: [-6, -3, 0, 3, 6] });
    G = { X: A2.X, Y: A2.Y, vx: (px) => -7 + (px - A2.L) / (A2.R - A2.L) * 14, vy: (py) => 7 - (py - A2.T) / (A2.B - A2.T) * 14 };
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(A2.X(0), A2.T); ctx.lineTo(A2.X(0), A2.B); ctx.moveTo(A2.L, A2.Y(0)); ctx.lineTo(A2.R, A2.Y(0)); ctx.stroke();
    const dx = B[0] - A[0], dy = B[1] - A[1];
    ctx.save(); A2.clip(); ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A2.X(A[0]), A2.Y(A[1])); ctx.lineTo(A2.X(B[0]), A2.Y(A[1])); ctx.lineTo(A2.X(B[0]), A2.Y(B[1])); ctx.stroke(); ctx.setLineDash([]);
    if (bis && (dx || dy)) { const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2; line(ctx, [[A2.X(mx - dy * 10), A2.Y(my + dx * 10)], [A2.X(mx + dy * 10), A2.Y(my - dx * 10)]], col.s[3], 1.8); }
    line(ctx, [[A2.X(A[0]), A2.Y(A[1])], [A2.X(B[0]), A2.Y(B[1])]], col.s[0], 2.5); ctx.restore();
    text(ctx, m(Math.abs(dx)), A2.X((A[0] + B[0]) / 2), A2.Y(A[1]) + (B[1] >= A[1] ? 12 : -12), { color: col.muted, size: 10.5, align: 'center', halo: col.panel }); text(ctx, m(Math.abs(dy)), A2.X(B[0]) + (B[0] >= A[0] ? 12 : -12), A2.Y((A[1] + B[1]) / 2), { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
    dot(ctx, A2.X((A[0] + B[0]) / 2), A2.Y((A[1] + B[1]) / 2), 4, col.s[2], col.panel);
    [[A, 'A'], [B, 'B']].forEach(([p, n]) => { dot(ctx, A2.X(p[0]), A2.Y(p[1]), 7, col.s[1], col.panel); text(ctx, n, A2.X(p[0]) + 11, A2.Y(p[1]) - 11, { color: col.ink, size: 12, weight: 800, halo: col.panel }); });
  };
  show();
}
