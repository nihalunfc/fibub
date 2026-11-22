// Class 9 Science, Chapter 1 (step player): the scientific method as a loop. Observe, ask a question, make a testable
// guess (hypothesis), run a fair test (change one thing, keep the rest the same), analyse the numbers, conclude and
// repeat. The running example is a pendulum: does a longer string make it swing slower? A small pendulum swings
// in the box, and its string length changes with the step (T = 2π√(L/g)).
import { canvas, text, title, line, dot, arrow, loop, font } from '../../kit.js';

const NAMES = ['Observe', 'Ask', 'Guess', 'Test', 'Analyse', 'Conclude'];
const EX = [
  'You notice that a swing with long chains seems to take longer for each to-and-fro than a short one.',
  'Question: does the length of a pendulum change the time it takes for one swing?',
  'Hypothesis: a longer string means a longer time for one swing. It can be proved wrong by a test.',
  'Fair test: change only the length (25, 50, 100 cm). Keep the bob, the angle and the timer the same.',
  'Time 20 swings for each length, divide by 20, then plot time against length and look at the pattern.',
  'Longer string, longer time: but not in proportion (4 times the length gives 2 times the time). Test again, ask a new question.',
];

export default function (host) {
  let step = 0, ph = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'The scientific method drawn as a loop of six boxes with a swinging pendulum as the example' });
  loop(host, (dt) => { ph += dt * 3; cv.redraw(); });
  const wrap = (ctx, s, mw) => { ctx.font = font(12); const out = []; let a = ''; for (const wd of s.split(' ')) { const t = a ? a + ' ' + wd : wd; if (ctx.measureText(t).width > mw && a) { out.push(a); a = wd; } else a = t; } out.push(a); return out; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Science is a loop, not a straight line', col) + 8;
    const bw = (w - 44) / 3, bh = 34, xs = [0, 1, 2].map((i) => 12 + i * (bw + 10));
    const pos = [[xs[0], top], [xs[1], top], [xs[2], top], [xs[2], top + 58], [xs[1], top + 58], [xs[0], top + 58]];
    for (let i = 0; i < 5; i++) { const [x0, y0] = pos[i], [x1, y1] = pos[i + 1]; if (y0 === y1) { const d = x1 > x0 ? 1 : -1; arrow(ctx, x0 + (d > 0 ? bw : 0), y0 + bh / 2, x1 + (d > 0 ? 0 : bw), y1 + bh / 2, col.muted, 1.5, 6); } else arrow(ctx, x0 + bw / 2, y0 + bh, x1 + bw / 2, y1, col.muted, 1.5, 6); }
    line(ctx, [[pos[5][0] + bw / 2, pos[5][1] + bh], [pos[5][0] + bw / 2, pos[5][1] + bh + 8], [pos[0][0] - 6, pos[5][1] + bh + 8], [pos[0][0] - 6, pos[0][1] + bh / 2]], col.s[2], 1.5, [4, 3]);
    arrow(ctx, pos[0][0] - 6, pos[0][1] + bh / 2 + 1, pos[0][0], pos[0][1] + bh / 2, col.s[2], 1.5, 6);
    pos.forEach(([x, y], i) => {
      const on = i === step;
      ctx.fillStyle = on ? col.s[0] : col.panel; ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = on ? 2.5 : 1.5;
      ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 6); ctx.fill(); ctx.stroke();
      text(ctx, NAMES[i], x + bw / 2, y + bh / 2, { color: on ? '#fff' : col.ink, size: 12.5, weight: 700, align: 'center' });
    });
    text(ctx, 'repeat with a new question', pos[2][0] + bw, pos[5][1] + bh + 20, { color: col.s[2], size: 10.5, align: 'right' });
    // example text
    const y0 = top + 128, lines = wrap(ctx, EX[step], w - 150);
    lines.forEach((l, i) => text(ctx, l, 12, y0 + 10 + i * 16, { color: col.ink, size: 12 }));
    // pendulum
    const L = [0.5, 0.5, 0.7, [0.4, 0.6, 0.9][Math.floor(ph / 4) % 3], 0.8, 0.8][step], px = w - 62, py = y0 - 2, len = 12 + L * Math.min(70, h - y0 - 28);
    const a = 0.5 * Math.cos(ph * 1.6 / Math.sqrt(L * 2));
    const bx = px + len * Math.sin(a), by = py + len * Math.cos(a);
    line(ctx, [[px - 22, py], [px + 22, py]], col.muted, 3); line(ctx, [[px, py], [bx, by]], col.ink, 1.5); dot(ctx, bx, by, 7, col.s[1]);
    if (step === 3) text(ctx, 'L changes', px, h - 12, { color: col.s[1], size: 10.5, align: 'center', weight: 700 });
  };
  cv.redraw();
  return { step(i, n) { step = Math.min(i, 5); ph = 0; cv.redraw(); } };
}
