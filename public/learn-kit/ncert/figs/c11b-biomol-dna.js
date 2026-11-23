// Class 11 Biomolecules: nucleic acids. A nucleotide is a sugar (deoxyribose in DNA, ribose in RNA), a phosphate and a nitrogen base. DNA has A, T, G, C; RNA has A, U, G, C instead of T.
// In DNA the bases pair A-T (2 hydrogen bonds) and G-C (3 bonds), so the second strand is the complement and G-C-rich DNA is harder to melt (short-oligo estimate Tm = 2(A+T) + 4(G+C) in C).
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const SEQ = { a: 'ATGCGTAC', b: 'GCGCCGGC', c: 'ATATTAAT' };
export default function (host) {
  let kind = 'dna', sq = 'a';
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Eight base pairs of DNA or an RNA copy with hydrogen bonds drawn as dashes' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Molecule', [['dna', 'DNA (double)'], ['rna', 'RNA (single)']], kind, (v) => { kind = v; go(); });
  choice(ctl, 'Sequence', [['a', 'Mixed'], ['b', 'G-C rich'], ['c', 'A-T rich']], sq, (v) => { sq = v; go(); });
  const comp = (b) => ({ A: kind === 'dna' ? 'T' : 'U', T: 'A', G: 'C', C: 'G' }[b]);
  const go = () => {
    const s = SEQ[sq], at = [...s].filter((b) => 'AT'.includes(b)).length, gc = s.length - at, hb = at * 2 + gc * 3, tm = 2 * at + 4 * gc;
    ro.textContent = kind === 'dna' ? `Strand ${s} has ${at} A-T pairs (2 bonds each) and ${gc} G-C pairs (3 each): ${hb} hydrogen bonds, Tm about ${tm} °C. More G-C means more bonds and a higher melting point.` : `RNA copy of the template strand: U replaces T, and the strand is usually single, with ribose instead of deoxyribose (the extra -OH on carbon 2).`;
    cv.redraw();
  };
  const BC = { A: 0, T: 3, U: 3, G: 2, C: 1 };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, kind === 'dna' ? 'DNA: two strands, antiparallel' : 'RNA: one strand, U instead of T', col), fy = footer(ctx, w, h, col, kind === 'dna' ? 'A backbone of sugar and phosphate runs on the outside; the bases face in. Purines (A, G) are double-ring, pyrimidines (C, T, U) single-ring: a purine always pairs with a pyrimidine.' : 'RNA is made by copying one DNA strand (transcription): A in the template gives U, T gives A, G gives C and C gives G. It folds on itself and does the jobs of mRNA, tRNA and rRNA.');
    const s = SEQ[sq], n = s.length, x0 = w * 0.25, x1 = w * 0.75, y0 = t0 + 22, dy = (fy - y0 - 28) / (n - 1);
    const base = (b, x, y, side) => { ellipse(ctx, x, y, 14, 11, col.s[BC[b]], col.panel, 1.5); text(ctx, b, x, y, { color: col.panel, size: 12, weight: 700, align: 'center', fit: false }); };
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 - 28, y0 - 6); ctx.lineTo(x0 - 28, y0 + (n - 1) * dy + 6); ctx.stroke();
    if (kind === 'dna') { ctx.beginPath(); ctx.moveTo(x1 + 28, y0 - 6); ctx.lineTo(x1 + 28, y0 + (n - 1) * dy + 6); ctx.stroke(); }
    text(ctx, "5'", x0 - 28, y0 - 14, { color: col.muted, size: 10, align: 'center', fit: false }); text(ctx, "3'", x0 - 28, y0 + (n - 1) * dy + 14, { color: col.muted, size: 10, align: 'center', fit: false });
    if (kind === 'dna') { text(ctx, "3'", x1 + 28, y0 - 14, { color: col.muted, size: 10, align: 'center', fit: false }); text(ctx, "5'", x1 + 28, y0 + (n - 1) * dy + 14, { color: col.muted, size: 10, align: 'center', fit: false }); }
    for (let i = 0; i < n; i++) {
      const y = y0 + i * dy, b = s[i], c = comp(b);
      ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 28, y); ctx.lineTo(x0 - 14, y); ctx.stroke(); ellipse(ctx, x0 - 28, y, 4, 4, col.s[3]);
      base(b, x0, y);
      if (kind === 'dna') {
        const nb = 'GC'.includes(b) ? 3 : 2; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
        for (let k = 0; k < nb; k++) { const yy = y + (k - (nb - 1) / 2) * 6; ctx.beginPath(); ctx.moveTo(x0 + 16, yy); ctx.lineTo(x1 - 16, yy); ctx.stroke(); } ctx.setLineDash([]);
        text(ctx, nb + ' bonds', w / 2, y - 10, { color: col.muted, size: 9.5, align: 'center', fit: false });
        base(c, x1, y); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1 + 14, y); ctx.lineTo(x1 + 28, y); ctx.stroke(); ellipse(ctx, x1 + 28, y, 4, 4, col.s[3]);
      } else { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x0 + 16, y); ctx.lineTo(x0 + 50, y); ctx.stroke(); ctx.setLineDash([]); base(c, x0 + 66, y); text(ctx, `template ${b} gives RNA ${c}`, x0 + 88, y, { color: col.muted, size: 10, fit: false }); }
    }
  };
  go();
}
