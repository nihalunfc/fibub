// Class 12 Dual Nature (step player): finding Planck's constant and the work function from a V0-against-frequency graph, as Millikan did.
// Data for a sodium-like metal (V0 = (h/e) nu - phi/e, phi = 2.3 eV, with a little scatter). A straight line through the points has slope
// (V0b - V0a)/(nu_b - nu_a) = h/e; then h = e x slope. The line meets the frequency axis at nu0 = phi/h, so phi = h nu0.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Reading Planck’s constant and the work function from a graph of stopping potential against frequency' });
  const TITLES = ['Measure V₀ for several frequencies', 'Plot the points: they lie close to a line', 'Draw the best straight line', 'Slope = ΔV₀/Δν = h/e', 'h = e × slope', 'Where the line hits the axis: ν₀ and φ₀ = hν₀'];
  const D = [[6, 0.21], [7, 0.58], [8, 1.03], [9, 1.40], [10, 1.87]], q = 0.4136;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, gx0 = 46, gx1 = w - 14, gy0 = top + 6, gy1 = h - 70, X = (v) => gx0 + (v / 11) * (gx1 - gx0), Y = (v) => gy1 - ((v + 0.2) / 2.4) * (gy1 - gy0);
    line(ctx, [[gx0, Y(0)], [gx1, Y(0)]], col.ink, 1.2); line(ctx, [[gx0, gy0], [gx0, gy1]], col.ink, 1.2);
    for (const v of [0, 2, 4, 6, 8, 10]) text(ctx, String(v), X(v), Y(0) + 12, { color: col.muted, size: 10, align: 'center' });
    for (const v of [0.5, 1, 1.5, 2]) { text(ctx, String(v), gx0 - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); line(ctx, [[gx0 - 3, Y(v)], [gx0, Y(v)]], col.ink, 1); }
    text(ctx, 'ν (×10¹⁴ Hz)', gx1, Y(0) + 26, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'V₀ (volts)', gx0 + 6, gy0, { color: col.muted, size: 10.5 });
    if (step === 0) { text(ctx, 'ν  :  6   7   8   9   10', 12, h - 50, { color: col.ink, size: 11.5, weight: 700 }); text(ctx, 'V₀ : 0.21 0.58 1.03 1.40 1.87', 12, h - 30, { color: col.ink, size: 11.5, weight: 700 }); }
    if (step >= 1) D.forEach(([f, v]) => dot(ctx, X(f), Y(v), 4.5, col.s[0], col.ink));
    if (step >= 2) line(ctx, [[X(5.56), Y(0)], [X(10.5), Y(q * 10.5 - 2.3)]], col.s[2], 2.5);
    if (step >= 3) {
      const a = [6, q * 6 - 2.3], b = [10, q * 10 - 2.3];
      line(ctx, [[X(a[0]), Y(a[1])], [X(b[0]), Y(a[1])], [X(b[0]), Y(b[1])]], col.s[3], 1.5, [4, 3]);
      text(ctx, 'Δν = 4', X(8), Y(a[1]) - 8, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'ΔV₀ = 1.66', X(10) + 4, Y((a[1] + b[1]) / 2) + 4, { color: col.s[3], size: 11, weight: 700 });
      if (step === 3) text(ctx, 'slope = 1.66 / (4×10¹⁴) = 4.14×10⁻¹⁵ V s', 12, h - 40, { color: col.s[7], size: 12, weight: 700 });
    }
    if (step >= 4) text(ctx, 'h = e × slope = 1.6×10⁻¹⁹ × 4.14×10⁻¹⁵ = 6.6×10⁻³⁴ J s', 12, h - 40, { color: col.s[7], size: 12, weight: 700 });
    if (step >= 5) {
      dot(ctx, X(5.56), Y(0), 6, col.s[3], col.ink); text(ctx, 'ν₀ = 5.6×10¹⁴ Hz', X(5.56) - 8, Y(0) - 16, { color: col.s[3], size: 11, weight: 700, align: 'right' });
      text(ctx, 'φ₀ = hν₀ = 4.14×10⁻¹⁵ × 5.6×10¹⁴ = 2.3 eV', 12, h - 18, { color: col.s[7], size: 12, weight: 700 });
    }
  };
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
