// Class 11 Maths, Straight Lines: the angle between two lines with slopes m1 and m2 is given by
// tan θ = |(m1 − m2)/(1 + m1 m2)|. Equal slopes give θ = 0 (parallel); m1·m2 = −1 makes the denominator 0, so θ = 90° (perpendicular).
import { canvas, axes, row, slider, readout, line, text, title } from '../../kit.js';

export default function (host) {
  let m1 = 2, m2 = -0.5;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Two lines through the origin with slopes m1 and m2 and the angle between them' });
  const c1 = row(host), out = readout(host);
  const f = (v) => String(+v.toFixed(2)).replace('-', '−');
  slider(c1, { label: 'slope m₁', min: -4, max: 4, step: 0.25, value: m1, fmt: f, oninput: (v) => { m1 = v; re(); } });
  slider(c1, { label: 'slope m₂', min: -4, max: 4, step: 0.25, value: m2, fmt: f, oninput: (v) => { m2 = v; re(); } });
  const re = () => { cv.redraw(); const den = 1 + m1 * m2, th = Math.abs(den) < 1e-9 ? 90 : Math.atan(Math.abs((m1 - m2) / den)) * 180 / Math.PI; out.innerHTML = `tan θ = |(${f(m1)} − ${f(m2)}) / (1 + ${f(m1)}×${f(m2)})| = |${f(m1 - m2)} / ${f(den)}|. ${Math.abs(den) < 1e-9 ? 'The denominator is 0: the lines are <b>perpendicular</b> (m₁m₂ = −1), θ = 90°.' : m1 === m2 ? 'Equal slopes: <b>parallel</b>, θ = 0°.' : `The acute angle between the lines is <b>${th.toFixed(1)}°</b>; the other angle is ${(180 - th).toFixed(1)}°.`}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle between two lines', col), g = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], l: 26, b: 22, t: top + 4, r: 10, xt: [-6, -3, 0, 3, 6], yt: [-6, -3, 0, 3, 6] });
    ctx.save(); g.clip(); line(ctx, [[g.X(-8), g.Y(-8 * m1)], [g.X(8), g.Y(8 * m1)]], col.s[0], 2.5); line(ctx, [[g.X(-8), g.Y(-8 * m2)], [g.X(8), g.Y(8 * m2)]], col.s[1], 2.5); ctx.restore();
    const a1 = Math.atan(m1), a2 = Math.atan(m2); ctx.beginPath(); ctx.arc(g.X(0), g.Y(0), 40, -Math.max(a1, a2), -Math.min(a1, a2)); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, 'm₁ = ' + f(m1), g.R - 6, g.Y(Math.max(-5.5, Math.min(5.5, 5.5 * m1))) - 8 * Math.sign(m1 || 1), { color: col.s[0], size: 11, weight: 700, align: 'right' }); text(ctx, 'm₂ = ' + f(m2), g.R - 6, g.Y(Math.max(-5.5, Math.min(5.5, 5.5 * m2))) + 12 * Math.sign(m1 === m2 ? 1 : 1), { color: col.s[1], size: 11, weight: 700, align: 'right' });
  };
  re();
}
