// Class 12 Maths, Three Dimensional Geometry (step player): the shortest distance between two skew lines by the formula
// d = |(a2 - a1) . (b1 x b2)| / |b1 x b2|, worked for L1: r = i + lambda(j + k) and L2: r = j + 2k + mu(i + k).
import { canvas, text, title } from '../../kit.js';
import { wrap } from '../c12m-view3d.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A worked calculation of the shortest distance between two lines, one step at a time' });
  const LINES = [
    ['L₁:  r = (1, 0, 0) + λ(0, 1, 1)', 'L₂:  r = (0, 1, 2) + μ(1, 0, 1)'],
  ];
  const BOX = [
    ['Pick out a₁, b₁ and a₂, b₂.', 'a₁ = (1, 0, 0),  b₁ = (0, 1, 1)', 'a₂ = (0, 1, 2),  b₂ = (1, 0, 1)'],
    ['Find b₁ × b₂ (perpendicular to both lines).', 'b₁ × b₂ = (1·1 − 1·0, 1·1 − 0·1, 0·0 − 1·1) = (1, 1, −1)', '|b₁ × b₂| = √(1 + 1 + 1) = √3'],
    ['Join the two given points: a₂ − a₁.', 'a₂ − a₁ = (0 − 1, 1 − 0, 2 − 0) = (−1, 1, 2)'],
    ['Project that joining vector on b₁ × b₂ (dot product).', '(a₂ − a₁)·(b₁ × b₂) = (−1)(1) + (1)(1) + (2)(−1) = −2'],
    ['Divide, and take the size (a distance is never negative).', 'd = |−2| / √3 = 2/√3 ≈ 1.155 units', 'Not 0, so the lines do not meet: they are skew.'],
  ];
  cv.draw = (ctx, w, h, col) => {
    let y = title(ctx, 'Shortest distance between skew lines', col) + 10;
    LINES[0].forEach((l, i) => { text(ctx, l, 12, y + i * 20, { color: col.s[i], size: 14, weight: 700 }); });
    y += 52;
    BOX.slice(0, st + 1).forEach((b, i) => {
      const cur = i === st; ctx.save(); ctx.globalAlpha = cur ? 1 : 0.55;
      y = wrap(ctx, `${i + 1}. ${b[0]}`, 12, y, w - 24, cur ? col.ink : col.muted, 12.5, 17);
      b.slice(1).forEach((t, j) => { text(ctx, t, 22, y + 2, { color: cur ? col.s[3] : col.muted, size: 13, weight: cur ? 700 : 400 }); y += 19; });
      ctx.restore(); y += 6;
    });
  };
  cv.redraw();
  return { step(i) { st = Math.min(4, i); cv.redraw(); } };
}
