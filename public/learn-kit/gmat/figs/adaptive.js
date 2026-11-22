// 1.2 How a computer-adaptive section works: answer right and the next question is harder, wrong and it is
// easier. The line is the test's running estimate of your level. A teaching picture, not GMAC's real algorithm.
import { canvas, axes, line, dot, text, row, button, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Question difficulty rising after right answers and falling after wrong ones' });
  let path = [0];
  const ctl = row(host);
  const step = (ok) => { if (path.length > 20) return; const n = path.length, last = path[n - 1]; path.push(Math.max(-3, Math.min(3, last + (ok ? 1 : -1) * 1.6 / Math.sqrt(n)))); cv.redraw(); say(); };
  button(ctl, '✓ Answer right', () => step(true), 'lk-primary');
  button(ctl, '✗ Answer wrong', () => step(false));
  button(ctl, '↻ Start again', () => { path = [0]; cv.redraw(); say(); });
  const out = readout(host);
  const say = () => { const n = path.length - 1, v = path[n]; out.innerHTML = n === 0 ? 'Press a button to answer the first question (medium difficulty).' : `After ${n} question${n > 1 ? 's' : ''} the estimate is <b>${v > 1 ? 'high' : v > 0.3 ? 'above middle' : v > -0.3 ? 'middle' : v > -1 ? 'below middle' : 'low'}</b>. Notice how each answer moves it less than the one before: early questions shape your score the most, but every question counts.`; };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 21], y: [-3, 3], xlabel: 'Question number', ylabel: 'Difficulty', fy: (v) => (v === 3 ? 'hard' : v === -3 ? 'easy' : v === 0 ? 'medium' : '') , yt: [-3, 0, 3] });
    line(ctx, path.map((v, i) => [X(i + 1), Y(v)]), col.s[0], 2.5);
    path.forEach((v, i) => dot(ctx, X(i + 1), Y(v), 4, i && path[i] > path[i - 1] ? col.s[2] : i ? col.s[1] : col.ink));
    title(ctx, 'Each answer sets the difficulty of the next question', col);
  };
  cv.redraw(); say();
}
