// 7.5 Sound in a dark-matter well (step player). Before recombination, photons and baryons (protons, nuclei
// and electrons) move as one fluid: gravity pulls it into the wells made by dark matter, the photons' pressure
// pushes it back out, so it rings like a sound wave. Squeezed fluid is hotter, stretched fluid cooler.
// The compression drawn below is c(t) = b − (1 + b) cos(ωt), starting at rest: with no baryons (b = 0) the
// squeezes and stretches are equal; baryons add weight (b > 0), so the fluid swings deeper into the well and
// the squeezes win. At recombination the photons fly free and the wave is frozen. Waves of different sizes
// ring at different rates (ω ∝ 1 / size), so at that moment some are caught squeezed, some stretched: the peaks.
import { canvas, text, title, line, dot, loop, clamp } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 330, label: 'A sound wave of photons and baryons oscillating in a dark matter well' });
  let step = 0, t = 0;
  const hist = [];
  const W = 2 * Math.PI / 4; // one full ring every 4 s
  const titles = ['A fluid of light and atoms in a dark-matter well', 'Gravity squeezes it: hotter', 'Pressure pushes back: it rings', 'Atoms add weight: squeezes win', 'Recombination: the sound freezes', 'Big, middle and small waves'];
  const bOf = () => (step >= 3 ? 0.35 : 0);
  const comp = (tt, b = bOf()) => b - (1 + b) * Math.cos(W * tt);
  const tFreeze = 6; // seconds into the animation when recombination happens (step 4)
  const glow = (c, col) => (c > 0 ? col.s[1] : col.s[0]);
  const fluid = (ctx, cx, cy, half, depth, c, col, n = 26) => {
    // the well
    const pts = [];
    for (let i = 0; i <= 60; i++) { const u = -1 + (2 * i) / 60; pts.push([cx + u * half, cy - depth * (1 - Math.exp(-(u * u) / 0.12))]); }
    // glow under the fluid
    const spread = half * 0.62 * (1 - 0.42 * clamp(c, -1, 1.7) / 1.7);
    ctx.save(); ctx.globalAlpha = Math.min(0.55, 0.12 + 0.28 * Math.abs(c));
    ctx.fillStyle = glow(c, col); ctx.beginPath(); ctx.ellipse(cx, cy - depth * 0.38, spread, depth * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    line(ctx, pts, col.ink, 2);
    for (let k = 0; k < n; k++) {
      const u = -1 + (2 * (k + 0.5)) / n, x = cx + u * spread, yy = cy - depth * (1 - Math.exp(-(((x - cx) / half) ** 2) / 0.12));
      dot(ctx, x, yy - 7 - (k % 3) * 6, 2.6, glow(c, col));
    }
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, titles[step], col) + 6;
    if (step < 5) {
      const midY = top + (h - top) * 0.55, half = Math.min(w * 0.42, 220), depth = (h - top) * 0.36;
      const tt = step === 0 ? 0 : step === 4 ? Math.min(t, tFreeze) : t;
      const c = comp(tt);
      fluid(ctx, w / 2, midY, half, depth, c, col);
      text(ctx, 'dark matter well', w / 2 + half * 0.55, midY - depth - 6, { color: col.muted, size: 11, align: 'center' });
      if (step >= 1) text(ctx, c > 0.05 ? 'squeezed: hotter' : c < -0.05 ? 'stretched: cooler' : '', w / 2, top + 10, { color: glow(c, col), size: 12.5, weight: 700, align: 'center', halo: col.panel });
      // trace of the compression against time
      const T0 = midY + 18, B0 = h - 18, L0 = 46, R0 = w - 12, mid = (T0 + B0) / 2, sc = (B0 - T0) / 2 / 1.8;
      line(ctx, [[L0, mid], [R0, mid]], col.muted, 1);
      text(ctx, 'time →', R0, B0 + 6, { color: col.muted, size: 10.5, align: 'right' });
      text(ctx, 'squeezed', L0 - 4, mid - sc, { color: col.s[1], size: 10.5, align: 'right' });
      text(ctx, 'stretched', L0 - 4, mid + sc, { color: col.s[0], size: 10.5, align: 'right' });
      if (step >= 3) { line(ctx, [[L0, mid - bOf() * sc], [R0, mid - bOf() * sc]], col.s[2], 1.5, [5, 4]); text(ctx, 'new balance', R0 - 2, mid - bOf() * sc - 9, { color: col.s[2], size: 10.5, align: 'right', halo: col.panel }); }
      if (step >= 1) {
        const span = 8, pts = [], tEnd = tt;
        for (let i = 0; i <= 160; i++) { const s = Math.max(0, tEnd - span) + (i / 160) * Math.min(span, tEnd); pts.push([L0 + ((s - Math.max(0, tEnd - span)) / span) * (R0 - L0), mid - comp(s) * sc]); }
        line(ctx, pts, col.ink, 2);
        if (step === 4 && t >= tFreeze) text(ctx, 'frozen at recombination', (L0 + R0) / 2, B0 - 2, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
      }
      return;
    }
    // step 5: three waves of different sizes, frozen when the big one is first fully squeezed
    const tt = Math.min(t, 2), sizes = [1, 0.5, 1 / 3], labels = [['1st peak', 'squeezed'], ['2nd peak', 'stretched'], ['3rd peak', 'squeezed']];
    const cw = w / 3;
    sizes.forEach((s, i) => {
      const c = 0.35 - 1.35 * Math.cos(W * tt * (1 / s)), cx = cw * (i + 0.5), cy = top + (h - top) * 0.7;
      fluid(ctx, cx, cy, Math.min(cw * 0.4, 110) * (0.55 + 0.45 * s), (h - top) * 0.45 * (0.6 + 0.4 * s), c, col, 14);
      text(ctx, ['big', 'half size', 'third size'][i], cx, cy + 16, { color: col.muted, size: 11, align: 'center' });
      if (t >= 2) labels[i].forEach((ln, j) => text(ctx, ln, cx, cy + 32 + j * 14, { color: glow(c, col), size: 11, weight: 700, align: 'center' }));
    });
    text(ctx, t >= 2 ? 'Frozen at recombination' : 'Ringing…', w / 2, top + 10, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
  };
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); } };
}
