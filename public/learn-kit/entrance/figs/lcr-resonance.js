// Alternating current: a series LCR circuit on a 10 V (rms) supply of variable frequency. The curve is the rms current
// against frequency; it peaks at f₀ = 1/(2π√(LC)) where X_L = X_C and Z = R. Smaller R gives a sharper peak (higher Q).
import { canvas, axes, line, dot, row, slider, readout, text, fmt } from '../../kit.js';

const V = 10;
export default function (host) {
  let R = 20, L = 100, C = 10, f = 120; // Ω, mH, µF, Hz
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 240, label: 'Resonance curve of a series LCR circuit' });
  const ctl = row(host);
  slider(ctl, { label: 'R', min: 5, max: 100, step: 5, value: R, fmt: (v) => `${v} Ω`, oninput: (v) => { R = v; upd(); } });
  slider(ctl, { label: 'L', min: 20, max: 500, step: 10, value: L, fmt: (v) => `${v} mH`, oninput: (v) => { L = v; upd(); } });
  slider(ctl, { label: 'C', min: 1, max: 50, step: 1, value: C, fmt: (v) => `${v} µF`, oninput: (v) => { C = v; upd(); } });
  slider(ctl, { label: 'Supply f', min: 10, max: 500, step: 5, value: f, fmt: (v) => `${v} Hz`, oninput: (v) => { f = v; upd(); } });
  const out = readout(host);
  const I = (ff) => { const w = 2 * Math.PI * ff, X = w * L * 1e-3 - 1 / (w * C * 1e-6); return V / Math.hypot(R, X); };
  const upd = () => {
    cv.redraw();
    const w = 2 * Math.PI * f, XL = w * L * 1e-3, XC = 1 / (w * C * 1e-6), Z = Math.hypot(R, XL - XC), phi = (Math.atan2(XL - XC, R) * 180) / Math.PI;
    const f0 = 1 / (2 * Math.PI * Math.sqrt(L * 1e-3 * C * 1e-6)), Q = Math.sqrt((L * 1e-3) / (C * 1e-6)) / R;
    out.innerHTML = `X<sub>L</sub> = ${fmt(XL, 3)} Ω, X<sub>C</sub> = ${fmt(XC, 3)} Ω, Z = ${fmt(Z, 3)} Ω, I<sub>rms</sub> = <b>${fmt(V / Z, 3)} A</b>, power factor cos φ = ${fmt(R / Z, 3)}; current ${Math.abs(phi) < 1 ? 'in phase with the voltage (resonance)' : phi > 0 ? `lags the voltage by ${Math.abs(phi).toFixed(0)}° (inductive)` : `leads the voltage by ${Math.abs(phi).toFixed(0)}° (capacitive)`}. f₀ = <b>${fmt(f0, 3)} Hz</b>, Q = ${fmt(Q, 3)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const f0 = 1 / (2 * Math.PI * Math.sqrt(L * 1e-3 * C * 1e-6));
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 500], y: [0, (V / R) * 1.15], xlabel: 'supply frequency f (Hz)', ylabel: 'I rms (A)', t: 26 });
    const pts = []; for (let ff = 2; ff <= 500; ff += 1) pts.push([X(ff), Y(I(ff))]);
    line(ctx, pts, col.s[0], 2.5);
    if (f0 <= 500) { line(ctx, [[X(f0), Y(0)], [X(f0), Y(V / R)]], col.muted, 1, [4, 4]); text(ctx, `f₀ = ${fmt(f0, 3)} Hz, I = V/R`, X(f0) + 6, Y(V / R) - 8, { color: col.muted, size: 11, halo: col.panel }); }
    line(ctx, [[X(0), Y(V / R / Math.SQRT2)], [X(500), Y(V / R / Math.SQRT2)]], col.line, 1, [2, 4]);
    text(ctx, 'half-power level (I max/√2)', X(500) - 4, Y(V / R / Math.SQRT2) + 10, { color: col.muted, size: 10, align: 'right', halo: col.panel });
    dot(ctx, X(f), Y(I(f)), 6, col.s[3], col.panel);
  };
  upd();
}
