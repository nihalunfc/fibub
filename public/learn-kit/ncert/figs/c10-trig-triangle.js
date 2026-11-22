// Class 10 Trigonometry: the ratios of a right triangle depend only on the angle, not on the size of the triangle.
// Change the angle: sin = opposite/hypotenuse, cos = adjacent/hypotenuse and tan = opposite/adjacent change.
// Change only the size (similar triangles): every side grows by the same factor, so every ratio stays exactly the same.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

export default function (host) {
  let th = 37, H = 8;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 310, label: 'A right triangle with an adjustable angle and size and its sin cos tan ratios' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle θ (degrees)', min: 10, max: 80, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  slider(ctl, { label: 'Size: hypotenuse', min: 5, max: 10, step: 0.5, value: H, fmt: (v) => v.toFixed(1), oninput: (v) => { H = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Same angle, any size: same ratios', col), s = Math.min((w - 130) / 10, (h - t - 60) / 10), Ax = 24, Ay = h - 34, a = th * D, Cx = Ax + H * Math.cos(a) * s, By = Ay - H * Math.sin(a) * s;
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Ay); ctx.lineTo(Cx, By); ctx.fill(); ctx.restore();
    line(ctx, [[Ax, Ay], [Cx, Ay]], col.s[1], 3.5); line(ctx, [[Cx, Ay], [Cx, By]], col.s[0], 3.5); line(ctx, [[Ax, Ay], [Cx, By]], col.s[2], 3.5);
    rmark(ctx, Cx, Ay, -1, -1, col.ink);
    arcAt(ctx, Ax, Ay, 30, -a, 0, col.ink, 1.8); lab(ctx, 'θ', Ax + 40, Ay - 8, col.ink, col, 'left', 13);
    lab(ctx, `adjacent ${f3(H * Math.cos(a))}`, (Ax + Cx) / 2, Ay + 15, col.s[1], col);
    lab(ctx, `opposite ${f3(H * Math.sin(a))}`, Cx + 7, (Ay + By) / 2, col.s[0], col, 'left');
    lab(ctx, `hypotenuse ${H.toFixed(1)}`, (Ax + Cx) / 2 - Math.sin(a) * 18, (Ay + By) / 2 - Math.cos(a) * 18, col.s[2], col, 'center');
  };
  function upd() { const a = th * D, o = H * Math.sin(a), d = H * Math.cos(a);
    out.innerHTML = `sin θ = opp/hyp = ${f3(o)}/${H.toFixed(1)} = <b>${(o / H).toFixed(3)}</b> &nbsp; cos θ = adj/hyp = <b>${(d / H).toFixed(3)}</b> &nbsp; tan θ = opp/adj = <b>${(o / d).toFixed(3)}</b>. Drag the size slider: the sides change, the three ratios do not.`; cv.redraw(); }
  upd();
}
