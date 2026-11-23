// Class 11 Oscillations: damped oscillations. m x'' = -k x - b v. Underdamped (b < 2 sqrt(km)): oscillations inside the envelope A e^(-b t / 2m) with
// w' = sqrt(k/m - b^2 / 4m^2), a little slower than the undamped w. Critical (b = 2 sqrt(km)): fastest return to rest without overshoot.
// Overdamped: slow creep back. The curve is found by stepping the equation of motion in small time steps.
import { canvas, axes, line, dot, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let b = 1, t = 0;
  const m = 0.5, k = 50, bc = 2 * Math.sqrt(k * m);
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Displacement against time for an oscillator with adjustable damping' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'damping constant b (kg/s)', min: 0, max: 24, step: 0.5, value: b, fmt: (v) => v.toFixed(1), oninput: (v) => { b = v; t = 0; go(); } });
  const anim = loop(host, (dt) => { t += dt * 0.8; if (t > 4.3) t = 0; cv.redraw(); }); anim.button(ctl);
  const sim = () => { const out = [], h = 0.002; let x = 1, v = 0; for (let i = 0; i <= 2200; i++) { if (i % 20 === 0) out.push([i * h, x]); const a = (-k * x - b * v) / m; v += a * h; x += v * h; } return out; };
  let data = sim();
  const go = () => { data = sim(); const kind = b < bc - 0.2 ? 'underdamped' : b > bc + 0.2 ? 'overdamped' : 'critically damped'; const wd = Math.sqrt(Math.max(0, k / m - b * b / (4 * m * m)));
    ro.innerHTML = `b<sub>critical</sub> = 2√(km) = ${bc.toFixed(1)} kg/s. Now <b>${kind}</b>. ` + (b < bc ? `ω′ = √(k/m − b²/4m²) = ${wd.toFixed(2)} rad/s (undamped ω = ${Math.sqrt(k / m).toFixed(2)}). Amplitude falls as e<sup>−bt/2m</sup>.` : 'It never overshoots: no oscillation.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Released from x = A at rest', col);
    const a = axes(ctx, w, h, col, { x: [0, 4.4], y: [-1.1, 1.1], xt: [0, 1, 2, 3, 4], yt: [-1, 0, 1], xlabel: 'time t (s)', ylabel: 'x / A', l: 38, t: top + 8, b: 40 });
    ctx.save(); a.clip();
    if (b > 0 && b < bc) { const env = (s) => Math.exp(-b * s / (2 * m)); line(ctx, Array.from({ length: 111 }, (_, i) => [a.X(i * 0.04), a.Y(env(i * 0.04))]), col.s[3], 1.5, [5, 4]); line(ctx, Array.from({ length: 111 }, (_, i) => [a.X(i * 0.04), a.Y(-env(i * 0.04))]), col.s[3], 1.5, [5, 4]); }
    line(ctx, data.map(([s, x]) => [a.X(s), a.Y(x)]), col.s[0], 2.5); ctx.restore();
    const i = Math.min(data.length - 1, Math.round(t / 0.04)); dot(ctx, a.X(data[i][0]), a.Y(data[i][1]), 6, col.s[2], col.ink);
    if (b > 0 && b < bc) text(ctx, 'envelope', a.R - 4, a.Y(0.82), { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
  };
  go();
}
