// Class 12 Maths, Differential Equations: what "homogeneous" means. For dy/dx = (x + y)/x the slope depends only on the
// ratio y/x: 1 + y/x. All points on one straight line through the origin have the same y/x, so the ticks along that ray
// are all parallel. Turn the ray with the slider; this is why the substitution y = vx separates the variables.
import { canvas, axes, row, slider, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let th = 40;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A slope field where the slope is the same along every ray from the origin' });
  const c = row(host), out = readout(host);
  slider(c, { label: 'ray angle', min: 5, max: 85, step: 1, value: th, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { th = v; re(); } });
  const re = () => { cv.redraw(); const r = Math.tan(th * Math.PI / 180); out.innerHTML = `On this ray y/x = tan ${Math.round(th)}° = <b>${r.toFixed(2)}</b>, so every tick on it has slope 1 + y/x = <b>${(1 + r).toFixed(2)}</b>, whatever the distance from the origin.`; };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'dy/dx = (x + y)/x depends only on y/x', col), F = (x, y) => (x + y) / x;
    const g = axes(ctx, w, h, col, { x: [0, 3], y: [0, 3], l: 28, b: 24, t: t + 4, r: 12, grid: false, xt: [0, 1, 2, 3], yt: [0, 1, 2, 3] });
    ctx.save(); g.clip(); const tk = (x, y, c, wd) => { const a = Math.atan(F(x, y)), L = 0.09; line(ctx, [[g.X(x - L * Math.cos(a)), g.Y(y - L * Math.sin(a))], [g.X(x + L * Math.cos(a)), g.Y(y + L * Math.sin(a))]], c, wd); };
    for (let i = 1; i <= 11; i++) for (let j = 0; j <= 11; j++) tk(i * 0.27, j * 0.27, col.line, 1.3);
    const r = Math.tan(th * Math.PI / 180); line(ctx, [[g.X(0), g.Y(0)], [g.X(3), g.Y(3 * r)]], col.s[1], 1.5, [5, 4]);
    for (let d = 0.4; d < 4.4; d += 0.45) { const x = d / Math.hypot(1, r); if (x < 2.95 && x * r < 2.95) { tk(x, x * r, col.s[0], 3); } }
    ctx.restore(); text(ctx, `slope ${(1 + r).toFixed(2)} all along`, g.R - 6, g.B - 10, { color: col.s[0], size: 12, weight: 700, align: 'right', halo: col.panel });
  };
  re();
}
