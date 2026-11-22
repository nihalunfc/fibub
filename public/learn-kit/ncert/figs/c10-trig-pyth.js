// Class 10 Trigonometry: sin^2 + cos^2 = 1 as areas. In a right triangle with hypotenuse 1 the legs are sin θ and cos θ.
// Pythagoras says the squares on the legs add up to the square on the hypotenuse: sin²θ + cos²θ = 1² = 1.
// Move θ: one square grows while the other shrinks, and together they always fill the unit square.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

export default function (host) {
  let th = 30;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Three squares whose areas are sine squared, cosine squared and one' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle θ', min: 0, max: 90, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'sin² θ + cos² θ = 1: squares on the sides', col), a = th * D, sn = Math.sin(a), cs = Math.cos(a), u = Math.min((w - 78) / 3, h - t - 60), base = h - 14, x0 = 12;
    const sq = (x, side, tone, label) => { if (side > 0.001) { ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = tone; ctx.fillRect(x, base - side * u, side * u, side * u); ctx.restore(); ctx.strokeStyle = tone; ctx.lineWidth = 2.5; ctx.strokeRect(x, base - side * u, side * u, side * u); } lab(ctx, label, x + Math.max(side * u, 16) / 2, base - side * u - 10, tone, col, 'center', 11); };
    sq(x0, sn, col.s[0], `sin²θ = ${f3(sn * sn)}`); sq(x0 + u * sn + 28, cs, col.s[1], `cos²θ = ${f3(cs * cs)}`); sq(x0 + u * (sn + cs) + 58, 1, col.s[2], '1² = 1');
    lab(ctx, '+', x0 + u * sn + 14, base - 8, col.ink, col, 'center', 16); lab(ctx, '=', x0 + u * (sn + cs) + 43, base - 8, col.ink, col, 'center', 16);
  };
  function upd() { const a = th * D; out.innerHTML = `θ = ${th}°: sin² θ + cos² θ = ${f3(Math.sin(a) ** 2)} + ${f3(Math.cos(a) ** 2)} = <b>${f3(Math.sin(a) ** 2 + Math.cos(a) ** 2)}</b>. The two small squares always add up to the unit square.`; cv.redraw(); }
  upd();
}
