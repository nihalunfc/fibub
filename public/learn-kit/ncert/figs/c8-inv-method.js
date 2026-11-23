// Class 8 Science, Investigating (step player): the cycle of an investigation, shown with one example question:
// "Does salt dissolve faster in hot water than in cold water?" Question, hypothesis, fair test, record, conclusion.
import { canvas, text, title, line, arrow, dot } from '../../kit.js';

const NAMES = ['Ask', 'Guess', 'Test', 'Record', 'Conclude'];
const CAP = [
  'Ask a question you can test: does salt dissolve faster in hot water than in cold?',
  'Make a hypothesis, a guess you can check: salt dissolves faster in hot water.',
  'Plan a fair test: same salt, same water, same stirring. Change only the temperature.',
  'Record what you measure: cold 40 s, hot 15 s. Repeat three times and write every reading.',
  'Conclude from the data: hot water dissolved it faster. Share it so others can repeat the test.',
];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Five boxes in a row showing the steps of an investigation' });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'How an investigation goes', col);
    const n = 5, bw = (w - 20) / n, y = 70;
    NAMES.forEach((nm, i) => {
      const x = 10 + i * bw + bw / 2, on = i === k, done = i < k;
      ctx.fillStyle = on ? col.s[2] : done ? col.soft : col.panel; ctx.strokeStyle = on ? col.s[2] : col.line; ctx.lineWidth = on ? 2.5 : 1.5;
      ctx.beginPath(); ctx.arc(x, y, Math.min(24, bw * 0.4), 0, 7); ctx.fill(); ctx.stroke();
      text(ctx, String(i + 1), x, y, { color: on ? '#fff' : done ? col.ink : col.muted, size: 15, weight: 700, align: 'center' });
      text(ctx, nm, x, y + 36, { color: on ? col.ink : col.muted, size: 10.5, weight: on ? 700 : 400, align: 'center' });
      if (i < n - 1) line(ctx, [[x + Math.min(24, bw * 0.4) + 2, y], [x + bw - Math.min(24, bw * 0.4) - 2, y]], col.line, 2);
    });
    // scene
    const sy = h * 0.58;
    const beaker = (x, hot, level, salt) => {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x - 24, sy - 30, 48, 60);
      ctx.fillStyle = hot ? col.s[1] : col.s[3]; ctx.globalAlpha = 0.35; ctx.fillRect(x - 23, sy + 30 - level, 46, level); ctx.globalAlpha = 1;
      if (salt) for (let j = 0; j < salt; j++) dot(ctx, x - 12 + (j % 4) * 8, sy + 24 - Math.floor(j / 4) * 6, 2.5, col.ink);
    };
    const cx = w / 2;
    if (k === 0) text(ctx, '?', cx, sy, { color: col.s[2], size: 54, weight: 700, align: 'center' });
    if (k === 1) { beaker(cx - 50, false, 40, 0); beaker(cx + 50, true, 40, 0); text(ctx, 'hot > cold ?', cx, sy - 48, { color: col.s[2], size: 13, weight: 700, align: 'center' }); }
    if (k >= 2 && k <= 3) { beaker(cx - 50, false, 40, 8); beaker(cx + 50, true, 40, 8); text(ctx, 'cold', cx - 50, sy + 48, { color: col.s[3], size: 11, align: 'center' }); text(ctx, 'hot', cx + 50, sy + 48, { color: col.s[1], size: 11, align: 'center' }); }
    if (k === 3) { text(ctx, '40 s', cx - 50, sy - 42, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, '15 s', cx + 50, sy - 42, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    if (k === 4) { beaker(cx - 50, false, 40, 3); beaker(cx + 50, true, 40, 0); text(ctx, 'Hot water: faster', cx, sy - 48, { color: col.good, size: 13, weight: 700, align: 'center' }); }
    // caption
    ctx.font = '400 11px system-ui'; const L = []; let cur = '';
    CAP[k].split(' ').forEach((wd) => { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > w - 24) { L.push(cur); cur = wd; } else cur = t; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 12 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { k = Math.min(Math.max(0, i), 4); cv.redraw(); } };
}
