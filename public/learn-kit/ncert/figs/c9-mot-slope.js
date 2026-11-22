// Class 9 Science, Chapter 4: the slope of a position-time graph is the velocity. Pick a journey, move the time slider and a
// tangent line shows the slope at that instant: steep = fast, flat = at rest, falling = coming back. A car on a road
// above moves with the graph so you can see the story and the line together.
import { canvas, axes, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

const S = {
  steady: { name: 'Steady speed', x: (t) => 8 * t, v: () => 8 },
  speed: { name: 'Speeding up', x: (t) => 0.8 * t * t, v: (t) => 1.6 * t },
  stop: { name: 'Go, stop, go', x: (t) => (t < 3 ? 10 * t : t < 6 ? 30 : 30 + 12.5 * (t - 6)), v: (t) => (t < 3 ? 10 : t < 6 ? 0 : 12.5) },
  back: { name: 'Out and back', x: (t) => (t < 6 ? 10 * t : 60 - 10 * (t - 6)), v: (t) => (t < 6 ? 10 : -10) },
};
export default function (host) {
  let k = 'speed', t = 4;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 310, label: 'A position-time graph with a tangent line whose slope is the velocity, and a car on a road' });
  const ctl = row(host);
  choice(ctl, 'Journey', [['steady', 'Steady'], ['speed', 'Speeding up'], ['stop', 'Go, stop, go'], ['back', 'Out and back']], k, (v) => { k = v; upd(); });
  slider(ctl, { label: 'Time', min: 0, max: 10, step: 0.1, value: t, fmt: (v) => `${v.toFixed(1)} s`, oninput: (v) => { t = v; upd(); } });
  const out = readout(host);
  function upd() { const v = S[k].v(t); out.innerHTML = `At t = ${t.toFixed(1)} s the slope is <b>${v.toFixed(1)} m/s</b>: ${Math.abs(v) < 0.05 ? 'the line is flat, the car is at rest' : v > 0 ? 'the line rises, the car moves forward' + (Math.abs(v) > 10 ? ' fast' : '') : 'the line falls, the car comes back'}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${S[k].name}: slope = velocity`, col) + 4;
    const ry = top + 26, L = 22, R = w - 22; ctx.fillStyle = col.line; ctx.fillRect(L, ry + 8, R - L, 6);
    const cx = L + (S[k].x(t) / 80) * (R - L); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.roundRect(cx - 13, ry - 4, 26, 12, 3); ctx.fill(); dot(ctx, cx - 7, ry + 9, 3, col.ink); dot(ctx, cx + 7, ry + 9, 3, col.ink);
    const ax = axes(ctx, w, h, col, { x: [0, 10], y: [0, 80], t: ry + 30, xlabel: 'time (s)', ylabel: 'position (m)' });
    const pts = []; for (let s = 0; s <= 10.001; s += 0.1) pts.push([ax.X(s), ax.Y(S[k].x(s))]); line(ctx, pts, col.line === col.muted ? col.ink : col.s[1], 1.5);
    line(ctx, pts.filter((_, i) => i * 0.1 <= t + 1e-6), col.s[0], 3);
    const x0 = S[k].x(t), v = S[k].v(t), a = Math.max(0, t - 1.6), b = Math.min(10, t + 1.6);
    ctx.save(); ax.clip(); line(ctx, [[ax.X(a), ax.Y(x0 + v * (a - t))], [ax.X(b), ax.Y(x0 + v * (b - t))]], col.s[2], 2.5); ctx.restore();
    dot(ctx, ax.X(t), ax.Y(x0), 6, col.s[2], col.panel);
  };
  upd();
}
