// Class 12 Electromagnetic Waves (step player): how an accelerating charge makes an EM wave. A charge at rest has radial
// field lines. At constant velocity the whole pattern just moves along. When the charge is jerked (accelerated) the
// news can only travel outwards at the speed of light, so a kink in the field lines spreads out as a shell of radius ct:
// outside it the lines still point to where the charge WAS, inside they point to where it is. An oscillating charge
// sends out a train of such kinks: an electromagnetic wave, strongest sideways and zero along the line of oscillation.
import { canvas, line, dot, text, title, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Field lines of a charge at rest, moving steadily, suddenly accelerated, and oscillating' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const TT = ['1. A charge at rest: field lines straight out', '2. A steady velocity: the pattern just moves', '3. A sudden kick: a kink spreads out at c', '4. A shaking charge: a wave goes out'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const cx = w / 2, cy = top + (h - top - 44) / 2 + 8, Rm = Math.min(cx - 12, (h - top - 56) / 2);
    const N = 14;
    if (step === 0) {
      for (let k = 0; k < N; k++) { const a = (2 * Math.PI * k) / N; line(ctx, [[cx + 10 * Math.cos(a), cy + 10 * Math.sin(a)], [cx + Rm * Math.cos(a), cy + Rm * Math.sin(a)]], col.s[0], 1.5); }
      dot(ctx, cx, cy, 6, col.s[3], col.panel);
      text(ctx, 'Field lines show the direction of E.', 12, h - 22, { color: col.ink, size: 11.5, weight: 600 });
    } else if (step === 1) {
      const px = cx - 50 + ((t * 20) % 100);
      for (let k = 0; k < N; k++) { const a = (2 * Math.PI * k) / N; line(ctx, [[px + 10 * Math.cos(a), cy + 10 * Math.sin(a)], [px + 120 * Math.cos(a), cy + 120 * Math.sin(a)]], col.s[0], 1.5); }
      dot(ctx, px, cy, 6, col.s[3], col.panel);
      text(ctx, 'No acceleration, no wave: lines stay radial.', 12, h - 22, { color: col.ink, size: 11.5, weight: 600 });
    } else if (step === 2) {
      const T = (t % 4), tt = Math.max(0, T - 0.4), R = Math.min(Rm * 0.95, 55 * tt), v = 0.45, P = [cx + v * R, cy];
      // old position O = (cx, cy); outside shell radius R + d: radial from O. inside: radial from P.
      const d = 7;
      for (let k = 0; k < N; k++) {
        const a = (2 * Math.PI * k) / N, dx = Math.cos(a), dy = Math.sin(a);
        const pdx = P[0] - cx, pd = pdx * dx;
        const s = -pd + Math.sqrt(Math.max(0, pd * pd - pdx * pdx + R * R));
        const qin = [P[0] + dx * s, P[1] + dy * s];
        if (tt <= 0) { line(ctx, [[cx + 10 * dx, cy + 10 * dy], [cx + Rm * dx, cy + Rm * dy]], col.s[0], 1.5); continue; }
        const qout = [cx + (R + d) * dx, cy + (R + d) * dy];
        line(ctx, [[P[0] + 10 * dx, P[1] + 10 * dy], qin, qout, [cx + Rm * 1.15 * dx, cy + Rm * 1.15 * dy]], col.s[0], 1.5);
      }
      dot(ctx, tt > 0 ? P[0] : cx, cy, 6, col.s[3], col.panel);
      if (tt > 0) { ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(cx, cy, R + d / 2, 0, 7); ctx.stroke(); ctx.restore(); text(ctx, 'kink: radius ct', cx, cy - R - 16, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
      text(ctx, 'Outside the ring the lines have not heard the news yet.', 12, h - 22, { color: col.ink, size: 11.5, weight: 600 });
    } else {
      const lam = 46, sp = 46;
      ctx.save(); ctx.lineCap = 'round';
      for (let k = 0; k < 6; k++) {
        const r = ((t * sp + k * lam) % (lam * 6)) + 6, ph = Math.floor((t * sp + k * lam) / lam);
        for (let a = 0; a < 360; a += 6) {
          const th = (a * Math.PI) / 180, amp = Math.abs(Math.cos(th)); // E along the rod direction (vertical): strongest at the sides
          ctx.globalAlpha = Math.pow(Math.max(0, 1 - r / (Rm + 8)), 0.5) * (0.25 + 0.75 * amp); ctx.strokeStyle = (k + (ph % 2) * 0) % 2 === 0 ? col.s[0] : col.s[1];
          ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, cy, r, th, th + 0.11); ctx.stroke();
        }
      }
      ctx.restore();
      const y = Math.sin(t * 6) * 16; line(ctx, [[cx, cy - 26], [cx, cy + 26]], col.muted, 3); dot(ctx, cx, cy + y, 6, col.s[3], col.panel);
      text(ctx, 'no wave along the rod', cx, cy - 34, { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
      text(ctx, 'Alternating rings = E pointing up, then down.', 12, h - 22, { color: col.ink, size: 11.5, weight: 600 });
    }
  };
  return { step(i) { step = Math.min(3, i); t = 0; cv.redraw(); } };
}
