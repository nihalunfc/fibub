// Divergence and curl of a 2D vector field, felt by a probe. Dots drift along the field. Drag the probe (the ring):
// the paddle wheel inside spins at half the curl, and the readout gives div F (how much the flow spreads out of a point)
// and curl F (how much it swirls). Try a source (div > 0, no curl), a whirlpool (curl, no div), a shear (curl without
// any circulation of the dots), and a saddle (stretches one way, squeezes the other, div = 0).
import { canvas, axes, row, choice, readout, loop, dot, line, text, arrow, rng } from '../kit.js';
import { drag, f2 } from './_math.js';

const FLD = {
  src: ['Source (x, y)', (x, y) => [x, y]], vor: ['Whirlpool (−y, x)', (x, y) => [-y, x]], shear: ['Shear (y, 0)', (x, y) => [y, 0]], sad: ['Saddle (x, −y)', (x, y) => [x, -y]],
  spi: ['Spiral (x − y, x + y)', (x, y) => [x - y, x + y]], inv: ['Fading (x, y)/r³', (x, y) => { const r3 = Math.max(0.25, (x * x + y * y) ** 1.5); return [x / r3, y / r3]; }],
};
export default function (host) {
  let k = 'vor', pr = [1.2, 0.6], ang = 0;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 280, label: 'A vector field with moving dots and a paddle-wheel probe' });
  const c = row(host);
  choice(c, 'Field', Object.entries(FLD).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; reseed(); re(); });
  const R = rng(3); let P = [];
  const reseed = () => { P = Array.from({ length: 70 }, () => [R() * 6 - 3, R() * 6 - 3]); };
  reseed();
  const anim = loop(host, (dt) => { const F = FLD[k][1]; P = P.map(([x, y]) => { const [u, v] = F(x, y), s = Math.hypot(u, v) || 1, m = Math.min(1, 1.4 / s); const nx = x + u * dt * 0.6 * m, ny = y + v * dt * 0.6 * m; return Math.abs(nx) > 3.2 || Math.abs(ny) > 3.2 || Math.hypot(nx, ny) < 0.12 && k !== 'vor' ? [R() * 6 - 3, R() * 6 - 3] : [nx, ny]; }); const [d, cu] = dc(); ang += (cu / 2) * dt * 1.5; re(); });
  anim.button(c);
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? [[A0.X(pr[0]), A0.Y(pr[1])]] : []), (i, x, y) => { pr = [Math.max(-2.8, Math.min(2.8, -3 + ((x - A0.L) / (A0.R - A0.L)) * 6)), Math.max(-2.8, Math.min(2.8, 3 - ((y - A0.T) / (A0.B - A0.T)) * 6))]; re(); });
  const dc = () => { const F = FLD[k][1], e = 1e-3, [x, y] = pr, Fx = (F(x + e, y)[0] - F(x - e, y)[0]) / (2 * e), Gy = (F(x, y + e)[1] - F(x, y - e)[1]) / (2 * e), Gx = (F(x + e, y)[1] - F(x - e, y)[1]) / (2 * e), Fy = (F(x, y + e)[0] - F(x, y - e)[0]) / (2 * e); return [Fx + Gy, Gx - Fy]; };
  function re() { cv.redraw(); const [d, cu] = dc(); out.innerHTML = `At the probe (${f2(pr[0])}, ${f2(pr[1])}): div F = ∂F<sub>x</sub>/∂x + ∂F<sub>y</sub>/∂y = <b>${f2(d, 3)}</b> (${Math.abs(d) < 0.01 ? 'no net spreading' : d > 0 ? 'flow spreads out: a source' : 'flow squeezes in: a sink'}); curl F = ∂F<sub>y</sub>/∂x − ∂F<sub>x</sub>/∂y = <b>${f2(cu, 3)}</b> (${Math.abs(cu) < 0.01 ? 'no swirl: the paddle does not turn' : cu > 0 ? 'paddle turns anticlockwise' : 'paddle turns clockwise'}).`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-3, 3], y: [-3, 3], l: 8, b: 8, t: 22, r: 8, xt: [], yt: [], grid: false }); A0 = A; const F = FLD[k][1];
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    for (let i = -2.5; i <= 2.5; i += 0.5) for (let j = -2.5; j <= 2.5; j += 0.5) { const [u, v] = F(i, j), m = Math.hypot(u, v); if (m < 1e-6) continue; const s = Math.min(0.22, 0.12 * Math.sqrt(m)) / m * m; const L2 = 0.2 * Math.min(1, m) + 0.05; arrow(ctx, A.X(i), A.Y(j), A.X(i + (u / m) * L2), A.Y(j + (v / m) * L2), col.line, 1.5, 5); }
    P.forEach(([x, y]) => dot(ctx, A.X(x), A.Y(y), 2.2, col.s[0]));
    // paddle wheel at the probe
    const [px, py] = [A.X(pr[0]), A.Y(pr[1])], r = 20; for (let i = 0; i < 4; i++) { const a = ang + (i * Math.PI) / 2; line(ctx, [[px, py], [px + r * Math.cos(a), py - r * Math.sin(a)]], col.s[1], 3); dot(ctx, px + r * Math.cos(a), py - r * Math.sin(a), 3.5, col.s[1]); }
    ctx.beginPath(); ctx.arc(px, py, r + 6, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); dot(ctx, px, py, 3, col.ink);
    ctx.restore();
    text(ctx, 'drag the paddle wheel', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
