// Class 12 Biology, Principles of Inheritance and Variation: independent assortment seen in meiosis. A cell AaBb has two pairs of homologous chromosomes.
// At metaphase I each pair lines up with either chromosome on either side, independently of the other pair, so the gametes are AB, Ab, aB, ab in equal numbers
// (1 : 1 : 1 : 1). If the two genes lie on the SAME chromosome they travel together and mostly only the parental gametes AB and ab are made (linkage).
import { canvas, text, title, row, choice, button, readout, rng } from '../../kit.js';

export default function (host) {
  let linked = false, counts = { AB: 0, Ab: 0, aB: 0, ab: 0 }, flips = [0, 0], R = rng(7), runs = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Two chromosome pairs lining up at metaphase I with a running tally of gamete types' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Genes lie on', [[false, 'Different chromosomes'], [true, 'Same chromosome']], false, (v) => { linked = v; reset(); });
  button(ctl, 'Run meiosis ×1', () => { run(1); });
  button(ctl, 'Run ×100', () => { run(100); });
  const reset = () => { counts = { AB: 0, Ab: 0, aB: 0, ab: 0 }; runs = 0; go(); };
  const run = (n) => { for (let i = 0; i < n; i++) { const f1 = R() < 0.5 ? 0 : 1, f2 = R() < 0.5 ? 0 : 1; flips = [f1, f2]; const L = linked ? [['A', 'B'], ['a', 'b']] : null; if (linked) { const s = f1; counts[s ? 'ab' : 'AB'] += 2; } else { const left = [f1 ? 'a' : 'A', f2 ? 'b' : 'B'], right = [f1 ? 'A' : 'a', f2 ? 'B' : 'b']; counts[left.join('')] += 2; counts[right.join('')] += 2; } runs++; } go(); };
  const go = () => { const t = Object.values(counts).reduce((a, b) => a + b, 0); ro.textContent = t ? `${runs} meiosis run${runs > 1 ? 's' : ''}, ${t} gametes. ${linked ? 'Linked genes travel together: almost only the parental types AB and ab appear (real linked genes also swap a few by crossing over).' : 'Free assortment: the four types appear in about equal numbers, 1 : 1 : 1 : 1.'}` : 'Press Run to line up the chromosomes at random and make gametes.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, linked ? 'Linked genes: one chromosome pair' : 'Two pairs line up independently', col) + 4, mid = top + 70;
    const chrom = (x, y, c, lab, len = 44) => { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - 5, y - len / 2, 10, len, 5) : ctx.rect(x - 5, y - len / 2, 10, len); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); text(ctx, lab, x, y, { color: col.panel, size: 11, weight: 700, align: 'center', fit: false }); };
    ctx.strokeStyle = col.line; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(10, mid); ctx.lineTo(w - 10, mid); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'metaphase plate', w - 8, mid - 8, { color: col.muted, size: 9.5, align: 'right' });
    if (linked) { const x = w / 2; chrom(x - 18, mid - 28, col.s[0], 'A·B', 52); chrom(x + 18, mid + 28, col.s[3], 'a·b', 52); if (flips[0]) { /* flipped */ } }
    else { const x1 = w * 0.36, x2 = w * 0.64; const t = flips; chrom(x1, t[0] ? mid + 28 : mid - 28, col.s[0], 'A'); chrom(x1, t[0] ? mid - 28 : mid + 28, col.s[3], 'a'); chrom(x2, t[1] ? mid + 28 : mid - 28, col.s[0], 'B'); chrom(x2, t[1] ? mid - 28 : mid + 28, col.s[3], 'b'); }
    // tally bars
    const keys = ['AB', 'Ab', 'aB', 'ab'], base = h - 26, bh = h - mid - 120, mx = Math.max(10, ...Object.values(counts)), bw = (w - 60) / 4;
    keys.forEach((k, i) => { const x = 30 + i * bw, v = counts[k], hh = bh * v / mx; ctx.fillStyle = k === 'AB' || k === 'ab' ? col.s[0] : col.s[3]; ctx.fillRect(x + 8, base - hh, bw - 16, hh); text(ctx, String(v), x + bw / 2, base - hh - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, k, x + bw / 2, base + 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); });
    text(ctx, 'gametes made so far', w / 2, mid + 74, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
