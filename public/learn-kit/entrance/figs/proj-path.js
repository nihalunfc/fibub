// Motion in a plane: a projectile. Choose the launch speed, angle and launch height; the path, the velocity
// components at the moving ball and the range, greatest height and time of flight update. The horizontal
// velocity arrow never changes; only the vertical one shrinks, flips and grows.
import { canvas, axes, line, dot, arrow, text, row, slider, readout, loop, button } from '../../kit.js';

const G = 9.8;
export default function (host) {
  let u = 20, deg = 45, h0 = 0, t = 0, ghost = true;
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 260, label: 'Path of a projectile with its horizontal and vertical velocity arrows' });
  const ctl = row(host);
  const re = () => { t = 0; cv.redraw(); show(); };
  slider(ctl, { label: 'Speed u', min: 5, max: 30, step: 1, value: u, fmt: (v) => `${v} m/s`, oninput: (v) => { u = v; re(); } });
  slider(ctl, { label: 'Angle θ', min: 0, max: 90, step: 1, value: deg, fmt: (v) => `${v}°`, oninput: (v) => { deg = v; re(); } });
  slider(ctl, { label: 'Height', min: 0, max: 30, step: 1, value: h0, fmt: (v) => `${v} m`, oninput: (v) => { h0 = v; re(); } });
  const anim = loop(host, (dt) => { t += dt; if (t > flight() + 0.8) t = 0; cv.redraw(); });
  anim.button(ctl);
  const gb = button(ctl, 'Hide 90° − θ', () => { ghost = !ghost; gb.textContent = ghost ? 'Hide 90° − θ' : 'Show 90° − θ'; cv.redraw(); });
  const out = readout(host);
  const comp = (d) => { const a = (d * Math.PI) / 180; return [u * Math.cos(a), u * Math.sin(a)]; };
  const flightOf = (d) => { const [, uy] = comp(d); return (uy + Math.sqrt(uy * uy + 2 * G * h0)) / G; };
  const flight = () => flightOf(deg);
  const show = () => {
    const [ux, uy] = comp(deg), T = flight(), R = ux * T, H = h0 + (uy * uy) / (2 * G);
    out.innerHTML = `u<sub>x</sub> = ${ux.toFixed(1)} m/s (constant), u<sub>y</sub> = ${uy.toFixed(1)} m/s. Time of flight <b>${T.toFixed(2)} s</b>, range <b>${R.toFixed(1)} m</b>, greatest height <b>${H.toFixed(1)} m</b>` +
      (h0 === 0 && deg > 0 && deg < 90 ? `. The angle ${90 - deg}° gives the same range.` : '.');
  };
  cv.draw = (ctx, w, h, col) => {
    const nice = (v) => { const p = Math.pow(10, Math.floor(Math.log10(v))); return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= v); };
    const R45 = Math.max(...[20, 25, 30, 35, 40, 45].map((d) => comp(d)[0] * flightOf(d))), Hmax = h0 + (u * u) / (2 * G);
    const xmax = nice(Math.max(10, R45 * 1.05)), ymax = nice(Math.max(5, Hmax * 1.1));
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, xmax], y: [0, ymax], xlabel: 'x (m)', ylabel: 'y (m)', t: 26 });
    const path = (d) => { const [ux, uy] = comp(d), T = flightOf(d), pts = []; for (let i = 0; i <= 80; i++) { const ti = (T * i) / 80; pts.push([X(ux * ti), Y(h0 + uy * ti - 0.5 * G * ti * ti)]); } return pts; };
    ctx.save(); clip();
    if (h0 > 0) { ctx.fillStyle = col.soft; ctx.fillRect(X(-2), Y(h0), X(0) - X(-2) + 6, Y(0) - Y(h0)); }
    if (ghost && h0 === 0 && deg > 0 && deg < 90 && deg !== 45) line(ctx, path(90 - deg), col.muted, 1.5, [5, 4]);
    line(ctx, path(deg), col.s[0], 2.5);
    const [ux, uy] = comp(deg), tt = Math.min(t, flight()), vy = uy - G * tt;
    const bx = X(ux * tt), by = Y(h0 + uy * tt - 0.5 * G * tt * tt), k = 2.2;
    if (ux > 0.2) arrow(ctx, bx, by, bx + ux * k, by, col.s[1], 2);
    if (Math.abs(vy) > 0.2) arrow(ctx, bx, by, bx, by - vy * k, col.s[2], 2);
    dot(ctx, bx, by, 6, col.s[3]);
    ctx.restore();
    text(ctx, `vx = ${ux.toFixed(1)}`, 60, 12, { color: col.s[1], size: 11, weight: 600 });
    text(ctx, `vy = ${vy.toFixed(1)} m/s`, 130, 12, { color: col.s[2], size: 11, weight: 600 });
  };
  cv.redraw(); show();
}
