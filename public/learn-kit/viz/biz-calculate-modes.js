// What CALCULATE does to a filter. Choose slicers (they set the starting filter context), then choose how the measure is
// written. A plain measure obeys the slicers; CALCULATE with a column filter REPLACES the slicer on that column; KEEPFILTERS
// keeps both (an AND); ALL removes the filter. Watch which rows are counted and what the total becomes.
import { canvas, text, title, row, choice, readout } from '../kit.js';
import { SALES, table, money } from './_biz.js';

const MODES = {
  plain: { f: 'Total Sales', fx: 'SUM ( Sales[Amount] )', cat: (c) => c, why: 'No CALCULATE: the measure just obeys every slicer.' },
  over: { f: 'Home Sales', fx: 'CALCULATE ( [Total Sales], Sales[Category] = "Home" )', cat: () => 'Home', why: 'CALCULATE replaces any filter on Category with "Home". The Store slicer still applies. A Category slicer set to Outdoor is overridden.' },
  keep: { f: 'Home Sales (kept)', fx: 'CALCULATE ( [Total Sales], KEEPFILTERS ( Sales[Category] = "Home" ) )', cat: (c) => (c === null || c === 'Home' ? 'Home' : '__none'), why: 'KEEPFILTERS adds "Home" on top of the slicer instead of replacing it: Category must be Home AND whatever the slicer says. Slicer = Outdoor leaves nothing.' },
  all: { f: 'All-category Sales', fx: 'CALCULATE ( [Total Sales], ALL ( Sales[Category] ) )', cat: () => null, why: 'ALL removes the Category filter completely, so every category counts. The Store slicer still applies.' },
};
export default function (host) {
  let store = null, cat = null, mode = 'plain';
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 350, label: 'Which Sales rows a CALCULATE version counts' });
  const ctl = row(host);
  choice(ctl, 'Store slicer', [[null, 'All'], ['Rideau', 'Rideau'], ['Queen', 'Queen']], store, (v) => { store = v; cv.redraw(); show(); });
  choice(ctl, 'Category slicer', [[null, 'All'], ['Home', 'Home'], ['Outdoor', 'Outdoor']], cat, (v) => { cat = v; cv.redraw(); show(); });
  choice(ctl, 'Measure', [['plain', 'Plain'], ['over', 'CALCULATE (Home)'], ['keep', '+ KEEPFILTERS'], ['all', 'ALL (Category)']], mode, (v) => { mode = v; cv.redraw(); show(); });
  const out = readout(host);
  const kept = (r) => { const c = MODES[mode].cat(cat); return (!store || r.store === store) && (c === null || r.cat === c); };
  const sum = () => SALES.filter(kept).reduce((a, r) => a + r.amt, 0);
  function show() { out.innerHTML = `${MODES[mode].why} <b>${SALES.filter(kept).length} rows</b> counted, result <b>${money(sum())}</b>.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `[${MODES[mode].f}] under your slicers`, col);
    text(ctx, `Slicers: Store = ${store || 'all'}, Category = ${cat || 'all'}`, 10, 40, { color: col.muted, size: 11 });
    const end = table(ctx, col, 8, 50, w - 16, [{ label: 'Month', w: 0.18, f: (r) => r.m }, { label: 'Store', w: 0.25, f: (r) => r.store }, { label: 'Category', w: 0.3, f: (r) => r.cat }, { label: 'Amount', w: 0.27, align: 'right', f: (r) => '$' + r.amt }], SALES, { rowH: 20, style: (r) => (kept(r) ? 'on' : 'off') });
    ctx.fillStyle = col.soft; ctx.fillRect(8, end + 6, w - 16, 52);
    text(ctx, MODES[mode].fx, 14, end + 20, { color: col.muted, size: 10.5 });
    text(ctx, sum() ? money(sum()) : '(blank)', w - 14, end + 42, { color: col.s[0], size: 18, weight: 800, align: 'right' });
  };
  show(); cv.redraw();
}
