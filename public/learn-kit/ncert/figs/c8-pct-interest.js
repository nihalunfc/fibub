// Class 8 Fractions in Disguise: simple and compound interest. Simple interest adds P x r% every year on the original sum;
// compound interest adds r% on the sum that has grown, so A = P(1 + r/100)^n. Bars show the amount at the end of each year.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let P = 10000, r = 10, yrs = 5;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Year by year bars comparing simple and compound interest amounts' });
  const ctl = row(host);
  slider(ctl, { label: 'Money (₹)', min: 1000, max: 50000, step: 1000, value: P, fmt: (v) => '₹' + Math.round(v), oninput: (v) => { P = Math.round(v); upd(); } });
  slider(ctl, { label: 'Rate % a year', min: 2, max: 20, step: 1, value: r, fmt: (v) => Math.round(v) + '%', oninput: (v) => { r = Math.round(v); upd(); } });
  slider(ctl, { label: 'Years', min: 1, max: 10, step: 1, value: yrs, fmt: (v) => String(Math.round(v)), oninput: (v) => { yrs = Math.round(v); upd(); } });
  const out = readout(host);
  const si = (n) => P * (1 + r * n / 100), ci = (n) => P * Math.pow(1 + r / 100, n);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Simple (blue) vs compound (green)', col), L = 12, B = h - 34, T = t + 14, mx = ci(yrs) * 1.05, gw = (w - 2 * L) / yrs, bw = Math.min(22, gw * 0.4);
    for (let n = 1; n <= yrs; n++) {
      const x = L + (n - 1) * gw + gw / 2, h1 = (B - T) * si(n) / mx, h2 = (B - T) * ci(n) / mx;
      ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = col.s[0]; ctx.fillRect(x - bw - 1, B - h1, bw, h1); ctx.fillStyle = col.s[2]; ctx.fillRect(x + 1, B - h2, bw, h2); ctx.restore();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x - bw - 1, B - h1, bw, h1); ctx.strokeRect(x + 1, B - h2, bw, h2);
      text(ctx, String(n), x, B + 12, { color: col.muted, size: 11, align: 'center' });
    }
    text(ctx, 'year', w - 14, B + 26, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'After ' + yrs + ' years: ₹' + Math.round(si(yrs)) + ' vs ₹' + Math.round(ci(yrs)), w / 2, h - 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  function upd() { out.innerHTML = `Simple interest: ₹${P} × ${r} × ${yrs} ÷ 100 = ₹${Math.round(P * r * yrs / 100)}, amount <b>₹${Math.round(si(yrs))}</b>. Compound: A = ${P} × (1 + ${r}/100)<sup>${yrs}</sup> = <b>₹${Math.round(ci(yrs))}</b>. Compound earns ₹${Math.round(ci(yrs) - si(yrs))} more.`; cv.redraw(); }
  upd();
}
