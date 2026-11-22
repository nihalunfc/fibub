// Class 10 Triangles (step player): a worked example of the basic proportionality theorem. In triangle ABC, DE is parallel to BC,
// AD = 3 cm, DB = 2 cm and AE = 4.5 cm. Find EC. By the theorem AD/DB = AE/EC, so 3/2 = 4.5/EC and EC = 4.5 x 2 / 3 = 3 cm.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Triangle ABC with DE parallel to BC and lengths marked' });
  const CAP = ['DE ∥ BC, AD = 3, DB = 2, AE = 4.5. Find EC', 'Because DE ∥ BC, the theorem says AD/DB = AE/EC', 'Put in the known lengths: 3/2 = 4.5/EC', 'Cross multiply: 3 × EC = 2 × 4.5 = 9', 'EC = 3 cm. Check: AE/EC = 4.5/3 = 1.5 = 3/2'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Using AD/DB = AE/EC', col) + 6;
    const A = [w * 0.5, top + 14], B = [w * 0.1, h - 64], C = [w * 0.9, h - 64], t = 0.6;
    const P = (S, T) => [S[0] + t * (T[0] - S[0]), S[1] + t * (T[1] - S[1])], D = P(A, B), E = P(A, C);
    ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [D, E], col.good, 3);
    line(ctx, [A, D], col.s[0], 4); line(ctx, [D, B], col.s[1], 4); line(ctx, [A, E], col.s[0], 4);
    line(ctx, [E, C], step >= 4 ? col.s[2] : col.line, step >= 4 ? 4 : 3);
    for (const [p, n, dx, dy] of [[A, 'A', 0, -12], [B, 'B', -12, 6], [C, 'C', 12, 6], [D, 'D', -14, 0], [E, 'E', 14, 0]]) { dot(ctx, p[0], p[1], 4, col.ink); text(ctx, n, p[0] + dx, p[1] + dy, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    const mid = (p, q, dx) => [(p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2];
    text(ctx, '3', ...mid(A, D, -12), { color: col.s[0], size: 12.5, weight: 700, align: 'center' });
    text(ctx, '2', ...mid(D, B, -12), { color: col.s[1], size: 12.5, weight: 700, align: 'center' });
    text(ctx, '4.5', ...mid(A, E, 16), { color: col.s[0], size: 12.5, weight: 700, align: 'center' });
    text(ctx, step >= 4 ? '3' : '?', ...mid(E, C, 14), { color: col.s[2], size: 13.5, weight: 700, align: 'center' });
    const eq = ['', 'AD/DB = AE/EC', '3/2 = 4.5/EC', '3 × EC = 2 × 4.5 = 9', 'EC = 9 ÷ 3 = 3 cm'][step];
    if (eq) text(ctx, eq, w / 2, h - 38, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
