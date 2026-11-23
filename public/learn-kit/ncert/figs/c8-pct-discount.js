// Class 8 Fractions in Disguise: marked price, discount and tax. Discount is a percent of the marked price (MRP); tax (GST) is a
// percent of the price after discount. Price paid = MRP x (1 - d/100) x (1 + g/100).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let mrp = 2000, d = 20, g = 12;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Bars showing the marked price, the price after discount and the price after tax' });
  const ctl = row(host);
  slider(ctl, { label: 'Marked price (₹)', min: 200, max: 5000, step: 100, value: mrp, fmt: (v) => '₹' + Math.round(v), oninput: (v) => { mrp = Math.round(v); upd(); } });
  slider(ctl, { label: 'Discount %', min: 0, max: 70, step: 5, value: d, fmt: (v) => Math.round(v) + '%', oninput: (v) => { d = Math.round(v); upd(); } });
  slider(ctl, { label: 'GST %', min: 0, max: 28, step: 1, value: g, fmt: (v) => Math.round(v) + '%', oninput: (v) => { g = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const a = mrp * (1 - d / 100), f = a * (1 + g / 100), t = title(ctx, 'You pay ₹' + +f.toFixed(2), col), x0 = 16, bw = w - 32, mx = Math.max(mrp, f) * 1.02;
    [['Marked price ₹' + mrp, mrp, col.s[0], t + 20], ['After ' + d + '% discount ₹' + +a.toFixed(2), a, col.s[2], t + 66], ['After ' + g + '% GST ₹' + +f.toFixed(2), f, col.s[3], t + 112]].forEach(([lab, v, cl, y]) => {
      ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = cl; ctx.fillRect(x0, y, bw * v / mx, 34); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.strokeRect(x0, y, bw * v / mx, 34); text(ctx, lab, x0 + 6, y + 17, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    });
    text(ctx, 'Discount is taken first, then tax on the smaller price.', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
  };
  function upd() { const a = mrp * (1 - d / 100); out.innerHTML = `Discount = ${d}% of ₹${mrp} = ₹${+(mrp * d / 100).toFixed(2)}, so the price is ₹${+a.toFixed(2)}. GST = ${g}% of ₹${+a.toFixed(2)} = ₹${+(a * g / 100).toFixed(2)}. Total <b>₹${+(a * (1 + g / 100)).toFixed(2)}</b>.`; cv.redraw(); }
  upd();
}
