// Class 11 Motion in a Plane: range against launch angle. R = u^2 sin(2 theta)/g, largest at 45 degrees; angles theta and 90 - theta give the same range
// (sin 2 theta = sin(180 - 2 theta)) although the paths differ: the steeper one goes higher and stays up longer. The lower panel draws both paths to the same landing spot.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let u = 25, th = 30; const g = 9.8;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Range against launch angle and the two paths for complementary angles' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Launch speed u (m/s)', min: 10, max: 40, step: 1, value: u, fmt: (v) => v + '', oninput: (v) => { u = v; go(); } });
  slider(ctl, { label: 'Angle θ', min: 5, max: 85, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; go(); } });
  const Rf = (a) => (u * u * Math.sin(2 * a * Math.PI / 180)) / g;
  function go() { out.innerHTML = `u = ${u} m/s. At θ = ${th}° the range is <b>${Rf(th).toFixed(1)} m</b>; at the complementary angle ${90 - th}° it is <b>${Rf(90 - th).toFixed(1)} m</b> (the same). The best angle is 45°: ${Rf(45).toFixed(1)} m. Height at ${th}°: ${((u * Math.sin(th * Math.PI / 180)) ** 2 / (2 * g)).toFixed(1)} m; at ${90 - th}°: ${((u * Math.sin((90 - th) * Math.PI / 180)) ** 2 / (2 * g)).toFixed(1)} m.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Range R = u² sin2θ / g', col);
    const gh = h * 0.5, Rm = (u * u) / g, A = axes(ctx, w, gh + 24, col, { x: [0, 90], y: [0, Rm * 1.1], xt: [0, 15, 30, 45, 60, 75, 90], xlabel: 'launch angle θ (degrees)', ylabel: 'range (m)', l: 46, t: 28, b: 38 });
    ctx.save(); A.clip(); const p = []; for (let a = 0; a <= 90; a += 1.5) p.push([A.X(a), A.Y(Rf(a))]); line(ctx, p, col.ink, 2.5); ctx.restore();
    dot(ctx, A.X(th), A.Y(Rf(th)), 6, col.s[0], col.panel); dot(ctx, A.X(90 - th), A.Y(Rf(90 - th)), 6, col.s[1], col.panel); dot(ctx, A.X(45), A.Y(Rm), 5, col.s[3], col.panel);
    text(ctx, '45° best', A.X(45) - 9, A.Y(Rm) + 2, { size: 10.5, weight: 700, color: col.s[3], align: 'right' });
    const gy = h - 18, L = 18, S = Math.min((w - L - 18) / Rm, (gy - (gh + 40)) / (Math.max(u * u / (2 * g) * 1.05, 1))), X = (x) => L + x * S, Y = (y) => gy - y * S;
    line(ctx, [[L - 6, gy], [w - 8, gy]], col.ink, 2);
    [[th, col.s[0]], [90 - th, col.s[1]]].forEach(([a, c], k) => { const r = a * Math.PI / 180, vx = u * Math.cos(r), vy = u * Math.sin(r), T = (2 * vy) / g, pts = []; for (let i = 0; i <= 50; i++) { const q = (T * i) / 50; pts.push([X(vx * q), Y(vy * q - 0.5 * g * q * q)]); } line(ctx, pts, c, 2.2, k ? [5, 3] : undefined); });
    text(ctx, `${th}°`, w - 10, gh + 50, { size: 11, weight: 700, color: col.s[0], align: 'right' }); text(ctx, `${90 - th}° (dashed)`, w - 10, gh + 66, { size: 11, weight: 700, color: col.s[1], align: 'right' });
  };
  go();
}
