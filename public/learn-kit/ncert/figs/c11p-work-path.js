// Class 11 Work, Energy and Power: conservative and non-conservative forces. Gravity does work -m g h between two points whatever the path (the running total
// below is the same at the end). Friction depends on the path: on a slope it is mu m g cos(theta) per metre of path, i.e. mu m g per metre of HORIZONTAL distance.
import { canvas, line, text, title, row, slider, choice, button, readout, loop, dot } from '../../kit.js';

export default function (host) {
  const P = {
    d: { name: 'direct', pts: [[0, 0], [4, 3]] },
    r: { name: 'round about', pts: [[0, 0], [-2, 1.5], [1, 3.6], [4, 3]] },
    z: { name: 'zig-zag', pts: [[0, 0], [2, 0.6], [0.3, 1.5], [3, 2.2], [1.5, 2.6], [4, 3]] },
  };
  let kind = 'd', mu = 0.3, t = 0, run = true;
  const m = 10, g = 9.8;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Three paths up a hillside with the work done by gravity and by friction along each' });
  const ctl = row(host);
  choice(ctl, 'Path', [['d', 'Direct'], ['r', 'Round about'], ['z', 'Zig-zag']], 'd', (v) => { kind = v; t = 0; });
  slider(ctl, { label: 'Friction μ', min: 0, max: 0.6, step: 0.05, value: 0.3, fmt: (v) => v.toFixed(2), oninput: (v) => { mu = v; } });
  const b2 = row(host); button(b2, 'Replay', () => { t = 0; }); 
  const ro = readout(host);
  const seg = (pts) => { let s = 0; const a = [0]; for (let i = 1; i < pts.length; i++) { s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); a.push(s); } return a; };
  loop(host, (dt) => { if (t < 1.4) t += dt / 5; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Gravity: same for every path. Friction: not', col);
    const pts = P[kind].pts, cum = seg(pts), tot = cum[cum.length - 1], f = Math.min(1, t);
    const ox = 60, oy = top + 150, sx = (w - 120) / 6.5, sy = 34, X = (x) => ox + (x + 2.2) * sx - 0, Y = (y) => oy - y * sy;
    ctx.beginPath(); ctx.moveTo(X(-2.2), Y(0)); ctx.lineTo(X(4.3), Y(3.2)); ctx.lineTo(X(4.3), Y(0)); ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill();
    for (const k of Object.keys(P)) if (k !== kind) line(ctx, P[k].pts.map(([x, y]) => [X(x), Y(y)]), col.line, 1.5);
    line(ctx, pts.map(([x, y]) => [X(x), Y(y)]), col.s[0], 2.5);
    const d = f * tot; let i = 1; while (i < cum.length - 1 && cum[i] < d) i++;
    const u = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), px = pts[i - 1][0] + u * (pts[i][0] - pts[i - 1][0]), py = pts[i - 1][1] + u * (pts[i][1] - pts[i - 1][1]);
    let hor = 0; for (let k = 1; k < i; k++) hor += Math.abs(pts[k][0] - pts[k - 1][0]); hor += Math.abs(px - pts[i - 1][0]);
    dot(ctx, X(px), Y(py), 6, col.s[2], col.panel);
    text(ctx, 'A', X(0) - 8, Y(0) + 12, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'B', X(4) + 8, Y(3) - 4, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'height 3 m', X(4.3) - 4, Y(1.4), { color: col.muted, size: 10, align: 'right' });
    const Wg = -m * g * py, Wf = -mu * m * g * hor, by = oy + 28, S = (w - 130) / 1200;
    const x0 = w - 26, SC = (x0 - 20) / 800;
    const bar = (lab, v, c, y) => { text(ctx, `${lab}: ${Math.round(v)} J`, 10, y, { color: col.ink, size: 11, weight: 700 }); const L = v * SC; ctx.fillStyle = c; ctx.fillRect(Math.min(x0, x0 + L), y + 8, Math.abs(L), 12); line(ctx, [[x0, y + 5], [x0, y + 23]], col.ink, 1); };
    bar('work by gravity', Wg, col.s[0], by); bar('work by friction', Wf, col.s[3], by + 38);
    ro.textContent = `Gravity: −m g h = ${Math.round(-m * g * 3)} J on the full trip, the same for all three paths. Friction, ${(mu * m * g * Math.abs(pts.reduce((a, p, k) => k ? a + Math.abs(p[0] - pts[k - 1][0]) : 0, 0))).toFixed(0)} J lost on this path, changes with the route. A force like gravity is conservative; friction is not.`;
  };
  cv.redraw();
}
