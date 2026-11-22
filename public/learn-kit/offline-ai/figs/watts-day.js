// 6.1 Power over a 10-hour working day (9:00 to 19:00). The shaded area under the power line is the energy.
// Idle with the model loaded at 70 W, four half-hour bursts of writing at 260 W (2 hours in all), then the same day
// with the machine asleep (about 2 W) instead of idling.
import { axes, line, text, title, lerp } from '../../kit.js';
import { stepFig } from './b-lib.js';

const T0 = 9, T1 = 19;
const BURSTS = [[9.5, 10], [11, 11.5], [14, 14.5], [16, 16.5]];
const writing = (t) => BURSTS.some(([a, b]) => t >= a && t < b);
const IDLE = 70, WRITE = 260, SLEEP = 2;

export default function (host) {
  return stepFig(host, {
    aspect: 0.6, max: 320, min: 250, label: 'Power drawn across a working day, with energy shown as the area under the line',
    draw(ctx, w, h, col, s) {
      title(ctx, 'Energy = area under the line', col);
      const A = axes(ctx, w, h, col, { x: [T0, T1], y: [0, 300], xlabel: 'time of day', ylabel: 'watts', l: 48, t: 70, fx: (v) => v + ':00' });
      const idleW = s.step >= 3 ? lerp(s.prev >= 3 ? SLEEP : IDLE, SLEEP, s.e) : IDLE;
      const pw = (t) => (s.step >= 1 && writing(t) ? WRITE : idleW);
      const pts = [];
      for (let t = T0; t <= T1 + 1e-9; t += 0.05) pts.push([A.X(t), A.Y(pw(t))]);
      // shade
      const shade = (pred, color) => {
        ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = color;
        for (let t = T0; t < T1 - 1e-9; t += 0.05) if (pred(t)) ctx.fillRect(A.X(t), A.Y(pw(t + 0.025)), A.X(t + 0.05) - A.X(t) + 0.5, A.B - A.Y(pw(t + 0.025)));
        ctx.restore();
      };
      if (s.step >= 1) shade((t) => writing(t), col.s[1]);
      if (s.step >= 2) shade((t) => !writing(t), col.s[0]);
      line(ctx, pts, col.ink, 2);
      const wk = (WRITE * 2) / 1000, ik = (idleW * 8) / 1000;
      text(ctx, s.step === 0 ? `Idle with the model loaded: ${IDLE} W` : `Writing: ${WRITE} W × 2 h = ${wk.toFixed(2)} kWh`, 10, 36, { color: s.step ? col.s[1] : col.ink, size: 11.5, weight: 650 });
      if (s.step >= 2) text(ctx, `${s.step >= 3 ? 'Asleep' : 'Idle'}: ${Math.round(idleW)} W × 8 h = ${ik.toFixed(2)} kWh, day ${(wk + ik).toFixed(2)} kWh`, 10, 52, { color: col.s[0], size: 11.5, weight: 650 });
    },
  });
}
