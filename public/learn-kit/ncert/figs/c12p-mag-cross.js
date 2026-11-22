// Class 12 Moving Charges: the size of the magnetic force, F = q v B sin θ. B points up the page; v makes an angle θ with it.
// Only the part of v across B (v sin θ) is turned; the part along B (v cos θ) feels no force. The force points out of the page
// for a positive charge (v × B), drawn as a dot whose size shows its strength, next to the sine graph.
import { canvas, text, title, row, slider, choice, readout, arrow, line, dot, axes, loop } from '../../kit.js';
import { outof, into, rad } from '../c12p-mmlib.js';

export default function (host) {
  let th = 40, q = 1, v = 3;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Force on a charge against the angle between v and B' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle θ between v and B', min: 0, max: 180, step: 1, value: th, fmt: (x) => `${Math.round(x)}°`, oninput: (x) => { th = x; cv.redraw(); } });
  slider(ctl, { label: 'Speed v', min: 1, max: 5, step: 0.5, value: v, fmt: (x) => `${x}×10⁶ m/s`, oninput: (x) => { v = x; cv.redraw(); } });
  choice(ctl, 'Charge', [[1, 'Proton'], [-1, 'Electron']], q, (x) => { q = x; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'F = q v B sin θ', col);
    const B = 0.5, e = 1.6e-19, F = e * v * 1e6 * B * Math.sin(rad(th));
    out.innerHTML = `With B = 0.5 T and v = ${v}×10⁶ m/s: F = qvB sin ${Math.round(th)}° = <b>${(F * 1e13).toFixed(2)}×10⁻¹³ N</b>${th % 180 === 0 ? ' (zero: v along B, so no force at all)' : th === 90 ? ' (the largest possible: v across B)' : ''}. The force on a ${q > 0 ? 'proton comes out of' : 'electron goes into'} the page.`;
    const pw = Math.min(w * 0.46, 190), ox = pw * 0.5, oy = h - 40, L = Math.min(h - top - 70, 120);
    arrow(ctx, ox, oy, ox, oy - L * 1.1, col.s[0], 2.5); text(ctx, 'B', ox - 10, oy - L * 1.1 - 6, { color: col.s[0], size: 14, weight: 700, align: 'center' });
    const vx = ox + Math.sin(rad(th)) * L, vy = oy - Math.cos(rad(th)) * L;
    line(ctx, [[ox, oy], [ox, vy]], col.muted, 1, [4, 4]); line(ctx, [[ox, vy], [vx, vy]], col.muted, 1, [4, 4]);
    arrow(ctx, ox, oy, vx, vy, col.s[2], 3); text(ctx, 'v', vx + 10, vy - 6, { color: col.s[2], size: 14, weight: 700 });
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ox, oy, 28, -Math.PI / 2, -Math.PI / 2 + rad(th)); ctx.stroke(); ctx.restore();
    text(ctx, 'θ', ox + 14, oy - 36, { color: col.ink, size: 12 });
    const rr = 4 + 14 * Math.sin(rad(th));
    (q * 1 > 0 ? outof : into)(ctx, ox + 46, oy, rr, col.s[1], 2); text(ctx, 'F', ox + 46, oy + 24, { color: col.s[1], size: 13, weight: 700, align: 'center' });
    const g = axes(ctx, w, h, col, { x: [0, 180], y: [0, 1.1], l: pw + 44, r: 12, t: top + 14, b: 38, xt: [0, 90, 180], yt: [0, 0.5, 1], xlabel: 'θ (degrees)' });
    text(ctx, 'F / F max', g.L + 6, g.T + 8, { color: col.muted, size: 10.5 });
    g.clip && 0; ctx.save(); ctx.beginPath(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; for (let a = 0; a <= 180; a += 3) { const X = g.X(a), Y = g.Y(Math.sin(rad(a))); a ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    dot(ctx, g.X(th), g.Y(Math.sin(rad(th))), 6, col.s[1], col.ink);
  };
  cv.redraw();
}
