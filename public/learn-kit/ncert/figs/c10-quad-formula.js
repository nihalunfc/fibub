// Class 10 Quadratic Equations (step player): deriving the quadratic formula by completing the square.
// Start from ax² + bx + c = 0, divide by a, add (b/2a)² to both sides to make a perfect square, then take the square root.
// Each step adds one line of algebra and says what was done; earlier lines fade.
import { canvas, text, title, loop } from '../../kit.js';

const LINES = [
  ['ax² + bx + c = 0', 'Start (a is not 0)'],
  ['x² + (b/a)x + c/a = 0', 'Divide every term by a'],
  ['x² + (b/a)x = −c/a', 'Move c/a to the other side'],
  ['x² + (b/a)x + (b/2a)² = (b/2a)² − c/a', 'Add (half of b/a)² to both sides: the square is completed'],
  ['(x + b/2a)² = (b² − 4ac) / 4a²', 'Left side is a perfect square; tidy the right side'],
  ['x + b/2a = ± √(b² − 4ac) / 2a', 'Take the square root of both sides'],
  ['x = (−b ± √(b² − 4ac)) / 2a', 'Subtract b/2a: the quadratic formula'],
];
export default function (host) {
  let step = 0, k = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Line by line derivation of the quadratic formula' });
  loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 3); cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Where the formula comes from', col) + 14;
    const gap = Math.min(46, (h - top - 20) / LINES.length);
    for (let i = 0; i <= step; i++) {
      const y = top + i * gap + 14, cur = i === step, al = cur ? k : i === step - 1 ? 0.7 : 0.45;
      ctx.globalAlpha = al;
      text(ctx, LINES[i][0], 14, y, { color: cur ? col.s[0] : col.ink, size: cur ? 14.5 : 13, weight: cur ? 700 : 500 });
      text(ctx, LINES[i][1], 14, y + 15, { color: col.muted, size: 10.5 });
      ctx.globalAlpha = 1;
    }
    if (step === 6) {
      const y = top + 6 * gap + 40;
      text(ctx, 'D = b² − 4ac is the discriminant', 14, y, { color: col.s[3], size: 12, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(LINES.length - 1, i); k = 0; cv.redraw(); } };
}
