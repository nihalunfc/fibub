// Normalisation as a step player: one messy orders sheet is split into clean tables. Step 0 is the sheet (a cell holds a
// list, customer and product details repeat). 1NF: one value per cell. 2NF: details that depend on only part of the key
// move out. 3NF: details that depend on a non-key column move out. The readout counts the repeated facts that disappear.
import { canvas, text, row, readout, title } from '../kit.js';
import { tbl, stepper } from './_data.js';

const NAMES = ['One messy sheet', '1NF: one value per cell', '2NF: no partial dependencies', '3NF: no hops through a non-key'];
export default function (host, opts) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 470, min: 380, label: 'A messy orders table split into normalised tables' });
  const st = stepper(host, opts, NAMES, (i) => { s = i; draw(); });
  const out = readout(host);
  const T = [
    [{ n: 'orders_sheet', h: ['order', 'customer', 'city', 'items'], r: [[1, 'Asha', 'Pune', 'pen, book'], [2, 'Asha', 'Pune', 'lamp'], [3, 'Ben', 'Delhi', 'pen']], note: 'items holds a list; Asha and Pune repeat' }],
    [{ n: 'order_lines (1NF)', h: ['order', 'item', 'customer', 'city', 'price'], r: [[1, 'pen', 'Asha', 'Pune', 3], [1, 'book', 'Asha', 'Pune', 12], [2, 'lamp', 'Asha', 'Pune', 20], [3, 'pen', 'Ben', 'Delhi', 3]], note: 'key = (order, item); price repeats for every pen' }],
    [{ n: 'order_lines', h: ['order', 'item'], r: [[1, 'pen'], [1, 'book'], [2, 'lamp'], [3, 'pen']], note: 'key only' }, { n: 'products', h: ['item', 'price'], r: [['pen', 3], ['book', 12], ['lamp', 20]], note: 'price depends on item alone' }, { n: 'orders', h: ['order', 'customer', 'city'], r: [[1, 'Asha', 'Pune'], [2, 'Asha', 'Pune'], [3, 'Ben', 'Delhi']], note: 'customer depends on order alone' }],
    [{ n: 'order_lines', h: ['order', 'item'], r: [[1, 'pen'], [1, 'book'], [2, 'lamp'], [3, 'pen']] }, { n: 'products', h: ['item', 'price'], r: [['pen', 3], ['book', 12], ['lamp', 20]] }, { n: 'orders', h: ['order', 'cust_id'], r: [[1, 'C1'], [2, 'C1'], [3, 'C2']] }, { n: 'customers', h: ['cust_id', 'name', 'city'], r: [['C1', 'Asha', 'Pune'], ['C2', 'Ben', 'Delhi']], note: 'city depends on the customer, not the order' }],
  ];
  const facts = [['Asha-in-Pune repeated 2 times, a list in one cell', 'No list cells, but Asha-in-Pune and the pen price are repeated'], ['Price now stored once per product; Asha still repeated per order', ''], ['Each fact lives in exactly one place: change Asha\'s city once', '']];
  function draw() { out.innerHTML = `<b>${NAMES[s]}.</b> ${['Updating Asha\'s city means editing several rows, and the list cell cannot be filtered or joined.', 'Every cell is a single value, so you can filter by item. But Asha, Pune and the pen price still repeat, so an edit can leave them inconsistent.', 'Price is stored once per product. Customer details still repeat for each of Asha\'s orders.', 'Every fact is stored once. Changing Asha\'s city is one edit. Cost: more joins to read it back, which is why reporting tables are often denormalised again.'][s]}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[s], col);
    let y = 38; const tabs = T[s], two = tabs.length > 1 && w > 330;
    tabs.forEach((t, i) => {
      const cw = t.h.map(() => (w - 24) / t.h.length / (tabs.length > 2 && i % 2 === 1 ? 1 : 1) * (t.h.length > 4 ? 1 : 1));
      const colW = Math.min(76, (w - 20) / t.h.length);
      text(ctx, t.n, 10, y + 6, { color: col.s[i % 4], size: 11.5, weight: 700 });
      const yy = tbl(ctx, col, 10, y + 14, t.h, t.r, t.h.map(() => colW), { rh: 16, size: 10.5 });
      if (t.note) text(ctx, t.note, 10, yy + 9, { color: col.muted, size: 10 });
      y = yy + (t.note ? 20 : 12);
    });
  };
  st.set(0); draw();
  return { step(i) { st.set(i); } };
}
