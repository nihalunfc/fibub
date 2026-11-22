// 7.1 Thirty mornings of finish times against an 08:00 deadline: the average looks safe, the 95th percentile does
// not, two late days are counted, and the error budget of a 98% SLO turns out to be spent.
import { stepFig, note, clock } from './d-lib.js';
import { axes, dot, line, text } from '../../kit.js';

// Finish time of the QSR email, minutes after midnight, for 30 mornings (synthetic).
const T = [412, 405, 431, 398, 420, 447, 409, 416, 492, 401, 425, 438, 410, 399, 415, 428, 456, 403, 419, 411,
  433, 407, 505, 418, 424, 402, 441, 413, 409, 422];
const DEADLINE = 480;
const mean = T.reduce((s, v) => s + v, 0) / T.length;
const sorted = [...T].sort((a, b) => a - b);
const p95 = sorted[Math.ceil(0.95 * T.length) - 1];
const misses = T.filter((v) => v > DEADLINE).length;
const NOTE = [
  '30 mornings: when did the email go out?',
  `Average finish ${clock(mean)}: looks comfortably early`,
  `95th percentile ${clock(p95)}: the slow tail crosses 08:00`,
  `${misses} late days out of 30: compliance ${((1 - misses / 30) * 100).toFixed(1)}%`,
  `98% SLO allows 0.6 late days; ${misses} used, budget −${(misses - 0.6).toFixed(1)} days`,
];

export default function (host) {
  return stepFig(host, {
    aspect: 0.6, label: 'Dots for thirty daily finish times with the 08:00 deadline, the average line and the 95th percentile line',
    name: 'Freshness: the tail matters', last: 4,
    draw(ctx, w, h, col, step, e) {
      const ax = axes(ctx, w, h, col, { x: [0, 31], y: [380, 520], t: 40, b: 44, l: 48, xt: [1, 10, 20, 30], yt: [390, 420, 450, 480, 510], fy: clock, fx: (v) => 'day ' + v });
      // deadline
      line(ctx, [[ax.L, ax.Y(DEADLINE)], [ax.R, ax.Y(DEADLINE)]], col.bad || col.s[1], 1.5, [6, 4]);
      text(ctx, 'deadline 08:00', ax.R - 4, ax.Y(DEADLINE) - 9, { color: col.bad || col.s[1], size: 10.5, weight: 600, align: 'right', halo: col.panel });
      const shown = step === 0 ? Math.ceil(30 * e) : 30;
      for (let i = 0; i < shown; i++) {
        const late = T[i] > DEADLINE;
        const c = step >= 3 && late ? col.bad || col.s[1] : col.s[0];
        dot(ctx, ax.X(i + 1), ax.Y(T[i]), step >= 3 && late ? 5 : 3.5, c, step >= 3 && late ? col.ink : null);
      }
      if (step >= 1) {
        const x1 = step === 1 ? ax.L + (ax.R - ax.L) * e : ax.R;
        line(ctx, [[ax.L, ax.Y(mean)], [x1, ax.Y(mean)]], col.good || col.s[2], 2);
        text(ctx, `average ${clock(mean)}`, ax.L + 6, ax.Y(mean) + 10, { color: col.ink, size: 10.5, weight: 600, halo: col.panel });
      }
      if (step >= 2) {
        const x1 = step === 2 ? ax.L + (ax.R - ax.L) * e : ax.R;
        line(ctx, [[ax.L, ax.Y(p95)], [x1, ax.Y(p95)]], col.warn || col.s[3], 2);
        text(ctx, `p95 ${clock(p95)}`, ax.L + 6, ax.Y(p95) - 9, { color: col.ink, size: 10.5, weight: 600, halo: col.panel });
      }
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
