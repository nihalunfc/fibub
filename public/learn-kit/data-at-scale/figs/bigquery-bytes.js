// 3.3 Watch it happen: the same question asked four ways, and the bytes BigQuery reads each time (log scale).
// Table: 2 years of sales, 30 million rows a day, 20 columns of about 8 bytes.
import { canvas, text, title, line, ease, loop, calm } from '../../kit.js';

const rr = (ctx, x, y, w, h, r = 3) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const ROWS = [
  ['SELECT * (all history)', 3.5e12, '3.5 TB'],
  ['2 columns only', 3.5e11, '350 GB'],
  ['+ last 7 days (partition)', 3.36e9, '3.4 GB'],
  ['+ one store (cluster)', 2e8, '≈ 0.2 GB'],
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 320, min: 240, label: 'Bars of bytes scanned shrinking as the query reads fewer columns and partitions' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.8); cv.redraw(); } }, { autoplay: false });
  const lx = (v) => Math.log10(v);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Bytes read for one sales question', col);
    const L = 12, R = w - 70, T = 44, B = h - 44, X = (v) => L + ((lx(v) - 8) / (13 - 8)) * (R - L);
    for (const [v, s] of [[1e8, '100 MB'], [1e10, '10 GB'], [1e12, '1 TB']]) { line(ctx, [[X(v), T - 4], [X(v), B]], col.line, 1); text(ctx, s, X(v), B + 11, { color: col.muted, size: 10.5, align: 'center' }); }
    const rowH = (B - T) / 4, e = ease(k);
    ROWS.forEach(([label, v, s], i) => {
      if (i > step) return;
      const y = T + i * rowH, now = i === step, vv = now && i > 0 ? Math.pow(10, lx(ROWS[i - 1][1]) + (lx(v) - lx(ROWS[i - 1][1])) * e) : v;
      ctx.fillStyle = now ? col.s[0] : col.line; rr(ctx, L, y + 16, Math.max(3, X(vv) - L), rowH - 22); ctx.fill();
      text(ctx, label, L, y + 8, { color: now ? col.ink : col.muted, size: 11.5, weight: now ? 700 : 400 });
      text(ctx, s, Math.max(L, X(vv)) + 6, y + 16 + (rowH - 22) / 2, { color: col.ink, size: 11.5, weight: 700 });
    });
    text(ctx, step ? `${Math.round(ROWS[0][1] / ROWS[step][1]).toLocaleString('en-CA')} times less to read, and to pay for` : 'You pay (on demand) for every byte read', 8, h - 14, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
