// Ratio analysis on a tiny balance sheet (made-up numbers): change current assets, stock, current liabilities, debt and
// equity and watch the gauges for current ratio, quick ratio and debt-equity move through their "comfortable" zones.
// The ideal zones are rules of thumb (2:1 and 1:1 for liquidity; debt-equity of 2:1 or less), not laws.
import { canvas, row, slider, readout, text, title } from '../kit.js';

const f = (v) => (Math.round(v * 100) / 100).toString();
export default function (host) {
  let ca = 300, stock = 100, cl = 150, debt = 200, eq = 400;
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 320, label: 'Gauges for current ratio, quick ratio and debt-equity ratio' });
  const c = row(host);
  const S = (label, min, max, key, set) => slider(c, { label, min, max, step: 10, value: key, fmt: (v) => '₹' + v + ' lakh', oninput: (v) => { set(v); cv.redraw(); show(); } });
  S('Current assets', 100, 600, ca, (v) => { ca = v; stock = Math.min(stock, v); });
  S('of which stock', 0, 400, stock, (v) => { stock = Math.min(v, ca); });
  S('Current liabilities', 50, 400, cl, (v) => { cl = v; });
  S('Long-term debt', 0, 800, debt, (v) => { debt = v; });
  S('Shareholders\' funds', 100, 800, eq, (v) => { eq = v; });
  const out = readout(host);
  const vals = () => [ca / cl, (ca - stock) / cl, debt / eq];
  const show = () => { const [a, b, d] = vals(); out.innerHTML = `Current ratio = ${ca} ÷ ${cl} = <b>${f(a)}</b>. Quick ratio = (${ca} − ${stock}) ÷ ${cl} = <b>${f(b)}</b>. Debt-equity = ${debt} ÷ ${eq} = <b>${f(d)}</b>. Quick assets leave out stock because stock may take time to sell.`; };
  const G = [['Current ratio', 0, 4, 2, 1.2], ['Quick ratio', 0, 3, 1, 0.7], ['Debt-equity', 0, 3, 2, null]];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Three ratios, three gauges', col);
    const vs = vals(), gh = (h - 40) / 3;
    G.forEach(([name, lo, hi, good, warn], i) => {
      const y = 44 + i * gh, L = 14, W = w - 28, X = (v) => L + Math.min(1, Math.max(0, (v - lo) / (hi - lo))) * W;
      text(ctx, name, L, y, { color: col.ink, size: 12, weight: 700 });
      const zones = i < 2 ? [[lo, warn, col.bad], [warn, good, col.warn], [good, hi, col.good]] : [[lo, 1, col.good], [1, good, col.warn], [good, hi, col.bad]];
      zones.forEach(([a, b, k]) => { ctx.fillStyle = k; ctx.globalAlpha = 0.45; ctx.fillRect(X(a), y + 12, X(b) - X(a), 18); ctx.globalAlpha = 1; });
      ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(vs[i]), y + 8); ctx.lineTo(X(vs[i]), y + 34); ctx.stroke(); ctx.lineWidth = 1;
      text(ctx, '= ' + f(vs[i]), L + W, y, { color: col.ink, size: 12.5, weight: 700, align: 'right' });
      text(ctx, i < 2 ? `ideal ${good}:1 or more` : 'ideal 2:1 or less', L, y + 46, { color: col.muted, size: 10 });
    });
  };
  show();
}
