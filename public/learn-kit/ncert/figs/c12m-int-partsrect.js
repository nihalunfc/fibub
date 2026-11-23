// Class 12 Maths, Integrals: why integration by parts works. On a curve u = g(v), the area under the curve (∫u dv)
// and the area to its left (∫v du) together fill the rectangle u·v. So ∫u dv = uv − ∫v du. Slide the point along the
// curve: the two areas change but their sum is always the rectangle.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title } from '../../kit.js';

const CV = { sq: ['u = v²', (v) => v * v, 2], sqrt: ['u = √v', (v) => Math.sqrt(v), 4], ex: ['u = eᵛ − 1', (v) => Math.exp(v) - 1, 1.8] };
export default function (host) {
  let k = 'sq', b = 0.8;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A curve with the area under it and the area beside it adding to a rectangle' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'curve', Object.entries(CV).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; sl.set(b = Math.min(b, CV[k][2])); re(); });
  const sl = slider(c2, { label: 'v at the point', min: 0.1, max: 2, step: 0.02, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = Math.min(v, CV[k][2]); re(); } });
  const re = () => { cv.redraw(); const g = CV[k][1], n = 400; let A = 0; for (let i = 0; i < n; i++) A += g((i + 0.5) * b / n) * b / n; const R = b * g(b); out.innerHTML = `Under the curve ∫u dv = <b>${A.toFixed(3)}</b>. Beside it ∫v du = <b>${(R - A).toFixed(3)}</b>. Rectangle u·v = ${b.toFixed(2)} × ${g(b).toFixed(2)} = <b>${R.toFixed(3)}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const g = CV[k][1], ub = g(b), t = title(ctx, 'Two areas fill one rectangle: ∫u dv + ∫v du = uv', col);
    const vm = 2.2, um = Math.max(2.2, ub * 1.15);
    const ax = axes(ctx, w, h, col, { x: [0, vm], y: [0, um], l: 36, b: 40, t: t + 4, r: 10, xlabel: 'v', ylabel: 'u', grid: false });
    ctx.save(); ax.clip();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); for (let i = 0; i <= 60; i++) { const v = b * i / 60; ctx.lineTo(ax.X(v), ax.Y(g(v))); } ctx.lineTo(ax.X(b), ax.Y(0)); ctx.fill();
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); for (let i = 0; i <= 60; i++) { const v = b * i / 60; ctx.lineTo(ax.X(v), ax.Y(g(v))); } ctx.lineTo(ax.X(0), ax.Y(ub)); ctx.fill();
    ctx.globalAlpha = 1;
    const pts = []; for (let i = 0; i <= 100; i++) { const v = vm * i / 100; pts.push([ax.X(v), ax.Y(g(v))]); } line(ctx, pts, col.ink, 2.5);
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.strokeRect(ax.X(0), ax.Y(ub), ax.X(b) - ax.X(0), ax.Y(0) - ax.Y(ub)); ctx.restore();
    dot(ctx, ax.X(b), ax.Y(ub), 5, col.ink, col.panel);
    text(ctx, '∫u dv', ax.X(b * 0.72), ax.Y(ub * 0.25) , { color: col.s[0], size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, '∫v du', ax.X(b * 0.22), ax.Y(ub * 0.82), { color: col.s[1], size: 12, weight: 700, align: 'center', halo: col.panel });
  };
  re();
}
