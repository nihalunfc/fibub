// Class 12 Chemistry, Amines: ammonolysis of an alkyl halide gives a MIXTURE of 1 deg, 2 deg, 3 deg amines and the quaternary salt, because each product is itself a nucleophile and keeps reacting.
// This sketch uses a simple model: R-X reacts with NH3, RNH2, R2NH, R3N with relative rate constants 1 : 3 : 2 : 0.5 (ILLUSTRATIVE values, chosen to show the trend, not measured).
// The slider sets how many moles of NH3 are used per mole of RX. A large excess of NH3 favours the primary amine, because NH3 then wins the competition for RX.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const K = [1, 3, 2, 0.5];
function run(ratio) {
  let x = [ratio, 0, 0, 0, 0], rx = 1; const dt = 0.002;
  for (let i = 0; i < 300000 && rx > 1e-5; i++) { const r = K.map((k, j) => k * x[j] * rx * dt); const tot = r.reduce((a, b) => a + b, 0); const sc = tot > rx ? rx / tot : 1; r.forEach((v, j) => { v *= sc; x[j] -= v; x[j + 1] += v; }); rx -= Math.min(tot, rx); }
  return x;
}
export default function (host) {
  let ratio = 1;
  const cv = canvas(host, { aspect: 0.85, max: 360, min: 300, label: 'Distribution of primary, secondary, tertiary amines and quaternary salt formed from an alkyl halide and ammonia' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'moles of NH₃ per mole of RX', min: 1, max: 50, value: ratio, log: true, fmt: (v) => v.toFixed(1), oninput: (v) => { ratio = v; go(); } });
  const go = () => { const x = run(ratio), a = x.slice(1).reduce((p, q) => p + q, 0); ro.textContent = `NH₃ : RX = ${ratio.toFixed(1)} : 1. Of the amines formed, ${(100 * x[1] / a).toFixed(0)} % are primary, ${(100 * x[2] / a).toFixed(0)} % secondary, ${(100 * x[3] / a).toFixed(0)} % tertiary and ${(100 * x[4] / a).toFixed(0)} % quaternary salt. A big excess of ammonia gives mainly the primary amine.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const x = run(ratio), a = x.slice(1).reduce((p, q) => p + q, 0), top = title(ctx, 'Products of R–X + NH₃ (share of alkylated N)', col), L = 24, R = w - 16, B = h - 62, T = top + 22, bw = (R - L) / 4;
    ['1° RNH₂', '2° R₂NH', '3° R₃N', '4° R₄N⁺X⁻'].forEach((nm, i) => { const f = x[i + 1] / a, bh = (B - T) * f, xx = L + bw * i + bw * 0.14; ctx.fillStyle = col.s[[0, 1, 2, 3][i]]; ctx.fillRect(xx, B - bh, bw * 0.72, bh); text(ctx, (100 * f).toFixed(0) + '%', xx + bw * 0.36, B - bh - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, nm, xx + bw * 0.36, B + 12, { color: col.ink, size: 10.5, align: 'center' }); });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    text(ctx, ratio >= 10 ? 'excess NH₃: NH₃ outcompetes the amines for RX' : ratio < 2 ? 'little NH₃: products keep reacting' : 'in between: a mixture', w / 2, h - 26, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'model rates 1 : 3 : 2 : 0.5 (illustrative)', w / 2, h - 9, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
