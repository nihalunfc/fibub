// 3.2 Resonance curves. Top: steady-state displacement amplitude (in units of the static stretch F0/k) against
// driving frequency w/w0, with the absorbed power (scaled to the same peak) dashed. Bottom: phase lag of the
// displacement behind the force. Sliders set the quality factor Q and the driving frequency marker.
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

const amp = (u, Q) => 1 / Math.sqrt((1 - u * u) ** 2 + (u / Q) ** 2); // A / (F0/k), u = w/w0, 2 beta/w0 = 1/Q
const phase = (u, Q) => Math.atan2(u / Q, 1 - u * u); // 0 .. pi
const power = (u, Q) => (u / Q) ** 2 / ((1 - u * u) ** 2 + (u / Q) ** 2); // P / P(w0)

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 480, min: 340, label: 'Amplitude and phase of a driven damped oscillator against driving frequency' });
  let Q = 4, u = 0.8;
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const ur = 1 - 1 / (2 * Q * Q);
    out.innerHTML = `At ω = ${fmt(u, 3)} ω₀: amplitude <b>${fmt(amp(u, Q), 3)}</b> × F₀/k, displacement lags the force by <b>${fmt(phase(u, Q) * 180 / Math.PI, 3)}°</b>, power ${Math.round(100 * power(u, Q))}% of its peak. ` +
      (ur > 0 ? `Amplitude peak at ${fmt(Math.sqrt(ur), 4)} ω₀ (height ${fmt(amp(Math.sqrt(ur), Q), 3)}); ` : 'No amplitude peak (Q below 1/√2); ') + `power peak exactly at ω₀, half-power width ${fmt(1 / Q, 3)} ω₀ = ω₀/Q.`;
  };
  slider(ctl, { label: 'Quality factor Q', min: 0.3, max: 30, value: Q, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { Q = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Driving ω / ω₀', min: 0.05, max: 2.5, step: 0.01, value: u, fmt: (v) => fmt(v, 3), oninput: (v) => { u = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    const N = 400, us = Array.from({ length: N + 1 }, (_, i) => 0.0001 + (2.5 * i) / N);
    const peak = Math.max(...us.map((x) => amp(x, Q)));
    const ymax = Math.max(1.5, peak * 1.12);
    const top = axes(ctx, w, h, col, { x: [0, 2.5], y: [0, ymax], b: h * 0.47, t: 26, ylabel: 'A / (F₀/k)' });
    ctx.save(); top.clip();
    line(ctx, us.map((x) => [top.X(x), top.Y(power(x, Q) * amp(1, Q))]), col.s[2], 1.5, [5, 4]);
    line(ctx, us.map((x) => [top.X(x), top.Y(amp(x, Q))]), col.s[0], 2.5);
    ctx.restore();
    line(ctx, [[top.X(1), top.T], [top.X(1), top.B]], col.muted, 1, [3, 4]);
    line(ctx, [[top.X(u), top.T], [top.X(u), top.B]], col.s[3], 1.5);
    dot(ctx, top.X(u), top.Y(Math.min(amp(u, Q), ymax)), 5, col.s[3]);
    text(ctx, 'amplitude', top.L + 6, top.T + 8, { color: col.s[0], size: 11, weight: 600 });
    text(ctx, 'power (dashed, same peak height at ω₀)', top.L + 6, top.T + 22, { color: col.s[2], size: 11 });
    const bot = axes(ctx, w, h, col, { x: [0, 2.5], y: [0, 180], t: h * 0.6, yt: [0, 90, 180], xlabel: 'driving frequency ω / ω₀', ylabel: 'lag (°)' });
    line(ctx, us.map((x) => [bot.X(x), bot.Y(phase(x, Q) * 180 / Math.PI)]), col.s[1], 2.5);
    line(ctx, [[bot.X(u), bot.T], [bot.X(u), bot.B]], col.s[3], 1.5);
    dot(ctx, bot.X(u), bot.Y(phase(u, Q) * 180 / Math.PI), 5, col.s[3]);
    line(ctx, [[bot.L, bot.Y(90)], [bot.R, bot.Y(90)]], col.muted, 1, [3, 4]);
  };
  cv.redraw(); show();
}
