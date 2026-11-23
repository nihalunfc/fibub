// Class 11 Work, Energy and Power: collisions in one dimension. Momentum is conserved always; kinetic energy only when the collision is elastic (e = 1).
// With coefficient of restitution e: v1' = ((m1 - e m2) u1 + m2 (1+e) u2)/(m1+m2), v2' = ((m2 - e m1) u2 + m1 (1+e) u1)/(m1+m2). e = 0: the blocks stick.
import { canvas, line, text, title, arrow, row, slider, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let m1 = 2, m2 = 3, u1 = 4, u2 = 0, e = 1;
  let x1, x2, v1, v2, hit, tt;
  const size = (m) => 0.35 + 0.22 * Math.cbrt(m);
  const after = () => ({ a: ((m1 - e * m2) * u1 + m2 * (1 + e) * u2) / (m1 + m2), b: ((m2 - e * m1) * u2 + m1 * (1 + e) * u1) / (m1 + m2) });
  const reset = () => { x1 = 2; x2 = 9; v1 = u1; v2 = u2; hit = false; tt = 0; };
  reset();
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Two blocks colliding, with bars for momentum and kinetic energy before and after' });
  const ctl = row(host);
  slider(ctl, { label: 'Left mass m₁', min: 1, max: 10, step: 0.5, value: 2, fmt: (v) => v + ' kg', oninput: (v) => { m1 = v; reset(); cv.redraw(); } });
  slider(ctl, { label: 'Right mass m₂', min: 1, max: 10, step: 0.5, value: 3, fmt: (v) => v + ' kg', oninput: (v) => { m2 = v; reset(); cv.redraw(); } });
  slider(ctl, { label: 'Left speed u₁', min: 1, max: 8, step: 0.5, value: 4, fmt: (v) => v + ' m/s', oninput: (v) => { u1 = v; reset(); cv.redraw(); } });
  slider(ctl, { label: 'Right velocity u₂', min: -4, max: 3, step: 0.5, value: 0, fmt: (v) => v + ' m/s', oninput: (v) => { u2 = v; reset(); cv.redraw(); } });
  const ch = row(host);
  choice(ch, 'Collision', [[1, 'Elastic'], [0.5, 'Inelastic'], [0, 'Stick together']], 1, (v) => { e = v; reset(); cv.redraw(); });
  button(ch, 'Replay', () => { reset(); });
  const ro = readout(host);
  loop(host, (dt) => {
    tt += dt;
    for (let i = 0; i < 10; i++) {
      const d = dt / 10; x1 += v1 * d; x2 += v2 * d;
      if (!hit && x2 - x1 <= (size(m1) + size(m2)) / 2 && v1 > v2) { const r = after(); v1 = r.a; v2 = r.b; hit = true; x2 = x1 + (size(m1) + size(m2)) / 2; }
    }
    if (tt > 9) reset();
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Before and after: momentum vs energy', col);
    const sc = (w - 30) / 12, X = (x) => 15 + Math.min(11.7, Math.max(0.3, x)) * sc, yb = top + 62;
    line(ctx, [[10, yb + 20], [w - 10, yb + 20]], col.muted, 2);
    [[x1, m1, col.s[0], v1], [x2, m2, col.s[2], v2]].forEach(([x, m, c, v], i) => {
      const s = size(m) * sc; ctx.fillStyle = c; ctx.fillRect(X(x) - s / 2, yb + 20 - s, s, s);
      text(ctx, m + ' kg', X(x), yb + 32, { color: c, size: 10, weight: 700, align: 'center' });
      if (Math.abs(v) > 0.05) { arrow(ctx, X(x), yb - 30 + (i ? 10 : 0), X(x) + v * 9, yb - 30 + (i ? 10 : 0), c, 2.5); text(ctx, v.toFixed(1) + ' m/s', X(x) + (v >= 0 ? 4 : -4), yb - 44 + (i ? 10 : 0), { color: c, size: 10, weight: 700, align: v >= 0 ? 'left' : 'right' }); }
    });
    const r = after(), p0 = m1 * u1 + m2 * u2, p1 = m1 * r.a + m2 * r.b, k0 = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2, k1 = 0.5 * m1 * r.a * r.a + 0.5 * m2 * r.b * r.b;
    const by = yb + 50, cx = w / 2;
    const bar = (lab, v0, v1_, y, unit) => {
      const mx = Math.max(Math.abs(v0), Math.abs(v1_), 1e-6), S = (w / 2 - 24) / mx;
      text(ctx, lab, 10, y, { color: col.ink, size: 11, weight: 700 });
      text(ctx, `${(+v0.toFixed(1))} → ${(+v1_.toFixed(1))} ${unit}`, w - 8, y, { color: col.muted, size: 11, align: 'right' });
      [[v0, col.muted, 0], [v1_, col.s[1], 1]].forEach(([v, c, k]) => { const L = v * S; ctx.fillStyle = c; ctx.fillRect(Math.min(cx, cx + L), y + 8 + k * 11, Math.abs(L), 9); });
      line(ctx, [[cx, y + 5], [cx, y + 31]], col.ink, 1);
    };
    bar('momentum', p0, p1, by, 'kg m/s'); bar('kinetic energy', k0, k1, by + 50, 'J');
    ctx.fillStyle = col.muted; ctx.fillRect(10, by + 112, 10, 8); text(ctx, 'before', 24, by + 116, { color: col.ink, size: 10 });
    ctx.fillStyle = col.s[1]; ctx.fillRect(80, by + 112, 10, 8); text(ctx, 'after', 94, by + 116, { color: col.ink, size: 10 });
    ro.textContent = u1 <= u2 ? 'The left block is not faster than the right one, so they never meet. Speed up the left block.' : `Momentum ${p0.toFixed(1)} → ${p1.toFixed(1)} (always the same). Kinetic energy ${k0.toFixed(1)} → ${k1.toFixed(1)} J: ${e === 1 ? 'kept, so elastic' : `${(k0 - k1).toFixed(1)} J turned into heat and sound`}.`;
  };
  cv.redraw();
}
