// Small drawing helpers shared by the Module 5 and 6 figures of Pipeline to Dashboard (boxes, table cells).
import { text } from '../../kit.js';

/** A rounded box, optionally filled and outlined. */
export function box(ctx, x, y, w, h, { fill, stroke, r = 5, width = 1.5, alpha = 1, dash } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.moveTo(x + rr, y); ctx.arcTo(x + w, y, x + w, y + h, rr); ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr); ctx.arcTo(x, y, x + w, y, rr); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
  ctx.restore();
}

/** A box with centred text (one or more lines). */
export function labelBox(ctx, x, y, w, h, lines, { fill, stroke, color, size = 11, weight = 600, alpha = 1, dash } = {}) {
  box(ctx, x, y, w, h, { fill, stroke, alpha, dash });
  const ls = Array.isArray(lines) ? lines : [lines];
  ctx.save(); ctx.globalAlpha = alpha;
  ls.forEach((l, i) => text(ctx, l, x + w / 2, y + h / 2 + (i - (ls.length - 1) / 2) * (size + 3), { color, size, weight, align: 'center', fit: false }));
  ctx.restore();
}

/**
 * A small table: cols = [{ w, label }], rows = arrays of cell strings. `hi(i)` may return a fill for row i.
 * Returns the y just under the table.
 */
export function grid(ctx, x, y, cols, rows, col, { rh = 20, size = 10.5, hi, alpha } = {}) {
  let cx = x;
  const W = cols.reduce((s, c) => s + c.w, 0);
  box(ctx, x, y, W, rh, { fill: col.soft, r: 3 });
  cols.forEach((c) => { text(ctx, c.label, cx + 5, y + rh / 2, { color: col.ink, size, weight: 700, fit: false }); cx += c.w; });
  rows.forEach((r, i) => {
    const yy = y + rh * (i + 1);
    ctx.save(); if (alpha) ctx.globalAlpha = alpha(i);
    const f = hi && hi(i);
    if (f) box(ctx, x, yy + 1, W, rh - 2, { fill: f, r: 3 });
    let xx = x;
    r.forEach((v, j) => { text(ctx, String(v), xx + 5, yy + rh / 2, { color: col.ink, size, fit: false }); xx += cols[j].w; });
    ctx.restore();
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, yy + rh + 0.5); ctx.lineTo(x + W, yy + rh + 0.5); ctx.stroke(); ctx.restore();
  });
  return y + rh * (rows.length + 1);
}

/** Text that wraps onto as many lines as it needs inside `maxW` pixels. Returns the y under the last line. */
export function wrap(ctx, s, x, y, maxW, { color, size = 11, weight = 400, lh = 15 } = {}) {
  ctx.save(); ctx.font = `${weight} ${size}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`;
  const words = s.split(' '), lines = []; let cur = '';
  for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; }
  if (cur) lines.push(cur);
  ctx.restore();
  lines.forEach((l, i) => text(ctx, l, x, y + i * lh, { color, size, weight, fit: false }));
  return y + lines.length * lh;
}
