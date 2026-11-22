// Class 9 Linear Polynomials (step player): finding the zero of 2x - 6 with a balance. Two x-boxes balance six 1-coins:
// 2x = 6. Splitting both pans into two equal halves leaves one x-box balancing three coins: x = 3. The line crosses the axis at 3.
import { canvas, text, title, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const L = ['Zero of 2x − 6', '2x − 6 = 0', 'Add 6 to both sides: 2x = 6', 'Halve both sides: x = 3', 'Check: 2(3) − 6 = 0', 'On the graph: crosses at x = 3'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Solving 2x minus 6 equals 0 on a balance and then on the graph' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, L[s], col), cx = w / 2, by = t + 96;
    // balance
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, by + 40); ctx.lineTo(cx, by - 18); ctx.moveTo(cx - 70, by + 40); ctx.lineTo(cx + 70, by + 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 105, by - 18); ctx.lineTo(cx + 105, by - 18); ctx.stroke(); ctx.restore();
    const box = (x, y) => { ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.9; ctx.fillRect(x, y, 30, 26); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, 30, 26); ctx.restore(); text(ctx, 'x', x + 15, y + 13, { color: '#fff', size: 13, weight: 700, align: 'center' }); };
    const coin = (x, y, neg) => { ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.3); ctx.fillStyle = neg ? col.s[6] : col.s[3]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, neg ? '−1' : '1', x, y, { color: col.ink, size: 9, weight: 700, align: 'center' }); };
    const nx = s >= 3 ? 1 : 2;
    for (let i = 0; i < nx; i++) box(cx - 100 + i * 34, by - 46);
    if (s < 2) for (let i = 0; i < 6; i++) coin(cx - 100 + (i % 3) * 20 + 4, by - 46 - 14 - Math.floor(i / 3) * 18 + 60 - 60, true);
    const nc = s >= 3 ? 3 : s >= 2 ? 6 : 0;
    for (let i = 0; i < nc; i++) coin(cx + 38 + (i % 3) * 20, by - 28 - Math.floor(i / 3) * 20, false);
    const g = plane(ctx, w, h, col, { top: by + 66, x0: -2, x1: 6, y0: -7, y1: 4 });
    if (s >= 5) { ctx.save(); ctx.beginPath(); ctx.rect(g.X(-2), g.Y(4), 8 * g.s, 11 * g.s); ctx.clip(); line(ctx, [[g.X(-2), g.Y(-10)], [g.X(6), g.Y(6)]], col.s[0], 3); ctx.restore(); dot(ctx, g.X(3), g.Y(0), 8, col.s[2], col.ink); text(ctx, 'x = 3', g.X(3), g.Y(0) - 16, { color: col.s[2], size: 12, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, s <= 1 ? '2x − 6 = 0' : s === 2 ? '2x = 6' : s === 3 ? 'x = 3' : 'p(3) = 0 ✓', w / 2, by + 56, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
