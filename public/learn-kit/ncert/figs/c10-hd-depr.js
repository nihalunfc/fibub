// Class 10 Applications of Trigonometry: the angle of depression. From the top of a lighthouse the observer looks DOWN at a boat;
// the angle below the horizontal is the angle of depression. Because the horizontal line from the top is parallel to the sea,
// the angle of depression equals the boat's angle of elevation to the top (alternate angles). tan θ = H / d.
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
  let d = 40, show = 'off'; const H = 40;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A lighthouse observer looking down at a boat with the angle of depression and the equal angle of elevation' });
  const ctl = row(host);
  slider(ctl, { label: 'Boat distance from the base (m)', min: 15, max: 100, step: 1, value: d, fmt: (v) => v + ' m', oninput: (v) => { d = v; upd(); } });
  choice(ctl, 'Show the boat’s view', [['off', 'Hide'], ['on', 'Show']], show, (v) => { show = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Angle of depression: looking down', col), gy = h - 30, s = Math.min((w - 40) / 108, (gy - t - 18) / 46), lx = 18, bx = lx + 6 * s + d * s, ty = gy - H * s, a = Math.atan2(H, d);
    ctx.fillStyle = col.soft; ctx.fillRect(w * 0 + 0, gy, w, 30); ground(ctx, w, gy, col);
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, gy); ctx.lineTo(lx + 1.2 * s, ty); ctx.lineTo(lx + 4.8 * s, ty); ctx.lineTo(lx + 6 * s, gy); ctx.closePath(); ctx.fill(); ctx.stroke();
    const ex = lx + 3 * s; person(ctx, ex, ty, 14, col.ink);
    line(ctx, [[ex, ty - 6], [w - 10, ty - 6]], col.muted, 1.5, [5, 4]); line(ctx, [[ex, ty - 6], [bx, gy - 2]], col.s[0], 3);
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(bx - 12, gy - 3); ctx.lineTo(bx + 12, gy - 3); ctx.lineTo(bx + 7, gy + 6); ctx.lineTo(bx - 7, gy + 6); ctx.closePath(); ctx.fill();
    const aa = Math.atan2(gy - 2 - (ty - 6), bx - ex); arcAt(ctx, ex, ty - 6, 40, 0, aa, col.ink, 2); lab(ctx, `${deg(a / D)}`, ex + 46, ty + 12, col.ink, col, 'left', 12);
    if (show === 'on') { arcAt(ctx, bx, gy - 2, 34, Math.PI, Math.PI + aa, col.s[2], 2.5); lab(ctx, `${deg(a / D)}`, bx - 40, gy - 14, col.s[2], col, 'right', 12); line(ctx, [[bx, gy - 2], [bx - 90, gy - 2]], col.s[2], 1.2, [3, 3]); }
    lab(ctx, `${H} m`, lx + 6 * s + 6, (ty + gy) / 2, col.s[2], col, 'left'); lab(ctx, `${d} m`, (lx + 6 * s + bx) / 2, gy + 22, col.s[1], col);
  };
  function upd() { const a = Math.atan2(H, d) / D; out.innerHTML = `tan θ = ${H} / ${d} = ${f3(H / d)}, so the angle of depression is <b>${a.toFixed(1)}°</b>.` + (show === 'on' ? ` Seen from the boat, the angle of elevation to the lighthouse top is the same ${a.toFixed(1)}° (alternate angles between parallel lines).` : ' Turn on “Show the boat’s view” to see an equal angle appear at the boat.'); cv.redraw(); }
  upd();
}
