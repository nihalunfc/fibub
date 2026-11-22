// Filter context, step by step: pick a Store and a Category on the slicers and watch the Sales rows that survive. A measure
// such as SUM(Sales[Amount]) only ever adds up the rows left by every filter at once (they combine with AND). Use the step
// buttons for the tour, then try the slicers yourself. Rows are made up.
import { canvas, text, title, row, choice, readout, arrow } from '../kit.js';
import { SALES, table, chip, money } from './_biz.js';

const STORES = ['Rideau', 'Queen', 'Forks'], CATS = ['Home', 'Outdoor'];
export default function (host) {
  let store = null, cat = null, phase = 0;
  const cv = canvas(host, { aspect: 1.22, max: 470, min: 400, label: 'Slicers filtering the rows of a Sales table' });
  const ctl = row(host), bs = document.createElement('div'), bc = document.createElement('div');
  ctl.append(bs, bc);
  const mk = () => {
    bs.innerHTML = ''; bc.innerHTML = '';
    choice(bs, 'Store', [[null, 'All'], ...STORES.map((s) => [s, s])], store, (v) => { store = v; phase = 3; cv.redraw(); show(); });
    choice(bc, 'Category', [[null, 'All'], ...CATS.map((s) => [s, s])], cat, (v) => { cat = v; phase = 3; cv.redraw(); show(); });
  };
  const out = readout(host);
  const keep = (r) => (!store || r.store === store) && (!cat || r.cat === cat);
  const show = () => {
    const k = SALES.filter(keep), sum = k.reduce((a, r) => a + r.amt, 0);
    out.innerHTML = `<b>${k.length} of 9 rows</b> pass ${store || cat ? [store && 'Store = ' + store, cat && 'Category = ' + cat].filter(Boolean).join(' AND ') : 'no filter'}. Total Sales = SUM(Sales[Amount]) = <b>${k.length ? k.map((r) => r.amt).join(' + ') + ' = ' : ''}${money(sum)}</b>.`;
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Slicers filter the Sales table', col);
    let x = 10; const y1 = 34, y2 = 62;
    text(ctx, 'Store', x, y1 + 10, { color: col.muted, size: 10, weight: 700, fit: false }); x = 56;
    STORES.forEach((s) => { x += chip(ctx, col, s, x, y1, { on: store === s }) + 6; });
    x = 10; text(ctx, 'Category', x, y2 + 10, { color: col.muted, size: 10, weight: 700, fit: false }); x = 70;
    CATS.forEach((s) => { x += chip(ctx, col, s, x, y2, { on: cat === s }) + 6; });
    arrow(ctx, w / 2, 90, w / 2, 106, col.s[1], 2, 7);
    text(ctx, 'filters travel along the relationships to Sales', w / 2 + 14, 98, { color: col.s[1], size: 10, weight: 600, fit: false });
    const end = table(ctx, col, 8, 110, w - 16, [
      { label: 'Month', w: 0.16, f: (r) => r.m }, { label: 'Store', w: 0.22, f: (r) => r.store }, { label: 'Category', w: 0.24, f: (r) => r.cat },
      { label: 'Qty', w: 0.12, align: 'right', f: (r) => r.qty }, { label: 'Amount', w: 0.26, align: 'right', f: (r) => '$' + r.amt }], SALES, { rowH: 20, style: (r) => (keep(r) ? (phase === 3 && (store || cat) ? 'on' : '') : 'off') });
    const k = SALES.filter(keep), sum = k.reduce((a, r) => a + r.amt, 0);
    ctx.fillStyle = col.soft; ctx.fillRect(8, end + 8, w - 16, 40);
    text(ctx, 'Total Sales = SUM ( Sales[Amount] )', 16, end + 20, { color: col.muted, size: 11 });
    text(ctx, money(sum), w - 16, end + 31, { color: col.s[0], size: 18, weight: 800, align: 'right' });
  };
  mk(); show(); cv.redraw();
  return { step(i) {
    phase = Math.min(3, i);
    store = i >= 1 ? 'Rideau' : null; cat = i >= 2 ? 'Home' : null;
    mk(); show(); cv.redraw();
  } };
}
