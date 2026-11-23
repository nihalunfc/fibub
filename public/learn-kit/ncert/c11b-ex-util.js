// Small drawing helpers shared by the Class 11 Biology figures of chapters 6 to 10 (c11b-anat, sorg, cell, biomol, cycle).
import { text } from '../kit.js';

/** Wrapped paragraph; returns the y below the last line. */
export function wrap(ctx, s, x, y, wd, col, { size = 11, lh = 14, color, weight = 400 } = {}) {
  ctx.save(); ctx.font = `${weight} ${size}px system-ui,sans-serif`;
  let l = '', yy = y; const out = [];
  for (const word of s.split(' ')) { const t = l ? l + ' ' + word : word; if (ctx.measureText(t).width > wd && l) { out.push(l); l = word; } else l = t; }
  out.push(l); ctx.restore();
  out.forEach((ln, i) => text(ctx, ln, x, yy + i * lh, { color: color ?? col.ink, size, weight, fit: false }));
  return yy + out.length * lh;
}
/** Number of lines wrap() would use. */
export function lines(ctx, s, wd, size = 11) {
  ctx.save(); ctx.font = `400 ${size}px system-ui,sans-serif`; let l = '', n = 1;
  for (const word of s.split(' ')) { const t = l ? l + ' ' + word : word; if (ctx.measureText(t).width > wd && l) { n++; l = word; } else l = t; }
  ctx.restore(); return n;
}
export function ellipse(ctx, x, y, rx, ry, fill, stroke, lw = 1.5, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
export function rrect(ctx, x, y, w, h, r, fill, stroke, lw = 1.5) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
/** Translucent fill. */
export function alpha(ctx, a, fn) { ctx.save(); ctx.globalAlpha = a; fn(); ctx.restore(); }
/** A note under the drawing, wrapped to the canvas width and fixed to the bottom; returns the y where it starts. */
export function footer(ctx, w, h, col, s, { size = 11, lh = 14, color } = {}) {
  const n = lines(ctx, s, w - 24, size), y = h - 8 - n * lh;
  wrap(ctx, s, 12, y + 7, w - 24, col, { size, lh, color });
  return y - 2;
}
