// Class 12 Biology, Reproductive Health: total fertility rate (TFR, average children per woman) and the size of each generation. A couple needs to be
// replaced by two children, and a little more because some die before they have children, so replacement-level fertility is about 2.1. Each generation
// is TFR / 2.1 times the last (mortality simplified; population momentum ignored).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let f = 2.1;
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 280, label: 'Bars for the size of five generations when each woman has a chosen number of children' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'children per woman (TFR)', min: 1, max: 4, step: 0.1, value: f, fmt: (v) => v.toFixed(1), oninput: (v) => { f = Math.round(v * 10) / 10; go(); } });
  const go = () => { const k = f / 2.1; ro.textContent = f < 2.05 ? `Below replacement: each generation is ${(k * 100).toFixed(0)} % of the one before, so the population falls in the long run.` : f > 2.15 ? `Above replacement: each generation is ${(k * 100).toFixed(0)} % of the one before, so it keeps growing. After 4 generations it is ${(100 * k ** 4).toFixed(0)} % of the first.` : 'Replacement level: each generation exactly replaces itself, so the population stays steady (after momentum has died away).'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Size of each generation (first = 100)', col) + 10, k = f / 2.1, n = 5, bw = (w - 30) / n, base = h - 30, mx = Math.max(100, 100 * k ** 4);
    for (let g = 0; g < n; g++) { const v = 100 * k ** g, bh = (base - top - 14) * v / mx; ctx.fillStyle = f >= 2.05 && f <= 2.15 ? col.s[2] : f > 2.15 ? col.s[3] : col.s[0]; ctx.fillRect(15 + g * bw + 6, base - bh, bw - 12, bh); text(ctx, v.toFixed(0), 15 + g * bw + bw / 2, base - bh - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, ['grand-\nparents', 'parents', 'children', 'grand-\nchildren', 'great-\ngrand'][g].replace('\n', ''), 15 + g * bw + bw / 2, base + 12, { color: col.muted, size: 10, align: 'center' }); }
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); const y100 = base - (base - top - 14) * 100 / mx; ctx.beginPath(); ctx.moveTo(10, y100); ctx.lineTo(w - 10, y100); ctx.stroke(); ctx.setLineDash([]);
  };
  go();
}
