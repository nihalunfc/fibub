// Class 10 Statistics (step player): finding the mode of the 40 batters' runs (frequencies 5, 9, 14, 8, 4; classes
// of width 20). Modal class 40–60, f1 = 14, f0 = 9, f2 = 8, l = 40, h = 20: mode = 40 + 20 × 5 / 11 ≈ 49.09.
import { canvas, text } from '../../kit.js';
import { drawMode } from './c10-stat-mode.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Step by step: the modal class, its neighbours and the mode formula' });
  cv.draw = (ctx, w, h, col) => {
    drawMode(ctx, w, h, col, { f0: 9, f1: 14, f2: 8, stage: step });
    if (step === 0) text(ctx, 'frequencies of the classes 20–40, 40–60, 60–80', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
    if (step === 3) text(ctx, '40 + 20 × (14 − 9) ÷ (28 − 9 − 8) = 40 + 100/11', w / 2, h - 10, { color: col.ink, size: 11, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(3, i); cv.redraw(); } };
}
