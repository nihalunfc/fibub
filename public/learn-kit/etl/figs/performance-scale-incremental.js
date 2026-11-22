// 7.5 Rows read per run over three years: a full rebuild grows with history, an incremental run with a 7-day
// look-back stays flat. Speed-up after D days is about D ÷ 8.
import { stepFig, note } from './d-lib.js';
import { axes, line, dot, text, lerp } from '../../kit.js';

const PER_DAY = 0.6;       // million order lines a day (a 150-restaurant chain)
const LOOK = 7;            // look-back days
const DAYS = [30, 365, 1095, 1095];
const NOTE = [
  'Day 30: full rebuild reads 18M rows, incremental 4.8M',
  'Day 365: full rebuild 219M rows; incremental still 4.8M',
  'Day 1,095: full rebuild 657M rows; incremental still 4.8M',
  'Speed-up ≈ 1,095 ÷ (1 + 7) ≈ 137 times less work per run',
];

export default function (host) {
  return stepFig(host, {
    aspect: 0.6, label: 'Two lines of rows read per run against days of history: a rising line for full rebuilds and a flat line for incremental runs',
    name: 'Full rebuild vs incremental', last: 3,
    draw(ctx, w, h, col, step, e, prev) {
      const ax = axes(ctx, w, h, col, { x: [0, 1100], y: [0, 700], t: 40, b: 44, l: 46, xt: [0, 365, 730, 1095], yt: [0, 200, 400, 600], fy: (v) => v + 'M', fx: (v) => v.toLocaleString('en-CA') });
      const d = lerp(DAYS[Math.min(prev, 3)], DAYS[step], e);
      const full = col.bad || col.s[1], inc = col.s[0];
      line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(d), ax.Y(d * PER_DAY)]], full, 2.5);
      const incY = Math.min(d, LOOK + 1) * PER_DAY;
      line(ctx, [[ax.X(0), ax.Y(incY)], [ax.X(d), ax.Y(incY)]], inc, 2.5);
      dot(ctx, ax.X(d), ax.Y(d * PER_DAY), 4.5, full);
      dot(ctx, ax.X(d), ax.Y(incY), 4.5, inc);
      const early = d < 600, lx = ax.X(d) + (early ? 8 : -8), al = early ? 'left' : 'right';
      text(ctx, 'full rebuild', lx, ax.Y(d * PER_DAY) - (early ? 22 : 4), { color: full, size: 11, weight: 650, align: al, halo: col.panel });
      text(ctx, 'incremental (7-day look-back)', ax.L + 6, ax.Y(incY) - 12, { color: inc, size: 11, weight: 650, halo: col.panel });
      text(ctx, 'days of history', ax.R, ax.B - 10, { color: col.muted, size: 10, align: 'right', halo: col.panel });
      if (step === 3) text(ctx, '≈ 137×', ax.X(800), ax.Y(330), { color: col.ink, size: 20, weight: 750, align: 'center', halo: col.panel });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
