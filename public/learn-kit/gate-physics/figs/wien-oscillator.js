// 9.4 Barkhausen and the Wien bridge oscillator. Top: the loop gain K·β(jω) of a Wien network (equal R and C) with an
// amplifier of gain K: magnitude and phase against ω/ω0. The phase is zero only at ω0, where |Kβ| = K/3.
// Bottom: the output after a tiny kick, found by integrating (RC)²y'' + (3 − K)RC y' + y = 0 with the amplifier either
// ideal (linear: grows or decays as e^{σt}, σ = (K − 3)/2RC) or with a soft limiter (tanh), which settles the amplitude.
import { canvas, row, slider, choice, readout, axes, line, text, title, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.9, max: 580, min: 400, label: 'Loop gain of a Wien bridge oscillator against frequency, and the growth or decay of its output in time' });
  let K = 3.1, lim = 'soft';
  const ctl = row(host), out = readout(host);
  let sim = [];
  const re = () => { run(); cv.redraw(); show(); };
  slider(ctl, { label: 'Amplifier gain K', min: 2.5, max: 4, step: 0.01, value: K, fmt: (v) => fmt(v, 3), oninput: (v) => { K = v; re(); } });
  choice(ctl, 'Amplifier', [['lin', 'Ideal (linear)'], ['soft', 'With soft limiting']], lim, (v) => { lim = v; re(); });
  // time in units of RC; network output y, amplifier output vo = K y (or tanh-limited); y'' + 3y' + y = vo'
  const run = () => {
    sim = []; let y = 0.01, v = 0, dt = 0.01;
    const dvo = (yy, vv) => (lim === 'lin' ? K * vv : K * vv / Math.cosh(K * yy) ** 2);
    for (let t = 0; t <= 80; t += dt) {
      if (Math.round(t / dt) % 5 === 0) sim.push([t, lim === 'lin' ? K * y : Math.tanh(K * y)]);
      const a = (yy, vv) => -3 * vv - yy + dvo(yy, vv);
      // RK4
      const k1y = v, k1v = a(y, v);
      const k2y = v + 0.5 * dt * k1v, k2v = a(y + 0.5 * dt * k1y, v + 0.5 * dt * k1v);
      const k3y = v + 0.5 * dt * k2v, k3v = a(y + 0.5 * dt * k2y, v + 0.5 * dt * k2v);
      const k4y = v + dt * k3v, k4v = a(y + dt * k3y, v + dt * k3v);
      y += dt / 6 * (k1y + 2 * k2y + 2 * k3y + k4y); v += dt / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);
      if (Math.abs(y) > 1e6) break;
    }
  };
  const show = () => {
    const s = (K - 3) / 2;
    out.innerHTML = `At ω₀ = 1/RC the network passes 1/3 with zero phase, so the loop gain there is K/3 = <b>${fmt(K / 3, 3)}</b>. Small-signal envelope ∝ e^{σt} with σRC = (K − 3)/2 = <b>${fmt(s, 3)}</b>: ${K > 3.0005 ? 'growing' : K < 2.9995 ? 'decaying' : 'marginal'}. ${lim === 'soft' && K > 3 ? 'The limiter lowers the average gain until it is exactly 3, and the amplitude settles; more excess gain means a larger, more distorted output.' : lim === 'lin' && K > 3 ? 'With an ideal amplifier the oscillation grows without limit: a real one must clip or be gain-controlled.' : ''}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const split = H * 0.48;
    ctx.save();
    const ax = axes(ctx, W, split, col, { x: [0.1, 10], y: [-90, 90], xlog: true, xlabel: 'ω/ω₀', ylabel: 'phase (°)', t: 32, b: 36, yt: [-90, -45, 0, 45, 90] });
    title(ctx, 'Loop gain Kβ: phase (blue) and magnitude (orange, right scale)', col);
    ctx.save(); ax.clip();
    const ph = [], mg = [];
    for (let e = -1; e <= 1; e += 0.01) {
      const w = 10 ** e, d = w - 1 / w, mag = K / Math.hypot(3, d), p = -Math.atan2(d, 3) * 180 / Math.PI;
      ph.push([ax.X(w), ax.Y(p)]); mg.push([ax.X(w), ax.Y(-90 + 180 * mag / 1.5)]);
    }
    line(ctx, [[ax.X(0.1), ax.Y(0)], [ax.X(10), ax.Y(0)]], col.line, 1);
    line(ctx, [[ax.X(0.1), ax.Y(-90 + 180 / 1.5)], [ax.X(10), ax.Y(-90 + 180 / 1.5)]], col.s[1], 1, [4, 4]);
    line(ctx, ph, col.s[0], 2.4); line(ctx, mg, col.s[1], 2.4);
    line(ctx, [[ax.X(1), ax.T], [ax.X(1), ax.B]], col.muted, 1, [3, 3]);
    ctx.restore();
    text(ctx, '|Kβ| = 1', ax.R - 4, ax.Y(-90 + 180 / 1.5) - 9, { color: col.s[1], size: 10.5, align: 'right', halo: col.panel });
    ctx.restore();
    ctx.save(); ctx.translate(0, split);
    const amp = Math.max(0.05, ...sim.map((p) => Math.abs(p[1]))), ym = Math.min(amp * 1.1, lim === 'lin' ? 1e3 : 1.2);
    const bx = axes(ctx, W, H - split, col, { x: [0, 80], y: [-ym, ym], xlabel: 'time (units of RC; one period ≈ 6.3)', ylabel: 'output', t: 18 });
    text(ctx, 'Output after a small kick', 10, 9, { color: col.ink, size: 12, weight: 700 });
    ctx.save(); bx.clip();
    line(ctx, sim.map(([t, v]) => [bx.X(t), bx.Y(Math.max(-ym * 1.05, Math.min(ym * 1.05, v)))]), col.s[4], 1.8);
    if (lim === 'lin') { const s = (K - 3) / 2, e0 = 0.01 * K; const env = []; for (let t = 0; t <= 80; t += 0.5) env.push([bx.X(t), bx.Y(Math.min(ym * 1.05, e0 * Math.exp(s * t) * 1.0))]); line(ctx, env, col.muted, 1.2, [5, 4]); }
    ctx.restore(); ctx.restore();
  };
  re();
}
