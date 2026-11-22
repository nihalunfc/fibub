// Class 10 Areas Related to Circles: arc length and sector area are both proportional to the angle θ. For a circle of radius r
// they are the straight lines  l = θ/360 × 2πr  and  A = θ/360 × πr²  through the origin: double the angle, double both.
// (Left scale: arc length in cm. Right scale: area in cm². π = 22/7.)
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let th = 120, r = 7;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Straight-line graphs of arc length and sector area against the angle at the centre' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle θ', min: 0, max: 360, step: 10, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; say(); } });
  slider(ctl, { label: 'Radius r', min: 3.5, max: 14, step: 3.5, value: r, fmt: (v) => v + ' cm', oninput: (v) => { r = v; say(); } });
  const out = readout(host); const P = 22 / 7;
  function say() { out.innerHTML = `At θ = ${th}°: arc length = <b>${(th / 360 * 2 * P * r).toFixed(1)} cm</b>, sector area = <b>${(th / 360 * P * r * r).toFixed(1)} cm²</b>. Both are ${th}/360 of the full circle's ${(2 * P * r).toFixed(1)} cm and ${(P * r * r).toFixed(1)} cm².`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Arc length and area grow in proportion to θ', col);
    const L = 2 * P * r, Ar = P * r * r;
    const A = axes(ctx, w, h, col, { x: [0, 360], y: [0, L], xt: [0, 90, 180, 270, 360], l: 44, r: 46, t: 52, b: 40, xlabel: 'angle θ (degrees)', fy: (v) => +v.toFixed(0) });
    line(ctx, [[A.X(0), A.Y(0)], [A.X(360), A.Y(L)]], col.s[0], 3); line(ctx, [[A.X(0), A.Y(0)], [A.X(360), A.Y(L)]], col.s[1], 1.5, [6, 6]);
    const y = (th / 360) * L; line(ctx, [[A.X(th), A.Y(0)], [A.X(th), A.Y(y)]], col.muted, 1.5, [4, 4]); line(ctx, [[A.L, A.Y(y)], [A.X(th), A.Y(y)]], col.muted, 1.5, [4, 4]);
    dot(ctx, A.X(th), A.Y(y), 6, col.s[3], col.panel);
    text(ctx, 'arc (cm)', A.L, A.T - 12, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, 'area (cm²)', A.R, A.T - 12, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    for (let i = 0; i <= 4; i++) text(ctx, String(Math.round((Ar * i) / 4)), A.R + 6, A.Y((L * i) / 4), { color: col.s[1], size: 10.5, weight: 600 });
  };
  say();
}
