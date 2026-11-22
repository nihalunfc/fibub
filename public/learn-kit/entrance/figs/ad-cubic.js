// Applications of derivatives on a cubic f(x) = x³ + ax² + bx + c. The top graph is f with its tangent at x₀,
// local maximum and minimum (where f′ = 0 and changes sign) and the point of inflection; the strip underneath shows
// the sign of f′ (increasing where it is above the axis). The readout counts the real roots from the values at the
// turning points.
import { canvas, axes, line, dot, row, slider, readout, fmt, text } from '../../kit.js';

export default function (host) {
  let a = 0, b = -3, c = 0, x0 = 1.5;
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 280, label: 'A cubic with its tangent line, turning points and the graph of its derivative' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'a', min: -4, max: 4, step: 0.25, value: a, fmt: (v) => fmt(v, 3), oninput: (v) => { a = v; re(); } });
  slider(ctl, { label: 'b', min: -6, max: 6, step: 0.25, value: b, fmt: (v) => fmt(v, 3), oninput: (v) => { b = v; re(); } });
  slider(ctl, { label: 'c (shift up)', min: -6, max: 6, step: 0.25, value: c, fmt: (v) => fmt(v, 3), oninput: (v) => { c = v; re(); } });
  slider(ctl, { label: 'x₀ (tangent)', min: -3, max: 3, step: 0.05, value: x0, fmt: (v) => fmt(v, 3), oninput: (v) => { x0 = v; re(); } });
  const out = readout(host);
  const f = (x) => x ** 3 + a * x * x + b * x + c, d = (x) => 3 * x * x + 2 * a * x + b;
  const crit = () => { const D = 4 * a * a - 12 * b; if (D <= 0) return []; const s = Math.sqrt(D); return [(-2 * a - s) / 6, (-2 * a + s) / 6]; };
  const show = () => {
    const cr = crit(), m = d(x0);
    let roots;
    if (cr.length < 2) roots = 'No turning points: f is monotonic, so it has exactly one real root.';
    else { const p = f(cr[0]) * f(cr[1]); roots = p < 0 ? 'f(max) and f(min) have opposite signs: three real roots.' : Math.abs(p) < 1e-9 ? 'One turning point touches the axis: a repeated root.' : 'f(max) and f(min) have the same sign: only one real root.'; }
    const ext = cr.length === 2 ? `Local max at x = ${fmt(cr[0], 3)} (f = ${fmt(f(cr[0]), 3)}), local min at x = ${fmt(cr[1], 3)} (f = ${fmt(f(cr[1]), 3)}). ` : '';
    out.innerHTML = `Tangent at x₀ = ${fmt(x0, 3)}: slope f′(x₀) = <b>${fmt(m, 3)}</b> (${m > 0 ? 'increasing' : m < 0 ? 'decreasing' : 'stationary'}), y = ${fmt(m, 3)}x ${f(x0) - m * x0 < 0 ? '−' : '+'} ${fmt(Math.abs(f(x0) - m * x0), 3)}. ${ext}Inflection at x = −a/3 = ${fmt(-a / 3, 3)}. ${roots}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.68;
    // f
    ctx.save();
    const A = axes(ctx, w, top, col, { x: [-3.5, 3.5], y: [-10, 10], ylabel: 'f(x)', b: 20 });
    ctx.save(); A.clip();
    line(ctx, [[A.X(-4), A.Y(0)], [A.X(4), A.Y(0)]], col.muted, 1);
    const pts = []; for (let x = -3.5; x <= 3.5; x += 0.02) pts.push([A.X(x), A.Y(Math.max(-30, Math.min(30, f(x))))]);
    line(ctx, pts, col.s[0], 2.5);
    const m = d(x0), y0 = f(x0);
    line(ctx, [[A.X(-4), A.Y(y0 + m * (-4 - x0))], [A.X(4), A.Y(y0 + m * (4 - x0))]], col.s[2], 1.5, [6, 4]);
    ctx.restore();
    const cr = crit();
    cr.forEach((x, i) => { if (Math.abs(f(x)) < 10) { dot(ctx, A.X(x), A.Y(f(x)), 5, col.s[1]); text(ctx, i ? 'min' : 'max', A.X(x), A.Y(f(x)) + (i ? 14 : -14), { color: col.s[1], size: 11, align: 'center', halo: col.panel }); } });
    if (Math.abs(f(-a / 3)) < 10) dot(ctx, A.X(-a / 3), A.Y(f(-a / 3)), 4, col.ink);
    if (Math.abs(y0) < 10) dot(ctx, A.X(x0), A.Y(y0), 5, col.s[2]);
    ctx.restore();
    // f′ strip
    ctx.save(); ctx.translate(0, top);
    const B = axes(ctx, w, h - top, col, { x: [-3.5, 3.5], y: [-8, 8], xlabel: 'x', ylabel: 'f′(x)', t: 8, yt: [-8, 0, 8] });
    ctx.save(); B.clip();
    const q = []; for (let x = -3.5; x <= 3.5; x += 0.02) q.push([B.X(x), B.Y(Math.max(-20, Math.min(20, d(x))))]);
    line(ctx, [[B.X(-4), B.Y(0)], [B.X(4), B.Y(0)]], col.muted, 1);
    line(ctx, q, col.s[4] || col.s[1], 2);
    ctx.restore();
    dot(ctx, B.X(x0), B.Y(Math.max(-8, Math.min(8, d(x0)))), 4, col.s[2]);
    ctx.restore();
  };
  re();
}
