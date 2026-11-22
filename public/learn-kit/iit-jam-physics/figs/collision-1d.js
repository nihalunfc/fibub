// 2.2 Head-on collisions. Block 1 hits block 2 (at rest). Change the mass ratio and the coefficient of restitution e
// and watch the velocities after the collision, the momentum (always kept) and the kinetic energy (kept only for e = 1).
import { canvas, text, row, slider, readout, loop, fmt, title, arrow } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 200, label: 'Two blocks on a track colliding head-on' });
  let ratio = 1, e = 1, t = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Mass ratio m₁/m₂', min: 0.1, max: 10, value: ratio, log: true, fmt: (x) => fmt(x, 2), oninput: (x) => { ratio = x; t = 0; show(); } });
  slider(ctl, { label: 'Restitution e', min: 0, max: 1, step: 0.05, value: e, fmt: (x) => fmt(x, 2), oninput: (x) => { e = x; t = 0; show(); } });
  const out = readout(host);
  const after = () => {
    const m1 = ratio, m2 = 1, u = 1;
    return { v1: (m1 - e * m2) * u / (m1 + m2), v2: m1 * (1 + e) * u / (m1 + m2), lost: m2 * (1 - e * e) / (m1 + m2) };
  };
  const show = () => {
    const a = after();
    const note = e > 0.999 ? ' (elastic: none)' : e < 0.001 ? ' (they stick: the most that can be lost)' : '';
    out.innerHTML = `With u = 1 before: v₁′ = <b>${fmt(a.v1, 3)}</b>${a.v1 < -1e-9 ? ' (bounces back)' : ''}, v₂′ = <b>${fmt(a.v2, 3)}</b>. Momentum is the same before and after; kinetic energy lost: <b>${fmt(100 * a.lost, 3)}%</b>${note}.`;
  };
  const tc = 1.6; // collision time
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Head-on collision, block 2 starts at rest', col);
    const y = H * 0.66, L = 24, Rr = W - 24, X = (x) => L + (x + 2) / 6 * (Rr - L);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, y + 1); ctx.lineTo(Rr, y + 1); ctx.stroke();
    const a = after();
    const s1 = 20 + 16 * Math.cbrt(ratio), s2 = 36; // block 1 grows with its mass
    const x1 = t < tc ? -1.6 + t : -1.6 + tc + a.v1 * (t - tc);
    const x2 = t < tc ? 0 : a.v2 * (t - tc);
    const px1 = X(x1) - s1, px2 = X(x2);
    ctx.fillStyle = col.s[0]; ctx.fillRect(px1, y - s1, s1, s1);
    ctx.fillStyle = col.s[1]; ctx.fillRect(px2, y - s2, s2, s2);
    text(ctx, 'm₁', px1 + s1 / 2, y - s1 / 2, { color: col.panel, size: 12, weight: 700, align: 'center', fit: false });
    text(ctx, 'm₂', px2 + s2 / 2, y - s2 / 2, { color: col.panel, size: 12, weight: 700, align: 'center', fit: false });
    const v1 = t < tc ? 1 : a.v1, v2 = t < tc ? 0 : a.v2, k = 40;
    if (Math.abs(v1) > 0.02) arrow(ctx, px1 + s1 / 2, y - s1 - 10, px1 + s1 / 2 + v1 * k, y - s1 - 10, col.ink, 2, 7);
    if (Math.abs(v2) > 0.02) arrow(ctx, px2 + s2 / 2, y - s2 - 10, px2 + s2 / 2 + v2 * k, y - s2 - 10, col.ink, 2, 7);
    text(ctx, t < tc ? 'before the collision' : 'after the collision', 10, H - 10, { color: col.muted, size: 12, base: 'bottom' });
  };
  loop(host, (dt) => { t += dt * 0.8; if (t > tc + 3.2) t = 0; cv.redraw(); });
  cv.redraw(); show();
}
