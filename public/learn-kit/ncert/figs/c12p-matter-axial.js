// Class 12 Magnetism and Matter (step player): the field of a short bar magnet on its axis, from its two poles (+qm at N, −qm at S, 2l apart).
// B = (μ0/4π) qm [1/(r−l)² − 1/(r+l)²] = (μ0/4π) 2 m r /(r²−l²)², with m = qm·2l. For r ≫ l: B_axial = μ0 2m/4πr³ and, on the
// equatorial line, B_equatorial = μ0 m/4πr³, pointing the opposite way: the axial field is twice as strong.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';
import { barMagnet } from '../c12p-mmlib.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'The field of a short bar magnet at a point on its axis' });
  const TITLES = ['Two poles +qm and −qm, a distance 2l apart', 'The north pole pushes P away', 'The south pole pulls P in', 'The resultant is the difference', 'Put them together and simplify', 'A short magnet (r ≫ l): axial and equatorial'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const cy = top + (h - top) * 0.36, cx = w * 0.26, l = 34, Px = w * 0.8;
    barMagnet(ctx, cx, cy, 2 * l, 24, col);
    text(ctx, '+qm', cx + l, cy - 24, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, '−qm', cx - l, cy - 24, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    line(ctx, [[cx - l - 20, cy], [w - 8, cy]], col.line, 1, [3, 4]); dot(ctx, Px, cy, 5, col.ink); text(ctx, 'P', Px + 6, cy + 14, { color: col.ink, size: 13, weight: 700 });
    line(ctx, [[cx, cy + 40], [Px, cy + 40]], col.muted, 1); text(ctx, 'r', (cx + Px) / 2, cy + 52, { color: col.muted, size: 12, weight: 700, align: 'center' });
    line(ctx, [[cx + l, cy + 14], [cx + l, cy + 44]], col.line, 1); line(ctx, [[cx, cy + 14], [cx, cy + 44]], col.line, 1);
    const sc = 5200 / ((Px - cx - l) ** 2) * 1; const LN = 70, LS = LN * ((Px - cx - l) / (Px - cx + l)) ** 2;
    const msg = (a, b) => { if (a) text(ctx, a, w / 2, h - 40, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); if (b) text(ctx, b, w / 2, h - 20, { color: col.muted, size: 11, align: 'center' }); };
    if (step === 1) { arrow(ctx, Px, cy - 18, Px + LN * 0.7, cy - 18, col.s[1], 3.5, 10); text(ctx, 'B_N', Px + 20, cy - 30, { color: col.s[1], size: 12, weight: 700 }); msg('B_N = μ0 qm / 4π (r − l)²', 'pointing away from N'); }
    if (step >= 2 && step < 5) { arrow(ctx, Px, cy - 18, Px + LN * 0.7, cy - 18, col.s[1], 3, 9); arrow(ctx, Px, cy + 18, Px - LS * 0.7, cy + 18, col.s[0], 3, 9); text(ctx, 'B_S', Px - LS * 0.7 - 4, cy + 32, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'B_N', Px + 20, cy - 30, { color: col.s[1], size: 12, weight: 700 }); }
    if (step === 2) msg('B_S = μ0 qm / 4π (r + l)²', 'pointing towards S; smaller because S is farther away');
    if (step === 3) { arrow(ctx, Px - 20, cy + 54, Px + (LN - LS) * 0.7 + 4, cy + 54, col.good, 4, 10); msg('B = B_N − B_S, along the axis', 'the nearer pole wins, so B points the way N points');
    }
    if (step === 4) { text(ctx, 'B = (μ0qm/4π) [1/(r−l)² − 1/(r+l)²]', w / 2, h - 62, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, '= (μ0qm/4π) 4rl /(r² − l²)²', w / 2, h - 44, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, '= (μ0/4π) 2 m r /(r² − l²)²   with m = qm·2l', w / 2, h - 24, { color: col.s[3], size: 12, weight: 700, align: 'center' }); }
    if (step === 5) {
      const qx = cx, qy = cy + 74; dot(ctx, qx, qy, 5, col.ink); text(ctx, 'Q', qx + 8, qy + 12, { color: col.ink, size: 13, weight: 700 }); arrow(ctx, qx, qy, qx - 40, qy, col.s[2], 3.5, 10);
      text(ctx, 'B_eq = μ0 m / 4π r³ (opposite to m)', qx + 20, qy + 3, { color: col.s[2], size: 11, weight: 700 });
      text(ctx, 'B_axial = μ0 2m / 4π r³ (along m)', w / 2, h - 30, { color: col.s[3], size: 12, weight: 700, align: 'center' }); text(ctx, 'axial = 2 × equatorial', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
      arrow(ctx, Px, cy - 18, Px + 56, cy - 18, col.s[3], 3.5, 10);
    }
    if (step === 0) msg('Pole strength qm (A m); magnetic moment m = qm × 2l', 'P is on the axis, a distance r from the centre');
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); cv.redraw(); } };
}
