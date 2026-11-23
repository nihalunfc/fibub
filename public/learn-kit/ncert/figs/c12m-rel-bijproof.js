// Class 12 Maths, Functions (step player): show that f(x) = 2x + 3 from R to R is one-one and onto. One-one: equal outputs force equal inputs.
// Onto: for any y in the codomain solve for x and check it lies in the domain. The graph shows the horizontal line meeting the line once.
import { canvas, text, title, axes, line, dot } from '../../kit.js';

const L = [
  ['Claim: f(x) = 2x + 3 is a bijection from ℝ to ℝ. We prove one-one, then onto.', ''],
  ['One-one: take any x₁, x₂ with f(x₁) = f(x₂).', '2x₁ + 3 = 2x₂ + 3'],
  ['Subtract 3, divide by 2.', 'x₁ = x₂  ⇒ one-one ✓'],
  ['Onto: take any y in the codomain ℝ. We need an x with f(x) = y.', '2x + 3 = y'],
  ['Solve: x = (y − 3)/2. This is a real number for every real y, so it lies in the domain.', 'x = (y − 3)/2 ∈ ℝ'],
  ['Check: f((y − 3)/2) = (y − 3) + 3 = y. So every y is hit: onto ✓. One-one and onto means bijective.', 'f((y − 3)/2) = y  ⇒ onto ✓'],
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 320, label: 'Proof that 2x + 3 is one-one and onto with its graph and a horizontal line' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'f(x) = 2x + 3: one-one and onto', col);
    let y = top + 16; for (let i = 1; i <= s; i++) if (L[i][1]) { text(ctx, L[i][1], 14, y, { color: i === s ? col.ink : col.muted, size: i === s ? 13 : 12, weight: i === s ? 700 : 500 }); y += 19; }
    const note = L[s][0], max = Math.floor((w - 24) / 6.3), ls = []; let cur = '';
    note.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur);
    const gy = top + 16 + 5 * 19, gh = h - gy - 12 - ls.length * 15;
    ctx.save(); ctx.translate(10, gy); const a = axes(ctx, w - 20, gh, col, { x: [-5, 5], y: [-6, 8], l: 24, b: 6, t: 4, r: 8, fx: () => '', fy: () => '' });
    ctx.save(); a.clip(); line(ctx, [[a.X(-5), a.Y(-7)], [a.X(5), a.Y(13)]], col.s[0], 2.5); ctx.restore();
    const c = 5; if (s >= 1) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(a.L, a.Y(c)); ctx.lineTo(a.R, a.Y(c)); ctx.stroke(); ctx.setLineDash([]); dot(ctx, a.X((c - 3) / 2), a.Y(c), 5, col.s[2], col.panel); text(ctx, 'meets once', a.X(-4.8), a.Y(c) - 8, { color: col.s[2], size: 10.5, weight: 600 }); }
    if (s >= 4) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a.X((c - 3) / 2), a.Y(c)); ctx.lineTo(a.X((c - 3) / 2), a.B); ctx.stroke(); text(ctx, '(y−3)/2', a.X((c - 3) / 2) + 4, a.B - 8, { color: col.s[3], size: 10.5, weight: 600 }); }
    ctx.restore();
    ls.forEach((l, i) => text(ctx, l, 14, h - 10 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, L.length - 1); cv.redraw(); } };
}
