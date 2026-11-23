// Class 11 Maths, Permutations with a condition: 5 friends A, B, C, D, E stand in a row. How many ways if A and B must
// stand together? Glue A and B into one block: 4 units can be arranged in 4! ways, and inside the block A, B can swap (2!).
// So 4! × 2! = 48. The "not together" count is the total minus this: 120 − 48 = 72.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Five friends in a row with A and B glued into one block' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A and B must stand together', col), cw = Math.min(48, (w - 30) / 5), y = top + 44;
    const box = (x, wd, label, c, glue) => { ctx.fillStyle = c; ctx.globalAlpha = 0.25; ctx.fillRect(x, y - 20, wd, 40); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, y - 20, wd, 40); text(ctx, label, x + wd / 2, y, { color: col.ink, size: 18, weight: 700, align: 'center' }); };
    if (s === 0) { const x0 = (w - 5 * cw) / 2; 'ABCDE'.split('').forEach((c, i) => box(x0 + i * cw + 2, cw - 4, c, col.s[i === 0 || i === 1 ? 1 : 0])); text(ctx, 'Total with no condition: 5! = 120', w / 2, y + 50, { color: col.ink, size: 14, weight: 700, align: 'center' }); }
    else { const x0 = (w - 4 * cw - cw) / 2; box(x0 + 2, 2 * cw - 4, 'AB', col.s[1]); ['C', 'D', 'E'].forEach((c, i) => box(x0 + (2 + i) * cw + 2, cw - 4, c, col.s[0])); }
    if (s === 1) text(ctx, 'Glue A and B: now there are 4 units (AB, C, D, E)', w / 2, y + 50, { color: col.s[1], size: 12.5, weight: 700, align: 'center' });
    if (s === 2) { text(ctx, '4 units in a row: 4! = 24 ways', w / 2, y + 50, { color: col.ink, size: 14, weight: 700, align: 'center' }); }
    if (s === 3) { box((w - 2 * cw) / 2 - 30, cw - 4, 'AB', col.s[1]); box((w - 2 * cw) / 2 + cw - 24, cw - 4, 'BA', col.s[1]); text(ctx, 'Inside the block A, B can swap: 2! = 2', w / 2, y + 50, { color: col.ink, size: 14, weight: 700, align: 'center' }); }
    if (s >= 4) { text(ctx, 'Together: 4! × 2! = 24 × 2 = 48', w / 2, y + 50, { color: col.s[1], size: 15, weight: 700, align: 'center' }); }
    if (s === 5) text(ctx, 'Not together: 120 − 48 = 72', w / 2, y + 82, { color: col.s[2], size: 15, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(i, 0), 5); cv.redraw(); } };
}
