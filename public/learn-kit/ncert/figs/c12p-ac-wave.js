// Class 12 Alternating Current: the AC waveform v = V0 sin(2 pi f t). Change the peak voltage and the frequency and watch
// the dot trace the curve. The dashed lines are the peak value V0 and the rms value V0/sqrt(2); the mains in India has
// f = 50 Hz, so the voltage reverses direction 100 times every second. A switch compares it with steady DC.
import { canvas, axes, line, dot, text, title, row, slider, readout, loop, choice } from '../../kit.js';

export default function (host) {
  let V0 = 325, f = 50, mode = 'ac', t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Sine wave of alternating voltage against time with peak and rms values marked' });
  const ctl = row(host);
  slider(ctl, { label: 'Peak voltage V₀', min: 50, max: 400, step: 5, value: V0, fmt: (v) => `${v} V`, oninput: (v) => { V0 = v; upd(); } });
  slider(ctl, { label: 'Frequency f', min: 25, max: 100, step: 5, value: f, fmt: (v) => `${v} Hz`, oninput: (v) => { f = v; upd(); } });
  choice(ctl, 'Supply', [['ac', 'AC'], ['dc', 'DC (same heating)']], mode, (v) => { mode = v; upd(); });
  const anim = loop(host, (dt) => { t = (t + dt * 4) % 40; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function upd() {
    const rms = V0 / Math.SQRT2;
    out.innerHTML = `Period T = 1/f = <b>${(1000 / f).toFixed(1)} ms</b>. V<sub>rms</sub> = V₀/√2 = <b>${rms.toFixed(0)} V</b>: the DC voltage that heats a heater just as much. The direction reverses <b>${2 * f}</b> times a second.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'ac' ? 'Alternating voltage: v = V₀ sin 2πft' : 'AC and the DC that heats equally', col);
    const ax = axes(ctx, w, h, col, { x: [0, 40], y: [-420, 420], t: top + 6, xlabel: 'time (ms)', ylabel: 'voltage (V)', yt: [-400, -200, 0, 200, 400], xt: [0, 10, 20, 30, 40] });
    const rms = V0 / Math.SQRT2;
    const v = (ms) => V0 * Math.sin(2 * Math.PI * f * ms / 1000);
    ctx.save(); ax.clip();
    line(ctx, [[ax.X(0), ax.Y(V0)], [ax.X(40), ax.Y(V0)]], col.s[1], 1.5, [6, 4]);
    line(ctx, [[ax.X(0), ax.Y(-V0)], [ax.X(40), ax.Y(-V0)]], col.s[1], 1.5, [6, 4]);
    line(ctx, [[ax.X(0), ax.Y(rms)], [ax.X(40), ax.Y(rms)]], col.s[2], 2, [2, 4]);
    const pts = []; for (let k = 0; k <= 240; k++) { const ms = (40 * k) / 240; pts.push([ax.X(ms), ax.Y(v(ms))]); }
    line(ctx, pts, col.s[0], 2.5);
    if (mode === 'dc') line(ctx, [[ax.X(0), ax.Y(rms)], [ax.X(40), ax.Y(rms)]], col.s[3], 3.5);
    ctx.restore();
    dot(ctx, ax.X(t), ax.Y(v(t)), 6, col.s[0], col.panel);
    text(ctx, 'V₀ (peak)', ax.R - 4, ax.Y(V0) - 9, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, mode === 'dc' ? 'DC = V₀/√2' : 'V₀/√2 (rms)', ax.R - 4, ax.Y(rms) + 11, { color: mode === 'dc' ? col.s[3] : col.s[2], size: 11, weight: 700, align: 'right', halo: col.panel });
    const T = 1000 / f; line(ctx, [[ax.X(0), ax.Y(-V0) + 14], [ax.X(T), ax.Y(-V0) + 14]], col.ink, 1.5);
    text(ctx, 'T', ax.X(T / 2), ax.Y(-V0) + 24, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  upd();
}
