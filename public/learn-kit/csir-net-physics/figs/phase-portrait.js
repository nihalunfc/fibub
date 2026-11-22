// 3.3 Phase portraits of a linear system ẋ = A x, with A = [[a, b], [c, d]] chosen from presets or by trace and
// determinant. Arrows show the vector field, coloured curves are trajectories (RK4) from a ring of starting points,
// dashed lines are the real eigen-directions. The readout names the fixed point from τ = tr A and Δ = det A.
import { canvas, axes, line, arrow, text, title, row, slider, choice, readout, fmt } from '../../kit.js';

const PRESETS = {
  saddle: [1, 1, 2, -1], snode: [-2, 0.5, 0.5, -1], unode: [2, 0.5, 0.5, 1], sspiral: [-0.4, 1, -1, -0.4],
  uspiral: [0.3, 1, -1, 0.3], centre: [0, 1, -1, 0], degen: [-1, 1, 0, -1],
};

function classify(t, D) {
  if (D < -1e-9) return 'a saddle (Δ < 0)';
  if (Math.abs(D) <= 1e-9) return 'non-isolated (Δ = 0)';
  if (Math.abs(t) <= 1e-9) return 'a centre (τ = 0, Δ > 0)';
  const disc = t * t - 4 * D, s = t < 0 ? 'stable' : 'unstable';
  if (Math.abs(disc) < 1e-9) return `a ${s} degenerate node (τ² = 4Δ)`;
  return disc > 0 ? `a ${s} node (τ² > 4Δ)` : `a ${s} spiral (τ² < 4Δ)`;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 460, min: 300, label: 'Phase portrait of a linear system with its vector field, trajectories and eigen-directions' });
  let A = PRESETS.sspiral.slice();
  const ctl = row(host);
  choice(ctl, 'Type', [['saddle', 'Saddle'], ['snode', 'Stable node'], ['unode', 'Unstable node'], ['sspiral', 'Stable spiral'], ['uspiral', 'Unstable spiral'], ['centre', 'Centre'], ['degen', 'Degenerate node']], 'sspiral', (v) => { A = PRESETS[v].slice(); sa.set(A[0]); sd.set(A[3]); cv.redraw(); });
  const ctl2 = row(host);
  const sa = slider(ctl2, { label: 'a (top left)', min: -2, max: 2, step: 0.05, value: A[0], fmt: (v) => v.toFixed(2), oninput: (v) => { A[0] = v; cv.redraw(); } });
  const sd = slider(ctl2, { label: 'd (bottom right)', min: -2, max: 2, step: 0.05, value: A[3], fmt: (v) => v.toFixed(2), oninput: (v) => { A[3] = v; cv.redraw(); } });
  const out = readout(host);
  const F = (x, y) => [A[0] * x + A[1] * y, A[2] * x + A[3] * y];
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Phase portrait of ẋ = Ax', col);
    const L = 3, ax = axes(ctx, W, H, col, { x: [-L, L], y: [-L * 0.8, L * 0.8], xlabel: 'x', ylabel: 'y', t: 30, grid: false });
    ctx.save(); ax.clip();
    // vector field
    for (let i = -6; i <= 6; i++) for (let j = -5; j <= 5; j++) {
      const x = i * L / 6.5, y = j * L * 0.8 / 5.5, [u, v] = F(x, y), s = Math.hypot(u, v) || 1, len = 0.18;
      arrow(ctx, ax.X(x), ax.Y(y), ax.X(x + len * u / s), ax.Y(y + len * v / s), col.muted, 1, 4);
    }
    // eigen-directions
    const t = A[0] + A[3], D = A[0] * A[3] - A[1] * A[2], disc = t * t - 4 * D;
    if (disc >= 0) for (const lam of [(t + Math.sqrt(disc)) / 2, (t - Math.sqrt(disc)) / 2]) {
      let vx = A[1], vy = lam - A[0]; if (Math.hypot(vx, vy) < 1e-9) { vx = lam - A[3]; vy = A[2]; } if (Math.hypot(vx, vy) < 1e-9) { vx = 1; vy = 0; }
      const s = 10 / Math.hypot(vx, vy); line(ctx, [[ax.X(-vx * s), ax.Y(-vy * s)], [ax.X(vx * s), ax.Y(vy * s)]], col.s[3], 1.5, [6, 4]);
    }
    // trajectories forward and backward in time
    const step = (p, h) => { const [x, y] = p, k1 = F(x, y), k2 = F(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = F(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = F(x + h * k3[0], y + h * k3[1]); return [x + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), y + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])]; };
    for (let k = 0; k < 12; k++) {
      const a0 = 2 * Math.PI * k / 12;
      for (const dir of [1, -1]) {
        let p = [2.2 * Math.cos(a0), 1.7 * Math.sin(a0)]; const pts = [[ax.X(p[0]), ax.Y(p[1])]];
        for (let s = 0; s < 400; s++) { p = step(p, dir * 0.02); if (!Number.isFinite(p[0]) || Math.abs(p[0]) > 8 || Math.abs(p[1]) > 8) break; pts.push([ax.X(p[0]), ax.Y(p[1])]); }
        line(ctx, pts, col.s[k % 3], 1.6);
      }
    }
    ctx.restore();
    const ev = disc >= 0 ? `λ = ${fmt((t + Math.sqrt(disc)) / 2, 3)}, ${fmt((t - Math.sqrt(disc)) / 2, 3)}` : `λ = ${fmt(t / 2, 3)} ± ${fmt(Math.sqrt(-disc) / 2, 3)}i`;
    text(ctx, ev, ax.L + 8, ax.B - 12, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    out.innerHTML = `A = [[${fmt(A[0], 3)}, ${fmt(A[1], 3)}], [${fmt(A[2], 3)}, ${fmt(A[3], 3)}]]: τ = <b>${fmt(t, 3)}</b>, Δ = <b>${fmt(D, 3)}</b>, τ² − 4Δ = ${fmt(disc, 3)}. The origin is <b>${classify(t, D)}</b>. Dashed lines: real eigen-directions.`;
  };
  cv.redraw();
}
