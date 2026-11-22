// A 1D collision seen in two frames. In the lab frame both blocks move and the centre of mass (diamond) drifts
// steadily; in the centre-of-mass frame the diamond is fixed and each block simply bounces back with its speed
// multiplied by e. Slide e from 1 (elastic) to 0 (stick together) and watch the kinetic energy lost go to heat.
import { canvas, text, row, choice, slider, readout, loop, button, arrow, line } from '../kit.js';

export default function (host) {
  let frame = 'lab', t = 0;
  const cv = canvas(host, { aspect: 0.58, max: 300, min: 220, label: 'Two blocks colliding, in the lab frame or the centre-of-mass frame' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Frame', [['lab', 'Lab frame'], ['cm', 'Centre-of-mass frame']], frame, (v) => { frame = v; cv.redraw(); show(); });
  const anim = loop(host, (dt) => { t += dt; if (t > T() + 0.8) t = 0; cv.redraw(); });
  anim.button(c1); button(c1, 'Restart', () => { t = 0; });
  const m1 = slider(c2, { label: 'm1', min: 1, max: 5, step: 0.5, value: 2, fmt: (v) => v + ' kg', oninput: re });
  const m2 = slider(c2, { label: 'm2', min: 1, max: 5, step: 0.5, value: 1, fmt: (v) => v + ' kg', oninput: re });
  const u1 = slider(c2, { label: 'u1', min: 1, max: 6, step: 0.5, value: 4, fmt: (v) => v + ' m/s', oninput: re });
  const u2 = slider(c2, { label: 'u2', min: -4, max: 2, step: 0.5, value: -1, fmt: (v) => v + ' m/s', oninput: re });
  const e = slider(c2, { label: 'e', min: 0, max: 1, step: 0.05, value: 1, fmt: (v) => v.toFixed(2), oninput: re });
  const out = readout(host);
  function re() { t = 0; cv.redraw(); show(); }
  const phys = () => {
    const a = m1.value, b = m2.value, p = u1.value, q = u2.value, ee = e.value, M = a + b, V = (a * p + b * q) / M;
    return { a, b, p, q, V, v1: V + ee * (-(p - V)), v2: V + ee * (-(q - V)), tc: 8 / Math.max(0.1, p - q) };
  };
  function T() { return phys().tc * 2; }
  function show() {
    const s = phys(), k0 = 0.5 * s.a * s.p ** 2 + 0.5 * s.b * s.q ** 2, k1 = 0.5 * s.a * s.v1 ** 2 + 0.5 * s.b * s.v2 ** 2, kcm = 0.5 * (s.a + s.b) * s.V ** 2;
    out.innerHTML = `V<sub>cm</sub> = ${s.V.toFixed(2)} m/s (never changes). After: v1 = ${s.v1.toFixed(2)}, v2 = ${s.v2.toFixed(2)} m/s. Kinetic energy ${k0.toFixed(1)} J → ${k1.toFixed(1)} J: lost <b>${(k0 - k1).toFixed(1)} J</b>. The most any collision can lose is the energy of motion relative to the centre of mass: ${(k0 - kcm).toFixed(1)} J (that is e = 0). Momentum before ${(s.a * s.p + s.b * s.q).toFixed(1)}, after ${(s.a * s.v1 + s.b * s.v2).toFixed(1)} kg m/s.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const s = phys(), tc = s.tc, tt = Math.min(t, T());
    const pos = (tm) => tm < tc ? [-4 + s.p * tm, 4 + s.q * tm] : [-4 + s.p * tc + s.v1 * (tm - tc), 4 + s.q * tc + s.v2 * (tm - tc)];
    const cmx = (tm) => (s.a * pos(tm)[0] + s.b * pos(tm)[1]) / (s.a + s.b);
    const off = (tm) => (frame === 'cm' ? cmx(tm) : 0);
    let lo = 1e9, hi = -1e9; for (let i = 0; i <= 40; i++) { const tm = (T() * i) / 40, P = pos(tm), o = off(tm); lo = Math.min(lo, P[0] - o, P[1] - o); hi = Math.max(hi, P[0] - o, P[1] - o); }
    lo -= 1.5; hi += 1.5; const X = (x) => 14 + ((x - lo) / (hi - lo)) * (w - 28), gy = h * 0.58;
    line(ctx, [[0, gy], [w, gy]], col.muted, 2);
    const P = pos(tt), o = off(tt), vel = tt < tc ? [s.p, s.q] : [s.v1, s.v2], vcm = frame === 'cm' ? [0, 0] : [s.V, s.V];
    [[P[0], s.a, col.s[0], 'm1', vel[0] - (frame === 'cm' ? s.V : 0)], [P[1], s.b, col.s[1], 'm2', vel[1] - (frame === 'cm' ? s.V : 0)]].forEach(([x, m, c, lab, v]) => {
      const sz = 14 + 6 * m, cx = X(x - o);
      ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(cx - sz / 2, gy - sz, sz, sz); ctx.globalAlpha = 1;
      text(ctx, lab, cx, gy - sz / 2, { color: col.panel, size: 11, weight: 700, align: 'center' });
      arrow(ctx, cx, gy - sz - 12, cx + v * 9, gy - sz - 12, c, 2.5); text(ctx, v.toFixed(1), cx + v * 9 / 2, gy - sz - 22, { color: c, size: 10, align: 'center' });
    });
    const cm = X(cmx(tt) - o), dy = gy + 18;
    ctx.save(); ctx.translate(cm, dy); ctx.rotate(Math.PI / 4); ctx.fillStyle = col.bad; ctx.fillRect(-5, -5, 10, 10); ctx.restore();
    text(ctx, 'centre of mass', cm, dy + 16, { color: col.bad, size: 10, align: 'center' });
    text(ctx, frame === 'lab' ? 'Lab frame' : 'CM frame: total momentum = 0', 8, 14, { color: col.ink, size: 12, weight: 700 });
  };
  show();
}
