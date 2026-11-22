// Class 12 Molecular Basis of Inheritance (step player): translation. The small ribosomal subunit binds mRNA and the initiator tRNA (Met) at AUG; the large subunit joins.
// tRNAs bring amino acids to the A site, a peptide bond forms, the ribosome moves one codon (translocation); at a stop codon (UAG) a release factor frees the chain.
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 290, label: 'Steps of translation on a ribosome: initiation, elongation, translocation and termination, reading the codons AUG CCU AAG GCA UAG' });
  const T = ['Charged tRNAs and the message', 'Initiation: small subunit finds AUG', 'The large subunit joins', 'Elongation: a peptide bond forms', 'Translocation: move one codon', 'Termination at the stop codon'];
  const NOTE = ['Each amino acid is first attached to its own tRNA by an aminoacyl-tRNA synthetase (uses ATP). The tRNA’s anticodon will pair with the codon of the mRNA.',
    'The small subunit binds the mRNA and the initiator tRNA (anticodon UAC, carrying methionine) pairs with the start codon AUG.',
    'The large subunit joins. The ribosome now has the P site (holding the growing chain), the A site (empty, for the next tRNA) and the E site (exit).',
    'tRNA-Pro (anticodon GGA) fits codon CCU in the A site. The ribosome’s enzyme makes a peptide bond: Met moves onto Pro.',
    'The ribosome slides 3 bases along the mRNA (5′ to 3′). The empty tRNA leaves from the E site, the tRNA with the chain is now in P, and the A site is open for codon AAG (Lys).',
    'At UAG there is no tRNA: a release factor enters the A site, the chain (Met-Pro-Lys-Ala) is set free and the ribosome falls apart.'];
  const cod = ['AUG', 'CCU', 'AAG', 'GCA', 'UAG'], aa = ['Met', 'Pro', 'Lys', 'Ala', 'stop'], anti = ['UAC', 'GGA', 'UUC', 'CGU'];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), cw = Math.min(62, (w - 24) / 6), yM = t0 + 150, x0 = (w - cw * 6) / 2;
    // position of the P site codon index by step
    const pIdx = [0, 0, 0, 0, 1, 3][step];
    cod.forEach((c, i) => { ctx.fillStyle = col.line; ctx.fillRect(x0 + (i + 1) * cw + 1, yM, cw - 2, 20); text(ctx, c, x0 + (i + 1) * cw + cw / 2, yM + 10, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    line(ctx, [[x0 + 14, yM + 10], [x0 + cw, yM + 10]], col.muted, 2); text(ctx, "5'", x0 + 2, yM + 10, { color: col.muted, size: 10, weight: 700 }); text(ctx, "3'", x0 + cw * 6 - 8, yM + 10, { color: col.muted, size: 10, weight: 700 });
    const trna = (i, x, y, color, label) => { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x - cw * 0.4, yM - 2); ctx.lineTo(x + cw * 0.4, yM - 2); ctx.lineTo(x + cw * 0.3, y); ctx.lineTo(x - cw * 0.3, y); ctx.closePath(); ctx.fill(); text(ctx, anti[i], x, yM - 12, { color: col.bg, size: 10.5, weight: 700, align: 'center' }); ctx.beginPath(); ctx.arc(x, y - 6, cw * 0.28, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); text(ctx, label, x, y - 6, { color: col.bg, size: 10, weight: 700, align: 'center' }); };
    const cx = (i) => x0 + (i + 1) * cw + cw / 2;
    if (step === 0) {
      ['UAC', 'GGA', 'UUC', 'CGU'].forEach((a, i) => { const x = x0 + cw * 0.5 + i * (cw * 1.2); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(x - 18, t0 + 70); ctx.lineTo(x + 18, t0 + 70); ctx.lineTo(x + 12, t0 + 112); ctx.lineTo(x - 12, t0 + 112); ctx.closePath(); ctx.fill(); text(ctx, a, x, t0 + 104, { color: col.bg, size: 10, weight: 700, align: 'center' }); ctx.beginPath(); ctx.arc(x, t0 + 56, 12, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); text(ctx, aa[i], x, t0 + 56, { color: col.bg, size: 9.5, weight: 700, align: 'center' }); });
      text(ctx, 'tRNA with its amino acid (anticodon at the bottom)', w / 2, t0 + 128 - 8 - 0, { color: col.muted, size: 10.5, align: 'center' });
    } else {
      const rx = cx(pIdx);
      if (step >= 2) { ctx.beginPath(); ctx.ellipse(rx, yM - 52, cw * 1.5, 36, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'large subunit', rx, yM - 70, { color: col.muted, size: 10.5, align: 'center' }); }
      ctx.beginPath(); ctx.ellipse(rx, yM + 36, cw * 1.5, 18, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'small subunit', rx, yM + 48, { color: col.muted, size: 10, align: 'center' });
      if (step >= 2) { ['E', 'P', 'A'].forEach((s, k) => text(ctx, s, cx(pIdx) + (k - 1) * cw, yM - 44, { color: col.ink, size: 12, weight: 700, align: 'center' })); }
      if (step === 1) trna(0, cx(0), yM - 40, col.s[0], 'Met');
      if (step === 2) trna(0, cx(0), yM - 36, col.s[0], 'Met');
      if (step === 3) { trna(0, cx(0), yM - 36, col.s[0], 'Met'); trna(1, cx(1), yM - 36, col.s[0], 'Pro'); line(ctx, [[cx(0) + 8, yM - 40], [cx(1) - 8, yM - 40]], col.s[3], 5); }
      if (step === 4) { trna(1, cx(1), yM - 36, col.s[0], 'chain'); ctx.globalAlpha = 0.45; trna(0, cx(0), yM - 36, col.s[0], '—'); ctx.globalAlpha = 1; text(ctx, 'leaves', cx(0), yM - 94, { color: col.muted, size: 10, align: 'center' }); arrow(ctx, cx(0), yM - 88, cx(0) - 16, yM - 102, col.muted, 1.5, 6); }
      if (step === 5) { trna(3, cx(3), yM - 36, col.s[0], 'chain'); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(cx(4), yM - 34, 16, 0, 7); ctx.fill(); text(ctx, 'RF', cx(4), yM - 34, { color: col.bg, size: 11, weight: 700, align: 'center' }); text(ctx, 'Met - Pro - Lys - Ala', w / 2, yM + 78, { color: col.s[2], size: 13, weight: 700, align: 'center' }); text(ctx, 'released polypeptide', w / 2, yM + 94, { color: col.muted, size: 10.5, align: 'center' }); }
    }
    if (step >= 1 && step <= 4) text(ctx, ['', 'initiator tRNA at the start codon', 'ribosome ready: sites E, P, A', 'peptide bond: Met-Pro', 'next codon: AAG (Lys)'][step], w / 2, yM + 78, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
    wrap(ctx, NOTE[step], 12, h - 64, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
