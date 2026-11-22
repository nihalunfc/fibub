// Shared helpers for the Class 9 Surface Area and Volume figures (not a figure itself).
export const note = (ctx, str, w, h, col, text) => {
  const max = Math.max(24, Math.floor((w - 20) / 6.4)), ls = []; let cur = '';
  str.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); });
  ls.push(cur);
  ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600, align: 'center' }));
};
export const poly = (ctx, pts, fill, stroke, alpha = 0.3, lw = 2) => {
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = alpha; ctx.fill(); ctx.globalAlpha = 1; }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); }
};
export const ell = (ctx, cx, cy, rx, ry, fill, stroke, alpha = 0.3, lw = 2, a0 = 0, a1 = Math.PI * 2) => {
  ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, a0, a1);
  if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = alpha; ctx.fill(); ctx.globalAlpha = 1; }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
};
export const seg = (ctx, x0, y0, x1, y1, color, lw = 2, dash) => { ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]); };
export default function () {}
