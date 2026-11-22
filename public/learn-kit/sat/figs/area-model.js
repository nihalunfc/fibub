// 3.1 Expanding (ax + b)(cx + d) as the area of a rectangle: four boxes, four products. Sliders change the numbers.
import { canvas, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const S = { a: 2, b: 3, c: 1, d: 4 };
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 240, label: 'A rectangle with sides (ax + b) and (cx + d) split into four boxes' });
  const ctl = row(host), out = readout(host);
  for (const [k, lab, min, max] of [['a', 'a', 1, 4], ['b', 'b', 1, 6], ['c', 'c', 1, 4], ['d', 'd', 1, 6]])
    slider(ctl, { label: lab, min, max, step: 1, value: S[k], fmt: (v) => String(v), oninput: (v) => { S[k] = v; cv.redraw(); show(); } });
  cv.draw = (ctx, w, h, col) => {
    const X = 3; // draw x as 3 units long so the x-parts look bigger than the number parts
    const W = S.a * X + S.b, H = S.c * X + S.d, sc = Math.min((w - 90) / W, (h - 60) / H), x0 = 60, y0 = 34;
    const cells = [
      [0, 0, S.a * X, S.c * X, `${S.a * S.c}x²`, col.s[0]], [S.a * X, 0, S.b, S.c * X, `${S.b * S.c}x`, col.s[1]],
      [0, S.c * X, S.a * X, S.d, `${S.a * S.d}x`, col.s[1]], [S.a * X, S.c * X, S.b, S.d, `${S.b * S.d}`, col.s[2]],
    ];
    for (const [x, y, ww, hh, lab, c] of cells) {
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = c; ctx.fillRect(x0 + x * sc, y0 + y * sc, ww * sc, hh * sc); ctx.restore();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0 + x * sc, y0 + y * sc, ww * sc, hh * sc);
      text(ctx, lab, x0 + (x + ww / 2) * sc, y0 + (y + hh / 2) * sc, { color: col.ink, size: 13, weight: 700, align: 'center', fit: false });
    }
    text(ctx, `${S.a === 1 ? '' : S.a}x`, x0 + (S.a * X / 2) * sc, y0 - 12, { color: col.ink, size: 12, weight: 600, align: 'center' });
    text(ctx, `+ ${S.b}`, x0 + (S.a * X + S.b / 2) * sc, y0 - 12, { color: col.ink, size: 12, weight: 600, align: 'center' });
    text(ctx, `${S.c === 1 ? '' : S.c}x`, x0 - 8, y0 + (S.c * X / 2) * sc, { color: col.ink, size: 12, weight: 600, align: 'right' });
    text(ctx, `+ ${S.d}`, x0 - 8, y0 + (S.c * X + S.d / 2) * sc, { color: col.ink, size: 12, weight: 600, align: 'right' });
  };
  const show = () => {
    const m = S.a * S.d + S.b * S.c;
    out.innerHTML = `(${S.a === 1 ? '' : S.a}x + ${S.b})(${S.c === 1 ? '' : S.c}x + ${S.d}) = ${S.a * S.c}x² + ${S.b * S.c}x + ${S.a * S.d}x + ${S.b * S.d} = <b>${S.a * S.c}x² + ${m}x + ${S.b * S.d}</b>. The two middle boxes are the ones people forget.`;
  };
  cv.redraw(); show();
}
