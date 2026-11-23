// Class 12 Maths, Differential Equations: a slope field. The equation dy/dx = F(x, y) gives a slope at every point, drawn
// as a short tick. A solution curve is a path that follows the ticks. Click (or drag) anywhere to start a curve there;
// it is traced both ways with small steps (Euler's method, only for drawing). Change the equation to see the pattern.
import { canvas, axes, row, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

const EQ = { a: ['dy/dx = x', (x, y) => x], b: ['dy/dx = y', (x, y) => y], c: ['dy/dx = x + y', (x, y) => x + y], d: ['dy/dx = −x/y', (x, y) => -x / y], e: ['dy/dx = y/x', (x, y) => y / x], f: ['dy/dx = x − y', (x, y) => x - y] };
export default function (host) {
  let k = 'c', P = [0, 1], g;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A slope field with a solution curve through a chosen point' });
  const c1 = row(host), out = readout(host);
  choice(c1, 'equation', Object.entries(EQ).map(([i, v]) => [i, v[0].replace('dy/dx = ', '')]), k, (v) => { k = v; re(); });
  const re = () => { cv.redraw(); out.innerHTML = `<b>${EQ[k][0]}</b>. Slope at (${P[0].toFixed(1)}, ${P[1].toFixed(1)}) = <b>${EQ[k][1](P[0], P[1]).toFixed(2)}</b>. The coloured curve follows the ticks through your point.`; };
  const trace = (dir) => { const F = EQ[k][1], pts = [[...P]]; let [x, y] = P; const h = 0.02 * dir; for (let i = 0; i < 400; i++) { const m = F(x, y); if (!Number.isFinite(m)) break; const s = Math.hypot(1, m), dx = h / s * 1.0, dy = m * h / s; x += dx; y += dy; if (Math.abs(x) > 3 || Math.abs(y) > 3) break; pts.push([x, y]); } return pts; };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, EQ[k][0] + ': slope field', col), F = EQ[k][1];
    g = axes(ctx, w, h, col, { x: [-3, 3], y: [-3, 3], l: 30, b: 24, t: t + 4, r: 10, grid: false, xt: [-2, 0, 2], yt: [-2, 0, 2] });
    ctx.save(); g.clip();
    for (let i = -11; i <= 11; i++) for (let j = -11; j <= 11; j++) {
      const x = i * 0.27, y = j * 0.27, m = F(x, y); if (!Number.isFinite(m)) continue; const a = Math.atan(m), L = 0.11;
      line(ctx, [[g.X(x - L * Math.cos(a)), g.Y(y - L * Math.sin(a))], [g.X(x + L * Math.cos(a)), g.Y(y + L * Math.sin(a))]], col.line === col.muted ? col.muted : col.muted, 1.4);
    }
    for (const d of [1, -1]) line(ctx, trace(d).map(([x, y]) => [g.X(x), g.Y(y)]), col.s[0], 3);
    ctx.restore(); dot(ctx, g.X(P[0]), g.Y(P[1]), 6, col.s[1], col.panel);
  };
  let drag = false;
  const mv = (e) => { const r = cv.c.getBoundingClientRect(); P = [Math.max(-2.9, Math.min(2.9, -3 + (e.clientX - r.left - g.L) / (g.R - g.L) * 6)), Math.max(-2.9, Math.min(2.9, 3 - (e.clientY - r.top - g.T) / (g.B - g.T) * 6))]; re(); };
  cv.c.addEventListener('pointerdown', (e) => { drag = true; cv.c.setPointerCapture(e.pointerId); mv(e); });
  cv.c.addEventListener('pointermove', (e) => drag && mv(e));
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, (x, y) => g && Math.hypot(x - g.X(P[0]), y - g.Y(P[1])) < 30);
  re();
}
