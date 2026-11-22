// Class 9 Data (step player): the mean from a frequency table. Goals scored in 20 school football matches. Multiply each value x by its
// frequency f to get the total it contributes (fx), add the fx column, divide by the total frequency: mean = sum(fx) / sum(f).
import { canvas, text, title } from '../../kit.js';

const X = [0, 1, 2, 3, 4], F = [3, 6, 5, 4, 2], T = ['Frequency table: goals x in a match, and how many matches f', 'Add the f column: 3 + 6 + 5 + 4 + 2 = 20 matches', 'For each row multiply: fx = f × x (6 matches with 1 goal give 6 goals)', 'Add the fx column: the total number of goals is 36', 'Mean = total goals ÷ total matches = 36 ÷ 20 = 1.8 goals a match'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 280, label: 'A frequency table with an fx column used to find the mean' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Mean from a frequency table', col), cw = (w - 40) / 3, rh = Math.min(38, (h - t - 100) / 7), y0 = t + 30;
    text(ctx, T[s], w / 2, t + 12, { color: col.muted, size: 10.5, align: 'center', fit: true });
    ['x (goals)', 'f (matches)', 'fx'].forEach((hd, i) => { if (i < 2 || s >= 2) text(ctx, hd, 20 + cw * i + cw / 2, y0 + rh / 2, { color: col.muted, size: 11.5, weight: 700, align: 'center' }); });
    X.forEach((x, i) => { const y = y0 + (i + 1) * rh; ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(w - 20, y); ctx.stroke(); ctx.restore(); text(ctx, String(x), 20 + cw / 2, y + rh / 2, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, String(F[i]), 20 + cw * 1.5, y + rh / 2, { color: col.ink, size: 14, weight: 700, align: 'center' }); if (s >= 2) text(ctx, String(x * F[i]), 20 + cw * 2.5, y + rh / 2, { color: col.s[3], size: 14, weight: 700, align: 'center' }); });
    const y = y0 + 6 * rh; ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(w - 20, y); ctx.stroke(); ctx.restore();
    if (s >= 1) text(ctx, '20', 20 + cw * 1.5, y + rh / 2, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    if (s >= 3) text(ctx, '36', 20 + cw * 2.5, y + rh / 2, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    if (s >= 1) text(ctx, 'Σ', 20 + cw / 2, y + rh / 2, { color: col.muted, size: 13, weight: 700, align: 'center' });
    if (s === 4) text(ctx, 'mean = 36 ÷ 20 = 1.8', w / 2, h - 14, { color: col.s[2], size: 16, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
