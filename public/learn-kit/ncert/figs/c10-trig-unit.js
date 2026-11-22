// Class 10 Trigonometry: the unit circle (radius 1) shows the ratios as lengths. A point P at angle θ has horizontal distance cos θ
// and height sin θ from the right triangle with hypotenuse 1. The tangent line x = 1 meets the extended radius at height tan θ.
// As θ goes from 0 to 90 degrees, sin climbs 0 to 1, cos falls 1 to 0 and tan grows without limit.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

export default function (host) {
  let th = 35;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 320, label: 'A unit circle quadrant showing sine as height, cosine as width and tangent along a vertical line' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle θ', min: 0, max: 90, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  const an = loop(host, (dt) => { th += dt * 18; if (th > 90) th = 0; sl.set(Math.round(th)); upd(); }, { autoplay: false });
  an.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Unit circle: sin is height, cos is width', col), Ox = 30, Oy = h - 30, R = Math.min(w - Ox - 70, (Oy - t - 16) / 1.5), a = th * D, Px = Ox + R * Math.cos(a), Py = Oy - R * Math.sin(a);
    line(ctx, [[Ox, Oy], [Ox + R * 1.18, Oy]], col.muted, 1.5); line(ctx, [[Ox, Oy], [Ox, Oy - R * 1.5]], col.muted, 1.5);
    arcAt(ctx, Ox, Oy, R, -Math.PI / 2, 0, col.muted, 1.5);
    line(ctx, [[Ox + R, Oy], [Ox + R, Oy - R * 1.5]], col.line, 1.5, [5, 4]);
    const tn = Math.tan(a), tyc = Math.min(tn, 1.45);
    if (th < 89.5) { const E = tn <= 1.45 ? [Ox + R, Oy - R * tn] : [Ox + R * 1.45 / tn, Oy - R * 1.45]; line(ctx, [[Px, Py], E], col.muted, 1.2, [3, 3]); line(ctx, [[Ox + R, Oy], [Ox + R, Oy - R * tyc]], col.s[2], 4); }
    line(ctx, [[Px, Py], [Px, Oy]], col.s[0], 4); line(ctx, [[Ox, Oy], [Px, Oy]], col.s[1], 4); line(ctx, [[Ox, Oy], [Px, Py]], col.ink, 2);
    arcAt(ctx, Ox, Oy, 28, -a, 0, col.ink, 1.6); dot(ctx, Px, Py, 6, col.s[3], col.ink);
    lab(ctx, 'sin θ', Px + 8, (Py + Oy) / 2, col.s[0], col, 'left'); lab(ctx, 'cos θ', (Ox + Px) / 2, Oy + 14, col.s[1], col);
    if (th < 89.5 && tyc > 0.12) lab(ctx, tn > 1.45 ? 'tan θ (off the top)' : 'tan θ', Ox + R + 6, Oy - R * tyc / 2, col.s[2], col, 'left');
    lab(ctx, '1', Ox + R, Oy + 14, col.muted, col, 'center', 11);
  };
  function upd() { const a = th * D; out.innerHTML = `θ = ${Math.round(th)}°: sin θ = <b>${f3(Math.sin(a))}</b>, cos θ = <b>${f3(Math.cos(a))}</b>, tan θ = <b>${th > 89 ? 'huge (undefined at 90°)' : f3(Math.tan(a))}</b>. Check: sin² + cos² = ${f3(Math.sin(a) ** 2 + Math.cos(a) ** 2)}.`; cv.redraw(); }
  upd();
}
