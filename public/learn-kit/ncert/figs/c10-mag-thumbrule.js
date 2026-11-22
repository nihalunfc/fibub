// Class 10 Magnetic Effects (step player): the right-hand thumb rule. For a straight wire: point the thumb of the right
// hand along the current and the curled fingers give the direction of the field lines. For a coil or solenoid it is
// the other way round: curl the fingers in the direction of the current in the turns and the thumb points to the north pole.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

const T = ['A straight wire carries a current upwards', 'Right hand: thumb along the current', 'The curled fingers show the field direction', 'Reverse the current: the field reverses', 'A solenoid: fingers curl with the current, thumb shows the N pole'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The right-hand thumb rule for a straight wire and for a solenoid' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    if (step <= 3) {
      const up = step !== 3, cx = w / 2, y0 = 70, y1 = h - 40, cy = h * 0.52;
      line(ctx, [[cx, y0], [cx, y1]], col.ink, 5);
      arrow(ctx, cx, up ? cy + 30 : cy - 30, cx, up ? y0 - 6 : y1 + 6, col.s[1], 3, 10); text(ctx, 'I', cx + 14, up ? y0 + 6 : y1 - 6, { color: col.s[1], size: 14, weight: 700 });
      if (step >= 1) { // the thumb
        const ty = up ? cy + 36 : cy - 36; arrow(ctx, cx - 34, ty + (up ? 34 : -34), cx - 34, ty + (up ? -34 : 34), col.s[3], 9, 16);
        text(ctx, 'thumb = current', cx - 46, ty + (up ? -4 : 4), { color: col.s[3], size: 11, weight: 700, align: 'right', halo: col.panel });
      }
      if (step >= 2) for (const f of [-1, 0, 1]) {
        const y = cy + f * 62, rx = 60 - Math.abs(f) * 6, ry = 18; ctx.save(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, y, rx, ry, 0, 0, 7); ctx.stroke(); ctx.restore();
        const s = up ? 1 : -1; arrow(ctx, cx + s * -10, y + ry, cx + s * 12, y + ry, col.s[0], 3, 11); arrow(ctx, cx + s * 10, y - ry, cx + s * -12, y - ry, col.s[0], 3, 11);
        const a = (t * 0.8 * s + f) % (2 * Math.PI); dot(ctx, cx + rx * Math.cos(a), y + ry * Math.sin(a), 3.2, col.s[3]);
      }
      if (step >= 2) text(ctx, step === 3 ? 'field now goes the other way round' : 'fingers curl = field lines', cx + 74, cy - 74, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
      return;
    }
    // solenoid: turns drawn as slanted lines; current runs up the front, N pole at the left
    const L = w * 0.18, R = w * 0.82, cy = h * 0.5, rh = 44, n = 7, dx = (R - L) / n;
    for (let k = 0; k < n; k++) { const xk = L + (k + 0.5) * dx, rx = dx * 0.22; ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(xk, cy, rx, rh, 0, Math.PI / 2, (3 * Math.PI) / 2); ctx.stroke(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.ellipse(xk, cy, rx, rh, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore(); arrow(ctx, xk + rx, cy + 12, xk + rx, cy - 14, col.s[1], 2.6, 8); }
    arrow(ctx, w * 0.6, cy + rh + 36, w * 0.08, cy + rh + 36, col.s[3], 9, 16);
    text(ctx, 'thumb points to the N pole', w * 0.32, cy + rh + 60, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    text(ctx, 'N', L - 16, cy, { color: '#e5241d', size: 20, weight: 700, align: 'center' }); text(ctx, 'S', R + 16, cy, { color: '#2a6df4', size: 20, weight: 700, align: 'center' });
    text(ctx, 'current goes up the front of each turn (fingers curl this way)', w / 2, cy - rh - 16, { color: col.s[1], size: 11, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, T.length - 1); cv.redraw(); } };
}
