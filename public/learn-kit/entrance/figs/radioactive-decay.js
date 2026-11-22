// Nuclei: 400 unstable nuclei, each with the same chance of decaying in every short moment. Nobody can say which one
// goes next, yet the number left falls along the smooth curve N = N₀e^(−λt), halving every half-life.
import { canvas, axes, line, row, slider, readout, loop, button, text, rng, fmt } from '../../kit.js';

const N0 = 400;
export default function (host) {
  let T = 4, t = 0, alive, hist;
  const reset = () => { alive = new Array(N0).fill(1); hist = [[0, N0]]; t = 0; cv.redraw(); show(); };
  const cv = canvas(host, { aspect: 0.85, max: 480, min: 330, label: 'Random decay of 400 nuclei compared with the exponential law' });
  const ctl = row(host);
  slider(ctl, { label: 'Half-life', min: 1, max: 8, step: 0.5, value: T, fmt: (v) => `${v} s`, oninput: (v) => { T = v; reset(); } });
  const r = rng(99);
  const anim = loop(host, (dt) => {
    if (t > 5 * T) return;
    const lam = Math.LN2 / T, p = 1 - Math.exp(-lam * dt);
    for (let i = 0; i < N0; i++) if (alive[i] && r() < p) alive[i] = 0;
    t += dt; hist.push([t, alive.reduce((a, b) => a + b, 0)]);
    cv.redraw(); show();
  });
  anim.button(ctl); button(ctl, 'Restart', () => reset());
  const out = readout(host);
  const show = () => {
    const N = alive.reduce((a, b) => a + b, 0), th = N0 * Math.exp((-Math.LN2 / T) * t);
    out.innerHTML = `t = ${t.toFixed(1)} s = ${(t / T).toFixed(2)} half-lives · left: <b>${N}</b> (law predicts ${Math.round(th)}) · decay constant λ = ln 2/T = ${fmt(Math.LN2 / T, 3)} per s · mean life 1/λ = ${fmt(T / Math.LN2, 3)} s.`;
  };
  cv.draw = (ctx, w, h, col) => {
    // grid of nuclei
    const cols = 25, rows = 16, gs = Math.min((w - 20) / cols, (h * 0.42) / rows), x0 = (w - gs * cols) / 2, y0 = 24;
    for (let i = 0; i < N0; i++) {
      const cx = x0 + (i % cols) * gs + gs / 2, cy = y0 + Math.floor(i / cols) * gs + gs / 2;
      ctx.beginPath(); ctx.arc(cx, cy, gs * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = alive[i] ? col.s[0] : col.line; ctx.fill();
    }
    text(ctx, 'blue: not yet decayed', 10, 12, { color: col.muted, size: 11 });
    ctx.save(); ctx.translate(0, y0 + rows * gs + 6);
    const gh = h - (y0 + rows * gs + 6);
    const { X, Y } = axes(ctx, w, gh, col, { x: [0, 5 * T], y: [0, N0], xlabel: 't (s)', ylabel: 'N left', t: 8, xt: [0, 1, 2, 3, 4, 5].map((k) => k * T) });
    const th = []; for (let s = 0; s <= 5 * T; s += T / 40) th.push([X(s), Y(N0 * Math.exp((-Math.LN2 / T) * s))]);
    line(ctx, th, col.muted, 1.5, [5, 4]);
    line(ctx, hist.map(([a, b]) => [X(a), Y(b)]), col.s[3], 2.5);
    [1, 2, 3].forEach((k) => text(ctx, `N₀/${2 ** k}`, X(k * T) + 4, Y(N0 / 2 ** k) - 8, { color: col.muted, size: 10, halo: col.panel }));
    ctx.restore();
  };
  reset();
}
