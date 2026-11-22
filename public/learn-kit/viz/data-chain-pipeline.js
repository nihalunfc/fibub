// A pandas method chain, one link at a time: query, assign, groupby, sort_values, head. The table is what the DataFrame
// looks like after the highlighted link, with its shape (rows x columns). Try: step through and watch the row count
// fall at query, a column appear at assign, and many rows collapse into few at groupby.
import { canvas, text, row, slider, readout, title } from '../kit.js';
import { tbl, stepper } from './_data.js';

const D = [['East', 'Pen', 4, 3], ['West', 'Book', 1, 12], ['East', 'Lamp', 2, 20], ['North', 'Pen', 6, 3], ['West', 'Lamp', 3, 20], ['East', 'Book', 1, 12], ['North', 'Book', 5, 12], ['West', 'Pen', 2, 3]];
const LINKS = ['df', '.query("units >= {u}")', '.assign(revenue=lambda d: d.units * d.price)', '.groupby("region", as_index=False)["revenue"].sum()', '.sort_values("revenue", ascending=False)', '.head({n})'];
export default function (host, opts) {
  let s = 0, u = 2, n = 2;
  const cv = canvas(host, { aspect: 0.85, max: 420, min: 330, label: 'The DataFrame after each link of a method chain' });
  const c1 = row(host);
  slider(c1, { label: 'min units', min: 1, max: 5, step: 1, value: u, fmt: (v) => String(Math.round(v)), oninput: (v) => { u = Math.round(v); draw(); } });
  slider(c1, { label: 'head(n)', min: 1, max: 3, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); draw(); } });
  const st = stepper(host, opts, ['raw', 'query', 'assign', 'groupby', 'sort', 'head'], (i) => { s = i; draw(); });
  const out = readout(host);
  function states() {
    const q = D.filter((r) => r[2] >= u), as = q.map((r) => [...r, r[2] * r[3]]), g = {}; as.forEach((r) => (g[r[0]] = (g[r[0]] || 0) + r[4]));
    const gr = Object.entries(g), so = gr.slice().sort((a, b) => b[1] - a[1]), hd = so.slice(0, n);
    const H4 = ['region', 'product', 'units', 'price'];
    return [[H4, D], [H4, q], [[...H4, 'revenue'], as], [['region', 'revenue'], gr], [['region', 'revenue'], so], [['region', 'revenue'], hd]];
  }
  const sub = (t) => t.replace('{u}', u).replace('{n}', n);
  function draw() { const [H, R] = states()[s]; out.innerHTML = `<b>After <code>${sub(LINKS[s])}</code></b>: shape <b>(${R.length}, ${H.length})</b>. Each link takes a DataFrame in and hands a new one on, so the chain reads top to bottom like a recipe.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'df  →  one step at a time', col);
    LINKS.forEach((l, i) => { ctx.globalAlpha = i === s ? 1 : i < s ? 0.6 : 0.3; if (i === s) { ctx.fillStyle = col.soft; ctx.fillRect(6, 34 + i * 15, w - 12, 15); } text(ctx, sub(l), 12, 41 + i * 15, { color: i === s ? col.s[0] : col.ink, size: 10.5, weight: i === s ? 700 : 400 }); });
    ctx.globalAlpha = 1;
    const [H, R] = states()[s], cw = H.length === 5 ? [w * 0.16, w * 0.16, w * 0.14, w * 0.14, w * 0.2] : H.length === 4 ? [w * 0.22, w * 0.22, w * 0.16, w * 0.16] : [w * 0.3, w * 0.3];
    text(ctx, `shape = (${R.length}, ${H.length})`, 10, 34 + 6 * 15 + 12, { color: col.muted, size: 11 });
    if (R.length) tbl(ctx, col, 10, 34 + 6 * 15 + 22, H, R, cw, { rh: 18, size: 11 }); else text(ctx, 'empty: lower min units', 10, 34 + 6 * 15 + 40, { color: col.bad, size: 12 });
  };
  st.set(0); draw();
  return { step(i) { st.set(i); } };
}
