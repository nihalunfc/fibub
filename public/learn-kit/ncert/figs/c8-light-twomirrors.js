// Class 8 Light: images in two mirrors set at an angle (a kaleidoscope or barber shop). An object between two plane mirrors
// at angle A makes n = 360 / A - 1 images when 360 / A is a whole number. Images sit on a circle round the point where the
// mirrors meet, at angles A/2 + k A. Choose the angle and count them.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

export default function (host) {
  let A = 90;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'An object between two mirrors at an angle and its images around a circle' });
  const ctl = row(host);
  choice(ctl, 'Angle between mirrors', [[180, '180°'], [120, '120°'], [90, '90°'], [60, '60°'], [45, '45°'], [30, '30°']], A, (v) => { A = v; say(); });
  const out = readout(host);
  const say = () => { const n = 360 / A - 1; out.innerHTML = `Angle ${A}°: number of images = 360 ÷ ${A} − 1 = <b>${n}</b>. The smaller the angle, the more images. At 0° (parallel mirrors) the images go on for ever.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Two mirrors: counting images', col);
    const cx = w / 2, cy = h * 0.55, R = Math.min(w, h) * 0.34, a = A * Math.PI / 180, n = 360 / A;
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.restore();
    const P = (ang, r = R) => [cx + r * Math.cos(ang), cy - r * Math.sin(ang)];
    line(ctx, [[cx, cy], P(0, R * 1.35)], col.ink, 4); line(ctx, [[cx, cy], P(a, R * 1.35)], col.ink, 4);
    text(ctx, 'mirror 1', P(0, R * 1.35)[0] - 4, P(0, R * 1.35)[1] + 14, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'mirror 2', P(a, R * 1.35)[0], P(a, R * 1.35)[1] - 12, { color: col.muted, size: 10.5, align: 'center' });
    for (let k = 1; k < n; k++) { const [x, y] = P(a / 2 + k * a); dot(ctx, x, y, 7, col.panel, col.s[2]); text(ctx, String(k), x, y, { color: col.s[2], size: 9.5, weight: 700, align: 'center' }); }
    const [ox, oy] = P(a / 2); dot(ctx, ox, oy, 8, col.s[1], col.ink); text(ctx, 'object', ox, oy - 16, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    text(ctx, `${n - 1} image${n - 1 === 1 ? '' : 's'}`, w - 12, h - 14, { color: col.ink, size: 12, weight: 700, align: 'right' });
  };
  say();
}
