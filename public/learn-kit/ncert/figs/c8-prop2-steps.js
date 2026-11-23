// Class 8 Proportional Reasoning 2 (step player): solving an inverse proportion question with a rectangle whose area is the constant.
// 6 pipes fill a tank in 20 minutes; how long do 10 pipes take? Pipes x minutes = 120 stays fixed.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-prop2-lib.js';

const N = ['6 identical pipes fill a tank in 20 minutes. How long will 10 pipes take?', 'Draw the job as a rectangle: 6 pipes wide, 20 minutes tall.', 'Its area is the job: 6 × 20 = 120 pipe-minutes. This number does not change.', 'Now use 10 pipes. The rectangle is 10 wide and its area must still be 120.', 'Height = 120 ÷ 10 = 12 minutes. More pipes, shorter time: 10 pipes take 12 minutes.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A rectangle of pipes by minutes with area 120' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Pipes × minutes = 120', col), L = 40, B = h - 70, sx = (w - L - 20) / 12, sy = (B - top - 14) / 22, box = (x, y, c, a) => { ctx.fillStyle = c; ctx.globalAlpha = a; ctx.fillRect(L, B - y * sy, x * sx, y * sy); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.strokeRect(L, B - y * sy, x * sx, y * sy); };
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(w - 10, B); ctx.moveTo(L, B); ctx.lineTo(L, top + 8); ctx.stroke();
    text(ctx, 'minutes', 8, top + 8, { color: col.muted, size: 10 }); text(ctx, 'pipes →', w - 10, B + 13, { color: col.muted, size: 10, align: 'right' });
    if (s >= 1) { box(6, 20, col.s[0], 0.3); text(ctx, '6 pipes', L + 3 * sx, B + 14, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, '20 min', L + 4, B - 20 * sy - 7, { color: col.s[0], size: 11, weight: 700 }); }
    if (s >= 2) text(ctx, '120', L + 3 * sx, B - 10 * sy, { color: col.ink, size: 15, weight: 700, align: 'center', halo: col.panel });
    if (s >= 3) { box(10, s >= 4 ? 12 : 20, col.s[3], 0.22); text(ctx, '10 pipes', L + 8 * sx, B + 14, { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    if (s >= 4) text(ctx, '12 min', L + 10 * sx + 4, B - 12 * sy - 8, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
