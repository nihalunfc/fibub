// 11.2 The inflaton rolling down its hill, solved for real. Units: reduced Planck mass M̄ = 1, V₀ = 1.
// Potential: Starobinsky's plateau V = V₀(1 − e^(−√(2/3) φ))², favoured by Planck. Equations:
//   φ'' = −(3H + Γ)φ' − V'(φ),  ρ_r' = −4Hρ_r + Γφ'²,  H² = (φ'²/2 + V + ρ_r)/3,  N' = H  (N = ln a).
// While the ball creeps along the plateau, H barely changes, so ln a climbs in a straight line (a ∝ e^(Ht)).
// Inflation ends when ε = φ'²/(2H²) reaches 1. The ball then rocks in the valley, and the friction term Γ (a toy
// decay rate) turns its energy into hot particles: reheating. Slide the starting point: the number of e-folds
// grows roughly as (3/4)e^(√(2/3) φ₀), so a little farther up the plateau gives many more e-folds.
import { canvas, axes, text, title, line, dot, row, slider, button, readout, loop, calm } from '../../kit.js';

const K = Math.sqrt(2 / 3), GAM = 0.08;
const V = (f) => (1 - Math.exp(-K * f)) ** 2;
const dV = (f) => 2 * K * Math.exp(-K * f) * (1 - Math.exp(-K * f));

function solve(f0) {
  let f = f0, v = -dV(f0) / (3 * Math.sqrt(V(f0) / 3)), r = 0, N = 0, t = 0;
  const out = [], dt = 0.01;
  const der = (f, v, r) => { const H = Math.sqrt((v * v / 2 + V(f) + r) / 3); return [v, -(3 * H + GAM) * v - dV(f), -4 * H * r + GAM * v * v, H]; };
  let tEnd = null, NEnd = null;
  for (let i = 0; ; i++) {
    const H = Math.sqrt((v * v / 2 + V(f) + r) / 3), eps = (v * v) / (2 * H * H);
    if (i % 10 === 0) out.push({ t, f, N, r, H, eps, rho: v * v / 2 + V(f) + r });
    if (tEnd === null && eps >= 1) { tEnd = t; NEnd = N; }
    if (tEnd !== null && t > tEnd + 45) break;
    if (t > 600) break;
    const k1 = der(f, v, r), k2 = der(f + k1[0] * dt / 2, v + k1[1] * dt / 2, r + k1[2] * dt / 2), k3 = der(f + k2[0] * dt / 2, v + k2[1] * dt / 2, r + k2[2] * dt / 2), k4 = der(f + k3[0] * dt, v + k3[1] * dt, r + k3[2] * dt);
    f += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    v += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    r += (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    N += (dt / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
    t += dt;
  }
  return { out, tEnd, NEnd };
}

export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 520, min: 400, label: 'A ball rolling down the inflaton potential, with the growth of the universe plotted below' });
  let f0 = 5.35, sol = solve(f0), idx = 0;
  const speed = () => sol.out.length / 11; // whole run in about 11 seconds
  const anim = loop(host, (dt) => { idx = Math.min(sol.out.length - 1, idx + dt * speed()); if (idx >= sol.out.length - 1) anim.pause(); cv.redraw(); show(); });
  const ctl = row(host);
  anim.button(ctl);
  button(ctl, '↺ Restart', () => { idx = 0; anim.play(); cv.redraw(); show(); });
  slider(ctl, { label: 'Start height on the plateau (φ₀)', min: 4.3, max: 5.7, step: 0.05, value: f0, fmt: (v) => v.toFixed(2), oninput: (v) => { f0 = v; sol = solve(f0); idx = 0; anim.play(); cv.redraw(); show(); } });
  const out = readout(host);
  if (calm()) idx = sol.out.length - 1;
  cv.draw = (ctx, w, h, col) => {
    const s = sol.out[Math.floor(idx)];
    const top = title(ctx, 'The inflaton rolls, the universe inflates', col);
    const mid = top + (h - top) * 0.46;
    // top panel: the potential
    const A = axes(ctx, w, mid, col, { x: [-1.3, 6], y: [0, 1.15], t: top + 8, b: 18, l: 30, xt: [], yt: [], grid: false });
    const curve = []; for (let x = -1.3; x <= 6.001; x += 0.04) curve.push([A.X(x), A.Y(Math.min(1.15, V(x)))]);
    // glow of radiation made by reheating
    const heat = Math.min(1, s.r / Math.max(1e-9, s.rho));
    if (heat > 0.01) { ctx.save(); ctx.globalAlpha = 0.35 * heat; ctx.fillStyle = col.s[3]; ctx.fillRect(A.L + 1, A.T, A.R - A.L - 1, A.B - A.T); ctx.restore(); }
    line(ctx, curve, col.ink, 2.5);
    text(ctx, 'height = energy of the field', A.R - 4, A.B - 10, { color: col.muted, size: 10.5, align: 'right' });
    text(ctx, '← slow roll along the plateau', A.X(4.2), A.Y(0.62), { color: col.s[0], size: 11, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'valley: rock and reheat', A.X(0.9), A.Y(0.1), { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'field value φ →', A.R, mid - 6, { color: col.muted, size: 10.5, align: 'right' });
    dot(ctx, A.X(Math.max(-1.3, Math.min(6, s.f))), A.Y(V(s.f)) - 8, 8, col.s[0], col.panel);
    // bottom panel: ln a against time
    const tMax = sol.out[sol.out.length - 1].t, NMax = sol.out[sol.out.length - 1].N;
    const B = axes(ctx, w, h, col, { x: [0, tMax], y: [0, Math.ceil(NMax / 10) * 10], t: mid + 22, l: 40, xt: [], xlabel: 'time →', ylabel: 'e-folds, ln a' });
    const all = sol.out.map((q) => [B.X(q.t), B.Y(q.N)]);
    line(ctx, all, col.line, 2);
    line(ctx, all.slice(0, Math.floor(idx) + 1), col.s[0], 2.5);
    if (sol.tEnd !== null) {
      line(ctx, [[B.X(sol.tEnd), B.T], [B.X(sol.tEnd), B.B]], col.s[3], 1.5, [4, 3]);
      text(ctx, 'inflation ends', B.X(sol.tEnd) - 4, B.B - 10, { color: col.s[3], size: 10.5, weight: 700, align: 'right', halo: col.panel });
    }
    text(ctx, 'straight line = a grows as e^(Ht)', B.L + 6, B.T + 8, { color: col.muted, size: 10.5, halo: col.panel });
    dot(ctx, B.X(s.t), B.Y(s.N), 5, col.s[0], col.panel);
  };
  const show = () => {
    const s = sol.out[Math.floor(idx)];
    const phase = s.eps < 1 && (sol.tEnd === null || s.t < sol.tEnd) ? 'Inflating: the field creeps along the plateau, H stays almost constant'
      : s.r / s.rho < 0.5 ? 'Inflation over: the field rocks in the valley and starts to decay into particles'
      : 'Reheating: most of the energy is now hot radiation, the start of the hot Big Bang';
    out.innerHTML = `${phase}. e-folds so far: <b>${s.N.toFixed(1)}</b> (space ×10<sup>${(s.N / Math.LN10).toFixed(0)}</sup>). This start gives <b>${sol.NEnd !== null ? sol.NEnd.toFixed(0) : '—'}</b> e-folds in all${sol.NEnd !== null && sol.NEnd < 55 ? ': too few to explain the smooth, flat universe' : ''}.`;
  };
  cv.redraw(); show();
}
