// Motion in a straight line: one motion drawn three ways (x-t, v-t, a-t) with a car moving along a track.
// Steps: rest, constant speed, speeding up, braking, reversing. Slope of x-t = v, slope of v-t = a, area under v-t = displacement.
import { canvas, axes, line, dot, text, loop, row, choice, clamp } from '../../kit.js';

// piecewise motion: segments of constant acceleration [duration s, a m/s²]
const CASES = {
  stop: { name: 'Speed up, cruise, brake', u: 0, seg: [[3, 2], [3, 0], [2, -3]] },
  throw: { name: 'Thrown up, comes back', u: 15, seg: [[3, -10]] },
  reverse: { name: 'Brake past zero (reverses)', u: 8, seg: [[6, -2.5]] },
};
function state(c, t) {
  let x = 0, v = c.u, tt = 0;
  for (const [d, a] of c.seg) {
    const dt = Math.min(d, Math.max(0, t - tt));
    x += v * dt + 0.5 * a * dt * dt; v += a * dt; tt += d;
    if (t <= tt) return { x, v, a };
  }
  return { x, v, a: c.seg[c.seg.length - 1][1] };
}
export default function (host) {
  let key = 'stop', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 560, min: 380, label: 'Position, velocity and acceleration against time for one motion' });
  const ctl = row(host);
  choice(ctl, 'Motion', Object.entries(CASES).map(([k, c]) => [k, c.name]), key, (v) => { key = v; t = 0; cv.redraw(); });
  const anim = loop(host, (dt) => { const T = CASES[key].seg.reduce((s, x) => s + x[0], 0); t += dt; if (t > T + 1.2) t = 0; cv.redraw(); });
  anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const c = CASES[key], T = c.seg.reduce((s, x) => s + x[0], 0), now = clamp(t, 0, T);
    const N = 120, pts = Array.from({ length: N + 1 }, (_, i) => { const ti = (T * i) / N; return { t: ti, ...state(c, ti) }; });
    const rng = (k) => { const vs = pts.map((p) => p[k]); let a = Math.min(0, ...vs), b = Math.max(0, ...vs); if (b - a < 1) b = a + 1; const pad = (b - a) * 0.12; return [a - pad, b + pad]; };
    const band = (h - 40) / 3;
    [['x', 'x (m)', col.s[0]], ['v', 'v (m/s)', col.s[1]], ['a', 'a (m/s²)', col.s[2]]].forEach(([k, lab, cc], i) => {
      ctx.save(); ctx.translate(0, 34 + i * band);
      const { X, Y } = axes(ctx, w, band, col, { x: [0, T], y: rng(k), xlabel: i === 2 ? 't (s)' : '', ylabel: lab, t: 6, b: i === 2 ? 32 : 18, fy: (v) => (+v.toPrecision(2)).toString() });
      line(ctx, pts.filter((p) => p.t <= now).map((p) => [X(p.t), Y(p[k])]), cc, 2.5);
      const s = state(c, now); dot(ctx, X(now), Y(s[k]), 4, cc);
      ctx.restore();
    });
    // track with car
    const s = state(c, now), xs = pts.map((p) => p.x), lo = Math.min(...xs), hi = Math.max(...xs) || 1;
    const px = 20 + ((s.x - lo) / (hi - lo || 1)) * (w - 40);
    line(ctx, [[20, 22], [w - 20, 22]], col.line, 2);
    ctx.fillStyle = col.s[3]; ctx.fillRect(px - 9, 14, 18, 12);
    text(ctx, `t = ${now.toFixed(1)} s   v = ${s.v.toFixed(1)} m/s`, w - 20, 8, { color: col.muted, size: 11, align: 'right' });
  };
  cv.redraw();
}
