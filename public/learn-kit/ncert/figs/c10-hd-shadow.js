// Class 10 Applications of Trigonometry: shadow and the sun's altitude. A 6 m pole in sunlight: the sun's rays make angle θ with the
// ground (angle of elevation of the sun). The shadow is the base of a right triangle: tan θ = height / shadow, so shadow = height / tan θ.
// Low sun (morning, evening) gives a long shadow; the sun high overhead gives a short one. Play to run a "day".
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
  let th = 40; const H = 6; let dirn = 1;
  const cv = canvas(host, { aspect: 0.52, max: 440, min: 260, label: 'A pole and its shadow with the sun at an angle of elevation' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Sun’s angle above the horizon', min: 10, max: 80, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  const an = loop(host, (dt) => { th += dirn * dt * 9; if (th > 80) { th = 80; dirn = -1; } if (th < 10) { th = 10; dirn = 1; } sl.set(Math.round(th)); upd(); }, { autoplay: false });
  an.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Shadow = height ÷ tan(sun angle)', col), gy = h - 22, s = Math.min((w - 80) / 36, (gy - t - 44) / 6), px = 40, a = th * D, sh = H / Math.tan(a), sx = px + sh * s, top = gy - H * s;
    ground(ctx, w, gy, col);
    const ex = px - Math.cos(a) * 22, ey = top - Math.sin(a) * 22;
    line(ctx, [[ex, ey], [sx, gy]], col.s[3], 2, [6, 4]); dot(ctx, ex, ey, 8, col.s[3], col.ink);
    line(ctx, [[px, gy], [px, top]], col.ink, 5); line(ctx, [[px, gy], [sx, gy]], col.s[1], 5);
    arcAt(ctx, sx, gy, 30, Math.PI, Math.PI + a, col.ink, 2); lab(ctx, `${Math.round(th)}°`, sx - 36, gy - 8, col.ink, col, 'right', 12);
    lab(ctx, `shadow ${m1(sh)} m`, (px + sx) / 2 + 10, gy + 14, col.s[1], col); lab(ctx, `pole ${H} m`, px + 8, gy - H * s / 2, col.ink, col, 'left');
  };
  function upd() { const a = th * D; out.innerHTML = `Sun at ${Math.round(th)}°: shadow = 6 ÷ tan ${Math.round(th)}° = <b>${m1(H / Math.tan(a))} m</b>. At 45° the shadow equals the pole (6 m); at 30° it is 6√3 ≈ 10.4 m; at 60° only 6/√3 ≈ 3.5 m.`; cv.redraw(); }
  upd();
}
