// 6.1 Point-in-time correctness on a timeline: a member's purchases, an as-of date, the 30 days before it
// (allowed), the days after it (the future, which a careless join leaks in), and a second training row.
import { canvas, axes, text, title, line, dot } from '../../kit.js';

// purchase days, counted from Oct 1 = 0 (Nov 1 = 31)
const BUY = [3, 9, 22, 30, 36, 41, 44, 49, 53, 57];
const ASOF = [46, 46, 46, 46, 53];
const NAMES = ['One member\'s purchases over two months', 'Training row: as of Nov 16', 'Count only the 30 days before', 'A careless join leaks the future', 'Next week\'s row slides the window'];
const lab = (d) => (d < 31 ? `Oct ${d + 1}` : `Nov ${d - 30}`);

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Timeline of purchases with an as-of date and a 30-day feature window' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[s], col);
    const A = axes(ctx, w, h, col, { x: [0, 61], y: [0, 1], xt: [0, 31, 61], fx: (v) => lab(Math.min(60, v)), yt: [], xlabel: 'date', l: 16, r: 18, t: top + 16, grid: false });
    const y = (A.T + A.B) / 2 + 8, a = ASOF[s];
    line(ctx, [[A.L, y], [A.R, y]], col.line, 2);
    if (s >= 1) {
      if (s >= 2) {
        ctx.fillStyle = col.soft; ctx.fillRect(A.X(a - 30), A.T + 18, A.X(a) - A.X(a - 30), A.B - A.T - 22);
        text(ctx, '30 days before', (A.X(a - 30) + A.X(a)) / 2, A.T + 28, { color: col.s[0], size: 11, weight: 700, align: 'center' });
      }
      if (s === 3) {
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.bad; ctx.fillRect(A.X(a), A.T + 18, A.R - A.X(a), A.B - A.T - 22); ctx.restore();
        text(ctx, 'the future', (A.X(a) + A.R) / 2, A.T + 28, { color: col.bad, size: 11, weight: 700, align: 'center' });
      }
      line(ctx, [[A.X(a), A.T + 12], [A.X(a), A.B]], col.ink, 2, [5, 4]);
      text(ctx, `as of ${lab(a)}`, A.X(a), A.T + 4, { color: col.ink, size: 11, weight: 700, align: 'center' });
    }
    let good = 0, leak = 0;
    for (const d of BUY) {
      const inWin = s >= 2 && d < a && d >= a - 30, future = s === 3 && d >= a && d >= 31;
      if (inWin) good++; if (future) leak++;
      dot(ctx, A.X(d), y, 6, inWin ? col.s[0] : future ? col.bad : col.muted);
    }
    const msg = s === 0 ? `${BUY.length} purchases` : s === 1 ? 'Features may use only what was known on this date' : s === 3 ? `"buys in November" = ${BUY.filter((d) => d >= 31).length}: ${leak} of them had not happened yet` : `buys_30d = ${good}`;
    text(ctx, msg, A.L, A.B - 12, { color: s === 3 ? col.bad : col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
