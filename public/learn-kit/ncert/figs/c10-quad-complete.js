// Class 10 Quadratic Equations (step player): completing the square with areas, for x² + 6x = 7.
// x² is a square x by x; 6x is two strips 3 by x. Moving the strips to two sides of the square leaves a missing
// corner of area 3 × 3 = 9. Adding it makes a bigger square of side (x + 3), so (x + 3)² = 7 + 9 = 16, x + 3 = ±4.
import { canvas, text, title, loop, ease } from '../../kit.js';

export default function (host) {
  let step = 0, p = 0, tp = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Area tiles completing the square for x² + 6x' });
  loop(host, (dt) => { if (p !== tp) { p = p < tp ? Math.min(tp, p + dt * 0.8) : Math.max(tp, p - dt * 0.8); cv.redraw(); } });
  const CAP = ['x² + 6x = 7: a square and a long strip of area 6x', 'Cut the strip in half: two strips, each 3 wide and x long', 'Move the strips next to the square, one on top, one on the right', 'One corner is missing: 3 × 3 = 9. Add 9 to both sides', 'The big square has side x + 3 and area 7 + 9 = 16, so x + 3 = 4 or −4'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Completing the square: x² + 6x = 7', col);
    const k = Math.min((w - 50) / 10, (h - top - 70) / 7.5), X = 4 * k, S = 3 * k; // x is drawn 4 units long just for the picture
    const e = ease(p);
    // final layout origin (top-left of the big square), square at bottom-left, strips on top and right
    const bx = (w - (X + 14 + 2 * S)) / 2 + 14, by = top + 16;
    const rect = (x, y, ww, hh, c, lab) => { ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x, y, ww, hh); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.strokeRect(x, y, ww, hh); if (lab) text(ctx, lab, x + ww / 2, y + hh / 2, { color: col.panel, size: 13, weight: 700, align: 'center' }); };
    // x² square: always at (bx, by + S)
    rect(bx, by + S, X, X, col.s[0], 'x²');
    if (step === 0) { const sx = bx + X + 14; rect(sx, by + S, S * 2, X, col.s[1], null); text(ctx, '6x', sx + S, by + S + X / 2, { color: col.panel, size: 13, weight: 700, align: 'center' }); }
    else {
      // strip A: from right of square (3 wide, X tall) to top (X wide, 3 tall); strip B: right of the square, moves to the right edge
      const aStart = [bx + X + 14, by + S, S, X], aEnd = [bx, by, X, S];
      const bStart = [bx + X + 14 + S, by + S, S, X], bEnd = [bx + X, by + S, S, X];
      const aa = aStart.map((v, i) => v + (aEnd[i] - v) * (step >= 2 ? e : 0)), bb = bStart.map((v, i) => v + (bEnd[i] - v) * (step >= 2 ? e : 0));
      rect(...aa, col.s[1], '3x'); rect(...bb, col.s[1], '3x');
    }
    if (step >= 3) { ctx.globalAlpha = Math.min(1, p * 1.2); rect(bx + X, by, S, S, col.s[3], '9'); ctx.globalAlpha = 1; }
    if (step === 4 && p > 0.9) {
      text(ctx, 'x + 3', bx + (X + S) / 2, by + S + X + 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
      text(ctx, 'x + 3', bx + X + S + 8, by + (X + S) / 2, { color: col.ink, size: 13, weight: 700 });
      text(ctx, '(x + 3)² = 16', w / 2, h - 34, { color: col.s[1], size: 13, weight: 700, align: 'center' });
    }
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); tp = step >= 2 ? 1 : 0; cv.redraw(); } };
}
