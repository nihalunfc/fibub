// Class 12 Biology, Principles of Inheritance and Variation (step player): Mendel's monohybrid cross for plant height. P: TT (tall) x tt (dwarf) -> F1: all
// Tt, all tall (dominance). F1 makes T and t gametes in equal numbers because the two alleles separate in meiosis (law of segregation). Random fusion gives
// F2: 1 TT : 2 Tt : 1 tt, which looks like 3 tall : 1 dwarf.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Steps of a monohybrid cross from tall and dwarf parents to a 3 to 1 ratio in the second generation' });
  const T = ['Parents (P): tall × dwarf', 'Each parent makes one kind of gamete', 'First generation (F1): all tall', 'F1 plants make two kinds of gametes', 'Gametes meet at random', 'Second generation (F2): 3 tall : 1 dwarf'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 6, base = h - 38;
    const plant = (x, tall, g, hl) => { const H = tall ? 70 : 32; line(ctx, [[x, base], [x, base - H]], col.s[2], 4); ctx.beginPath(); ctx.ellipse(x - 10, base - H * 0.6, 10, 5, -0.5, 0, 7); ctx.ellipse(x + 10, base - H * 0.4, 10, 5, 0.5, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); dot(ctx, x, base - H - 4, 6, tall ? col.s[3] : col.s[5], col.ink); text(ctx, g, x, base + 14, { color: hl || col.ink, size: 12.5, weight: 700, align: 'center' }); };
    const ga = (x, y, a) => { dot(ctx, x, y, 11, a === 'T' ? col.s[0] : col.s[3], col.ink); text(ctx, a, x, y, { color: col.panel, size: 12, weight: 700, align: 'center', fit: false }); };
    const L = (s, x, y, c = col.muted) => text(ctx, s, x, y, { color: c, size: 10.5, weight: 600, align: 'center' });
    const cx = w / 2;
    if (step === 0) { plant(cx - 60, true, 'TT'); plant(cx + 60, false, 'tt'); L('tall', cx - 60, base + 30); L('dwarf', cx + 60, base + 30); text(ctx, '×', cx, base - 30, { color: col.ink, size: 20, align: 'center' }); L('two identical alleles each (true-breeding)', cx, top + 24); }
    if (step === 1) { plant(cx - 90, true, 'TT'); plant(cx + 90, false, 'tt'); ga(cx - 30, base - 40, 'T'); ga(cx - 30, base - 12, 'T'); ga(cx + 30, base - 40, 't'); ga(cx + 30, base - 12, 't'); L('all T', cx - 30, base + 14); L('all t', cx + 30, base + 14); L('one allele of the pair goes into each gamete', cx, top + 24); }
    if (step === 2) { [-70, -23, 23, 70].forEach((d) => plant(cx + d, true, 'Tt')); L('every F1 plant is Tt and looks tall: T is dominant over t', cx, top + 24); L('the dwarf trait seems lost, but the t allele is still there', cx, base + 30); }
    if (step === 3) { plant(cx, true, 'Tt'); arrow(ctx, cx - 10, base - 84, cx - 60, base - 112, col.ink, 1.5, 6); arrow(ctx, cx + 10, base - 84, cx + 60, base - 112, col.ink, 1.5, 6); ga(cx - 70, base - 120, 'T'); ga(cx + 70, base - 120, 't'); L('½ carry T', cx - 70, base - 142); L('½ carry t', cx + 70, base - 142); L('the two alleles separate at meiosis: the law of segregation', cx, top + 24, col.ink); }
    if (step === 4) { const x0 = cx - 80, y0 = top + 34, s = 70; ['T', 't'].forEach((a, i) => { ga(x0 + s * i + s / 2 + 0, y0, a); ga(x0 - 24, y0 + s * i + s / 2 + 12, a); }); [['TT', true], ['Tt', true], ['Tt', true], ['tt', false]].forEach(([g, tall], k) => { const x = x0 + (k % 2) * s, y = y0 + 16 + Math.floor(k / 2) * s; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, s, s); text(ctx, g, x + s / 2, y + s / 2 - 8, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, tall ? 'tall' : 'dwarf', x + s / 2, y + s / 2 + 12, { color: tall ? col.s[3] : col.s[5], size: 11, weight: 700, align: 'center' }); }); L('sperm or pollen across, eggs down', cx, h - 12); }
    if (step === 5) { const items = [['TT', 1, true], ['Tt', 2, true], ['tt', 1, false]]; const bw = (w - 60) / 3, bb = base - 20, u = 34; items.forEach(([g, n, tall], i) => { ctx.fillStyle = tall ? col.s[3] : col.s[5]; ctx.fillRect(30 + i * bw + 14, bb - n * u, bw - 28, n * u); text(ctx, String(n), 30 + i * bw + bw / 2, bb - n * u - 10, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, g, 30 + i * bw + bw / 2, bb + 14, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); }); L('genotype ratio 1 : 2 : 1', cx, top + 22, col.ink); L('phenotype ratio 3 tall : 1 dwarf (1 + 2 = 3 tall)', cx, h - 8, col.s[3]); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
