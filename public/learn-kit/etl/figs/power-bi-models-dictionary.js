// 6.1 Watch it happen: how an Import model (VertiPaq) stores a column. Eight channel values become a dictionary
// of four distinct values, each row keeps only a 2-bit number, and after sorting, runs of the same number are
// stored as (value, count) pairs. An ID column, with a new value on every row, gets none of these savings.
import { canvas, text, title, calm, ease, loop } from '../../kit.js';
import { grid, wrap } from './c-draw.js';

const RAW = ['app', 'counter', 'app', 'delivery', 'drive_thru', 'counter', 'app', 'app'];
const DICT = ['app', 'counter', 'delivery', 'drive_thru'];
const BITS = (v) => DICT.indexOf(v).toString(2).padStart(2, '0');
const NOTE = [
  'A channel column, 8 rows. As plain text, "drive_thru" is stored again every time it appears.',
  'Build a dictionary: each distinct value once, with a small number.',
  '4 distinct values need only 2 bits per row (00 to 11): 8 rows × 2 bits = 16 bits.',
  'Sort, then store runs: (app, 4) (counter, 2) (delivery, 1) (drive_thru, 1). 4 pairs, not 8 values.',
  'An order_id column has a new value on every row: the dictionary is as big as the data and nothing repeats.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 370, min: 330, label: 'A text column being turned into a dictionary, bit-packed numbers and run-length pairs' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'How Import mode squeezes a column', col);
    const W = w - 16, c1 = W * 0.36, c2 = W * 0.36, c3 = W * 0.24, y = 44, a = ease(k);
    if (step < 4) {
      grid(ctx, 8, y, [{ w: c1, label: 'channel' }], RAW.map((v) => [v]), col, { rh: 19, hi: (i) => (RAW[i] === 'drive_thru' && step === 0 ? col.s[1] + '33' : null) });
      if (step >= 1) {
        ctx.save(); ctx.globalAlpha = step === 1 ? a : 1;
        grid(ctx, 12 + c1, y, [{ w: c2 * 0.3, label: 'id' }, { w: c2 * 0.7, label: 'dictionary' }], DICT.map((v, i) => [i, v]), col, { rh: 19 });
        ctx.restore();
      }
      if (step === 2) {
        ctx.save(); ctx.globalAlpha = a;
        grid(ctx, 16 + c1 + c2, y, [{ w: c3, label: 'stored' }], RAW.map((v) => [BITS(v)]), col, { rh: 19 });
        ctx.restore();
        text(ctx, '8 rows × 2 bits = 16 bits', 12 + c1, y + 19 * 5 + 16, { color: col.ink, size: 11.5, weight: 700, fit: false });
      }
      if (step === 3) {
        ctx.save(); ctx.globalAlpha = a;
        grid(ctx, 12 + c1, y + 19 * 5 + 10, [{ w: c2 * 0.72, label: 'run of' }, { w: c2 * 0.28, label: 'n' }], [['0 app', 4], ['1 counter', 2], ['2 delivery', 1], ['3 drive_thru', 1]], col, { rh: 19, hi: () => col.s[2] + '22' });
        ctx.restore();
      }
    } else {
      const ids = ['Q1001', 'Q1002', 'Q1003', 'Q1004', 'Q1005', 'Q1006', 'Q1007', 'Q1008'];
      grid(ctx, 8, y, [{ w: c1, label: 'order_id' }], ids.map((v) => [v]), col, { rh: 19 });
      ctx.save(); ctx.globalAlpha = a;
      grid(ctx, 12 + c1, y, [{ w: c2 * 0.3, label: 'id' }, { w: c2 * 0.7, label: 'dictionary' }], ids.map((v, i) => [i, v]), col, { rh: 19, hi: () => col.s[1] + '22' });
      grid(ctx, 16 + c1 + c2, y, [{ w: c3, label: 'stored' }], ids.map((v, i) => [i.toString(2).padStart(3, '0')]), col, { rh: 19 });
      ctx.restore();
    }
    wrap(ctx, NOTE[step], 8, h - 34, w - 16, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
