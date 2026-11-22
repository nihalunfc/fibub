// 5.1-5.2 Mean, median and standard deviation of a small list: drag sliders and watch all three move.
import { canvas, text, line, dot, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.4, max: 240, min: 190, label: 'Five values with their mean, median and standard deviation' });
  const v = [2, 5, 5, 6, 12];
  const ctl = row(host);
  v.forEach((x, i) => slider(ctl, { label: `Value ${i + 1}`, min: 0, max: 20, step: 1, value: x, fmt: (z) => String(Math.round(z)), oninput: (z) => { v[i] = Math.round(z); go(); } }));
  const out = readout(host);
  const stats = () => { const n = v.length, m = v.reduce((a, b) => a + b, 0) / n, s = [...v].sort((a, b) => a - b), sd = Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / n); return { m, med: s[2], sd, rng: s[4] - s[0] }; };
  const go = () => { cv.redraw(); const { m, med, sd, rng } = stats(); out.innerHTML = `Mean <b>${+m.toFixed(2)}</b> · median <b>${med}</b> · range ${rng} · standard deviation <b>${+sd.toFixed(2)}</b>. Drag one value far away: the mean and SD jump, the median barely moves.`; };
  cv.draw = (ctx, w, h, col) => {
    const L = 20, R = w - 20, y = h * 0.6, X = (x) => L + (x / 20) * (R - L), { m, med, sd } = stats();
    ctx.fillStyle = col.soft; ctx.fillRect(X(Math.max(0, m - sd)), y - 40, X(Math.min(20, m + sd)) - X(Math.max(0, m - sd)), 56);
    line(ctx, [[L, y], [R, y]], col.line, 2);
    for (let x = 0; x <= 20; x += 2) text(ctx, String(x), X(x), y + 16, { color: col.muted, size: 10, align: 'center' });
    const stack = {}; v.forEach((x) => { stack[x] = (stack[x] || 0) + 1; dot(ctx, X(x), y - 8 - (stack[x] - 1) * 13, 6, col.s[0]); });
    line(ctx, [[X(m), y - 46], [X(m), y + 4]], col.s[1], 2.5); text(ctx, 'mean', X(m), y - 54, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    line(ctx, [[X(med), y - 30], [X(med), y + 4]], col.s[2], 2, [4, 3]); text(ctx, 'median', X(med), y + 30, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    title(ctx, 'Shaded band: one standard deviation each side of the mean', col);
  };
  go();
}
