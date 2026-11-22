// A Zener diode as a voltage regulator. The input wobbles (a battery plus ripple); the series resistor R_s drops the
// difference and the Zener, reverse biased past its breakdown voltage V_Z, holds the output nearly fixed. Lower the load
// resistance until the Zener current runs out and regulation fails: the output then follows the input again.
// Left: waveforms of input and output. Right: the Zener I-V curve with the operating point.
import { canvas, axes, line, dot, text, row, slider, readout, loop, title, fmt } from '../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'Zener regulator input and output waveforms and the I-V operating point' });
  const ctl = row(host);
  const sv = slider(ctl, { label: 'Average input V_in', min: 8, max: 20, step: 0.1, value: 14, fmt: (v) => v.toFixed(1) + ' V', oninput: () => cv.redraw() });
  const sr = slider(ctl, { label: 'Ripple (peak)', min: 0, max: 4, step: 0.1, value: 2, fmt: (v) => v.toFixed(1) + ' V', oninput: () => cv.redraw() });
  const sl = slider(ctl, { label: 'Load R_L (Ω)', min: 50, max: 2000, step: 10, value: 1000, fmt: (v) => v + ' Ω', oninput: () => cv.redraw() });
  const lp = loop(host, (dt, t) => { ph = t; cv.redraw(); });
  lp.button(row(host));
  const out = readout(host);
  let ph = 0;
  const VZ = 6.8, RS = 200, RZ = 8; // 6.8 V Zener with 8 ohm slope resistance
  // output for a given input: Zener conducts when V_th > VZ (Thevenin of the divider)
  const vout = (vin, RL) => { const vth = vin * RL / (RS + RL), rth = RS * RL / (RS + RL); if (vth <= VZ) return vth; const iz = (vth - VZ) / (rth + RZ); return VZ + iz * RZ; };
  const izOf = (vin, RL) => { const vo = vout(vin, RL); return Math.max(0, (vin - vo) / RS - vo / RL); };
  cv.draw = (ctx, w, h, col) => {
    const V0 = sv.value, rp = sr.value, RL = sl.value, split = Math.round(w * 0.6);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, split, h); ctx.clip();
    const A = axes(ctx, split, h, col, { x: [0, 40], y: [0, 24], xlabel: 'time (ms)', ylabel: 'volts', l: 38, r: 6, t: 36, xt: [0, 10, 20, 30, 40], yt: [0, 6.8, 12, 18, 24], fy: (v) => (v === 6.8 ? 'Vz' : v) });
    A.clip();
    const a = [], b = [];
    for (let i = 0; i <= 160; i++) { const tt = (i / 160) * 40, vin = V0 + rp * Math.sin((2 * Math.PI * (tt - ph * 8)) / 10); a.push([A.X(tt), A.Y(vin)]); b.push([A.X(tt), A.Y(vout(vin, RL))]); }
    line(ctx, a, col.muted, 2); line(ctx, b, col.s[0], 2.5);
    ctx.restore();
    text(ctx, 'input', 44, 34, { color: col.muted, size: 11, weight: 600 }); text(ctx, 'output', 100, 34, { color: col.s[0], size: 11, weight: 700 });
    // I-V curve (reverse): current into Zener against voltage across it
    const L = split + 10, Rr = w - 10, T = 50, B = h - 28;
    const X = (v) => L + 16 + (v / 9) * (Rr - L - 20), Y = (i) => B - (i / 60) * (B - T);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L + 16, T); ctx.lineTo(L + 16, B); ctx.lineTo(Rr, B); ctx.stroke();
    const c = []; for (let i = 0; i <= 90; i++) { const v = (i / 90) * 9, iz = v < VZ ? 0.002 * Math.exp((v - VZ) * 2.5) : (v - VZ) / RZ * 1000; c.push([X(v), Y(Math.min(60, iz))]); }
    line(ctx, c, col.s[2], 2.5);
    const lo = V0 - rp, hi = V0 + rp, vL = vout(lo, RL), vH = vout(hi, RL);
    const cur = V0 + rp * Math.sin((2 * Math.PI * (-ph * 8)) / 10), vo = vout(cur, RL), iz = izOf(cur, RL) * 1000;
    dot(ctx, X(Math.min(9, vo)), Y(Math.min(60, iz)), 5, col.s[1], col.ink);
    text(ctx, 'Zener I-V', L + 20, T - 14, { color: col.ink, size: 11, weight: 600 }); text(ctx, 'V_Z', X(VZ), B + 12, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'I (mA)', L + 20, T - 2, { color: col.muted, size: 10 });
    title(ctx, 'Zener regulator (6.8 V, R_s = 200 Ω)', col);
    out.innerHTML = `<b>Output swings only ${fmt(vH - vL, 2)} V</b> while the input swings ${(2 * rp).toFixed(1)} V (ripple rejection about ${vH - vL > 0.001 ? ((2 * rp) / (vH - vL)).toFixed(0) : '∞'}×). Now the Zener carries ${iz.toFixed(1)} mA; the load takes ${((vo / RL) * 1000).toFixed(1)} mA. ${vL < VZ - 0.05 ? 'At the lowest input the Zener is out of breakdown, so the output sags: regulation is lost. Reduce R_L or raise V_in.' : 'The Zener soaks up the extra current when the input rises and gives it back when the load takes more.'}`;
  };
  cv.redraw();
}
