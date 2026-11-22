// DNA to RNA to protein as a step player: transcription copies the template strand into mRNA, then a ribosome reads
// the mRNA three letters (one codon) at a time and a tRNA brings each amino acid until a stop codon ends the chain.
import { text, title } from '../kit.js';
import { stepper, mix, CODON } from './_bio-kit.js';

const TEMPLATE = "TACCACGTGGAAATT".split(''), COMP = { T: 'A', A: 'U', C: 'G', G: 'C' };
const MRNA = TEMPLATE.map((b) => COMP[b]);
const NAMES = ['The gene (DNA)', 'Transcription', 'mRNA ready', 'Translation: start codon', 'Translation: elongation', 'Termination'];

export default function (host) {
  return stepper(host, { aspect: 0.95, max: 400, min: 320, stages: 6, label: 'DNA transcribed into mRNA, then translated by a ribosome into a short peptide' }, (ctx, w, h, col, st, k, t, pv) => {
    const x0 = 14, dx = (w - 28) / 15, yD = h * 0.22, yR = h * 0.42;
    title(ctx, NAMES[st], col);
    const lt = (s, x, y, c, sz = 12) => text(ctx, s, x, y, { color: c, size: sz, weight: 700, align: 'center' });
    // template DNA (and coding strand above it)
    TEMPLATE.forEach((b, i) => { lt(b, x0 + dx * (i + 0.5), yD, col.s[0]); lt({ T: 'A', A: 'T', C: 'G', G: 'C' }[b], x0 + dx * (i + 0.5), yD - 22, col.muted); });
    text(ctx, "3'", 2, yD, { color: col.muted, size: 9 }); text(ctx, 'template', w - 6, yD + 16, { color: col.s[0], size: 10, align: 'right' });
    // how much mRNA is built
    const prog = (s) => (s <= 0 ? 0 : s === 1 ? 0.5 : 1), n = Math.round(15 * mix(prog(pv), prog(st), k));
    const rnaY = st >= 3 ? yR : yD + 26 + (st === 2 ? k * (yR - yD - 26) : 0), yy = st === 1 || (st === 2 && pv === 1) ? yD + 24 : rnaY;
    MRNA.slice(0, st >= 1 ? Math.max(n, st === 1 ? 1 : n) : 0).forEach((b, i) => lt(b, x0 + dx * (i + 0.5), pv >= 2 || st >= 3 ? rnaY : yy, col.s[1]));
    if (st === 1) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.6; ctx.fillRect(x0 + dx * Math.max(0, n - 2.5), yD - 10, dx * 4, 40); ctx.globalAlpha = 1; text(ctx, 'RNA polymerase', x0 + dx * Math.max(0, n - 2.5), yD + 46, { color: col.s[3], size: 10.5, weight: 600 }); }
    if (st >= 2) text(ctx, "mRNA 5' (A pairs with U, C with G)", 8, rnaY - 18, { color: col.s[1], size: 10.5, weight: 600, fit: true });
    if (st >= 3) {
      const codon = st === 3 ? 0 : st === 4 ? 2 : 4, cxp = Math.min(w - x0 - dx * 3, x0 + dx * (codon * 3 + 1.5));
      ctx.fillStyle = col.soft; ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cxp - dx * 3, rnaY + 28, dx * 6, 48, 10); ctx.fill(); ctx.stroke();
      text(ctx, 'ribosome', cxp, rnaY + 52, { color: col.muted, size: 10.5, align: 'center' });
      // codons under the mRNA and the tRNAs
      for (let c = 0; c < 5; c++) { const cod = MRNA.slice(c * 3, c * 3 + 3).join(''); text(ctx, cod, x0 + dx * (c * 3 + 1.5), rnaY + 14, { color: c === codon ? col.ink : col.muted, size: 11, weight: c === codon ? 700 : 400, align: 'center' }); }
      const done = st === 3 ? 0 : st === 4 ? 2 : 4;
      const yA = rnaY + 100;
      for (let c = 0; c <= done; c++) {
        const aa = CODON[MRNA.slice(c * 3, c * 3 + 3).join('')], stop = aa === 'Stop';
        const bx = x0 + 22 + c * ((w - 50) / 5);
        if (stop) { text(ctx, 'STOP: release factor', bx - 8, yA - 8, { color: col.bad, size: 11, weight: 700 }); continue; }
        ctx.beginPath(); ctx.arc(bx, yA, 15, 0, 7); ctx.fillStyle = [col.s[0], col.s[2], col.s[3], col.s[4], col.s[5]][c]; ctx.fill();
        text(ctx, aa, bx, yA, { color: '#fff', size: 11, weight: 700, align: 'center' });
        if (c > 0) { ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - ((w - 50) / 5) + 15, yA); ctx.lineTo(bx - 15, yA); ctx.stroke(); }
      }
      text(ctx, st === 5 ? 'Finished peptide: Met-Val-His-Leu' : 'growing peptide chain (peptide bonds)', 10, yA + 34, { color: col.ink, size: 11.5, weight: 600 });
    }
    if (st === 0) text(ctx, 'Top row: the coding strand. Bottom row: the template strand the enzyme reads.', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
  });
}
