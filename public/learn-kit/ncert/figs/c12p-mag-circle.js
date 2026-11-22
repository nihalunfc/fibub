// Class 12 Moving Charges (step player): why a charge moving at right angles to B goes round a circle, and the formulas
// r = mv/qB and T = 2πm/qB. Magnetic force is the centripetal force, so qvB = mv²/r. The period does not depend on the speed:
// a fast particle takes a big circle, a slow one a small circle, and they come round together.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';
import { bgrid } from '../c12p-mmlib.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A charge circling in a magnetic field: force, radius and period' });
  const TITLES = ['A charge enters the field sideways', 'The force turns it, but never speeds it up', 'Magnetic force = centripetal force', 'Radius: r = mv/qB', 'Period: T = 2πm/qB, whatever the speed', 'Same circle size? Use momentum: r = p/qB'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6;
    bgrid(ctx, 0, top, w, h, true, col.line, 38, 6);
    const cx = w / 2, cy = (top + h) / 2 - 8, R = Math.min(w * 0.28, (h - top) * 0.3), b1 = h - 30, b2 = h - 12;
    const ang = (p, r0, ph) => [cx + r0 * Math.cos(ph + p), cy - r0 * Math.sin(ph + p)];
    const circ = (r0, c, dash) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 1.5; if (dash) ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, r0, 0, 7); ctx.stroke(); ctx.restore(); };
    const w0 = 1.2; // rad/s, same for every circle: T independent of v
    if (step === 0) {
      const x = 14 + ((t * 40) % (w * 0.4)); const y = cy + R; dot(ctx, x, y, 6, col.s[1], col.ink); arrow(ctx, x, y, x + 44, y, col.s[2], 2.5);
      text(ctx, 'v', x + 52, y - 4, { color: col.s[2], size: 14, weight: 700 }); text(ctx, 'B into the page', w - 10, top + 14, { color: col.muted, size: 11, align: 'right' });
      text(ctx, 'field region', w - 10, h - 12, { color: col.muted, size: 11, align: 'right' });
    } else if (step <= 2) {
      circ(R, col.muted, true);
      const p = t * w0, P = ang(p, R, -Math.PI / 2), vx = -Math.sin(p - Math.PI / 2) * 0, tang = [Math.cos(p), Math.sin(p)];
      dot(ctx, P[0], P[1], 6, col.s[1], col.ink);
      arrow(ctx, P[0], P[1], P[0] + tang[0] * 44, P[1] - tang[1] * 44, col.s[2], 2.5);
      const tow = [cx - P[0], cy - P[1]], L = Math.hypot(...tow);
      arrow(ctx, P[0], P[1], P[0] + (tow[0] / L) * 48, P[1] + (tow[1] / L) * 48, col.s[1], 2.5);
      text(ctx, 'v', P[0] + tang[0] * 56, P[1] - tang[1] * 56, { color: col.s[2], size: 13, weight: 700, align: 'center' });
      text(ctx, 'F', P[0] + (tow[0] / L) * 62, P[1] + (tow[1] / L) * 62, { color: col.s[1], size: 13, weight: 700, align: 'center' });
      dot(ctx, cx, cy, 3, col.ink);
      if (step === 1) text(ctx, 'F ⟂ v: no work, same speed', cx, b1, { color: col.ink, size: 13, weight: 700, align: 'center' });
      if (step === 2) { text(ctx, 'qvB = mv²/r', cx, b1, { color: col.ink, size: 15, weight: 700, align: 'center' }); text(ctx, 'magnetic force = centripetal force', cx, b2, { color: col.muted, size: 11, align: 'center' }); }
    } else if (step === 3) {
      const rs = [R * 0.5, R], cs = [col.s[0], col.s[1]];
      rs.forEach((r0, i) => { circ(r0, cs[i], false); const P = ang(t * w0 * (i ? 1 : 1), r0, -Math.PI / 2); dot(ctx, P[0], P[1], 5, cs[i], col.ink); });
      text(ctx, 'r = mv/qB', cx, b1, { color: col.ink, size: 15, weight: 700, align: 'center' });
      text(ctx, 'blue: half the speed, half the radius', cx, b2, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    } else if (step === 4) {
      const rs = [R * 0.5, R], cs = [col.s[0], col.s[1]];
      rs.forEach((r0, i) => { circ(r0, cs[i], false); const P = ang(t * w0, r0, -Math.PI / 2); dot(ctx, P[0], P[1], 5, cs[i], col.ink); line(ctx, [[cx, cy], [P[0], P[1]]], cs[i], 1.2); });
      text(ctx, 'T = 2πr/v = 2πm/qB', cx, b1, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, 'both arrive together', cx, b2, { color: col.muted, size: 11, align: 'center' });
    } else {
      circ(R * 0.55, col.s[2], false); circ(R, col.s[3], false);
      text(ctx, 'r = p/qB = √(2mK)/qB', cx, b1, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, 'inner: small momentum; outer: large. Same p, same circle', cx, b2, { color: col.muted, size: 10.5, align: 'center' });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); t = 0; cv.redraw(); } };
}
