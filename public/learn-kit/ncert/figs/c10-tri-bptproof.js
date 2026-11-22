// Class 10 Triangles (step player): why the basic proportionality theorem is true, using areas. In triangle ABC with DE parallel to BC,
// join BE and CD. Triangles ADE and BDE share the height from E, so their areas are in the ratio AD : DB. Triangles ADE and CDE share the
// height from D, so their areas are in the ratio AE : EC. Triangles BDE and CDE have the same base DE and lie between the same
// parallels, so their areas are equal. Hence AD/DB = AE/EC.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Triangle ABC with DE parallel to BC and the lines BE and CD joined' });
  const CAP = ['Given: DE ∥ BC. To prove: AD/DB = AE/EC', 'Join B to E and C to D', 'ADE and BDE: same height from E, so areas are in ratio AD : DB', 'ADE and CDE: same height from D, so areas are in ratio AE : EC', 'BDE and CDE have equal area, so AD/DB = AE/EC'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Proof of the basic proportionality theorem', col) + 6;
    const A = [w * 0.5, top + 14], B = [w * 0.1, h - 58], C = [w * 0.9, h - 58], t = 0.45;
    const P = (S, T) => [S[0] + t * (T[0] - S[0]), S[1] + t * (T[1] - S[1])];
    const D = P(A, B), E = P(A, C);
    const tri = (p, q, r, c, a) => { ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.lineTo(...r); ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = a; ctx.fill(); ctx.globalAlpha = 1; };
    if (step === 2) { tri(A, D, E, col.s[0], 0.5); tri(B, D, E, col.s[1], 0.5); }
    if (step === 3) { tri(A, D, E, col.s[0], 0.5); tri(C, D, E, col.s[2], 0.5); }
    if (step === 4) { tri(B, D, E, col.s[1], 0.5); tri(C, D, E, col.s[2], 0.5); }
    ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [D, E], col.good, 3);
    if (step >= 1) { line(ctx, [B, E], col.muted, 2, [6, 4]); line(ctx, [C, D], col.muted, 2, [6, 4]); }
    for (const [p, n, dx, dy] of [[A, 'A', 0, -12], [B, 'B', -12, 6], [C, 'C', 12, 6], [D, 'D', -14, 0], [E, 'E', 14, 0]]) { dot(ctx, p[0], p[1], 4, col.ink); text(ctx, n, p[0] + dx, p[1] + dy, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    if (step === 2) text(ctx, 'ar(ADE) : ar(BDE) = AD : DB', w / 2, h - 36, { color: col.s[0], size: 12.5, weight: 700, align: 'center' });
    if (step === 3) text(ctx, 'ar(ADE) : ar(CDE) = AE : EC', w / 2, h - 36, { color: col.s[2], size: 12.5, weight: 700, align: 'center' });
    if (step === 4) text(ctx, 'ar(BDE) = ar(CDE)', w / 2, h - 36, { color: col.s[1], size: 12.5, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
