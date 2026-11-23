// Class 12 Parametric differentiation: when x and y are both given through a third variable t, dy/dx = (dy/dt)/(dx/dt), the chain rule again.
// Circle (3 cos t, 3 sin t): dy/dx = -cos t / sin t. Cycloid (t - sin t, 1 - cos t), the path of a point on a rolling wheel's rim:
// dy/dx = sin t / (1 - cos t). Play the motion or drag the slider: the tangent turns with exactly that slope.
import { canvas, text, title, line, dot, axes, row, slider, choice, readout, loop } from '../../kit.js';

const C = {
  circle: { n: 'circle', P: (t) => [3 * Math.cos(t), 3 * Math.sin(t)], dx: (t) => -3 * Math.sin(t), dy: (t) => 3 * Math.cos(t), X: [-4.5, 4.5], Y: [-4.5, 4.5], T: 6.28, rule: 'dy/dx = (3cos t)/(−3sin t) = −cot t' },
  cyc: { n: 'cycloid', P: (t) => [t - Math.sin(t), 1 - Math.cos(t)], dx: (t) => 1 - Math.cos(t), dy: (t) => Math.sin(t), X: [-0.5, 7], Y: [-1.5, 3.5], T: 6.28, rule: 'dy/dx = sin t/(1 − cos t) = cot(t/2)' },
};
export default function (host) {
  let key = 'circle', t = 1;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A point moving along a curve given by parametric equations, with its tangent' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Curve', Object.entries(C).map(([k, v]) => [k, v.n]), key, (v) => { key = v; t = 1; st.set(t); say(); });
  const st = slider(ctl, { label: 't', min: 0.2, max: 6.1, step: 0.02, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; say(); } });
  const an = loop(host, (dt) => { t += dt * 0.8; if (t > 6.1) t = 0.2; st.set(t); say(); }, { autoplay: false }); an.button(ctl);
  function say() {
    const c = C[key], dx = c.dx(t), dy = c.dy(t);
    out.innerHTML = `${c.rule}. At t = ${t.toFixed(2)}: dx/dt = ${dx.toFixed(2)}, dy/dt = ${dy.toFixed(2)}, so dy/dx = <b>${Math.abs(dx) < 0.03 ? 'vertical' : (dy / dx).toFixed(3)}</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const c = C[key]; title(ctx, `Tangent to a ${c.n} given by x(t), y(t)`, col);
    const ry = ((c.X[1] - c.X[0]) / 2) * (((h - 26) - 40) / (w - 42)), A = axes(ctx, w, h, col, { x: c.X, y: key === 'circle' ? [-ry, ry] : c.Y, l: 28, r: 14, t: 40, b: 26 });
    ctx.save(); A.clip();
    const pts = []; for (let u = 0; u <= c.T + 0.01; u += 0.05) { const [x, y] = c.P(u); pts.push([A.X(x), A.Y(y)]); } line(ctx, pts, col.s[0], 3);
    const [x, y] = c.P(t), dx = c.dx(t), dy = c.dy(t), L = Math.hypot(dx, dy) || 1, s = 2.2 / L;
    line(ctx, [[A.X(x - dx * s), A.Y(y - dy * s)], [A.X(x + dx * s), A.Y(y + dy * s)]], col.s[3], 2.5); ctx.restore();
    dot(ctx, A.X(x), A.Y(y), 6.5, col.s[3], col.ink);
  };
  say();
}
