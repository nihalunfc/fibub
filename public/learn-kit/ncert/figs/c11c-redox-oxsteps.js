// Class 11 Chemistry, Redox Reactions (step player): the oxidation number method for Cu + NO3- -> Cu2+ + NO in acid (dilute nitric acid on copper).
// Find the numbers that change, equalise total increase and decrease, balance charge with H+, then H with H2O, and check oxygen.
import { canvas, text, title } from '../../kit.js';

const S = [
  ['1. Skeleton equation with oxidation numbers', [['Cu + NO₃⁻ → Cu²⁺ + NO', 0], ['Cu: 0 → +2    N: +5 → +2', 2]]],
  ['2. Find the increase and the decrease', [['Cu: 0 → +2: increase of 2 (oxidised)', 3], ['N: +5 → +2: decrease of 3 (reduced)', 2]]],
  ['3. Make increase = decrease (least common multiple 6)', [['3 Cu atoms: increase 3 × 2 = 6', 3], ['2 N atoms: decrease 2 × 3 = 6', 2], ['3Cu + 2NO₃⁻ → 3Cu²⁺ + 2NO', 0]]],
  ['4. Balance the charge using H⁺ (acid solution)', [['left: 2 × (−1) = −2;  right: 3 × (+2) = +6', 4], ['add 8H⁺ on the left: −2 + 8 = +6', 2], ['3Cu + 2NO₃⁻ + 8H⁺ → 3Cu²⁺ + 2NO', 0]]],
  ['5. Balance hydrogen using H₂O', [['8 H on the left, none on the right', 4], ['add 4H₂O on the right', 2], ['3Cu + 2NO₃⁻ + 8H⁺ → 3Cu²⁺ + 2NO + 4H₂O', 5]]],
  ['6. Check oxygen and charge', [['O: left 2 × 3 = 6;  right 2 + 4 = 6 ✓', 5], ['charge: +6 = +6 ✓', 5]]],
];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'Balancing copper with nitrate in acid by the oxidation number method' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[st][0], col) + 18, c = [col.ink, col.ink, col.s[0], col.s[3], col.muted, col.s[2]];
    let y = top + 10;
    S[st][1].forEach(([s, k]) => { text(ctx, s, 14, y, { color: c[k], size: 12.5, weight: k === 4 ? 400 : 700 }); y += 36; });
    if (st === 5) { ctx.fillStyle = col.soft; ctx.fillRect(10, y, w - 20, 40); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(10, y, w - 20, 40); text(ctx, '3Cu + 2NO₃⁻ + 8H⁺ → 3Cu²⁺ + 2NO + 4H₂O', w / 2, y + 20, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    text(ctx, `step ${st + 1} of ${S.length}`, w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, S.length - 1); cv.redraw(); } };
}
