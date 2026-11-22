// Class 9 Probability (step player): turning a table of data into probabilities. 40 students were asked how they
// come to school: walk 12, cycle 8, bus 14, car 6. Experimental probability of a way = frequency / total number asked.
import { canvas, text, title } from '../../kit.js';
import { note } from './c9-prob-lib.js';

const D = [['Walk', 12], ['Cycle', 8], ['Bus', 14], ['Car', 6]];
const N = ['We asked 40 students how they travel to school. The table gives the frequency: how many chose each way.', 'The total number of students asked is 12 + 8 + 14 + 6 = 40. This is the number of trials.', 'Experimental probability of an event = frequency of the event ÷ total trials. P(walk) = 12 ÷ 40 = 0.30.', 'Do it for every row: 0.30, 0.20, 0.35 and 0.15.', 'Add the probabilities: 0.30 + 0.20 + 0.35 + 0.15 = 1. The probabilities of all the outcomes always add up to 1.', 'Events can join rows: P(bus or car) = (14 + 6) ÷ 40 = 20 ÷ 40 = 0.5. Half the students use a motor vehicle.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A table of how 40 students travel to school turned into probabilities step by step' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'From a table to probabilities', col), L = 14, W = w - 28, cw = [W * 0.3, W * 0.22, W * 0.48], rh = Math.min(32, (h - top - 80) / 6), y0 = top + 12;
    const cx = (j) => L + cw.slice(0, j).reduce((a, b) => a + b, 0) + cw[j] / 2;
    ['Way', 'Frequency', 'Probability'].forEach((t, j) => { if (j < 2 || s >= 2) text(ctx, t, cx(j), y0 + rh / 2, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    D.forEach(([nm, f], i) => {
      const y = y0 + rh * (i + 1.5), hl = (s === 2 && i === 0) || (s === 5 && i >= 2);
      if (hl) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.3; ctx.fillRect(L, y - rh / 2, W, rh); ctx.globalAlpha = 1; }
      text(ctx, nm, cx(0), y, { color: col.ink, size: 12, align: 'center' }); text(ctx, String(f), cx(1), y, { color: col.ink, size: 12, align: 'center' });
      if (s >= 2) { const show = s === 2 ? i === 0 : true; if (show) text(ctx, s >= 3 || i === 0 ? f + '/40 = ' + (f / 40).toFixed(2) : '', cx(2), y, { color: col.s[0], size: 12, weight: 700, align: 'center' }); }
    });
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; [0, 1, 5].forEach((i) => { ctx.beginPath(); ctx.moveTo(L, y0 + i * rh); ctx.lineTo(L + W, y0 + i * rh); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(L, y0 + 5 * rh); ctx.lineTo(L + W, y0 + 5 * rh); ctx.stroke();
    if (s >= 1) { text(ctx, 'Total', cx(0), y0 + rh * 5.5, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, '40', cx(1), y0 + rh * 5.5, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    if (s >= 4) text(ctx, '1.00', cx(2), y0 + rh * 5.5, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
