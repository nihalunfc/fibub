// Class 11 Work, Energy and Power: kinetic energy 1/2 m v^2 and stopping distance. Friction does work -mu m g d, which must remove all the kinetic energy:
// d = v^2 / (2 mu g). Doubling the speed makes the stopping distance 4 times. Animated car braking, plus the d-v graph for dry road, wet road and ice.
import { canvas, axes, line, text, title, row, slider, button, choice, readout, loop, dot } from '../../kit.js';

export default function (host) {
  let v0 = 20, mu = 0.7, x = 0, v = 0, go = false;
  const g = 9.8;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A braking car and a graph of stopping distance against speed for dry, wet and icy roads' });
  const ctl = row(host);
  slider(ctl, { label: 'Speed before braking', min: 5, max: 40, step: 1, value: 20, fmt: (s) => s + ' m/s (' + Math.round(s * 3.6) + ' km/h)', oninput: (s) => { v0 = s; go = false; x = 0; cv.redraw(); } });
  choice(ctl, 'Road', [[0.7, 'Dry'], [0.4, 'Wet'], [0.1, 'Ice']], 0.7, (c) => { mu = c; go = false; x = 0; cv.redraw(); });
  const b2 = row(host); button(b2, 'Brake!', () => { go = true; x = 0; v = v0; });
  const ro = readout(host);
  loop(host, (dt) => { if (!go) return; const a = mu * g; v = Math.max(0, v - a * dt); x += v * dt; if (v === 0) go = false; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Stopping distance grows as speed squared', col), d = v0 * v0 / (2 * mu * g);
    const ry = top + 46, sc = (w - 90) / Math.max(10, d * 1.05);
    line(ctx, [[10, ry + 14], [w - 10, ry + 14]], col.muted, 3);
    line(ctx, [[20, ry + 14], [20 + x * sc, ry + 14]], col.s[3], 4);
    const cx = 20 + x * sc; ctx.fillStyle = col.s[0]; ctx.fillRect(cx, ry - 8, 34, 16); dot(ctx, cx + 8, ry + 10, 4, col.ink); dot(ctx, cx + 26, ry + 10, 4, col.ink);
    line(ctx, [[20 + d * sc + 34, ry - 14], [20 + d * sc + 34, ry + 20]], col.s[2], 2, [3, 3]);
    text(ctx, 'stops here', Math.min(w - 44, 20 + d * sc + 36), ry - 22, { color: col.s[2], size: 10, align: 'center' });
    const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 400], xt: [0, 10, 20, 30, 40], yt: [0, 100, 200, 300, 400], xlabel: 'speed before braking (m/s)', ylabel: 'stopping distance (m)', t: ry + 38, l: 46 });
    [[0.7, 0], [0.4, 1], [0.1, 3]].forEach(([c, i]) => { const pts = []; for (let k = 0; k <= 40; k++) pts.push([A.X(k), A.Y(Math.min(400, k * k / (2 * c * g)))]); ctx.save(); A.clip(); line(ctx, pts, c === mu ? col.s[i] : col.line, c === mu ? 3 : 1.5); ctx.restore(); });
    dot(ctx, A.X(v0), A.Y(Math.min(400, d)), 5, col.s[2], col.panel);
    text(ctx, 'dry', A.X(40) - 4, A.Y(40 * 40 / (2 * 0.7 * g)) - 8, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'wet', A.X(30), A.Y(30 * 30 / (2 * 0.4 * g)) - 8, { color: col.muted, size: 10, align: 'right' });
    ro.textContent = `KE = ½ m v² is wiped out by friction over d = v²/(2μg) = ${d.toFixed(1)} m. Double the speed and the distance becomes four times as long.`;
  };
  cv.redraw();
}
