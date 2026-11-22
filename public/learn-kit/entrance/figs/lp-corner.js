// Linear programming by the corner point method. The shaded polygon is the feasible region of
// x + 2y ≤ c₁, 3x + y ≤ c₂, x ≥ 0, y ≥ 0. The dashed line is the level line Z = px + qy through the best corner:
// slide it parallel to itself and the last corner it touches is the optimum. When the level line is parallel to an
// edge, every point of that edge is optimal.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt, text } from '../../kit.js';

const clip = (cons) => {
  let P = [[0, 0], [30, 0], [30, 30], [0, 30]];
  for (const [a, b, c] of cons) {
    const Q = [];
    for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length], fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c;
      if (fp <= 1e-12) Q.push(p);
      if (fp * fq < 0) { const t = fp / (fp - fq); Q.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
    }
    P = Q;
  }
  return P;
};

export default function (host) {
  let c1 = 14, c2 = 21, p = 3, q = 4, goal = 'max';
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 260, label: 'Feasible region of a linear programming problem with corner values and the level line of the objective' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'c₁ in x + 2y ≤ c₁', min: 4, max: 20, step: 1, value: c1, fmt: (v) => String(v), oninput: (v) => { c1 = v; re(); } });
  slider(ctl, { label: 'c₂ in 3x + y ≤ c₂', min: 4, max: 24, step: 1, value: c2, fmt: (v) => String(v), oninput: (v) => { c2 = v; re(); } });
  slider(ctl, { label: 'p in Z = px + qy', min: -3, max: 6, step: 1, value: p, fmt: (v) => String(v), oninput: (v) => { p = v; re(); } });
  slider(ctl, { label: 'q', min: -3, max: 6, step: 1, value: q, fmt: (v) => String(v), oninput: (v) => { q = v; re(); } });
  choice(ctl, 'Goal', [['max', 'maximise'], ['min', 'minimise']], goal, (v) => { goal = v; re(); });
  const out = readout(host);
  const solve = () => {
    const P = clip([[1, 2, c1], [3, 1, c2], [-1, 0, 0], [0, -1, 0]]);
    const V = []; P.forEach((v) => { if (!V.some((u) => Math.hypot(u[0] - v[0], u[1] - v[1]) < 1e-9)) V.push(v); });
    const Z = V.map(([x, y]) => p * x + q * y), best = goal === 'max' ? Math.max(...Z) : Math.min(...Z);
    return { V, Z, best, ties: V.filter((_, i) => Math.abs(Z[i] - best) < 1e-9) };
  };
  const show = () => {
    const { V, Z, best, ties } = solve();
    out.innerHTML = `Corners and Z = ${p}x + ${q}y: ${V.map(([x, y], i) => `(${fmt(x, 3)}, ${fmt(y, 3)}) → ${fmt(Z[i], 4)}`).join('; ')}. ${goal === 'max' ? 'Maximum' : 'Minimum'} <b>${fmt(best, 4)}</b>${ties.length > 1 ? ', reached at two corners, so at <b>every point of the edge</b> between them (multiple optimal solutions)' : ` at (${fmt(ties[0][0], 3)}, ${fmt(ties[0][1], 3)})`}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { V, best, ties } = solve();
    const { X, Y, clip: cl } = axes(ctx, w, h, col, { x: [0, 12], y: [0, 10.5], xlabel: 'x', ylabel: 'y', l: 36 });
    ctx.save(); cl();
    ctx.beginPath(); V.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.closePath();
    ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [[X(0), Y(c1 / 2)], [X(c1), Y(0)]], col.s[0], 1.5);
    line(ctx, [[X(0), Y(c2)], [X(c2 / 3), Y(0)]], col.s[3], 1.5);
    if (p || q) {
      // the level line px + qy = best
      const pts = Math.abs(q) > 1e-9 ? [[-1, (best + p) / q], [13, (best - 13 * p) / q]] : [[best / p, -1], [best / p, 12]];
      line(ctx, pts.map(([x, y]) => [X(x), Y(y)]), col.s[1], 2, [7, 5]);
    }
    ctx.restore();
    V.forEach(([x, y]) => dot(ctx, X(x), Y(y), 4, col.ink));
    ties.forEach(([x, y]) => dot(ctx, X(x), Y(y), 6, col.s[1], col.panel));
    text(ctx, 'x + 2y = c₁', X(Math.min(c1, 11) * 0.55) + 4, Y(c1 / 2 - Math.min(c1, 11) * 0.275) - 10, { color: col.s[0], size: 11, halo: col.panel });
    text(ctx, '3x + y = c₂', X(Math.min(c2 / 3, 11) * 0.2) + 6, Y(Math.min(c2 - Math.min(c2 / 3, 11) * 0.6, 10)), { color: col.s[3], size: 11, halo: col.panel });
  };
  re();
}
