// Class 11 Thermal Properties of Matter (step player): two slabs in series. In steady state the same heat current H passes through both layers (nothing builds up at the junction).
// Each layer: H = k A dT / d, so the temperature drop across it is dT = H d / (k A) = H R with thermal resistance R = d/(kA). Drops add: T_hot - T_cold = H (R1 + R2), so H = (T_hot - T_cold)/(R1 + R2).
// Example: brick (k = 0.7, d = 0.2 m) and glass wool (k = 0.04, d = 0.1 m), A = 1 m2, 100 degC to 0 degC: R1 = 0.286, R2 = 2.5, H = 35.9 W, junction at 89.7 degC.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Two layers in series with the same heat current and temperature drops that add up' });
  const T = ['Two layers, hot side and cold side', 'The same heat current in both', 'Temperature drop across each layer', 'The drops add up', 'Solve for H and the junction temperature'];
  const L = [['Brick (k = 0.7 W/m K, 20 cm) and glass wool (k = 0.04, 10 cm),', 'area 1 m², faces held at 100 °C and 0 °C.'], ['Steady state: heat cannot pile up at the junction,', 'so the same H flows through both layers.'], ['H = kAΔT/d gives ΔT = H·d/(kA) = H·R for each layer', 'R₁ = 0.2/0.7 = 0.286,  R₂ = 0.1/0.04 = 2.5  (K per W)'], ['100 − 0 = ΔT₁ + ΔT₂ = H (R₁ + R₂)', 'the poor conductor has the larger R, so the larger drop'], ['H = 100 / 2.786 = 35.9 W', 'ΔT₁ = 35.9 × 0.286 = 10.3 °C, junction at 89.7 °C']];
  loop(host, (dt) => { t += dt; if (step >= 1) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 8, x0 = 20, x1 = w - 20, xm = x0 + (x1 - x0) * 0.667, y0 = top + 10, y1 = y0 + 70;
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.5; ctx.fillRect(x0, y0, xm - x0, y1 - y0); ctx.fillStyle = col.s[2]; ctx.fillRect(xm, y0, x1 - xm, y1 - y0); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); line(ctx, [[xm, y0], [xm, y1]], col.ink, 2);
    text(ctx, 'brick', (x0 + xm) / 2, y0 + 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'wool', (xm + x1) / 2, y0 + 12, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, '100 °C', x0, y1 + 12, { color: col.s[1], size: 11, weight: 700 }); text(ctx, '0 °C', x1, y1 + 12, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    if (step >= 1) for (let i = 0; i < 5; i++) { const x = x0 + (((t * 0.35 + i / 5) % 1) * (x1 - x0)); arrow(ctx, x, y0 + 40, x + 14, y0 + 40, col.ink, 2, 5); }
    if (step >= 1) text(ctx, 'H (same everywhere)', w / 2, y0 + 56, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel });
    const gy0 = y1 + 36, gy1 = gy0 + 90, Y = (v) => gy1 - (v / 100) * (gy1 - gy0);
    if (step >= 2) { const Ti = step >= 4 ? 89.7 : 90; line(ctx, [[x0, Y(100)], [xm, Y(Ti)], [x1, Y(0)]], col.s[3], 3); dot(ctx, xm, Y(Ti), 5, col.s[3], col.panel); text(ctx, 'ΔT₁ small', (x0 + xm) / 2, Y(100) - 8, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'ΔT₂ large', (xm + x1) / 2, Y(45), { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    L[step].forEach((s, i) => text(ctx, s, w / 2, h - 36 + i * 18, { color: i ? col.muted : col.ink, size: 11.5, weight: i ? 400 : 700, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
