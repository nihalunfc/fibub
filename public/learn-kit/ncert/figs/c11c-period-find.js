// Class 11 Chemistry, Classification of Elements (step player): from electron configuration to period, block and group, for bromine (Z = 35).
// Period = highest principal quantum number; block = type of the last subshell filled; group for p-block = 10 + electrons in the outer shell (s + p).
import { canvas, text, title } from '../../kit.js';

const pos = (Z) => (Z === 1 ? [1, 1] : Z === 2 ? [1, 18] : Z <= 4 ? [2, Z - 2] : Z <= 10 ? [2, Z + 8] : Z <= 12 ? [3, Z - 10] : Z <= 18 ? [3, Z] : Z <= 36 ? [4, Z - 18] : [5, Z - 36]);
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'A periodic table highlighting the period, block and group of bromine found from its configuration' });
  const HEAD = ['Write the configuration of Br (Z = 35)', 'Period = highest n', 'Block = last subshell filled', 'Group = 10 + outer electrons', 'Answer: period 4, group 17, p-block'];
  const TXT = ['1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁵', 'highest n is 4, so period 4', 'last electron enters 4p, so p-block', 'outer shell 4s² 4p⁵ has 7 electrons; 10 + 7 = 17', 'Br: halogen, group 17, period 4, p-block, non-metal'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, HEAD[st], col) + 14, cw = (w - 8) / 18, ch = Math.min(cw * 1.2, (h - t0 - 70) / 5);
    text(ctx, TXT[st], w / 2, t0 + 4, { color: col.s[2], size: w < 340 ? 11.5 : 13, weight: 700, align: 'center' });
    for (let z = 1; z <= 54; z++) {
      const [r, c] = pos(z), X = 4 + (c - 1) * cw, Y = t0 + 22 + (r - 1) * ch, isP = c >= 13 || z === 2, onRow = st >= 1 && r === 4, onCol = st >= 3 && c === 17, onBlk = st === 2 && isP && r >= 1;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = z === 35 && st === 4 ? 1 : (onRow || onCol || onBlk) ? 0.5 : 0.08; ctx.fillRect(X + 0.5, Y + 0.5, cw - 1, ch - 1); ctx.globalAlpha = 1;
      if (z === 35) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(X + 1, Y + 1, cw - 2, ch - 2); text(ctx, 'Br', X + cw / 2, Y + ch / 2, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false }); }
    }
    text(ctx, 'groups 1 → 18', 6, t0 + 22 + 5 * ch + 14, { color: col.muted, size: 10.5 }); text(ctx, 'periods 1 → 5 down', w - 6, t0 + 22 + 5 * ch + 14, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
