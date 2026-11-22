// Class 12 Electromagnetic Waves (step player): Maxwell's number. Electricity gives eps0 = 8.854e-12 (Coulomb's law),
// magnetism gives mu0 = 4 pi e-7 (the force between currents). Multiply, take the reciprocal and the square root:
// c = 1/sqrt(mu0 eps0) = 2.998e8 m/s, the measured speed of light. So light is an electromagnetic wave.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'Steps that turn the electric and magnetic constants into the speed of light' });
  const TT = ['1. Two constants from two different experiments', '2. Multiply them', '3. Take the reciprocal', '4. Take the square root', '5. It matches the speed of light'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const box = (x, y, bw, bh, lines, c, fill) => {
      ctx.save(); ctx.fillStyle = fill ? col.soft : col.panel; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 8); ctx.fill(); ctx.stroke(); ctx.restore();
      lines.forEach((l, i) => text(ctx, l, x + bw / 2, y + 18 + i * 19, { color: i === 0 ? c : col.ink, size: i === 0 ? 12 : 12.5, weight: i === 0 ? 700 : 600, align: 'center' }));
    };
    const bw = (w - 36) / 2, y0 = top + 14;
    box(12, y0, bw, 62, ['Electricity: ε₀', '8.854 × 10⁻¹² F/m', 'from Coulomb’s law'], col.s[0], step === 0);
    box(24 + bw, y0, bw, 62, ['Magnetism: μ₀', '1.257 × 10⁻⁶ N/A²', 'from forces on currents'], col.s[1], step === 0);
    const fw = w - 24;
    if (step >= 1) { arrow(ctx, w / 2, y0 + 66, w / 2, y0 + 84, col.muted, 2, 7); box(12, y0 + 86, fw, 44, ['μ₀ε₀', '= 1.113 × 10⁻¹⁷ s²/m²'], col.s[2], step === 1); }
    if (step >= 2) { arrow(ctx, w / 2, y0 + 134, w / 2, y0 + 150, col.muted, 2, 7); box(12, y0 + 152, fw, 44, ['1/(μ₀ε₀)', '= 8.988 × 10¹⁶ m²/s²'], col.s[4], step === 2); }
    if (step >= 3) { arrow(ctx, w / 2, y0 + 200, w / 2, y0 + 216, col.muted, 2, 7); box(12, y0 + 218, fw, 44, ['c = 1/√(μ₀ε₀)', '= 2.998 × 10⁸ m/s'], col.s[3], step === 3); }
    if (step >= 4) text(ctx, 'Exactly the speed of light Fizeau measured in 1849: light is an EM wave.', w / 2, y0 + 280, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
