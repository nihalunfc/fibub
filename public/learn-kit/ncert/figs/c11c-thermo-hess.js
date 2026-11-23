// Class 11 Chemistry, Thermodynamics (step player): Hess's law with carbon, CO and CO2. Enthalpy is a state function, so the total change is the same by any route.
// C(s) + O2(g) -> CO2(g): -393.5 kJ/mol (direct). Via CO: C + 1/2 O2 -> CO, -110.5; then CO + 1/2 O2 -> CO2, -283.0. Sum = -393.5. Values: NIST Chemistry WebBook / CRC Handbook.
// Use: the first step cannot be measured cleanly (some CO2 always forms), but -393.5 - (-283.0) = -110.5 finds it.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['One route: burn carbon straight to CO₂', 'Another route: stop at CO first', 'Add the two steps of route 2', 'Same start, same end: same ΔH', 'Use it: find a ΔH nobody can measure'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'Energy ladder showing carbon burning to carbon dioxide directly and through carbon monoxide' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col), T = t0 + 24, B = h - 80, Y = (v) => T + (-v) / 400 * (B - T);
    const lv = [[0, 'C + O₂', col.ink, 0.22], [-110.5, 'CO + ½O₂', col.s[0], 0.5], [-393.5, 'CO₂', col.s[2], 0.22]];
    lv.forEach(([v, lab, c, fx]) => { const x = w * fx; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 38, Y(v)); ctx.lineTo(x + 38, Y(v)); ctx.stroke(); text(ctx, lab, x, Y(v) + (v === 0 ? -14 : 16), { color: c, size: 12, weight: 700, align: 'center' }); });
    const col2 = col.s[2], x1 = w * 0.22, x2 = w * 0.5;
    if (step === 0 || step >= 3) { arrow(ctx, x1 - 24, Y(0), x1 - 24, Y(-393.5), col.bad, 3.5, 11); text(ctx, '−393.5', x1 - 30, Y(-200), { color: col.bad, size: 12, weight: 700, align: 'right' }); }
    if (step >= 1) { arrow(ctx, x1 + 28, Y(0), x2 - 28, Y(-110.5), col.s[0], 3, 10); text(ctx, 'ΔH₁ = −110.5', (x1 + x2) / 2 + 8, Y(-45), { color: col.s[0], size: 11.5, weight: 700, align: 'left' }); }
    if (step >= 1) { arrow(ctx, x2 + 20, Y(-110.5), x1 + 36, Y(-393.5), col.s[3], 3, 10); text(ctx, 'ΔH₂ = −283.0', x2 + 4, Y(-290), { color: col.s[3], size: 11.5, weight: 700 }); }
    const msg = ['direct route: ΔH = −393.5 kJ/mol', 'two steps: C → CO, then CO → CO₂', '−110.5 + (−283.0) = −393.5 kJ/mol', 'ΔH(direct) = ΔH₁ + ΔH₂ whatever the route', 'ΔH₁ = −393.5 − (−283.0) = −110.5 kJ/mol'][step];
    text(ctx, msg, w / 2, h - 44, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, step === 4 ? 'No need to stop burning exactly at CO!' : step === 3 ? 'H is a state function: it depends only on start and end.' : 'kJ per mole of carbon', w / 2, h - 22, { color: col.muted, size: 11, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
