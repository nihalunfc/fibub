// Liouville's theorem. A small blob of starting states (a ring of points) is carried by the pendulum's flow in
// phase space. It stretches and shears into a long thin sliver, but its AREA does not change: Hamiltonian flow is
// incompressible, |∂(q,p)/∂(q₀,p₀)| = 1. Switch on friction and the area shrinks (dissipative flow).
import { canvas, text, row, choice, readout, loop, button, line } from '../kit.js';

export default function (host) {
  let t = 0, fr = 0, ring = [];
  const N = 240;
  const cv = canvas(host, { aspect: 0.75, max: 400, min: 280, label: 'A blob of starting states carried by a pendulum, with its area measured' });
  const c1 = row(host);
  choice(c1, 'Pendulum', [[0, 'Frictionless'], [0.25, 'With friction']], fr, (v) => { fr = v; reset(); });
  const anim = loop(host, (dt) => { step(dt); cv.redraw(); show(); });
  anim.button(c1); button(c1, 'Restart', () => reset());
  const out = readout(host);
  const f = (x, v) => [v, -Math.sin(x) - fr * v];
  let A0 = 0;
  const area = (P) => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };
  function reset() { ring = []; for (let i = 0; i < N; i++) { const a = (i / N) * 6.2832; ring.push([1.6 + 0.35 * Math.cos(a), 0.0 + 0.35 * Math.sin(a)]); } A0 = area(ring); t = 0; cv.redraw(); show(); }
  function step(dt) { const n = 6, h = Math.min(dt, 0.04) / n; for (let k = 0; k < n; k++) ring = ring.map((s) => { const k1 = f(...s), k2 = f(s[0] + h / 2 * k1[0], s[1] + h / 2 * k1[1]), k3 = f(s[0] + h / 2 * k2[0], s[1] + h / 2 * k2[1]), k4 = f(s[0] + h * k3[0], s[1] + h * k3[1]); return [s[0] + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), s[1] + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])]; }); t += Math.min(dt, 0.04); }
  function show() { const a = area(ring); out.innerHTML = `t = ${t.toFixed(1)} s. Area of the blob (from its boundary): <b>${a.toFixed(3)}</b> (started ${A0.toFixed(3)}, ratio ${(a / A0).toFixed(3)}). ${fr === 0 ? 'Hamiltonian flow: the ratio stays at 1 (the blob folds into a thinner and thinner strip, so after a long time the polygon outline gets rough and the number drifts).' : 'With friction the flow compresses phase space: the area decays like e^(−0.25t).'}`; }
  cv.draw = (ctx, w, h, col) => {
    const X = (x) => 8 + ((x + 4.5) / 9) * (w - 16), Y = (v) => h / 2 - (v / 3) * (h / 2 - 12);
    line(ctx, [[X(-4.5), Y(0)], [X(4.5), Y(0)]], col.line, 1); line(ctx, [[X(0), Y(-3)], [X(0), Y(3)]], col.line, 1);
    const sep = []; for (let x = -4.4; x <= 4.4; x += 0.05) sep.push(Math.sqrt(Math.max(0, 2 + 2 * Math.cos(x)))); ctx.save(); ctx.setLineDash([5, 4]); line(ctx, sep.map((v, i) => [X(-4.4 + i * 0.05), Y(v)]), col.s[1], 1.2); line(ctx, sep.map((v, i) => [X(-4.4 + i * 0.05), Y(-v)]), col.s[1], 1.2); ctx.restore();
    ctx.beginPath(); ctx.moveTo(X(ring[0][0]), Y(ring[0][1])); ring.forEach((p) => ctx.lineTo(X(p[0]), Y(p[1]))); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, 'angle x →', w - 10, Y(0) - 8, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'velocity v ↑', X(0) + 6, 14, { color: col.muted, size: 10 });
  };
  reset();
}
