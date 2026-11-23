// Class 11 Motion in a Straight Line: one car, three linked graphs. The acceleration-time graph is chosen; velocity is its running area (v = integral of a dt),
// position is the running area of v (x = integral of v dt). Slope of x-t = v, slope of v-t = a. Press play or drag the time slider and watch the marker move on all three.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout, loop, clamp } from '../../kit.js';

const TT = 10, MOT = {
  steady: { name: 'Steady speed', v0: 3, a: () => 0 },
  speed: { name: 'Speeding up', v0: 0, a: () => 0.8 },
  brake: { name: 'Braking to a stop', v0: 8, a: () => -0.8 },
  turn: { name: 'Go, cruise, stop, reverse', v0: 0, a: (t) => (t < 3 ? 1 : t < 6 ? 0 : t < 8 ? -1.5 : -1) },
};
export default function (host) {
  let key = 'turn', t = 0, tab = null;
  const cv = canvas(host, { aspect: 1.5, max: 480, min: 420, label: 'A car with linked position-time, velocity-time and acceleration-time graphs' });
  const ctl = row(host), out = readout(host);
  const build = () => { const m = MOT[key], N = 400, dt = TT / N, a = [], v = [m.v0], x = [0]; for (let i = 0; i < N; i++) { const ai = m.a(i * dt); a.push(ai); v.push(v[i] + ai * dt); x.push(x[i] + (v[i] + v[i + 1]) / 2 * dt); } a.push(a[N - 1]); tab = { a, v, x, N }; };
  const at = (arr) => arr[Math.round(clamp(t / TT, 0, 1) * tab.N)];
  const anim = loop(host, (dt) => { t += dt * 1.2; if (t > TT) t = 0; sl.set(t); say(); }, { autoplay: false });
  choice(ctl, 'Motion', Object.entries(MOT).map(([k, m]) => [k, m.name]), key, (v) => { key = v; build(); t = 0; sl.set(0); say(); });
  anim.button(ctl);
  const sl = slider(ctl, { label: 'Time (s)', min: 0, max: TT, step: 0.05, value: 0, fmt: (v) => v.toFixed(1), oninput: (v) => { anim.pause(); t = v; say(); } });
  function say() { out.innerHTML = `t = ${t.toFixed(1)} s: position <b>${at(tab.x).toFixed(1)} m</b>, velocity <b>${at(tab.v).toFixed(2)} m/s</b>, acceleration <b>${at(tab.a).toFixed(2)} m/s²</b>. The slope of x–t is v; the slope of v–t is a.`; cv.redraw(); }
  build();
  cv.draw = (ctx, w, h, col) => {
    title(ctx, MOT[key].name, col);
    const xs = tab.x, xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), L = 46, R = w - 14;
    const RX = (x) => L + 14 + ((x - xmin) / (xmax - xmin)) * (R - L - 36);
    const ry = 62; line(ctx, [[L, ry + 16], [R, ry + 16]], col.ink, 2); ctx.fillStyle = col.s[0]; ctx.fillRect(RX(at(xs)) - 14, ry - 2, 28, 14); dot(ctx, RX(at(xs)) - 8, ry + 14, 4, col.ink); dot(ctx, RX(at(xs)) + 8, ry + 14, 4, col.ink);
    text(ctx, 'road', R, ry + 30, { size: 10, color: col.muted, align: 'right' });
    const ih = (h - 88 - 44 - 28) / 3, G = [[tab.x, 'x (m)', col.s[0]], [tab.v, 'v (m/s)', col.s[1]], [tab.a, 'a (m/s²)', col.s[3]]];
    G.forEach(([arr, lab, c], k) => {
      const lo = Math.min(...arr), hi = Math.max(...arr), pad = (hi - lo || 1) * 0.15, top = 88 + k * (ih + 14);
      const A = axes(ctx, w, h, col, { x: [0, TT], y: [Math.min(lo, 0) - pad, Math.max(hi, 0) + pad], xt: k === 2 ? [0, 2, 4, 6, 8, 10] : [], yt: [...new Set([Math.min(lo, 0), 0, Math.max(hi, 0)].map((v) => +v.toFixed(1)))], ylabel: lab, xlabel: k === 2 ? 'time t (s)' : '', l: 46, t: top, b: h - top - ih });
      ctx.save(); A.clip(); const pts = arr.map((v, i) => [A.X(i * TT / tab.N), A.Y(v)]); line(ctx, pts, c, 2.5); ctx.restore();
      line(ctx, [[A.X(t), A.T], [A.X(t), A.B]], col.ink, 1, [3, 3]); dot(ctx, A.X(t), A.Y(at(arr)), 5, c, col.panel);
    });
  };
  say();
}
