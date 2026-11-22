// ABO blood groups by inheritance: choose the genotype of each parent. The 2 × 2 square shows the four equally
// likely children and the bars show the chance of each blood group. IA and IB are codominant (both show in IAIB);
// i is recessive. Try IAi × IBi: all four groups are possible.
import { canvas, row, choice, readout, text, title } from '../kit.js';

const GENO = ['IAIA', 'IAi', 'IBIB', 'IBi', 'IAIB', 'ii'];
const lab = (g) => g.replace('IA', 'Iᴬ').replace('IB', 'Iᴮ').replace('IA', 'Iᴬ').replace('IB', 'Iᴮ');
const alle = (g) => (g === 'ii' ? ['i', 'i'] : g.length === 3 ? [g.slice(0, 2), 'i'] : [g.slice(0, 2), g.slice(2)]);
const group = (a, b) => { const s = [a, b], A = s.includes('IA'), B = s.includes('IB'); return A && B ? 'AB' : A ? 'A' : B ? 'B' : 'O'; };
const GCOL = { A: 0, B: 2, AB: 3, O: 1 };

export default function (host) {
  let p1 = 'IAi', p2 = 'IBi';
  const cv = canvas(host, { aspect: 0.72, max: 330, min: 270, label: 'Possible ABO blood groups of children for chosen parent genotypes' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Parent 1', GENO.map((g) => [g, lab(g)]), p1, (v) => { p1 = v; show(); });
  choice(c2, 'Parent 2', GENO.map((g) => [g, lab(g)]), p2, (v) => { p2 = v; show(); });
  const out = readout(host);
  const kids = () => { const r = []; for (const a of alle(p1)) for (const b of alle(p2)) r.push([a, b]); return r; };
  function show() {
    const k = kids(), tally = { A: 0, B: 0, AB: 0, O: 0 }; k.forEach(([a, b]) => tally[group(a, b)]++);
    const gr = (p) => group(...alle(p));
    out.innerHTML = `Parent 1 is group <b>${gr(p1)}</b>, parent 2 is group <b>${gr(p2)}</b>. Chance for a child: ` + Object.entries(tally).filter(([, n]) => n).map(([g, n]) => `<b>${g}</b> ${n * 25}%`).join(', ') + '.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Punnett square and chances', col);
    const k = kids(), a1 = alle(p1), a2 = alle(p2), S = Math.min(70, (w - 150) / 2), x0 = 50, y0 = 60;
    a1.forEach((a, i) => text(ctx, lab(a), x0 + S * (i + 0.5), y0 - 8, { color: col.muted, size: 12, weight: 700, align: 'center' }));
    a2.forEach((a, i) => text(ctx, lab(a), x0 - 22, y0 + S * (i + 0.5), { color: col.muted, size: 12, weight: 700, align: 'center' }));
    k.forEach(([a, b], i) => {
      const x = x0 + S * (i % 2), y = y0 + S * Math.floor(i / 2), g = group(a, b);
      ctx.fillStyle = col.s[GCOL[g]]; ctx.globalAlpha = 0.28; ctx.fillRect(x + 1, y + 1, S - 2, S - 2); ctx.globalAlpha = 1; ctx.strokeStyle = col.muted; ctx.strokeRect(x, y, S, S);
      text(ctx, lab(a + b === 'ii' ? 'ii' : a + (a === 'i' ? b : b === 'i' ? '' : b)), x + S / 2, y + S / 2 - 8, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, 'group ' + g, x + S / 2, y + S / 2 + 10, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    });
    // bars
    const bx = x0 + 2 * S + 26, bw = w - bx - 12, gs = ['A', 'B', 'AB', 'O'], tally = { A: 0, B: 0, AB: 0, O: 0 }; k.forEach(([a, b]) => tally[group(a, b)]++);
    gs.forEach((g, i) => { const y = y0 + i * 32; ctx.fillStyle = col.line; ctx.fillRect(bx, y, bw, 18); ctx.fillStyle = col.s[GCOL[g]]; ctx.fillRect(bx, y, bw * tally[g] / 4, 18); text(ctx, `${g} ${tally[g] * 25}%`, bx + 4, y + 9, { color: tally[g] ? col.ink : col.muted, size: 11, weight: 700, fit: false }); });
    text(ctx, 'Iᴬ and Iᴮ are codominant; i is recessive', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  show();
}
