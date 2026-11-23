// Class 8 Number Play: a 3 x 3 magic square puzzle. Tap one cell and then another to swap them. Every row, column and both
// diagonals must add to 15, the magic constant: (1+2+...+9)/3 = 45/3 = 15. The centre has to be 5.
import { canvas, text, title, row, button, readout } from '../../kit.js';

export default function (host) {
  const starts = [[8, 1, 6, 3, 5, 7, 4, 9, 2], [2, 9, 4, 7, 5, 3, 6, 1, 8].reverse(), [4, 3, 8, 9, 1, 2, 5, 7, 6], [6, 7, 2, 1, 5, 9, 8, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8, 9]];
  let g = [2, 4, 6, 8, 1, 3, 5, 7, 9], sel = -1, pick = 0, geo = { x0: 0, y0: 0, s: 40 };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A three by three grid of the numbers 1 to 9. Tap two cells to swap them until all rows, columns and diagonals add to 15.' });
  const ctl = row(host);
  button(ctl, 'New puzzle', () => { g = starts[pick++ % starts.length].slice(); if (isMagic()) { [g[0], g[8]] = [g[8], g[0]]; [g[1], g[2]] = [g[2], g[1]]; } sel = -1; upd(); });
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const sum = (l) => l.reduce((a, i) => a + g[i], 0), isMagic = () => lines.every((l) => sum(l) === 15);
  const out = readout(host);
  cv.c.addEventListener('pointerdown', (e) => {
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left - geo.x0, y = e.clientY - b.top - geo.y0, c = Math.floor(x / geo.s), r = Math.floor(y / geo.s);
    if (c < 0 || c > 2 || r < 0 || r > 2) return;
    const i = r * 3 + c;
    if (sel < 0) sel = i; else { if (sel !== i) [g[sel], g[i]] = [g[i], g[sel]]; sel = -1; }
    upd();
  });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Make every line add to 15', col), s = Math.min((w - 110) / 3, (h - t - 70) / 3);
    geo = { x0: (w - 3 * s) / 2 - 12, y0: t + 30, s }; const { x0, y0 } = geo;
    g.forEach((v, i) => {
      const x = x0 + (i % 3) * s, y = y0 + Math.floor(i / 3) * s;
      ctx.save(); ctx.globalAlpha = i === sel ? 0.6 : 0.2; ctx.fillStyle = i === sel ? col.s[2] : col.s[0]; ctx.fillRect(x + 2, y + 2, s - 4, s - 4); ctx.restore();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x + 2, y + 2, s - 4, s - 4);
      text(ctx, String(v), x + s / 2, y + s / 2, { color: col.ink, size: s * 0.45, weight: 700, align: 'center' });
    });
    const tag = (s2, x, y, ok) => text(ctx, String(s2), x, y, { color: ok ? col.s[2] : col.s[3], size: 13, weight: 700, align: 'center' });
    for (let r = 0; r < 3; r++) { const v = sum(lines[r]); tag(v, x0 + 3 * s + 22, y0 + r * s + s / 2, v === 15); }
    for (let c = 0; c < 3; c++) { const v = sum(lines[3 + c]); tag(v, x0 + c * s + s / 2, y0 + 3 * s + 14, v === 15); }
    tag(sum(lines[6]), x0 + 3 * s + 22, y0 + 3 * s + 14, sum(lines[6]) === 15); tag(sum(lines[7]), x0 - 18, y0 + 3 * s + 14, sum(lines[7]) === 15);
    text(ctx, isMagic() ? 'Magic square!' : 'Green sums are right, red are not', w / 2, h - 12, { color: isMagic() ? col.s[2] : col.muted, size: 13, weight: 700, align: 'center' });
  };
  function upd() { out.textContent = isMagic() ? 'Solved. The magic constant is 15 because 1 + 2 + ... + 9 = 45 and three rows share it: 45 ÷ 3 = 15.' : 'Hint: the number in the centre takes part in four lines, so it must be 5. Corners are even numbers.'; cv.redraw(); }
  upd();
}
