// Class 10 Magnetic Effects (step player): one turn of a DC motor, step by step, with the coil frozen at four key angles.
// Horizontal coil: the forces on the two sides are as far from the axle as possible, so the turning effect is the largest.
// Vertical coil: both forces act along the line through the axle, so the torque is zero; the split ring switches the
// current as the coil passes this position. After the switch the forces again turn the coil the same way.
import { canvas, text, title } from '../../kit.js';
import { drawMotor } from './c10-mag-motor.js';

const S = [
  [0.0, 'Coil horizontal: the biggest turning effect', 'Right side: current out, force up. Left side: current in, force down. Torque is maximum.'],
  [1.1, 'The coil turns and the torque falls', 'As the coil tilts, the same forces act closer to the axle line, so the turning effect gets smaller.'],
  [Math.PI / 2, 'Coil vertical: the commutator reverses the current', 'Forces point along the line through the axle: zero torque. The split ring’s gap crosses the brushes here and the current in each side is reversed.'],
  [Math.PI + 0.35, 'Past the vertical: the push is again forward', 'Because the current was reversed, the side now on the right is again pushed up, the side on the left down: it keeps turning the same way.'],
];
export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A DC motor coil at four positions of one turn' });
  cv.draw = (ctx, w, h, col) => {
    const [th, ttl, msg] = S[step];
    title(ctx, ttl, col);
    drawMotor(ctx, w, h, col, th, { commutator: true, inset: [w - 52, h - 36] });
    const words = msg.split(' '); let line1 = '', lines = []; for (const wd of words) { if ((line1 + ' ' + wd).length > 34) { lines.push(line1); line1 = wd; } else line1 = line1 ? line1 + ' ' + wd : wd; } lines.push(line1);
    lines.forEach((l, i) => text(ctx, l, 10, h - 14 - (lines.length - 1 - i) * 13, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, S.length - 1); cv.redraw(); } };
}
