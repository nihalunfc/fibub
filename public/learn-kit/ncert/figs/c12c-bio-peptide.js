// Class 12 Chemistry, Biomolecules: how a peptide bond forms between two amino acids (step player). The -COOH of one amino acid and the -NH2 of the next join with loss of water: -CO-NH-, an amide link.
// The peptide bond is planar with partial double-bond character (C-N about 132 pm, between a single 147 pm and a double 127 pm bond), which is why peptide groups cannot rotate and proteins fold in set ways.
// A chain of n amino acids has n - 1 peptide bonds, an N-terminus (free NH2) and a C-terminus (free COOH). Gly-Ala is a dipeptide.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['Two amino acids', 'Bring the ends together', 'Water is lost', 'The peptide bond', 'A chain grows'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.86, max: 380, min: 310, label: 'Two amino acids joining by a peptide bond and releasing water' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), e = ease(t), cy = top + (h - top) * 0.32, cx = w / 2;
    const box = (s, x, y, c, mw = 0) => { ctx.font = '700 12px system-ui'; const tw = Math.max(mw, ctx.measureText(s).width + 14); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 14, tw, 28, 7); ctx.fill(); ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: 12, weight: 700, align: 'center' }); };
    const N = (a, b) => { text(ctx, a, cx, h - 40, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, cx, h - 22, { color: col.muted, size: 11, align: 'center' }); };
    const gap = step === 0 ? 60 : step === 1 ? 60 - 56 * e : 0;
    if (step <= 1) {
      const xL = cx - 74 - gap / 2, xR = cx + 74 + gap / 2;
      box('H₂N–CH₂–COOH', xL, cy, col.s[0], 112); box('H₂N–CH(CH₃)–COOH', xR, cy + 0, col.s[1], 122);
      text(ctx, 'glycine', xL, cy - 28, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'alanine', xR, cy - 28, { color: col.muted, size: 10.5, align: 'center' });
      ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.18; ctx.fillRect(xL + 20, cy - 12, 36, 24); ctx.fillRect(xR - 80, cy - 12, 26, 24); ctx.globalAlpha = 1;
    }
    if (step === 0) N('Glycine and alanine. The orange parts are the –COOH of one and the –NH₂ of the other.', 'Each amino acid has an acidic end (COOH) and a basic end (NH₂).');
    if (step === 1) { text(ctx, 'COOH of Gly meets NH₂ of Ala', cx, cy + 40, { color: col.s[3], size: 11.5, align: 'center' }); N('The two molecules approach: acid end to amine end.', 'The N-terminus (NH₂) stays at the far left, the C-terminus at the far right.'); }
    if (step === 2) { box('H₂N–CH₂–CO', cx - 56, cy, col.s[0], 110); box('HN–CH(CH₃)–COOH', cx + 74, cy, col.s[1], 118); const wy = cy + 30 + 60 * e; ctx.globalAlpha = 1; box('H₂O', cx + 4, wy, col.s[3], 44); arrow(ctx, cx + 4, cy + 18, cx + 4, wy - 18, col.s[3], 2, 8); N('The OH of the acid and an H of the amine leave as water.', 'This is a condensation reaction: two molecules join and a small one is lost.'); }
    if (step >= 3) {
      const s3 = step === 4;
      const xs = s3 ? [cx - 120, cx - 40, cx + 40, cx + 120] : [cx - 50, cx + 50]; const names = ['Gly', 'Ala', 'Ser', 'Val'];
      xs.forEach((x, i) => { ctx.fillStyle = col.soft; ctx.strokeStyle = [col.s[0], col.s[1], col.s[2], col.s[4]][i]; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 26, cy - 22, 52, 44, 10); ctx.fill(); ctx.stroke(); text(ctx, names[i], x, cy, { color: col.ink, size: 13, weight: 700, align: 'center' }); if (i) { const xm = (xs[i - 1] + x) / 2, hw = (x - xs[i - 1]) / 2 - 26; ctx.fillStyle = col.s[3]; ctx.fillRect(xm - hw - 2, cy - 4, 2 * hw + 4, 8); text(ctx, 'CO–NH', xm, cy - 33, { color: col.s[3], size: 9.5, weight: 700, align: 'center' }); } });
      text(ctx, 'N-terminus', xs[0], cy + 38, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'C-terminus', xs[xs.length - 1], cy + 38, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, s3 ? '4 amino acids  →  3 peptide bonds  →  3 H₂O lost' : 'Gly–Ala: a dipeptide with one peptide bond', cx, cy + 72, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      if (step === 3) N('The –CO–NH– link is the peptide bond (an amide).', 'It is flat and partly double-bonded, so it cannot rotate freely.'); else N('Repeat: n amino acids make n − 1 peptide bonds.', 'A chain of more than about 50 amino acids is a protein; shorter chains are peptides.');
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
