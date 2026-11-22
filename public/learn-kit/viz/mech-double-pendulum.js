// Chaos you can watch: two double pendulums start almost identically (the second differs by a tiny angle). For a while
// they swing together, then they part ways. The graph shows their separation on a log scale; a straight rising
// line means exponential divergence, the mark of chaos. Try a small start angle: motion stays regular.
import { canvas, text, row, slider, readout, loop, button, line, dot } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let A, B, t = 0, hist = [];
  const cv = canvas(host, { aspect: 1, max: 440, min: 330, label: 'Two nearly identical double pendulums drifting apart, and their separation on a log graph' });
  const c1 = row(host);
  const s1 = slider(c1, { label: 'Start angle', min: 20, max: 175, step: 5, value: 120, fmt: (v) => v + '°', oninput: () => restart() });
  const s2 = slider(c1, { label: 'Difference', min: -6, max: -2, step: 0.5, value: -3, fmt: (v) => '10^' + v + ' rad', oninput: () => restart() });
  const anim = loop(host, (dt) => { const n = 20, h = Math.min(dt, 0.03) / n; for (let i = 0; i < n; i++) { A = step(A, h); B = step(B, h); } t += Math.min(dt, 0.03); const d = Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2], A[3] - B[3]); hist.push([t, Math.max(d, 1e-9)]); if (hist.length > 1200) hist.shift(); cv.redraw(); show(); });
  anim.button(c1); button(c1, 'Restart', () => restart());
  const out = readout(host);
  function f([a, b, p, q]) { // equal masses and lengths, angles a,b with angular velocities p,q
    const d = a - b, den = 3 - Math.cos(2 * d);
    return [p, q, (-3 * G * Math.sin(a) - G * Math.sin(a - 2 * b) - 2 * Math.sin(d) * (q * q + p * p * Math.cos(d))) / den, (2 * Math.sin(d) * (2 * p * p + 2 * G * Math.cos(a) + q * q * Math.cos(d))) / den];
  }
  function step(s, h) { const k1 = f(s), k2 = f(s.map((v, i) => v + (h / 2) * k1[i])), k3 = f(s.map((v, i) => v + (h / 2) * k2[i])), k4 = f(s.map((v, i) => v + h * k3[i])); return s.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); }
  function restart() { const a = (s1.value * Math.PI) / 180, e = Math.pow(10, s2.value); A = [a, a, 0, 0]; B = [a + e, a, 0, 0]; t = 0; hist = []; cv.redraw(); show(); }
  function show() { const d = hist.length ? hist[hist.length - 1][1] : Math.pow(10, s2.value); out.innerHTML = `t = ${t.toFixed(1)} s. Separation of the two states: <b>${d.toExponential(1)}</b>. Started ${Math.pow(10, s2.value).toExponential(0)} apart; each Lyapunov time multiplies it by e ≈ 2.7. Orange is the copy, blue the original.`; }
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.3, L = Math.min(w * 0.2, h * 0.14);
    const tip = (s, k) => { const x1 = cx + L * Math.sin(s[0]), y1 = cy + L * Math.cos(s[0]); return k === 1 ? [x1, y1] : [x1 + L * Math.sin(s[1]), y1 + L * Math.cos(s[1])]; };
    [[A, col.s[0]], [B, col.s[1]]].forEach(([s, c], i) => { const p1 = tip(s, 1), p2 = tip(s, 2); line(ctx, [[cx, cy], p1, p2], c, i ? 2 : 3); dot(ctx, p1[0], p1[1], 5, c, col.panel); dot(ctx, p2[0], p2[1], 7, c, col.panel); });
    const gx0 = 34, gx1 = w - 12, gy0 = h * 0.62, gy1 = h - 24, lo = -9, hi = 1, Y = (d) => gy1 - ((Math.log10(d) - lo) / (hi - lo)) * (gy1 - gy0);
    line(ctx, [[gx0, gy1], [gx1, gy1]], col.muted, 1); line(ctx, [[gx0, gy0], [gx0, gy1]], col.muted, 1);
    for (let e = -9; e <= 1; e += 2) { text(ctx, '1e' + e, gx0 - 3, Y(Math.pow(10, e)), { color: col.muted, size: 9, align: 'right' }); line(ctx, [[gx0, Y(Math.pow(10, e))], [gx1, Y(Math.pow(10, e))]], col.line, 1); }
    const t0 = hist.length ? hist[0][0] : 0, t1 = Math.max(t0 + 5, t), X = (tm) => gx0 + ((tm - t0) / (t1 - t0)) * (gx1 - gx0);
    line(ctx, hist.map(([tm, d]) => [X(tm), Math.max(gy0, Y(d))]), col.bad, 2.5);
    text(ctx, 'separation (log) against time', gx0 + 4, gy0 - 8, { color: col.muted, size: 10 });
  };
  restart();
}
