// 10.3 Spherical collapse (Gunn and Gott 1972), in a matter-only universe. A ball of matter slightly denser than
// average expands with the universe, slows more than its surroundings, stops (turnaround, when it is 9π²/16 ≈ 5.55
// times denser than average), and falls back. Exactly spherical, it would fall to a point at twice the turnaround
// time; in reality its bits pass through and swirl about until they settle (virialise) at half the turnaround
// radius. At that moment it is 18π² ≈ 178 times denser than the average universe around it.
// Shell: R = A (1 − cos θ), t = B (θ − sin θ). Background shell of the same mass: R ∝ t^(2/3).
import { canvas, axes, text, title, line, dot, loop, calm, clamp } from '../../kit.js';

const tOf = (th) => (th - Math.sin(th)) / Math.PI; // time in units of the turnaround time
const RofT = (th) => (1 - Math.cos(th)) / 2;      // radius in units of the turnaround radius

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 320, label: 'Radius of a slightly overdense ball of matter against time: it expands, turns around, collapses and settles' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); if (t > 5) anim.pause(); }, { autoplay: false });
  // background: same mass at mean density. At turnaround the ball is 5.55× denser: R_bg(t_ta) = 5.55^(1/3) R_ta
  const bgk = Math.cbrt(9 * Math.PI * Math.PI / 16);
  const Rbg = (tt) => bgk * Math.pow(tt, 2 / 3);
  const ends = [0.55 * Math.PI, Math.PI, 1.75 * Math.PI, 2 * Math.PI];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['Expanding, a little slower than average', 'Turnaround: it stops growing', 'Falling back in', 'Settled: a halo, 178 times denser'][step], col) + 2;
    const A = axes(ctx, w, h, col, { x: [0, 3], y: [0, 2.2], t: top + 10, xlabel: 'Time (turnaround = 1)', ylabel: 'Radius (turnaround = 1)' });
    const bg = []; for (let i = 1; i <= 120; i++) { const tt = (i / 120) * 3; bg.push([A.X(tt), A.Y(Rbg(tt))]); }
    ctx.save(); A.clip(); line(ctx, bg, col.muted, 2, [6, 4]); ctx.restore();
    text(ctx, 'average universe', A.X(0.95), A.Y(Rbg(0.95)) - 12, { color: col.muted, size: 11, weight: 600, align: 'right', halo: col.panel });
    const k = calm() ? 1 : clamp(t / 3.5, 0, 1);
    const th0 = step ? ends[step - 1] : 0.02, th1 = step === 3 ? 1.75 * Math.PI : ends[step];
    const thNow = th0 + (th1 - th0) * k;
    const pts = []; for (let i = 0; i <= 200; i++) { const th = 0.001 + (i / 200) * (thNow - 0.001); pts.push([A.X(tOf(th)), A.Y(RofT(th))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3);
    if (step === 3) {
      // the ideal collapse to a point, faint, and the settled radius
      const ideal = []; for (let i = 0; i <= 60; i++) { const th = 1.75 * Math.PI + (i / 60) * 0.25 * Math.PI; ideal.push([A.X(tOf(th)), A.Y(RofT(th))]); }
      line(ctx, ideal, col.s[0], 1.5, [2, 4]);
      const x0 = A.X(tOf(1.75 * Math.PI)), xs = []; for (let i = 0; i <= 60; i++) { const f = i / 60; xs.push([x0 + f * (A.X(3) - x0), A.Y(0.5 + (RofT(1.75 * Math.PI) - 0.5) * Math.exp(-5 * f) * Math.cos(16 * f))]); }
      line(ctx, xs, col.s[3], 3);
    }
    ctx.restore();
    const R = RofT(thNow), T0 = tOf(thNow);
    if (step < 3) dot(ctx, A.X(T0), A.Y(R), 5, col.s[0], col.panel);
    if (step >= 1) { line(ctx, [[A.X(1), A.Y(1)], [A.X(1), A.B]], col.s[1], 1, [3, 3]); text(ctx, 'turnaround', A.X(1), A.Y(1) - 12, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); }
    if (step === 1) text(ctx, '5.55 × denser than average', A.X(1) + 8, A.Y(0.78), { color: col.s[1], size: 11, halo: col.panel });
    if (step === 3) {
      line(ctx, [[A.L, A.Y(0.5)], [A.R, A.Y(0.5)]], col.s[3], 1, [3, 3]);
      text(ctx, 'half the turnaround radius', A.R - 4, A.Y(0.5) - 10, { color: col.s[3], size: 11, weight: 700, align: 'right', halo: col.panel });
      text(ctx, '178 × denser than average', A.R - 4, A.Y(0.5) + 12, { color: col.s[3], size: 11, align: 'right', halo: col.panel });
    }
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); anim.play(); } };
}
