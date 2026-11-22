// Symmetry and conservation, by experiment. A particle moves in four different force setups; the four strips show
// p_x, p_y, angular momentum L and energy E over time. Each setup is symmetric under something, and exactly the matching
// quantity stays flat: central force (rotation → L), gravity pointing down (shift in x → p_x), spring in x only
// (shift in y → p_y), pulsing central force (rotation but not time → L flat, E not).
import { canvas, text, row, choice, readout, loop, button, line, dot } from '../kit.js';

const SETUPS = {
  central: { n: 'Central force', a: (x, y) => { const r3 = Math.pow(x * x + y * y, 1.5); return [-x / r3, -y / r3]; }, s: [1, 0, 0, 0.8], U: (x, y) => -1 / Math.hypot(x, y), why: 'Looks the same after any rotation, so L = x p_y − y p_x is constant (and E, since nothing depends on time).' },
  gravity: { n: 'Uniform gravity', a: () => [0, -0.6], s: [-2, 0, 0.9, 1.6], U: (x, y) => 0.6 * y, why: 'The force does not depend on x, so moving the setup sideways changes nothing: p_x is constant. y matters, so p_y is not; L is not either (the origin is special). E is conserved.' },
  spring: { n: 'Spring in x only', a: (x) => [-x, 0], s: [1, -1, 0, 0.8], U: (x) => 0.5 * x * x, why: 'Shifting in y changes nothing, so p_y is constant; the spring changes p_x and L. E is conserved.' },
  pulse: { n: 'Pulsing central spring', a: (x, y, t) => { const k = 1 + 0.6 * Math.sin(1.5 * t); return [-k * x, -k * y]; }, s: [1, 0, 0, 0.8], U: (x, y, t) => 0.5 * (1 + 0.6 * Math.sin(1.5 * t)) * (x * x + y * y), why: 'Still rotation-symmetric, so L stays constant, but the force changes with time, so energy is NOT conserved (time-translation symmetry is broken).' },
};
export default function (host) {
  let sys = 'central', t = 0, tr = [];
  const cv = canvas(host, { aspect: 1.15, max: 480, min: 360, label: 'An orbit and four strip graphs of momentum, angular momentum and energy' });
  const c1 = row(host);
  choice(c1, 'Setup', Object.keys(SETUPS).map((k) => [k, SETUPS[k].n]), sys, (v) => { sys = v; build(); });
  const anim = loop(host, (dt) => { t += dt * 1.2; if (t > 14) t = 0; cv.redraw(); });
  anim.button(c1);
  const out = readout(host);
  function build() {
    const S = SETUPS[sys]; let [x, y, vx, vy] = S.s; tr = []; const h = 0.005;
    for (let tm = 0; tm <= 14; tm += h) {
      if (Math.round(tm / h) % 10 === 0) tr.push({ t: tm, x, y, px: vx, py: vy, L: x * vy - y * vx, E: 0.5 * (vx * vx + vy * vy) + S.U(x, y, tm) });
      const f = (st, tt) => { const a = S.a(st[0], st[1], tt); return [st[2], st[3], a[0], a[1]]; }, st = [x, y, vx, vy];
      const k1 = f(st, tm), k2 = f(st.map((v, i) => v + h / 2 * k1[i]), tm + h / 2), k3 = f(st.map((v, i) => v + h / 2 * k2[i]), tm + h / 2), k4 = f(st.map((v, i) => v + h * k3[i]), tm + h);
      [x, y, vx, vy] = st.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    }
    t = 0; out.innerHTML = S.why; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const sq = h * 0.42, xs = tr.map((q) => q.x), ys = tr.map((q) => q.y), lo = Math.min(...xs, ...ys, -0.5), hi = Math.max(...xs, ...ys, 0.5), c = (lo + hi) / 2, sc = (Math.min(sq, w - 20) - 20) / (hi - lo);
    const X = (x) => w / 2 + (x - c) * sc, Y = (y) => sq / 2 + 6 - (y - c) * sc;
    line(ctx, tr.map((q) => [X(q.x), Y(q.y)]), col.line, 1.5);
    const i = Math.min(tr.length - 1, Math.round(t / 0.05)); line(ctx, tr.slice(0, i + 1).map((q) => [X(q.x), Y(q.y)]), col.s[0], 2.5); dot(ctx, X(tr[i].x), Y(tr[i].y), 6, col.s[0], col.panel);
    if (sys === 'central') dot(ctx, X(0), Y(0), 6, col.s[1], col.panel);
    const strips = [['p_x', 'px', col.s[0]], ['p_y', 'py', col.s[2]], ['L', 'L', col.s[3]], ['E', 'E', col.bad]], sh = (h - sq - 26) / 4;
    strips.forEach(([n, k, c2], j) => {
      const y0 = sq + 14 + j * sh, y1 = y0 + sh - 8, vals = tr.map((q) => q[k]), mn = Math.min(...vals), mx = Math.max(...vals), pad = Math.max(0.5, (mx - mn)) , m0 = (mn + mx) / 2, YY = (v) => (y0 + y1) / 2 - ((v - m0) / (pad)) * (y1 - y0) * 0.45;
      text(ctx, n, 8, (y0 + y1) / 2, { color: c2, size: 12, weight: 700 }); line(ctx, [[36, (y0 + y1) / 2], [w - 10, (y0 + y1) / 2]], col.line, 1);
      const TX = (tm) => 36 + (tm / 14) * (w - 48); line(ctx, tr.map((q) => [TX(q.t), YY(q[k])]), c2, 2.2);
      dot(ctx, TX(tr[i].t), YY(tr[i][k]), 4, col.ink, col.panel);
      const flat = mx - mn < 0.02; text(ctx, flat ? 'constant' : 'changes', w - 12, y0 + 6, { color: flat ? col.good : col.muted, size: 10, align: 'right', weight: flat ? 700 : 400 });
    });
  };
  build();
}
