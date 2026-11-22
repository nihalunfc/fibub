// Class 12 Semiconductors: rectifier output with and without a smoothing capacitor. Ideal diodes, 10 V peak at 50 Hz mains frequency. Half wave: only one half of each cycle passes (output pulses at
// 50 Hz, average Vm/pi). Full wave: both halves pass (pulses at 100 Hz, average 2Vm/pi). A capacitor charges to the peak and holds the output up while the diode is off; a bigger C or a bigger
// load resistance R gives less ripple (the capacitor discharges slower, with time constant RC). Simulated step by step each 0.05 ms.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let full = false, C = 200, R = 1000, t = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'Input voltage and rectified output with a smoothing capacitor' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Rectifier', [[false, 'Half-wave'], [true, 'Full-wave']], full, (v) => { full = v; go(); });
  slider(ctl, { label: 'capacitor C (µF)', min: 0, max: 1000, step: 10, value: C, fmt: (v) => (v === 0 ? 'none' : v + ' µF'), oninput: (v) => { C = v; go(); } });
  slider(ctl, { label: 'load R (Ω)', min: 200, max: 5000, step: 100, value: R, fmt: (v) => v + ' Ω', oninput: (v) => { R = v; go(); } });
  const Vm = 10, f = 50, dt = 5e-5, T = 0.06;
  const sim = () => {
    const out = [], inn = []; let vc = 0;
    for (let k = 0; k <= T / dt; k++) {
      const tt = k * dt, vin = Vm * Math.sin(2 * Math.PI * f * tt), vr = full ? Math.abs(vin) : Math.max(0, vin);
      if (C === 0) vc = vr; else { const dec = vc * Math.exp(-dt / (R * C * 1e-6)); vc = Math.max(vr, dec); }
      out.push(vc); inn.push(vin);
    }
    return { out, inn };
  };
  let S = sim();
  const stats = () => { const o = S.out.slice(S.out.length >> 1), mn = Math.min(...o), mx = Math.max(...o), av = o.reduce((a, b) => a + b, 0) / o.length; return { mn, mx, av }; };
  loop(host, (d) => { t = (t + d * 0.012) % T; cv.redraw(); });
  const go = () => { S = sim(); const { mn, mx, av } = stats(); ro.textContent = `${full ? 'Full' : 'Half'}-wave, ${C === 0 ? 'no capacitor' : 'C = ' + C + ' µF, R = ' + R + ' Ω'}: average output ${av.toFixed(2)} V (ideal no-capacitor values: ${(full ? 2 * Vm / Math.PI : Vm / Math.PI).toFixed(2)} V), ripple ${(mx - mn).toFixed(2)} V peak to peak, ripple frequency ${full ? 100 : 50} Hz.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Input (dashed) and output (solid)', col);
    const A = axes(ctx, w, h, col, { x: [0, 60], y: [-11, 11], xlabel: 'time (ms)', ylabel: 'voltage (V)', l: 44, t: top + 8, b: 38, yt: [-10, -5, 0, 5, 10] });
    const P = (arr) => arr.map((v, k) => [A.X(k * dt * 1000), A.Y(v)]).filter((_, k) => k % 4 === 0);
    ctx.save(); A.clip(); line(ctx, P(S.inn), col.muted, 1.5, [4, 3]); line(ctx, P(S.out), col.s[3], 3); ctx.restore();
    const k = Math.round(t / dt); dot(ctx, A.X(k * dt * 1000), A.Y(S.out[k]), 5.5, col.s[2], col.panel);
    ctx.setLineDash([2, 3]); ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(A.L, A.Y(stats().av)); ctx.lineTo(A.R, A.Y(stats().av)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `average ${stats().av.toFixed(1)} V`, A.R - 4, A.Y(stats().av) - 9, { color: col.s[2], size: 10.5, weight: 700, align: 'right' });
  };
  go();
}
