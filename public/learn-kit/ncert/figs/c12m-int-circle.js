// Class 12 Maths, Integrals: the special integral ∫√(a² − x²) dx. The curve y = √(a² − x²) is the top half of a circle,
// so the area from 0 to x is a triangle plus a sector: ½x√(a² − x²) + ½a²·arcsin(x/a). Drag x (slider) and compare that
// formula with strips added up by computer, then put x = a to get the quarter circle πa²/4.
import { canvas, axes, row, slider, readout, line, text, title } from '../../kit.js';

export default function (host) {
  let a = 2, x = 1.2;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A quarter circle with the area up to x split into a triangle and a sector' });
  const c = row(host), out = readout(host);
  const sa = slider(c, { label: 'radius a', min: 1, max: 3, step: 0.1, value: a, fmt: (v) => v.toFixed(1), oninput: (v) => { a = v; x = Math.min(x, a); re(); } });
  slider(c, { label: 'x', min: 0, max: 3, step: 0.02, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = Math.min(v, a); re(); } });
  const re = () => {
    cv.redraw(); const n = 2000; let s = 0; for (let i = 0; i < n; i++) s += Math.sqrt(Math.max(0, a * a - ((i + 0.5) * x / n) ** 2)) * x / n;
    const T = 0.5 * x * Math.sqrt(a * a - x * x), S = 0.5 * a * a * Math.asin(x / a);
    out.innerHTML = `Triangle ½x√(a²−x²) = ${T.toFixed(3)}; sector ½a²·arcsin(x/a) = ${S.toFixed(3)}; together <b>${(T + S).toFixed(3)}</b>. Strips: <b>${s.toFixed(3)}</b>.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Area under √(a² − x²) = triangle + sector', col), f = (v) => Math.sqrt(Math.max(0, a * a - v * v));
    const g = axes(ctx, w, h, col, { x: [-0.2, 3.2], y: [-0.2, 3.2], l: 34, b: 24, t: t + 4, r: 10, grid: false });
    ctx.save(); g.clip();
    const sector = (c) => { ctx.fillStyle = c; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); ctx.lineTo(g.X(x), g.Y(f(x))); const a0 = Math.acos(x / a); for (let i = 0; i <= 40; i++) { const th = a0 + (Math.PI / 2 - a0) * i / 40; ctx.lineTo(g.X(a * Math.cos(th)), g.Y(a * Math.sin(th))); } ctx.fill(); ctx.globalAlpha = 1; };
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); ctx.lineTo(g.X(x), g.Y(0)); ctx.lineTo(g.X(x), g.Y(f(x))); ctx.fill(); ctx.globalAlpha = 1;
    sector(col.s[1]);
    const pts = []; for (let i = 0; i <= 100; i++) { const v = a * i / 100; pts.push([g.X(v), g.Y(f(v))]); } line(ctx, pts, col.ink, 2.5);
    line(ctx, [[g.X(0), g.Y(0)], [g.X(x), g.Y(f(x))]], col.muted, 1.5, [4, 3]); line(ctx, [[g.X(x), g.Y(0)], [g.X(x), g.Y(f(x))]], col.ink, 1.5);
    ctx.restore();
    text(ctx, 'triangle', g.X(x * 0.7), g.Y(f(x) * 0.25), { color: col.s[0], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'sector', g.X(Math.min(x, a) * 0.35 + 0.1), g.Y(a * 0.8), { color: col.s[1], size: 11.5, weight: 700, align: 'center', halo: col.panel });
  };
  re();
}
