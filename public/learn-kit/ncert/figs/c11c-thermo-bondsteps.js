// Class 11 Chemistry, Thermodynamics (step player): estimating delta H of CH4 + 2 O2 -> CO2 + 2 H2O(g) from average bond enthalpies. Breaking bonds costs energy, forming bonds releases it.
// Broken: 4 C-H (414) = 1656 and 2 O=O (498) = 996, total +2652 kJ. Formed: 2 C=O in CO2 (799) = 1598 and 4 O-H (463) = 1852, total -3450 kJ. delta H = 2652 - 3450 = -798 kJ (measured -802).
// Average bond enthalpies: CRC Handbook of Chemistry and Physics, "Bond dissociation energies".
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Methane burning: count the bonds', 'Energy IN: break the bonds of the reactants', 'Energy OUT: make the bonds of the products', 'Add it up: ΔH = broken − formed', 'Check against the measured value'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'Bond breaking and bond making energies adding up to the enthalpy of combustion of methane' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col), cx = w / 2, base = h * 0.5, sc = (base - t0 - 75) / 1700;
    text(ctx, 'CH₄ + 2 O₂  →  CO₂ + 2 H₂O(g)', cx, t0 + 22, { color: col.muted, size: 12, align: 'center' });
    const bars = [[0, w * 0.16, 'break', 1656, '4 C–H'], [0, w * 0.34, 'break', 996, '2 O=O'], [1, w * 0.58, 'make', 1598, '2 C=O'], [1, w * 0.76, 'make', 1852, '4 O–H']];
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(10, base); ctx.lineTo(w - 10, base); ctx.stroke();
    bars.forEach(([ph, x, k, v, lab]) => {
      const show = k === 'break' ? step >= 1 : step >= 2; if (!show) return;
      const hh = v * sc, up = k === 'break'; ctx.fillStyle = up ? col.s[3] : col.s[2]; ctx.fillRect(x - 22, up ? base - hh : base, 44, hh);
      text(ctx, (up ? '+' : '−') + v, x, up ? base - hh - 11 : base + hh + 11, { color: up ? col.s[3] : col.s[2], size: 11.5, weight: 700, align: 'center' });
      text(ctx, lab, x, up ? base + 12 : base - 12, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    });
    if (step >= 1) text(ctx, 'broken: +2652', w * 0.25, t0 + 44, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    if (step >= 2) text(ctx, 'formed: −3450', w * 0.67, t0 + 44, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    if (step >= 3) text(ctx, 'ΔH = 2652 − 3450 = −798 kJ', cx, h - 40, { color: col.bad, size: 14, weight: 700, align: 'center' });
    if (step >= 4) text(ctx, 'measured: −802 kJ. Close, because bond values are averages.', cx, h - 16, { color: col.ink, size: 11.5, align: 'center' });
    else text(ctx, step === 0 ? 'one CH₄ has 4 C–H; 2 O₂ have 2 O=O; products: 2 C=O and 4 O–H' : step === 3 ? 'negative: more energy comes out than went in' : '', cx, h - 16, { color: col.muted, size: 11, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
