// Class 12 Maths, Inverse trigonometric functions (step player): evaluate sin^-1(sin(5 pi / 6)). The answer is NOT 5 pi / 6 because that angle
// lies outside the principal range [-pi/2, pi/2]. Find the sine, then the angle in range with that sine.
import { canvas, text, title, dot } from '../../kit.js';

const P = Math.PI;
const N = ['Start with the angle 5π/6 (150°). It sits in the upper left of the circle.', 'Find its sine: the height of the point is sin(5π/6) = 1/2.', 'sin⁻¹(1/2) must be an angle between −π/2 and π/2 (shaded) whose sine is 1/2. The same height is also reached at π/6.', 'π/6 is in the shaded range, so sin⁻¹(sin 5π/6) = π/6, not 5π/6.', 'Rule: for x in [π/2, 3π/2], sin⁻¹(sin x) = π − x. Here π − 5π/6 = π/6.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 320, label: 'Evaluating the inverse sine of sine of five pi over six on the unit circle' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'sin⁻¹( sin(5π/6) ) = ?', col), R = Math.min(w / 2 - 24, (h - top - 80) / 2), cx = w / 2, cy = top + 10 + R, pt = (a) => [cx + R * Math.cos(a), cy - R * Math.sin(a)];
    if (s >= 2) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.1; ctx.beginPath(); ctx.arc(cx, cy, R, -P / 2, P / 2); ctx.lineTo(cx, cy); ctx.fill(); ctx.globalAlpha = 1; text(ctx, 'principal range', cx + R * 0.5, cy + R * 0.8, { color: col.s[0], size: 10.5, weight: 600, align: 'center' }); }
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * P); ctx.stroke();
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - R - 8, cy); ctx.lineTo(cx + R + 8, cy); ctx.moveTo(cx, cy - R - 8); ctx.lineTo(cx, cy + R + 8); ctx.stroke();
    const [ax, ay] = pt(5 * P / 6);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax, ay); ctx.stroke(); dot(ctx, ax, ay, 6, col.s[2], col.panel);
    text(ctx, '5π/6', ax - 8, ay - 10, { color: col.s[2], size: 11.5, weight: 700, align: 'right' });
    if (s >= 1) { ctx.strokeStyle = col.s[3]; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - R - 8, cy - R / 2); ctx.lineTo(cx + R + 8, cy - R / 2); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'height 1/2', cx + R * 0.15, cy - R / 2 - 9, { color: col.s[3], size: 11, weight: 700 }); }
    if (s >= 2) { const [px, py] = pt(P / 6); dot(ctx, px, py, 6, s >= 3 ? col.s[0] : col.panel, col.s[0]); text(ctx, 'π/6', px + 8, py - 10, { color: col.s[0], size: 11.5, weight: 700 }); }
    if (s >= 3) { const [px, py] = pt(P / 6); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke(); }
    const max = Math.floor((w - 24) / 6.3), ls = []; let cur = ''; N[Math.min(s, 4)].split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur);
    ls.forEach((l, i) => text(ctx, l, 12, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
