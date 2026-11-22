// Class 9 Linear Polynomials: ax + b as a number machine. The input x is multiplied by a, then b is added, and out comes p(x).
// The dot below sits at (x, p(x)): all such dots lie on one straight line, which is why ax + b is called linear.
import { canvas, text, title, row, slider, readout, dot, line, arrow } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(+v.toFixed(2)).replace('-', '−');
const lin = (a, b) => { let s = a === 0 ? '' : a === 1 ? 'x' : a === -1 ? '−x' : num(a) + 'x'; if (b !== 0 || a === 0) s += s ? (b < 0 ? ' − ' : ' + ') + num(Math.abs(b)) : num(b); return s; };
export default function (host) {
  let a = 2, b = 1, x = 2;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A number machine for a x plus b with its input, the two operations, the output and the matching point on a straight line' });
  const ctl = row(host);
  slider(ctl, { label: 'a (times)', min: -3, max: 3, step: 1, value: a, fmt: num, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'b (add)', min: -3, max: 3, step: 1, value: b, fmt: num, oninput: (v) => { b = v; upd(); } });
  slider(ctl, { label: 'Input x', min: -3, max: 3, step: 1, value: x, fmt: num, oninput: (v) => { x = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'p(x) = ' + lin(a, b), col), y = a * x + b, mid = a * x;
    const bw = Math.min(70, (w - 60) / 4), by = t + 12, bh = 38, xs = [8, 8 + (w - 16) / 4, 8 + (w - 16) / 2, 8 + 3 * (w - 16) / 4];
    const boxes = [['input', num(x), col.s[2]], ['× ' + num(a), num(mid), col.s[0]], ['+ ' + num(b).replace(/^(?!−)/, ''), num(y), col.s[5]], ['output', num(y), col.s[3]]];
    const lab = ['x = ' + num(x), '× ' + num(a), b < 0 ? '− ' + num(-b) : '+ ' + num(b), 'p = ' + num(y)];
    xs.forEach((X, i) => {
      ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = boxes[i][2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(X, by, bw, bh, 8); ctx.fill(); ctx.stroke(); ctx.restore();
      text(ctx, lab[i], X + bw / 2, by + bh / 2, { color: col.ink, size: 12, weight: 700, align: 'center' });
      if (i < 3) arrow(ctx, X + bw + 2, by + bh / 2, xs[i + 1] - 2, by + bh / 2, col.muted, 2, 7);
    });
    const g = plane(ctx, w, h, col, { top: by + bh + 8, x0: -4, x1: 4, y0: -9, y1: 9 });
    ctx.save(); ctx.beginPath(); ctx.rect(g.X(-4), g.Y(9), 8 * g.s, 18 * g.s); ctx.clip(); line(ctx, [[g.X(-4), g.Y(-4 * a + b)], [g.X(4), g.Y(4 * a + b)]], col.s[0], 3); ctx.restore();
    const cy = Math.max(-9, Math.min(9, y));
    dot(ctx, g.X(x), g.Y(cy), 7, col.s[3], col.ink);
    if (Math.abs(y) <= 8.5) text(ctx, '(' + num(x) + ', ' + num(y) + ')', g.X(x) + (x > 1 ? -9 : 9), g.Y(cy) - 12, { color: col.ink, size: 11, weight: 700, align: x > 1 ? 'right' : 'left', halo: col.panel });
  };
  function upd() { const y = a * x + b; out.innerHTML = `Put in <b>x = ${num(x)}</b>: ${num(a)} × (${num(x)}) = ${num(a * x)}, then ${b < 0 ? 'subtract ' + num(-b) : 'add ' + num(b)}: output <b>p(${num(x)}) = ${num(y)}</b>. Slide x and the dot walks along a straight line; slide a to tilt the line, b to lift it.`; cv.redraw(); }
  upd();
}
