// Differential equations as slope fields: at every point (x, y) the equation gives a slope, drawn as a short dash.
// A solution curve follows the dashes. Drag the starting point: each point picks out one particular solution from
// the general family (the arbitrary constant).
import { canvas, axes, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

const EQ = {
  grow: { f: (x, y) => 0.6 * y, name: 'dy/dx = 0.6y', gen: 'y = Ce^(0.6x)', C: (x, y) => `C = ${fmt(y / Math.exp(0.6 * x), 3)}`, kind: 'variable separable (growth and decay)' },
  lin: { f: (x, y) => x - y, name: 'dy/dx + y = x', gen: 'y = x − 1 + Ce^(−x)', C: (x, y) => `C = ${fmt((y - x + 1) * Math.exp(x), 3)}`, kind: 'linear, integrating factor eˣ' },
  circ: { f: (x, y) => (Math.abs(y) < 1e-6 ? NaN : -x / y), name: 'dy/dx = −x/y', gen: 'x² + y² = C', C: (x, y) => `C = ${fmt(x * x + y * y, 3)} (a circle of radius ${fmt(Math.hypot(x, y), 3)})`, kind: 'variable separable' },
  homo: { f: (x, y) => (Math.abs(x) < 1e-6 ? NaN : y / x + 1), name: 'dy/dx = y/x + 1', gen: 'y = x log|x| + Cx', C: (x, y) => (Math.abs(x) < 1e-6 ? 'undefined on x = 0' : `C = ${fmt(y / x - Math.log(Math.abs(x)), 3)}`), kind: 'homogeneous, put y = vx' },
  logi: { f: (x, y) => y * (2 - y), name: 'dy/dx = y(2 − y)', gen: 'y = 2/(1 + Ce^(−2x))', C: (x, y) => (Math.abs(y) < 1e-9 ? 'y = 0 is itself a solution' : `C = ${fmt((2 / y - 1) * Math.exp(2 * x), 3)}`), kind: 'variable separable (logistic growth)' },
};

export default function (host) {
  let key = 'grow', px = 0, py = 1;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 250, label: 'Slope field of a differential equation with the solution curve through a chosen point' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Equation', [['grow', 'y′ = ky'], ['lin', 'y′ + y = x'], ['circ', 'y′ = −x/y'], ['homo', 'y′ = y/x + 1'], ['logi', 'logistic']], key, (v) => { key = v; re(); });
  slider(ctl, { label: 'start x₀', min: -3.5, max: 3.5, step: 0.1, value: px, fmt: (v) => fmt(v, 2), oninput: (v) => { px = v; re(); } });
  slider(ctl, { label: 'start y₀', min: -3, max: 3, step: 0.1, value: py, fmt: (v) => fmt(v, 2), oninput: (v) => { py = v; re(); } });
  const out = readout(host);
  const show = () => { const e = EQ[key]; out.innerHTML = `${e.name}: ${e.kind}. General solution ${e.gen}. Through (${fmt(px, 2)}, ${fmt(py, 2)}): <b>${e.C(px, py)}</b>. Slope there = ${fmt(e.f(px, py), 3)}.`; };
  const trace = (f, x, y, dir, X, Y) => {
    const pts = [[X(x), Y(y)]], h = 0.01 * dir;
    for (let i = 0; i < 900; i++) {
      // step along the curve by arc length so steep parts (and circles) are followed too
      const m = f(x, y); if (!Number.isFinite(m)) break;
      const s = h / Math.sqrt(1 + m * m), k1 = m, k2 = f(x + s / 2, y + (s * k1) / 2); if (!Number.isFinite(k2)) break;
      x += s; y += s * k2;
      if (Math.abs(x) > 5 || Math.abs(y) > 4.5) break;
      pts.push([X(x), Y(y)]);
    }
    return pts;
  };
  cv.draw = (ctx, w, h, col) => {
    const e = EQ[key];
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [-4, 4], y: [-3.2, 3.2], xlabel: 'x', ylabel: 'y', l: 36 });
    ctx.save(); clip();
    const sx = X(1) - X(0), sy = Y(0) - Y(1);
    for (let x = -3.8; x < 4; x += 0.4) for (let y = -3; y < 3.2; y += 0.4) {
      const m = e.f(x, y); if (!Number.isFinite(m)) continue;
      const ang = Math.atan2(m * sy, sx), L = 6;
      line(ctx, [[X(x) - L * Math.cos(ang), Y(y) + L * Math.sin(ang)], [X(x) + L * Math.cos(ang), Y(y) - L * Math.sin(ang)]], col.muted, 1.1);
    }
    line(ctx, trace(e.f, px, py, 1, X, Y), col.s[1], 2.8);
    line(ctx, trace(e.f, px, py, -1, X, Y), col.s[1], 2.8);
    ctx.restore();
    dot(ctx, X(px), Y(py), 5, col.s[1], col.panel);
  };
  re();
}
