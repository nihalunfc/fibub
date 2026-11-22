// Pricing and demand: how many people buy at each price, and what that does to revenue and profit. Elasticity says how
// fast buyers walk away when the price rises (above 1 they are price-sensitive). Move the price slider along the curve and
// see where profit peaks. Made-up demand: 1,000 buyers at $10, following q = 1000 × (p ÷ 10)^(-elasticity).
import { canvas, axes, line, dot, text, title, row, slider, readout, choice } from '../kit.js';
import { money } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.74, max: 410, label: 'Demand, revenue or profit as the price changes' });
  let view = 'profit';
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Show', [['demand', 'Buyers'], ['revenue', 'Revenue'], ['profit', 'Profit']], view, (v) => { view = v; cv.redraw(); });
  const S = {
    p: slider(ctl2, { label: 'Your price', min: 4, max: 40, step: 0.5, value: 12, fmt: (v) => '$' + v.toFixed(2), oninput: () => cv.redraw() }),
    e: slider(ctl2, { label: 'Price sensitivity', min: 0.4, max: 3.5, step: 0.05, value: 1.8, fmt: (v) => v.toFixed(2), oninput: () => cv.redraw() }),
    c: slider(ctl2, { label: 'Cost per unit', min: 0, max: 10, step: 0.5, value: 5, fmt: (v) => '$' + v.toFixed(2), oninput: () => cv.redraw() }),
  };
  const out = readout(host);
  const Q = (p, e) => 1000 * Math.pow(p / 10, -e);
  cv.draw = (ctx, w, h, col) => {
    const e = S.e.value, c = S.c.value, p = S.p.value;
    const f = { demand: (x) => Q(x, e), revenue: (x) => x * Q(x, e), profit: (x) => (x - c) * Q(x, e) }[view];
    const xs = Array.from({ length: 73 }, (_, i) => 4 + i * 0.5), ys = xs.map(f), hi = Math.max(...ys) * 1.08, lo = view === 'profit' ? Math.min(0, ...ys) : 0;
    const lab = { demand: 'Buyers a month', revenue: 'Revenue', profit: 'Profit' }[view];
    title(ctx, `${lab} at each price`, col);
    const a = axes(ctx, w, h, col, { t: 34, x: [4, 40], y: [lo, hi], xlabel: 'Price', ylabel: lab, fx: (v) => '$' + v, fy: (v) => (Math.abs(v) >= 1000 ? Math.round(v / 100) / 10 + 'k' : Math.round(v)), xt: [4, 10, 20, 30, 40] });
    ctx.save(); a.clip(); line(ctx, xs.map((x, i) => [a.X(x), a.Y(ys[i])]), col.s[0], 3); ctx.restore();
    if (view === 'profit') {
      const best = xs.reduce((b, x) => (f(x) > f(b) ? x : b), xs[0]);
      dot(ctx, a.X(best), a.Y(f(best)), 5, col.good, col.panel); text(ctx, `best ≈ $${best}`, a.X(best), a.Y(f(best)) - 12, { color: col.good, size: 11, weight: 700, align: 'center', halo: col.panel });
    }
    dot(ctx, a.X(p), a.Y(Math.min(hi, f(p))), 6, col.s[1], col.panel);
    line(ctx, [[a.X(p), a.B], [a.X(p), a.Y(Math.min(hi, f(p)))]], col.s[1], 1.2, [3, 3]);
    const q = Q(p, e);
    out.innerHTML = `At <b>${money(p, 2)}</b> about <b>${Math.round(q)}</b> people buy. Revenue <b>${money(p * q)}</b>, profit <b style="color:${(p - c) * q >= 0 ? col.good : col.bad}">${money((p - c) * q)}</b>. ` + (e < 1 ? 'Sensitivity is below 1: raising the price <b>raises revenue</b>, because buyers hardly react.' : e > 1 && c > 0 ? `Above 1 revenue falls as price rises; the best profit price is cost × e ÷ (e − 1) = <b>${money((c * e) / (e - 1), 2)}</b>.` : 'Above 1 buyers react strongly: raising the price loses revenue.');
  };
  cv.redraw();
}
