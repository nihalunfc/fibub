// Class 12 Maths, Matrices: an inverse matrix undoes the matrix. The unit square is moved by A and then moved back by A^-1 (animated).
// If det A = 0 the square is squashed flat and nothing can bring it back, so A has no inverse.
import { canvas, text, title, row, choice, loop, axes, arrow } from '../../kit.js';

const PRE = { rot: ['Turn 90° and stretch', [0, -2, 1, 0]], sh: ['Shear', [1, 1, 0, 1]], sc: ['Scale', [2, 0, 0, 1]], sing: ['Singular (det 0)', [1, 2, 0.5, 1]] };
export default function (host) {
  let k = 'sh', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'The unit square moved by a matrix and then moved back by its inverse' });
  cv.draw = (ctx, w, h, col) => {
    const [a, b, c, d] = PRE[k][1], det = a * d - b * c, sing = Math.abs(det) < 1e-9, ph = t % 6;
    
    const u = ph < 2.2 ? ph / 2.2 : ph < 3.2 || sing ? 1 : ph < 5.4 ? 1 - (ph - 3.2) / 2.2 : 0, e = u * u * (3 - 2 * u);
    const m = [1 + (a - 1) * e, b * e, c * e, 1 + (d - 1) * e];
    title(ctx, sing ? 'A squashes the square flat: no way back' : 'Apply A, then A⁻¹ brings it back', col);
    const yr = (3.4 * (h - 52)) / (w - 40), A = axes(ctx, w, h, col, { x: [-3.4, 3.4], y: [-yr, yr], l: 20, b: 20, t: 30, r: 12, xt: [-2, 0, 2], yt: [-2, 0, 2] }), X = A.X, Y = A.Y;
    const Q = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => [X(m[0] * x + m[1] * y), Y(m[2] * x + m[3] * y)]);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); Q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.lineWidth = 1; ctx.strokeRect(X(0), Y(1), X(1) - X(0), Y(0) - Y(1)); ctx.setLineDash([]);
    arrow(ctx, X(0), Y(0), X(m[0]), Y(m[2]), col.s[1], 2.2, 8); arrow(ctx, X(0), Y(0), X(m[1]), Y(m[3]), col.s[3], 2.2, 8);
    const msg = sing ? (ph < 2.2 ? 'applying A…' : ph < 3.2 ? 'flat: area 0' : 'no inverse exists; it stays flat') : ph < 2.2 ? 'applying A…' : ph < 3.2 ? 'after A: area scaled by |det A| = ' + Math.abs(det).toFixed(1) : ph < 5.4 ? 'applying A⁻¹…' : 'back to the unit square: A⁻¹A = I';
    text(ctx, msg, w / 2, h - 10, { color: sing ? col.bad : col.ink, size: 12.5, weight: 700, align: 'center' });
    text(ctx, `A = [[${a}, ${b}], [${c}, ${d}]], det A = ${+det.toFixed(2)}`, 10, h - 28, { color: col.muted, size: 11 });
  };
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const r = row(host); anim.button(r);
  choice(r, 'Matrix', Object.entries(PRE).map(([a, v]) => [a, v[0]]), k, (v) => { k = v; t = 0; });
  cv.redraw();
}
