// 1.5 Eratosthenes measures the Earth (about 240 BCE). Steps: parallel sunlight, no shadow at Syene, a shadow
// at Alexandria, the same angle at the Earth's centre, then the sum. Angles are drawn larger than 7.2° so
// they can be seen; the numbers use the real 7.2°.
import { canvas, text, line, dot, arrow, lerp, ease, loop, calm } from '../../kit.js';

const D = Math.PI / 180;
export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 430, min: 300, label: 'Sunlight hitting two towns on a round Earth, with the angle between them' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 1); cv.redraw(); } }, { autoplay: false });
  const DRAW = 24; // degrees between the towns, as drawn
  cv.draw = (ctx, w, h, col) => {
    const R = Math.min(w * 0.27, h * 0.3), cx = w * 0.6, cy = h * 0.52;
    const e = ease(k);
    // sunlight: parallel rays from the left... from above-left, arriving straight down at Syene (top of the circle)
    const rays = 7;
    for (let i = 0; i < rays; i++) {
      const x = cx - R * 1.4 + (i * R * 2.8) / (rays - 1);
      if (step >= 0) arrow(ctx, x, 14, x, Math.min(cy - Math.sqrt(Math.max(0, R * R - (x - cx) ** 2)), cy - R * 0.2) - 2, col.s[3], 1.5, 7);
    }
    text(ctx, 'Sunlight arrives in parallel rays', 12, 18, { color: col.ink, size: 12, weight: 600 });
    // Earth
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
    dot(ctx, cx, cy, 3, col.ink);
    // towns: Syene at the top, Alexandria DRAW° to the left
    const sy = [cx, cy - R], al = [cx - R * Math.sin(DRAW * D), cy - R * Math.cos(DRAW * D)];
    dot(ctx, sy[0], sy[1], 4, col.s[0]);
    dot(ctx, al[0], al[1], 4, col.s[1]);
    text(ctx, 'Syene', sy[0] + 8, sy[1] - 10, { color: col.ink, size: 12, weight: 600, halo: col.panel });
    text(ctx, 'Alexandria', al[0] - 8, al[1] - 14, { color: col.ink, size: 12, weight: 600, align: 'right', halo: col.panel });
    if (step >= 1) {
      // a well at Syene: sunlight reaches the bottom; stick straight up casts no shadow
      line(ctx, [[sy[0], sy[1]], [sy[0], sy[1] - 26 * (step === 1 ? e : 1)]], col.ink, 3);
      text(ctx, 'no shadow at noon', sy[0] + 8, sy[1] - 30, { color: col.muted, size: 11, halo: col.panel });
    }
    if (step >= 2) {
      // stick at Alexandria points away from the centre; the Sun's rays hit it at DRAW° from straight up
      const ux = (al[0] - cx) / R, uy = (al[1] - cy) / R, L = 34;
      const top = [al[0] + ux * L, al[1] + uy * L];
      line(ctx, [al, top], col.ink, 3);
      // shadow along the ground (tangent), length L·tan(angle)
      const tx = -uy, ty = ux; // tangent pointing away from Syene
      const sl = L * Math.tan(DRAW * D) * (step === 2 ? e : 1);
      line(ctx, [al, [al[0] - tx * sl, al[1] - ty * sl]], col.s[1], 4);
      line(ctx, [top, [top[0], top[1] - 40]], col.s[3], 1, [3, 3]);
      text(ctx, 'shadow: 7.2°', al[0] - 12, al[1] + 18, { color: col.s[1], size: 12, weight: 600, align: 'right', halo: col.panel });
    }
    if (step >= 3) {
      // the same angle at the centre
      const a = (step === 3 ? e : 1);
      line(ctx, [[cx, cy], sy], col.s[0], 1.5, [5, 4]);
      line(ctx, [[cx, cy], [lerp(cx, al[0], a), lerp(cy, al[1], a)]], col.s[1], 1.5, [5, 4]);
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.3, -Math.PI / 2 - DRAW * D * a, -Math.PI / 2); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, '7.2° here too', cx - R * 0.08, cy - R * 0.4, { color: col.ink, size: 12, weight: 600, align: 'right', halo: col.soft });
      // arc between the towns
      ctx.beginPath(); ctx.arc(cx, cy, R + 6, -Math.PI / 2 - DRAW * D, -Math.PI / 2); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, '≈ 800 km', (sy[0] + al[0]) / 2 - 4, Math.min(sy[1], al[1]) - 26, { color: col.ink, size: 12, weight: 600, align: 'right', halo: col.panel });
    }
    if (step >= 4) {
      text(ctx, '7.2° is 1/50 of a full circle, so', 12, h - 44, { color: col.ink, size: 13, weight: 600 });
      text(ctx, 'Earth\'s circumference ≈ 50 × 800 km = 40,000 km', 12, h - 22, { color: col.ink, size: 13, weight: 700 });
    }
    text(ctx, 'Angles drawn larger than real so you can see them', w - 10, h - 8, { color: col.muted, size: 10, align: 'right', base: 'bottom' });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
