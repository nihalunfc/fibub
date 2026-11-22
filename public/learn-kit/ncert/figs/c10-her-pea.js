// Class 10 Heredity (step player): Mendel's monohybrid cross. A pure tall pea plant (TT) is crossed with a pure short plant
// (tt). All F1 plants are tall (Tt): the tall trait is dominant. When F1 plants self-pollinate the short trait comes back in
// the F2 in a ratio of 3 tall : 1 short, because each parent gives one of its two factors at random to every offspring.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'Mendel crossing tall and short pea plants: parents, F1 and F2' });
  const TITLES = ['Parents: pure tall × pure short', 'Each parent makes one kind of gamete', 'Cross-pollinate: the F1 seeds', 'F1: every plant is tall', 'F1 plants self-pollinate', 'F2: tall and short return, 3 : 1'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const plant = (ctx, col, x, base, hgt, label, sub, good = true) => { line(ctx, [[x, base], [x, base - hgt]], col.s[2], 3.5); [0.4, 0.7].forEach((f, i) => { ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(x + (i ? 9 : -9), base - hgt * f, 8, 3.5, i ? -0.5 : 0.5, 0, 7); ctx.fill(); ctx.restore(); }); dot(ctx, x, base - hgt - 3, 4, col.s[4]); text(ctx, label, x, base + 13, { color: col.ink, size: 11, weight: 700, align: 'center' }); if (sub) text(ctx, sub, x, base + 26, { color: col.muted, size: 9.5, align: 'center' }); };
  const gam = (ctx, col, x, y, s) => { dot(ctx, x, y, 11, s === 'T' ? col.s[0] : col.s[1], col.ink); text(ctx, s, x, y, { color: col.panel, size: 12, weight: 700, align: 'center' }); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, base = h - 56, tall = Math.min(100, base - top - 14), short = tall * 0.45;
    if (step === 0) { plant(ctx, col, w * 0.3, base, tall, 'TT', 'pure tall'); plant(ctx, col, w * 0.7, base, short, 'tt', 'pure short'); text(ctx, '×', w / 2, base - tall / 2, { color: col.ink, size: 22, align: 'center' }); }
    if (step === 1) { plant(ctx, col, w * 0.2, base, tall * 0.7, 'TT', ''); plant(ctx, col, w * 0.8, base, short * 0.9, 'tt', ''); [0.38, 0.5].forEach((f) => gam(ctx, col, w * f, base - 40, 'T')); [0.5, 0.62].forEach((f, i) => gam(ctx, col, w * f, base - 90 + (i ? 0 : 0) + 0, 't')); text(ctx, 'all gametes of TT carry T', w * 0.32, base - 62, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, 'all gametes of tt carry t', w * 0.68, base - 112, { color: col.muted, size: 9.5, align: 'center' }); }
    if (step === 2) { plant(ctx, col, w * 0.15, base, tall * 0.8, 'TT', ''); plant(ctx, col, w * 0.85, base, short, 'tt', ''); const k = (t * 0.4) % 1; dot(ctx, w * 0.2 + (w * 0.6) * k, base - tall * 0.9 - Math.sin(k * 3.14) * 24, 5, col.s[0], col.ink); for (let i = 0; i < 4; i++) { dot(ctx, w * (0.35 + i * 0.1), base - 8, 9, col.s[3], col.ink); text(ctx, 'Tt', w * (0.35 + i * 0.1), base - 8, { color: col.ink, size: 9, weight: 700, align: 'center' }); } text(ctx, 'F1 seeds: all Tt', w / 2, base + 22, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (step === 3) { for (let i = 0; i < 4; i++) plant(ctx, col, w * (0.2 + i * 0.2), base, tall, 'Tt', 'tall'); text(ctx, 'The short trait is hidden: T is dominant, t is recessive', w / 2, top + 6, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 4) { const cs = 62, gx = w / 2 - cs + 16, gy = top + 64; text(ctx, 'F1 self-pollination: Tt × Tt', w / 2, top + 8, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'pollen', gx + cs, top + 28, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'eggs', gx - 52, gy - 8, { color: col.muted, size: 10, align: 'center' });
      ['T', 't'].forEach((g, i) => { gam(ctx, col, gx + cs * i + cs / 2, top + 48, g); gam(ctx, col, gx - 20, gy + cs * i + cs / 2, g); });
      ['TT', 'Tt', 'Tt', 'tt'].forEach((l, i) => { const r = Math.floor(i / 2), c = i % 2, x = gx + c * cs, y = gy + r * cs, k = Math.min(1, Math.max(0, t * 1.2 - i * 0.4)); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, cs, cs); if (k > 0) { ctx.save(); ctx.globalAlpha = k; text(ctx, l, x + cs / 2, y + cs * 0.42, { color: col.ink, size: 16, weight: 700, align: 'center' }); text(ctx, l === 'tt' ? 'short' : 'tall', x + cs / 2, y + cs * 0.74, { color: col.muted, size: 10.5, align: 'center' }); ctx.restore(); } });
      text(ctx, 'Each of the 4 boxes is equally likely', w / 2, gy + 2 * cs + 20, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 5) { const labs = ['TT', 'Tt', 'Tt', 'tt']; labs.forEach((l, i) => plant(ctx, col, w * (0.16 + i * 0.22), base, l === 'tt' ? short : tall, l, l === 'tt' ? 'short' : 'tall')); text(ctx, '3 tall : 1 short', w / 2, top + 14, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, 'genotype ratio 1 TT : 2 Tt : 1 tt', w / 2, top + 34, { color: col.muted, size: 10.5, align: 'center' }); }
  };
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
