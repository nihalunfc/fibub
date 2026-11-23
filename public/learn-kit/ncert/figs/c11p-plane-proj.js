// Class 11 Motion in a Plane: projectile motion. A body launched at speed u and angle theta has two independent motions: horizontally at constant velocity u cos(theta)
// (nothing pushes sideways) and vertically with acceleration -g, starting at u sin(theta). Together: a parabola. The dashed line shows where the ball would go with no gravity;
// gravity pulls it down by (1/2) g t^2 below that line at every moment.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let u = 25, th = 50, t = 0, hold = 0, ghost = true, comps = true; const g = 9.8;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A launched ball with its parabolic path, velocity components and the no-gravity line' });
  const ctl = row(host), out = readout(host);
  const T = () => 2 * u * Math.sin(th * Math.PI / 180) / g;
  const anim = loop(host, (d) => { if (hold > 0) { hold -= d; if (hold <= 0) t = 0; } else { t += d * Math.max(0.7, T() / 3.5); if (t >= T()) { t = T(); hold = 1; } } say(false); });
  slider(ctl, { label: 'Launch speed u (m/s)', min: 5, max: 40, step: 1, value: u, fmt: (v) => v + '', oninput: (v) => { u = v; t = 0; hold = 0; say(); } });
  slider(ctl, { label: 'Angle θ', min: 5, max: 85, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; t = 0; hold = 0; say(); } });
  choice(ctl, 'No-gravity line', [[true, 'Show'], [false, 'Hide']], true, (v) => { ghost = v; cv.redraw(); });
  anim.button(ctl);
  function say() { const r = th * Math.PI / 180, vx = u * Math.cos(r), vy = u * Math.sin(r), Tt = T(); out.innerHTML = `Components: u<sub>x</sub> = u cosθ = <b>${vx.toFixed(1)} m/s</b> (never changes), u<sub>y</sub> = u sinθ = <b>${vy.toFixed(1)} m/s</b>. Time of flight <b>${Tt.toFixed(2)} s</b>, maximum height <b>${(vy * vy / (2 * g)).toFixed(1)} m</b>, range <b>${(vx * Tt).toFixed(1)} m</b>. At t = ${t.toFixed(2)} s: v<sub>y</sub> = ${(vy - g * t).toFixed(1)} m/s.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Projectile: two independent motions', col);
    const r = th * Math.PI / 180, vx = u * Math.cos(r), vy = u * Math.sin(r), R = vx * T(), H = vy * vy / (2 * g);
    const L = 22, gy = h - 26, S = Math.min((w - L - 18) / Math.max(R, 1), (gy - 46) / Math.max(H * 1.1, 1)), X = (x) => L + x * S, Y = (y) => gy - y * S;
    line(ctx, [[L - 8, gy], [w - 8, gy]], col.ink, 2); const stp = R > 90 ? 40 : R > 40 ? 20 : 10; for (let m = 0; m <= R * 1.02; m += stp) { line(ctx, [[X(m), gy], [X(m), gy + 5]], col.muted, 1); text(ctx, m + ' m', X(m), gy + 15, { size: 9.5, color: col.muted, align: 'center' }); }
    const pts = []; for (let i = 0; i <= 60; i++) { const q = (T() * i) / 60; pts.push([X(vx * q), Y(vy * q - 0.5 * g * q * q)]); } line(ctx, pts, col.s[0], 2, [5, 4]);
    if (ghost) line(ctx, [[X(0), Y(0)], [X(vx * T()), Y(vy * T())]], col.line, 1.5, [2, 4]);
    const px = vx * t, py = vy * t - 0.5 * g * t * t;
    if (ghost) { dot(ctx, X(px), Y(vy * t), 4, col.muted, col.panel); line(ctx, [[X(px), Y(vy * t)], [X(px), Y(py)]], col.s[3], 2); }
    const k = Math.min(2.4, 70 / Math.max(u, 1)), cx = X(px), cy = Y(py), vyn = vy - g * t;
    if (comps) { arrow(ctx, cx, cy, cx + vx * k, cy, col.s[1], 2.5, 7); arrow(ctx, cx, cy, cx, cy - vyn * k, col.s[2], 2.5, 7); }
    arrow(ctx, cx, cy, cx + vx * k, cy - vyn * k, col.ink, 2, 7);
    dot(ctx, cx, cy, 7, col.s[0], col.ink);
    text(ctx, 'vx (constant)', Math.min(w - 56, cx + 8), cy + 16, { size: 10, color: col.s[1], weight: 700 }); text(ctx, 'vy', cx - 8, cy - vyn * k + (vyn > 0 ? -6 : 8), { size: 10, color: col.s[2], weight: 700, align: 'right' });
    if (ghost) text(ctx, 'gravity: ½gt² drop', w - 12, 42, { size: 10.5, color: col.s[3], weight: 700, align: 'right' });
  };
  say();
}
