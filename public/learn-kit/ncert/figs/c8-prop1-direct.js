// Class 8 Proportional Reasoning 1: direct proportion. If cost rises in step with quantity, cost / quantity stays the same (the unit
// rate) and the graph of cost against quantity is a straight line through the origin. Choose the rate and a quantity.
import { canvas, text, title, row, slider, readout, axes, line, dot } from '../../kit.js';

export default function (host) {
  let rate = 12, q = 5;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'A straight line graph of cost against quantity through the origin' });
  const ctl = row(host);
  slider(ctl, { label: 'Price of 1 kg (₹)', min: 5, max: 40, step: 1, value: rate, fmt: (v) => '₹' + Math.round(v), oninput: (v) => { rate = Math.round(v); upd(); } });
  slider(ctl, { label: 'Kilograms', min: 1, max: 10, step: 1, value: q, fmt: (v) => String(Math.round(v)), oninput: (v) => { q = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Cost = ₹' + rate + ' × kg', col), L = 48, B = h - 40, T = t + 14, R = w - 16, X = (v) => L + (R - L) * v / 10, Y = (v) => B - (B - T) * v / 400;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    for (let i = 0; i <= 10; i += 2) text(ctx, String(i), X(i), B + 12, { color: col.muted, size: 10, align: 'center' });
    for (let i = 0; i <= 400; i += 100) { text(ctx, '₹' + i, L - 6, Y(i), { color: col.muted, size: 10, align: 'right' }); ctx.strokeStyle = col.line; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(L, Y(i)); ctx.lineTo(R, Y(i)); ctx.stroke(); }
    line(ctx, [[X(0), Y(0)], [X(10), Y(10 * rate)]], col.s[0], 2.5);
    for (let i = 1; i <= 10; i++) dot(ctx, X(i), Y(i * rate), 3, col.s[0]);
    ctx.setLineDash([4, 4]); line(ctx, [[X(q), B], [X(q), Y(q * rate)], [L, Y(q * rate)]], col.s[3], 1.5, [4, 4]);
    dot(ctx, X(q), Y(q * rate), 6, col.s[3]); text(ctx, q + ' kg → ₹' + q * rate, Math.min(X(q) + 8, w - 84), Math.max(Y(q * rate) - 12, T + 8), { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, 'kg', R, B + 26, { color: col.muted, size: 11, align: 'right' });
  };
  function upd() { out.innerHTML = `${q} kg cost ₹${q * rate}. Cost ÷ kg = ${q * rate} ÷ ${q} = <b>${rate}</b> for every point on the line. Double the kilograms and the cost doubles.`; cv.redraw(); }
  upd();
}
