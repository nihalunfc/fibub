// Class 10 Circles (step player): proof that the tangents PA and PB from an outside point are equal. Join OA, OB, OP.
// Angles at A and B are 90 degrees (tangent ⟂ radius), OA = OB (radii), OP is shared: triangles OAP and OBP are congruent
// by RHS (right angle, hypotenuse, side), so PA = PB (corresponding parts) and ∠APO = ∠BPO.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Step by step proof that two tangents from an outside point are equal' });
  const CAP = ['Tangents PA and PB from the outside point P', 'Join OA, OB and OP', 'Tangent ⟂ radius: ∠OAP = ∠OBP = 90°', 'OA = OB (radii) and OP is common', 'Triangles OAP and OBP are congruent (RHS)', 'So PA = PB, and OP bisects ∠APB'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Proof: PA = PB', col);
    const R = Math.min(w * 0.2, (h - 90) * 0.3), cx = w * 0.3, cy = h / 2 + 4, dist = 2.4, px = cx + dist * R, py = cy, al = Math.acos(1 / dist);
    const A = [cx + Math.cos(-al) * R, cy + Math.sin(-al) * R], B = [cx + Math.cos(al) * R, cy + Math.sin(al) * R];
    if (step >= 4) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(A[0], A[1]); ctx.lineTo(px, py); ctx.closePath(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.28; ctx.fill(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(B[0], B[1]); ctx.lineTo(px, py); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.fill(); ctx.globalAlpha = 1; }
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    const tl = (c) => line(ctx, [[px, py], c], col.s[3], 3);
    tl(A); tl(B);
    if (step >= 1) { line(ctx, [[cx, cy], A], col.s[0], 2); line(ctx, [[cx, cy], B], col.s[0], 2); line(ctx, [[cx, cy], [px, py]], col.s[0], 2, [5, 4]); }
    const sqm = (P, a, b) => { const la = Math.hypot(a[0] - P[0], a[1] - P[1]), lb = Math.hypot(b[0] - P[0], b[1] - P[1]), m = 10; const u = [(a[0] - P[0]) / la, (a[1] - P[1]) / la], v = [(b[0] - P[0]) / lb, (b[1] - P[1]) / lb]; line(ctx, [[P[0] + u[0] * m, P[1] + u[1] * m], [P[0] + (u[0] + v[0]) * m, P[1] + (u[1] + v[1]) * m], [P[0] + v[0] * m, P[1] + v[1] * m]], col.ink, 1.6); };
    if (step >= 2) { sqm(A, [cx, cy], [px, py]); sqm(B, [cx, cy], [px, py]); text(ctx, '90°', A[0] + 6, A[1] - 14, { color: col.ink, size: 11, weight: 700, halo: col.panel }); text(ctx, '90°', B[0] + 6, B[1] + 16, { color: col.ink, size: 11, weight: 700, halo: col.panel }); }
    if (step >= 3) { text(ctx, 'OA = OB', cx - R * 0.5, cy, { color: col.s[0], size: 12, weight: 700, halo: col.panel, align: 'center' }); text(ctx, 'OP common', (cx + px) / 2, cy + 3 + (step >= 3 ? 12 : 0), { color: col.s[0], size: 11, weight: 700, halo: col.panel, align: 'center' }); }
    if (step >= 5) { text(ctx, 'PA = PB', px - 4, py - 46, { color: col.s[3], size: 14, weight: 700, halo: col.panel, align: 'center' }); }
    for (const [P, n, dx, dy] of [[[cx, cy], 'O', -13, 0], [A, 'A', -4, -13], [B, 'B', -4, 14], [[px, py], 'P', 14, 0]]) { dot(ctx, P[0], P[1], 4.5, col.ink); text(ctx, n, P[0] + dx, P[1] + dy, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); cv.redraw(); } };
}
