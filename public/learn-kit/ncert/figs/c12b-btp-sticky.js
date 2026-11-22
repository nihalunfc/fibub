// Class 12 Biology, Biotechnology: Principles and Processes (step player): how the restriction enzyme EcoRI cuts DNA.
// EcoRI recognises the palindrome GAATTC (the same 5'->3' on both strands) and cuts each strand between G and A. The two cuts are four bases
// apart, so each piece keeps a single-stranded overhang AATT: a sticky end. Any other DNA cut with EcoRI has the same overhangs, so the pieces
// pair by hydrogen bonds and DNA ligase then seals the sugar-phosphate backbone.
import { canvas, text, title, line } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A DNA double helix drawn as two rows of letters, cut by EcoRI at GAATTC to leave sticky ends, then joined to another piece' });
  const TITLES = ['1. Find the palindrome', '2. Cut the top strand', '3. Cut the bottom strand', '4. Sticky ends exposed', '5. Pair with a second piece', '6. Ligase seals the joints'];
  // positions p: top strand letters and bottom strand letters of the vector (left piece, then right piece)
  const T1 = { '-2': 'C', '-1': 'T', 0: 'G' }, B1 = { '-2': 'G', '-1': 'A', 0: 'C', 1: 'T', 2: 'T', 3: 'A', 4: 'A' };
  const T2 = { 11: 'A', 12: 'A', 13: 'T', 14: 'T', 15: 'C', 16: 'A', 17: 'G' }, B2 = { 15: 'G', 16: 'T', 17: 'C' };
  const T3 = { 1: 'A', 2: 'A', 3: 'T', 4: 'T', 5: 'C', 6: 'A', 7: 'T', 8: 'G', 9: 'C', 10: 'G' }, B3 = { 5: 'G', 6: 'T', 7: 'A', 8: 'C', 9: 'G', 10: 'C', 11: 'T', 12: 'T', 13: 'A', 14: 'A' };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 4;
    const show = st >= 4, P0 = show ? -2 : 1, n = show ? 20 : 10, cw = Math.min(21, (w - 48) / n), x0 = (w - n * cw) / 2, cy = top + 60, by = cy + 26;
    const X = (p, dx = 0) => x0 + (p - P0 + 0.5) * cw + dx, f = Math.min(13, cw * 0.62);
    const L = (s, x, y, c, wt = 700) => text(ctx, s, x, y, { color: c, size: f, weight: wt, align: 'center' });
    const gap = st === 3 ? 14 : st === 4 ? 9 : 0;
    const drawStr = (D, y, c, dx, hi) => Object.keys(D).forEach((k) => { const p = +k, g = hi && p >= 3 && p <= 8 && st < 3; L(D[k], X(p, dx), y, g ? col.s[2] : c, g ? 800 : 700); });
    if (!show) {
      const S = { 1: 'C', 2: 'T', 3: 'G', 4: 'A', 5: 'A', 6: 'T', 7: 'T', 8: 'C', 9: 'A', 10: 'G' }, Bt = { 1: 'G', 2: 'A', 3: 'C', 4: 'T', 5: 'T', 6: 'A', 7: 'A', 8: 'G', 9: 'T', 10: 'C' };
      const dxL = st >= 3 ? -gap : 0, dxR = st >= 3 ? gap : 0, mv = (p, strand) => { const cutT = st >= 1, cutB = st >= 2; const leftT = p <= 3, leftB = p <= 7; if (strand === 'T') return cutT ? (leftT ? dxL : dxR) : 0; return cutB ? (leftB ? dxL : dxR) : 0; };
      for (let p = 1; p <= 10; p++) {
        const g = p >= 3 && p <= 8 && st < 3, hl = p >= 4 && p <= 7 && st >= 3;
        L(S[p], X(p, mv(p, 'T')), cy, g || (hl && p >= 4) ? col.s[2] : col.ink, g ? 800 : 700); L(Bt[p], X(p, mv(p, 'B')), by, g || hl ? col.s[2] : col.ink, g ? 800 : 700);
        if (st < 3 || !(p >= 4 && p <= 7)) line(ctx, [[X(p, (mv(p, 'T') + mv(p, 'B')) / 2), cy + 8], [X(p, (mv(p, 'T') + mv(p, 'B')) / 2), by - 8]], col.line, 1.5);
      }
      text(ctx, "5'", x0 - 2, cy, { color: col.muted, size: 10, align: 'right' }); text(ctx, "3'", x0 + n * cw + 2, cy, { color: col.muted, size: 10 });
      text(ctx, "3'", x0 - 2, by, { color: col.muted, size: 10, align: 'right' }); text(ctx, "5'", x0 + n * cw + 2, by, { color: col.muted, size: 10 });
      if (st === 0) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(X(3) - cw / 2, cy - 12, 6 * cw, by - cy + 24); text(ctx, 'GAATTC', X(5.5), by + 26, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, 'read 5′→3′ on the top: GAATTC; on the bottom: GAATTC', w / 2, by + 46, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'A palindrome: the same word both ways.', w / 2, by + 62, { color: col.muted, size: 11, align: 'center' }); }
      if (st >= 1 && st < 3) { const xc = X(3.5) + (st >= 3 ? 0 : 0); ctx.strokeStyle = col.bad; ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(3.5, 0), cy - 16); ctx.lineTo(X(3.5, 0), cy + 12); ctx.stroke(); if (st >= 2) { ctx.beginPath(); ctx.moveTo(X(7.5, 0), by - 12); ctx.lineTo(X(7.5, 0), by + 16); ctx.stroke(); } ctx.setLineDash([]); }
      if (st === 1) text(ctx, 'EcoRI cuts between G and A', w / 2, by + 36, { color: col.bad, size: 12, weight: 700, align: 'center' });
      if (st === 2) { text(ctx, 'Second cut: on the other strand,', w / 2, by + 36, { color: col.bad, size: 12, weight: 700, align: 'center' }); text(ctx, 'also between G and A, four bases away.', w / 2, by + 52, { color: col.bad, size: 12, weight: 700, align: 'center' }); }
      if (st === 3) { text(ctx, "5′ overhang AATT", X(4.5, dxL) , by + 30, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, "5′ overhang AATT", X(6.5, dxR), cy - 24, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'Sticky ends: single-stranded, ready to pair.', w / 2, by + 56, { color: col.muted, size: 11, align: 'center' }); }
    } else {
      const sp = st === 4 ? 9 : 0;
      drawStr(T1, cy, col.ink, -sp); drawStr(B1, by, col.ink, -sp); drawStr(T2, cy, col.ink, sp); drawStr(B2, by, col.ink, sp); drawStr(T3, cy, col.s[0], 0); drawStr(B3, by, col.s[0], 0);
      for (let p = 5; p <= 10; p++) line(ctx, [[X(p), cy + 8], [X(p), by - 8]], col.line, 1.5);
      for (let p = 1; p <= 4; p++) { const y1 = cy + 8, y2 = by - 8; ctx.setLineDash([2, 2]); line(ctx, [[X(p), y1], [X(p), y2]], st === 4 ? col.s[2] : col.line, 1.5); ctx.setLineDash([]); }
      for (let p = 11; p <= 14; p++) { ctx.setLineDash([2, 2]); line(ctx, [[X(p), cy + 8], [X(p), by - 8]], st === 4 ? col.s[2] : col.line, 1.5); ctx.setLineDash([]); }
      if (st === 4) { text(ctx, 'Each AATT overhang pairs with the matching', w / 2, by + 34, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'overhang of the other piece (dotted = hydrogen bonds).', w / 2, by + 50, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'Blue letters: a gene cut out with the same enzyme.', w / 2, by + 70, { color: col.s[0], size: 11, align: 'center' }); }
      if (st === 5) { for (const [p, y] of [[0.5, cy], [10.5, cy], [4.5, by], [14.5, by]]) { void p; void y; } const nicks = [[X(0.5), cy], [X(10.5), cy], [X(4.5), by], [X(14.5), by]]; nicks.forEach(([x, y]) => { ctx.fillStyle = col.good; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }); text(ctx, 'Four green dots: new bonds in the backbone,', w / 2, by + 34, { color: col.good, size: 11, weight: 700, align: 'center' }); text(ctx, 'made by DNA ligase. One recombinant DNA molecule.', w / 2, by + 50, { color: col.good, size: 11, weight: 700, align: 'center' }); }
    }
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 5); cv.redraw(); } };
}
