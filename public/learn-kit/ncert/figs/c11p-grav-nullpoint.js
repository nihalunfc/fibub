// Class 11 Gravitation: superposition. Between two bodies (masses M1 and M2 = e M1, distance D) the pulls point opposite ways. Net field g(x) = G M1/x^2 - G M2/(D-x)^2 (positive = towards body 1).
// It is zero at the neutral point x = D / (1 + sqrt(e)). For Earth and Moon (e = 1/81.3) that is 0.9 D from the Earth, 346 000 km from Earth's centre.
import { canvas, axes, line, text, title, dot, arrow, row, slider, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let eps = 0.0123, x = 0.5, drag = false;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The net gravitational field between two bodies along the line joining them, with a neutral point where it is zero' });
  const ctl = row(host);
  slider(ctl, { label: 'Second body mass ÷ first body mass', min: 0.01, max: 0.5, step: 0.01, value: 0.0123, fmt: (v) => v.toFixed(3) + (Math.abs(v - 0.0123) < 0.006 ? ' (Moon ÷ Earth)' : ''), oninput: (v) => { eps = v; cv.redraw(); } });
  const sx = slider(ctl, { label: 'Test point (fraction of the way)', min: 0.05, max: 0.97, step: 0.01, value: 0.5, fmt: (v) => v.toFixed(2) + ' D', oninput: (v) => { x = v; cv.redraw(); } });
  const ro = readout(host);
  const g = (u) => 1 / (u * u) - eps / ((1 - u) * (1 - u));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Two pulls in opposite directions', col), y0 = top + 38, xa = 40, xb = w - 40, X = (u) => xa + u * (xb - xa);
    line(ctx, [[xa, y0], [xb, y0]], col.line, 1.5);
    dot(ctx, xa, y0, 15, col.s[0], col.panel); dot(ctx, xb, y0, 7 + 10 * Math.sqrt(eps) * 2, col.s[2], col.panel);
    text(ctx, 'big', xa, y0 + 26, { color: col.s[0], size: 10, weight: 700, align: 'center' }); text(ctx, 'small', xb, y0 + 26, { color: col.s[2], size: 10, weight: 700, align: 'center' });
    const u0 = 1 / (1 + Math.sqrt(eps)); line(ctx, [[X(u0), y0 - 12], [X(u0), y0 + 12]], col.good, 2); text(ctx, 'neutral', X(u0), y0 - 20, { color: col.good, size: 10, weight: 700, align: 'center' });
    const g1 = 1 / (x * x), g2 = eps / ((1 - x) * (1 - x)), sc = 26 / Math.max(g1, g2, 1);
    dot(ctx, X(x), y0, 5, col.ink);
    arrow(ctx, X(x), y0 - 12, X(x) - Math.min(70, g1 * sc * 2.2), y0 - 12, col.s[0], 2.5); arrow(ctx, X(x), y0 - 12, X(x) + Math.min(70, g2 * sc * 2.2), y0 - 12, col.s[2], 2.5);
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [-6, 6], xt: [0, 0.25, 0.5, 0.75, 1], yt: [-6, -3, 0, 3, 6], xlabel: 'position between the bodies (fraction of D)', ylabel: 'net field (units of GM₁/D²)', t: y0 + 40, l: 44 });
    const pts = []; for (let k = 3; k <= 197; k++) { const u = k / 200; pts.push([A.X(u), A.Y(Math.max(-6, Math.min(6, g(u))))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[1], 3); ctx.restore();
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1);
    dot(ctx, A.X(u0), A.Y(0), 6, col.good, col.panel);
    dot(ctx, A.X(x), A.Y(Math.max(-6, Math.min(6, g(x)))), 6, col.ink, col.panel);
    ro.textContent = `At ${x.toFixed(2)} D: pull of the big body ${g1.toFixed(2)}, pull of the small body ${g2.toFixed(2)} (units GM₁/D²), net ${g(x).toFixed(2)} toward the ${g(x) > 0 ? 'big' : 'small'} body. The pulls cancel at ${u0.toFixed(3)} D. Moon ÷ Earth mass = 0.0123 gives 0.90 D.`;
  };
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return e.clientX - r.left; };
  touchGuard(cv.c, () => false);
  cv.c.addEventListener('pointerdown', (e) => { const px = pos(e), u = (px - 40) / (cv.w - 80); if (Math.abs(u - x) < 0.07) { drag = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; x = Math.min(0.97, Math.max(0.05, Math.round((pos(e) - 40) / (cv.w - 80) * 100) / 100)); sx.set(x); cv.redraw(); });
  const up = () => { drag = false; }; cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
  cv.redraw();
}
