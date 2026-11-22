// 3.5 Simple interest grows in a straight line, compound interest curves upward. Slide the rate and years.
import { canvas, axes, line, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 220, label: 'Graph of amount against years for simple and compound interest' });
  let P = 10000, r = 10, n = 10;
  const ctl = row(host);
  slider(ctl, { label: 'Rate a year', min: 2, max: 20, step: 1, value: r, fmt: (v) => `${v}%`, oninput: (v) => { r = v; go(); } });
  slider(ctl, { label: 'Years', min: 1, max: 20, step: 1, value: n, fmt: String, oninput: (v) => { n = v; go(); } });
  const out = readout(host);
  const si = (t) => P * (1 + (r * t) / 100), ci = (t) => P * (1 + r / 100) ** t;
  const go = () => { cv.redraw(); out.innerHTML = `On ₹10,000 after ${n} years: simple ₹${Math.round(si(n)).toLocaleString('en-IN')}, compound ₹${Math.round(ci(n)).toLocaleString('en-IN')}. The gap, <b>₹${Math.round(ci(n) - si(n)).toLocaleString('en-IN')}</b>, is interest earned on interest.`; };
  cv.draw = (ctx, w, h, col) => {
    const ymax = Math.max(ci(n), 20000) * 1.05;
    const ax = axes(ctx, w, h, col, { x: [0, n], y: [0, ymax], xlabel: 'years', ylabel: 'amount (₹)', l: 62, fy: (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)) });
    const pts = (f) => Array.from({ length: 41 }, (_, i) => { const t = (i / 40) * n; return [ax.X(t), ax.Y(f(t))]; });
    line(ctx, pts(si), col.s[0], 2.5); line(ctx, pts(ci), col.s[3], 2.5);
    text(ctx, 'simple', ax.X(n) - 4, ax.Y(si(n)) + 12, { color: col.s[0], size: 12, weight: 600, align: 'right' });
    text(ctx, 'compound', ax.X(n) - 4, ax.Y(ci(n)) - 12, { color: col.s[3], size: 12, weight: 600, align: 'right' });
  };
  go();
}
