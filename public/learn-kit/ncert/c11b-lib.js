// Small drawing helpers shared by the Class 11 Biology figures (c11b-*). Not a figure itself.
import { text } from '../kit.js';

/** Wrapped text: returns the y after the last line. */
export function note(ctx, s, x, y, wd, col, { size = 11, color, weight = 400, lh } = {}) {
  ctx.save(); ctx.font = `${weight} ${size}px system-ui,sans-serif`;
  const words = String(s).split(' '); let l = '', yy = y; const L = lh || size + 3.5;
  const out = (t) => { text(ctx, t, x, yy, { color: color || col.ink, size, weight }); yy += L; };
  for (const w of words) { const t = l ? l + ' ' + w : w; if (ctx.measureText(t).width > wd && l) { out(l); l = w; } else l = t; }
  if (l) out(l);
  ctx.restore();
  return yy;
}
/** Rounded rectangle. fill/stroke may be null. */
export function rr(ctx, x, y, w, h, r, fill, stroke, lw = 1.5) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
/** Ellipse (or circle when ry omitted). alpha applies to the fill only. */
export function ell(ctx, x, y, rx, ry, fill, stroke, lw = 1.5, alpha = 1) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry ?? rx), 0, 0, Math.PI * 2);
  if (fill) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = fill; ctx.fill(); ctx.restore(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
/** Filled polygon from [x, y] points. */
export function poly(ctx, pts, fill, stroke, lw = 1.5, alpha = 1) {
  ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
  if (fill) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = fill; ctx.fill(); ctx.restore(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
/** A curve through points (quadratic smoothing), optional fill. */
export function curve(ctx, pts, stroke, lw = 2, fill, alpha = 0.3) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
  const p = pts[pts.length - 1]; ctx.lineTo(p[0], p[1]);
  if (fill) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = fill; ctx.fill(); ctx.restore(); }
  if (stroke) { ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.strokeStyle = stroke; ctx.stroke(); }
}
/** A short label with a leader line. */
export function tag(ctx, s, x, y, tx, ty, col, align = 'left', color) {
  ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke(); ctx.restore();
  text(ctx, s, tx + (align === 'left' ? 3 : -3), ty, { color: color || col.ink, size: 10.5, align, weight: 600 });
}
