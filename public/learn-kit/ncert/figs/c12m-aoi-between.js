// Class 12 Maths, Application of Integrals: area between two curves = ∫ (top − bottom) dx. Drag the two limit handles.
// While the curves do not cross, "top − bottom" is always positive. If a limit goes beyond a crossing the curves swap
// places: the signed integral ∫(f − g) subtracts the part where g is on top, so the true area must be split at the
// crossing. The readout shows the signed integral and the true area side by side.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

const PR = {
  pl: ['y = x + 2 and y = x²', (x) => x + 2, (x) => x * x, [-1.6, 2.6], [-1, 2]],
  pp: ['y = 4 − x² and y = x²', (x) => 4 - x * x, (x) => x * x, [-2.4, 2.4], [-1.414, 1.414]],
  sc: ['y = sin x and y = cos x', Math.sin, Math.cos, [0, 6.2], [Math.PI / 4, 5 * Math.PI / 4]],
  cub: ['y = x and y = x³', (x) => x, (x) => x ** 3, [-1.5, 1.5], [-1, 1]],
};
export default function (host) {
  let k = 'pl', a = -1, b = 2, g;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The region between two curves with two draggable limits' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  const reset = () => { [a, b] = PR[k][4]; sa.set(a); sb.set(b); };
  choice(c1, 'curves', Object.entries(PR).map(([i, v]) => [i, v[0].replace('y = ', '').replace(' and y = ', ' & ')]), k, (v) => { k = v; setR(); reset(); re(); });
  let sa, sb;
  const setR = () => { };
  sa = slider(c2, { label: 'a', min: -2.4, max: 6.2, step: 0.01, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = clampA(v); re(); } });
  sb = slider(c2, { label: 'b', min: -2.4, max: 6.2, step: 0.01, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = clampB(v); re(); } });
  const clampA = (v) => Math.max(PR[k][3][0], Math.min(v, b - 0.1)), clampB = (v) => Math.min(PR[k][3][1], Math.max(v, a + 0.1));
  const re = () => {
    cv.redraw(); const [, f, q] = PR[k], n = 2000; let sg = 0, ab = 0; for (let i = 0; i < n; i++) { const x = a + (i + 0.5) * (b - a) / n, d = (f(x) - q(x)) * (b - a) / n; sg += d; ab += Math.abs(d); }
    out.innerHTML = `Signed ∫(f − g) dx = <b>${sg.toFixed(3)}</b>. True area ∫|f − g| dx = <b>${ab.toFixed(3)}</b>.${Math.abs(sg - ab) > 0.005 ? ' They differ: a limit has gone past a crossing, so split the integral there.' : ' They agree: f stays on top over the whole range.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const [name, f, q, xr] = PR[k], t = title(ctx, name, col);
    let lo = 1e9, hi = -1e9; for (let i = 0; i <= 100; i++) { const x = xr[0] + (xr[1] - xr[0]) * i / 100; lo = Math.min(lo, f(x), q(x)); hi = Math.max(hi, f(x), q(x)); }
    const pad = (hi - lo) * 0.1; g = axes(ctx, w, h, col, { x: xr, y: [lo - pad, hi + pad], l: 34, b: 24, t: t + 4, r: 12 });
    ctx.save(); g.clip(); const n = 120;
    for (let i = 0; i < n; i++) { const x0 = a + i * (b - a) / n, x1 = x0 + (b - a) / n, xm = (x0 + x1) / 2, up = f(xm) >= q(xm); ctx.fillStyle = up ? col.s[0] : col.s[1]; ctx.globalAlpha = 0.32; ctx.beginPath(); ctx.moveTo(g.X(x0), g.Y(f(x0))); ctx.lineTo(g.X(x1), g.Y(f(x1))); ctx.lineTo(g.X(x1), g.Y(q(x1))); ctx.lineTo(g.X(x0), g.Y(q(x0))); ctx.fill(); }
    ctx.globalAlpha = 1; const p1 = [], p2 = []; for (let i = 0; i <= 120; i++) { const x = xr[0] + (xr[1] - xr[0]) * i / 120; p1.push([g.X(x), g.Y(f(x))]); p2.push([g.X(x), g.Y(q(x))]); } line(ctx, p1, col.s[0], 2.5); line(ctx, p2, col.s[1], 2.5); ctx.restore();
    for (const [v, lb] of [[a, 'a'], [b, 'b']]) { line(ctx, [[g.X(v), g.T], [g.X(v), g.B]], col.muted, 1, [4, 3]); dot(ctx, g.X(v), g.B, 6, col.ink, col.panel); text(ctx, lb, g.X(v), g.T + 8, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, 'f', g.R - 8, g.T + 10, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'g', g.R - 8, g.T + 25, { color: col.s[1], size: 12, weight: 700 });
  };
  let drag = null;
  const near = (x) => (Math.abs(x - g.X(a)) < 18 ? 'a' : Math.abs(x - g.X(b)) < 18 ? 'b' : null);
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); drag = near(e.clientX - r.left); if (drag) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; const r = cv.c.getBoundingClientRect(), xr = PR[k][3], v = xr[0] + (e.clientX - r.left - g.L) / (g.R - g.L) * (xr[1] - xr[0]); if (drag === 'a') { a = clampA(v); sa.set(a); } else { b = clampB(v); sb.set(b); } re(); });
  cv.c.addEventListener('pointerup', () => (drag = null));
  touchGuard(cv.c, (x) => g && near(x));
  re();
}
