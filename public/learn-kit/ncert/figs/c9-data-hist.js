// Class 9 Data (step player): grouped data. Marks of 24 students out of 50 -> class intervals (a value on the upper limit goes to the
// next class) -> frequency table -> histogram (bars touch, area stands for frequency) -> frequency polygon (join the class mid-points).
import { canvas, text, title } from '../../kit.js';

const D = [12, 27, 35, 41, 18, 22, 33, 38, 45, 9, 29, 31, 36, 24, 19, 42, 28, 34, 47, 15, 26, 32, 39, 23], K = [0, 1, 2, 3, 4];
const f = K.map((k) => D.filter((d) => d >= k * 10 && d < k * 10 + 10).length);
const T = ['Raw marks of 24 students (out of 50)', 'Choose class intervals of width 10: 0 to 10, 10 to 20, ... A mark of 10 goes into 10 to 20', 'Count how many marks fall in each class: the frequencies', 'Histogram: a bar for each class with NO gaps, because the classes join on the number line', 'Frequency polygon: join the tops of the bars at the class mid-points (5, 15, 25, 35, 45)', 'Read the picture: the tallest bar is the modal class, 30 to 40'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 290, label: 'Raw marks grouped into classes, drawn as a histogram and a frequency polygon' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Marks: histogram and polygon', col), words = T[s].split(' '); let l1 = '', l2 = '';
    words.forEach((x) => { if ((l1 + ' ' + x).length < 56 && !l2) l1 += ' ' + x; else l2 += ' ' + x; });
    text(ctx, l1.trim(), w / 2, t + 12, { color: col.muted, size: 10.5, align: 'center' }); if (l2) text(ctx, l2.trim(), w / 2, t + 26, { color: col.muted, size: 10.5, align: 'center' });
    const top = t + 44;
    if (s === 0) { const g = Math.min(34, (w - 24) / 8); D.forEach((d, i) => { const x = (w - 8 * g) / 2 + (i % 8) * g + g / 2, y = top + 22 + Math.floor(i / 8) * g; ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.arc(x, y, g * 0.42, 0, 7); ctx.fill(); ctx.restore(); text(ctx, String(d), x, y, { color: col.ink, size: 13, weight: 700, align: 'center' }); }); return; }
    if (s <= 2) {
      const rh = Math.min(40, (h - top - 20) / 6);
      text(ctx, 'Class', w * 0.25, top + 8, { color: col.muted, size: 11, weight: 700, align: 'center' }); if (s >= 2) text(ctx, 'Frequency', w * 0.7, top + 8, { color: col.muted, size: 11, weight: 700, align: 'center' });
      K.forEach((k, i) => { const y = top + 26 + i * rh; text(ctx, k * 10 + ' – ' + (k * 10 + 10), w * 0.25, y + rh / 2, { color: col.ink, size: 14, weight: 700, align: 'center' }); if (s >= 2) { text(ctx, String(f[i]), w * 0.7, y + rh / 2, { color: col.s[2], size: 15, weight: 700, align: 'center' }); ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(w * 0.7 + 22, y + rh / 2 - 6, f[i] * 6, 12); ctx.restore(); } ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(20, y + rh - 2); ctx.lineTo(w - 20, y + rh - 2); ctx.stroke(); ctx.restore(); });
      if (s === 2) text(ctx, 'Total 24', w * 0.7, top + 26 + 5 * rh + 6, { color: col.ink, size: 12, weight: 700, align: 'center' });
      return;
    }
    const L = 40, B = h - 32, Tp = top + 14, mx = 10, bw = (w - L - 16) / 6, O = L + bw / 2, Y = (v) => B - (v / mx) * (B - Tp);
    for (let y = 0; y <= mx; y += 2) { ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, Y(y)); ctx.lineTo(w - 12, Y(y)); ctx.stroke(); ctx.restore(); text(ctx, String(y), L - 6, Y(y), { color: col.muted, size: 10.5, align: 'right' }); }
    K.forEach((k, i) => { const x = O + i * bw; ctx.save(); ctx.fillStyle = s === 5 && f[i] === 8 ? col.s[3] : col.s[0]; ctx.globalAlpha = s === 4 ? 0.3 : 0.65; ctx.fillRect(x, Y(f[i]), bw, B - Y(f[i])); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.strokeRect(x, Y(f[i]), bw, B - Y(f[i])); ctx.restore(); text(ctx, String(f[i]), x + bw / 2, Y(f[i]) - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    [0, 10, 20, 30, 40, 50].forEach((v, i) => text(ctx, String(v), O + i * bw, B + 11, { color: col.ink, size: 11, align: 'center' }));
    text(ctx, 'marks', (L + w) / 2, h - 6, { color: col.muted, size: 10.5, align: 'center' });
    if (s >= 4) { const pts = [[-0.5, 0], ...f.map((v, i) => [i + 0.5, v]), [5.5, 0]].map(([a, v]) => [O + a * bw, Y(v)]); ctx.save(); ctx.strokeStyle = col.s[6]; ctx.lineWidth = 2.4; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.fillStyle = col.s[6]; pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill(); }); ctx.restore(); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
