// Class 11 Chemistry, Structure of Atom (step player): why chromium is [Ar] 3d5 4s1 and not [Ar] 3d4 4s2.
// Half-filled d (five singly occupied orbitals with parallel spins) gives extra exchange stabilisation, and 3d and 4s are very close in energy.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.64, max: 440, min: 300, label: 'Orbital boxes for 4s and 3d filling for chromium, with the half-filled exception' });
  const HEAD = ['Core first: 18 electrons fill 1s to 3p', 'Rule says: 4s fills before 3d (2 electrons)', 'Next electrons go into 3d (up to 4 so far)', 'The exception: one 4s electron jumps to 3d'];
  const s4 = [2, 2, 2, 1], d3 = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 1, 1, 1, 0], [1, 1, 1, 1, 1]];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, HEAD[st], col) + 14, bw = Math.min(40, (w - 40) / 7), y1 = t0 + 70, y2 = t0 + 140, x0 = (w - (6 * bw + 24)) / 2;
    const box = (x, y, n, c) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, bw); ctx.fillStyle = col.ink; ctx.font = `700 ${bw * 0.5}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n === 2 ? '↑↓' : n === 1 ? '↑' : '', x + bw / 2, y + bw / 2 + 1); };
    if (st === 0) { text(ctx, '[Ar] = 1s² 2s² 2p⁶ 3s² 3p⁶', w / 2, t0 + 20, { color: col.s[2], size: 15, weight: 700, align: 'center' }); text(ctx, 'Chromium has Z = 24, so 6 electrons are still to place.', w / 2, t0 + 50, { color: col.muted, size: 12, align: 'center' }); }
    else { text(ctx, '[Ar]', 10, t0 + 20, { color: col.s[2], size: 14, weight: 700 }); }
    text(ctx, '4s', x0 - 6, y1 + bw / 2, { color: col.s[0], size: 13, weight: 700, align: 'right' }); box(x0, y1, st === 0 ? 0 : s4[st], col.s[0]);
    text(ctx, '3d', x0 - 6, y2 + bw / 2, { color: col.s[1], size: 13, weight: 700, align: 'right' }); for (let i = 0; i < 5; i++) box(x0 + i * (bw + 6), y2, st === 0 ? 0 : d3[st][i], col.s[1]);
    text(ctx, st === 3 ? '[Ar] 3d⁵ 4s¹: six unpaired electrons, six parallel spins' : st === 2 ? 'so far: [Ar] 4s² 3d⁴' : st === 1 ? 'so far: [Ar] 4s²' : '', w / 2, y2 + bw + 26, { color: st === 3 ? col.s[2] : col.muted, size: 12.5, weight: 700, align: 'center' });
    if (st === 3) text(ctx, 'half-filled d is extra stable (copper does the same with 3d¹⁰ 4s¹)', w / 2, y2 + bw + 46, { color: col.muted, size: 11, align: 'center' });
  };
  return { step(i) { st = Math.min(i, 3); cv.redraw(); } };
}
