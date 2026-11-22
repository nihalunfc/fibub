// Class 12 Biology, Principles of Inheritance and Variation: polygenic inheritance. A trait such as skin colour or height is controlled by several genes whose
// capital alleles each add a little (additive effect). For n genes crossed AaBb... x AaBb..., the number of capital alleles in a child follows the binomial
// numbers 1 2 1 (n = 1), 1 4 6 4 1 (n = 2), 1 6 15 20 15 6 1 (n = 3): a bell curve, with most children in the middle.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A bar chart of the number of children with 0 to 2n capital alleles that grows into a bell shape as the number of genes increases' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'number of genes (n)', min: 1, max: 5, step: 1, value: 3, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); go(); } });
  const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = (r * (a - b + i)) / i; return Math.round(r); };
  const go = () => { const row = Array.from({ length: 2 * n + 1 }, (_, k) => C(2 * n, k)); ro.textContent = `${n} gene${n > 1 ? 's' : ''} (each Aa × Aa): ${2 * n + 1} classes in the ratio ${row.join(' : ')} out of ${4 ** n}. Only ${2 / 4 ** n * 100 < 1 ? 'a tiny fraction' : (200 / 4 ** n).toFixed(1) + ' %'} of children are at the two extremes (all capital or all small). With many genes and some effect of environment the spread becomes a smooth bell curve.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Capital alleles in the children of AaBb… × AaBb…', col) + 14, m = 2 * n + 1, bw = (w - 30) / m, base = h - 40, mx = C(2 * n, n);
    for (let k = 0; k < m; k++) { const v = C(2 * n, k), bh = (base - top - 14) * v / mx, t = k / (m - 1), x = 15 + k * bw; ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.25 + 0.75 * t; ctx.fillRect(x + 2, base - bh, bw - 4, bh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x + 2, base - bh, bw - 4, bh); text(ctx, String(v), x + bw / 2, base - bh - 8, { color: col.ink, size: Math.min(11, bw * 0.5), weight: 700, align: 'center', fit: false }); text(ctx, String(k), x + bw / 2, base + 12, { color: col.ink, size: 10.5, align: 'center', fit: false }); }
    text(ctx, 'number of capital (dominant, "dark") alleles', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'light', 15, base + 26, { color: col.muted, size: 10 }); text(ctx, 'dark', w - 15, base + 26, { color: col.muted, size: 10, align: 'right' });
  };
  go();
}
