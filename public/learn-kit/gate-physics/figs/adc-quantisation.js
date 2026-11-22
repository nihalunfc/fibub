// 9.7 ADC quantisation and sampling. Top: a sine input (amplitude as a fraction of full scale), its samples, and the
// n-bit rounded staircase a converter reports; with fewer than two samples per cycle the dashed curve shows the alias
// that the samples equally fit. Bottom: the quantisation error, which stays inside ±½ LSB. Readout: LSB, measured
// signal-to-quantisation-noise ratio against the 6.02n + 1.76 dB rule.
import { canvas, row, slider, readout, axes, line, dot, text, title, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 520, min: 360, label: 'A sine wave, its samples and quantised values, and the quantisation error' });
  let n = 3, amp = 1, spc = 16;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Bits n', min: 1, max: 10, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; re(); } });
  slider(ctl, { label: 'Amplitude (fraction of full scale)', min: 0.1, max: 1, step: 0.01, value: amp, fmt: (v) => fmt(v, 2), oninput: (v) => { amp = v; re(); } });
  slider(ctl, { label: 'Samples per input cycle', min: 0.6, max: 40, value: spc, log: true, fmt: (v) => fmt(v, 3), oninput: (v) => { spc = v; re(); } });
  // full scale: -1 .. +1, 2^n codes, LSB q = 2/2^n, mid-rise rounding to code centres
  const quant = (x) => { const q = 2 / 2 ** n, c = Math.min(2 ** n - 1, Math.max(0, Math.floor((x + 1) / q))); return -1 + (c + 0.5) * q; };
  const sig = (t) => amp * 0.999 * Math.sin(2 * Math.PI * t);
  const show = () => {
    const q = 2 / 2 ** n; let ps = 0, pe = 0; const N = 4096;
    for (let i = 0; i < N; i++) { const x = sig((i + 0.37) / N * 7.123); const e = quant(x) - x; ps += x * x; pe += e * e; }
    const meas = 10 * Math.log10(ps / pe), rule = 6.02 * n + 1.76 + 20 * Math.log10(amp);
    const alias = spc < 2 ? Math.abs(1 / spc - Math.round(1 / spc)) * spc : null;
    out.innerHTML = `LSB = ${fmt(q, 3)} of the ±1 range (${2 ** n} levels). Measured SQNR <b>${fmt(meas, 3)} dB</b>; the rule 6.02n + 1.76 dB${amp < 0.99 ? ` − ${fmt(-20 * Math.log10(amp), 2)} dB for the reduced amplitude` : ''} gives <b>${fmt(rule, 3)} dB</b> (the rule assumes the error is uniform, which fails for very few bits). ${spc < 2 ? `<b>Aliasing</b>: with ${fmt(spc, 3)} samples per cycle the samples fit a slower sine at ${fmt(alias, 3)} of the true input frequency.` : `${fmt(spc, 3)} samples per cycle: above the Nyquist minimum of 2.`}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const split = H * 0.64, T = 2; // show two input cycles
    ctx.save();
    const ax = axes(ctx, W, split, col, { x: [0, T], y: [-1.1, 1.1], ylabel: 'signal (full scale ±1)', t: 32, b: 24, fx: () => '' });
    title(ctx, `${n}-bit quantisation of a sampled sine`, col);
    ctx.save(); ax.clip();
    const q = 2 / 2 ** n;
    if (n <= 6) for (let c = 0; c <= 2 ** n; c++) line(ctx, [[ax.L, ax.Y(-1 + c * q)], [ax.R, ax.Y(-1 + c * q)]], col.line, 0.8);
    const pts = []; for (let t = 0; t <= T; t += 0.002) pts.push([ax.X(t), ax.Y(sig(t))]);
    line(ctx, pts, col.muted, 1.6);
    const dt = 1 / spc, samples = [];
    for (let t = 0; t <= T + 1e-9; t += dt) samples.push([t, sig(t), quant(sig(t))]);
    const st = [];
    samples.forEach(([t, , y], i) => { const t1 = i + 1 < samples.length ? samples[i + 1][0] : T; st.push([ax.X(t), ax.Y(y)], [ax.X(Math.min(T, t1)), ax.Y(y)]); });
    line(ctx, st, col.s[0], 2.4);
    if (spc < 2) { const fa = Math.abs(1 / spc - Math.round(1 / spc)) * spc, sgn = (1 / spc - Math.round(1 / spc)) < 0 ? -1 : 1; const al = []; for (let t = 0; t <= T; t += 0.004) al.push([ax.X(t), ax.Y(sgn * amp * 0.999 * Math.sin(2 * Math.PI * fa * t))]); line(ctx, al, col.s[2], 1.8, [6, 4]); }
    samples.forEach(([t, x]) => dot(ctx, ax.X(t), ax.Y(x), 3.5, col.s[4], col.panel));
    ctx.restore(); ctx.restore();
    ctx.save(); ctx.translate(0, split);
    const bx = axes(ctx, W, H - split, col, { x: [0, T], y: [-0.6, 0.6], xlabel: 'time (input periods)', ylabel: 'error (LSB)', t: 10, yt: [-0.5, 0, 0.5] });
    ctx.save(); bx.clip();
    line(ctx, [[bx.L, bx.Y(0.5)], [bx.R, bx.Y(0.5)]], col.muted, 1, [4, 4]); line(ctx, [[bx.L, bx.Y(-0.5)], [bx.R, bx.Y(-0.5)]], col.muted, 1, [4, 4]);
    const ep = []; for (let t = 0; t <= T; t += 0.002) { const x = sig(t); ep.push([bx.X(t), bx.Y((quant(x) - x) / q)]); }
    line(ctx, ep, col.s[3] || col.s[1], 1.4);
    ctx.restore(); ctx.restore();
  };
  re();
}
