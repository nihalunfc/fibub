// 4.6 A serverless database across one day: a one-hour load plus the auto-pause delay is all you pay for, until
// refreshes every 30 minutes keep it awake all day; lining refreshes up with the load brings the bill back down.
import { stepFig, note, tone } from './b-lib.js';
import { text } from '../../kit.js';

// active (busy) windows in hours for each step; the paused-after delay is 1 h
const DELAY = 1;
const SC = [
  { busy: [[5, 6]], delay: false },
  { busy: [[5, 6]], delay: true },
  { busy: [[5, 6], ...Array.from({ length: 25 }, (_, i) => [7 + i * 0.5, 7 + i * 0.5 + 0.17])], delay: true },
  { busy: [[5, 6], [6.5, 6.67], [12, 12.17]], delay: true },
];
const billed = ({ busy, delay }) => {
  const segs = busy.map(([a, b]) => [a, Math.min(24, b + (delay ? DELAY : 0))]).sort((p, q) => p[0] - q[0]);
  let tot = 0, cur = null;
  for (const s of segs) { if (!cur || s[0] > cur[1]) { if (cur) tot += cur[1] - cur[0]; cur = [...s]; } else cur[1] = Math.max(cur[1], s[1]); }
  return { tot: tot + (cur ? cur[1] - cur[0] : 0), segs };
};
const NOTE = ['A one-hour load at 05:00, then nothing', 'Add the 1-hour auto-pause delay: billed about 2 h', 'Refreshes every 30 min, 07:00 to 19:00: awake all day', 'Two refreshes, one just after the load and one at noon'];
export default function (host) {
  return stepFig(host, {
    aspect: 0.45, label: 'A 24-hour bar showing when a serverless database is busy, waiting to pause, and billed',
    name: 'When serverless bills you', last: 3,
    draw(ctx, w, h, col, step) {
      const L = 14, R = w - 14, X = (t) => L + (t / 24) * (R - L), y = h * 0.4, bh = 26, sc = SC[step], b = billed(sc);
      ctx.fillStyle = col.line; ctx.fillRect(L, y, R - L, bh);
      ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = tone(col, 'stale');
      for (const [a, c] of b.segs) ctx.fillRect(X(a), y, X(c) - X(a), bh);
      ctx.restore();
      ctx.fillStyle = tone(col, 'run');
      for (const [a, c] of sc.busy) ctx.fillRect(X(a), y, Math.max(2, X(c) - X(a)), bh);
      for (let t = 0; t <= 24; t += 6) text(ctx, `${String(t).padStart(2, '0')}:00`, X(t), y + bh + 12, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, `billed ≈ ${b.tot.toFixed(1)} h of 24`, w / 2, y - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
