// Class 9 Data: the median is the middle value once the data are lined up in order. With an odd count it is the middle one; with an even
// count it is the mean of the middle two. One very large value drags the mean up but hardly moves the median.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const BASE = [22, 18, 25, 20, 30, 24];
export default function (host) {
  let X = 26, cnt = 7, sorted = false;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'Bars of monthly pay lined up to find the median, with the mean marked' });
  const c1 = row(host); choice(c1, 'Order', [[false, 'As given'], [true, 'Line up']], sorted, (v) => { sorted = v; upd(); }); choice(c1, 'People', [[7, '7'], [8, '8']], cnt, (v) => { cnt = v; upd(); });
  const c2 = row(host); slider(c2, { label: 'Last person earns (₹ thousand)', min: 15, max: 150, step: 1, value: X, oninput: (v) => { X = v; upd(); } });
  const out = readout(host);
  const data = () => { const d = [...BASE]; if (cnt === 8) d.push(27); d.push(X); return d; };
  const stat = () => { const d = data(), s = [...d].sort((a, b) => a - b), n = d.length, med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; return { d, s, n, med, mean: d.reduce((a, b) => a + b, 0) / n }; };
  cv.draw = (ctx, w, h, col) => {
    const { d, s, n, med, mean } = stat(), arr = sorted ? s : d, t = title(ctx, 'Pay of ' + n + ' workers (₹ thousand)', col), L = 12, B = h - 34, Tp = t + 18, mx = Math.max(36, ...d) * 1.12, bw = (w - L - 12) / n, Y = (v) => B - (v / mx) * (B - Tp);
    arr.forEach((v, i) => { const x = L + i * bw, mid = sorted && (n % 2 ? i === (n - 1) / 2 : i === n / 2 - 1 || i === n / 2); ctx.save(); ctx.fillStyle = mid ? col.s[3] : col.s[0]; ctx.globalAlpha = mid ? 0.85 : 0.55; ctx.fillRect(x + bw * 0.1, Y(v), bw * 0.8, B - Y(v)); ctx.restore(); text(ctx, String(v), x + bw / 2, Y(v) - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); });
    const hl = (v, c, lab, dy) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - 8, Y(v)); ctx.stroke(); ctx.restore(); text(ctx, lab, w - 10, Y(v) + dy, { color: c, size: 11, weight: 700, align: 'right', halo: col.panel }); };
    hl(med, col.s[3], 'median ' + med, Y(med) > Y(mean) ? 12 : -10); hl(mean, col.s[6], 'mean ' + (+mean.toFixed(1)), Y(mean) > Y(med) ? 12 : -10);
    text(ctx, sorted ? 'lined up: the middle ' + (n % 2 ? 'bar is' : 'two bars are') + ' orange' : 'press “Line up” to sort the bars', w / 2, h - 10, { color: col.muted, size: 11, align: 'center' });
  };
  function upd() { const { s, n, med, mean } = stat(); out.innerHTML = `Lined up: ${s.join(', ')}. ` + (n % 2 ? `${n} values: the middle one (number ${(n + 1) / 2}) is <b>${med}</b>.` : `${n} values: the middle two are ${s[n / 2 - 1]} and ${s[n / 2]}, so the median is <b>${med}</b>.`) + ` Mean = ${+mean.toFixed(1)}. ` + (X > 60 ? 'The big value pulls the mean far above the median: for pay, the median is the fairer “typical” figure.' : ''); cv.redraw(); }
  upd();
}
