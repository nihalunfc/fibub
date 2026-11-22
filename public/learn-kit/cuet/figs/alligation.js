// 3.6 Mixtures by alligation: mix a cheaper and a dearer kind to hit a target price. The distances from the
// target, crossed over, give the ratio — shown as a balance beam.
import { canvas, text, row, slider, readout, line } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.42, max: 260, min: 190, label: 'A number line with cheap price, target price and dear price, and the mixing ratio' });
  let lo = 40, hi = 70, t = 50;
  const ctl = row(host);
  slider(ctl, { label: 'Cheaper (₹/kg)', min: 10, max: 90, step: 1, value: lo, fmt: (v) => `₹${v}`, oninput: (v) => { lo = v; go(); } });
  slider(ctl, { label: 'Dearer (₹/kg)', min: 20, max: 150, step: 1, value: hi, fmt: (v) => `₹${v}`, oninput: (v) => { hi = v; go(); } });
  slider(ctl, { label: 'Target (₹/kg)', min: 10, max: 150, step: 1, value: t, fmt: (v) => `₹${v}`, oninput: (v) => { t = v; go(); } });
  const out = readout(host);
  const go = () => {
    cv.redraw();
    if (!(lo < t && t < hi)) { out.innerHTML = 'The target must lie between the two prices, or no mix can reach it.'; return; }
    out.innerHTML = `Cheaper : dearer = (${hi} − ${t}) : (${t} − ${lo}) = <b>${hi - t} : ${t - lo}</b>. The kind farther from the target is needed in the smaller amount.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const a = Math.min(lo, hi, t) - 5, b = Math.max(lo, hi, t) + 5, x = (v) => 20 + ((v - a) / (b - a)) * (w - 40), y = h * 0.45;
    line(ctx, [[14, y], [w - 14, y]], col.ink, 1.5);
    const mark = (v, lab, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x(v), y, 7, 0, 7); ctx.fill(); text(ctx, lab, x(v), y - 20, { color: col.ink, size: 12, weight: 600, align: 'center' }); text(ctx, `₹${v}`, x(v), y + 20, { color: col.muted, size: 11, align: 'center' }); };
    mark(lo, 'cheaper', col.s[0]); mark(hi, 'dearer', col.s[3]); mark(t, 'target', col.s[2]);
    if (lo < t && t < hi) {
      text(ctx, `gap ${t - lo}`, (x(lo) + x(t)) / 2, y + 42, { color: col.s[0], size: 12, weight: 600, align: 'center' });
      text(ctx, `gap ${hi - t}`, (x(t) + x(hi)) / 2, y + 42, { color: col.s[3], size: 12, weight: 600, align: 'center' });
    }
  };
  go();
}
