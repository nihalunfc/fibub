// Class 10 Probability (step player): a bag holds 3 red, 5 blue and 2 green marbles. One is picked without looking, so all
// 10 marbles are equally likely. P(green) = 2/10 = 1/5. The complement, not green, is 8/10 = 4/5, and 1/5 + 4/5 = 1.
// "Red or green" has 3 + 2 = 5 favourable marbles, so 5/10 = 1/2.
import { canvas, text, title } from '../../kit.js';

const M = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2];
const CAP = ['A bag: 3 red, 5 blue, 2 green marbles. One is picked at random', 'Total possible outcomes: all 10 marbles (each equally likely)', 'Favourable outcomes for green: 2 marbles', 'P(green) = favourable ÷ total = 2/10 = 1/5', 'The complement, not green: 3 + 5 = 8 marbles, P = 8/10 = 4/5 (and 1/5 + 4/5 = 1)', 'P(red or green) = (3 + 2)/10 = 1/2'];
export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.64, max: 440, min: 290, label: 'A bag of ten marbles: three red, five blue, two green, with the favourable ones highlighted' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Picking a marble from the bag', col), bw = Math.min(w - 40, 320), bx = (w - bw) / 2, by = top + 8, bh = h * 0.42, r = Math.min(bw / 12, bh / 6);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 14); ctx.stroke();
    M.forEach((c, i) => {
      const x = bx + bw * (0.12 + 0.19 * (i % 5)) + r * 0.4, y = by + bh * (0.3 + 0.42 * Math.floor(i / 5));
      const fav = step === 2 || step === 3 ? c === 2 : step === 4 ? c !== 2 : step === 5 ? c !== 1 : step === 1 ? true : false;
      ctx.globalAlpha = step >= 1 && !fav ? 0.25 : 1;
      ctx.fillStyle = col.s[[1, 0, 2][c]]; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      if (step >= 1 && fav && step !== 1) { ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.globalAlpha = 1;
    });
    const ly = by + bh + 22;
    text(ctx, 'red = 3     blue = 5     green = 2', w / 2, ly, { color: col.muted, size: 11.5, align: 'center' });
    const big = [null, 'total = 10', 'favourable = 2', 'P(green) = 2/10 = 1/5', 'P(not green) = 8/10 = 4/5', 'P(red or green) = 5/10 = 1/2'][step];
    if (big) text(ctx, big, w / 2, ly + 28, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); cv.redraw(); } };
}
