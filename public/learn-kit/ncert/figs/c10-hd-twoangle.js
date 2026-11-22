// Class 10 Applications of Trigonometry (step player): the two-triangle method. Tower height h, angle 45 degrees from B and 30 degrees
// from A, where A is 40 m farther from the tower. tan45 = h/x so x = h; tan30 = h/(x + 40) so sqrt3 h = h + 40, h = 40/(sqrt3 - 1) = 20(sqrt3 + 1) = 54.6 m.
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

const MSG = ['A tower. From B the angle of elevation of its top is 45°. From A, 40 m farther back in the same line, it is 30°. How tall is the tower?', 'Call the tower h and the distance BC (B to the foot C) x. Then AC = x + 40. There are two right triangles with the same height h.', 'Triangle at B: tan 45° = h / x. Since tan 45° = 1, x = h.', 'Triangle at A: tan 30° = h / (x + 40). Since tan 30° = 1/√3, √3 h = x + 40.', 'Put x = h in the second equation: √3 h = h + 40, so (√3 − 1) h = 40.', 'h = 40 / (√3 − 1). Multiply top and bottom by (√3 + 1): h = 40(√3 + 1)/2 = 20(√3 + 1) ≈ 54.6 m.', 'Check: x = h = 54.6 and x + 40 = 94.6; 54.6/94.6 ≈ 0.577 = tan 30°. ✓'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Step by step solution of a problem with two angles of elevation of a tower' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Two angles of elevation', col), H = 54.6, gy = h - 94, u = Math.min((w - 44) / 100, (gy - t - 18) / 60), ax = 16, bx = ax + 40 * u, tx = bx + H * u;
    ground(ctx, w, gy, col);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(tx, gy - H * u, 5, H * u); ctx.strokeRect(tx, gy - H * u, 5, H * u);
    line(ctx, [[ax, gy], [tx, gy - H * u]], col.s[0], 2.5); line(ctx, [[bx, gy], [tx, gy - H * u]], col.s[1], 2.5);
    arcAt(ctx, ax, gy, 40, -Math.PI / 6, 0, col.s[0], 2); lab(ctx, '30°', ax + 46, gy - 8, col.s[0], col, 'left', 12); arcAt(ctx, bx, gy, 28, -Math.PI / 4, 0, col.s[1], 2); lab(ctx, '45°', bx + 30, gy - 16, col.s[1], col, 'left', 12);
    dot(ctx, ax, gy, 5, col.s[0]); dot(ctx, bx, gy, 5, col.s[1]); lab(ctx, 'A', ax, gy + 14, col.s[0], col); lab(ctx, 'B', bx, gy + 14, col.s[1], col); lab(ctx, 'C', tx + 2, gy + 14, col.ink, col);
    lab(ctx, '40 m', (ax + bx) / 2, gy + 14, col.s[3], col, 'center', 11);
    if (s >= 1) { lab(ctx, 'x', (bx + tx) / 2, gy + 14, col.s[1], col, 'center', 12); lab(ctx, 'h', tx + 10, gy - H * u / 2, col.s[2], col, 'left', 13); }
    if (s >= 2) lab(ctx, 'tan 45° = h/x, so x = h', 10, t + 24, col.s[1], col, 'left', 12);
    if (s >= 3) lab(ctx, 'tan 30° = h/(x + 40)', 10, t + 42, col.s[0], col, 'left', 12);
    if (s >= 4) lab(ctx, '(√3 − 1) h = 40', 10, t + 60, col.ink, col, 'left', 12);
    if (s >= 5) lab(ctx, 'h ≈ 54.6 m', tx - 8, gy - H * u - 6, col.s[2], col, 'right', 13);
    wrap(ctx, MSG[Math.min(s, 6)], w, h - 6, col, 12);
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
