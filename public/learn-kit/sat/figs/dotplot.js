// 4.3 Mean versus median on a dot plot. Drag the last value with the slider: the mean (a balance point) chases it,
// the median (the middle position) barely moves. data-values="3,4,4,5,6,7" sets the starting data.
import { canvas, axes, dot, line, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  const base = (host.dataset.values || '3,4,4,5,5,6,7').split(',').map(Number);
  const S = { last: Number(host.dataset.last || 8) };
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Dot plot with the mean and the median marked' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Last value', min: 0, max: 30, step: 1, value: S.last, fmt: (v) => String(v), oninput: (v) => { S.last = v; cv.redraw(); show(); } });
  const data = () => [...base, S.last];
  const stats = () => {
    const d = data().sort((a, b) => a - b), n = d.length, mean = d.reduce((s, x) => s + x, 0) / n;
    const med = n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2;
    return { d, mean, med };
  };
  cv.draw = (ctx, w, h, col) => {
    const { d, mean, med } = stats();
    const A = axes(ctx, w, h, col, { x: [0, 30], y: [0, 6], yt: [], grid: false, l: 16, t: 34, xlabel: 'value' });
    const cnt = {};
    for (const x of d) { cnt[x] = (cnt[x] || 0) + 1; dot(ctx, A.X(x), A.Y(cnt[x] - 0.5), 6, x === S.last ? col.s[1] : col.s[0]); }
    line(ctx, [[A.X(mean), A.T], [A.X(mean), A.B]], col.s[2], 2, [5, 4]);
    line(ctx, [[A.X(med), A.T + 14], [A.X(med), A.B]], col.ink, 2);
    text(ctx, `mean ${fmt(mean)}`, A.X(mean) + 4, A.T + 4, { color: col.s[2], size: 12, weight: 700 });
    text(ctx, `median ${fmt(med)}`, A.X(med) + 4, A.T + 20, { color: col.ink, size: 12, weight: 700 });
  };
  const show = () => {
    const { mean, med } = stats();
    out.innerHTML = `Mean <b>${fmt(mean)}</b> (dashed line), median <b>${fmt(med)}</b> (solid line). Move the last value far to the right: the mean follows it, the median hardly moves. That is why the median is the better "typical value" when there are outliers.`;
  };
  cv.redraw(); show();
}
