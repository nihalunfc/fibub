// SQL joins row by row: pick INNER, LEFT, RIGHT or FULL and watch the result table being built. Each customer is
// matched against the orders; customers with no order and orders with no customer show up (or not) with NULL.
// Try: switch the join type with the slider on the same step and see which rows appear, and which NULLs.
import { canvas, text, row, choice, readout, loop, button, slider, title } from '../kit.js';
import { tbl } from './_data.js';

const L = [[1, 'Asha'], [2, 'Ben'], [3, 'Chloe'], [4, 'Dev']], R = [[1, 'Book'], [1, 'Pen'], [3, 'Lamp'], [5, 'Mug']];
function events(type) {
  const ev = [];
  const keepL = type === 'LEFT' || type === 'FULL', keepR = type === 'RIGHT' || type === 'FULL';
  L.forEach((l, li) => {
    const m = R.map((r, ri) => [r, ri]).filter(([r]) => r[0] === l[0]);
    if (m.length) m.forEach(([r, ri]) => ev.push({ li, ri, out: [l[0], l[1], r[1]] }));
    else if (keepL) ev.push({ li, ri: -1, out: [l[0], l[1], 'NULL'] });
    else ev.push({ li, ri: -1, out: null });
  });
  R.forEach((r, ri) => { if (!L.some((l) => l[0] === r[0])) ev.push({ li: -1, ri, out: keepR ? ['NULL', 'NULL', r[1]] : null }); });
  return ev;
}
export default function (host) {
  let type = 'INNER', k = 0, play = false;
  const cv = canvas(host, { aspect: 0.86, max: 400, min: 330, label: 'Customers and orders tables with the join result being built' });
  const c1 = row(host); choice(c1, 'Join', ['INNER', 'LEFT', 'RIGHT', 'FULL'].map((v) => [v, v]), type, (v) => { type = v; k = 0; sl.set(0); draw(); });
  const c2 = row(host);
  const sl = slider(c2, { label: 'Rows built', min: 0, max: 8, step: 1, value: 0, fmt: (v) => String(Math.round(v)), oninput: (v) => { k = Math.round(v); draw(); } });
  const anim = loop(host, (dt, t) => { if (t - (anim.lt || 0) > 0.9) { anim.lt = t; const n = events(type).length; k = k >= n ? 0 : k + 1; sl.set(k); draw(); } }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  function draw() { cv.redraw(); const ev = events(type), res = ev.slice(0, k).filter((e) => e.out); const nulls = res.filter((e) => e.out.includes('NULL')).length;
    out.innerHTML = `<b>${type} JOIN</b> ON customers.id = orders.cust_id: <b>${res.length}</b> result rows so far, <b>${nulls}</b> with NULL. ${{ INNER: 'Only matching pairs survive.', LEFT: 'Every customer stays; no order means NULL.', RIGHT: 'Every order stays; no customer means NULL.', FULL: 'Everything stays; NULL on whichever side has no partner.' }[type]}`; }
  cv.draw = (ctx, w, h, col) => {
    const ev = events(type), cur = ev[Math.max(0, k - 1)], shown = k ? cur : null;
    title(ctx, `${type} JOIN: customers with orders`, col);
    const half = (w - 30) / 2, cw = [30, half - 30];
    text(ctx, 'customers (left)', 10, 40, { color: col.muted, size: 11 });
    text(ctx, 'orders (right)', 20 + half, 40, { color: col.muted, size: 11 });
    tbl(ctx, col, 10, 48, ['id', 'name'], L.map((r, i) => ({ c: r, bg: shown && shown.li === i ? col.soft : null, cc: shown && shown.li === i ? [col.s[0], col.s[0]] : null })), cw);
    tbl(ctx, col, 20 + half, 48, ['cust_id', 'item'], R.map((r, i) => ({ c: r, bg: shown && shown.ri === i ? col.soft : null })), [half * 0.45, half * 0.55]);
    const y0 = 48 + 17 * 5 + 22;
    text(ctx, 'result', 10, y0 - 8, { color: col.muted, size: 11 });
    const rw = [w * 0.16, w * 0.3, w * 0.3, w * 0.2];
    const res = ev.slice(0, k).map((e, i) => e.out ? { c: [e.out[0], e.out[1], e.out[2]], bg: i === k - 1 ? col.soft : null, cc: e.out.map((s) => (s === 'NULL' ? col.bad : col.ink)) } : null).filter(Boolean);
    tbl(ctx, col, 10, y0, ['id', 'name', 'item'], res, rw.slice(0, 3));
    ev.slice(0, k).filter((e) => !e.out).length && text(ctx, 'dropped: no partner (INNER)', 10, y0 + 17 * (res.length + 1) + 14, { color: col.muted, size: 11 });
  };
  draw();
}
