// Class 10 Applications of Trigonometry: a home-made clinometer (straw, protractor, string and a weight). Sight the top of the object
// along the straw; the plumb string always hangs straight down. The angle between the string and the protractor's 90 degree line is the
// angle of elevation. Then height = distance x tan(angle) + eye height. (The Phone clinometer tool does this with your phone.)
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
  let th = 40, d = 20; const e = 1.5;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 310, label: 'A homemade clinometer with a protractor and a plumb line measuring the angle of elevation' });
  const ctl = row(host);
  slider(ctl, { label: 'Tilt of the straw (angle of elevation)', min: 5, max: 75, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  slider(ctl, { label: 'Distance from the object (m)', min: 5, max: 50, step: 1, value: d, fmt: (v) => v + ' m', oninput: (v) => { d = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Clinometer: the plumb line gives θ', col), a = th * D, px = w * 0.34, py = t + 78 + 52, R = 92;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-a);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(R, 0); ctx.arc(0, 0, R, 0, Math.PI / 2 * 1, false); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(R + 30, 0); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, R); ctx.stroke(); ctx.restore();
    const bx = px, by = py + R * 1.0;
    line(ctx, [[px, py], [px, py + R + 8]], col.s[0], 2); dot(ctx, px, py + R + 8, 5, col.s[0], col.ink);
    const sx = Math.sin(a), sy = Math.cos(a); line(ctx, [[px, py], [px + sx * R * 0.0 + sx * R, py + sy * R]], col.muted, 1.5, [4, 3]);
    arcAt(ctx, px, py, 50, Math.PI / 2 - a, Math.PI / 2, col.s[1], 2.5); lab(ctx, `θ = ${th}°`, px + 22, py + 68, col.s[1], col, 'left', 12);
    line(ctx, [[px, py], [px + R + 34, py]], col.muted, 1.2, [4, 3]); lab(ctx, 'horizontal', px + R + 38, py + 2, col.muted, col, 'left', 10); lab(ctx, 'straw (line of sight)', px + (R + 30) * Math.cos(a) + 6, py - (R + 30) * Math.sin(a) - 8, col.s[2], col, 'left', 11);
    lab(ctx, 'plumb line', px - 10, py + R + 22, col.s[0], col, 'right', 11);
  };
  function upd() { out.innerHTML = `Reading θ = ${th}° at ${d} m: height = ${d} × tan ${th}° + ${e} = ${m1(d * Math.tan(th * D))} + ${e} = <b>${m1(d * Math.tan(th * D) + e)} m</b>. The straw tilts up by θ, and the hanging string turns by the same θ relative to the protractor.`; cv.redraw(); }
  upd();
}
