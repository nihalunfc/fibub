// A projectile with and without air, on level ground or up a slope. The blue path is vacuum (a parabola), the orange
// path has quadratic air drag (a steeper fall, shorter range). Change launch angle, speed and the slope; watch the
// best angle drop below 45° with air, and rise above it when the ground slopes down.
import { canvas, text, row, choice, slider, readout, loop, button, line } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let slope = 0, drag = 0.04, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 230, label: 'Projectile paths in vacuum and in air' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Ground', [[0, 'Level'], [20, 'Up a 20° slope'], [-20, 'Down a 20° slope']], slope, (v) => { slope = v; t = 0; go(); });
  choice(c1, 'Air', [[0.04, 'Strong drag'], [0.01, 'Light drag']], drag, (v) => { drag = v; t = 0; go(); });
  const sa = slider(c2, { label: 'Angle', min: 10, max: 80, step: 1, value: 40, fmt: (v) => v + '°', oninput: () => { t = 0; go(); } });
  const sv = slider(c2, { label: 'Speed', min: 10, max: 40, step: 1, value: 30, fmt: (v) => v + ' m/s', oninput: () => { t = 0; go(); } });
  const anim = loop(host, (dt) => { t += dt * 1.2; if (t > 9) t = 0; cv.redraw(); });
  anim.button(c2);
  const out = readout(host);
  let P = null;
  function path(air) {
    const a = (sa.value * Math.PI) / 180, s = (slope * Math.PI) / 180, pts = [], dt = 0.01;
    let x = 0, y = 0, vx = sv.value * Math.cos(a), vy = sv.value * Math.sin(a), tt = 0;
    while (tt < 20) {
      pts.push([x, y, tt]);
      const sp = Math.hypot(vx, vy), k = air ? drag : 0;
      vx += -k * sp * vx * dt; vy += (-G - k * sp * vy) * dt; x += vx * dt; y += vy * dt; tt += dt;
      if (tt > 0.05 && y < x * Math.tan(s)) { pts.push([x, y, tt]); break; }
    }
    const last = pts[pts.length - 1];
    return { pts, T: last[2], range: Math.hypot(last[0], last[1]), H: Math.max(...pts.map((q) => q[1] - q[0] * Math.tan(s))) };
  }
  function go() {
    P = { v: path(false), a: path(true) };
    out.innerHTML = `Vacuum: range along the ground ${P.v.range.toFixed(1)} m, flight ${P.v.T.toFixed(2)} s, greatest height above the ground ${P.v.H.toFixed(1)} m. With air: range ${P.a.range.toFixed(1)} m (${(100 * P.a.range / P.v.range).toFixed(0)}% of vacuum), flight ${P.a.T.toFixed(2)} s, height ${P.a.H.toFixed(1)} m.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    if (!P) return;
    const all = [...P.v.pts, ...P.a.pts], xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
    const x0 = Math.min(0, ...xs), x1 = Math.max(...xs), y0 = Math.min(0, ...ys), y1 = Math.max(...ys);
    const k = Math.min((w - 30) / (x1 - x0 || 1), (h - 40) / (y1 - y0 || 1)), X = (x) => 15 + (x - x0) * k, Y = (y) => h - 22 - (y - y0) * k;
    const s = (slope * Math.PI) / 180;
    line(ctx, [[X(x0), Y(x0 * Math.tan(s))], [X(x1), Y(x1 * Math.tan(s))]], col.muted, 3);
    const draw = (Q, c, lab) => {
      const upto = Q.pts.filter((q) => q[2] <= t);
      line(ctx, Q.pts.map((q) => [X(q[0]), Y(q[1])]), c, 1.2);
      if (upto.length) { const q = upto[upto.length - 1]; line(ctx, upto.map((p) => [X(p[0]), Y(p[1])]), c, 3); ctx.beginPath(); ctx.arc(X(q[0]), Y(q[1]), 6, 0, 7); ctx.fillStyle = c; ctx.fill(); }
    };
    draw(P.v, col.s[0]); draw(P.a, col.s[1]);
    text(ctx, 'vacuum', 10, 14, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'with air', 70, 14, { color: col.s[1], size: 12, weight: 700 });
  };
  go();
}
