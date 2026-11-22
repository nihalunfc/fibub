// Class 10 How do Organisms Reproduce? (step player): pollination to fertilisation to seed. Pollen reaches the stigma
// (pollination), grows a pollen tube down the style to an ovule, a male gamete joins the egg to form the zygote
// (fertilisation); the zygote becomes the embryo, the ovule the seed and the ovary the fruit.
import { canvas, text, title, line, dot, loop, clamp } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Pollen landing on a stigma, growing a tube to the ovule, fertilisation and seed formation' });
  const TITLES = ['Pollination: pollen reaches the stigma', 'The pollen grain grows a tube', 'The tube reaches the ovule', 'Fertilisation: gamete + egg = zygote', 'Zygote → embryo, ovule → seed', 'Ovary → fruit'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ell = (ctx, x, y, rx, ry, f, s, lw = 1.8) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 10, cx = w * 0.42, sy = top + 30, oy = h - 120, oh = step >= 5 ? 52 : 46, ow = step >= 5 ? 56 : 48;
    // style
    ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[2]; ctx.fillRect(cx - 14, sy, 28, oy - sy); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.strokeRect(cx - 14, sy, 28, oy - sy);
    ell(ctx, cx, sy, 26, 9, col.s[2], col.ink); if (step < 4) text(ctx, 'stigma', cx + 34, sy - 6, { color: col.muted, size: 10 }); text(ctx, 'style', cx + 20, (sy + oy) / 2, { color: col.muted, size: 10 });
    // ovary
    ctx.save(); ctx.globalAlpha = step >= 5 ? 0.5 : 0.3; ell(ctx, cx, oy + oh / 2, ow, oh, col.s[2], null); ctx.restore(); ell(ctx, cx, oy + oh / 2, ow, oh, null, col.ink, step >= 5 ? 3 : 1.8);
    text(ctx, step >= 5 ? 'fruit (ovary)' : 'ovary', cx - ow - 4, oy + oh * 0.4, { color: col.muted, size: 10, align: 'right' });
    // ovule
    const ox = cx, oyc = oy + oh * 0.65;
    if (step < 4) { ell(ctx, ox, oyc, 17, 13, col.s[3], col.ink, 1.6); ell(ctx, ox, oyc + 1, 6, 5, col.panel, col.ink, 1.2); text(ctx, step === 3 ? 'zygote' : 'ovule: egg inside', cx + ow + 6, oyc, { color: col.muted, size: 10 }); }
    else { ell(ctx, ox, oyc, 17, 13, col.s[3], col.ink, 2.6); ell(ctx, ox, oyc, 6, 5, col.s[2], col.ink, 1.2); text(ctx, step === 4 ? 'seed with embryo' : 'seed', cx + ow + 6, oyc, { color: col.muted, size: 10 }); }
    if (step === 3) dot(ctx, ox, oyc + 1, 5, col.s[0], col.ink);
    // pollen
    const k = step === 0 ? clamp(t * 0.5, 0, 1) : 1;
    const px = cx + 40 * (1 - k) + 8, py = sy - 8 - 60 * (1 - k);
    if (step === 0) { for (let i = 0; i < 4; i++) dot(ctx, px + i * 6 - 10, py - 2 + (i % 2) * 5, 4, col.s[3], col.ink); text(ctx, 'pollen grains, carried by insects, wind or water', w / 2, h - 36, { color: col.muted, size: 10, align: 'center' }); }
    else if (step <= 3) {
      dot(ctx, cx + 4, sy - 5, 5, col.s[3], col.ink); dot(ctx, cx - 8, sy - 6, 4, col.s[3], col.ink);
      const L = step === 1 ? clamp(t / 3.2, 0, 1) : 1, endy = oyc - 14, ty = sy - 3 + L * (endy - sy + 3);
      line(ctx, [[cx + 4, sy - 2], [cx + 4, sy + 6], [cx - 2, ty - 2], [cx, ty]], col.s[0], 2.4);
      if (step >= 1) dot(ctx, cx, ty, 3.5, col.s[0], col.ink);
      if (step === 1) text(ctx, 'the pollen tube pushes down the style', w / 2, h - 36, { color: col.muted, size: 10, align: 'center' });
      if (step === 2) text(ctx, 'male gamete travels down the tube', w / 2, h - 36, { color: col.muted, size: 10, align: 'center' });
      if (step === 3) text(ctx, 'male gamete + egg cell → zygote', w / 2, h - 36, { color: col.muted, size: 10, align: 'center' });
    } else {
      // petals wither
      text(ctx, step === 4 ? 'petals, sepals, stamens wither; ovary swells' : 'the fruit protects the seeds', w / 2, h - 36, { color: col.muted, size: 10, align: 'center' });
      ell(ctx, cx - 60, sy + 10, 14, 4, col.line, col.muted, 1); ell(ctx, cx + 60, sy + 10, 14, 4, col.line, col.muted, 1);
    }
    text(ctx, ['Pollination = transfer of pollen from anther to stigma.', 'Sugars in the stigma trigger the grain to sprout.', 'Only one gamete is needed for each egg.', 'This joining of gametes is fertilisation.', 'The zygote divides many times into the embryo (a tiny plant).', 'A mango or a pea pod is just a developed ovary.'][step], w / 2, h - 14, { color: col.ink, size: 10, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
