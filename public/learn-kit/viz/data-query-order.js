// The order SQL really runs a query in: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. The table on the
// canvas is what exists after the highlighted clause. Try: move the sliders, and notice WHERE cuts rows before
// GROUP BY, HAVING cuts groups after it, and the alias "total" is only known from SELECT onwards.
import { canvas, text, row, slider, readout, title } from '../kit.js';
import { tbl, stepper } from './_data.js';

const D = [['East', 30], ['West', 12], ['North', 25], ['East', 18], ['West', 40], ['East', 9], ['North', 33], ['West', 21], ['North', 14], ['East', 22], ['South', 8], ['South', 5]];
const NAMES = ['FROM orders', 'WHERE amount >= {w}', 'GROUP BY region', 'HAVING SUM(amount) > {h}', 'SELECT region, SUM(amount) AS total', 'ORDER BY total DESC', 'LIMIT {n}'];
export default function (host, opts) {
  let s = 0, w = 10, hv = 40, lim = 2;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 300, label: 'The table after each clause of a SQL query, in running order' });
  const ctl = row(host);
  slider(ctl, { label: 'w (WHERE)', min: 0, max: 30, step: 1, value: w, fmt: (v) => String(Math.round(v)), oninput: (v) => { w = Math.round(v); draw(); } });
  slider(ctl, { label: 'h (HAVING)', min: 0, max: 100, step: 1, value: hv, fmt: (v) => String(Math.round(v)), oninput: (v) => { hv = Math.round(v); draw(); } });
  slider(ctl, { label: 'n (LIMIT)', min: 1, max: 4, step: 1, value: lim, fmt: (v) => String(Math.round(v)), oninput: (v) => { lim = Math.round(v); draw(); } });
  const st = stepper(host, opts, NAMES.map((n) => n.split(' ')[0] + (n.startsWith('GROUP') ? ' BY' : n.startsWith('ORDER') ? ' BY' : '')), (i) => { s = i; draw(); });
  const out = readout(host);
  function states() {
    const f = D, wh = f.filter((r) => r[1] >= w), g = {}; wh.forEach((r) => (g[r[0]] = (g[r[0]] || []).concat(r[1])));
    const gr = Object.entries(g).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0), v.length]);
    const hav = gr.filter((r) => r[1] > hv), sel = hav.map((r) => [r[0], r[1]]), ord = sel.slice().sort((a, b) => b[1] - a[1]), lm = ord.slice(0, lim);
    return [
      { h: ['region', 'amount'], r: f, n: `${f.length} rows` },
      { h: ['region', 'amount'], r: wh, n: `${wh.length} rows (${f.length - wh.length} dropped)` },
      { h: ['region', 'SUM', 'rows'], r: gr, n: `${gr.length} groups` },
      { h: ['region', 'SUM', 'rows'], r: hav, n: `${hav.length} groups (${gr.length - hav.length} dropped)` },
      { h: ['region', 'total'], r: sel, n: `${sel.length} rows, column named total` },
      { h: ['region', 'total'], r: ord, n: 'sorted, biggest first' },
      { h: ['region', 'total'], r: lm, n: `first ${lim} rows` },
    ];
  }
  function draw() { const S = states()[s]; out.innerHTML = `<b>After ${NAMES[s].replace('{w}', w).replace('{h}', hv).replace('{n}', lim)}:</b> ${S.n}. WHERE cannot see <code>total</code> (not made yet); HAVING can use SUM because groups exist by then.`; cv.redraw(); }
  cv.draw = (ctx, w2, h, col) => {
    title(ctx, 'The query, in running order', col);
    NAMES.forEach((n, i) => {
      const t = n.replace('{w}', w).replace('{h}', hv).replace('{n}', lim);
      ctx.globalAlpha = i === s ? 1 : i < s ? 0.55 : 0.35;
      if (i === s) { ctx.fillStyle = col.soft; ctx.fillRect(6, 34 + i * 16, w2 - 12, 16); }
      text(ctx, `${i + 1}. ${t}`, 12, 42 + i * 16, { color: i === s ? col.s[0] : col.ink, size: 11, weight: i === s ? 700 : 400 });
    });
    ctx.globalAlpha = 1;
    const S = states()[s], cw = S.h.map((_, i) => (i === 0 ? 70 : 60));
    text(ctx, S.n, 10, 34 + 7 * 16 + 16, { color: col.muted, size: 11 });
    const rows = S.r.slice(0, 12).map((r) => r.slice());
    if (rows.length) tbl(ctx, col, 10, 34 + 7 * 16 + 26, S.h, rows, cw, { rh: 15, size: 10.5 }); else text(ctx, 'no rows left: loosen a slider', 10, 34 + 7 * 16 + 40, { color: col.bad, size: 12 });
  };
  st.set(0); draw();
  return { step(i) { st.set(i); } };
}
