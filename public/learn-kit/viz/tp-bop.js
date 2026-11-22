// Balance of payments: current account (goods, services, transfers) plus capital account (investment, loans) must
// balance with the change in foreign exchange reserves. Slide the flows; the bars show each part and the reserves change.
// A deficit on the current account must be paid for by inflows on the capital account or by drawing reserves down.
// Figures are made up (billion dollars).
import { canvas, row, slider, readout, text, title } from '../kit.js';

export default function (host) {
  let ex = 300, im = 400, sv = 80, tr = 40, fdi = 50, pf = 20;
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 320, label: 'Balance of payments flows' });
  const c = row(host);
  const S = (label, min, max, v, set) => slider(c, { label, min, max, step: 5, value: v, fmt: (x) => '$' + x + 'b', oninput: (x) => { set(x); cv.redraw(); show(); } });
  S('Merchandise exports', 100, 500, ex, (v) => { ex = v; }); S('Merchandise imports', 100, 500, im, (v) => { im = v; });
  S('Net services (+ earned)', -50, 200, sv, (v) => { sv = v; }); S('Remittances and transfers', 0, 100, tr, (v) => { tr = v; });
  S('Foreign direct investment in', -50, 150, fdi, (v) => { fdi = v; }); S('Portfolio and loan flows', -100, 150, pf, (v) => { pf = v; });
  const out = readout(host);
  const k = () => { const trade = ex - im, ca = trade + sv + tr, ka = fdi + pf, res = ca + ka; return { trade, ca, ka, res }; };
  const g = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + '$' + Math.abs(v) + 'b';
  const show = () => { const x = k(); out.innerHTML = `Trade balance ${g(x.trade)}. Current account ${g(x.ca)}. Capital account ${g(x.ka)}. Overall balance ${g(x.res)}: ${x.res > 0 ? 'reserves rise by this much (a surplus)' : x.res < 0 ? 'reserves must fall by this much to pay the gap (a deficit)' : 'balanced'}. (Errors and omissions are ignored here.)`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Balance of payments, bar by bar', col);
    const x = k(), items = [['Trade', x.trade, 0], ['Services', sv, 1], ['Transfers', tr, 2], ['Current a/c', x.ca, 5], ['FDI', fdi, 3], ['Portfolio', pf, 4], ['Capital a/c', x.ka, 6], ['Overall', x.res, 7]];
    const hi = Math.max(20, ...items.map((i) => i[1])) * 1.12, lo = Math.min(0, ...items.map((i) => i[1])) * 1.12, sc = (h - 100) / (hi - lo), mid = 50 + hi * sc, bw = (w - 20) / items.length;
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(8, mid); ctx.lineTo(w - 8, mid); ctx.stroke();
    items.forEach(([n, v, ci], i) => { const xx = 10 + i * bw, hh = v * sc; ctx.fillStyle = v >= 0 ? col.good : col.bad; ctx.globalAlpha = ci >= 5 ? 0.9 : 0.55; ctx.fillRect(xx + 4, v >= 0 ? mid - hh : mid, bw - 8, Math.abs(hh)); ctx.globalAlpha = 1;
      text(ctx, n, xx + bw / 2, h - 30 + (i % 2) * 12, { color: ci >= 5 ? col.ink : col.muted, size: 10, weight: ci >= 5 ? 700 : 400, align: 'center' });
      text(ctx, String(v), xx + bw / 2, v >= 0 ? mid - hh - 8 : mid - hh + 10 + 0 * 1, { color: col.ink, size: 10, align: 'center' }); });
  };
  show();
}
