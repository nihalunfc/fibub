// Class 10 How do Organisms Reproduce? (step player): DNA copying. The double helix unzips (A pairs with T, C with G),
// each strand collects matching bases to make a new partner strand, and the two copies are almost identical. The enzymes
// are very accurate but sometimes put in a wrong base: that copy carries a small change (variation).
import { canvas, text, title, line, dot, loop } from '../../kit.js';

const TOP = 'ATCGGATC', PAIR = { A: 'T', T: 'A', C: 'G', G: 'C' };
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'DNA unzipping and each strand making a copy, with one small copying error' });
  const TITLES = ['One DNA molecule', 'The two strands unzip', 'New bases line up on each strand', 'Two new molecules, each half old, half new', 'Sometimes a wrong base slips in', 'That copy is slightly different: variation'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 14, n = TOP.length, gx = (w - 40) / n, x0 = 28;
    const colr = { A: col.s[0], T: col.s[1], C: col.s[2], G: col.s[3] };
    const base = (b, x, y, c, wrong) => { ctx.fillStyle = c; ctx.fillRect(x - 12, y - 11, 24, 22); if (wrong) { ctx.strokeStyle = col.bad || col.ink; ctx.lineWidth = 3; ctx.strokeRect(x - 13, y - 12, 26, 24); } text(ctx, b, x, y, { color: col.panel, size: 13, weight: 700, align: 'center' }); };
    const gap = step === 0 ? 0 : Math.min(1, step === 1 ? Math.min(1, t * 1.2) : 1);
    const mid = top + (h - top - 40) / 2, sep = 36 * gap + 3;
    // original strands
    const yA = step < 3 ? mid - sep : top + 20, yB = step < 3 ? mid + sep : top + 20 + 26;
    const place = step >= 3 ? 1 : 0;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * gx;
      if (step < 3) {
        base(TOP[i], x, yA, colr[TOP[i]]); base(PAIR[TOP[i]], x, yB, colr[PAIR[TOP[i]]]);
        line(ctx, [[x - 12, yA - 14], [x + 12, yA - 14]], col.muted, 2); line(ctx, [[x - 12, yB + 14], [x + 12, yB + 14]], col.muted, 2);
        if (step === 0) line(ctx, [[x, yA + 11], [x, yB - 11]], col.line, 3, [2, 3]);
      }
      if (step === 2) {
        const k = Math.min(1, Math.max(0, t * 1.6 - i * 0.15));
        base(PAIR[TOP[i]], x, yA + 28 * (1 - k) * -1 - 34 * k, colr[PAIR[TOP[i]]]);
        base(TOP[i], x, yB + 34 * k, colr[TOP[i]]);
      }
    }
    if (step >= 3) {
      const err = step >= 4 ? 4 : -1, y1 = top + 20, y2 = y1 + 26, y3 = y2 + 54, y4 = y3 + 26;
      text(ctx, 'Copy 1: exact', 6, y1 - 20, { color: col.muted, size: 10.5, weight: 700 });
      for (let i = 0; i < n; i++) { const x = x0 + i * gx; base(TOP[i], x, y1, colr[TOP[i]]); base(PAIR[TOP[i]], x, y2, colr[PAIR[TOP[i]]]); }
      text(ctx, step >= 4 ? 'Copy 2: one wrong base' : 'Copy 2: exact', 6, y3 - 20, { color: col.muted, size: 10.5, weight: 700 });
      for (let i = 0; i < n; i++) { const x = x0 + i * gx, wrong = i === err; const b = wrong ? 'G' : TOP[i]; base(b, x, y3, colr[b], wrong); base(PAIR[TOP[i]], x, y4, colr[PAIR[TOP[i]]]); }
      if (step >= 4) text(ctx, 'A pairs with T and C with G, so this mismatch is a change', w / 2, y4 + 28, { color: col.ink, size: 10.5, align: 'center' });
      if (step === 5) text(ctx, 'A different protein may follow: a different trait', w / 2, y4 + 44, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    }
    if (step < 3) text(ctx, 'A ↔ T and C ↔ G always pair', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
