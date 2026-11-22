// Class 10 Real Numbers (step player): a factor tree of 360 grows one split at a time until every leaf is a prime.
// Fundamental theorem of arithmetic: collecting the prime leaves gives 360 = 2^3 x 3^2 x 5, the same for any tree.
import { canvas, text, title, line, dot } from '../../kit.js';

const N = [360, 180, 90, 45, 15, 5], P = [2, 2, 2, 3, 3];
const MSG = ['Start with 360. Is it prime? No.', '360 is even, so 2 divides it: 360 = 2 × 180. The 2 is prime, so it is a leaf.', '180 is even too: 180 = 2 × 90.', '90 is even: 90 = 2 × 45. Now 45 is odd.', '45 ends in 5, so 3 divides it (4 + 5 = 9): 45 = 3 × 15.', '15 = 3 × 5. Every leaf is now a prime: the tree stops.', 'Read the leaves: 360 = 2 × 2 × 2 × 3 × 3 × 5 = 2³ × 3² × 5'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A factor tree of 360 growing step by step into prime leaves' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Factor tree of 360', col) + 22, rh = (h - top - 92) / 5;
    const X = (j) => w * 0.36 + j * w * 0.085, Y = (j) => top + j * rh;
    const node = (x, y, v, prime) => { dot(ctx, x, y, 16, prime ? col.soft : col.panel, prime ? col.s[2] : col.muted); text(ctx, String(v), x, y, { color: col.ink, size: 12, weight: 700, align: 'center' }); };
    const k = Math.min(s, 5);
    for (let j = 0; j < k; j++) { line(ctx, [[X(j), Y(j)], [X(j) - w * 0.14, Y(j + 1)]], col.muted, 1.5); line(ctx, [[X(j), Y(j)], [X(j + 1), Y(j + 1)]], col.muted, 1.5); }
    node(X(0), Y(0), 360, false);
    for (let j = 0; j < k; j++) { node(X(j) - w * 0.14, Y(j + 1), P[j], true); node(X(j + 1), Y(j + 1), N[j + 1], j === 4); }
    if (s >= 6) for (let j = 0; j < 5; j++) dot(ctx, X(j) - w * 0.14, Y(j + 1), 21, 'transparent', col.s[3]);
    const m = MSG[Math.min(s, 6)];
    const words = m.split(' '); let a = '', ls = [];
    for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / 6.6) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; }
    ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, h - 46 + i * 16, { color: s >= 6 ? col.s[3] : col.ink, size: 12, weight: s >= 6 ? 700 : 400, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
