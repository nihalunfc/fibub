// Class 12 Semiconductors: V-I characteristic of a p-n junction diode. Forward: almost no current below the knee (about 0.7 V Si, 0.3 V Ge), then a steep, exponential rise
// I = I_k exp((V - V_k)/(n V_T)) with n = 1.5 and V_T = 26 mV. Reverse: a tiny constant leakage (Si about 0.1 µA, Ge about 2 µA, much smaller than forward currents) until breakdown near -50 V.
// Static resistance V/I and dynamic resistance dV/dI change enormously, so a diode does not obey Ohm's law. (Model values are typical, not a datasheet.)
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let fwd = true, mat = 'si', s = 0.65, V = 0.65;
  const VT = 0.026, nn = 1.5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'Current-voltage graph of a diode in forward and reverse bias with a movable point' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Bias', [[true, 'Forward'], [false, 'Reverse']], fwd, (v) => { fwd = v; s = fwd ? (mat === 'si' ? 0.65 : 0.28) : 0.33; sl.set(s); go(); });
  choice(ctl, 'Diode', [['si', 'Silicon'], ['ge', 'Germanium']], mat, (v) => { mat = v; if (fwd) { s = mat === 'si' ? 0.65 : 0.28; sl.set(s); } go(); });
  const sl = slider(ctl, { label: 'voltage magnitude (V)', min: 0, max: 1, step: 0.005, value: s, fmt: (v) => (fwd ? v : 60 * v).toFixed(2), oninput: (v) => { s = v; go(); } });
  const upd = () => { V = fwd ? s : 60 * s; };
  const Vk = () => (mat === 'si' ? 0.7 : 0.3), Irev = () => (mat === 'si' ? 0.1 : 2);
  const If = (v) => 10 * Math.exp((v - Vk()) / (nn * VT)) * (1 - Math.exp(-v / VT)) ;   // mA
  const Ir = (v) => (v < 50 ? Irev() : Irev() + 8 * (v - 50) ** 2);                         // µA
    const go = () => {
    upd();
    if (fwd) { const v = Math.min(V, 1), i = If(v), d = (If(v + 0.001) - If(v - 0.001)) / 0.002; ro.textContent = `Forward ${v.toFixed(2)} V: I = ${i < 0.01 ? i.toExponential(1) : i.toFixed(2)} mA.  Static resistance V/I = ${i > 1e-9 ? (v / (i / 1000)).toFixed(0) : '∞'} Ω; dynamic resistance dV/dI = ${d > 0 ? (1 / d * 1000).toFixed(1) : '∞'} Ω (tiny once on).  Knee ≈ ${Vk()} V.`; }
    else ro.textContent = `Reverse ${V.toFixed(1)} V: I ≈ ${Ir(V).toFixed(2)} µA (reverse saturation current).  Resistance ≈ ${(V / (Ir(V) * 1e-6) / 1e6).toFixed(1)} MΩ: very high.  ${V >= 50 ? 'BREAKDOWN: the current shoots up and the diode may be damaged.' : 'It barely changes as the voltage rises.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, fwd ? 'Forward bias (current in mA)' : 'Reverse bias (current in µA)', col);
    const A = axes(ctx, w, h, col, fwd ? { x: [0, 1], y: [0, 40], xlabel: 'forward voltage (V)', ylabel: 'forward current (mA)', l: 44, t: top + 8, b: 38 } : { x: [0, 60], y: [0, 20], xlabel: 'reverse voltage (V)', ylabel: 'reverse current (µA)', l: 44, t: top + 8, b: 38 });
    const pts = []; if (fwd) { for (let v = 0; v <= 1.0001; v += 0.01) pts.push([A.X(v), A.Y(Math.min(40, If(v)))]); } else for (let v = 0; v <= 60; v += 0.5) pts.push([A.X(v), A.Y(Math.min(20, Ir(v)))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    const v = fwd ? Math.min(V, 1) : V, y = fwd ? Math.min(40, If(v)) : Math.min(20, Ir(v));
    if (fwd) { ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(A.X(Vk()), A.B); ctx.lineTo(A.X(Vk()), A.Y(0) - 18); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'knee', A.X(Vk()), A.B - 28, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    else text(ctx, 'breakdown', A.X(36), A.Y(11), { color: col.s[2], size: 11, weight: 700, align: 'center' });
    dot(ctx, A.X(v), A.Y(y), 6, col.s[3], col.panel);
  };
  go();
}
