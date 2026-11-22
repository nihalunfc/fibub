// Class 12 Electrostatic Potential and Capacitance (step player): capacitors in series and in parallel, C1 = 2 uF and C2 = 4 uF on a 12 V battery.
// Series: the same charge Q on each, voltages add, 1/C = 1/C1 + 1/C2 (C = 4/3 uF, Q = 16 uC, V1 = 8 V, V2 = 4 V).
// Parallel: the same voltage, charges add, C = C1 + C2 (6 uF, Q1 = 24 uC, Q2 = 48 uC, total 72 uC).
import { canvas, text, title, line } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'Two capacitors joined in series and in parallel with a battery' });
  const TITLES = ['Series: one path, two capacitors', 'Same charge on both', 'Voltages add up to the battery voltage', 'Equivalent: 1/C = 1/C₁ + 1/C₂', 'Parallel: both across the battery', 'Charges add: C = C₁ + C₂'];
  const cap = (ctx, col, x, y, vertical, label, sub, c1, c2) => {
    const g = 7, l = 22;
    if (!vertical) { line(ctx, [[x - g - 10, y], [x - g, y]], col.ink, 2); line(ctx, [[x + g, y], [x + g + 10, y]], col.ink, 2); line(ctx, [[x - g, y - l], [x - g, y + l]], col.ink, 3); line(ctx, [[x + g, y - l], [x + g, y + l]], col.ink, 3); text(ctx, label, x, y - l - 12, { color: col.s[7], size: 12, weight: 700, align: 'center' }); text(ctx, sub, x, y + l + 14, { color: c2 || col.muted, size: 11, weight: 700, align: 'center' }); if (c1) { text(ctx, c1[0], x - g - 7, y + l - 4, { color: col.s[2], size: 12, weight: 700, align: 'right' }); text(ctx, c1[1], x + g + 7, y + l - 4, { color: col.s[0], size: 12, weight: 700 }); } }
    else { line(ctx, [[x, y - g - 10], [x, y - g]], col.ink, 2); line(ctx, [[x, y + g], [x, y + g + 10]], col.ink, 2); line(ctx, [[x - l, y - g], [x + l, y - g]], col.ink, 3); line(ctx, [[x - l, y + g], [x + l, y + g]], col.ink, 3); text(ctx, label, x + l + 8, y, { color: col.s[7], size: 12, weight: 700 }); text(ctx, sub, x, y + g + 24, { color: c2 || col.muted, size: 11, weight: 700, align: 'center', halo: col.panel }); if (c1) { text(ctx, c1[0], x - l - 4, y - g - 7, { color: col.s[2], size: 12, weight: 700, align: 'right' }); text(ctx, c1[1], x - l - 4, y + g + 9, { color: col.s[0], size: 12, weight: 700, align: 'right' }); } }
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4, par = step >= 4, L = 40, R = w - 40, T = top + 40, B = h - 24, M = (T + B) / 2;
    // battery on left
    line(ctx, [[L, T], [L, M - 12]], col.ink, 2); line(ctx, [[L, M + 12], [L, B]], col.ink, 2); line(ctx, [[L - 14, M - 12], [L + 14, M - 12]], col.ink, 3); line(ctx, [[L - 7, M + 12], [L + 7, M + 12]], col.ink, 3); text(ctx, '12 V', L - 8, M, { color: col.s[3], size: 12, weight: 700, align: 'right' });
    if (!par) {
      line(ctx, [[L, T], [R, T], [R, B], [L, B]], col.ink, 2);
      const x1 = w * 0.38, x2 = w * 0.66; line(ctx, [[x1 - 17, T], [x1 + 17, T]], col.bg, 6); line(ctx, [[x2 - 17, T], [x2 + 17, T]], col.bg, 6);
      cap(ctx, col, x1, T, false, 'C₁ = 2 µF', step >= 2 ? 'V₁ = 8 V' : '', step >= 1 ? ['+16', '−16'] : null, col.s[1]);
      cap(ctx, col, x2, T, false, 'C₂ = 4 µF', step >= 2 ? 'V₂ = 4 V' : '', step >= 1 ? ['+16', '−16'] : null, col.s[1]);
      if (step >= 1) text(ctx, 'Q = 16 µC on each (µC)', w / 2, M + 4, { color: col.s[7], size: 12, weight: 700, align: 'center' });
      if (step >= 2) text(ctx, '8 + 4 = 12 V', w / 2, M + 26, { color: col.s[1], size: 12, weight: 700, align: 'center' });
      if (step >= 3) text(ctx, '1/C = ½ + ¼ = ¾, so C = 4/3 µF, Q = CV = 16 µC', w / 2, h - 8, { color: col.s[7], size: 11.5, weight: 700, align: 'center' });
    } else {
      line(ctx, [[L, T], [R, T]], col.ink, 2); line(ctx, [[L, B], [R, B]], col.ink, 2);
      const xs = [w * 0.42, w * 0.7];
      xs.forEach((x, i) => { line(ctx, [[x, T], [x, M - 17]], col.ink, 2); line(ctx, [[x, M + 17], [x, B]], col.ink, 2); cap(ctx, col, x, M, true, i ? 'C₂ = 4' : 'C₁ = 2', step >= 5 ? (i ? 'Q₂ = 48 µC' : 'Q₁ = 24 µC') : '12 V', null, col.s[1]); });
      text(ctx, 'each has the full 12 V', w / 2, T + 16, { color: col.s[1], size: 12, weight: 700, align: 'center', halo: col.panel });
      if (step >= 5) text(ctx, 'Q = 24 + 48 = 72 µC = (2 + 4) × 12', w / 2, h - 8, { color: col.s[7], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
