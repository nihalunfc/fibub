// Heat flowing along a rod, ∂u/∂t = D ∂²u/∂x². Pick a starting temperature pattern and press Play. Hot spots spread and
// flatten; where the curve bends down (u″ < 0) the temperature falls, where it bends up it rises. Ends held at 0 lose
// heat; insulated ends keep the total. A smooth sine pattern just shrinks, e^(−D k² t), while sharp features vanish
// fastest (large k decays quickest).
import { canvas, axes, row, slider, choice, button, readout, loop, line, text } from '../kit.js';
import { f2 } from './_math.js';

const N = 80;
const INIT = {
  spike: ['Hot spot', (x) => Math.exp(-(((x - 0.5) / 0.06) ** 2))], step: ['Hot half', (x) => (x < 0.5 ? 1 : 0)], sin1: ['Sine mode 1', (x) => Math.sin(Math.PI * x)], sin3: ['Sine mode 3', (x) => Math.sin(3 * Math.PI * x)], ends: ['Hot ends', (x) => (x < 0.12 || x > 0.88 ? 1 : 0)],
};
export default function (host) {
  let ic = 'spike', bc = 'zero', D = 0.05, u = [], t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 250, label: 'Temperature along a rod changing with time' });
  const c = row(host), c2 = row(host);
  choice(c, 'Start', Object.entries(INIT).map(([id, v]) => [id, v[0]]), ic, (v) => { ic = v; reset(); });
  choice(c, 'Ends', [['zero', 'Held at 0'], ['ins', 'Insulated']], bc, (v) => { bc = v; reset(); });
  slider(c2, { label: 'D (spread rate)', min: 0.01, max: 0.2, step: 0.01, value: D, fmt: (v) => f2(v), oninput: (v) => { D = v; } });
  const anim = loop(host, (dt) => { step(dt); cv.redraw(); show(); }); anim.button(c2); button(c2, 'Restart', () => reset());
  const out = readout(host);
  function reset() { u = Array.from({ length: N + 1 }, (_, i) => INIT[ic][1](i / N)); if (bc === 'zero') { u[0] = 0; u[N] = 0; } t = 0; cv.redraw(); show(); }
  function step(dt) { const dx = 1 / N; // sub-steps keep D·h/dx² ≤ 0.4 so the scheme stays stable
    const sub = Math.ceil((dt * D) / (0.4 * dx * dx)), hh = dt / sub; for (let s = 0; s < sub; s++) { const nu = u.slice(); for (let i = 1; i < N; i++) nu[i] = u[i] + (D * hh / (dx * dx)) * (u[i + 1] - 2 * u[i] + u[i - 1]); if (bc === 'zero') { nu[0] = 0; nu[N] = 0; } else { nu[0] = nu[1]; nu[N] = nu[N - 1]; } u = nu; } t += dt; }
  function show() { const tot = u.reduce((s, v) => s + v, 0) / N, mx = Math.max(...u); out.innerHTML = `t = ${f2(t, 2)}. Hottest point = <b>${f2(mx, 3)}</b>, average temperature (total heat) = <b>${f2(tot, 3)}</b>. ${bc === 'ins' ? 'Insulated ends: the average never changes, only the shape does; in the end the rod is uniform.' : 'Ends held at 0: heat leaks out through the ends, so the average falls toward 0.'} ${ic.startsWith('sin') && bc === 'zero' ? `Theory for this mode: peak = e^(−D·k²·t) with k = ${ic === 'sin1' ? 'π' : '3π'}: ${f2(Math.exp(-D * (ic === 'sin1' ? 1 : 9) * Math.PI ** 2 * t), 3)}.` : ''}`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [0, 1.1], l: 30, b: 34, t: 22, r: 10, yt: [0, 0.5, 1] });
    line(ctx, u.map((v, i) => [A.X(i / N), A.Y(v)]), col.s[1], 3);
    // colour strip: the rod itself
    for (let i = 0; i < N; i++) { ctx.globalAlpha = Math.min(1, Math.max(0, u[i])); ctx.fillStyle = col.bad; ctx.fillRect(A.X(i / N), A.B + 22, (A.X(1) - A.X(0)) / N + 1, 8); }
    ctx.globalAlpha = 1; text(ctx, 'hotter = redder (strip under the graph is the rod)', A.L + 6, A.T + 8, { color: col.muted, size: 10 });
  };
  reset();
}
