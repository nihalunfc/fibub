// Class 11 Chemistry, Structure of Atom (step player): writing the electron configuration of iron (Z = 26) and then Fe2+.
// Fill in the (n + l) order: 1s 2s 2p 3s 3p 4s 3d. A cation loses its outermost (4s) electrons before 3d ones.
import { canvas, text, title } from '../../kit.js';

const SUB = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 6]];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Subshells filled one by one for iron and then its 2+ ion' });
  const HEAD = ['Count the electrons: Z = 26', 'Fill 1s, 2s, 2p (10 electrons)', 'Fill 3s, 3p, 4s (10 more)', 'The last 6 electrons go to 3d', 'Fe²⁺: remove the outermost electrons'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, HEAD[st], col) + 12, upto = [0, 3, 6, 7, 7][st], bw = (w - 30) / 7;
    let tot = 0; SUB.forEach(([s, cap], i) => {
      const x = 10 + i * bw, y = t0 + 30, filled = i < upto, k = filled ? cap : 0, lost = st === 4 && s === '4s' ? 2 : 0;
      ctx.strokeStyle = filled ? col.s[i % 4] : col.line; ctx.lineWidth = 2; ctx.fillStyle = col.soft; ctx.fillRect(x, y, bw - 4, 46); ctx.strokeRect(x, y, bw - 4, 46);
      text(ctx, s, x + (bw - 4) / 2, y + 14, { color: filled ? col.ink : col.muted, size: 12, weight: 700, align: 'center' }); text(ctx, filled ? String(k - lost) : '', x + (bw - 4) / 2, y + 33, { color: lost ? col.s[3] : col.ink, size: 15, weight: 700, align: 'center' });
      if (filled) tot += k - lost;
    });
    text(ctx, `electrons placed: ${tot} of ${st === 4 ? 24 : 26}`, w / 2, t0 + 106, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, st === 4 ? 'Fe²⁺ = [Ar] 3d⁶ (the 4s electrons leave first)' : st === 3 ? 'Fe = [Ar] 3d⁶ 4s²' : st === 2 ? 'so far [Ar] 4s²' : st === 1 ? 'so far 1s² 2s² 2p⁶' : '', w / 2, t0 + 134, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    if (st >= 3) { const y = t0 + 160; text(ctx, '3d boxes:', 10, y + 14, { color: col.muted, size: 11 }); for (let i = 0; i < 5; i++) { ctx.strokeStyle = col.s[1]; ctx.strokeRect(80 + i * 34, y, 28, 28); ctx.fillStyle = col.ink; ctx.font = '700 14px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i === 0 ? '↑↓' : '↑', 94 + i * 34, y + 15); } text(ctx, '4 unpaired electrons', 80, y + 46, { color: col.s[1], size: 11.5, weight: 700 }); }
  };
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
