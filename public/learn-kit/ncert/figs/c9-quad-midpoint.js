// Class 9 Quadrilaterals (step player): proof of the mid-point theorem. In triangle ABC, D and E are the mid-points of AB and AC.
// Extend DE to F with EF = DE. Triangles AED and CEF are copies, so DBCF is a parallelogram; hence DE is parallel to BC and DE = BC/2.
import { canvas, text, title } from '../../kit.js';
import { view, shape, seg, note, mid, wedge } from './c9-quad-lib.js';

const N = ['Triangle ABC. D is the mid-point of AB, and E is the mid-point of AC. We want to show DE is parallel to BC and half as long.', 'Extend DE beyond E to a point F so that EF = DE. Join C to F.', 'Triangles AED and CEF: AE = CE (E is a mid-point), DE = FE (we made it so), and the angles at E are equal (vertically opposite). So they are copies (SAS).', 'So CF = AD, and angle EAD = angle ECF, which makes CF parallel to AB. But AD = DB, so CF = DB too.', 'DB and CF are equal and parallel, so DBCF is a parallelogram. Its opposite sides DF and BC are parallel and equal.', 'DF = BC, and DE is half of DF. So DE ∥ BC and DE = ½ BC.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Proof of the mid-point theorem by extending the line joining the mid-points and building a parallelogram' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Mid-point theorem: the proof', col), V = view(w, h - 66, top, 14, 8, 6);
    const A = [5, 7.4], B = [1, 1.2], C = [9, 1.2], D = mid(A, B), E = mid(A, C), F = [2 * E[0] - D[0], 2 * E[1] - D[1]];
    if (s >= 4) shape(ctx, V, [D, B, C, F], col.s[1], null, 0.22);
    if (s === 2 || s === 3) { shape(ctx, V, [A, E, D], col.s[0], null, 0.3); shape(ctx, V, [C, E, F], col.s[4], null, 0.3); }
    shape(ctx, V, [A, B, C], null, col.ink, 0, 2.5);
    seg(ctx, V, D, E, col.s[3], 3);
    if (s >= 1) { seg(ctx, V, E, F, col.s[3], 3, [5, 4]); seg(ctx, V, C, F, col.s[2], 2.5); }
    if (s >= 4) { seg(ctx, V, D, F, col.s[1], 2.5); }
    const lab = (p, t, dx, dy, c) => text(ctx, t, V.X(p[0]) + dx, V.Y(p[1]) + dy, { color: c || col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    lab(A, 'A', 0, -13); lab(B, 'B', -12, 8); lab(C, 'C', 12, 8); lab(D, 'D', -13, 0); lab(E, 'E', 0, -13 + 24 * 0 + 2);
    if (s >= 1) lab(F, 'F', 13, 0);
    [D, E].forEach((p) => { ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(V.X(p[0]), V.Y(p[1]), 4, 0, 7); ctx.fill(); });
    if (s === 2) { wedge(ctx, V, E, D, A, col.s[2], 14); wedge(ctx, V, E, F, C, col.s[2], 14); }
    if (s === 5) text(ctx, 'DE = ½ BC', w / 2, h - 74, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
