// 7.1 Penzias and Wilson's noise budget (ApJ 142, 419, 1965). Their horn antenna at Holmdel, pointed straight
// up at 7.35 cm (4,080 MHz), measured 6.7 K of noise. The atmosphere gave 2.3 K, losses in the antenna about
// 0.8 K, and the ground leaking in through the back less than 0.1 K: 3.2 K expected. The 3.5 ± 1.0 K left over
// came equally from every direction, day and night, all year: the cooled glow of the hot Big Bang.
import { canvas, text, title, arrow, line } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 330, label: 'Penzias and Wilson\'s noise budget: what they expected and what they measured' });
  let step = 0;
  const parts = [['air', 2.3, 1], ['antenna', 0.8, 3], ['ground', 0.1, 4]];
  const titles = ['Measured: 6.7 K of noise from the sky', 'Take away the air: 2.3 K', 'Take away the antenna and the ground', '3.5 K is left, from every direction', 'The afterglow of the Big Bang'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, titles[step], col) + 8;
    const narrow = w < 520, PW = narrow ? w * 0.38 : w * 0.4;
    // legend of the expected parts, top left
    const shown = step === 0 ? 0 : step === 1 ? 1 : 3;
    parts.slice(0, shown).forEach(([name, k, c], i) => {
      ctx.fillStyle = col.s[c - 1]; ctx.fillRect(10, top + i * 17 - 5, 10, 10);
      text(ctx, `${name} ${k} K`, 26, top + i * 17, { color: col.ink, size: 11 });
    });
    // the horn antenna, drawn simply, bottom left
    const hs = Math.min(PW * 0.3, (h - top) * 0.22), hx = PW * 0.45, hy = h - 50;
    ctx.save();
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx - hs * 0.12, hy); ctx.lineTo(hx + hs * 0.12, hy); ctx.lineTo(hx + hs * 0.6, hy - hs * 1.1);
    ctx.lineTo(hx + hs * 0.05, hy - hs * 1.25); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col.muted; ctx.fillRect(hx - hs * 0.5, hy, hs * 1.1, 6);
    ctx.restore();
    text(ctx, 'horn antenna, 7.35 cm', hx, hy + 18, { color: col.muted, size: 11, align: 'center' });
    if (step >= 3) text(ctx, 'same glow from every direction', hx, hy + 33, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    // rays from the sky into the horn's mouth
    const mx = hx + hs * 0.32, my = hy - hs * 1.25, y0 = top + 3 * 17 + 4;
    const xs = step >= 3 ? [0.08, 0.3, 0.52, 0.74, 0.94].map((f) => f * PW) : [mx];
    xs.forEach((x) => {
      const f = 0.82;
      arrow(ctx, x, y0, x + (mx - x) * f, y0 + (my - 6 - y0) * f, step >= 3 ? col.s[1] : col.muted, 2, 7);
    });
    // bar chart on the right
    const L = PW + (narrow ? 26 : 30), R = w - 18, B = h - 46, T = top + 18, Kmax = 7.5;
    const Y = (k) => B - (k / Kmax) * (B - T);
    ctx.save(); ctx.font = '11px system-ui'; ctx.strokeStyle = col.line; ctx.fillStyle = col.muted; ctx.lineWidth = 1;
    for (let k = 0; k <= 7; k++) { const y = Math.round(Y(k)) + 0.5; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); }
    ctx.restore();
    for (let k = 0; k <= 7; k++) text(ctx, k + ' K', L - 5, Y(k), { color: col.muted, size: 10.5, align: 'right' });
    line(ctx, [[L, T - 6], [L, B], [R, B]], col.muted, 1);
    const bw = Math.min(70, (R - L) * 0.36), xa = L + (R - L) * 0.26 - bw / 2, xb = L + (R - L) * 0.74 - bw / 2;
    // measured bar
    ctx.fillStyle = col.ink; ctx.globalAlpha = 0.85; ctx.fillRect(xb, Y(6.7), bw, B - Y(6.7)); ctx.globalAlpha = 1;
    text(ctx, '6.7 K', xb + bw / 2, Y(6.7) - 9, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'measured', xb + bw / 2, B + 12, { color: col.ink, size: 10.5, weight: 600, align: 'center' });
    // expected stack
    let k0 = 0;
    parts.slice(0, shown).forEach(([name, k, c]) => {
      ctx.fillStyle = col.s[c - 1]; ctx.fillRect(xa, Y(k0 + k), bw, Y(k0) - Y(k0 + k));
      k0 += k;
    });
    if (shown) {
      text(ctx, `${k0.toFixed(1)} K`, xa + bw / 2, Y(k0) - 9, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'expected', xa + bw / 2, B + 12, { color: col.ink, size: 10.5, weight: 600, align: 'center' });
    }
    if (step >= 3) {
      // the excess: bracket on the measured bar from 3.2 to 6.7
      ctx.fillStyle = col.s[1]; ctx.fillRect(xb, Y(6.7), bw, Y(3.2) - Y(6.7));
      line(ctx, [[xa + bw + 4, Y(3.2)], [xb - 4, Y(3.2)]], col.muted, 1, [3, 3]);
      text(ctx, '3.5 K', xb + bw / 2, (Y(6.7) + Y(3.2)) / 2, { color: col.panel, size: 13, weight: 700, align: 'center' });
      if (bw >= 58) text(ctx, step >= 4 ? 'afterglow' : 'left over', xb + bw / 2, (Y(6.7) + Y(3.2)) / 2 + 16, { color: col.panel, size: bw < 66 ? 9.5 : 10.5, weight: 700, align: 'center' });
    }
  };
  cv.redraw();
  return { step(i) { step = i; cv.redraw(); } };
}
