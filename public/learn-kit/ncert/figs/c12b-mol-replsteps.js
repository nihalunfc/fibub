// Class 12 Molecular Basis of Inheritance (step player): semi-conservative DNA replication at the fork. Helicase opens the helix; primase lays RNA primers; DNA polymerase
// extends only 5' to 3', so one new strand (leading) is continuous and the other (lagging) is made in Okazaki fragments joined by ligase. Each daughter keeps one old strand.
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Steps of DNA replication at a replication fork: unwinding, primers, leading and lagging strand, ligase' });
  const T = ['Parent DNA: two old strands', 'Helicase opens the fork', 'Primers and the leading strand', 'The lagging strand: Okazaki fragments', 'Ligase joins: two daughter DNAs'];
  const NOTE = ["Two antiparallel strands, held by hydrogen bonds between bases.", "Helicase breaks the hydrogen bonds. Each old strand is now a template. Single-strand binding proteins keep them apart; topoisomerase relieves the twisting.", "Primase adds a short RNA primer. DNA polymerase adds nucleotides only in the 5' to 3' direction, so on this template it runs smoothly toward the fork opening: continuous.", "On the other template polymerase must run away from the fork. It copies a short piece, then another: Okazaki fragments (about 1000-2000 bases in bacteria), each with its own primer.", "Primers are replaced by DNA and ligase seals the gaps. Each daughter molecule holds one old strand and one new strand: semi-conservative."];
  const wrap = (ctx, s, x, y, wd, col) => { const ws = s.split(' '); let l = '', yy = y; ws.forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), fx = step === 0 ? w - 14 : w * 0.34, cy = t0 + 90, old1 = col.s[0], old2 = col.s[1], nw = col.s[3], gap = 5;
    const arm = (sgn, c) => { const ex = w - 14, ey = cy + sgn * (step === 0 ? 0 : 62); return [[fx, cy + sgn * gap], [ex, step === 0 ? cy + sgn * gap : ey + sgn * 0]]; };
    // parent
    line(ctx, [[14, cy - gap], [fx, cy - gap]], old1, 4); line(ctx, [[14, cy + gap], [fx, cy + gap]], old2, 4);
    for (let x = 22; x < fx - 6; x += 12) line(ctx, [[x, cy - gap], [x, cy + gap]], col.muted, 1.2);
    if (step >= 1) {
      const ux = w - 20, uy = 64;
      line(ctx, [[fx, cy - gap], [ux, cy - uy]], old1, 4); line(ctx, [[fx, cy + gap], [ux, cy + uy]], old2, 4);
      text(ctx, "3'", 10, cy - gap - 10, { color: col.muted, size: 10, weight: 700 }); text(ctx, "5'", 10, cy + gap + 12, { color: col.muted, size: 10, weight: 700 });
      ctx.beginPath(); ctx.arc(fx, cy, 9, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); text(ctx, 'helicase', fx - 2, cy + 22, { color: col.muted, size: 10.5, align: 'center' });
      const nwLine = (sgn, f0, f1, dash, c) => { const P = (f) => [fx + (ux - fx) * f, cy + sgn * (gap + (uy - gap) * f)]; const a = P(f0), b = P(f1); line(ctx, [[a[0], a[1] + sgn * 7], [b[0], b[1] + sgn * 7]], c, 3.5, dash); };
      if (step >= 2) { nwLine(-1, 0.05, 0.95, null, nw); const px = fx + (ux - fx) * 0.95, py = cy - (gap + (uy - gap) * 0.95) - 7; arrow(ctx, px - 14, py + 2, px + 6, py - 2, nw, 2, 7); text(ctx, step === 4 ? 'daughter DNA 1: old blue + new' : 'leading strand (continuous)', fx + (ux - fx) * 0.5 - 6, cy - 78, { color: nw, size: 10.5, weight: 700, align: 'center' }); ctx.fillStyle = col.s[4]; ctx.fillRect(fx + 6, cy - 11 - 7, 9, 5); }
      if (step >= 3) {
        const segs = [[0.1, 0.3], [0.36, 0.56], [0.62, 0.82]];
        segs.forEach(([a, b], i) => { nwLine(1, a, b, null, step === 3 ? nw : nw); if (step === 3) { const P = (f) => [fx + (ux - fx) * f, cy + gap + (uy - gap) * f + 7]; ctx.fillStyle = col.s[4]; ctx.fillRect(P(a)[0] - 4, P(a)[1] - 3, 8, 6); } });
        if (step === 4) { nwLine(1, 0.08, 0.84, null, nw); }
        text(ctx, step === 3 ? 'lagging strand (Okazaki fragments)' : 'daughter DNA 2: old red + new', fx + (ux - fx) * 0.5 - 6, cy + 80, { color: nw, size: 10.5, weight: 700, align: 'center' });
      }
      if (step === 3) text(ctx, 'RNA primers (small boxes)', fx + (ux - fx) * 0.5, cy + 96, { color: col.muted, size: 10, align: 'center' });
    }
    wrap(ctx, NOTE[step], 12, h - 58, w - 24, col);
    const lg = [[old1, 'old strand 1'], [old2, 'old strand 2'], [nw, 'new DNA']]; lg.forEach(([c, l], i) => { ctx.fillStyle = c; ctx.fillRect(10 + i * 92, h - 78, 14, 5); text(ctx, l, 28 + i * 92, h - 75, { color: col.muted, size: 10 }); });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
