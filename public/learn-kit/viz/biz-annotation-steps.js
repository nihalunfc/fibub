// Annotation, one layer at a time: start with the default chart and add a message title, direct labels, the event marker, a
// highlighted gap and a one-line takeaway. Each step adds one thing and removes nothing the reader needs. Made-up weekly
// sales with a promotion in week 9.
import { canvas, axes, line, dot, text, title, readout } from '../kit.js';
import { wob } from './_biz.js';

const LY = Array.from({ length: 16 }, (_, i) => Math.round(98 + i * 0.8 + 5 * wob(i, 3.3)));
const W = LY.map((v, i) => Math.round(v + (i >= 8 ? Math.min(22, (i - 7) * 8) : 0) + 2 * wob(i, 5)));
const SAY = ['The default chart: a vague title, a legend, gridlines. What is the point?', 'Step 1: the title states the finding, in words.', 'Step 2: label the lines directly and delete the legend, so no eye trip is needed.', 'Step 3: mark the event. Now "why did it jump?" has an answer on the chart.', 'Step 4: draw the eye to the gap between this year and last, and say how big it is.'];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.74, max: 400, min: 310, label: 'A line chart gaining annotations step by step' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, k >= 1 ? 'The May promotion lifted weekly sales by about a fifth' : 'Sales by week', col);
    const a = axes(ctx, w, h, col, { t: k >= 1 ? 40 : 34, x: [1, 16], y: [60, 150], xlabel: 'Week', l: 40, grid: k < 2, xt: [1, 4, 8, 12, 16] });
    if (k >= 4) { ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); W.forEach((v, i) => (i ? ctx.lineTo(a.X(i + 1), a.Y(v)) : ctx.moveTo(a.X(1), a.Y(v)))); for (let i = 15; i >= 0; i--) ctx.lineTo(a.X(i + 1), a.Y(LY[i])); ctx.fill(); ctx.globalAlpha = 1; }
    line(ctx, LY.map((v, i) => [a.X(i + 1), a.Y(v)]), col.muted, 2);
    line(ctx, W.map((v, i) => [a.X(i + 1), a.Y(v)]), col.s[0], 3);
    if (k < 2) { [['This year', col.s[0]], ['Last year', col.muted]].forEach(([n, c], i) => { ctx.fillStyle = c; ctx.fillRect(a.L + 10 + i * 90, a.B - 22, 10, 10); text(ctx, n, a.L + 24 + i * 90, a.B - 17, { color: col.ink, size: 10.5, fit: false }); }); }
    else { text(ctx, 'This year', a.R - 2, a.Y(W[15]) - 12, { color: col.s[0], size: 11, weight: 800, align: 'right', fit: false }); text(ctx, 'Last year', a.R - 2, a.Y(LY[15]) + 12, { color: col.muted, size: 11, align: 'right', fit: false }); }
    if (k >= 3) { line(ctx, [[a.X(9), a.T], [a.X(9), a.B]], col.warn, 1.5, [4, 3]); text(ctx, 'Promotion starts', a.X(9) - 4, a.T + 9, { color: col.warn, size: 10.5, weight: 800, align: 'right', halo: col.panel }); dot(ctx, a.X(9), a.Y(W[8]), 4, col.warn); }
    if (k >= 4) { const g = Math.round(W[15] - LY[15]); text(ctx, `+${g} a week`, a.X(13), (a.Y(W[13]) + a.Y(LY[13])) / 2, { color: col.s[0], size: 12, weight: 800, align: 'center', halo: col.panel, fit: false }); }
  };
  const show = () => { out.textContent = SAY[k]; cv.redraw(); };
  show();
  return { step(i) { k = Math.max(0, Math.min(4, i)); show(); } };
}
