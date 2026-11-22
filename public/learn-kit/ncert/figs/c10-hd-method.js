// Class 10 Applications of Trigonometry (step player): the method for a one-triangle problem. Example: eye height 1.5 m, standing 20 m
// from a tower, angle of elevation of the top 60 degrees. Opposite side = 20 tan60 = 34.64 m above the eye, plus 1.5 m = 36.14 m.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });
const person = (ctx, x, y, hgt, color) => { ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round'; const hd = hgt * 0.16; ctx.beginPath(); ctx.arc(x, y - hgt + hd, hd, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, y - hgt + 2 * hd); ctx.lineTo(x, y - hgt * 0.38); ctx.moveTo(x, y - hgt * 0.38); ctx.lineTo(x - hgt * 0.16, y); ctx.moveTo(x, y - hgt * 0.38); ctx.lineTo(x + hgt * 0.16, y); ctx.moveTo(x - hgt * 0.2, y - hgt * 0.62); ctx.lineTo(x + hgt * 0.2, y - hgt * 0.62); ctx.stroke(); ctx.restore(); };
const ground = (ctx, w, y, col) => { line(ctx, [[6, y], [w - 6, y]], col.muted, 2); ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (let x = 10; x < w - 10; x += 12) { ctx.beginPath(); ctx.moveTo(x, y + 1); ctx.lineTo(x - 5, y + 7); ctx.stroke(); } ctx.restore(); };
const deg = (v) => Math.round(v) + '°';
const m1 = (v) => (+v.toFixed(1)).toString();

const MSG = ['Problem: a boy whose eyes are 1.5 m above the ground stands 20 m from a tower. The angle of elevation of the top is 60°. How tall is the tower?', 'Step 1: draw a picture. Mark the ground, the tower, the eye-level horizontal and the line of sight, and put 60° at the eye.', 'Step 2: find the right triangle. Its horizontal side is 20 m (adjacent to 60°) and its vertical side is the part of the tower above the eye (opposite, call it x).', 'Step 3: choose the ratio that has the two sides you know and want: opposite and adjacent, so tan. tan 60° = x / 20.', 'Step 4: solve. x = 20 × tan 60° = 20 × √3 ≈ 34.64 m.', 'Step 5: do not forget the eye height! Tower = 34.64 + 1.5 ≈ 36.14 m.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.02, max: 440, min: 340, label: 'Step by step solution of a tower height problem using the tangent of the angle of elevation' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Method: draw, find the triangle, pick the ratio', col), gy = h - 96, u = Math.min((w - 70) / 26, (gy - t - 20) / 38), ox = 22, tx = ox + 20 * u, ey = gy - 1.5 * u, top = gy - 36.14 * u;
    ground(ctx, w, gy, col);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(tx, top, 3 * u, gy - top); ctx.strokeRect(tx, top, 3 * u, gy - top);
    person(ctx, ox, gy, 22, col.ink);
    if (s >= 1) { line(ctx, [[ox, ey], [tx, ey]], col.muted, 1.5, [5, 4]); line(ctx, [[ox, ey], [tx, gy - 36.14 * u]], col.s[0], 3); arcAt(ctx, ox, ey, 40, -Math.PI / 3, 0, col.ink, 2); lab(ctx, '60°', ox + 46, ey - 14, col.ink, col, 'left', 12); }
    if (s >= 2) { line(ctx, [[ox, ey], [tx, ey]], col.s[1], 3.5); line(ctx, [[tx, ey], [tx, top]], col.s[2], 3.5); lab(ctx, '20 m', (ox + tx) / 2, gy + 15, col.s[1], col); lab(ctx, s >= 4 ? 'x = 34.64 m' : 'x', tx - 6, (ey + top) / 2, col.s[2], col, 'right', 12); }
    if (s >= 3) lab(ctx, 'tan 60° = x / 20', w - 12, t + 22, col.ink, col, 'right', 13);
    if (s >= 4) lab(ctx, 'x = 20√3 ≈ 34.64', w - 12, t + 42, col.s[2], col, 'right', 13);
    if (s >= 5) { lab(ctx, 'Tower = 34.64 + 1.5 ≈ 36.14 m', w - 12, t + 62, col.s[0], col, 'right', 13); dot(ctx, tx + 1.5 * u, top, 4, col.s[0]); }
    wrap(ctx, MSG[Math.min(s, 5)], w, h - 8, col, 12);
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
