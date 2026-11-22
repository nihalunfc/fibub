// Class 9 Propositions: a statement and its converse about triangles. "If two sides of a triangle are equal, the angles opposite them
// are equal" and the converse "If two angles are equal, the sides opposite them are equal". Set angles B and C: when B = C the sides
// AB and AC match (a mirror line through A fits the triangle onto itself); otherwise they differ. By the sine rule AB : AC = sin C : sin B.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let B = 55, C = 55;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 280, label: 'A triangle whose base angles you can change, with side lengths compared' });
  const c = row(host);
  slider(c, { label: 'Angle B (°)', min: 25, max: 75, step: 1, value: B, oninput: (v) => { B = v; upd(); } });
  slider(c, { label: 'Angle C (°)', min: 25, max: 75, step: 1, value: C, oninput: (v) => { C = v; upd(); } });
  const out = readout(host);
  const geo = () => { const r = Math.PI / 180, A = 180 - B - C, BC = 6, AB = BC * Math.sin(C * r) / Math.sin(A * r), AC = BC * Math.sin(B * r) / Math.sin(A * r); return { A, AB, AC, BC }; };
  cv.draw = (ctx, w, h, col) => {
    const { A, AB, AC, BC } = geo(), t = title(ctx, 'Angles B = ' + B + '°, C = ' + C + '°', col), r = Math.PI / 180, eq = B === C;
    const sc = Math.min((w - 40) / 6.5, (h - t - 60) / 4), ox = (w - 6 * sc) / 2, by = h - 36;
    const Bp = [ox, by], Cp = [ox + 6 * sc, by], Ap = [ox + AB * Math.cos(B * r) * sc, by - AB * Math.sin(B * r) * sc];
    const clamp = Math.max(0.5, Math.min(1, ((h - t - 60) / sc) / (Ap[1] ? (by - Ap[1]) / sc : 1))); void clamp;
    if (eq) { ctx.save(); ctx.strokeStyle = col.s[5]; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(Ap[0], Ap[1] - 8); ctx.lineTo(Ap[0], by + 8); ctx.stroke(); ctx.restore(); text(ctx, 'mirror line', Ap[0] + 4, by - 6 - 0, { color: col.s[5], size: 10, weight: 700 }); }
    ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.moveTo(...Bp); ctx.lineTo(...Cp); ctx.lineTo(...Ap); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.stroke(); ctx.restore();
    const tick = (p, q, n) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 5; ctx.beginPath(); ctx.moveTo(mx + dx / L * o + nx * 6, my + dy / L * o + ny * 6); ctx.lineTo(mx + dx / L * o - nx * 6, my + dy / L * o - ny * 6); ctx.stroke(); } ctx.restore(); };
    if (eq) { tick(Bp, Ap, 1); tick(Ap, Cp, 1); }
    const arc = (o, p, q, c, rr) => { const a0 = Math.atan2(p[1] - o[1], p[0] - o[0]), a1 = Math.atan2(q[1] - o[1], q[0] - o[0]); let d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; ctx.save(); ctx.beginPath(); ctx.moveTo(...o); ctx.arc(o[0], o[1], rr, a0, a0 + d, d < 0); ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fill(); ctx.restore(); };
    arc(Bp, Cp, Ap, col.s[0], 24); arc(Cp, Bp, Ap, col.s[3], 24);
    text(ctx, 'B', Bp[0] - 10, by + 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'C', Cp[0] + 10, by + 12, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'A', Ap[0], Ap[1] - 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'AB = ' + AB.toFixed(2), 8, t + 14, { color: col.s[0], size: 11.5, weight: 700 });
    text(ctx, 'AC = ' + AC.toFixed(2), w - 8, t + 14, { color: col.s[3], size: 11.5, weight: 700, align: 'right' });
  };
  function upd() { const { AB, AC } = geo(); out.innerHTML = B === C ? `B = C = ${B}°, and AB = AC = ${AB.toFixed(2)}. Angles equal, so the sides opposite are equal (the converse). The ticks mark equal sides.` : `B ≠ C, and the sides are different: the longer side (${AB > AC ? 'AB' : 'AC'}) is opposite the <b>${AB > AC ? 'larger angle C' : 'larger angle B'}</b>. Make B = C and watch AB = AC.`; cv.redraw(); }
  upd();
}
