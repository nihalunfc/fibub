// Two circles. Slide the centre distance and the radii: the circles can be apart, touch outside, cut at two points,
// touch inside or sit one in the other, which decides how many common tangents they have (4, 3, 2, 1 or 0). When they
// cut, the dashed radical axis S₁ − S₂ = 0 is the line through both crossing points.
import { canvas, axes, row, slider, readout, dot, line, text } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let d = 5, r1 = 2.5, r2 = 1.5;
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 240, label: 'Two circles with their intersection points and radical axis' });
  const c = row(host);
  slider(c, { label: 'distance d', min: 0, max: 8, step: 0.1, value: d, fmt: (v) => f2(v, 1), oninput: (v) => { d = v; re(); } });
  slider(c, { label: 'radius r₁', min: 0.5, max: 4, step: 0.1, value: r1, fmt: (v) => f2(v, 1), oninput: (v) => { r1 = v; re(); } });
  slider(c, { label: 'radius r₂', min: 0.5, max: 4, step: 0.1, value: r2, fmt: (v) => f2(v, 1), oninput: (v) => { r2 = v; re(); } });
  const out = readout(host);
  const rel = () => { const e = 0.05, s = r1 + r2, df = Math.abs(r1 - r2);
    if (d > s + e) return ['Separate (one outside the other)', 4]; if (Math.abs(d - s) <= e) return ['Touching externally', 3];
    if (d > df + e) return ['Intersecting at two points', 2]; if (Math.abs(d - df) <= e) return ['Touching internally', 1]; return ['One inside the other', 0]; };
  const re = () => { cv.redraw(); const [n, t] = rel(); out.innerHTML = `d = ${f2(d, 1)}, r₁ + r₂ = ${f2(r1 + r2, 1)}, |r₁ − r₂| = ${f2(Math.abs(r1 - r2), 1)}. <b>${n}</b>: ${t} common tangent${t === 1 ? '' : 's'}. ${t === 2 && d > Math.abs(r1 - r2) + 0.05 ? `Common chord length = ${f2(2 * Math.sqrt(Math.max(0, r1 * r1 - ((d * d + r1 * r1 - r2 * r2) / (2 * d)) ** 2)))}.` : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-5, 8], y: [-4.5, 4.5], l: 10, b: 10, t: 22, r: 10, grid: false, xt: [], yt: [] });
    const s = A.X(1) - A.X(0), ccx = A.X(0), ccy = A.Y(0);
    const circ = (x, r2_, c) => { ctx.beginPath(); ctx.arc(A.X(x), ccy, r2_ * s, 0, 7); ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.stroke(); ctx.globalAlpha = 0.1; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; dot(ctx, A.X(x), ccy, 3, c); };
    circ(0, r1, col.s[0]); circ(d, r2, col.s[1]);
    if (d > 1e-6 && d <= r1 + r2 && d >= Math.abs(r1 - r2)) {
      const xx = (d * d + r1 * r1 - r2 * r2) / (2 * d), yy = Math.sqrt(Math.max(0, r1 * r1 - xx * xx));
      line(ctx, [[A.X(xx), A.Y(-4.4)], [A.X(xx), A.Y(4.4)]], col.muted, 1.5, [5, 4]);
      dot(ctx, A.X(xx), A.Y(yy), 5, col.ink); dot(ctx, A.X(xx), A.Y(-yy), 5, col.ink);
      text(ctx, 'radical axis', A.X(xx) + 6, A.Y(-4.1), { color: col.muted, size: 10 });
    }
    text(ctx, 'C₁', A.X(0), ccy + 12, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, 'C₂', A.X(d), ccy + 12, { color: col.s[1], size: 11, weight: 700, align: 'center' });
  };
  re();
}
