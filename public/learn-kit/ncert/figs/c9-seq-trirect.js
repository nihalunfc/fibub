// Class 9 Sequences (step player): why the triangular numbers are n(n + 1)/2. Two copies of a triangle of dots
// fit together into a rectangle n dots by (n + 1) dots, so one triangle is half of n(n + 1). Shown for n = 5.
import { canvas, text, title, dot } from '../../kit.js';
import { note } from './c9-seq-lib.js';

const N = ['A triangle of dots with 5 rows: 1 + 2 + 3 + 4 + 5 dots. How many in all?', 'Make a second copy of the triangle.', 'Turn the copy upside down.', 'Fit the two triangles together. They make a rectangle of dots, 5 rows by 6 dots.', 'The rectangle has 5 × 6 = 30 dots. Our triangle is half of that: 30 ÷ 2 = 15.', 'In general, T(n) = n × (n + 1) ÷ 2. For n = 10: 10 × 11 ÷ 2 = 55.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Two triangles of dots fitted together into a rectangle to show the triangular number formula' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Triangular numbers: T(5) = 5 × 6 ÷ 2', col), n = 5, sp = Math.min(34, (w - 24) / 12), r = sp * 0.34, ox = s >= 3 ? (w - 6 * sp) / 2 + sp / 2 : (w - 12 * sp) / 2 + sp / 2, oy = top + 30 + sp * 0.5;
    const at = (c, rw) => [ox + c * sp, oy + rw * sp];
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) { const [x, y] = at(j, i); dot(ctx, x, y, r, col.s[0], col.ink); }
    if (s >= 1) for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) { const [x, y] = s === 1 ? at(7 + j, i) : s === 2 ? at(7 + 4 - j, 4 - i) : at(1 + 4 - j, 4 - i); dot(ctx, x, y, r, col.s[2], col.ink); }
    if (s >= 3) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.strokeRect(ox - sp * 0.5, oy - sp * 0.5, 6 * sp, 5 * sp); ctx.setLineDash([]); }
    if (s === 2) text(ctx, 'turned upside down', ox + 9 * sp, oy + 5 * sp, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    if (s >= 4) text(ctx, '5 × 6 = 30 dots, half is 15', w / 2, oy + 5 * sp + 12, { color: col.ink, size: 14, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
