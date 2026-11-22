// Small drawing helpers shared by the Module 1 and 2 figures of Pipeline to Dashboard (boxes, tags, chips).
import { text } from '../../kit.js';

/** A rounded box, optionally filled and outlined. */
export function box(ctx, x, y, w, h, { fill, stroke, r = 6, width = 1.5, alpha = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y); ctx.arcTo(x + w, y, x + w, y + h, rr); ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr); ctx.arcTo(x, y, x + w, y, rr); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
  ctx.restore();
}

/** A box with centred text (one or two lines). */
export function labelBox(ctx, x, y, w, h, lines, { fill, stroke, color, size = 11, weight = 600, alpha = 1 } = {}) {
  box(ctx, x, y, w, h, { fill, stroke, alpha });
  const ls = Array.isArray(lines) ? lines : [lines];
  ls.forEach((l, i) => text(ctx, l, x + w / 2, y + h / 2 + (i - (ls.length - 1) / 2) * (size + 3), { color, size, weight, align: 'center', fit: false }));
}

/** Shorten a string so it fits in `max` pixels at the current font. */
export function clip(ctx, s, max, size = 11, weight = 400) {
  ctx.save(); ctx.font = `${weight} ${size}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`;
  let t = s;
  while (t.length > 2 && ctx.measureText(t).width > max) t = t.slice(0, -2) + '…';
  ctx.restore();
  return t.length < s.length && !t.endsWith('…') ? t + '…' : t;
}
