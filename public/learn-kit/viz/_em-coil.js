// Helper for the em- figures with a rectangular coil in a uniform field B (B along x, coil spins about the vertical y axis).
import { arrow } from '../kit.js';
import { rot } from './_3d.js';

/** Draw B arrows, the coil turned by theta (angle between its normal and B) and its normal. P is an orbit projector. */
export function drawCoil(ctx, P, col, theta, { a = 1, b = 0.7, current = 1, color } = {}) {
  const c = color || col.s[0];
  for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k += 2) { const p0 = P([-1.9, j * 0.85, k * 0.9]), p1 = P([-1.2, j * 0.85, k * 0.9]); arrow(ctx, p0[0], p0[1], p1[0], p1[1], col.muted, 1.3, 6); }
  const q = P([1.95, 0.9, 0]); ctx.fillStyle = col.muted; ctx.font = '700 12px system-ui'; ctx.fillText('B', q[0], q[1]);
  // normal is z at theta = 0 in the sense that it points along B when theta = 0: rotate about y
  const corners = [[-a, -b, 0], [a, -b, 0], [a, b, 0], [-a, b, 0]].map((p) => rot(rot(p, 'y', Math.PI / 2 - theta), 'y', 0));
  // coil plane contains y and (direction perpendicular to the normal in the xz plane)
  const n = [Math.cos(theta), 0, -Math.sin(theta)], u = [Math.sin(theta), 0, Math.cos(theta)];
  const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => [u[0] * a * sx, b * sy, u[2] * a * sx]);
  const px = pts.map(P);
  ctx.beginPath(); px.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  ctx.globalAlpha = 0.18; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.stroke();
  const o = P([0, 0, 0]), e = P([n[0] * 0.9 * (current < 0 ? -1 : 1), 0, n[2] * 0.9 * (current < 0 ? -1 : 1)]);
  arrow(ctx, o[0], o[1], e[0], e[1], col.s[5], 2.2, 7);
  const ax0 = P([0, -b - 0.35, 0]), ax1 = P([0, b + 0.35, 0]); ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(ax0[0], ax0[1]); ctx.lineTo(ax1[0], ax1[1]); ctx.stroke(); ctx.restore();
  return { normal: e };
}
