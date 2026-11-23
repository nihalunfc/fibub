// Class 11 Oscillations (step player): one cycle of a block on a spring, step by step. F = -k x always points back to the middle.
// At the ends (x = +-A) the block stops for an instant: v = 0, |a| = omega^2 A is largest. At the middle x = 0: F = 0, a = 0, speed is largest (omega A).
// The graph below the spring shows where the block is in its x-t curve. The last step lets the block run freely.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A block on a spring at the ends and the middle of its motion with force, velocity and acceleration arrows' });
  const NAMES = ['Right end: x = +A', 'Middle, moving left', 'Left end: x = −A', 'Middle, moving right', 'The whole cycle'];
  const PH = [0, Math.PI / 2, Math.PI, 1.5 * Math.PI];
  const anim = loop(host, (dt) => { if (step === 4) { t += dt * 1.6; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[step], col);
    const th = step === 4 ? t : PH[step], x = Math.cos(th), v = -Math.sin(th);
    const wl = 16, cx = w * 0.56, amp = (w - 90) * 0.4, gy = top + 62;
    ctx.fillStyle = col.ink; ctx.fillRect(wl - 6, gy - 34, 6, 60);
    line(ctx, [[wl, gy + 26], [w - 12, gy + 26]], col.line, 1.5);
    const bx = cx + x * amp, bw = 40;
    const pts = [[wl, gy]]; const x0 = wl, x1 = bx - bw / 2, n = 12; for (let i = 1; i < n; i++) pts.push([x0 + (x1 - x0) * i / n, gy + (i % 2 ? -9 : 9)]); pts.push([x1, gy]);
    line(ctx, pts, col.s[3], 2);
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx - bw / 2, gy - 20, bw, 40); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx - bw / 2, gy - 20, bw, 40);
    line(ctx, [[cx, gy + 26], [cx, gy + 36]], col.muted, 1.5); text(ctx, 'O', cx, gy + 46, { color: col.muted, size: 11, align: 'center' });
    const ay = gy - 30;
    if (Math.abs(x) > 0.03) arrow(ctx, bx, ay - 2, bx - Math.sign(x) * (6 + 46 * Math.abs(x)), ay - 2, col.s[2], 3, 9);
    if (Math.abs(v) > 0.03) arrow(ctx, bx, ay - 22, bx + Math.sign(v) * (6 + 46 * Math.abs(v)), ay - 22, col.s[1], 3, 9);
    text(ctx, 'F, a (toward O)', w - 12, top + 8, { color: col.s[2], size: 11, weight: 700, align: 'right' }); text(ctx, 'velocity v', w - 12, top + 24, { color: col.s[1], size: 11, weight: 700, align: 'right' });
    // x-t graph
    const gx0 = 34, gx1 = w - 14, gy0 = gy + 66, gy1 = h - 36, mid = (gy0 + gy1) / 2, hh = (gy1 - gy0) / 2;
    line(ctx, [[gx0, mid], [gx1, mid]], col.line, 1); line(ctx, [[gx0, gy0], [gx0, gy1]], col.muted, 1.2);
    text(ctx, 'x', gx0 - 8, gy0, { color: col.muted, size: 11, align: 'center' }); text(ctx, 't', gx1, mid + 12, { color: col.muted, size: 11, align: 'right' });
    const wv = []; for (let k = 0; k <= 100; k++) { const u = (k / 100) * 2 * Math.PI; wv.push([gx0 + (k / 100) * (gx1 - gx0), mid - Math.cos(u) * hh * 0.85]); } line(ctx, wv, col.s[0], 2.5);
    const u = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(gx0 + (u / (2 * Math.PI)) * (gx1 - gx0), mid - Math.cos(u) * hh * 0.85, 6, 0, 7); ctx.fill();
    const N = ['v = 0, force and acceleration biggest, pointing left', 'F = 0 and a = 0, speed biggest (moving left)', 'v = 0 again, force and acceleration biggest, pointing right', 'F = 0 and a = 0, speed biggest (moving right)', 'a is always opposite to x: a = −ω² x'][step];
    text(ctx, N, w / 2, h - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
