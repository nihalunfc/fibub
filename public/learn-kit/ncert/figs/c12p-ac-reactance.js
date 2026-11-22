// Class 12 Alternating Current: reactance against frequency. X_L = 2 pi f L grows in a straight line with frequency
// (an inductor chokes fast AC); X_C = 1/(2 pi f C) falls as 1/f (a capacitor blocks slow AC, passes fast AC).
// They cross at the resonant frequency f0 = 1/(2 pi sqrt(LC)). Sliders set L and C; the dot shows the chosen frequency.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let L = 100, C = 100, f = 50; // mH, uF
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Inductive and capacitive reactance plotted against frequency' });
  const ctl = row(host);
  slider(ctl, { label: 'Inductance L', min: 20, max: 300, step: 10, value: L, fmt: (v) => `${v} mH`, oninput: (v) => { L = v; upd(); } });
  slider(ctl, { label: 'Capacitance C', min: 20, max: 300, step: 10, value: C, fmt: (v) => `${v} µF`, oninput: (v) => { C = v; upd(); } });
  slider(ctl, { label: 'Frequency f', min: 10, max: 300, step: 5, value: f, fmt: (v) => `${v} Hz`, oninput: (v) => { f = v; upd(); } });
  const out = readout(host);
  const XL = (fr) => 2 * Math.PI * fr * L / 1000, XC = (fr) => 1e6 / (2 * Math.PI * fr * C), f0 = () => 1 / (2 * Math.PI * Math.sqrt((L / 1000) * (C / 1e6)));
  function upd() {
    out.innerHTML = `At ${f} Hz: X<sub>L</sub> = <b>${XL(f).toFixed(1)} Ω</b>, X<sub>C</sub> = <b>${XC(f).toFixed(1)} Ω</b>. They are equal at f₀ = 1/(2π√LC) = <b>${f0().toFixed(1)} Hz</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Reactance of an inductor and a capacitor', col);
    const ax = axes(ctx, w, h, col, { x: [0, 300], y: [0, 300], t: top + 6, xlabel: 'frequency f (Hz)', ylabel: 'reactance (Ω)', xt: [0, 100, 200, 300], yt: [0, 100, 200, 300] });
    ctx.save(); ax.clip();
    const a = [], b = []; for (let k = 1; k <= 200; k++) { const fr = (300 * k) / 200; a.push([ax.X(fr), ax.Y(XL(fr))]); b.push([ax.X(fr), ax.Y(XC(fr))]); }
    line(ctx, a, col.s[0], 2.5); line(ctx, b, col.s[1], 2.5);
    ctx.restore();
    const fz = f0(); if (fz < 300) { line(ctx, [[ax.X(fz), ax.B], [ax.X(fz), ax.Y(XL(fz))]], col.s[3], 1.5, [4, 3]); dot(ctx, ax.X(fz), ax.Y(XL(fz)), 5, col.s[3], col.panel); text(ctx, 'f₀', ax.X(fz) + 6, ax.B - 10, { color: col.s[3], size: 11.5, weight: 700 }); }
    line(ctx, [[ax.X(f), ax.T], [ax.X(f), ax.B]], col.line, 1, [3, 3]);
    dot(ctx, ax.X(f), ax.Y(Math.min(300, XL(f))), 6, col.s[0], col.panel); dot(ctx, ax.X(f), ax.Y(Math.min(300, XC(f))), 6, col.s[1], col.panel);
    text(ctx, 'X_L = 2πfL', ax.X(210), ax.Y(Math.min(290, XL(210))) - 12, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'X_C = 1/2πfC', ax.X(150), ax.Y(Math.min(290, XC(150))) - 10, { color: col.s[1], size: 11.5, weight: 700, halo: col.panel });
  };
  upd();
}
