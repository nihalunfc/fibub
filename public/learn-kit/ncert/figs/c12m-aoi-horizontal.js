// Class 12 Maths, Application of Integrals (step player): choosing horizontal strips. The region between the parabola
// y² = 4x and the line y = x. Solve for x in terms of y: the parabola is x = y²/4 and the line is x = y. A horizontal strip
// at height y runs from the parabola (left) to the line (right), length y − y²/4, so A = ∫₀⁴ (y − y²/4) dy = 8/3.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 470, min: 360, label: 'The area between a parabola and a line found with horizontal strips' });
  const T = ['1. Sketch y² = 4x and y = x', '2. Find where they meet', '3. Rewrite both as x in terms of y', '4. Draw a horizontal strip: right minus left', '5. Integrate with respect to y', 'Check: A = 8/3'];
  const L = ['parabola y² = 4x (opens right), line y = x', 'y² = 4y ⇒ y(y − 4) = 0 ⇒ (0, 0) and (4, 4)', 'parabola x = y²/4, line x = y', 'strip at height y: from x = y²/4 to x = y, length y − y²/4, thickness dy', 'A = ∫₀⁴ (y − y²/4) dy = [y²/2 − y³/12]₀⁴ = 8 − 16/3', 'A = 8/3 ≈ 2.67 square units'];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col);
    text(ctx, L[step], 12, t + 14, { color: col.ink, size: 12, weight: 600 });
    const g = axes(ctx, w, h, col, { x: [-0.3, 5], y: [-0.3, 5], l: 30, b: 24, t: t + 28, r: 12 });
    ctx.save(); g.clip();
    if (step >= 3) { ctx.globalAlpha = 0.28; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); for (let i = 0; i <= 60; i++) { const y = 4 * i / 60; ctx.lineTo(g.X(y), g.Y(y)); } for (let i = 60; i >= 0; i--) { const y = 4 * i / 60; ctx.lineTo(g.X(y * y / 4), g.Y(y)); } ctx.fill(); ctx.globalAlpha = 1; }
    const pp = []; for (let i = 0; i <= 100; i++) { const y = 5 * i / 100; pp.push([g.X(y * y / 4), g.Y(y)]); } line(ctx, pp, col.s[1], 2.5); line(ctx, [[g.X(0), g.Y(0)], [g.X(5), g.Y(5)]], col.s[0], 2.5);
    if (step === 3 || step === 4) { const y = 2.5; ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.85; ctx.fillRect(g.X(y * y / 4), g.Y(y) - 3, g.X(y) - g.X(y * y / 4), 6); ctx.globalAlpha = 1; }
    ctx.restore();
    if (step >= 1) for (const [x, y] of [[0, 0], [4, 4]]) { dot(ctx, g.X(x), g.Y(y), 5, col.ink, col.panel); text(ctx, `(${x}, ${y})`, g.X(x) + 8, g.Y(y) + (y ? -10 : 12), { color: col.ink, size: 11, weight: 600, halo: col.panel }); }
    text(ctx, 'y² = 4x', g.X(3.4), g.Y(4.6), { color: col.s[1], size: 11.5, weight: 700 }); text(ctx, 'y = x', g.X(4.2), g.Y(3.2), { color: col.s[0], size: 11.5, weight: 700 });
    if (step === 3) text(ctx, 'strip', g.X(1.7), g.Y(2.5) - 10, { color: col.s[3], size: 11, weight: 700 });
    if (step === 5) text(ctx, 'A = 8/3', g.X(2.2), g.Y(1.5), { color: col.ink, size: 14, weight: 700, halo: col.panel });
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
