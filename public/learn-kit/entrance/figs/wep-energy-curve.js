// Work, energy and power: a potential energy curve U(x) with a total-energy line E. The ball can only be where
// E ≥ U; the gap E − U is its kinetic energy, the turning points are where E = U, and the force is −dU/dx
// (downhill on the curve). Equilibria sit where the slope is zero: stable at a valley, unstable at a hill.
import { canvas, axes, line, dot, text, row, slider, choice, readout, loop } from '../../kit.js';

const CURVES = {
  spring: { name: 'Spring (½kx²)', U: (x) => 0.5 * x * x, x: [-4, 4], y: [0, 9] },
  well: { name: 'Valley and hill', U: (x) => 0.25 * x ** 4 - 2 * x * x + 0.6 * x + 5.5, x: [-3.2, 3.2], y: [0, 9] },
  bond: { name: 'Two atoms (bond)', U: (x) => 6 * ((1.2 / x) ** 12 - 2 * (1.2 / x) ** 6) + 6, x: [0.95, 4], y: [0, 9] },
};
export default function (host) {
  let key = 'well', E = 5, x = 0, v = 0;
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 250, label: 'A potential energy curve with a total energy line and a ball moving between turning points' });
  const ctl = row(host);
  const start = () => { const c = CURVES[key]; // start at the lowest point that is allowed
    let best = c.x[0], bu = Infinity; for (let i = 0; i <= 400; i++) { const xi = c.x[0] + ((c.x[1] - c.x[0]) * i) / 400, u = c.U(xi); if (u < bu) { bu = u; best = xi; } }
    x = best; v = Math.sqrt(Math.max(0, 2 * (E - bu))); };
  choice(ctl, 'Curve', Object.entries(CURVES).map(([k, c]) => [k, c.name]), key, (k) => { key = k; start(); cv.redraw(); show(); });
  slider(ctl, { label: 'Total energy E', min: 0.5, max: 8.5, step: 0.1, value: E, fmt: (e) => `${e.toFixed(1)} J`, oninput: (e) => { E = e; start(); cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { // unit mass: a = −dU/dx, with energy kept by re-scaling the speed
    const c = CURVES[key], h = 1e-4;
    for (let i = 0; i < 10; i++) {
      const F = -(c.U(x + h) - c.U(x - h)) / (2 * h);
      v += F * dt / 10; x += v * dt / 10;
      if (x < c.x[0] || x > c.x[1]) { x = Math.min(c.x[1], Math.max(c.x[0], x)); v = -v; }
      const ke = E - c.U(x); if (ke > 0) v = Math.sign(v || 1) * Math.sqrt(2 * ke);
    }
    cv.redraw(); show();
  });
  anim.button(ctl);
  const out = readout(host);
  const show = () => {
    const c = CURVES[key], U = c.U(x), K = Math.max(0, E - U), h = 1e-4, F = -(c.U(x + h) - c.U(x - h)) / (2 * h);
    out.innerHTML = `At x = ${x.toFixed(2)} m: U = ${U.toFixed(2)} J, K = E − U = <b>${K.toFixed(2)} J</b>, force F = −dU/dx = <b>${F.toFixed(2)} N</b> (${Math.abs(F) < 0.05 ? 'about zero' : F > 0 ? 'pointing to +x' : 'pointing to −x'}).`;
  };
  cv.draw = (ctx, w, h, col) => {
    const c = CURVES[key];
    const { X, Y, clip, L, R } = axes(ctx, w, h, col, { x: c.x, y: c.y, xlabel: 'x (m)', ylabel: 'Energy (J)', t: 26 });
    ctx.save(); clip();
    const pts = []; for (let i = 0; i <= 300; i++) { const xi = c.x[0] + ((c.x[1] - c.x[0]) * i) / 300; pts.push([xi, c.U(xi)]); }
    // allowed region shading
    ctx.fillStyle = col.soft;
    for (let i = 0; i < 300; i++) if (pts[i][1] <= E) ctx.fillRect(X(pts[i][0]), Y(E), X(pts[i + 1][0]) - X(pts[i][0]) + 0.5, Y(Math.max(c.y[0], pts[i][1])) - Y(E));
    line(ctx, pts.map(([a, b]) => [X(a), Y(b)]), col.s[0], 2.5);
    line(ctx, [[L, Y(E)], [R, Y(E)]], col.s[1], 2, [6, 4]);
    // turning points
    for (let i = 0; i < 300; i++) { const [a, ua] = pts[i], [b, ub] = pts[i + 1]; if ((ua - E) * (ub - E) < 0) { const xt = a + ((E - ua) * (b - a)) / (ub - ua); dot(ctx, X(xt), Y(E), 4, col.s[2]); } }
    const U = c.U(x); line(ctx, [[X(x), Y(U)], [X(x), Y(E)]], col.s[3], 3);
    dot(ctx, X(x), Y(U), 7, col.s[3]);
    ctx.restore();
    text(ctx, 'E', R - 10, Y(E) - 9, { color: col.s[1], size: 12, weight: 700, align: 'right' });
    text(ctx, 'Shaded: where the ball can be. Thick bar: kinetic energy.', L + 4, 12, { color: col.muted, size: 11 });
  };
  start(); cv.redraw(); show();
}
