// Class 10 Areas Related to Circles (step player): the minor segment of a circle of radius 14 cm cut by a chord that
// subtends 90° at the centre. Sector OAB = (90/360) × (22/7) × 14² = 154 cm². Triangle OAB (right angle at O) = ½ × 14 × 14 = 98 cm².
// Segment = sector − triangle = 154 − 98 = 56 cm².
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Finding the area of a minor segment by subtracting a triangle from a sector' });
  const CAP = ['Chord AB cuts off the minor segment (shaded outline)', 'Shade the sector OAB: 90° of the circle', 'Sector = ¼ × π × 14² = 154 cm²', 'Triangle OAB has a right angle at O: area ½ × 14 × 14 = 98 cm²', 'Remove the triangle: what is left is the segment', 'Segment = 154 − 98 = 56 cm²'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Minor segment, r = 14 cm, θ = 90°', col);
    const R = Math.min(w * 0.3, (h - 100) * 0.4), cx = w / 2, cy = h / 2 + 6, a0 = -Math.PI / 2 - Math.PI / 4, a1 = -Math.PI / 2 + Math.PI / 4;
    const A = [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], B = [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    if (step >= 1 && step < 4) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; }
    if (step >= 3 && step < 4) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; }
    if (step >= 4) { ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1; }
    if (step === 0) { ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3.5; ctx.stroke(); }
    line(ctx, [A, B], col.s[3], 3); if (step >= 1) { line(ctx, [[cx, cy], A], col.ink, 2); line(ctx, [[cx, cy], B], col.ink, 2); }
    dot(ctx, cx, cy, 4, col.ink); dot(ctx, A[0], A[1], 5, col.s[3], col.panel); dot(ctx, B[0], B[1], 5, col.s[3], col.panel);
    text(ctx, 'A', A[0] - 11, A[1] - 6, { color: col.ink, size: 13, weight: 700, halo: col.panel, align: 'center' }); text(ctx, 'B', B[0] + 11, B[1] - 6, { color: col.ink, size: 13, weight: 700, halo: col.panel, align: 'center' }); if (step >= 1) text(ctx, 'O', cx, cy + 15, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    const big = { 2: ['sector = 154 cm²', col.s[0]], 3: ['triangle = 98 cm²', col.s[2]], 5: ['segment = 154 − 98 = 56 cm²', col.s[1]] }[step];
    if (big) text(ctx, big[0], w / 2, h - 38, { color: big[1], size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); cv.redraw(); } };
}
