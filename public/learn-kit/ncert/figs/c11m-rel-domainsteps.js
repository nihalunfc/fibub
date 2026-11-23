// Class 11 Maths, Relations and Functions (step player): finding the domain of f(x) = √(x − 2) / (x − 5). Two rules limit x: what is under a square
// root must not be negative, and a denominator must not be zero. Each rule is drawn on a number line and the allowed values are what remain.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Number lines showing the allowed values of x for the square root and the denominator' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Domain of f(x) = √(x − 2) / (x − 5)', col), L = 24, R = w - 24, X = (v) => L + ((v + 1) / 11) * (R - L);
    const line = (y, name, segs, holes, color) => {
      ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
      for (let v = 0; v <= 9; v++) { ctx.beginPath(); ctx.moveTo(X(v), y - 4); ctx.lineTo(X(v), y + 4); ctx.stroke(); if (v % 1 === 0) text(ctx, String(v), X(v), y + 15, { color: col.muted, size: 10.5, align: 'center' }); }
      ctx.strokeStyle = color; ctx.lineWidth = 6; segs.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(X(a), y); ctx.lineTo(X(b), y); ctx.stroke(); });
      holes.forEach(([v, closed]) => { ctx.fillStyle = closed ? color : col.panel; ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(X(v), y, 6, 0, 7); ctx.fill(); ctx.stroke(); });
      text(ctx, name, L, y - 16, { color, size: 12, weight: 800 });
    };
    const y1 = top + 52, y2 = y1 + 64, y3 = y2 + 64;
    if (s >= 1) line(y1, 'Square root: x − 2 ≥ 0, so x ≥ 2', [[2, 9.8]], [[2, true]], col.s[0]);
    if (s >= 2) line(y2, 'Denominator: x − 5 ≠ 0, so x ≠ 5', [[-0.8, 4.94], [5.06, 9.8]], [[5, false]], col.s[2]);
    if (s >= 3) line(y3, 'Both rules together', [[2, 4.94], [5.06, 9.8]], [[2, true], [5, false]], col.s[3]);
    const say = (t, y, c = col.ink, z = 13) => text(ctx, t, 12, y, { color: c, size: z, weight: 700 });
    if (s === 0) { say('Look for the two trouble spots:', top + 34); say('1. a square root of a negative number', top + 60, col.s[0]); say('2. dividing by zero', top + 84, col.s[2]); }
    if (s === 4) say('Domain = [2, 5) ∪ (5, ∞)', y3 + 38, col.s[3], 15);
    if (s >= 4) say('Test x = 1: √(−1) fails. x = 5: ÷ 0 fails. x = 6: √4 / 1 = 2 works.', y3 + 62, col.ink, 11.5);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
