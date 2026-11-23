// Class 8 We Distribute: fast products with (m - d)(m + d) = m^2 - d^2. Choose the middle number m and the gap d; the bars show
// the square m^2, the small square d^2 that is taken away, and the product.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let m = 50, d = 3;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Bars showing m squared minus d squared equals the product of m minus d and m plus d' });
  const ctl = row(host);
  slider(ctl, { label: 'Middle m', min: 10, max: 100, step: 5, value: m, fmt: (v) => String(Math.round(v)), oninput: (v) => { m = Math.round(v); upd(); } });
  slider(ctl, { label: 'Gap d', min: 1, max: 9, step: 1, value: d, fmt: (v) => String(Math.round(v)), oninput: (v) => { d = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, (m - d) + ' × ' + (m + d) + ' = ' + m + '² − ' + d + '²', col), x0 = 16, bw = w - 32, mx = m * m;
    const bar = (y, val, cl, lab) => { const ww = Math.max(2, bw * val / mx); ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = cl; ctx.fillRect(x0, y, ww, 30); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.strokeRect(x0, y, ww, 30); text(ctx, lab, x0 + 6, y + 15, { color: col.ink, size: 12, weight: 700, halo: col.panel }); };
    bar(t + 20, mx, col.s[0], m + '² = ' + mx);
    bar(t + 62, d * d, col.s[3], 'take away ' + d + '² = ' + d * d);
    bar(t + 104, mx - d * d, col.s[2], 'product = ' + (mx - d * d));
    text(ctx, 'Not drawn to scale for tiny d: it is just a sliver of ' + mx + '.', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  function upd() { out.innerHTML = `${m - d} × ${m + d} = ${m}² − ${d}² = ${m * m} − ${d * d} = <b>${m * m - d * d}</b>. Check: ${(m - d) * (m + d)}.`; cv.redraw(); }
  upd();
}
