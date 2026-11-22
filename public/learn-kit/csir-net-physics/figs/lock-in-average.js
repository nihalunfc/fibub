// 7.4 A lock-in amplifier digging a signal out of noise, in time. The input is V_s cos(ωt + φ) buried in white
// noise (top trace). It is multiplied by the reference cos ωt; the product (middle) wobbles wildly, but its average
// is (V_s/2) cos φ. An RC low-pass filter with time constant τ (bottom) settles towards that value; its leftover
// fluctuation shrinks as 1/√τ. Change the noise, the phase and τ and watch the output settle. Units are arbitrary;
// time is counted in reference periods.
import { canvas, line, row, slider, readout, title, text, fmt, loop, rng, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 480, min: 320, label: 'Noisy input, mixed signal and lock-in output settling over time' });
  let noise = 3, phase = 30, tau = 20;
  const STEPS = 16, T = 160;          // samples per reference period, periods shown
  const NS = STEPS * T;
  const inp = new Float64Array(NS), mix = new Float64Array(NS), outp = new Float64Array(NS);
  let n = 0;
  const r = rng(5);
  const gauss = () => { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const reset = () => { n = 0; };
  const step = () => {
    if (n >= NS) return;
    const t = n / STEPS, w = 2 * Math.PI * t;
    const s = Math.cos(w + phase * Math.PI / 180) + noise * gauss();
    inp[n] = s; mix[n] = s * Math.cos(w);
    const k = 1 / (tau * STEPS);
    outp[n] = n ? outp[n - 1] + k * (mix[n] - outp[n - 1]) : k * mix[0];
    n++;
  };
  const ctl = row(host);
  slider(ctl, { label: 'Noise / signal (rms/peak)', min: 0, max: 10, step: 0.1, value: noise, fmt: (v) => v.toFixed(1), oninput: (v) => { noise = v; reset(); } });
  slider(ctl, { label: 'Phase φ (°)', min: 0, max: 180, step: 1, value: phase, fmt: (v) => `${v}°`, oninput: (v) => { phase = v; reset(); } });
  slider(ctl, { label: 'Time constant τ (periods)', min: 2, max: 60, step: 1, value: tau, fmt: (v) => `${v}`, oninput: (v) => { tau = v; reset(); } });
  const out = readout(host);
  const anim = loop(host, () => { for (let i = 0; i < 24; i++) step(); if (n >= NS) reset(); cv.redraw(); show(); });
  anim.button(ctl);
  if (calm()) { for (let i = 0; i < NS; i++) step(); }
  const show = () => {
    const target = 0.5 * Math.cos(phase * Math.PI / 180), cur = n ? outp[n - 1] : 0;
    const sd = noise / (2 * Math.sqrt(tau * STEPS));   // EMA of white samples of variance noise²/2: var × k/2
    out.innerHTML = `Expected output (V_s/2) cos φ = <b>${fmt(target, 3)}</b>; filter now at <b>${fmt(cur, 3)}</b> after ${fmt(n / STEPS, 3)} periods. Leftover noise on the output ≈ ${fmt(sd, 2)} (shrinks as 1/√τ). At φ = 90° the in-phase output is zero: a second, quadrature channel would catch it.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Multiply by the reference, then average', col);
    const panels = [['input: signal + noise', inp, 1 + 3 * Math.max(noise, 0.3)], ['input × reference', mix, 1 + 3 * Math.max(noise, 0.3)], ['low-pass output', outp, 1]];
    const L = 12, R = w - 12, H = (h - top - 16) / 3;
    panels.forEach(([lab, arr, sc], k) => {
      const y0 = top + 10 + k * H, mid = y0 + H / 2, amp = (H / 2 - 6) / sc;
      line(ctx, [[L, mid], [R, mid]], col.line, 1);
      if (k === 2) { const tg = 0.5 * Math.cos(phase * Math.PI / 180); line(ctx, [[L, mid - tg * amp], [R, mid - tg * amp]], col.s[3], 1.3, [4, 3]); }
      const pts = [], stride = k === 2 ? 4 : 1;
      for (let i = 0; i < n; i += stride) pts.push([L + (R - L) * i / NS, mid - Math.max(-sc, Math.min(sc, arr[i])) * amp]);
      line(ctx, pts, col.s[k === 2 ? 0 : k === 1 ? 2 : 1], k === 2 ? 2.2 : 0.8);
      text(ctx, lab, L + 2, y0 + 8, { color: col.muted, size: 11, halo: col.panel });
    });
    text(ctx, 'dashed: (V_s/2) cos φ', R, top + 10 + 2 * H + 8, { color: col.s[3], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'time →', R, h - 6, { color: col.muted, size: 10, align: 'right' });
  };
  cv.redraw(); show();
}
