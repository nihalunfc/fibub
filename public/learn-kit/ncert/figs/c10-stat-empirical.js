// Class 10 Statistics: mean, median and mode of three shapes of data, and the empirical relation
// mode ≈ 3 × median − 2 × mean, which works well for data that is only moderately skewed. For a long tail to the
// right the mean is pulled the furthest, then the median, and the mode stays near the peak.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const DS = {
  right: { name: 'Tail to the right (e.g. savings)', f: [12, 16, 8, 3, 1] },
  sym: { name: 'Symmetric (e.g. heights)', f: [3, 8, 16, 8, 3] },
  left: { name: 'Tail to the left (e.g. easy exam)', f: [1, 3, 8, 16, 12] },
};
const W = 20;
export function stats(f) {
  const n = f.reduce((s, v) => s + v, 0), mean = f.reduce((s, v, i) => s + v * (W * i + W / 2), 0) / n;
  let c = 0, mi = 0; for (let i = 0; i < f.length; i++) { if (c + f[i] >= n / 2) { mi = i; break; } c += f[i]; }
  const median = W * mi + ((n / 2 - c) / f[mi]) * W;
  const m = f.indexOf(Math.max(...f)), f0 = f[m - 1] ?? 0, f2 = f[m + 1] ?? 0, mode = W * m + W * (f[m] - f0) / (2 * f[m] - f0 - f2);
  return { n, mean, median, mode };
}

export default function (host) {
  let key = 'right';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A histogram with markers for the mean, median and mode' });
  const ctl = row(host);
  choice(ctl, 'Shape', [['right', 'Tail right'], ['sym', 'Symmetric'], ['left', 'Tail left']], key, (v) => { key = v; say(); });
  const out = readout(host);
  function say() {
    const s = stats(DS[key].f), emp = 3 * s.median - 2 * s.mean;
    out.innerHTML = `Mean ${s.mean.toFixed(1)}, median ${s.median.toFixed(1)}, mode ${s.mode.toFixed(1)}. Check: 3 × median − 2 × mean = <b>${emp.toFixed(1)}</b>, close to the mode ${s.mode.toFixed(1)}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const d = DS[key], s = stats(d.f), top = title(ctx, d.name, col);
    const L = 14, R = w - 14, B = h - 66, T = top + 20, X = (v) => L + (v / 100) * (R - L), fm = Math.max(...d.f) + 1, u = (B - T) / fm;
    d.f.forEach((f, i) => { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(X(W * i), B - f * u, X(W) - X(0), f * u); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(X(W * i), B - f * u, X(W) - X(0), f * u); text(ctx, String(W * i), X(W * i), B + 10, { color: col.muted, size: 10, align: 'center' }); });
    text(ctx, '100', X(100), B + 10, { color: col.muted, size: 10, align: 'center' });
    [['mean', s.mean, col.s[3], 0], ['median', s.median, col.s[1], 1], ['mode', s.mode, col.s[2], 2]].forEach(([nm, v, c, j]) => {
      ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(v), T - 4); ctx.lineTo(X(v), B); ctx.stroke();
      text(ctx, `${nm} ${v.toFixed(1)}`, X(v), B + 24 + j * 13, { color: c, size: 11, weight: 700, align: 'center' });
    });
  };
  say();
}
