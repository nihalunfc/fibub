// A rolling mean smooths a noisy series by averaging the last k values. Slide k up and the line gets smoother but
// reacts later; "centred" removes the lag; min_periods decides whether the first rows are NaN. Try: set k to 7 on
// the weekly-wavy data and watch the weekly wobble vanish.
import { canvas, text, row, choice, slider, readout, title, axes, line, dot, rng } from '../kit.js';

const r = rng(5), N = 40, y = Array.from({ length: N }, (_, i) => 50 + 10 * Math.sin((i / 7) * 2 * Math.PI) + i * 0.4 + (r() - 0.5) * 8);
export default function (host) {
  let k = 7, ctr = false, minp = 'k';
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'A noisy series with its rolling mean' });
  const c1 = row(host); slider(c1, { label: 'window', min: 1, max: 15, step: 1, value: k, fmt: (v) => String(Math.round(v)), oninput: (v) => { k = Math.round(v); draw(); } });
  const c2 = row(host); choice(c2, 'Window', [[false, 'trailing'], [true, 'centred']], ctr, (v) => { ctr = v; draw(); });
  choice(c2, 'min_periods', [['k', '= window (NaN first rows)'], ['1', '1 (never NaN)']], minp, (v) => { minp = v; draw(); });
  const out = readout(host);
  const roll = () => y.map((_, i) => { const lo = ctr ? i - Math.floor(k / 2) : i - k + 1, hi = ctr ? lo + k - 1 : i, a = Math.max(0, lo), b = Math.min(N - 1, hi), n = b - a + 1; if (n < (minp === '1' ? 1 : k)) return null; return y.slice(a, b + 1).reduce((s, v) => s + v, 0) / n; });
  function draw() { const rr = roll(); out.innerHTML = `<code>s.rolling(${k}${ctr ? ', center=True' : ''}${minp === '1' ? ', min_periods=1' : ''}).mean()</code>: <b>${rr.filter((v) => v === null).length}</b> NaN at the edges. Bigger windows smooth more but ${ctr ? 'need future values' : 'lag behind the data'}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, N - 1], y: [30, 80], xlabel: 'day', l: 36, t: 26 });
    title(ctx, 'Raw series (dots) and rolling mean (line)', col);
    y.forEach((v, i) => dot(ctx, ax.X(i), ax.Y(v), 2.5, col.muted));
    const rr = roll(); let seg = [];
    const flush = () => { line(ctx, seg, col.s[0], 2.5); seg = []; };
    rr.forEach((v, i) => { if (v === null) { flush(); dot(ctx, ax.X(i), ax.B - 3, 2, col.bad); } else seg.push([ax.X(i), ax.Y(v)]); });
    flush();
    text(ctx, 'red = NaN', ax.R - 4, ax.B - 12, { color: col.bad, size: 10, align: 'right' });
  };
  draw();
}
