// 5.3 Watch it happen: gaps and islands. A store had no data on days 3, 4, 5, 9, 10 and 13 of a 14-day window.
// Number the silent days in order (row_number), subtract that from the day, and every run of consecutive days
// gets the same leftover number, which labels its island.
import { canvas, text, title, calm, ease, loop } from '../../kit.js';
import { box, grid, wrap } from './c-draw.js';

const SILENT = [3, 4, 5, 9, 10, 13];
const GRP = SILENT.map((d, i) => d - (i + 1)); // 2,2,2,5,5,7
const ISL = { 2: 0, 5: 1, 7: 2 };
const NOTE = [
  'Fourteen days for store R107. Shaded days have no sales data at all.',
  'Keep only the silent days and number them in order: row_number() = 1 to 6.',
  'Subtract: day − row_number. Inside a run of consecutive days the answer stays the same.',
  'That leftover number labels each island: 2, 5 and 7. Three separate silences.',
  'GROUP BY the label: start, end and length of each silent stretch.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 300, min: 250, label: 'A strip of fourteen days with silent days grouped into islands' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Gaps and islands: day − row number', col);
    const s = (w - 16) / 14, y0 = 44, a = ease(k);
    for (let d = 1; d <= 14; d++) {
      const i = SILENT.indexOf(d), x = 8 + (d - 1) * s;
      const fill = i < 0 ? col.panel : step >= 3 ? col.s[ISL[GRP[i]]] + '66' : col.muted + '44';
      box(ctx, x + 1, y0, s - 2, s - 2, { fill, stroke: col.line, width: 1, r: 3 });
      text(ctx, String(d), x + s / 2, y0 + s / 2 - 1, { color: col.ink, size: 10.5, weight: i < 0 ? 400 : 700, align: 'center', fit: false });
      if (i >= 0 && step >= 1 && step < 4) {
        ctx.save(); ctx.globalAlpha = step === 1 ? a : 1;
        text(ctx, String(i + 1), x + s / 2, y0 + s + 16, { color: col.ink, size: 11, align: 'center', fit: false }); ctx.restore();
      }
      if (i >= 0 && step >= 2 && step < 4) {
        ctx.save(); ctx.globalAlpha = step === 2 ? a : 1;
        text(ctx, String(GRP[i]), x + s / 2, y0 + s + 40, { color: col.ink, size: 11, weight: 700, align: 'center', fit: false }); ctx.restore();
      }
    }
    if (step >= 1 && step < 4) text(ctx, 'rn', 8, y0 + s + 16, { color: col.muted, size: 10, fit: false });
    if (step >= 2 && step < 4) text(ctx, 'day−rn', 8, y0 + s + 40, { color: col.muted, size: 10, fit: false });
    if (step === 3) {
      [[3, 5, 0], [9, 10, 1], [13, 13, 2]].forEach(([d0, d1, c]) => {
        const x0 = 8 + (d0 - 1) * s, x1 = 8 + d1 * s;
        box(ctx, x0, y0 - 3, x1 - x0, s + 4, { stroke: col.s[c], width: 2.5, r: 4, alpha: a });
      });
    }
    if (step === 4) {
      const W = Math.min(w - 16, 300);
      grid(ctx, 8, y0 + s + 14, [{ w: W * 0.2, label: 'grp' }, { w: W * 0.28, label: 'gap_start' }, { w: W * 0.28, label: 'gap_end' }, { w: W * 0.24, label: 'days' }],
        [[2, 3, 5, 3], [5, 9, 10, 2], [7, 13, 13, 1]], col, { rh: 20, hi: (i) => col.s[i] + '33', alpha: () => a });
    }
    wrap(ctx, NOTE[step], 8, h - 34, w - 16, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
