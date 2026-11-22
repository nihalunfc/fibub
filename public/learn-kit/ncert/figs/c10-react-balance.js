// Class 10 Chemical Reactions (step player): balancing H2 + O2 -> H2O by changing coefficients only.
// Science: atoms are never created or destroyed (law of conservation of mass), so every element must have the same
// number of atoms on both sides. We change the coefficients (numbers in front), never the subscripts (the formula).
import { canvas, text, title, line, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Molecules of hydrogen and oxygen forming water, with atom counts on each side' });
  const TITLES = ['Write the skeleton equation', 'Fix oxygen: 2 in front of H₂O', 'Fix hydrogen: 2 in front of H₂', 'Balanced: count again', 'Never change a subscript'];
  const N = [[1, 1, 1], [1, 1, 2], [2, 1, 2], [2, 1, 2], [1, 1, 1]];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6;
    const [a, b, c] = N[step];
    const atom = (x, y, r, fill, lab) => {
      const j = Math.sin(t * 5 + x) * 1.2;
      ctx.beginPath(); ctx.arc(x, y + j, r, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke();
      text(ctx, lab, x, y + j, { color: col.bg || '#fff', size: r > 8 ? 11 : 9, weight: 700, align: 'center' });
    };
    const H2 = (x, y) => { line(ctx, [[x - 8, y], [x + 8, y]], col.ink, 2); atom(x - 8, y, 7, col.s[0], 'H'); atom(x + 8, y, 7, col.s[0], 'H'); };
    const O2 = (x, y) => { line(ctx, [[x - 10, y], [x + 10, y]], col.ink, 2); atom(x - 10, y, 10, col.s[7], 'O'); atom(x + 10, y, 10, col.s[7], 'O'); };
    const H2O = (x, y) => { line(ctx, [[x, y], [x - 12, y + 12]], col.ink, 2); line(ctx, [[x, y], [x + 12, y + 12]], col.ink, 2); atom(x - 12, y + 12, 7, col.s[0], 'H'); atom(x + 12, y + 12, 7, col.s[0], 'H'); atom(x, y, 10, col.s[7], 'O'); };
    const y0 = top + 30, gap = 42, cx = [w * 0.13, w * 0.37, w * 0.80];
    for (let i = 0; i < a; i++) H2(cx[0], y0 + i * gap);
    for (let i = 0; i < b; i++) O2(cx[1], y0 + i * gap);
    for (let i = 0; i < c; i++) H2O(cx[2], y0 + i * gap - 4);
    text(ctx, '+', (cx[0] + cx[1]) / 2, y0, { color: col.ink, size: 18, align: 'center' });
    line(ctx, [[w * 0.53, y0], [w * 0.66, y0]], col.ink, 2.5);
    ctx.beginPath(); ctx.moveTo(w * 0.66 + 6, y0); ctx.lineTo(w * 0.66 - 2, y0 - 5); ctx.lineTo(w * 0.66 - 2, y0 + 5); ctx.fillStyle = col.ink; ctx.fill();
    // equation line
    const k = (n) => (n > 1 ? n : '');
    const eq = step === 4 ? 'H₂ + O₂ → H₂O₂ ? (that is a different substance!)' : `${k(a)}H₂ + ${k(b)}O₂ → ${k(c)}H₂O`;
    text(ctx, eq, w / 2, y0 + 2 * gap + 6, { color: step === 3 ? col.good : col.ink, size: 15, weight: 700, align: 'center' });
    // counts table
    const ty = y0 + 2 * gap + 34, x1 = w * 0.18, x2 = w * 0.50, x3 = w * 0.78;
    text(ctx, 'atoms', x1, ty, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'left', x2, ty, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'right', x3, ty, { color: col.muted, size: 11, align: 'center' });
    const rows = [['H', 2 * a, 2 * c], ['O', 2 * b, c]];
    rows.forEach(([el, l, r], i) => {
      const y = ty + 24 + i * 26, ok = l === r;
      text(ctx, el, x1, y, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, String(l), x2, y, { color: col.ink, size: 14, align: 'center' }); text(ctx, String(r), x3, y, { color: col.ink, size: 14, align: 'center' });
      text(ctx, ok ? '✓' : '✗', w - 24, y, { color: ok ? col.good : col.bad, size: 16, weight: 700, align: 'center' });
    });
    const msg = ['O: 2 on the left, 1 on the right. Not balanced.', 'O is fixed (2 = 2) but H is now 2 on the left and 4 on the right.', 'H is 4 = 4 and O is 2 = 2. Every atom is accounted for.', 'Mass: 2 × 2 + 32 = 36 u on the left; 2 × 18 = 36 u on the right.', 'H₂O₂ has the right atoms but it is hydrogen peroxide, not water.'][step];
    text(ctx, msg, w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
