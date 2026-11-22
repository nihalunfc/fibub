// 17.4 The chance that a whole chain of steps is right, p to the power n. Steps: one step at 98%; 10 steps; 30 steps;
// a weaker model at 95%; a check after every step that catches 9 slips in 10 (98% becomes 99.8% per step).
import { axes, line, dot, text, title } from '../../kit.js';
import { stepFig } from './b-lib.js';

const MARK = [
  { p: 0.98, n: 1 }, { p: 0.98, n: 10 }, { p: 0.98, n: 30 }, { p: 0.95, n: 30 }, { p: 0.998, n: 30 },
];
const NMAX = 40;

export default function (host) {
  return stepFig(host, {
    aspect: 0.62, max: 330, min: 250, label: 'Chance the whole chain is right against the number of steps, for 98%, 95% and 99.8% per step',
    draw(ctx, w, h, col, s) {
      title(ctx, 'Chance the whole chain is right', col);
      const { X, Y } = axes(ctx, w, h, col, { x: [0, NMAX], y: [0, 100], t: 30, l: 44, xt: [0, 10, 20, 30, 40], yt: [0, 25, 50, 75, 100], xlabel: 'steps in the chain', fy: (v) => v + '%' });
      const curve = (p, c, wd = 2.5) => line(ctx, Array.from({ length: 81 }, (_, i) => { const n = (NMAX * i) / 80; return [X(n), Y(100 * p ** n)]; }), c, wd);
      curve(0.98, col.s[0]);
      if (s.step >= 3) curve(0.95, col.s[1]);
      if (s.step >= 4) curve(0.998, col.s[2]);
      const a = MARK[s.prev] ?? MARK[0], b = MARK[s.step];
      const n = a.p === b.p ? a.n + (b.n - a.n) * s.e : b.n;
      const v = 100 * b.p ** n;
      dot(ctx, X(n), Y(v), 6, [col.s[0], col.s[0], col.s[0], col.s[1], col.s[2]][s.step]);
      text(ctx, `${(b.p * 100).toFixed(1).replace(/\.0$/, '')}% per step, ${Math.round(n)} steps: ${Math.round(v)}%`, X(n) + (n > 24 ? -10 : 10), Y(v) - 14, { color: col.ink, size: 12, weight: 700, align: n > 24 ? 'right' : 'left', halo: col.panel });
    },
  });
}
