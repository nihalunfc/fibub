// Class 12 Maths, Vector Algebra: the dot product a·b = |a||b|cos(theta), seen as work. A force F pulls a trolley through a displacement d;
// only the part of F along the motion does work, W = F·d = F d cos(theta). Slide the angle: work is largest at 0°, zero at 90° (a perpendicular force), negative beyond.
import { canvas, text, title, axes, line, dot, arrow, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let th = 40, F = 50, d = 4, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A force at an angle pulling a trolley, with the work done and the cosine curve' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'angle θ between F and d', min: 0, max: 180, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; go(); } });
  slider(ctl, { label: 'force F (N)', min: 10, max: 100, step: 5, value: F, fmt: (v) => v + ' N', oninput: (v) => { F = v; go(); } });
  loop(host, (dt) => { t = (t + dt * 0.35) % 1; cv.redraw(); });
  const W = () => F * d * Math.cos(th * Math.PI / 180);
  const go = () => { ro.textContent = `F·d = F d cos θ = ${F} × ${d} × cos ${th}° = ${W().toFixed(1)} J.  ${Math.abs(W()) < 0.05 ? 'Perpendicular: the force does no work.' : W() > 0 ? 'The force helps the motion.' : 'The force opposes the motion (like friction): negative work.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Work is a dot product: W = F · d', col) + 4, a = th * Math.PI / 180;
    const gy = top + 74, x0 = 26 + t * (w - 130);
    line(ctx, [[10, gy + 14], [w - 10, gy + 14]], col.muted, 2);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(x0, gy - 12, 56, 26); ctx.strokeRect(x0, gy - 12, 56, 26);
    dot(ctx, x0 + 12, gy + 14, 5, col.ink); dot(ctx, x0 + 44, gy + 14, 5, col.ink);
    const cx = x0 + 28, cy = gy - 12, L = 20 + F * 0.8;
    arrow(ctx, cx, cy, cx + L * Math.cos(a), cy - L * Math.sin(a), col.s[1], 3, 9);
    text(ctx, 'F', cx + L * Math.cos(a) + 6, cy - L * Math.sin(a) - 8, { color: col.s[1], size: 13, weight: 700 });
    line(ctx, [[cx, cy + 40], [cx + 50, cy + 40]], col.s[0], 3); arrow(ctx, cx + 20, cy + 40, cx + 52, cy + 40, col.s[0], 3, 9); text(ctx, 'd', cx + 58, cy + 40, { color: col.s[0], size: 13, weight: 700 });
    ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 24, -a, 0); ctx.stroke(); ctx.restore();
    const A = axes(ctx, w, h, col, { x: [0, 180], y: [-1, 1], xlabel: 'angle θ (degrees)', ylabel: 'cos θ', l: 46, t: top + 130, b: 42, xt: [0, 45, 90, 135, 180], yt: [-1, 0, 1] });
    const pts = []; for (let i = 0; i <= 180; i += 3) pts.push([A.X(i), A.Y(Math.cos(i * Math.PI / 180))]);
    line(ctx, pts, col.s[0], 3);
    line(ctx, [[A.X(th), A.Y(0)], [A.X(th), A.Y(Math.cos(a))]], col.s[3], 2, [4, 3]);
    dot(ctx, A.X(th), A.Y(Math.cos(a)), 6, col.s[3], col.panel);
    text(ctx, `F·d = ${W().toFixed(0)} J`, w - 14, A.T + 14, { color: W() < 0 ? col.bad : col.ink, size: 12.5, weight: 700, align: 'right' });
  };
  go();
}
