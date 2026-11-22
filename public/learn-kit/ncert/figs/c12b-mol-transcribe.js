// Class 12 Molecular Basis of Inheritance (step player): transcription. RNA polymerase binds the promoter, opens the DNA and builds mRNA 5' to 3' on the template strand
// (A pairs with U in RNA), stops at the terminator; in eukaryotes the primary transcript (hnRNA) has introns removed by splicing, a cap added at 5' and a poly-A tail at 3'.
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Steps of transcription: initiation, elongation, termination, then splicing, capping and tailing in eukaryotes' });
  const T = ['Initiation at the promoter', 'Elongation: reading the template', 'Termination', 'Eukaryotes: the primary transcript (hnRNA)', 'Splicing removes introns', 'Cap and tail: mature mRNA'];
  const NOTE = ['RNA polymerase recognises the promoter (upstream of the gene) and unwinds a short stretch of DNA. Only one strand, the template (3′ to 5′), is read.',
    'The enzyme adds ribonucleotides that pair with the template: A with U, T with A, C with G, G with C. The mRNA grows 5′ to 3′ and falls away from the DNA.',
    'At the terminator the polymerase and the finished RNA let go; the DNA closes up again. Here the stop codon UAG is in the message.',
    'In a eukaryote the first RNA contains exons (coding) and introns (non-coding). It is called heterogeneous nuclear RNA, hnRNA.',
    'The introns are cut out and the exons are joined: splicing (done by the spliceosome, with RNA parts doing the cutting).',
    'A methylated guanosine cap is added at the 5′ end and a tail of about 200 adenines (poly-A) at the 3′ end. Now the mRNA leaves the nucleus.'];
  const tmpl = 'TACGGATTCCGTATC'.split(''), mrna = 'AUGCCUAAGGCAUAG'.split('');
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  const box = (ctx, x, y, ww, hh, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, ww, hh); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col);
    if (step <= 2) {
      const n = 15, gap = (w - 40) / n, x0 = 20, yT = t0 + 70, nm = step === 0 ? 0 : step === 1 ? 9 : 15, px = x0 + gap * (step === 0 ? 1.5 : step === 1 ? 9 : 14.5);
      text(ctx, "3'", 8, yT, { color: col.muted, size: 10, weight: 700 }); text(ctx, 'blue: template strand, read 3\u2032 to 5\u2032', w / 2, yT + 84, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
      tmpl.forEach((b, i) => { const x = x0 + gap * i; box(ctx, x + 1, yT - 11, gap - 2, 22, col.s[0]); text(ctx, b, x + gap / 2, yT, { color: col.bg, size: 12, weight: 700, align: 'center' }); const open = step > 0 && Math.abs(x + gap / 2 - px) < gap * 2.2 || (step === 1 && i < 9 && i > 5); box(ctx, x + 1, yT + 14 + (open ? 16 : 0), gap - 2, 22, col.s[1]); text(ctx, { T: 'A', A: 'T', G: 'C', C: 'G' }[b], x + gap / 2, yT + 25 + (open ? 16 : 0), { color: col.bg, size: 12, weight: 700, align: 'center' }); });
      for (let i = 0; i < nm; i++) { const x = x0 + gap * i; box(ctx, x + 1, yT - 44, gap - 2, 22, col.s[3]); text(ctx, mrna[i], x + gap / 2, yT - 33, { color: col.bg, size: 12, weight: 700, align: 'center' }); }
      ctx.beginPath(); ctx.ellipse(px, yT, gap * 1.6, 36, 0, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.stroke(); text(ctx, 'RNA polymerase', Math.min(px, w - 60), yT + 52, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
      if (step === 0) { ctx.fillStyle = col.s[4]; ctx.fillRect(x0, yT + 56, gap * 3, 4); text(ctx, 'promoter', x0, yT + 70, { color: col.muted, size: 10.5 }); }
      if (step >= 1) text(ctx, "5' mRNA", x0, yT - 56, { color: col.s[3], size: 10.5, weight: 700 });
      if (step === 2) text(ctx, 'terminator', w - 14, yT + 68, { color: col.muted, size: 10.5, align: 'right' });
    } else {
      const yy = t0 + 50, parts = [['E1', 40, 'e'], ['I1', 46, 'i'], ['E2', 50, 'e'], ['I2', 36, 'i'], ['E3', 46, 'e']], tot = parts.reduce((s, p) => s + p[1], 0), sc = (w - 70) / tot;
      let x = 30;
      if (step === 3) parts.forEach(([n, l, k]) => { box(ctx, x, yy, l * sc, 28, k === 'e' ? col.s[3] : col.line); text(ctx, n, x + l * sc / 2, yy + 14, { color: k === 'e' ? col.bg : col.ink, size: 12, weight: 700, align: 'center' }); x += l * sc; });
      if (step === 4) { parts.forEach(([n, l, k], i) => { const lift = k === 'i'; box(ctx, x, yy + (lift ? -8 : 0), l * sc, lift ? 14 : 28, lift ? col.line : col.s[3]); if (!lift) text(ctx, n, x + l * sc / 2, yy + 14, { color: col.bg, size: 12, weight: 700, align: 'center' }); else text(ctx, 'cut out', x + l * sc / 2, yy - 20, { color: col.muted, size: 10, align: 'center' }); x += l * sc; });
        const ex = parts.filter((p) => p[2] === 'e'), tt = ex.reduce((s, p) => s + p[1], 0); let x2 = 30; arrow(ctx, w / 2, yy + 34, w / 2, yy + 60, col.ink, 2, 8); ex.forEach(([n, l]) => { box(ctx, x2, yy + 70, l * sc, 28, col.s[3]); text(ctx, n, x2 + l * sc / 2, yy + 84, { color: col.bg, size: 12, weight: 700, align: 'center' }); x2 += l * sc; }); }
      if (step === 5) { const ex = parts.filter((p) => p[2] === 'e'); let x2 = 56; ctx.beginPath(); ctx.arc(40, yy + 14, 11, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); text(ctx, 'cap', 40, yy + 38, { color: col.muted, size: 10.5, align: 'center' }); ex.forEach(([n, l]) => { box(ctx, x2, yy, l * sc, 28, col.s[3]); text(ctx, n, x2 + l * sc / 2, yy + 14, { color: col.bg, size: 12, weight: 700, align: 'center' }); x2 += l * sc; }); for (let k = 0; k < 6; k++) { box(ctx, x2 + 4 + k * 8, yy + 4, 6, 20, col.s[1]); } text(ctx, 'AAAAA... (poly-A tail)', x2 + 4, yy + 38, { color: col.muted, size: 10.5 }); text(ctx, 'mature mRNA: exons only', w / 2, yy + 74, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
      if (step === 3) text(ctx, 'E = exon (kept)    I = intron (removed)', w / 2, yy + 52, { color: col.muted, size: 11, align: 'center' });
    }
    wrap(ctx, NOTE[step], 12, h - 62, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
