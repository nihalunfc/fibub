// Class 11 Motion in a Plane (step player): the projectile equations. Horizontal x = u cos(theta) t; vertical y = u sin(theta) t - (1/2) g t^2. Eliminating t gives the
// parabola y = x tan(theta) - g x^2 / (2 u^2 cos^2 theta). Time of flight T = 2 u sin(theta)/g, maximum height H = u^2 sin^2(theta)/(2g), range R = u^2 sin(2 theta)/g.
// The picture uses u = 20 m/s, theta = 45 degrees (g = 10 for round numbers).
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 330, label: 'Deriving the formulas for a projectile with a path that builds up step by step' });
  const T = ['Launch with speed u at angle θ', 'Horizontal motion: no acceleration', 'Vertical motion: acceleration −g', 'Eliminate t: the path is a parabola', 'Time of flight', 'Maximum height', 'Range'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const g = 10, u = 20, a = Math.PI / 4, vx = u * Math.cos(a), vy = u * Math.sin(a), TT = 2 * vy / g, R = vx * TT, H = vy * vy / (2 * g);
    const L = 20, gy = h * 0.5, S = Math.min((w - 2 * L) / R, (gy - 36) / H), X = (x) => L + x * S, Y = (y) => gy - y * S;
    line(ctx, [[L - 6, gy], [w - 10, gy]], col.ink, 2);
    const full = step >= 3 ? 1 : step === 0 ? 1 : 1; const pts = []; for (let i = 0; i <= 50; i++) { const q = (TT * i) / 50; pts.push([X(vx * q), Y(vy * q - 0.5 * g * q * q)]); }
    line(ctx, pts, col.s[0], 2.5, step < 3 ? [5, 4] : undefined);
    arrow(ctx, X(0), Y(0), X(0) + vx * 5, Y(0) - vy * 5, col.ink, 2.5, 9);
    text(ctx, 'u', X(0) + vx * 5 + 6, Y(0) - vy * 5 - 4, { size: 13, weight: 700 });
    ctx.beginPath(); ctx.arc(X(0), Y(0), 26, 0, -a, true); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.4; ctx.stroke(); text(ctx, 'θ', X(0) + 34, Y(0) - 8, { size: 12, weight: 700 });
    if (step === 0 || step === 1) { arrow(ctx, X(0), Y(0), X(0) + vx * 5, Y(0), col.s[1], 2.5, 8); text(ctx, 'u cosθ', X(0) + vx * 2.5 + 4, Y(0) + 14, { size: 11, weight: 700, color: col.s[1], align: 'center' }); }
    if (step === 0 || step === 2) { arrow(ctx, X(0), Y(0), X(0), Y(0) - vy * 5, col.s[2], 2.5, 8); text(ctx, 'u sinθ', X(0) + 6, Y(0) - vy * 2.6, { size: 11, weight: 700, color: col.s[2] }); }
    if (step === 4) { dot(ctx, X(R), Y(0), 7, col.s[3], col.ink); text(ctx, 'y = 0 again, at t = T', X(R) - 6, Y(0) - 12, { size: 11, weight: 700, color: col.s[3], align: 'right' }); }
    if (step === 5) { dot(ctx, X(R / 2), Y(H), 7, col.s[3], col.ink); line(ctx, [[X(R / 2), Y(0)], [X(R / 2), Y(H)]], col.s[3], 1.5, [4, 3]); text(ctx, 'top: vy = 0, at t = T/2', X(R / 2) + 10, Y(H) + 14, { size: 11, weight: 700, color: col.s[3] }); }
    if (step === 6) { line(ctx, [[X(0), Y(0) + 14], [X(R), Y(0) + 14]], col.s[3], 2.5); text(ctx, 'R', X(R / 2), Y(0) + 28, { size: 13, weight: 700, color: col.s[3], align: 'center' }); }
    const y0 = gy + 56, Ln = (s, i, c = col.ink) => text(ctx, s, 14, y0 + i * 22, { size: 13, weight: 700, color: c });
    if (step === 0) { Ln('ux = u cosθ,   uy = u sinθ', 0, col.ink); Ln('Gravity acts only downward.', 1, col.muted); }
    if (step === 1) { Ln('ax = 0  ⇒  vx = u cosθ  (constant)', 0, col.s[1]); Ln('x = (u cosθ) t', 1, col.s[1]); }
    if (step === 2) { Ln('ay = −g  ⇒  vy = u sinθ − g t', 0, col.s[2]); Ln('y = (u sinθ) t − ½ g t²', 1, col.s[2]); }
    if (step === 3) { Ln('t = x/(u cosθ) into y:', 0, col.muted); Ln('y = x tanθ − g x² / (2u² cos²θ)', 1, col.s[0]); Ln('of the form y = bx − cx²: a parabola', 2, col.muted); }
    if (step === 4) { Ln('y = 0:  t (u sinθ − ½ g t) = 0', 0, col.muted); Ln('T = 2u sinθ / g', 1, col.s[3]); }
    if (step === 5) { Ln('vy = 0 at t = u sinθ / g, so', 0, col.muted); Ln('H = u² sin²θ / 2g', 1, col.s[3]); }
    if (step === 6) { Ln('R = (u cosθ) T = 2u² sinθ cosθ / g', 0, col.muted); Ln('R = u² sin2θ / g   (max at 45°)', 1, col.s[3]); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 6); cv.redraw(); } };
}
