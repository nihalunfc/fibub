// Class 11 Motion in a Plane: resolving a vector into components. A vector A of magnitude A at angle theta to the x-axis has rectangular components
// Ax = A cos(theta) and Ay = A sin(theta), so A = Ax i + Ay j; going back, A = sqrt(Ax^2 + Ay^2) and tan(theta) = Ay/Ax. Drag the tip (or use the sliders) and watch both
// descriptions change together.
import { canvas, text, title, line, dot, arrow, row, slider, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let ax = 4, ay = 3, G = {};
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'A vector with its x and y components that can be dragged' });
  const ctl = row(host), out = readout(host);
  const sm = slider(ctl, { label: 'Magnitude A', min: 0.5, max: 8, step: 0.1, value: 5, fmt: (v) => v.toFixed(1), oninput: (v) => { const th = Math.atan2(ay, ax); ax = v * Math.cos(th); ay = v * Math.sin(th); go(); } });
  const sa = slider(ctl, { label: 'Angle θ', min: 0, max: 360, step: 1, value: 37, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { const A = Math.hypot(ax, ay) || 1; ax = A * Math.cos(v * Math.PI / 180); ay = A * Math.sin(v * Math.PI / 180); go(); } });
  function go() { const A = Math.hypot(ax, ay); let th = Math.atan2(ay, ax) * 180 / Math.PI; if (th < 0) th += 360; sm.set(A); sa.set(th); out.innerHTML = `Components: A<sub>x</sub> = A cosθ = <b>${ax.toFixed(2)}</b>, A<sub>y</sub> = A sinθ = <b>${ay.toFixed(2)}</b>. So <b>A = ${ax.toFixed(1)} î ${ay < 0 ? '−' : '+'} ${Math.abs(ay).toFixed(1)} ĵ</b>. Back again: |A| = √(Ax² + Ay²) = ${A.toFixed(2)}, θ = tan⁻¹(Ay/Ax) = ${th.toFixed(1)}°.`; cv.redraw(); }
  let on = false; const near = (x, y) => Math.hypot(x - G.tx, y - G.ty) < 28;
  touchGuard(cv.c, near);
  const mv = (e) => { const b = cv.c.getBoundingClientRect(); ax = Math.max(-8, Math.min(8, Math.round(((e.clientX - b.left - G.cx) / G.u) * 4) / 4)); ay = Math.max(-8, Math.min(8, Math.round(((G.cy - (e.clientY - b.top)) / G.u) * 4) / 4)); go(); };
  cv.c.addEventListener('pointerdown', (e) => { const b = cv.c.getBoundingClientRect(); if (near(e.clientX - b.left, e.clientY - b.top)) { on = true; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); mv(e); } });
  cv.c.addEventListener('pointermove', (e) => on && mv(e)); cv.c.addEventListener('pointerup', () => (on = false)); cv.c.addEventListener('pointercancel', () => (on = false));
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Components of a vector (drag the tip)', col);
    const u = Math.min(w, h - 20) / 19, cx = w / 2, cy = h / 2 + 8, X = (v) => cx + v * u, Y = (v) => cy - v * u;
    for (let k = -8; k <= 8; k++) { line(ctx, [[X(k), Y(-8)], [X(k), Y(8)]], col.line, 0.6); line(ctx, [[X(-8), Y(k)], [X(8), Y(k)]], col.line, 0.6); }
    line(ctx, [[X(-8.5), cy], [X(8.5), cy]], col.muted, 1.5); line(ctx, [[cx, Y(-8.5)], [cx, Y(8.5)]], col.muted, 1.5);
    text(ctx, 'x', X(8.4) - 4, cy - 9, { size: 11, color: col.muted }); text(ctx, 'y', cx + 8, Y(8.3), { size: 11, color: col.muted });
    arrow(ctx, cx, cy, X(1), cy, col.s[1], 3, 8); arrow(ctx, cx, cy, cx, Y(1), col.s[3], 3, 8);
    text(ctx, 'î', X(1) - 2, cy + 12, { size: 12, weight: 700, color: col.s[1] }); text(ctx, 'ĵ', cx + 9, Y(1) + 4, { size: 12, weight: 700, color: col.s[3] });
    line(ctx, [[cx, cy], [X(ax), cy]], col.s[1], 2.5, [5, 3]); line(ctx, [[X(ax), cy], [X(ax), Y(ay)]], col.s[3], 2.5, [5, 3]);
    text(ctx, 'Ax', X(ax / 2), cy + (ay >= 0 ? 14 : -14), { size: 11.5, weight: 700, color: col.s[1], align: 'center', halo: col.panel }); text(ctx, 'Ay', X(ax) + (ax >= 0 ? 14 : -14), Y(ay / 2), { size: 11.5, weight: 700, color: col.s[3], align: 'center', halo: col.panel });
    arrow(ctx, cx, cy, X(ax), Y(ay), col.s[0], 3.5, 10); G = { cx, cy, u, tx: X(ax), ty: Y(ay) }; dot(ctx, X(ax), Y(ay), 7, col.s[0], col.panel);
    const th = Math.atan2(ay, ax), r = 28; if (Math.hypot(ax, ay) > 0.8) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, -th, th > 0); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, 'θ', cx + (r + 11) * Math.cos(th / 2), cy - (r + 11) * Math.sin(th / 2), { size: 12, weight: 700, align: 'center', halo: col.panel }); }
  };
  go();
}
