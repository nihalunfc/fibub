// Class 9 Rotation (step player): the angle between the hands at 4:20. Minute hand: 20 x 6 = 120 degrees.
// Hour hand: 4 x 30 = 120 degrees plus 20 x 0.5 = 10 degrees, so 130 degrees. Difference: 10 degrees.
import { canvas, text, title } from '../../kit.js';
import { face } from './c9-rot-clock.js';

const T = ['A clock showing 4:20. Measure each hand from the 12, clockwise.', 'Minute hand: 20 minutes × 6° = 120° from the 12 (it points at the 4).', 'Hour hand at 4:00 would be 4 × 30° = 120°.', 'But 20 minutes have passed, so it has crept on 20 × 0.5° = 10° more: 130°.', 'Angle between the hands = 130° − 120° = 10°.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'Finding the angle between the hands of a clock at 4:20 in steps' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle between the hands at 4:20', col), R = Math.min(w / 2 - 12, (h - top - 44) / 2), cx = w / 2, cy = top + R + 6;
    face(ctx, cx, cy, R, col, 260, s >= 4);
    const arc = (d, c) => { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R * 0.92 - 0, -Math.PI / 2, (d * Math.PI) / 180 - Math.PI / 2); ctx.stroke(); };
    if (s === 1) arc(120, col.s[2]);
    if (s === 2) arc(120, col.s[0]);
    if (s === 3) { arc(130, col.s[0]); }
    text(ctx, T[s], w / 2, h - 20, { color: col.ink, size: 12, align: 'center', weight: 600 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
