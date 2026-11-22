// Slowly changing dimensions: customer Asha moves from Pune to Delhi on 1 July. Choose how the dimension handles it.
// Type 1 overwrites (history is lost, last year's sales move to Delhi), Type 2 adds a new row with dates (history is
// kept), Type 3 keeps one "previous city" column. The report below shows sales by city each way. Sales are made up.
import { canvas, text, row, choice, readout, title } from '../kit.js';
import { tbl } from './_data.js';

const SALES = [['Mar', 100], ['May', 150], ['Aug', 200], ['Oct', 50]];
export default function (host) {
  let t = '2';
  const cv = canvas(host, { aspect: 1.0, max: 470, min: 360, label: 'A customer dimension handling a change of city in three ways, and the sales by city report' });
  const c1 = row(host); choice(c1, 'Method', [['1', 'Type 1: overwrite'], ['2', 'Type 2: new row'], ['3', 'Type 3: old column']], t, (v) => { t = v; draw(); });
  const out = readout(host);
  const city = (m, ver) => (t === '1' ? 'Delhi' : ['Mar', 'May'].includes(m) ? 'Pune' : 'Delhi');
  const rep = () => { const o = {}; SALES.forEach(([m, v]) => { const c = t === '3' ? 'Delhi' : city(m); o[c] = (o[c] || 0) + v; }); return o; };
  function draw() { const r = rep(); out.innerHTML = { 1: `<b>Type 1:</b> simple, but the Mar and May sales (250) now say Delhi. Pune shows ${r.Pune || 0}. History is rewritten.`, 2: `<b>Type 2:</b> Mar and May sales still join to the Pune row (${r.Pune}), Aug and Oct to the Delhi row (${r.Delhi}). History is right; the dimension grows and facts must carry the right surrogate key.`, 3: `<b>Type 3:</b> only one step of history in a column. Reports by current city put everything in Delhi (${r.Delhi}); the old city is a side attribute, and a second move would lose Pune.` }[t]; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Asha moves from Pune to Delhi on 1 July', col);
    text(ctx, 'customer dimension', 10, 42, { color: col.muted, size: 11 });
    let y;
    const W = (a) => a.map((x) => x * (w - 20));
    if (t === '1') y = tbl(ctx, col, 10, 50, ['key', 'name', 'city'], [{ c: ['C1', 'Asha', 'Delhi'], bg: col.soft }], W([0.2, 0.4, 0.4]), { rh: 20, size: 11.5 });
    else if (t === '2') y = tbl(ctx, col, 10, 50, ['sk', 'name', 'city', 'from', 'to'], [{ c: [1, 'Asha', 'Pune', 'Jan', 'Jun'] }, { c: [2, 'Asha', 'Delhi', 'Jul', 'now'], bg: col.soft }], W([0.12, 0.22, 0.24, 0.21, 0.21]), { rh: 20, size: 11.5 });
    else y = tbl(ctx, col, 10, 50, ['key', 'name', 'city', 'prev city'], [{ c: ['C1', 'Asha', 'Delhi', 'Pune'], bg: col.soft }], W([0.15, 0.25, 0.28, 0.32]), { rh: 20, size: 11.5 });
    text(ctx, 'fact table: sales (made up)', 10, y + 18, { color: col.muted, size: 11 });
    const rows = SALES.map(([m, v]) => { const sk = t === '2' ? (['Mar', 'May'].includes(m) ? 1 : 2) : 'C1'; return { c: [m, v, sk, t === '3' ? 'Delhi' : city(m)] }; });
    const y2 = tbl(ctx, col, 10, y + 26, ['month', 'sales', t === '2' ? 'cust sk' : 'cust key', 'city shown'], rows, W([0.2, 0.2, 0.25, 0.35]), { rh: 18, size: 11 });
    const r = rep(); text(ctx, 'sales by city report', 10, y2 + 18, { color: col.muted, size: 11 });
    const mx = 400; Object.entries(r).forEach(([c, v], i) => { const yy = y2 + 28 + i * 22; ctx.fillStyle = col.s[i]; ctx.fillRect(70, yy, ((w - 130) * v) / mx, 16); text(ctx, c, 10, yy + 8, { color: col.ink, size: 11.5, fit: false }); text(ctx, String(v), 74 + ((w - 130) * v) / mx, yy + 8, { color: col.ink, size: 11.5, weight: 700, fit: false }); });
  };
  draw();
}
