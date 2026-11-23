// Class 11 Oscillations (step player): SHM as the shadow of uniform circular motion. A point P goes round a circle of radius A at angular speed w.
// Its shadow on a vertical line moves with x = A sin(w t + phi). The velocity of P is A w along the tangent; its vertical part is A w cos(...) = w sqrt(A^2 - x^2).
// The acceleration of P is A w^2 toward the centre; its vertical part is -w^2 x. So the shadow obeys a = -w^2 x: simple harmonic motion with T = 2 pi / w.
import { canvas, text, title, line, arrow, loop, row, slider } from '../../kit.js';

export default function (host) {
  let step = 0, th = 0.6, w0 = 2.2;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'A point moving on a circle and its shadow moving up and down, with the shadow traced against time' });
  const ctl = row(host);
  slider(ctl, { label: 'angular speed ω (rad/s)', min: 1, max: 5, step: 0.2, value: w0, fmt: (v) => v.toFixed(1), oninput: (v) => { w0 = v; cv.redraw(); } });
  const anim = loop(host, (dt) => { th += w0 * dt; cv.redraw(); });
  anim.button(ctl);
  const TT = ['Uniform circular motion: radius A, speed ω', 'The shadow on a line: x = A sin(ωt + φ)', 'Velocity: shadow of the tangent arrow', 'Acceleration: shadow of the centre-pointing arrow', 'Shadow obeys a = −ω² x'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const R = Math.min(w * 0.22, (h - top - 40) / 2.2), cx = 12 + R + 18, cy = top + (h - top - 20) / 2;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    line(ctx, [[cx - R - 8, cy], [cx + R + 8, cy]], col.line, 1); line(ctx, [[cx, cy - R - 8], [cx, cy + R + 8]], col.line, 1);
    const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
    line(ctx, [[cx, cy], [px, py]], col.muted, 1.5);
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fill();
    text(ctx, 'P', px + 9 * Math.cos(th) + 4, py - 9 * Math.sin(th) - 2, { color: col.s[0], size: 12, weight: 700 });
    const gx0 = cx + R + 40, gx1 = w - 12, span = gx1 - gx0;
    if (step >= 1) {
      line(ctx, [[px, py], [gx0 - 14, py]], col.s[2], 1, [3, 3]);
      ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(gx0 - 14, py, 5, 0, 7); ctx.fill();
      line(ctx, [[gx0 - 14, cy - R], [gx0 - 14, cy + R]], col.muted, 2);
      line(ctx, [[gx0, cy], [gx1, cy]], col.line, 1);
      const pts = []; for (let k = 0; k <= 80; k++) { const tt = (k / 80) * 7; pts.push([gx0 + (k / 80) * span, cy - R * Math.sin(th - w0 * tt)]); } line(ctx, pts, col.s[2], 2.5);
      text(ctx, 'x(t)', gx1 - 2, cy - R - 6, { color: col.s[2], size: 11, weight: 700, align: 'right' });
    }
    if (step >= 2 && step < 4) { const tx = -Math.sin(th), ty = -Math.cos(th), L = R * 0.8; arrow(ctx, px, py, px + tx * L, py + ty * L, col.s[1], 3, 9); text(ctx, 'v = Aω', px + tx * L + 6, py + ty * L + (ty > 0 ? 10 : -10), { color: col.s[1], size: 11, weight: 700 });
      if (step === 2) { arrow(ctx, gx0 - 14, py, gx0 - 14, py + ty * L, col.s[1], 3, 8); } }
    if (step >= 3 && step < 5) { const L = R * 0.7; const ax = -Math.cos(th), ay = Math.sin(th); if (step === 3) arrow(ctx, px, py, px + ax * L, py + ay * L, col.s[3], 3, 9); arrow(ctx, gx0 - 14, py, gx0 - 14, py + ay * L, col.s[3], 3, 8); if (step === 3) text(ctx, 'a = Aω²', px + ax * L * 0.5, py + ay * L * 0.5 - 12, { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    const N = ['One turn takes T = 2π/ω.', 'Shadow height x = A sin(ωt + φ). Change ω.', 'Shadow speed v = Aω cos(ωt+φ) = ω√(A² − x²)', 'Shadow acceleration = −Aω² sin(ωt+φ) = −ω² x', 'Restoring, proportional to x: that is SHM'][step];
    text(ctx, N, w / 2, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
