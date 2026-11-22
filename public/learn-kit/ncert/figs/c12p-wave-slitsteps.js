// Class 12 Wave Optics (step player): why a single slit gives its first dark fringe at a sin(theta) = lambda. All points of the slit (width a)
// act as sources in step. In direction theta the ray from the top edge travels a sin(theta) less than the ray from the bottom edge.
// Split the slit into two halves and pair each point of the upper half with the point a/2 below it: their rays differ by (a/2) sin(theta).
// If that is lambda/2 the pair cancels, and so does every pair, so the sum is zero: a sin(theta) = lambda.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';
import { rad } from '../c12p-optlib.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Why the first minimum of a single slit is at a sin θ = λ' });
  const TITLES = ['A wavefront fills a slit of width a', 'Look in one direction θ: parallel rays leave the slit', 'Bottom ray travels a sin θ more than the top ray', 'Split the slit in two halves and pair the rays', 'If a sin θ = λ each pair differs by λ/2: they cancel', 'Dark fringes: a sin θ = nλ  (n = 1, 2, 3 …)'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, th = rad(26), cx = w * 0.2, mid = top + (h - top) * 0.42, a = (h - top) * 0.46, yt = mid - a / 2, yb = mid + a / 2;
    line(ctx, [[cx, top + 2], [cx, yt]], col.ink, 5); line(ctx, [[cx, yb], [cx, yb + 34]], col.ink, 5);
    line(ctx, [[cx - 20, yt], [cx - 20, yb]], col.s[2], 1.5); text(ctx, 'a', cx - 26, mid, { color: col.s[2], size: 13, weight: 700, align: 'right' });
    for (let k = 0; k < 4; k++) arrow(ctx, 6, yt + (a * (k + 0.5)) / 4, cx - 30, yt + (a * (k + 0.5)) / 4, col.s[0], 1.4, 5);
    const u = [Math.cos(th), -Math.sin(th)], L = w * 0.7, n = 9, pts = Array.from({ length: n }, (_, k) => [cx, yt + (a * k) / (n - 1)]);
    if (step === 0) text(ctx, 'plane wave: every point of the slit', cx + 14, yt - 8, { color: col.s[0], size: 11 }), text(ctx, 'moves in step', cx + 14, yt + 8, { color: col.s[0], size: 11 });
    if (step >= 1) {
      pts.forEach((p, k) => line(ctx, [p, [p[0] + u[0] * L, p[1] + u[1] * L]], step >= 3 && k !== 4 ? (k < 4 ? col.s[1] : col.s[3]) : col.s[0], 1.3));
      arrow(ctx, cx + 4, mid + 30, cx + 4 + u[0] * 48, mid + 30 + u[1] * 48, col.ink, 1.8, 6);
      text(ctx, 'θ', cx + 54, mid + 22, { color: col.ink, size: 13, weight: 700 });
    }
    const seg = (from, dist, color, label, lx, ly) => { // thick piece of the ray from 'from' (a slit point), of length dist
      const q = [from[0] + u[0] * dist, from[1] + u[1] * dist];
      line(ctx, [from, q], color, 5); return q;
    };
    if (step >= 2) {
      const T = pts[0], Bm = pts[n - 1], s = a * Math.sin(th), F = [Bm[0] + u[0] * s, Bm[1] + u[1] * s];
      // the right-angle foot: perpendicular from T to the bottom ray; it lies a distance a sin(theta) along the ray
      const G = [T[0] + u[0] * 0, T[1]];
      line(ctx, [T, [F[0], F[1]]], col.muted, 1.2, [4, 3]);
      seg(Bm, s, col.s[2]);
      text(ctx, 'a sin θ', (Bm[0] + F[0]) / 2 + 6, (Bm[1] + F[1]) / 2 + 16, { color: col.s[2], size: 12, weight: 700 });
      dot(ctx, ...T, 3, col.ink); dot(ctx, ...Bm, 3, col.ink);
    }
    if (step >= 3) {
      const T = pts[0], M = pts[4], s = (a / 2) * Math.sin(th), F = [M[0] + u[0] * s, M[1] + u[1] * s];
      line(ctx, [T, F], col.muted, 1.2, [4, 3]); seg(M, s, col.s[5]);
      text(ctx, 'upper half', cx + 12, yt + 14, { color: col.s[1], size: 11, weight: 700 }); text(ctx, 'lower half', cx + 36, yb + 12, { color: col.s[3], size: 11, weight: 700 });
      text(ctx, 'top & middle rays differ by (a/2) sin θ', x(w), h - 40, { color: col.s[5], size: 11.5, weight: 700 });
    }
    if (step >= 4) text(ctx, 'a sin θ = λ  ⇒  (a/2) sin θ = λ/2: cancel', x(w), h - 22, { color: col.s[7], size: 12, weight: 700 });
    if (step >= 5) text(ctx, 'central maximum between ±λ/a', x(w), h - 4, { color: col.s[7], size: 12, weight: 700 });
  };
  const x = (w) => w * 0.3;
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
