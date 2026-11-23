// Class 12 Maths, Three Dimensional Geometry (step player): direction ratios and direction cosines of the line through P(2, 1, -3) and Q(5, 5, 9).
// DR = Q - P = (3, 4, 12), r = sqrt(9 + 16 + 144) = 13, DC = (3/13, 4/13, 12/13); the squares l², m², n² always add to 1 (the stacked bar).
import { canvas, text, title, line } from '../../kit.js';
import { wrap } from '../c12m-view3d.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Working out the direction ratios and direction cosines of the line through two points, step by step' });
  const BOX = [
    ['The line passes through P(2, 1, −3) and Q(5, 5, 9).'],
    ['Direction ratios: subtract the coordinates, end minus start.', 'a = 5 − 2 = 3,  b = 5 − 1 = 4,  c = 9 − (−3) = 12'],
    ['The length of that step.', 'r = √(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13'],
    ['Direction cosines: divide each ratio by r.', 'l = 3/13,  m = 4/13,  n = 12/13'],
    ['Check: the squares add to 1.', 'l² + m² + n² = 9/169 + 16/169 + 144/169 = 1'],
  ];
  cv.draw = (ctx, w, h, col) => {
    let y = title(ctx, 'Two points to direction cosines', col) + 10;
    BOX.slice(0, st + 1).forEach((b, i) => {
      const cur = i === st;
      y = wrap(ctx, (i ? `${i}. ` : '') + b[0], 12, y, w - 24, cur ? col.ink : col.muted, 12.5, 17);
      if (b[1]) { text(ctx, b[1], 22, y + 2, { color: cur ? col.s[3] : col.muted, size: 13, weight: cur ? 700 : 400 }); y += 19; }
      y += 6;
    });
    if (st >= 4) {
      const x0 = 14, bw = w - 28, vals = [9, 16, 144], cols = [col.s[0], col.s[1], col.s[2]], nm = ['l²', 'm²', 'n²']; let x = x0; y += 6;
      vals.forEach((v, i) => { const ww = bw * v / 169; ctx.fillStyle = cols[i]; ctx.globalAlpha = 0.8; ctx.fillRect(x, y, ww, 26); ctx.globalAlpha = 1; if (ww > 26) text(ctx, nm[i], x + ww / 2, y + 13, { color: col.panel, size: 12, weight: 700, align: 'center' }); x += ww; });
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y, bw, 26);
      text(ctx, 'one whole bar = 1', w / 2, y + 42, { color: col.muted, size: 11.5, align: 'center' });
    }
    void line;
  };
  cv.redraw();
  return { step(i) { st = Math.min(4, i); cv.redraw(); } };
}
