// Class 11 Maths, Binomial Theorem: a quick estimate of (1 + x)ⁿ when x is small, using only the first few terms:
// (1 + x)ⁿ ≈ 1 + nx + n(n−1)/2 · x² + ... Each extra term brings the sum closer to the exact value.
// Example: 1.02¹⁰ = (1 + 0.02)¹⁰ ≈ 1 + 0.2 + 0.018 + ... ≈ 1.219.
import { canvas, row, slider, readout, text, title } from '../../kit.js';

const C = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return v; };
export default function (host) {
  let n = 10, x = 0.02, t = 2;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Partial sums of the binomial expansion of 1 plus x to the n approaching the exact value' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'n', min: 2, max: 20, step: 1, value: n, fmt: String, oninput: (v) => { n = v; re(); } });
  slider(c1, { label: 'x', min: 0.005, max: 0.2, step: 0.005, value: x, fmt: (v) => v.toFixed(3), oninput: (v) => { x = v; re(); } });
  slider(c1, { label: 'terms used', min: 1, max: 6, step: 1, value: t, fmt: String, oninput: (v) => { t = v; re(); } });
  const part = (k) => { let s = 0; for (let j = 0; j < k; j++) s += C(n, j) * x ** j; return s; };
  const re = () => { cv.redraw(); const ex = (1 + x) ** n, ap = part(t); out.innerHTML = `(1 + ${x.toFixed(3)})<sup>${n}</sup> = <b>${ex.toFixed(5)}</b>. The first ${t} term${t > 1 ? 's' : ''} give <b>${ap.toFixed(5)}</b>, an error of ${Math.abs(ex - ap).toExponential(1)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `(1 + x)^n with the first ${t} term${t > 1 ? 's' : ''}`, col), ex = (1 + x) ** n, lo = 1, hi = 1 + (Math.max(ex, part(6)) - 1) * 1.3 + 1e-9, y0 = top + 20, bh = h - y0 - 30, bw = (w - 40) / 6;
    const Y = (v) => y0 + bh - ((v - lo) / (hi - lo)) * bh;
    for (let k = 1; k <= 6; k++) { const v = part(k), x0 = 20 + (k - 1) * bw; ctx.fillStyle = k <= t ? col.s[0] : col.line; ctx.globalAlpha = k <= t ? 0.55 : 0.5; ctx.fillRect(x0 + 4, Y(v), bw - 8, y0 + bh - Y(v)); ctx.globalAlpha = 1; text(ctx, k + ' term' + (k > 1 ? 's' : ''), x0 + bw / 2, y0 + bh + 12, { color: col.muted, size: 10.5, align: 'center' }); }
    ctx.setLineDash([6, 4]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(18, Y(ex)); ctx.lineTo(w - 18, Y(ex)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `exact ${ex.toFixed(4)}`, w - 20, Y(ex) - 9, { color: col.s[1], size: 11.5, weight: 700, align: 'right' });
  };
  re();
}
