// Class 12 Maths, Differential Equations: a general solution is a family of curves (one arbitrary constant for a first
// order equation), and a particular solution is the one member through a chosen point. Click anywhere on the graph:
// the constant is worked out so that the curve passes through the click. Each tick shows the slope the equation demands.
import { canvas, axes, row, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

const FM = {
  ex: { name: 'dy/dx = y', sol: 'y = C eˣ', y: (x, C) => C * Math.exp(x), C: (x, y) => y / Math.exp(x), xr: [-2, 2], yr: [-5, 5] },
  sq: { name: 'x dy/dx = 2y', sol: 'y = C x²', y: (x, C) => C * x * x, C: (x, y) => y / (x * x), xr: [-2, 2], yr: [-5, 5] },
  lin: { name: 'dy/dx = 2x', sol: 'y = x² + C', y: (x, C) => x * x + C, C: (x, y) => y - x * x, xr: [-2, 2], yr: [-5, 5] },
  circ: { name: 'x + y dy/dx = 0', sol: 'x² + y² = C', y: (x, C) => Math.sqrt(Math.max(0, C - x * x)), C: (x, y) => x * x + y * y, xr: [-3, 3], yr: [-3, 3], circle: true },
};
export default function (host) {
  let k = 'ex', P = [0, 1], g;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 320, label: 'A family of solution curves with one particular solution through a chosen point' });
  const c1 = row(host), out = readout(host);
  choice(c1, 'equation', Object.entries(FM).map(([i, v]) => [i, v.name]), k, (v) => { k = v; P = v === 'circ' ? [1, 1] : v === 'sq' ? [1, 1] : [0, 1]; re(); });
  const re = () => {
    cv.redraw(); const m = FM[k], C = m.C(P[0], P[1]);
    out.innerHTML = Number.isFinite(C) ? `General solution: <b>${m.sol}</b>. The curve through (${P[0].toFixed(2)}, ${P[1].toFixed(2)}) has C = <b>${C.toFixed(2)}</b>, the particular solution.` : 'x = 0 cannot fix C for this family: click elsewhere.';
  };
  cv.draw = (ctx, w, h, col) => {
    const m = FM[k], t = title(ctx, `${m.name}  ⇒  ${m.sol}`, col);
    g = axes(ctx, w, h, col, { x: m.xr, y: m.yr, l: 30, b: 24, t: t + 4, r: 10 });
    ctx.save(); g.clip();
    const Cs = m.circle ? [0.5, 1.5, 3, 5, 7, 9] : [-3, -2, -1, -0.5, 0.5, 1, 2, 3];
    for (const C of Cs) { for (const sg of m.circle ? [1, -1] : [1]) { const p = []; for (let i = 0; i <= 120; i++) { const x = m.xr[0] + (m.xr[1] - m.xr[0]) * i / 120, y = sg * m.y(x, C); if (Number.isFinite(y) && !(m.circle && x * x > C)) p.push([g.X(x), g.Y(y)]); } line(ctx, p, col.line, 1.5); } }
    const C = m.C(P[0], P[1]);
    if (Number.isFinite(C)) for (const sg of m.circle ? [Math.sign(P[1]) || 1] : [1]) { const p = []; for (let i = 0; i <= 160; i++) { const x = m.xr[0] + (m.xr[1] - m.xr[0]) * i / 160, y = sg * m.y(x, C); if (!(m.circle && x * x > C)) p.push([g.X(x), g.Y(y)]); } line(ctx, p, col.s[0], 3); }
    ctx.restore(); dot(ctx, g.X(P[0]), g.Y(P[1]), 6, col.s[1], col.panel);
    text(ctx, 'click or drag to choose the point', g.L + 6, g.T + 10, { color: col.muted, size: 10.5 });
  };
  let drag = false;
  const mv = (e) => { const r = cv.c.getBoundingClientRect(), m = FM[k]; P = [m.xr[0] + (e.clientX - r.left - g.L) / (g.R - g.L) * (m.xr[1] - m.xr[0]), m.yr[0] + (g.B - (e.clientY - r.top)) / (g.B - g.T) * (m.yr[1] - m.yr[0])]; P = [Math.max(m.xr[0], Math.min(m.xr[1], P[0])), Math.max(m.yr[0], Math.min(m.yr[1], P[1]))]; re(); };
  cv.c.addEventListener('pointerdown', (e) => { drag = true; cv.c.setPointerCapture(e.pointerId); mv(e); });
  cv.c.addEventListener('pointermove', (e) => drag && mv(e));
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, (x, y) => g && Math.hypot(x - g.X(P[0]), y - g.Y(P[1])) < 30);
  re();
}
