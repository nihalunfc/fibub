// 2.5 Fraction bars: compare two fractions by cutting the same bar into equal parts.
import { canvas, text, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.35, max: 220, min: 170, label: 'Two fractions drawn as bars' });
  let a = 3, b = 5, c = 5, d = 8;
  const ctl = row(host), f = (v) => String(Math.round(v));
  slider(ctl, { label: 'Top a', min: 1, max: 11, step: 1, value: a, fmt: f, oninput: (v) => { a = Math.min(Math.round(v), b); go(); } });
  slider(ctl, { label: 'Bottom b', min: 2, max: 12, step: 1, value: b, fmt: f, oninput: (v) => { b = Math.round(v); a = Math.min(a, b); go(); } });
  slider(ctl, { label: 'Top c', min: 1, max: 11, step: 1, value: c, fmt: f, oninput: (v) => { c = Math.min(Math.round(v), d); go(); } });
  slider(ctl, { label: 'Bottom d', min: 2, max: 12, step: 1, value: d, fmt: f, oninput: (v) => { d = Math.round(v); c = Math.min(c, d); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); const L = a * d, R = c * b; out.innerHTML = `Cross-multiply: ${a} × ${d} = ${L} and ${c} × ${b} = ${R}, so ${a}/${b} ${L > R ? '&gt;' : L < R ? '&lt;' : '='} ${c}/${d} (${(a / b).toFixed(3)} vs ${(c / d).toFixed(3)}).`; };
  cv.draw = (ctx, w, h, col) => {
    const L = 60, R = w - 20, bh = 30;
    [[a, b, h * 0.32, col.s[0]], [c, d, h * 0.68, col.s[1]]].forEach(([t, n, y, cl]) => {
      for (let i = 0; i < n; i++) { const x = L + (i / n) * (R - L); ctx.fillStyle = i < t ? cl : col.soft; ctx.fillRect(x + 1, y - bh / 2, (R - L) / n - 2, bh); }
      text(ctx, `${t}/${n}`, 28, y, { color: col.ink, size: 14, weight: 700, align: 'center' });
    });
    title(ctx, 'Same whole, different cuts', col);
  };
  go();
}
