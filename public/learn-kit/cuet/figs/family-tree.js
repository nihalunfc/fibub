// 4.4 Building a family tree one clue at a time (driven by the step player). Squares are men, circles women;
// a double line is a marriage, a vertical line goes down a generation.
import { canvas, text } from '../../kit.js';

// Clues: "Arjun is Meena's husband. Ravi is Arjun's son. Priya is Ravi's sister. Kiran is Priya's son. How is Kiran related to Meena?"
const P = { Arjun: [0.32, 0.2, 'm'], Meena: [0.62, 0.2, 'f'], Ravi: [0.32, 0.5, 'm'], Priya: [0.62, 0.5, 'f'], Kiran: [0.62, 0.8, 'm'] };
const SHOW = [['Arjun', 'Meena'], ['Arjun', 'Meena', 'Ravi'], ['Arjun', 'Meena', 'Ravi', 'Priya'], ['Arjun', 'Meena', 'Ravi', 'Priya', 'Kiran'], ['Arjun', 'Meena', 'Ravi', 'Priya', 'Kiran']];
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 330, min: 230, label: 'A family tree built clue by clue' });
  let i = 0;
  cv.draw = (ctx, w, h, col) => {
    const on = new Set(SHOW[i]), at = (n) => [P[n][0] * w, P[n][1] * h];
    const ln = (a, b) => { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); };
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
    if (on.has('Meena')) { const [a, b] = [at('Arjun'), at('Meena')]; ln([a[0] + 14, a[1] - 3], [b[0] - 14, b[1] - 3]); ln([a[0] + 14, a[1] + 3], [b[0] - 14, b[1] + 3]); }
    const mid = [(P.Arjun[0] + P.Meena[0]) / 2 * w, P.Arjun[1] * h];
    if (on.has('Ravi')) { ln(mid, [mid[0], 0.36 * h]); ln([at('Ravi')[0], 0.36 * h], [on.has('Priya') ? at('Priya')[0] : mid[0], 0.36 * h]); ln([at('Ravi')[0], 0.36 * h], [at('Ravi')[0], at('Ravi')[1] - 14]); }
    if (on.has('Priya')) ln([at('Priya')[0], 0.36 * h], [at('Priya')[0], at('Priya')[1] - 14]);
    if (on.has('Kiran')) ln([at('Priya')[0], at('Priya')[1] + 14], [at('Kiran')[0], at('Kiran')[1] - 14]);
    for (const n of on) {
      const [x, y] = at(n), hi = i === 4 && (n === 'Kiran' || n === 'Meena');
      ctx.fillStyle = hi ? col.s[2] : P[n][2] === 'm' ? col.s[0] : col.s[3];
      ctx.beginPath(); P[n][2] === 'm' ? ctx.rect(x - 13, y - 13, 26, 26) : ctx.arc(x, y, 14, 0, 7); ctx.fill();
      text(ctx, n, x + 20, y, { color: col.ink, size: 12, weight: 600 });
    }
    if (i === 4) text(ctx, 'Kiran is Meena\'s grandson (daughter\'s son)', w / 2, h - 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, '■ man  ● woman  = married', 10, 12, { color: col.muted, size: 11 });
  };
  cv.redraw();
  return { step(k) { i = Math.min(k, SHOW.length - 1); cv.redraw(); } };
}
