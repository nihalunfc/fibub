// The government budget as bars: receipts on one side, spending on the other, and the three deficits worked out from
// them. Revenue deficit = revenue expenditure − revenue receipts; fiscal deficit = total expenditure − receipts that are
// not borrowing; primary deficit = fiscal deficit − interest payments. Figures are made up (₹ lakh crore).
import { canvas, row, slider, readout, text, title } from '../kit.js';

export default function (host) {
  let rr = 30, cr = 3, re = 38, ce = 12, ip = 10;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 320, label: 'Budget receipts, spending and deficits' });
  const c = row(host);
  const S = (label, min, max, v, set) => slider(c, { label, min, max, step: 1, value: v, fmt: (x) => x, oninput: (x) => { set(x); cv.redraw(); show(); } });
  S('Revenue receipts (taxes etc.)', 15, 45, rr, (v) => { rr = v; });
  S('Non-debt capital receipts', 0, 10, cr, (v) => { cr = v; });
  S('Revenue expenditure', 20, 55, re, (v) => { re = v; });
  S('Capital expenditure', 3, 25, ce, (v) => { ce = v; });
  S('of it: interest payments', 0, 20, ip, (v) => { ip = Math.min(v, re); });
  const out = readout(host);
  const d = () => { const rd = re - rr, fd = re + ce - rr - cr; return { rd, fd, pd: fd - ip, eff: rd }; };
  const f = (v) => (v > 0 ? '' : v < 0 ? '−' : '') + Math.abs(v);
  const show = () => { const k = d(); out.innerHTML = `Revenue deficit = ${re} − ${rr} = <b>${f(k.rd)}</b>. Fiscal deficit = (${re} + ${ce}) − (${rr} + ${cr}) = <b>${f(k.fd)}</b>: the amount the government must borrow. Primary deficit = ${f(k.fd)} − ${ip} = <b>${f(k.pd)}</b> (borrowing needed even before paying interest). ${k.rd > 0 ? 'A revenue deficit means borrowing is also paying for day-to-day spending.' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Where the money comes from and goes', col);
    const k = d(), mx = Math.max(rr + cr, re + ce) + 6, top = 70, bot = h - 40, sc = (bot - top) / mx, bw = Math.min(90, w * 0.26), x1 = w * 0.18, x2 = w * 0.6;
    const seg = (x, y0, v, colr, lab) => { const hh = v * sc; ctx.fillStyle = colr; ctx.globalAlpha = 0.8; ctx.fillRect(x, y0 - hh, bw, hh); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.strokeRect(x, y0 - hh, bw, hh); if (hh > 14) text(ctx, `${lab} ${v}`, x + bw / 2, y0 - hh / 2, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); return y0 - hh; };
    let y = seg(x1, bot, rr, col.s[0], 'Revenue'); y = seg(x1, y, cr, col.s[2], 'Capital'); const bor = Math.max(0, k.fd);
    if (bor > 0) { ctx.setLineDash([4, 3]); ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.strokeRect(x1, y - bor * sc, bw, bor * sc); ctx.setLineDash([]); text(ctx, 'borrowing ' + bor, x1 + bw / 2, y - bor * sc / 2, { color: col.bad, size: 10.5, weight: 700, align: 'center' }); }
    y = seg(x2, bot, re - ip, col.s[1], 'Revenue exp.'); y = seg(x2, y, ip, col.s[3], 'Interest'); seg(x2, y, ce, col.s[4], 'Capital exp.');
    text(ctx, 'RECEIPTS', x1 + bw / 2, bot + 12, { color: col.muted, size: 11, weight: 700, align: 'center' }); text(ctx, 'SPENDING', x2 + bw / 2, bot + 12, { color: col.muted, size: 11, weight: 700, align: 'center' });
    text(ctx, `Revenue deficit ${f(k.rd)}  |  Fiscal ${f(k.fd)}  |  Primary ${f(k.pd)}`, 10, 38, { color: k.fd > 0 ? col.bad : col.good, size: 11.5, weight: 700 });
  };
  show();
}
