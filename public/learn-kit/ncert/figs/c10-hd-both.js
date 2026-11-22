// Class 10 Applications of Trigonometry: a building and a tower. From the top of the building (height b) the observer sees the base of the
// tower at an angle of depression beta and its top at an angle of elevation alpha. Distance d = b / tan(beta) (from the depression triangle);
// tower height T = b + d tan(alpha) (the part above the observer plus the building height).
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
  let b = 20, be = 45, al = 30;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A building and a tower with the angle of depression to the tower base and elevation to its top' });
  const ctl = row(host);
  slider(ctl, { label: 'Building height (m)', min: 10, max: 30, step: 1, value: b, fmt: (v) => v + ' m', oninput: (v) => { b = v; upd(); } });
  slider(ctl, { label: 'Depression to the tower base', min: 20, max: 60, step: 5, value: be, fmt: (v) => v + '°', oninput: (v) => { be = v; upd(); } });
  slider(ctl, { label: 'Elevation to the tower top', min: 20, max: 60, step: 5, value: al, fmt: (v) => v + '°', oninput: (v) => { al = v; upd(); } });
  const out = readout(host);
  const dd = () => b / Math.tan(be * D), T = () => b + dd() * Math.tan(al * D);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Looking down at the base and up at the top', col), d = dd(), TT = T(), gy = h - 22, s = Math.min((w - 70) / (d + 8), (gy - t - 14) / TT), bx = 16, tx = bx + 5 * s + d * s, top = gy - b * s, Ty = gy - TT * s;
    ground(ctx, w, gy, col);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(bx, top, 5 * s, b * s); ctx.strokeRect(bx, top, 5 * s, b * s); ctx.fillRect(tx, Ty, 4 + s, gy - Ty); ctx.strokeRect(tx, Ty, 4 + s, gy - Ty);
    const ex = bx + 5 * s, ey = top; line(ctx, [[ex, ey], [tx, ey]], col.muted, 1.5, [5, 4]); line(ctx, [[ex, ey], [tx, gy]], col.s[1], 2.5); line(ctx, [[ex, ey], [tx, Ty]], col.s[0], 2.5);
    arcAt(ctx, ex, ey, 34, 0, be * D, col.s[1], 2); lab(ctx, `${be}°`, ex + 40, ey + 20, col.s[1], col, 'left', 12); arcAt(ctx, ex, ey, 40, -al * D, 0, col.s[0], 2); lab(ctx, `${al}°`, ex + 46, ey - 8, col.s[0], col, 'left', 12);
    lab(ctx, `${b} m`, bx + 2.5 * s, (top + gy) / 2, col.ink, col); lab(ctx, `d = ${m1(d)} m`, (ex + tx) / 2, gy + 14, col.s[3], col); lab(ctx, `T = ${m1(TT)} m`, tx - 6, Ty - 8, col.s[2], col, 'right');
  };
  function upd() { out.innerHTML = `Depression triangle: tan ${be}° = ${b} / d, so d = ${m1(dd())} m. Elevation triangle: the part of the tower above the building = d tan ${al}° = ${m1(dd() * Math.tan(al * D))} m. Tower = ${b} + ${m1(dd() * Math.tan(al * D))} = <b>${m1(T())} m</b>.`; cv.redraw(); }
  upd();
}
