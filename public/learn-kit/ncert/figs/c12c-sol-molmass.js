// Class 12 Chemistry, Solutions (step player): finding the molar mass of an unknown solute from the depression of freezing point.
// Worked example: 5.0 g of solute in 100 g benzene (Kf = 5.12 K kg/mol; pure benzene freezes at 5.50 C) freezes at 4.70 C.
// dTf = 0.80 K, molality = dTf/Kf = 0.156 mol/kg, moles = molality x 0.100 kg = 0.0156 mol, M = 5.0 g / 0.0156 mol = 320 g/mol.
import { canvas, text, title, loop, ease } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0, shown = 5.5;
  const TITLES = ['Weigh the solute and the solvent', 'Measure the freezing point of the solution', 'Molality from ΔTf = Kf m', 'Moles of solute in this solvent', 'Molar mass = mass ÷ moles'];
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 320, label: 'A thermometer showing the freezing point dropping, with the calculation of molar mass in five steps' });
  loop(host, (dt) => { t += dt; const target = step >= 1 ? 4.7 : 5.5; shown += (target - shown) * Math.min(1, dt * 3); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 6, tx = w - 40, ty0 = t0 + 10, ty1 = h - 28, Y = (T) => ty1 - (T - 4.2) / (6 - 4.2) * (ty1 - ty0 - 10);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(tx - 8, ty0, 16, ty1 - ty0 + 10); ctx.fillStyle = col.s[2]; ctx.fillRect(tx - 5, Y(shown), 10, ty1 + 10 - Y(shown));
    [4.5, 5.0, 5.5].forEach((v) => { ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(tx + 8, Y(v)); ctx.lineTo(tx + 14, Y(v)); ctx.stroke(); text(ctx, v.toFixed(1), tx + 18, Y(v), { color: col.muted, size: 10 }); });
    text(ctx, '°C', tx, ty0 - 4, { color: col.muted, size: 10, align: 'center' });
    ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(tx - 64, Y(5.5)); ctx.lineTo(tx - 8, Y(5.5)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'pure 5.50', tx - 12, Y(5.5) - 8, { color: col.s[0], size: 10, align: 'right' });
    if (step >= 1) { ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(tx - 64, Y(4.7)); ctx.lineTo(tx - 8, Y(4.7)); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'solution 4.70', tx - 12, Y(4.7) + 11, { color: col.s[3], size: 10, align: 'right' }); }
    const L = (s, i, c = col.ink, wt = 700) => text(ctx, s, 16, t0 + 110 + i * 24 + 0, { color: c, size: 12, weight: wt });
    const y = t0 + 8;
    text(ctx, '5.0 g solute + 100 g benzene', 16, y + 6, { color: col.muted, size: 11 }); text(ctx, '(Kf of benzene = 5.12 K kg/mol)', 16, y + 22, { color: col.muted, size: 11 });
    if (step >= 1) text(ctx, 'ΔTf = 5.50 − 4.70 = 0.80 K', 16, y + 48, { color: col.s[3], size: 12.5, weight: 700 });
    if (step >= 2) text(ctx, 'm = ΔTf/Kf = 0.156 mol/kg', 16, y + 74, { color: col.ink, size: 12, weight: 700 });
    if (step >= 3) text(ctx, 'n = 0.156 × 0.100 = 0.0156 mol', 16, y + 100, { color: col.ink, size: 12, weight: 700 });
    if (step >= 4) { text(ctx, 'M = 5.0 g / 0.0156 mol', 16, y + 126, { color: col.ink, size: 12, weight: 700 }); text(ctx, '≈ 320 g/mol', 16, y + 154, { color: col.s[2], size: 20, weight: 700 }); }
    if (step === 0) text(ctx, 'Goal: find M of the solute', 16, y + 58, { color: col.ink, size: 12, weight: 700 });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
