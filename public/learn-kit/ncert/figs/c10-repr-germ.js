// Class 10 How do Organisms Reproduce?: seed germination. A seed needs water, air (oxygen) and a suitable warmth to wake up.
// The radicle (first root) comes out first, then the plumule (first shoot). Switch the three conditions on and off and slide
// the days to see which are needed.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let water = 1, air = 1, warm = 1, d = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A bean seed germinating into a seedling over ten days, if it has water, air and warmth' });
  const ctl = row(host);
  choice(ctl, 'Water', [[1, 'yes'], [0, 'no']], 1, (v) => { water = v; say(); });
  choice(ctl, 'Air', [[1, 'yes'], [0, 'no']], 1, (v) => { air = v; say(); });
  choice(ctl, 'Warmth', [[1, 'yes'], [0, 'no']], 1, (v) => { warm = v; say(); });
  slider(ctl, { label: 'Days', min: 0, max: 10, step: 0.1, value: 0, fmt: (v) => v.toFixed(1), oninput: (v) => { d = v; say(); } });
  const out = readout(host);
  const ell = (ctx, x, y, rx, ry, a, f, s, lw = 1.8) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, a, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } };
  const ok = () => water && air && warm;
  function say() { const miss = [!water && 'water', !air && 'air (oxygen)', !warm && 'warmth'].filter(Boolean); out.textContent = ok() ? (d < 1 ? 'The seed takes in water and swells. Enzymes start turning stored food into sugars for the embryo.' : d < 3 ? 'The radicle, the first root, breaks through the seed coat and grows down.' : d < 6 ? 'The plumule, the first shoot, grows up. The two cotyledons feed the seedling.' : 'The first leaves open and photosynthesis begins: the seedling now makes its own food.') : `Germination does not start: no ${miss.join(', no ')}. The seed stays dormant and can wait for months.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Seed germination', col) + 8, gy = top + (h - top) * 0.5, cx = w / 2, g = ok() ? d : 0;
    ctx.save(); ctx.globalAlpha = water ? 0.4 : 0.15; ctx.fillStyle = col.s[3]; ctx.fillRect(0, gy, w, h - gy); ctx.restore(); line(ctx, [[0, gy], [w, gy]], col.muted, 1.5); text(ctx, water ? 'moist soil' : 'dry soil', 10, gy + 12, { color: col.muted, size: 10 });
    const sw = g > 0.5 ? 1 + Math.min(0.4, g * 0.1) : 1, sx = cx - 40, sy = gy + 36;
    ell(ctx, sx, sy, 20 * sw, 12 * sw, 0, col.s[3], col.ink, 2); ell(ctx, sx, sy, 15 * sw, 8 * sw, 0, null, col.muted, 1); line(ctx, [[sx - 6 * sw, sy], [sx + 6 * sw, sy]], col.muted, 1);
    text(ctx, 'seed', sx, sy + 24, { color: col.muted, size: 10, align: 'center' });
    const rad = Math.max(0, Math.min(1, (g - 0.8) / 3)), plu = Math.max(0, Math.min(1, (g - 3) / 4)), lf = Math.max(0, Math.min(1, (g - 6) / 3));
    if (rad > 0) { const L = 70 * rad; line(ctx, [[sx - 18 * sw, sy + 4], [sx - 26, sy + 4 + L * 0.55], [sx - 20, sy + 4 + L]], col.ink, 2.6); for (let i = 1; i < 4; i++) if (rad > i / 4) line(ctx, [[sx - 24, sy + 4 + L * 0.5], [sx - 24 + i * 6 - 10, sy + 4 + L * 0.5 + 16 * i / 3]], col.muted, 1.3); text(ctx, 'radicle → root', sx + 14, sy + 20 + L * 0.4, { color: col.ink, size: 10 }); }
    if (plu > 0) { const L = (gy - top - 30) * plu * 0.85; line(ctx, [[sx + 6, sy - 10], [sx + 8, sy - 10 - (sy - gy) - L]], col.s[2], 4); text(ctx, 'plumule → shoot', sx + 24, gy - 14 - L * 0.5, { color: col.ink, size: 10 });
      if (lf > 0) { const yy = sy - 10 - (sy - gy) - L; ctx.save(); ctx.globalAlpha = 0.5; ell(ctx, sx + 8 - 14 * lf, yy, 16 * lf, 8 * lf, -0.5, col.s[2], col.ink, 1.4); ell(ctx, sx + 8 + 14 * lf, yy, 16 * lf, 8 * lf, 0.5, col.s[2], col.ink, 1.4); ctx.restore(); } }
    if (!ok()) text(ctx, 'dormant: waiting', w / 2 + 40, gy + 44, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, `Day ${g.toFixed(1)}`, w - 10, h - 12, { color: col.ink, size: 11, weight: 700, align: 'right' });
  };
  say();
}
