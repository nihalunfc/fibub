// Class 10 Polynomials: zeros and coefficients of a quadratic. Choose the zeros alpha and beta and a multiplier k; the polynomial
// k(x - alpha)(x - beta) = k x^2 - k(alpha + beta) x + k alpha beta, so sum = -b/a and product = c/a, shown live next to the graph.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

const SUP = { 2: '²', 3: '³' };
const num = (v) => String(+v.toFixed(2)).replace('-', '−');
const poly = (c) => { const d = c.length - 1; let s = ''; c.forEach((v, i) => { const e = d - i; if (!v) return; const a = Math.abs(v); let t = (a === 1 && e > 0) ? '' : num(a); t += e > 1 ? 'x' + SUP[e] : e === 1 ? 'x' : ''; s += s ? ` ${v < 0 ? '−' : '+'} ${t}` : (v < 0 ? '−' : '') + t; }); return s || '0'; };
const val = (c, x) => c.reduce((a, v) => a * x + v, 0);
const roots = (c, lo = -6, hi = 6) => { const f = (x) => val(c, x), r = []; let px = lo, py = f(px);
  for (let i = 1; i <= 1500; i++) { const x = lo + (hi - lo) * i / 1500, y = f(x); if (py === 0) r.push(px); else if (py * y < 0) { let a = px, b = x; for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } r.push((a + b) / 2); } px = x; py = y; }
  if (c.length === 3) { const D = c[1] * c[1] - 4 * c[0] * c[2]; if (Math.abs(D) < 1e-9 && c[0]) return [-c[1] / (2 * c[0])]; }
  return r; };
const curve = (ctx, ax, c, x0, x1, color, w = 2.5) => { ctx.save(); ax.clip(); const pts = []; for (let i = 0; i <= 240; i++) { const x = x0 + (x1 - x0) * i / 240; pts.push([ax.X(x), ax.Y(val(c, x))]); } line(ctx, pts, color, w); ctx.restore(); };
export default function (host) {
  let al = 1, be = 3, k = 1;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Quadratic built from chosen zeros with the sum and product of zeros compared with the coefficients' });
  const ctl = row(host);
  slider(ctl, { label: 'Zero α', min: -4, max: 4, step: 0.5, value: al, fmt: num, oninput: (v) => { al = v; upd(); } });
  slider(ctl, { label: 'Zero β', min: -4, max: 4, step: 0.5, value: be, fmt: num, oninput: (v) => { be = v; upd(); } });
  slider(ctl, { label: 'Multiplier k (= a)', min: 0.5, max: 3, step: 0.5, value: k, fmt: num, oninput: (v) => { k = v; upd(); } });
  const out = readout(host);
  const C = () => [k, -k * (al + be), k * al * be];
  cv.draw = (ctx, w, h, col) => {
    const c = C(), t = title(ctx, 'p(x) = ' + poly(c), col) + 2;
    const ax = axes(ctx, w, h, col, { x: [-6, 6], y: [-10, 14], t: t + 4, xt: [-4, -2, 0, 2, 4], yt: [-10, -5, 0, 5, 10], xlabel: 'x', ylabel: 'p(x)', b: 36 });
    curve(ctx, ax, c, -6, 6, col.s[0]);
    [al, be].forEach((r, i) => { dot(ctx, ax.X(r), ax.Y(0), 6, col.s[i ? 1 : 2], col.ink); text(ctx, i ? 'β' : 'α', ax.X(r), ax.Y(0) + (i ? -14 : 14), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); });
  };
  function upd() { const [a, b, c] = C();
    out.innerHTML = `Zeros α = ${num(al)}, β = ${num(be)}; a = ${num(a)}, b = ${num(b)}, c = ${num(c)}.<br>α + β = <b>${num(al + be)}</b> and −b/a = ${num(-b)}/${num(a)} = <b>${num(-b / a)}</b>.<br>α × β = <b>${num(al * be)}</b> and c/a = ${num(c)}/${num(a)} = <b>${num(c / a)}</b>.`; cv.redraw(); }
  upd();
}
