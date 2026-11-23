// Shared helpers for the Class 8 Maths figures of chapters 10 to 14 (not a figure): a wrapped note at the bottom of a canvas.
import { text } from '../../kit.js';
export const note = (ctx, str, w, h, col) => {
  const max = Math.max(24, Math.floor((w - 20) / 6.4)), ls = []; let cur = '';
  str.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); });
  ls.push(cur);
  ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600, align: 'center' }));
  return ls.length;
};

// Not a figure: nothing to draw.
export default function () {}
