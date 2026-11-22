// Class 12 Dual Nature (step player): the de Broglie wavelength of an electron accelerated through a potential difference V.
// Work done eV = kinetic energy (1/2) m v^2, so p = sqrt(2 m e V) and lambda = h / p = h / sqrt(2 m e V) = 1.227 / sqrt(V) nm (V in volts).
// Example: V = 150 V gives 0.100 nm, about the spacing of atoms in a crystal, which is why crystals can diffract electrons.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';
import { wavy } from '../c12p-optlib.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'An electron accelerated through a potential difference and its de Broglie wavelength' });
  const TITLES = ['An electron at rest meets a potential difference V', 'It gains kinetic energy: eV = ½mv²', 'Solve for the momentum: p = √(2meV)', 'de Broglie: λ = h/p = h/√(2meV)', 'Put in h, m, e: λ = 1.227/√V nm', 'V = 150 V gives λ = 0.100 nm, an atom’s size'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, cy = top + (h - top) * 0.3, x0 = w * 0.14, x1 = w * 0.86;
    line(ctx, [[x0, cy - 36], [x0, cy + 36]], col.ink, 5); line(ctx, [[x1, cy - 36], [x1, cy + 36]], col.ink, 5);
    text(ctx, '−', x0 - 12, cy, { color: col.ink, size: 16, weight: 700, align: 'center' }); text(ctx, '+', x1 + 12, cy, { color: col.ink, size: 16, weight: 700, align: 'center' });
    text(ctx, 'V', (x0 + x1) / 2, cy - 44, { color: col.s[1], size: 13, weight: 700, align: 'center' });
    line(ctx, [[x0, cy - 36], [x1, cy - 36]], col.line, 1, [4, 3]);
    const pos = step === 0 ? 0.02 : step === 1 ? 0.45 : 0.9, ex = x0 + 10 + pos * (x1 - x0 - 20);
    dot(ctx, ex, cy, 6, col.s[0]);
    if (step >= 1) arrow(ctx, ex + 8, cy, ex + 8 + 20 + 40 * (step >= 1 ? pos : 0), cy, col.s[0], 3, 9), text(ctx, 'v', ex + 40, cy - 12, { color: col.s[0], size: 12, weight: 700 });
    // KE bar and lines of algebra
    const lines = [['', ''], ['W = eV = K = ½mv²', ''], ['v = √(2eV/m)', 'p = mv = √(2meV)'], ['λ = h/p', 'λ = h / √(2meV)'], ['h = 6.63×10⁻³⁴, m = 9.11×10⁻³¹, e = 1.6×10⁻¹⁹', 'λ = 1.227/√V  nm'], ['V = 150 V → λ = 1.227/12.25 nm', '≈ 0.100 nm = 1.00 Å']];
    const L = lines[step]; let y = cy + 66;
    if (step >= 1) { text(ctx, L[0], w / 2, y, { color: col.ink, size: 13, weight: 700, align: 'center' }); y += 24; }
    if (L[1]) text(ctx, L[1], w / 2, y, { color: col.s[7], size: 14, weight: 700, align: 'center' });
    // wave strip
    if (step >= 3) { const wl = step >= 5 ? 22 : 36; wavy(ctx, 16, w - 16, h - 40, 14, wl, 0, col.s[2], 2.5); text(ctx, step >= 5 ? 'shorter wavelength at higher V' : 'the electron behaves like a wave', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' }); }
  };
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
