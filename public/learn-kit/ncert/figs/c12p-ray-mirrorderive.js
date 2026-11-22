// Class 12 Ray Optics (step player): deriving the mirror formula 1/v + 1/u = 1/f for a concave mirror with similar triangles.
// Ray 1 goes to the pole P (triangles ABP and A'B'P are similar, so h'/h = v/u). Ray 2 goes parallel to the axis to M and
// is reflected through F (triangles A'B'F and MPF are similar, so h'/h = (v - f)/f). Equating the two ratios gives the formula.
// Picture (magnitudes): f = 5, u = 15, v = 7.5 (units), object height 2, image height 1.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Concave mirror ray diagram with similar triangles used to derive the mirror formula' });
  const TT = ['1. The picture', '2. Ray to the pole: triangles ABP, A′B′P', '3. Ray parallel to axis: triangles MPF, A′B′F', '4. Equate the two ratios', '5. Put in the sign convention'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const xm = w - 26, s = (xm - 26) / 16, cy = top + 40 + 4 * s * 0 + 36, X = (x) => xm - x * s;
    const P = [xm, cy], F = [X(5), cy], C = [X(10), cy], B = [X(15), cy], A = [X(15), cy - 2 * s], B2 = [X(7.5), cy], A2 = [X(7.5), cy + s], M = [xm, cy - 2 * s];
    const tri = (pts, c) => { ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = c; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill(); ctx.restore(); };
    if (step === 1 || step === 3) { tri([A, B, P], col.s[0]); tri([A2, B2, P], col.s[0]); }
    if (step === 2 || step === 3) { tri([M, P, F], col.s[1]); tri([A2, B2, F], col.s[1]); }
    line(ctx, [[8, cy], [w - 6, cy]], col.line, 1);
    const Rpx = 10 * s, ang = Math.asin(Math.min(0.99, (3.2 * s) / Rpx));
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(xm - Rpx, cy, Rpx, -ang, ang); ctx.stroke(); ctx.restore();
    arrow(ctx, B[0], B[1], A[0], A[1], col.ink, 3, 8); arrow(ctx, B2[0], B2[1], A2[0], A2[1], col.s[3], 3, 8);
    line(ctx, [A, M], col.s[0], 1.8); line(ctx, [M, F, A2], col.s[0], 1.8);
    line(ctx, [A, P], col.s[1], 1.8); line(ctx, [P, A2], col.s[1], 1.8);
    for (const [p, l, dx, dy] of [[P, 'P', 8, 14], [F, 'F', 0, 14], [C, 'C', 0, 14], [B, 'B', 0, 14], [B2, 'B′', 0, -12], [A, 'A', -8, -6], [A2, 'A′', 0, 14], [M, 'M', 8, -8]]) { dot(ctx, p[0], p[1], 2.5, col.ink); text(ctx, l, p[0] + dx, p[1] + dy, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel }); }
    // distances
    const dim = (x0, x1, y, lab, c) => { line(ctx, [[x0, y], [x1, y]], c, 1.3); text(ctx, lab, (x0 + x1) / 2, y + 12, { color: c, size: 11, weight: 700, align: 'center', halo: col.panel }); };
    if (step === 0) { dim(X(15), xm, cy + 34, 'u = BP = 15', col.muted); dim(X(7.5), xm, cy + 52, 'v = B′P = 7.5', col.s[3]); dim(X(5), xm, cy + 70, 'f = FP = 5', col.s[1]); }
    const L = [
      ['Object AB (height h) in front of a concave mirror. Image A′B′', 'has height h′. Distances (all positive here): u, v and f = PF.'],
      ['∠APB = ∠A′PB′ (equal angles of incidence and reflection).', 'So ΔABP ~ ΔA′B′P and h′/h = B′P/BP = v/u.'],
      ['AM ∥ axis, so MP = AB = h; the ray reflects through F.', 'ΔMPF ~ ΔA′B′F: h′/h = B′F/FP = (v − f)/f.'],
      ['v/u = (v − f)/f  →  fv = uv − uf  →  uf = uv − fv.', 'Divide every term by uvf:  1/v = 1/f − 1/u.'],
      ['New Cartesian signs: u, v and f are all measured against the', 'light, so negative: 1/v + 1/u = 1/f, and m = −v/u. Same formula.'],
    ][step];
    text(ctx, L[0], 10, h - 32, { color: col.ink, size: 11, weight: 600 }); text(ctx, L[1], 10, h - 14, { color: col.ink, size: 11, weight: 600 });
  };
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
