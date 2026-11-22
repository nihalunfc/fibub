// Shared helpers for the Class 9 Sequences figures (not a figure itself): a wrapped caption at the foot of a canvas.
import { text } from '../../kit.js';

/** Caption wrapped onto up to three lines at the bottom of the canvas. */
export const note = (ctx, str, w, h, col) => {
  const max = Math.max(24, Math.floor((w - 20) / 6.4)), ls = []; let cur = '';
  str.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); });
  ls.push(cur);
  ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600, align: 'center' }));
};
export default function () {}
