// Class 12 Maths, Application of Integrals (step player): the five-move method for an area between curves, shown on the
// region between y = x² and y = x + 2. (1) Sketch both curves. (2) Find where they meet. (3) Draw one thin strip and
// name top and bottom. (4) Write the integral of top − bottom. (5) Integrate and put in the limits: 9/2 square units.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 470, min: 360, label: 'Finding the area between a parabola and a line step by step' });
  const f = (x) => x + 2, q = (x) => x * x;
  const T = ['1. Sketch both curves', '2. Find where they meet', '3. Draw one thin strip: top and bottom', '4. Write the integral of (top − bottom)', '5. Integrate and use the limits', 'Check: the area is 9/2 = 4.5'];
  const L = [
    ['parabola y = x², line y = x + 2', 'ink'], ['x² = x + 2  ⇒  x² − x − 2 = 0  ⇒  (x − 2)(x + 1) = 0', 'ink'],
    ['strip at x: top y = x + 2, bottom y = x², width dx', 'ink'], ['A = ∫₋₁² [(x + 2) − x²] dx', 'ink'],
    ['= [x²/2 + 2x − x³/3] from −1 to 2 = (2 + 4 − 8/3) − (1/2 − 2 + 1/3)', 'ink'], ['= 10/3 + 7/6 = 9/2', 'ink'],
  ];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col);
    (step < 4 ? [L[step]] : step === 4 ? [L[4]] : [L[4], L[5]]).forEach((l, i) => text(ctx, l[0], 12, t + 14 + i * 18, { color: col.ink, size: 12, weight: 600 }));
    const g = axes(ctx, w, h, col, { x: [-2, 3], y: [-0.5, 5], l: 30, b: 24, t: t + 46, r: 12 });
    ctx.save(); g.clip();
    if (step >= 3) { ctx.globalAlpha = 0.28; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(g.X(-1), g.Y(1)); ctx.lineTo(g.X(2), g.Y(4)); for (let i = 0; i <= 60; i++) { const x = 2 - 3 * i / 60; ctx.lineTo(g.X(x), g.Y(q(x))); } ctx.fill(); ctx.globalAlpha = 1; }
    const p1 = [], p2 = []; for (let i = 0; i <= 100; i++) { const x = -2 + 5 * i / 100; p1.push([g.X(x), g.Y(q(x))]); p2.push([g.X(x), g.Y(f(x))]); } line(ctx, p1, col.s[1], 2.5); line(ctx, p2, col.s[0], 2.5);
    if (step === 2 || step === 3) { const x = 0.5; ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.8; ctx.fillRect(g.X(x) - 3, g.Y(f(x)), 6, g.Y(q(x)) - g.Y(f(x))); ctx.globalAlpha = 1; }
    ctx.restore();
    if (step >= 1) for (const [x, y] of [[-1, 1], [2, 4]]) { dot(ctx, g.X(x), g.Y(y), 5, col.ink, col.panel); text(ctx, `(${x}, ${y})`, g.X(x) + (x < 0 ? -6 : 6), g.Y(y) + (x < 0 ? 14 : -12), { color: col.ink, size: 11, weight: 600, align: x < 0 ? 'right' : 'left', halo: col.panel }); }
    text(ctx, 'y = x²', g.X(-1.7), g.Y(3.2), { color: col.s[1], size: 11.5, weight: 700 }); text(ctx, 'y = x + 2', g.X(1.2), g.Y(1.9), { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    if (step === 2) { text(ctx, 'top', g.X(0.62), g.Y(2.5), { color: col.s[3], size: 11, weight: 700 }); text(ctx, 'bottom', g.X(0.62), g.Y(0.12), { color: col.s[3], size: 11, weight: 700 }); }
    if (step === 5) text(ctx, 'A = 4.5', g.X(0.5), g.Y(2.2), { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
