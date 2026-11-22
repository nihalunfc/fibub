// 7.2 A sponsored products auction for the search "cola": four bids, the predicted click rate of each ad,
// the ranking score bid × CTR, and the second-price rule (the winner pays just enough to beat the runner-up).
import { canvas, text, title, line } from '../../kit.js';

const B = [['Brand A', 1.2, 2], ['Brand B', 0.8, 4], ['Brand C', 1.5, 1.5], ['Brand D', 0.6, 3]];
const NAMES = ['Four brands bid per click on "cola"', 'The ad server predicts each click rate', 'Rank by score = bid × CTR', 'The winner pays the second price'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 250, label: 'Bars for four bids, click rates and auction scores' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[s], col) + 12;
    const L = 74, R = w - 70, rowH = (h - top - 34) / 4;
    const val = (b) => (s === 0 ? b[1] : s === 1 ? b[2] : b[1] * b[2]);
    const max = s === 0 ? 1.6 : s === 1 ? 4.5 : 4.8;
    const sc = B.map((b) => b[1] * b[2]), order = sc.map((v, i) => i).sort((a, b) => sc[b] - sc[a]), win = order[0], second = order[1];
    B.forEach((b, i) => {
      const y = top + i * rowH, bw = (R - L) * val(b) / max, isWin = s >= 2 && i === win;
      text(ctx, b[0], 8, y + rowH / 2, { color: col.ink, size: 12, weight: isWin ? 700 : 400 });
      ctx.fillStyle = s === 0 ? col.s[0] : s === 1 ? col.s[1] : isWin ? col.s[2] : col.muted;
      ctx.fillRect(L, y + rowH * 0.2, bw, rowH * 0.6);
      const lab = s === 0 ? `$${b[1].toFixed(2)}` : s === 1 ? `${b[2]}%` : `${b[1].toFixed(2)} × ${b[2]} = ${(b[1] * b[2]).toFixed(2)}`;
      text(ctx, lab, L + bw + 6, y + rowH / 2, { color: col.ink, size: 11.5, weight: isWin ? 700 : 400 });
      if (s >= 2) text(ctx, `#${order.indexOf(i) + 1}`, 8, y + rowH / 2 + 14, { color: col.muted, size: 10 });
    });
    if (s === 3) {
      const x = L + (R - L) * sc[second] / max;
      line(ctx, [[x, top], [x, top + 4 * rowH]], col.s[3], 2, [5, 4]);
      const price = sc[second] / B[win][2] + 0.01;
      text(ctx, `${B[win][0]} pays ${sc[second].toFixed(2)} ÷ ${B[win][2]} + 0.01 = $${price.toFixed(2)} per click (bid $${B[win][1].toFixed(2)})`, 8, h - 12, { color: col.ink, size: 11.5, weight: 700 });
    } else {
      text(ctx, s === 0 ? 'Highest bid: Brand C' : s === 1 ? 'Shoppers click Brand B most' : `Winner: ${B[win][0]}, though it bid less`, 8, h - 12, { color: col.muted, size: 11.5 });
    }
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
