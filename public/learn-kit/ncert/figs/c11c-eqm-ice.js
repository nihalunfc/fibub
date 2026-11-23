// Class 11 Chemistry, Equilibrium (step player): an ICE table for H2 + I2 <=> 2HI, K = 50, starting from 1.00 mol/L H2 and 1.00 mol/L I2.
// Initial 1, 1, 0. Change -x, -x, +2x. Equilibrium 1-x, 1-x, 2x. K = (2x)^2/(1-x)^2 = 50, take square roots: 2x/(1-x) = 7.07, x = 0.780. [H2] = [I2] = 0.22, [HI] = 1.56. Check: 1.56^2 / 0.22^2 = 50.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Write the equilibrium and its K', 'Initial row (I)', 'Change row (C): let x react', 'Equilibrium row (E)', 'Put the E row into K and solve', 'Find the concentrations and check'];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'ICE table for the hydrogen iodine equilibrium filled step by step' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col), L = 12, cw = (w - 24) / 4;
    text(ctx, 'H₂ + I₂  ⇌  2HI,   K = 50', w / 2, t0 + 20, { color: col.ink, size: 14, weight: 700, align: 'center' });
    const rows = [['', '[H₂]', '[I₂]', '[HI]'], ['I', '1.00', '1.00', '0'], ['C', '−x', '−x', '+2x'], ['E', '1 − x', '1 − x', '2x']], y0 = t0 + 54;
    rows.forEach((r, i) => { if (i > 0 && step < i) return; r.forEach((c, j) => { text(ctx, c, L + j * cw + cw / 2, y0 + i * 30, { color: i === 0 ? col.muted : j === 0 ? col.s[3] : col.ink, size: 13.5, weight: i === 0 || j === 0 ? 700 : 500, align: 'center' }); }); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y0 + i * 30 + 15); ctx.lineTo(w - L, y0 + i * 30 + 15); ctx.stroke(); });
    const y1 = y0 + 4 * 30 + 12;
    if (step >= 4) { text(ctx, 'K = (2x)² / [(1 − x)(1 − x)] = 50', w / 2, y1, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'take the square root of both sides:', w / 2, y1 + 24, { color: col.muted, size: 11.5, align: 'center' }); text(ctx, '2x / (1 − x) = 7.07   →   x = 0.780', w / 2, y1 + 48, { color: col.s[2], size: 13.5, weight: 700, align: 'center' }); }
    if (step >= 5) { text(ctx, '[H₂] = [I₂] = 1 − 0.780 = 0.22 mol/L', w / 2, y1 + 82, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); text(ctx, '[HI] = 2 × 0.780 = 1.56 mol/L', w / 2, y1 + 104, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); text(ctx, 'check: 1.56² / 0.22² = 50 ✓', w / 2, y1 + 130, { color: col.good, size: 12.5, weight: 700, align: 'center' }); }
    if (step < 4) text(ctx, step === 0 ? 'Start with 1.00 mol/L each of H₂ and I₂ and no HI.' : step === 1 ? 'What you put in: concentrations at the start.' : step === 2 ? 'x mol/L of H₂ and of I₂ react; 2x of HI form (ratio 1:1:2).' : 'Initial plus change gives the equilibrium values.', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
