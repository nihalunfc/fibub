// Class 10 Chemical Reactions (step player): hit-and-trial balancing of  Fe + H2O -> Fe3O4 + H2  (iron and steam).
// Method: list atoms, start with the compound that has the most atoms (Fe3O4), balance one element at a time, and
// recount everything after each change. Boxes hold the coefficients; red counts do not match, green ones do.
import { canvas, text, title, loop } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A table of atom counts while balancing iron and steam' });
  const TITLES = ['Skeleton equation, count the atoms', 'Fe: 3 on the right, so 3 Fe on the left', 'O: 4 on the right, so 4 H₂O on the left', 'H: now 8 on the left, so 4 H₂ on the right', 'Check every atom, add state symbols'];
  // coefficients Fe, H2O, Fe3O4, H2 at each step
  const C = [[1, 1, 1, 1], [3, 1, 1, 1], [3, 4, 1, 1], [3, 4, 1, 4], [3, 4, 1, 4]];
  loop(host, () => {}, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8;
    const [f, o, m, g] = C[step];
    const names = ['Fe', 'H₂O', 'Fe₃O₄', 'H₂'];
    const xs = [0.1, 0.36, 0.64, 0.9].map((v) => v * w);
    const y = top + 30;
    C[step].forEach((c, i) => {
      const x = xs[i];
      ctx.strokeStyle = (step > 0 && C[step][i] !== C[step - 1][i]) ? col.s[1] : col.line; ctx.lineWidth = 2; ctx.strokeRect(x - 34, y - 14, 20, 26);
      text(ctx, String(c), x - 24, y, { color: col.ink, size: 15, weight: 700, align: 'center' });
      text(ctx, names[i], x - 8, y, { color: col.ink, size: 14, weight: 600 });
    });
    text(ctx, '+', (xs[0] + xs[1]) / 2 + 6, y, { color: col.ink, size: 16, align: 'center' }); text(ctx, '→', (xs[1] + xs[2]) / 2 + 6, y, { color: col.ink, size: 16, align: 'center' }); text(ctx, '+', (xs[2] + xs[3]) / 2 + 6, y, { color: col.ink, size: 16, align: 'center' });
    const rows = [['Fe', f, 3 * m], ['H', 2 * o, 2 * g], ['O', o, 4 * m]];
    const ty = y + 52, a = w * 0.2, b = w * 0.5, d = w * 0.8;
    text(ctx, 'atom', a, ty, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'left', b, ty, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'right', d, ty, { color: col.muted, size: 11, align: 'center' });
    rows.forEach(([el, l, r], i) => {
      const yy = ty + 26 + i * 30, ok = l === r;
      text(ctx, el, a, yy, { color: col.ink, size: 15, weight: 700, align: 'center' });
      text(ctx, String(l), b, yy, { color: ok ? col.good : col.bad, size: 16, weight: 700, align: 'center' }); text(ctx, String(r), d, yy, { color: ok ? col.good : col.bad, size: 16, weight: 700, align: 'center' });
      text(ctx, ok ? '✓' : '✗', w - 24, yy, { color: ok ? col.good : col.bad, size: 16, weight: 700, align: 'center' });
    });
    const note = ['Fe 1 = 3 ✗, H 2 vs 2 ✓, O 1 vs 4 ✗. Start with Fe₃O₄, the biggest formula.', 'Fe is now 3 = 3. Next O.', 'O is 4 = 4, but H went up to 8 on the left. Fix H.', 'All three elements match. Never touched a subscript.', 'Same atoms on both sides: mass is conserved.'][step];
    text(ctx, note, w / 2, h - 36, { color: col.muted, size: 10.5, align: 'center' });
    if (step === 4) text(ctx, '3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)', w / 2, h - 16, { color: col.good, size: 12.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
