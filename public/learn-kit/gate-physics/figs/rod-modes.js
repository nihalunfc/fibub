// 1.7 Separation of variables on a rod or string of length 1 with both ends held at 0. The initial profile is
// expanded in sine modes b_n sin(n pi x); each mode then evolves on its own: e^{-n^2 pi^2 tau} for the heat equation
// (tau = kappa t / L^2), cos(n pi tau) for the wave equation released from rest (tau = c t / L). Play runs time.
// The dashed curve is the initial profile, the thin curves the first three modes at the current time.
import { canvas, axes, line, row, slider, choice, readout, fmt, title, loop } from '../../kit.js';

const SHAPES = {
  flat: { name: 'Uniform', f: () => 1, b: (n) => (n % 2 ? 4 / (n * Math.PI) : 0) },
  tri: { name: 'Plucked middle', f: (x) => (x < 0.5 ? 2 * x : 2 - 2 * x), b: (n) => (8 / (n * n * Math.PI ** 2)) * Math.sin((n * Math.PI) / 2) },
  step: { name: 'Hot left half', f: (x) => (x < 0.5 ? 1 : 0), b: (n) => (2 / (n * Math.PI)) * (1 - Math.cos((n * Math.PI) / 2)) },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 270, label: 'A rod or string profile built from sine modes, evolving in time under the heat or the wave equation' });
  let shape = 'flat', eq = 'heat', N = 15, tau = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  const tmax = () => (eq === 'heat' ? 0.3 : 2);
  const u = (x) => { const S = SHAPES[shape]; let s = 0; for (let n = 1; n <= N; n++) s += S.b(n) * Math.sin(n * Math.PI * x) * (eq === 'heat' ? Math.exp(-n * n * Math.PI ** 2 * tau) : Math.cos(n * Math.PI * tau)); return s; };
  const upd = () => {
    const S = SHAPES[shape], b1 = S.b(1), b3 = S.b(3);
    out.innerHTML = eq === 'heat'
      ? `Heat equation, κt/L² = <b>${fmt(tau, 3)}</b>. Mode n decays as e^(−n²π²κt/L²): b₁ = ${fmt(b1, 3)} is now ${fmt(b1 * Math.exp(-(Math.PI ** 2) * tau), 3)}, b₃ = ${fmt(b3, 3)} is now ${fmt(b3 * Math.exp(-9 * Math.PI ** 2 * tau), 3)}. Midpoint value ${fmt(u(0.5), 3)}. High modes die first, so the profile becomes a half-sine and then fades.`
      : `Wave equation, ct/L = <b>${fmt(tau, 3)}</b>. Mode n oscillates as cos(nπct/L) with no decay; the profile returns to its start at ct/L = 2. With ${N} modes the series ${N < 6 ? 'still misses the sharp corners' : 'follows the shape closely'}.`;
  };
  choice(ctl, 'Start', Object.entries(SHAPES).map(([k, v]) => [k, v.name]), shape, (v) => { shape = v; cv.redraw(); upd(); });
  choice(ctl, 'Equation', [['heat', 'Heat'], ['wave', 'Wave']], eq, (v) => { eq = v; tau = 0; tsl.set(0); cv.redraw(); upd(); });
  slider(ctl2, { label: 'Modes kept', min: 1, max: 40, step: 1, value: N, fmt: (v) => String(Math.round(v)), oninput: (v) => { N = Math.round(v); cv.redraw(); upd(); } });
  const tsl = slider(ctl2, { label: 'Time', min: 0, max: 1, step: 0.002, value: 0, fmt: (v) => fmt(v * tmax(), 3), oninput: (v) => { tau = v * tmax(); cv.redraw(); upd(); } });
  const anim = loop(host, (dt) => { const f = tau / tmax() + dt * (eq === 'heat' ? 0.12 : 0.25); tau = (f > 1 ? 0 : f) * tmax(); tsl.set(tau / tmax()); cv.redraw(); upd(); }, { autoplay: false });
  anim.button(ctl2);
  cv.draw = (ctx, w, h, col) => {
    const S = SHAPES[shape];
    title(ctx, `${eq === 'heat' ? 'Temperature' : 'Displacement'} u(x, t) from ${N} sine modes`, col);
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [-1.25, 1.35], t: 40, xlabel: 'x / L', ylabel: 'u' });
    ctx.save(); A.clip();
    line(ctx, [[A.X(0), A.Y(0)], [A.X(1), A.Y(0)]], col.muted, 1);
    const M = 400, init = [], cur = [];
    for (let i = 0; i <= M; i++) { const x = i / M; init.push([A.X(x), A.Y(S.f(x))]); cur.push([A.X(x), A.Y(u(x))]); }
    line(ctx, init, col.muted, 1.5, [5, 4]);
    for (const [k, n] of [[3, 1], [4, 2], [5, 3]]) {
      const pts = []; const amp = S.b(n) * (eq === 'heat' ? Math.exp(-n * n * Math.PI ** 2 * tau) : Math.cos(n * Math.PI * tau));
      if (Math.abs(S.b(n)) < 1e-12) continue;
      for (let i = 0; i <= M; i++) { const x = i / M; pts.push([A.X(x), A.Y(amp * Math.sin(n * Math.PI * x))]); }
      line(ctx, pts, col.s[k], 1.2);
    }
    line(ctx, cur, col.s[0], 2.8);
    ctx.restore();
  };
  cv.redraw(); upd();
}
