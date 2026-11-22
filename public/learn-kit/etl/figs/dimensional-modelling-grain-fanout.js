// 5.1 Watch it happen: fan-out. Three order lines ($19) are left-joined to a promotions table whose grain is
// one row per item per promotion. The burger has two promotions, so its line is repeated and revenue becomes
// $29. The fix collapses promotions to one row per item before the join, and the total is $19 again.
import { canvas, text, title, arrow, calm, ease, loop } from '../../kit.js';
import { grid, wrap } from './c-draw.js';

const LINES = [['L1', 'Burger', '$10'], ['L2', 'Fries', '$4'], ['L3', 'Shake', '$5']];
const PROMOS = [['Burger', 'Combo'], ['Burger', 'App 10%'], ['Fries', 'Combo']];
const JOINED = [['L1', 'Burger', '$10', 'Combo'], ['L1', 'Burger', '$10', 'App 10%'], ['L2', 'Fries', '$4', 'Combo'], ['L3', 'Shake', '$5', '(none)']];
const FIXED = [['L1', 'Burger', '$10', '2 promos'], ['L2', 'Fries', '$4', '1 promo'], ['L3', 'Shake', '$5', '0 promos']];
const NOTE = [
  'Grain of the fact: one row per order line. Three lines, $19 of revenue.',
  'Grain of promotions: one row per item per promotion. The burger has two rows.',
  'Join on item: the burger line finds two matches, so it comes out twice.',
  'Four rows now. SUM(revenue) says $29: $10 of sales that never happened.',
  'Fix: collapse promotions to one row per item first. Three rows, $19 again.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 1, max: 390, min: 350, label: 'Order lines joined to a promotions table, showing rows being duplicated' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Fan-out: a join at a finer grain', col);
    const half = (w - 24) / 2, a = ease(k);
    text(ctx, 'fct_order_lines', 8, 40, { color: col.muted, size: 10.5, weight: 700 });
    grid(ctx, 8, 50, [{ w: half * 0.28, label: 'line' }, { w: half * 0.4, label: 'item' }, { w: half * 0.32, label: 'rev' }], LINES, col, { rh: 19 });
    const px = 16 + half;
    text(ctx, 'promotions', px, 40, { color: col.muted, size: 10.5, weight: 700 });
    ctx.save(); ctx.globalAlpha = step === 0 ? 0.35 : 1;
    grid(ctx, px, 50, [{ w: half * 0.45, label: 'item' }, { w: half * 0.55, label: 'promo' }], step === 4 ? [['Burger', 'Combo, App'], ['Fries', 'Combo']] : PROMOS, col,
      { rh: 19, hi: (i) => (step === 1 && i < 2) || (step === 4 && i === 0) ? col.s[1] + '33' : null });
    ctx.restore();
    if (step >= 2) {
      arrow(ctx, w / 2, 132, w / 2, 152, col.muted, 1.5, 7);
      const rows = step === 4 ? FIXED : step === 2 ? JOINED.slice(0, 2) : JOINED;
      text(ctx, step === 4 ? 'joined (fixed)' : 'joined', 8, 160, { color: col.muted, size: 10.5, weight: 700 });
      const W = w - 16;
      const end = grid(ctx, 8, 170, [{ w: W * 0.16, label: 'line' }, { w: W * 0.26, label: 'item' }, { w: W * 0.18, label: 'rev' }, { w: W * 0.4, label: 'promo' }], rows, col,
        { rh: 19, hi: (i) => (step < 4 && i < 2 ? col.s[1] + '33' : null), alpha: (i) => (step === 3 && i >= 2 ? a : 1) });
      if (step >= 3) {
        const bad = step === 3;
        text(ctx, `SUM(rev) = ${bad ? '$29' : '$19'}   rows = ${rows.length}`, 8, end + 14, { color: bad ? col.bad || col.s[1] : col.good || col.s[2], size: 12.5, weight: 700, halo: col.panel });
      }
    } else {
      text(ctx, 'SUM(rev) = $19   rows = 3', 8, 150, { color: col.ink, size: 12.5, weight: 700 });
    }
    wrap(ctx, NOTE[step], 8, h - 34, w - 16, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
