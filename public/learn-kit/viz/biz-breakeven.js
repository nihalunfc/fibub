// Break-even chart: drag price, cost per unit and monthly fixed costs; revenue and total cost lines cross at the
// break-even units. Add "units you expect to sell" to see profit, loss and the margin of safety. Try raising the price.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../kit.js';
import { money } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 420, label: 'Break-even chart: revenue and total cost against units sold' });
  const ctl = row(host);
  const S = {
    price: slider(ctl, { label: 'Price per unit', min: 5, max: 60, step: 1, value: 25, fmt: (v) => '$' + v, oninput: draw }),
    vc: slider(ctl, { label: 'Cost to make one', min: 0, max: 50, step: 1, value: 10, fmt: (v) => '$' + v, oninput: draw }),
    fc: slider(ctl, { label: 'Fixed costs a month', min: 500, max: 8000, step: 100, value: 3000, fmt: (v) => money(v), oninput: draw }),
    q: slider(ctl, { label: 'Units you expect', min: 0, max: 600, step: 10, value: 300, oninput: draw }),
  };
  const out = readout(host);
  function draw() { cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const p = S.price.value, v = S.vc.value, F = S.fc.value, q = S.q.value, XM = 600;
    const cm = p - v, be = cm > 0 ? F / cm : Infinity;
    const yMax = Math.max(p * XM, F + v * XM) * 1.02;
    title(ctx, 'Revenue and cost as you sell more', col);
    const a = axes(ctx, w, h, col, { t: 34, x: [0, XM], y: [0, yMax], xlabel: 'Units sold in a month', ylabel: 'Dollars', fy: (t) => (t >= 1000 ? t / 1000 + 'k' : t), });
    ctx.save(); a.clip();
    if (be < XM) { // loss and profit areas
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = col.bad; ctx.beginPath(); ctx.moveTo(a.X(0), a.Y(0)); ctx.lineTo(a.X(0), a.Y(F)); ctx.lineTo(a.X(be), a.Y(p * be)); ctx.lineTo(a.X(0), a.Y(0)); ctx.fill();
      ctx.fillStyle = col.good; ctx.beginPath(); ctx.moveTo(a.X(be), a.Y(p * be)); ctx.lineTo(a.X(XM), a.Y(p * XM)); ctx.lineTo(a.X(XM), a.Y(F + v * XM)); ctx.fill();
      ctx.globalAlpha = 1;
    }
    line(ctx, [[a.X(0), a.Y(F)], [a.X(XM), a.Y(F)]], col.muted, 1.5, [5, 4]);
    line(ctx, [[a.X(0), a.Y(F)], [a.X(XM), a.Y(F + v * XM)]], col.s[1], 2.5);
    line(ctx, [[a.X(0), a.Y(0)], [a.X(XM), a.Y(p * XM)]], col.s[0], 2.5);
    ctx.restore();
    text(ctx, 'Revenue', a.X(XM * 0.78), a.Y(p * XM * 0.78) + 14, { color: col.s[0], size: 11, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'Total cost', a.X(XM * 0.78), a.Y(F + v * XM * 0.78) - 12, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'Fixed costs', a.L + 6, a.Y(F) + 11, { color: col.muted, size: 10 });
    if (be < XM) { dot(ctx, a.X(be), a.Y(p * be), 6, col.ink, col.panel); text(ctx, `Break-even ${Math.ceil(be)} units`, a.X(be), a.Y(p * be) + (a.Y(p * be) < a.T + 40 ? 18 : -14), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); }
    const x = a.X(q); line(ctx, [[x, a.T], [x, a.B]], col.s[2], 1.5, [3, 3]);
    text(ctx, 'you', x, a.T + 8, { color: col.s[2], size: 10, weight: 700, align: 'center' });
    const prof = q * p - (F + v * q);
    out.innerHTML = cm <= 0 ? `<b>Price is not above the cost to make one,</b> so every sale loses money: there is no break-even. Raise the price or cut the cost.`
      : `<b>Each sale leaves ${money(cm)} toward fixed costs.</b> Break-even = ${money(F)} ÷ ${money(cm)} = <b>${Math.ceil(be)} units</b> (${money(Math.ceil(be) * p)} of sales). At ${q} units you make a <b style="color:${prof >= 0 ? col.good : col.bad}">${prof >= 0 ? 'profit' : 'loss'} of ${money(Math.abs(prof))}</b>${q > be && be > 0 ? `; you could lose ${Math.round((1 - be / q) * 100)}% of sales before hitting break-even (margin of safety)` : ''}.`;
  };
  draw();
}
