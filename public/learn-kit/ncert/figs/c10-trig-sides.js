// Class 10 Trigonometry: naming the sides. The hypotenuse is always opposite the right angle. "Opposite" and "adjacent" depend on
// which acute angle you stand at: the side across from it and the side touching it. In the same 3-4-5 triangle the two roles swap
// between angle A and angle B, so sin A = cos B and sin B = cos A here.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

export default function (host) {
  let at = 'A';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A 3 4 5 right triangle where opposite and adjacent swap when you stand at the other angle' });
  const ctl = row(host);
  choice(ctl, 'Stand at angle', [['A', 'A (bottom right)'], ['B', 'B (top)']], at, (v) => { at = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, `Sides as seen from angle ${at}`, col), s = Math.min((w - 90) / 4, (h - t - 70) / 3), Cx = 36, Cy = h - 40, A = [Cx + 4 * s, Cy], B = [Cx, Cy - 3 * s];
    const opp = at === 'A' ? [[Cx, Cy], B] : [[Cx, Cy], A], adj = at === 'A' ? [[Cx, Cy], A] : [[Cx, Cy], B];
    line(ctx, [opp[0], opp[1]], col.s[0], 4); line(ctx, [adj[0], adj[1]], col.s[1], 4); line(ctx, [A, B], col.s[2], 4);
    rmark(ctx, Cx, Cy, 1, -1, col.ink);
    if (at === 'A') { arcAt(ctx, A[0], A[1], 34, Math.PI, Math.PI + Math.atan(0.75), col.ink, 2); lab(ctx, 'A', A[0] + 8, A[1] + 14, col.ink, col, 'left', 14); lab(ctx, 'B', B[0] - 4, B[1] - 12, col.muted, col, 'center', 14); }
    else { arcAt(ctx, B[0], B[1], 34, Math.atan(0.75), Math.PI / 2, col.ink, 2); lab(ctx, 'B', B[0] - 6, B[1] - 12, col.ink, col, 'center', 14); lab(ctx, 'A', A[0] + 8, A[1] + 14, col.muted, col, 'left', 14); }
    lab(ctx, 'C', Cx - 10, Cy + 12, col.muted, col, 'center', 14);
    const mid = (p) => [(p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2];
    const oN = at === 'A' ? 3 : 4, aN = at === 'A' ? 4 : 3;
    if (at === 'A') { lab(ctx, `opposite = ${oN}`, mid(opp)[0] - 8, mid(opp)[1], col.s[0], col, 'right'); lab(ctx, `adjacent = ${aN}`, mid(adj)[0], mid(adj)[1] + 16, col.s[1], col); }
    else { lab(ctx, `adjacent = ${aN}`, mid(adj)[0] - 8, mid(adj)[1], col.s[1], col, 'right'); lab(ctx, `opposite = ${oN}`, mid(opp)[0], mid(opp)[1] + 16, col.s[0], col); }
    lab(ctx, 'hypotenuse = 5', mid([A, B])[0] + 8, mid([A, B])[1] - 12, col.s[2], col, 'left');
  };
  function upd() { const o = at === 'A' ? 3 : 4, a = at === 'A' ? 4 : 3;
    out.innerHTML = `From angle ${at}: sin ${at} = opp/hyp = ${o}/5, cos ${at} = adj/hyp = ${a}/5, tan ${at} = opp/adj = ${o}/${a}. The hypotenuse stays 5; the other two sides <b>swap jobs</b> when you change angle.`; cv.redraw(); }
  upd();
}
