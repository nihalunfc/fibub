// 2.2 Watch it happen: why a Parquet query reads so little. A table of 8 columns in 6 row groups: a CSV
// read touches every cell; Parquet reads only the 2 columns asked for, then skips row groups whose min/max
// dates cannot match the filter, leaving 2 of 48 blocks.
import { canvas, text, title, calm, ease, loop } from '../../kit.js';
import { box } from './a-draw.js';

const COLS = ['order_id', 'ts', 'store', 'item', 'qty', 'price', 'channel', 'note'];
const RG = ['1–5 Sep', '6–10', '11–15', '16–20', '21–25', '26–30'];
const USED = [1, 5]; const KEEP = 2; // the query: sum(price) where date = 14 Sep
const NOTE = [
  'CSV: no columns on disk, no statistics. Read all 48 blocks.',
  'Parquet keeps columns apart: ts and price are 12 of 48.',
  'Min/max per row group: only 11–15 Sep can hold 14 Sep.',
  'Read 2 of 48 blocks (about 4%), and they are compressed.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 340, min: 260, label: 'A grid of columns and row groups, with the blocks a query reads highlighted' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  const read = (c, r, s) => (s === 0 ? true : s === 1 ? USED.includes(c) : USED.includes(c) && r === KEEP);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, step === 0 ? 'Reading a CSV' : 'Reading Parquet', col);
    const L = 58, T = 52, R = w - 8, B = h - 44, cw = (R - L) / 8, rh = (B - T) / 6;
    COLS.forEach((c, i) => text(ctx, c, L + i * cw + cw / 2, T - 9, { color: USED.includes(i) && step > 0 ? col.ink : col.muted, size: cw < 40 ? 8.5 : 10, weight: USED.includes(i) && step > 0 ? 700 : 400, align: 'center', fit: false }));
    RG.forEach((g, r) => text(ctx, g, L - 6, T + r * rh + rh / 2, { color: r === KEEP && step >= 2 ? col.ink : col.muted, size: 9.5, align: 'right', fit: false, weight: r === KEEP && step >= 2 ? 700 : 400 }));
    let n = 0;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
      const now = read(c, r, step), before = step > 0 ? read(c, r, step - 1) : now;
      const a = now === before ? (now ? 1 : 0) : now ? ease(k) : 1 - ease(k);
      if (now) n++;
      box(ctx, L + c * cw + 1.5, T + r * rh + 1.5, cw - 3, rh - 3, { fill: col.panel, stroke: col.line, width: 1, r: 3 });
      if (a > 0) box(ctx, L + c * cw + 1.5, T + r * rh + 1.5, cw - 3, rh - 3, { fill: col.s[0], r: 3, alpha: 0.85 * a });
    }
    text(ctx, `blocks read: ${n} of 48`, L, B + 14, { color: col.ink, size: 12, weight: 700 });
    text(ctx, NOTE[step], 8, h - 12, { color: col.muted, size: 11 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
