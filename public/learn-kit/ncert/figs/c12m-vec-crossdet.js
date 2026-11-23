// Class 12 Maths, Vector Algebra (step player): a x b by the determinant, for a = 2i - j + 3k and b = i + 4j - 2k.
// Cover the column of i, then j, then k; each leftover 2x2 gives a minor (ad - bc); the middle term takes a minus sign (cofactor signs + - +).
// The check at the end: the result is perpendicular to both a and b (both dot products are 0).
import { canvas, text, title, line } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'The determinant of i j k over the components of a and b, with one column covered at a time' });
  const M = [['i', 'j', 'k'], ['2', '−1', '3'], ['1', '4', '−2']];
  const TXT = [
    'Write a determinant: row 1 is i, j, k, row 2 is a, row 3 is b.',
    'Cover the i column. Minor = (−1)(−2) − (3)(4) = 2 − 12 = −10. Coefficient of i: +(−10).',
    'Cover the j column. Minor = (2)(−2) − (3)(1) = −7. The middle term takes a minus: +7 for j.',
    'Cover the k column. Minor = (2)(4) − (−1)(1) = 8 + 1 = 9. Coefficient of k: +9.',
    'a × b = −10 i + 7 j + 9 k. Check: a·(a×b) = −20 − 7 + 27 = 0 and b·(a×b) = −10 + 28 − 18 = 0.',
  ];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Cross product by a determinant', col) + 12;
    const cw = Math.min(70, (w - 80) / 3), x0 = (w - 3 * cw) / 2, rh = 36, y0 = top + 20;
    const col_ = st >= 1 && st <= 3 ? st - 1 : -1;
    // bars around the matrix
    line(ctx, [[x0 - 8, y0 - 14], [x0 - 8, y0 + 3 * rh - 10]], col.ink, 2); line(ctx, [[x0 + 3 * cw + 8, y0 - 14], [x0 + 3 * cw + 8, y0 + 3 * rh - 10]], col.ink, 2);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const cx = x0 + c * cw + cw / 2, cy = y0 + r * rh + rh / 2 - 12, covered = c === col_ || (col_ >= 0 && r === 0);
      if (col_ >= 0 && c !== col_ && r > 0) { ctx.save(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(cx - cw / 2 + 4, cy - 15, cw - 8, 30); ctx.restore(); }
      text(ctx, M[r][c], cx, cy, { color: covered ? col.line : r === 0 ? [col.s[0], col.s[1], col.s[2]][c] : col.ink, size: 18, weight: 700, align: 'center' });
    }
    if (col_ >= 0) { const cx = x0 + col_ * cw + cw / 2; line(ctx, [[cx, y0 - 16], [cx, y0 + 3 * rh - 12]], col.bad, 2); line(ctx, [[x0 - 4, y0 + rh / 2 - 12], [x0 + 3 * cw + 4, y0 + rh / 2 - 12]], col.bad, 2); }
    const parts = [['−10 i', col.s[0]], ['+ 7 j', col.s[1]], ['+ 9 k', col.s[2]]], ry = y0 + 3 * rh + 14;
    const shown = st === 0 ? 0 : st >= 4 ? 3 : st;
    text(ctx, 'a × b =', 12, ry, { color: col.ink, size: 15, weight: 700 });
    parts.slice(0, shown).forEach(([t, c], i) => text(ctx, t, 84 + i * Math.min(80, (w - 100) / 3), ry, { color: c, size: 15, weight: 700 }));
    const words = TXT[st].split(' '); let l = '', yy = ry + 34;
    ctx.save(); ctx.font = '13px system-ui';
    words.forEach((wd) => { const t = l ? l + ' ' + wd : wd; if (ctx.measureText(t).width > w - 24 && l) { text(ctx, l, 12, yy, { color: col.ink, size: 13 }); yy += 18; l = wd; } else l = t; });
    ctx.restore(); text(ctx, l, 12, yy, { color: col.ink, size: 13 });
  };
  cv.redraw();
  return { step(i) { st = Math.min(4, i); cv.redraw(); } };
}
