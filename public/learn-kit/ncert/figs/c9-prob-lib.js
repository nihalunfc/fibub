// Shared helpers for the Class 9 Probability figures (not a figure itself): a wrapped caption, a die face, a percent.
import { text } from '../../kit.js';

/** Caption wrapped onto up to three lines at the bottom of the canvas. */
export const note = (ctx, str, w, h, col) => {
  const max = Math.max(24, Math.floor((w - 20) / 6.4)), ls = []; let cur = '';
  str.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); });
  ls.push(cur);
  ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600, align: 'center' }));
};
const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
/** A die face with value v and side s, centred at (x, y). */
export const die = (ctx, x, y, s, v, col, fill = col.panel, edge = col.ink) => {
  ctx.fillStyle = fill; ctx.strokeStyle = edge; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, s * 0.16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col.ink;
  PIPS[v].forEach(([px, py]) => { ctx.beginPath(); ctx.arc(x + px * s * 0.26, y + py * s * 0.26, s * 0.075, 0, 7); ctx.fill(); });
};
export default function () {}
