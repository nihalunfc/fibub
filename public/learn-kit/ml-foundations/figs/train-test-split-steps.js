// 2.5 Splitting ten rows, step by step: the rows in their original order, shuffled, two locked away as the
// test set, two set aside for validation, and the six left for training. Rows slide between the bins.
import { canvas, text, title, ease, loop, calm } from '../../kit.js';

const SHUF = [7, 2, 9, 4, 1, 10, 6, 3, 8, 5];
// where each position of the shuffled order ends up at each step: 0 = one row, 1 = train, 2 = validation, 3 = test
const BIN = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
  [0, 0, 0, 0, 0, 0, 2, 2, 3, 3],
  [1, 1, 1, 1, 1, 1, 2, 2, 3, 3],
];
const NOTE = ['10 rows in the order they were collected', 'Shuffle, so no set gets only early or only late rows', 'Lock 2 rows away as the test set', 'Set 2 rows aside for validation', 'Train on 6; tune on validation; test once at the end'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 280, min: 220, label: 'Ten data rows being shuffled and split into training, validation and test sets' });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 1.1); cv.redraw(); } }, { autoplay: false });
  const pos = (s, j, w, h) => {
    // position of the row at shuffled index j (or original index j before shuffling) at step s
    const label = s === 0 ? j + 1 : SHUF[j];
    const bin = BIN[s][j];
    const cell = Math.min(34, (w - 40) / 10.6), y = h * 0.45;
    if (bin === 0) return { x: 20 + cell * 0.55 + j * cell * 1.05, y, label, cell };
    const groups = { 1: [0, 6], 2: [6, 2], 3: [8, 2] }, [first, size] = groups[bin];
    const gx = { 1: 20, 2: w * 0.58, 3: w * 0.8 }[bin];
    return { x: gx + cell * 0.55 + (j - first) * cell * 1.05, y: h * 0.62, label, cell, bin, size };
  };
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), fill = { 0: col.soft, 1: col.s[0], 2: col.s[2], 3: col.s[1] };
    for (let j = 0; j < 10; j++) {
      // follow the same row from the previous step to this one
      const label = step === 0 ? j + 1 : SHUF[j];
      const jp = prev === 0 && step > 0 ? label - 1 : step === 0 && prev > 0 ? SHUF.indexOf(label) : j;
      const a = pos(prev, jp, w, h), b = pos(step, j, w, h);
      const x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e, c = b.cell;
      ctx.fillStyle = fill[BIN[step][j]] || col.soft;
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - c / 2, y - c / 2, c, c, 4) : ctx.rect(x - c / 2, y - c / 2, c, c); ctx.fill(); ctx.stroke();
      text(ctx, String(label), x, y, { color: BIN[step][j] ? '#fff' : col.ink, size: 12, weight: 700, align: 'center' });
    }
    if (step >= 2) {
      const c = Math.min(34, (w - 40) / 10.6), yl = h * 0.62 + c / 2 + 16;
      if (step >= 4) text(ctx, 'training', 20 + c * 3, yl, { color: col.ink, size: 12, weight: 600, align: 'center' });
      if (step >= 3) text(ctx, 'validation', w * 0.58 + c * 1.05, h * 0.62 - c / 2 - 12, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, 'test (locked)', w * 0.8 + c * 1.05, yl, { color: col.ink, size: 12, weight: 600, align: 'center' });
    }
    text(ctx, NOTE[step], w / 2, h - 16, { color: col.ink, size: 12.5, weight: 600, align: 'center' });
    title(ctx, 'Splitting the rows', col);
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, BIN.length - 1); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
