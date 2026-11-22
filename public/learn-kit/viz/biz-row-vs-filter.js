// Row context vs filter context. "Calculated column" mode visits the rows one at a time (Play) and stores a Profit value in
// each row. "Measure" mode computes one number when the report asks, from whichever rows the slicer leaves. Same arithmetic,
// two different contexts. Profit = Qty × (Price − Cost); rows are made up.
import { canvas, text, title, row, choice, readout, loop, button } from '../kit.js';
import { SALES, table, chip, money } from './_biz.js';

export default function (host) {
  let mode = 'col', pos = 0, store = null;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 340, label: 'Profit worked out row by row or for the filtered rows' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Make it a', [['col', 'Calculated column'], ['meas', 'Measure']], mode, (v) => { mode = v; pos = 0; sync(); cv.redraw(); show(); });
  const sl = document.createElement('div'); c2.appendChild(sl);
  const anim = loop(host, (dt) => { if (mode === 'col') { pos = Math.min(SALES.length, pos + dt * 2.2); cv.redraw(); show(); } }, { autoplay: false });
  const btn = anim.button(ctl); button(ctl, 'Restart', () => { pos = 0; if (mode === 'col') anim.play(); cv.redraw(); show(); });
  const out = readout(host);
  const prof = (r) => r.qty * (r.price - r.cost);
  function sync() { sl.innerHTML = ''; if (mode === 'meas') choice(sl, 'Slicer: Store', [[null, 'All'], ['Rideau', 'Rideau'], ['Queen', 'Queen'], ['Forks', 'Forks']], store, (v) => { store = v; cv.redraw(); show(); }); }
  function show() {
    if (mode === 'col') { const n = Math.floor(pos); out.innerHTML = `<b>Row context:</b> the formula runs once for every row and can only see that row (Qty × (Price − Cost)). ${n >= 9 ? 'Nine rows, nine stored values; nothing about a slicer.' : `Rows done: ${n} of 9. The result is saved in the table when you refresh.`}`; }
    else { const k = SALES.filter((r) => !store || r.store === store); out.innerHTML = `<b>Filter context:</b> nothing is stored per row. When the card is drawn the slicer (${store || 'none'}) leaves ${k.length} rows, and the measure adds their profit: <b>${money(k.reduce((a, r) => a + prof(r), 0))}</b>.`; }
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'col' ? 'Calculated column: one row at a time' : 'Measure: whatever the filters leave', col);
    const cur = Math.floor(pos);
    const end = table(ctx, col, 8, 38, w - 16, [
      { label: 'Store', w: 0.2, f: (r) => r.store }, { label: 'Qty', w: 0.1, align: 'right', f: (r) => r.qty }, { label: 'Price', w: 0.15, align: 'right', f: (r) => '$' + r.price },
      { label: 'Cost', w: 0.15, align: 'right', f: (r) => '$' + r.cost }, { label: 'Profit', w: 0.4, align: 'right', f: (r) => (mode === 'col' ? (r.id - 1 < cur ? '$' + prof(r) : r.id - 1 === cur && pos < 9 ? '…' : '') : '') }],
      SALES, { rowH: 20, style: (r) => (mode === 'col' ? (r.id - 1 === cur && pos < 9 ? 'on' : '') : (!store || r.store === store ? 'on' : 'off')) });
    if (mode === 'col') {
      const k = Math.min(cur, 8);
      if (pos < 9) text(ctx, '→ this row only', w - 8, 38 + 20 + k * 20 + 10 - 20, { color: col.s[1], size: 10, weight: 700, align: 'right', fit: false, halo: col.panel });
      text(ctx, 'Profit = [Qty] * ([Price] - [Cost])', 10, end + 18, { color: col.muted, size: 11 });
    } else {
      const k = SALES.filter((r) => !store || r.store === store);
      ctx.fillStyle = col.soft; ctx.fillRect(8, end + 6, w - 16, 44);
      text(ctx, 'Profit = SUMX ( Sales, Qty * ( Price - Cost ) )', 16, end + 20, { color: col.muted, size: 11 });
      text(ctx, money(k.reduce((a, r) => a + prof(r), 0)), w - 16, end + 36, { color: col.s[0], size: 18, weight: 800, align: 'right' });
    }
  };
  sync(); show(); cv.redraw();
}
