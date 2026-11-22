// Class 10 Areas Related to Circles (step player): the triangle OAB inside a segment for the three angles the syllabus uses.
// 60°: OAB is equilateral, area (√3/4)r². 90°: right angle at O, area ½r². 120°: drop OM ⟂ AB; ∠AOM = 60°, OM = r/2 and
// AM = (√3/2)r, so the area is ½ × AB × OM = (√3/4)r².
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'The triangle formed by two radii and a chord for 60, 90 and 120 degrees' });
  const CAP = ['Triangle OAB: two radii OA = OB = r and a chord AB', 'θ = 60°: the other two angles are equal, so each is 60°: OAB is equilateral', 'Area of an equilateral triangle of side r is (√3/4)r²', 'θ = 90°: right angle at O, so area = ½ × r × r = ½r²', 'θ = 120°: drop OM ⟂ AB. M is the midpoint, and ∠AOM = 60°', 'OM = r cos 60° = r/2, AM = r sin 60° = (√3/2)r, so AB = √3 r', 'Area = ½ × √3 r × r/2 = (√3/4)r²'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The triangle inside the segment', col);
    const th = step <= 2 ? 60 : step === 3 ? 90 : 120, t = (th * Math.PI) / 180, R = Math.min(w * 0.3, (h - 90) * 0.42), cx = w / 2, cy = h / 2 + 8;
    const a0 = -Math.PI / 2 - t / 2, a1 = -Math.PI / 2 + t / 2, A = [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], B = [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = step === 2 || step === 6 || step === 3 ? 0.55 : 0.25; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, [[cx, cy], A], col.ink, 2.4); line(ctx, [[cx, cy], B], col.ink, 2.4); line(ctx, [A, B], col.s[3], 3);
    dot(ctx, cx, cy, 4, col.ink); dot(ctx, A[0], A[1], 5, col.s[3], col.panel); dot(ctx, B[0], B[1], 5, col.s[3], col.panel);
    text(ctx, 'O', cx, cy + 15, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'A', A[0] - 11, A[1] - 4, { color: col.ink, size: 13, weight: 700, halo: col.panel, align: 'center' }); text(ctx, 'B', B[0] + 11, B[1] - 4, { color: col.ink, size: 13, weight: 700, halo: col.panel, align: 'center' });
    text(ctx, 'angle at O = ' + th + '°', cx, cy + 32, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'r', (cx + A[0]) / 2 - 8, (cy + A[1]) / 2, { color: col.ink, size: 12, weight: 700, halo: col.panel }); text(ctx, 'r', (cx + B[0]) / 2 + 8, (cy + B[1]) / 2, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    if (step >= 4) { const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; line(ctx, [[cx, cy], M], col.s[1], 2.5); dot(ctx, M[0], M[1], 4, col.s[1]); text(ctx, 'M', M[0] + 10, M[1] - 8, { color: col.ink, size: 12, weight: 700, halo: col.panel }); const m = 9; line(ctx, [[M[0], M[1] + m], [M[0] - m, M[1] + m], [M[0] - m, M[1]]], col.ink, 1.2); }
    const big = { 2: '(√3/4) r²', 3: '½ r²', 6: '(√3/4) r²' }[step];
    if (big) text(ctx, 'triangle = ' + big, w / 2, h - 38, { color: col.s[2], size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(6, i); cv.redraw(); } };
}
