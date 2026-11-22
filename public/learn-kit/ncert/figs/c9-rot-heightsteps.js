// Class 9 Rotation (step player): building the height graph one quarter turn at a time. Starting at the 3 o'clock
// position, the height above the centre is 0 at 0 degrees, 1 R at 90, 0 at 180, -1 R at 270 and 0 at 360.
import { canvas, text, title, dot } from '../../kit.js';

const N = ['Start at the right-hand end of the wheel: angle 0°, height 0 (on the middle line).', 'Turn ¼ (90°): the point is at the very top. Height = +R (the highest).', 'Turn ½ (180°): back on the middle line at the left. Height 0.', 'Turn ¾ (270°): the very bottom. Height = −R (the lowest).', 'Full turn (360°): home again, height 0.', 'Join the dots smoothly. Keep turning and the same wave repeats every 360°.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 290, label: 'Building the height graph of a turning wheel from five points' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Plotting the height of the point', col), R = Math.min(w * 0.17, (h - top) * 0.2), cx = w * 0.3, cy = top + R + 12, k = Math.min(s, 4), th = (k * Math.PI) / 2;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - R - 6, cy); ctx.lineTo(cx + R + 6, cy); ctx.stroke();
    const px = cx + Math.cos(th) * R, py = cy - Math.sin(th) * R;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
    dot(ctx, px, py, 6, col.s[2], col.ink);
    const hv = [0, 1, 0, -1, 0][k];
    text(ctx, 'angle ' + k * 90 + '°', w * 0.74, cy - 8, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, 'height ' + (hv === 0 ? '0' : hv > 0 ? '+R' : '−R'), w * 0.74, cy + 12, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    const gx0 = 34, gx1 = w - 14, gy0 = cy + R + 24, gy1 = h - 50, gm = (gy0 + gy1) / 2, X = (d) => gx0 + (d / 360) * (gx1 - gx0), Y = (v) => gm - v * ((gy1 - gy0) / 2 - 4);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    [-1, 0, 1].forEach((v) => { ctx.beginPath(); ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx1, Y(v)); ctx.stroke(); text(ctx, ['−R', '0', 'R'][v + 1], gx0 - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.stroke();
    [0, 90, 180, 270, 360].forEach((d) => text(ctx, d + '°', X(d), gy1 + 11, { color: col.muted, size: 10, align: 'center' }));
    if (s >= 5) { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let d = 0; d <= 360; d += 3) { const x = X(d), y = Y(Math.sin((d * Math.PI) / 180)); d === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    for (let i = 0; i <= k; i++) dot(ctx, X(i * 90), Y([0, 1, 0, -1, 0][i]), i === k && s < 5 ? 6 : 4, i === k && s < 5 ? col.s[2] : col.s[0], col.ink);
    text(ctx, N[s], w / 2, h - 16, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
