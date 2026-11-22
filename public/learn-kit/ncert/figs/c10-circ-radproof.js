// Class 10 Circles (step player): why a tangent is perpendicular to the radius. Take any point Q on the tangent other than P.
// Q is outside the circle, so OQ is longer than the radius OP. Every Q gives a longer OQ, so OP is the SHORTEST distance
// from O to the line. The shortest distance from a point to a line is the perpendicular, so OP is perpendicular to the tangent.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Proof that the radius to the point of contact is the shortest line to the tangent, hence perpendicular' });
  const CAP = ['Circle with centre O and a tangent touching it at P', 'Pick any other point Q on the tangent. It lies outside the circle, so OQ > OP', 'Try more points: Q₁, Q₂, Q₃ ... every one is farther than OP', 'So OP is the shortest of all lines from O to the tangent', 'Shortest distance to a line is the perpendicular: OP ⟂ tangent'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Why tangent ⟂ radius', col);
    const R = Math.min(w * 0.22, (h - 100) * 0.34), cx = w / 2, cy = 46 + R + 14, py = cy + R;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [[10, py], [w - 10, py]], col.s[2], 2.5);
    const qs = step === 1 ? [R * 1.4] : step >= 2 ? [-R * 1.9, -R * 1.1, R * 0.8, R * 1.7] : [];
    qs.forEach((dx, i) => { const q = [cx + dx, py]; line(ctx, [[cx, cy], q], col.s[3], 1.6, [5, 4]); dot(ctx, q[0], q[1], 5, col.s[3], col.panel); text(ctx, step === 1 ? 'Q' : 'Q' + '₁₂₃₄'[i], q[0], q[1] + 14, { color: col.s[3], size: 12, weight: 700, align: 'center', halo: col.panel }); });
    line(ctx, [[cx, cy], [cx, py]], step >= 3 ? col.s[1] : col.s[0], step >= 3 ? 4 : 2.5);
    dot(ctx, cx, cy, 4, col.ink); dot(ctx, cx, py, 6, col.s[0], col.panel);
    text(ctx, 'O', cx - 12, cy, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'P', cx + 4, py + 15, { color: col.ink, size: 12, weight: 700 });
    if (step === 1) text(ctx, 'OQ > OP', cx + R * 0.95, cy + R * 0.5, { color: col.s[3], size: 12, weight: 700, halo: col.panel });
    if (step >= 4) line(ctx, [[cx - 11, py - 11], [cx - 11, py], [cx, py]].map(([x, y], i) => (i === 0 ? [cx - 11, py - 11] : i === 1 ? [cx - 11, py] : [cx, py])), col.ink, 1.5);
    if (step >= 4) text(ctx, '90°', cx - 26, py - 14, { color: col.ink, size: 11, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, 'tangent', w - 12, py - 12, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
