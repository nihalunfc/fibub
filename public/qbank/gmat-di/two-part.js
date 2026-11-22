// Two-Part Analysis: two linked answers that must both be right (shown here as pairs to choose from).
import { int, choose, shuffle, D } from '../grad-quant/_q.js';
const E = ['gmat'];
function tickets(r) {
  const a = choose(r, [12, 14, 15, 16, 18, 20]), c = choose(r, [6, 7, 8, 9, 10].filter((x) => x < a)), A = int(r, 20, 60), C = int(r, 10, 50);
  const n = A + C, rev = a * A + c * C;
  return { q: `<p>A theatre sells adult tickets for ${D}${a} and child tickets for ${D}${c}. One evening it sold ${n} tickets for a total of ${D}${rev}.</p><p>Select the number of <b>adult</b> tickets and the number of <b>child</b> tickets sold that evening.</p>`,
    A, C, traps: [[C, A], [A + 1, C - 1], [A - 1, C + 1], [Math.round(rev / (a + c)), n - Math.round(rev / (a + c))], [A + 2, C - 2]], names: ['adult', 'child'],
    why: `Let x be adult tickets and y child tickets. x + y = ${n} and ${a}x + ${c}y = ${rev}. Multiply the first by ${c}: ${c}x + ${c}y = ${c * n}. Subtract: ${a - c}x = ${rev - c * n}, so x = ${A} and y = ${n} − ${A} = ${C}. Check: ${a} × ${A} + ${c} × ${C} = ${rev}.` };
}
function mixture(r) {
  const p1 = choose(r, [10, 20, 25]), p2 = choose(r, [40, 50, 60]), A = int(r, 2, 9) * 10, B = int(r, 2, 9) * 10, tot = A + B, salt = (p1 * A + p2 * B) / 100;
  return { q: `<p>A cook mixes a ${p1}% salt solution with a ${p2}% salt solution to make ${tot} grams of mixture containing ${salt} grams of salt.</p><p>Select the grams of the <b>${p1}%</b> solution and the grams of the <b>${p2}%</b> solution used.</p>`,
    A, B, traps: [[B, A], [A + 10, B - 10], [A - 10, B + 10], [tot / 2, tot / 2], [A + 20, B - 20]], names: [`${p1}%`, `${p2}%`],
    why: `Let x grams be the ${p1}% solution and y the ${p2}% solution. x + y = ${tot} and ${p1 / 100}x + ${p2 / 100}y = ${salt}. Replace y by ${tot} − x: ${p1 / 100}x + ${p2 / 100}(${tot} − x) = ${salt}, so ${(p2 - p1) / 100}x = ${(p2 * tot) / 100 - salt} and x = ${A}; y = ${B}. Check: ${p1 / 100} × ${A} + ${p2 / 100} × ${B} = ${salt}.` };
}
const gen = (id, sub, fs) => ({ id, type: 'mcq', level: 3, exams: E, format: 'two-part', sub,
      make(r) {
        const S = choose(r, fs)(r), right = [S.A ?? S.A, S.C ?? S.B];
        const pairs = [right, ...S.traps.filter((p) => p[0] > 0 && p[1] > 0)];
        const seen = new Set(), uniq = pairs.filter((p) => { const k = p.join(','); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 5);
        for (let k = 3; uniq.length < 5; k++) uniq.push([right[0] + k, right[1] - k]);
        const opts = shuffle(r, uniq), show = (p) => `${S.names[0]}: ${p[0]}; ${S.names[1]}: ${p[1]}`;
        return { q: S.q, options: opts.map(show), answer: opts.findIndex((p) => p[0] === right[0] && p[1] === right[1]), value: right[0],
          sol: `<p>${S.why}</p><p><b>Tip:</b> in Two-Part Analysis both parts must be right to score. Check your pair in both conditions before you move on.</p>`, hint: 'Write two equations: one for the count, one for the total.' };
      } });
export default {
  topic: 'two-part',
  gens: [gen('tp-g01', 'two-part analysis', [tickets, mixture]), gen('tp-g02', 'two-part: counts and totals', [tickets]), gen('tp-g03', 'two-part: mixtures', [mixture])],
};
