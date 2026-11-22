// 8.1 What quantisation is: four weights in one block rounded to 4 bits. Weights 0.42, −0.13, 0.91, −0.58;
// scale s = 0.91 ÷ 7 = 0.13, so the 15 allowed values are −0.91, −0.78, ... 0.91. Steps: the weights on a line,
// the ruler of allowed values, each weight snapping to its nearest mark, the whole numbers stored, the errors.
import { canvas, title, text, dot, line, loop, calm, ease, lerp } from '../../kit.js';

const W = [0.42, -0.13, 0.91, -0.58], S = 0.13, Q = W.map((w) => Math.round(w / S));
export default function (host) {
  const cv = canvas(host, { aspect: 0.58, max: 320, min: 240, label: 'Four weights on a number line snapping to the nearest of fifteen 4-bit levels' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.9); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), L = 24, R = w - 24, y0 = h * 0.52;
    const X = (v) => L + ((v + 1) / 2) * (R - L);
    const heads = ['Four weights, stored with 16 bits each', 'The ruler: 15 marks, s = 0.91 ÷ 7 = 0.13 apart', 'Each weight snaps to its nearest mark', 'The file keeps only whole numbers (4 bits each)', 'What is lost: the small gaps'];
    title(ctx, heads[step], col);
    line(ctx, [[L, y0], [R, y0]], col.muted, 1.5);
    [-1, -0.5, 0, 0.5, 1].forEach((v) => text(ctx, String(v), X(v), y0 + 44, { color: col.muted, size: 10.5, align: 'center' }));
    if (step >= 1) {
      for (let q = -7; q <= 7; q++) {
        const x = X(q * S), a = step === 1 ? e : 1;
        ctx.save(); ctx.globalAlpha = a; line(ctx, [[x, y0 - 10], [x, y0 + 10]], col.ink, 1.5); ctx.restore();
        if (step >= 3) text(ctx, String(q), x, y0 + 24, { color: Q.includes(q) ? col.ink : col.muted, size: 10, weight: Q.includes(q) ? 700 : 400, align: 'center' });
      }
    }
    W.forEach((wv, i) => {
      const target = Q[i] * S, t = step === 2 ? e : step > 2 ? 1 : 0, x = X(lerp(wv, target, t));
      if (step >= 4) { line(ctx, [[X(wv), y0 - 30], [X(target), y0 - 30]], col.s[i], 3); dot(ctx, X(wv), y0 - 30, 3, col.s[i]); }
      dot(ctx, x, y0, 6, col.s[i], col.panel);
      const lab = step >= 3 ? `${wv} → ${Q[i]} → ${(Q[i] * S).toFixed(2)}` : String(wv);
      const ly = 46 + i * 15;
      text(ctx, lab, 10, ly + 8, { color: col.s[i], size: 11.5, weight: 600 });
    });
    if (step >= 4) text(ctx, 'errors: 0.03, 0, 0, 0.06; never more than half a step (0.065)', 10, h - 14, { color: col.ink, size: 11.5, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
