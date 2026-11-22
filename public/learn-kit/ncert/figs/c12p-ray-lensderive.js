// Class 12 Ray Optics (step player): from one spherical refracting surface to the lens maker's formula. For small angles,
// the exterior-angle rule gives i = alpha + gamma and r = gamma - beta; Snell's law n1 i = n2 r then gives
// n2/v - n1/u = (n2 - n1)/R. A thin lens is two such surfaces: the first image acts as the object of the second, and adding
// the two equations cancels the middle image: 1/v - 1/u = (n - 1)(1/R1 - 1/R2), so 1/f = (n - 1)(1/R1 - 1/R2).
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.84, max: 440, min: 300, label: 'A spherical refracting surface with small angles marked, then a thin lens made of two surfaces' });
  const TT = ['1. One curved surface', '2. Small angles: i = α + γ, r = γ − β', '3. Snell’s law gives the surface formula', '4. Surface 1 makes an image I₁', '5. I₁ is the object for surface 2', '6. Add: the lens maker’s formula'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const cy = top + 78, s = (w - 40) / 32, px = 20 + 12 * s;
    line(ctx, [[8, cy], [w - 8, cy]], col.line, 1);
    const Rpx = 3 * s * 1.9;
    const surf = (x, rad, c, lw = 3.5) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x + rad, cy, rad, Math.PI - 0.8, Math.PI + 0.8); ctx.stroke(); ctx.restore(); };
    const lab = (t, x, y, c = col.ink, al = 'center') => text(ctx, t, x, y, { color: c, size: 11.5, weight: 700, align: al, halo: col.panel });
    if (step <= 2) {
      surf(px, Rpx, col.ink);
      const O = [20, cy], Cc = [px + Rpx, cy], I = [px + 18 * s, cy], yM = cy - 34;
      const xM = px + (Rpx - Math.sqrt(Rpx * Rpx - 34 * 34));
      ctx.save(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.5; ctx.fillRect(px, cy - 90, w - px - 8, 180); ctx.globalAlpha = 0.0; ctx.restore();
      line(ctx, [O, [xM, yM], I], col.s[0], 2); line(ctx, [[xM, yM], Cc], col.muted, 1.3, [4, 4]); line(ctx, [[xM, yM], [xM, cy]], col.muted, 1, [3, 3]);
      for (const [p, l, dy] of [[O, 'O', 14], [[px, cy], 'P', 14], [Cc, 'C', 14], [I, 'I', 14]]) { dot(ctx, p[0], p[1], 3, col.ink); lab(l, p[0], p[1] + dy); }
      lab('n₁', 60, cy - 70, col.muted); lab('n₂', w - 50, cy - 70, col.muted); lab('M', xM - 6, yM - 8);
      if (step >= 1) { lab('α', O[0] + 48, cy - 5, col.s[1]); lab('β', I[0] - 38, cy - 5, col.s[2]); lab('γ', Cc[0] - 28, cy - 5, col.s[4]); lab('i', xM - 20, yM + 20, col.s[1]); lab('r', xM + 20, yM + 16, col.s[2]); }
      const T = [['Light goes from medium n₁ to n₂ at a surface of radius R', 'and centre C. Object O at distance u, image I at distance v.'], ['Exterior angle of ΔOMC: i = α + γ.  Of ΔMCI: γ = r + β,', 'so r = γ − β. Small angles: α ≈ MN/u, γ ≈ MN/R, β ≈ MN/v.'], ['n₁i = n₂r →  n₁(1/u + 1/R) = n₂(1/R − 1/v). With signs', '(u < 0):  n₂/v − n₁/u = (n₂ − n₁)/R.']][step];
      text(ctx, T[0], 10, h - 32, { color: col.ink, size: 11, weight: 600 }); text(ctx, T[1], 10, h - 14, { color: col.ink, size: 11, weight: 600 });
    } else {
      const x1 = w / 2 - 14, x2 = w / 2 + 14, rad = 140, hh = 52, sag = rad - Math.sqrt(rad * rad - hh * hh);
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3.5; ctx.fillStyle = col.soft;
      ctx.beginPath(); ctx.arc(x1 + rad, cy, rad, Math.PI + Math.asin(hh / rad), Math.PI - Math.asin(hh / rad), true); ctx.arc(x2 - rad, cy, rad, Math.asin(hh / rad), -Math.asin(hh / rad), true); ctx.closePath(); ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
      const O = [24, cy], M1 = [x1 - 14, cy - 34], I1 = [w - 30, cy], I = [w - 96, cy];
      const yAt = (x) => M1[1] + (cy - M1[1]) * (x - M1[0]) / (I1[0] - M1[0]), M2 = [x2 + 10, yAt(x2 + 10)];
      dot(ctx, O[0], cy, 3, col.ink); lab('O', O[0], cy + 14);
      line(ctx, [O, M1], col.s[0], 2);
      if (step === 3) line(ctx, [M1, I1], col.s[0], 2); else { line(ctx, [M1, M2], col.s[0], 2); line(ctx, [M2, I1], col.s[0], 1.5, [5, 4]); line(ctx, [M2, I], col.s[2], 2); }
      dot(ctx, I1[0], cy, 4, col.s[1]); lab('I₁', I1[0], cy + 14, col.s[1]);
      if (step >= 4) { dot(ctx, I[0], cy, 4, col.s[2]); lab('I', I[0], cy + 14, col.s[2]); }
      lab('lens made of glass, index n, in air', w / 2, cy + 64, col.muted);
      const T = [null, null, null, ['Surface 1 alone (air to glass), radius R₁, object at u:', 'n/v₁ − 1/u = (n − 1)/R₁'], ['Surface 2 (glass to air), radius R₂: its object is I₁, so', '1/v − n/v₁ = (1 − n)/R₂'], ['Add: 1/v − 1/u = (n − 1)(1/R₁ − 1/R₂). For u → ∞, v = f:', '1/f = (n − 1)(1/R₁ − 1/R₂); in a medium use n = n_lens/n_medium.']][step];
      text(ctx, T[0], 10, h - 32, { color: col.ink, size: 11, weight: 600 }); text(ctx, T[1], 10, h - 14, { color: col.ink, size: 11, weight: 600 });
    }
  };
  return { step(i) { step = Math.min(5, i); cv.redraw(); } };
}
