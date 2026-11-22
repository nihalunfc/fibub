// Class 10 Heredity: dominant and recessive alleles in a flower colour (purple P is dominant to white p). A plant has two
// alleles for each trait, one from each parent. A dominant allele shows even when there is only one copy; the recessive trait
// shows only when both alleles are recessive. Pick the genotype, or toggle which allele is dominant.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

export default function (host) {
  let g = 'Pp';
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A flower whose colour depends on a pair of alleles' });
  const ctl = row(host);
  choice(ctl, 'Genotype', [['PP', 'PP'], ['Pp', 'Pp'], ['pp', 'pp']], g, (v) => { g = v; say(); });
  const out = readout(host);
  const show = () => (g.includes('P') ? 'purple' : 'white');
  function say() { out.innerHTML = `<b>${g}</b>: ${g === 'PP' ? 'two dominant alleles: purple. Pure (homozygous) for purple.' : g === 'Pp' ? 'one dominant and one recessive allele: the dominant P hides p, so the flower is purple. The plant is a hybrid (heterozygous) and carries the white allele without showing it.' : 'two recessive alleles: no P present, so the flower is white. This is the only genotype that shows the recessive trait.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Genotype decides the flower colour', col) + 8, cx = w * 0.64, cy = top + (h - top) * 0.46, r = Math.min(w * 0.14, 52), purple = show() === 'purple';
    for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283 - 1.57; ctx.save(); ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.85, r * 0.5, 0, 0, 7); ctx.fillStyle = purple ? col.s[4] : col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore(); }
    dot(ctx, cx, cy, r * 0.32, col.s[3], col.ink); text(ctx, purple ? 'purple flower' : 'white flower', cx, cy + r * 1.9, { color: col.ink, size: 12, weight: 700, align: 'center' });
    // two alleles on a chromosome pair
    const x0 = w * 0.1; text(ctx, 'two alleles (one from each parent)', x0 + 30, top + 14, { color: col.muted, size: 10, align: 'left' });
    [0, 1].forEach((i) => { const x = x0 + 14 + i * 42, y = cy - 30; ctx.fillStyle = col.line; ctx.beginPath(); ctx.roundRect(x - 9, y, 18, 64, 9); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.stroke(); const dom = g[i] === 'P'; dot(ctx, x, y + 32, 11, dom ? col.s[4] : col.panel, col.ink); text(ctx, g[i], x, y + 32, { color: dom ? col.panel : col.ink, size: 12, weight: 700, align: 'center' }); });
    text(ctx, 'P = purple (dominant)', x0, cy + 56, { color: col.ink, size: 10.5 }); text(ctx, 'p = white (recessive)', x0, cy + 72, { color: col.ink, size: 10.5 });
    line(ctx, [[x0 + 80, cy + 2], [cx - r * 1.9, cy + 2]], col.muted, 1.5, [4, 3]);
  };
  say();
}
