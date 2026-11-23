// Class 8 Tales by Dots and Lines: mean, median and mode. The median is the middle value once the data is in order; the mean
// is pulled by one very large value but the median is not. Slide the last score up and watch.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const BASE = [8, 10, 11, 12, 12, 13, 14, 15];
export default function (host) {
  let last = 16;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 240, label: 'Nine scores as dots on a number line with mean, median and mode' });
  const ctl = row(host);
  slider(ctl, { label: 'The ninth score', min: 10, max: 60, step: 1, value: last, fmt: (v) => v, oninput: (v) => { last = v; sync(); } });
  const out = readout(host);
  const data = () => [...BASE, last].sort((a, b) => a - b);
  const stats = () => { const d = data(), mean = d.reduce((a, b) => a + b, 0) / d.length, med = d[4], cnt = {}; d.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const mode = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || a - b)[0]; return { d, mean, med, mode }; };
  function sync() { const { d, mean, med, mode } = stats(); out.innerHTML = `In order: ${d.join(', ')}. Median = 5th of 9 = <b>${med}</b>. Mean = ${d.reduce((a, b) => a + b, 0)} ÷ 9 = <b>${+mean.toFixed(1)}</b>. Mode (most often) = <b>${mode}</b>. Push the last score up: the mean runs away, the median hardly moves.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Scores on a number line', col), { d, mean, med, mode } = stats(), L = 20, W = w - 40, lo = 5, hi = 62, X = (v) => L + ((v - lo) / (hi - lo)) * W, y0 = h - 70;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, y0); ctx.lineTo(L + W, y0); ctx.stroke();
    for (let v = 10; v <= 60; v += 10) { ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y0 + 5); ctx.stroke(); text(ctx, String(v), X(v), y0 + 16, { color: col.muted, size: 10, align: 'center' }); }
    const seen = {}; d.forEach((v, i) => { const k = (seen[v] = (seen[v] || 0) + 1); ctx.fillStyle = i === 4 ? col.s[2] : v === last && i === d.lastIndexOf(last) && last > 15 ? col.s[3] : col.s[0]; ctx.beginPath(); ctx.arc(X(v), y0 - 10 - (k - 1) * 14, 6, 0, 7); ctx.fill(); });
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(med), top + 8); ctx.lineTo(X(med), y0); ctx.stroke(); text(ctx, 'median ' + med, X(med) + 5, top + 14, { color: col.s[2], size: 11, weight: 700 });
    ctx.strokeStyle = col.s[3]; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(mean), top + 32); ctx.lineTo(X(mean), y0); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'mean ' + +mean.toFixed(1), Math.min(X(mean) + 5, L + W - 70), top + 38, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'mode ' + mode, L, h - 12, { color: col.ink, size: 11, weight: 600 });
  };
  sync();
}
