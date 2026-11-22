// Class 9 Science, Chapter 6 (step player): from momentum to F = ma. A 2 kg trolley is pushed and its speed rises from 1 to 7 m/s in
// 2 s. Momentum p = mv. Change in momentum Δp = m(v − u). Newton's second law: force is proportional to the rate of change of
// momentum, F ∝ Δp/t. Choosing units so the constant is 1 (1 N = 1 kg m/s²) gives F = m(v − u)/t = ma.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 310, label: 'A trolley whose speed rises, with momentum bars and the steps from momentum to force equals mass times acceleration' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const T = ['Momentum is mass × velocity', 'Change in momentum', 'Force and rate of change of momentum', 'Put in a = (v − u)/t', 'A worked example'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 8, m = 2, u = 1, v = 7, tt = 2, L = 16, R = w - 16, ty = top + 26;
    ctx.fillStyle = col.line; ctx.fillRect(L, ty + 30, R - L, 4);
    const ph = (t % 3) / 3, pos = (s) => L + 20 + s * (R - L - 90);
    const tr = (x, c, a, lab = true) => { ctx.fillStyle = c; ctx.globalAlpha = a; ctx.fillRect(x, ty, 40, 26); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, ty, 40, 26); dot(ctx, x + 8, ty + 30, 3.5, col.ink); dot(ctx, x + 32, ty + 30, 3.5, col.ink); if (lab) text(ctx, '2 kg', x + 20, ty + 13, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); };
    tr(pos(0), col.s[0], 0.2, false); tr(pos(1), col.s[0], 0.2, false);
    const cur = pos(Math.min(1, ph * 1.2) ** 1.6); tr(cur, col.s[0], 0.7);
    text(ctx, 'u = 1 m/s', pos(0) + 20, ty - 8, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'v = 7 m/s', pos(1) + 20, ty - 8, { color: col.muted, size: 10.5, align: 'center' });
    if (step >= 2) arrow(ctx, cur - 4 - 30, ty + 13, cur - 4, ty + 13, col.s[2], 4, 9);
    // momentum bars
    const by = ty + 58, bh = 72, S = bh / 14, bx = L + 10;
    ctx.strokeStyle = col.line; ctx.strokeRect(bx - 4, by - 4, R - L - 12, bh + 8);
    const bar = (x, val, c, lab) => { ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x, by + bh - val * S, 34, val * S); ctx.globalAlpha = 1; text(ctx, `${val}`, x + 17, by + bh - val * S - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, lab, x + 17, by + bh + 14, { color: col.muted, size: 10, align: 'center' }); };
    bar(bx + 8, m * u, col.s[0], 'mu'); bar(bx + 60, m * v, col.s[1], 'mv');
    if (step >= 1) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.9; ctx.fillRect(bx + 60, by + bh - m * v * S, 34, (m * v - m * u) * S); ctx.globalAlpha = 1; text(ctx, 'Δp = 12', bx + 102, by + bh - (m * u + 6) * S + 0, { color: col.s[2], size: 11.5, weight: 700 }); }
    text(ctx, 'momentum (kg m/s)', bx + 150 + (step < 1 ? 0 : 0), by + 6, { color: col.muted, size: 10.5 });
    const y0 = by + bh + 34, lines = [
      ['p = m × v', 'trolley at 1 m/s: p = 2 × 1 = 2 kg m/s', 'trolley at 7 m/s: p = 2 × 7 = 14 kg m/s'],
      ['Δp = mv − mu = m(v − u)', '= 14 − 2 = 12 kg m/s', 'it took t = 2 s to change'],
      ['F ∝ Δp / t   (Newton’s second law)', 'bigger change, or the same change in less time,', 'needs a bigger force'],
      ['F = m(v − u)/t   and   a = (v − u)/t', 'so  F = m a', '1 N = 1 kg × 1 m/s²  (the constant is 1)'],
      ['a = (7 − 1)/2 = 3 m/s²', 'F = m a = 2 × 3 = 6 N', 'check: Δp/t = 12/2 = 6 N ✓'],
    ][step];
    lines.forEach((l, i) => text(ctx, l, 14, y0 + i * 17, { color: i === 0 ? col.s[0] : col.ink, size: i === 0 ? 12.5 : 11.5, weight: i === 0 ? 700 : 400 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
