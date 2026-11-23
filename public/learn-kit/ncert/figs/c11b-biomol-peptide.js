// Class 11 Biomolecules (step player): the peptide bond. The carboxyl (-COOH) of one amino acid and the amino group (-NH2) of the next lose a molecule of water (condensation or
// dehydration synthesis); the C-N bond left is the peptide bond. A chain of n amino acids has n - 1 peptide bonds and loses n - 1 waters.
import { canvas, text, title } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const NOTE = [
  'Two amino acids. Each has the same backbone (amino group, central carbon, carboxyl group) and a different side chain R (R₁ and R₂). The R group decides how the amino acid behaves.',
  'The -OH from the carboxyl group of the first and an -H from the amino group of the second are the pieces that will be removed.',
  'They leave together as a molecule of water: this is why the reaction is called dehydration synthesis (condensation).',
  'The free carbon and nitrogen join: a C-N peptide bond (shown in red) has formed. The molecule is a dipeptide.',
  'More amino acids join the same way. A chain of 5 amino acids has 4 peptide bonds and made 4 waters (three are drawn here). One end keeps a free -NH₂ (N-terminus), the other a free -COOH (C-terminus).',
];
const T = ['1. Two amino acids', '2. Pick out the pieces', '3. Water leaves', '4. The peptide bond forms', '5. A growing chain'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Five steps showing two amino acids joining by a peptide bond and releasing water' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[s], col), fy = footer(ctx, w, h, col, NOTE[s]);
    const d = (w - 24) / 10, cy = (t0 + fy) / 2 + 6, ca = col.s[0], cn = col.s[1], co = col.s[4], R1 = col.s[2], R2 = col.s[3], ink = col.ink;
    const atom = (x, y, lab, c, r = 12) => { ellipse(ctx, x, y, r, r, c, col.panel, 1.5); text(ctx, lab, x, y, { color: col.panel, size: lab.length > 2 ? 9 : 11, weight: 700, align: 'center', fit: false }); };
    const bond = (x1, y1, x2, y2, c = col.muted, lw = 2) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
    const aa = (x, y, R, rc, opts = {}) => {           // N at x, C-alpha at x+d, C at x+2d, OH at x+3d
      bond(x, y, x + d, y); bond(x + d, y, x + 2 * d, y);
      if (!opts.noOH) { bond(x + 2 * d, y, x + 3 * d, y); atom(x + 3 * d, y, 'OH', co); }
      bond(x + 2 * d, y, x + 2 * d, y - d * 0.9); atom(x + 2 * d, y - d * 0.9, 'O', co, 10);
      bond(x + d, y, x + d, y + d * 0.9); atom(x + d, y + d * 0.9, R, rc, 14);
      atom(x, y, 'N', cn); atom(x + d, y, 'Cα', ca, 13); atom(x + 2 * d, y, 'C', ca);
      if (!opts.noH) { bond(x, y, x, y - d * 0.8); atom(x, y - d * 0.8, 'H', col.muted, 9); }
      bond(x, y, x - d * 0.5, y + d * 0.5); atom(x - d * 0.5, y + d * 0.5, 'H', col.muted, 9);
    };
    const mark = (x, y, r) => { ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.stroke(); ctx.restore(); };
    const y = cy - 10;
    if (s === 0 || s === 1) {
      const x1 = 12 + d * 0.8, x2 = x1 + 4.6 * d;
      aa(x1, y, 'R₁', R1, { noH: true }); aa(x2, y, 'R₂', R2, { noH: false });
      text(ctx, 'amino acid 1', x1 + 1.5 * d, y + d * 1.9, { color: ink, size: 10.5, weight: 700, align: 'center', fit: false }); text(ctx, 'amino acid 2', x2 + 1.5 * d, y + d * 1.9, { color: ink, size: 10.5, weight: 700, align: 'center', fit: false });
      if (s === 1) { mark(x1 + 3 * d, y, 17); mark(x2, y - d * 0.8, 13); }
    } else if (s === 2) {
      const x1 = 12 + d * 0.8, x2 = x1 + 4.6 * d;
      aa(x1, y, 'R₁', R1, { noH: true, noOH: true }); aa(x2, y, 'R₂', R2, { noH: true });
      ellipse(ctx, x1 + 3.6 * d, y - d * 1.8, 20, 13, col.s[0] + '33', col.s[0], 1.5); text(ctx, 'H₂O', x1 + 3.6 * d, y - d * 1.8, { color: col.s[0], size: 12, weight: 700, align: 'center', fit: false });
      text(ctx, 'water leaves', x1 + 3.6 * d, y - d * 2.6, { color: col.s[0], size: 10.5, weight: 700, align: 'center', fit: false });
    } else if (s === 3) {
      const x1 = 12 + d * 1.6;
      aa(x1, y, 'R₁', R1, { noH: true, noOH: true });
      const x2 = x1 + 3 * d - 0 * d; aa(x2 - 0 * d + 0, y, 'R₂', R2, { noH: true });
      bond(x1 + 2 * d, y, x2, y, col.s[4], 5); mark(x1 + 2.5 * d, y, d * 0.6);
      text(ctx, 'peptide bond (C-N)', x1 + 2.5 * d, y + d * 1.9, { color: col.s[4], size: 11, weight: 700, align: 'center', fit: false });
      text(ctx, 'dipeptide', x1 + 2.5 * d, y - d * 2.2, { color: ink, size: 11, weight: 700, align: 'center', fit: false });
    } else {
      const n = 3, dd = (w - 24) / (n * 3 + 2), cs = [R1, R2, col.s[5], col.s[6]];
      for (let i = 0; i < n; i++) {
        const x = 16 + dd * (1 + i * 3);
        bond(x, y, x + dd, y); bond(x + dd, y, x + 2 * dd, y); bond(x + dd, y, x + dd, y + dd * 0.9); atom(x + dd, y + dd * 0.9, 'R', cs[i], 11); atom(x, y, 'N', cn, 11); atom(x + dd, y, 'Cα', ca, 12); atom(x + 2 * dd, y, 'C', ca, 11);
        bond(x + 2 * dd, y, x + 2 * dd, y - dd * 0.8); atom(x + 2 * dd, y - dd * 0.8, 'O', co, 9);
        if (i < n - 1) { bond(x + 2 * dd, y, x + 3 * dd, y, col.s[4], 4); }
      }
      atom(16 + dd * (3 * n + 1), y, 'OH', co, 12); bond(16 + dd * (3 * n - 1), y, 16 + dd * (3 * n + 1), y);
      text(ctx, 'N-terminus (-NH₂)', 16, y + dd * 2.4, { color: ink, size: 10, weight: 700, fit: false }); text(ctx, 'C-terminus (-COOH)', w - 14, y + dd * 2.4, { color: ink, size: 10, weight: 700, align: 'right', fit: false });
      text(ctx, 'red bonds = peptide bonds', w / 2, y - dd * 2.1, { color: col.s[4], size: 11, weight: 700, align: 'center', fit: false });
    }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
