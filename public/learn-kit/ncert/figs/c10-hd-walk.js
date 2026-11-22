// Class 10 Applications of Trigonometry: two angles of elevation of the same tower from two points in line with its foot. Walking d metres
// towards the tower raises the angle from alpha to beta. With x the distance from the nearer point: h = x tan(beta) and
// h = (x + d) tan(alpha), so h = d / (cot alpha - cot beta). Two triangles, two equations, one height.
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
  let al = 30, be = 60, d = 40;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A tower seen from two points at different distances with two angles of elevation' });
  const ctl = row(host);
  slider(ctl, { label: 'First angle (far point)', min: 20, max: 60, step: 5, value: al, fmt: (v) => v + '°', oninput: (v) => { al = v; if (be <= al) { be = al + 5; sb.set(be); } upd(); } });
  const sb = slider(ctl, { label: 'Second angle (nearer point)', min: 30, max: 75, step: 5, value: be, fmt: (v) => v + '°', oninput: (v) => { be = v; if (al >= be) { al = be - 5; sa.set(al); } upd(); } });
  const sa = { set() {} };
  slider(ctl, { label: 'Distance walked (m)', min: 10, max: 60, step: 5, value: d, fmt: (v) => v + ' m', oninput: (v) => { d = v; upd(); } });
  const out = readout(host);
  const cot = (x) => 1 / Math.tan(x * D), hh = () => d / (cot(al) - cot(be));
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Two sightings, one tower', col), H = hh(), x2 = H * cot(be), x1 = H * cot(al), gy = h - 26, s = Math.min((w - 70) / (x1 + 6), (gy - t - 24) / (H * 1.1)), ax = 20, tx = ax + x1 * s, bx = tx - x2 * s;
    ground(ctx, w, gy, col);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(tx, gy - H * s, 3 * s + 6, H * s); ctx.strokeRect(tx, gy - H * s, 3 * s + 6, H * s);
    line(ctx, [[ax, gy], [tx, gy - H * s]], col.s[0], 2.5); line(ctx, [[bx, gy], [tx, gy - H * s]], col.s[1], 2.5);
    arcAt(ctx, ax, gy, 38, -al * D, 0, col.s[0], 2); lab(ctx, `${al}°`, ax + 44, gy - 8, col.s[0], col, 'left', 12); arcAt(ctx, bx, gy, 26, -be * D, 0, col.s[1], 2); lab(ctx, `${be}°`, bx + 20, gy - 24, col.s[1], col, 'left', 12);
    dot(ctx, ax, gy, 5, col.s[0]); dot(ctx, bx, gy, 5, col.s[1]); lab(ctx, 'A', ax, gy + 14, col.s[0], col); lab(ctx, 'B', bx, gy + 14, col.s[1], col);
    line(ctx, [[ax, gy + 20], [bx, gy + 20]], col.s[3], 2); lab(ctx, `${d} m`, (ax + bx) / 2, gy + 20 - 7, col.s[3], col, 'center', 11); lab(ctx, `h = ${m1(H)} m`, tx - 6, gy - H * s - 8, col.s[2], col, 'right', 12);
  };
  function upd() { const H = hh(); out.innerHTML = `From B: h = x tan ${be}°. From A: h = (x + ${d}) tan ${al}°. Subtract: h = ${d} / (cot ${al}° − cot ${be}°) = ${d} / (${f3(cot(al))} − ${f3(cot(be))}) = <b>${m1(H)} m</b>. B is ${m1(H * cot(be))} m from the tower.`; cv.redraw(); }
  upd();
}
