// Class 10 Applications of Trigonometry: a ladder against a wall. The ladder (length L) is the hypotenuse; the wall height reached
// is the opposite side, L sin θ, and the foot's distance from the wall is the adjacent side, L cos θ, where θ is the angle with the ground.
// A common safety rule of thumb is about 75 degrees (1 m out for every 4 m up); the green band marks it.
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

export default function (host) {
  let th = 70, L = 5;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A ladder leaning on a wall with its height and foot distance changing with the angle' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle with the ground', min: 30, max: 85, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  slider(ctl, { label: 'Ladder length (m)', min: 3, max: 8, step: 0.5, value: L, fmt: (v) => v.toFixed(1) + ' m', oninput: (v) => { L = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Ladder: height = L sin θ, foot = L cos θ', col), gy = h - 26, s = Math.min((w - 70) / 8.6, (gy - t - 14) / 8.4), wx = w - 30, a = th * D, fx = wx - L * Math.cos(a) * s, ty = gy - L * Math.sin(a) * s;
    ground(ctx, w, gy, col);
    ctx.fillStyle = col.soft; ctx.fillRect(wx, t + 6, 22, gy - t - 6); line(ctx, [[wx, t + 6], [wx, gy]], col.ink, 3);
    const lo = 65 * D, hi = 75 * D; ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.good || col.s[2]; ctx.beginPath(); ctx.moveTo(wx, gy); ctx.arc(wx, gy, 46, Math.PI - hi, Math.PI - lo); ctx.closePath(); ctx.fill(); ctx.restore();
    line(ctx, [[fx, gy], [wx, ty]], col.s[2], 5); ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; for (let i = 1; i < 6; i++) { const p = i / 6, x = fx + (wx - fx) * p, y = gy + (ty - gy) * p; ctx.beginPath(); ctx.moveTo(x - 5 * Math.sin(a) , y - 5 * Math.cos(a)); ctx.lineTo(x + 5 * Math.sin(a), y + 5 * Math.cos(a)); ctx.stroke(); } ctx.restore();
    line(ctx, [[wx, gy], [wx, ty]], col.s[0], 3, [5, 4]); line(ctx, [[fx, gy], [wx, gy]], col.s[1], 3, [5, 4]);
    arcAt(ctx, fx, gy, 30, -a, 0, col.ink, 2); lab(ctx, `${th}°`, fx + 36, gy - 10, col.ink, col, 'left', 12);
    lab(ctx, `${m1(L * Math.sin(a))} m`, wx - 6, (gy + ty) / 2, col.s[0], col, 'right'); lab(ctx, `${m1(L * Math.cos(a))} m`, (fx + wx) / 2, gy + 15, col.s[1], col); lab(ctx, `L = ${L} m`, (fx + wx) / 2 - 10, (gy + ty) / 2 - 12, col.s[2], col, 'right');
  };
  function upd() { const a = th * D; out.innerHTML = `L sin θ = ${L} × ${f3(Math.sin(a))} = <b>${m1(L * Math.sin(a))} m</b> up the wall; L cos θ = ${L} × ${f3(Math.cos(a))} = <b>${m1(L * Math.cos(a))} m</b> out from the wall. ${th >= 65 && th <= 75 ? 'In the safe band (about 65° to 75°).' : th < 65 ? 'Too flat: the foot may slip.' : 'Too steep: the ladder may tip back.'}`; cv.redraw(); }
  upd();
}
