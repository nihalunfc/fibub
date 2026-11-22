// Class 9 Science, Chapter 4: distance versus displacement. Slide a walker along a path. The distance is the length of the
// path actually walked (it only grows); the displacement is the straight arrow from the start to where you are
// now (it can shrink, and is zero if you come back to the start). Displacement has a direction; distance does not.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

const PATHS = {
  L: { name: 'L-shaped walk', pts: [[0, 0], [60, 0], [60, 80]] },
  sq: { name: 'One lap round a ground', pts: [[0, 0], [80, 0], [80, 60], [0, 60], [0, 0]] },
  zig: { name: 'Zig-zag lane', pts: [[0, 0], [40, 60], [80, 0], [120, 60]] },
};
export default function (host) {
  let key = 'L', frac = 0.6;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A path with a walker, the distance walked and the straight displacement arrow from the start' });
  const ctl = row(host);
  choice(ctl, 'Path', [['L', 'L-walk'], ['sq', 'Lap'], ['zig', 'Zig-zag']], key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'Walked so far', min: 0, max: 1, step: 0.005, value: frac, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { frac = v; upd(); } });
  const out = readout(host);
  const seg = () => { const p = PATHS[key].pts, L = []; let tot = 0; for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); L.push(d); tot += d; } return { p, L, tot }; };
  const posAt = (d) => { const { p, L } = seg(); let r = d, i = 0; while (i < L.length - 1 && r > L[i]) { r -= L[i]; i++; } const f = L[i] ? Math.min(1, r / L[i]) : 0; return [p[i][0] + f * (p[i + 1][0] - p[i][0]), p[i][1] + f * (p[i + 1][1] - p[i][1])]; };
  function upd() {
    const { tot } = seg(), d = frac * tot, [x, y] = posAt(d), dsp = Math.hypot(x, y);
    out.innerHTML = `Distance walked <b>${d.toFixed(0)} m</b> (path length). Displacement <b>${dsp.toFixed(0)} m</b>${dsp > 0.5 ? ` at ${Math.round(Math.atan2(y, x) * 180 / Math.PI)}° from the east line` : ' (back at the start: zero!)'}.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, PATHS[key].name, col) + 8, { p, tot } = seg();
    const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]), mx = Math.max(...xs, 1), my = Math.max(...ys, 1);
    const pad = 30, sc = Math.min((w - 2 * pad) / mx, (h - top - 2 * pad - 36) / my), ox = (w - mx * sc) / 2, oy = h - pad;
    const P2 = (q) => [ox + q[0] * sc, oy - q[1] * sc];
    line(ctx, p.map(P2), col.line, 6); line(ctx, p.map(P2), col.muted, 1.5, [5, 4]);
    // walked part
    const d = frac * tot, walked = [P2(p[0])]; let acc = 0;
    for (let i = 1; i < p.length; i++) { const sl = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + sl <= d) { walked.push(P2(p[i])); acc += sl; } else { walked.push(P2(posAt(d))); break; } }
    line(ctx, walked, col.s[0], 3.5);
    const cur = P2(posAt(d)), st = P2(p[0]);
    if (Math.hypot(cur[0] - st[0], cur[1] - st[1]) > 8) arrow(ctx, st[0], st[1], cur[0], cur[1], col.s[2], 2.5, 10);
    dot(ctx, st[0], st[1], 6, col.ink); text(ctx, 'start', st[0] + 9, st[1] + 14, { color: col.ink, size: 11, weight: 700 });
    dot(ctx, cur[0], cur[1], 7, col.s[1], col.panel);
    text(ctx, 'blue: distance (path walked)', 12, top + 6, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'green arrow: displacement (start to now)', 12, top + 22, { color: col.s[2], size: 11, weight: 700 });
  };
  upd();
}
