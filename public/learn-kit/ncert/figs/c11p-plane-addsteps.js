// Class 11 Motion in a Plane (step player): adding two vectors. A = (3, 2) and B = (1, 4) are added two ways: head-to-tail (place B at the tip of A; the resultant is the
// arrow from the start to the final tip) and by components (add the x parts and the y parts separately). R = (4, 6), |R| = sqrt(52) = 7.21, angle 56.3 degrees.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 330, label: 'Adding two vectors head to tail and by components' });
  const T = ['Two vectors, A and B', 'Head-to-tail: move B to the tip of A', 'The resultant R: start to finish', 'Components of A and B', 'Add components', 'Size and direction of R'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const gh = h * 0.6, u = Math.min((w - 50) / 6, (gh - 20) / 7), ox = 28, oy = 34 + 7 * u, X = (v) => ox + v * u, Y = (v) => oy - v * u;
    line(ctx, [[ox, oy], [ox + 6 * u, oy]], col.muted, 1.5); line(ctx, [[ox, oy], [ox, oy - 7 * u]], col.muted, 1.5);
    for (let k = 1; k <= 6; k++) { line(ctx, [[X(k), Y(0)], [X(k), Y(7)]], col.line, 0.6); } for (let k = 1; k <= 7; k++) line(ctx, [[X(0), Y(k)], [X(6), Y(k)]], col.line, 0.6);
    const A = [3, 2], B = [1, 4], R = [4, 6];
    arrow(ctx, X(0), Y(0), X(...A.slice(0, 1)), Y(A[1]), col.s[0], 3, 9); text(ctx, 'A', X(1.5) + 8, Y(1) + 6, { size: 13, weight: 700, color: col.s[0], halo: col.panel });
    if (step === 0) { arrow(ctx, X(0), Y(0), X(B[0]), Y(B[1]), col.s[1], 3, 9); text(ctx, 'B', X(0.5) - 10, Y(2) - 2, { size: 13, weight: 700, color: col.s[1], halo: col.panel }); }
    if (step >= 1) { if (step < 3) arrow(ctx, X(0), Y(0), X(B[0]), Y(B[1]), col.s[1], 1.5, 6); arrow(ctx, X(3), Y(2), X(4), Y(6), col.s[1], 3, 9); text(ctx, 'B', X(3.5) + 10, Y(4), { size: 13, weight: 700, color: col.s[1], halo: col.panel }); }
    if (step >= 2) { arrow(ctx, X(0), Y(0), X(4), Y(6), col.s[3], 3.5, 10); text(ctx, 'R = A + B', X(2) - 14, Y(3.2) - 8, { size: 13, weight: 700, color: col.s[3], align: 'right', halo: col.panel }); }
    if (step >= 3) { line(ctx, [[X(0), Y(0)], [X(3), Y(0)]], col.s[0], 2.5, [4, 3]); line(ctx, [[X(3), Y(0)], [X(3), Y(2)]], col.s[0], 2.5, [4, 3]); line(ctx, [[X(3), Y(2)], [X(4), Y(2)]], col.s[1], 2.5, [4, 3]); line(ctx, [[X(4), Y(2)], [X(4), Y(6)]], col.s[1], 2.5, [4, 3]); }
    dot(ctx, X(0), Y(0), 4, col.ink);
    const y0 = gh + 52, L = (s, i, c = col.ink) => text(ctx, s, 14, y0 + i * 21, { size: 13, weight: 700, color: c });
    if (step === 0) { L('A = 3 î + 2 ĵ', 0, col.s[0]); L('B = 1 î + 4 ĵ', 1, col.s[1]); }
    if (step === 1) L('Slide B (keep length and direction) so its tail is on the tip of A.', 0, col.muted);
    if (step === 2) L('R runs from the tail of A to the tip of B.', 0, col.s[3]);
    if (step >= 3 && step < 5) { L('Ax = 3, Ay = 2;   Bx = 1, By = 4', 0, col.ink); }
    if (step >= 4) { L('Rx = 3 + 1 = 4,   Ry = 2 + 4 = 6', 1, col.s[3]); L('R = 4 î + 6 ĵ', 2, col.s[3]); }
    if (step >= 5) { L('|R| = √(4² + 6²) = √52 = 7.21', 3, col.s[3]); L('θ = tan⁻¹(6/4) = 56.3° from the x-axis', 4, col.s[3]); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
