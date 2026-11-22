// Digging a signal out of noise by averaging. A small peak (the signal) is measured again and again; each sweep has fresh
// random noise. Press Play to add sweeps: the average settles onto the true shape because noise cancels like 1/√N while the
// signal stays put, so the signal-to-noise ratio grows as √N. Quarter the noise needs 16 times as many sweeps. The bottom graph
// plots the measured SNR against N with the √N line.
import { canvas, axes, line, text, row, slider, button, readout, loop, title, rng, fmt } from '../kit.js';

const M = 120;
export default function (host) {
  let n = 0, sum = new Float64Array(M), last = null, R = rng(31), hist = [];
  const sig = (i) => Math.exp(-(((i - 60) / 9) ** 2) / 2);
  const gauss = () => Math.sqrt(-2 * Math.log(R() + 1e-12)) * Math.cos(2 * Math.PI * R());
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'Noisy sweeps averaged together, and the signal-to-noise ratio against the number of sweeps' });
  const ctl = row(host);
  const sN = slider(ctl, { label: 'Noise (rms, signal peak = 1)', min: 0.5, max: 5, step: 0.1, value: 2, fmt: (v) => v.toFixed(1), oninput: () => reset() });
  const ctl2 = row(host);
  loop(host, () => { for (let k = 0; k < Math.max(1, Math.floor(n / 40)); k++) add(); cv.redraw(); show(); }, { autoplay: false }).button(ctl2);
  button(ctl2, '+ 1 sweep', () => { add(); cv.redraw(); show(); });
  button(ctl2, '+ 100 sweeps', () => { for (let k = 0; k < 100; k++) add(); cv.redraw(); show(); });
  button(ctl2, 'Reset', () => reset());
  const out = readout(host);
  function reset() { n = 0; sum = new Float64Array(M); last = null; hist = []; R = rng(31); add(); cv.redraw(); show(); }
  function add() { n++; last = Array.from({ length: M }, (_, i) => sig(i) + sN.value * gauss()); last.forEach((v, i) => (sum[i] += v)); if (n < 5000) { const snr = 1 / Math.sqrt(Array.from(sum, (s, i) => (s / n - sig(i)) ** 2).reduce((a, b) => a + b, 0) / M); if (!hist.length || n >= hist[hist.length - 1][0] * 1.06) hist.push([n, snr]); } }
  function show() { const rms = Math.sqrt(Array.from(sum, (s, i) => (s / n - sig(i)) ** 2).reduce((a, b) => a + b, 0) / M); out.innerHTML = `<b>${n} sweep${n > 1 ? 's' : ''} averaged.</b> Noise left in the average (rms) ${rms.toFixed(3)}, so SNR = 1/${rms.toFixed(3)} = ${(1 / rms).toFixed(1)}; theory 1/(σ/√N) = ${(Math.sqrt(n) / sN.value).toFixed(1)}. ${1 / rms < 3 ? 'The peak is still hidden.' : 'The peak stands out.'} To double the SNR you need 4 times as many sweeps, which is why averaging has diminishing returns and why a lock-in (narrower bandwidth) or a better detector often beats it.`; }
  cv.draw = (ctx, w, h, col) => {
    const split = h * 0.58;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, split); ctx.clip();
    const A = axes(ctx, w, split, col, { x: [0, M], y: [-8, 8], xlabel: 'position (arb.)', ylabel: 'signal', l: 38, t: 30, b: 32, yt: [-6, 0, 6], xt: [0, 60, 120] });
    A.clip();
    if (last) line(ctx, last.map((v, i) => [A.X(i), A.Y(Math.max(-8, Math.min(8, v)))]), col.line, 1);
    line(ctx, Array.from({ length: M }, (_, i) => [A.X(i), A.Y(sig(i))]), col.muted, 1.5, [4, 4]);
    line(ctx, Array.from(sum, (s, i) => [A.X(i), A.Y(s / Math.max(n, 1))]), col.s[0], 2.5);
    ctx.restore();
    title(ctx, 'grey: one sweep   blue: average   dashed: truth', col);
    const B = axes(ctx, w, h, col, { x: [1, 10000], y: [0.1, 100], xlog: true, ylog: true, xlabel: 'sweeps N', ylabel: 'SNR', l: 38, r: 26, t: split + 8, b: 32, xt: [1, 10, 100, 1000, 10000], yt: [0.1, 1, 10, 100], fx: (v) => fmt(v, 2), fy: (v) => fmt(v, 2) });
    ctx.save(); B.clip();
    line(ctx, [[B.X(1), B.Y(1 / sN.value)], [B.X(10000), B.Y(100 / sN.value)]], col.muted, 1.5, [4, 4]);
    line(ctx, hist.map(([k, s]) => [B.X(k), B.Y(Math.max(0.1, s))]), col.s[1], 2.5);
    ctx.restore();
    text(ctx, 'SNR ∝ √N (dashed)', w - 10, split + 22, { color: col.muted, size: 10, align: 'right' });
  };
  reset();
}
