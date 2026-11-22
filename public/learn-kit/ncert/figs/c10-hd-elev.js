// Class 10 Applications of Trigonometry: the angle of elevation. An observer's eye looks up at the top of a tower; the angle between
// the horizontal line of sight and the line to the top is the angle of elevation θ. With the eye at height e and the tower H high,
// tan θ = (H - e) / d, so walking closer (smaller d) makes the angle bigger and a taller tower makes it bigger too.
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
  let d = 30, H = 30; const e = 1.5;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'An observer looking up at a tower with the angle of elevation marked' });
  const ctl = row(host);
  slider(ctl, { label: 'Distance from the tower (m)', min: 5, max: 50, step: 1, value: d, fmt: (v) => v + ' m', oninput: (v) => { d = v; upd(); } });
  slider(ctl, { label: 'Height of the tower (m)', min: 10, max: 40, step: 1, value: H, fmt: (v) => v + ' m', oninput: (v) => { H = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Angle of elevation: looking up', col), gy = h - 24, s = Math.min((w - 70) / (d + 4), (gy - t - 24) / (H + 1)), ox = 16, tx = ox + d * s, ey = gy - e * s - 2;
    ground(ctx, w, gy, col);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(tx, gy - H * s, 3 * s, H * s); ctx.strokeRect(tx, gy - H * s, 3 * s, H * s);
    person(ctx, ox, gy, Math.max(16, 1.7 * s), col.ink);
    line(ctx, [[ox, ey], [tx, ey]], col.muted, 1.5, [5, 4]); line(ctx, [[ox, ey], [tx, gy - H * s]], col.s[0], 3);
    dot(ctx, tx, gy - H * s, 4, col.s[0]);
    const a = Math.atan2((H - e) * s, d * s); arcAt(ctx, ox, ey, 34, -a, 0, col.ink, 2); lab(ctx, `θ = ${deg(Math.atan2(H - e, d) / D)}`, ox + 42, ey - 12, col.ink, col, 'left', 12);
    lab(ctx, `${d} m`, (ox + tx) / 2, gy + 14, col.s[1], col); lab(ctx, `${H} m`, tx + 3 * s + 6, gy - H * s / 2, col.s[2], col, 'left');
  };
  function upd() { const th = Math.atan2(H - e, d) / D; out.innerHTML = `Eye height ${e} m. tan θ = (${H} − ${e}) / ${d} = ${f3((H - e) / d)}, so <b>θ ≈ ${th.toFixed(1)}°</b>. Walk closer and θ grows; walk away and it shrinks.`; cv.redraw(); }
  upd();
}
