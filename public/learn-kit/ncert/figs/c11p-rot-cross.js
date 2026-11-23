// Class 11 Rotational Motion: torque and angular momentum as vector products. tau = r x F (magnitude r F sin(theta) = area of the parallelogram), L = r x p (same rule with p = m v).
// z-component = x Fy - y Fx; positive means anticlockwise, drawn as a dot (out of the page), negative means clockwise, drawn as a cross (into the page). Drag the particle and the arrow tip.
import { canvas, line, text, title, dot, arrow, row, choice, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let mode = 'F', R = [2.2, 1.4], V = [1.2, 2.2], drag = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A particle at position r with a force or momentum vector, and the resulting torque or angular momentum' });
  const ctl = row(host);
  choice(ctl, 'Show', [['F', 'Torque  r × F'], ['p', 'Angular momentum  r × p']], 'F', (v) => { mode = v; cv.redraw(); });
  const ro = readout(host);
  const g = () => { const s = Math.min(cv.w, cv.h) / 7.2; return { ox: cv.w * 0.32, oy: cv.h * 0.7, s }; };
  const P = (p) => { const { ox, oy, s } = g(); return [ox + p[0] * s, oy - p[1] * s]; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'F' ? 'Torque = r × F = r F sinθ' : 'Angular momentum = r × p = r p sinθ', col);
    const o = P([0, 0]), p = P(R), q = P([R[0] + V[0], R[1] + V[1]]);
    ctx.beginPath(); ctx.moveTo(...o); ctx.lineTo(...p); ctx.lineTo(...q); ctx.lineTo(...P(V)); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [o, P(V)], col.s[1], 1.2, [4, 4]); line(ctx, [P(V), q], col.s[0], 1.2, [4, 4]);
    arrow(ctx, o[0], o[1], p[0], p[1], col.ink, 2.5); arrow(ctx, p[0], p[1], q[0], q[1], col.s[0], 3);
    dot(ctx, o[0], o[1], 5, col.ink); text(ctx, 'O (axis)', o[0] - 8, o[1] + 14, { color: col.ink, size: 11, align: 'right', weight: 700 });
    dot(ctx, p[0], p[1], 9, col.s[1], col.panel); text(ctx, 'r', (o[0] + p[0]) / 2 - 8, (o[1] + p[1]) / 2 + 8, { color: col.ink, size: 13, weight: 700, halo: col.panel });
    dot(ctx, q[0], q[1], 7, col.s[0], col.panel); text(ctx, mode === 'F' ? 'F' : 'p', q[0] + 10, q[1] - 6, { color: col.s[0], size: 13, weight: 700, halo: col.panel });
    const z = R[0] * V[1] - R[1] * V[0], rm = Math.hypot(...R), vm = Math.hypot(...V), th = Math.atan2(Math.abs(z), R[0] * V[0] + R[1] * V[1]) * 180 / Math.PI;
    const sy = h - 44, sx = w - 44; ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(sx, sy, 16, 0, 6.3); ctx.stroke();
    if (Math.abs(z) < 0.05) { text(ctx, '0', sx, sy, { color: col.s[2], size: 14, weight: 700, align: 'center' }); } else if (z > 0) dot(ctx, sx, sy, 4.5, col.s[2]); else { ctx.beginPath(); ctx.moveTo(sx - 8, sy - 8); ctx.lineTo(sx + 8, sy + 8); ctx.moveTo(sx + 8, sy - 8); ctx.lineTo(sx - 8, sy + 8); ctx.stroke(); }
    ctx.restore();
    text(ctx, Math.abs(z) < 0.05 ? 'zero' : z > 0 ? 'out of page' : 'into page', sx, sy - 24, { color: col.s[2], size: 10, align: 'center', weight: 700 });
    ro.textContent = `r = ${rm.toFixed(2)}, ${mode === 'F' ? 'F' : 'p'} = ${vm.toFixed(2)}, angle between = ${th.toFixed(0)}°. ${mode === 'F' ? 'Torque' : 'L'} = r ${mode === 'F' ? 'F' : 'p'} sinθ = ${Math.abs(z).toFixed(2)} (the shaded area). ${Math.abs(z) < 0.05 ? 'The vector points along r, so no turning effect.' : z > 0 ? 'Anticlockwise turn: the vector points out of the page (right-hand rule).' : 'Clockwise turn: the vector points into the page.'}`;
  };
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const hit = (x, y) => { const p = P(R), q = P([R[0] + V[0], R[1] + V[1]]); return Math.hypot(x - q[0], y - q[1]) < 20 ? 2 : Math.hypot(x - p[0], y - p[1]) < 20 ? 1 : 0; };
  touchGuard(cv.c, (x, y) => hit(x, y) > 0); cv.c.style.cursor = 'grab';
  cv.c.addEventListener('pointerdown', (e) => { const k = hit(...pos(e)); if (k) { drag = k; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; const [x, y] = pos(e), { ox, oy, s } = g(), wx = (x - ox) / s, wy = (oy - y) / s; if (drag === 1) { R = [Math.max(-2, Math.min(5.5, wx)), Math.max(0.3, Math.min(4.2, wy))]; } else { V = [Math.max(-4, Math.min(4, wx - R[0])), Math.max(-3, Math.min(3.5, wy - R[1]))]; } cv.redraw(); });
  const up = () => { drag = 0; }; cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
  cv.redraw();
}
