// Class 8 Fractions in Disguise: profit and loss percent. Profit = SP - CP when SP > CP, loss = CP - SP otherwise, and the percent is
// always taken on the cost price: profit % = (SP - CP) / CP x 100.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let cp = 400, sp = 460;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Bars for cost price and selling price showing profit or loss percent' });
  const ctl = row(host);
  slider(ctl, { label: 'Cost price (₹)', min: 100, max: 1000, step: 20, value: cp, fmt: (v) => '₹' + Math.round(v), oninput: (v) => { cp = Math.round(v); upd(); } });
  slider(ctl, { label: 'Selling price (₹)', min: 100, max: 1200, step: 20, value: sp, fmt: (v) => '₹' + Math.round(v), oninput: (v) => { sp = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const p = sp - cp, pc = p / cp * 100, t = title(ctx, p >= 0 ? (p === 0 ? 'No profit, no loss' : 'Profit ₹' + p + ' = ' + +pc.toFixed(1) + '% of CP') : 'Loss ₹' + -p + ' = ' + +(-pc).toFixed(1) + '% of CP', col), x0 = 16, bw = w - 32, mx = 1200, y1 = t + 24, y2 = t + 78;
    const bar = (y, v, cl, lab) => { ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = cl; ctx.fillRect(x0, y, bw * v / mx, 34); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.strokeRect(x0, y, bw * v / mx, 34); text(ctx, lab, x0 + 6, y + 17, { color: col.ink, size: 12, weight: 700, halo: col.panel }); };
    bar(y1, cp, col.s[0], 'Cost price ₹' + cp);
    bar(y2, sp, p >= 0 ? col.s[2] : col.s[3], 'Selling price ₹' + sp);
    if (p !== 0) { const a = Math.min(cp, sp), b = Math.max(cp, sp); ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = p > 0 ? col.s[2] : col.s[3]; ctx.fillRect(x0 + bw * a / mx, y2 + 36, bw * (b - a) / mx, 8); ctx.restore(); text(ctx, (p > 0 ? 'profit ' : 'loss ') + '₹' + Math.abs(p), x0 + bw * a / mx, y2 + 58, { color: col.ink, size: 12, weight: 700 }); }
  };
  function upd() { const p = sp - cp; out.innerHTML = p === 0 ? 'SP = CP: neither profit nor loss.' : `${p > 0 ? 'Profit' : 'Loss'} = ₹${Math.abs(p)}. ${p > 0 ? 'Profit' : 'Loss'} % = ${Math.abs(p)} ÷ ${cp} × 100 = <b>${+(Math.abs(p) / cp * 100).toFixed(2)}%</b>. The percent is on the cost price, not the selling price.`; cv.redraw(); }
  upd();
}
