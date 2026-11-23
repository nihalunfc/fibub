// Class 8 Forces (step player): what a force can do. It can start or speed up a motion, slow or stop it, change the
// direction of motion, or change the shape of an object. Each step animates one effect with a ball or a lump of clay.
import { canvas, text, title, dot, line, arrow, loop, font } from '../../kit.js';

const NAMES = ['Speed up', 'Slow down', 'Change direction', 'Change shape'];
const CAP = ['A kick (a force) on a ball at rest makes it start moving, and more kicks make it faster.', 'Friction from the ground is a force opposite to the motion: the rolling ball slows and stops.', 'A bat hits a ball coming in from the left and sends it up and to the right: direction changed.', 'Pressing a lump of clay (or squeezing a sponge) with a force changes its shape.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Four effects of a force shown with a ball and clay' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[step], col);
    const gy = h * 0.58, p = (t % 3) / 3;
    line(ctx, [[10, gy + 14], [w - 10, gy + 14]], col.muted, 2);
    if (step === 0) { const x = 40 + Math.pow(p, 2) * (w - 110); dot(ctx, x, gy, 13, col.s[0]); arrow(ctx, 14, gy - 34, 40, gy - 34, col.s[1], 3, 8); text(ctx, 'kick', 14, gy - 48, { color: col.s[1], size: 11, weight: 700 }); text(ctx, `speed ${(p * 2 * 10).toFixed(0)} m/s`, w / 2, gy - 60, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); }
    if (step === 1) { const x = 40 + (1 - Math.pow(1 - p, 2)) * (w - 110); dot(ctx, x, gy, 13, col.s[0]); arrow(ctx, x - 16, gy + 30, x - 44, gy + 30, col.s[3], 3, 8); text(ctx, 'friction', x - 30, gy + 46, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, `speed ${((1 - p) * 10).toFixed(0)} m/s`, w / 2, gy - 60, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); }
    if (step === 2) { const hit = w * 0.45, x = p < 0.5 ? 30 + (hit - 30) * (p / 0.5) : hit + (p - 0.5) / 0.5 * (w * 0.4), y = p < 0.5 ? gy : gy - Math.pow((p - 0.5) / 0.5, 0.8) * (gy - 60); dot(ctx, x, y, 12, col.s[0]); line(ctx, [[hit + 8, gy + 14], [hit - 10, gy - 30]], col.s[3], 6); text(ctx, 'bat', hit + 22, gy + 4, { color: col.s[3], size: 11, weight: 700 }); line(ctx, [[30, gy], [hit, gy]], col.line, 1.5, [4, 4]); line(ctx, [[hit, gy], [hit + w * 0.4, 60]], col.line, 1.5, [4, 4]); }
    if (step === 3) { const sq = 0.5 + 0.5 * Math.cos(p * Math.PI * 2), H = 70 - 38 * (1 - sq), Wd = 80 + 40 * (1 - sq), cx = w / 2; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.roundRect(cx - Wd / 2, gy + 14 - H, Wd, H, 8); ctx.fill(); ctx.fillStyle = col.s[3]; ctx.fillRect(cx - 50, gy + 14 - H - 12, 100, 10); arrow(ctx, cx, gy - 120, cx, gy + 14 - H - 14, col.s[1], 3, 8); text(ctx, 'force', cx + 10, gy - 100, { color: col.s[1], size: 11, weight: 700 }); }
    ctx.font = font(11, 400);
    const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 3); t = 0; cv.redraw(); } };
}
