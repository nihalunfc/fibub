// Class 10 Human Eye (step player): how the eye forms and sends an image. Light from a distant arrow enters the cornea
// (most of the refraction), passes the pupil, the lens fine-tunes the focus, an inverted real image forms on the retina,
// and the optic nerve carries the signals to the brain, which sees the picture upright.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

const T = ['An object sends light to the eye', 'The cornea bends the rays most', 'The pupil lets in some; the lens fine-tunes', 'A real, inverted image forms on the retina', 'The brain turns the signals upright'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 270, label: 'Light from an arrow entering the eye and forming an inverted image on the retina' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const R = Math.min(h * 0.3, w * 0.2), cx = w * 0.62, cy = h * 0.55, fx = cx - R, lx = cx - R * 0.3, rx = cx + R * 0.97;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillStyle = col.soft; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    ctx.strokeStyle = step === 1 ? col.s[3] : col.ink; ctx.lineWidth = step === 1 ? 4 : 2.5; ctx.beginPath(); ctx.arc(cx + R * 0.55, cy, R * 1.55, Math.PI - 0.4, Math.PI + 0.4); ctx.stroke();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - R * 0.5, cy - R * 0.6); ctx.lineTo(cx - R * 0.5, cy - R * 0.22); ctx.moveTo(cx - R * 0.5, cy + R * 0.22); ctx.lineTo(cx - R * 0.5, cy + R * 0.6); ctx.stroke();
    ctx.strokeStyle = step === 2 ? col.s[3] : col.ink; ctx.lineWidth = step === 2 ? 3.5 : 2; ctx.fillStyle = col.panel; ctx.beginPath(); ctx.ellipse(lx, cy, R * 0.12, R * 0.3, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = step >= 3 ? col.s[3] : col.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, R - 2, -0.9, 0.9); ctx.stroke(); ctx.restore();
    // the object (arrow) on the left
    const ox = 22, oh = 36; arrow(ctx, ox, cy + oh / 2, ox, cy - oh / 2, col.ink, 3.5, 9); text(ctx, 'object', ox, cy + oh / 2 + 14, { color: col.ink, size: 11, weight: 700, align: 'left' });
    // two rays from the tip, through the pupil edge region, converging to the inverted tip on the retina
    const tip = [ox, cy - oh / 2], base = [ox, cy + oh / 2], tipI = [rx, cy + 18], baseI = [rx, cy - 0];
    const trace = (from, to, off, c) => { const y1 = cy + (from[1] - cy) * 0.04 + off, pts = [from, [fx, y1], [lx, y1 + (to[1] - y1) * 0.4], to]; line(ctx, pts, c, 1.6); return pts; };
    const rs = [];
    for (const off of [-12, 0, 12]) rs.push(trace(tip, tipI, off * 0.7, col.s[0]));
    for (const off of [-12, 12]) rs.push(trace([ox, cy], [rx, cy + 0], off * 0.5, col.s[2]));
    const drawn = rs.length;
    for (let k = 0; k < drawn; k++) { const p = rs[k]; const seg = p.slice(1).map((q, i) => Math.hypot(q[0] - p[i][0], q[1] - p[i][1])), tot = seg.reduce((a, b) => a + b, 0); let d = ((t * 0.35 + k * 0.1) % 1) * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = d / seg[i]; dot(ctx, p[i][0] + f * (p[i + 1][0] - p[i][0]), p[i][1] + f * (p[i + 1][1] - p[i][1]), 3, col.s[3]); break; } d -= seg[i]; } }
    if (step >= 3) { arrow(ctx, rx - 3, cy, rx - 3, cy + 22, col.s[3], 3, 8); text(ctx, 'inverted image', rx - 8, cy + 38, { color: col.s[3], size: 11, weight: 700, align: 'right', halo: col.panel }); }
    if (step === 1) text(ctx, 'cornea: ~⅔ of the bending', fx - 6, cy - R - 6, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel });
    if (step === 2) text(ctx, 'lens: fine focus', lx, cy - R * 0.55, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel });
    if (step === 4) { line(ctx, [[cx + R * 0.8, cy + R * 0.5], [w - 28, cy + R * 0.9]], col.s[3], 3); arrow(ctx, w - 24, h - 56, w - 24, h - 90, col.ink, 3.5, 9); text(ctx, 'brain: upright', w - 8, h - 36, { color: col.ink, size: 11, weight: 700, align: 'right' }); text(ctx, 'optic nerve', w - 12, cy + R * 0.75, { color: col.s[3], size: 10.5, weight: 700, align: 'right', halo: col.panel }); }
    text(ctx, 'retina', rx - 2, cy - R - 6, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, T.length - 1); cv.redraw(); } };
}
