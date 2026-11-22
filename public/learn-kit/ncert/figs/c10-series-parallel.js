// Class 10 Electricity (step player): resistors in series and in parallel, with a 6 V cell and 2 Ω, 4 Ω resistors.
// Series: one path, same current everywhere, voltages add, R = R1 + R2. Parallel: each resistor gets the full 6 V,
// currents add, 1/R = 1/R1 + 1/R2, so the total is less than the smallest. Moving dots show the current (more dots
// per second = bigger current).
import { canvas, text, title, line, dot, loop } from '../../kit.js';

const V = 6, R1 = 2, R2 = 4;
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Two resistors joined in series and then in parallel, with current and voltage shown' });
  const TITLES = ['Series: one path for the charge', 'Series: same current, voltages add', 'Series total: R = R₁ + R₂', 'Parallel: each resistor gets the full 6 V', 'Parallel: currents add, total R is smaller', 'Why homes are wired in parallel'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const res = (ctx, x, y, wd, label, col, c) => {
    ctx.fillStyle = col.panel; ctx.fillRect(x - wd / 2, y - 9, wd, 18); ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.strokeRect(x - wd / 2, y - 9, wd, 18);
    text(ctx, label, x, y - 20, { color: c, size: 12, weight: 700, align: 'center' });
  };
  const flow = (ctx, path, I, col) => {
    const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])), tot = seg.reduce((a, b) => a + b, 0);
    const n = Math.round(I * 4) + 2;
    for (let k = 0; k < n; k++) {
      let d = ((t * 0.05 * I * 3 + k / n) % 1) * tot;
      for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = d / seg[i]; dot(ctx, path[i][0] + f * (path[i + 1][0] - path[i][0]), path[i][1] + f * (path[i + 1][1] - path[i][1]), 3.5, col.s[7]); break; } d -= seg[i]; }
    }
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[Math.min(step, TITLES.length - 1)], col) + 12;
    const L = 30, R = w - 30, T = top + 26, B = h - 46, cx = (L + R) / 2;
    const cell = () => { line(ctx, [[L - 10, (T + B) / 2 - 6], [L + 10, (T + B) / 2 - 6]], col.ink, 3); line(ctx, [[L - 5, (T + B) / 2 + 6], [L + 5, (T + B) / 2 + 6]], col.ink, 6); text(ctx, '6 V', L + 16, (T + B) / 2, { color: col.ink, size: 12, weight: 700 }); };
    if (step < 3) {
      const I = V / (R1 + R2);
      const path = [[L, (T + B) / 2 - 10], [L, T], [R, T], [R, B], [L, B], [L, (T + B) / 2 + 10]];
      line(ctx, path, col.ink, 2); cell();
      res(ctx, cx - (R - L) * 0.2, T, 50, 'R₁ = 2 Ω', col, col.s[1]); res(ctx, cx + (R - L) * 0.2, T, 50, 'R₂ = 4 Ω', col, col.s[2]);
      flow(ctx, path, I, col);
      if (step >= 1) {
        text(ctx, `I = ${I} A here`, L + 8, T + 18, { color: col.s[7], size: 11.5, weight: 700 }); text(ctx, `I = ${I} A here too`, R - 8, B - 14, { color: col.s[7], size: 11.5, weight: 700, align: 'right' });
        text(ctx, `V₁ = IR₁ = ${I * R1} V`, cx - (R - L) * 0.2, T + 22, { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
        text(ctx, `V₂ = IR₂ = ${I * R2} V`, cx + (R - L) * 0.2, T + 22, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
        text(ctx, `${I * R1} V + ${I * R2} V = 6 V`, cx, (T + B) / 2, { color: col.ink, size: 13, weight: 700, align: 'center' });
      }
      if (step === 2) text(ctx, 'R = 2 + 4 = 6 Ω, I = 6/6 = 1 A', cx, (T + B) / 2 + 22, { color: col.s[3], size: 13, weight: 700, align: 'center' });
      return;
    }
    // parallel
    const y1 = T + (B - T) * 0.3, y2 = T + (B - T) * 0.62, xa = cx - (R - L) * 0.28, xb = cx + (R - L) * 0.28;
    const I1 = V / R1, I2 = V / R2;
    line(ctx, [[L, (T + B) / 2 - 10], [L, T], [xa, T], [xa, y2]], col.ink, 2);
    line(ctx, [[xa, y1], [xb, y1]], col.ink, 2); line(ctx, [[xa, y2], [xb, y2]], col.ink, 2);
    line(ctx, [[xb, y1], [xb, B], [L, B], [L, (T + B) / 2 + 10]], col.ink, 2);
    cell();
    res(ctx, cx, y1, 50, 'R₁ = 2 Ω', col, col.s[1]); res(ctx, cx, y2, 50, 'R₂ = 4 Ω', col, col.s[2]);
    flow(ctx, [[xa, y1], [xb, y1]], I1, col); flow(ctx, [[xa, y2], [xb, y2]], I2, col);
    flow(ctx, [[L, (T + B) / 2 - 10], [L, T], [xa, T], [xa, y1]], I1 + I2, col); flow(ctx, [[xb, y2], [xb, B], [L, B], [L, (T + B) / 2 + 10]], I1 + I2, col);
    text(ctx, `6 V across each`, cx, (y1 + y2) / 2, { color: col.ink, size: 12, weight: 700, align: 'center' });
    if (step >= 4) {
      text(ctx, `I₁ = 6/2 = ${I1} A`, xb + 8, y1, { color: col.s[1], size: 11.5, weight: 700 }); text(ctx, `I₂ = 6/4 = ${I2} A`, xb + 8, y2, { color: col.s[2], size: 11.5, weight: 700 });
      text(ctx, `total I = ${I1 + I2} A, R = 6/4.5 = 1.33 Ω (less than 2 Ω)`, cx, B + 18, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    }
    if (step === 5) text(ctx, 'Each appliance gets 220 V and its own switch; one fails, the rest stay on.', cx, B - 14, { color: col.muted, size: 11.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); } };
}
