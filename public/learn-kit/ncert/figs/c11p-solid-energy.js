// Class 11 Mechanical Properties of Solids (step player): elastic potential energy stored in a stretched wire. The pulling force grows from 0 to F as the wire stretches by l (F = (Y A / L) l),
// so the work is the area under the F-l graph, a triangle: W = (1/2) F dL. Divide by the volume A L: energy per unit volume u = (1/2) stress x strain = (1/2) Y strain^2.
import { canvas, text, title, axes, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Force against extension for a stretched wire with the area under the line shaded as stored energy' });
  const T = ['Stretch a little at a time', 'The force grows as it stretches', 'Work done = area under the graph', 'The triangle gives W = ½ F ΔL', 'Energy in each cubic metre'];
  loop(host, (dt) => { t += dt; if (step === 0) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col), A = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xt: [], yt: [], xlabel: 'extension l', ylabel: 'force F', l: 40, t: top + 8, b: 40 });
    const x1 = 8, fx = (x) => x * 1;
    if (step >= 2) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0)); ctx.lineTo(A.X(x1), A.Y(0)); ctx.lineTo(A.X(x1), A.Y(fx(x1))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    line(ctx, [[A.X(0), A.Y(0)], [A.X(x1 + 1.2), A.Y(fx(x1 + 1.2))]], col.s[0], 3);
    if (step === 0) { const x = 1 + (t * 1.5) % 6; ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.55; ctx.fillRect(A.X(x), A.Y(fx(x)), A.X(x + 0.45) - A.X(x), A.Y(0) - A.Y(fx(x))); ctx.globalAlpha = 1; text(ctx, 'work = F × dl for a thin strip', A.L + 10, A.T + 12, { color: col.s[1], size: 11.5, weight: 700 }); }
    if (step === 1) { text(ctx, 'F = (YA/L) l : a straight line (Hooke’s law)', A.L + 10, A.T + 12, { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'average force = ½ F', A.X(3), A.Y(2.2), { color: col.muted, size: 11.5 }); }
    if (step >= 2) { dot(ctx, A.X(x1), A.Y(fx(x1)), 5, col.s[0]); line(ctx, [[A.X(x1), A.Y(0)], [A.X(x1), A.Y(fx(x1))]], col.ink, 1.5, [3, 3]); text(ctx, 'ΔL', A.X(x1), A.B + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, 'F', A.X(x1) + 6, A.Y(fx(x1)) - 4, { color: col.ink, size: 11.5, weight: 700 }); }
    if (step === 2) text(ctx, 'shaded area = stored energy', A.X(5.4), A.Y(2), { color: col.s[3], size: 11.5, weight: 700, align: 'center' });
    if (step >= 3) text(ctx, 'W = ½ × ΔL × F', A.X(4.3), A.Y(2.4), { color: col.s[3], size: 13, weight: 700, align: 'center' });
    if (step >= 3) text(ctx, '= ½ × (stress × A) × (strain × L)', A.X(4.3), A.Y(1.3), { color: col.ink, size: 11.5, align: 'center' });
    if (step === 4) { text(ctx, 'u = W / (A L) = ½ × stress × strain', A.L + 10, A.T + 12, { color: col.s[2], size: 12, weight: 700 }); text(ctx, '= ½ Y × strain²', A.L + 10, A.T + 30, { color: col.s[2], size: 12, weight: 700 }); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
