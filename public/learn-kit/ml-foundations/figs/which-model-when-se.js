// 11.2 Which model when: the one-standard-error rule on the lesson's bank example. Steps: mean errors,
// standard-error bars, the limit line from the best model, who is inside it, and the simplest one inside.
import { canvas, title, axes, dot, line, text, loop, calm, ease } from '../../kit.js';

const M = [['logistic', 0.180, 0.009, 'simplest'], ['forest', 0.176, 0.011, ''], ['boosting', 0.170, 0.013, 'most complex']];
const LIM = 0.170 + 0.013;
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'Mean error with standard-error bars for three models and the one-standard-error limit' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    const { X, Y, L, R } = axes(ctx, w, h, col, { x: [0.5, 3.5], y: [0.15, 0.2], xt: [], yt: [0.15, 0.16, 0.17, 0.18, 0.19, 0.2], fy: (v) => v.toFixed(2), ylabel: 'mean error', l: 50, t: 42, b: 44 });
    M.forEach(([name, m, se, note], i) => {
      const x = X(i + 1), inside = m <= LIM;
      text(ctx, name, x, h - 30, { color: col.ink, size: 12, weight: 600, align: 'center' });
      if (note) text(ctx, note, x, h - 14, { color: col.muted, size: 10.5, align: 'center' });
      if (step >= 1) {
        const s = se * (step === 1 ? e : 1);
        line(ctx, [[x, Y(m - s)], [x, Y(m + s)]], col.muted, 2);
        line(ctx, [[x - 6, Y(m - s)], [x + 6, Y(m - s)]], col.muted, 2);
        line(ctx, [[x - 6, Y(m + s)], [x + 6, Y(m + s)]], col.muted, 2);
      }
      const hot = step >= 4 && i === 0, ok = step >= 3 && inside;
      dot(ctx, x, Y(m), hot ? 8 : 6, ok ? col.good || col.s[2] : col.s[0], hot ? col.ink : undefined);
      text(ctx, m.toFixed(3), x + 12, Y(m), { color: col.ink, size: 11.5, weight: 600, halo: col.panel });
    });
    if (step >= 2) {
      const xr = L + (R - L) * (step === 2 ? e : 1);
      line(ctx, [[L, Y(LIM)], [xr, Y(LIM)]], col.s[3], 2, [6, 4]);
      text(ctx, 'limit 0.170 + 0.013 = 0.183', L + 6, Y(LIM) - 10, { color: col.s[3], size: 11.5, weight: 700, halo: col.panel });
    }
    const T = ['Mean error over 5 folds (lower is better)', 'Bars: one standard error, sd ÷ √5', 'Best is boosting: draw its limit', 'All three are under the limit', 'Choose the simplest inside: logistic'];
    title(ctx, T[step], col);
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
