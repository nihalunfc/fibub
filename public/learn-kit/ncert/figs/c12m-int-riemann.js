// Class 12 Maths, Integrals: the definite integral as the limit of sums. Cut [a, b] into n strips and add the
// rectangle areas (left corners, right corners, midpoints, or trapezoids). As n grows every sum closes in on the same
// number, the integral, which the slider lets you watch. A second plot shows how the error shrinks.
import { canvas, axes, row, slider, choice, readout, line, text, title } from '../../kit.js';

const FN = { sq: ['x²', (x) => x * x, 0, 3, 9], sin: ['sin x', Math.sin, 0, Math.PI, 2], inv: ['1/x', (x) => 1 / x, 1, 4, Math.log(4)], exp: ['eˣ', Math.exp, 0, 1.5, Math.exp(1.5) - 1] };
export default function (host) {
  let k = 'sq', n = 4, m = 'L';
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 330, label: 'Rectangles under a curve whose total area approaches the integral as n grows' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'f(x)', Object.entries(FN).map(([i, v]) => [i, v[0]]), k, (v) => { k = v; re(); });
  choice(c1, 'height at', [['L', 'left'], ['R', 'right'], ['M', 'middle'], ['T', 'trapezoid']], m, (v) => { m = v; re(); });
  slider(c2, { label: 'strips n', min: 1, max: 100, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); re(); } });
  const sum = (nn) => { const [, f, a, b] = FN[k], d = (b - a) / nn; let s = 0; for (let i = 0; i < nn; i++) { const x0 = a + i * d, x1 = x0 + d; s += d * (m === 'L' ? f(x0) : m === 'R' ? f(x1) : m === 'M' ? f((x0 + x1) / 2) : (f(x0) + f(x1)) / 2); } return s; };
  const re = () => { cv.redraw(); const e = FN[k][4], s = sum(n); out.innerHTML = `Sum of ${n} strips = <b>${s.toFixed(4)}</b>. Exact integral = <b>${e.toFixed(4)}</b>. Error = ${(s - e).toFixed(4)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const [name, f, a, b] = FN[k], t = title(ctx, `Area under ${name} from ${a === 0 ? '0' : a} to ${b === Math.PI ? 'π' : b}`, col);
    let hi = 0; for (let i = 0; i <= 100; i++) hi = Math.max(hi, f(a + (b - a) * i / 100));
    const split = Math.round((h - t) * 0.68), g = axes(ctx, w, t + split, col, { x: [a - (b - a) * 0.05, b + (b - a) * 0.05], y: [0, hi * 1.1], l: 36, b: 22, t: t + 4, r: 12 });
    const d = (b - a) / n;
    ctx.save(); g.clip(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[0];
    for (let i = 0; i < n; i++) {
      const x0 = a + i * d, x1 = x0 + d; ctx.beginPath();
      if (m === 'T') { ctx.moveTo(g.X(x0), g.Y(0)); ctx.lineTo(g.X(x0), g.Y(f(x0))); ctx.lineTo(g.X(x1), g.Y(f(x1))); ctx.lineTo(g.X(x1), g.Y(0)); }
      else { const hh = f(m === 'L' ? x0 : m === 'R' ? x1 : (x0 + x1) / 2); ctx.rect(g.X(x0), g.Y(hh), g.X(x1) - g.X(x0), g.Y(0) - g.Y(hh)); }
      ctx.fill(); ctx.globalAlpha = 0.9; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 0.3;
    }
    ctx.globalAlpha = 1;
    const pts = []; for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; pts.push([g.X(x), g.Y(f(x))]); } line(ctx, pts, col.ink, 2.5); ctx.restore();
    // error panel
    const oy = t + split + 6, hh = h - oy - 4, ex = FN[k][4];
    const N = [1, 2, 4, 8, 16, 32, 64, 100], errs = N.map((q) => Math.abs(sum(q) - ex) + 1e-6);
    const l = 36, r = w - 12, y0 = oy + 12, y1 = oy + hh - 14, mx = Math.max(...errs);
    text(ctx, 'error against n', l, oy + 4, { color: col.muted, size: 10.5 });
    line(ctx, [[l, y0], [l, y1], [r, y1]], col.muted, 1);
    line(ctx, N.map((q, i) => [l + (r - l) * i / (N.length - 1), y1 - (y1 - y0) * errs[i] / mx]), col.s[3], 2);
    const i0 = N.findIndex((q) => q >= n); const ix = i0 < 0 ? N.length - 1 : i0;
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(l + (r - l) * ix / (N.length - 1), y1 - (y1 - y0) * (Math.abs(sum(N[ix]) - ex) + 1e-6) / mx, 4, 0, 7); ctx.fill();
    text(ctx, 'n = 1 … 100', r, y1 + 9, { color: col.muted, size: 10, align: 'right' });
  };
  re();
}
