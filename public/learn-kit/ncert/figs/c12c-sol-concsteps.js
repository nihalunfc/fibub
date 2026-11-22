// Class 12 Chemistry, Solutions (step player): from mass percent and density to molality, mole fraction and molarity. Worked example: concentrated HCl, 37 % by mass, density 1.19 g/mL.
// Take 100 g of solution: 37 g HCl (M = 36.5) and 63 g water. n(HCl) = 1.014 mol, n(water) = 3.50 mol. molality = 1.014/0.063 = 16.1 mol/kg; x(HCl) = 1.014/4.514 = 0.225;
// volume = 100/1.19 = 84.0 mL, molarity = 1.014/0.0840 = 12.1 mol/L.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Choose 100 g of solution', 'Split it using the mass percent', 'Convert masses to moles', 'Molality and mole fraction', 'Molarity needs the volume'];
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'A 100 gram sample of 37 percent hydrochloric acid worked into molality mole fraction and molarity' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 12, L = 16, W = w - 32;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, t0, W, 34);
    if (step >= 1) { ctx.fillStyle = col.s[2]; ctx.fillRect(L + 1, t0 + 1, (W - 2) * 0.37, 32); ctx.fillStyle = col.s[0]; ctx.fillRect(L + 1 + (W - 2) * 0.37, t0 + 1, (W - 2) * 0.63, 32); text(ctx, '37 g HCl', L + 6, t0 + 17, { color: col.panel, size: 11, weight: 700 }); text(ctx, '63 g water', L + W * 0.37 + 8, t0 + 17, { color: col.panel, size: 11.5, weight: 700 }); }
    else text(ctx, '100 g of 37 % HCl solution (ρ = 1.19 g/mL)', L + W / 2, t0 + 17, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const rows = [
      [2, 'n(HCl) = 37 / 36.5 = 1.014 mol', col.ink], [2, 'n(water) = 63 / 18 = 3.50 mol', col.ink],
      [3, 'molality = 1.014 mol / 0.063 kg = 16.1 mol/kg', col.s[3]], [3, 'x(HCl) = 1.014 / (1.014 + 3.50) = 0.225', col.s[3]],
      [4, 'volume = 100 g / 1.19 g/mL = 84.0 mL = 0.0840 L', col.ink], [4, 'molarity = 1.014 mol / 0.0840 L = 12.1 mol/L', col.s[2]]];
    rows.forEach(([s, str, c], i) => { if (step >= s) text(ctx, str, L, t0 + 62 + i * 30, { color: c, size: 12, weight: 700 }); });
    if (step === 0) { text(ctx, 'Any amount would do, 100 g makes the', L, t0 + 70, { color: col.muted, size: 12 }); text(ctx, 'percent into grams at once.', L, t0 + 90, { color: col.muted, size: 12 }); }
    if (step === 1) { text(ctx, 'mass of HCl = 37 g, mass of water = 100 − 37 = 63 g', L, t0 + 70, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'solvent = water = 0.063 kg', L, t0 + 94, { color: col.muted, size: 12 }); }
    if (step === 4) text(ctx, 'Molarity per litre of SOLUTION, molality per kg of SOLVENT.', L, h - 22, { color: col.muted, size: 10.5 });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
