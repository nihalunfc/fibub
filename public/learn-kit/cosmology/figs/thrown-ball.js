// 5.2 The Friedmann equation from a thrown ball. Throw a ball up from a small airless world at different speeds
// compared with the escape speed: too slow and it falls back, exactly at escape speed it coasts out forever
// ever more slowly, faster and it escapes with speed to spare. The same three fates, for the same reason
// (energy of motion against gravity), belong to a universe of matter: closed, flat and open.
import { canvas, axes, text, title, line, dot, row, choice, readout, loop, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 280, label: 'Height against time for a ball thrown slower than, at and faster than escape speed' });
  let k = 1, t = 0; // k = launch speed ÷ escape speed
  const ctl = row(host);
  const anim = loop(host, (dt) => { t = Math.min(8, t + dt * 1.5); cv.redraw(); });
  choice(ctl, 'Throw speed', [[0.75, 'Below escape'], [1, 'Exactly escape'], [1.2, 'Above escape']], k, (v) => { k = v; t = 0; show(); cv.redraw(); anim.play(); });
  const out = readout(host);
  const show = () => {
    out.innerHTML = k < 1 ? 'Energy of motion is less than the pull of gravity: the ball stops and falls back. A universe like this (Ω > 1) stops expanding and collapses: a <b>closed</b> universe.'
      : k > 1 ? 'More than enough energy: the ball escapes and keeps a speed forever. A universe like this (Ω < 1) expands forever: an <b>open</b> universe.'
      : 'Exactly balanced: the ball slows forever but never quite stops. This is the <b>flat</b> universe (Ω = 1), the dividing line.';
  };
  // radial motion r(t) in units with GM = 1, r0 = 1: v0 = k √2; integrate
  const path = (kk) => { let r = 1, v = kk * Math.SQRT2; const pts = [[0, 1]]; const dt = 0.002; for (let s = 0; s < 8; s += dt) { v += (-1 / (r * r)) * dt; r += v * dt; if (r < 1) { pts.push([s, 1]); break; } pts.push([s, r]); } return pts; };
  const P = { 0.75: path(0.75), 1: path(1), 1.2: path(1.2) };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 8], y: [0, 9], t: 40, xlabel: 'Time', ylabel: 'Height (size)', fx: () => '', fy: () => '' });
    const cs = { 0.75: col.s[3], 1: col.s[1], 1.2: col.s[0] };
    const tt = calm() ? 8 : t;
    ctx.save(); A.clip();
    for (const kk of [0.75, 1, 1.2]) {
      const pts = P[kk].filter(([s]) => s <= tt).map(([s, r]) => [A.X(s), A.Y(r)]);
      line(ctx, pts, cs[kk], kk === k ? 3 : 1.5, kk === k ? undefined : [4, 4]);
      if (kk === k && pts.length) dot(ctx, pts[pts.length - 1][0], pts[pts.length - 1][1], 6, cs[kk], col.panel);
    }
    ctx.restore();
    if (tt >= 7.5) text(ctx, 'above escape: open', A.X(5.6), A.Y(P[1.2].find(([s]) => s >= 6)[1]) - 14, { color: cs[1.2], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    if (tt >= 7.5) text(ctx, 'exactly escape: flat', A.X(7.9), A.Y(P[1].find(([s]) => s >= 7.8)[1]) + 16, { color: cs[1], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    if (tt >= 7.5) text(ctx, 'below escape: closed', A.X(3.3), A.Y(2.6), { color: cs[0.75], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    title(ctx, 'Three throws, three fates', col);
  };
  show(); cv.redraw();
}
