// 3.4 A backfill over daily partitions: 20 green days, a bug touches days 6 to 13, a backfill reruns only those
// eight days, four at a time, in two waves.
import { stepFig, box, note } from './b-lib.js';
import { text } from '../../kit.js';

const BAD = (d) => d >= 6 && d <= 13;
const state = (step, d) => {
  if (step === 0 || !BAD(d)) return 'done';
  if (step === 1) return 'stale';
  if (step === 2) return d <= 9 ? 'run' : 'stale';
  if (step === 3) return d <= 9 ? 'done' : 'run';
  return 'done';
};
const NOTE = ['20 daily partitions, all materialised', 'A cleaning bug affected days 6 to 13 only', 'Backfill wave 1: days 6 to 9, four runs at once', 'Wave 2: days 10 to 13', 'Done: 8 runs, 2 waves of 40 s = 80 s. Other days untouched'];
export default function (host) {
  return stepFig(host, {
    aspect: 0.5, label: 'A grid of twenty daily partitions where eight are marked stale and rerun four at a time',
    name: 'Backfilling 8 of 20 days', last: 4,
    draw(ctx, w, h, col, step) {
      const cols = 10, gap = 5, cw = (w - 20 - gap * (cols - 1)) / cols, ch = Math.min(40, (h - 100) / 2 - gap);
      for (let d = 1; d <= 20; d++) {
        const i = (d - 1) % cols, r = Math.floor((d - 1) / cols);
        const x = 10 + i * (cw + gap), y = 46 + r * (ch + gap + 14);
        box(ctx, x, y, cw, ch, String(d), col, { state: state(step, d), size: 11 });
        if (d === 1 || d === 11) text(ctx, d === 1 ? 'Sept 1 to 10' : 'Sept 11 to 20', x, y + ch + 8, { color: col.muted, size: 10.5 });
      }
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
