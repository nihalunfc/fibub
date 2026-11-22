// 4.4 Decision boundaries: the loan model z = 1.8·income − 2.4·debt + 0.6. Step through: the map, the
// boundary z = 0, the two sides, then two applicants and their probabilities.
import { canvas, text, line, dot, axes, title } from '../../kit.js';

const z = (x1, x2) => 1.8 * x1 - 2.4 * x2 + 0.6;
const sig = (v) => 1 / (1 + Math.exp(-v));
export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 260, label: 'Income against debt, with the loan model\'s straight decision boundary' });
  let step = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['Income and debt (0 = average)', 'The border: z = 0', 'Two sides, two answers', 'Applicant at (0, 0)', 'Applicant at (1, −1)'][step], col);
    const a = axes(ctx, w, h, col, { t: top + 8, l: 40, x: [-2, 2], y: [-2, 2], xt: [-2, -1, 0, 1, 2], yt: [-2, -1, 0, 1, 2], xlabel: 'income x₁', ylabel: 'debt x₂', fx: String, fy: String });
    const yb = (x) => 0.75 * x + 0.25;
    if (step >= 2) {
      ctx.save(); a.clip();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(a.X(-2), a.Y(yb(-2))); ctx.lineTo(a.X(2), a.Y(yb(2))); ctx.lineTo(a.X(2), a.Y(-2)); ctx.lineTo(a.X(-2), a.Y(-2)); ctx.fill();
      ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(a.X(-2), a.Y(yb(-2))); ctx.lineTo(a.X(2), a.Y(yb(2))); ctx.lineTo(a.X(2), a.Y(2)); ctx.lineTo(a.X(-2), a.Y(2)); ctx.fill();
      ctx.restore();
      text(ctx, 'repays', a.X(-1.1), a.Y(-1.6), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'defaults', a.X(-1.2), a.Y(1.4), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    }
    if (step >= 1) {
      ctx.save(); a.clip(); line(ctx, [[a.X(-2), a.Y(yb(-2))], [a.X(2), a.Y(yb(2))]], col.ink, 2.5); ctx.restore();
      text(ctx, 'x₂ = 0.75x₁ + 0.25', a.X(0.9), a.Y(yb(0.9)) - 14, { color: col.ink, size: 11.5, weight: 600, align: 'center', halo: col.panel });
    }
    const show = (x1, x2) => {
      dot(ctx, a.X(x1), a.Y(x2), 7, col.s[2], col.ink);
      text(ctx, `z = ${z(x1, x2).toFixed(1)}, p = ${sig(z(x1, x2)).toFixed(2)}`, a.X(x1) + 10, a.Y(x2) + 16, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    };
    if (step >= 3) show(0, 0);
    if (step >= 4) show(1, -1);
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
