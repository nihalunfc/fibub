// Class 9 Data: bar graph or histogram? A bar graph is for categories (favourite sports): bars have gaps and can be put in any order.
// A histogram is for numbers cut into classes: bars touch and the order is fixed by the number line.
import { canvas, text, title, row, choice, button, readout } from '../../kit.js';

export default function (host) {
  let mode = 'bar', order = [0, 1, 2, 3, 4];
  const cat = [['Cricket', 14], ['Football', 9], ['Kabaddi', 6], ['Hockey', 4], ['Badminton', 7]], cls = [['0–10', 3], ['10–20', 6], ['20–30', 11], ['30–40', 8], ['40–50', 4]];
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'The same kind of bars drawn as a bar graph with gaps or a histogram without gaps' });
  const c = row(host); choice(c, 'Draw as', [['bar', 'Bar graph (categories)'], ['hist', 'Histogram (classes)']], mode, (v) => { mode = v; upd(); });
  const c2 = row(host); button(c2, 'Shuffle the bars', () => { if (mode === 'bar') { order = order.slice(); for (let i = 4; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } } upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const d = mode === 'bar' ? order.map((i) => cat[i]) : cls, t = title(ctx, mode === 'bar' ? 'Favourite sport (14 + 9 + 6 + 4 + 7 = 40)' : 'Marks of 32 students (classes)', col), L = 32, B = h - 40, Tp = t + 14, mx = 14, bw = (w - L - 12) / 5, Y = (v) => B - (v / mx) * (B - Tp);
    for (let y = 0; y <= mx; y += 2) { ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, Y(y)); ctx.lineTo(w - 10, Y(y)); ctx.stroke(); ctx.restore(); text(ctx, String(y), L - 5, Y(y), { color: col.muted, size: 10, align: 'right' }); }
    d.forEach(([n, v], i) => { const gap = mode === 'bar' ? bw * 0.18 : 0, x = L + i * bw + gap / 2, ww = bw - gap; ctx.save(); ctx.fillStyle = col.s[mode === 'bar' ? 3 : 0]; ctx.globalAlpha = 0.65; ctx.fillRect(x, Y(v), ww, B - Y(v)); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.strokeRect(x, Y(v), ww, B - Y(v)); ctx.restore(); text(ctx, String(v), x + ww / 2, Y(v) - 7, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, n, x + ww / 2, B + 12, { color: col.ink, size: 10, align: 'center' }); });
    text(ctx, mode === 'bar' ? 'gaps: each bar is a separate category' : 'no gaps: classes join one after another', w / 2, h - 8, { color: col.muted, size: 11, align: 'center' });
  };
  function upd() { out.innerHTML = mode === 'bar' ? 'Bar graph: the categories have no natural order, so you may shuffle them (try it). The <b>height</b> shows the frequency, and the width means nothing.' : 'Histogram: the classes follow the number line (0–10, 10–20, ...), so you <b>cannot</b> shuffle them. Bars touch, because 10 is where one class ends and the next begins.'; cv.redraw(); }
  upd();
}
