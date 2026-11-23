// Class 11 Waves: speed of a pulse on a stretched string, v = sqrt(T / mu) (T = tension, mu = mass per metre). A tighter string is faster, a heavier one slower.
// A pulse is sent along 10 m of string and a clock runs until it reaches the end; it should read 10 m / v.
import { canvas, text, title, line, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let Tn = 100, mu = 0.04, x = 0, clock = 0, run = false;
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 270, label: 'A pulse travelling along a stretched string with a clock' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'tension T (N)', min: 20, max: 400, step: 10, value: Tn, fmt: (v) => v.toFixed(0), oninput: (v) => { Tn = v; go(); } });
  slider(ctl, { label: 'mass per metre μ (g/m)', min: 10, max: 100, step: 5, value: mu * 1000, fmt: (v) => v.toFixed(0), oninput: (v) => { mu = v / 1000; go(); } });
  button(ctl, '↻ Send a pulse', () => { x = 0; clock = 0; run = true; });
  const v = () => Math.sqrt(Tn / mu);
  loop(host, (dt) => { if (run) { clock += dt * 0.04; x += v() * dt * 0.04; if (x >= 10) { x = 10; run = false; } cv.redraw(); } else cv.redraw(); });
  const go = () => { ro.innerHTML = `v = √(T/μ) = √(${Tn} / ${mu.toFixed(3)}) = <b>${v().toFixed(1)} m/s</b>, so 10 m takes ${(10 / v() * 1000).toFixed(0)} ms (the clock above runs 25 times slower than real time so you can watch).`; x = 0; clock = 0; run = true; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Pulse speed v = √(T / μ)', col), x0 = 20, x1 = w - 20, y = top + (h - top) / 2 - 6, sc = (x1 - x0) / 10;
    line(ctx, [[x0, y], [x1, y]], col.line, 1.5);
    const pts = []; for (let i = 0; i <= 200; i++) { const p = i / 20, d = p - x; pts.push([x0 + p * sc, y - 34 * Math.exp(-d * d / 0.5) * (x > 0 && x < 10 ? 1 : x >= 10 ? 0 : 0.0)]); }
    line(ctx, pts, col.s[0], 3);
    ctx.fillStyle = col.ink; ctx.fillRect(x0 - 6, y - 14, 6, 28); ctx.fillRect(x1, y - 14, 6, 28);
    for (let m = 0; m <= 10; m += 2) { line(ctx, [[x0 + m * sc, y + 22], [x0 + m * sc, y + 28]], col.muted, 1); text(ctx, m + ' m', x0 + m * sc, y + 40, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, `clock: ${(clock * 1000 / 0.04 * 0.04).toFixed(0)} ms (real)`, w / 2, y - 48, { color: col.s[3], size: 12, weight: 700, align: 'center' });
  };
  go();
}
