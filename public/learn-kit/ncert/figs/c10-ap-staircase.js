// Class 10 Arithmetic Progressions: an AP as a staircase. Every step is the same height d taller (or shorter) than the
// one before. Change the first term a, the common difference d and the number of terms n; the n-th term is a + (n - 1)d.
import { canvas, text, title, line, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let a = 3, d = 4, n = 6;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Bars forming a staircase whose steps all rise by the same amount' });
  const ctl = row(host);
  slider(ctl, { label: 'first term a', min: -10, max: 20, step: 1, value: a, oninput: (v) => { a = v; go(); } });
  slider(ctl, { label: 'common difference d', min: -6, max: 8, step: 1, value: d, oninput: (v) => { d = v; go(); } });
  slider(ctl, { label: 'terms shown n', min: 2, max: 12, step: 1, value: n, oninput: (v) => { n = v; go(); } });
  const out = readout(host);
  const T = () => Array.from({ length: n }, (_, i) => a + i * d);
  function go() {
    const t = T();
    out.innerHTML = `${t.slice(0, 6).join(', ')}${n > 6 ? ', …, ' + t[n - 1] : ''}. &nbsp; a<sub>n</sub> = a + (n − 1)d = ${a} + ${n - 1} × ${d} = <b>${t[n - 1]}</b>. ${d > 0 ? 'Rising: d is positive.' : d < 0 ? 'Falling: d is negative.' : 'Flat: d = 0, every term is the same.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `AP: a = ${a}, d = ${d}`, col) + 16;
    const t = T(), lo = Math.min(0, ...t), hi = Math.max(0, ...t), L = 14, R = w - 14, B = h - 40, H = B - top - 14;
    const sc = H / Math.max(1, hi - lo), zero = top + 14 + hi * sc, bw = (R - L) / n;
    line(ctx, [[L, zero], [R, zero]], col.muted, 1.5);
    t.forEach((v, i) => {
      const x = L + i * bw, y = v >= 0 ? zero - v * sc : zero;
      ctx.fillStyle = v >= 0 ? col.s[0] : col.s[3]; ctx.globalAlpha = 0.5 + 0.5 * (i / n); ctx.fillRect(x + 2, y, bw - 4, Math.abs(v) * sc); ctx.globalAlpha = 1;
      text(ctx, fmt(v), x + bw / 2, v >= 0 ? y - 8 : y + Math.abs(v) * sc + 10, { color: col.ink, size: Math.min(12, bw / 2.2 + 3), weight: 600, align: 'center' });
      text(ctx, 'a' + (i + 1 < 10 ? ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'][i] : String(i + 1)), x + bw / 2, B + 26, { color: col.muted, size: 10.5, align: 'center' });
    });
    if (n >= 2 && bw > 20) text(ctx, `+${d} each step`.replace('+-', '−'), (L + R) / 2, top + 2, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
