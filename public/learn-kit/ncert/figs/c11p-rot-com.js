// Class 11 Rotational Motion: centre of mass finder. For particles m_i at (x_i, y_i): X = (sum m_i x_i)/(sum m_i), Y = (sum m_i y_i)/(sum m_i).
// Drag the masses (or change them with the sliders) and watch the centre of mass, the balance point, move: it always sits nearer the heavier masses.
import { canvas, line, text, title, dot, row, slider, readout, touchGuard } from '../../kit.js';

export default function (host) {
  const P = [{ x: 2, y: 2, m: 2 }, { x: 8, y: 3, m: 4 }, { x: 5, y: 7, m: 1 }];
  let drag = -1;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Three masses that can be dragged with the centre of mass marked' });
  const ctl = row(host);
  P.forEach((p, i) => slider(ctl, { label: 'Mass ' + 'ABC'[i], min: 1, max: 10, step: 1, value: p.m, fmt: (v) => v + ' kg', oninput: (v) => { p.m = v; cv.redraw(); } }));
  const ro = readout(host);
  const L = 34, T = 50;
  const X = (x) => L + x / 10 * (cv.w - L - 14), Y = (y) => cv.h - 30 - y / 8 * (cv.h - 30 - T);
  const rad = (m) => 9 + 2.4 * Math.sqrt(m);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Drag the masses. The + is the centre of mass', col);
    for (let g = 0; g <= 10; g += 2) { line(ctx, [[X(g), Y(0)], [X(g), Y(8)]], col.line, 1); text(ctx, g, X(g), Y(0) + 12, { color: col.muted, size: 10, align: 'center' }); }
    for (let g = 0; g <= 8; g += 2) { line(ctx, [[X(0), Y(g)], [X(10), Y(g)]], col.line, 1); text(ctx, g, X(0) - 8, Y(g), { color: col.muted, size: 10, align: 'right' }); }
    const M = P.reduce((a, p) => a + p.m, 0), cx = P.reduce((a, p) => a + p.m * p.x, 0) / M, cy = P.reduce((a, p) => a + p.m * p.y, 0) / M;
    P.forEach((p, i) => line(ctx, [[X(p.x), Y(p.y)], [X(cx), Y(cy)]], col.s[i], 1.5, [4, 4]));
    P.forEach((p, i) => { dot(ctx, X(p.x), Y(p.y), rad(p.m), col.s[i], col.panel); text(ctx, 'ABC'[i], X(p.x), Y(p.y), { color: col.panel, size: 12, weight: 700, align: 'center', fit: false }); });
    line(ctx, [[X(cx) - 9, Y(cy)], [X(cx) + 9, Y(cy)]], col.ink, 3); line(ctx, [[X(cx), Y(cy) - 9], [X(cx), Y(cy) + 9]], col.ink, 3);
    ctx.beginPath(); ctx.moveTo(X(cx), Y(cy) + 12); ctx.lineTo(X(cx) - 9, Y(cy) + 28); ctx.lineTo(X(cx) + 9, Y(cy) + 28); ctx.closePath(); ctx.fillStyle = col.muted; ctx.fill();
    ro.textContent = `Total mass ${M} kg. X = (${P.map((p) => p.m + '×' + p.x.toFixed(1)).join(' + ')})/${M} = ${cx.toFixed(2)} m, Y = ${cy.toFixed(2)} m. Balance point: a flat board with these masses would balance on a pin here.`;
  };
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const near = (px, py) => P.findIndex((p) => Math.hypot(X(p.x) - px, Y(p.y) - py) < rad(p.m) + 8);
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  cv.c.style.cursor = 'grab';
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e), i = near(x, y); if (i >= 0) { drag = i; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag < 0) return; const [px, py] = pos(e), p = P[drag]; p.x = Math.round(Math.min(10, Math.max(0, (px - L) / (cv.w - L - 14) * 10)) * 10) / 10; p.y = Math.round(Math.min(8, Math.max(0, (cv.h - 30 - py) / (cv.h - 30 - T) * 8)) * 10) / 10; cv.redraw(); });
  const up = () => { drag = -1; }; cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
  cv.redraw();
}
