// Class 9 Data (step player): from raw data to a bar graph. Twenty students are asked how many cups of chai they drank yesterday.
// Raw list -> tally marks -> frequency table -> bar graph. The tallest bar is the mode.
import { canvas, text, title } from '../../kit.js';

const D = [2, 1, 3, 2, 0, 2, 1, 3, 2, 4, 1, 2, 3, 2, 1, 0, 2, 3, 2, 1], V = [0, 1, 2, 3, 4];
const T = ['Raw data: cups of chai drunk by 20 students', 'Go through the list and make one tally mark for each value (every fifth mark crosses the four)', 'Count the tallies: the frequency of each value. The total is 20', 'Draw a bar for each value, as tall as its frequency. Leave gaps between bars', 'The tallest bar is the mode: 2 cups, drunk by 8 students'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Raw data turned into tally marks, a frequency table and a bar graph' });
  const f = V.map((v) => D.filter((d) => d === v).length);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Chai cups: raw data to bar graph', col);
    text(ctx, T[s].length > 52 ? T[s].slice(0, T[s].lastIndexOf(' ', 52)) : T[s], w / 2, t + 12, { color: col.muted, size: 10.5, align: 'center' });
    if (T[s].length > 52) text(ctx, T[s].slice(T[s].lastIndexOf(' ', 52) + 1), w / 2, t + 26, { color: col.muted, size: 10.5, align: 'center' });
    const top = t + 44;
    if (s === 0) {
      const g = Math.min(32, (w - 30) / 5);
      D.forEach((d, i) => { const x = 20 + (i % 5) * g + (w - 40 - 5 * g) / 2 + g / 2, y = top + 20 + Math.floor(i / 5) * g; ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(x, y, g * 0.4, 0, 7); ctx.fill(); ctx.restore(); text(ctx, String(d), x, y, { color: col.ink, size: 14, weight: 700, align: 'center' }); });
      return;
    }
    if (s <= 2) {
      const rh = Math.min(38, (h - top - 20) / 6), c0 = w * 0.1;
      ['Cups', s === 1 ? 'Tally' : 'Tally', 'Frequency'].forEach((hd, i) => { if (i < 2 || s === 2) text(ctx, hd, [c0 + 20, c0 + 80, w - 50][i], top + 8, { color: col.muted, size: 11, weight: 700, align: i === 2 ? 'center' : 'left' }); });
      V.forEach((v, i) => {
        const y = top + 26 + i * rh; text(ctx, String(v), c0 + 24, y + rh / 2, { color: col.ink, size: 14, weight: 700, align: 'center' });
        ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; let x = c0 + 80;
        for (let k = 0; k < f[i]; k++) { const j = k % 5; if (j === 4) { ctx.beginPath(); ctx.moveTo(x - 24, y + rh * 0.72); ctx.lineTo(x - 4, y + rh * 0.22); ctx.stroke(); x += 8; } else { ctx.beginPath(); ctx.moveTo(x, y + rh * 0.2); ctx.lineTo(x, y + rh * 0.75); ctx.stroke(); x += 6; } }
        ctx.restore();
        if (s === 2) text(ctx, String(f[i]), w - 50, y + rh / 2, { color: col.s[2], size: 15, weight: 700, align: 'center' });
        ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(c0, y + rh - 2); ctx.lineTo(w - 20, y + rh - 2); ctx.stroke(); ctx.restore();
      });
      if (s === 2) text(ctx, 'Total = ' + f.reduce((a, b) => a + b), w - 50, top + 26 + 5 * rh + 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
      return;
    }
    const L = 40, B = h - 34, Tp = top + 16, mx = 8, bw = (w - L - 20) / 5;
    for (let y = 0; y <= mx; y += 2) { const yy = B - (y / mx) * (B - Tp); ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(w - 12, yy); ctx.stroke(); ctx.restore(); text(ctx, String(y), L - 6, yy, { color: col.muted, size: 10.5, align: 'right' }); }
    V.forEach((v, i) => { const bh = (f[i] / mx) * (B - Tp), x = L + i * bw + bw * 0.15; ctx.save(); ctx.fillStyle = s === 4 && f[i] === 8 ? col.s[3] : col.s[0]; ctx.globalAlpha = 0.7; ctx.fillRect(x, B - bh, bw * 0.7, bh); ctx.restore(); text(ctx, String(f[i]), x + bw * 0.35, B - bh - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, String(v), x + bw * 0.35, B + 12, { color: col.ink, size: 11, align: 'center' }); });
    text(ctx, 'cups of chai', (L + w) / 2, h - 8, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'students', 12, Tp - 16, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
