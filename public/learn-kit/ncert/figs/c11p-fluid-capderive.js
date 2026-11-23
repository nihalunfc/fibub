// Class 11 Mechanical Properties of Fluids (step player): deriving the capillary rise. In a tube of radius r the liquid surface meets the glass at the angle of contact theta. Along the circle of contact (length 2 pi r) the surface tension
// S pulls along the surface, with an upward component S cos(theta) per unit length: total upward force 2 pi r S cos(theta). It holds up the column above the outside level, weight pi r^2 h rho g. Equal: h = 2 S cos(theta) / (r rho g).
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A capillary tube with the surface tension forces and weight of the raised column shown step by step' });
  const T = ['Water climbs a narrow tube', 'Surface tension acts along the contact circle', 'Its upward part holds the liquid up', 'The weight of the raised column', 'Balance gives the height'];
  const L = [['Liquid wets the glass (small contact angle θ)', 'and rises to height h above the outside level.'], ['At the wall S pulls along the surface, at angle θ to the wall.', 'Length of the circle: 2πr.'], ['Upward part per unit length: S cos θ', 'Total upward force = 2πr S cos θ'], ['Column volume ≈ πr²h (the small meniscus part is ignored)', 'weight = πr² h ρ g (down)'], ['2πr S cos θ = πr² h ρ g', 'h = 2 S cos θ / (r ρ g)']];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 14, cx = w * 0.42, tw = 30, lvl = top + (h - top) * 0.55, ly = lvl - 70, bot = h - 80;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.22; ctx.fillRect(16, lvl, w - 32, bot - lvl); ctx.globalAlpha = 1; line(ctx, [[16, lvl], [cx - tw - 3, lvl]], col.s[0], 2); line(ctx, [[cx + tw + 3, lvl], [w - 16, lvl]], col.s[0], 2);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.4; ctx.fillRect(cx - tw, ly, 2 * tw, lvl - ly + 40); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - tw, ly - 6); ctx.quadraticCurveTo(cx, ly + 14, cx + tw, ly - 6); ctx.stroke();
    line(ctx, [[cx - tw - 3, top], [cx - tw - 3, bot - 10]], col.ink, 3); line(ctx, [[cx + tw + 3, top], [cx + tw + 3, bot - 10]], col.ink, 3);
    line(ctx, [[cx + tw + 3, lvl], [cx + tw + 44, lvl]], col.muted, 1, [3, 3]); arrow(ctx, cx + tw + 34, lvl - 2, cx + tw + 34, ly - 4, col.ink, 1.3, 5); text(ctx, 'h', cx + tw + 40, (lvl + ly) / 2, { color: col.ink, size: 12, weight: 700 });
    if (step >= 1 && step <= 2) { arrow(ctx, cx - tw + 2, ly - 6, cx - tw + 2, ly - 38, col.s[1], 2.5, 7); arrow(ctx, cx + tw - 2, ly - 6, cx + tw - 2, ly - 38, col.s[1], 2.5, 7); text(ctx, step === 1 ? 'S per length' : '2πr S cosθ up', cx, ly - 46, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    if (step >= 3) { arrow(ctx, cx, ly + 6, cx, ly + 54, col.s[3], 3, 8); text(ctx, 'πr²hρg', cx + 6, ly + 36, { color: col.s[3], size: 11, weight: 700, halo: col.panel }); arrow(ctx, cx - tw + 2, ly - 6, cx - tw + 2, ly - 38, col.s[1], 2.5, 7); arrow(ctx, cx + tw - 2, ly - 6, cx + tw - 2, ly - 38, col.s[1], 2.5, 7); }
    L[step].forEach((s, i) => text(ctx, s, w / 2, h - 44 + i * 19, { color: i ? col.s[7] : col.ink, size: 12, weight: 700, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
