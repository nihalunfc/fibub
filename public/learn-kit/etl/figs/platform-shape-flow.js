// 1.1 Watch it happen: one store's sales line travels from the source email through raw, staging and the
// mart to a dashboard tile. Each step lights one stage and shows what the same fact looks like there.
import { canvas, text, title, arrow, calm, ease, loop } from '../../kit.js';
import { labelBox, box } from './a-draw.js';

const STAGES = ['Source', 'Raw', 'Staging', 'Mart', 'Dashboard'];
const CARDS = [
  ['Email 06:12, attachment sales_R104.csv', 'R104,14/09/2026,"1,234.50"'],
  ['raw/retail_email/business_date=2026-09-14/', 'R104__a3f91c2e.csv  (exact copy + hash)'],
  ['stg_sales: typed, trimmed, deduplicated', 'store=R104  date=2026-09-14  sales=1234.50'],
  ['fct_sales joined to dim_store, dim_date', 'R104 · London (Ont.) · Mon 14 Sep · $1,234.50'],
  ['Store sales tile, data as of 07:40', 'R104  $1,234.50  ▲ 3% vs last Monday'],
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'One sales line moving from source to raw, staging, mart and dashboard' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.5); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The same fact at each stage', col);
    const gap = 8, bw = (w - 16 - gap * 4) / 5, bh = 40, y = 44;
    STAGES.forEach((s, i) => {
      const on = i === step, done = i < step;
      labelBox(ctx, 8 + i * (bw + gap), y, bw, bh, s, {
        fill: on ? col.s[0] : done ? col.soft : col.panel, stroke: on ? col.s[0] : col.line,
        color: on ? '#fff' : done ? col.ink : col.muted, size: bw < 62 ? 9.5 : 11.5, alpha: on ? 0.4 + 0.6 * ease(k) : 1,
      });
      if (i < 4) arrow(ctx, 8 + i * (bw + gap) + bw + 1, y + bh / 2, 8 + (i + 1) * (bw + gap) - 1, y + bh / 2, done || on ? col.ink : col.line, 1.5, 5);
    });
    const cx = 8 + step * (bw + gap) + bw / 2;
    arrow(ctx, cx, y + bh + 4, cx, y + bh + 22, col.s[0], 2, 7);
    const cy = y + bh + 26, ch = h - cy - 16;
    box(ctx, 8, cy, w - 16, ch, { fill: col.soft, stroke: col.line });
    text(ctx, CARDS[step][0], 18, cy + ch * 0.33, { color: col.muted, size: 11.5 });
    text(ctx, CARDS[step][1], 18, cy + ch * 0.68, { color: col.ink, size: 13, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
