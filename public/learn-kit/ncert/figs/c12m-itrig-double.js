// Class 12 Maths, Inverse trigonometric functions (step player): 2 tan^-1 x = sin^-1(2x/(1+x^2)) for |x| <= 1. Take theta = tan^-1 x in a right triangle
// with legs 1 and x, then build the triangle for 2 theta: hypotenuse 1 + x^2, opposite 2x, adjacent 1 - x^2. Drawn for x = 0.75.
import { canvas, text, title, dot } from '../../kit.js';

const N = ['Let θ = tan⁻¹x. So tan θ = x: a right triangle with legs 1 and x (drawn for x = 0.75), hypotenuse √(1 + x²).', 'sin θ = x/√(1+x²) and cos θ = 1/√(1+x²). Double angle: sin 2θ = 2 sin θ cos θ = 2x/(1+x²).', 'Build the triangle for 2θ: hypotenuse 1 + x², opposite 2x, adjacent 1 − x². Check: (1−x²)² + (2x)² = (1+x²)².', 'So sin 2θ = 2x/(1+x²), cos 2θ = (1−x²)/(1+x²), tan 2θ = 2x/(1−x²).', 'If |x| ≤ 1 then 2θ is in [−π/2, π/2], so 2tan⁻¹x = sin⁻¹(2x/(1+x²)). For x ≥ 0 also = cos⁻¹((1−x²)/(1+x²)).'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Right triangles for theta and two theta where tan theta is x' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, '2 tan⁻¹x = sin⁻¹( 2x / (1 + x²) )', col), x = 0.75, th = Math.atan(x), ox = 22, oy = h - 76, sc = Math.min((w - 60) / 1.25, (oy - top - 14) / 1.55);
    const tri = (len, ang, c, lw, lab) => { const hx = ox + len * Math.cos(ang), hy = oy - len * Math.sin(ang); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(hx, hy); ctx.lineTo(hx, oy); ctx.closePath(); ctx.stroke(); return [hx, hy]; };
    if (s >= 2) { const [hx, hy] = tri(1.5625 * sc, 2 * th, col.s[2], 2.5); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.1; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(hx, hy); ctx.lineTo(hx, oy); ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, '1 + x²', (ox + hx) / 2 - 8, (oy + hy) / 2 - 8, { color: col.s[2], size: 11, weight: 700, align: 'right' }); text(ctx, '2x', hx + 5, (oy + hy) / 2, { color: col.s[2], size: 11, weight: 700 }); text(ctx, '1 − x²', (ox + hx) / 2, oy + 12, { color: col.s[2], size: 11, weight: 700, align: 'center' });
      ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.arc(ox, oy, 38, 0, -2 * th, true); ctx.stroke(); text(ctx, '2θ', ox + 44, oy - 14, { color: col.s[2], size: 11.5, weight: 800 }); }
    const [tx, ty] = tri(1.25 * sc, th, col.s[0], 3);
    text(ctx, 'θ', ox + 30, oy - 5, { color: col.s[0], size: 12, weight: 800 });
    if (s < 2) { text(ctx, '√(1 + x²)', (ox + tx) / 2 - 6, (oy + ty) / 2 - 8, { color: col.s[0], size: 11, weight: 700, align: 'right' }); text(ctx, 'x', tx + 6, (oy + ty) / 2, { color: col.s[0], size: 11, weight: 700 }); text(ctx, '1', (ox + tx) / 2, oy + 12, { color: col.s[0], size: 11, weight: 700, align: 'center' }); }
    const max = Math.floor((w - 24) / 6.2), ls = []; let cur = ''; N[Math.min(s, 4)].split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur);
    ls.forEach((l, i) => text(ctx, l, 12, h - 10 - (ls.length - 1 - i) * 14.5, { color: col.ink, size: 11, weight: 600 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
