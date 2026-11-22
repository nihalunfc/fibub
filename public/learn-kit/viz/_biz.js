// Helpers for the business, BI and storytelling figures (biz-*): number formats, a small table drawn on a canvas,
// the made-up Northbay-style sales rows used by the Power BI figures, and a few shared chart bits.
import { text } from '../kit.js';

export const money = (v, d = 0) => (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString('en-CA', { maximumFractionDigits: d, minimumFractionDigits: d });
export const short = (v) => { const a = Math.abs(v); const s = a >= 1e9 ? (a / 1e9).toFixed(1) + 'B' : a >= 1e6 ? (a / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M' : a >= 1e3 ? (a / 1e3).toFixed(a >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(Math.round(a)); return (v < 0 ? '-' : '') + '$' + s; };
export const pct = (v, d = 0) => (v * 100).toFixed(d) + '%';

// Made-up sales rows: [id, month, store, category, qty, unit price, unit cost]
export const SALES = [
  [1, 'Jan', 'Rideau', 'Home', 4, 30, 18], [2, 'Jan', 'Queen', 'Outdoor', 3, 30, 21], [3, 'Jan', 'Forks', 'Home', 2, 30, 18],
  [4, 'Feb', 'Rideau', 'Outdoor', 5, 30, 21], [5, 'Feb', 'Queen', 'Home', 2, 40, 22], [6, 'Feb', 'Forks', 'Outdoor', 1, 40, 28],
  [7, 'Mar', 'Rideau', 'Home', 3, 40, 22], [8, 'Mar', 'Queen', 'Outdoor', 4, 35, 24], [9, 'Mar', 'Forks', 'Home', 2, 35, 20],
].map(([id, m, store, cat, qty, price, cost]) => ({ id, m, store, cat, qty, price, cost, amt: qty * price }));

/** Draw a table: cols = [{ label, w (fraction), align, f(row) }]; style(row, i) returns 'on', 'off' or '' */
export function table(ctx, col, x, y, w, cols, rows, { rowH = 19, size = 11, style = () => '', head = true } = {}) {
  let cx = x;
  const xs = cols.map((c) => { const v = cx; cx += c.w * w; return v; });
  if (head) {
    cols.forEach((c, j) => text(ctx, c.label, c.align === 'right' ? xs[j] + c.w * w - 6 : xs[j] + 6, y + rowH / 2, { color: col.muted, size: size - 1, weight: 700, align: c.align || 'left', fit: false }));
    y += rowH;
  }
  rows.forEach((r, i) => {
    const st = style(r, i), yy = y + i * rowH;
    if (st === 'on') { ctx.fillStyle = col.soft; ctx.fillRect(x, yy, w, rowH - 1); ctx.fillStyle = col.s[0]; ctx.fillRect(x, yy, 3, rowH - 1); }
    else if (i % 2 === 0) { ctx.fillStyle = col.soft; ctx.globalAlpha = 0.35; ctx.fillRect(x, yy, w, rowH - 1); ctx.globalAlpha = 1; }
    ctx.globalAlpha = st === 'off' ? 0.35 : 1;
    cols.forEach((c, j) => text(ctx, String(c.f(r)), c.align === 'right' ? xs[j] + c.w * w - 6 : xs[j] + 6, yy + rowH / 2, { color: col.ink, size, align: c.align || 'left', weight: st === 'on' ? 600 : 400, fit: false }));
    ctx.globalAlpha = 1;
  });
  return y + rows.length * rowH;
}

/** A rounded label chip; returns its width. on = filled with the accent colour. */
export function chip(ctx, col, label, x, y, { on = false, size = 11, h = 20, pad = 8, color } = {}) {
  ctx.save(); ctx.font = `600 ${size}px system-ui,sans-serif`;
  const w = ctx.measureText(label).width + pad * 2; ctx.restore();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2);
  if (on) { ctx.fillStyle = color || col.s[0]; ctx.fill(); } else { ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); }
  text(ctx, label, x + w / 2, y + h / 2 + 0.5, { color: on ? col.bg : col.ink, size, weight: 600, align: 'center', fit: false });
  return w;
}

/** Steady (seeded) pseudo-noise in -1..1 for made-up data */
export const wob = (i, k = 1) => Math.sin(i * 12.9898 * k + 4.1) * 0.6 + Math.sin(i * 7.31 * k + 1.3) * 0.4;
