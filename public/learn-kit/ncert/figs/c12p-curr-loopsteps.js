// Class 12 Current Electricity (step player): Kirchhoff's rules on a two-battery circuit. Left branch: 12 V cell and 2 ohm. Middle: 4 ohm. Right branch: 6 V cell and 1 ohm.
// Junction rule at the top node: I1 + I3 = I2. Loop rule round each loop: sum of emfs = sum of I R. Solving: I1 = 18/7 = 2.57 A, I2 = 12/7 = 1.71 A, I3 = -6/7 = -0.86 A
// (negative: the right cell is being charged, current flows the opposite way to the arrow drawn).
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'A circuit with two batteries and three branches analysed with Kirchhoff rules' });
  const TITLES = ['Label the currents', 'Junction rule at the top node', 'Loop rule: left loop', 'Loop rule: right loop', 'Solve the three equations', 'Check: junction and energy'];
  loop(host, (dt) => { t += dt; if (step === 2 || step === 3) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 20, T = top + 8, B = h - 88, xs = [w * 0.2, w * 0.5, w * 0.8], M = (T + B) / 2;
    const res = (x, y, lab) => { ctx.fillStyle = col.panel; ctx.fillRect(x - 9, y - 18, 18, 36); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x - 9, y - 18, 18, 36); text(ctx, lab, x + 14, y, { color: col.ink, size: 11.5, weight: 700 }); };
    const bat = (x, y, lab) => { ctx.fillStyle = col.panel; ctx.fillRect(x - 14, y - 8, 28, 16); line(ctx, [[x - 14, y - 4], [x + 14, y - 4]], col.ink, 3); line(ctx, [[x - 7, y + 5], [x + 7, y + 5]], col.ink, 3); text(ctx, lab, x + 18, y, { color: col.s[3], size: 11.5, weight: 700 }); };
    const hl = (a, b) => (step === 2 && a === 0) || (step === 3 && a === 1);
    line(ctx, [[xs[0], T], [xs[2], T]], col.ink, 2); line(ctx, [[xs[0], B], [xs[2], B]], col.ink, 2);
    xs.forEach((x) => line(ctx, [[x, T], [x, B]], col.ink, 2));
    // highlight loop
    if (step === 2 || step === 3) { const a = step === 2 ? [xs[0], xs[1]] : [xs[1], xs[2]]; ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.12; ctx.fillRect(a[0], T, a[1] - a[0], B - T); ctx.globalAlpha = 1; const per = 2 * (a[1] - a[0] + B - T), s = (t * 90) % per; let px, py; const wd = a[1] - a[0], ht = B - T; if (s < ht) { px = a[0]; py = B - s; } else if (s < ht + wd) { px = a[0] + (s - ht); py = T; } else if (s < 2 * ht + wd) { px = a[1]; py = T + (s - ht - wd); } else { px = a[1] - (s - 2 * ht - wd); py = B; } ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fill(); }
    res(xs[0], T + (M - T) * 0.5, 'R₁ 2 Ω'); bat(xs[0], M + (B - M) * 0.45, '12 V'); res(xs[1], M, 'R₂ 4 Ω'); res(xs[2], T + (M - T) * 0.5, 'R₃ 1 Ω'); bat(xs[2], M + (B - M) * 0.45, '6 V');
    text(ctx, 'A', xs[1] + 10, T - 10, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'B', xs[1] + 10, B + 12, { color: col.ink, size: 12, weight: 700 });
    arrow(ctx, xs[0] - 20, M - 6, xs[0] - 20, M - 32, col.s[2], 2.5, 7); text(ctx, 'I₁', xs[0] - 26, M - 20, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    arrow(ctx, xs[1] - 20, M - 32, xs[1] - 20, M - 6, col.s[2], 2.5, 7); text(ctx, 'I₂', xs[1] - 26, M - 20, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    arrow(ctx, xs[2] - 20, M - 6, xs[2] - 20, M - 32, col.s[2], 2.5, 7); text(ctx, 'I₃', xs[2] - 26, M - 20, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    const L = (s, i, c = col.ink, wt = 700) => text(ctx, s, w / 2, h - 56 + i * 17, { color: c, size: 12, weight: wt, align: 'center' });
    if (step === 1) L('At A: I₁ + I₃ = I₂  (in = out)', 1, col.s[7]);
    if (step === 2) { L('Walk once round the left loop (EMFs up, IR drops):', 0, col.muted, 400); L('+12 − 2I₁ − 4I₂ = 0', 1, col.s[7]); }
    if (step === 3) { L('Walk round the right loop:', 0, col.muted, 400); L('+6 − 1·I₃ − 4I₂ = 0', 1, col.s[7]); }
    if (step === 4) { L('6I₁ + 4I₃ = 12  and  4I₁ + 5I₃ = 6', 0, col.muted, 400); L('I₁ = 2.57 A, I₂ = 1.71 A, I₃ = −0.86 A', 1, col.s[7]); L('(I₃ < 0: the 6 V cell is being charged)', 2, col.muted, 400); }
    if (step === 5) { L('2.57 + (−0.86) = 1.71 ✓', 0, col.s[2]); L('12 V cell gives 30.9 W = 25.7 W heat + 5.1 W charging the 6 V cell', 1, col.muted, 400); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
