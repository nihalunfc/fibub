// Class 12 Chemistry, Electrochemistry (step player): Kohlrausch's law of independent migration of ions. At infinite dilution each ion contributes its own fixed share to the molar conductivity,
// whatever the other ion is. So the limiting value for a weak electrolyte, which cannot be found by extrapolation, comes from strong electrolytes:
// L0(CH3COOH) = L0(HCl) + L0(CH3COONa) - L0(NaCl) = 426.2 + 91.0 - 126.5 = 390.7 S cm2/mol (ion values: H+ 349.6, Cl- 76.6, Na+ 50.1, CH3COO- 40.9). Data: CRC Handbook.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Ions contribute independently', 'Strong electrolytes give the numbers', 'Combine them to cancel Na⁺ and Cl⁻', 'Check with the single-ion values'];
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Bars of ionic conductivities adding to the limiting molar conductivity of ethanoic acid' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 12, L = 14, S = (w - 2 * L) / 460, y = t0;
    const bar = (yy, parts, lab) => { let x = L; parts.forEach(([n, v, c]) => { ctx.fillStyle = c; ctx.fillRect(x, yy, v * S, 24); ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.strokeRect(x, yy, v * S, 24); if (v * S > 22) text(ctx, n, x + v * S / 2, yy + 12, { color: col.panel, size: 10.5, weight: 700, align: 'center' }); x += v * S; }); text(ctx, lab, L, yy - 8, { color: col.ink, size: 11, weight: 700 }); };
    const H = col.s[0], Cl = col.s[2], Na = col.s[3], Ac = col.s[4];
    if (step === 0) { bar(y + 18, [['H⁺', 349.6, H], ['Cl⁻', 76.6, Cl]], 'HCl:  λ(H⁺) + λ(Cl⁻) = 426.2'); bar(y + 70, [['H⁺', 349.6, H], ['Ac⁻', 40.9, Ac]], 'CH₃COOH:  λ(H⁺) + λ(CH₃COO⁻) = 390.5'); text(ctx, 'Ac⁻ = CH₃COO⁻. The H⁺ block is the same size in both.', L, y + 120, { color: col.muted, size: 11 }); }
    if (step >= 1) { bar(y + 18, [['H⁺', 349.6, H], ['Cl⁻', 76.6, Cl]], 'HCl: 426.2 (measured, strong)'); bar(y + 66, [['Na⁺', 50.1, Na], ['Ac⁻', 40.9, Ac]], 'CH₃COONa: 91.0 (measured, strong)'); bar(y + 114, [['Na⁺', 50.1, Na], ['Cl⁻', 76.6, Cl]], 'NaCl: 126.5 (measured, strong)'); }
    if (step === 2) { text(ctx, 'HCl + CH₃COONa − NaCl', L, y + 160, { color: col.ink, size: 12.5, weight: 700 }); text(ctx, '= (H⁺ + Cl⁻) + (Na⁺ + Ac⁻) − (Na⁺ + Cl⁻)', L, y + 182, { color: col.muted, size: 11.5 }); text(ctx, '= H⁺ + Ac⁻  (Na⁺ and Cl⁻ cancel)', L, y + 202, { color: col.muted, size: 11.5 }); text(ctx, '= 426.2 + 91.0 − 126.5 = 390.7 S cm²/mol', L, y + 226, { color: col.s[2], size: 12.5, weight: 700 }); }
    if (step === 3) { text(ctx, '349.6 (H⁺) + 40.9 (CH₃COO⁻) = 390.5', L, y + 160, { color: col.ink, size: 12.5, weight: 700 }); text(ctx, 'Agrees within the rounding of the data.', L, y + 182, { color: col.muted, size: 11.5 }); text(ctx, 'Λ°m(CH₃COOH) ≈ 390.5 S cm² mol⁻¹', L, y + 210, { color: col.s[2], size: 13, weight: 700 }); }
    if (step === 1) text(ctx, 'Strong electrolytes: extrapolate Λm to c → 0.', L, y + 164, { color: col.muted, size: 11.5 });
  };
  return { step(i) { step = Math.min(i, 3); cv.redraw(); } };
}
