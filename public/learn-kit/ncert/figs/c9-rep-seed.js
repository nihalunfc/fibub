// Class 9 Reproduction (step player): after fertilisation. The zygote divides to become the embryo (a baby plant);
// the ovule becomes the seed (with a protective seed coat and stored food); the ovary becomes the fruit; petals,
// stamens, style and stigma wither and fall. The fruit or seed is carried away (dispersal) so the new plants do not
// crowd the parent. In a suitable place (water, warmth, air) the seed germinates.
import { canvas, text, title, dot, line, loop, font, ease } from '../../kit.js';

const T = ['A fertilised flower', 'Petals and stamens wither', 'The ovary becomes a fruit', 'The seed travels: dispersal', 'The seed germinates'];
const CAP = ['After fertilisation the zygote in each ovule divides again and again to make an embryo.', 'The petals, stamens, style and stigma are no longer needed and wither away. The ovary starts to swell.', 'The ovule becomes the seed (embryo, food store and a hard coat). The ovary wall becomes the fruit.', 'Wind, water, animals or a bursting pod carry seeds away. Far from the parent they get more space and light.', 'With water, air and warmth the seed swells and the embryo grows out: first a root, then a shoot.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'From a fertilised flower to a fruit, seed dispersal and a germinating seed' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const cx = w / 2, gy = step === 4 ? h * 0.36 : h * 0.72, s = Math.min(1.2, w / 360), P = ease(Math.min(1, (t % 4) / 2.5));
    if (step <= 2) {
      line(ctx, [[cx, gy + 20], [cx, gy - 40 * s]], col.s[2], 6);
      const f = step === 0 ? 0 : step === 1 ? P : 1, grow = step === 2 ? P : step === 1 ? 0.2 * P : 0;
      const ow = (20 + 26 * grow) * s, oh = (30 + 34 * grow) * s, oy = gy - 40 * s - oh * 0.8;
      if (step < 2) {
        ctx.save(); ctx.globalAlpha = 1 - f; [-1, 1].forEach((d) => { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.ellipse(cx + d * 34 * s, oy - 14 * s + f * 30, 20 * s, 44 * s, d * 0.5, 0, 7); ctx.fill(); line(ctx, [[cx + d * 14 * s, oy], [cx + d * 16 * s, oy - 60 * s]], col.s[3], 2); }); line(ctx, [[cx, oy - oh * 0.6], [cx, oy - 80 * s]], col.s[4], 4); dot(ctx, cx, oy - 82 * s, 5, col.s[1]); ctx.restore();
        text(ctx, step === 0 ? 'petals, stamens, style, stigma' : 'withering', cx, 42, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
      }
      ctx.fillStyle = step === 2 ? col.s[1] : col.s[4]; ctx.beginPath(); ctx.ellipse(cx, oy, ow, oh, 0, 0, 7); ctx.fill();
      ctx.fillStyle = col.panel; for (let k = -1; k <= 1; k += 2) { ctx.beginPath(); ctx.ellipse(cx + k * ow * 0.35, oy + 2, 6 * s * (1 + grow * 0.5), 9 * s * (1 + grow * 0.5), 0, 0, 7); ctx.fill(); }
      if (step === 2) { text(ctx, 'fruit (was the ovary)', cx + ow + 8, oy - 10, { color: col.ink, size: 10.5 }); text(ctx, 'seed (was the ovule)', cx + ow + 8, oy + 10, { color: col.ink, size: 10.5 }); }
      if (step === 0) text(ctx, 'ovary with fertilised ovules', cx + ow + 10, oy + 8, { color: col.ink, size: 10.5 });
    }
    if (step === 3) {
      line(ctx, [[8, gy + 30], [w - 8, gy + 30]], col.muted, 2);
      const f = (t * 0.25) % 1;
      for (let k = 0; k < 6; k++) { const ff = (f + k / 6) % 1, x = 40 + ff * (w - 80), y = gy - 20 - Math.sin(ff * Math.PI) * 60 + Math.sin(k + t * 3) * 6; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(x, y, 7, 4, ff * 6, 0, 7); ctx.fill(); line(ctx, [[x - 3, y - 3], [x - 9, y - 8]], col.muted, 1.5); line(ctx, [[x + 3, y - 3], [x + 9, y - 8]], col.muted, 1.5); }
      text(ctx, 'parent plant', 14, gy + 48, { color: col.ink, size: 10.5 }); text(ctx, 'new place', w - 14, gy + 48, { color: col.ink, size: 10.5, align: 'right' });
      text(ctx, 'winged seeds blown by wind (like maple, drumstick tree)', w / 2, 44, { color: col.s[3], size: 10.5, align: 'center' });
    }
    if (step === 4) {
      ctx.fillStyle = col.soft; ctx.fillRect(0, gy, w, h - gy); line(ctx, [[0, gy], [w, gy]], col.muted, 2);
      const g = ease(Math.min(1, (t % 5) / 4)), x = cx;
      ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(x, gy + 28 * s, (16 + 3 * g) * s, 11 * s, 0, 0, 7); ctx.fill();
      line(ctx, [[x, gy + 36 * s], [x - 4 * g, gy + 36 * s + 50 * g * s]], col.s[4], 3); line(ctx, [[x, gy + 36 * s], [x + 10 * g, gy + 36 * s + 40 * g * s]], col.s[4], 2);
      if (g > 0.3) { const sh = (g - 0.3) / 0.7 * 70 * s; line(ctx, [[x, gy + 20 * s], [x, gy + 20 * s - sh]], col.s[2], 4); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(x - 12 * g, gy - sh + 24 * s, 12 * g * s, 6 * g * s, -0.4, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + 12 * g, gy - sh + 24 * s, 12 * g * s, 6 * g * s, 0.4, 0, 7); ctx.fill(); }
      text(ctx, 'root first', x + 24, gy + 76 * s, { color: col.s[4], size: 10.5, weight: 700 }); if (g > 0.5) text(ctx, 'then shoot', x + 24, gy - 30, { color: col.s[2], size: 10.5, weight: 700 });
    }
    ctx.font = font(10.5, 400); const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
