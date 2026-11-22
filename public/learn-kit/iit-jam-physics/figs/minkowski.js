// 2.9 A Minkowski diagram with a velocity slider. Frame S has ct up and x across; light rays run at 45°. The axes of
// frame S' (moving at βc along +x) close in on the light line like scissors. An event E (drag the sliders) gets
// coordinates in both frames from the Lorentz transformation, and the hyperbola through it, c²t² − x² = const, shows
// the interval that every frame agrees on. Units: light-years and years, so c = 1.
import { canvas, line, dot, text, row, slider, readout, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.86, max: 460, min: 300, label: 'Minkowski diagram with the axes of a moving frame and one event' });
  let b = 0.5, ex = 1.5, et = 3;
  const ctl = row(host);
  slider(ctl, { label: 'Speed of S′ (β = v/c)', min: -0.9, max: 0.9, step: 0.01, value: b, fmt: (x) => fmt(x, 2), oninput: (x) => { b = x; cv.redraw(); show(); } });
  slider(ctl, { label: 'Event x (ly)', min: -4, max: 4, step: 0.1, value: ex, fmt: (x) => fmt(x, 2), oninput: (x) => { ex = x; cv.redraw(); show(); } });
  slider(ctl, { label: 'Event ct (y)', min: -4, max: 4, step: 0.1, value: et, fmt: (x) => fmt(x, 2), oninput: (x) => { et = x; cv.redraw(); show(); } });
  const out = readout(host);
  const g = () => 1 / Math.sqrt(1 - b * b);
  const prime = () => ({ t: g() * (et - b * ex), x: g() * (ex - b * et) });
  const show = () => {
    const p = prime(), s2 = et * et - ex * ex;
    const kind = Math.abs(s2) < 1e-9 ? 'lightlike (on a light ray from the origin)' : s2 > 0 ? `timelike: a clock could go from O to E, recording ${fmt(Math.sqrt(s2), 3)} years, and every frame agrees on the order` : 'spacelike: no signal can link O and E, and frames disagree on which came first';
    out.innerHTML = `γ = ${fmt(g(), 3)}. In S: (x, ct) = (${fmt(ex, 3)}, ${fmt(et, 3)}). In S′: x′ = γ(x − βct) = <b>${fmt(p.x, 3)}</b>, ct′ = γ(ct − βx) = <b>${fmt(p.t, 3)}</b>. Interval c²t² − x² = <b>${fmt(s2, 3)}</b> in both frames: ${kind}.`;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Spacetime of S (black) and S′ (colour)', col);
    const cx = W / 2, cy = H / 2 + 10, u = Math.min(W, H - 30) / 10.5; // px per unit
    const X = (x) => cx + x * u, Y = (t) => cy - t * u, lim = 5;
    ctx.save(); ctx.beginPath(); ctx.rect(4, 28, W - 8, H - 32); ctx.clip();
    // S grid
    for (let i = -lim; i <= lim; i++) {
      line(ctx, [[X(i), Y(-lim)], [X(i), Y(lim)]], col.line, 1);
      line(ctx, [[X(-lim), Y(i)], [X(lim), Y(i)]], col.line, 1);
    }
    line(ctx, [[X(-lim), Y(0)], [X(lim), Y(0)]], col.ink, 1.8);
    line(ctx, [[X(0), Y(-lim)], [X(0), Y(lim)]], col.ink, 1.8);
    // light rays
    line(ctx, [[X(-lim), Y(-lim)], [X(lim), Y(lim)]], col.s[2], 1.5, [6, 4]);
    line(ctx, [[X(-lim), Y(lim)], [X(lim), Y(-lim)]], col.s[2], 1.5, [6, 4]);
    // S' axes: ct' axis is x = β ct; x' axis is ct = β x. Grid lines of S' through integer x', ct'.
    const G = g();
    const fromPrime = (xp, tp) => [G * (xp + b * tp), G * (tp + b * xp)]; // (x, ct)
    for (let i = -6; i <= 6; i++) {
      const a1 = fromPrime(i, -8), a2 = fromPrime(i, 8), b1 = fromPrime(-8, i), b2 = fromPrime(8, i);
      line(ctx, [[X(a1[0]), Y(a1[1])], [X(a2[0]), Y(a2[1])]], col.s[0], i === 0 ? 2.4 : 0.6, i === 0 ? undefined : [2, 4]);
      line(ctx, [[X(b1[0]), Y(b1[1])], [X(b2[0]), Y(b2[1])]], col.s[0], i === 0 ? 2.4 : 0.6, i === 0 ? undefined : [2, 4]);
    }
    // invariant hyperbola through E
    const s2 = et * et - ex * ex, hyp = [];
    if (Math.abs(s2) > 0.01) {
      const branch = [];
      for (let q = -3; q <= 3; q += 0.02) {
        const r = Math.sqrt(Math.abs(s2));
        branch.push(s2 > 0 ? [r * Math.sinh(q), Math.sign(et) * r * Math.cosh(q)] : [Math.sign(ex) * r * Math.cosh(q), r * Math.sinh(q)]);
      }
      branch.forEach(([x, t]) => hyp.push([X(x), Y(t)]));
      line(ctx, hyp, col.s[1], 1.6, [5, 3]);
    }
    // projections of E onto the S' axes (parallel to the other S' axis)
    const p = prime(), onT = fromPrime(0, p.t), onX = fromPrime(p.x, 0);
    line(ctx, [[X(ex), Y(et)], [X(onT[0]), Y(onT[1])]], col.s[0], 1.2, [3, 3]);
    line(ctx, [[X(ex), Y(et)], [X(onX[0]), Y(onX[1])]], col.s[0], 1.2, [3, 3]);
    ctx.restore();
    dot(ctx, X(ex), Y(et), 6, col.s[3], col.panel);
    text(ctx, 'E', X(ex) + 8, Y(et) - 8, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'ct', X(0) + 6, Y(lim) + 34, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'x', W - 14, Y(0) - 10, { color: col.ink, size: 12, weight: 700, align: 'right' });
    const tp = fromPrime(0, 4), xp = fromPrime(4, 0);
    text(ctx, 'ct′', X(tp[0]) + 6, Y(tp[1]), { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'x′', X(xp[0]), Y(xp[1]) - 10, { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'light', X(3.6), Y(3.6) + 12, { color: col.s[2], size: 10.5, halo: col.panel });
  };
  cv.redraw(); show();
}
