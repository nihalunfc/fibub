// 4.8 Series LCR: the phasor diagram and the resonance curve together. The current phasor is drawn along the
// horizontal; V_R lies along it, V_L leads by 90°, V_C lags by 90°, and the source voltage V is their vector sum.
// Normalised so that ω0 = 1, R = 1 and V = 1: then L = Q, C = 1/Q, the current at resonance is 1 and V_L = V_C = Q.
import { canvas, axes, line, dot, text, row, slider, readout, fmt, arrow } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 480, min: 330, label: 'Phasor diagram of a series LCR circuit above its resonance curve' });
  let u = 0.8, Q = 3;
  const ctl = row(host);
  slider(ctl, { label: 'Driving ω / ω₀', min: 0.3, max: 2, step: 0.01, value: u, fmt: (v) => fmt(v, 3), oninput: (v) => { u = v; upd(); } });
  slider(ctl, { label: 'Quality factor Q', min: 0.5, max: 10, step: 0.1, value: Q, fmt: (v) => fmt(v, 3), oninput: (v) => { Q = v; upd(); } });
  const out = readout(host);
  const calc = (w) => { const X = Q * w - Q / w, Z = Math.hypot(1, X), I = 1 / Z; return { X, Z, I, VR: I, VL: I * Q * w, VC: I * Q / w, phi: Math.atan2(X, 1) }; };
  function upd() {
    cv.redraw(); const s = calc(u);
    out.innerHTML = `|Z| = <b>${fmt(s.Z, 3)}</b> R, current <b>${fmt(s.I, 3)}</b> of its peak, V_R = ${fmt(s.VR, 3)} V, V_L = ${fmt(s.VL, 3)} V, V_C = ${fmt(s.VC, 3)} V. ` +
      (Math.abs(s.phi) < 0.02 ? 'At resonance: V_L and V_C cancel, the current is in phase with V, and each reactive voltage is Q times the source.' : `The current ${s.phi > 0 ? 'lags' : 'leads'} the source by ${fmt(Math.abs(s.phi) * 180 / Math.PI, 3)}°: the circuit is ${s.phi > 0 ? 'inductive (above resonance)' : 'capacitive (below resonance)'}.`);
  }
  cv.draw = (ctx, w, h, col) => {
    const s = calc(u), top = h * 0.55;
    const cx = w * 0.3, cy = top * 0.52, M = Math.max(1, s.VL, s.VC), sc = (top * 0.42) / M;
    text(ctx, 'phasors (current along →)', 10, 14, { color: col.muted, size: 11 });
    line(ctx, [[cx - 20, cy], [w - 20, cy]], col.line, 1);
    arrow(ctx, cx, cy, cx + s.VR * sc, cy, col.s[0], 3, 9);
    text(ctx, 'V_R', cx + s.VR * sc + 4, cy + 12, { color: col.s[0], size: 12, weight: 700 });
    arrow(ctx, cx + s.VR * sc, cy, cx + s.VR * sc, cy - s.VL * sc, col.s[1], 2.5, 9);
    text(ctx, 'V_L', cx + s.VR * sc + 6, cy - s.VL * sc + 4, { color: col.s[1], size: 12, weight: 700 });
    arrow(ctx, cx + s.VR * sc + 14, cy - s.VL * sc, cx + s.VR * sc + 14, cy - (s.VL - s.VC) * sc, col.s[3], 2.5, 9);
    text(ctx, 'V_C', cx + s.VR * sc + 20, cy - (s.VL - s.VC / 2) * sc, { color: col.s[3], size: 12, weight: 700 });
    arrow(ctx, cx, cy, cx + s.VR * sc, cy - (s.VL - s.VC) * sc, col.ink, 2.5, 10);
    text(ctx, 'V (source)', cx - 6, cy - (s.VL - s.VC) * sc * 0.5, { color: col.ink, size: 12, weight: 700, align: 'right' });
    const g = axes(ctx, w, h, col, { x: [0.3, 2], y: [0, 1.1], t: top + 14, xlabel: 'driving frequency ω / ω₀', ylabel: 'I / I_max' });
    const P = []; for (let i = 0; i <= 200; i++) { const ww = 0.3 + 1.7 * i / 200; P.push([g.X(ww), g.Y(calc(ww).I)]); }
    line(ctx, [[g.L, g.Y(1 / Math.SQRT2)], [g.R, g.Y(1 / Math.SQRT2)]], col.muted, 1, [3, 4]);
    line(ctx, P, col.s[0], 2.5);
    dot(ctx, g.X(u), g.Y(s.I), 5, col.s[3]);
    text(ctx, 'half power', g.R - 4, g.Y(1 / Math.SQRT2) - 8, { color: col.muted, size: 10, align: 'right' });
  };
  upd();
}
