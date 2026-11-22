// Class 9 Atomic Foundations of Matter (step player): the criss-cross method of writing a chemical formula.
// Example 1 aluminium oxide: Al3+ and O2-. Swap the charge numbers to become subscripts: Al2O3. Check: 2 x (+3) + 3 x (-2) = 0.
// Example 2 magnesium oxide: Mg2+ and O2- gives Mg2O2, which is cancelled to MgO (smallest whole-number ratio).
// Example 3 aluminium sulphate: Al3+ and SO4 2-: the sulphate ion is kept in brackets: Al2(SO4)3.
// The steps are drawn with arrows so the swap is seen, not memorised.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The criss-cross method swapping charges into subscripts to write aluminium oxide and aluminium sulphate' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const CAP = ['Step 1: write the symbols side by side, positive ion first, with their charges (valencies).', 'Step 2: criss-cross: the number of one charge becomes the subscript of the other ion.', 'Step 3: write the formula. A subscript 1 is not written. Al₂O₃.', 'Step 4: check the charges: 2 × (+3) = +6 and 3 × (−2) = −6. Total = 0. A compound is neutral.', 'If both numbers can be divided: Mg²⁺ and O²⁻ give Mg₂O₂, so divide by 2: MgO.', 'A group of atoms that stays together (a polyatomic ion, like sulphate SO₄²⁻) goes in brackets when its subscript is more than 1: Al₂(SO₄)₃.'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['1 · Write symbols and charges', '2 · Criss-cross the charges', '3 · Write the formula', '4 · Check: the total charge is zero', '5 · Cancel common factors', '6 · Polyatomic ions go in brackets'][step], col);
    const cy = h * 0.34, big = Math.min(36, w / 11), sm = big * 0.55;
    const ex = step <= 3 ? { a: ['Al', '3+', '3'], b: ['O', '2−', '2'], f: ['Al', '2', 'O', '3'] } : step === 4 ? { a: ['Mg', '2+', '2'], b: ['O', '2−', '2'], f: ['Mg', '2', 'O', '2'] } : { a: ['Al', '3+', '3'], b: ['SO₄', '2−', '2'], f: ['Al', '2', '(SO₄)', '3'] };
    const xa = w * 0.3, xb = w * 0.7;
    const sym = (s, x, y, c) => text(ctx, s, x, y, { color: c, size: big, weight: 700, align: 'center', fit: false });
    sym(ex.a[0], xa, cy, col.ink); sym(ex.b[0], xb, cy, col.ink);
    const ca = xa + ex.a[0].length * big * 0.34 + 6, cb = xb + ex.b[0].length * big * 0.34 + 6;
    text(ctx, ex.a[1], ca, cy - big * 0.5, { color: col.s[1], size: sm, weight: 700, fit: false }); text(ctx, ex.b[1], cb, cy - big * 0.5, { color: col.s[0], size: sm, weight: 700, fit: false });
    if (step >= 1 && step <= 2 || step >= 4) {
      const p = step === 1 ? Math.min(1, t * 0.8) : 1;
      line(ctx, [[ca + 4, cy - big * 0.5 + 10], [xb - 4 + (cb - xb) * 0, cy + big * 0.95]], col.s[1], 1.5, [4, 3]); line(ctx, [[cb + 4, cy - big * 0.5 + 10], [xa + 6, cy + big * 0.95]], col.s[0], 1.5, [4, 3]);
      void p;
      text(ctx, ex.a[2], xa + ex.a[0].length * big * 0.34 + 8, cy + big * 1.1, { color: col.s[0], size: sm * 1.3, weight: 700, fit: false }); text(ctx, ex.b[2], xb + ex.b[0].length * big * 0.34 + 8, cy + big * 1.1, { color: col.s[1], size: sm * 1.3, weight: 700, fit: false });
    }
    if (step >= 2) {
      const fy = h * 0.68; const f = ex.f; const tot = f[0].length + f[2].length;
      const SB = (n) => String(n).split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
      text(ctx, f[0] + SB(f[1]) + f[2] + SB(f[3]), w / 2, fy, { color: col.s[2], size: big * 1.3, weight: 700, align: 'center', fit: false });
      void tot;
      if (step === 3) text(ctx, '2 × (+3) + 3 × (−2) = 0', w / 2, fy + big * 1.4, { color: col.good, size: 13, weight: 700, align: 'center' });
      if (step === 4) text(ctx, 'Mg₂O₂ → MgO (divide by 2)', w / 2, fy + big * 1.4, { color: col.s[3], size: 13, weight: 700, align: 'center' });
      if (step === 5) text(ctx, 'bracket: the whole SO₄ group is taken 3 times', w / 2, fy + big * 1.4, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    }
    const wds = CAP[step].split(' '), L = []; let cur = ''; wds.forEach((wd) => { if ((cur + ' ' + wd).trim().length > w / 6.3) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h - 8 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
