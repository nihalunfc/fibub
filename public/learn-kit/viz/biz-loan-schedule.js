// A loan paid back in equal monthly instalments (EMI). Each payment is the same, but early on most of it is interest and
// later most of it is principal. Move the amount, rate and term; flip to "Balance" to see the debt shrink. Press Play to run
// down the months. EMI = P·r ÷ (1 − (1 + r)^−n) with r the monthly rate.
import { canvas, axes, line, text, title, row, slider, readout, choice, loop } from '../kit.js';
import { money, short } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.74, max: 410, label: 'Loan instalments split into interest and principal' });
  let view = 'split', m = 0;
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Show', [['split', 'Interest vs principal'], ['balance', 'Balance']], view, (v) => { view = v; cv.redraw(); });
  const S = {
    P: slider(c2, { label: 'Loan amount', min: 5000, max: 200000, step: 1000, value: 50000, fmt: short, oninput: () => { m = 0; cv.redraw(); } }),
    r: slider(c2, { label: 'Interest a year', min: 0.02, max: 0.24, step: 0.0025, value: 0.12, fmt: (v) => (v * 100).toFixed(2) + '%', oninput: () => { m = 0; cv.redraw(); } }),
    n: slider(c2, { label: 'Term', min: 6, max: 84, step: 6, value: 36, fmt: (v) => v + ' months', oninput: () => { m = 0; cv.redraw(); } }),
  };
  const out = readout(host);
  const anim = loop(host, (dt) => { m = Math.min(S.n.value, m + dt * 5); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  const sched = () => { const P = S.P.value, n = S.n.value, r = S.r.value / 12, emi = r ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n; let b = P; const rows = []; for (let k = 1; k <= n; k++) { const i = b * r, pr = emi - i; b -= pr; rows.push({ i, pr, b: Math.max(0, b) }); } return { emi, rows }; };
  cv.draw = (ctx, w, h, col) => {
    const { emi, rows } = sched(), n = rows.length, P = S.P.value, cur = Math.max(1, Math.min(n, Math.round(m || 1)));
    title(ctx, view === 'split' ? 'Where each payment goes' : 'How much you still owe', col);
    const a = axes(ctx, w, h, col, { t: 34, x: [0, n], y: [0, view === 'split' ? emi * 1.1 : P * 1.05], xlabel: 'Month', ylabel: view === 'split' ? 'Payment' : 'Owed', fy: short });
    if (view === 'split') {
      const bw = (a.R - a.L) / n;
      rows.forEach((r, k) => { const x = a.X(k) + 0.5; ctx.fillStyle = col.s[0]; ctx.fillRect(x, a.Y(r.pr), Math.max(1, bw - 1), a.B - a.Y(r.pr)); ctx.fillStyle = col.s[1]; ctx.fillRect(x, a.Y(r.pr + r.i), Math.max(1, bw - 1), a.Y(r.pr) - a.Y(r.pr + r.i)); });
      text(ctx, 'principal (pays the debt)', a.L + 8, a.B - 10, { color: col.bg, size: 10, weight: 700, halo: col.s[0] });
      text(ctx, 'interest (the cost)', a.R - 6, a.Y(emi) + 12, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
    } else line(ctx, [[a.X(0), a.Y(P)], ...rows.map((r, k) => [a.X(k + 1), a.Y(r.b)])], col.s[0], 3);
    if (m > 0) line(ctx, [[a.X(cur), a.T], [a.X(cur), a.B]], col.ink, 1.5, [3, 3]);
    const tot = emi * n, r = rows[cur - 1];
    out.innerHTML = `Instalment <b>${money(emi)}</b> a month for ${n} months: you repay <b>${money(tot)}</b>, of which <b>${money(tot - P)}</b> is interest. ` + (m > 0 ? `In month <b>${cur}</b>: ${money(r.i)} interest + ${money(r.pr)} principal; still owed ${money(r.b)}.` : 'Press Play (or look at month 1): most of the early payments are interest.');
  };
  cv.redraw();
}
