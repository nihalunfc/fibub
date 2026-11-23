// Class 11 Mechanical Properties of Fluids (step player): why pressure grows with depth. Take a vertical column of liquid of area A from the surface down to depth h. It is in equilibrium, so forces balance:
// air pushes down P0 A on the top, the weight is (rho A h) g, and the liquid below pushes up P A. P A = P0 A + rho A h g, so P = P0 + rho g h.
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'A column of liquid in equilibrium with the forces on it, used to derive pressure at depth' });
  const T = ['Pick an imaginary column of liquid', 'Its weight', 'The air pushes down on top', 'The liquid below pushes up', 'Balance the forces'];
  const L = [['A column of area A reaching from the surface', 'to depth h. It is at rest: forces balance.'], ['mass = density × volume = ρ A h', 'weight = ρ A h g (down)'], ['P₀ is the air pressure at the surface', 'force on top = P₀ A (down)'], ['Pressure P at depth h acts on the bottom face', 'force = P A (up)'], ['P A = P₀ A + ρ A h g', 'P = P₀ + ρ g h   (A cancels: shape does not matter)']];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 12, x0 = 16, x1 = w * 0.62, sy = top + 30, by = h - 90, cx = (x0 + x1) / 2, cw = 60;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(x0, sy, x1 - x0, by - sy + 30); ctx.globalAlpha = 1; line(ctx, [[x0, sy], [x1, sy]], col.s[0], 2);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fillRect(cx - cw / 2, sy, cw, by - sy); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.strokeRect(cx - cw / 2, sy, cw, by - sy); ctx.setLineDash([]);
    text(ctx, 'h', cx - cw / 2 - 12, (sy + by) / 2, { color: col.ink, size: 12, weight: 700 }); arrow(ctx, cx - cw / 2 - 5, sy + 2, cx - cw / 2 - 5, by - 2, col.ink, 1.2, 5); text(ctx, 'area A', cx, by + 12, { color: col.ink, size: 10.5, align: 'center' });
    if (step >= 1) { arrow(ctx, cx, (sy + by) / 2 - 10, cx, (sy + by) / 2 + 40, col.s[1], 3, 8); text(ctx, 'ρAhg', cx + 8, (sy + by) / 2 + 24, { color: col.s[1], size: 11.5, weight: 700 }); }
    if (step >= 2) { arrow(ctx, cx - 14, sy - 26, cx - 14, sy - 2, col.s[2], 3, 8); arrow(ctx, cx + 14, sy - 26, cx + 14, sy - 2, col.s[2], 3, 8); text(ctx, 'P₀A', cx + 22, sy - 16, { color: col.s[2], size: 11.5, weight: 700 }); }
    if (step >= 3) { arrow(ctx, cx, by + 40, cx, by + 4, col.s[3], 3, 8); text(ctx, 'PA', cx + 8, by + 30, { color: col.s[3], size: 11.5, weight: 700 }); }
    L[step].forEach((s, i) => text(ctx, s, w / 2, h - 34 + i * 18, { color: i ? col.s[7] : col.ink, size: 12, weight: 700, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
