// Class 12 Maths, Application of Integrals: the same area counted with vertical strips and with horizontal strips.
// The region lies between the y-axis, the parabola y = x² and the line y = h. Vertical strips have height (h − x²) and
// width dx: A = ∫₀^√h (h − x²) dx. Horizontal strips have length x = √y and thickness dy: A = ∫₀ʰ √y dy. Both give
// (2/3)h^(3/2). Pick the direction that makes the integral simpler (here, the horizontal one needs no subtraction).
import { canvas, axes, row, slider, choice, readout, line, text, title } from '../../kit.js';

export default function (host) {
  let h0 = 4, dir = 'v', n = 10;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A region under a line and above a parabola cut into vertical or horizontal strips' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'strips', [['v', 'vertical (dx)'], ['h', 'horizontal (dy)']], dir, (v) => { dir = v; re(); });
  slider(c2, { label: 'line y = h', min: 1, max: 5, step: 0.1, value: h0, fmt: (v) => v.toFixed(1), oninput: (v) => { h0 = v; re(); } });
  slider(c2, { label: 'strips', min: 2, max: 40, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); re(); } });
  const re = () => {
    cv.redraw(); let s = 0; const e = (2 / 3) * h0 ** 1.5;
    if (dir === 'v') { const X = Math.sqrt(h0), d = X / n; for (let i = 0; i < n; i++) s += (h0 - ((i + 0.5) * d) ** 2) * d; out.innerHTML = `Vertical: ∫₀^√h (h − x²) dx, sum = <b>${s.toFixed(3)}</b>. Needs “top minus bottom”.`; }
    else { const d = h0 / n; for (let i = 0; i < n; i++) s += Math.sqrt((i + 0.5) * d) * d; out.innerHTML = `Horizontal: ∫₀ʰ √y dy, sum = <b>${s.toFixed(3)}</b>. One simple function, no subtraction.`; }
    out.innerHTML += ` Exact = (2/3)h^(3/2) = <b>${e.toFixed(3)}</b>.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, dir === 'v' ? 'Vertical strips: height h − x², width dx' : 'Horizontal strips: length √y, thickness dy', col);
    const g = axes(ctx, w, h, col, { x: [0, 2.4], y: [0, 5.4], l: 30, b: 24, t: t + 4, r: 12, xlabel: undefined });
    ctx.save(); g.clip(); ctx.fillStyle = col.s[0]; ctx.strokeStyle = col.s[0];
    if (dir === 'v') { const X = Math.sqrt(h0), d = X / n; for (let i = 0; i < n; i++) { const x0 = i * d, hh = h0 - ((i + 0.5) * d) ** 2; ctx.globalAlpha = 0.3; ctx.fillRect(g.X(x0), g.Y(h0), g.X(x0 + d) - g.X(x0), g.Y(h0 - hh) - g.Y(h0)); ctx.globalAlpha = 0.9; ctx.lineWidth = 1; ctx.strokeRect(g.X(x0), g.Y(h0), g.X(x0 + d) - g.X(x0), g.Y(h0 - hh) - g.Y(h0)); } }
    else { const d = h0 / n; for (let i = 0; i < n; i++) { const y0 = i * d, ww = Math.sqrt((i + 0.5) * d); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[1]; ctx.fillRect(g.X(0), g.Y(y0 + d), g.X(ww) - g.X(0), g.Y(y0) - g.Y(y0 + d)); ctx.globalAlpha = 0.9; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1; ctx.strokeRect(g.X(0), g.Y(y0 + d), g.X(ww) - g.X(0), g.Y(y0) - g.Y(y0 + d)); } }
    ctx.globalAlpha = 1; const pts = []; for (let i = 0; i <= 100; i++) { const x = 2.4 * i / 100; pts.push([g.X(x), g.Y(x * x)]); } line(ctx, pts, col.ink, 2.5);
    line(ctx, [[g.X(0), g.Y(h0)], [g.X(2.4), g.Y(h0)]], col.s[3], 2, [5, 4]); ctx.restore();
    text(ctx, 'y = x²', g.X(1.9), g.Y(3.2), { color: col.ink, size: 12, weight: 700, halo: col.panel }); text(ctx, `y = ${h0.toFixed(1)}`, g.R - 4, g.Y(h0) - 9, { color: col.s[3], size: 11.5, weight: 700, align: 'right' });
  };
  re();
}
