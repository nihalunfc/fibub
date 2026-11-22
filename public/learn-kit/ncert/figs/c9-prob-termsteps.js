// Class 9 Probability (step player): the words of probability on one example. Experiment: roll a die. Outcomes: 1 to 6.
// Event: a set of outcomes (even number = {2, 4, 6}). P(event) = favourable outcomes / all outcomes.
import { canvas, text, title } from '../../kit.js';
import { note, die } from './c9-prob-lib.js';

const N = ['Experiment: roll one fair die. We cannot say beforehand which face will come up.', 'Outcomes: the six possible results 1, 2, 3, 4, 5, 6. Together they are the sample space. All six are equally likely.', 'Event: “the die shows an even number”. An event is a group of outcomes we care about: here {2, 4, 6}.', 'Count the favourable outcomes (those in the event): 3. Count all outcomes: 6.', 'P(even) = favourable ÷ all = 3 ÷ 6 = 1/2.', 'Another event: “the number is more than 4” = {5, 6}. P = 2 ÷ 6 = 1/3.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The words experiment, outcome, event and probability shown on a die roll' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Experiment, outcomes, event', col), sz = Math.min(58, (w - 40) / 3.3), gx = (w - (3 * sz + 2 * 12)) / 2, gy = top + 30;
    for (let i = 0; i < 6; i++) {
      const x = gx + sz / 2 + (i % 3) * (sz + 12), y = gy + sz / 2 + Math.floor(i / 3) * (sz + 12), v = i + 1;
      const hit = s === 2 || s === 3 || s === 4 ? v % 2 === 0 : s === 5 ? v > 4 : false;
      die(ctx, x, y, sz, v, col, hit ? col.s[3] : col.panel, hit ? col.ink : col.muted);
    }
    if (s === 0) text(ctx, '?', w / 2, gy + sz + 6, { color: col.s[2], size: 40, weight: 700, align: 'center', halo: col.panel });
    if (s >= 4) text(ctx, s === 4 ? 'P(even) = 3/6 = 1/2' : 'P(more than 4) = 2/6 = 1/3', w / 2, gy + 2 * sz + 36, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    if (s === 3) text(ctx, 'favourable 3  |  all 6', w / 2, gy + 2 * sz + 36, { color: col.s[2], size: 14, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
