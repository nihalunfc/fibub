// Class 10 Trigonometry: all six ratios from two sides. Choose the opposite and adjacent sides (whole numbers); the hypotenuse
// comes from Pythagoras, then sin, cos, tan and their reciprocals cosec, sec, cot follow. This is the method for "given one
// ratio, find the others": draw a triangle with those two sides, find the third, and read off the rest.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

export default function (host) {
  let o = 3, a = 4;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A right triangle with chosen opposite and adjacent sides and all six trigonometric ratios' });
  const ctl = row(host);
  slider(ctl, { label: 'Opposite side', min: 1, max: 12, step: 1, value: o, fmt: String, oninput: (v) => { o = v; upd(); } });
  slider(ctl, { label: 'Adjacent side', min: 1, max: 12, step: 1, value: a, fmt: String, oninput: (v) => { a = v; upd(); } });
  const out = readout(host);
  const hy = () => Math.sqrt(o * o + a * a), fr = (n, d) => (Number.isInteger(hy()) || n !== hy() && d !== hy() ? `${n}/${d} = ` : '') + f3(n / d);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Two sides give the third, then all six ratios', col), s = Math.min((w - 130) / a, (h - t - 60) / o, 40), Ax = 24, Ay = h - 32, Cx = Ax + a * s, By = Ay - o * s;
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Cx, Ay); ctx.lineTo(Cx, By); ctx.fill(); ctx.restore();
    line(ctx, [[Ax, Ay], [Cx, Ay]], col.s[1], 3.5); line(ctx, [[Cx, Ay], [Cx, By]], col.s[0], 3.5); line(ctx, [[Ax, Ay], [Cx, By]], col.s[2], 3.5);
    rmark(ctx, Cx, Ay, -1, -1, col.ink); arcAt(ctx, Ax, Ay, 26, -Math.atan2(o, a), 0, col.ink, 1.8);
    lab(ctx, `adj = ${a}`, (Ax + Cx) / 2, Ay + 15, col.s[1], col); lab(ctx, `opp = ${o}`, Cx + 6, (Ay + By) / 2, col.s[0], col, 'left');
    lab(ctx, `hyp = ${f3(hy())}`, (Ax + Cx) / 2 - 6, (Ay + By) / 2 - 12, col.s[2], col, 'right');
  };
  function upd() { const H = hy(), th = Math.atan2(o, a) / D, q = (x, y) => f3(x / y);
    out.innerHTML = `hyp = √(${o}² + ${a}²) = √${o * o + a * a} = <b>${f3(H)}</b>, θ ≈ ${th.toFixed(1)}°.<br>sin θ = ${q(o, H)} &nbsp; cos θ = ${q(a, H)} &nbsp; tan θ = ${q(o, a)}<br>cosec θ = ${q(H, o)} &nbsp; sec θ = ${q(H, a)} &nbsp; cot θ = ${q(a, o)}`; cv.redraw(); }
  upd();
}
