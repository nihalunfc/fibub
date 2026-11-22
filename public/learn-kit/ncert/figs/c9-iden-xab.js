// Class 9 Identities: (x + a)(x + b) = x^2 + (a + b)x + ab as a rectangle of width x + a and height x + b, made of one x-by-x
// square, a strips of x by 1... drawn as a rectangle x by b, a rectangle a by x and a small a-by-b rectangle.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 3, b = 2;
  const X0 = 5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A rectangle of width x plus a and height x plus b split into x squared, two strips and a small rectangle' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: 1, max: 6, step: 1, value: a, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'b', min: 1, max: 6, step: 1, value: b, oninput: (v) => { b = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, '(x + ' + a + ')(x + ' + b + ') = x² + ' + (a + b) + 'x + ' + a * b, col), W = X0 + 6 + 0, sc = Math.min((w - 70) / (X0 + a), (h - t - 40) / (X0 + b)), ox = (w - (X0 + a) * sc) / 2 + 6, oy = t + 22;
    const X = (v) => ox + v * sc, Y = (v) => oy + v * sc;
    const box = (x, y, ww, hh, c, lab) => { ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = c; ctx.fillRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(X(x), Y(y), ww * sc, hh * sc); ctx.restore(); text(ctx, lab, X(x + ww / 2), Y(y + hh / 2), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); };
    box(0, 0, X0, X0, col.s[0], 'x²'); box(X0, 0, a, X0, col.s[2], 'ax'); box(0, X0, X0, b, col.s[3], 'bx'); box(X0, X0, a, b, col.s[5], 'ab');
    text(ctx, 'x', X(X0 / 2), Y(0) - 8, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'a = ' + a, X(X0 + a / 2), Y(0) - 8, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'x', X(0) - 9, Y(X0 / 2), { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'b = ' + b, X(0) - 6, Y(X0 + b / 2), { color: col.ink, size: 12, weight: 700, align: 'right' });
  };
  function upd() { out.innerHTML = `Four pieces: x², a rectangle <b>ax</b>, a rectangle <b>bx</b> and a small <b>ab</b> = ${a * b}. The two strips together make (a + b)x = <b>${a + b}x</b>. (In the picture x = ${X0} units, so the area is (${X0} + ${a})(${X0} + ${b}) = ${(X0 + a) * (X0 + b)} = ${X0 * X0} + ${(a + b) * X0} + ${a * b}.) Read the sum and the product in the factors from the answer: a + b is the middle coefficient, ab is the constant.`; cv.redraw(); }
  upd();
}
