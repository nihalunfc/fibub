// Class 10 Statistics: choosing the right average. Nine students' pocket money (₹): 40, 50, 50, 60, 60, 60, 70, 80,
// and one more value you control. Slide it up: the mean chases it, the median barely moves and the mode does not
// move at all. That is why the median is used for incomes and house prices.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const BASE = [40, 50, 50, 60, 60, 60, 70, 80];
export default function (host) {
  let v = 60;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Pocket money dots on a line with markers for the mean, median and mode as one value changes' });
  const ctl = row(host);
  slider(ctl, { label: 'Last student’s ₹', min: 0, max: 600, step: 5, value: v, fmt: (x) => '₹' + x, oninput: (x) => { v = x; say(); } });
  const out = readout(host);
  const all = () => [...BASE, v].sort((a, b) => a - b);
  const st = () => { const a = all(), mean = a.reduce((s, x) => s + x, 0) / a.length, median = a[4]; const cnt = {}; a.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const mx = Math.max(...Object.values(cnt)); return { a, mean, median, mode: +Object.keys(cnt).find((k) => cnt[k] === mx) }; };
  function say() { const s = st(); out.innerHTML = `Mean = <b>₹${s.mean.toFixed(1)}</b>, median = <b>₹${s.median}</b>, mode = <b>₹${s.mode}</b>. ` + (v > 150 ? 'One rich friend and the mean no longer describes a typical student.' : 'Move the slider up to add a very rich friend.'); cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const s = st(), top = title(ctx, 'Which average survives one extreme value?', col), L = 20, R = w - 20, X = (x) => L + (x / 620) * (R - L), ly = h * 0.58;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, ly); ctx.lineTo(R, ly); ctx.stroke();
    for (let t = 0; t <= 600; t += 100) { text(ctx, String(t), X(t), ly + 14, { color: col.muted, size: 10, align: 'center' }); }
    const seen = {};
    s.a.forEach((x) => { seen[x] = (seen[x] || 0) + 1; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(X(x), ly - 8 - (seen[x] - 1) * 14, 6, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
    [['mean', s.mean, col.s[3], 0], ['median', s.median, col.s[1], 1], ['mode', s.mode, col.s[2], 2]].forEach(([nm, m, c, j]) => {
      const y = ly + 36 + j * 22;
      ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(m), ly + 4); ctx.lineTo(X(m), y - 8); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(X(m), y - 7); ctx.lineTo(X(m) - 6, y + 3); ctx.lineTo(X(m) + 6, y + 3); ctx.fill();
      text(ctx, `${nm} ₹${Math.round(m * 10) / 10}`, X(m) + (X(m) > w * 0.7 ? -10 : 10), y, { color: c, size: 11, weight: 700, align: X(m) > w * 0.7 ? 'right' : 'left' });
    });
  };
  say();
}
