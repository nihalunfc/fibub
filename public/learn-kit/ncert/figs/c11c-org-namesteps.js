// Class 11 Chemistry, Organic Chemistry basics (step player): naming a compound by IUPAC rules, worked for CH3-CH(CH3)-CH2-CH(OH)-CH3 (4-methylpentan-2-ol).
// Steps: find the longest chain containing the principal group; number from the end giving the group the lowest number; name the branch; assemble substituent + parent + suffix.
import { canvas, text, title } from '../../kit.js';

const S = [
  ['1. Draw out the structure', ['CH₃–CH(CH₃)–CH₂–CH(OH)–CH₃', 'It has an –OH (alcohol) group and a methyl branch.'], 0],
  ['2. Find the longest chain that holds the –OH', ['Longest chain: 5 carbons → parent “pent”', 'Alkane parent: pentane; an alcohol ends in “-ol”'], 1],
  ['3. Number from the end nearest the –OH', ['From the right: –OH on C2, methyl on C4', 'From the left: –OH on C4: higher, so not used'], 2],
  ['4. Name the branch with its number', ['CH₃ on carbon 4 → “4-methyl”', 'Branches are listed before the parent name'], 3],
  ['5. Assemble: branch + parent + suffix with the group’s number', ['4-methyl + pentan-2-ol', 'IUPAC name: 4-methylpentan-2-ol'], 4],
];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Naming 4-methylpentan-2-ol step by step on a zigzag chain' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[st][0], col) + 14, n = 5, dx = (w - 90) / (n - 1), X = (i) => 45 + i * dx, y0 = top + 56, Y = (i) => (i % 2 ? y0 - 18 : y0 + 18);
    // zigzag with numbering from the right (index 4 = C1)
    const hl = st >= 1 ? col.s[3] : col.ink;
    ctx.strokeStyle = hl; ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i < n; i++) i ? ctx.lineTo(X(i), Y(i)) : ctx.moveTo(X(i), Y(i)); ctx.stroke();
    // OH on index 1 (carbon 2 counting from the right: index 3). Place OH on index 3, methyl on index 1.
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(3), Y(3)); ctx.lineTo(X(3), Y(3) - 26); ctx.stroke(); text(ctx, 'OH', X(3), Y(3) - 38, { color: col.s[0], size: 13, weight: 700, align: 'center' });
    ctx.strokeStyle = st >= 3 ? col.s[2] : col.ink; ctx.beginPath(); ctx.moveTo(X(1), Y(1)); ctx.lineTo(X(1), Y(1) - 26); ctx.stroke(); text(ctx, 'CH₃', X(1), Y(1) - 38, { color: st >= 3 ? col.s[2] : col.ink, size: 12, weight: 700, align: 'center' });
    if (st >= 2) for (let i = 0; i < n; i++) text(ctx, String(n - i), X(i), Y(i) + 18, { color: col.s[4], size: 11, weight: 700, align: 'center' });
    if (st >= 2) text(ctx, '← number from this end', w / 2, y0 + 56, { color: col.muted, size: 10.5, align: 'center' });
    S[st][1].forEach((l, i) => text(ctx, l, 14, y0 + 84 + i * 22, { color: i === 1 && st === 4 ? col.ink : col.ink, size: 12, weight: i === 1 ? 700 : 400 }));
    text(ctx, `step ${st + 1} of ${S.length}`, w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, S.length - 1); cv.redraw(); } };
}
