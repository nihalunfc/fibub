// 2.4 The effective potential. Left: U_eff(r) = −k/r + L²/(2μr²) with the energy line; the particle can only be where
// the line is above the curve. Right: the orbit that goes with that energy and angular momentum (units k = μ = 1).
import { canvas, axes, line, dot, text, row, slider, readout, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Effective potential curve with an energy line, and the matching orbit' });
  let L = 1, E = -0.3;
  const ctl = row(host);
  slider(ctl, { label: 'Angular momentum L', min: 0.5, max: 1.5, step: 0.01, value: L, fmt: (x) => fmt(x, 3), oninput: (x) => { L = x; clampE(); cv.redraw(); show(); } });
  const sE = slider(ctl, { label: 'Energy E', min: -1.5, max: 0.4, step: 0.01, value: E, fmt: (x) => fmt(x, 3), oninput: (x) => { E = x; clampE(); cv.redraw(); show(); } });
  const out = readout(host);
  const Ueff = (r) => -1 / r + (L * L) / (2 * r * r);
  const Emin = () => -1 / (2 * L * L); // the minimum of U_eff, at r0 = L²
  const clampE = () => { if (E < Emin()) { E = Emin(); sE.set(E); } };
  const ecc = () => Math.sqrt(Math.max(0, 1 + 2 * E * L * L));
  const show = () => {
    const e = ecc(), p = L * L;
    const kind = e < 1e-3 ? 'a circle' : E < -1e-9 ? 'an ellipse' : E < 1e-9 ? 'a parabola (it just escapes)' : 'a hyperbola (it escapes)';
    const turn = E < -1e-9 ? `turning points r = ${fmt(p / (1 + e), 3)} and ${fmt(p / (1 - e), 3)}` : `closest approach r = ${fmt(p / (1 + e), 3)}`;
    out.innerHTML = `Eccentricity e = √(1 + 2EL²) = <b>${fmt(e, 3)}</b>: the orbit is <b>${kind}</b>; ${turn}. The lowest energy possible for this L is ${fmt(Emin(), 3)}, a circular orbit at r = L² = ${fmt(p, 3)}.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const split = W * 0.58;
    title(ctx, 'U_eff(r) and the energy line', col);
    const ax = axes(ctx, split, H, col, { x: [0, 6], y: [-2.2, 1.2], xlabel: 'r', ylabel: 'energy', t: 40 });
    ctx.save(); ax.clip();
    const pts = [];
    for (let r = 0.12; r <= 6; r += 0.02) pts.push([ax.X(r), ax.Y(Math.max(-2.3, Math.min(1.3, Ueff(r))))]);
    line(ctx, pts, col.s[0], 2.5);
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(6), ax.Y(0)]], col.muted, 1, [4, 4]);
    line(ctx, [[ax.X(0), ax.Y(E)], [ax.X(6), ax.Y(E)]], col.line, 1.2, [2, 4]);
    // the energy line drawn bold only where motion is allowed (E >= U_eff)
    let seg = [];
    const segs = [];
    for (let r = 0.12; r <= 6; r += 0.01) { if (E >= Ueff(r)) seg.push([ax.X(r), ax.Y(E)]); else if (seg.length) { segs.push(seg); seg = []; } }
    if (seg.length) segs.push(seg);
    segs.forEach((s) => line(ctx, s, col.s[3], 3));
    ctx.restore();
    text(ctx, 'allowed where the energy line is above the curve', 8, H - 6, { color: col.muted, size: 10.5, base: 'bottom' });
    // orbit panel: r = p / (1 + e cos θ) with the force centre at the focus
    const e = ecc(), p = L * L;
    const fx = split + (W - split) * 0.62, fy = H / 2 + 10;
    const scale = (Math.min(W - split, H) * 0.42) / 3;
    const opts = [];
    const lim = e < 1 ? Math.PI : Math.acos(-1 / e) - 0.02;
    for (let th = -lim; th <= lim + 1e-9; th += 0.01) {
      const rr = p / (1 + e * Math.cos(th));
      if (rr > 0 && rr < 14) opts.push([fx + scale * rr * Math.cos(th), fy - scale * rr * Math.sin(th)]);
    }
    ctx.save(); ctx.beginPath(); ctx.rect(split + 4, 26, W - split - 8, H - 30); ctx.clip();
    line(ctx, opts, col.s[3], 2.5);
    ctx.restore();
    dot(ctx, fx, fy, 5, col.ink);
    text(ctx, 'orbit (dot = force centre)', split + 8, 34, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
