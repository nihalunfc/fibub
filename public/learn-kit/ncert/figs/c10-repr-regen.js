// Class 10 How do Organisms Reproduce? (step player): regeneration in Planaria. If the flatworm is cut into pieces, each
// piece can regrow the missing parts, because cells near the cut divide and then specialise into the needed tissues.
// Regeneration is not the same as reproduction in every organism, but in Planaria each piece becomes a complete worm.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A planarian flatworm cut into three pieces, each regrowing into a worm' });
  const TITLES = ['A planarian (flatworm)', 'Cut into three pieces', 'Cells at each cut start to divide', 'Each piece regrows what is missing', 'Three complete worms'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 12, L = w - 80, wid = 26, x0 = 40, rowH = (h - top - 36) / 3;
    const pill = (xa, xb, y, fillA = 0.35, edgeL = false, edgeR = false) => { const r = wid / 2; ctx.save(); ctx.globalAlpha = fillA; ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.roundRect(xa, y - r, xb - xa, wid, r); ctx.fill(); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.roundRect(xa, y - r, xb - xa, wid, r); ctx.stroke(); };
    const eyes = (x, y, dir, a = 1) => { ctx.save(); ctx.globalAlpha = a; dot(ctx, x + dir * 8, y - 5, 3, col.panel, col.ink); dot(ctx, x + dir * 8, y + 5, 3, col.panel, col.ink); ctx.restore(); };
    const g = step === 3 ? Math.min(1, t / 2.2) : step === 4 ? 1 : 0, ranges = [[0, 0.34], [0.36, 0.66], [0.68, 1]];
    if (step === 0) { const y = top + 60; pill(x0, x0 + L, y); eyes(x0 + 4, y, 1); text(ctx, 'head', x0 + 14, y - 28, { color: col.muted, size: 10.5 }); text(ctx, 'tail', x0 + L - 14, y - 28, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'It lives in ponds and streams. Its cells can become any tissue it needs.', w / 2, y + 70, { color: col.muted, size: 10.5, align: 'center' }); return; }
    ranges.forEach(([a, b], i) => {
      const y = top + rowH * (i + 0.5) + (step === 1 ? 0 : 0), sc = step === 4 ? 0.62 : 1;
      if (step === 1 || step === 2) {
        const gapx = step === 1 ? 0 : 0; pill(x0 + a * L, x0 + b * L, y); if (i === 0) eyes(x0 + 4, y, 1);
        if (step === 2) { const ex = [[x0 + a * L, i > 0], [x0 + b * L, i < 2]]; ex.forEach(([ex_, on], k) => { if (on) for (let j = 0; j < 4; j++) dot(ctx, ex_ + (k ? -5 : 5) + Math.sin(t * 5 + j) * 2, y - 9 + j * 6, 2.2 + Math.sin(t * 4 + j) , col.s[2]); }); }
      } else {
        const xa = x0 + L * (a + (0 - a) * g) * sc, xb = x0 + L * (b + (1 - b) * g) * sc + (step === 4 ? 0 : 0);
        const fullA = x0 + L * 0, fullB = x0 + L; const A = step === 4 ? x0 + 20 : x0 + a * L * (1 - g), B = step === 4 ? x0 + 20 + L * 0.62 : x0 + L * (b + (1 - b) * g);
        pill(A, B, y); eyes(A + 4, y, 1, i === 0 ? 1 : g);
        if (step === 3 && g < 1) { dot(ctx, A + 4, y, 3, col.s[2]); }
      }
      text(ctx, ['piece 1', 'piece 2', 'piece 3'][i], w - 8, y - 22, { color: col.muted, size: 9.5, align: 'right' });
    });
    if (step === 1) { [0.35, 0.67].forEach((f) => line(ctx, [[x0 + f * L, top - 4], [x0 + f * L, top + rowH * 3]], col.bad || col.ink, 1.5, [4, 3])); text(ctx, 'cut here', x0 + 0.35 * L, top - 8, { color: col.ink, size: 10, align: 'center' }); }
    const note = ['', 'Three pieces, each with a cut surface.', 'Unspecialised cells (dots) gather at the cuts and divide fast.', 'They turn into the missing head, tail and gut: each piece rebuilds a whole body.', 'One worm has become three, each a clone of the first.'][step];
    text(ctx, note, w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
