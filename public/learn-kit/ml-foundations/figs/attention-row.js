// 10.4 Attention: one row worked out, with the lesson's numbers. Query (1, 0); keys (2, 0), (0, 2), (1, 1);
// values (1, 0), (0, 1), (1, 1); d = 2. Steps: dot products, divide by √2, e^score, weights that add to 1,
// then the output as a weighted average of the values, drawn on a small map.
import { canvas, title, text, axes, dot, arrow, loop, calm, ease, lerp } from '../../kit.js';

const K = [[2, 0], [0, 2], [1, 1]], V = [[1, 0], [0, 1], [1, 1]];
const raw = K.map((k) => k[0]);                 // q · k with q = (1, 0)
const sc = raw.map((v) => v / Math.SQRT2), ex = sc.map(Math.exp), tot = ex.reduce((a, b) => a + b, 0), wt = ex.map((v) => v / tot);
const out = [0, 1].map((j) => wt.reduce((s, a, i) => s + a * V[i][j], 0));
const ROWS = [['q · k', raw, 2.5], ['score ÷ √2', sc, 2], ['e^score', ex, 4.5], ['weight', wt, 1]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 360, min: 260, label: 'One attention row: scores, softmax weights and the blended output' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    if (step < 4) {
      const [name, vals, max] = ROWS[step];
      title(ctx, `The word with query (1, 0): ${name}`, col);
      const L = 88, R = w - 70, bh = 26;
      vals.forEach((v, i) => {
        const y = 50 + i * 54;
        text(ctx, `word ${i + 1}`, 10, y + 6, { color: col.ink, size: 12, weight: 600 });
        text(ctx, `key (${K[i].join(', ')})`, 10, y + 22, { color: col.muted, size: 10.5 });
        ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, bh);
        ctx.fillStyle = col.s[i]; ctx.fillRect(L, y, ((R - L) * v * e) / max, bh);
        text(ctx, v.toFixed(step === 0 ? 0 : step === 3 ? 3 : 2), R + 8, y + bh / 2, { color: col.ink, size: 12, weight: 600 });
      });
      if (step === 2) text(ctx, `total ${tot.toFixed(2)}`, 10, h - 16, { color: col.muted, size: 11.5 });
      if (step === 3) text(ctx, 'the weights add up to 1', 10, h - 16, { color: col.muted, size: 11.5 });
    } else {
      const { X, Y } = axes(ctx, w, h, col, { x: [-0.1, 1.3], y: [-0.1, 1.3], l: 40, t: 42, xt: [0, 0.5, 1], yt: [0, 0.5, 1] });
      V.forEach((v, i) => { dot(ctx, X(v[0]), Y(v[1]), 6, col.s[i]); text(ctx, `value ${i + 1} · weight ${wt[i].toFixed(2)}`, X(v[0]) + 9, Y(v[1]) - 10, { color: col.ink, size: 11, halo: col.panel }); });
      const p = [lerp(0, out[0], e), lerp(0, out[1], e)];
      arrow(ctx, X(0), Y(0), X(p[0]), Y(p[1]), col.ink, 2, 8);
      dot(ctx, X(p[0]), Y(p[1]), 6, col.ink);
      text(ctx, 'output (0.86, 0.42)', X(out[0]) - 10, Y(out[1]) - 16, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
      title(ctx, 'Output = weighted average of the values', col);
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
