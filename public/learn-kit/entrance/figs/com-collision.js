// Centre of mass and collisions: two carts on a straight track. Set the masses, the starting velocities and
// the coefficient of restitution e (1 elastic, 0 sticking). The carts move, collide and separate; the centre of
// mass (the triangle) keeps moving at the same steady speed throughout, because no outside force acts.
import { canvas, line, text, row, slider, readout, loop, clamp } from '../../kit.js';

export default function (host) {
  let m1 = 2, m2 = 1, u1 = 3, u2 = -1, e = 1, t = 0;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Two carts colliding on a track with their centre of mass marked' });
  const ctl = row(host);
  const re = () => { t = 0; cv.redraw(); show(); };
  slider(ctl, { label: 'Mass A', min: 0.5, max: 5, step: 0.5, value: m1, fmt: (v) => `${v} kg`, oninput: (v) => { m1 = v; re(); } });
  slider(ctl, { label: 'Mass B', min: 0.5, max: 5, step: 0.5, value: m2, fmt: (v) => `${v} kg`, oninput: (v) => { m2 = v; re(); } });
  slider(ctl, { label: 'u of A', min: 0.5, max: 5, step: 0.5, value: u1, fmt: (v) => `${v} m/s`, oninput: (v) => { u1 = v; re(); } });
  slider(ctl, { label: 'u of B', min: -4, max: 2, step: 0.5, value: u2, fmt: (v) => `${v} m/s`, oninput: (v) => { u2 = v; re(); } });
  slider(ctl, { label: 'Restitution e', min: 0, max: 1, step: 0.05, value: e, fmt: (v) => v.toFixed(2), oninput: (v) => { e = v; re(); } });
  const anim = loop(host, (dt) => { t += dt; if (t > 6) t = 0; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const after = () => {
    const M = m1 + m2, v1 = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / M, v2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / M;
    return { v1, v2, vcm: (m1 * u1 + m2 * u2) / M };
  };
  const meets = () => u1 > u2; // A starts on the left
  const gap0 = 6, tc = () => (meets() ? gap0 / (u1 - u2) : Infinity);
  const pos = (tt) => {
    const { v1, v2 } = after(), T = tc();
    if (tt < T) return [-gap0 / 2 + u1 * tt, gap0 / 2 + u2 * tt];
    const xa = -gap0 / 2 + u1 * T; return [xa + v1 * (tt - T), xa + v2 * (tt - T)];
  };
  const show = () => {
    if (!meets()) { out.innerHTML = 'A must move faster to the right than B, or they never meet. Increase u of A or lower u of B.'; return; }
    const { v1, v2, vcm } = after(), K0 = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2, K1 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
    out.innerHTML = `After: v<sub>A</sub> = <b>${v1.toFixed(2)} m/s</b>, v<sub>B</sub> = <b>${v2.toFixed(2)} m/s</b>. Momentum ${(m1 * u1 + m2 * u2).toFixed(2)} → ${(m1 * v1 + m2 * v2).toFixed(2)} kg m/s (kept). ` +
      `Kinetic energy ${K0.toFixed(2)} → ${K1.toFixed(2)} J (${K0 - K1 < 0.005 ? 'none lost' : `${(K0 - K1).toFixed(2)} J lost`}). Centre of mass moves at ${vcm.toFixed(2)} m/s throughout.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const span = 16, X = (x) => w / 2 + (x / span) * (w - 20), yT = h * 0.62;
    line(ctx, [[10, yT], [w - 10, yT]], col.muted, 2);
    const [xa, xb] = pos(t), sz = (m) => 16 + m * 5;
    const cart = (x, m, c, lab, side) => {
      const s = sz(m), px = clamp(X(x) + side * s / 2, -40, w + 40);
      ctx.fillStyle = c; ctx.fillRect(px - s / 2, yT - s, s, s);
      text(ctx, lab, px, yT - s / 2, { color: col.panel, size: 12, weight: 700, align: 'center', fit: false });
    };
    cart(xa, m1, col.s[0], 'A', -1); cart(xb, m2, col.s[1], 'B', 1);
    const xc = (m1 * xa + m2 * xb) / (m1 + m2), pc = X(xc);
    if (pc > -10 && pc < w + 10) { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(pc, yT + 4); ctx.lineTo(pc - 7, yT + 16); ctx.lineTo(pc + 7, yT + 16); ctx.closePath(); ctx.fill(); }
    text(ctx, 'centre of mass', clamp(pc, 50, w - 50), yT + 28, { color: col.s[2], size: 11, align: 'center' });
    text(ctx, e === 1 ? 'Elastic (e = 1)' : e === 0 ? 'Perfectly inelastic: they stick (e = 0)' : `Inelastic (e = ${e.toFixed(2)})`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
  };
  cv.redraw(); show();
}
