// Class 12 Maths, Vector Algebra: the cross product a x b. Its length |a||b| sin(theta) is the area of the parallelogram on a and b (half of it is the triangle).
// Its direction is perpendicular to both: the right-hand rule (curl the fingers from a to b, the thumb gives the way). Drag the tips of a and b:
// anticlockwise from a to b means the product points out of the page, clockwise means into the page. Parallel vectors give area 0.
import { canvas, text, title, line, dot, arrow, row, choice, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let a = [4, 0], b = [1, 3], tri = false;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Two draggable vectors with the parallelogram they span, its area and the direction of the cross product' });
  const ctl = row(host);
  choice(ctl, 'shade', [[false, 'parallelogram'], [true, 'triangle']], tri, (v) => { tri = v; go(); });
  const ro = readout(host);
  const g = { s: 30, ox: 0, oy: 0 }, X = (u) => g.ox + u * g.s, Y = (v) => g.oy - v * g.s;
  const near = (x, y) => [a, b].findIndex((p) => Math.hypot(x - X(p[0]), y - Y(p[1])) < 20);
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  let di = -1;
  const xy = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.c.addEventListener('pointerdown', (e) => { di = near(...xy(e)); if (di >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (di < 0) return; const [x, y] = xy(e); const p = [Math.max(-4, Math.min(6, Math.round((x - g.ox) / g.s))), Math.max(-3, Math.min(5, Math.round((g.oy - y) / g.s)))]; if (di === 0) a = p; else b = p; go(); });
  cv.c.addEventListener('pointerup', () => { di = -1; });
  const cr = () => a[0] * b[1] - a[1] * b[0];
  const go = () => {
    const c = cr(), ma = Math.hypot(...a), mb = Math.hypot(...b), s = ma && mb ? Math.abs(c) / (ma * mb) : 0;
    ro.textContent = `a × b = (${a[0]}·${b[1]} − ${a[1]}·${b[0]}) k = ${c} k.  |a × b| = |a||b| sin θ = ${ma.toFixed(2)} × ${mb.toFixed(2)} × ${s.toFixed(2)} = ${Math.abs(c)}: that is the area of the ${tri ? 'triangle × 2' : 'parallelogram'}.${tri ? ' Triangle area = ' + Math.abs(c) / 2 + '.' : ''}  ${c > 0 ? 'Anticlockwise from a to b: the product points out of the page (towards you).' : c < 0 ? 'Clockwise from a to b: the product points into the page.' : 'Parallel vectors: area 0, product is the zero vector.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Area of the parallelogram = |a × b|', col);
    g.s = Math.min((w - 24) / 11, (h - top - 20) / 9); g.ox = 12 + 4.2 * g.s; g.oy = top + 10 + 5.3 * g.s;
    for (let i = -4; i <= 6; i++) line(ctx, [[X(i), Y(-3)], [X(i), Y(5)]], col.line, i === 0 ? 1.4 : 0.6);
    for (let j = -3; j <= 5; j++) line(ctx, [[X(-4), Y(j)], [X(6), Y(j)]], col.line, j === 0 ? 1.4 : 0.6);
    const O = [X(0), Y(0)], A = [X(a[0]), Y(a[1])], B = [X(b[0]), Y(b[1])], S = [X(a[0] + b[0]), Y(a[1] + b[1])];
    ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(...A); if (!tri) ctx.lineTo(...S); ctx.lineTo(...B); ctx.closePath(); ctx.fill(); ctx.restore();
    line(ctx, [A, S, B], col.muted, 1.2, [4, 3]); if (tri) line(ctx, [A, B], col.s[2], 2);
    arrow(ctx, O[0], O[1], A[0], A[1], col.s[0], 3, 10); arrow(ctx, O[0], O[1], B[0], B[1], col.s[1], 3, 10);
    dot(ctx, A[0], A[1], 6, col.s[0], col.panel); dot(ctx, B[0], B[1], 6, col.s[1], col.panel);
    text(ctx, 'a', A[0] + 8, A[1] - 9, { color: col.s[0], size: 13, weight: 700 }); text(ctx, 'b', B[0] + 8, B[1] - 9, { color: col.s[1], size: 13, weight: 700 });
    const c = cr(), mx = (O[0] + S[0]) / 2, my = (O[1] + S[1]) / 2;
    if (c) { const r = 13; ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.stroke(); if (c > 0) dot(ctx, mx, my, 3.5, col.ink); else { const q = r * 0.65; line(ctx, [[mx - q, my - q], [mx + q, my + q]], col.ink, 2); line(ctx, [[mx - q, my + q], [mx + q, my - q]], col.ink, 2); } ctx.restore(); }
    text(ctx, c > 0 ? 'a × b out of page' : c < 0 ? 'a × b into page' : 'a × b = 0', w - 12, h - 12, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
  };
  go();
}
