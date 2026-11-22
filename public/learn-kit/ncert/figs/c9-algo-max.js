// Class 9 Algorithms (step player): what an algorithm is. A step-by-step method that always ends: find the largest of five numbers.
// Keep a "biggest so far" card; look at each number in turn; if it is bigger, replace the card. Input -> steps -> output.
import { canvas, text, title } from '../../kit.js';

const D = [14, 9, 23, 17, 21];
const T = ['Input: five numbers. Output: the largest of them', 'Step 1: write down the first number as “biggest so far”: 14', 'Step 2: look at the next, 9. Is 9 bigger than 14? No. Keep 14', 'Step 3: look at 23. Is it bigger than 14? Yes. Biggest so far becomes 23', 'Step 4: look at 17. Bigger than 23? No. Keep 23', 'Step 5: look at 21. Bigger than 23? No. No numbers left, so stop', 'Output: 23. A good algorithm is clear, ends, and gives the right answer every time'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'Five number cards scanned one by one to find the biggest' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'An algorithm: find the largest', col), n = 5, cw = Math.min(58, (w - 30) / n - 6), y = t + 60, best = s === 0 ? -1 : s === 1 ? 0 : s === 2 ? 0 : s <= 5 ? 2 : 2, look = s >= 1 && s <= 5 ? s - 1 : -1;
    const words = T[s].split(' '); let l1 = '', l2 = ''; words.forEach((x) => { if ((l1 + ' ' + x).length < 50 && !l2) l1 += ' ' + x; else l2 += ' ' + x; });
    text(ctx, l1.trim(), w / 2, t + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); if (l2) text(ctx, l2.trim(), w / 2, t + 30, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    D.forEach((v, i) => { const x = (w - n * (cw + 6)) / 2 + i * (cw + 6) + 3, seen = s >= 1 && i <= look; ctx.save(); ctx.fillStyle = i === best && s >= 1 ? col.s[2] : i === look ? col.s[3] : col.s[0]; ctx.globalAlpha = i === best && s >= 1 ? 0.7 : seen || i === look ? 0.5 : 0.18; ctx.fillRect(x, y, cw, cw * 1.2); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = i === look ? 3 : 1.2; ctx.strokeRect(x, y, cw, cw * 1.2); ctx.restore(); text(ctx, String(v), x + cw / 2, y + cw * 0.6, { color: col.ink, size: 17, weight: 700, align: 'center' }); });
    if (look >= 0) { const x = (w - n * (cw + 6)) / 2 + look * (cw + 6) + 3 + cw / 2; text(ctx, 'looking here', x, y + cw * 1.2 + 14, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    const bv = s === 0 ? '–' : D[best]; ctx.save(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.18; ctx.fillRect(w / 2 - 80, h - 76, 160, 52); ctx.restore(); ctx.save(); ctx.strokeStyle = col.s[2]; ctx.strokeRect(w / 2 - 80, h - 76, 160, 52); ctx.restore();
    text(ctx, 'biggest so far', w / 2, h - 62, { color: col.muted, size: 11, align: 'center' }); text(ctx, String(bv), w / 2, h - 40, { color: col.s[2], size: 20, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 6); cv.redraw(); } };
}
