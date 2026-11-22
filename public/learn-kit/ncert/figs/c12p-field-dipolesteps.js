// Class 12 Electric Charges and Fields (step player): the field of an electric dipole (charges +q and -q, 2a apart, p = 2aq).
// Steps 0-2: a point P on the axis, distance r from the centre. E+ (away from +q) is larger than E- (toward -q); they point opposite ways,
// so E = kq[1/(r-a)^2 - 1/(r+a)^2] = 2kpr/(r^2-a^2)^2 -> 2kp/r^3 for r >> a, along p.
// Steps 3-5: P on the equatorial line. Equal distances sqrt(r^2+a^2); the parts along the axis add and point opposite to p, the others cancel: E = kp/r^3.
import { canvas, text, title, dot, arrow, line } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'The field of a dipole at an axial point and at an equatorial point' });
  const TITLES = ['Axial point P: distances r − a and r + a', 'The two fields point opposite ways', 'Subtract: E = 2kp/r³ along p', 'Equatorial point: equal distances √(r² + a²)', 'Vertical parts cancel, horizontal parts add', 'Result: E = kp/r³, opposite to p'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const O = [w * 0.34, h * 0.7], a = Math.min(34, w * 0.09), eqStep = step >= 3;
    const plus = [O[0] + a, O[1]], minus = [O[0] - a, O[1]];
    line(ctx, [[10, O[1]], [w - 10, O[1]]], col.line, 1, [5, 4]);
    dot(ctx, ...plus, 11, col.s[2]); dot(ctx, ...minus, 11, col.s[0]);
    text(ctx, '+q', plus[0], plus[1], { color: col.panel, size: 11, weight: 700, align: 'center' }); text(ctx, '−q', minus[0], minus[1], { color: col.panel, size: 11, weight: 700, align: 'center' });
    arrow(ctx, minus[0] + 14, O[1] + 24, plus[0] - 14, O[1] + 24, col.ink, 2); text(ctx, 'p', O[0], O[1] + 38, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const PA = [w * 0.74, O[1]], PE = [O[0], O[1] - 100];
    const P = eqStep ? PE : PA;
    if (!eqStep) {
      dot(ctx, ...PA, 6, col.s[3]); text(ctx, 'P', PA[0], PA[1] - 14, { color: col.s[3], size: 13, weight: 700, align: 'center' });
      text(ctx, 'r − a', (plus[0] + PA[0]) / 2, O[1] - 76, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'r + a', (minus[0] + PA[0]) / 2 - 20, O[1] + 78, { color: col.muted, size: 11, align: 'center' });
      line(ctx, [[plus[0], O[1] - 66], [PA[0], O[1] - 66]], col.muted, 1); line(ctx, [[minus[0], O[1] + 66], [PA[0], O[1] + 66]], col.muted, 1);
      if (step >= 1) {
        arrow(ctx, PA[0] + 2, PA[1] - 24, PA[0] + 58, PA[1] - 24, col.s[2], 3); text(ctx, 'E₊ (big)', PA[0] - 4, PA[1] - 40, { color: col.s[2], size: 11, weight: 700, align: 'center' });
        arrow(ctx, PA[0] + 2, PA[1] + 24, PA[0] - 34, PA[1] + 24, col.s[0], 3); text(ctx, 'E₋ (smaller)', PA[0] - 6, PA[1] + 38, { color: col.s[0], size: 11, weight: 700, align: 'center' });
      }
      if (step >= 2) { arrow(ctx, PA[0] + 10, PA[1] - 2, PA[0] + 64, PA[1] - 2, col.s[7], 4.5); text(ctx, 'E = E₊ − E₋', w - 12, h - 50, { color: col.s[7], size: 12.5, weight: 700, align: 'right' }); text(ctx, '= 2kp/r³ (r ≫ a)', w - 12, h - 32, { color: col.s[7], size: 12.5, weight: 700, align: 'right' }); }
    } else {
      dot(ctx, ...PE, 6, col.s[3]); text(ctx, 'P', PE[0] + 12, PE[1] - 6, { color: col.s[3], size: 13, weight: 700 });
      line(ctx, [plus, PE], col.muted, 1, [4, 3]); line(ctx, [minus, PE], col.muted, 1, [4, 3]); line(ctx, [O, PE], col.line, 1);
      text(ctx, '√(r² + a²)', plus[0] + 6, (plus[1] + PE[1]) / 2, { color: col.muted, size: 11 });
      text(ctx, 'r', O[0] + 6, (O[1] + PE[1]) / 2 - 20, { color: col.muted, size: 11 });
      const unit = (p, q2) => { const d = [p[0] - q2[0], p[1] - q2[1]], L = Math.hypot(...d); return [d[0] / L, d[1] / L]; };
      const up = unit(PE, plus), um = unit(minus, PE), f = 46; // E+ away from +q ; E- toward -q
      const x0 = PE[0], y0 = PE[1];
      if (step >= 3 && step < 5) {
        arrow(ctx, x0, y0, x0 + up[0] * f, y0 + up[1] * f, col.s[2], 3); arrow(ctx, x0, y0, x0 + um[0] * f, y0 + um[1] * f, col.s[0], 3);
        text(ctx, 'E₊', x0 + up[0] * f - 8, y0 + up[1] * f - 6, { color: col.s[2], size: 12, weight: 700, align: 'right' });
        text(ctx, 'E₋', x0 + um[0] * f - 8, y0 + um[1] * f + 6, { color: col.s[0], size: 12, weight: 700, align: 'right' });
      }
      if (step === 4) {
        line(ctx, [[x0 + up[0] * f, y0 + up[1] * f], [x0 + up[0] * f, y0]], col.s[5], 1.5, [3, 3]); line(ctx, [[x0 + um[0] * f, y0 + um[1] * f], [x0 + um[0] * f, y0]], col.s[5], 1.5, [3, 3]);
        arrow(ctx, x0, y0 + 2, x0 + up[0] * f, y0 + 2, col.s[5], 3); arrow(ctx, x0, y0 - 2, x0 + um[0] * f, y0 - 2, col.s[5], 3);
        text(ctx, 'up and down parts cancel,', w - 10, O[1] + 44, { color: col.s[5], size: 11.5, align: 'right', weight: 700 }); text(ctx, 'left parts add', w - 10, O[1] + 60, { color: col.s[5], size: 11.5, align: 'right', weight: 700 });
      }
      if (step >= 5) { arrow(ctx, x0, y0, x0 + up[0] * f * 2, y0, col.s[7], 4.5); text(ctx, 'E = kp/r³, opposite to p', w - 10, O[1] + 44, { color: col.s[7], size: 12.5, weight: 700, align: 'right' }); text(ctx, 'exact: kp ÷ (r² + a²)^1.5', w - 10, O[1] + 60, { color: col.s[7], size: 11, align: 'right' }); }
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
