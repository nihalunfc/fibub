// Class 12 Maths, Differential Equations: dy/dt = ky. The rate of change is proportional to the amount present, which
// gives y = y₀eᵏᵗ. With k > 0 the amount grows (curd bacteria, money at compound interest), with k < 0 it decays
// (carbon-14, medicine in blood). Slide k and the time marker: the tangent is steeper when y is larger, and the
// doubling time (or half-life) is ln 2 / |k|.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title, loop } from '../../kit.js';

const CASE = { bac: ['bacteria in curd', 0.35, 'bacteria (thousands)'], rs: ['money at interest', 0.12, '₹ thousands'], c14: ['a radioactive sample', -0.3, 'atoms left (%)'], med: ['medicine in blood', -0.45, 'mg in blood'] };
export default function (host) {
  let id = 'bac', k = 0.35, t = 3, y0 = 2, g;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'An exponential curve for growth or decay with its tangent at a chosen time' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'example', Object.entries(CASE).map(([i, v]) => [i, v[0]]), id, (v) => { id = v; k = CASE[v][1]; sk.set(k); re(); });
  const sk = slider(c2, { label: 'k (per unit time)', min: -0.6, max: 0.6, step: 0.01, value: k, fmt: (v) => v.toFixed(2), oninput: (v) => { k = v; re(); } });
  const st = slider(c2, { label: 'time t', min: 0, max: 6, step: 0.05, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; re(); } });
  const anim = loop(host, (dt) => { t += dt * 1.2; if (t > 6) t = 0; st.set(t); re(); }, { autoplay: false }); anim.button(c2);
  const re = () => {
    cv.redraw(); const y = y0 * Math.exp(k * t), T2 = Math.abs(k) > 0.005 ? Math.log(2) / Math.abs(k) : Infinity;
    out.innerHTML = `At t = ${t.toFixed(2)}: y = ${y.toFixed(2)}. Rate dy/dt = k·y = <b>${(k * y).toFixed(3)}</b> (the tangent slope). ${k > 0 ? 'Doubling time' : k < 0 ? 'Half-life' : 'No change'}${T2 < 1e3 ? ' = ln 2 / |k| = <b>' + T2.toFixed(2) + '</b>' : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `dy/dt = k y  ⇒  y = y₀ e^(kt)   (${CASE[id][0]})`, col);
    g = axes(ctx, w, h, col, { x: [0, 6], y: [0, Math.max(4, y0 * Math.exp(Math.max(k, 0) * 6)) * 1.1], l: 34, b: 24, t: t0 + 4, r: 12 });
    ctx.save(); g.clip(); const p = []; for (let i = 0; i <= 120; i++) { const x = 6 * i / 120; p.push([g.X(x), g.Y(y0 * Math.exp(k * x))]); } line(ctx, p, col.s[0], 3);
    const y = y0 * Math.exp(k * t), m = k * y; line(ctx, [[g.X(t - 1), g.Y(y - m)], [g.X(t + 1), g.Y(y + m)]], col.s[1], 2); ctx.restore();
    dot(ctx, g.X(t), g.Y(y), 5.5, col.s[1], col.panel); text(ctx, 'start y₀ = 2', g.L + 8, g.Y(2) - 10, { color: col.muted, size: 10.5 });
    text(ctx, 'tangent: slope = k·y', g.R - 6, g.T + 10, { color: col.s[1], size: 11, align: 'right' });
  };
  re();
}
