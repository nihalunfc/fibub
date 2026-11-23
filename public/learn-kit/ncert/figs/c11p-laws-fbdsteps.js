// Class 11 Laws of Motion (step player): the free-body-diagram method on a classic problem. Block 1 (3 kg) sits on a smooth table, tied by a string over a light pulley to block 2 (2 kg)
// hanging off the edge (g = 10). Isolate each block, draw only the forces ON it, write F = ma along the motion, add the equations: a = m2 g/(m1 + m2) = 4 m/s^2, T = m1 a = 12 N.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 380, label: 'A block on a table tied over a pulley to a hanging block, with free-body diagrams' });
  const T = ['The set-up', 'Free-body diagram of block 1', 'Free-body diagram of block 2', 'Newton’s second law for each', 'Add the equations', 'Find the string tension'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const ty = 100, tx0 = 14, px = w * 0.68, bx = w * 0.3;
    line(ctx, [[tx0, ty + 24], [px, ty + 24]], col.ink, 3); ctx.fillStyle = col.soft; ctx.fillRect(px - 10, ty + 24, 14, 60);
    ctx.beginPath(); ctx.arc(px + 6, ty + 12, 12, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, ty - 6, 50, 30); text(ctx, '3 kg', bx + 25, ty + 9, { size: 11, weight: 700, color: col.panel, align: 'center' });
    line(ctx, [[bx + 50, ty + 4], [px + 6, ty + 4]], col.ink, 1.5); line(ctx, [[px + 18, ty + 12], [px + 18, ty + 62]], col.ink, 1.5);
    ctx.fillStyle = col.s[3]; ctx.fillRect(px + 2, ty + 62, 34, 30); text(ctx, '2 kg', px + 19, ty + 77, { size: 11, weight: 700, color: col.panel, align: 'center' });
    text(ctx, 'm₁', bx + 25, ty - 14, { size: 11, color: col.s[0], weight: 700, align: 'center' }); text(ctx, 'm₂', px + 52, ty + 77, { size: 11, color: col.s[3], weight: 700, align: 'center' });
    const dia = (cx, cy, c, lab, forces) => { ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fillStyle = c; ctx.fill(); forces.forEach(([dx, dy, s, cc]) => { arrow(ctx, cx, cy, cx + dx, cy + dy, cc, 2.5, 8); text(ctx, s, cx + dx * 1.35 + (dx ? 4 : 10), cy + dy * 1.35 + (dy ? 0 : -8), { size: 11, weight: 700, color: cc, align: dx < 0 ? 'right' : 'left' }); }); text(ctx, lab, cx, cy + 64, { size: 11, weight: 700, color: c, align: 'center' }); };
    if (step >= 1 && step <= 3) dia(w * 0.25, 252, col.s[0], 'block 1', [[0, -30, 'N', col.s[1]], [0, 30, 'm₁g', col.s[2]], [34, 0, 'T', col.s[3]]]);
    if (step >= 2 && step <= 3) dia(w * 0.72, 252, col.s[3], 'block 2', [[0, -30, 'T', col.s[3]], [0, 30, 'm₂g', col.s[2]]]);
    const y0 = step <= 3 ? 342 : 220, Ln = (s, i, c = col.ink) => text(ctx, s, 14, y0 + i * 22, { size: 13, weight: 700, color: c });
    if (step === 0) { Ln('Smooth table, light string and pulley:', 0, col.muted); Ln('same tension T and same acceleration a.', 1, col.muted); }
    if (step === 1) { Ln('Vertically N = m₁g: no motion up or down.', 0, col.muted); Ln('Only T pulls it sideways.', 1, col.s[3]); }
    if (step === 2) { Ln('Block 2 has weight m₂g down, tension T up.', 0, col.muted); }
    if (step === 3) { Ln('Block 1:  T = m₁ a', 0, col.s[0]); Ln('Block 2:  m₂ g − T = m₂ a', 1, col.s[3]); }
    if (step >= 4) { Ln('Block 1:  T = m₁ a             = 3a', 0, col.s[0]); Ln('Block 2:  m₂ g − T = m₂ a   (20 − T = 2a)', 1, col.s[3]); Ln('Add:  m₂ g = (m₁ + m₂) a', 2, col.ink); Ln('a = m₂ g/(m₁ + m₂) = 20/5 = 4 m/s²', 3, col.s[2]); }
    if (step === 5) { Ln('T = m₁ a = 3 × 4 = 12 N', 5, col.s[2]); Ln('Check block 2: 20 − 12 = 2 × 4 ✓', 6, col.muted); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
