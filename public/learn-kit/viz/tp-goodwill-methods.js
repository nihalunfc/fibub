// Goodwill valued three ways from the same made-up numbers: average profit x years' purchase, super-profit x years'
// purchase, and capitalisation of average profit. Move the profit, the capital employed and the normal rate of return;
// the bars compare the answers and show the "super profit" that gives a firm goodwill at all.
import { canvas, row, slider, readout, text, title } from '../kit.js';

const rs = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
export default function (host) {
  let avg = 120000, capital = 600000, nrr = 10, yrs = 3;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 300, label: 'Goodwill by three methods' });
  const c = row(host);
  slider(c, { label: 'Average profit', min: 40000, max: 300000, step: 10000, value: avg, fmt: rs, oninput: (v) => { avg = v; cv.redraw(); show(); } });
  slider(c, { label: 'Capital employed', min: 200000, max: 1500000, step: 50000, value: capital, fmt: rs, oninput: (v) => { capital = v; cv.redraw(); show(); } });
  slider(c, { label: 'Normal rate of return', min: 5, max: 20, step: 1, value: nrr, fmt: (v) => v + '%', oninput: (v) => { nrr = v; cv.redraw(); show(); } });
  slider(c, { label: 'Years\' purchase', min: 1, max: 5, step: 1, value: yrs, fmt: (v) => v, oninput: (v) => { yrs = v; cv.redraw(); show(); } });
  const out = readout(host);
  const calc = () => { const normal = capital * nrr / 100, sp = avg - normal, cap = avg * 100 / nrr; return { normal, sp, m1: avg * yrs, m2: Math.max(0, sp) * yrs, m3: Math.max(0, cap - capital), cap }; };
  const show = () => { const r = calc(); out.innerHTML = `Normal profit = ${rs(capital)} × ${nrr}% = ${rs(r.normal)}. Super profit = ${rs(avg)} − ${rs(r.normal)} = <b>${rs(r.sp)}</b>${r.sp <= 0 ? ' (none, so no goodwill by the super-profit method)' : ''}. Capitalised value of profit = ${rs(r.cap)}, so goodwill by capitalisation = ${rs(r.cap)} − ${rs(capital)} = <b>${rs(r.m3)}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Same firm, three answers', col);
    const r = calc(), vals = [r.m1, r.m2, r.m3], names = ['Average profit × ' + yrs, 'Super profit × ' + yrs, 'Capitalisation'];
    const mx = Math.max(1, ...vals) * 1.15, L = 16, W = w - 32;
    vals.forEach((v, i) => { const y = 52 + i * 58; text(ctx, names[i], L, y, { color: col.ink, size: 12, weight: 700 });
      ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.8; ctx.fillRect(L, y + 10, Math.max(2, v / mx * W), 24); ctx.globalAlpha = 1; text(ctx, rs(v), L + Math.max(2, v / mx * W) + 6 > w - 80 ? L + 6 : L + Math.max(2, v / mx * W) + 6, y + 22, { color: col.ink, size: 11.5, weight: 700 }); });
    const y = 52 + 3 * 58 - 6; text(ctx, 'Profit above normal is what buyers pay for:', L, y, { color: col.muted, size: 11 });
    const tot = Math.max(avg, r.normal) * 1.1; ctx.fillStyle = col.line; ctx.fillRect(L, y + 10, r.normal / tot * W, 20); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.8; ctx.fillRect(L + r.normal / tot * W, y + 10, Math.max(0, r.sp) / tot * W, 20); ctx.globalAlpha = 1;
    text(ctx, 'normal ' + rs(r.normal), L + 4, y + 20, { color: col.ink, size: 10.5 }); if (r.sp > 0) text(ctx, 'super', L + (r.normal + r.sp / 2) / tot * W, y + 20, { color: col.ink, size: 10.5, align: 'center' });
  };
  show();
}
