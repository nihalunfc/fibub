// Class 12 Maths, Application of Integrals: the area of a circle and an ellipse by integration. In the first quadrant
// x²/a² + y²/b² = 1 gives y = (b/a)√(a² − x²); strips of width dx add up to a quarter, so the whole area is
// 4 ∫₀ᵃ (b/a)√(a² − x²) dx = πab. Slide the semi-axes (equal axes make a circle) and the strip count.
import { canvas, axes, row, slider, readout, line, text, title } from '../../kit.js';

export default function (host) {
  let a = 2, b = 2, n = 8;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'An ellipse filled with thin vertical strips whose total approaches pi a b' });
  const c = row(host), out = readout(host);
  slider(c, { label: 'a (along x)', min: 0.8, max: 3, step: 0.1, value: a, fmt: (v) => v.toFixed(1), oninput: (v) => { a = v; re(); } });
  slider(c, { label: 'b (along y)', min: 0.8, max: 3, step: 0.1, value: b, fmt: (v) => v.toFixed(1), oninput: (v) => { b = v; re(); } });
  slider(c, { label: 'strips', min: 2, max: 60, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); re(); } });
  const yy = (x) => (b / a) * Math.sqrt(Math.max(0, a * a - x * x));
  const re = () => { cv.redraw(); let s = 0; const d = a / n; for (let i = 0; i < n; i++) s += yy((i + 0.5) * d) * d; out.innerHTML = `Quarter from ${n} strips = ${s.toFixed(3)}; whole = 4 × = <b>${(4 * s).toFixed(3)}</b>. Exact πab = <b>${(Math.PI * a * b).toFixed(3)}</b>${a === b ? ' (a circle: πr²)' : ' (an ellipse)'}.`; };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, a === b ? 'Circle: A = 4∫₀ᵃ √(a² − x²) dx = πa²' : 'Ellipse: A = 4∫₀ᵃ (b/a)√(a² − x²) dx = πab', col), m = 3.3;
    const g = axes(ctx, w, h, col, { x: [-m, m], y: [-m, m], l: 30, b: 24, t: t + 4, r: 12, grid: false, xt: [-3, 0, 3], yt: [-3, 0, 3] });
    ctx.save(); g.clip(); const d = a / n;
    for (let i = 0; i < n; i++) for (const sx of [1, -1]) for (const sy of [1, -1]) {
      const x0 = i * d, hh = yy(x0 + d / 2), px = sx > 0 ? x0 : -(x0 + d), py = sy > 0 ? hh : -hh;
      ctx.globalAlpha = sx > 0 && sy > 0 ? 0.35 : 0.14; ctx.fillStyle = col.s[0]; ctx.fillRect(g.X(px), Math.min(g.Y(0), g.Y(py)), g.X(px + d) - g.X(px), Math.abs(g.Y(py) - g.Y(0)));
      if (sx > 0 && sy > 0) { ctx.globalAlpha = 0.9; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1; ctx.strokeRect(g.X(px), g.Y(py), g.X(px + d) - g.X(px), g.Y(0) - g.Y(py)); }
    }
    ctx.globalAlpha = 1; const pts = []; for (let i = 0; i <= 160; i++) { const th = 2 * Math.PI * i / 160; pts.push([g.X(a * Math.cos(th)), g.Y(b * Math.sin(th))]); } line(ctx, pts, col.ink, 2.5); ctx.restore();
    text(ctx, 'first quadrant: strips drawn', g.R - 4, g.T + 10, { color: col.s[0], size: 11, align: 'right' });
  };
  re();
}
