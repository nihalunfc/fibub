// Class 12 Evolution (step player): allopatric speciation. A barrier splits one interbreeding population in two; with no gene flow, mutation, drift and different selection make the two
// groups differ; when they meet again they can no longer interbreed successfully (reproductive isolation), so they are now two species.
import { canvas, text, title, line, rng, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Steps of allopatric speciation: one population, a barrier, divergence, meeting again and two species' });
  const T = ['One population, free gene flow', 'A barrier splits it', 'Each side adapts and drifts apart', 'The barrier disappears: they meet', 'Two species'];
  const NOTE = ['All the animals interbreed, so genes move freely through the whole population.', 'A river changes course, a mountain rises or sea level separates an island. Gene flow stops.', 'Different food, climate and chance mutations: natural selection and genetic drift work separately on each side. The groups become different in colour, size and behaviour.', 'The groups meet. Matings between them fail, or the young are weak or sterile: reproductive isolation has evolved.', 'They now stay separate even in the same place: two species from one. Darwin’s finches on the Galapagos islands arose in this way.'];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  const r = rng(11), pts = Array.from({ length: 30 }, () => [r(), r()]);
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), x0 = 16, wdt = w - 32, y0 = t0 + 14, hh = 140, mid = x0 + wdt / 2;
    ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, wdt, hh);
    if (step >= 1 && step <= 2) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fillRect(mid - 12, y0, 24, hh); ctx.globalAlpha = 1; text(ctx, 'river', mid, y0 + hh + 10, { color: col.muted, size: 10.5, align: 'center' }); }
    pts.forEach(([a, b], i) => {
      const left = i % 2 === 0, split = step >= 1 && step <= 2; let x, y = y0 + 10 + b * (hh - 20), c = col.s[2], rad = 5;
      if (step === 0) x = x0 + 10 + a * (wdt - 20); else if (split) x = left ? x0 + 10 + a * (wdt / 2 - 34) : mid + 18 + a * (wdt / 2 - 34); else x = left ? x0 + 10 + a * (wdt / 2 - 20) : mid + 10 + a * (wdt / 2 - 20);
      if (step >= 2) { c = left ? col.s[0] : col.s[3]; rad = left ? 5 : 7; }
      if (step === 4) { x = left ? x0 + 10 + a * (wdt - 20) : x0 + 10 + ((a + 0.3 * (i % 5)) % 1) * (wdt - 20); }
      if (step === 3) { x = left ? x0 + 10 + a * (wdt * 0.55) : x0 + wdt * 0.4 + a * (wdt * 0.55); }
      dot(ctx, x, y, rad, c, col.bg);
    });
    if (step === 3) { text(ctx, '×  ×', mid, y0 + hh / 2, { color: col.bad, size: 26, weight: 700, align: 'center' }); text(ctx, 'no successful mating', mid, y0 + hh - 14, { color: col.bad, size: 11, weight: 700, align: 'center' }); }
    if (step === 2 || step === 3) { ctx.fillStyle = col.s[0]; ctx.fillRect(x0, y0 + hh + 24, 10, 10); text(ctx, 'population 1', x0 + 14, y0 + hh + 29, { color: col.muted, size: 10.5 }); ctx.fillStyle = col.s[3]; ctx.fillRect(x0 + 110, y0 + hh + 24, 10, 10); text(ctx, 'population 2', x0 + 124, y0 + hh + 29, { color: col.muted, size: 10.5 }); }
    if (step === 4) text(ctx, 'blue = species A,  orange = species B', w / 2, y0 + hh + 29, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    wrap(ctx, NOTE[step], 12, h - 62, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
