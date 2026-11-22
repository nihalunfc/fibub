// 4.1 Row store against column store for "total revenue": the same 4 x 4 table stored row by row (read every cell)
// and column by column (read one column), then the repeated store values squeezed by run-length compression.
import { stepFig, box, note } from './b-lib.js';
import { text } from '../../kit.js';

const HEAD = ['date', 'store', 'item', 'revenue'];
const ROWS = [['09-14', 'S1', 'tea', '4.50'], ['09-14', 'S1', 'cake', '6.00'], ['09-14', 'S1', 'tea', '4.50'], ['09-14', 'S2', 'soup', '8.25']];
const NOTE = ['Query: total revenue. The table has 4 rows, 4 columns', 'Row store: rows sit together, so all 16 cells are read', 'Column store: each column sits together; read 4 cells', 'Repeats compress: date is "09-14 × 4", store "S1 × 3, S2 × 1"'];
export default function (host) {
  return stepFig(host, {
    aspect: 0.6, max: 300, label: 'A four by four table read as a row store and as a column store for a sum of revenue',
    name: 'Row store or column store', last: 3,
    draw(ctx, w, h, col, step) {
      const top = 52, cw = (w - 20) / 4 - 4, ch = Math.min(30, (h - top - 50) / 5 - 4);
      HEAD.forEach((hd, j) => text(ctx, hd, 10 + j * (cw + 4) + cw / 2, top - 8, { color: col.muted, size: 11, weight: 600, align: 'center' }));
      ROWS.forEach((r, i) => r.forEach((v, j) => {
        let state = 'idle';
        if (step === 1) state = 'run';
        if (step >= 2) state = j === 3 ? 'run' : 'idle';
        let label = v;
        if (step === 3 && j < 2) { if (i > 0 && ROWS[i - 1][j] === v) { label = ''; state = 'skip'; } else { const c = ROWS.slice(i).findIndex((rr) => rr[j] !== v); label = `${v} ×${c < 0 ? 4 - i : c}`; state = 'done'; } }
        box(ctx, 10 + j * (cw + 4), top + i * (ch + 4), cw, ch, label, col, { state, size: 11 });
      }));
      if (step === 1) text(ctx, 'page 1: row 1 | row 2 | row 3 | row 4', w / 2, top + 4 * (ch + 4) + 12, { color: col.muted, size: 11, align: 'center' });
      if (step >= 2) text(ctx, 'file per column: date | store | item | revenue', w / 2, top + 4 * (ch + 4) + 12, { color: col.muted, size: 11, align: 'center' });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
