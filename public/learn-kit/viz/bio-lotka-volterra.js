// Predator and prey cycles (Lotka-Volterra). Prey grow on their own and are eaten; predators grow only by eating prey and
// otherwise die off. Numbers rise and fall in linked waves, predators lagging behind prey. Slide the rates to change the
// size and speed of the cycle. The right panel plots predators against prey: a closed loop means a stable cycle.
import { canvas, loop, row, slider, readout, axes, line, dot, text, title } from '../kit.js';

export default function (host) {
  let r = 1.0, a = 0.1, m = 0.8, e = 0.08, t0 = 0, data = [];
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 270, label: 'Predator and prey numbers over time and as a loop' });
  const c1 = row(host), c2 = row(host);
  slider(c1, { label: 'Prey birth rate', min: 0.4, max: 1.6, step: 0.05, value: r, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; sim(); } });
  slider(c1, { label: 'Predation rate', min: 0.04, max: 0.2, step: 0.01, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = v; sim(); } });
  slider(c2, { label: 'Predator death rate', min: 0.3, max: 1.4, step: 0.05, value: m, fmt: (v) => v.toFixed(2), oninput: (v) => { m = v; sim(); } });
  loop(host, (dt) => { t0 = (t0 + dt * 4) % 60; cv.redraw(); }).button(c2);
  const out = readout(host);
  function sim() {
    let x = 10, y = 5; const dt = 0.01; data = [];
    const f = (x, y) => [r * x - a * x * y, e * a / 0.1 * x * y - m * y];
    for (let i = 0; i <= 6000; i++) { if (i % 20 === 0) data.push([i * dt, x, y]); const k1 = f(x, y), k2 = f(x + dt / 2 * k1[0], y + dt / 2 * k1[1]), k3 = f(x + dt / 2 * k2[0], y + dt / 2 * k2[1]), k4 = f(x + dt * k3[0], y + dt * k3[1]); x += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); }
    const eq = [m / (e * a / 0.1), r / a], per = 2 * Math.PI / Math.sqrt(r * m);
    out.innerHTML = `Equilibrium (the cycle goes around it): prey ≈ <b>${eq[0].toFixed(0)}</b>, predators ≈ <b>${eq[1].toFixed(0)}</b>. Cycle length ≈ <b>${per.toFixed(1)}</b> time units. More predation or a higher predator death rate changes where the loop sits; the predator peak always comes after the prey peak.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Prey (blue) and predators (orange)', col);
    const ymax = Math.max(...data.map((d) => Math.max(d[1], d[2]))) * 1.08, lw = w * 0.58;
    const A = axes(ctx, lw, h, col, { x: [0, 30], y: [0, ymax], xt: [0, 10, 20, 30], l: 28, t: 34, b: 34, r: 6, xlabel: 'Time' });
    line(ctx, data.filter((d) => d[0] <= 30).map((d) => [A.X(d[0]), A.Y(d[1])]), col.s[0], 2); line(ctx, data.filter((d) => d[0] <= 30).map((d) => [A.X(d[0]), A.Y(d[2])]), col.s[1], 2);
    const T = Math.min(30, t0 / 2); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(A.X(T), A.T); ctx.lineTo(A.X(T), A.B); ctx.stroke();
    const xmax = Math.max(...data.map((d) => d[1])) * 1.08, B = axes(ctx, w, h, col, { x: [0, xmax], y: [0, ymax], xt: [], yt: [], l: lw + 14, t: 34, b: 34, r: 8, xlabel: 'Prey', grid: false });
    text(ctx, 'Predators', B.L + 4, B.T + 8, { color: col.ink, size: 10.5, weight: 700 });
    line(ctx, data.filter((d) => d[0] <= 30).map((d) => [B.X(d[1]), B.Y(d[2])]), col.s[2], 1.8);
    const k = data.find((d) => d[0] >= T) || data[0]; dot(ctx, B.X(k[1]), B.Y(k[2]), 5, col.bad); dot(ctx, A.X(k[0]), A.Y(k[1]), 4, col.s[0]); dot(ctx, A.X(k[0]), A.Y(k[2]), 4, col.s[1]);
  };
  sim();
}
