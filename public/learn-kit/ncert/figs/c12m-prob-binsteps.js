// Class 12 Maths, Probability (step player): where the binomial formula comes from. A cricketer hits the stumps with probability p = 0.4 on each of 3 throws (independent).
// Each ordered sequence of hits (S) and misses (F) has probability p^k q^(3-k); the number of sequences with k hits is C(3, k); so P(X = k) = C(3, k) p^k q^(3-k).
import { canvas, text, title } from '../../kit.js';
import { wrap } from '../c12m-view3d.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'The eight outcomes of three throws grouped by the number of hits to derive the binomial formula' });
  const SEQ = []; for (let i = 0; i < 8; i++) { const s = [(i >> 2) & 1, (i >> 1) & 1, i & 1]; SEQ.push(s); }
  const TT = ['Three independent throws, p = 0.4', 'Each sequence has its own probability', 'Group them by the number of hits k', 'Count the sequences in each group', 'The formula: P(X = k) = C(n, k) pᵏ qⁿ⁻ᵏ'];
  const Pk = [0.216, 0.432, 0.288, 0.064];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[st], col) + 8, rh = 22;
    const order = st >= 2 ? [0, 1, 2, 4, 3, 5, 6, 7] : [0, 1, 2, 3, 4, 5, 6, 7];
    const kk = (s) => s[0] + s[1] + s[2];
    const ord = st >= 2 ? [...Array(8).keys()].sort((a, b) => kk(SEQ[a]) - kk(SEQ[b]) || a - b) : order.map((_, i) => i);
    ord.forEach((idx, r) => {
      const s = SEQ[idx], y = top + 10 + r * rh, k = kk(s);
      s.forEach((v, j) => text(ctx, v ? 'S' : 'F', 24 + j * 22, y, { color: v ? col.good : col.bad, size: 14, weight: 700, align: 'center' }));
      if (st >= 1) text(ctx, `${s.map((v) => (v ? '0.4' : '0.6')).join(' × ')} = ${(0.4 ** k * 0.6 ** (3 - k)).toFixed(3)}`, 96, y, { color: col.ink, size: 12 });
      if (st >= 2) { ctx.fillStyle = col.s[k]; ctx.globalAlpha = 0.9; ctx.fillRect(8, y - 9, 4, 18); ctx.globalAlpha = 1; text(ctx, `k = ${k}`, w - 14, y, { color: col.s[k], size: 11.5, weight: 700, align: 'right' }); }
    });
    const y = top + 10 + 8 * rh + 8;
    const msg = ['S = hit, F = miss: 2³ = 8 equally structured sequences.', 'Throws are independent, so multiply. Each S contributes 0.4 and each F contributes 0.6.', 'Sequences with the same k have the same probability 0.4ᵏ 0.6³⁻ᵏ.', 'k = 0: 1 sequence, k = 1: 3, k = 2: 3, k = 3: 1. That count is C(3, k) = 1, 3, 3, 1.', 'P(X = 0, 1, 2, 3) = 0.216, 0.432, 0.288, 0.064 (add to 1). In general C(n, k) × pᵏ × qⁿ⁻ᵏ.'][st];
    wrap(ctx, msg, 12, y, w - 24, col.ink, 12.5, 17);
    void Pk;
  };
  cv.redraw();
  return { step(i) { st = Math.min(4, i); cv.redraw(); } };
}
