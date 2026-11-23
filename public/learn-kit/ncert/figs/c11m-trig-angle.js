// Class 11 Maths, Trigonometric Functions: degrees and radians. One radian is the angle whose arc is exactly as long as the radius.
// A full turn is 2π radians = 360°, so 1 radian ≈ 57.3°, and an arc of length s on a circle of radius r subtends θ = s / r radians.
import { canvas, text, title, row, slider, choice, readout, arrow } from '../../kit.js';
import { r2 } from '../c11m-lib.js';

export default function (host) {
  let th = 1, rad = 4;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A circle with a sector whose angle you set in radians, with the radius laid along the arc' });
  const out = readout(host);
  let sl;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle in radians', col), R = Math.min(w * 0.3, (h - top) * 0.36), cx = w / 2, cy = top + R + 18;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, 0, -th, true); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx - R - 8, cy); ctx.lineTo(cx + R + 8, cy); ctx.moveTo(cx, cy - R - 8); ctx.lineTo(cx, cy + R + 8); ctx.stroke();
    const n = Math.floor(th);
    for (let k = 0; k < n + 1; k++) { const a0 = k, a1 = Math.min(th, k + 1); if (a1 <= a0) break; ctx.strokeStyle = k % 2 ? col.s[2] : col.s[0]; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, -a0, -a1, true); ctx.stroke(); }
    ctx.lineWidth = 2; arrow(ctx, cx, cy, cx + R * Math.cos(th), cy - R * Math.sin(th), col.s[3], 2.4, 9); arrow(ctx, cx, cy, cx + R, cy, col.ink, 2, 8);
    text(ctx, 'r', cx + R / 2, cy + 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, `θ = ${r2(th, 2)} rad`, cx, cy + R + 22, { color: col.s[0], size: 14, weight: 800, align: 'center' });
    text(ctx, `${r2(th, 2)} rad = ${r2((th * 180) / Math.PI, 1)}°   ·   arc s = r θ = ${r2(rad, 1)} × ${r2(th, 2)} = ${r2(rad * th, 2)} cm`, w / 2, cy + R + 46, { color: col.ink, size: 12, weight: 600, align: 'center' });
    out.innerHTML = `Each colour change is <b>one radius</b> of arc (1 radian ≈ 57.3°). The angle holds <b>${r2(th, 2)}</b> radius-lengths. A half turn is π = 3.14 rad, a full turn 2π = 6.28 rad.`;
  };
  const r = row(host);
  sl = slider(r, { label: 'θ (rad)', min: 0, max: 6.2832, step: 0.01, value: th, fmt: (v) => r2(v, 2), oninput: (v) => { th = v; cv.redraw(); } });
  slider(r, { label: 'radius (cm)', min: 1, max: 10, step: 0.5, value: rad, fmt: (v) => r2(v, 1), oninput: (v) => { rad = v; cv.redraw(); } });
  choice(r, 'Jump to', [['30', '30°'], ['45', '45°'], ['60', '60°'], ['90', '90°'], ['180', '180°'], ['360', '360°']], '', (v) => { th = (+v * Math.PI) / 180; sl.set(th); cv.redraw(); });
  cv.redraw();
}
