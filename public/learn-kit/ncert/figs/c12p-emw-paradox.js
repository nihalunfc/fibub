// Class 12 Electromagnetic Waves (step player): the problem with Ampere's law and Maxwell's fix. A capacitor is being
// charged. Take a loop round the wire. Ampere's law says (integral B.dl) = mu0 x (current through ANY surface on the loop).
// A flat disc cut by the wire has current I; a bowl-shaped surface passing through the gap between the plates has none.
// Maxwell: the changing electric field in the gap, eps0 dPhi_E/dt = dQ/dt = I, acts like a current (displacement current).
import { canvas, line, text, title, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A charging capacitor with a loop round the wire and two surfaces bounded by the loop' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const TT = ['1. Ampère’s law: loop and surface', '2. A flat surface: the wire cuts it', '3. A bowl surface: through the gap', '4. Maxwell: a changing E acts like current', '5. The corrected law'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const cy = top + (h - top - 80) / 2 + 16, gx = w * 0.62, gap = 26, ph = Math.min(70, (h - top - 100) / 2);
    // wire from the left, plates
    line(ctx, [[14, cy], [gx - gap / 2, cy]], col.ink, 3); line(ctx, [[gx + gap / 2, cy], [w - 14, cy]], col.ink, 3);
    line(ctx, [[gx - gap / 2, cy - ph], [gx - gap / 2, cy + ph]], col.ink, 5); line(ctx, [[gx + gap / 2, cy - ph], [gx + gap / 2, cy + ph]], col.ink, 5);
    text(ctx, '+', gx - gap / 2 - 9, cy - ph - 6, { color: col.s[3], size: 14, weight: 700, align: 'center' }); text(ctx, '−', gx + gap / 2 + 9, cy - ph - 6, { color: col.s[0], size: 14, weight: 700, align: 'center' });
    // current dots
    for (let k = 0; k < 5; k++) { const x = 20 + (((t * 40 + k * 40) % 200) / 200) * (gx - gap / 2 - 28); ctx.fillStyle = col.s[7]; ctx.beginPath(); ctx.arc(x, cy, 3.5, 0, 7); ctx.fill(); }
    text(ctx, 'I', 24, cy - 14, { color: col.ink, size: 12, weight: 700 });
    // Amperian loop around the wire at x0
    const x0 = gx - gap / 2 - 52, ry = 46;
    const loopPath = () => { ctx.beginPath(); ctx.ellipse(x0, cy, 12, ry, 0, 0, 7); };
    if (step === 1 || step === 4) { ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = col.s[2]; loopPath(); ctx.fill(); ctx.restore(); }
    if (step === 2 || step === 4) {
      ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.moveTo(x0, cy - ry);
      ctx.bezierCurveTo(x0 + 120, cy - ry - 10, x0 + 120, cy + ry + 10, x0, cy + ry); ctx.ellipse(x0, cy, 12, ry, 0, Math.PI / 2, -Math.PI / 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(x0, cy - ry); ctx.bezierCurveTo(x0 + 120, cy - ry - 10, x0 + 120, cy + ry + 10, x0, cy + ry); ctx.stroke(); ctx.restore();
    }
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; loopPath(); ctx.stroke(); ctx.restore();
    text(ctx, 'loop', x0 - 16, cy - ry - 8, { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
    // E field between plates for step >= 3
    if (step >= 3) { const a = 0.4 + 0.5 * Math.abs(Math.sin(t * 2)); ctx.save(); ctx.globalAlpha = a; for (let k = -2; k <= 2; k++) arrow(ctx, gx - gap / 2 + 4, cy + k * 14, gx + gap / 2 - 4, cy + k * 14, col.s[5], 2, 6); ctx.restore(); text(ctx, 'E grows', gx, cy + ph + 14, { color: col.s[5], size: 11.5, weight: 700, align: 'center' }); }
    const msgs = [
      ['Ampère’s law: (∮B·dl) = μ₀ × current through any', 'surface that has the loop as its edge.'],
      ['Flat disc: the wire cuts it, so current I passes.', '∮B·dl = μ₀I'],
      ['Bowl through the gap: no wire, no charge crosses.', '∮B·dl = 0. Same loop, two answers! Contradiction.'],
      ['E between plates grows as Q grows: ε₀ dΦ_E/dt = dQ/dt = I.', 'Maxwell called this the displacement current I_d.'],
      ['∮B·dl = μ₀(I + I_d), where I_d = ε₀ dΦ_E/dt.', 'Flat disc: I. Bowl: I_d = I. Both give μ₀I.'],
    ][step];
    text(ctx, msgs[0], 12, h - 40, { color: col.ink, size: 11.5, weight: 600 }); text(ctx, msgs[1], 12, h - 22, { color: col.ink, size: 11.5, weight: 600 });
  };
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
