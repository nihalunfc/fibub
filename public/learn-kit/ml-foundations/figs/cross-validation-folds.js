// 7.2 Watch it happen: 5-fold cross-validation. Each step is one round (one fold tested, the other four
// train); the last step shows all five scores, their mean and spread.
import { canvas, text, title, ease, loop, calm } from '../../kit.js';

const SCORES = [82, 86, 80, 84, 83];
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'Five rounds of cross-validation: each row of data is tested once' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, step < 5 ? `Round ${step + 1} of 5` : 'All five rounds', col);
    const L = 74, R = w - 70, T = 40, rowH = Math.min(36, (h - T - 50) / 5), gap = 4;
    const fw = (R - L) / 5;
    const rounds = step < 5 ? step + 1 : 5;
    for (let i = 0; i < 5; i++) {
      const y = T + i * rowH;
      const shown = i < rounds;
      text(ctx, 'Round ' + (i + 1), 8, y + rowH / 2 - gap / 2, { color: shown ? col.ink : col.muted, size: 11.5, weight: i === step ? 700 : 400 });
      for (let f = 0; f < 5; f++) {
        const isTest = f === i;
        ctx.globalAlpha = shown ? (i === step && step < 5 ? 0.35 + 0.65 * ease(k) : 0.9) : 0.12;
        ctx.fillStyle = isTest ? col.s[1] : col.s[0];
        ctx.fillRect(L + f * fw + 1, y, fw - 3, rowH - gap);
        ctx.globalAlpha = 1;
        if (shown) text(ctx, isTest ? 'test' : 'train', L + f * fw + fw / 2, y + rowH / 2 - gap / 2, { color: '#fff', size: 10.5, weight: 600, align: 'center' });
      }
      if (shown && (i < step || step === 5 || k > 0.6)) text(ctx, SCORES[i] + ' %', R + 8, y + rowH / 2 - gap / 2, { color: col.ink, size: 12.5, weight: 700 });
    }
    const yb = T + 5 * rowH + 18;
    if (step < 5) text(ctx, `Train on 4 folds, test on fold ${step + 1}: the model never saw these rows.`, 8, yb, { color: col.muted, size: 11.5 });
    else {
      text(ctx, 'Mean 83 %   ·   spread (sd) 2.2 points', 8, yb, { color: col.ink, size: 13, weight: 700 });
      text(ctx, 'Every row was tested exactly once.', 8, yb + 20, { color: col.muted, size: 11.5 });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
