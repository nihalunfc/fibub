// Class 10 Trigonometry: the values for the special angles 0, 30, 45, 60 and 90 degrees. Pick an angle: the triangle (hypotenuse 1)
// shows the opposite and adjacent sides, and the table lists sin, cos, tan. A memory trick: sin = sqrt(0), sqrt(1), sqrt(2), sqrt(3),
// sqrt(4) all over 2, and cos is the same list reversed. tan = sin / cos, undefined at 90 degrees (division by zero).
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

const ANG = [0, 30, 45, 60, 90], SIN = ['0', '1/2', '1/√2', '√3/2', '1'], COS = ['1', '√3/2', '1/√2', '1/2', '0'], TAN = ['0', '1/√3', '1', '√3', '—'];
export default function (host) {
  let k = 1;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'A right triangle with a special angle and the table of sine cosine and tangent values' });
  const ctl = row(host);
  choice(ctl, 'Angle', ANG.map((v, i) => [i, v + '°']), k, (v) => { k = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, `θ = ${ANG[k]}°: hypotenuse 1`, col), a = ANG[k] * D, R = Math.min(w - 70, h - t - 158), Ax = 26, Ay = t + 18 + R, c = Math.cos(a), s = Math.sin(a), Cx = Ax + R * c, By = Ay - R * s;
    ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Ay); ctx.lineTo(Cx, By); ctx.fill(); ctx.restore();
    line(ctx, [[Ax, Ay], [Cx, Ay]], col.s[1], 4); if (s > 0.001) line(ctx, [[Cx, Ay], [Cx, By]], col.s[0], 4); line(ctx, [[Ax, Ay], [Cx, By]], col.s[2], 3);
    if (k > 0 && k < 4) { rmark(ctx, Cx, Ay, -1, -1, col.ink); arcAt(ctx, Ax, Ay, 26, -a, 0, col.ink, 1.6); }
    lab(ctx, `cos = ${COS[k]}`, (Ax + Cx) / 2, Ay + 15, col.s[1], col); if (k > 0) lab(ctx, `sin = ${SIN[k]}`, Cx + (k === 4 ? 10 : 6), (Ay + By) / 2, col.s[0], col, 'left');
    lab(ctx, '1', (Ax + Cx) / 2 - 8, (Ay + By) / 2 - 12, col.s[2], col, 'right');
    const ty = Ay + 40, cw = (w - 64) / 5; ['sin θ', 'cos θ', 'tan θ'].forEach((n, r) => { lab(ctx, n, 8, ty + 26 + r * 20, col.muted, col, 'left', 11); });
    ANG.forEach((v, i) => { const x = 62 + cw * i + cw / 2; if (i === k) { ctx.fillStyle = col.soft; ctx.fillRect(x - cw / 2 + 2, ty - 6, cw - 4, 90); } lab(ctx, v + '°', x, ty + 6, i === k ? col.s[0] : col.ink, col, 'center', 12); [SIN, COS, TAN].forEach((arr, r) => lab(ctx, arr[i], x, ty + 26 + r * 20, i === k ? col.ink : col.muted, col, 'center', 12)); });
  };
  function upd() { const a = ANG[k] * D; out.innerHTML = `At ${ANG[k]}°: sin = ${SIN[k]} (${f3(Math.sin(a))}), cos = ${COS[k]} (${f3(Math.cos(a))}), tan = ${k === 4 ? '<b>not defined</b> (cos is 0 and you cannot divide by 0)' : TAN[k] + ' (' + f3(Math.tan(a)) + ')'}.`; cv.redraw(); }
  upd();
}
