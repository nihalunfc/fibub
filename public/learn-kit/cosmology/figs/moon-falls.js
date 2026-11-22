// 1.4 Newton's great check: the Moon is falling too. In one second the Moon moves about 1 km along its orbit
// and falls about 1.36 mm towards the Earth (that is what keeps it curving). An apple falls 4.9 m in its first
// second. The Moon is 60 Earth radii away, and 4.9 m ÷ 60² = 1.36 mm: gravity weakens with distance squared.
import { canvas, text, line, dot, arrow, ease, loop, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'The Moon falling around the Earth compared with a falling apple' });
  let step = 0, k = 1, spin = 0;
  const anim = loop(host, (dt) => { spin += dt * 0.25; if (k < 1) k = Math.min(1, k + dt); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.32, cy = h * 0.55, R = Math.min(w * 0.26, h * 0.4), e = ease(k);
    // Earth and the Moon's orbit
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke();
    dot(ctx, cx, cy, R / 7, col.s[0]);
    text(ctx, 'Earth', cx, cy + R / 7 + 12, { color: col.ink, size: 11, weight: 600, align: 'center' });
    const a = step === 0 ? spin : -0.6;
    const M = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
    if (step >= 1) {
      // straight-line path it would take with no gravity, and the fall back to the circle (exaggerated)
      const tx = -Math.sin(a), ty = Math.cos(a), L = R * 0.6 * e;
      const T = [M[0] + tx * L, M[1] + ty * L];
      line(ctx, [M, T], col.muted, 1.5, [5, 4]);
      const a2 = a + 0.6 * e, C2 = [cx + R * Math.cos(a2), cy + R * Math.sin(a2)];
      if (step >= 2 && e > 0.3) arrow(ctx, T[0], T[1], C2[0] + (T[0] - C2[0]) * 0.1, C2[1] + (T[1] - C2[1]) * 0.1, col.s[1], 2, 8);
      text(ctx, 'no gravity: straight on', T[0] + 6, T[1] + 4, { color: col.muted, size: 11, halo: col.panel });
      if (step >= 2) text(ctx, 'falls 1.36 mm each second', (T[0] + C2[0]) / 2 + 8, (T[1] + C2[1]) / 2 + 10, { color: col.s[1], size: 11.5, weight: 600, halo: col.panel });
    }
    dot(ctx, M[0], M[1], R / 14 + 2, col.muted);
    text(ctx, 'Moon', M[0] + 10, M[1] - 10, { color: col.ink, size: 11, weight: 600, halo: col.panel });
    // right panel: apple
    const ax = w * 0.78, top = 30;
    if (step >= 3) {
      line(ctx, [[ax - 40, h - 30], [ax + 40, h - 30]], col.muted, 2);
      const fall = (h - 80) * e;
      dot(ctx, ax, top + 10 + fall, 7, col.s[7]);
      line(ctx, [[ax + 22, top + 10], [ax + 22, top + 10 + fall]], col.s[7], 1.5);
      text(ctx, 'Apple: 4.9 m', ax + 28, top + 10 + fall / 2, { color: col.ink, size: 11.5, weight: 600, halo: col.panel });
      text(ctx, 'in its first second', ax + 28, top + 26 + fall / 2, { color: col.muted, size: 11, halo: col.panel });
    }
    if (step >= 4) {
      text(ctx, 'Moon is 60× farther from Earth\'s centre: 4.9 m ÷ 60² = 1.36 mm ✓', w / 2, h - 10, { color: col.ink, size: 12.5, weight: 700, align: 'center', halo: col.panel });
    }
    if (step >= 1) text(ctx, 'Drop sizes exaggerated', 10, 14, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); } };
}
