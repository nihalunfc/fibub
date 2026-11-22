// Statistics: a small data set as dots, its mean and a band of one standard deviation either side. Change every
// value to y = ax + b and see the rule: adding b moves the mean but not the spread; multiplying by a scales both
// the mean and the standard deviation (by |a|). Drag the last value away to see how one outlier pulls the mean
// and inflates the standard deviation, while the median barely moves.
import { canvas, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

const BASE = [4, 6, 7, 7, 8, 9, 10, 13];

export default function (host) {
  let a = 1, b = 0, last = 13;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Dot plot of a data set before and after a change of origin and scale, with mean and standard deviation' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'scale a', min: -2, max: 2, step: 0.25, value: a, fmt: (v) => fmt(v, 3), oninput: (v) => { a = v; re(); } });
  slider(ctl, { label: 'shift b', min: -10, max: 10, step: 1, value: b, oninput: (v) => { b = v; re(); } });
  slider(ctl, { label: 'last value', min: 10, max: 30, step: 1, value: last, oninput: (v) => { last = v; re(); } });
  const out = readout(host);
  const data = () => [...BASE.slice(0, -1), last];
  const stats = (xs) => {
    const n = xs.length, m = xs.reduce((s, x) => s + x, 0) / n, v = xs.reduce((s, x) => s + (x - m) ** 2, 0) / n;
    const srt = [...xs].sort((p, q) => p - q), med = n % 2 ? srt[(n - 1) / 2] : (srt[n / 2 - 1] + srt[n / 2]) / 2;
    const md = xs.reduce((s, x) => s + Math.abs(x - m), 0) / n;
    return { m, v, sd: Math.sqrt(v), med, md };
  };
  const show = () => {
    const x = stats(data()), y = stats(data().map((t) => a * t + b));
    out.innerHTML = `Original: mean ${fmt(x.m, 4)}, median ${fmt(x.med, 4)}, SD ${fmt(x.sd, 4)}, mean deviation ${fmt(x.md, 4)}. After y = ${fmt(a, 3)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}: mean <b>${fmt(y.m, 4)}</b> (= a × mean + b), SD <b>${fmt(y.sd, 4)}</b> (= |a| × SD), variance ${fmt(y.v, 4)} (= a² × variance). The shift b changes no measure of spread.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const xs = data(), ys = xs.map((t) => a * t + b), all = [...xs, ...ys];
    let lo = Math.min(...all, 0), hi = Math.max(...all, 15); const pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
    const L = 20, R = w - 20, X = (v) => L + ((v - lo) / (hi - lo)) * (R - L);
    const rowsY = [h * 0.36, h * 0.76];
    [[xs, 'original x', col.s[0]], [ys, 'new y = ax + b', col.s[1]]].forEach(([d, lab, c], i) => {
      const s = stats(d), yy = rowsY[i];
      ctx.fillStyle = c; ctx.globalAlpha = 0.12; ctx.fillRect(X(s.m - s.sd), yy - 22, X(s.m + s.sd) - X(s.m - s.sd), 44); ctx.globalAlpha = 1;
      line(ctx, [[L, yy], [R, yy]], col.line, 1);
      const seen = {};
      d.forEach((v) => { const k = v.toFixed(3); seen[k] = (seen[k] || 0) + 1; dot(ctx, X(v), yy - 6 - (seen[k] - 1) * 10, 4.5, c); });
      line(ctx, [[X(s.m), yy - 26], [X(s.m), yy + 14]], col.ink, 2);
      text(ctx, `mean ${fmt(s.m, 3)}`, X(s.m), yy + 24, { color: col.ink, size: 11, align: 'center' });
      text(ctx, lab, L, yy - 34, { color: c, size: 12, weight: 700 });
    });
    for (const t of [lo, (lo + hi) / 2, hi]) text(ctx, fmt(t, 3), X(t), h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  re();
}
