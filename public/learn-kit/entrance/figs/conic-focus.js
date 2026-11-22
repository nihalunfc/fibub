// Conic sections from one rule: a point P moves so that its distance to the focus S is e times its distance to the
// directrix. e < 1 gives an ellipse, e = 1 a parabola, e > 1 a hyperbola. Drag P along the curve and watch
// PS / PM stay equal to e.
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let e = 0.6, p = 3, th = 70;
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 280, label: 'A conic drawn from a focus and a directrix, with a point P and its two distances' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'eccentricity e', min: 0.1, max: 2, step: 0.05, value: e, fmt: (v) => fmt(v, 3), oninput: (v) => { e = Math.abs(v - 1) < 0.026 ? 1 : v; re(); } });
  slider(ctl, { label: 'focus to directrix', min: 1, max: 5, step: 0.5, value: p, fmt: (v) => fmt(v, 2), oninput: (v) => { p = v; re(); } });
  slider(ctl, { label: 'move P (angle at S)', min: -170, max: 170, step: 5, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; re(); } });
  const out = readout(host);
  // focus at the origin, directrix x = p; polar equation r = e p / (1 + e cos θ)
  const rr = (t) => (e * p) / (1 + e * Math.cos(t));
  const name = () => (e < 1 ? 'an ellipse' : e === 1 ? 'a parabola' : 'a hyperbola');
  const P = () => { const t = (th * Math.PI) / 180, r = rr(t); return r > 0 && r < 60 ? [r * Math.cos(t), r * Math.sin(t)] : null; };
  const show = () => {
    const pt = P();
    const extra = e < 1 ? ` For this ellipse, semi-major axis a = ep/(1 − e²) = ${fmt((e * p) / (1 - e * e), 4)}, b = a√(1 − e²) = ${fmt(((e * p) / (1 - e * e)) * Math.sqrt(1 - e * e), 4)}.` : e > 1 ? ` For this hyperbola, a = ep/(e² − 1) = ${fmt((e * p) / (e * e - 1), 4)}, b = a√(e² − 1) = ${fmt(((e * p) / (e * e - 1)) * Math.sqrt(e * e - 1), 4)}; P is on the branch near the focus.` : ' For this parabola the vertex is halfway between the focus and the directrix.';
    if (!pt) { out.innerHTML = `e = ${fmt(e, 3)}: the curve is ${name()}. At this angle the ray from S never meets the near branch; move P back.${extra}`; return; }
    const PS = Math.hypot(pt[0], pt[1]), PM = Math.abs(p - pt[0]);
    out.innerHTML = `e = ${fmt(e, 3)}: the curve is <b>${name()}</b>. PS = ${fmt(PS, 4)}, PM = ${fmt(PM, 4)}, PS/PM = <b>${fmt(PS / PM, 4)}</b>, always e. Semi-latus rectum ℓ = ep = ${fmt(e * p, 3)}.${extra}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const Ly = 7, Lx = (Ly * (w - 48)) / (h - 50), cx = -Lx * 0.15;
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [cx - Lx, cx + Lx], y: [-Ly, Ly], l: 34, r: 14, t: 22, b: 28 });
    ctx.save(); clip();
    line(ctx, [[X(cx - Lx), Y(0)], [X(cx + Lx), Y(0)]], col.muted, 1);
    line(ctx, [[X(p), Y(-Ly)], [X(p), Y(Ly)]], col.s[2], 2, [6, 4]);
    text(ctx, 'directrix', X(p) + 6, Y(Ly) + 12, { color: col.s[2], size: 11, halo: col.panel });
    // curve: sample θ, break where r blows up or turns negative
    let pts = [];
    for (let i = 0; i <= 720; i++) {
      const t = -Math.PI + (i / 720) * 2 * Math.PI, r = rr(t);
      if (r > 0 && r < 80) pts.push([X(r * Math.cos(t)), Y(r * Math.sin(t))]); else { line(ctx, pts, col.s[0], 2.5); pts = []; }
    }
    line(ctx, pts, col.s[0], 2.5);
    if (e > 1) { // far branch: r < 0 points of the same polar equation
      pts = [];
      for (let i = 0; i <= 720; i++) { const t = -Math.PI + (i / 720) * 2 * Math.PI, r = rr(t); if (r < 0 && r > -80) pts.push([X(r * Math.cos(t)), Y(r * Math.sin(t))]); else { line(ctx, pts, col.s[0], 1.5, [3, 3]); pts = []; } }
      line(ctx, pts, col.s[0], 1.5, [3, 3]);
    }
    dot(ctx, X(0), Y(0), 5, col.s[1]); text(ctx, 'S', X(0) - 14, Y(0) - 10, { color: col.s[1], weight: 700, halo: col.panel });
    const pt = P();
    if (pt) {
      line(ctx, [[X(0), Y(0)], [X(pt[0]), Y(pt[1])]], col.s[1], 2);
      line(ctx, [[X(pt[0]), Y(pt[1])], [X(p), Y(pt[1])]], col.s[2], 2);
      dot(ctx, X(p), Y(pt[1]), 3.5, col.s[2]); text(ctx, 'M', X(p) + 6, Y(pt[1]) - 8, { color: col.s[2], size: 11, halo: col.panel });
      dot(ctx, X(pt[0]), Y(pt[1]), 5, col.ink); text(ctx, 'P', X(pt[0]) - 14, Y(pt[1]) - 10, { color: col.ink, weight: 700, halo: col.panel });
    }
    ctx.restore();
  };
  re();
}
