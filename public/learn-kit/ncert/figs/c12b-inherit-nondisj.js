// Class 12 Biology, Principles of Inheritance and Variation (step player): non-disjunction. In meiosis the two chromosomes of a homologous pair normally go to
// different cells. If both go to the same cell (non-disjunction) two gametes get an extra chromosome (n+1) and two lack it (n-1). With a normal gamete from the
// other parent the zygote is 2n+1 (trisomy, e.g. Down syndrome = trisomy 21, Klinefelter XXY) or 2n-1 (monosomy, e.g. Turner XO).
import { canvas, text, title, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Steps of non-disjunction from a cell with one chromosome pair to gametes with an extra or a missing chromosome' });
  const T = ['A cell with one pair of homologous chromosomes', 'Normal meiosis: each gamete gets one', 'Non-disjunction: both go to one cell', 'Gametes: two with n + 1, two with n − 1', 'Fertilisation with a normal gamete'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 6, cx = w / 2, cy = top + (h - top) * 0.4;
    const rod = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x - 4, y - 14, 8, 28); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x - 4, y - 14, 8, 28); };
    const cell = (x, y, r, rods, lab) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke(); rods.forEach((c, i) => rod(x + (i - (rods.length - 1) / 2) * 12, y, c)); if (lab) text(ctx, lab, x, y + r + 12, { color: col.ink, size: 10.5, weight: 600, align: 'center' }); };
    const A = col.s[0], B = col.s[3], L = (s, x, y, c = col.muted) => text(ctx, s, x, y, { color: c, size: 10.5, weight: 600, align: 'center' });
    if (step === 0) { cell(cx, cy, 40, [A, B], 'one pair (2 chromosomes), 2n'); L('one from each parent: blue and orange', cx, cy + 82); }
    if (step === 1) { cell(cx, cy - 20, 24, [A, B]); arrow(ctx, cx - 10, cy + 6, cx - 50, cy + 36, col.ink, 1.5, 6); arrow(ctx, cx + 10, cy + 6, cx + 50, cy + 36, col.ink, 1.5, 6); cell(cx - 56, cy + 62, 18, [A], 'n'); cell(cx + 56, cy + 62, 18, [B], 'n'); L('anaphase I: homologues separate', cx, cy - 56, col.ink); L('each gamete (after meiosis II) has one of the pair', cx, h - 12); }
    if (step === 2) { cell(cx, cy - 20, 24, [A, B]); arrow(ctx, cx - 10, cy + 6, cx - 50, cy + 36, col.bad, 1.5, 6); arrow(ctx, cx + 10, cy + 6, cx + 50, cy + 36, col.bad, 1.5, 6); cell(cx - 56, cy + 62, 22, [A, B], 'both chromosomes'); cell(cx + 56, cy + 62, 18, [], 'none'); L('the pair fails to separate (non-disjunction)', cx, cy - 56, col.bad); L('meiosis II then splits the chromatids as usual', cx, h - 12); }
    if (step === 3) { [[-100, [A, B], 'n + 1'], [-34, [A, B], 'n + 1'], [34, [], 'n − 1'], [100, [], 'n − 1']].forEach(([dx, r, s]) => cell(cx + dx, cy + 10, 26, r, s)); L('4 gametes: 2 have an extra chromosome, 2 lack one', cx, cy - 40, col.ink); L('(non-disjunction at meiosis I; at meiosis II fewer are affected)', cx, h - 12); }
    if (step === 4) { cell(cx - 80, cy - 4, 24, [A, B], 'n + 1'); text(ctx, '+', cx - 40, cy - 4, { color: col.ink, size: 18, align: 'center' }); cell(cx - 4, cy - 4, 18, [col.s[2]], 'normal n'); text(ctx, '→', cx + 28, cy - 4, { color: col.ink, size: 18, align: 'center' }); cell(cx + 80, cy - 4, 32, [A, B, col.s[2]], '2n + 1'); L('trisomy: e.g. Down syndrome (21), Klinefelter (XXY)', cx, cy + 66, col.ink); L('an n − 1 gamete + normal gamete gives 2n − 1, monosomy: Turner syndrome (XO)', cx, cy + 84); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
