// Class 9 Propositions (step player): proof that the angles of a triangle add to 180°. Draw a line through A parallel to BC.
// Alternate angles between parallel lines are equal, so the angles at A on the line are B, A and C: together a straight line, 180°.
import { canvas, text, title, row, slider } from '../../kit.js';

const T = ['Triangle ABC has angles A, B and C', 'Through A draw a line parallel to BC', 'The angle on the left equals B (alternate angles)', 'The angle on the right equals C (alternate angles)', 'The three angles at A fill a straight line: A + B + C = 180°'];
export default function (host) {
  let s = 0, ax = 2.2;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A triangle with a line through the top corner parallel to the base, used to prove the angle sum' });
  const c = row(host); slider(c, { label: 'Move A sideways', min: 0.6, max: 5.4, step: 0.1, value: ax, oninput: (v) => { ax = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[s], col), sc = Math.min((w - 40) / 6.4, (h - t - 70) / 3.2), ox = (w - 6 * sc) / 2, by = h - 38;
    const B = [ox, by], C = [ox + 6 * sc, by], A = [ox + ax * sc, by - 2.9 * sc];
    const ang = (p, q, o) => { const a = Math.atan2(p[1] - o[1], p[0] - o[0]), b = Math.atan2(q[1] - o[1], q[0] - o[0]); return Math.abs(((b - a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI); };
    const wedge = (o, p, q, rr, c, al) => { const a0 = Math.atan2(p[1] - o[1], p[0] - o[0]), a1 = Math.atan2(q[1] - o[1], q[0] - o[0]); let d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; ctx.save(); ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.arc(o[0], o[1], rr, a0, a0 + d, d < 0); ctx.closePath(); ctx.globalAlpha = al; ctx.fillStyle = c; ctx.fill(); ctx.restore(); };
    const Lft = [A[0] - 1, A[1]], Rgt = [A[0] + 1, A[1]], r = 26;
    if (s >= 1) { ctx.save(); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 1.8; ctx.setLineDash(s === 1 ? [] : [6, 4]); ctx.beginPath(); ctx.moveTo(8, A[1]); ctx.lineTo(w - 8, A[1]); ctx.stroke(); ctx.restore(); text(ctx, 'parallel to BC', w - 10, A[1] - 10, { color: col.s[5], size: 10.5, align: 'right', weight: 700 }); }
    wedge(B, C, A, r, col.s[0], 0.55); wedge(C, B, A, r, col.s[3], 0.55); wedge(A, B, C, r * 0.9, col.s[2], 0.5);
    if (s >= 2) wedge(A, Lft, B, r, col.s[0], 0.55);
    if (s >= 3) wedge(A, C, Rgt, r, col.s[3], 0.55);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(...B); ctx.lineTo(...C); ctx.lineTo(...A); ctx.closePath(); ctx.stroke(); ctx.restore();
    const dg = (p, q, o) => Math.round(ang(p, q, o) * 180 / Math.PI), a = dg(B, C, A), b = dg(C, A, B), cc = 180 - a - b;
    text(ctx, 'B', B[0] - 12, B[1] + 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'C', C[0] + 12, C[1] + 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'A', A[0], A[1] - 14 - (s >= 1 ? 8 : 0), { color: col.ink, size: 12, weight: 700, align: 'center' });
    const bb = dg(C, A, B), cn = dg(B, A, C), aa = dg(B, C, A);
    text(ctx, s >= 2 ? 'B = ' + bb + '° (also at A)' : 'B = ' + bb + '°', 10, h - 8, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, s >= 3 ? 'C = ' + (180 - bb - aa) + '° (also at A)' : 'C = ' + (180 - bb - aa) + '°', w / 2 - 6, h - 8, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, 'A = ' + aa + '°', w - 10, h - 8, { color: col.s[2], size: 11, weight: 700, align: 'right' });
    if (s === 4) text(ctx, 'B + A + C = ' + (bb + aa + (180 - bb - aa)) + '°', w / 2, A[1] + 22 + 0, { color: col.s[2], size: 13, weight: 700, align: 'center', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
