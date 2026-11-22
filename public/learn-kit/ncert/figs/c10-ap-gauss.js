// Class 10 Arithmetic Progressions (step player): Gauss's pairing trick for 1 + 2 + ... + 10. Write the list forwards,
// write it again backwards under it, and add column by column: every column adds to 11. Ten columns of 11 make twice the sum, so
// the sum is 10 x 11 / 2 = 55. The general idea: S = n(first + last)/2.
import { canvas, text, title, loop, ease } from '../../kit.js';

export default function (host) {
  let step = 0, p = 0, tp = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The numbers 1 to 10 written forwards and backwards with each column adding to 11' });
  loop(host, (dt) => { if (p !== tp) { p = p < tp ? Math.min(tp, p + dt * 1.1) : Math.max(tp, p - dt * 1.1); cv.redraw(); } });
  const CAP = ['S = 1 + 2 + 3 + … + 10', 'Write S again, backwards, under it', 'Add each column: 1 + 10, 2 + 9, 3 + 8, … all give 11', '10 columns of 11 add to 110, and that is 2S', 'S = 110 ÷ 2 = 55. In general S = n(first + last) / 2'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, "Gauss's trick: 1 + 2 + … + 10", col) + 14;
    const L = 14, cw = (w - 2 * L) / 10, s = Math.min(cw - 4, 34), y1 = top + 8, y2 = y1 + s + 14 + (1 - ease(p)) * 0, y3 = y2 + s + 12;
    for (let i = 0; i < 10; i++) {
      const x = L + i * cw + (cw - s) / 2;
      ctx.fillStyle = col.s[0]; ctx.fillRect(x, y1, s, s); text(ctx, String(i + 1), x + s / 2, y1 + s / 2, { color: col.panel, size: 12, weight: 700, align: 'center' });
      if (step >= 1) {
        const e = step === 1 ? ease(p > 0 ? 1 : 0) : 1, yy = y2 + (1 - e) * 40;
        ctx.globalAlpha = e; ctx.fillStyle = col.s[1]; ctx.fillRect(x, yy, s, s); text(ctx, String(10 - i), x + s / 2, yy + s / 2, { color: col.panel, size: 12, weight: 700, align: 'center' }); ctx.globalAlpha = 1;
      }
      if (step >= 2) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.9; ctx.fillRect(x, y3, s, s); ctx.globalAlpha = 1; text(ctx, '11', x + s / 2, y3 + s / 2, { color: col.panel, size: 12, weight: 700, align: 'center' }); }
    }
    if (step === 1) { text(ctx, 'backwards', L, y2 + s + 12, { color: col.s[1], size: 11, weight: 700 }); }
    if (step >= 3) text(ctx, '10 × 11 = 110 = S + S', w / 2, y3 + s + 24, { color: col.ink, size: 14, weight: 700, align: 'center' });
    if (step >= 4) text(ctx, 'S = 55', w / 2, y3 + s + 48, { color: col.s[3], size: 18, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); p = 0; tp = 1; cv.redraw(); } };
}
