// Class 10 Applications of Trigonometry: a kite on a taut string. The string is the hypotenuse of a right triangle whose vertical side
// is the kite's height: height = string length x sin θ (plus the height of the hand, ignored here). Play makes the kite swing in the
// wind, so you can watch the height follow the sine of the angle.
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
  let th = 50, L = 60, dirn = 1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A kite on a straight string with its height from the string length and angle' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'String angle with the ground', min: 15, max: 80, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  slider(ctl, { label: 'String length (m)', min: 20, max: 100, step: 5, value: L, fmt: (v) => v + ' m', oninput: (v) => { L = v; upd(); } });
  const an = loop(host, (dt) => { th += dirn * dt * 10; if (th > 75) { th = 75; dirn = -1; } if (th < 25) { th = 25; dirn = 1; } sl.set(Math.round(th)); upd(); }, { autoplay: false });
  an.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Kite height = string × sin θ', col), gy = h - 24, s = Math.min((w - 50) / L, (gy - t - 30) / L, 5), a = th * D, hx = 22, kx = hx + L * Math.cos(a) * s, ky = gy - L * Math.sin(a) * s;
    ground(ctx, w, gy, col); person(ctx, hx, gy, 18, col.ink);
    line(ctx, [[hx, gy - 10], [kx, ky]], col.s[2], 2); line(ctx, [[kx, ky], [kx, gy]], col.s[0], 2, [5, 4]);
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(-0.4 + (a - 0.9) * 0.3); ctx.fillStyle = col.s[3]; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(11, 0); ctx.lineTo(0, 20); ctx.lineTo(-11, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    arcAt(ctx, hx, gy - 10, 34, -a, 0, col.ink, 2); lab(ctx, `${Math.round(th)}°`, hx + 40, gy - 14 - 4, col.ink, col, 'left', 12);
    lab(ctx, `${m1(L * Math.sin(a))} m high`, kx + 14, (ky + gy) / 2, col.s[0], col, 'left'); lab(ctx, `string ${L} m`, (hx + kx) / 2 - 8, (ky + gy) / 2 - 16, col.s[2], col, 'right');
  };
  function upd() { const a = th * D; out.innerHTML = `Height = ${L} × sin ${Math.round(th)}° = ${L} × ${f3(Math.sin(a))} = <b>${m1(L * Math.sin(a))} m</b>. It lands ${m1(L * Math.cos(a))} m away along the ground (${L} × cos ${Math.round(th)}°).`; cv.redraw(); }
  upd();
}
