// Class 11 Biology, Breathing and Exchange of Gases (step player): partial pressures (mm Hg) of O2 and CO2 in the atmosphere, alveoli, blood and tissues. Gases diffuse from higher to lower partial pressure:
// O2 from alveoli to blood to tissues; CO2 the other way. Values: atmosphere pO2 159, pCO2 0.3; alveoli 104 and 40; deoxygenated blood 40 and 45; oxygenated blood 95 and 40; tissues 40 and 45.
import { canvas, text, title, axes, arrow } from '../../kit.js';
import { note } from '../c11b-lib.js';

export default function (host) {
  let st = 0;
  const P = [['Atmosphere', 159, 0.3], ['Alveoli', 104, 40], ['Oxygenated blood', 95, 40], ['Tissues', 40, 45], ['Deoxygenated blood', 40, 45]];
  const N = ['The air we breathe in has pO₂ 159 mm Hg and almost no CO₂ (0.3 mm Hg).', 'In the alveoli the air is mixed with the air left from before and with CO₂ from the blood: pO₂ falls to 104 and pCO₂ rises to 40.', 'Blood arriving in the lung (pO₂ 40, pCO₂ 45) meets alveolar air: O₂ diffuses into it (104 mm Hg in the air, 95 in the blood leaving) and CO₂ diffuses out (45 → 40).', 'Oxygenated blood reaches the tissues, where pO₂ is 40 and pCO₂ 45: O₂ diffuses from blood to cells, CO₂ from cells to blood.', 'The blood leaving the tissues carries pO₂ 40 and pCO₂ 45 back to the lungs. The cycle repeats. Each gas always moves from high to low.'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Bars of oxygen and carbon dioxide partial pressures at five places along the path of gas exchange' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Partial pressures (mm Hg)', col), nh = 74;
    const A = axes(ctx, w, h - nh, col, { x: [0, 5], y: [0, 170], xlabel: '', ylabel: 'mm Hg', l: 44, t: t0 + 12, b: 34, xt: [], yt: [0, 50, 100, 150] });
    const bw = (A.R - A.L) / 5 * 0.36;
    P.forEach(([n, o, c], i) => {
      const x = A.L + (i + 0.5) * (A.R - A.L) / 5, on = i === st || (st === 2 && i === 1) || (st === 3 && i === 2) || (st === 4 && i === 3), a = on ? 1 : 0.3;
      ctx.globalAlpha = a; ctx.fillStyle = col.s[0]; ctx.fillRect(x - bw - 1, A.Y(o), bw, A.B - A.Y(o)); ctx.fillStyle = col.s[3]; ctx.fillRect(x + 1, A.Y(c), bw, A.B - A.Y(c)); ctx.globalAlpha = 1;
      text(ctx, String(o), x - bw / 2, A.Y(o) - 8, { color: col.ink, size: 10, weight: on ? 700 : 400, align: 'center' }); text(ctx, String(c), x + bw / 2 + 1, A.Y(c) - 8, { color: col.ink, size: 10, weight: on ? 700 : 400, align: 'center' });
      const l = n.split(' '); l.forEach((s, k) => text(ctx, s, x, A.B + 11 + k * 11, { color: on ? col.ink : col.muted, size: 9.5, weight: on ? 700 : 400, align: 'center' }));
    });
    text(ctx, '■ pO₂', A.R - 4, t0 + 2, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); text(ctx, '■ pCO₂', A.R - 56, t0 + 2, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    if (st === 2 || st === 3) { const i = st === 2 ? 1 : 2, xa = A.L + (i + 0.5) * (A.R - A.L) / 5, xb = A.L + (i + 1.5) * (A.R - A.L) / 5; arrow(ctx, xa + bw + 4, A.Y(150), xb - bw - 4, A.Y(150), col.s[0], 2.5, 9); text(ctx, 'O₂', (xa + xb) / 2, A.Y(150) - 10, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); arrow(ctx, xb - bw - 4, A.Y(135), xa + bw + 4, A.Y(135), col.s[3], 2.5, 9); text(ctx, 'CO₂', (xa + xb) / 2, A.Y(135) + 12, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    note(ctx, N[st], 10, h - nh + 8, w - 20, col, { size: 11 });
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
