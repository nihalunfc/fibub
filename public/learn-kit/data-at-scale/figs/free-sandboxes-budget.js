// 8.4 Why a budget alert comes first: spend across a month of practice on trial credit, with alerts at 50%, 90%
// and 100% of a small budget, a forgotten cluster that keeps billing, and the flat line after it is deleted.
// The numbers are made up for the picture; real prices are on the provider's price list.
import { canvas, axes, text, title, line, dot } from '../../kit.js';

const BUDGET = 25;
// cumulative spend by day: a few small runs, then a cluster left on from day 12 to day 18
const SPEND = (() => { const out = []; let v = 0; for (let d = 0; d <= 30; d++) { v += d < 12 ? (d % 3 === 0 ? 1 : 0.2) : d < 19 ? 2.5 : 0.05; out.push(+v.toFixed(2)); } return out; })();
const UPTO = [0, 11, 18, 20, 30];
const NAMES = ['Set a small budget first: $25 (example)', 'Small practice runs: well under budget', 'A cluster left running: the 50% and 90% alerts fire', 'Cluster deleted on day 18: spend flattens', 'The month ends under control'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.58, max: 330, min: 240, label: 'Cumulative cloud spend over a month with budget alert lines' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[s], col);
    const A = axes(ctx, w, h, col, { x: [0, 30], y: [0, 32], xlabel: 'day of the month', ylabel: 'spend so far ($)', t: top + 10, l: 46 });
    [[0.5, '50%'], [0.9, '90%'], [1, 'budget']].forEach(([f, lab]) => {
      line(ctx, [[A.L, A.Y(BUDGET * f)], [A.R, A.Y(BUDGET * f)]], f === 1 ? col.bad : col.warn || col.s[3], 1.5, [5, 4]);
      text(ctx, lab, A.R - 2, A.Y(BUDGET * f) - 8, { color: f === 1 ? col.bad : col.muted, size: 10.5, align: 'right' });
    });
    const n = UPTO[s];
    if (n > 0) line(ctx, SPEND.slice(0, n + 1).map((v, d) => [A.X(d), A.Y(v)]), col.s[0], 2.5);
    dot(ctx, A.X(n), A.Y(SPEND[n]), 5, col.s[0]);
    if (s >= 2) {
      [0.5, 0.9].forEach((f) => {
        const d = SPEND.findIndex((v) => v >= BUDGET * f);
        if (d >= 0 && d <= n) { dot(ctx, A.X(d), A.Y(SPEND[d]), 6, col.panel, col.bad); text(ctx, `alert day ${d}`, A.X(d) + 9, A.Y(SPEND[d]) + 12, { color: col.bad, size: 10.5, weight: 700 }); }
      });
    }
    text(ctx, `$${SPEND[n].toFixed(2)} spent by day ${n}`, A.R - 4, A.B - 12, { color: col.ink, size: 11.5, weight: 700, align: 'right' });
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
