// Class 12 Ray Optics (step player): the prism formula. At the two faces the angles inside satisfy r1 + r2 = A (from the
// quadrilateral with two right angles), and the total deviation is delta = i + e - A. By symmetry (a ray can be reversed)
// delta is least when i = e and r1 = r2 = A/2, so n = sin((A + D_m)/2) / sin(A/2). Picture: A = 60 degrees, n = 1.5, D_m = 37.2 degrees.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.84, max: 440, min: 300, label: 'Ray through a prism at minimum deviation with the angles used in the derivation' });
  const TT = ['1. Ray through the prism', '2. Normals meet: r₁ + r₂ = A', '3. Total deviation δ = i + e − A', '4. Least deviation: i = e', '5. The refractive index'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const A = (60 * Math.PI) / 180, cx = w / 2, ya = top + 18, Ls = Math.min(w * 0.46, (h - top - 80) / Math.cos(A / 2)), hx = Ls * Math.sin(A / 2), by = ya + Ls * Math.cos(A / 2);
    const Ap = [cx, ya], BL = [cx - hx, by], BR = [cx + hx, by];
    ctx.save(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(...Ap); ctx.lineTo(...BL); ctx.lineTo(...BR); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
    const P1 = [cx - hx / 2, (ya + by) / 2], P2 = [cx + hx / 2, (ya + by) / 2], phi = (18.59 * Math.PI) / 180, u = Math.min(70, w * 0.2);
    const N = [cx, P1[1] + (cx - P1[0]) * Math.tan(A / 2)];
    const lab = (t, x, y, c = col.ink) => text(ctx, t, x, y, { color: c, size: 12, weight: 700, align: 'center', halo: col.panel });
    // normals
    const nl = 46;
    line(ctx, [[P1[0] - nl * Math.cos(A / 2), P1[1] + nl * Math.sin(A / 2) * -1], [step >= 1 ? N[0] : P1[0] + nl * Math.cos(A / 2), step >= 1 ? N[1] : P1[1] + nl * Math.sin(A / 2)]], col.muted, 1.3, [4, 4]);
    line(ctx, [[P2[0] + nl * Math.cos(A / 2), P2[1] - nl * Math.sin(A / 2)], [step >= 1 ? N[0] : P2[0] - nl * Math.cos(A / 2), step >= 1 ? N[1] : P2[1] + nl * Math.sin(A / 2)]], col.muted, 1.3, [4, 4]);
    const inc = [[P1[0] - u * Math.cos(phi), P1[1] + u * Math.sin(phi)], P1], em = [P2, [P2[0] + u * Math.cos(phi), P2[1] + u * Math.sin(phi)]];
    line(ctx, inc, col.s[0], 2.5); line(ctx, [P1, P2], col.s[0], 2.5); line(ctx, em, col.s[0], 2.5);
    dot(ctx, ...P1, 3.5, col.ink); dot(ctx, ...P2, 3.5, col.ink);
    if (step === 0) { lab('i', P1[0] - 38, P1[1] - 16, col.s[1]); lab('r₁', P1[0] + 20, P1[1] - 12, col.s[2]); lab('r₂', P2[0] - 20, P2[1] - 12, col.s[2]); lab('e', P2[0] + 36, P2[1] - 14, col.s[1]); lab('A', Ap[0], Ap[1] + 34, col.s[4]); }
    if (step >= 1) { dot(ctx, ...N, 4, col.s[3]); lab('N', N[0], N[1] + 14, col.s[3]); lab('180° − A', N[0], N[1] - 22, col.s[3]); ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(...P1); ctx.lineTo(...N); ctx.lineTo(...P2); ctx.closePath(); ctx.fill(); ctx.restore(); lab('r₁', P1[0] + 22, P1[1] - 12, col.s[2]); lab('r₂', P2[0] - 22, P2[1] - 12, col.s[2]); }
    if (step >= 2) {
      const D = [cx, P1[1] - (cx - P1[0]) * Math.tan(phi)];
      line(ctx, [P1, D], col.s[3], 1.6, [5, 4]); line(ctx, [P2, D], col.s[3], 1.6, [5, 4]); lab('δ', D[0], D[1] - 12, col.s[3]);
      lab('i − r₁', P1[0] - 38, P1[1] - 16, col.s[1]); lab('e − r₂', P2[0] + 40, P2[1] - 14, col.s[1]);
    }
    const T = [
      ['A ray enters face AB at angle of incidence i, refracts at r₁,', 'meets face AC at r₂ inside and leaves at angle of emergence e.'],
      ['Normals at the faces make 90° with each: in the quadrilateral', 'the angle at N is 180° − A, so in ΔP₁NP₂: r₁ + r₂ = A.'],
      ['Bend at face 1: i − r₁. Bend at face 2: e − r₂. Add them:', 'δ = (i − r₁) + (e − r₂) = i + e − (r₁ + r₂) = i + e − A.'],
      ['δ against i is a U shape, least when the ray is symmetric: i = e,', 'so r₁ = r₂ = A/2, and δ = D_m = 2i − A, giving i = (A + D_m)/2.'],
      ['n = sin i / sin r₁ gives', 'n = sin[(A + D_m)/2] / sin(A/2):  here sin 48.6° / sin 30° = 1.5.'],
    ][step];
    text(ctx, T[0], 10, h - 32, { color: col.ink, size: 11, weight: 600 }); text(ctx, T[1], 10, h - 14, { color: col.ink, size: 11, weight: 600 });
  };
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
