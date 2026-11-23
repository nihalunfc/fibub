// Class 11 Units and Measurement (step player): deriving a formula by dimensional analysis. Suppose the period T of a simple pendulum depends on its mass m,
// length l and g: T = k m^a l^b g^c. Matching the powers of M, L and T on both sides gives a = 0, b = 1/2, c = -1/2, so T = k sqrt(l/g). Dimensions cannot
// give the pure number k (it is 2 pi, found by experiment or calculus).
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 290, label: 'Working out the pendulum period formula from dimensions' });
  const T = ['Guess what T depends on', 'Dimensions of each quantity', 'Dimensions of the right side', 'Match powers of M, L and T', 'Solve for a, b and c', 'The formula'];
  cv.draw = (ctx, w, h, col) => {
    const k = h / 390, tx = (s, x, y, o) => text(ctx, s, x, y * k, o);
    title(ctx, T[step], col);
    const line1 = (s, y, c, sz = 15) => tx(s, w / 2, y, { size: sz, weight: 700, color: c ?? col.ink, align: 'center' });
    line1('T = k · mᵃ · lᵇ · gᶜ', 56, col.s[0], 19);
    if (step === 0) { tx('mass m, length l, gravity g: which can matter?', w / 2, 100, { size: 12.5, color: col.muted, align: 'center' }); tx('k is a pure number, a b c are unknown powers', w / 2, 124, { size: 12.5, color: col.muted, align: 'center' }); }
    if (step >= 1) [['[T] = T', 'time'], ['[m] = M', 'mass'], ['[l] = L', 'length'], ['[g] = L T⁻²', 'acceleration']].forEach(([a, b], i) => { tx(a, w * 0.12, 98 + i * 26, { size: 14, weight: 700, color: col.s[i + 1] }); tx(b, w * 0.62, 98 + i * 26, { size: 12, color: col.muted }); });
    if (step >= 2) { line1('T = Mᵃ · Lᵇ · (L T⁻²)ᶜ', 216, col.ink); line1('T¹ = Mᵃ · Lᵇ⁺ᶜ · T⁻²ᶜ', 242, col.s[2]); }
    if (step >= 3) { tx('M:  a = 0', w * 0.12, 278, { size: 13.5, weight: 700, color: col.s[1] }); tx('L:  b + c = 0', w * 0.12, 300, { size: 13.5, weight: 700, color: col.s[2] }); tx('T:  −2c = 1', w * 0.12, 322, { size: 13.5, weight: 700, color: col.s[3] }); }
    if (step >= 4) { tx('→ a = 0', w * 0.62, 278, { size: 13.5, weight: 700, color: col.s[1] }); tx('→ b = ½', w * 0.62, 300, { size: 13.5, weight: 700, color: col.s[2] }); tx('→ c = −½', w * 0.62, 322, { size: 13.5, weight: 700, color: col.s[3] }); }
    if (step >= 5) tx('T = k √(l/g)   (k = 2π, from experiment)', w / 2, 368, { size: 14.5, weight: 700, color: col.s[0], align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
