// Class 11 Motion in a Straight Line (step player): the three equations of motion from one velocity-time graph (constant acceleration). The graph is a straight line from
// u to v. Slope = a gives v = u + at. Area of the trapezoid = displacement: s = ut + (1/2)at^2 (rectangle ut plus triangle (1/2)(v-u)t). Eliminating t gives v^2 = u^2 + 2as.
// The picture uses u = 2 m/s, a = 1 m/s^2, t = 4 s, so v = 6 m/s.
import { canvas, text, title, axes, line } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'A velocity-time graph used to derive the equations of motion' });
  const T = ['v–t graph of constant acceleration', 'The slope is the acceleration', 'The area is the displacement', 'Add the rectangle and the triangle', 'Use the average velocity', 'Remove t to get v² = u² + 2as'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const gh = h * 0.56, A = axes(ctx, w, gh + 30, col, { x: [0, 5], y: [0, 7], xt: [0, 4], yt: [0], xlabel: '', ylabel: 'velocity', l: 40, r: 12, t: 30, b: 14 });
    const u = 2, v = 6, t = 4, P = (a, b) => [A.X(a), A.Y(b)];
    ctx.save(); ctx.globalAlpha = 0.28;
    if (step >= 2) { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(...P(0, 0)); ctx.lineTo(...P(0, u)); ctx.lineTo(...P(t, u)); ctx.lineTo(...P(t, 0)); ctx.fill(); }
    if (step >= 2) { ctx.fillStyle = step >= 3 ? col.s[3] : col.s[0]; ctx.beginPath(); ctx.moveTo(...P(0, u)); ctx.lineTo(...P(t, v)); ctx.lineTo(...P(t, u)); ctx.fill(); }
    ctx.restore();
    line(ctx, [P(0, u), P(t, v)], col.ink, 3); line(ctx, [P(t, 0), P(t, v)], col.muted, 1, [4, 3]);
    text(ctx, 'u', A.L - 12, A.Y(u), { size: 13, weight: 700, color: col.s[1], align: 'center' }); text(ctx, 'v', A.L - 12, A.Y(v), { size: 13, weight: 700, color: col.s[2], align: 'center' }); text(ctx, 't', A.X(t), A.B + 14, { size: 13, weight: 700, color: col.ink, align: 'center' });
    if (step >= 1) { line(ctx, [P(0, u), P(t, u)], col.s[1], 1.5, [5, 3]); line(ctx, [P(t, u), P(t, v)], col.s[2], 3); text(ctx, 'v − u = at', A.X(t) - 6, A.Y((u + v) / 2), { size: 11, weight: 700, color: col.s[2], align: 'right' }); }
    if (step >= 3) { text(ctx, 'ut', A.X(t / 2), A.Y(u / 2), { size: 13, weight: 700, color: col.s[0], align: 'center' }); text(ctx, '½(v−u)t', A.X(t * 0.62), A.Y(u + 0.9), { size: 11, weight: 700, color: col.s[3], align: 'center' }); }
    const y0 = gh + 52, L = (s, i, c = col.ink) => text(ctx, s, 16, y0 + i * 24, { size: 13.5, weight: 700, color: c });
    if (step === 0) { L('Straight line: velocity changes steadily.', 0, col.muted); L('u = start velocity, v = velocity at time t.', 1, col.muted); }
    if (step >= 1) { L('a = (v − u)/t   ⇒   v = u + at', 0, col.s[2]); }
    if (step >= 2) L('displacement s = area under the graph', 1, col.s[0]);
    if (step >= 3) L('s = ut + ½(at)·t = ut + ½at²', 2, col.s[3]);
    if (step >= 4) L('also s = ½(u + v)t   (average velocity × time)', 3, col.s[1]);
    if (step >= 5) L('t = (v−u)/a, so v² = u² + 2as', 4, col.s[7] ?? col.ink);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
