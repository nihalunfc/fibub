// Class 11 Maths, Straight Lines: the normal form x cos α + y sin α = p. Drop a perpendicular of length p from the origin
// to the line; α is the angle the perpendicular makes with the positive x-axis. Slide p and α to move and turn the line.
import { canvas, axes, row, slider, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let al = 40, p = 3;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'A line drawn from its perpendicular distance p from the origin at angle alpha' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'angle α', min: 0, max: 360, step: 5, value: al, fmt: (v) => v + '°', oninput: (v) => { al = v; re(); } });
  slider(c1, { label: 'distance p', min: 0.5, max: 6, step: 0.5, value: p, fmt: String, oninput: (v) => { p = v; re(); } });
  const re = () => { cv.redraw(); const c = Math.cos(al * Math.PI / 180), s = Math.sin(al * Math.PI / 180); out.innerHTML = `x cos ${al}° + y sin ${al}° = ${p}, that is <b>${c.toFixed(2)}x ${s < 0 ? '−' : '+'} ${Math.abs(s).toFixed(2)}y = ${p}</b>. The foot of the perpendicular from O is (${(p * c).toFixed(2)}, ${(p * s).toFixed(2)}) and its length is p = ${p}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Normal form: x cos α + y sin α = p', col), g = axes(ctx, w, h, col, { x: [-7, 7], y: [-7, 7], l: 26, b: 22, t: top + 4, r: 10, xt: [-6, -3, 0, 3, 6], yt: [-6, -3, 0, 3, 6] }), a = al * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), fx = p * c, fy = p * s;
    ctx.save(); g.clip(); line(ctx, [[g.X(fx - 12 * -s), g.Y(fy - 12 * c)], [g.X(fx + 12 * -s), g.Y(fy + 12 * c)]], col.s[0], 2.5); ctx.restore();
    line(ctx, [[g.X(0), g.Y(0)], [g.X(fx), g.Y(fy)]], col.s[1], 2.5); dot(ctx, g.X(fx), g.Y(fy), 6, col.s[1], col.panel); dot(ctx, g.X(0), g.Y(0), 4, col.ink);
    ctx.beginPath(); ctx.arc(g.X(0), g.Y(0), 26, 0, -a, true); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'α', g.X(0) + 32 * Math.cos(a / 2), g.Y(0) - 32 * Math.sin(a / 2), { color: col.s[2], size: 12, weight: 700, align: 'center' });
    text(ctx, 'p', g.X(fx / 2) + 10 * -s, g.Y(fy / 2) - 10 * c, { color: col.s[1], size: 12, weight: 700, align: 'center' });
  };
  re();
}
