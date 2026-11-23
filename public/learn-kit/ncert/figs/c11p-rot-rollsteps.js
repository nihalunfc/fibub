// Class 11 Rotational Motion (step player): acceleration of a rolling body down an incline. Forces: weight mg, normal N, static friction f (up the slope).
// m a = m g sin(theta) - f ; torque about the centre: f R = I alpha = I a / R (rolling, a = alpha R); so a = g sin(theta) / (1 + I/(m R^2)).
import { canvas, line, text, title, arrow } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A disc rolling down an incline with the forces on it, built up step by step' });
  const T = ['The forces on the rolling disc', 'Along the slope: m a = m g sinθ − f', 'About the centre: f R = I α', 'Rolling without slipping: a = α R', 'Solve: a = g sinθ / (1 + I/mR²)', 'Compare shapes'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[s], col), x0 = 24, y0 = top + 18, x1 = w - 36, y1 = y0 + (w - 60) * 0.46;
    const ang = Math.atan2(y1 - y0, x1 - x0), ux = Math.cos(ang), uy = Math.sin(ang);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x0, y1); ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill(); line(ctx, [[x0, y0], [x1, y1]], col.ink, 3);
    const R = 22, d = 0.42, px = x0 + (x1 - x0) * d, py = y0 + (y1 - y0) * d, cx = px + uy * R, cy = py - ux * R;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.3); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; line(ctx, [[cx, cy], [cx + R * Math.cos(0.5), cy + R * Math.sin(0.5)]], col.panel, 3);
    const k = 3.2;
    arrow(ctx, cx, cy, cx, cy + 46, col.ink, 2.5); text(ctx, 'mg', cx + 14, cy + 46, { color: col.ink, size: 12, weight: 700 });
    arrow(ctx, px, py, px + uy * 46, py - ux * 46, col.s[2], 2.5); text(ctx, 'N', px + uy * 52, py - ux * 52 - 2, { color: col.s[2], size: 12, weight: 700 });
    if (s >= 1) { arrow(ctx, cx, cy, cx + ux * 40, cy + uy * 40, col.s[1], 2.5); text(ctx, 'mg sinθ', cx + ux * 44 + 4, cy + uy * 44 + 12, { color: col.s[1], size: 11, weight: 700 }); }
    arrow(ctx, px, py, px - ux * 38, py - uy * 38, col.s[3], 3); text(ctx, 'f', px - ux * 44 - 8, py - uy * 44 - 6, { color: col.s[3], size: 12, weight: 700 });
    if (s >= 2) { ctx.beginPath(); ctx.arc(cx, cy, R + 8, -0.6, 2.2); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'f R turns it', cx + R + 10, cy - R - 4, { color: col.s[3], size: 10.5, weight: 700 }); }
    const by = y1 + 28, L = [];
    if (s >= 1) L.push(['(1)  m a = m g sinθ − f', col.s[1]]);
    if (s >= 2) L.push(['(2)  f R = I α', col.s[3]]);
    if (s >= 3) L.push(['(3)  α = a / R  →  f = I a / R²', col.ink]);
    if (s >= 4) L.push(['(1)+(3):  m a (1 + I/mR²) = m g sinθ', col.ink], ['a = g sinθ / (1 + I/mR²)', col.s[0]]);
    if (s === 0) L.push(['Friction f (static) does no work but makes it roll.', col.muted]);
    L.forEach(([t, c], i) => { if (by + i * 22 < h - 6 && s < 5) text(ctx, t, 14, by + i * 22, { color: c, size: 12.5, weight: 700 }); });
    if (s === 5) {
      const rows = [['block (no roll)', 1, 0], ['solid sphere', 5 / 7, 2 / 5], ['disc', 2 / 3, 1 / 2], ['hollow sphere', 3 / 5, 2 / 3], ['ring', 1 / 2, 1]], ty = y1 + 22;
      text(ctx, 'a as a fraction of g sinθ', 14, ty - 6, { color: col.muted, size: 11, weight: 700 });
      rows.forEach(([n, f, kk], i) => { const y = ty + 16 + i * 22; text(ctx, n, 14, y, { color: col.ink, size: 11 }); ctx.fillStyle = col.s[i]; ctx.fillRect(110, y - 7, f * (w - 170), 14); text(ctx, f.toFixed(2), 114 + f * (w - 170), y, { color: col.ink, size: 11, weight: 700 }); });
    }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
