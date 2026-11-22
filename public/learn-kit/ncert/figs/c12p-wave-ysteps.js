// Class 12 Wave Optics (step player): the fringe-width formula for Young's experiment. Slits S1, S2 a distance d apart, screen a distance D away,
// point P at height y above the centre O. Path difference S2P - S1P = d sin(theta) = d tan(theta) = d y / D for small angles.
// Bright when it is n*lambda: y_n = n lambda D / d. Dark when (n + 1/2) lambda. Neighbouring fringes are beta = lambda D / d apart.
// (The picture is not to scale: D is really thousands of times larger than d, so the two rays are almost parallel.)
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'The geometry behind the fringe width of Young’s experiment' });
  const TITLES = ['Set-up: slits S₁, S₂ (gap d), screen at distance D', 'Two paths to the point P at height y', 'Cut S₂P at N so that PN = PS₁', 'Path difference S₂N = d sin θ ≈ d·y/D', 'Bright fringes: path difference = nλ', 'Dark fringes and the fringe width β = λD/d'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, cy = top + (h - top) * 0.55, x0 = w * 0.1, x1 = w * 0.86, d = 56;
    const S1 = [x0, cy - d / 2], S2 = [x0, cy + d / 2], O = [x1, cy], P = [x1, cy - (h - top) * 0.34];
    line(ctx, [[x0, top + 4], [x0, S1[1] - 2]], col.ink, 4); line(ctx, [[x0, S1[1] + 2], [x0, S2[1] - 2]], col.line, 1); line(ctx, [[x0, S2[1] + 2], [x0, h - 14]], col.ink, 4);
    line(ctx, [[x1, top + 4], [x1, h - 14]], col.ink, 4);
    dot(ctx, ...S1, 4, col.ink); dot(ctx, ...S2, 4, col.ink);
    text(ctx, 'S₁', x0 + 10, S1[1] - 12, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'S₂', x0 + 10, S2[1] + 16, { color: col.ink, size: 12, weight: 700 });
    line(ctx, [[x0 - 14, cy], [x1, cy]], col.line, 1, [5, 4]); dot(ctx, ...O, 4, col.ink); text(ctx, 'O', x1 + 8, cy, { color: col.ink, size: 12, weight: 700 });
    line(ctx, [[x0 - 4, S1[1]], [x0 - 4, S2[1]]], col.s[2], 1.5); text(ctx, 'd', x0 - 10, cy, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    line(ctx, [[x0 + 20, cy + 40], [x1, cy + 40]], col.muted, 1); text(ctx, 'D', (x0 + x1) / 2, cy + 54, { color: col.muted, size: 12, weight: 700, align: 'center' });
    if (step === 0) { text(ctx, 'light spreads from both slits', (x0 + x1) / 2, top + 22, { color: col.s[0], size: 11.5, align: 'center' }); text(ctx, '(not to scale: D is thousands of times d)', (x0 + x1) / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' }); }
    if (step >= 1) {
      dot(ctx, ...P, 5, col.s[3], col.ink); text(ctx, 'P', x1 + 8, P[1], { color: col.ink, size: 12, weight: 700 });
      line(ctx, [S1, P], col.s[0], 2); line(ctx, [S2, P], col.s[1], 2);
      line(ctx, [[x1 + 22, cy], [x1 + 22, P[1]]], col.s[3], 1.2); text(ctx, 'y', x1 + 28, (cy + P[1]) / 2, { color: col.s[3], size: 12, weight: 700 });
      text(ctx, 'S₁P', (x0 + x1) / 2, S1[1] + (P[1] - S1[1]) / 2 - 12, { color: col.s[0], size: 11.5, weight: 700, align: 'center' });
      text(ctx, 'S₂P', (x0 + x1) / 2 + 20, S2[1] + (P[1] - S2[1]) / 2 + 16, { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
    }
    if (step >= 2) {
      const L1 = Math.hypot(P[0] - S1[0], P[1] - S1[1]), L2 = Math.hypot(P[0] - S2[0], P[1] - S2[1]), u = [(S2[0] - P[0]) / L2, (S2[1] - P[1]) / L2];
      const N = [P[0] + u[0] * L1, P[1] + u[1] * L1];
      dot(ctx, ...N, 4, col.ink); text(ctx, 'N', N[0] + 10, N[1] - 8, { color: col.ink, size: 12, weight: 700 }); line(ctx, [S1, N], col.muted, 1.2, [4, 3]);
      if (step >= 3) { line(ctx, [N, S2], col.s[2], 5); text(ctx, 'S₂N = path difference', x0 + 20, S2[1] + 70, { color: col.s[2], size: 11.5, weight: 700 }); }
    }
    if (step === 3) { text(ctx, 'S₁N ⟂ S₂P (almost), so S₂N = d sin θ', x0 + 20, h - 34, { color: col.s[2], size: 11.5, weight: 700 }); text(ctx, 'small θ: sin θ ≈ tan θ = y/D', x0 + 20, h - 16, { color: col.s[2], size: 11.5, weight: 700 }); }
    if (step === 4) { text(ctx, 'dy/D = nλ', x0 + 20, h - 34, { color: col.s[7], size: 13, weight: 700 }); text(ctx, 'y_n = nλD/d  (n = 0, 1, 2 …)', x0 + 20, h - 16, { color: col.s[7], size: 12, weight: 700 }); }
    if (step >= 5) {
      text(ctx, 'dark: dy/D = (n + ½)λ', x0 + 20, h - 52, { color: col.s[7], size: 12, weight: 700 });
      text(ctx, 'β = y_(n+1) − y_n', x0 + 20, h - 34, { color: col.s[7], size: 12, weight: 700 }); text(ctx, 'β = λD/d', x0 + 20, h - 14, { color: col.s[7], size: 14, weight: 700 });
    }
  };
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
