// Class 12 Maths, Application of Integrals: area under a curve as a sum of thin vertical strips. Each strip has
// height y = f(x) and width dx, so its area is y·dx; adding them from x = a to x = b gives A = ∫ₐᵇ y dx. Drag the two
// limit handles (or use the sliders) and raise n to watch the strip total settle on the exact area.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

const FN = { par: ['y = x²', (x) => x * x, (x) => x ** 3 / 3, 3, 9], sqrt: ['y² = 4x (top half)', (x) => 2 * Math.sqrt(x), (x) => 4 / 3 * x ** 1.5, 4, 5], sin: ['y = sin x', (x) => Math.sin(x), (x) => -Math.cos(x), 3.2, 1.2], lin: ['y = x + 1', (x) => x + 1, (x) => x * x / 2 + x, 3, 4] };
export default function (host) {
  let k = 'par', a = 0.5, b = 2, n = 8, g;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Thin vertical strips under a curve between two draggable limits' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'curve', Object.entries(FN).map(([i, v]) => [i, v[0]]), k, (v) => { k = v; a = Math.min(a, FN[k][3] - 0.6); b = Math.min(b, FN[k][3]); sa.set(a); sb.set(b); re(); });
  const sa = slider(c2, { label: 'a', min: 0, max: 3.5, step: 0.05, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = Math.min(v, b - 0.2); re(); } });
  const sb = slider(c2, { label: 'b', min: 0.3, max: 4, step: 0.05, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = Math.max(v, a + 0.2); re(); } });
  slider(c2, { label: 'strips', min: 1, max: 60, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); re(); } });
  const re = () => { cv.redraw(); const [, f, F] = FN[k], d = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * d) * d; out.innerHTML = `Each strip: y·dx. Sum of ${n} strips = <b>${s.toFixed(3)}</b>. Exact ∫ₐᵇ y dx = F(b) − F(a) = <b>${(F(b) - F(a)).toFixed(3)}</b> square units.`; };
  cv.draw = (ctx, w, h, col) => {
    const [name, f, , xm] = FN[k], t = title(ctx, `Area under ${name} from x = a to x = b`, col);
    let hi = 0; for (let i = 0; i <= 100; i++) hi = Math.max(hi, f(xm * i / 100));
    g = axes(ctx, w, h, col, { x: [0, xm + 0.3], y: [0, hi * 1.12], l: 34, b: 24, t: t + 4, r: 12 });
    ctx.save(); g.clip(); const d = (b - a) / n;
    for (let i = 0; i < n; i++) { const x0 = a + i * d, hh = f(x0 + d / 2); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[0]; ctx.fillRect(g.X(x0), g.Y(hh), g.X(x0 + d) - g.X(x0), g.Y(0) - g.Y(hh)); ctx.globalAlpha = 0.8; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1; ctx.strokeRect(g.X(x0), g.Y(hh), g.X(x0 + d) - g.X(x0), g.Y(0) - g.Y(hh)); }
    ctx.globalAlpha = 1; const pts = []; for (let i = 0; i <= 120; i++) { const x = (xm + 0.3) * i / 120; pts.push([g.X(x), g.Y(f(x))]); } line(ctx, pts, col.ink, 2.5); ctx.restore();
    for (const [v, lb] of [[a, 'a'], [b, 'b']]) { line(ctx, [[g.X(v), g.Y(0)], [g.X(v), g.Y(f(v))]], col.s[1], 2); dot(ctx, g.X(v), g.Y(0), 6, col.s[1], col.panel); text(ctx, lb, g.X(v), g.B + 13, { color: col.s[1], size: 12, weight: 700, align: 'center' }); }
  };
  let drag = null;
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const near = (x) => (Math.abs(x - g.X(a)) < 18 ? 'a' : Math.abs(x - g.X(b)) < 18 ? 'b' : null);
  cv.c.addEventListener('pointerdown', (e) => { const [x] = pos(e); drag = near(x); if (drag) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; const [x] = pos(e), v = Math.max(0, Math.min(FN[k][3], (x - g.L) / (g.R - g.L) * (FN[k][3] + 0.3))); if (drag === 'a') { a = Math.min(v, b - 0.2); sa.set(a); } else { b = Math.max(v, a + 0.2); sb.set(b); } re(); });
  cv.c.addEventListener('pointerup', () => (drag = null));
  touchGuard(cv.c, (x) => g && near(x));
  re();
}
