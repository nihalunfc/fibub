// Class 12 Maths, Application of Integrals: the integral gives a signed area. Where the curve is below the x-axis the
// strips have negative height, so the integral subtracts. For the true area, split at every place the curve crosses
// the axis and add the absolute values. Slide the right limit past a zero and watch the two totals separate.
import { canvas, axes, row, slider, choice, readout, line, text, title } from '../../kit.js';

const FN = { sin: ['y = sin x', Math.sin, [0, 6.4], [0, 2 * Math.PI]], cub: ['y = x³ − x', (x) => x ** 3 - x, [-1.5, 1.5], [-1.2, 1.2]], par: ['y = x² − 1', (x) => x * x - 1, [-0.2, 2.4], [0, 2]] };
export default function (host) {
  let k = 'sin', b = 5, a = 0, g;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A curve crossing the x-axis with positive and negative areas shaded differently' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'curve', Object.entries(FN).map(([i, v]) => [i, v[0]]), k, (v) => { k = v; a = FN[k][2][0] + (k === 'cub' ? 0.1 : 0); b = FN[k][3][1]; sb.set(b); re(); });
  const sb = slider(c2, { label: 'right limit b', min: -1.2, max: 6.28, step: 0.02, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = Math.max(a + 0.05, Math.min(v, FN[k][3][1])); re(); } });
  const re = () => {
    cv.redraw(); const f = FN[k][1], n = 4000; let sg = 0, ab = 0, lo = k === 'cub' ? -1.2 : 0; a = lo; for (let i = 0; i < n; i++) { const x = a + (i + 0.5) * (b - a) / n, d = f(x) * (b - a) / n; sg += d; ab += Math.abs(d); }
    out.innerHTML = `Signed ∫ₐᵇ y dx = <b>${sg.toFixed(3)}</b> (below-axis part counts negative). Area between the curve and the x-axis = <b>${ab.toFixed(3)}</b>.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const [name, f, xr] = FN[k], t = title(ctx, name + ': blue above, orange below the axis', col), lo = k === 'cub' ? -1.2 : 0; a = lo;
    let mn = 0, mx = 0; for (let i = 0; i <= 100; i++) { const v = f(xr[0] + (xr[1] - xr[0]) * i / 100); mn = Math.min(mn, v); mx = Math.max(mx, v); }
    g = axes(ctx, w, h, col, { x: xr, y: [mn * 1.2 - 0.1, mx * 1.2 + 0.1], l: 34, b: 24, t: t + 4, r: 12 });
    ctx.save(); g.clip(); const n = 160;
    for (let i = 0; i < n; i++) { const x0 = a + i * (b - a) / n, x1 = x0 + (b - a) / n, v = f((x0 + x1) / 2); ctx.globalAlpha = 0.35; ctx.fillStyle = v >= 0 ? col.s[0] : col.s[1]; ctx.fillRect(g.X(x0), Math.min(g.Y(0), g.Y(v)), g.X(x1) - g.X(x0) + 0.6, Math.abs(g.Y(v) - g.Y(0))); }
    ctx.globalAlpha = 1; const pts = []; for (let i = 0; i <= 160; i++) { const x = xr[0] + (xr[1] - xr[0]) * i / 160; pts.push([g.X(x), g.Y(f(x))]); } line(ctx, pts, col.ink, 2.5);
    line(ctx, [[g.X(b), g.Y(0)], [g.X(b), g.Y(f(b))]], col.s[3], 2); ctx.restore(); text(ctx, 'b', g.X(b) + 8, g.T + 10, { color: col.s[3], size: 12, weight: 700, align: 'center' });
  };
  re();
}
