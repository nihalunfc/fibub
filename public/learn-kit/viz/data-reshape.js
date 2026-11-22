// Wide to long and back: the same nine numbers as a table with one column per month (wide, pandas pivot output) and
// as one row per product-and-month (long, what melt makes and groupby likes). Drag the slider and watch each value
// travel. Try: stop halfway, and say which column is the "variable" and which is the "value".
import { canvas, text, row, slider, button, readout, title, ease, loop } from '../kit.js';

const P = ['Pen', 'Book', 'Lamp'], M = ['Jan', 'Feb', 'Mar'], V = [[12, 15, 9], [30, 28, 35], [7, 11, 14]];
export default function (host) {
  let t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 340, label: 'A wide table of sales morphing into a long table' });
  const c1 = row(host);
  const sl = slider(c1, { label: 'Wide ⟷ long', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v < 0.02 ? 'wide' : v > 0.98 ? 'long' : 'moving'), oninput: (v) => { t = v; draw(); } });
  let dir = 1;
  const anim = loop(host, (dt) => { t += dir * dt * 0.35; if (t >= 1 || t <= 0) { t = Math.min(1, Math.max(0, t)); dir = -dir; anim.pause(); } sl.set(t); draw(); }, { autoplay: false });
  anim.button(c1);
  const out = readout(host);
  function draw() { out.innerHTML = t < 0.02 ? '<b>Wide:</b> 3 rows × 4 columns. Each month is its own column, nice to read, awkward to filter or plot by month. <code>df.pivot(index="product", columns="month", values="sales")</code> makes this.' : t > 0.98 ? '<b>Long (tidy):</b> 9 rows × 3 columns. One row per observation: product, month, sales. <code>df.melt(id_vars="product", var_name="month", value_name="sales")</code> makes this.' : 'Each month header became a value in the <code>month</code> column, and each number moved into <code>sales</code>.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, t < 0.5 ? 'Wide: one column per month' : 'Long: one row per product and month', col);
    const e = ease(t), cw = Math.min(70, (w - 20) / 4), rh = 24, x0 = 10, y0 = 50;
    // headers
    const hw = (i) => [x0 + i * cw, y0];
    ['product', ...M].forEach((s, i) => { const tx = i === 0 ? x0 : x0 + i * cw, a = i === 0 ? 1 : 1 - e; ctx.globalAlpha = a; ctx.fillStyle = col.soft; ctx.fillRect(tx, y0, cw - 2, rh - 2); text(ctx, s, tx + 4, y0 + rh / 2, { color: i ? col.s[i % 3] : col.ink, size: 11, weight: 700, fit: false }); });
    ctx.globalAlpha = e; ['product', 'month', 'sales'].forEach((s, i) => { ctx.fillStyle = col.soft; ctx.fillRect(x0 + i * cw, y0, cw - 2, rh - 2); text(ctx, s, x0 + i * cw + 4, y0 + rh / 2, { color: col.ink, size: 11, weight: 700, fit: false }); });
    ctx.globalAlpha = 1;
    P.forEach((p, pi) => M.forEach((m, mi) => {
      const wx = x0 + (mi + 1) * cw, wy = y0 + (pi + 1) * rh, lr = pi * 3 + mi, lx = x0 + 2 * cw, ly = y0 + (lr + 1) * rh;
      const x = wx + (lx - wx) * e, y = wy + (ly - wy) * e;
      ctx.fillStyle = col.s[mi]; ctx.globalAlpha = 0.9; ctx.fillRect(x, y, cw - 2, rh - 2); ctx.globalAlpha = 1;
      text(ctx, String(V[pi][mi]), x + 4, y + rh / 2, { color: '#fff', size: 12, weight: 700, fit: false });
      if (mi === 0) text(ctx, p, x0 + 4, wy + rh / 2 + (ly - wy) * e * 0, { color: col.ink, size: 11, fit: false });
      ctx.globalAlpha = e; text(ctx, p, x0 + 4, ly + rh / 2, { color: col.ink, size: 11, fit: false }); text(ctx, m, x0 + cw + 4, ly + rh / 2, { color: col.s[mi], size: 11, weight: 700, fit: false }); ctx.globalAlpha = 1;
    }));
    // hide the wide-only product labels when long
    if (e > 0.01) { ctx.globalAlpha = e; ctx.fillStyle = col.panel; ctx.fillRect(x0, y0 + rh, cw - 2, rh * 3 - 2); ctx.globalAlpha = 1; P.forEach((p, pi) => { text(ctx, p, x0 + 4, y0 + (pi * 3 + 1) * rh + rh / 2, { color: col.ink, size: 11, fit: false }); }); }
  };
  draw();
}
