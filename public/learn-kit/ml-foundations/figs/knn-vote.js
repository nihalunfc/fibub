// 4.7 k-nearest neighbours by hand: five labelled points and a new one at (3, 3). Step through: measure every
// distance, keep the 3 nearest, let them vote.
import { canvas, text, line, dot, axes, title } from '../../kit.js';

const P = [[1, 1, 'A'], [2, 2, 'A'], [4, 4, 'B'], [5, 4, 'B'], [5, 5, 'B']];
const Q = [3, 3];
const D = P.map(([x, y]) => Math.hypot(x - Q[0], y - Q[1]));
const NEAR = D.map((d, i) => i).sort((a, b) => D[a] - D[b] || a - b).slice(0, 3);
export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 260, label: 'Five labelled points, a new point and its three nearest neighbours' });
  let step = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['A new point arrives', 'Measure every distance', 'Keep the 3 nearest', 'They vote: B wins 2 to 1'][step], col);
    const a = axes(ctx, w, h, col, { t: top + 8, l: 34, x: [0, 6], y: [0, 6], xt: [0, 2, 4, 6], yt: [0, 2, 4, 6], fx: String, fy: String });
    const cA = col.s[0], cB = col.s[1];
    if (step >= 2) {
      const r = a.X(D[NEAR[2]]) - a.X(0);
      ctx.save(); ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(a.X(Q[0]), a.Y(Q[1]), r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
    P.forEach(([x, y, c], i) => {
      const near = NEAR.includes(i);
      if (step >= 1) {
        const faint = step >= 2 && !near;
        line(ctx, [[a.X(Q[0]), a.Y(Q[1])], [a.X(x), a.Y(y)]], faint ? col.line : col.muted, faint ? 1 : 1.5, [3, 3]);
        text(ctx, `(${x}, ${y}) ${c}: ${D[i].toFixed(2)}`, a.L + 8, a.T + 10 + i * 15, { color: faint ? col.muted : col.ink, size: 11, weight: near && step >= 2 ? 700 : 400, halo: col.panel });
      }
    });
    P.forEach(([x, y, c], i) => {
      const dim = step >= 2 && !NEAR.includes(i);
      ctx.save(); if (dim) ctx.globalAlpha = 0.35;
      dot(ctx, a.X(x), a.Y(y), 10, c === 'A' ? cA : cB);
      text(ctx, c, a.X(x), a.Y(y) + 0.5, { color: '#fff', size: 11, weight: 700, align: 'center' });
      ctx.restore();
    });
    dot(ctx, a.X(Q[0]), a.Y(Q[1]), 10, step === 3 ? cB : col.panel, col.ink);
    text(ctx, step === 3 ? 'B' : '?', a.X(Q[0]), a.Y(Q[1]) + 0.5, { color: step === 3 ? '#fff' : col.ink, size: 11, weight: 700, align: 'center' });
    if (step === 3) text(ctx, 'votes: A 1, B 2', a.R - 4, a.B - 14, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { step = Math.min(3, i); cv.redraw(); } };
}
