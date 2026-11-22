// 12.3 Why lensing measures S8 and not σ8. Top: the Ωm-σ8 plane. Lensing pins a curved band, σ8 ∝ Ωm^(−1/2)
// (the "banana"); the CMB pins a small spot. Bands drawn: S8 = 0.776 ± 0.017 (DES Y3 3×2pt, 2022) and 0.815
// (+0.016/−0.021, KiDS-Legacy 2025); the spot is Planck 2018 (Ωm = 0.315 ± 0.007, σ8 = 0.811 ± 0.006).
// Bottom: a made-up patch of matter (a smooth random field, fixed seed) whose contrast follows the chosen σ8,
// to show what "smoother" means. Illustrative only: real fields are not this simple.
import { canvas, axes, text, title, line, dot, row, slider, readout, rng } from '../../kit.js';

const NX = 72, NY = 30;

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 400, min: 300, label: 'The matter density and clumpiness plane, with the lensing band and the CMB point' });
  const cm = canvas(host, { aspect: 0.32, max: 200, min: 120, label: 'A made-up patch of matter whose contrast follows the chosen sigma 8', mark: '' });
  let Om = 0.315, s8 = 0.811;
  const ctl = row(host);
  slider(ctl, { label: 'Ωₘ (matter)', min: 0.2, max: 0.45, step: 0.005, value: Om, fmt: (v) => v.toFixed(3), oninput: (v) => { Om = v; upd(); } });
  slider(ctl, { label: 'σ₈ (clumpiness)', min: 0.65, max: 0.95, step: 0.005, value: s8, fmt: (v) => v.toFixed(3), oninput: (v) => { s8 = v; upd(); } });
  const out = readout(host);
  // a smooth random field from a few dozen waves, normalised to unit spread
  const r = rng(812), waves = [];
  for (let i = 0; i < 46; i++) { const k = 0.15 + 0.5 * r(), a = r() * Math.PI * 2; waves.push([k * Math.cos(a), k * Math.sin(a), r() * Math.PI * 2, 1 / (0.4 + k)]); }
  const F = new Float32Array(NX * NY);
  let s2 = 0;
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { let v = 0; for (const [kx, ky, p, amp] of waves) v += amp * Math.cos(kx * i + ky * j + p); F[j * NX + i] = v; s2 += v * v; }
  const sd = Math.sqrt(s2 / F.length); for (let i = 0; i < F.length; i++) F[i] /= sd;
  const band = (ctx, A, S, lo, hi, c) => {
    const xs = []; for (let x = 0.2; x <= 0.4501; x += 0.005) xs.push(x);
    ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = c; ctx.beginPath();
    xs.forEach((x, i) => { const yv = (S + hi) / Math.sqrt(x / 0.3); i ? ctx.lineTo(A.X(x), A.Y(yv)) : ctx.moveTo(A.X(x), A.Y(yv)); });
    [...xs].reverse().forEach((x) => ctx.lineTo(A.X(x), A.Y((S - lo) / Math.sqrt(x / 0.3))));
    ctx.closePath(); ctx.fill(); ctx.restore();
    line(ctx, xs.map((x) => [A.X(x), A.Y(S / Math.sqrt(x / 0.3))]), c, 1.5);
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Lensing pins a band, the CMB a spot', col) + 4;
    const A = axes(ctx, w, h, col, { x: [0.2, 0.45], y: [0.65, 0.95], t: top + 8, l: 46, xlabel: 'Ωₘ (matter density)', ylabel: 'σ₈', xt: [0.2, 0.25, 0.3, 0.35, 0.4, 0.45], yt: [0.7, 0.8, 0.9], fx: (v) => v.toFixed(2), fy: (v) => v.toFixed(1) });
    ctx.save(); A.clip();
    band(ctx, A, 0.776, 0.017, 0.017, col.s[1]);
    band(ctx, A, 0.815, 0.021, 0.016, col.s[2]);
    line(ctx, [[A.X(0.315 - 0.007), A.Y(0.811)], [A.X(0.315 + 0.007), A.Y(0.811)]], col.s[0], 2.5);
    line(ctx, [[A.X(0.315), A.Y(0.805)], [A.X(0.315), A.Y(0.817)]], col.s[0], 2.5);
    dot(ctx, A.X(0.315), A.Y(0.811), 5, col.s[0], col.panel);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(A.X(Om), A.Y(s8), 8, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    text(ctx, 'DES Y3 lensing', A.X(0.34), A.Y(0.776 / Math.sqrt(0.34 / 0.3)) + 20, { color: col.s[1], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'KiDS-Legacy', A.X(0.23), A.Y(0.815 / Math.sqrt(0.23 / 0.3)) - 16, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'Planck', A.X(0.315) + 10, A.Y(0.811) - 12, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
  };
  cm.draw = (ctx, w, h, col) => {
    const cw = w / NX, ch = h / NY, gain = 1.1 * s8;
    ctx.fillStyle = col.ink;
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const d = gain * F[j * NX + i];
      ctx.globalAlpha = Math.max(0.02, Math.min(0.95, 0.35 + 0.32 * d));
      ctx.fillRect(i * cw, j * ch, cw + 0.6, ch + 0.6);
    }
    ctx.globalAlpha = 1;
    text(ctx, `matter with σ₈ = ${s8.toFixed(2)} (illustrative)`, 8, 12, { color: col.ink, size: 11, weight: 700, halo: col.panel });
  };
  const upd = () => {
    const S = s8 * Math.sqrt(Om / 0.3);
    out.innerHTML = `Your point: S₈ = ${s8.toFixed(3)} × √(${Om.toFixed(3)}/0.3) = <b>${S.toFixed(3)}</b>. ${Math.abs(S - 0.832) <= 0.013 ? 'Inside the Planck prediction (0.832 ± 0.013).' : S < 0.832 ? `${(100 * (1 - S / 0.832)).toFixed(1)}% smoother than Planck predicts.` : `${(100 * (S / 0.832 - 1)).toFixed(1)}% lumpier than Planck predicts.`} Slide along a band and lensing cannot tell the difference: more matter that is less clumpy bends light just like less matter that is more clumpy.`;
    cv.redraw(); cm.redraw();
  };
  upd();
}
