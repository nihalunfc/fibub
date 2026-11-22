// Supply and demand with moving curves. Three markets: goods (price in rupees), foreign exchange (rupees per dollar) and
// money (interest rate). Slide demand and supply left or right and watch equilibrium move; "Fix the price" adds a price
// ceiling or floor and shows the shortage or surplus. Numbers are illustrative.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title } from '../kit.js';

const M = {
  goods: { name: 'A market for goods', x: 'Quantity (units)', y: 'Price (₹)', d: 'Demand', s: 'Supply', unit: '₹', xd: 'units', dn: 'Demand rises when incomes or tastes rise. Supply rises when costs fall.' },
  forex: { name: 'Dollars in the foreign exchange market', x: 'Dollars traded (billion)', y: '₹ per dollar', d: 'Demand for $ (imports)', s: 'Supply of $ (exports)', unit: '₹', xd: 'billion $', dn: 'More imports raise the demand for dollars and weaken the rupee; more exports raise supply and strengthen it.' },
  money: { name: 'The money market', x: 'Money (₹ lakh crore)', y: 'Interest rate (%)', d: 'Demand for money', s: 'Supply of money', unit: '%', xd: 'lakh crore', dn: 'When the central bank adds money, supply shifts right and the interest rate falls.' },
};
export default function (host) {
  let mk = host.dataset.market || 'goods', dS = 0, sS = 0, ctl = 'free', fix = 50;
  const cv = canvas(host, { aspect: 0.82, max: 400, min: 300, label: 'Supply and demand curves with equilibrium' });
  const c0 = row(host), c = row(host);
  choice(c0, 'Market', [['goods', 'Goods'], ['forex', 'Rupee and dollar'], ['money', 'Money']], mk, (v) => { mk = v; cv.redraw(); show(); });
  choice(c0, 'Price', [['free', 'Free'], ['cap', 'Ceiling'], ['floor', 'Floor']], ctl, (v) => { ctl = v; cv.redraw(); show(); });
  slider(c, { label: 'Demand shifts', min: -20, max: 20, step: 1, value: 0, fmt: (v) => (v > 0 ? '+' : '') + v, oninput: (v) => { dS = v; cv.redraw(); show(); } });
  slider(c, { label: 'Supply shifts', min: -20, max: 20, step: 1, value: 0, fmt: (v) => (v > 0 ? '+' : '') + v, oninput: (v) => { sS = v; cv.redraw(); show(); } });
  slider(c, { label: 'Fixed price level', min: 20, max: 80, step: 1, value: fix, fmt: (v) => v, oninput: (v) => { fix = v; cv.redraw(); show(); } });
  const out = readout(host);
  // demand: P = 90 - (Q - dS); supply: P = 10 + (Q - sS)  (Q from 0..100, P from 0..100)
  const D = (q) => 90 - (q - dS), S = (q) => 10 + (q - sS);
  const eq = () => { const q = (80 + dS + sS) / 2; return [q, D(q)]; };
  const state = () => { const [q, p] = eq(); if (ctl === 'free' || (ctl === 'cap' && fix >= p) || (ctl === 'floor' && fix <= p)) return { q, p, free: true }; const qd = 90 - fix + dS, qs = fix - 10 + sS; return { p: fix, qd: Math.max(0, qd), qs: Math.max(0, qs), q: Math.max(0, Math.min(qd, qs)), free: false }; };
  const show = () => { const m = M[mk], s = state(), [qe, pe] = eq();
    out.innerHTML = `Equilibrium: quantity <b>${qe.toFixed(0)}</b>, price <b>${m.unit === '%' ? pe.toFixed(0) + '%' : m.unit + pe.toFixed(0)}</b>. ${s.free ? '' : `At the fixed price ${fix} people want ${s.qd.toFixed(0)} but ${s.qs.toFixed(0)} is supplied: a <b>${s.qd > s.qs ? 'shortage' : 'surplus'}</b> of ${Math.abs(s.qd - s.qs).toFixed(0)}, and only ${s.q.toFixed(0)} is traded. `}${m.dn}`; };
  cv.draw = (ctx, w, h, col) => {
    const m = M[mk]; title(ctx, m.name, col);
    const A = axes(ctx, w, h, col, { x: [0, 100], y: [0, 100], xlabel: m.x, ylabel: m.y, l: 44, t: 36, xt: [0, 50, 100], yt: [0, 50, 100] });
    ctx.save(); A.clip();
    line(ctx, [[A.X(0), A.Y(D(0))], [A.X(100), A.Y(D(100))]], col.s[0], 2.5); line(ctx, [[A.X(0), A.Y(S(0))], [A.X(100), A.Y(S(100))]], col.s[1], 2.5);
    line(ctx, [[A.X(0), A.Y(90)], [A.X(100), A.Y(-10)]], col.s[0], 1, [3, 4]); line(ctx, [[A.X(0), A.Y(10)], [A.X(100), A.Y(110)]], col.s[1], 1, [3, 4]);
    ctx.restore();
    const s = state(), [qe, pe] = eq();
    if (!s.free) { ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(A.L, A.Y(fix)); ctx.lineTo(A.R, A.Y(fix)); ctx.stroke(); ctx.fillStyle = col.bad; ctx.globalAlpha = 0.25; ctx.fillRect(A.X(Math.min(s.qd, s.qs)), A.Y(fix) - 5, Math.abs(A.X(s.qd) - A.X(s.qs)), 10); ctx.globalAlpha = 1; text(ctx, (s.qd > s.qs ? 'shortage' : 'surplus'), (A.X(s.qd) + A.X(s.qs)) / 2, A.Y(fix) - 12, { color: col.bad, size: 11, weight: 700, align: 'center' }); }
    dot(ctx, A.X(qe), A.Y(pe), 6, col.ink, col.panel);
    ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(qe), A.B); ctx.lineTo(A.X(qe), A.Y(pe)); ctx.lineTo(A.L, A.Y(pe)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, m.d, A.L + 6, A.Y(D(0)) + 14, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    text(ctx, m.s, A.R - 6, A.Y(S(100)) + 12 > A.B ? A.B - 10 : A.Y(Math.min(S(100), 96)) + 14, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
  };
  show();
}
