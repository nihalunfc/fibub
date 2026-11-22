// Class 12 Biology, Biotechnology and its Applications (step player): RNA interference (RNAi) against a root-knot nematode (Meloidogyne incognitia)
// in tobacco. Genes made sense and antisense RNA of a nematode gene in the host cell. The two RNAs are complementary and pair into double-stranded RNA,
// which makes the cell destroy the matching mRNA of the nematode, so it cannot make its protein and the parasite dies.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A tobacco root cell making sense and antisense RNA that pair up and stop the mRNA of a nematode from making protein' });
  const TITLES = ['1. The problem: a root nematode', '2. Genes for sense and antisense RNA', '3. The two RNAs form double-stranded RNA', '4. The matching mRNA is destroyed', '5. The parasite fails; the plant is protected'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 8, cx = w / 2, S = (s, x, y, c = col.ink, al = 'center', sz = 11, wt = 400) => text(ctx, s, x, y, { color: c, size: sz, weight: wt, align: al });
    ctx.fillStyle = col.soft; ctx.fillRect(14, top, w - 28, 150); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(14, top, w - 28, 150); S('tobacco root cell', 22, top + 10, col.muted, 'left', 10);
    const wave = (x0, x1, y, c, wd = 3) => { const p = []; for (let x = x0; x <= x1; x += 3) p.push([x, y + Math.sin((x - x0) / 5) * 3]); line(ctx, p, c, wd); };
    const ny = top + 200;
    const nem = (x, y, c) => { ctx.lineWidth = 7; ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.bezierCurveTo(x - 20, y - 14, x + 10, y + 14, x + 40, y - 4); ctx.stroke(); dot(ctx, x + 40, y - 4, 4, c); };
    if (st === 0) { nem(cx, ny + 10, col.bad); S('Meloidogyne incognitia', cx, ny + 36, col.bad, 'center', 11, 700); S('infects the roots and feeds on them', cx, ny + 52, col.ink); S('(It is the nematode that damages tobacco roots)', cx, ny + 68, col.muted, 'center', 10.5); S('no dsRNA yet', cx, top + 76, col.muted); }
    if (st >= 1) { wave(30, w - 30, top + 44, col.s[0]); S('sense RNA (copy of a nematode gene)', cx, top + 28, col.s[0], 'center', 10.5, 700); wave(30, w - 30, top + 112, col.s[2]); S('antisense RNA (its complement)', cx, top + 132, col.s[2], 'center', 10.5, 700); }
    if (st >= 2) { for (let x = 38; x < w - 36; x += 9) line(ctx, [[x, top + 48], [x, top + 108]], col.good, 1.5); text(ctx, 'double-stranded RNA (dsRNA)', cx, top + 78, { color: col.good, size: 11, weight: 800, align: 'center', halo: col.soft }); }
    if (st >= 3) { nem(cx, ny + 10, col.bad); wave(cx - 60, cx + 60, ny - 22, col.bad, 3); S('mRNA of the nematode gene', cx, ny - 36, col.bad, 'center', 10.5, 700); line(ctx, [[cx - 24, ny - 30], [cx + 24, ny - 12]], col.ink, 4); line(ctx, [[cx + 24, ny - 30], [cx - 24, ny - 12]], col.ink, 4); }
    if (st === 3) S('dsRNA silences it: the mRNA is cut up (RNA interference)', cx, ny + 50, col.ink, 'center', 11, 700);
    if (st === 4) { S('No protein is made from that mRNA. The nematode', cx, ny + 40, col.ink); S('cannot grow in the root and the plant yield is saved.', cx, ny + 56, col.ink); S('This is RNAi: silencing a gene with matching RNA.', cx, ny + 76, col.muted, 'center', 10.5); }
    if (st === 1) S('The vector brings in genes that make both RNAs.', cx, ny - 10, col.ink);
    if (st === 2) S('Because they are complementary, the two RNAs stick together.', cx, ny - 10, col.ink);
    void arrow;
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
