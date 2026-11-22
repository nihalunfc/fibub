// Class 10 Quadratic Equations (step player): a speed word problem. A passenger train covers 300 km. Going 10 km/h faster
// would save 1 hour. With usual speed x km/h: 300/x - 300/(x + 10) = 1, which clears to x² + 10x - 3000 = 0, so
// (x + 60)(x - 50) = 0 and x = 50 (a speed cannot be negative). The two trains race along the track in the picture.
import { canvas, text, title, line, loop } from '../../kit.js';

const EQ = [null, 'Usual speed = x km/h. Faster train = x + 10 km/h', 'Time = distance ÷ speed:  300/x  and  300/(x + 10)', '300/x − 300/(x + 10) = 1', '300(x + 10) − 300x = x(x + 10)  →  x² + 10x − 3000 = 0', '(x + 60)(x − 50) = 0  →  x = −60 or x = 50', 'Speed cannot be negative: usual speed is 50 km/h'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Two trains on a 300 km track, the faster one arriving an hour earlier' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Train problem: 300 km, 10 km/h faster saves 1 hour', col) + 12;
    const L = 30, R = w - 30, y1 = top + 28, y2 = top + 74;
    for (const [y, c, lab, v] of [[y1, col.s[1], 'usual: x km/h', 50], [y2, col.s[0], 'faster: x + 10 km/h', 60]]) {
      line(ctx, [[L, y], [R, y]], col.muted, 3, [10, 5]);
      const prog = Math.min(1, ((t * 0.12) % 1.4) * v / 60 / 1.0);
      const px = L + Math.min(1, ((t * 0.1) % 1.25) * v / 60) * (R - L);
      ctx.fillStyle = c; ctx.fillRect(px - 16, y - 12, 32, 14); ctx.fillRect(px - 10, y - 18, 8, 6);
      text(ctx, lab, L, y - 22, { color: c, size: 11, weight: 700 });
      void prog;
    }
    text(ctx, 'start', L, y2 + 20, { color: col.muted, size: 10.5 }); text(ctx, '300 km', R, y2 + 20, { color: col.muted, size: 10.5, align: 'right' });
    let y = y2 + 52;
    for (let i = 1; i <= step; i++) {
      const cur = i === step;
      text(ctx, EQ[i], 12, y, { color: cur ? col.s[2] : col.ink, size: cur ? 12.5 : 11.5, weight: cur ? 700 : 500 }); y += 22;
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(6, i); cv.redraw(); } };
}
