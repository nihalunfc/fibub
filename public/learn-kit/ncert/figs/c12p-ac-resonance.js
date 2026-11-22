// Class 12 Alternating Current: series LCR resonance curve. i_rms = V/Z with Z = sqrt(R^2 + (wL - 1/wC)^2) and a fixed
// 10 V rms supply. The peak sits at f0 = 1/(2 pi sqrt(LC)) where Z = R. Lower R makes a taller, sharper peak: the quality
// factor Q = w0 L / R = f0 / (bandwidth) is larger. The shaded band is where the current is at least peak/sqrt(2).
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let R = 10, L = 100, C = 10;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Resonance curve of current against frequency for a series LCR circuit' });
  const ctl = row(host);
  slider(ctl, { label: 'Resistance R', min: 5, max: 50, step: 1, value: R, fmt: (v) => `${v} Ω`, oninput: (v) => { R = v; upd(); } });
  slider(ctl, { label: 'Inductance L', min: 50, max: 200, step: 10, value: L, fmt: (v) => `${v} mH`, oninput: (v) => { L = v; upd(); } });
  slider(ctl, { label: 'Capacitance C', min: 5, max: 40, step: 1, value: C, fmt: (v) => `${v} µF`, oninput: (v) => { C = v; upd(); } });
  const out = readout(host);
  const Ii = (f) => { const w = 2 * Math.PI * f, X = w * L / 1000 - 1e6 / (w * C); return 10 / Math.hypot(R, X); };
  const f0 = () => 1 / (2 * Math.PI * Math.sqrt((L / 1000) * (C / 1e6)));
  function upd() {
    const F = f0(), Q = (2 * Math.PI * F * L / 1000) / R, bw = F / Q;
    out.innerHTML = `f₀ = <b>${F.toFixed(0)} Hz</b>, peak current = V/R = <b>${(10 / R).toFixed(2)} A</b>, Q = ω₀L/R = <b>${Q.toFixed(1)}</b>, bandwidth Δf = f₀/Q = <b>${bw.toFixed(1)} Hz</b>. ${Q > 5 ? 'Sharp: a good radio tuner.' : 'Flat: poor at picking out one station.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Resonance: current against frequency', col);
    const ax = axes(ctx, w, h, col, { x: [0, 400], y: [0, 2.2], t: top + 6, xlabel: 'frequency f (Hz)', ylabel: 'rms current (A)', xt: [0, 100, 200, 300, 400], yt: [0, 0.5, 1, 1.5, 2] });
    const F = f0(), Imax = 10 / R, Q = (2 * Math.PI * F * L / 1000) / R, half = Imax / Math.SQRT2;
    ctx.save(); ax.clip();
    const lo = F - F / Q / 2 * 0 , bwL = Math.max(0, F * (Math.sqrt(1 + 1 / (4 * Q * Q)) - 1 / (2 * Q))), bwH = F * (Math.sqrt(1 + 1 / (4 * Q * Q)) + 1 / (2 * Q));
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[2]; ctx.fillRect(ax.X(bwL), ax.Y(Math.min(2.2, half)) , ax.X(bwH) - ax.X(bwL), ax.B - ax.Y(Math.min(2.2, half))); ctx.globalAlpha = 1;
    line(ctx, [[ax.L, ax.Y(half)], [ax.R, ax.Y(half)]], col.s[2], 1.5, [5, 4]);
    const p = []; for (let k = 1; k <= 300; k++) { const f = (400 * k) / 300; p.push([ax.X(f), ax.Y(Ii(f))]); }
    line(ctx, p, col.s[0], 2.8);
    ctx.restore();
    if (F < 400) { dot(ctx, ax.X(F), ax.Y(Imax), 6, col.s[3], col.panel); line(ctx, [[ax.X(F), ax.Y(Imax)], [ax.X(F), ax.B]], col.s[3], 1.5, [4, 3]); text(ctx, 'f₀', ax.X(F) + 8, ax.B - 10, { color: col.s[3], size: 11.5, weight: 700 }); }
    text(ctx, 'I_max/√2', ax.R - 4, ax.Y(half) - 9, { color: col.s[2], size: 11, weight: 700, align: 'right', halo: col.panel });
  };
  upd();
}
