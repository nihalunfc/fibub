// Correlation by hand: drag any dot and watch r, the best-fit line and the slope update. Add an outlier with one button
// and see how a single point can swing r. Try: drag one dot far from the rest, then remove it; try the "residuals" switch
// to see the vertical gaps the line is built to keep small.
import { canvas, text, row, choice, button, readout, title, axes, dot, line, rng } from '../kit.js';

export default function (host) {
  const R = rng(9); const gs = () => Math.sqrt(-2 * Math.log(R() || 1e-9)) * Math.cos(2 * Math.PI * R());
  const init = () => Array.from({ length: 14 }, (_, i) => { const x = 1 + (i / 13) * 8; return [x, Math.min(9.5, Math.max(0.5, 1.5 + 0.6 * x + gs() * 0.9))]; });
  let P = init(), res = 'off', drag = -1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'A scatter plot with draggable points, best-fit line and correlation' });
  const c1 = row(host); choice(c1, 'Residuals', [['off', 'Hide'], ['on', 'Show gaps']], res, (v) => { res = v; draw(); });
  button(c1, 'Add outlier', () => { P.push([9, 0.8]); draw(); }); button(c1, 'Remove last', () => { if (P.length > 3) P.pop(); draw(); }); button(c1, 'Reset', () => { P = init(); draw(); });
  const out = readout(host);
  let ax;
  const fit = () => { const n = P.length, mx = P.reduce((s, p) => s + p[0], 0) / n, my = P.reduce((s, p) => s + p[1], 0) / n; let sxy = 0, sxx = 0, syy = 0; P.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }); const b = sxy / sxx; return { b, a: my - b * mx, r: sxy / Math.sqrt(sxx * syy), mx, my }; };
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.c.style.cursor = 'grab';
  const near = (px, py) => P.some((p) => Math.hypot(ax.X(p[0]) - px, ax.Y(p[1]) - py) < 22);
  cv.c.addEventListener('touchstart', (e) => { const t = e.touches[0], b = cv.c.getBoundingClientRect(); if (t && near(t.clientX - b.left, t.clientY - b.top)) e.preventDefault(); }, { passive: false });
  cv.c.addEventListener('pointerdown', (e) => { const [px, py] = pos(e); let best = 1e9; P.forEach((p, i) => { const d = Math.hypot(ax.X(p[0]) - px, ax.Y(p[1]) - py); if (d < best && d < 22) { best = d; drag = i; } }); if (drag >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (drag < 0) return; const [px, py] = pos(e); P[drag] = [Math.min(10, Math.max(0, 10 * (px - ax.L) / (ax.R - ax.L))), Math.min(10, Math.max(0, 10 * (ax.B - py) / (ax.B - ax.T)))]; draw(); });
  const up = () => { drag = -1; }; cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
  function draw() { const f = fit(); out.innerHTML = `<b>r = ${f.r.toFixed(2)}</b> (r² = ${(f.r * f.r).toFixed(2)}), line y = ${f.a.toFixed(2)} + ${f.b.toFixed(2)}x, ${P.length} points. ${Math.abs(f.r) < 0.3 ? 'Weak or no straight-line link.' : Math.abs(f.r) < 0.7 ? 'Moderate link.' : 'Strong straight-line link.'} Correlation is not causation, and one outlier can change it a lot.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    ax = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x (drag the dots)', ylabel: 'y', l: 36, t: 26, b: 38 });
    title(ctx, 'Drag a dot', col); const f = fit();
    if (res === 'on') P.forEach(([x, y]) => { ctx.save(); ctx.strokeStyle = col.bad; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(ax.X(x), ax.Y(y)); ctx.lineTo(ax.X(x), ax.Y(f.a + f.b * x)); ctx.stroke(); ctx.restore(); });
    ctx.save(); ax.clip(); line(ctx, [[ax.X(0), ax.Y(f.a)], [ax.X(10), ax.Y(f.a + f.b * 10)]], col.s[1], 2.5); ctx.restore();
    P.forEach(([x, y], i) => dot(ctx, ax.X(x), ax.Y(y), i === drag ? 8 : 6, col.s[0], col.panel));
  };
  draw();
}
