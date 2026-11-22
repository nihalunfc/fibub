// 1.2 Partial derivatives as slopes of slices. Left: a height map of z = f(x, y) seen from above, with a point
// (x0, y0). Right: the two slices through that point, along x (y held at y0) and along y (x held at x0), each with
// its tangent line. The tangent slopes are f_x and f_y; the gradient arrow on the map combines them.
import { canvas, line, text, arrow, dot, row, slider, choice, readout, fmt, title } from '../../kit.js';

const FUNS = {
  bowl: { name: 'Bowl x² + y²', f: (x, y) => x * x + y * y, fx: (x) => 2 * x, fy: (x, y) => 2 * y, z: [0, 8] },
  saddle: { name: 'Saddle x² − y²', f: (x, y) => x * x - y * y, fx: (x) => 2 * x, fy: (x, y) => -2 * y, z: [-4, 4] },
  hill: { name: 'Hill e^−(x²+y²)', f: (x, y) => Math.exp(-(x * x + y * y)), fx: (x, y) => -2 * x * Math.exp(-(x * x + y * y)), fy: (x, y) => -2 * y * Math.exp(-(x * x + y * y)), z: [0, 1] },
  tilt: { name: 'Product xy', f: (x, y) => x * y, fx: (x, y) => y, fy: (x) => x, z: [-4, 4] },
};
const L = 2;

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 420, min: 300, label: 'Height map of a surface with a point, and the two slices through it with their tangent lines' });
  let key = 'saddle', x0 = 0.8, y0 = 0.6;
  const ctl = row(host);
  choice(ctl, 'Surface', Object.entries(FUNS).map(([k, v]) => [k, v.name]), key, (v) => { key = v; cv.redraw(); show(); });
  slider(ctl, { label: 'x₀', min: -1.8, max: 1.8, step: 0.05, value: x0, fmt: (v) => fmt(v, 3), oninput: (v) => { x0 = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'y₀', min: -1.8, max: 1.8, step: 0.05, value: y0, fmt: (v) => fmt(v, 3), oninput: (v) => { y0 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const F = FUNS[key], a = F.fx(x0, y0), b = F.fy(x0, y0);
    out.innerHTML = `At (${fmt(x0, 3)}, ${fmt(y0, 3)}): z = ${fmt(F.f(x0, y0), 4)}, ∂z/∂x = ${fmt(a, 4)} (slope of the x-slice), ∂z/∂y = ${fmt(b, 4)} (slope of the y-slice). Gradient (${fmt(a, 3)}, ${fmt(b, 3)}), steepest slope ${fmt(Math.hypot(a, b), 4)}. ${Math.hypot(a, b) < 1e-9 ? '<b>Both slopes are zero: a stationary point.</b>' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const F = FUNS[key];
    title(ctx, 'Map from above (left) and the two slices (right)', col);
    const top = 34, size = Math.min(w * 0.48, h - top - 26), mx = 10, my = top;
    const MX = (x) => mx + ((x + L) / (2 * L)) * size, MY = (y) => my + size - ((y + L) / (2 * L)) * size;
    const n = 40, cell = size / n;
    ctx.save();
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = -L + ((i + 0.5) * 2 * L) / n, y = -L + ((j + 0.5) * 2 * L) / n, z = F.f(x, y);
      const t = Math.max(0, Math.min(1, (z - F.z[0]) / (F.z[1] - F.z[0])));
      ctx.globalAlpha = 0.12 + 0.75 * t; ctx.fillStyle = col.s[0];
      ctx.fillRect(mx + i * cell, my + size - (j + 1) * cell, cell + 0.5, cell + 0.5);
    }
    ctx.restore();
    ctx.strokeStyle = col.line; ctx.strokeRect(mx, my, size, size);
    line(ctx, [[MX(-L), MY(y0)], [MX(L), MY(y0)]], col.s[2], 2, [5, 4]);
    line(ctx, [[MX(x0), MY(-L)], [MX(x0), MY(L)]], col.s[4], 2, [5, 4]);
    const a = F.fx(x0, y0), b = F.fy(x0, y0), g = Math.hypot(a, b);
    if (g > 1e-9) { const k = (0.45 * L) / Math.max(g, 1); arrow(ctx, MX(x0), MY(y0), MX(x0 + a * k), MY(y0 + b * k), col.ink, 2.5, 9); }
    dot(ctx, MX(x0), MY(y0), 4.5, col.ink);
    text(ctx, 'darker = higher · arrow = gradient', mx, my + size + 14, { color: col.muted, size: 11 });
    // slices
    const px = mx + size + 18, pw = w - px - 10, ph = (size - 16) / 2;
    const panel = (y, label, g1, slope, z0, c) => {
      const Y = (z) => y + ph - ((z - F.z[0]) / (F.z[1] - F.z[0])) * ph, X = (s) => px + ((s + L) / (2 * L)) * pw;
      ctx.strokeStyle = col.line; ctx.strokeRect(px, y, pw, ph);
      const pts = []; for (let i = 0; i <= 120; i++) { const s = -L + (2 * L * i) / 120; pts.push([X(s), Y(g1(s))]); }
      ctx.save(); ctx.beginPath(); ctx.rect(px, y, pw, ph); ctx.clip();
      line(ctx, pts, c, 2.5);
      const s0 = label === 'x' ? x0 : y0, d = 0.7;
      line(ctx, [[X(s0 - d), Y(z0 - slope * d)], [X(s0 + d), Y(z0 + slope * d)]], col.ink, 1.5, [4, 3]);
      dot(ctx, X(s0), Y(z0), 4, col.ink);
      ctx.restore();
      text(ctx, label === 'x' ? `slice y = ${fmt(y0, 2)}: slope ∂z/∂x = ${fmt(slope, 3)}` : `slice x = ${fmt(x0, 2)}: slope ∂z/∂y = ${fmt(slope, 3)}`, px + 4, y + 10, { color: col.ink, size: 11, halo: col.panel });
    };
    const z0 = F.f(x0, y0);
    panel(my, 'x', (s) => F.f(s, y0), a, z0, col.s[2]);
    panel(my + ph + 16, 'y', (s) => F.f(x0, s), b, z0, col.s[4]);
  };
  cv.redraw(); show();
}
