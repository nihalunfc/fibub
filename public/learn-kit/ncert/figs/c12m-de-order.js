// Class 12 Maths, Differential Equations: order and degree. The order is the highest derivative that appears; the
// degree is the power of that highest derivative once the equation is a polynomial in its derivatives (no roots or
// fractions of derivatives). Pick an equation: the highest derivative is circled and the order and degree are read off.
import { canvas, row, button, readout, text, title } from '../../kit.js';

const EQ = [
  { s: ['dy/dx + y = x', ''], hi: 0, o: 1, d: 1, why: 'The highest derivative is dy/dx, to the power 1.' },
  { s: ['d²y/dx² + 3 dy/dx + 2y = 0', ''], hi: 0, o: 2, d: 1, why: 'The highest derivative is d²y/dx² (order 2), to the power 1.' },
  { s: ['(dy/dx)² + y = x', ''], hi: 0, o: 1, d: 2, why: 'Highest derivative dy/dx, squared: order 1, degree 2.' },
  { s: ['(d²y/dx²)³ + (dy/dx)⁴ = 5', ''], hi: 0, o: 2, d: 3, why: 'The highest derivative is d²y/dx², raised to 3. The power 4 on dy/dx does not matter: it is a lower derivative.' },
  { s: ['y = x dy/dx + √(1 + (dy/dx)²)', 'sq'], hi: 0, o: 1, d: 2, why: 'Remove the root first: (y − x y′)² = 1 + (y′)². Now the highest derivative y′ has power 2: order 1, degree 2.' },
  { s: ['sin(dy/dx) = x', 'bad'], hi: 0, o: 1, d: 0, why: 'The derivative sits inside sin, so the equation is not a polynomial in dy/dx: the degree is not defined. The order is still 1.' },
];
export default function (host) {
  let i = 0;
  const cv = canvas(host, { aspect: 0.62, max: 300, min: 230, label: 'A differential equation with its order and degree' });
  const c = row(host), out = readout(host);
  EQ.forEach((e, j) => button(c, ['dy/dx + y = x', 'd²y: second order', '(dy/dx)²', 'mixed powers', 'with a root', 'sin(dy/dx)'][j], () => { i = j; cv.redraw(); say(); }));
  const say = () => { const e = EQ[i]; out.innerHTML = `<b>Order ${e.o}.</b> <b>Degree ${e.d || 'not defined'}.</b> ${e.why}`; };
  cv.draw = (ctx, w, h, col) => {
    const e = EQ[i], t = title(ctx, 'Order = highest derivative. Degree = its power.', col);
    text(ctx, e.s[0], w / 2, t + 50, { color: col.ink, size: 19, weight: 600, align: 'center' });
    const bx = [[col.s[0], 'Order', e.o], [col.s[1], 'Degree', e.d || '?']], bw = Math.min(110, (w - 40) / 2);
    bx.forEach(([c2, nm, v], k) => { const x = w / 2 + (k ? 10 : -10 - bw); ctx.strokeStyle = c2; ctx.lineWidth = 2.5; ctx.strokeRect(x, t + 84, bw, h - t - 98); text(ctx, nm, x + bw / 2, t + 98, { color: col.muted, size: 12, align: 'center' }); text(ctx, String(v), x + bw / 2, t + 84 + (h - t - 98) * 0.68, { color: c2, size: 30, weight: 700, align: 'center' }); });
  };
  cv.redraw(); say();
}
