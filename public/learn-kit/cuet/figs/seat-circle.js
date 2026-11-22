// 4.7 Seating puzzle solved clue by clue (driven by the step player): six friends round a table facing the centre.
import { canvas, text } from '../../kit.js';

// Final order clockwise from the top: Asha, Dev, Farah, Charu, Esha, Bilal.
const ORDER = ['Asha', 'Dev', 'Farah', 'Charu', 'Esha', 'Bilal'];
const SHOW = [['Asha'], ['Asha', 'Charu'], ['Asha', 'Charu', 'Bilal'], ['Asha', 'Charu', 'Bilal', 'Dev'], ['Asha', 'Charu', 'Bilal', 'Dev', 'Esha', 'Farah']];
export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 260, label: 'Six seats round a table filled in clue by clue' });
  let i = 0;
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * 0.32;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R * 0.6, 0, 7); ctx.stroke();
    text(ctx, 'table', cx, cy, { color: col.muted, size: 12, align: 'center' });
    const on = new Set(SHOW[i]);
    ORDER.forEach((n, k) => {
      const a = -Math.PI / 2 + (k * Math.PI * 2) / 6, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      ctx.fillStyle = on.has(n) ? col.s[k % 6] : col.line; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill();
      const lx = cx + (R + 30) * Math.cos(a), ly = cy + (R + 26) * Math.sin(a);
      text(ctx, on.has(n) ? n : '?', lx, ly, { color: col.ink, size: 12, weight: 600, align: 'center' });
    });
    text(ctx, 'clockwise ↻', 10, 12, { color: col.muted, size: 11 });
  };
  cv.redraw();
  return { step(k) { i = Math.min(k, SHOW.length - 1); cv.redraw(); } };
}
