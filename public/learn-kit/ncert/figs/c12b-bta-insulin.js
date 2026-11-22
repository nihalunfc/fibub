// Class 12 Biology, Biotechnology and its Applications (step player): human insulin from bacteria. In the body, insulin is first made as
// proinsulin (A chain, C peptide, B chain); the C peptide is cut off and A and B stay joined by two disulphide bridges. Bacteria cannot do that
// maturation, so in the first method (Eli Lilly, 1983) the genes for the A chain (21 amino acids) and the B chain (30) were put in separate plasmids,
// made in separate E. coli cultures, then the chains were extracted and joined by disulphide bonds to give active insulin.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Insulin chains: proinsulin with its C peptide, mature insulin, and the bacterial method making chains A and B separately' });
  const TITLES = ['1. Proinsulin in the body', '2. Mature insulin in the body', '3. The rDNA idea: two genes, two plasmids', '4. Two bacterial cultures', '5. Mix the chains: human insulin'];
  const chain = (ctx, x, y, n, c, wavy, sp = 5.2) => { const pts = []; for (let i = 0; i < n; i++) pts.push([x + i * sp, y + (wavy ? Math.sin(i * 0.9) * 4 : 0)]); line(ctx, pts, c, 2); pts.forEach((p) => dot(ctx, p[0], p[1], 2.2, c)); return pts; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 14, k = Math.min(1, (w - 40) / 340), cx = 20;
    const S = (s, x, y, c = col.ink, al = 'left', sz = 11, wt = 400) => text(ctx, s, x, y, { color: c, size: sz, weight: wt, align: al });
    if (st === 0) {
      const sp = Math.min(3.6, (w - 44) / 84), x1 = cx + 30 * sp + 3, x2 = x1 + 31 * sp + 3;
      chain(ctx, cx, top + 30, 30, col.s[2], true, sp); chain(ctx, x1, top + 30, 31, col.muted, true, sp); chain(ctx, x2, top + 30, 21, col.s[0], true, sp);
      S('B chain (30)', cx, top + 10, col.s[2], 'left', 10.5, 700); S('C peptide (31)', x1, top + 52, col.muted, 'left', 10.5, 700); S('A chain (21)', x2 - 4, top + 10, col.s[0], 'left', 10.5, 700);
      S('Proinsulin is one long chain: B, then the C peptide, then A.', w / 2, top + 100, col.ink, 'center'); S('It cannot work until the C peptide is cut out.', w / 2, top + 118, col.ink, 'center'); S('(A has 21 amino acids and B has 30 in the final insulin.)', w / 2, top + 140, col.muted, 'center', 10.5);
    } else if (st === 1) {
      chain(ctx, cx + 60, top + 24, 21, col.s[0], true); chain(ctx, cx + 60, top + 70, 30, col.s[2], true);
      [[cx + 60 + 5.2 * 6, top + 24, cx + 60 + 5.2 * 7, top + 70], [cx + 60 + 5.2 * 19, top + 24, cx + 60 + 5.2 * 20, top + 70]].forEach(([x0, y0, x1, y1]) => line(ctx, [[x0, y0 + 3], [x1, y1 - 3]], col.bad, 2.5));
      S('A chain', cx + 4, top + 24, col.s[0], 'left', 11, 700); S('B chain', cx + 4, top + 70, col.s[2], 'left', 11, 700); S('two disulphide bridges', cx + 60 + 5.2 * 25, top + 47, col.bad, 'left', 10.5, 700);
      S('The C peptide has been cut away. A and B are held together', w / 2, top + 130, col.ink, 'center'); S('by disulphide bridges: this is mature, active insulin.', w / 2, top + 146, col.ink, 'center');
    } else if (st === 2 || st === 3) {
      const pl = (x, y, c, lab, grow) => { ctx.lineWidth = 3; ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, 26, 0, 7); ctx.stroke(); S(lab, x, y, c, 'center', 11, 700); if (grow) for (let i = 0; i < 7; i++) dot(ctx, x - 40 + (i % 4) * 26, y + 54 + Math.floor(i / 4) * 16, 5, c); };
      pl(w * 0.27, top + 44, col.s[0], 'gene A', st === 3); pl(w * 0.73, top + 44, col.s[2], 'gene B', st === 3);
      S('plasmid 1', w * 0.27, top + 82, col.muted, 'center', 10); S('plasmid 2', w * 0.73, top + 82, col.muted, 'center', 10);
      if (st === 2) { S('Make DNA copies of the gene for the A chain', w / 2, top + 120, col.ink, 'center'); S('and of the gene for the B chain; ligate each into', w / 2, top + 136, col.ink, 'center'); S('its own plasmid.', w / 2, top + 152, col.ink, 'center'); }
      else { S('E. coli with plasmid 1 makes only A chain.', w / 2, top + 160, col.s[0], 'center', 11, 700); S('E. coli with plasmid 2 makes only B chain.', w / 2, top + 176, col.s[2], 'center', 11, 700); S('(Each culture grows in its own bioreactor.)', w / 2, top + 192, col.muted, 'center', 10.5); }
    } else {
      chain(ctx, cx + 60, top + 24, 21, col.s[0], true); chain(ctx, cx + 60, top + 70, 30, col.s[2], true);
      [[6, 7], [19, 20]].forEach(([a, b]) => line(ctx, [[cx + 60 + 5.2 * a, top + 27], [cx + 60 + 5.2 * b, top + 67]], col.good, 3));
      S('A chain', cx + 4, top + 24, col.s[0], 'left', 11, 700); S('B chain', cx + 4, top + 70, col.s[2], 'left', 11, 700);
      S('Extract chains A and B, purify them and mix. Disulphide', w / 2, top + 120, col.ink, 'center'); S('bonds form between them: human insulin, made by bacteria.', w / 2, top + 136, col.ink, 'center'); S('(1983, Eli Lilly, a US company)', w / 2, top + 152, col.muted, 'center', 10.5);
    }
    void k;
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
