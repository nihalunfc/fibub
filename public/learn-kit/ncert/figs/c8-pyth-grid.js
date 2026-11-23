// Class 8 Baudhayana-Pythagoras: distance on a grid. Drag the two points on the grid. The horizontal and vertical steps are the legs of
// a right triangle, so the straight-line distance is c = sqrt(dx^2 + dy^2). This is how maps and games find distances.
import { canvas, text, title, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let P = [[1, 1], [6, 5]], drag = -1, geo = { x0: 0, y0: 0, s: 30 };
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Two draggable points on a grid with the right triangle between them' });
  const out = readout(host);
  const pos = (i) => [geo.x0 + P[i][0] * geo.s, geo.y0 - P[i][1] * geo.s];
  const near = (x, y) => [0, 1].findIndex((i) => Math.hypot(pos(i)[0] - x, pos(i)[1] - y) < 26);
  const rel = (e) => { const b = cv.c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = rel(e); drag = near(x, y); if (drag >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (drag < 0) return; const [x, y] = rel(e); P[drag] = [Math.max(0, Math.min(8, Math.round((x - geo.x0) / geo.s))), Math.max(0, Math.min(7, Math.round((geo.y0 - y) / geo.s)))]; upd(); });
  cv.c.addEventListener('pointerup', () => { drag = -1; });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Drag the two points', col), s = Math.min((w - 30) / 8, (h - t - 50) / 7); geo = { x0: (w - 8 * s) / 2, y0: h - 30, s };
    for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(geo.x0 + i * s, geo.y0); ctx.lineTo(geo.x0 + i * s, geo.y0 - 7 * s); ctx.strokeStyle = col.line; ctx.lineWidth = 0.8; ctx.stroke(); }
    for (let j = 0; j <= 7; j++) { ctx.beginPath(); ctx.moveTo(geo.x0, geo.y0 - j * s); ctx.lineTo(geo.x0 + 8 * s, geo.y0 - j * s); ctx.stroke(); }
    const [A, B] = [pos(0), pos(1)], C = [B[0], A[1]], dx = Math.abs(P[1][0] - P[0][0]), dy = Math.abs(P[1][1] - P[0][1]);
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(C[0], C[1]); ctx.lineTo(B[0], B[1]); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.stroke();
    if (dx) text(ctx, 'across ' + dx, (A[0] + C[0]) / 2, A[1] + (P[1][1] >= P[0][1] ? 14 : -14), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    if (dy) text(ctx, 'up ' + dy, C[0] + (P[1][0] >= P[0][0] ? 6 : -6), (C[1] + B[1]) / 2, { color: col.ink, size: 12, weight: 700, align: P[1][0] >= P[0][0] ? 'left' : 'right', halo: col.panel });
    [[A, 'A'], [B, 'B']].forEach(([p, l], i) => { ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, 7); ctx.fillStyle = col.s[i ? 3 : 0]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); text(ctx, l, p[0], p[1], { color: col.panel, size: 11, weight: 700, align: 'center' }); });
  };
  function upd() { const dx = Math.abs(P[1][0] - P[0][0]), dy = Math.abs(P[1][1] - P[0][1]), d2 = dx * dx + dy * dy; out.innerHTML = `A(${P[0]}) to B(${P[1]}): across ${dx}, up ${dy}. AB² = ${dx}² + ${dy}² = ${d2}, so AB = √${d2} ≈ <b>${+Math.sqrt(d2).toFixed(2)}</b> units${Number.isInteger(Math.sqrt(d2)) && d2 ? ' (a whole number!)' : ''}.`; cv.redraw(); }
  upd();
}
